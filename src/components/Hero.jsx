import { ArrowUpRight, Microscope, Network, Pill } from 'lucide-react'

const GITHUB_URL = 'https://github.com/MolDesigner'
const LINKEDIN_URL = 'https://www.linkedin.com/in/%C3%A1ngel-urdez-203253301'

const FOCUS_AREAS = [
  { icon: Pill, title: 'Drug discovery in silico', detail: 'Cribado virtual · Docking · DM' },
  { icon: Network, title: 'Redes neuronales de grafos', detail: 'D-MPNN · Aprendizaje multitarea' },
  { icon: Microscope, title: 'Visión biomédica', detail: 'Hematología · Histopatología' },
]

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
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Fondo: retícula + halo */}
      <div
        aria-hidden="true"
        className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[min(900px,140vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(125_211_252/0.16),rgb(167_139_250/0.08)_55%,transparent)] blur-2xl"
      />

      <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-14 sm:px-8 sm:pt-20 md:pb-20">
        <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] py-1 pr-3 pl-1.5 font-mono text-xs text-zinc-300">
          <span className="relative flex size-4 items-center justify-center">
            <span className="absolute size-2 animate-ping rounded-full bg-accent/50" />
            <span className="size-1.5 rounded-full bg-accent" />
          </span>
          @MolDesigner · AI &amp; Drug Discovery
        </span>

        <h1 className="text-gradient animate-fade-up mt-7 pb-2 text-5xl font-semibold tracking-tighter [animation-delay:80ms] sm:text-7xl md:text-8xl">
          Ángel Urdez
        </h1>

        <p className="animate-fade-up mt-3 font-mono text-xs text-zinc-500 [animation-delay:140ms] sm:text-sm">
          Luis Ángel Urdez Rojas · QFB · Maestría en Ciencias en IA (UAQ)
        </p>

        <p className="animate-fade-up mt-6 max-w-2xl text-lg leading-relaxed text-pretty [animation-delay:200ms] sm:text-xl">
          Químico Farmacéutico Biólogo enfocado en el{' '}
          <strong className="font-medium text-zinc-100">descubrimiento de fármacos in silico</strong>. Aplico{' '}
          <strong className="font-medium text-zinc-100">redes neuronales de grafos</strong> al cribado
          virtual de moléculas y{' '}
          <strong className="font-medium text-zinc-100">visión computacional</strong> al análisis de
          imágenes biomédicas.
        </p>

        <div className="animate-fade-up mt-9 flex flex-col gap-3 [animation-delay:260ms] sm:flex-row">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-zinc-100 px-5 text-sm font-medium text-zinc-900 transition-colors hover:bg-white"
          >
            <GithubIcon className="size-4" />
            GitHub
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-line bg-white/[0.03] px-5 text-sm font-medium text-zinc-100 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
          >
            <LinkedinIcon className="size-4" />
            LinkedIn
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>

        <ul className="animate-fade-up mt-14 grid gap-3 [animation-delay:320ms] sm:grid-cols-3">
          {FOCUS_AREAS.map(({ icon: Icon, title, detail }) => (
            <li
              key={title}
              className="flex items-center gap-4 rounded-2xl border border-line bg-surface/80 p-4 transition-colors hover:border-white/15"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-line bg-white/[0.03]">
                <Icon className="size-5 text-accent" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-100">{title}</p>
                <p className="truncate font-mono text-xs text-zinc-500">{detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
