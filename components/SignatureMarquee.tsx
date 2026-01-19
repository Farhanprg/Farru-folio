"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"

interface ScrollingTextProps {
    baseVelocity: number
    children: string
    className?: string
}

function ScrollingText({ baseVelocity = 100, children, className }: ScrollingTextProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll()

    // Create a scroll-dependent velocity increase
    const scrollVelocity = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    // Map scroll progress to a movement value
    const x = useTransform(scrollVelocity, [0, 1], ["0%", "-50%"])

    return (
        <div className="overflow-hidden whitespace-nowrap flex" ref={containerRef}>
            <motion.div className={`flex whitespace-nowrap ${className}`} style={{ x }}>
                {/* Repeat the text multiple times for the infinite effect */}
                {[...Array(6)].map((_, i) => (
                    <span key={i} className="mr-8 md:mr-16">
                        {children}
                    </span>
                ))}
            </motion.div>
        </div>
    )
}

export default function SignatureMarquee() {
    return (
        <section className="relative py-20 bg-[#0a0a0a] overflow-hidden">
            <div className="flex flex-col gap-0">
                <ScrollingText baseVelocity={-5} className="text-white text-[12vw] md:text-[8vw] font-brier leading-[0.8] opacity-10">
                    I'M A • I'M A • I'M A • I'M A •
                </ScrollingText>

                <ScrollingText baseVelocity={5} className="text-white text-[18vw] md:text-[14vw] font-brier leading-[0.8] uppercase">
                    Vibe Engineer • Vibe Engineer •
                </ScrollingText>
            </div>

            {/* Subtle Gradient Shadow to blend edges */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10" />
        </section>
    )
}
