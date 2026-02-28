"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

// Exact SVG Mask from Lorenzo project (Smooth box/rounded rect)
const SVG_MASK = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 250' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='10' y='10' width='180' height='230' rx='20' ry='20' fill='%23000'/%3E%3C/svg%3E")`

interface InteractiveRevealProps {
    topSrc: string
    bottomSrc: string
    className?: string
}

export default function InteractiveReveal({ topSrc, bottomSrc, className = "" }: InteractiveRevealProps) {
    const [isHovered, setIsHovered] = useState(false)
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
    const containerRef = useRef<HTMLDivElement>(null)

    // Two canvases: One to display the final result, one hidden to acts as a mask map
    const displayCanvasRef = useRef<HTMLCanvasElement>(null)
    const maskCanvasRef = useRef<HTMLCanvasElement>(null)

    const topImageRef = useRef<HTMLImageElement | null>(null)
    const bottomImageRef = useRef<HTMLImageElement | null>(null)

    const lastMousePos = useRef<{ x: number; y: number } | null>(null)
    const lastScrubTime = useRef<number>(0)

    const BRUSH_SIZE = 120
    const BRUSH_HARDNESS = 0.2

    useEffect(() => {
        // Top image (which gets wiped away)
        const topImg = document.createElement("img")
        topImg.src = topSrc
        topImg.onload = () => {
            topImageRef.current = topImg
            renderFrame()
        }

        // Bottom image (which is revealed underneath)
        const bottomImg = document.createElement("img")
        bottomImg.src = bottomSrc
        bottomImg.onload = () => {
            bottomImageRef.current = bottomImg
            renderFrame()
        }
    }, [topSrc, bottomSrc])

    useEffect(() => {
        const displayCanvas = displayCanvasRef.current
        const maskCanvas = maskCanvasRef.current
        if (!displayCanvas || !maskCanvas || !containerRef.current) return

        const resizeCanvas = () => {
            const width = containerRef.current!.clientWidth
            const height = containerRef.current!.clientHeight

            // Lorenzo does not use DPR scaling, matches container exactly
            displayCanvas.width = width
            displayCanvas.height = height
            maskCanvas.width = width
            maskCanvas.height = height

            renderFrame()
        }

        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)
        return () => window.removeEventListener("resize", resizeCanvas)
    }, [])

    // Exact auto heal loop logic from Lorenzo, with 1sec delay
    useEffect(() => {
        let animationFrameId: number
        const fadeLoop = () => {
            if (Date.now() - lastScrubTime.current > 1000) {
                const maskCanvas = maskCanvasRef.current
                const maskCtx = maskCanvas?.getContext("2d")
                if (maskCtx && maskCanvas) {
                    maskCtx.globalCompositeOperation = "destination-out"
                    maskCtx.fillStyle = "rgba(0, 0, 0, 0.01)" // VERY slow heal
                    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height)
                    maskCtx.globalCompositeOperation = "source-over"
                    renderFrame()
                }
            }
            animationFrameId = requestAnimationFrame(fadeLoop)
        }
        fadeLoop()
        return () => cancelAnimationFrame(animationFrameId)
    }, [])

    const renderFrame = () => {
        const displayCanvas = displayCanvasRef.current
        const maskCanvas = maskCanvasRef.current
        const displayCtx = displayCanvas?.getContext("2d")

        if (!displayCtx || !displayCanvas || !maskCanvas) return
        if (!topImageRef.current || !bottomImageRef.current) return

        const width = displayCanvas.width
        const height = displayCanvas.height

        displayCtx.clearRect(0, 0, width, height)

        const topImg = topImageRef.current
        const bottomImg = bottomImageRef.current

        // Exact sizing Lorenzo uses (max scale center alignment)
        const scaleTop = Math.max(width / topImg.width, height / topImg.height)
        const xTop = (width - topImg.width * scaleTop) / 2
        const yTop = (height - topImg.height * scaleTop) / 2

        const scaleBottom = Math.max(width / bottomImg.width, height / bottomImg.height)
        const xBottom = (width - bottomImg.width * scaleBottom) / 2
        const yBottom = (height - bottomImg.height * scaleBottom) / 2

        displayCtx.save()
        // 1. Draw the hidden mask map
        displayCtx.globalCompositeOperation = "source-over"
        displayCtx.drawImage(maskCanvas, 0, 0)

        // 2. Draw Top Image (the 'mud') - out where mask exists
        displayCtx.globalCompositeOperation = "source-out"
        displayCtx.drawImage(topImg, xTop, yTop, topImg.width * scaleTop, topImg.height * scaleTop)

        // 3. Draw Bottom Image (clean Lorenzo) - behind everything
        displayCtx.globalCompositeOperation = "destination-over"
        displayCtx.drawImage(bottomImg, xBottom, yBottom, bottomImg.width * scaleBottom, bottomImg.height * scaleBottom)
        displayCtx.restore()
    }

    // Exact Brush from Lorenzo
    const drawBrush = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
        ctx.globalCompositeOperation = "source-over"
        const gradient = ctx.createRadialGradient(x, y, BRUSH_SIZE * BRUSH_HARDNESS, x, y, BRUSH_SIZE / 2)
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)")
        gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.5)")
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)")
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, BRUSH_SIZE / 2, 0, Math.PI * 2)
        ctx.fill()
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | React.PointerEvent<HTMLDivElement>) => {
        if (!containerRef.current || !maskCanvasRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const currentX = e.clientX - rect.left
        const currentY = e.clientY - rect.top

        setCursorPos({ x: currentX, y: currentY })

        const maskCtx = maskCanvasRef.current.getContext("2d")
        if (!maskCtx) return

        if (lastMousePos.current) {
            const { x: lastX, y: lastY } = lastMousePos.current
            const dist = Math.hypot(currentX - lastX, currentY - lastY)
            const angle = Math.atan2(currentY - lastY, currentX - lastX)
            const step = 5
            for (let i = 0; i < dist; i += step) {
                const interpX = lastX + Math.cos(angle) * i
                const interpY = lastY + Math.sin(angle) * i
                drawBrush(maskCtx, interpX, interpY)
            }
        } else {
            drawBrush(maskCtx, currentX, currentY)
        }
        lastMousePos.current = { x: currentX, y: currentY }
        lastScrubTime.current = Date.now()
        renderFrame()
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
        lastMousePos.current = null
    }

    return (
        <div
            ref={containerRef}
            className={`relative w-full h-full select-none touch-none group cursor-crosshair bg-[#111] overflow-hidden rounded-[inherit] ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            onPointerMove={handleMouseMove}
            onPointerLeave={handleMouseLeave}
            style={{
                // 1-to-1 exact CSS trick Lorenzo uses for shadows matching svg
                WebkitMaskImage: SVG_MASK,
                maskImage: SVG_MASK,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
            }}
        >
            <canvas ref={displayCanvasRef} className="absolute inset-0 w-full h-full z-10" />
            <canvas ref={maskCanvasRef} className="hidden" />

            {/* The Cleaning Cloth */}
            {isHovered && (
                <motion.div
                    className="absolute z-50 pointer-events-none"
                    style={{
                        width: 200,
                        height: 200,
                        x: cursorPos.x - 100,
                        y: cursorPos.y - 100,
                    }}
                >
                    <Image
                        src="/images/panov0.png"
                        alt="Cleaning Cloth"
                        width={200}
                        height={200}
                        className="w-full h-full object-contain drop-shadow-2xl rotate-12"
                    />
                </motion.div>
            )}
        </div>
    )
}
