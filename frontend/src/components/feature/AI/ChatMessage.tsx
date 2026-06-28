import React from 'react';
import { AIChatMessage } from '@/types/ai';
import Link from 'next/link';
import { User, Robot, LinkSimple, CaretRight } from '@phosphor-icons/react';

export function ChatMessage({ message }: { message: AIChatMessage }) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-8`}>
      <div className={`max-w-[85%] md:max-w-[75%] rounded-3xl p-6 shadow-sm transition-colors duration-300 ${
        isUser 
          ? 'bg-emerald-700 text-white rounded-br-sm' 
          : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-sm'
      }`}>
        <div className="flex items-center mb-3 gap-2.5">
           {isUser ? (
             <div className="w-7 h-7 rounded-full bg-emerald-800/50 flex items-center justify-center">
               <User weight="bold" className="w-4 h-4 text-emerald-100" />
             </div>
           ) : (
             <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center border border-emerald-100 dark:border-emerald-800/50">
               <Robot weight="duotone" className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
             </div>
           )}
           <span className={`text-[11px] font-bold uppercase tracking-wider ${isUser ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'}`}>
             {isUser ? 'Bạn' : 'Trợ lý AI'}
           </span>
        </div>
        <div className={`whitespace-pre-wrap leading-relaxed text-[15px] ${isUser ? 'text-emerald-50' : 'text-slate-700 dark:text-slate-300'}`}>
          {message.content}
        </div>
        
        {message.citations && message.citations.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3 transition-colors duration-300">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <LinkSimple weight="bold" className="w-3.5 h-3.5" /> Nguồn trích dẫn
            </h4>
            <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar transition-colors duration-300">
              {message.citations.map(cit => (
                <Link key={cit.id} href={`/library/document/${cit.documentId}?page=${cit.pageNumber}`} className="shrink-0">
                  <div className="w-[280px] bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 p-4 rounded-xl hover:border-emerald-400 dark:hover:border-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-colors duration-300 group">
                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 line-clamp-1 mb-1.5 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors duration-300">
                      {cit.documentTitle}
                    </p>
                    <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-500 mb-3 tracking-wide">
                      TRANG {cit.pageNumber}
                    </p>
                    <div className="flex gap-2">
                      <div className="w-1 bg-emerald-400/50 dark:bg-emerald-500/30 rounded-full shrink-0"></div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 italic line-clamp-3 leading-relaxed">
                        "{cit.textSnippet}"
                      </p>
                    </div>
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
