"use client"

import { motion } from "framer-motion"

export default function SignatureMarquee() {
    return (
        <div className="relative w-full h-[60vh] flex flex-col items-center justify-center z-0 overflow-hidden">
            <div className="w-full flex flex-col gap-0 py-10 select-none pointer-events-none">

                {/* Top Line - Moving Right */}
                <div className="w-full overflow-hidden flex">
                    <motion.div
                        className="flex whitespace-nowrap"
                        animate={{ x: [-1000, 0] }} // Moving right
                        transition={{
                            x: {
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: "loop",
                                duration: 35,
                                ease: "linear",
                            },
                        }}
                    >
                        {[...Array(6)].map((_, i) => (
                            <h2
                                key={i}
                                className="text-white text-[12vw] md:text-[8vw] font-brier leading-[0.8] opacity-10 tracking-tight px-4"
                            >
                                I'M A • I'M A • I'M A • I'M A •
                            </h2>
                        ))}
                    </motion.div>
                </div>

                {/* Bottom Line - Moving Left */}
                <div className="w-full overflow-hidden flex">
                    <motion.div
                        className="flex whitespace-nowrap"
                        animate={{ x: [0, -1000] }} // Moving left
                        transition={{
                            x: {
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: "loop",
                                duration: 30,
                                ease: "linear",
                            },
                        }}
                    >
                        {[...Array(6)].map((_, i) => (
                            <h2
                                key={i}
                                className="text-white text-[18vw] md:text-[14vw] font-brier leading-[0.8] uppercase tracking-tighter px-4"
                            >
                                VIBE ENGINEER • VIBE ENGINEER •
                            </h2>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Subtle Gradient Shadow to blend edges */}
            <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
        </div>
    )
}
