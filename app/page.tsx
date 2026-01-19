import Preloader from "@/components/Preloader";
import HeroSection from "@/components/HeroSection";
import StickyGallery from "@/components/StickyGallery";

export default function Home() {
  return (
    <main className="relative bg-[#0a0a0a]">
      <Preloader />

      {/* Cinematic Intro (With Marquee Background) */}
      <HeroSection />

      {/* Content Starts Here - Slides OVER the Hero ghost */}
      <div className="relative z-20 bg-[#0a0a0a] -mt-[20vh]">
        <StickyGallery />
      </div>
    </main>
  );
}
