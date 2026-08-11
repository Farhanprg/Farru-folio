"use client"

import { useRef } from "react"
import AboutSkiggle from "./AboutSkiggle"
import AboutHeader from "./AboutHeader"
import AboutImage from "./AboutImage"
import AboutSubHeader from "./AboutSubHeader"

export default function AboutSection() {
    const containerRef = useRef<HTMLDivElement>(null)

    return (
        <section 
            id="about"
            ref={containerRef} 
            className="relative w-full h-auto md:h-[150vh] bg-[#0a0a0a] overflow-x-clip flex flex-col md:block pb-24 md:pb-0 gap-12 md:gap-0 mt-16 md:mt-32"
        >
            {/* The Blue Skiggle SVG Background */}
            <AboutSkiggle targetRef={containerRef} />

            {/* Huge Staggered Header */}
            <AboutHeader />

            {/* Pinned Floating Image */}
            <AboutImage targetRef={containerRef} />

            {/* Bio and Services block on the left */}
            <AboutSubHeader />

            {/* Gradient fades for seamless blending */}
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none z-30" />
            <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none z-30" />
        </section>
    )
}
