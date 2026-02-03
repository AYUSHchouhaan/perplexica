// components/ChatMessage.tsx
"use client";
import React, { useState, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '@/types';
import { CodeBlock } from './CodeBlock';
import { CopyIcon, EditIcon, RefreshCwIcon, CheckIcon } from './Icons';

interface MessageProps {
  message: Message;
  theme: string;
  onRetry: () => void;
}

interface UserMessageProps extends MessageProps {
  onEdit: (messageId: string, newContent: string) => void;
}

const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return { copied, copy };
};

const ActionButtons = ({ onCopy, onRetry, onEdit, isUser, copied }: { onCopy: () => void; onRetry: () => void; onEdit?: () => void; isUser: boolean; copied: boolean }) => (
  <div className="absolute -bottom-8 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 dark:text-gray-400">
    <button onClick={onRetry} className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10" title="Retry">
      <RefreshCwIcon className="h-4 w-4" />
    </button>
    {isUser && onEdit && (
      <button onClick={onEdit} className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10" title="Edit">
        <EditIcon className="h-4 w-4" />
      </button>
    )}
    <button onClick={onCopy} className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10" title="Copy">
      {copied ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
    </button>
  </div>
);

export function UserMessage({ message, theme, onRetry, onEdit }: UserMessageProps) {
  const { copied, copy } = useCopyToClipboard();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);

  const handleSaveEdit = () => {
    if (editedContent.trim() && editedContent !== message.content) {
      onEdit(message.id, editedContent);
    }
    setIsEditing(false);
  };

  return (
    <div className="group relative flex justify-end">
      <div className={`inline-block p-3 rounded-2xl max-w-[80%] ${
        theme === 'dark' ? 'bg-white/5 text-white' : 
        'bg-pink-400/10 text-black'}`}>

        {isEditing ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className={`w-full p-2 rounded-md bg-transparent border ${theme === 'dark' ? 'border-white/20' : 'border-black/20'} focus:outline-none focus:ring-1 ${theme === 'dark' ? 'focus:ring-pink-400' : 'focus:ring-pink-600'}`}
              rows={Math.min(10, editedContent.split('\n').length + 1)}
              autoFocus
            />
            <div className="flex justify-end gap-2 text-sm">
                <button onClick={() => setIsEditing(false)} className={`px-3 py-1 rounded-md ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}>Cancel</button>
                <button onClick={handleSaveEdit} className={`px-3 py-1 rounded-md font-semibold text-white ${theme === 'dark' ? 'bg-pink-600 hover:bg-pink-700' : 'bg-pink-500 hover:bg-pink-600'}`}>Save & Submit</button>
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        )}
      </div>
      {!isEditing && <ActionButtons onCopy={() => copy(message.content)} onRetry={onRetry} onEdit={() => setIsEditing(true)} isUser={true} copied={copied} />}
    </div>
  );
}

interface AIMessageProps extends MessageProps {
  isLoading: boolean;
  modelName: string;
}

export const AIMessage = memo(
  ({ message, theme, onRetry, isLoading, modelName }: AIMessageProps & { modelName: string }) => {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className="group relative">
        <div className={`prose prose-base max-w-none ${theme === 'dark' ? 'prose-invert' : ''}`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code: (props: React.ComponentProps<'code'>) => <CodeBlock {...props} theme={theme} />,
              p: ({node, ...props}) => (
                <p className={`mb-4 leading-7 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`} {...props} />
              ),
              h1: ({node, ...props}) => (
                <h1 className={`text-3xl font-bold mb-4 mt-8 pb-2 border-b ${
                  theme === 'dark' ? 'text-white border-gray-700' : 'text-gray-900 border-gray-200'
                }`} {...props} />
              ),
              h2: ({node, ...props}) => (
                <h2 className={`text-2xl font-semibold mb-3 mt-6 ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`} {...props} />
              ),
              h3: ({node, ...props}) => (
                <h3 className={`text-xl font-semibold mb-2 mt-5 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`} {...props} />
              ),
              h4: ({node, ...props}) => (
                <h4 className={`text-lg font-medium mb-2 mt-4 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`} {...props} />
              ),
              h5: ({node, ...props}) => (
                <h5 className={`text-base font-medium mb-2 mt-3 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`} {...props} />
              ),
              h6: ({node, ...props}) => (
                <h6 className={`text-sm font-medium mb-2 mt-3 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`} {...props} />
              ),
              ul: ({node, ...props}) => (
                <ul className={`mb-4 ml-6 space-y-2 list-disc marker:text-gray-400 ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                }`} {...props} />
              ),
              ol: ({node, ...props}) => (
                <ol className={`mb-4 ml-6 space-y-2 list-decimal marker:text-gray-400 ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                }`} {...props} />
              ),
              li: ({node, ...props}) => (
                <li className="leading-7 pl-1" {...props} />
              ),
              blockquote: ({node, ...props}) => (
                <blockquote className={`border-l-4 pl-4 py-2 my-4 italic rounded-r ${
                  theme === 'dark' 
                    ? 'border-blue-500 bg-blue-500/10 text-gray-300' 
                    : 'border-blue-600 bg-blue-50 text-gray-700'
                }`} {...props} />
              ),
              hr: ({node, ...props}) => (
                <hr className={`my-6 border-t ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                }`} {...props} />
              ),
              a: ({node, ...props}) => (
                <a className={`font-medium underline underline-offset-2 hover:no-underline ${
                  theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                }`} target="_blank" rel="noopener noreferrer" {...props} />
              ),
              strong: ({node, ...props}) => (
                <strong className="font-bold" {...props} />
              ),
              em: ({node, ...props}) => (
                <em className="italic" {...props} />
              ),
              del: ({node, ...props}) => (
                <del className="line-through opacity-70" {...props} />
              ),
              table: ({node, children}) => (
                <div className={`my-4 overflow-x-auto rounded-lg border ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                } shadow-sm`}>
                  <table className="w-full border-collapse">{children}</table>
                </div>
              ),
              thead: ({node, ...props}) => (
                <thead className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} {...props} />
              ),
              tbody: ({node, ...props}) => (
                <tbody {...props} />
              ),
              tr: ({node, ...props}) => (
                <tr className={`border-b ${
                  theme === 'dark' ? 'border-gray-700 hover:bg-gray-800/50' : 'border-gray-200 hover:bg-gray-50'
                }`} {...props} />
              ),
              th: ({node, ...props}) => (
                <th className={`px-4 py-3 text-left font-semibold ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                }`} {...props} />
              ),
              td: ({node, ...props}) => (
                <td className={`px-4 py-3 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`} {...props} />
              ),
              img: ({node, ...props}) => (
                <img className="max-w-full h-auto rounded-lg my-4 shadow-md" {...props} />
              )
            }}
          >
            {message.content}
          </ReactMarkdown>
          {isLoading && !message.content && (
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${theme === 'dark' ? 'bg-white/50' : 'bg-black/50'}`}></div>
              <div className={`w-2 h-2 rounded-full animate-pulse [animation-delay:0.2s] ${theme === 'dark' ? 'bg-white/50' : 'bg-black/50'}`}></div>
              <div className={`w-2 h-2 rounded-full animate-pulse [animation-delay:0.4s] ${theme === 'dark' ? 'bg-white/50' : 'bg-black/50'}`}></div>
            </div>
          )}
      </div>
      {!isLoading && message.content && 
      <div>
      {/* <p className="text-xs text-gray-500 dark:text-gray-400">{modelName}</p> */}
      <ActionButtons onCopy={() => copy(message.content)} onRetry={onRetry} isUser={false} copied={copied} />
      </div>
      }
    </div>
  );
},
  (prevProps, nextProps) => {
    return (
      prevProps.message.content === nextProps.message.content &&
      prevProps.theme === nextProps.theme &&
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.modelName === nextProps.modelName
    );
  }
);

AIMessage.displayName = 'AIMessage';