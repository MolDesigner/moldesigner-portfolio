import { useCallback, useEffect, useRef, useState } from 'react'
import { Award, Download, Expand, X } from 'lucide-react'
import ZoomCanvas from './ZoomCanvas.jsx'
import { useReveal } from '../lib/motion.js'
import useExitClose from '../hooks/useExitClose.js'
import useAutoplay from '../hooks/useAutoplay.js'
import AutoplayControls from './AutoplayControls.jsx'

const POSTER_DELAY = 4000

const IMG = '/images/carteles'
const DOC = '/docs'

const POSTERS = [
  {
    id: 'cnn-celulas',
    year: '2026',
    event: '14.º Encuentro de Jóvenes Investigadoras e Investigadores, Querétaro',
    title: 'Clasificación de células sanguíneas periféricas mediante redes neuronales convolucionales (CNN)',
    short: 'Células sanguíneas con CNN en cascada',
    authors: 'Urdez-Rojas L.Á., Takacs A.',
    lab: 'Maestría en Ciencias en Inteligencia Artificial, Facultad de Ingeniería, UAQ',
    summary:
      'CNN de diseño propio en cascada sobre las 31,489 imágenes de KU-Optofil PBC (13 clases). Supera al modelo de referencia DenseNet-121 con menos parámetros: 0.9562 de exactitud y 0.8319 de F1 macro en prueba.',
    src: `${IMG}/cartel-cnn-celulas.jpg`,
    preview: `${IMG}/cartel-cnn-celulas-sm.jpg`,
    pdf: `${DOC}/cartel-cnn-celulas.pdf`,
  },
  {
    id: 'mrp4-reposicionamiento-jovenes',
    year: '2025',
    event: '13.er Encuentro de Jóvenes Investigadoras e Investigadores, Querétaro',
    title: 'Reposicionamiento de fármacos in silico para la búsqueda de inhibidores de MRP4',
    short: 'Reposicionamiento de fármacos para inhibir MRP4',
    authors: 'Franco-Chávez B., Urdez-Rojas L.Á., Álvarez-Baltazar J.M., Aguilera-Durán G., Romo-Mancillas A.',
    lab: 'Grupo de Diseño Asistido por Computadora y Síntesis de Fármacos, Facultad de Química, UAQ',
    summary:
      'Modelado por homología, acoplamiento, dinámica molecular y metadinámica sobre fármacos aprobados. Albendazol mostró una afinidad comparable al inhibidor de control; lifitegrast y avatrombopag la superaron, y lifitegrast destacó por la estabilidad de sus interacciones con MRP4.',
    src: `${IMG}/cartel-mrp4-reposicionamiento-jovenes.jpg`,
    preview: `${IMG}/cartel-mrp4-reposicionamiento-jovenes-sm.jpg`,
    pdf: `${DOC}/cartel-mrp4-reposicionamiento-jovenes.pdf`,
  },
  {
    id: 'mrp4-productos-naturales',
    number: '43',
    year: '2025',
    event: 'XI Simposio «Tendencias actuales en la búsqueda y desarrollo de fármacos», UNAM',
    title:
      'Identificación de productos naturales como potenciales inhibidores del transportador MRP4 mediante acoplamiento molecular a gran escala y simulaciones de dinámica molecular',
    short: 'Productos naturales contra MRP4',
    authors: 'Urdez-Rojas L.Á., Franco-Chávez B., Álvarez-Baltazar J.M., Aguilera-Durán G., Romo-Mancillas A.',
    lab: 'Grupo de Diseño Asistido por Computadora y Síntesis de Fármacos, Facultad de Química, UAQ',
    summary:
      'Acoplamiento molecular de las 36,455 moléculas del Natural Products Atlas contra modelos por homología de MRP4. Los tres mejores candidatos se analizaron con dinámica molecular y metadinámica frente a un inhibidor de referencia.',
    src: `${IMG}/cartel-mrp4-productos-naturales.jpg`,
    preview: `${IMG}/cartel-mrp4-productos-naturales-sm.jpg`,
    pdf: `${DOC}/cartel-mrp4-productos-naturales.pdf`,
  },
  {
    id: 'mrp4-reposicionamiento',
    number: '44',
    year: '2025',
    event: 'XI Simposio «Tendencias actuales en la búsqueda y desarrollo de fármacos», UNAM',
    title: 'Reposicionamiento de fármacos in silico para la inhibición de MRP4: un mediador clave en la quimiorresistencia',
    short: 'Reposicionamiento de fármacos contra MRP4',
    authors: 'Franco-Chávez B., Urdez-Rojas L.Á., Álvarez-Baltazar J.M., Aguilera-Durán G., Romo-Mancillas A.',
    lab: 'Grupo de Diseño Asistido por Computadora y Síntesis de Fármacos, Facultad de Química, UAQ',
    summary:
      'Búsqueda de inhibidores de MRP4 entre 8,432 compuestos aprobados de DrugBank, con modelado por homología, acoplamiento molecular y metadinámica.',
    src: `${IMG}/cartel-mrp4-reposicionamiento.jpg`,
    preview: `${IMG}/cartel-mrp4-reposicionamiento-sm.jpg`,
    pdf: `${DOC}/cartel-mrp4-reposicionamiento.pdf`,
  },
  {
    id: 'fluoresceina',
    year: '2023',
    event: 'Coloquio Estudiantil de Instrumentación Analítica 2023-1, Facultad de Química, UAQ',
    title:
      'Optimización de la síntesis de fluoresceína con una resina de intercambio catiónico como catalizador sólido reutilizable, asistida por microondas',
    short: 'Síntesis de fluoresceína asistida por microondas',
    authors: 'Aguilar-Gonzáles E.A., Franco-Chávez B., Martínez-Rubio S., Urdez-Rojas L.A.',
    lab: 'Laboratorio de Instrumentación Analítica, Facultad de Química, UAQ',
    summary:
      'Amberlita-15 sustituye al ZnCl₂ estequiométrico de la síntesis tradicional. Con 10 minutos de irradiación se obtienen rendimientos de hasta 89.6 %, cuantificados por fluorimetría y confirmados por IR y HPLC. Una versión posterior del trabajo obtuvo el primer lugar de carteles en la XVIII Reunión de la AMQO.',
    src: `${IMG}/cartel-fluoresceina.jpg`,
    preview: `${IMG}/cartel-fluoresceina-sm.jpg`,
    pdf: `${DOC}/cartel-fluoresceina.pdf`,
  },
]

