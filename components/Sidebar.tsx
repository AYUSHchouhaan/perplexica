'use client';

import { SearchIcon, LogInIcon, XIcon } from '@/components/Icons';
import HoldTooltip from './HoldTooltip';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CgProfile } from "react-icons/cg";
import { useState } from 'react';
import { Chat } from '@/types';
import Link from 'next/link';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { useMessageCount } from './MessageCountProvider';
import { useChats } from './ChatsProvider';

interface SidebarProps {
  sidebarState: 'expanded' | 'collapsed';
  theme: string;
  currentChatId?: string;
}


export default function Sidebar({ sidebarState, theme, currentChatId }: SidebarProps) {
  const isExpanded = sidebarState === 'expanded';
  const { data: session } = useSession();
  const router = useRouter();
  const { chats, setChats } = useChats();
  const [searchQuery, setSearchQuery] = useState('');
  const [chatToDelete, setChatToDelete] = useState<Chat | null>(null);
  const { messageCount } = useMessageCount();

  const handleDeleteConfirm = () => {
    if (!chatToDelete) return;
    const id = chatToDelete.id;
  
    setChats(chats.filter((c: Chat) => c.id !== id));
    setChatToDelete(null);
  
    if (currentChatId === id) {
      router.push('/');
    }
  
    if (session) {
      fetch(`/api/chats/${id}`, { method: 'DELETE' })
        .catch(err => {
          console.error('Failed to delete chat on server:', err);
        })
        .finally(() => {
          window.dispatchEvent(new CustomEvent('chats-updated'));
        });
    } else {
      // no-op: unauthenticated users shouldn't have deletable chats
      window.dispatchEvent(new CustomEvent('chats-updated'));
    }
  };
  

  const filteredChats = searchQuery
    ? chats.filter(chat => chat.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : chats;

  return (
    <>
      <aside
        role="complementary"
        aria-label="Sidebar"
        className={`fixed top-3 left-3 bottom-3 ${theme === 'dark' ? 'bg-gradient-to-t from-[#0F0A0D] to-[#1C151A]' : 'bg-[#F2E1F4]'} shadow-lg transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-64' : 'w-0'
        } flex flex-col z-30 rounded-2xl`}
      >
        {isExpanded && (
          <>

    <header className="flex flex-row items-center justify-center gap-2 px-4 py-4">
      <div style={{ marginBottom: '-17px', display: 'flex', alignItems: 'center', gap: '3px', marginLeft: '-30px' }}>
        {/* Logo image */}
        <img
          src="/logo.png"
          alt="Logo"
          style={{ width: '48px', height: '48px', objectFit: 'contain' }}
        />
        <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-[#f2c0d7]' : 'text-[#ba4077]'}`}>perplexica</h1>
      </div>
    </header>

        <div className="flex-1 px-4 py-2 space-y-4 overflow-y-auto">
          <>
            <button
                onClick={() => router.push('/')}
                className={`w-full flex border !border-[#3e183d]/50 items-center justify-center rounded-md px-4 py-2 font-bold text-sm transition ${theme === 'dark' ? 'text-[#f2c0d7]' : 'text-[#f2f0f7]'}`}
                style={{
                  background: theme === 'dark' 
                    ? 'radial-gradient(circle at center, #5e183d, #401020)'
                    : '#aa3067',
                  transition: 'all 0.3s ease'
                }}
              >
                <span>New Chat</span>
              </button>
            <div className="flex items-center w-full px-1" style={{ marginTop: '0rem', borderBottom: theme === 'dark' ? '1px solid #2C252A' : '1px solid #E2C1D4' }}>
              <SearchIcon className={`h-4 w-4 ${theme === 'dark' ? 'text-[#f2c0d7]' : 'text-[#ba4077]'}`} />
              <input
                id="threads"
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full rounded-md py-2 pl-2 pr-4 text-[14px] ${theme === 'dark' ? '!placeholder-[#927987] text-[#f2c0d7]' : '!placeholder-[#b27987] text-[#ba4077]'} bg-transparent focus:outline-none`}
              />
            </div>
            <div className="space-y-1 mt-2 flex-grow overflow-y-auto">
              {filteredChats.length > 0 ? (
                filteredChats.map((chat) => (
                  <div key={chat.id} className="group relative">
                    <Link 
                      href={`/chat/${chat.id}`} 
                      className={`block rounded-lg px-3 py-2 text-sm transition-colors ${chat.id === currentChatId 
                        ? theme === 'dark' 
                          ? 'bg-white/10 text-[#f2c0d7]' 
                          : 'bg-[#e2a0c7] text-[#7a2a50]'
                        : theme === 'dark'
                          ? 'text-[#d8a0b7] hover:bg-[#2a1a24]'
                          : 'text-[#ba4077] hover:bg-[#f2d1e4]'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="truncate flex-1 pr-4" title={chat.title}>{chat.title}</span>
                        {/* <span className="text-xs opacity-60 flex-shrink-0 flex items-center ml-2">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          {formatDate(chat.updated_at)}
                        </span> */}
                      </div>
                    </Link>
                    <button
                      onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setChatToDelete(chat);
                      }}
                      className={`absolute right-2 top-[16%] -translate-y-1/2 p-1 rounded-full opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity ${
                        theme === 'dark' ? 'text-white/80 hover:bg-white/10' : 'text-black/80 hover:bg-black/10'
                      }`}
                      title="Delete chat"
                    >
                        <XIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className={`text-center py-4 text-sm ${theme === 'dark' ? 'text-[#927987]' : 'text-[#b27987]'}`}>
                  {searchQuery ? 'No chats found' : 'No chats yet'}
                </div>
              )}
            </div>
          </>
        </div>

        <div className="p-5">
            {session && (
              <div className={`mb-3 p-3 rounded-lg text-center ${
                theme === 'dark' ? 'bg-white/5' : 'bg-black/5'
              }`}>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-white/50' : 'text-black/50'
                }`}>
                  Messages Remaining
                </p>
                <p className={`text-2xl font-bold ${
                  messageCount <= 5
                    ? 'text-red-500'
                    : theme === 'dark'
                    ? 'text-[#f2c0d7]'
                    : 'text-[#ba4077]'
                }`}>
                  {messageCount}
                </p>
              </div>
            )}
            <div className={`flex items-center rounded-lg ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-black/5'} transition-colors`}>
              {session ? (
                <Link href="/settings" className="flex items-center gap-3 w-full px-2 py-2 text-left">
                  <CgProfile size={24} className={theme === 'dark' ? 'text-white' : 'text-black'} />
                  <div className="flex flex-col">
                    <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{session.user?.username || 'User'}</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-white/70' : 'text-black/70'}`}>Free Plan</p>
                  </div>
                </Link>
              ) : (
                <button onClick={() => window.location.href = "/auth"} className={`flex items-center gap-3 w-full p-3 rounded-lg font-semibold ${theme === 'dark' ? 'text-[#f2c0d7]' : 'text-[#ba4077]'}`}>
                  <LogInIcon className="h-5 w-5" /> 
                  <span>Login</span>
                </button>
              )}
            </div>
        </div>
        </>
      )}
      </aside>

      <DeleteConfirmationModal
        isOpen={!!chatToDelete}
        onClose={() => setChatToDelete(null)}
        onConfirm={handleDeleteConfirm}
        chatTitle={chatToDelete?.title || ''}
        theme={theme}
      />
    </>
  );
}