import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Expand, Minus, Plus, RotateCcw } from 'lucide-react'

const MIN_SCALE = 1
const MAX_SCALE = 8
const STEP = 1.6
export const POSTER_RATIO = 2551 / 3401

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

/* Lienzo con zoom y desplazamiento. El documento parte ajustado al marco y la
   transformación se aplica alrededor de su centro: para acercar hacia un punto
   p (relativo al centro del marco) se mantiene fijo ese punto, t' = p − (p − t)·s'/s.
   `immersive` (pantalla completa) deja que la rueda haga zoom; en la página la
   rueda sigue desplazando el documento y el zoom exige Ctrl/⌘ o los botones.
   `onZoom` avisa cuando el usuario acerca: los carruseles lo usan para pausarse,
   porque quien acerca algo quiere leerlo con calma. */
export default function ZoomCanvas({ src, preview, alt, ratio = POSTER_RATIO, immersive = false, onExpand, onZoom }) {
  const frameRef = useRef(null)
  const bodyRef = useRef(null)
  const pointers = useRef(new Map())
  const gesture = useRef(null)
  const [view, setView] = useState({ s: 1, x: 0, y: 0, animate: false })
  const [hiLoaded, setHiLoaded] = useState(false)
  const [box, setBox] = useState(null)
  const viewRef = useRef(view)
  useLayoutEffect(() => {
    viewRef.current = view
  })

  const wantsHi = immersive || view.s > 1.15

  const limit = useCallback((s, x, y) => {
    const frame = frameRef.current
    const body = bodyRef.current
    if (!frame || !body) return { s, x, y }
    const maxX = Math.max(0, (body.offsetWidth * s - frame.clientWidth) / 2)
    const maxY = Math.max(0, (body.offsetHeight * s - frame.clientHeight) / 2)
    return { s, x: clamp(x, -maxX, maxX), y: clamp(y, -maxY, maxY) }
  }, [])

  const zoomAt = useCallback(
    (nextScale, px = 0, py = 0, animate = false) => {
      const { s, x, y } = viewRef.current
      const ns = clamp(nextScale, MIN_SCALE, MAX_SCALE)
      const ratio = ns / s
      const next = { ...limit(ns, px - (px - x) * ratio, py - (py - y) * ratio), animate }
      viewRef.current = next
      setView(next)
    },
    [limit],
  )

  const reset = useCallback(() => setView({ s: 1, x: 0, y: 0, animate: true }), [])

  const toCenter = (event) => {
    const rect = frameRef.current.getBoundingClientRect()
    return [event.clientX - rect.left - rect.width / 2, event.clientY - rect.top - rect.height / 2]
  }

  // La rueda necesita un listener no pasivo para poder cancelar el scroll.
  useEffect(() => {
    const frame = frameRef.current
    const onWheel = (event) => {
      if (!immersive && !event.ctrlKey && !event.metaKey) return
      event.preventDefault()
      const [px, py] = toCenter(event)
      zoomAt(viewRef.current.s * Math.exp(-event.deltaY * 0.0018), px, py)
    }
    frame.addEventListener('wheel', onWheel, { passive: false })
    return () => frame.removeEventListener('wheel', onWheel)
  }, [immersive, zoomAt])

  // Encaje "contain" calculado: con solo CSS, alto y ancho máximos a la vez
  // deforman la caja cuando el marco es más estrecho que el cartel.
  useEffect(() => {
    const frame = frameRef.current
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      const w = Math.min(width, height * ratio)
      setBox({ w, h: w / ratio })
      setView((v) => ({ ...limit(v.s, v.x, v.y), animate: false }))
    })
    observer.observe(frame)
    return () => observer.disconnect()
  }, [limit, ratio])

  useEffect(() => {
    if (!immersive) return
    const onKey = (event) => {
      if (event.key === '+' || event.key === '=') zoomAt(viewRef.current.s * STEP, 0, 0, true)
      if (event.key === '-') zoomAt(viewRef.current.s / STEP, 0, 0, true)
      if (event.key === '0') reset()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [immersive, zoomAt, reset])

  const onPointerDown = (event) => {
    if (event.button !== 0) return
    frameRef.current.setPointerCapture(event.pointerId)
    pointers.current.set(event.pointerId, [event.clientX, event.clientY])
    const { s, x, y } = viewRef.current
    if (pointers.current.size === 2) {
      const [[ax, ay], [bx, by]] = [...pointers.current.values()]
      gesture.current = { type: 'pinch', dist: Math.hypot(ax - bx, ay - by), s }
    } else {
      gesture.current = { type: 'pan', sx: event.clientX, sy: event.clientY, x, y }
    }
  }

  const onPointerMove = (event) => {
    if (!pointers.current.has(event.pointerId)) return
    pointers.current.set(event.pointerId, [event.clientX, event.clientY])
    const g = gesture.current
    if (!g) return
    if (g.type === 'pinch' && pointers.current.size === 2) {
      const [[ax, ay], [bx, by]] = [...pointers.current.values()]
      const [px, py] = toCenter({ clientX: (ax + bx) / 2, clientY: (ay + by) / 2 })
      zoomAt((g.s * Math.hypot(ax - bx, ay - by)) / g.dist, px, py)
    } else if (g.type === 'pan' && viewRef.current.s > 1) {
      const next = { ...limit(viewRef.current.s, g.x + event.clientX - g.sx, g.y + event.clientY - g.sy), animate: false }
      viewRef.current = next
      setView(next)
    }
  }

  const onPointerUp = (event) => {
    pointers.current.delete(event.pointerId)
    if (pointers.current.size === 1) {
      const [[cx, cy]] = [...pointers.current.values()]
      const { x, y } = viewRef.current
      gesture.current = { type: 'pan', sx: cx, sy: cy, x, y }
    } else if (pointers.current.size === 0) {
      gesture.current = null
    }
  }

  const onDoubleClick = (event) => {
    const [px, py] = toCenter(event)
    if (viewRef.current.s > 1.05) reset()
    else zoomAt(3, px, py, true)
  }

  const zoomed = view.s > 1.01
  const zoomCallback = useRef(onZoom)
  useLayoutEffect(() => {
    zoomCallback.current = onZoom
  })
  useEffect(() => {
    if (zoomed) zoomCallback.current?.()
  }, [zoomed])

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      <div
        ref={frameRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={onDoubleClick}
        style={{ touchAction: immersive || zoomed ? 'none' : 'pan-y' }}
        className={`viewport relative flex min-h-0 flex-1 items-center justify-center overflow-hidden select-none ${
          zoomed ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
        }`}
      >
        <div
          ref={bodyRef}
          className="relative shrink-0"
          style={{
            width: box?.w ?? 0,
            height: box?.h ?? 0,
            transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.s})`,
            /* Sin will-change: el navegador rasterizaría la capa a la escala
               inicial y el texto del cartel se vería borroso al acercar. */
            transition: view.animate ? 'transform 260ms var(--ease-out)' : 'none',
          }}
        >
          <img
            src={preview ?? src}
            alt={alt}
            draggable="false"
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain shadow-[0_0_0_1px_rgb(140_180_255/0.18),0_30px_80px_-20px_rgb(0_0_0/0.8)]"
          />
          {wantsHi && (
            <img
              src={src}
              alt=""
              aria-hidden="true"
              draggable="false"
              decoding="async"
              onLoad={() => setHiLoaded(true)}
              className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${
                hiLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </div>
      </div>

      {/* Consola del visor: la escala real es un dato, no decoración. */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => zoomAt(view.s / STEP, 0, 0, true)}
            disabled={view.s <= MIN_SCALE}
            aria-label="Alejar"
            className="tool-btn"
          >
            <Minus className="size-4" />
          </button>
          <output
            aria-live="polite"
            className="w-16 text-center font-mono text-xs text-accent tabular-nums"
          >
            {Math.round(view.s * 100)} %
          </output>
          <button
            type="button"
            onClick={() => zoomAt(view.s * STEP, 0, 0, true)}
            disabled={view.s >= MAX_SCALE}
            aria-label="Acercar"
            className="tool-btn"
          >
            <Plus className="size-4" />
          </button>
          <button type="button" onClick={reset} disabled={!zoomed} aria-label="Ver cartel completo" className="tool-btn">
            <RotateCcw className="size-4" />
          </button>
          {onExpand && (
            <button type="button" onClick={onExpand} aria-label="Pantalla completa" className="tool-btn">
              <Expand className="size-4" />
            </button>
          )}
        </div>
        <p className={`font-mono text-[11px] text-zinc-500 ${immersive ? '' : 'hidden sm:block'}`}>
          {immersive
            ? 'Rueda o pellizco para acercar, arrastra para moverte'
            : 'Doble clic para acercar · Ctrl + rueda para ajustar'}
        </p>
      </div>
    </div>
  )
}
