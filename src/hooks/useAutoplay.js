import { useCallback, useEffect, useRef, useState } from 'react'

const REDUCE = '(prefers-reduced-motion: reduce)'

/* Avance automático compartido por los carruseles (carteles, galería, premios).
   Avanza cada `delay` ms llamando a `onAdvance`. Se detiene sola cuando:
   - el cursor (si `pauseOnHover`) o el foco de teclado están dentro de `rootRef`,
   - el bloque no está a la vista o la pestaña está oculta,
   - hay un visor abierto en cualquier parte de la página,
   - `blocked` es verdadero (por ejemplo, un visor propio abierto).
   Con movimiento reducido arranca en pausa; `paused` lo controla el botón
   (WCAG 2.2.2). `stepKey` cambia con cada paso para reiniciar el temporizador
   también cuando el usuario navega a mano. */
export default function useAutoplay(rootRef, { delay, onAdvance, stepKey, blocked = false, pauseOnHover = true }) {
  const [paused, setPaused] = useState(() => window.matchMedia(REDUCE).matches)
  const [engaged, setEngaged] = useState(false)
  const [inView, setInView] = useState(false)
  const [pageHidden, setPageHidden] = useState(false)
  const [retry, setRetry] = useState(0)
  const advance = useRef(onAdvance)
  useEffect(() => {
    advance.current = onAdvance
  })

  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 })
    io.observe(rootRef.current)
    const onVisibility = () => setPageHidden(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [rootRef])

  const running = !paused && !engaged && inView && !pageHidden && !blocked

  useEffect(() => {
    if (!running) return
    const timer = setTimeout(() => {
      if (document.querySelector('[role="dialog"]')) return setRetry((n) => n + 1)
      advance.current()
    }, delay)
    return () => clearTimeout(timer)
  }, [running, delay, stepKey, retry])

  const bind = {
    onPointerEnter: useCallback(
      (event) => pauseOnHover && event.pointerType === 'mouse' && setEngaged(true),
      [pauseOnHover],
    ),
    onPointerLeave: useCallback((event) => event.pointerType === 'mouse' && setEngaged(false), []),
    // Solo el foco de teclado pausa: tras un clic el botón conserva el foco y
    // la rotación quedaría detenida sin que el usuario lo note.
    onFocus: useCallback((event) => event.target.matches(':focus-visible') && setEngaged(true), []),
    onBlur: useCallback((event) => !event.currentTarget.contains(event.relatedTarget) && setEngaged(false), []),
  }

  return { running, paused, setPaused, bind }
}
