"use client"

import React, { useRef, useEffect } from "react"
import * as THREE from "three"

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D u_texture;
  uniform vec2 u_mouse;
  uniform vec2 u_prevMouse;

  void main() {
    vec2 gridUV = floor(vUv * vec2(40.0, 40.0)) / vec2(40.0, 40.0);
    vec2 centerOfPixel = gridUV + vec2(1.0/40.0, 1.0/40.0);

    vec2 mouseDirection = u_mouse - u_prevMouse;

    vec2 pixelToMouseDirection = centerOfPixel - u_mouse;
    float pixelDistanceToMouse = length(pixelToMouseDirection);
    float strength = smoothstep(0.3, 0.0, pixelDistanceToMouse);

    vec2 uvOffset = strength * -mouseDirection * 0.4;
    vec2 uv = vUv - uvOffset;

    vec4 color = texture2D(u_texture, uv);
    gl_FragColor = color;
  }
`

function createTextTexture(text: string, font: string, textColor: string) {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!

    const canvasWidth = window.innerWidth * 2
    const canvasHeight = window.innerHeight * 2

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // Make background fully transparent
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const fontSize = Math.floor(canvasWidth * 0.12) // 24vw, making it fit properly on screen

    ctx.fillStyle = textColor
    ctx.font = `100 ${fontSize}px "${font}"`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"

    // Since we want two lines, split the string at \n (if any) or just render manually
    const lines = text.split(/\\n|\n/) // handle raw literal passed as string
    const lineHeight = fontSize * 0.85
    const totalHeight = lineHeight * lines.length

    const startY = (canvasHeight / 2) - (totalHeight / 2) + (lineHeight / 2)

    lines.forEach((line, index) => {
        // Add strokes for style
        ctx.strokeStyle = textColor
        ctx.lineWidth = fontSize * 0.005
        for (let i = 0; i < 3; i++) {
            ctx.strokeText(line, canvasWidth / 2, startY + (index * lineHeight))
        }
        ctx.fillText(line, canvasWidth / 2, startY + (index * lineHeight))
    })

    const texture = new THREE.CanvasTexture(canvas)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    return texture
}

interface TextHoverShaderProps {
    text: string
    className?: string
}

export default function TextHoverShader({ text, className = "" }: TextHoverShaderProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!containerRef.current) return

        const container = containerRef.current
        let easeFactor = 0.02
        let mousePosition = { x: 0.5, y: 0.5 }
        let targetMousePosition = { x: 0.5, y: 0.5 }
        let prevPosition = { x: 0.5, y: 0.5 }

        const scene = new THREE.Scene()

        const aspectRatio = window.innerWidth / window.innerHeight
        const camera = new THREE.OrthographicCamera(-1, 1, 1 / aspectRatio, -1 / aspectRatio, 0.1, 1000)
        camera.position.z = 1

        const texture = createTextTexture(text, "Brier", "#ffffff") // Full white text

        const shaderUniforms = {
            u_mouse: { type: "v2", value: new THREE.Vector2() },
            u_prevMouse: { type: "v2", value: new THREE.Vector2() },
            u_texture: { type: "t", value: texture },
        }

        const material = new THREE.ShaderMaterial({
            uniforms: shaderUniforms,
            vertexShader,
            fragmentShader,
            transparent: true, // IMPORTANT for transparent canvas
        })

        const planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
        scene.add(planeMesh)

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }) // alpha true
        renderer.setClearColor(0x000000, 0) // Fully transparent background
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(window.devicePixelRatio)

        container.appendChild(renderer.domElement)

        let animationFrameId: number
        const animateScene = () => {
            animationFrameId = requestAnimationFrame(animateScene)

            mousePosition.x += (targetMousePosition.x - mousePosition.x) * easeFactor
            mousePosition.y += (targetMousePosition.y - mousePosition.y) * easeFactor

            planeMesh.material.uniforms.u_mouse.value.set(mousePosition.x, 1.0 - mousePosition.y)
            planeMesh.material.uniforms.u_prevMouse.value.set(prevPosition.x, 1.0 - prevPosition.y)

            renderer.render(scene, camera)
        }

        animateScene()

        const handleMouseMove = (event: MouseEvent) => {
            easeFactor = 0.035
            const rect = container.getBoundingClientRect()
            prevPosition = { ...targetMousePosition }

            targetMousePosition.x = (event.clientX - rect.left) / rect.width
            targetMousePosition.y = (event.clientY - rect.top) / rect.height
        }

        const handleMouseEnter = (event: MouseEvent) => {
            easeFactor = 0.01
            const rect = container.getBoundingClientRect()
            mousePosition.x = targetMousePosition.x = (event.clientX - rect.left) / rect.width
            mousePosition.y = targetMousePosition.y = (event.clientY - rect.top) / rect.height
        }

        const handleMouseLeave = () => {
            easeFactor = 0.01
            targetMousePosition = { ...prevPosition }
        }

        container.addEventListener("mousemove", handleMouseMove)
        container.addEventListener("mouseenter", handleMouseEnter)
        container.addEventListener("mouseleave", handleMouseLeave)

        const onWindowResize = () => {
            const newAspectRatio = window.innerWidth / window.innerHeight
            camera.left = -1
            camera.right = 1
            camera.top = 1 / newAspectRatio
            camera.bottom = -1 / newAspectRatio
            camera.updateProjectionMatrix()

            renderer.setSize(window.innerWidth, window.innerHeight)

            const newTexture = createTextTexture(text, "Brier", "#ffffff")
            planeMesh.material.uniforms.u_texture.value = newTexture
        }

        window.addEventListener("resize", onWindowResize)

        return () => {
            cancelAnimationFrame(animationFrameId)
            window.removeEventListener("resize", onWindowResize)
            container.removeEventListener("mousemove", handleMouseMove)
            container.removeEventListener("mouseenter", handleMouseEnter)
            container.removeEventListener("mouseleave", handleMouseLeave)

            texture.dispose()
            material.dispose()
            planeMesh.geometry.dispose()
            renderer.dispose()
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement)
            }
        }
    }, [text])

    return <div ref={containerRef} className={`w-full h-full ${className}`} />
}
