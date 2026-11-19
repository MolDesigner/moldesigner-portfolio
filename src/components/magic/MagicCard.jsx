import { useRef } from 'react'

/* Adaptación de MagicCard (Magic UI) sin `motion`: un brillo radial que sigue
   al cursor, recortado al borde de 1 px de la tarjeta (ver la utilidad
   .magic-card en index.css). La posición vive en variables CSS del propio
   elemento, así el navegador solo repinta el pseudo-elemento del borde.
   Solo reacciona a ratón: en táctil no hay cursor que seguir. */
export default function MagicCard({ as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useRef(null)

  const onPointerMove = (event) => {
    if (event.pointerType !== 'mouse') return
    const el = ref.current
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    el.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }

  return (
    <Tag ref={ref} onPointerMove={onPointerMove} className={`magic-card ${className}`} {...rest}>
      {children}
    </Tag>
  )
}
