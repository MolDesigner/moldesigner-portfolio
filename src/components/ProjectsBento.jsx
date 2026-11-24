import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { DUR, EASE, MEDIA, STAGGER, gsap, useGSAP, useReveal } from '../lib/motion.js'
import useExitClose from '../hooks/useExitClose.js'
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpenText, FileText, FlaskConical, Maximize2, Pause, Play, Microscope, Network, Pill, ScanSearch, Sparkles, X } from 'lucide-react'

const IMG = '/images/projects'
const AUTOPLAY_MS = 4500
const AUTOPLAY_MODEL_MS = 9000
const DOC = '/docs/proyectos'

const ProteinViewer = lazy(() => import('./ProteinViewer.jsx'))

const PROJECTS = [
  {
    id: 'antibacterial',
    period: '2026 · en curso',
    label: 'Tesis de Maestría',
    title: 'Descubrimiento de nuevos fármacos antibacterianos empleando IA',
    summary:
      'Red neuronal de grafos (D-MPNN) multitarea entrenada con ensayos de PubChem BioAssay contra dianas de S. aureus para priorizar moléculas con potencial actividad antibiótica.',
    brief: {
      problema:
        'Staphylococcus aureus se ha convertido en un problema de salud pública a nivel mundial debido a su resistencia a los antibióticos, manteniendose en la lista de bacterias prioritarias publicada por la OMS. Por otro lado los ensayos de HTS concentran apenas alrededor de 1 % de moléculas activas, puesto que encontrar candidatos a mano hoy en día es un proceso lento y costoso.',
      importancia:
        'La resistencia a los antibióticos es una de las principales amenazas de salud pública. POr lo que emplear soluciones basadas en IA reduce la cantidad de moléculas que hay que sintetizar en el laboratorio y probar en modelos in vitro, reduciendo el espacio de búsqueda, lo que ahorra tiempo y reduce los costos.',
      objetivo:
        'Desarrollar un modelo D-MPNN multitarea que permita prioriar moleculas con potencial actividad contra S. aureus, aplicandolo al proceso de cribado virtual empleando quimiotecas como ZINC20, LANaPDB y COCONUT y utilizar XAI para explicar las predicciones con búsqueda de árbol de Monte Carlo, para lograr identificar scaffolds que permitan encontrar nuevas familias de antibióticos.',
    },
    metrics: [
      { value: '3', label: 'dianas en multitarea' },
      { value: '80:10:10', label: 'split por scaffold' },
      { value: 'XAI', label: 'árboles de Monte Carlo' },
    ],
    tags: ['Chemprop D-MPNN', 'Multitarea', 'MCTS'],
    icon: Network,
    tone: 'text-sky-700',
    accent: 'sky',
    figures: [
      {
        src: `${IMG}/antibacteriano/fundamento-dmpnn.jpg`,
        width: 1600,
        height: 1046,
        pdf: `${DOC}/fundamento-dmpnn.pdf`,
        alt: 'Diagrama del paso de mensajes de la D-MPNN',
        caption:
          'Fundamento de la arquitectira D-MPNN: el SMILES se convierte en un grafo molecular, los mensajes viajan por los enlaces dirigidos y se agregan en un embedding de la molécula que una red feed-forward usa para predecir la actividad en cada diana.',
      },
      {
        src: `${IMG}/antibacteriano/metodologia.jpg`,
        width: 1600,
        height: 978,
        pdf: `${DOC}/metodologia-antibacteriano.pdf`,
        alt: 'Diagrama de la metodología del proyecto antibacteriano',
        caption:
          'Metodología propuesta para el proyecto.',
      },
    ],
  },
  {
    id: 'blood-cells',
    period: '2026',
    label: 'Visión por computadora · Maestría en IA',
    title: 'Clasificación de Células Sanguíneas Periféricas mediante Redes Neuronales Convolucionales',
    summary:
      'CNN entrenada desde cero utilizando 31,489 imágenes de KU-Optofil PBC. La prpuesta incluye un modelo generalista de 10 clases y tres especialistas binarios para 3 tipos celulares díficiles.',
    brief: {
      problema:
        'La clasificación de células sanguíneas se realiza revisando cientos de células al microscopio, se trata de un proceso lento, costoso y con variabilidad entre observadores, sobre todo en células de la misma linea pero diferentes etapas de maduración o función. Los analizadores automáticos básicos pasan por alto detalles morfológicos que son importantes en ciertas patologías como anemia o leucemias.',
      importancia:
        'Las proporciones de cada tipo celular son indicadores tempranos de infecciones, alergias y leucemias. Un error o un retraso en este conteo puede llevar a un diagnóstico o tratamiento equivocado.',
      objetivo: 'Desarrollar un clasificador automático de 13 tipos de células sanguíneas periféricas entrenado y con una arquitectura diseñada desde cero.',
      conclusiones:
        'Una CNN de 4.79 M de parámetros, sin preentrenamiento, superó a DenseNet-121 (0.9523 / 0.8059). Demostrando que dividir el problema en dos niveles mejoró a la vez exactitud y F1, y redujo la variación entre semillas.',
    },
    metrics: [
      { value: '0.9597', label: 'exactitud en prueba' },
      { value: '0.8446', label: 'F1 macro' },
      { value: '0.0014', label: 'desviación entre semillas' },
    ],
    tags: ['PyTorch', 'CNN jerárquica', '13 clases', 'Optuna'],
    icon: Microscope,
    tone: 'text-rose-700',
    accent: 'rose',
    figures: [
      {
        src: `${IMG}/celulas/arquitectura.jpg`,
        width: 764,
        height: 432,
        alt: 'Arquitectura de la CNN de cinco bloques',
        caption:
          'Arquitectura: cinco bloques Conv-BN-ReLU con MaxPool que reducen la imagen de 368 × 368 a 11 × 11 × 512, agrupación global promedio y un clasificador denso con dropout.',
      },
      {
        src: `${IMG}/celulas/matriz-generalista.jpg`,
        width: 1600,
        height: 1523,
        alt: 'Matriz de confusión del modelo generalista de 10 clases',
        caption:
          'Matriz de confusión normalizada del generalista optimizado con Optuna sobre sus 10 superclases.',
      }, 
    ],
  },
  {
    id: 'camelyon',
    period: '2026',
    label: 'Histopatología · Maestría en IA',
    title: 'Generalización entre Hospitales en la Detección de Metástasis mediante Redes Neuronales Convolucionales',
    summary:
      'CNN binaria programada desde cero sobre Camelyon17-WILDS que se evalúa en dos hospitales que nunca vio durante el entrenamiento.',
    brief: {
      problema:
        'Para detectar metástasis de cáncer de mama se revisa el ganglio centinela teñido con tinción H&E. La lámina es enorme y cerca del 95 % del tejido es normal. La tinción y el escáner varian entre hospitales, añadiendo errores y dificultad, pues un modelo puede fallar en hospitales no vistos.',
      importancia:
        'Con tiempo limitado, la sensibilidad del patólogo baja a un AUC de 0.884 (Bejnordi et al., 2017). Una herramienta que priorice las regiones sospechosas reduce el tiempo de análisis, además al integrar XAI orienta la explicabilidad.',
      objetivo:
        'Desarrollar un clasificador de imágenes histopatológicas que detecte tejido metastásico con una alta sensibilidad, medir su robustez en hospitales no vistos con cuatro niveles de aumento de datos y utilice métodos de XAI para explicar sus decisiones con Grad-CAM.',
      conclusiones:
        'El aumento de color en el espacio H&E/DAB sostuvo un AUC de 0.980 en el hospital no visto. Con el umbral de decisión se detecta el 98.4 % de las metástasis y se evita revisar el 31.7 % del tejido. Grad-CAM mostró que la red se fija en las células anormales.',
    },
    metrics: [
      { value: '0.980', label: 'AUC fuera de dominio' },
      { value: '98.4 %', label: 'sensibilidad' },
      { value: '31.7 %', label: 'carga evitada' },
    ],
    tags: ['PyTorch', 'Camelyon17-WILDS', 'H&E', 'Grad-CAM (XAI)'],
    icon: ScanSearch,
    tone: 'text-violet-700',
    accent: 'violet',
    figures: [
      {
        src: `${IMG}/metastasis/arquitectura.jpg`,
        width: 727,
        height: 681,
        alt: 'Arquitectura de la CNN base',
        caption: 'Modelo base: tres bloques convolucionales (32 → 64 → 128 filtros) y un clasificador lineal con sigmoide; 111,681 parámetros en total.',
      },
      {
        src: `${IMG}/metastasis/gradcam.jpg`,
        width: 1442,
        height: 982,
        alt: 'Mapas Grad-CAM (explicabilidad) sobre parches de tejido',
        caption:
          'Grad-CAM como método de explicabilidad (XAI) sobre tres parches: en los dos con metástasis (probabilidad 1.000) la red se concentra en los núcleos tumorales; en el parche normal (0.023) no se activa ninguna región.',
      },
      {
        src: `${IMG}/metastasis/hospitales.jpg`,
        width: 1600,
        height: 674,
        alt: 'Parches normales y con tumor de los cinco hospitales',
        caption:
          'Parches normales y con tumor de los cinco hospitales: tres de entrenamiento, uno de validación y uno de prueba que el modelo nunca ve. La variación de tinción entre centros es el reto de generalización.',
      },
      {
        src: `${IMG}/metastasis/presentacion-portada.jpg`,
        width: 1600,
        height: 900,
        pdf: `${DOC}/presentacion-metastasis.pdf`,
        alt: 'Presentación del proyecto de detección de metástasis',
        caption: 'Presentación del proyecto (10 diapositivas): definición del problema, objetivos, métricas de éxito, datos y alcance.',
      },
    ],
  },
  {
    id: 'moses',
    period: '2026',
    label: 'Modelos generativos · Maestría en IA',
    title: 'Generación de novo de Estructuras Moleculares mediante Redes Neuronales Recurrentes',
    summary:
      'Redes LSTM entrenadas con 1.56 millones de moléculas de la base de datos de MOSES que escriben moléculas nuevas, válidas y con propiedades de fármaco.',
    brief: {
      problema:
        'Se estima que existen entre 10²³ y 10⁶⁰ moléculas posibles con tamaño de fármaco (incluso mas), pero los catálogos más grandes apenas reúnen 10⁶–10⁸ compuestos. Explorar ese espacio por fuerza bruta es practicamente imposible.',
      importancia:
        'Llevar un fármaco al mercado toma más de una década, cuesta unos 2,600 millones de dólares y solo cerca del 10 % lo logra. Generar candidatos nuevos y válidos acelera la búsqueda.',
      objetivo:
        'Entrenar redes recurrentes LSTM que aprendan las reglas del lenguaje SMILES y generen moléculas nuevas, válidas y parecidas a fármacos reales.',
      conclusiones:
        'Cambiar la representación (ClearSMILES con reescritura aleatoria) ayudó más que añadir parámetros: los inválidos bajaron de más del 3 % al 1 %. El mejor modelo llegó a 99.2 % de validez y FCD de 0.0896, con 9 de 9 métricas al nivel del estado del arte.',
    },
    metrics: [
      { value: '99.2 %', label: 'validez química' },
      { value: '0.0896', label: 'FCD / Test' },
      { value: '9 / 9', label: 'métricas en ±2σ' },
    ],
    tags: ['LSTM', 'SMILES', 'ClearSMILES', 'MOSES'],
    icon: Sparkles,
    tone: 'text-amber-700',
    accent: 'amber',
    figures: [
      {
        src: `${IMG}/generacion/arquitectura.jpg`,
        width: 444,
        height: 275,
        alt: 'Arquitectura de la red LSTM',
        caption: 'Arquitectura: embedding de 64 dimensiones, dos capas LSTM de 256 unidades y una capa lineal que predice el siguiente token del SMILES.',
      },
      {
        src: `${IMG}/generacion/moleculas-qed-sa.jpg`,
        width: 1000,
        height: 600,
        alt: 'Moléculas generadas con sus valores de QED y SA',
        caption:
          'Doce moléculas generadas de novo con su QED (similitud a fármaco, 0.70–0.90) y su SA score (accesibilidad sintética, 1.88–3.02): estructuras plausibles y sintetizables.',
      },
      {
        src: `${IMG}/generacion/propiedades.jpg`,
        width: 1600,
        height: 311,
        alt: 'Distribuciones de propiedades de las moléculas generadas frente al conjunto de prueba',
        caption:
          'Peso molecular, logP, número de anillos y enlaces rotables de las moléculas generadas frente al conjunto de prueba. Las distribuciones casi se superponen (KS entre 0.003 y 0.063).',
      },
      {
        src: `${IMG}/generacion/curvas.jpg`,
        width: 900,
        height: 600,
        alt: 'Curvas de entrenamiento y validación',
        caption: 'Entropía cruzada de entrenamiento y validación por época: ambas bajan juntas, sin señales de sobreajuste.',
      },
    ],
  },
  {
    id: 'mrp4',
    period: '2024 – 2026',
    label: 'Tesis de Licenciatura',
    title: 'Identificación in silico de potenciales inhibidores de MRP4/ABCC4 para el tratamiento de la leucemia linfoblástica aguda',
    summary:
      'Cribado virtual de 36,454 productos naturales y 9,125 fármacos contra MRP4, diana de quimiorresistencia en leucemia linfoblástica aguda.',
    brief: {
      problema:
        'En la leucemia linfoblástica aguda, el transportador MRP4 se sobreexpresa y expulsa a los fármacos fuera de la célula, una de las principales causas se debe a la quimiorresistencia mediada por bombas de eflujo como MRP4.',
      importancia:
        'Inhibir MRP4 podría devolver su eficacia a los tratamientos. Buscar inhibidores por métodos computacionales reduce el espacio de búsqueda, disminuyendo costos al priorizar a moléculas prometedoras.',
      objetivo:
        'Identificar inhibidores potenciales de MRP4 entre productos naturales y fármacos aprobados mediante acoplamiento molecular, dinámica molecular, metadinámica y análisis quimioinformático.',
      conclusiones:
        'Los candidatos prioritarios, como imatinib y avatrombopag, alcanzaron afinidades teóricas de −64.55 y −60.81 kcal/mol por metadinámica, lo que los propone para validación experimental.',
    },
    metrics: [
      { value: '90.4', label: 'AUC (8IZ7)' },
      { value: '100 ns', label: 'dinámica por complejo' },
      { value: '−64.55', label: 'ΔG imatinib (kcal/mol)' },
    ],
    tags: ['GNINA', 'Ensemble docking', 'SILE', 'Metadinámica'],
    icon: Pill,
    tone: 'text-emerald-700',
    accent: 'emerald',
    link: { href: 'https://ri-ng.uaq.mx/handle/123456789/13105', text: 'Ver tesis en el repositorio UAQ' },
    model: { src: '/models/8iz7.pdb', ligand: 'SUZ' },
    figureNote: 'Sitio de unión de MRP4 humana con sulindaco (PDB 8IZ7, crio-ME a 3.8 Å): el ligando en verde y los residuos a menos de 4 Å, etiquetados.',
    figures: [],
  },
  {
    id: 'fluoresceina',
    period: '2023',
    label: 'Química verde, primer lugar AMQO 2023',
    title: 'Optimización de la síntesis de fluoresceína asistida por microondas empleando una resina de intercambio iónico como catalizador',
    summary:
      'Síntesis asistida por microondas con Amberlita-15, una resina de intercambio catiónico reutilizable, en lugar del ZnCl₂ utilizado en el método tradicional.',
    brief: {
      problema:
        'La síntesis tradicional de fluoresceína propuesta inicialmente por Adolf von Baeyer usa cloruro de zinc en exceso como catalizador, haciendo que sea difícil de separar del producto, termina como contaminante y no se puede reutilizar.',
      importancia:
        'La fluoresceína se usa como biomarcador y en microscopía, oftalmología y criminología. Una ruta más limpia y rápida reduce residuos y tiempo, en línea con la química verde. Además evita pasos de purificación para generar fluoresceína de grado farmacéutico.',
      objetivo:
        'Optimizar la síntesis con un catalizador sólido reutilizable asistido por microondas, determinar su rendimiento y confirmar la estructura con tres técnicas instrumentales.',
      conclusiones:
        'Con 10 minutos de irradiación se alcanzaron rendimientos de hasta 89.6 %, comparables a la ruta tradicional en mucho menos tiempo. La fluoresceína se confirmó por IR, HPLC y luminiscencia.',
    },
    metrics: [
      { value: '89.6 %', label: 'rendimiento máximo' },
      { value: '10 min', label: 'tiempo de reacción' },
      { value: '0.9935', label: 'R²' },
    ],
    tags: ['Amberlita-15', 'Microondas', 'HPLC · IR', 'Fluorimetría'],
    icon: FlaskConical,
    tone: 'text-lime-700',
    accent: 'lime',
    link: { href: '#carteles', text: 'Ver el cartel completo' },
    publication: {
      href: 'https://www.amqo.org/wp-content/uploads/2023/12/MEMORIAS_XVIII_Reunion_AMQO_V2-comprimido.pdf#page=266',
      text: 'Memorias AMQO, p. 266',
      title: 'Trabajo publicado en las memorias de la XVIII Reunión de la AMQO (2023), página 266',
    },
    figures: [
      {
        src: `${IMG}/fluoresceina/mecanismo-amberlita.jpg`,
        width: 1600,
        height: 816,
        alt: 'Mecanismo de la síntesis de fluoresceína catalizada por Amberlita-15',
        caption:
          'Síntesis de fluoresceína a partir de resorcinol y anhídrido ftálico con Amberlita-15 bajo microondas a 110 °C, con los espectros IR de ambos precursores. El grupo sulfónico de la resina actúa como ácido de Brønsted en cada paso del mecanismo.',
      },
    ],
  },
]

