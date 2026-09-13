import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  z: number
  r: number
  tw: number
  twSpeed: number
}

/**
 * A soft animated starfield rendered on a canvas — gently drifting, twinkling
 * points of light that give the app its dreamy, cosmic backdrop.
 */
export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let stars: Star[] = []
    let raf = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const palette = ['#ffffff', '#c4b5fd', '#f0abfc', '#a5f3fc', '#fbcfe8']

    function resize() {
      if (!canvas) return
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.min(220, Math.floor((width * height) / 8000))
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random(),
        r: Math.random() * 1.4 + 0.3,
        tw: Math.random() * Math.PI * 2,
        twSpeed: Math.random() * 0.02 + 0.005,
      }))
    }

    function draw() {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      for (const s of stars) {
        s.tw += s.twSpeed
        const twinkle = 0.5 + Math.sin(s.tw) * 0.5
        const alpha = 0.25 + twinkle * 0.75 * (0.4 + s.z * 0.6)
        const color = palette[Math.floor(s.z * palette.length) % palette.length]

        // subtle upward drift
        s.y -= (0.02 + s.z * 0.05)
        if (s.y < -2) {
          s.y = height + 2
          s.x = Math.random() * width
        }

        ctx.globalAlpha = alpha
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r * (0.6 + s.z), 0, Math.PI * 2)
        ctx.fill()

        // glow for the brighter stars
        if (s.z > 0.75) {
          ctx.globalAlpha = alpha * 0.15
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    resize()
    if (prefersReduced) {
      draw() // one frame
    } else {
      raf = requestAnimationFrame(draw)
    }
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  )
}
