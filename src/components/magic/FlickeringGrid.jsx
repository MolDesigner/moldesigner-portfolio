import { useEffect, useRef } from 'react'

/* Adaptación en JSX de FlickeringGrid (Magic UI) sin dependencias. Una retícula
   de cuadros en un canvas cuya opacidad parpadea al azar.
   - Solo dibuja mientras está en pantalla (IntersectionObserver) y con la
     pestaña visible.
   - Con prefers-reduced-motion pinta un único cuadro estático.
   - Limita el redibujado a ~24 fps: el parpadeo es lento por diseño y no
     necesita 60 fps, así deja el hilo principal libre. */
export default function FlickeringGrid({
  squareSize = 3,
  gridGap = 7,
  flickerChance = 0.18,
  color,
  maxOpacity = 0.14,
  className = '',
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let cols = 0
    let rows = 0
    let squares = new Float32Array(0)
    let dpr = 1
    let frame = 0
    let last = 0
    let visible = false

    const setup = () => {
      const { width, height } = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      cols = Math.ceil(width / (squareSize + gridGap))
      rows = Math.ceil(height / (squareSize + gridGap))
      squares = new Float32Array(cols * rows)
      for (let i = 0; i < squares.length; i++) squares[i] = Math.random() * maxOpacity
    }

    // El color sale de --flicker-rgb para seguir el tema claro u oscuro.
    let rgb = color
    const readColor = () => {
      rgb = color || getComputedStyle(document.documentElement).getPropertyValue('--flicker-rgb').trim() || '37, 99, 235'
    }
    readColor()

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const size = squareSize * dpr
      const step = (squareSize + gridGap) * dpr
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          ctx.fillStyle = `rgba(${rgb}, ${squares[i * rows + j]})`
          ctx.fillRect(i * step, j * step, size, size)
        }
      }
    }

    const tick = (time) => {
      frame = requestAnimationFrame(tick)
      const delta = time - last
      if (delta < 1000 / 24) return
      last = time
      const chance = flickerChance * (delta / 1000)
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < chance) squares[i] = Math.random() * maxOpacity
      }
      draw()
    }

    const start = () => {
      if (reduce || frame || !visible || document.hidden) return
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
    }

    setup()
    draw()

    const resize = new ResizeObserver(() => {
      setup()
      draw()
    })
    resize.observe(canvas)

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })
    io.observe(canvas)

    const themeWatch = new MutationObserver(() => {
      readColor()
      draw()
    })
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      resize.disconnect()
      io.disconnect()
      themeWatch.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [squareSize, gridGap, flickerChance, color, maxOpacity])

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none h-full w-full ${className}`} />
}
