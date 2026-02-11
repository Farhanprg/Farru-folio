import Preloader from "@/components/Preloader";
import HeroSection from "@/components/HeroSection";
import WorkSection from "@/components/WorkSection";
import TextReveal from "@/components/TextReveal";

export default function Home() {
  return (
    <main className="relative bg-[#0a0a0a]">
      <Preloader />

      {/* Cinematic Intro (With Marquee Background) */}
      <HeroSection />

      {/* Spacer - Visual breathing room (reduced to 80vh) */}
      <div className="relative z-20 h-[80vh] bg-[#0a0a0a]" />

      {/* Text Image Reveal Effect - Exact Port from reference */}
      <TextReveal />

      {/* WORK Section - Phase 1: Static Foundation */}
      <WorkSection />

    </main>
  );
}
