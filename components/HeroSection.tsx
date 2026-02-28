"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import InteractivePortrait from "./InteractivePortrait"
import SplitText from "./SplitText"
import SignatureMarquee from "./SignatureMarquee"

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isLoaded, setIsLoaded] = useState(false)

    // Trigger animations after Preloader
    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 2800)
        return () => clearTimeout(timer)
    }, [])

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    })

    // Make the framer-motion spring much smoother and softer
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 50,  // Lower stiffness makes it smoother
        damping: 20,    // Lower damping for more follow-through
        mass: 0.5,      // Lighter mass for less drag
        restDelta: 0.001,
    })

    // Phase 1: Portrait Scaling (Stays centered, no Y movement)
    // Slower scale out: stays larger for longer, but shrinks more heavily now
    const scale = useTransform(smoothProgress, [0, 0.4], [1, 0.45])

    // Dynamic Border Radius
    const borderRadius = useTransform(smoothProgress, [0.1, 0.5], ["0px", "60px"])

    // UI Elements Hiding (Happens early)
    const uiOpacity = useTransform(smoothProgress, [0, 0.15], [1, 0])
    const topTextY = useTransform(smoothProgress, [0, 0.15], ["0%", "-100%"])
    const bottomTextY = useTransform(smoothProgress, [0, 0.15], ["0%", "100%"])

    // Marquee Layer
    // Appears early (0.15) and STAYS visible until almost the end (0.9)
    // This gives the "pinned" feel for the majority of the scroll
    const marqueeOpacity = useTransform(smoothProgress, [0.1, 0.2, 0.85, 1], [0, 1, 1, 0])
    const marqueeScale = useTransform(smoothProgress, [0, 1], [1.1, 1])

    return (
        // Increased height to 500vh to give more "scroll time" (2-3 slides worth)
        <section ref={containerRef} className="relative h-[400vh] bg-[#0a0a0a] z-0">
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

                {/* BACKGROUND LAYER: The Marquee (Behind Portrait) */}
                <motion.div
                    className="absolute inset-0 z-0 flex flex-col justify-center pointer-events-none"
                    style={{ opacity: marqueeOpacity, scale: marqueeScale }}
                >
                    <motion.div>
                        <SignatureMarquee />
                    </motion.div>
                </motion.div>

                {/* FOREGROUND LAYER: The 3D Portrait */}
                <motion.div
                    className="absolute inset-0 z-10 overflow-hidden flex items-center justify-center pointer-events-auto"
                    style={{
                        scale,
                        borderRadius
                    }}
                >
                    <InteractivePortrait />
                </motion.div>

                {/* UI LAYER: Content Gliding Away */}
                <div className="absolute top-8 left-4 md:top-12 md:left-8 z-20 pointer-events-none text-left">
                    <motion.div
                        style={{ opacity: uiOpacity, y: topTextY }}
                    >
                        {isLoaded && (
                            <>
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 1, ease: [0, 0.55, 0.45, 1] }}
                                    className="text-white/40 text-[10px] md:text-xs uppercase tracking-[0.5em] font-medium block mb-2"
                                >
                                    myself
                                </motion.span>
                                <div className="flex flex-col gap-0 md:-gap-2">
                                    <SplitText
                                        text="MOHAMMED"
                                        className="text-white text-[12vw] md:text-[8vw] lg:text-[7vw] font-brier leading-[0.85] uppercase tracking-tighter"
                                        delay={40}
                                        tag="h2"
                                    />
                                    <SplitText
                                        text="FARHAN"
                                        className="text-white text-[12vw] md:text-[8vw] lg:text-[7vw] font-brier leading-[0.85] uppercase tracking-tighter sm:ml-0 md:ml-12 lg:ml-16"
                                        delay={40}
                                        tag="h2"
                                    />
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>

                {/* ARABIC NAME LAYER (Right Side) */}
                <div className="absolute top-8 right-4 md:top-12 md:right-8 z-20 pointer-events-none text-right">
                    <motion.div style={{ opacity: uiOpacity, y: topTextY }}>
                        {isLoaded && (
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1, delay: 0.5, ease: [0, 0.55, 0.45, 1] }}
                                className="flex flex-col items-end"
                            >
                                <span className="text-[#D1FF1C] text-sm md:text-base tracking-[0.2em] font-medium uppercase mb-2 opacity-60">
                                    اسم
                                </span>
                                <h2 className="text-white/30 text-4xl md:text-5xl lg:text-7xl font-light tracking-wide leading-none" dir="rtl">
                                    محمد فرحان
                                </h2>
                            </motion.div>
                        )}
                    </motion.div>
                </div>

            </div>
        </section>
    )
}
