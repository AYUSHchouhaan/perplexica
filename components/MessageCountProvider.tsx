'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { getMessageCount } from '@/lib/actions/messageCount';

interface MessageCountContextType {
  messageCount: number;
  setMessageCount: (count: number) => void;
  decreaseMessageCount: () => void;
  refreshMessageCount: () => Promise<void>;
  isLoading: boolean;
}

const MessageCountContext = createContext<MessageCountContextType | undefined>(undefined);

export function MessageCountProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [messageCount, setMessageCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const refreshMessageCount = useCallback(async () => {
    console.log('[MessageCountProvider] Refreshing message count. Session:', session?.user?.id);
    if (!session?.user?.id) {
      console.log('[MessageCountProvider] No session, setting count to 0');
      setMessageCount(0);
      setIsLoading(false);
      return;
    }

    try {
      const result = await getMessageCount();
      console.log('[MessageCountProvider] Got result:', result);
      if (!result.error) {
        setMessageCount(result.messageCount);
      }
    } catch (error) {
      console.error('Error fetching message count:', error);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    const t = setTimeout(() => {
      refreshMessageCount();
    }, 0);
    return () => clearTimeout(t);
  }, [refreshMessageCount]);

  const decreaseMessageCount = useCallback(() => {
    setMessageCount((prev) => Math.max(0, prev - 1));
  }, []);

  return (
    <MessageCountContext.Provider
      value={{
        messageCount,
        setMessageCount,
        decreaseMessageCount,
        refreshMessageCount,
        isLoading,
      }}
    >
      {children}
    </MessageCountContext.Provider>
  );
}

export function useMessageCount() {
  const context = useContext(MessageCountContext);
  if (context === undefined) {
    throw new Error('useMessageCount must be used within a MessageCountProvider');
  }
  return context;
}
