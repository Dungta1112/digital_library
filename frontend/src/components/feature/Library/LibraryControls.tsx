import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LibraryService } from '@/services/library.service';

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
    <div className="flex flex-col gap-6 p-6 md:p-8 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-sm transition-colors duration-300">
      <div>
        <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">Tìm kiếm</h3>
        <Input 
          placeholder="Tên tài liệu, tác giả..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          className="h-12 text-sm shadow-inner w-full"
        />
        <Button onClick={onSearch} size="md" className="w-full h-11 font-semibold shadow-md mt-3">Tìm</Button>
      </div>
      
      <div className="w-full h-px bg-gray-100 dark:bg-slate-800 transition-colors duration-300"></div>

      <div>
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Chuyên mục</h3>
        <div className="flex flex-col gap-1.5">
          {categories.map(c => {
            const isActive = category === c.id;
            return (
              <button
                key={c.id || 'all'}
                onClick={() => setCategory(c.id)}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-green-50 dark:bg-slate-800 text-green-700 dark:text-green-400 border border-green-200 dark:border-slate-700 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 border border-transparent'
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
    <div className="flex justify-center items-center gap-6 mt-12 mb-8">
      <Button 
        variant="secondary" 
        size="md" 
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="w-28 font-medium"
      >
        ← Trước
      </Button>
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-4 py-2 bg-gray-100 dark:bg-slate-800 rounded-md transition-colors duration-300">
        Trang {page} / {totalPages}
      </span>
      <Button 
        variant="secondary" 
        size="md" 
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="w-28 font-medium"
      >
        Sau →
      </Button>
    </div>
  );
}
