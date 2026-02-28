"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"

export default function AboutSection() {
    const containerRef = useRef<HTMLDivElement>(null)

    // Smooth scrolling parallax for the image and text - UPWARD MOTION ONLY, DIFFERENT SPEEDS
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    // 1. HUGE BACKGROUND TEXT - Slowest (Starts slightly down, moves up gently)
    const yBackground = useTransform(scrollYProgress, [0, 1], ["20%", "-10%"])

    // 2. BIO TEXT - Medium Speed (Starts lower, moves up faster)
    const yText = useTransform(scrollYProgress, [0, 1], ["60%", "-20%"])

    // 3. IMAGE - Fastest & Delayed (Starts way off bottom, rockets up past text)
    const yImage = useTransform(scrollYProgress, [0, 1], ["120%", "-80%"])
    const rotateImage = useTransform(scrollYProgress, [0, 1], [-12, 12]) // More dramatic swinging tilt

    return (
        <section ref={containerRef} className="relative w-full min-h-[160vh] bg-[#0a0a0a] overflow-hidden flex flex-col items-center py-32">

            {/* HUGE BACKGROUND TEXT - Top Left */}
            <motion.div
                style={{ y: yBackground }}
                className="absolute top-32 left-4 md:left-12 lg:left-24 z-0 pointer-events-none"
            >
                <h1 className="text-[25vw] md:text-[18vw] font-brier leading-[0.8] whitespace-nowrap text-white/5 uppercase tracking-tighter mix-blend-overlay">
                    HI, I'M <br /> FARRU
                </h1>
            </motion.div>

            {/* PORTRAIT IMAGE - Middle Center Floating & Tilted */}
            <motion.div
                style={{ y: yImage, rotateZ: rotateImage }}
                className="relative z-10 w-[280px] h-[380px] md:w-[350px] md:h-[480px] lg:w-[450px] lg:h-[600px] mt-[25vh] shrink-0 pointer-events-none rounded-3xl overflow-hidden border border-white/5 bg-[#111] shadow-2xl"
            >
                <Image
                    src="/portrait.png"
                    alt="Farru Portrait"
                    fill
                    className="object-cover object-center translate-y-8 scale-110 drop-shadow-2xl opacity-90 grayscale contrast-125 mix-blend-lighten"
                />
            </motion.div>

            {/* BIO TEXT - Bottom Right */}
            <div className="w-full flex justify-end px-6 md:px-16 lg:px-24 relative z-20 mt-12 md:-mt-32">
                <motion.div
                    style={{ y: yText }}
                    className="max-w-md lg:max-w-xl flex flex-col gap-6 md:gap-8 text-right bg-[#0a0a0a]/40 p-6 md:p-8 rounded-3xl backdrop-blur-md border border-white/5 shadow-2xl"
                >
                    <p className="text-white/90 text-2xl md:text-3xl lg:text-4xl font-light leading-tight tracking-wide">
                        A developer with a <br /><span className="font-brier italic text-[#D1FF1C] tracking-normal">creative mind</span>,<br /> obsessed with engineering unforgettable digital <span className="font-brier text-[#D1FF1C] tracking-normal px-1">"WOW"</span> moments.
                    </p>

                    <p className="text-white/60 text-base md:text-lg leading-relaxed font-geist-sans">
                        I don't just write code; I craft experiences. From fluid micro-interactions to robust architectures, my goal is to build interfaces that force users to stop their scroll and just admire the work.
                    </p>
                </motion.div>
            </div>

            {/* CODE / DESIGN / CRAFT / REPEAT - Bottom Center */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full text-center z-20">
                <p className="text-white/60 font-geist-sans font-medium text-xs md:text-sm tracking-[0.4em] uppercase flex items-center justify-center">
                    Code <span className="text-[#D1FF1C] opacity-70 px-2 italic font-brier lowercase">/</span> Design <span className="text-[#D1FF1C] opacity-70 px-2 italic font-brier lowercase">/</span> Craft <span className="text-[#D1FF1C] opacity-70 px-2 italic font-brier lowercase">/</span> Repeat <span className="ml-2 text-base md:text-lg">✨</span>
                </p>
            </div>

            {/* Fading gradients at top and bottom to blend with other sections */}
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none z-30" />
            <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none z-30" />
        </section>
    )
}
