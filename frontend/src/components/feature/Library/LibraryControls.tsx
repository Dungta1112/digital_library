import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LibraryService } from '@/services/library.service';
import { MagnifyingGlass, CaretLeft, CaretRight } from '@phosphor-icons/react';

interface LibraryControlsProps {
  query: string;
  setQuery: (q: string) => void;
  category: string;
  setCategory: (c: string) => void;
  onSearch: () => void;
}

export function LibraryControls({ query, setQuery, category, setCategory, onSearch }: LibraryControlsProps) {
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    LibraryService.getCategories().then(data => {
      setCategories([{ id: '', name: 'Tất cả' }, ...data]);
    });
  }, []);

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm transition-colors duration-300">
      <div>
        <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-lg flex items-center gap-2 tracking-tight">
          <MagnifyingGlass weight="bold" className="w-5 h-5 text-emerald-600 dark:text-emerald-500" /> 
          Tìm kiếm
        </h3>
        <div className="relative">
          <Input 
            placeholder="Tên tài liệu, tác giả..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            className="h-12 text-sm shadow-sm w-full bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
          />
        </div>
        <Button onClick={onSearch} className="w-full h-11 font-semibold shadow-sm mt-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl active:scale-[0.98] transition-all">Tìm</Button>
      </div>
      
      <div className="w-full h-px bg-slate-100 dark:bg-slate-800/80 transition-colors duration-300"></div>

      <div>
        <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-lg tracking-tight">Chuyên mục</h3>
        <div className="flex flex-col gap-1.5">
          {categories.map(c => {
            const isActive = category === c.id;
            return (
              <button
                key={c.id || 'all'}
                onClick={() => setCategory(c.id)}
                className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function Pagination({ page, totalPages, setPage }: { page: number, totalPages: number, setPage: (p: number) => void }) {
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex justify-center items-center gap-4 mt-16 mb-8">
      <Button 
        variant="secondary" 
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="w-12 h-12 p-0 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:text-emerald-600 shadow-sm"
      >
        <CaretLeft weight="bold" className="w-5 h-5" />
      </Button>
      <span className="text-sm font-bold text-slate-700 dark:text-slate-300 px-5 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors duration-300 tracking-wide">
        Trang {page} / {totalPages}
      </span>
      <Button 
        variant="secondary" 
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="w-12 h-12 p-0 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:text-emerald-600 shadow-sm"
      >
        <CaretRight weight="bold" className="w-5 h-5" />
      </Button>
    </div>
  );
}
