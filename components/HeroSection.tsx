"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion"
import SplitText from "./SplitText"
import SignatureMarquee from "./SignatureMarquee"

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isLoaded, setIsLoaded] = useState(false)

    // Mouse parallax tracking
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 })
    const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 })

    const textMoveX = useTransform(smoothMouseX, [-0.5, 0.5], [-5, 5])
    const textMoveY = useTransform(smoothMouseY, [-0.5, 0.5], [-5, 5])

    const imageMoveX = useTransform(smoothMouseX, [-0.5, 0.5], [-20, 20])
    const imageMoveY = useTransform(smoothMouseY, [-0.5, 0.5], [-20, 20])

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e
        const { innerWidth, innerHeight } = window
        mouseX.set((clientX / innerWidth) - 0.5)
        mouseY.set((clientY / innerHeight) - 0.5)
    }

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
        <section ref={containerRef} onMouseMove={handleMouseMove} className="relative h-[400vh] bg-[#0a0a0a] z-0">
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

                {/* FOREGROUND LAYER: The Parallax Hero Composition */}
                <motion.div
                    className="absolute inset-0 z-10 overflow-hidden flex items-center justify-center pointer-events-auto bg-[#0a0a0a]"
                    style={{
                        scale,
                        borderRadius
                    }}
                >
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* 3D Depth Layer 1: Background English Text */}
                        <motion.div 
                            className="absolute z-0 flex items-center justify-center w-full"
                            style={{ x: textMoveX, y: textMoveY }}
                        >
                            <div className="flex flex-col items-center justify-center text-center">
                                {isLoaded && (
                                    <>
                                        <SplitText
                                            text="MOHAMMED"
                                            className="text-white text-[18vw] md:text-[14vw] font-brier leading-[0.85] uppercase tracking-tighter select-none opacity-90"
                                            delay={50}
                                            tag="h1"
                                        />
                                        <SplitText
                                            text="FARHAN"
                                            className="text-white text-[18vw] md:text-[14vw] font-brier leading-[0.85] uppercase tracking-tighter select-none opacity-90 pl-8 md:pl-16"
                                            delay={50}
                                            tag="h1"
                                        />
                                    </>
                                )}
                            </div>
                        </motion.div>

                        {/* 3D Depth Layer 2: Foreground Image */}
                        <motion.div
                            className="absolute z-10 w-full h-full flex items-end justify-center pointer-events-none"
                            style={{ x: imageMoveX, y: imageMoveY }}
                        >
                            {isLoaded && (
                                <motion.img 
                                    initial={{ opacity: 0, y: "20%", scale: 0.9 }}
                                    animate={{ opacity: 1, y: "0%", scale: 1 }}
                                    transition={{ duration: 1.2, delay: 0.8, ease: [0, 0.55, 0.45, 1] }}
                                    src="/images/hero-removebg.png" 
                                    alt="Mohammed Farhan"
                                    className="h-[100vh] w-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                                    draggable={false}
                                />
                            )}
                        </motion.div>
                    </div>
                </motion.div>

            </div>
        </section>
    )
}
