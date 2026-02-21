"use client"

import { useEffect } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.5, // slightly longer duration for buttery smooth feel
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponetial ease out
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        })

        // Standard requestAnimationFrame loop (Syncs better with Framer Motion than GSAP ticker)
        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        return () => {
            lenis.destroy()
        }
    }, [])

    return null
}
