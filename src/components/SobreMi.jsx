import { useCallback, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { useReveal } from '../lib/motion.js'
import useAutoplay from '../hooks/useAutoplay.js'
import AutoplayControls from './AutoplayControls.jsx'

/* Lo aprendido por cuenta propia, del más reciente al más antiguo. Todo
   proviene de los certificados de la sección de logros (grupo «Cursos»). */
const SELF_TAUGHT = [
  {
    year: '2026',
    items: [
      'Quimioinformática aplicada al diseño de fármacos, 20 h (AMQO)',
      'Cyclic Peptide Modeling and Informatics (Schrödinger)',
      'Kaggle: Intro to Machine Learning, Pandas, Data Cleaning y Data Visualization',
      'Ultimate Python, 18 h (Udemy)',
    ],
  },
  { year: '2025', items: ['Python, nivel avanzado (certificación)'] },
  { year: '2024', items: ['Python, Santander Open Academy', 'Tecnologías emergentes, Santander Open Academy'] },
  { year: '2023', items: ['Farmacovigilancia: seis cursos de detección de señales, Uppsala Monitoring Centre'] },
]

/* Diapositivas del carrusel «Sobre mí», con el texto que redactó Ángel. */
const SLIDES = [
  {
    name: 'Formación y excelencia académica',
    label: '01 / Perfil y formación',
    title: 'Del laboratorio químico al diseño computacional',
    text: 'Químico Farmacéutico Biólogo y maestrante en Ciencias en Inteligencia Artificial por la Universidad Autónoma de Querétaro (UAQ). Cuento con una sólida base en química orgánica, síntesis y bioquímica, respaldada por el reconocimiento de la ANFEQUI (2025) al más alto rendimiento de mi generación y el Testimonio de Desempeño Sobresaliente en el examen EGEL-QFB (2026).',
    tags: ['QFB · UAQ', 'Maestría en IA', 'Excelencia ANFEQUI & EGEL'],
  },
  {
    name: 'Bases experimentales y química computacional',
    label: '02 / Trayectoria científica',
    title: 'Criterio de laboratorio aplicado al descubrimiento de fármacos',
    text: 'Me formé en la investigación experimental como Ayudante de Investigadora Nacional (SNI Nivel III) en Bioquímica Molecular, ejecutando técnicas bioquímicas y modelos in vivo. Posteriormente, en el grupo DACSIF-UAQ, desarrollé mi tesis enfocada en el cribado virtual y diseño de inhibidores dirigidos al transportador MRP4 para combatir la resistencia oncológica.',
    tags: ['DACSIF-UAQ', 'Cribado virtual (MRP4)', 'Ayudante SNI III'],
  },
  {
    name: 'Investigación actual en inteligencia artificial',
    label: '03 / Posgrado e innovación',
    title: 'Aprendizaje profundo para nuevos antibacterianos',
    text: 'Mi aprendizaje autodidacta en programación me abrió las puertas al posgrado en IA, donde desarrollo redes neuronales de grafos multitarea (D-MPNN) para descubrir fármacos antibacterianos contra Staphylococcus aureus en colaboración entre la UAQ y DIFACQUIM (UNAM). Mi enfoque une el rigor de los algoritmos con el criterio químico para validar cada predicción.',
    tags: ['D-MPNN', 'Diseño de fármacos', 'UAQ · UNAM'],
  },
  {
    name: 'Modelos generativos y bioinformática',
    label: '04 / Enfoque computacional',
    title: 'De la generación molecular a la visión biomédica',
    text: 'Desarrollo arquitecturas en PyTorch sobre entornos Linux que abarcan redes recurrentes para la generación de novo de moléculas (MOSES) y redes convolucionales para el análisis de imágenes médicas, como la clasificación de células sanguíneas (KU-Optofil PBC) y detección de metástasis (Camelyon17-WILDS), sumado a experiencia previa en ensamblaje genómico.',
    tags: ['PyTorch · Python', 'Modelos generativos', 'Bioinformática & Linux'],
  },
  {
    name: 'Reconocimientos y vocación docente',
    label: '05 / Liderazgo y divulgación',
    title: 'Investigación premiada y formación de talento',
    text: 'He representado a la UAQ obteniendo el Primer Lugar nacional de cartel en la XVIII Reunión de la Academia Mexicana de Química Orgánica (2023) y mención de excelencia en la Semana Cultural UAQ (2024). Además, fui tutor par voluntario de Química Orgánica para más de cien estudiantes y hoy imparto asesorías particulares de matemáticas y física.',
    tags: ['1er lugar nacional AMQO', 'Tutoría académica', 'Docencia'],
  },
]

const SLIDE_DELAY = 9000

/* Carrusel compacto: todas las diapositivas comparten la misma celda de la
   rejilla, así la caja mide lo que la más alta y nunca cambia de tamaño. Solo
   se animan la entrante y la saliente (deslizamiento horizontal homogéneo). */
function AboutCarousel() {
  const rootRef = useRef(null)
  const [active, setActive] = useState(0)
  const [previous, setPrevious] = useState(null)
  const [dir, setDir] = useState(1)
  const total = SLIDES.length

  const show = useCallback(
    (next, direction) => {
      const target = (next + total) % total
      if (target === active) return
      setPrevious(active)
      setDir(direction ?? (target > active ? 1 : -1))
      setActive(target)
    },
    [active, total],
  )

  const autoplay = useAutoplay(rootRef, {
    delay: SLIDE_DELAY,
    stepKey: active,
    onAdvance: () => show(active + 1, 1),
  })

  return (
    <div
      ref={rootRef}
      {...autoplay.bind}
      data-reveal
      aria-roledescription="carrusel"
      aria-label="Sobre mí"
      className="hud flex h-full flex-col rounded-2xl border border-line bg-surface p-6 sm:p-8"
    >
      <div className="relative grid overflow-hidden">
        {SLIDES.map((slide, index) => {
          const isActive = index === active
          const isLeaving = index === previous && !isActive
          const motion = isActive
            ? previous === null
              ? ''
              : dir < 0
                ? 'slide-in-right'
                : 'slide-in-left'
            : isLeaving
              ? dir < 0
                ? 'slide-out-right'
                : 'slide-out-left'
              : 'invisible'
          return (
            <article
              key={slide.name}
              aria-hidden={!isActive}
              inert={!isActive}
              aria-roledescription="diapositiva"
              aria-label={`${index + 1} de ${total}: ${slide.name}`}
              className={`[grid-area:1/1] ${motion}`}
            >
              <p className="font-mono text-xs text-accent">{slide.label}</p>
              <h3 className="mt-3 text-2xl leading-tight font-semibold text-balance text-zinc-100 sm:text-[1.75rem]">
                {slide.title}
              </h3>
              <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed text-pretty sm:text-base">{slide.text}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {slide.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-md border border-line bg-fg/[0.03] px-2.5 py-1 font-mono text-[12px] text-zinc-300"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </article>
          )
        })}
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
        <div className="flex items-center gap-1" role="group" aria-label="Elegir diapositiva">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.name}
              type="button"
              onClick={() => show(index)}
              aria-label={`Ir a ${index + 1}: ${slide.name}`}
              aria-current={index === active}
              title={slide.name}
              className={`min-h-9 min-w-9 rounded-md font-mono text-[12px] transition-ui ${
                index === active ? 'bg-zinc-100 text-ink' : 'text-zinc-500 hover:bg-fg/5 hover:text-zinc-200'
              }`}
            >
              {String(index + 1).padStart(2, '0')}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <AutoplayControls {...autoplay} delay={SLIDE_DELAY} stepKey={active} label="Sobre mí" />
          <div className="flex gap-1">
            <button type="button" onClick={() => show(active - 1, -1)} aria-label="Diapositiva anterior" className="tool-btn">
              <ArrowLeft className="size-4" />
            </button>
            <button type="button" onClick={() => show(active + 1, 1)} aria-label="Diapositiva siguiente" className="tool-btn">
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const COURSE_COUNT = 11

export default function SobreMi() {
  const revealRef = useRef(null)
  useReveal(revealRef)

  return (
    <section ref={revealRef} id="sobre-mi" className="mx-auto max-w-6xl 2xl:max-w-7xl scroll-mt-20 px-5 py-16 sm:px-8 md:py-20">
      <header className="mb-12" data-reveal>
        <p className="eyebrow">
          <span className="text-accent">~/</span>sobre-mi
        </p>
        <h2 className="text-gradient mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-[2.5rem] sm:leading-[1.1]">
          Del matraz al código
        </h2>
      </header>

      <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
        {/* Carrusel con el perfil en cinco diapositivas */}
        <div className="lg:col-span-7">
          <AboutCarousel />
        </div>

        {/* Aprendizaje autodidacta: línea de tiempo */}
        <aside className="lg:col-span-5" aria-labelledby="autodidacta-titulo">
          <div data-reveal className="hud rounded-xl border border-line bg-surface/60 p-6">
            <p className="font-mono text-[11px] text-zinc-500">Aprendizaje autodidacta</p>
            <h3 id="autodidacta-titulo" className="mt-2 text-xl font-semibold text-zinc-100">
              <span className="text-accent">{COURSE_COUNT}</span> cursos completados por cuenta propia
            </h3>
            <p className="mt-2 text-sm text-pretty">
              Fuera del plan de estudios, desde 2023. Cada uno tiene su certificado en la sección de logros.
            </p>

            <ol className="relative mt-6 space-y-6 border-l border-accent/30 pl-5">
              {SELF_TAUGHT.map(({ year, items }) => (
                <li key={year} data-reveal className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute top-1.5 -left-[25px] size-2 rounded-full bg-accent shadow-[0_0_0_4px_var(--color-surface)]"
                  />
                  <p className="font-mono text-xs text-accent">{year}</p>
                  <ul className="mt-1.5 space-y-1">
                    {items.map((item) => (
                      <li key={item} className="text-[13px] leading-snug text-zinc-300">
                        {item}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>

            <a
              href="#logros"
              className="mt-6 inline-flex items-center gap-1.5 text-[13px] text-zinc-300 transition-ui hover:text-zinc-100"
            >
              Ver los certificados
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        </aside>
      </div>
    </section>
  )
}
