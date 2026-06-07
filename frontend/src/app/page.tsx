import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { HeroSection } from '@/components/feature/Home/HeroSection';
import { HomeProblems } from '@/components/feature/Home/HomeProblems';
import { HomeSolution } from '@/components/feature/Home/HomeSolution';
import { HomeFeatures } from '@/components/feature/Home/HomeFeatures';
import { HomeAIShowcase } from '@/components/feature/Home/HomeAIShowcase';
import { HomeDocuments } from '@/components/feature/Home/HomeDocuments';
import { HomeForum } from '@/components/feature/Home/HomeForum';
import { HomeGroups } from '@/components/feature/Home/HomeGroups';
import { HomeHowItWorks } from '@/components/feature/Home/HomeHowItWorks';
import { HomeAudience } from '@/components/feature/Home/HomeAudience';
import { HomeTrust } from '@/components/feature/Home/HomeTrust';
import { HomeCTA } from '@/components/feature/Home/HomeCTA';

export default function HomePage() {
  return (
    <SmoothScroll>
      <div className="relative w-full overflow-hidden bg-white">
        <HeroSection />
        <HomeProblems />
        <HomeSolution />
        <HomeFeatures />
        <HomeAIShowcase />
        <HomeDocuments />
        <HomeForum />
        <HomeGroups />
        <HomeHowItWorks />
        <HomeAudience />
        <HomeTrust />
        <HomeCTA />
      </div>
    </SmoothScroll>
  );
}
