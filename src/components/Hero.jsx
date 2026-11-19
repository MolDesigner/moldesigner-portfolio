import { useRef } from 'react'
import { ArrowUpRight, BadgeCheck, BarChart3, BrainCircuit, Pill } from 'lucide-react'
import { DUR, EASE, MEDIA, STAGGER, gsap, useGSAP } from '../lib/motion.js'
import FlickeringGrid from './magic/FlickeringGrid.jsx'
import MagicCard from './magic/MagicCard.jsx'

const GITHUB_URL = 'https://github.com/MolDesigner'
const LINKEDIN_URL = 'https://www.linkedin.com/in/%C3%A1ngel-urdez-203253301'

const FOCUS_AREAS = [
  { icon: Pill, title: 'Descubrimiento de fármacos asistido por computadora' },
  { icon: BarChart3, title: 'Ciencia de datos' },
  { icon: BrainCircuit, title: 'Machine Learning | Deep Learning' },
]

const CEDULA = '15977462'

function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  )
}

function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  )
}

export default function Hero() {
  const root = useRef(null)

  /* Una sola secuencia al cargar: el texto entra escalonado de arriba abajo,
     la foto se revela con clip-path y las áreas cierran la frase. Con
     movimiento reducido no se mueve nada y todo aparece en su lugar. */
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MEDIA.motion, () => {
        const tl = gsap.timeline({ defaults: { ease: EASE.out, duration: DUR.enter } })
        // fromTo con valores finales explícitos: no depende de leer el estado
        // computado, que en el doble montaje de desarrollo puede estar a medias.
        tl.fromTo('[data-hero="text"]', { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: STAGGER.base })
          .fromTo(
            '[data-hero="photo"]',
            { clipPath: 'inset(100% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: DUR.reveal },
            0.12,
          )
          .fromTo('[data-hero="area"]', { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: STAGGER.tight }, '-=0.35')
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="top" className="relative overflow-hidden">
      {/* Fondo: retícula + halo */}
      {/* Fondo atmosférico: retícula que parpadea muy tenue, enmascarada para
          desvanecerse antes de llegar al texto. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_75%_65%_at_70%_0%,black,transparent_75%)]"
      >
        <FlickeringGrid />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[min(900px,140vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(37_99_235/0.10),rgb(4_120_87/0.05)_55%,transparent)] blur-2xl"
      />

      <div className="relative mx-auto max-w-6xl 2xl:max-w-7xl px-5 pt-16 pb-12 sm:px-8 sm:pt-20 md:pb-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
        <div className="order-2 lg:order-1">
        <span data-hero="text" className="inline-flex items-center gap-2 rounded-full border border-line bg-fg/[0.03] py-1 pr-3 pl-1.5 font-mono text-xs text-zinc-300">
          <span className="flex size-4 items-center justify-center">
            <span className="size-1.5 rounded-full bg-accent" />
          </span>
          @MolDesigner · AI &amp; Drug Discovery
        </span>

        <h1 data-hero="text" className="text-gradient mt-7 pb-2 text-6xl font-semibold tracking-tight sm:text-7xl lg:text-8xl">
          <span className="mr-[0.2em] align-[0.12em] text-[0.5em] text-zinc-500">QFB.</span>Ángel Urdez
        </h1>

        <p data-hero="text" className="mt-3 font-mono text-xs text-zinc-500 sm:text-sm">
          Luis Ángel Urdez Rojas · QFB · Maestría en Ciencias en IA (UAQ)
        </p>

        <p data-hero="text" className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty sm:text-xl">
          Químico Farmacéutico Biólogo enfocado en el descubrimiento de fármacos in silico. Aplico redes
          neuronales de grafos al cribado virtual de moléculas y visión por computadora al análisis de imágenes
          biomédicas.
        </p>

        <div data-hero="text" className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-zinc-100 px-5 text-sm font-medium text-zinc-900 transition-ui hover:bg-zinc-200"
          >
            <GithubIcon className="size-4" />
            GitHub
            <ArrowUpRight className="size-4 transition-transform duration-200 ease-[var(--ease-out)] can-hover:group-hover:-translate-y-0.5 can-hover:group-hover:translate-x-0.5" />
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-line bg-fg/[0.03] px-5 text-sm font-medium text-zinc-100 transition-ui hover:border-fg/20 hover:bg-fg/[0.06]"
          >
            <LinkedinIcon className="size-4" />
            LinkedIn
            <ArrowUpRight className="size-4 transition-transform duration-200 ease-[var(--ease-out)] can-hover:group-hover:-translate-y-0.5 can-hover:group-hover:translate-x-0.5" />
          </a>
        </div>
        </div>

        {/* Retrato enmarcado como el visor de un instrumento: mismas marcas de
            esquina que los paneles, para que la foto pertenezca al sistema. */}
        <figure data-hero="photo" className="order-1 w-64 sm:w-72 lg:order-2 lg:w-full">
          <div className="hud rounded-lg border border-line bg-surface/60 p-2">
            <img
              src="/images/perfil/foto-perfil.webp"
              alt="Retrato de Ángel Urdez"
              width={800}
              height={800}
              fetchPriority="high"
              decoding="async"
              className="aspect-square w-full rounded-md object-cover"
            />
          </div>
          {/* Cédula justo debajo de la foto: el número basta para verificarla en
              el Registro Nacional de Profesionistas. */}
          <figcaption className="mt-3 flex items-center justify-center gap-2 rounded-md border border-line bg-surface/80 px-3 py-1.5 whitespace-nowrap lg:justify-start">
            <BadgeCheck className="size-3.5 shrink-0 text-accent-3" aria-hidden="true" />
            <span className="text-[12px] text-zinc-400">Cédula profesional</span>
            <span className="font-mono text-[13px] tracking-wide text-zinc-100 tabular-nums">{CEDULA}</span>
          </figcaption>
        </figure>
        </div>

        <ul className="mt-14 grid gap-3 sm:grid-cols-3">
          {FOCUS_AREAS.map(({ icon: Icon, title }) => (
            // GSAP anima el <li>; la transición CSS de hover vive en la tarjeta
            // interior, así las dos no se pelean por opacity/transform.
            <li key={title} data-hero="area">
            <MagicCard className="flex h-full items-center gap-4 rounded-2xl border border-line bg-surface/80 p-4 transition-ui hover:border-fg/15">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-line bg-fg/[0.03]">
                <Icon className="size-5 text-accent" aria-hidden="true" />
              </span>
              <p className="min-w-0 text-sm leading-snug font-medium text-pretty text-zinc-100">{title}</p>
            </MagicCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
