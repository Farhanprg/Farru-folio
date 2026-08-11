"use client"

import React, { useRef } from "react"
import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion"

export default function AboutHeader() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-10% 0px" })
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 80%", "center center"]
    })

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 40,
        damping: 15,
        restDelta: 0.001
    })

    return (
        <div 
            ref={ref} 
            className="w-full z-10 relative px-4 md:px-0 font-semibold text-5xl sm:text-6xl md:text-[8rem] text-center leading-[0.95] md:leading-none tracking-tighter flex flex-col items-center justify-center mt-12 md:mt-24"
        >
            <div className="overflow-hidden h-[1.2em] flex justify-center">
                <motion.div
                    initial={{ y: "100%", opacity: 0 }}
                    animate={isInView ? { y: "0%", opacity: 1 } : { y: "100%", opacity: 0 }}
                    transition={{ 
                        y: { duration: 0.6, ease: [0.33, 1, 0.68, 1] },
                        opacity: { duration: 0.6 },
                        x: { duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] } 
                    }}
                    className="flex flex-wrap md:flex-nowrap justify-center"
                >
                    <div className="text-white">Building&nbsp;</div>
                    <div className="text-white">Real&nbsp;</div>
                </motion.div>
            </div>
            
            <div className="overflow-hidden h-[1.2em]">
                <motion.div
                    initial={{ y: "100%", opacity: 0 }}
                    animate={isInView ? { y: "0%", opacity: 1 } : { y: "100%", opacity: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: [0.33, 1, 0.68, 1] }}
                    className="flex flex-wrap md:flex-nowrap justify-center"
                >
                    <div className="text-white">Digital&nbsp;</div>
                    <div className="text-white">Systems</div>
                </motion.div>
            </div>
        </div>
    )
}
