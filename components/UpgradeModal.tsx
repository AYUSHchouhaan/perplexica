'use client';

import { XIcon } from './Icons';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
}

export default function UpgradeModal({ isOpen, onClose, theme }: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-md rounded-2xl p-8 shadow-xl ${
          theme === 'dark' 
            ? 'bg-gradient-to-b from-[#2a1a24] to-[#1a0a14]' 
            : 'bg-gradient-to-b from-[#fef5ff] to-[#f5e5ff]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            theme === 'dark'
              ? 'hover:bg-white/10 text-white/70'
              : 'hover:bg-black/10 text-black/70'
          }`}
        >
          <XIcon className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <div className={`text-6xl mb-4`}>💬</div>
          <h2 className={`text-2xl font-bold mb-2 ${
            theme === 'dark' ? 'text-[#f2c0d7]' : 'text-[#ba4077]'
          }`}>
            Out of Messages
          </h2>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-white/70' : 'text-black/70'
          }`}>
            You&apos;ve used all your free messages for today.
          </p>
        </div>

        <div className={`p-4 rounded-lg mb-6 ${
          theme === 'dark' ? 'bg-white/5' : 'bg-black/5'
        }`}>
          <h3 className={`font-semibold mb-2 ${
            theme === 'dark' ? 'text-[#f2c0d7]' : 'text-[#ba4077]'
          }`}>
            Upgrade to Premium
          </h3>
          <ul className={`space-y-2 text-sm ${
            theme === 'dark' ? 'text-white/80' : 'text-black/80'
          }`}>
            <li className="flex items-center gap-2">
              <span className={theme === 'dark' ? 'text-[#f2c0d7]' : 'text-[#ba4077]'}>✓</span>
              Unlimited messages
            </li>
            <li className="flex items-center gap-2">
              <span className={theme === 'dark' ? 'text-[#f2c0d7]' : 'text-[#ba4077]'}>✓</span>
              Access to all premium models
            </li>
            <li className="flex items-center gap-2">
              <span className={theme === 'dark' ? 'text-[#f2c0d7]' : 'text-[#ba4077]'}>✓</span>
              Priority support
            </li>
            <li className="flex items-center gap-2">
              <span className={theme === 'dark' ? 'text-[#f2c0d7]' : 'text-[#ba4077]'}>✓</span>
              Advanced features
            </li>
          </ul>
        </div>

        <button
          onClick={() => {
            // Navigate to upgrade page or handle upgrade logic
            window.location.href = '/upgrade';
          }}
          className={`w-full py-3 rounded-lg font-semibold transition-all ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-[#5e183d] to-[#401020] hover:from-[#8e486d] hover:to-[#6e284d] text-[#f2c0d7]'
              : 'bg-[#aa3067] hover:bg-[#ea70a7] text-white'
          }`}
        >
          Upgrade Now
        </button>

        <button
          onClick={onClose}
          className={`w-full mt-3 py-2 text-sm ${
            theme === 'dark' ? 'text-white/50 hover:text-white/70' : 'text-black/50 hover:text-black/70'
          }`}
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
