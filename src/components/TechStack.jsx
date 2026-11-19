import { useRef } from 'react'
import { Atom, Brain, Database, FlaskConical, Languages, TerminalSquare } from 'lucide-react'
import { DUR, EASE, MEDIA, gsap, useGSAP, useReveal } from '../lib/motion.js'
import MagicCard from './magic/MagicCard.jsx'

/* El stack se ordena como el recorrido real de un proyecto de descubrimiento
   de fármacos: del dato químico al modelo, a la simulación y al matraz. Por eso
   las etapas sí van numeradas. Cada herramienta proviene del CV académico y
   cada etapa enlaza con los proyectos donde se usó. */
const STAGES = [
  {
    id: 'datos',
    icon: Database,
    tone: 'text-sky-700',
    title: 'Datos químicos',
    question: '¿Qué moléculas vale la pena mirar?',
    tools: [
      { name: 'Python', note: 'pandas' },
      { name: 'RDKit', note: 'descriptores y filtros' },
      { name: 'Filtros quimioinformáticos', note: 'MPO, Brenk, NIH, PAINS' },
      { name: 'Predicciones ADMET-Tox', note: 'absorción, distribución, metabolismo, excreción y toxicidad' },
      { name: 'Quimiotecas', note: 'PubChem, DrugBank, NP Atlas, ZINC20' },
    ],
    usedIn: [
      { label: 'MRP4', href: '#proyectos' },
      { label: 'Antibacteriano', href: '#proyectos' },
    ],
  },
  {
    id: 'modelos',
    icon: Brain,
    tone: 'text-violet-700',
    title: 'Aprendizaje profundo',
    question: '¿Qué aprende un modelo de ellas?',
    tools: [
      { name: 'PyTorch', note: 'CNN propias' },
      { name: 'Redes de grafos', note: 'D-MPNN multitarea' },
      { name: 'Modelos generativos', note: 'RNN / LSTM sobre SMILES' },
      { name: 'Visión por computadora', note: 'CNN, Grad-CAM e imágenes biomédicas' },
      { name: 'Optuna', note: 'búsqueda de hiperparámetros' },
    ],
    usedIn: [
      { label: 'Antibacteriano', href: '#proyectos' },
      { label: 'Células sanguíneas', href: '#proyectos' },
      { label: 'Generación de novo', href: '#proyectos' },
      { label: 'Metástasis', href: '#proyectos' },
    ],
  },
  {
    id: 'simulacion',
    icon: Atom,
    tone: 'text-emerald-700',
    title: 'Simulación molecular',
    question: '¿Cómo se une a su diana?',
    tools: [
      { name: 'AutoDock-GPU', note: 'cribado a gran escala' },
      { name: 'GNINA', note: 'acoplamiento por ensamble' },
      { name: 'Desmond', note: 'dinámica y metadinámica' },
      { name: 'ProLIF', note: 'huellas de interacción' },
      { name: 'PyMOL · ChimeraX', note: 'visualización' },
    ],
    usedIn: [{ label: 'MRP4', href: '#proyectos' }],
  },
  {
    id: 'laboratorio',
    icon: FlaskConical,
    tone: 'text-lime-700',
    title: 'Laboratorio',
    question: '¿Se puede hacer y medir?',
    tools: [
      { name: 'Síntesis por microondas', note: 'catálisis heterogénea' },
      { name: 'HPLC-UV-Vis · CG-EM', note: 'identificación' },
      { name: 'UV-Vis · luminiscencia', note: 'cuantificación' },
      { name: 'Bioquímica', note: 'biología molecular' },
      { name: 'Modelos animales', note: 'manejo de ratas Wistar' },
    ],
    usedIn: [
      { label: 'Fluoresceína', href: '#proyectos' },
      { label: 'Ayudante SNI', href: '#logros' },
    ],
  },
]

const BASE = [
  { icon: TerminalSquare, label: 'Entorno', value: 'Linux · LaTeX' },
  { icon: Languages, label: 'Idiomas', value: 'Español nativo · inglés intermedio' },
]

