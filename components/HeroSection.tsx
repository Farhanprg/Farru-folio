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

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    })

    // Phase 1: Portrait Scaling (Stays centered, no Y movement)
    const scale = useTransform(smoothProgress, [0, 1], [1, 0.6])

    // Dynamic Border Radius
    const borderRadius = useTransform(smoothProgress, [0.2, 0.6], ["0px", "60px"])

    // UI Elements Hiding (Happens early)
    const uiOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0])
    const topTextY = useTransform(smoothProgress, [0, 0.2], ["0%", "-100%"])
    const bottomTextY = useTransform(smoothProgress, [0, 0.2], ["0%", "100%"])

    // Marquee Layer
    const marqueeOpacity = useTransform(smoothProgress, [0.1, 0.4], [0, 1])
    const marqueeScale = useTransform(smoothProgress, [0, 1], [1.1, 1])

    return (
        <section ref={containerRef} className="relative h-[300vh] bg-[#0a0a0a] z-0">
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

                {/* BACKGROUND LAYER: The Marquee (Behind Portrait) */}
                <motion.div
                    className="absolute inset-0 z-0 flex flex-col justify-center pointer-events-none"
                    style={{ opacity: useTransform(smoothProgress, [0.1, 0.95], [0, 1]), scale: marqueeScale }}
                >
                    <motion.div>
                        <SignatureMarquee />
                    </motion.div>
                </motion.div>

                {/* FOREGROUND LAYER: The 3D Portrait */}
                <motion.div
                    className="absolute inset-0 z-10 overflow-hidden flex items-center justify-center"
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
                                    Welcome to my
                                </motion.span>
                                <SplitText
                                    text="PORTFOLIO"
                                    className="text-white text-6xl md:text-8xl lg:text-9xl font-brier leading-none uppercase tracking-tighter"
                                    delay={40}
                                    tag="h2"
                                />
                            </>
                        )}
                    </motion.div>
                </div>

                {/* Bottom Right Content */}
                <div className="absolute bottom-12 right-4 md:bottom-24 md:right-12 z-20">
                    <motion.div
                        style={{ opacity: uiOpacity, y: bottomTextY }}
                        className="flex flex-col items-end group cursor-pointer"
                    >
                        {isLoaded && (
                            <>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: 80 }}
                                    transition={{ duration: 1.5, delay: 1, ease: [0.16, 1, 0.3, 1] }}
                                    className="h-px bg-white/30 mb-6 group-hover:w-32 group-hover:bg-white transition-all duration-700"
                                />
                                <motion.span
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1, delay: 1.2, ease: [0, 0.55, 0.45, 1] }}
                                    className="text-white/70 text-sm md:text-xl uppercase tracking-[0.4em] font-black group-hover:text-white transition-colors duration-500"
                                >
                                    Discover More <span className="inline-block group-hover:translate-x-3 transition-transform duration-500">→</span>
                                </motion.span>
                            </>
                        )}
                    </motion.div>
                </div>

            </div>
        </section>
    )
}
