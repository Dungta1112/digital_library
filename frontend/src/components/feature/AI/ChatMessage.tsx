import React from 'react';
import { AIChatMessage } from '@/types/ai';
import Link from 'next/link';

export function ChatMessage({ message }: { message: AIChatMessage }) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-5 shadow-sm transition-colors duration-300 ${
        isUser ? 'bg-green-600 text-white rounded-br-none' : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-800 dark:text-gray-200 rounded-bl-none'
      }`}>
        <div className="flex items-center mb-2 gap-2">
           <span className="text-xl">{isUser ? '👤' : '🤖'}</span>
           <span className={`text-xs font-semibold ${isUser ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'}`}>
             {isUser ? 'You' : 'Academic AI'}
           </span>
        </div>
        <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{message.content}</p>
        
        {message.citations && message.citations.length > 0 && (
          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-slate-800 flex flex-col gap-3 transition-colors duration-300">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <span className="text-gray-300">🔗</span> Citations
            </h4>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-700 transition-colors duration-300">
              {message.citations.map(cit => (
                <Link key={cit.id} href={`/library/document/${cit.documentId}?page=${cit.pageNumber}`}>
                  <div className="min-w-[260px] max-w-[280px] bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 p-3 rounded-lg hover:border-green-400 dark:hover:border-green-700 hover:bg-green-50 dark:hover:bg-slate-800 transition-colors duration-300 cursor-pointer group">
                    <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 line-clamp-1 mb-1 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors duration-300">{cit.documentTitle}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-300">Page {cit.pageNumber}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 italic line-clamp-3 border-l-2 border-green-400 pl-2 bg-white dark:bg-slate-900 p-2 rounded transition-colors duration-300">"{cit.textSnippet}"</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
