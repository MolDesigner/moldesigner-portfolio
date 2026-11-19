import { useRef } from 'react'
import { useReveal } from '../lib/motion.js'

/* Cita de Roald Hoffmann, en español y en inglés. Cada idioma va en su propio
   blockquote con `lang`, para lectores de pantalla y buscadores. */
export default function Cita() {
  const revealRef = useRef(null)
  useReveal(revealRef)

  return (
    <section ref={revealRef} aria-label="Cita de Roald Hoffmann" className="mx-auto max-w-4xl px-5 py-10 sm:px-8 md:py-14">
      <figure data-reveal className="relative text-center">
        <span aria-hidden="true" className="spectrum-line mx-auto mb-8 block w-24" />
        <blockquote lang="es">
          <p className="font-display text-2xl leading-snug text-balance text-zinc-100 italic sm:text-[2rem] sm:leading-[1.25]">
            «Química. compuestos, átomos, moléculas, enlaces, estructuras, modelos, reacciones. Estos son los
            conceptos básicos de la disciplina, al igual que los pinceles, los pigmentos y el lienzo del artista.»
          </p>
        </blockquote>
        <blockquote lang="en" className="mt-5">
          <p className="mx-auto max-w-2xl text-[15px] leading-relaxed text-pretty text-zinc-500 italic">
            “Chemistry: compounds, atoms, molecules, bonds, structures, models, reactions. These are the basic
            concepts of the discipline, just as brushes, pigments and canvas are to the artist.”
          </p>
        </blockquote>
        <figcaption className="mt-6 font-mono text-xs text-zinc-500">— Roald Hoffmann</figcaption>
      </figure>
    </section>
  )
}