const BRIEF_TABS = [
  ['problema', 'Problema'],
  ['importancia', 'Importancia'],
  ['objetivo', 'Objetivo'],
  ['conclusiones', 'Conclusiones'],
]

/* Ficha del proyecto en pestañas. El panel tiene altura fija (6 líneas) para
   que cambiar de pestaña o de proyecto nunca mueva el layout; un texto más
   largo se desplaza dentro del panel. Conclusiones solo aparece si el
   proyecto ya terminó. */
function Brief({ id, brief, tone }) {
  const tabs = BRIEF_TABS.filter(([key]) => brief?.[key])
  const [active, setActive] = useState(tabs[0]?.[0])
  if (!tabs.length) return null

  return (
    <div className="mt-5">
      <div role="tablist" aria-label="Ficha del proyecto" className="flex gap-1 overflow-x-auto border-b border-line [scrollbar-width:none]">
        {tabs.map(([key, text]) => {
          const selected = key === active
          return (
            <button
              key={key}
              type="button"
              role="tab"
              id={`${id}-tab-${key}`}
              aria-selected={selected}
              aria-controls={`${id}-panel`}
              onClick={() => setActive(key)}
              className={`-mb-px shrink-0 border-b px-2 pb-2 text-[12px] transition-ui ${
                selected ? `border-current ${tone}` : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {text}
            </button>
          )
        })}
      </div>
      <p
        key={active}
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${active}`}
        className="grid-enter mt-3 h-[6lh] overflow-y-auto pr-1 text-sm leading-relaxed text-pretty text-zinc-300 [scrollbar-width:thin]"
      >
        {brief[active]}
      </p>
    </div>
  )
}

const PdfBadge = ({ className = '' }) => (
  <span
    className={`flex items-center gap-1 rounded-sm bg-ink/85 px-1.5 py-0.5 font-mono text-[9px] leading-none text-zinc-100 ${className}`}
  >
    <FileText className="size-2.5" aria-hidden="true" />
    PDF
  </span>
)

/* `direction`: 1 si se avanzó, −1 si se retrocedió, 0 en la carga inicial.
   El marco de la tarjeta nunca se mueve; solo entran sus dos columnas desde
   el lado de la flecha pulsada. En la carga inicial, las métricas aparecen
   escalonadas la primera vez que la tarjeta entra en pantalla. */
function Slide({ project, onOpen, direction, figIndex, underIndex, figDir, onSelectFig, ghost = false }) {
  const { id, period, label, title, summary, brief, metrics, tags, icon: Icon, tone, link, publication, figures, figureNote, model } = project
  const figure = figures[figIndex] ?? figures[0]
  const under = underIndex != null && underIndex !== figIndex ? figures[underIndex] : null
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MEDIA.motion, () => {
        // El cambio de proyecto lo anima el contenedor (deslizamiento CSS);
        // aquí solo queda la revelación inicial de las métricas.
        if (direction === 0 && !ghost) {
          gsap.from('[data-metric]', {
            y: 10,
            autoAlpha: 0,
            duration: DUR.enter,
            ease: EASE.out,
            stagger: STAGGER.base,
            scrollTrigger: { trigger: root.current, start: 'top 75%', once: true },
          })
        }
      })
    },
    { scope: root },
  )

  return (
    <article
      ref={root}
      className="hud grid grid-cols-1 gap-8 rounded-2xl border border-line bg-surface/80 p-6 sm:p-8 lg:min-h-[460px] lg:grid-cols-12 lg:gap-10"
    >
      {/* Columna de texto */}
      <div data-slide-col className="flex flex-col lg:col-span-5">
        <div className="flex items-start justify-between gap-4">
          <span className="flex size-11 items-center justify-center rounded-xl border border-line bg-fg/[0.03]">
            <Icon className={`size-5 ${tone}`} aria-hidden="true" />
          </span>
          <div className="flex items-center gap-1">
          {publication && (
            <a
              href={publication.href}
              target="_blank"
              rel="noreferrer"
              title={publication.title}
              className="inline-flex items-center gap-1.5 rounded-md border border-line px-2 py-1 text-[12px] text-zinc-300 transition-ui hover:border-accent/40 hover:text-zinc-100"
            >
              <BookOpenText className="size-3.5" aria-hidden="true" />
              {publication.text}
            </a>
          )}
          {link && (
            <a
              href={link.href}
              {...(link.href.startsWith('#') ? {} : { target: '_blank', rel: 'noreferrer' })}
              aria-label={link.text}
              title={link.text}
              className="rounded-md p-1.5 text-zinc-500 transition-ui hover:bg-fg/5 hover:text-zinc-100"
            >
              <ArrowUpRight className="size-5" />
            </a>
          )}
          </div>
        </div>

        <p className="mt-6 min-h-[2lh] font-mono text-xs text-zinc-500 lg:min-h-0">
          <span className="text-accent">{period}</span> · {label}
        </p>
        <h3 className="mt-2 line-clamp-3 min-h-[3lh] text-xl leading-snug font-semibold tracking-tight text-balance text-zinc-100 sm:text-[1.35rem]">
          {title}
        </h3>
        <p className="mt-3 line-clamp-3 min-h-[3lh] text-sm leading-relaxed text-pretty">{summary}</p>

        <Brief id={id} brief={brief} tone={tone} />

        <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5">
          {metrics.map((metric) => (
            <div key={metric.label} data-metric>
              <dt className="sr-only">{metric.label}</dt>
              <dd>
                <span className={`block font-mono text-lg leading-none font-medium ${tone}`}>{metric.value}</span>
                <span className="mt-1.5 block min-h-[2lh] text-[11px] leading-tight text-zinc-500">{metric.label}</span>
              </dd>
            </div>
          ))}
        </dl>

        {/* Una sola fila en móvil: así todas las tarjetas miden lo mismo y
            cambiar de proyecto no desplaza la página. */}
        <ul className="mt-auto flex gap-1.5 overflow-x-auto pt-6 [scrollbar-width:none] lg:flex-wrap lg:overflow-visible">
          {tags.map((tag) => (
            <li
              key={tag}
              className="shrink-0 rounded-md border border-line bg-fg/[0.03] px-2 py-0.5 font-mono text-[11px] whitespace-nowrap text-zinc-300"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>

      {/* Columna de figura */}
      <div data-slide-col className="flex flex-col lg:col-span-7">
        {model && ghost ? (
          // La copia saliente no vuelve a cargar el visor 3D: solo su fondo.
          <div className="viewport aspect-[16/10] w-full lg:aspect-auto lg:flex-1" />
        ) : model ? (
          <Suspense fallback={<div className="viewport aspect-[16/10] w-full lg:aspect-auto lg:flex-1" />}>
            <ProteinViewer src={model.src} ligand={model.ligand} caption={figureNote} />
          </Suspense>
        ) : (
          <button
            type="button"
            onClick={() => onOpen(project, figIndex)}
            aria-label={`Ampliar figura: ${figure.alt}`}
            className="group/fig relative block aspect-[16/10] w-full rounded-xl lg:aspect-auto lg:min-h-0 lg:flex-1"
          >
            {/* El panel blanco se ajusta a la figura en vez de enmarcarla: con un
                marco fijo, una matriz cuadrada dejaba 207 px de bandas vacías.
                El contenedor absoluto da al <img> una altura definida; con
                `h-full` sobre `aspect-ratio` se crea un ciclo y la imagen
                desbordaba la tarjeta. */}
            {/* La figura anterior se desvanece (swap-out) mientras la nueva entra
                con la cortina (swap-next/prev); al terminar ya no queda nada de ella. */}
            {under && (
              <span
                key={`${under.src}->${figure.src}`}
                aria-hidden="true"
                className="swap-out absolute inset-0 flex items-center justify-center"
              >
                <img
                  src={under.src}
                  alt=""
                  className="h-auto w-auto max-h-full max-w-full flex-none rounded-xl border border-line bg-white p-3 shadow-sm"
                />
              </span>
            )}
            <span
              key={figure.src}
              className={`absolute inset-0 flex items-center justify-center ${under ? (figDir < 0 ? 'swap-prev' : 'swap-next') : ''}`}
            >
              <img
                src={figure.src}
                alt={figure.alt}
                width={figure.width}
                height={figure.height}
                loading="lazy"
                decoding="async"
                className="h-auto w-auto max-h-full max-w-full flex-none rounded-xl border border-line bg-white p-3 shadow-sm transition-ui group-hover/fig:border-accent/40"
              />
            </span>
            <span className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-md border border-line bg-ink/85 px-2 py-1 font-mono text-[10px] text-zinc-300 opacity-0 transition-opacity duration-150 ease-[var(--ease-out)] group-hover/fig:opacity-100 group-focus-visible/fig:opacity-100">
              <Maximize2 className="size-3" aria-hidden="true" />
              Ver en alta resolución
            </span>
          </button>
        )}

        <div className="mt-4 flex h-11 items-center justify-between gap-4">
          <p className="flex min-w-0 items-center gap-2 text-[11px] leading-snug text-zinc-500">
            {!model && figure.pdf && <PdfBadge className="shrink-0 border border-line" />}
            <span className="line-clamp-2">{model ? figureNote : figure.alt}</span>
          </p>
          {figures.length > 1 && (
            <div className="flex shrink-0 gap-1.5">
              {figures.map((item, index) => (
                <button
                  key={item.src}
                  type="button"
                  onClick={() => onSelectFig(index)}
                  aria-label={`Mostrar figura ${index + 1}: ${item.alt}`}
                  aria-pressed={index === figIndex}
                  className={`relative size-10 overflow-hidden rounded-md border bg-white transition-ui ${
                    index === figIndex ? 'border-accent ring-2 ring-accent/25' : 'border-line opacity-70 hover:opacity-100'
                  }`}
                >
                  {item.pdf && <PdfBadge className="absolute right-0 bottom-0 z-10 rounded-none px-1 text-[8px]" />}
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

function Lightbox({ state, onClose: close, onStep }) {
  const [closing, onClose] = useExitClose(close)
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
      data-closing={closing || undefined}
      aria-label={figure.alt}
      className="modal-backdrop fixed inset-0 z-50 flex flex-col bg-ink/95 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <div className="modal-panel mx-auto flex w-full max-w-5xl items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] text-zinc-500">{project.label}</p>
          <p className="mt-1 text-sm font-medium text-zinc-100">{project.title}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="rounded-md border border-line p-2 text-zinc-400 transition-ui hover:bg-fg/5 hover:text-zinc-100"
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
          {figure.pdf && (
            <a
              href={figure.pdf}
              target="_blank"
              rel="noreferrer"
              className="mx-auto mt-3 flex w-fit items-center gap-2 rounded-md border border-line px-3 py-1.5 text-[13px] text-zinc-100 transition-ui hover:border-accent/40 hover:bg-accent/[0.06]"
            >
              <FileText className="size-4" aria-hidden="true" />
              Abrir el PDF completo
            </a>
          )}
        </figcaption>

        {figures.length > 1 && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onStep(-1)}
              className="rounded-md border border-line px-3 py-1.5 font-mono text-[11px] text-zinc-400 transition-ui hover:bg-fg/5 hover:text-zinc-100"
            >
              Anterior
            </button>
            <span className="font-mono text-[11px] text-zinc-500">
              {index + 1} / {figures.length}
            </span>
            <button
              type="button"
              onClick={() => onStep(1)}
              className="rounded-md border border-line px-3 py-1.5 font-mono text-[11px] text-zinc-400 transition-ui hover:bg-fg/5 hover:text-zinc-100"
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
  const revealRef = useRef(null)
  useReveal(revealRef)
  const [current, setCurrent] = useState(0)
  const [lightbox, setLightbox] = useState(null)

  const total = PROJECTS.length
  const stage = useRef(null)
  const currentRef = useRef(0)
  const [direction, setDirection] = useState(0)
  const [figIndex, setFigIndex] = useState(0)
  // Figura que queda debajo durante la cortina y sentido del cambio.
  const [underIndex, setUnderIndex] = useState(null)
  const [figDir, setFigDir] = useState(1)
  const showFig = useCallback(
    (next) => {
      setUnderIndex(figIndex)
      setFigDir(next >= figIndex ? 1 : -1)
      setFigIndex(next)
    },
    [figIndex],
  )

  /* Cambio direccional: las columnas actuales salen hacia el lado contrario
     (140 ms) y al terminar se monta el proyecto nuevo, que entra desde el lado
     pulsado. `overwrite` hace la transición interrumpible: un segundo clic a
     mitad de la salida la reemplaza en lugar de encolarse. */
  /* Cambio de proyecto con deslizamiento homogéneo, como la galería: el
     proyecto saliente (una copia inerte, `ghost`) y el entrante se mueven
     juntos. El cambio de estado es inmediato; no depende de que termine
     ninguna animación, así un visor 3D ocupado no puede bloquearlo. */
  const [leaving, setLeaving] = useState(null)
  const goTo = useCallback(
    (next, dir) => {
      const from = currentRef.current
      if (next === from) return
      currentRef.current = next
      setLeaving({ index: from, figIndex, key: `${from}->${next}` })
      setDirection(dir)
      setUnderIndex(null)
      setFigIndex(0)
      setCurrent(next)
    },
    [figIndex],
  )

  const go = useCallback((delta) => goTo((currentRef.current + delta + total) % total, delta > 0 ? 1 : -1), [goTo, total])

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

  /* Rotación automática: recorre todas las figuras del proyecto y luego pasa
     al siguiente. Se detiene sola cuando el usuario está interactuando (cursor
     o foco dentro), cuando el carrusel no está a la vista, con un visor abierto
     o con la pestaña oculta. Con movimiento reducido arranca en pausa, y el
     botón de pausa permite detenerla siempre (WCAG 2.2.2). */
  const [paused, setPaused] = useState(() => window.matchMedia(MEDIA.reduce).matches)
  const [engaged, setEngaged] = useState(false)
  const [inView, setInView] = useState(false)
  const [pageHidden, setPageHidden] = useState(false)
  const [retry, setRetry] = useState(0)
  const running = !paused && !engaged && inView && !pageHidden && !lightbox
  const dwell = project.model ? AUTOPLAY_MODEL_MS : AUTOPLAY_MS

  useEffect(() => {
    const el = stage.current
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 })
    io.observe(el)
    const onVisibility = () => setPageHidden(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  useEffect(() => {
    if (!running) return
    const timer = setTimeout(() => {
      // Un visor de otra sección abierto: se espera otro ciclo sin avanzar.
      if (document.querySelector('[role="dialog"]')) return setRetry((n) => n + 1)
      if (figIndex < project.figures.length - 1) showFig(figIndex + 1)
      else go(1)
    }, dwell)
    return () => clearTimeout(timer)
  }, [running, current, figIndex, dwell, go, showFig, project.figures.length, retry])

  const onPointerEnter = (event) => event.pointerType === 'mouse' && setEngaged(true)
  const onPointerLeave = (event) => event.pointerType === 'mouse' && setEngaged(false)
  // Solo el foco de teclado pausa; el de un clic se queda en el botón pulsado.
  const onFocus = (event) => event.target.matches(':focus-visible') && setEngaged(true)
  const onBlur = (event) => !event.currentTarget.contains(event.relatedTarget) && setEngaged(false)

  return (
    <section ref={revealRef} id="proyectos" className="mx-auto max-w-6xl 2xl:max-w-7xl scroll-mt-20 px-5 py-16 sm:px-8 md:py-20">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-6" data-reveal>
        <div>
          <p className="eyebrow">
            <span className="text-accent">~/</span>proyectos
          </p>
          <h2 className="text-gradient mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-[2.5rem] sm:leading-[1.1]">
            Proyectos destacados
          </h2>
          <p className="mt-3 max-w-xl text-pretty">
            Seis proyectos, del más reciente al primero que hice en el laboratorio. Cada tarjeta resume el
            problema, el objetivo y, cuando el proyecto ya terminó, lo que encontré.
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
              className="rounded-lg border border-line p-2 text-zinc-400 transition-ui hover:bg-fg/5 hover:text-zinc-100"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Proyecto siguiente"
              className="rounded-lg border border-line p-2 text-zinc-400 transition-ui hover:bg-fg/5 hover:text-zinc-100"
            >
              <ArrowRight className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              aria-label={paused ? 'Reanudar la rotación automática' : 'Pausar la rotación automática'}
              aria-pressed={paused}
              className="rounded-lg border border-line p-2 text-zinc-400 transition-ui hover:bg-fg/5 hover:text-zinc-100"
            >
              {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
            </button>
          </div>
        </div>
      </header>

      <div
        ref={stage}
        data-reveal
        aria-live={running ? 'off' : 'polite'}
        aria-roledescription="carrusel"
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        {/* La key remonta la diapositiva al cambiar de proyecto; Slide anima
            su entrada según `direction`. */}
        <div className="grid overflow-x-clip">
          {leaving && leaving.index !== current && (
            <div
              key={leaving.key}
              aria-hidden="true"
              inert
              onAnimationEnd={(event) => event.target === event.currentTarget && setLeaving(null)}
              className={`pointer-events-none [grid-area:1/1] ${direction < 0 ? 'slide-out-right' : 'slide-out-left'}`}
            >
              <Slide
                project={PROJECTS[leaving.index]}
                onOpen={open}
                direction={direction}
                figIndex={leaving.figIndex}
                figDir={1}
                onSelectFig={() => {}}
                ghost
              />
            </div>
          )}
          <div
            key={project.id}
            className={`[grid-area:1/1] ${leaving ? (direction < 0 ? 'slide-in-right' : 'slide-in-left') : ''}`}
          >
            <Slide
              project={project}
              onOpen={open}
              direction={direction}
              figIndex={figIndex}
              underIndex={underIndex}
              figDir={figDir}
              onSelectFig={showFig}
            />
          </div>
        </div>
      </div>

      {/* Progreso del ciclo actual: transform scaleX, nunca width. Se reinicia
          con cada figura y desaparece mientras la rotación está detenida. */}
      <div aria-hidden="true" className="mx-auto mt-5 h-px w-40 overflow-hidden rounded-full bg-zinc-800">
        <div
          key={`${current}-${figIndex}-${running}`}
          className={`h-full origin-left bg-accent transition-opacity duration-200 ${running ? 'opacity-100' : 'opacity-0'}`}
          style={running ? { animation: `autoplay-progress ${dwell}ms linear forwards` } : { transform: 'scaleX(0)' }}
        />
      </div>

      <div data-reveal className="mt-3 flex items-center justify-center gap-1">
        {PROJECTS.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => goTo(index, index > currentRef.current ? 1 : -1)}
            aria-label={`Ir al proyecto ${index + 1}: ${item.title}`}
            aria-current={index === current}
            className="group/dot flex h-6 w-7 items-center justify-center"
          >
            {/* El punto activo se alarga con clip-path, no con width: no
                provoca recálculo de layout. */}
            <span
              aria-hidden="true"
              className={`h-1.5 w-7 rounded-full transition-[clip-path,background-color] duration-200 ease-[var(--ease-out)] ${
                index === current
                  ? 'bg-zinc-200 [clip-path:inset(0_0_round_9999px)]'
                  : 'bg-zinc-700 [clip-path:inset(0_11px_round_9999px)] group-hover/dot:bg-zinc-500'
              }`}
            />
          </button>
        ))}
      </div>

      {lightbox && <Lightbox state={lightbox} onClose={close} onStep={step} />}
    </section>
  )
}
