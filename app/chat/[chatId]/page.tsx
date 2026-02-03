"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useSession } from 'next-auth/react';
import ChatArea from "@/components/ChatArea";
import { models, type Model } from "@/lib/models";
import { Message, Chat } from "@/types";
import { useTheme } from "next-themes";
import { useChats } from "@/components/ChatsProvider";

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const chatId = params.chatId as string;
  const { data: session, status } = useSession();
  const { chats } = useChats();

  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeModel, setActiveModel] = useState<Model | null>(null);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  
  const loadedChatsRef = useRef<Set<string>>(new Set());
  const fetchingChatsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Redirect unauthenticated users
    if (status !== 'loading' && !session) {
      router.push('/auth');
      return;
    }

    // Wait for authentication and chats to load
    if (status === 'loading' || !session || !chatId || chats.length === 0) return;
    
    // Skip if we already loaded this chat
    if (loadedChatsRef.current.has(chatId)) {
      console.log('⏭️ [ChatPage] Already loaded chat:', chatId);
      return;
    }

    // Skip if fetch already in progress for this chat
    if (fetchingChatsRef.current.has(chatId)) {
      console.log('⏭️ [ChatPage] Fetch already in progress for:', chatId);
      return;
    }

    const fetchData = async () => {
      console.log('🔄 [ChatPage] Starting fetch for chatId:', chatId);
      fetchingChatsRef.current.add(chatId);
      
      try {
        setIsLoading(true);
        
        // Get chat details from context instead of fetching
        const currentChat = chats.find((c: Chat) => c.id === chatId);
        
        if (currentChat && currentChat.modelId) {
          const modelForChat = models.find(m => m.id === currentChat.modelId) || models.find(m => m.active)!;
          setActiveModel(modelForChat);
        } else {
          setActiveModel(models.find(m => m.active)!);
        }

        console.log('📨 [ChatPage] Fetching messages for:', chatId);
        const messagesRes = await fetch(`/api/chats/${chatId}/messages`);
        
        if (!messagesRes.ok) throw new Error('Failed to fetch messages');
        const { messages: fetchedMessages } = await messagesRes.json();
        
        setMessages(fetchedMessages);
        loadedChatsRef.current.add(chatId);
        console.log('✅ [ChatPage] Chat loaded successfully:', chatId);

        // Handle initial prompt if present
        const initialPrompt = searchParams.get('prompt');
        if (initialPrompt && fetchedMessages.length === 0) {
          router.replace(`/chat/${chatId}`, { scroll: false });
          await handleSendMessage(initialPrompt);
        }
      } catch (error) {
        console.error("Error fetching chat data:", error);
        router.push('/');
      } finally {
        setIsLoading(false);
        fetchingChatsRef.current.delete(chatId);
      }
    };

    fetchData();
  }, [chatId, session, status, chats.length]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    console.log('📨 [ChatPage] Sending message...', {
      content: content.substring(0, 50) + '...',
      webSearch: webSearchEnabled,
      modelId: activeModel?.id
    });

    setIsLoading(true);
  const tempUserMessageId = `temp-user-${Date.now()}`;
  const now = new Date();
  const userMessage: Message = { id: tempUserMessageId, chatId: chatId, role: 'user', content, createdAt: now, updatedAt: now };
  const aiPlaceholderMessage: Message = { id: `temp-ai-${Date.now()}`, chatId: chatId, role: 'model', content: '', createdAt: now, updatedAt: now };

    setMessages(prev => [...prev, userMessage, aiPlaceholderMessage]);

    try {
    console.log('📤 [ChatPage] Creating message in database...');
    const createRes = await fetch(`/api/chats/${chatId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
      });
      const { userMessage: dbUserMessage, aiMessage: dbAiMessage } = await createRes.json();
      console.log('✅ [ChatPage] Message created:', { userId: dbUserMessage.id, aiId: dbAiMessage.id });

      setMessages(prev => prev.map(m => m.id === tempUserMessageId ? dbUserMessage : m.id === aiPlaceholderMessage.id ? dbAiMessage : m));
      
      console.log('📡 [ChatPage] Starting stream request...', {
        aiMessageId: dbAiMessage.id,
        webSearch: webSearchEnabled,
        model: activeModel?.id
      });
      
      const streamRes = await fetch(`/api/chats/${chatId}/messages/${dbAiMessage.id}/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          modelId: activeModel?.id,
          webSearch: webSearchEnabled 
        }),
      });

      console.log('📡 [ChatPage] Stream response received, status:', streamRes.status);

      if (!streamRes.body) throw new Error("No response body");
      const reader = streamRes.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let chunkCount = 0;

      console.log('📥 [ChatPage] Starting to read stream chunks...');

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value, { stream: true });
        chunkCount++;
        
        if (chunkCount % 10 === 0) {
          console.log(`📥 [ChatPage] Received ${chunkCount} chunks so far...`);
        }
        
        setMessages(prev => prev.map(m => 
          m.id === dbAiMessage.id ? { ...m, content: m.content + chunk } : m
        ));
      }
      
      console.log('✅ [ChatPage] Stream complete!', { totalChunks: chunkCount });
      
      // Only generate title for the first message in a new chat
      // At this point, messages array has 2 items: user message + AI response
      if (messages.length === 2) { // First conversation (1 user + 1 AI message)
        console.log('📝 [ChatPage] Checking if this is a new chat...');
        const currentChat = (await (await fetch(`/api/chats?chatId=${chatId}`)).json()).chats[0];
        if (currentChat.title === 'New Chat') {
          console.log('📝 [ChatPage] First message in new chat - generating title...');
          fetch(`/api/chats/${chatId}/title`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
          }).then(() => {
            console.log('✅ [ChatPage] Chat title generated');
            window.dispatchEvent(new CustomEvent('chats-updated'));
          }).catch((err) => {
            console.error('❌ [ChatPage] Title generation failed:', err);
          });
        } else {
          console.log('ℹ️ [ChatPage] Chat already has title:', currentChat.title);
        }
      } else {
        console.log('ℹ️ [ChatPage] Existing chat - skipping title generation. Message count:', messages.length);
      }

    } catch (error) {
      console.error('❌ [ChatPage] Error sending message:', error);
      setMessages(prev => prev.filter(m => m.id !== tempUserMessageId && m.id !== aiPlaceholderMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = async (userMessageId: string) => {
    const userMessageIndex = messages.findIndex(m => m.id === userMessageId);
    if (userMessageIndex === -1) return;

    const content = messages[userMessageIndex].content;
    const conversationHistory = messages.slice(0, userMessageIndex + 1);
    setMessages(conversationHistory);

    await handleSendMessage(content);
  };
  
  const handleEdit = async (originalUserMessageId: string, newContent: string) => {
      const userMessageIndex = messages.findIndex(m => m.id === originalUserMessageId);
      if (userMessageIndex === -1) return;

      const conversationHistory = messages.slice(0, userMessageIndex);
      setMessages(conversationHistory);

      await handleSendMessage(newContent);
  };


  return (
    <ChatArea 
      onToggleTheme={toggleTheme} 
      theme={theme || 'dark'} 
      sidebarState="collapsed" 
      firstPrompt={messages.length === 0} 
      setFirstPrompt={() => {}}
      messages={messages}
      isLoading={isLoading}
      onSendMessage={handleSendMessage}
      onRetry={handleRetry}
      onEdit={handleEdit}
      isHome={false}
      activeModel={activeModel || undefined}
      onModelSelect={setActiveModel}
      webSearchEnabled={webSearchEnabled}
      setWebSearchEnabled={setWebSearchEnabled}
    />
  );
}