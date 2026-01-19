"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function InteractivePortrait() {
    const containerRef = useRef<HTMLDivElement>(null)
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
    const animationFrameRef = useRef<number>(0)

    useEffect(() => {
        if (!containerRef.current) return

        const container = containerRef.current
        const width = container.clientWidth
        const height = container.clientHeight

        const gu = {
            time: { value: 0 },
            dTime: { value: 0 },
            aspect: { value: width / height },
        }

        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0x0a0a0a)

        const camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0.1, 1000)
        camera.position.z = 1

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(width, height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        container.appendChild(renderer.domElement)
        rendererRef.current = renderer

        class Blob {
            renderer: THREE.WebGLRenderer
            fbTexture: { value: THREE.FramebufferTexture }
            rtOutput: THREE.WebGLRenderTarget
            uniforms: {
                pointer: { value: THREE.Vector2 }
                pointerDown: { value: number }
                pointerRadius: { value: number }
                pointerDuration: { value: number }
            }
            rtScene: THREE.Mesh
            rtCamera: THREE.Camera

            constructor(renderer: THREE.WebGLRenderer) {
                this.renderer = renderer
                this.fbTexture = { value: new THREE.FramebufferTexture(width, height) }
                this.rtOutput = new THREE.WebGLRenderTarget(width, height)
                this.uniforms = {
                    pointer: { value: new THREE.Vector2().setScalar(10) },
                    pointerDown: { value: 1 },
                    pointerRadius: { value: 0.35 },
                    pointerDuration: { value: 2.0 },
                }

                const handleMouseMove = (event: MouseEvent) => {
                    const rect = container.getBoundingClientRect()
                    this.uniforms.pointer.value.x = ((event.clientX - rect.left) / width) * 2 - 1
                    this.uniforms.pointer.value.y = -((event.clientY - rect.top) / height) * 2 + 1
                }

                const handleMouseLeave = () => {
                    this.uniforms.pointer.value.setScalar(10)
                }

                container.addEventListener("mousemove", handleMouseMove)
                container.addEventListener("mouseleave", handleMouseLeave)

                const mat = new THREE.MeshBasicMaterial({ color: 0x000000 })
                mat.onBeforeCompile = (shader: any) => {
                    shader.uniforms.dTime = gu.dTime
                    shader.uniforms.aspect = gu.aspect
                    shader.uniforms.pointer = this.uniforms.pointer
                    shader.uniforms.pointerDown = this.uniforms.pointerDown
                    shader.uniforms.pointerRadius = this.uniforms.pointerRadius
                    shader.uniforms.pointerDuration = this.uniforms.pointerDuration
                    shader.uniforms.fbTexture = this.fbTexture
                    shader.uniforms.time = gu.time
                    shader.fragmentShader = `
            uniform float dTime, aspect, pointerDown, pointerRadius, pointerDuration, time;
            uniform vec2 pointer;
            uniform sampler2D fbTexture;
            float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
            float noise(vec2 p) {
              vec2 i = floor(p); vec2 f = fract(p); f = f*f*(3.0-2.0*f);
              float a = hash(i); float b = hash(i + vec2(1.,0.)); float c = hash(i + vec2(0.,1.)); float d = hash(i + vec2(1.,1.));
              return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
            }
            ${shader.fragmentShader}
          `.replace(
                        `#include <color_fragment>`,
                        `#include <color_fragment>
            float rVal = texture2D(fbTexture, vUv).r;
            rVal -= clamp(dTime / pointerDuration, 0., 0.05);
            rVal = clamp(rVal, 0., 1.);
            float f = 0.;
            if (pointerDown > 0.5) {
              vec2 uv = (vUv - 0.5) * 2. * vec2(aspect, 1.);
              vec2 mouse = pointer * vec2(aspect, 1.);
              vec2 toMouse = uv - mouse;
              float angle = atan(toMouse.y, toMouse.x);
              float dist = length(toMouse);
              float noiseVal = noise(vec2(angle*3. + time*0.5, dist*5.));
              float noiseVal2 = noise(vec2(angle*5. - time*0.3, dist*3. + time));
              float radiusVariation = 0.7 + noiseVal*0.5 + noiseVal2*0.3;
              float organicRadius = pointerRadius * radiusVariation;
              f = 1. - smoothstep(organicRadius*0.05, organicRadius*1.2, dist);
              f *= 0.8 + noiseVal*0.2;
            }
            rVal += f * 0.25;
            rVal = clamp(rVal, 0., 1.);
            diffuseColor.rgb = vec3(rVal);
            `,
                    )
                }

                this.rtScene = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat)
                // @ts-ignore
                this.rtScene.material.defines = { USE_UV: "" }
                this.rtCamera = new THREE.Camera()
            }

            render() {
                this.renderer.setRenderTarget(this.rtOutput)
                this.renderer.render(this.rtScene, this.rtCamera)
                this.renderer.copyFramebufferToTexture(this.fbTexture.value)
                this.renderer.setRenderTarget(null)
            }
        }

        const blob = new Blob(renderer)

        const textureLoader = new THREE.TextureLoader()
        const baseTexture = textureLoader.load("/images/hero-base.jpg", (texture) => {
            updatePlaneSizes(texture)
        })
        const revealTexture = textureLoader.load("/images/hero-reveal.png", (texture) => {
            updatePlaneSizes(texture)
        })

        baseTexture.colorSpace = THREE.SRGBColorSpace
        revealTexture.colorSpace = THREE.SRGBColorSpace

        const baseImageMaterial = new THREE.MeshBasicMaterial({ map: baseTexture, transparent: true })
        const baseImage = new THREE.Mesh(new THREE.PlaneGeometry(width, height), baseImageMaterial)
        scene.add(baseImage)

        const revealImageMaterial = new THREE.MeshBasicMaterial({ map: revealTexture, transparent: true })
        revealImageMaterial.onBeforeCompile = (shader: any) => {
            shader.uniforms.texBlob = { value: blob.rtOutput.texture }
            let vertexShader = shader.vertexShader
            vertexShader = vertexShader.replace("void main() {", "varying vec4 vPosProj;\nvoid main() {")
            vertexShader = vertexShader.replace(
                "#include <project_vertex>",
                "#include <project_vertex>\nvPosProj = gl_Position;",
            )
            shader.vertexShader = vertexShader
            shader.fragmentShader = `
        uniform sampler2D texBlob; varying vec4 vPosProj;
        ${shader.fragmentShader}
      `.replace(
                `#include <clipping_planes_fragment>`,
                `
        vec2 blobUV=((vPosProj.xy/vPosProj.w)+1.)*0.5;
        vec4 blobData=texture(texBlob,blobUV);
        if(blobData.r<0.02)discard;
        #include <clipping_planes_fragment>
        `,
            )
        }

        const revealImage = new THREE.Mesh(new THREE.PlaneGeometry(width, height), revealImageMaterial)
        scene.add(revealImage)

        baseImage.position.z = 0.0
        revealImage.position.z = 0.1

        const updatePlaneSizes = (texture: THREE.Texture) => {
            if (!texture.image) return
            const img = texture.image as HTMLImageElement
            const imgWidth = img.width || (img as any).naturalWidth
            const imgHeight = img.height || (img as any).naturalHeight

            if (!imgWidth || !imgHeight) return

            const imgAspect = imgWidth / imgHeight
            const containerAspect = width / height
            let planeWidth, planeHeight

            if (imgAspect > containerAspect) {
                planeHeight = height
                planeWidth = height * imgAspect
            } else {
                planeWidth = width
                planeHeight = width / imgAspect
            }

            baseImage.geometry.dispose()
            baseImage.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight)
            revealImage.geometry.dispose()
            revealImage.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight)
        }

        const clock = new THREE.Clock()
        let t = 0

        const animate = () => {
            const dt = clock.getDelta()
            t += dt
            gu.time.value = t
            gu.dTime.value = dt
            blob.render()
            renderer.render(scene, camera)
            animationFrameRef.current = requestAnimationFrame(animate)
        }

        animate()

        const handleResize = () => {
            const newWidth = container.clientWidth
            const newHeight = container.clientHeight
            camera.left = newWidth / -2
            camera.right = newWidth / 2
            camera.top = newHeight / 2
            camera.bottom = newHeight / -2
            camera.updateProjectionMatrix()
            renderer.setSize(newWidth, newHeight)
            gu.aspect.value = newWidth / newHeight

            updatePlaneSizes(baseTexture)
        }

        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
            if (rendererRef.current) {
                container.removeChild(rendererRef.current.domElement)
                rendererRef.current.dispose()
            }
            scene.traverse((object) => {
                if (object instanceof THREE.Mesh) {
                    object.geometry.dispose()
                    if (object.material) {
                        if (Array.isArray(object.material)) {
                            object.material.forEach((material) => material.dispose())
                        } else {
                            object.material.dispose()
                        }
                    }
                }
            })
            baseTexture.dispose()
            revealTexture.dispose()
            blob.rtOutput.dispose()
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 w-full h-full bg-[#0a0a0a] cursor-none overflow-hidden"
            style={{ touchAction: "none" }}
        />
    )
}
