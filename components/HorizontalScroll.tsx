"use client"

import React, { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const TEXT = "I Craft Digital Experiences That Make Users start Scrolling."

export default function HorizontalScroll() {
    const wrapperRef = useRef<HTMLDivElement>(null)
    const stickyRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLHeadingElement>(null)

    useEffect(() => {
        if (typeof window === "undefined") return
        gsap.registerPlugin(ScrollTrigger)

        const wrapper = wrapperRef.current
        const sticky = stickyRef.current
        const text = textRef.current
        if (!wrapper || !sticky || !text) return

        const ctx = gsap.context(() => {
            const chars = text.querySelectorAll(".hs-char")

            const getPinDistance = () => {
                const textWidth = text.scrollWidth
                const viewport = window.innerWidth
                const travel = Math.max(textWidth - viewport * 0.1, viewport)
                return travel
            }

            const scrollTween = gsap.to(text, {
                xPercent: -110,
                ease: "none",
                scrollTrigger: {
                    trigger: sticky,
                    start: "top top",
                    end: () => "+=" + getPinDistance(),
                    scrub: 0.5,
                    pin: sticky,
                    pinSpacing: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                },
            })

            chars.forEach((char) => {
                gsap.from(char, {
                    yPercent: gsap.utils.random(-200, 200),
                    rotation: gsap.utils.random(-20, 20),
                    ease: "back.out(1.2)",
                    scrollTrigger: {
                        trigger: char,
                        containerAnimation: scrollTween,
                        start: "left 100%",
                        end: "left 30%",
                        scrub: 1,
                    },
                })
            })
        }, wrapper)

        return () => ctx.revert()
    }, [])

    const renderText = () => {
        return TEXT.split(" ").map((word, wi, arr) => (
            <span key={wi} className="hs-word inline-block whitespace-nowrap">
                {word.split("").map((char, ci) => (
                    <span key={ci} className="hs-char inline-block will-change-transform">
                        {char}
                    </span>
                ))}
                {wi < arr.length - 1 && (
                    <span className="hs-char inline-block will-change-transform">&nbsp;</span>
                )}
            </span>
        ))
    }

    return (
        <section className="relative w-full h-auto bg-[#0a0a0a] z-0" ref={wrapperRef}>
            <div className="relative top-0 w-full h-screen flex items-center overflow-hidden bg-[#0a0a0a]" ref={stickyRef}>
                <h3
                    className="flex w-max whitespace-nowrap gap-[4vw] pl-[100vw] font-brier pointer-events-none m-0 font-semibold leading-[1.1] text-white tracking-[-0.07em] lowercase text-[clamp(3rem,14vw,12rem)]"
                    ref={textRef}
                >
                    {renderText()}
                </h3>
            </div>
        </section>
    )
}
