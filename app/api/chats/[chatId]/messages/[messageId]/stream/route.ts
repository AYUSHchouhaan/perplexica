import { chatQueries, messageQueries, userQueries } from '@/db/queries';
import { headers } from 'next/headers';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';
import { Message } from '@/db/schema';
import { simpleWebSearch } from '@/lib/WebSearch';

// export const runtime = 'nodejs';

interface GoogleStreamChunk {
  text(): string;
}

interface GroqStreamChunk {
  choices: Array<{ delta: { content?: string } }>;
}

interface OpenRouterStreamChunk {
  choices: Array<{ delta: { content?: string } }>;
}

interface GoogleHistoryItem {
  role: 'model' | 'user';
  parts: Array<{ text: string }>;
}

interface GroqHistoryItem {
  role: 'assistant' | 'user';
  content: string;
}

interface OpenRouterHistoryItem {
  role: 'assistant' | 'user';
  content: string;
}

type ChatHistoryItem = GoogleHistoryItem | GroqHistoryItem | OpenRouterHistoryItem;

const modelMapping: Record<string, { provider: 'google' | 'groq' | 'openrouter'; name: string }> = {
  'gemini-2-5-flash': { provider: 'openrouter', name: 'google/gemini-flash-1.5:free' },
  'llama-3-3-70b': { provider: 'groq', name: 'llama-3.3-70b-versatile' },
  'llama-4-maverick': { provider: 'groq', name: 'meta-llama/llama-4-maverick-17b-128e-instruct' },
  'qwen-qwq-32b': { provider: 'groq', name: 'qwen-qwq-32b' },
  'deepseek-r1-llama-distilled': { provider: 'groq', name: 'deepseek-r1-distill-llama-70b' },
  'gpt-oss': { provider: 'groq', name: 'openai/gpt-oss-120b' },
  'gpt-4o': { provider: 'openrouter', name: 'openai/gpt-4o' },
  'claude-3.5-sonnet': { provider: 'openrouter', name: 'anthropic/claude-3.5-sonnet' },
  'deepseek-chat': { provider: 'openrouter', name: 'deepseek/deepseek-chat' },
  'gemini-2-flash-thinking': { provider: 'openrouter', name: 'google/gemini-2.0-flash-thinking-exp:free' },
};
const defaultModel = modelMapping['gemini-2-5-flash'];

const SYSTEM_PROMPT = `You are a knowledgeable AI assistant that delivers clear, well-structured responses using Markdown formatting.

**Core Principles**
- Write in a warm, professional, and conversational tone
- Structure your responses with visual clarity and logical flow
- Use Markdown elements purposefully to enhance readability
- Be concise and efficient—avoid unnecessary repetition

**Formatting Guidelines**
- Use **bold** for key terms and _italics_ for emphasis
- Add section headers (##, ###) to organize complex topics
- Include bullet points or numbered lists for step-by-step content
- Use code blocks with language tags for code examples: \`\`\`js
- Add blockquotes (>) for important takeaways or quotes
- Include tables for comparisons, data, or structured information
- Use horizontal dividers (---) to separate major sections
- Add relevant emojis sparingly for visual markers (e.g., 💡 Key Point, 🔍 Details, ⚠️ Important)

**Response Structure**
- For complex topics: start with a brief overview, explain details, then summarize
- For long answers: include a **Summary** or **TL;DR** at the end
- Break dense information into digestible sections
- Present information in a logical sequence

**Communication Style**
- Act as a helpful, confident guide
- Explain concepts clearly without being condescending
- Balance thoroughness with brevity
- Adapt your level of detail to the question's complexity
`;

async function getChatHistory(chatId: string, provider: 'google'): Promise<GoogleHistoryItem[]>;
async function getChatHistory(chatId: string, provider: 'groq'): Promise<GroqHistoryItem[]>;
async function getChatHistory(chatId: string, provider: 'openrouter'): Promise<OpenRouterHistoryItem[]>;

