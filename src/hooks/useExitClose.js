import { useCallback, useEffect, useRef, useState } from 'react'

const EXIT_MS = 160

/* Cierre con salida para un modal que se desmonta al cerrarse. Marca el
   diálogo con `data-closing` (la salida la anima el CSS de .modal-backdrop y
   .modal-panel), espera la duración y entonces avisa al padre. Al
   desmontarse, devuelve el foco al elemento que abrió el modal. */
export default function useExitClose(onClose) {
  const [closing, setClosing] = useState(false)
  const timer = useRef(0)
  const opener = useRef(null)

  useEffect(() => {
    opener.current = document.activeElement
    return () => {
      clearTimeout(timer.current)
      const el = opener.current
      if (el && typeof el.focus === 'function' && document.contains(el)) el.focus({ preventScroll: true })
    }
  }, [])

  const requestClose = useCallback(() => {
    if (timer.current) return
    setClosing(true)
    timer.current = window.setTimeout(onClose, EXIT_MS)
  }, [onClose])

  return [closing, requestClose]
}
