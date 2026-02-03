'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { Chat } from '@/types';

interface ChatsContextType {
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
  refreshChats: () => Promise<void>;
  isLoading: boolean;
}

const ChatsContext = createContext<ChatsContextType | undefined>(undefined);

export function ChatsProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshChats = useCallback(async () => {
    if (status === 'loading') return;
    
    console.log('[ChatsProvider] Refreshing chats. Session:', session?.user?.id, 'Status:', status);
    
    if (session?.user?.id) {
      try {
        const response = await fetch(`/api/chats`);
        const data = await response.json();
        console.log('[ChatsProvider] Fetched chats:', data);
        setChats(data.chats || []);
      } catch (error) {
        console.error('Error fetching user chats:', error);
        setChats([]);
      }
    } else {
      console.log('[ChatsProvider] No session, setting chats to empty');
      setChats([]);
    }
    setIsLoading(false);
  }, [status, session?.user?.id]);

  useEffect(() => {
    refreshChats();
    window.addEventListener('chats-updated', refreshChats);
    return () => {
      window.removeEventListener('chats-updated', refreshChats);
    };
  }, [refreshChats]);

  return (
    <ChatsContext.Provider value={{ chats, setChats, refreshChats, isLoading }}>
      {children}
    </ChatsContext.Provider>
  );
}

export function useChats() {
  const context = useContext(ChatsContext);
  if (!context) {
    throw new Error('useChats must be used within a ChatsProvider');
  }
  return context;
}
