import { useRef } from 'react'
import { Award, BadgeCheck, BookOpen, GraduationCap, Trophy } from 'lucide-react'
import { useReveal } from '../lib/motion.js'
import MagicCard from './magic/MagicCard.jsx'

const DEGREES = [
  {
    icon: GraduationCap,
    status: 'En curso',
    title: 'Maestría en Ciencias en Inteligencia Artificial',
    school: 'Universidad Autónoma de Querétaro',
    note: 'Tesis: «Inteligencia artificial aplicada al descubrimiento de fármacos antibacterianos contra Staphylococcus aureus».',
  },
  {
    icon: BookOpen,
    status: 'Titulado',
    title: 'Licenciatura en Química Farmacéutico Biológica',
    school: 'Universidad Autónoma de Querétaro',
    note: 'Tesis: «Identificación in silico de potenciales inhibidores de MRP4/ABCC4 para el tratamiento de la leucemia linfoblástica aguda».',
  },
]

const AWARDS = [
  {
    icon: Trophy,
    title: 'Promedio 9.44 / 10',
    detail: 'Licenciatura en QFB · UAQ',
  },
  {
    icon: Award,
    title: 'Testimonio de Desempeño Sobresaliente',
    detail: 'EGEL-QFB · CENEVAL',
  },
]

export default function Education() {
  const revealRef = useRef(null)
  useReveal(revealRef)

  return (
    <section ref={revealRef} id="formacion" className="mx-auto max-w-6xl 2xl:max-w-7xl scroll-mt-20 px-5 py-16 sm:px-8 md:py-20">
      <header className="mb-10 md:mb-12" data-reveal>
        <p className="eyebrow">
          <span className="text-accent">~/</span>formacion
        </p>
        <h2 className="text-gradient mt-3 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          Educación y reconocimientos
        </h2>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {DEGREES.map(({ icon: Icon, status, title, school, note, credential }) => (
          <div key={title} data-reveal>
          <MagicCard
            as="article"
            className="hud h-full rounded-2xl border border-line bg-surface/80 p-6 transition-ui hover:border-fg/15 sm:p-7"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="flex size-11 items-center justify-center rounded-xl border border-line bg-fg/[0.03]">
                <Icon className="size-5 text-accent" aria-hidden="true" />
              </span>
              <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-zinc-400">
                {status}
              </span>
            </div>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-zinc-100">{title}</h3>
            <p className="mt-1 text-sm text-zinc-300">{school}</p>
            <p className="mt-3 text-sm text-pretty text-zinc-500">{note}</p>
            {credential && (
              <p className="mt-4 inline-flex items-center gap-2 rounded-md border border-line bg-fg/[0.03] px-2.5 py-1">
                <BadgeCheck className="size-3.5 text-accent-3" aria-hidden="true" />
                <span className="text-[12px] text-zinc-400">{credential.label}</span>
                <span className="font-mono text-[13px] tracking-wide text-zinc-100 tabular-nums">{credential.value}</span>
              </p>
            )}
          </MagicCard>
          </div>
        ))}
      </div>

      {/* Los reconocimientos van en su propia fila: mezclarlos con las tarjetas
          de titulación dejaba un hueco de 144 px bajo las más cortas. */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {AWARDS.map(({ icon: Icon, title, detail }) => (
          <div key={title} data-reveal>
          <article
            className="flex h-full items-center gap-4 rounded-2xl border border-amber-500/15 bg-gradient-to-br from-amber-300/[0.06] to-transparent p-5 transition-ui hover:border-amber-500/30"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-300/10">
              <Icon className="size-5 text-amber-700" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-sm font-medium text-zinc-100 sm:text-base">{title}</h3>
              <p className="font-mono text-xs text-zinc-500">{detail}</p>
            </div>
          </article>
          </div>
        ))}
      </div>
    </section>
  )
}
