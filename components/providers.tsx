'use client';

import { SessionProvider } from 'next-auth/react';
import { MessageCountProvider } from './MessageCountProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <MessageCountProvider>
        {children}
      </MessageCountProvider>
    </SessionProvider>
  );
}
