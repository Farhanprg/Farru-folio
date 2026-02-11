"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export default function TextReveal() {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger)

        const ctx = gsap.context(() => {
            const lines = document.querySelectorAll('.line')

            lines.forEach((line) => {
                const imgSpan = line.querySelector('.img-span')

                if (imgSpan) {
                    gsap.to(imgSpan, {
                        width: 300,
                        duration: 1, // Added duration for explicit timing logic (scroll overrides it but good for debugging)
                        ease: "power2.out", // Smoother ease
                        scrollTrigger: {
                            trigger: line,
                            start: "top 85%", // Start earlier when line enters viewport
                            end: "top 35%",   // End higher up
                            scrub: 1,         // Smooth scrubbing
                            // markers: true, // Uncomment to debug
                        }
                    })
                }
            })
        }, containerRef) // Scope to container

        // Refresh ScrollTrigger to ensure positions are calculated correctly after render
        ScrollTrigger.refresh()

        return () => ctx.revert()
    }, [])

    return (
        <section ref={containerRef} className="relative min-h-screen w-full bg-[#0a0a0a] text-white flex flex-col justify-center items-center py-20 overflow-hidden">

            {/* Intro Title match reference style */}
            <div className="mb-24 flex justify-center w-full">
                <h1 className="font-mona text-[0.9rem] font-light tracking-[0.5em] uppercase text-[#666]">
                    Engineering Vibes
                </h1>
            </div>

            <div className="flex flex-col gap-5 items-center w-full">

                {/* Line 1: We craft [IMG] digital */}
                <div className="line flex justify-center items-center gap-5">
                    <span className="text-[7.5rem] font-brier font-light tracking-[-0.02em] leading-none text-white">We craft</span>
                    <span className="img-span h-[110px] w-0 rounded-[5px] overflow-hidden relative block">
                        <img
                            src="https://i.pinimg.com/1200x/93/27/65/932765c7cd00055218ba7398119d7d4d.jpg"
                            alt=""
                            className="absolute left-1/2 -translate-x-1/2 h-full min-w-[300px] object-cover rounded-[5px]"
                        />
                    </span>
                    <span className="text-[7.5rem] font-brier font-light tracking-[-0.02em] leading-none text-white">digital</span>
                </div>

                {/* Line 2: experiences [IMG] that */}
                <div className="line flex justify-center items-center gap-5">
                    <span className="text-[7.5rem] font-brier font-light tracking-[-0.02em] leading-none text-white">experiences</span>
                    <span className="img-span h-[110px] w-0 rounded-[5px] overflow-hidden relative block">
                        <img
                            src="https://i.pinimg.com/736x/a9/f1/19/a9f11909a9644d7bfd5102fabcd8310c.jpg"
                            alt=""
                            className="absolute left-1/2 -translate-x-1/2 h-full min-w-[300px] object-cover rounded-[5px]"
                        />
                    </span>
                    <span className="text-[7.5rem] font-brier font-light tracking-[-0.02em] leading-none text-white">that</span>
                </div>

                {/* Line 3: [IMG] inspire */}
                <div className="line flex justify-center items-center gap-5">
                    <span className="img-span h-[110px] w-0 rounded-[5px] overflow-hidden relative block">
                        <img
                            src="https://i.pinimg.com/1200x/48/09/77/480977567d6b4503c8f642728f266b72.jpg"
                            alt=""
                            className="absolute left-1/2 -translate-x-1/2 h-full min-w-[300px] object-cover rounded-[5px]"
                        />
                    </span>
                    <span className="text-[7.5rem] font-brier font-light tracking-[-0.02em] leading-none text-white">inspire</span>
                </div>

                {/* Line 4: and move */}
                <div className="line flex justify-center items-center gap-5">
                    <span className="text-[7.5rem] font-brier font-light tracking-[-0.02em] leading-none text-white">and move</span>
                </div>

                {/* Line 5: people [IMG] forward. */}
                <div className="line flex justify-center items-center gap-5">
                    <span className="text-[7.5rem] font-brier font-light tracking-[-0.02em] leading-none text-white">people</span>
                    <span className="img-span h-[110px] w-0 rounded-[5px] overflow-hidden relative block">
                        <img
                            src="https://i.pinimg.com/1200x/9e/f2/b7/9ef2b73b1e2ff489f99bc0a90196fbea.jpg"
                            alt=""
                            className="absolute left-1/2 -translate-x-1/2 h-full min-w-[300px] object-cover rounded-[5px]"
                        />
                    </span>
                    <span className="text-[7.5rem] font-brier font-light tracking-[-0.02em] leading-none text-white">forward.</span>
                </div>

            </div>

            {/* Outro Spacer logic from reference */}
            <div className="outro h-screen w-full"></div>

        </section>
    )
}
