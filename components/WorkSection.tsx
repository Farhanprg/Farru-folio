"use client"

/**
 * WORK SECTION - Exact copy from land-portfolio/SWork.astro
 * All animations and styling matched exactly
 */

import { useRef, useEffect, useState, useCallback, forwardRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SlowMo } from "gsap/EasePack"
import "./WorkSection.css"

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, SlowMo)
}

// Projects data - reduced to 7 cards for a tighter section
const works: { caption: string; site: string }[] = [
    { caption: "COMPUTECH - Main", site: "https://computech-foundation-a894d.web.app" },
    { caption: "Project 2", site: "#" },
    { caption: "Project 3", site: "#" },
    { caption: "Project 4", site: "#" },
    { caption: "Project 5", site: "#" },
    { caption: "Project 6", site: "#" },
    { caption: "Project 7", site: "#" },
]

export default function WorkSection() {
    const sectionRef = useRef<HTMLElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const maskRef = useRef<HTMLDivElement>(null)
    const sceneRef = useRef<HTMLDivElement>(null)
    const rulerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const workRefs = useRef<(HTMLDivElement | null)[]>([])
    const titleRef = useRef<HTMLHeadingElement>(null)

    const animRef = useRef({ state: 0, animationProgress: 0, pointsProgress: 0, scrollProgress: 0 })
    const lettersRef = useRef<any[]>([])
    const pointsRef = useRef<any[]>([])
    const speedRef = useRef(0)

    // Setup ghost letters (exact copy from reference)
    const setupLetters = useCallback(() => {
        if (!sceneRef.current || !containerRef.current || !titleRef.current) return
        const scene = sceneRef.current
        const container = containerRef.current

        // Remove existing ghosts
        scene.querySelectorAll('.s__scene__letter').forEach(el => el.remove())

        const letters = titleRef.current.querySelectorAll('.js-letter')
        const containerRect = container.getBoundingClientRect()
        const width = window.innerWidth
        const height = window.innerHeight

        lettersRef.current = []

        letters.forEach((letterEl, j) => {
            const bounding = letterEl.getBoundingClientRect()
            const letter = {
                el: letterEl,
                ghosts: [] as any[],
                freq: 1 + Math.random(),
                width: bounding.width,
                height: bounding.height,
                top: bounding.top - containerRect.top,
                left: bounding.left,
                total: 0
            }

            const multiplier = width > 767 ? 0.75 : 0.5
            letter.total = Math.round((width / letter.width) * multiplier) + 2

            for (let i = 0; i < letter.total; i++) {
                const el = document.createElement('span')
                el.className = 's__scene__letter js-ghost-letter'
                el.innerText = (letterEl as HTMLElement).innerText
                el.dataset.letter = (letterEl as HTMLElement).innerText

                const ghost = {
                    el,
                    i: i - letter.total * 0.5,
                    p: (i / letter.total - 0.5) * 2,
                    ap: Math.abs((i / letter.total - 0.5) * 2),
                }

                // Position like reference
                el.style.top = letter.top + 'px'
                el.style.left = letter.left + 'px'
                el.style.zIndex = String(j !== 1 && j !== 2 && (j + 4 + i) % 5 === 0 ? 3 : 1)

                // Set CSS variables for transform calculations
                el.style.setProperty('--ix', String(ghost.i))
                el.style.setProperty('--iy', String(((j + 1) / 5 - 0.5) * 2))
                el.style.setProperty('--ap', String(ghost.ap))
                el.style.setProperty('--p', String(ghost.p))
                el.style.setProperty('--progress', '0.5')

                scene.appendChild(el)
                letter.ghosts.push(ghost)
            }

            lettersRef.current.push(letter)
        })
    }, [])

    // Setup canvas points
    const setupPoints = useCallback(() => {
        const width = window.innerWidth
        const height = window.innerHeight
        const gap = 24
        const cols = Math.ceil(width * 1.2 / gap)
        const rows = Math.ceil(height * 1.2 / gap)
        const offsetX = (width - cols * gap) * 0.5
        const offsetY = (height - rows * gap) * 0.5
        const hWidth = width * 0.5
        const hHeight = height * 0.5

        pointsRef.current = []
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x = i * gap + offsetX
                const y = j * gap + offsetY
                pointsRef.current.push({ x, y, dx: hWidth - x, dy: hHeight - y, flowX: 0 })
            }
        }
    }, [])

    // Move letters based on animation progress (exact from reference moveLetters)
    const moveLetters = useCallback(() => {
        const { animationProgress, state } = animRef.current
        const speed = speedRef.current

        if (!speed) return

        lettersRef.current.forEach((letter) => {
            const letterSpeed = speed * letter.freq

            letter.ghosts.forEach((ghost: any, index: number) => {
                // Calculate progress for flowing movement
                let progress = (((animationProgress % letterSpeed) / letterSpeed + index / letter.total) % 1) / 0.7 - 0.15

                // Clamp progress
                progress = Math.max(-0.5, Math.min(1.5, progress))

                ghost.el.style.setProperty('--progress', String(progress))
            })
        })
    }, [])

    // Draw canvas points
    const drawPoints = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const { animationProgress, pointsProgress } = animRef.current

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.strokeStyle = '#C8B8A0'
        ctx.beginPath()

        pointsRef.current.forEach((p) => {
            const flowX = (animationProgress * -0.05) % 24
            const x = p.x + p.dx * (1 - pointsProgress) * 0.2 + flowX
            const y = p.y + p.dy * (1 - pointsProgress) * 0.2
            ctx.rect(x, y, 0.5, 0.5)
        })

        ctx.stroke()
    }, [])

    // Tick function
    const tick = useCallback(() => {
        if (!sceneRef.current) return
        sceneRef.current.style.setProperty('--state', String(animRef.current.state))
        moveLetters()
        drawPoints()
    }, [moveLetters, drawPoints])

    useEffect(() => {
        if (!sectionRef.current || !containerRef.current || !maskRef.current || !sceneRef.current || !rulerRef.current || !canvasRef.current) return

        const section = sectionRef.current
        const container = containerRef.current
        const mask = maskRef.current
        const scene = sceneRef.current
        const ruler = rulerRef.current
        const canvas = canvasRef.current

        // Set section height (Increased to 35vh for a more weighted, tight feel)
        section.style.setProperty('--height', works.length * 35 + 'vh')

        // Set canvas size
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        // Calculate speed
        speedRef.current = Math.hypot(window.innerWidth, window.innerHeight) * 4

        // Calculate max scale
        const rulerRect = ruler.getBoundingClientRect()
        const maxScale = window.innerWidth / (rulerRect.width / 2)

        // Setup
        setupLetters()
        setupPoints()

        // Get work elements
        const worksEls = workRefs.current.filter(Boolean) as HTMLDivElement[]

        // Create GSAP timeline (exact from reference)
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 25%',
                end: 'bottom 75%',
                scrub: 0.5, // Tighter reaction time to scroll
            },
            onUpdate: () => {
                tick()
            }
        })

        // === ENTRY (position 0) ===
        tl.fromTo(mask, { scale: 1 }, { scale: maxScale, duration: 0.75, ease: 'power4.in' }, 0)
        tl.fromTo(scene, { scale: 0.75 }, { scale: 1, duration: 0.75, ease: 'power3.in' }, 0)
        tl.fromTo(container, { clipPath: 'inset(0 1rem)' }, { clipPath: 'inset(0 0rem)', duration: 0.75, ease: 'power3.in' }, 0)
        tl.fromTo(animRef.current, { pointsProgress: 0 }, { pointsProgress: 1, duration: 1, ease: 'power4.inOut' }, 0)
        tl.fromTo(animRef.current, { state: 0 }, { state: 1, duration: 0.75, ease: 'power4.in' }, 0)

        // --- Overlay Fades (Start) ---
        tl.to('.s__overlay-start', { opacity: 0, duration: 0.5, ease: 'power2.inOut' }, 0.2)
        tl.set('.s__overlay-end', { opacity: 0 }, 0) // Ensure end is hidden at start

        // === WORKS (position 0.75) ===
        // Distribute sizes and positions like reference (deterministic pseudo-random)
        const sizeVariation = [0.55, 0.7, 0.85, 0.65, 0.9, 0.5, 0.75, 0.6, 0.8, 0.95]
        const yVariation = [0.4, 0.6, 0.3, 0.7, 0.5, 0.35, 0.65, 0.45, 0.55, 0.8]

        worksEls.forEach((el, i) => {
            const size = sizeVariation[i % sizeVariation.length]
            const y = yVariation[i % yVariation.length] * (i % 2 ? -1 : 1)
            el.style.setProperty('--size', String(size))
            el.style.setProperty('--y', String(y))
        })

        tl.fromTo(worksEls,
            { '--progress': 1 },
            { '--progress': -1, ease: 'slow(0.15, 0.6)', stagger: 0.25 },
            0.75
        )

        // animationProgress drives letter movement - exact match to reference
        // Starts at 0.75, uses full timeline duration, power1.out easing
        tl.fromTo(animRef.current,
            { animationProgress: 0 },
            { animationProgress: 10000, duration: tl.totalDuration(), ease: 'power1.out' },
            0.75
        )

        // === EXIT (position -=1) ===
        tl.fromTo(animRef.current, { state: 1 }, { state: 0, duration: 0.75, ease: 'power4.inOut', immediateRender: false }, '-=1')
        tl.fromTo(mask, { scale: maxScale }, { scale: 1, duration: 0.75, ease: 'power4.inOut', immediateRender: false }, '-=1')
        tl.fromTo(scene, { scale: 1 }, { scale: 0.75, duration: 0.75, ease: 'power3.inOut', immediateRender: false }, '-=1')
        tl.fromTo(container, { clipPath: 'inset(0 0rem)' }, { clipPath: 'inset(0 1rem)', duration: 0.75, ease: 'power3.inOut', immediateRender: false }, '-=1')
        tl.fromTo(animRef.current, { pointsProgress: 1 }, { pointsProgress: 0, duration: 1, ease: 'power4.inOut' }, '-=1')

        // --- Overlay Fades (End) ---
        tl.to('.s__overlay-end', { opacity: 1, duration: 0.5, ease: 'power2.inOut' }, '-=0.5')
        tl.to('.s__overlay-start', { opacity: 0, immediateRender: false }, '-=1') // Ensure start stays hidden

        // Resize handler
        const onResize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            speedRef.current = Math.hypot(window.innerWidth, window.innerHeight) * 4
            setupLetters()
            setupPoints()
        }

        window.addEventListener('resize', onResize)

        return () => {
            tl.kill()
            ScrollTrigger.getAll().forEach(t => t.kill())
            window.removeEventListener('resize', onResize)
        }
    }, [setupLetters, setupPoints, tick])

    return (
        <section ref={sectionRef} id="work" className="s-work relative">
            {/* Engineering Wave Transition */}
            <div className="absolute top-[-99px] left-0 w-full h-[100px] z-[5] pointer-events-none">
                <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-full translate-y-[2px]">
                    <path
                        d="M0 100 C 360 100, 350 0, 720 0 C 1050 0, 1100 100, 1440 100 V 100 H 0 Z"
                        fill="#C8B8A0"
                    />
                </svg>
            </div>
            <div className="s__outer">
                {/* Inner Container */}
                <div ref={containerRef} className="s__inner">
                    {/* Hidden title for letter positioning */}
                    <h2 ref={titleRef} className="s__title">
                        <span className="s__title__inner">
                            <span className="s__title__letter js-letter">W</span>
                            <span className="s__title__letter js-letter">O</span>
                            <span className="s__title__letter js-letter">R</span>
                            <span className="s__title__letter js-letter">K</span>
                        </span>
                    </h2>

                    {/* Scene - letters and works */}
                    <div ref={sceneRef} className="s__scene">
                        {works.map((work, i) => (
                            <WorkCard
                                key={i}
                                ref={(el) => { workRefs.current[i] = el }}
                                caption={work.caption}
                                site={work.site}
                                index={i}
                                total={works.length}
                            />
                        ))}
                    </div>

                    {/* Canvas for dot pattern */}
                    <canvas ref={canvasRef} className="s__canvas" />
                </div>

                {/* Mask Overlay */}
                <div className="s__mask-outer">
                    <div ref={maskRef} className="s__mask">
                        <MaskSVG />
                    </div>
                </div>

                {/* Ruler */}
                <div ref={rulerRef} className="s__ruler" />
            </div>

            {/* HUD Overlays - Moved to Top Level for Visibility */}
            <div className="absolute inset-0 z-[60] pointer-events-none p-8 md:p-16 flex flex-col justify-between">
                {/* START PHASE (Technical Blueprint) */}
                <div className="s__overlay-start flex justify-between items-start uppercase font-mono text-[10px] tracking-[0.2em] text-[#1a1a1a]/40">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-[#1a1a1a]/20 rounded-full animate-pulse" />
                            <span>[ PROJECT.ARCHIVE / 01 ]</span>
                        </div>
                        <div className="w-20 h-20 border-l border-t border-[#1a1a1a]/10 hidden md:block" /> {/* Illustration Slot (Start) */}
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                        <div className="font-bold">PHASE.01 <br /> SYSTEMS</div>
                        <div className="text-[7px] text-[#1a1a1a]/20 tracking-widest">40.7°N 74.0°W</div>
                    </div>
                </div>

                {/* END PHASE (Artistic Result) */}
                <div className="s__overlay-end flex justify-between items-end uppercase font-mono text-[10px] tracking-[0.2em] text-[#1a1a1a]/40">
                    <div className="space-y-4">
                        <div className="font-brier normal-case text-3xl md:text-5xl lowercase italic tracking-tighter text-[#1a1a1a]/80">Stay Engineered</div>
                        <div className="text-[8px] tracking-[0.3em] opacity-30 flex items-center gap-2">
                            <span className="w-8 h-[1px] bg-[#1a1a1a]/20" />
                            TRANSMITTING VIBES
                        </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-4">
                        <div className="w-24 h-24 rounded-full border border-[#1a1a1a]/5 hidden md:block" /> {/* Illustration Slot (End) */}
                        <div className="leading-relaxed text-[7px] md:text-[8px] opacity-60">
                            CORE: NEXT.JS 14<br />
                            ENV: DEPLOYED<br />
                            FREQ: 144.02HZ
                        </div>
                    </div>
                </div>
            </div>

            {/* Mirrored Engineering Wave (Bottom) */}
            <div className="absolute bottom-[-99px] left-0 w-full h-[100px] z-[5] pointer-events-none rotate-180">
                <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-full translate-y-[2px]">
                    <path
                        d="M0 100 C 360 100, 350 0, 720 0 C 1050 0, 1100 100, 1440 100 V 100 H 0 Z"
                        fill="#C8B8A0"
                    />
                </svg>
            </div>
        </section>
    )
}

