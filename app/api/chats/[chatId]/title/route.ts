import { NextResponse } from 'next/server';
import { chatQueries, messageQueries } from '@/db/queries';
import { headers } from 'next/headers';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { eq, and } from 'drizzle-orm';
import { db } from '@/db/drizzleclient';
import { messages } from '@/db/schema';

export async function POST(req: Request) {
  return handlePostRequest(req);
}

async function handlePostRequest(req: Request) {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const chatId = pathParts[pathParts.indexOf('chats') + 1];
    
    if (!chatId) {
        return NextResponse.json({ error: 'Chat ID is missing' }, { status: 400 });
    }
    await req.json();

    const headersList = await headers();
    const userId = headersList.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chat = await chatQueries.getChatById(chatId, userId);
    
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found or unauthorized' }, { status: 404 });
    }
    
    const userMessages = await db
      .select({ content: messages.content })
      .from(messages)
      .where(
        and(
          eq(messages.chatId, chatId),
          eq(messages.role, 'user')
        )
      )
      .orderBy(messages.createdAt)
      .limit(1);
    
    if (!userMessages || userMessages.length === 0) {
      return NextResponse.json({ error: 'No user message found to generate title' }, { status: 400 });
    }
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Missing Gemini API Key" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Use the same model as in the streaming route
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const firstUserMessage = userMessages[0].content;
    const prompt = `Generate a very short, concise title (4 words max) for a conversation that starts with: "${firstUserMessage}". Do not use quotes or any other formatting in your response. Just return the plain text title.`;
    
    console.log('📝 [TitleRoute] Generating title for chat:', chatId);
    
    let title = "Untitled Chat";
    try {
      const result = await model.generateContent(prompt);
      const generatedTitle = result.response.text().trim().replace(/"/g, '');
      if (generatedTitle) {
        title = generatedTitle;
      }
      console.log('✅ [TitleRoute] Generated title:', title);
    } catch (titleError) {
      console.error('❌ [TitleRoute] Error generating title:', titleError);
      // Fallback to a simple title based on first few words
      title = firstUserMessage.split(' ').slice(0, 4).join(' ') || "Untitled Chat";
      console.log('⚠️ [TitleRoute] Using fallback title:', title);
    }
    
    const updatedChat = await chatQueries.updateChatTitle(chatId, title);
    
    if (!updatedChat) {
      return NextResponse.json({ error: 'Failed to update chat title' }, { status: 500 });
    }
    
    return NextResponse.json({ chat: updatedChat });
  } catch (error) {
    console.error('Error in POST /api/chats/[chatId]/title:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}