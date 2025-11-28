"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface VortexProps {
  children?: React.ReactNode
  className?: string
  containerClassName?: string
  particleCount?: number
  rangeY?: number
  baseHue?: number
  baseSpeed?: number
  rangeSpeed?: number
  baseRadius?: number
  rangeRadius?: number
  backgroundColor?: string
}

export function Vortex({
  children,
  className,
  containerClassName,
  particleCount = 200,
  rangeY = 300,
  baseHue = 0,
  baseSpeed = 0.5,
  rangeSpeed = 1,
  baseRadius = 1,
  rangeRadius = 4,
  backgroundColor = "black",
}: VortexProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      hue: number
    }> = []

    const resizeCanvas = () => {
      canvas.width = container.offsetWidth
      canvas.height = container.offsetHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * baseSpeed * 2,
        vy: (Math.random() - 0.5) * baseSpeed * 2,
        radius: baseRadius + Math.random() * rangeRadius,
        hue: baseHue + Math.random() * 60,
      })
    }

    const animate = () => {
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      particles.forEach((particle) => {
        // Calculate distance from center
        const dx = particle.x - centerX
        const dy = particle.y - centerY
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Create vortex effect
        const angle = Math.atan2(dy, dx)
        const force = distance / rangeY
        const vx = Math.cos(angle) * force * baseSpeed
        const vy = Math.sin(angle) * force * baseSpeed

        particle.vx += vx * 0.01
        particle.vy += vy * 0.01

        // Apply velocity
        particle.x += particle.vx
        particle.y += particle.vy

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = `hsl(${particle.hue}, 70%, 60%)`
        ctx.fill()

        // Draw connections
        particles.forEach((other) => {
          const dx = particle.x - other.x
          const dy = particle.y - other.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = `hsla(${particle.hue}, 70%, 60%, ${1 - distance / 100})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [
    particleCount,
    rangeY,
    baseHue,
    baseSpeed,
    rangeSpeed,
    baseRadius,
    rangeRadius,
    backgroundColor,
  ])

  return (
    <div
      ref={containerRef}
      className={cn("relative h-full w-full overflow-hidden", containerClassName)}
    >
      <canvas
        ref={canvasRef}
        className={cn("absolute inset-0", className)}
        style={{ zIndex: 0 }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}


