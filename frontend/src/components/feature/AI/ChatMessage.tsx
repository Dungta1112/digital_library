import React from 'react';
import { AIChatMessage } from '@/types/ai';
import Link from 'next/link';

export function ChatMessage({ message }: { message: AIChatMessage }) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-5 shadow-sm ${
        isUser ? 'bg-green-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
      }`}>
        <div className="flex items-center mb-2 gap-2">
           <span className="text-xl">{isUser ? '👤' : '🤖'}</span>
           <span className={`text-xs font-semibold ${isUser ? 'text-green-100' : 'text-gray-500'}`}>
             {isUser ? 'You' : 'Academic AI'}
           </span>
        </div>
        <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{message.content}</p>
        
        {message.citations && message.citations.length > 0 && (
          <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col gap-3">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <span className="text-gray-300">🔗</span> Citations
            </h4>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200">
              {message.citations.map(cit => (
                <Link key={cit.id} href={`/library/document/${cit.documentId}?page=${cit.pageNumber}`}>
                  <div className="min-w-[260px] max-w-[280px] bg-gray-50 border border-gray-200 p-3 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors cursor-pointer group">
                    <p className="font-semibold text-sm text-gray-800 line-clamp-1 mb-1 group-hover:text-green-700">{cit.documentTitle}</p>
                    <p className="text-xs text-gray-500 mb-2">Page {cit.pageNumber}</p>
                    <p className="text-xs text-gray-600 italic line-clamp-3 border-l-2 border-green-400 pl-2 bg-white p-2 rounded">"{cit.textSnippet}"</p>
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
