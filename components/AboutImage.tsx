"use client"

import React, { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"

export default function AboutImage({ targetRef }: { targetRef: React.RefObject<HTMLElement> }) {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"]
    })

    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"])

    return (
        <motion.div
            ref={ref}
            style={{ scale, y }}
            className="relative md:absolute mx-auto md:mx-0 mt-8 md:mt-0 md:top-[45vh] md:right-20 lg:right-32 z-30 w-[85vw] md:w-[35vw] max-w-[24rem] md:max-w-[856px] aspect-[3/4] md:aspect-[856/1024] overflow-hidden rounded-3xl"
        >
            <Image
                src="/images/next_hero.jpeg"
                alt="Featured Portrait"
                fill
                priority
                sizes="(max-width: 768px) 80vw, 40vw"
                className="object-cover border-2 border-white/5 shadow-2xl"
            />
        </motion.div>
    )
}
