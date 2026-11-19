import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Maximize2, Microscope, Network, Pill, ScanSearch, Sparkles, X } from 'lucide-react'

const IMG = '/images/projects'

const PROJECTS = [
  {
    id: 'antibacterial',
    label: 'Tesis de Maestría · En curso',
    title: 'Descubrimiento Antibacteriano con IA',
    summary:
      'D-MPNN multitarea (Chemprop) entrenada sobre ocho ensayos de HTS de PubChem BioAssay contra dianas esenciales de S. aureus, donde la fracción de activos ronda el 1 %.',
    metrics: [
      { value: '8', label: 'dianas en multitarea' },
      { value: '80:10:10', label: 'split por scaffold' },
      { value: 'AUC-PR', label: 'métrica principal' },
    ],
    tags: ['Chemprop D-MPNN', 'Multitarea', 'Optuna TPE', 'MCTS'],
    icon: Network,
    tone: 'text-sky-300',
    accent: 'sky',
    illustration: true,
    figureNote: 'Paso de mensajes dirigido sobre el grafo molecular.',
  },
  {
    id: 'blood-cells',
    label: 'Visión computacional · Hematología',
    title: 'Clasificación de Células Sanguíneas',
    summary:
      'CNN en cascada en PyTorch sobre KU-Optofil PBC: un generalista de 10 superclases enruta hacia tres especialistas binarios para resolver 13 clases morfológicas.',
    metrics: [
      { value: '0.832', label: 'F1 macro en prueba' },
      { value: '95.6 %', label: 'exactitud' },
      { value: '31,488', label: 'imágenes' },
    ],
    tags: ['PyTorch', 'CNN en cascada', '13 clases', 'Optuna'],
    icon: Microscope,
    tone: 'text-rose-300',
    accent: 'rose',
    figures: [
      {
        src: `${IMG}/pbc-matriz-13clases.jpg`,
        width: 1600,
        height: 1543,
        alt: 'Matriz de confusión normalizada de 13 clases del sistema en cascada',
        caption:
          'Matriz de confusión del sistema completo de 13 clases sobre prueba (6,310 imágenes), normalizada por fila, con el ensamble de tres semillas. Las clases mayoritarias superan 0.93; la confusión residual se concentra en el par mielocito / metamielocito y en linfocito reactivo.',
      },
      {
        src: `${IMG}/pbc-mapas-activacion.jpg`,
        width: 1600,
        height: 534,
        alt: 'Mapas de activación de la CNN sobre un neutrófilo segmentado',
        caption:
          'Mapas de activación de un neutrófilo segmentado: entrada de 368 × 368 × 3, bloque 1 (32 filtros, campo receptivo 3 px) y bloque 5 (512 filtros, 23 × 23, campo receptivo ~170 px). El núcleo lobulado domina la respuesta de las capas profundas.',
      },
    ],
  },
  {
    id: 'camelyon',
    label: 'Histopatología · Robustez entre hospitales',
    title: 'Detección de Metástasis',
    summary:
      'CNN binaria programada desde cero sobre Camelyon17-WILDS. El aumento de color en el espacio óptico H&E/DAB sostiene el desempeño en un hospital nunca visto.',
    metrics: [
      { value: '0.980', label: 'AUC fuera de dominio' },
      { value: '98.4 %', label: 'sensibilidad en triaje' },
      { value: '31.7 %', label: 'carga evitada' },
    ],
    tags: ['PyTorch', 'Camelyon17-WILDS', 'H&E/DAB', 'Grad-CAM'],
    icon: ScanSearch,
    tone: 'text-violet-300',
    accent: 'violet',
    figures: [
      {
        src: `${IMG}/camelyon-roc-triaje.jpg`,
        width: 1600,
        height: 759,
        alt: 'Curvas ROC de validación y prueba por semilla',
        caption:
          'Curvas ROC de la configuración B con dropout 0.2 en el hospital de validación (AUC 0.947–0.959) y en el hospital de prueba no visto (AUC 0.977–0.983). El punto marcado es el umbral de triaje al 95 % de sensibilidad objetivo.',
      },
      {
        src: `${IMG}/camelyon-sensibilidad-ahorro.jpg`,
        width: 1600,
        height: 1055,
        alt: 'Curva de compromiso entre sensibilidad y ahorro de revisión',
        caption:
          'Compromiso entre sensibilidad empírica y carga de trabajo evitada en el hospital de prueba, con el umbral calibrado en el hospital de validación: 31.7 % de ahorro al 98.4 % de sensibilidad, 12.9 % al 99.7 % y 5.0 % al 99.9 %.',
      },
      {
        src: `${IMG}/camelyon-mosaico-metastasis.jpg`,
        width: 1600,
        height: 1467,
        alt: 'Mosaico de recortes con metástasis de los cinco hospitales',
        caption:
          'Recortes de tejido con metástasis de los cinco centros médicos. La variación de tinción entre hospitales es la fuente del desplazamiento de dominio que el aumento de color busca corregir.',
      },
    ],
  },
  {
    id: 'moses',
    label: 'Modelos generativos',
    title: 'Generación Molecular de Novo',
    summary:
      'Modelo recurrente LSTM sobre SMILES evaluado con el benchmark MOSES en 30,000 muestras, con barridos de capacidad, dropout y temperatura de muestreo.',
    metrics: [
      { value: '99.0 %', label: 'validez química' },
      { value: '0.082', label: 'FCD / Test' },
      { value: '82.9 %', label: 'novedad' },
    ],
    tags: ['LSTM', 'SMILES', 'MOSES', 'ClearSMILES'],
    icon: Sparkles,
    tone: 'text-amber-300',
    accent: 'amber',
    figures: [
      {
        src: `${IMG}/moses-qed-sa.jpg`,
        width: 1000,
        height: 600,
        alt: 'Moléculas generadas con sus valores de QED y accesibilidad sintética',
        caption:
          'Muestras del modelo v2 anotadas con QED (similitud a fármaco) y SA score (accesibilidad sintética). Los valores de QED entre 0.73 y 0.93 con SA menor a 3.2 indican estructuras sintéticamente razonables.',
      },
      {
        src: `${IMG}/moses-muestras.jpg`,
        width: 920,
        height: 540,
        alt: 'Rejilla de doce moléculas generadas de novo',
        caption:
          'Doce moléculas generadas de novo por el modelo recurrente, decodificadas desde SMILES. El 99.0 % de las cadenas muestreadas son químicamente válidas y el 82.9 % no aparece en el conjunto de entrenamiento.',
      },
    ],
  },
  {
    id: 'mrp4',
    label: 'Tesis de Licenciatura',
    title: 'Inhibidores in silico de MRP4/ABCC4',
    summary:
      'Cribado virtual de 36,454 productos naturales y 9,125 fármacos contra MRP4, diana de quimiorresistencia en leucemia linfoblástica aguda.',
    metrics: [
      { value: '−64.55', label: 'ΔG imatinib (kcal/mol)' },
      { value: '90.4', label: 'AUC retrospectivo (8IZ7)' },
      { value: '100 ns', label: 'dinámica por complejo' },
    ],
    tags: ['GNINA', 'Ensemble docking', 'SILE / MPO', 'Metadinámica'],
    icon: Pill,
    tone: 'text-emerald-300',
    accent: 'emerald',
    link: { href: 'https://ri-ng.uaq.mx/handle/123456789/13105', text: 'Ver tesis en el repositorio UAQ' },
    figures: [
      {
        src: `${IMG}/mrp4-embudo-cribado.jpg`,
        width: 1600,
        height: 893,
        alt: 'Embudo de cribado de las bibliotecas Natural Products Atlas y DrugBank',
        caption:
          'Embudo del flujo optimizado. Natural Products Atlas: 29,379 → 26,483 tras el filtro de peso molecular → 7,365 tras los filtros de toxicidad e interferencia (Brenk, NIH, PAINS) → top 1,000 por MPO. DrugBank: 9,125 → 7,395 → 3,556 → top 1,000.',
      },
      {
        src: `${IMG}/mrp4-dinamica-frame820.jpg`,
        width: 1003,
        height: 1600,
        alt: 'Render del complejo MRP4-ligando durante la dinámica molecular',
        caption:
          'Complejo MRP4 (silvestre) con el ligando alojado en el sitio de unión, fotograma 820 de una simulación de 100 ns en membrana POPC con agua TIP3P y NaCl 0.15 M, ensamble NPT a 310.15 K.',
      },
      {
        src: `${IMG}/mrp4-interacciones-avatrombopag.jpg`,
        width: 1500,
        height: 644,
        alt: 'Diagrama de interacciones proteína-ligando de avatrombopag con MRP4',
        caption:
          'Perfil de interacciones del complejo MRP4–avatrombopag a lo largo de la trayectoria. Los contactos persistentes con Trp995, Phe368 y Met992 sostienen la afinidad teórica de −60.81 kcal/mol obtenida por metadinámica.',
      },
    ],
  },
]

