'use client';
import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import Sidebar from '@/components/Sidebar';
import SidebarTrigger from '@/components/SidebarTrigger';
import SearchModal from '@/components/SearchModal';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [sidebarState, setSidebarState] = useState<'expanded' | 'collapsed'>('collapsed');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Extract current chatId from pathname if we're on a chat page
  const chatId = pathname?.startsWith('/chat/') ? pathname.split('/')[2] : undefined;

  // Prevent hydration mismatch by waiting for client-side mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Define callbacks before using them in useEffect
  const handleCloseSearchModal = useCallback(() => {
    setIsSearchModalOpen(false);
  }, []);

  const handleOpenSearchModal = useCallback(() => {
    setIsSearchModalOpen(true);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarState((s) => (s === 'expanded' ? 'collapsed' : 'expanded'));
  }, []);

  // Sidebar should be collapsed by default, expanded only for logged-in users who explicitly open it
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarState('collapsed');
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.shiftKey && e.code === 'KeyO') {
        e.preventDefault();
        router.push('/');
      }
      else if (e.metaKey && e.code === 'KeyK') {
        e.preventDefault();
        handleOpenSearchModal();
      }
      else if (e.metaKey && e.code === 'KeyB') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, handleOpenSearchModal, toggleSidebar]);

  // Hide sidebar and trigger on auth and settings pages
  const isAuthPage = pathname === '/auth';
  const isSettingsPage = pathname === '/settings';
  const showSidebar = !isAuthPage && !isSettingsPage && session;

  // Use a default theme during SSR to prevent hydration mismatch
  const effectiveTheme = mounted ? theme : 'dark';

  return (
    <div className={`relative flex h-screen w-full ${effectiveTheme === 'dark' ? 'bg-[#211C26]' : 'bg-[#FBF5FA]'}`}>
      <SearchModal 
        isOpen={isSearchModalOpen}
        onClose={handleCloseSearchModal}
        theme={effectiveTheme || 'dark'}
      />
      
      {showSidebar && (
        <div className="relative">
          <Sidebar 
            sidebarState={sidebarState} 
            theme={effectiveTheme || 'dark'} 
            currentChatId={chatId}
          />
        </div>
      )}

      <div className={`flex-1 flex flex-col transition-all duration-300 relative ${showSidebar && sidebarState === 'expanded' ? 'md:ml-64' : ''}`}>
        {showSidebar && (
          <div className="relative">
            <SidebarTrigger 
              onToggle={toggleSidebar} 
              sidebarState={sidebarState} 
              theme={effectiveTheme || 'dark'} 
              onSearchClick={handleOpenSearchModal} 
            />
          </div>
        )}
        <div className="relative flex-1 min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
}
