import { useCallback, useEffect, useMemo, useState } from 'react'
import { Award, BookOpen, FileCheck2, GraduationCap, Mic, ShieldCheck, Users, X } from 'lucide-react'

const CERT = '/images/certificados'

/* Cada logro está verificado contra su documento en la carpeta de Drive.
   `doc: null` = logro real sin escaneo publicado (documento de identidad). */
const ACHIEVEMENTS = [
  // ---------- Formación ----------
  {
    id: 'maestria',
    group: 'formacion',
    year: '2026',
    title: 'Maestría en Ciencias en Inteligencia Artificial',
    issuer: 'Facultad de Ingeniería, UAQ',
    detail:
      'Inscrito desde julio de 2026. Tesis sobre descubrimiento de fármacos antibacterianos contra S. aureus, dirigida por el Dr. Gendry Alfonso Francia y codirigida por el Dr. José Luis Medina Franco.',
    doc: `${CERT}/inscripcion-maestria-ia.jpg`,
    docLabel: 'Constancia de inscripción',
  },
  {
    id: 'titulo',
    group: 'formacion',
    year: '2026',
    title: 'Químico Farmacéutico Biólogo, titulado',
    issuer: 'Facultad de Química, UAQ',
    detail:
      'Promedio de 9.44/10. Titulación por tesis colectiva aprobada por unanimidad de votos, sobre inhibidores computacionales de MRP4 frente a la quimiorresistencia en leucemia linfoblástica aguda.',
    doc: null,
    docNote: 'Título profesional no publicado por seguridad; disponible a solicitud.',
  },
  {
    id: 'cedula',
    group: 'formacion',
    year: '2026',
    title: 'Cédula profesional QFB',
    issuer: 'Secretaría de Educación Pública',
    detail: 'Cédula 15977462, verificable en el Registro Nacional de Profesionistas.',
    doc: null,
    docNote: 'Documento de identidad no publicado; verificable en el registro oficial de la SEP.',
  },
  {
    id: 'ingles',
    group: 'formacion',
    year: '2026',
    title: 'Certificado de inglés',
    issuer: 'Facultad de Lenguas y Letras, UAQ',
    detail: 'Acreditación del nivel de inglés requerido para el posgrado.',
    doc: `${CERT}/certificado-ingles.jpg`,
  },

  // ---------- Premios ----------
  {
    id: 'egel',
    group: 'premios',
    year: '2026',
    title: 'Testimonio de Desempeño Sobresaliente, EGEL-QFB',
    issuer: 'CENEVAL',
    detail:
      'Máximo nivel de desempeño del Examen General para el Egreso de la Licenciatura, otorgado el 26 de enero de 2026.',
    doc: `${CERT}/egel-sobresaliente.jpg`,
    highlight: true,
  },
  {
    id: 'anfequi',
    group: 'premios',
    year: '2025',
    title: 'Galardón por excelente desempeño académico',
    issuer: 'ANFEQUI',
    detail:
      'Reconocimiento de la Asociación Nacional de Facultades y Escuelas de Química al rendimiento académico sobresaliente.',
    doc: `${CERT}/anfequi-galardon.jpg`,
    highlight: true,
  },
  {
    id: 'cartel-excelencia',
    group: 'premios',
    year: '2024',
    title: 'Cartel de excelencia',
    issuer: 'Semana Cultural, Facultad de Química, UAQ',
    detail:
      'Distinción al cartel sobre optimización de la síntesis de fluoresceína asistida por microondas con resina de intercambio iónico como catalizador.',
    doc: `${CERT}/cartel-excelencia-uaq.jpg`,
    highlight: true,
  },
  {
    id: 'amqo-carteles',
    group: 'premios',
    year: '2023',
    title: 'Primer lugar en presentación de carteles',
    issuer: 'XVIII Reunión de la AMQO, Monterrey',
    detail:
      'Primer lugar en el concurso de carteles de la Academia Mexicana de Química Orgánica, con el trabajo sobre síntesis de fluoresceína asistida por microondas.',
    doc: `${CERT}/amqo-primer-lugar-carteles.jpg`,
    highlight: true,
  },
  {
    id: 'amqo-divulgacion',
    group: 'premios',
    year: '2023',
    title: 'Primer lugar en divulgación científica',
    issuer: 'AMQO · «La química en la vida cotidiana»',
    detail: 'Primer lugar del concurso de divulgación científica en formato de video corto.',
    doc: `${CERT}/amqo-primer-lugar-divulgacion.jpg`,
  },

  // ---------- Investigación ----------
  {
    id: 'sni',
    group: 'investigacion',
    year: '2024',
    title: 'Ayudante de Investigadora Nacional Nivel III',
    issuer: 'SNI · CONAHCYT',
    detail:
      'Nombramiento con estímulo económico como ayudante de la Dra. Rosalía Reynoso Camacho en el Laboratorio de Bioquímica Molecular de la Facultad de Química, UAQ (oct. 2023 – sept. 2024).',
    doc: `${CERT}/sni-ayudante-investigador.jpg`,
    highlight: true,
  },
  {
    id: 'amqo-miembro',
    group: 'investigacion',
    year: '2024',
    title: 'Miembro de la AMQO',
    issuer: 'Academia Mexicana de Química Orgánica',
    detail: 'Membresía vigente para el periodo 2024–2025.',
    doc: `${CERT}/membresia-amqo.jpg`,
  },

  // ---------- Congresos ----------
  {
    id: 'jovenes-investigadores',
    group: 'congresos',
    year: '2025',
    title: 'Ponencia: Identificación in silico de inhibidores de MRP4',
    issuer: '13.er Encuentro de Jóvenes Investigadoras e Investigadores, Querétaro',
    detail: 'Presentación oral del enfoque integral de cribado virtual y dinámica molecular sobre MRP4.',
    doc: `${CERT}/ponencia-jovenes-investigadores.jpg`,
  },
  {
    id: 'cartel-unam',
    group: 'congresos',
    year: '2025',
    title: 'Cartel: productos naturales como inhibidores de MRP4',
    issuer: 'XI Simposio «Tendencias actuales en la búsqueda y desarrollo de fármacos», UNAM',
    detail:
      'Cartel con Franco-Chávez, Álvarez-Baltazar, Aguilera-Durán y Romo-Mancillas sobre acoplamiento molecular a gran escala y dinámica molecular.',
    doc: `${CERT}/cartel-simposio-unam.jpg`,
  },
  {
    id: 'asistencia-unam',
    group: 'congresos',
    year: '2025',
    title: 'Asistencia al XI Simposio de desarrollo de fármacos',
    issuer: 'Facultad de Química, UNAM',
    detail: 'Constancia de asistencia al simposio celebrado en Ciudad de México.',
    doc: `${CERT}/asistencia-simposio-unam.jpg`,
  },
  {
    id: 'cartel-sc-1',
    group: 'congresos',
    year: '2024',
    title: 'Cartel en la Semana Cultural de la Facultad de Química',
    issuer: 'UAQ',
    detail: 'Participación con cartel sobre la síntesis de fluoresceína asistida por microondas.',
    doc: `${CERT}/cartel-semana-cultural-1.jpg`,
  },
  {
    id: 'cartel-sc-2',
    group: 'congresos',
    year: '2024',
    title: 'Presentación en la Semana Cultural de la Facultad de Química',
    issuer: 'UAQ',
    detail: 'Constancia de presentación del trabajo durante la Semana Cultural 2024.',
    doc: `${CERT}/cartel-semana-cultural-2.jpg`,
  },
  {
    id: 'asistencia-xix',
    group: 'congresos',
    year: '2024',
    title: 'Asistencia a la XIX Reunión de la AMQO',
    issuer: 'Academia Mexicana de Química Orgánica, Tepic',
    detail: 'Constancia de asistencia a la reunión anual de la academia.',
    doc: `${CERT}/asistencia-xix-amqo.jpg`,
  },
  {
    id: 'asistencia-biotec',
    group: 'congresos',
    year: '2024',
    title: 'Asistencia al Simposio de Biotecnología',
    issuer: 'UAQ',
    detail: 'Constancia de asistencia al simposio de biotecnología de la Universidad Autónoma de Querétaro.',
    doc: `${CERT}/asistencia-simposio-biotecnologia.jpg`,
  },
  {
    id: 'cartel-xviii',
    group: 'congresos',
    year: '2023',
    title: 'Cartel en la XVIII Reunión de la AMQO',
    issuer: 'Academia Mexicana de Química Orgánica, Monterrey',
    detail: 'Cartel que obtuvo el primer lugar del concurso de carteles de la reunión.',
    doc: `${CERT}/cartel-xviii-amqo.jpg`,
  },
  {
    id: 'asistencia-xviii',
    group: 'congresos',
    year: '2023',
    title: 'Asistencia a la XVIII Reunión de la AMQO',
    issuer: 'Academia Mexicana de Química Orgánica, Monterrey',
    detail: 'Constancia de asistencia a la reunión anual de la academia.',
    doc: `${CERT}/asistencia-xviii-amqo.jpg`,
  },
  {
    id: 'coloquio',
    group: 'congresos',
    year: '2023',
    title: 'Ponencia y cartel en el Coloquio de Instrumentación Analítica',
    issuer: 'Facultad de Química, UAQ',
    detail:
      'Presentación sobre la síntesis de fluoresceína con resina de intercambio catiónico como catalizador sólido reutilizable.',
    doc: `${CERT}/ponencia-coloquio-instrumentacion.jpg`,
  },

  // ---------- Formación complementaria ----------
  {
    id: 'quimioinformatica',
    group: 'cursos',
    year: '2026',
    title: 'Quimioinformática Aplicada al Diseño de Fármacos (20 h)',
    issuer: 'AMQO y TecNM-Tijuana',
    detail: 'Curso especializado de 20 horas en métodos quimioinformáticos para el diseño de fármacos.',
    doc: `${CERT}/curso-quimioinformatica-amqo.jpg`,
    highlight: true,
  },
  {
    id: 'schrodinger',
    group: 'cursos',
    year: '2026',
    title: 'Cyclic Peptide Modeling and Informatics',
    issuer: 'Schrödinger',
    detail: 'Curso oficial de modelado e informática de péptidos cíclicos.',
    doc: `${CERT}/curso-cyclic-peptide-schrodinger.jpg`,
    highlight: true,
  },
  {
    id: 'kaggle-ml',
    group: 'cursos',
    year: '2026',
    title: 'Intro to Machine Learning',
    issuer: 'Kaggle',
    detail: 'Certificado de finalización del curso introductorio de aprendizaje automático.',
    doc: `${CERT}/kaggle-intro-ml.jpg`,
  },
  {
    id: 'kaggle-pandas',
    group: 'cursos',
    year: '2026',
    title: 'Pandas',
    issuer: 'Kaggle',
    detail: 'Certificado de finalización del curso de manipulación de datos con pandas.',
    doc: `${CERT}/kaggle-pandas.jpg`,
  },
  {
    id: 'kaggle-cleaning',
    group: 'cursos',
    year: '2026',
    title: 'Data Cleaning',
    issuer: 'Kaggle',
    detail: 'Certificado de finalización del curso de limpieza de datos.',
    doc: `${CERT}/kaggle-data-cleaning.jpg`,
  },
  {
    id: 'kaggle-viz',
    group: 'cursos',
    year: '2026',
    title: 'Data Visualization',
    issuer: 'Kaggle',
    detail: 'Certificado de finalización del curso de visualización de datos.',
    doc: `${CERT}/kaggle-data-visualization.jpg`,
  },
  {
    id: 'udemy-python',
    group: 'cursos',
    year: '2026',
    title: 'Ultimate Python: de cero a programador experto (18 h)',
    issuer: 'Udemy',
    detail: 'Curso de 18 horas de programación en Python.',
    doc: `${CERT}/curso-python-udemy.jpg`,
  },
  {
    id: 'python-avanzado',
    group: 'cursos',
    year: '2025',
    title: 'Python Certification Course, Advanced Level',
    issuer: 'Insight App',
    detail: 'Certificación de nivel avanzado en programación con Python.',
    doc: `${CERT}/curso-python-avanzado.jpg`,
  },
  {
    id: 'santander-python',
    group: 'cursos',
    year: '2024',
    title: 'Python (8 h)',
    issuer: 'Santander Open Academy',
    detail: 'Curso de 8 horas de fundamentos de Python.',
    doc: `${CERT}/curso-python-santander.jpg`,
  },
  {
    id: 'santander-tech',
    group: 'cursos',
    year: '2024',
    title: 'Tecnologías Emergentes',
    issuer: 'Santander Open Academy',
    detail: 'Curso sobre tecnologías emergentes y su aplicación profesional.',
    doc: `${CERT}/curso-tecnologias-emergentes.jpg`,
  },
  {
    id: 'farmacovigilancia',
    group: 'cursos',
    year: '2023',
    title: 'Farmacovigilancia: seis cursos de detección de señales',
    issuer: 'Uppsala Monitoring Centre (UMC)',
    detail:
      'Seis cursos sobre detección de señales y análisis de causalidad: introducción a la detección de señales, estadística aplicada, evaluación de señales, causalidad en notificaciones, series de casos y ejercicios de causalidad.',
    doc: `${CERT}/curso-farmacovigilancia-umc.jpg`,
    docLabel: 'Uno de los seis certificados',
  },

  // ---------- Docencia ----------
  {
    id: 'tutor-2023-2',
    group: 'docencia',
    year: '2024',
    title: 'Tutor Par Voluntario, Química Orgánica (2023-2)',
    issuer: 'Programa Institucional de Tutorías, UAQ',
    detail: 'Sesiones grupales de Química Orgánica I y II durante el semestre 2023-2.',
    doc: `${CERT}/tutor-par-2023-2.jpg`,
  },
  {
    id: 'tutor-2022-2',
    group: 'docencia',
    year: '2023',
    title: 'Tutor Par Voluntario, Química Orgánica (2022-2)',
    issuer: 'Programa Institucional de Tutorías, UAQ',
    detail: 'Sesiones grupales de Química Orgánica I y II durante el semestre 2022-2.',
    doc: `${CERT}/tutor-par-2022-2.jpg`,
  },
  {
    id: 'tutor-2022-1',
    group: 'docencia',
    year: '2023',
    title: 'Tutor Par Voluntario, Química Orgánica (2022-1)',
    issuer: 'Programa Institucional de Tutorías, UAQ',
    detail: 'Sesiones grupales de Química Orgánica I y II durante el semestre 2022-1.',
    doc: `${CERT}/tutor-par-2022-1.jpg`,
  },
]