export default function TechStack() {
  const root = useRef(null)
  useReveal(root)

  /* La línea espectral se dibuja de izquierda a derecha y cada etapa aparece
     cuando la línea la alcanza: un solo gesto que se lee como el recorrido
     del dato a la molécula. Se ejecuta una vez. */
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MEDIA.motion, () => {
        const tl = gsap.timeline({
          defaults: { ease: EASE.out },
          scrollTrigger: { trigger: '[data-stack="rail-wrap"]', start: 'top 78%', once: true },
        })
        tl.fromTo(
          '[data-stack="rail"]',
          { clipPath: 'inset(0% 100% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: DUR.reveal, ease: EASE.inOut },
        )
          .fromTo(
            '[data-stack="stage"]',
            { y: 18, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: DUR.enter, stagger: 0.11 },
            0.08,
          )

      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="stack" className="border-y border-line bg-surface/40">
      <div className="mx-auto max-w-6xl 2xl:max-w-7xl scroll-mt-20 px-5 py-16 sm:px-8 md:py-20">
        <header data-reveal className="mb-12 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="eyebrow">
              <span className="text-accent">~/</span>stack
            </p>
            <h2 className="text-gradient mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-[2.5rem] sm:leading-[1.1]">
              Del dato a la molécula
            </h2>
            <p className="mt-3 max-w-xl text-pretty">
              Las herramientas que uso, en el orden en que aparecen en un proyecto de descubrimiento de fármacos,
              de los datos al laboratorio.
            </p>
          </div>
        </header>

        {/* Riel: en escritorio, una línea espectral une las cuatro etapas. */}
        <div className="relative" data-stack="rail-wrap">
        <div aria-hidden="true" data-stack="rail" className="spectrum-line absolute top-[22px] right-6 left-6 hidden lg:block" />
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {STAGES.map(({ id, icon: Icon, tone, title, question, tools, usedIn }, index) => (
            <li key={id} data-stack="stage" className="relative flex flex-col">
              <div className="flex items-center gap-3">
                <span className="relative z-10 flex size-11 shrink-0 items-center justify-center rounded-lg border border-line bg-ink">
                  <Icon className={`size-5 ${tone}`} aria-hidden="true" />
                </span>
                <span className="font-mono text-xs text-zinc-500 lg:hidden">Etapa {index + 1}</span>
              </div>

              <MagicCard className="hud mt-4 flex flex-1 flex-col rounded-xl border border-line bg-ink/60 p-5">
                <p className="font-mono text-[11px] text-zinc-500">
                  <span className={tone}>{String(index + 1).padStart(2, '0')}</span> / 04
                </p>
                <h3 className="mt-2 text-lg font-semibold text-zinc-100">{title}</h3>
                <p className="mt-1 text-sm text-pretty text-zinc-400">{question}</p>

                <dl className="mt-5 space-y-2.5 border-t border-line pt-4">
                  {tools.map((tool) => (
                    <div key={tool.name} className="flex flex-col">
                      <dt className="font-mono text-[13px] text-zinc-100">{tool.name}</dt>
                      <dd className="text-[12px] leading-snug text-zinc-500">{tool.note}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-auto pt-5">
                  <p className="text-[11px] text-zinc-500">Usado en</p>
                  <ul className="mt-1.5 flex flex-wrap gap-1.5">
                    {usedIn.map((item) => (
                      <li key={item.label}>
                        <a
                          href={item.href}
                          className="inline-block rounded-md border border-line px-2 py-0.5 text-[11px] text-zinc-300 transition-ui hover:border-accent/40 hover:text-zinc-100"
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </MagicCard>
            </li>
          ))}
        </ol>
        </div>

        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {BASE.map(({ icon: Icon, label, value }) => (
            <li key={label} data-reveal className="flex items-center gap-3 rounded-lg border border-line bg-ink/40 px-4 py-3">
              <Icon className="size-4 shrink-0 text-zinc-500" aria-hidden="true" />
              <span className="font-mono text-[11px] text-zinc-500">{label}</span>
              <span className="text-sm text-zinc-200">{value}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
