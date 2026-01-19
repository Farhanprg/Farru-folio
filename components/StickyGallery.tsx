"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const projects = [
    {
        id: 1,
        title: "COMPUTECH",
        category: "EDUCATION PLATFORM",
        img: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2070&auto=format&fit=crop", // Tech/Code vibe
        link: "https://computech-foundation-a894d.web.app"
    },
    {
        id: 2,
        title: "COMING SOON",
        category: "IN DEVELOPMENT",
        img: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop",
        link: "#"
    },
    {
        id: 3,
        title: "AERO LABS",
        category: "INTERFACE CONCEPT",
        img: "https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=1976&auto=format&fit=crop",
        link: "#"
    },
    {
        id: 4,
        title: "FLUX ENGINE",
        category: "EXPERIMENT",
        img: "https://images.unsplash.com/photo-1633167606207-d840b5070861?q=80&w=1974&auto=format&fit=crop",
        link: "#"
    }
]

export default function StickyGallery() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    return (
        <section ref={containerRef} className="relative bg-[#0a0a0a] pb-[20vh]">
            <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20">

                    {/* LEFT COLUMN: STACKING CARDS */}
                    <div className="flex flex-col pt-[15vh]">
                        {projects.map((project, index) => (
                            // STICKY WRAPPER: This creates the stacking effect
                            <div key={project.id} className="sticky top-[15vh] h-[80vh] flex items-start mb-[10vh]">
                                <ProjectCard project={project} index={index} />
                            </div>
                        ))}
                    </div>

                    {/* RIGHT COLUMN: STICKY INFO */}
                    <div className="hidden lg:flex flex-col justify-center h-screen sticky top-0">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-12 pl-12 border-l border-white/10"
                        >
                            <div className="overflow-hidden">
                                <h2 className="text-[5vw] leading-[0.9] font-black font-brier text-white uppercase tracking-tighter">
                                    Digital<br />
                                    <span className="text-gray-500 font-brier">Artifacts</span>
                                </h2>
                            </div>

                            <p className="text-xl text-gray-400 max-w-md leading-relaxed font-sans">
                                A curated selection of high-performance web experiences.
                                Blending technical precision with audio-visual immersion.
                            </p>

                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4 text-white/60">
                                    <span className="w-2 h-2 rounded-full bg-green-500" />
                                    <span className="text-sm uppercase tracking-widest font-mono">Available for hire</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    )
}

function ProjectCard({ project, index }: { project: any, index: number }) {
    // Generate a different background color gradient for each card for visual distinction
    const gradients = [
        "from-purple-900/20 to-blue-900/20",
        "from-emerald-900/20 to-teal-900/20",
        "from-orange-900/20 to-red-900/20",
        "from-pink-900/20 to-rose-900/20"
    ]

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative w-full aspect-[3/4] md:aspect-[4/3] rounded-[40px] overflow-hidden border border-white/10 bg-[#111] group"
        >
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full cursor-none">
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]} opacity-40`} />

                {/* Image Container */}
                <div className="relative w-full h-full overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    <motion.img
                        src={project.img}
                        alt={project.title}
                        className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 transform hover:scale-105"
                    />
                </div>

                {/* Floating Title */}
                <div className="absolute bottom-8 left-8 z-20">
                    <h3 className="text-4xl md:text-6xl font-black font-brier text-white uppercase tracking-tighter drop-shadow-lg group-hover:scale-105 transition-transform duration-500 origin-bottom-left">
                        {project.title}
                    </h3>
                </div>

                <div className="absolute top-8 right-8 z-20">
                    <div className="flex items-center gap-2">
                        <span className="bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs uppercase tracking-widest border border-white/10 font-mono group-hover:bg-white group-hover:text-black transition-colors duration-300">
                            {project.category}
                        </span>
                        {project.link !== "#" && (
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                <span className="text-black text-xl">↗</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Number Watermark */}
                <div className="absolute top-4 left-6 z-20 opacity-30">
                    <h3 className="text-8xl font-black font-brier text-white/10 uppercase tracking-tighter">
                        0{index + 1}
                    </h3>
                </div>
            </a>
        </motion.div>
    )
}
