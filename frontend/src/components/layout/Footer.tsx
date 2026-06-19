import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#F8FAF7] dark:bg-slate-900 border-t border-[rgba(22,163,74,0.08)] dark:border-slate-800 py-12 md:py-16 transition-colors">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <h3 className="font-playfair text-xl font-bold text-gray-900 dark:text-white mb-4">Smart Digital Library</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm">
              Nền tảng thư viện số tích hợp tìm kiếm tài liệu, trợ lý AI, diễn đàn học thuật và nhóm học tập dành cho sinh viên, giảng viên và nhà nghiên cứu.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Khám phá</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-400 transition-colors">Trang chủ</Link></li>
              <li><Link href="/library" className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-400 transition-colors">Thư viện</Link></li>
              <li><Link href="/ai" className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-400 transition-colors">Trợ lý AI</Link></li>
              <li><Link href="/forum" className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-400 transition-colors">Diễn đàn</Link></li>
              <li><Link href="/groups" className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-400 transition-colors">Nhóm học tập</Link></li>
            </ul>
          </div>

          {/* Academic Links */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Học thuật</h4>
            <ul className="space-y-3">
              <li><Link href="/library?sort=new" className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-400 transition-colors">Tài liệu mới</Link></li>
              <li><Link href="/library?sort=popular" className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-400 transition-colors">Chủ đề phổ biến</Link></li>
              <li><Link href="/guide" className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-400 transition-colors">Hướng dẫn sử dụng</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="pt-8 border-t border-[rgba(22,163,74,0.08)] dark:border-slate-800 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            © 2026 Smart Digital Library. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
