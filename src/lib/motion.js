import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, ScrollTrigger, CustomEase)

/* Las imágenes diferidas, el visor 3D o un cambio de pestaña alteran la altura
   de la página después de calcular los disparadores. Recalcularlos cuando el
   documento cambia de tamaño evita entradas que nunca se activan. */
if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
  let pending = 0
  new ResizeObserver(() => {
    clearTimeout(pending)
    pending = setTimeout(() => ScrollTrigger.refresh(), 200)
  }).observe(document.body)
}

/* Curvas compartidas: las mismas que --ease-out y --ease-in-out de index.css,
   para que GSAP y las transiciones CSS se sientan como un solo sistema. */
export const EASE = {
  // Las salidas también usan ease-out: ease-in hace que la interfaz se sienta lenta.
  out: CustomEase.create('ui-out', '0.23,1,0.32,1'),
  inOut: CustomEase.create('ui-in-out', '0.77,0,0.175,1'),
  // Para contenido que entra al hacer scroll: arranca firme y frena muy
  // despacio, así la llegada se siente suave y no un golpe.
  soft: CustomEase.create('ui-soft', '0.16,1,0.3,1'),
}

/* Duraciones en segundos. Interacciones por debajo de 300 ms; las entradas de
   contenido al hacer scroll pueden ser más largas porque ocurren una sola vez. */
export const DUR = {
  exit: 0.18,
  swap: 0.5,
  enter: 0.6,
  reveal: 0.65,
  scroll: 0.9,
  fade: 0.15,
}

export const STAGGER = { tight: 0.05, base: 0.07 }

/* Una sola fuente de verdad para movimiento reducido: dentro de `motion`
   va la coreografía completa; dentro de `reduce`, solo opacidad corta. */
export const MEDIA = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
}

/* Entradas suaves al hacer scroll para todo lo marcado con `data-reveal`
   dentro de `scope`. ScrollTrigger.batch agrupa lo que entra a la vez para
   escalonarlo como un solo gesto; cada elemento se anima una única vez.
   Con movimiento reducido no se oculta nada. */
export function useReveal(scope) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MEDIA.motion, () => {
        const items = gsap.utils.toArray('[data-reveal]', scope.current)
        if (!items.length) return
        gsap.set(items, { y: 24, autoAlpha: 0 })
        ScrollTrigger.batch(items, {
          // Se activa apenas el elemento asoma: el contenido va apareciendo
          // mientras se baja, nunca de golpe ni después de haber pasado.
          // clamp(): lo que está al final de la página también se activa,
          // aunque nunca llegue al 94 % de la pantalla.
          start: 'clamp(top 94%)',
          once: true,
          interval: 0.08,
          onEnter: (batch) =>
            gsap.to(batch, {
              y: 0,
              autoAlpha: 1,
              duration: DUR.scroll,
              ease: EASE.soft,
              stagger: 0.09,
              overwrite: true,
            }),
        })
      })
    },
    { scope },
  )
}

export { gsap, ScrollTrigger, useGSAP }