const ACCENT_GLOW = {
  sky: 'bg-[radial-gradient(closest-side,rgb(125_211_252/0.10),transparent)]',
  rose: 'bg-[radial-gradient(closest-side,rgb(253_164_175/0.08),transparent)]',
  violet: 'bg-[radial-gradient(closest-side,rgb(167_139_250/0.08),transparent)]',
  amber: 'bg-[radial-gradient(closest-side,rgb(252_211_77/0.08),transparent)]',
  emerald: 'bg-[radial-gradient(closest-side,rgb(52_211_153/0.08),transparent)]',
}

/* Ilustración: grafo molecular con aristas activas (paso de mensajes) */
const GRAPH_NODES = [
  [110, 50], [160, 80], [160, 140], [110, 170], [60, 140], [60, 80],
  [210, 50], [260, 80], [210, 170], [110, 225], [12, 50],
]
const GRAPH_EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
  [1, 6], [6, 7], [2, 8], [3, 9], [5, 10],
]
const HOT = new Set([1, 2, 6])

function MessagePassingGraph() {
  return (
    <svg viewBox="0 0 272 240" className="h-full max-h-56 w-auto" aria-hidden="true">
      {GRAPH_EDGES.map(([a, b]) => {
        const hot = HOT.has(a) && HOT.has(b)
        const [x1, y1] = GRAPH_NODES[a]
        const [x2, y2] = GRAPH_NODES[b]
        return (
          <line
            key={`${a}-${b}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={hot ? '#7dd3fc' : 'rgba(255,255,255,0.14)'}
            strokeWidth="1.4"
            strokeDasharray={hot ? '4 4' : undefined}
          >
            {hot && <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1.2s" repeatCount="indefinite" />}
          </line>
        )
      })}
      {GRAPH_NODES.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={HOT.has(i) ? 5 : 4}
          fill={HOT.has(i) ? '#7dd3fc' : '#18181b'}
          stroke={HOT.has(i) ? '#e0f2fe' : 'rgba(255,255,255,0.3)'}
          strokeWidth="1.2"
        />
      ))}
    </svg>
  )
}

function Slide({ project, onOpen }) {
  const { label, title, summary, metrics, tags, icon: Icon, tone, accent, link, figures, illustration, figureNote } =
    project
  const figure = figures?.[0]

  return (
    <article className="slide-enter grid grid-cols-1 gap-8 rounded-2xl border border-line bg-surface/80 p-6 sm:p-8 lg:min-h-[460px] lg:grid-cols-12 lg:gap-10">
      {/* Columna de texto */}
      <div className="flex flex-col lg:col-span-5">
        <div className="flex items-start justify-between gap-4">
          <span className="flex size-11 items-center justify-center rounded-xl border border-line bg-white/[0.03]">
            <Icon className={`size-5 ${tone}`} aria-hidden="true" />
          </span>
          {link && (
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              aria-label={link.text}
              title={link.text}
              className="rounded-md p-1.5 text-zinc-500 transition-ui hover:bg-white/5 hover:text-zinc-100"
            >
              <ArrowUpRight className="size-5" />
            </a>
          )}
        </div>

        <p className="mt-6 font-mono text-[11px] tracking-wider text-zinc-500 uppercase">{label}</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-balance text-zinc-100">{title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-pretty">{summary}</p>

        <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <dt className="sr-only">{metric.label}</dt>
              <dd>
                <span className={`block font-mono text-lg leading-none font-medium ${tone}`}>{metric.value}</span>
                <span className="mt-1.5 block text-[11px] leading-tight text-zinc-500">{metric.label}</span>
              </dd>
            </div>
          ))}
        </dl>

        <ul className="mt-auto flex flex-wrap gap-1.5 pt-6">
          {tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md border border-line bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-zinc-300"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>

      {/* Columna de figura */}
      <div className="flex flex-col lg:col-span-7">
        {illustration ? (
          <div
            className={`flex aspect-[16/10] w-full items-center justify-center rounded-xl border border-line ${ACCENT_GLOW[accent]}`}
          >
            <MessagePassingGraph />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onOpen(project, 0)}
            aria-label={`Ampliar figura: ${figure.alt}`}
            className="group/fig relative block aspect-[16/10] w-full rounded-xl"
          >
            {/* El panel blanco se ajusta a la figura en vez de enmarcarla: con un
                marco fijo, una matriz cuadrada dejaba 207 px de bandas vacías.
                El contenedor absoluto da al <img> una altura definida; con
                `h-full` sobre `aspect-ratio` se crea un ciclo y la imagen
                desbordaba la tarjeta. */}
            <span className="absolute inset-0 flex items-center justify-center">
              <img
                src={figure.src}
                alt={figure.alt}
                width={figure.width}
                height={figure.height}
                loading="lazy"
                decoding="async"
                className="h-auto w-auto max-h-full max-w-full flex-none rounded-xl border border-line bg-white/[0.96] p-3 transition-ui group-hover/fig:border-white/25"
              />
            </span>
            <span className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-md border border-line bg-ink/85 px-2 py-1 font-mono text-[10px] text-zinc-300 opacity-0 transition-opacity duration-150 ease-[var(--ease-out)] group-hover/fig:opacity-100 group-focus-visible/fig:opacity-100">
              <Maximize2 className="size-3" aria-hidden="true" />
              Ver en alta resolución
            </span>
          </button>
        )}

        <div className="mt-4 flex h-11 items-center justify-between gap-4">
          <p className="line-clamp-2 text-[11px] leading-snug text-zinc-500">
            {illustration ? figureNote : figure.alt}
          </p>
          {figures && figures.length > 1 && (
            <div className="flex shrink-0 gap-1.5">
              {figures.map((item, index) => (
                <button
                  key={item.src}
                  type="button"
                  onClick={() => onOpen(project, index)}
                  aria-label={`Ampliar figura ${index + 1}: ${item.alt}`}
                  className="size-10 overflow-hidden rounded-md border border-line bg-white transition-ui hover:border-white/30"
                >
                  <img
                    src={item.src}
                    alt=""
                    width={40}
                    height={40}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

function Lightbox({ state, onClose, onStep }) {
  const { project, index } = state
  const figures = project.figures
  const figure = figures[index]

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onStep(1)
      if (event.key === 'ArrowLeft') onStep(-1)
    }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose, onStep])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={figure.alt}
      className="modal-backdrop fixed inset-0 z-50 flex flex-col bg-ink/95 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <div className="modal-panel mx-auto flex w-full max-w-5xl items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-wider text-zinc-500 uppercase">{project.label}</p>
          <p className="mt-1 text-sm font-medium text-zinc-100">{project.title}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="rounded-md border border-line p-2 text-zinc-400 transition-ui hover:bg-white/5 hover:text-zinc-100"
        >
          <X className="size-5" />
        </button>
      </div>

      <div
        className="modal-panel mx-auto flex w-full max-w-5xl flex-1 flex-col overflow-hidden py-4"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <img
            src={figure.src}
            alt={figure.alt}
            className="max-h-full max-w-full rounded-lg bg-white object-contain"
          />
        </div>

        <figcaption className="mx-auto mt-4 max-w-3xl text-center text-[13px] leading-relaxed text-pretty text-zinc-400">
          {figure.caption}
        </figcaption>

        {figures.length > 1 && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onStep(-1)}
              className="rounded-md border border-line px-3 py-1.5 font-mono text-[11px] text-zinc-400 transition-ui hover:bg-white/5 hover:text-zinc-100"
            >
              Anterior
            </button>
            <span className="font-mono text-[11px] text-zinc-500">
              {index + 1} / {figures.length}
            </span>
            <button
              type="button"
              onClick={() => onStep(1)}
              className="rounded-md border border-line px-3 py-1.5 font-mono text-[11px] text-zinc-400 transition-ui hover:bg-white/5 hover:text-zinc-100"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const pad = (n) => String(n).padStart(2, '0')

export default function ProjectsBento() {
  const [current, setCurrent] = useState(0)
  const [lightbox, setLightbox] = useState(null)

  const total = PROJECTS.length
  const go = useCallback((delta) => setCurrent((index) => (index + delta + total) % total), [total])

  const open = useCallback((project, index) => setLightbox({ project, index }), [])
  const close = useCallback(() => setLightbox(null), [])
  const step = useCallback((delta) => {
    setLightbox((state) => {
      if (!state) return state
      const count = state.project.figures.length
      return { ...state, index: (state.index + delta + count) % count }
    })
  }, [])

  /* Flechas del teclado: navegan el carrusel solo si no hay ningún modal abierto,
     ni el lightbox de esta sección ni el visor de certificados de otra. */
  useEffect(() => {
    if (lightbox) return
    const onKey = (event) => {
      const tag = event.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || event.target.isContentEditable) return
      if (document.querySelector('[role="dialog"]')) return
      if (event.key === 'ArrowRight') go(1)
      if (event.key === 'ArrowLeft') go(-1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [go, lightbox])

  const project = PROJECTS[current]

  return (
    <section id="proyectos" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-8 md:py-28">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-mono text-xs tracking-wider text-zinc-500 uppercase">
            <span className="text-accent">01</span> · Investigación
          </p>
          <h2 className="text-gradient mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-[2.5rem] sm:leading-[1.1]">
            Proyectos destacados
          </h2>
          <p className="mt-3 max-w-xl text-pretty">
            De la química computacional clásica al aprendizaje profundo: modelos para encontrar, generar y
            evaluar moléculas, y para leer imágenes biomédicas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-zinc-500">
            <span className="text-zinc-200">{pad(current + 1)}</span> / {pad(total)}
          </span>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Proyecto anterior"
              className="rounded-lg border border-line p-2 text-zinc-400 transition-ui hover:bg-white/5 hover:text-zinc-100"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Proyecto siguiente"
              className="rounded-lg border border-line p-2 text-zinc-400 transition-ui hover:bg-white/5 hover:text-zinc-100"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </header>

      <div aria-live="polite" aria-roledescription="carrusel">
        {/* La key fuerza el remontaje al cambiar de proyecto; slide-enter anima
            esa entrada con @starting-style en vez de teletransportar el contenido. */}
        <Slide key={project.id} project={project} onOpen={open} />
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {PROJECTS.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setCurrent(index)}
            aria-label={`Ir al proyecto ${index + 1}: ${item.title}`}
            aria-current={index === current}
            className={`h-1.5 rounded-full transition-[width,background-color] duration-200 ease-[var(--ease-out)] ${
              index === current ? 'w-8 bg-zinc-200' : 'w-1.5 bg-zinc-700 hover:bg-zinc-500'
            }`}
          />
        ))}
      </div>

      {lightbox && <Lightbox state={lightbox} onClose={close} onStep={step} />}
    </section>
  )
}