function FullscreenViewer({ poster, onClose: close }) {
  const [closing, onClose] = useExitClose(close)
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      data-closing={closing || undefined}
      aria-label={poster.title}
      className="modal-backdrop fixed inset-0 z-50 flex flex-col bg-ink/97 px-3 pt-3 pb-4 backdrop-blur-sm sm:px-6 sm:pt-5"
    >
      <div className="modal-panel flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-zinc-100">{poster.short}</p>
          <p className="truncate font-mono text-[11px] text-zinc-500">
            {poster.year} · {poster.event}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <a href={poster.pdf} target="_blank" rel="noreferrer" aria-label="Abrir PDF" className="tool-btn">
            <Download className="size-4" />
          </a>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="tool-btn">
            <X className="size-5" />
          </button>
        </div>
      </div>
      <div className="spectrum-line modal-panel mt-3 mb-3" />
      <div className="modal-panel min-h-0 flex-1">
        <ZoomCanvas src={poster.src} preview={poster.preview} alt={poster.title} immersive />
      </div>
    </div>
  )
}

export default function Carteles() {
  const revealRef = useRef(null)
  useReveal(revealRef)
  const [current, setCurrentRaw] = useState(0)
  // Cartel saliente y sentido del deslizamiento vertical.
  const [previous, setPrevious] = useState(null)
  const [dir, setDir] = useState(1)
  const setCurrent = useCallback(
    (next) => {
      if (next === current) return
      setPrevious(current)
      setDir(next > current || (current === POSTERS.length - 1 && next === 0) ? 1 : -1)
      setCurrentRaw(next)
    },
    [current],
  )
  const [fullscreen, setFullscreen] = useState(false)
  const poster = POSTERS[current]
  const close = useCallback(() => setFullscreen(false), [])

  // Recorre todos los carteles; se detiene mientras se lee o se acerca uno.
  const stageRef = useRef(null)
  const autoplay = useAutoplay(stageRef, {
    delay: POSTER_DELAY,
    stepKey: current,
    blocked: fullscreen,
    // El bloque ocupa casi toda la pantalla: con pausa al pasar el cursor la
    // rotación parecería no funcionar. Solo la pausa el foco de teclado.
    pauseOnHover: false,
    onAdvance: () => setCurrent((current + 1) % POSTERS.length),
  })

  return (
    <section ref={revealRef} id="carteles" className="mx-auto max-w-6xl 2xl:max-w-7xl scroll-mt-20 px-5 py-16 sm:px-8 md:py-20">
      <header className="mb-10" data-reveal>
        <p className="eyebrow">
          <span className="text-accent">~/</span>carteles
        </p>
        <h2 className="text-gradient mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-[2.5rem] sm:leading-[1.1]">
          Carteles científicos
        </h2>
        <p className="mt-3 max-w-xl text-pretty">
          Los trabajos tal como se presentaron en congresos. Acerca cualquier zona para leer las figuras y
          tablas a resolución completa.
        </p>
      </header>

      <div ref={stageRef} {...autoplay.bind} className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Selector e información: fijos mientras se recorre el cartel. */}
        <div data-reveal className="flex flex-col gap-6 lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
          <AutoplayControls
            {...autoplay}
            delay={POSTER_DELAY}
            stepKey={current}
            label="los carteles"
          />
          <ul className="-mt-3 flex flex-col gap-2" aria-label="Carteles">
            {POSTERS.map((item, index) => {
              const active = index === current
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setCurrent(index)}
                    aria-pressed={active}
                    className={`flex w-full items-center gap-3 rounded-lg border p-2 text-left transition-ui ${
                      active
                        ? 'border-accent/40 bg-accent/[0.06]'
                        : 'border-line bg-surface/60 hover:border-fg/15'
                    }`}
                  >
                    <img
                      src={item.preview}
                      alt=""
                      width={42}
                      height={56}
                      loading="lazy"
                      decoding="async"
                      className="h-14 w-[42px] shrink-0 rounded-sm object-cover object-top"
                    />
                    <span className="min-w-0">
                      <span className={`block text-sm leading-snug ${active ? 'text-zinc-100' : 'text-zinc-300'}`}>
                        {item.short}
                      </span>
                      <span className="mt-0.5 block font-mono text-[11px] text-zinc-500">
                        {item.year}
                        {item.number && ` · cartel ${item.number}`}
                        {item.award && ' · premiado'}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          <div key={poster.id} className="slide-enter">
            {poster.award && (
              <p className="mb-3 inline-flex items-center gap-2 rounded-md border border-amber-500/25 bg-amber-300/[0.07] px-2.5 py-1 text-xs text-amber-800">
                <Award className="size-3.5" aria-hidden="true" />
                {poster.award}
              </p>
            )}
            <h3 className="text-lg leading-snug font-semibold text-balance text-zinc-100">{poster.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-pretty">{poster.summary}</p>
            <dl className="mt-5 space-y-3 border-t border-line pt-4 text-[13px]">
              <div>
                <dt className="font-mono text-[11px] text-zinc-500">Autores</dt>
                <dd className="mt-0.5 text-zinc-300">{poster.authors}</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] text-zinc-500">Presentado en</dt>
                <dd className="mt-0.5 text-zinc-300">
                  {poster.event}, {poster.year}
                </dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFullscreen(true)}
                className="inline-flex h-10 items-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-ink transition-ui hover:bg-accent/85"
              >
                <Expand className="size-4" aria-hidden="true" />
                Pantalla completa
              </button>
              <a
                href={poster.pdf}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-md border border-line bg-fg/[0.03] px-4 text-sm text-zinc-100 transition-ui hover:border-fg/20"
              >
                <Download className="size-4" aria-hidden="true" />
                Abrir PDF
              </a>
            </div>
          </div>
        </div>

        {/* El cartel ocupa la columna ancha a su proporción real (3:4). */}
        <div data-reveal className="hud rounded-lg border border-line bg-surface/60 p-3 sm:p-4 lg:col-span-8">
          {/* Deslizamiento vertical: el cartel anterior sube y sale mientras el
              nuevo entra desde abajo, juntos (al retroceder, al revés). */}
          <div className="relative aspect-[3/4.35] w-full overflow-hidden">
            {previous !== null && previous !== current && (
              <div
                key={`salida-${previous}-${current}`}
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 ${dir < 0 ? 'slide-out-down' : 'slide-out-up'}`}
              >
                <ZoomCanvas src={POSTERS[previous].preview} preview={POSTERS[previous].preview} alt="" />
              </div>
            )}
            <div
              key={poster.id}
              className={`absolute inset-0 ${previous !== null ? (dir < 0 ? 'slide-in-down' : 'slide-in-up') : ''}`}
            >
              <ZoomCanvas src={poster.src} preview={poster.preview} alt={poster.title} onExpand={() => setFullscreen(true)} />
            </div>
          </div>
        </div>
      </div>

      {fullscreen && <FullscreenViewer poster={poster} onClose={close} />}
    </section>
  )
}
