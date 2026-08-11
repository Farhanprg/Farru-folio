import Preloader from "@/components/Preloader";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import WorkSection from "@/components/WorkSection";
import TextReveal from "@/components/TextReveal";
import HorizontalScroll from "@/components/HorizontalScroll";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <main className="relative bg-[#0a0a0a]">
      <Preloader />

      {/* Cinematic Intro (With Marquee Background) */}
      <HeroSection />

      {/* About / Bio Section with Floating Portrait */}
      <AboutSection />

      {/* Spacer - Visual breathing room (reduced to 20vh) */}
      <div className="relative z-20 h-[20vh] bg-[#0a0a0a]" />

      {/* Text Image Reveal Effect - Exact Port from reference */}
      <TextReveal />

      {/* WORK Section - Phase 1: Static Foundation */}
      <div className="relative z-10">
        <WorkSection />
      </div>

      {/* Horizontal Scroll Message */}
      <HorizontalScroll />

      {/* Let's Talk Section */}
      <ContactSection />

      {/* Empty space for testing/development - sits seamlessly under the curve */}
      <div className="w-full h-[5vh] bg-[#0a0a0a] relative z-0" id="dev-workspace" />

    </main>
  );
}
