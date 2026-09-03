'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from '@phosphor-icons/react';

interface MarkdownMessageProps {
  content: string;
}

export function MarkdownMessage({ content }: MarkdownMessageProps) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none text-sm md:text-[15px] leading-7 text-slate-800 dark:text-slate-200">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-4 mb-2 tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mt-3.5 mb-2 tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white mt-3 mb-1.5">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-3 leading-7 text-slate-800 dark:text-slate-200 last:mb-0">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 mb-3 space-y-1 text-slate-800 dark:text-slate-200">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 mb-3 space-y-1 text-slate-800 dark:text-slate-200">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-emerald-500/80 bg-emerald-50/40 dark:bg-emerald-950/20 px-4 py-2 my-3 rounded-r-xl italic text-slate-700 dark:text-slate-300">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs md:text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-100/90 dark:bg-slate-800/90 text-slate-900 dark:text-white font-bold">
              {children}
            </thead>
          ),
          th: ({ children }) => <th className="px-3.5 py-2.5 font-bold">{children}</th>,
          td: ({ children }) => (
            <td className="px-3.5 py-2 text-slate-700 dark:text-slate-300 border-t border-slate-200/60 dark:border-slate-800/60">
              {children}
            </td>
          ),
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && !String(children).includes('\n');

            if (isInline) {
              return (
                <code
                  className="rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 border border-slate-200/60 dark:border-slate-700/60"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock language={match ? match[1] : ''}>
                {String(children).replace(/\n$/, '')}
              </CodeBlock>
            );
          },
          a: ({ href, children }) => {
            const isSafe = href && !href.startsWith('javascript:');
            return (
              <a
                href={isSafe ? href : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-0.5"
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function CodeBlock({ language, children }: { language: string; children: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative my-4 overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-950 text-slate-100 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/80 px-4 py-2 text-xs font-mono text-slate-400">
        <span>{language || 'code'}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <Check weight="bold" className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Đã chép</span>
            </>
          ) : (
            <>
              <Copy weight="bold" className="h-3.5 w-3.5" />
              <span>Sao chép</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-4 text-xs md:text-sm font-mono leading-relaxed">
        <pre>{children}</pre>
      </div>
    </div>
  );
}
