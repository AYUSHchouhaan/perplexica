"use client";
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyIcon, CheckIcon } from './Icons';

interface CodeBlockProps {
  node?: unknown;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  theme: string;
}

export const CodeBlock = ({
  inline,
  className,
  children,
  theme,
  ...props
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'text';
  const codeText = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (inline) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }

  return (
    <div className="relative text-sm my-2 rounded-lg overflow-hidden">
      <div
        className={`flex items-center justify-between px-3 py-1.5 text-xs ${
          theme === 'dark' ? 'bg-[#1a1a1a] text-gray-400' : 'bg-[#f5f5f5] text-gray-600'
        }`}
      >
        <span className="font-mono text-xs">{language}</span>
        <button onClick={handleCopy} className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors" title="Copy code">
          {copied ? <CheckIcon className="h-3.5 w-3.5 text-green-500" /> : <CopyIcon className="h-3.5 w-3.5" />}
        </button>
      </div>
      <SyntaxHighlighter
        style={atomDark}
        language={language}
        PreTag="pre"
        customStyle={{
          margin: 0,
          padding: '0.75rem',
          fontSize: '0.875rem',
          background: theme === 'dark' ? '#374151' : '#f8f8f8',
          borderRadius: 0,
        }}
        codeTagProps={{
          style: {
            fontSize: '0.875rem',
            fontFamily: 'BerkeleyMono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          }
        }}
        {...props}
      >
        {codeText}
      </SyntaxHighlighter>
    </div>
  );
};