import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { HeroSection } from '@/components/feature/Home/HeroSection';
import { HomeFeatures } from '@/components/feature/Home/HomeFeatures';
import { HomeCategories } from '@/components/feature/Home/HomeCategories';
import { HomeAIShowcase } from '@/components/feature/Home/HomeAIShowcase';
import { HomeDocuments } from '@/components/feature/Home/HomeDocuments';
import { HomeForum } from '@/components/feature/Home/HomeForum';
import { HomeCTA } from '@/components/feature/Home/HomeCTA';

export default function HomePage() {
  return (
    <SmoothScroll>
      <div className="home-shell relative w-full overflow-hidden bg-slate-950">
        {/* 1 & 2. Hero Banner, Smart Search & Interactive Split-View Reader Showcase */}
        <HeroSection />

        {/* 3. 4 Trụ Cột Nền Tảng: Thư viện số, AI RAG, Diễn đàn, Nhóm học tập */}
        <HomeFeatures />

        {/* 4. Danh mục Ngành học Nổi bật */}
        <HomeCategories />

        {/* AI In-depth Capabilities Showcase */}
        <HomeAIShowcase />

        {/* 5. Giáo trình & Tài liệu Xem Nhiều Nhất */}
        <HomeDocuments />

        {/* 6. Thảo luận Sôi Nổi Trên Diễn Đàn */}
        <HomeForum />

        {/* Bắt Đầu & Khám Phá */}
        <HomeCTA />
      </div>
    </SmoothScroll>
  );
}
