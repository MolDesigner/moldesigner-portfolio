import { Award, BookOpen, GraduationCap, Trophy } from 'lucide-react'

const DEGREES = [
  {
    icon: GraduationCap,
    status: 'En curso',
    title: 'Maestría en Ciencias en Inteligencia Artificial',
    school: 'Universidad Autónoma de Querétaro',
    note: 'Tesis: descubrimiento antibacteriano con redes neuronales de grafos.',
  },
  {
    icon: BookOpen,
    status: 'Titulado',
    title: 'Licenciatura en Química Farmacéutico Biológica',
    school: 'Universidad Autónoma de Querétaro',
    note: 'Tesis: inhibidores in silico de MRP4/ABCC4 en Leucemia Linfoblástica Aguda.',
  },
]

const AWARDS = [
  {
    icon: Trophy,
    title: 'Mejor promedio de generación',
    detail: 'Licenciatura en QFB · UAQ',
  },
  {
    icon: Award,
    title: 'Premio CENEVAL al Desempeño de Excelencia',
    detail: 'EGEL-QFB',
  },
]

export default function Education() {
  return (
    <section id="formacion" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-8 md:py-28">
      <header className="mb-10 md:mb-12">
        <p className="font-mono text-xs tracking-wider text-zinc-500 uppercase">
          <span className="text-accent">03</span> · Trayectoria
        </p>
        <h2 className="text-gradient mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Educación y reconocimientos
        </h2>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {DEGREES.map(({ icon: Icon, status, title, school, note }) => (
          <article
            key={title}
            className="rounded-2xl border border-line bg-surface/80 p-6 transition-colors hover:border-white/15 sm:p-7"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="flex size-11 items-center justify-center rounded-xl border border-line bg-white/[0.03]">
                <Icon className="size-5 text-accent" aria-hidden="true" />
              </span>
              <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-zinc-400">
                {status}
              </span>
            </div>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-zinc-100">{title}</h3>
            <p className="mt-1 text-sm text-zinc-300">{school}</p>
            <p className="mt-3 text-sm text-pretty text-zinc-500">{note}</p>
          </article>
        ))}

        {AWARDS.map(({ icon: Icon, title, detail }) => (
          <article
            key={title}
            className="flex items-center gap-4 rounded-2xl border border-amber-300/15 bg-gradient-to-br from-amber-300/[0.06] to-transparent p-5 transition-colors hover:border-amber-300/30"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/10">
              <Icon className="size-5 text-amber-300" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-sm font-medium text-zinc-100 sm:text-base">{title}</h3>
              <p className="font-mono text-xs text-zinc-500">{detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