async function getChatHistory(
  chatId: string,
  provider: 'google' | 'groq' | 'openrouter'
): Promise<ChatHistoryItem[]> {
  try {
    const messages = await messageQueries.getMessagesByChat(chatId);
    
    if (!messages) {
      return [];
    }

    // Take the last 20 messages and filter out empty content
    const filtered = messages.slice(-20).filter((m: Message) => m.content);

    if (provider === 'google') {
      return filtered.map<GoogleHistoryItem>((msg: Message) => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));
    } else if (provider === 'openrouter') {
      return filtered.map<OpenRouterHistoryItem>((msg: Message) => ({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.content,
      }));
    } else {
      return filtered.map<GroqHistoryItem>((msg: Message) => ({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.content,
      }));
    }
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
}

async function handleRequest(req: Request) {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const chatId = pathParts[pathParts.indexOf('chats') + 1];
    const messageId = pathParts[pathParts.indexOf('messages') + 1];
    const body = await req.json(); 
    const headersList = await headers();
    const userId = headersList.get('x-user-id');

    console.log('🚀 [StreamRoute] Request received:', {
      chatId,
      messageId,
      webSearch: body.webSearch,
      modelId: body.modelId
    });

    if (!userId) {
      console.error('❌ [StreamRoute] Unauthorized: No user session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chat = await chatQueries.getChatById(chatId, userId);

    if (!chat) {
      console.error('❌ [StreamRoute] Chat not found or unauthorized:', chatId);
      return NextResponse.json({ error: 'Chat not found or unauthorized' }, { status: 404 });
    }
    
    // Handle web search if enabled
    let searchContext = '';
    
    if (body.webSearch) {
      console.log('🔍 [StreamRoute] Web search enabled, fetching last user message...');
      const allMessages = await messageQueries.getMessagesByChat(chatId);
      
      // Find the last user message (most recent one)
      const lastUserMessage = [...allMessages].reverse().find(m => m.role === 'user');
      
      if (lastUserMessage?.content) {
        console.log('🔍 [StreamRoute] Running web search for:', lastUserMessage.content);
        searchContext = await simpleWebSearch(lastUserMessage.content);
        console.log('✅ [StreamRoute] Web search completed, context length:', searchContext.length);
      } else {
        console.warn('⚠️ [StreamRoute] No user message found for web search');
      }
    } else {
      console.log('ℹ️ [StreamRoute] Web search not enabled for this message');
    }
    
    // Use modelId from request body if provided, otherwise fall back to chat's saved model
    const selectedModelId = body.modelId || chat.modelId || 'gemini-2-5-flash';
    const modelInfo = modelMapping[selectedModelId] || defaultModel;
    const { provider, name: apiModelName } = modelInfo;
    
    console.log('🤖 [StreamRoute] Using model:', { selectedModelId, provider, apiModelName });
    
    let apiStream;

    if (provider === 'google') {
      if (!process.env.GEMINI_API_KEY) return NextResponse.json({ error: 'Missing Gemini API Key' }, { status: 500 });
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      
      const systemPrompt = searchContext 
        ? `${SYSTEM_PROMPT}\n\nWeb Search Results:\n${searchContext}\n\nUse the above web search results to provide accurate, up-to-date information in your response.`
        : SYSTEM_PROMPT;
      
      console.log('🤖 [StreamRoute] Google - System prompt length:', systemPrompt.length, 'Has search:', !!searchContext);
      
      const model = genAI.getGenerativeModel({ 
        model: apiModelName,
        systemInstruction: systemPrompt
      });

      const history = await getChatHistory(chatId, 'google');
      const chatSession = model.startChat({ history });
      const result = await chatSession.sendMessageStream("");
      apiStream = result.stream;
    } 
    else if (provider === 'groq') {

      if (!process.env.GROQ_API_KEY) return NextResponse.json({ error: 'Missing Groq API Key' }, { status: 500 });
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const messages = await getChatHistory(chatId, 'groq');
      
      const systemPrompt = searchContext 
        ? `${SYSTEM_PROMPT}\n\nWeb Search Results:\n${searchContext}\n\nUse the above web search results to provide accurate, up-to-date information in your response.`
        : SYSTEM_PROMPT;
      
      console.log('🤖 [StreamRoute] Groq - System prompt length:', systemPrompt.length, 'Has search:', !!searchContext);
      
      // Add system prompt at the beginning for Groq
      const messagesWithSystem = [
        { role: 'system' as const, content: systemPrompt },
        ...messages
      ];
      
      apiStream = await groq.chat.completions.create({
          model: apiModelName,
          messages: messagesWithSystem,
          stream: true,
      });
    } 
    else if (provider === 'openrouter') {
      if (!process.env.OPENROUTER_API_KEY) return NextResponse.json({ error: 'Missing OpenRouter API Key' }, { status: 500 });
      
      const messages = await getChatHistory(chatId, 'openrouter');
      
      const systemPrompt = searchContext 
        ? `${SYSTEM_PROMPT}\n\nWeb Search Results:\n${searchContext}\n\nUse the above web search results to provide accurate, up-to-date information in your response.`
        : SYSTEM_PROMPT;
      
      console.log('🤖 [StreamRoute] OpenRouter - System prompt length:', systemPrompt.length, 'Has search:', !!searchContext);
      
      // Add system prompt at the beginning for OpenRouter
      const messagesWithSystem = [
        { role: 'system', content: systemPrompt },
        ...messages
      ];
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          'X-Title': 'Free3Chat',
        },
        body: JSON.stringify({
          model: apiModelName,
          messages: messagesWithSystem,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter API error:', errorText);
        return NextResponse.json({ error: 'OpenRouter API error' }, { status: response.status });
      }

      apiStream = response.body;
    } 
    else {
        console.error('❌ [StreamRoute] Unsupported provider:', provider);
        return NextResponse.json({ error: `Unsupported provider: ${provider}`}, { status: 500 });
    }

    console.log('📡 [StreamRoute] Starting stream response...');

    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = '';
        const encoder = new TextEncoder();
        try {
          console.log('🎬 [StreamRoute] Stream started');
          
          if (provider === 'google') {
            console.log('📨 [StreamRoute] Processing Google stream...');
            const googleStream = apiStream as AsyncIterable<GoogleStreamChunk>;
            for await (const chunk of googleStream) {
              const chunkText = chunk.text();
              if (chunkText) {
                fullResponse += chunkText;
                controller.enqueue(encoder.encode(chunkText));
              }
            }
            console.log('✅ [StreamRoute] Google stream complete, total length:', fullResponse.length);
          } else if (provider === 'openrouter') {
            console.log('📨 [StreamRoute] Processing OpenRouter stream...');
            const reader = (apiStream as ReadableStream).getReader();
            const decoder = new TextDecoder();
            let done = false;

            while (!done) {
              const { value, done: readerDone } = await reader.read();
              done = readerDone;
              
              if (value) {
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n').filter(line => line.trim() !== '');
                
                for (const line of lines) {
                  if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') continue;
                    
                    try {
                      const parsed = JSON.parse(data);
                      const content = parsed.choices?.[0]?.delta?.content;
                      if (content) {
                        fullResponse += content;
                        controller.enqueue(encoder.encode(content));
                      }
                    } catch (e) {
                      // Ignore JSON parse errors for incomplete chunks
                    }
                  }
                }
              }
            }
            console.log('✅ [StreamRoute] OpenRouter stream complete, total length:', fullResponse.length);
          } else {
            console.log('📨 [StreamRoute] Processing Groq stream...'); 
            const groqStream = apiStream as AsyncIterable<GroqStreamChunk>;
            for await (const chunk of groqStream) {
              const chunkText = chunk.choices[0]?.delta?.content ?? '';
              if (chunkText) {
                fullResponse += chunkText;
                controller.enqueue(encoder.encode(chunkText));
              }
            }
            console.log('✅ [StreamRoute] Groq stream complete, total length:', fullResponse.length);
          }
          
          if (fullResponse) {
            console.log('💾 [StreamRoute] Saving message to database...');
            await messageQueries.updateMessageContent(messageId, fullResponse);
            await chatQueries.touchChat(chatId);
            // Decrease message count after successful response
            await userQueries.decreaseMessageCount(userId);
            console.log('✅ [StreamRoute] Message saved successfully');
          }
        } catch (streamError) {
          console.error("❌ [StreamRoute] Error during stream processing:", streamError);
          controller.error(streamError);
        } finally {
          console.log('🏁 [StreamRoute] Stream closed');
          controller.close();
        }
      },
    });

    return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });    
  } catch (error) {
    console.error("❌ [StreamRoute] Fatal error in chat streaming API:", error);
    return NextResponse.json({ error: "An error occurred." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  return handleRequest(req);
}

export async function POST(req: Request) {
  return handleRequest(req);
}