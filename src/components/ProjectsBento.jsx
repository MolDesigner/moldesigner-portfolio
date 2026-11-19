import { useCallback, useEffect, useState } from 'react'
import { ArrowUpRight, Microscope, Network, Pill, ScanSearch, Sparkles, X } from 'lucide-react'

const IMG = '/images/projects'

const PROJECTS = [
  {
    id: 'antibacterial',
    label: 'Tesis de Maestría · En curso',
    title: 'Descubrimiento Antibacteriano con IA',
    summary:
      'Red neuronal de paso de mensajes dirigido (D-MPNN, Chemprop) entrenada en modo multitarea sobre ocho ensayos de HTS de PubChem BioAssay contra dianas esenciales de Staphylococcus aureus —NadD, UgtP, TarO/WTA, LtaS, MgrA, ADN helicasa—, donde la fracción de activos ronda el 1 %.',
    details: [
      'Partición por scaffold de Bemis-Murcko 80:10:10; hiperparámetros con TPE (Optuna) y tres semillas por configuración.',
      'Métricas principales AUC-PR y MCC frente a la fracción basal de activos; ROC, sensibilidad y especificidad como complemento.',
      'Cribado de ZINC20, COCONUT y LANaPDB con dominio de aplicabilidad por Tanimoto sobre ECFP4, y explicabilidad por búsqueda de árbol de Monte Carlo para extraer el subgrafo responsable de cada predicción.',
    ],
    tags: ['Chemprop D-MPNN', 'Multitarea', 'PubChem BioAssay', 'Optuna TPE', 'AUC-PR / MCC', 'MCTS'],
    icon: Network,
    tone: 'text-sky-300',
    layout: 'md:col-span-2 lg:row-span-2',
    featured: true,
  },
  {
    id: 'blood-cells',
    label: 'Visión computacional · Hematología',
    title: 'Clasificación de Células Sanguíneas',
    summary:
      'CNN en cascada en PyTorch sobre KU-Optofil PBC (31,488 imágenes, 13 clases): un generalista de 10 superclases enruta hacia tres especialistas binarios. F1 macro de 0.8319 ± 0.0102 en prueba, por encima del baseline de modelo único (0.8244 ± 0.0135) y de la DenseNet-121 del artículo original (0.8059), con exactitud de 0.9562 ± 0.0010.',
    details: [
      'Generalista de 10 clases: F1 macro 0.9546 ± 0.0012 y exactitud 0.9856 ± 0.0005 en prueba.',
      'Recall de enrutamiento: 99.5 % neutrófilo, 96.3 % linfoide, 89.6 % granulocito inmaduro.',
      'Umbrales por semilla derivados solo sobre validación (mediana de la meseta de F1); 21 checkpoints, tres semillas (42, 1337, 2026).',
    ],
    tags: ['PyTorch', 'CNN en cascada', '13 clases', 'Optuna', 'F1 0.832'],
    icon: Microscope,
    tone: 'text-rose-300',
    figures: [
      {
        src: `${IMG}/pbc-matriz-13clases.jpg`,
        alt: 'Matriz de confusión normalizada de 13 clases del sistema en cascada',
        caption:
          'Matriz de confusión del sistema completo de 13 clases sobre prueba (6,310 imágenes), normalizada por fila, con el ensamble de tres semillas. Las clases mayoritarias superan 0.93; la confusión residual se concentra en el par mielocito / metamielocito y en linfocito reactivo.',
      },
      {
        src: `${IMG}/pbc-mapas-activacion.jpg`,
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
      'CNN binaria programada desde cero en PyTorch sobre Camelyon17-WILDS (455,954 recortes de 96 × 96 de cinco hospitales). La configuración con aumento de color y dropout 0.2 alcanza AUC 0.980 ± 0.003 y exactitud 0.938 ± 0.004 en un hospital nunca visto, frente a AUC 0.657 ± 0.126 sin aumento de datos.',
    details: [
      'Tres bloques convolucionales (32 → 64 → 128) con un solo logit, tres semillas (42, 43, 44) por configuración y 15 configuraciones comparadas.',
      'Aumento de color por ColorJitter y perturbación en el espacio óptico H&E/DAB (deconvolución de Ruifrok & Johnston, esquema de Tellez).',
      'Como triaje con umbral calibrado en el hospital de validación: 98.4 % de sensibilidad ahorrando 31.7 % de los parches, o 99.7 % ahorrando 12.9 %.',
    ],
    tags: ['PyTorch', 'Camelyon17-WILDS', 'H&E/DAB', 'AUC 0.980', 'Grad-CAM'],
    icon: ScanSearch,
    tone: 'text-violet-300',
    figures: [
      {
        src: `${IMG}/camelyon-roc-triaje.jpg`,
        alt: 'Curvas ROC de validación y prueba por semilla',
        caption:
          'Curvas ROC de la configuración B con dropout 0.2 en el hospital de validación (AUC 0.947–0.959) y en el hospital de prueba no visto (AUC 0.977–0.983). El punto marcado es el umbral de triaje al 95 % de sensibilidad objetivo.',
      },
      {
        src: `${IMG}/camelyon-sensibilidad-ahorro.jpg`,
        alt: 'Curva de compromiso entre sensibilidad y ahorro de revisión',
        caption:
          'Compromiso entre sensibilidad empírica y carga de trabajo evitada en el hospital de prueba, con el umbral calibrado en el hospital de validación: 31.7 % de ahorro al 98.4 % de sensibilidad, 12.9 % al 99.7 % y 5.0 % al 99.9 %.',
      },
      {
        src: `${IMG}/camelyon-mosaico-metastasis.jpg`,
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
      'Modelo recurrente LSTM en PyTorch sobre SMILES, evaluado con el benchmark MOSES en 30,000 muestras. La variante v2 alcanza 99.0 % de validez, unicidad 1.000 @1k y 0.999 @10k, novedad 82.9 %, filtros 99.6 % y FCD/Test de 0.082, con perplejidad de validación 1.585.',
    details: [
      'Diversidad interna IntDiv1 0.857 e IntDiv2 0.850; similitud al test SNN 0.607 y cobertura de fragmentos Frag/Test 0.9996.',
      'Barridos de capacidad (h512), dropout y temperatura de muestreo; bitácora de métricas por corrida y semilla.',
      'Preprocesamiento con ClearSMILES y comparación contra la línea base v0 (validez 96.6 %, FCD 0.162).',
    ],
    tags: ['LSTM', 'SMILES', 'MOSES', 'Validez 99.0 %', 'FCD 0.082'],
    icon: Sparkles,
    tone: 'text-amber-300',
    figures: [
      {
        src: `${IMG}/moses-qed-sa.jpg`,
        alt: 'Moléculas generadas con sus valores de QED y accesibilidad sintética',
        caption:
          'Muestras del modelo v2 anotadas con QED (similitud a fármaco) y SA score (accesibilidad sintética). Los valores de QED entre 0.73 y 0.93 con SA menor a 3.2 indican estructuras sintéticamente razonables.',
      },
      {
        src: `${IMG}/moses-muestras.jpg`,
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
      'Cribado virtual de 36,454 productos naturales del Natural Products Atlas y 9,125 fármacos de DrugBank contra el transportador MRP4, diana de quimiorresistencia en leucemia linfoblástica aguda. El reposicionamiento identificó imatinib (ΔG = −64.55 kcal/mol) y avatrombopag (ΔG = −60.81 kcal/mol), ambos por encima del control ceefourin-1 (ΔG = −56.65 kcal/mol).',
    details: [
      'Ensemble docking con GNINA v1.2.3 (CNN score, exhaustividad 16) sobre cuatro conformaciones de MRP4; validación retrospectiva con AUC de 90.4 (8IZ7), 87.1 (9KRM) y 83.3 (8ZBU).',
      'Filtros de exclusión estructural y toxicológica (Brenk, NIH, PAINS), normalización de afinidad SILE y optimización multiparamétrica (MPO) hasta los 1,000 mejores de cada biblioteca.',
      'Dinámica molecular de 100 ns por complejo y metadinámica de 25 ns en membrana POPC; Trp995, Phe368, His152 y Met992 resultaron determinantes para la inhibición.',
    ],
    tags: ['Cribado virtual', 'GNINA', 'Ensemble docking', 'SILE / MPO', 'Dinámica molecular'],
    icon: Pill,
    tone: 'text-emerald-300',
    layout: 'md:col-span-2',
    link: { href: 'https://ri-ng.uaq.mx/handle/123456789/13105', text: 'Ver tesis en el repositorio UAQ' },
    figures: [
      {
        src: `${IMG}/mrp4-embudo-cribado.jpg`,
        alt: 'Embudo de cribado de las bibliotecas Natural Products Atlas y DrugBank',
        caption:
          'Embudo del flujo optimizado. Natural Products Atlas: 29,379 → 26,483 tras el filtro de peso molecular → 7,365 tras los filtros de toxicidad e interferencia (Brenk, NIH, PAINS) → top 1,000 por MPO. DrugBank: 9,125 → 7,395 → 3,556 → top 1,000.',
      },
      {
        src: `${IMG}/mrp4-dinamica-frame820.jpg`,
        alt: 'Render del complejo MRP4-ligando durante la dinámica molecular',
        caption:
          'Complejo MRP4 (silvestre) con el ligando alojado en el sitio de unión, fotograma 820 de una simulación de 100 ns en membrana POPC con agua TIP3P y NaCl 0.15 M, ensamble NPT a 310.15 K.',
      },
      {
        src: `${IMG}/mrp4-interacciones-avatrombopag.jpg`,
        alt: 'Diagrama de interacciones proteína-ligando de avatrombopag con MRP4',
        caption:
          'Perfil de interacciones del complejo MRP4–avatrombopag a lo largo de la trayectoria. Los contactos persistentes con Trp995, Phe368 y Met992 sostienen la afinidad teórica de −60.81 kcal/mol obtenida por metadinámica.',
      },
    ],
  },
]

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
    <svg viewBox="0 0 272 240" className="h-40 w-auto sm:h-48" aria-hidden="true">
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

function FigureStrip({ figures, project, onOpen }) {
  return (
    <ul className="mt-6 grid grid-cols-2 gap-2">
      {figures.map((figure, index) => (
        <li key={figure.src} className={index === 0 && figures.length % 2 === 1 ? 'col-span-2' : ''}>
          <button
            type="button"
            onClick={() => onOpen(project, index)}
            className="group/fig block w-full overflow-hidden rounded-lg border border-line bg-white transition-colors hover:border-white/25"
            aria-label={`Ampliar figura: ${figure.alt}`}
          >
            <img
              src={figure.src}
              alt={figure.alt}
              loading="lazy"
              decoding="async"
              className={`w-full object-cover transition-transform duration-500 group-hover/fig:scale-[1.03] ${
                index === 0 && figures.length % 2 === 1 ? 'h-36 sm:h-44' : 'h-24 sm:h-28'
              }`}
            />
          </button>
        </li>
      ))}
    </ul>
  )
}

function ProjectCard({ project, onOpen }) {
  const { label, title, summary, details, tags, icon: Icon, tone, layout = '', featured, link, figures } = project

  return (
    <article
      className={`group flex flex-col rounded-2xl border border-line bg-surface/80 p-6 transition-colors duration-300 hover:border-white/15 sm:p-7 ${layout}`}
    >
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
            className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-100"
          >
            <ArrowUpRight className="size-5" />
          </a>
        )}
      </div>

      {featured && (
        <div className="relative my-6 flex flex-1 items-center justify-center rounded-xl bg-[radial-gradient(closest-side,rgb(125_211_252/0.08),transparent)]">
          <MessagePassingGraph />
          <span className="absolute right-0 bottom-0 rounded-md border border-line bg-ink/80 px-2 py-1 font-mono text-[10px] text-zinc-400">
            target: <em className="text-sky-300">S. aureus</em>
          </span>
        </div>
      )}

      <p className={`font-mono text-[11px] tracking-wider text-zinc-500 uppercase ${featured ? '' : 'mt-6'}`}>
        {label}
      </p>
      <h3
        className={`mt-2 font-semibold tracking-tight text-zinc-100 ${featured ? 'text-2xl sm:text-3xl' : 'text-lg'}`}
      >
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-pretty">{summary}</p>

      {details && (
        <ul className="mt-4 space-y-2 border-l border-line pl-4 text-[13px] leading-relaxed text-zinc-500">
          {details.map((detail) => (
            <li key={detail} className="text-pretty">
              {detail}
            </li>
          ))}
        </ul>
      )}

      {figures && <FigureStrip figures={figures} project={project} onOpen={onOpen} />}

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
      className="fixed inset-0 z-50 flex flex-col bg-ink/95 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <div className="mx-auto flex w-full max-w-5xl items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-wider text-zinc-500 uppercase">{project.label}</p>
          <p className="mt-1 text-sm font-medium text-zinc-100">{project.title}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="rounded-md border border-line p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100"
        >
          <X className="size-5" />
        </button>
      </div>

      <div
        className="mx-auto flex w-full max-w-5xl flex-1 flex-col overflow-hidden py-4"
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
              className="rounded-md border border-line px-3 py-1.5 font-mono text-[11px] text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100"
            >
              Anterior
            </button>
            <span className="font-mono text-[11px] text-zinc-500">
              {index + 1} / {figures.length}
            </span>
            <button
              type="button"
              onClick={() => onStep(1)}
              className="rounded-md border border-line px-3 py-1.5 font-mono text-[11px] text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProjectsBento() {
  const [lightbox, setLightbox] = useState(null)

  const open = useCallback((project, index) => setLightbox({ project, index }), [])
  const close = useCallback(() => setLightbox(null), [])
  const step = useCallback((delta) => {
    setLightbox((current) => {
      if (!current) return current
      const total = current.project.figures.length
      return { ...current, index: (current.index + delta + total) % total }
    })
  }, [])

  return (
    <section id="proyectos" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-8 md:py-28">
      <header className="mb-10 md:mb-12">
        <p className="font-mono text-xs tracking-wider text-zinc-500 uppercase">
          <span className="text-accent">01</span> · Investigación
        </p>
        <h2 className="text-gradient mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Proyectos destacados
        </h2>
        <p className="mt-3 max-w-2xl text-pretty">
          De la química computacional clásica al aprendizaje profundo: modelos para encontrar, generar y
          evaluar moléculas, y para leer imágenes biomédicas. Haz clic en cualquier figura para verla en
          alta resolución con su pie técnico.
        </p>
      </header>

      <div className="grid auto-rows-auto gap-4 md:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.id} project={project} onOpen={open} />
        ))}
      </div>

      {lightbox && <Lightbox state={lightbox} onClose={close} onStep={step} />}
    </section>
  )
}
