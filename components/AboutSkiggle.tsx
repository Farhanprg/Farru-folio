"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"

export default function AboutSkiggle({ targetRef }: { targetRef: React.RefObject<HTMLElement | null> }) {
    const pathRef = useRef<SVGPathElement>(null)
    const [pathLength, setPathLength] = useState(4291)

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start 80%", "center center"]
    })

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 30,
        damping: 15,
        restDelta: 0.001
    })

    const dashOffset = useTransform(
        smoothProgress,
        [0, 1],
        [-pathLength, 0]
    )

    useEffect(() => {
        if (pathRef.current) {
            const length = pathRef.current.getTotalLength()
            setPathLength(length)
            pathRef.current.style.strokeDasharray = `${length}`
        }
    }, [])

    return (
        <svg
            className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[120vw] h-[120%] z-0 pointer-events-none opacity-40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <motion.path
                ref={pathRef}
                d="M1588 1052.5C1563.5 1002.5 1503.4 1295.7 1413 1288.5C1300 1279.5 1318.5 976.5 1145.5 942.5C972.5 908.501 1011.5 1109.5 827 1142.5C642.5 1175.5 640.5 963.5 366 804C146.4 676.4 73.1667 792.5 64 866.5C65.5 916.5 106.8 1011.8 260 993C396 976.311 647.5 927.5 677.5 547.5C707.5 167.5 246.5 -47 82.5 66C-81.5 179 -189.5 31.5 -189.5 31.5"
                style={{
                    strokeDashoffset: dashOffset,
                    strokeWidth: 50,
                    strokeLinecap: "round",
                }}
                stroke="url(#paint0_linear_5_4)"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_5_4"
                    x1="35"
                    y1="-17"
                    x2="605"
                    y2="444"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#0016EC" />
                    <stop offset="1" stopColor="#4A83FF" stopOpacity="1" />
                </linearGradient>
            </defs>
        </svg>
    )
}