const GROUPS = [
  { id: 'todos', label: 'Todos', icon: FileCheck2 },
  { id: 'premios', label: 'Premios', icon: Award },
  { id: 'formacion', label: 'Formación', icon: GraduationCap },
  { id: 'investigacion', label: 'Investigación', icon: ShieldCheck },
  { id: 'congresos', label: 'Congresos', icon: Mic },
  { id: 'cursos', label: 'Cursos', icon: BookOpen },
  { id: 'docencia', label: 'Docencia', icon: Users },
]

const GROUP_LABEL = Object.fromEntries(GROUPS.map((g) => [g.id, g.label]))

function Viewer({ items, index, onClose, onStep }) {
  const item = items[index]

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
      aria-label={item.title}
      className="fixed inset-0 z-50 flex flex-col bg-ink/95 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <div className="mx-auto flex w-full max-w-5xl items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-wider text-zinc-500 uppercase">
            {GROUP_LABEL[item.group]} · {item.year}
          </p>
          <p className="mt-1 text-sm font-medium text-zinc-100">{item.title}</p>
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
          {item.doc ? (
            <img
              src={item.doc}
              alt={`Documento: ${item.title}`}
              decoding="async"
              className="max-h-full max-w-full rounded-lg bg-white object-contain"
            />
          ) : (
            <div className="flex max-w-md flex-col items-center gap-3 rounded-xl border border-line bg-surface/80 p-10 text-center">
              <ShieldCheck className="size-8 text-emerald-300" aria-hidden="true" />
              <p className="text-sm text-pretty text-zinc-400">{item.docNote}</p>
            </div>
          )}
        </div>

        <figcaption className="mx-auto mt-4 max-w-2xl text-center text-[13px] leading-relaxed text-pretty text-zinc-400">
          <span className="text-zinc-200">{item.issuer}</span> · {item.detail}
          {item.docLabel && <span className="mt-1 block font-mono text-[11px] text-zinc-600">{item.docLabel}</span>}
        </figcaption>

        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onStep(-1)}
            className="rounded-md border border-line px-3 py-1.5 font-mono text-[11px] text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100"
          >
            Anterior
          </button>
          <span className="font-mono text-[11px] text-zinc-500">
            {index + 1} / {items.length}
          </span>
          <button
            type="button"
            onClick={() => onStep(1)}
            className="rounded-md border border-line px-3 py-1.5 font-mono text-[11px] text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Logros() {
  const [group, setGroup] = useState('todos')
  const [open, setOpen] = useState(null)

  const items = useMemo(
    () => (group === 'todos' ? ACHIEVEMENTS : ACHIEVEMENTS.filter((item) => item.group === group)),
    [group],
  )

  const counts = useMemo(() => {
    const base = { todos: ACHIEVEMENTS.length }
    for (const item of ACHIEVEMENTS) base[item.group] = (base[item.group] ?? 0) + 1
    return base
  }, [])

  const step = useCallback(
    (delta) => setOpen((index) => (index === null ? index : (index + delta + items.length) % items.length)),
    [items.length],
  )
  const close = useCallback(() => setOpen(null), [])

  const withDoc = ACHIEVEMENTS.filter((item) => item.doc).length

  return (
    <section id="logros" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-8 md:py-28">
      <header className="mb-8">
        <p className="font-mono text-xs tracking-wider text-zinc-500 uppercase">
          <span className="text-accent">04</span> · Trayectoria
        </p>
        <h2 className="text-gradient mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-[2.5rem] sm:leading-[1.1]">
          Logros y certificados
        </h2>
        <p className="mt-3 max-w-2xl text-pretty">
          {ACHIEVEMENTS.length} logros verificados, {withDoc} con su documento consultable. Filtra por categoría y
          haz clic en cualquiera para ver el certificado completo.
        </p>
      </header>

      <div className="mb-8 flex flex-wrap gap-2">
        {GROUPS.map(({ id, label, icon: Icon }) => {
          const active = group === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                setGroup(id)
                setOpen(null)
              }}
              aria-pressed={active}
              className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[13px] transition-colors ${
                active
                  ? 'border-white/20 bg-white/10 text-zinc-100'
                  : 'border-line text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
              }`}
            >
              <Icon className="size-3.5" aria-hidden="true" />
              {label}
              <span className="font-mono text-[11px] text-zinc-500">{counts[id] ?? 0}</span>
            </button>
          )
        })}
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => setOpen(index)}
              className={`group flex h-full w-full flex-col rounded-xl border p-4 text-left transition-colors ${
                item.highlight
                  ? 'border-amber-300/20 bg-gradient-to-br from-amber-300/[0.06] to-transparent hover:border-amber-300/40'
                  : 'border-line bg-surface/80 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-mono text-[11px] tracking-wider text-zinc-500 uppercase">
                  {GROUP_LABEL[item.group]}
                </span>
                <span className="font-mono text-[11px] text-zinc-500">{item.year}</span>
              </div>

              <h3 className="mt-3 text-sm leading-snug font-medium text-balance text-zinc-100">{item.title}</h3>
              <p className="mt-1.5 text-[13px] leading-snug text-zinc-500">{item.issuer}</p>

              <span
                className={`mt-auto inline-flex items-center gap-1.5 pt-4 font-mono text-[11px] transition-colors ${
                  item.doc
                    ? 'text-zinc-500 group-hover:text-zinc-300'
                    : 'text-zinc-600 group-hover:text-zinc-500'
                }`}
              >
                {item.doc ? (
                  <>
                    <FileCheck2 className="size-3" aria-hidden="true" />
                    Ver documento
                  </>
                ) : (
                  <>
                    <ShieldCheck className="size-3" aria-hidden="true" />
                    Verificado, sin publicar
                  </>
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {open !== null && <Viewer items={items} index={open} onClose={close} onStep={step} />}
    </section>
  )
}
