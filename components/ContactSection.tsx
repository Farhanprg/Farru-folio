"use client"

import React, { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowUpRight, Instagram } from "lucide-react"

const EMAIL = "farhanmohammedd50@gmail.com"
const GITHUB_URL = "https://github.com/Farhan-source-lab"
const WHATSAPP_URL = "https://wa.me/918328390911"
const INSTA_URL = "https://instagram.com/Texch.ai"

export default function ContactSection() {
    const sectionRef = useRef<HTMLElement>(null)
    const eyebrowRef = useRef<HTMLDivElement>(null)
    const headlineRef = useRef<HTMLHeadingElement>(null)
    const emailRef = useRef<HTMLAnchorElement>(null)
    const ctaRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (typeof window === "undefined") return
        gsap.registerPlugin(ScrollTrigger)

        if (!sectionRef.current) return

        const ctx = gsap.context(() => {
            const eyebrowChars = eyebrowRef.current?.querySelectorAll(".ct-char") || []
            const headlineChars = headlineRef.current?.querySelectorAll(".ct-char") || []

            gsap.from(eyebrowChars, {
                opacity: 0,
                y: 40,
                duration: 1.0,
                stagger: { amount: 0.4, from: "start" },
                ease: "power3.out",
                scrollTrigger: {
                    trigger: eyebrowRef.current,
                    start: "top 90%",
                    toggleActions: "play none none reverse",
                },
            })

            gsap.from(headlineChars, {
                opacity: 0,
                y: 200,
                duration: 1.4,
                stagger: { amount: 0.6, from: "start" },
                ease: "power3.out",
                scrollTrigger: {
                    trigger: headlineRef.current,
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                },
            })

            gsap.from([emailRef.current, ctaRef.current], {
                autoAlpha: 0,
                y: 50,
                duration: 1,
                stagger: 0.15,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: emailRef.current,
                    start: "top 95%",
                    toggleActions: "play none none reverse",
                },
            })
        }, sectionRef.current)

        return () => ctx.revert()
    }, [])

    const splitChars = (text: string) =>
        text.split("").map((char, i) => (
            <span key={i} className="ct-char inline-block will-change-transform">
                {char === " " ? "\u00A0" : char}
            </span>
        ))

    return (
        <section
            id="contact-section"
            ref={sectionRef}
            className="w-full h-[90vh] bg-[#0a0a0a] relative overflow-hidden flex flex-col items-center justify-center text-center px-4 md:px-[6vw] gap-4 md:gap-[1vw]"
        >
            <div
                ref={eyebrowRef}
                className="text-white/50 text-xs md:text-sm lg:text-[1vw] font-medium tracking-[0.2em] md:tracking-[0.22em] uppercase pointer-events-none whitespace-nowrap mb-2 md:mb-[0.4vw]"
            >
                {splitChars("have a project in mind?")}
            </div>

            <h2
                ref={headlineRef}
                className="font-brier text-white text-[clamp(4rem,18vw,18rem)] font-semibold tracking-[-0.07em] lowercase pointer-events-none whitespace-nowrap leading-[0.9] m-0"
            >
                {splitChars("Let's talk.")}
            </h2>

            <a
                href={`mailto:${EMAIL}`}
                ref={emailRef}
                className="text-white text-base md:text-[1.4vw] font-medium tracking-[-0.01em] border-b-[1.5px] border-current pb-1 md:pb-[0.2vw] mt-4 md:mt-[1vw] transition-colors duration-300 hover:text-[#D1FF1C] hover:border-[#D1FF1C]"
                aria-label={`Email ${EMAIL}`}
            >
                {EMAIL}
            </a>

            <div
                ref={ctaRef}
                className="flex items-center gap-4 md:gap-[1vw] mt-8 md:mt-[1.6vw] flex-wrap justify-center"
            >
                <a
                    href={`${WHATSAPP_URL}?text=Hi%20Farhan!`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 md:px-[2vw] h-12 md:h-[4vw] min-h-[48px] rounded-full bg-white text-black border-2 border-white hover:bg-[#D1FF1C] hover:border-[#D1FF1C] font-semibold text-xs md:text-[0.85vw] tracking-[0.22em] uppercase transition-all duration-400 hover:-translate-y-1 group"
                >
                    <span>SAY HELLO</span>
                    <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 md:px-[2vw] h-12 md:h-[4vw] min-h-[48px] rounded-full bg-transparent text-white border-2 border-white hover:bg-white/10 hover:border-white/10 font-semibold text-xs md:text-[0.85vw] tracking-[0.22em] uppercase transition-all duration-400 hover:-translate-y-1 group"
                >
                    <span>GITHUB</span>
                    <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a
                    href={INSTA_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 md:px-[2vw] h-12 md:h-[4vw] min-h-[48px] rounded-full bg-transparent text-white border-2 border-white hover:bg-[#E1306C]/20 hover:border-[#E1306C] font-semibold text-xs md:text-[0.85vw] tracking-[0.22em] uppercase transition-all duration-400 hover:-translate-y-1 group"
                >
                    <span>INSTAGRAM</span>
                    <Instagram className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:scale-110" />
                </a>
            </div>

            <div className="absolute bottom-8 left-0 w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-12 text-white/40 text-[10px] md:text-xs tracking-widest font-mono gap-4">
                <div className="flex gap-6">
                    <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">WHATSAPP: +91 8328390911</a>
                    <a href={INSTA_URL} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">IG: TEXCH.AI</a>
                </div>
                <div>© {new Date().getFullYear()} MOHAMMED FARHAN</div>
            </div>
        </section>
    )
}
