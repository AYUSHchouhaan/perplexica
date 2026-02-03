"use client";
import React, { useState } from "react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ChatArea from "@/components/ChatArea";
import { models, type Model } from "@/lib/models";
import { useTheme } from "next-themes";

export default function Page() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [firstPrompt, setFirstPrompt] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  
  const [activeModel, setActiveModel] = useState<Model>(() => models.find(m => m.active) || models[0]);
  
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  const handleSend = async (messageContent: string) => {
    if (!messageContent.trim() || isLoading) return;

    if (!session?.user?.id) {
      router.push('/auth');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelId: activeModel.id }),
      });

      const { chat } = await res.json();
      if (!chat || !chat.id) throw new Error('Failed to create chat.');

      router.push(`/chat/${chat.id}?prompt=${encodeURIComponent(messageContent)}`);
    } catch (error) {
      console.error('Error creating chat:', error);
      setIsLoading(false);
    }
  };

  return (
    <ChatArea 
      onToggleTheme={toggleTheme} 
      theme={theme || 'dark'} 
      sidebarState="collapsed" 
      firstPrompt={firstPrompt} 
      setFirstPrompt={setFirstPrompt}
      isLoading={isLoading}
      onSendMessage={handleSend}
      isHome={true}
      activeModel={activeModel}
      onModelSelect={setActiveModel}
    />
  );
}