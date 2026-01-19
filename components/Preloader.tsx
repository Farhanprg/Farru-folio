"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import SplitText from "./SplitText"

export default function Preloader() {
    const [isVisible, setIsVisible] = useState(true)

    const handleAnimationComplete = () => {
        console.log('All letters have animated!');
    };

    useEffect(() => {
        document.body.style.overflow = "hidden"

        const timer = setTimeout(() => {
            setIsVisible(false)
            document.body.style.overflow = "unset"
        }, 2500)

        return () => {
            clearTimeout(timer)
            document.body.style.overflow = "unset"
        }
    }, [])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 0 }}
                    exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a] text-white"
                >
                    <div className="flex flex-col items-center gap-2">
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-xl md:text-2xl font-arabic text-white/50 mb-1"
                            dir="rtl"
                        >
                            اَلسَّلَامُ عَلَيْكُمْ
                        </motion.span>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="text-xs md:text-sm font-bold uppercase tracking-[0.6em] text-white/40 mb-4"
                        >
                            THIS IS
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.1 }}
                            className="relative flex items-center justify-center overflow-hidden"
                        >
                            <SplitText
                                text="FARRU"
                                className="text-[90px] md:text-[150px] lg:text-[200px] font-brier leading-none uppercase tracking-tighter"
                                delay={40}
                                onLetterAnimationComplete={handleAnimationComplete}
                                tag="h1"
                                from={{ opacity: 0, y: 100 }}
                                to={{ opacity: 1, y: 0 }}
                            />
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="absolute bottom-12 text-xs md:text-sm font-bold tracking-[0.4em] uppercase opacity-60"
                    >

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