// Work Card Component
interface WorkCardProps { caption: string; site: string; index: number; total: number }

// Pre-computed keys to avoid hydration mismatch
const precomputedKeys = [
    "A1B2", "C3D4", "E5F6", "G7H8", "I9J0", "K1L2", "M3N4", "O5P6", "Q7R8", "S9T0",
    "U1V2", "W3X4", "Y5Z6", "A7B8", "C9D0", "E1F2", "G3H4", "I5J6", "K7L8", "M9N0"
]

const WorkCard = forwardRef<HTMLDivElement, WorkCardProps>(({ caption, site, index, total }, ref) => {
    return (
        <div ref={ref} className="s__scene__work">
            <a href={site} target="_blank" rel="noopener noreferrer" className="a__link">
                {/* Image only - no caption card */}
                <div className="a__video">
                    <img
                        src="/images/hero-reveal.png"
                        alt={caption}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                </div>
            </a>
        </div>
    )
})
WorkCard.displayName = 'WorkCard'

// Mask SVG Component
function MaskSVG() {
    const [dims, setDims] = useState({ w: 0, h: 0 })
    const [paths, setPaths] = useState({ outer: '', inner: '', lines: '' })

    useEffect(() => {
        const update = () => {
            const w = window.innerWidth
            const h = window.innerHeight
            setDims({ w, h })

            // Ruler dimensions
            const pw = Math.min(w * 0.1667, 314)
            const ph = h * 0.8
            const ox = (w - pw) / 2
            const oy = h * 0.1
            const r = pw / 2

            // Outer rectangle
            const outer = `M -1 0 L ${w + 2} 0 L ${w + 2} ${h} L -1 ${h} Z`

            // Inner pill shape
            const inner = `M ${ox} ${oy + r} A ${r} ${r} 0 0 1 ${ox + pw} ${oy + r} L ${ox + pw} ${oy + ph - r} A ${r} ${r} 0 0 1 ${ox} ${oy + ph - r} Z`

            // Grid lines
            const vLines = w > 767 ? 12 : 8
            const gapX = w / vLines
            const gapY = h * 0.1
            const hLines = Math.ceil(h / gapY)
            let dLines = ''

            for (let i = 1; i < vLines; i++) {
                dLines += `M ${gapX * i} 0 L ${gapX * i} ${h} `
            }
            for (let i = 0; i < hLines; i++) {
                dLines += `M 0 ${gapY * i} L ${w} ${gapY * i} `
            }

            setPaths({
                outer: `${outer} ${inner}`,
                inner,
                lines: dLines
            })
        }

        update()
        window.addEventListener('resize', update)
        return () => window.removeEventListener('resize', update)
    }, [])

    return (
        <svg style={{ position: 'absolute', top: 0, left: 0, width: dims.w, height: dims.h }}>
            {/* Outer mask with pill cutout */}
            <path d={paths.outer} fill="#C8B8A0" fillRule="evenodd" stroke="#1a1a1a" strokeWidth="1" />
            {/* Inner border */}
            <path d={paths.outer} fill="#C8B8A0" fillRule="evenodd" stroke="#1a1a1a" strokeWidth="1" />
            {/* Grid lines */}
            <path d={paths.lines} fill="none" stroke="#1a1a1a" strokeWidth="1" opacity="0.15" />
        </svg>
    )
}
