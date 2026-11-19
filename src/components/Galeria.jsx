import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Award, Expand, FlaskConical, Mic, Users, X } from 'lucide-react'
import ZoomCanvas from './ZoomCanvas.jsx'
import { PHOTOS } from '../data/galeria.js'
import { useReveal } from '../lib/motion.js'
import useExitClose from '../hooks/useExitClose.js'
import useAutoplay from '../hooks/useAutoplay.js'
import AutoplayControls from './AutoplayControls.jsx'

const PHOTO_DELAY = 4000

const SECTIONS = [
  { id: 'congresos', label: 'Congresos', icon: Mic },
  { id: 'laboratorio', label: 'Laboratorio', icon: FlaskConical },
  { id: 'reconocimientos', label: 'Reconocimientos', icon: Award },
  { id: 'comunidad', label: 'Comunidad', icon: Users },
]

const ALL_YEARS = 'todos'

const dateFormat = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
const formatDate = (iso) => dateFormat.format(new Date(`${iso}T12:00:00Z`))
const pad = (n) => String(n).padStart(2, '0')

function Fullscreen({ photo, onClose: close }) {
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
      aria-label={photo.caption}
      className="modal-backdrop fixed inset-0 z-50 flex flex-col bg-ink/97 px-3 pt-3 pb-4 backdrop-blur-sm sm:px-6 sm:pt-5"
    >
      <div className="modal-panel flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-zinc-100">{photo.caption}</p>
          <p className="font-mono text-[11px] text-zinc-500">{formatDate(photo.date)}</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Cerrar" className="tool-btn">
          <X className="size-5" />
        </button>
      </div>
      <div className="spectrum-line modal-panel mt-3 mb-3" />
      <div className="modal-panel min-h-0 flex-1">
        <ZoomCanvas src={photo.src} preview={photo.src} alt={photo.caption} ratio={photo.width / photo.height} immersive />
      </div>
    </div>
  )
}

export default function Galeria() {
  const revealRef = useRef(null)
  useReveal(revealRef)
  const [section, setSection] = useState(SECTIONS[0].id)
  const [year, setYear] = useState(ALL_YEARS)
  const [index, setIndexRaw] = useState(0)
  // Foto que queda debajo durante la cortina y sentido del cambio.
  const [under, setUnder] = useState(null)
  const [dir, setDir] = useState(1)
  const [fullscreen, setFullscreen] = useState(false)
  const stripRef = useRef(null)
  const swipe = useRef(null)

  const inSection = useMemo(() => PHOTOS.filter((p) => p.section === section), [section])
  const years = useMemo(() => [...new Set(inSection.map((p) => p.date.slice(0, 4)))], [inSection])
  const photos = useMemo(
    () => (year === ALL_YEARS ? inSection : inSection.filter((p) => p.date.startsWith(year))),
    [inSection, year],
  )
  const counts = useMemo(() => {
    const base = {}
    for (const p of PHOTOS) base[p.section] = (base[p.section] ?? 0) + 1
    return base
  }, [])

  const photo = photos[index] ?? photos[0]
  const total = photos.length

  const setIndex = useCallback(
    (next, direction = 1) => {
      setUnder(photo)
      setDir(direction)
      setIndexRaw(next)
    },
    [photo],
  )
  const go = useCallback((delta) => setIndex((index + delta + total) % total, delta < 0 ? -1 : 1), [index, setIndex, total])

  /* Recorre el álbum completo de la sección y, al terminarlo, pasa a la
     siguiente sección (con todos los años). Así se ven las 39 fotos. */
  const stageRef = useRef(null)
  const autoplay = useAutoplay(stageRef, {
    delay: PHOTO_DELAY,
    stepKey: `${section}-${year}-${index}`,
    blocked: fullscreen,
    onAdvance: () => {
      if (index < total - 1) return setIndex(index + 1, 1)
      const at = SECTIONS.findIndex((s) => s.id === section)
      setSection(SECTIONS[(at + 1) % SECTIONS.length].id)
      setYear(ALL_YEARS)
      setIndex(0)
    },
  })

  const chooseSection = (id) => {
    setSection(id)
    setYear(ALL_YEARS)
    setIndex(0)
  }
  const chooseYear = (value) => {
    setYear(value)
    setIndex(0)
  }

  // La miniatura activa se mantiene a la vista dentro de la tira.
  useEffect(() => {
    const strip = stripRef.current
    const active = strip?.querySelector('[aria-current="true"]')
    if (!strip || !active) return
    const left = active.offsetLeft - strip.clientWidth / 2 + active.clientWidth / 2
    strip.scrollTo({ left, behavior: 'smooth' })
  }, [index, photos])

  // Precarga de las vecinas: el cambio de foto se siente inmediato.
  useEffect(() => {
    if (total < 2) return
    for (const delta of [1, -1]) {
      const img = new Image()
      img.src = photos[(index + delta + total) % total].src
    }
  }, [index, photos, total])

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      // Evita que el carrusel de proyectos también reaccione.
      event.stopPropagation()
      event.preventDefault()
      go(event.key === 'ArrowRight' ? 1 : -1)
    }
  }

  const onPointerDown = (event) => {
    swipe.current = { x: event.clientX, y: event.clientY }
  }
  const onPointerUp = (event) => {
    const start = swipe.current
    swipe.current = null
    if (!start) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1)
  }

  // Miniaturas agrupadas por año para leer la tira como una línea de tiempo.
  const groups = useMemo(() => {
    const out = []
    photos.forEach((p, i) => {
      const y = p.date.slice(0, 4)
      if (!out.length || out[out.length - 1].year !== y) out.push({ year: y, items: [] })
      out[out.length - 1].items.push({ photo: p, i })
    })
    return out
  }, [photos])

  if (!photo) return null

  return (
    <section ref={revealRef} id="galeria" className="mx-auto max-w-6xl 2xl:max-w-7xl scroll-mt-20 px-5 py-16 sm:px-8 md:py-20">
      <header className="mb-8" data-reveal>
        <p className="eyebrow">
          <span className="text-accent">~/</span>galeria
        </p>
        <h2 className="text-gradient mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-[2.5rem] sm:leading-[1.1]">
          Bitácora en fotos
        </h2>
        <p className="mt-3 max-w-xl text-pretty">
          {PHOTOS.length} fotos ordenadas por la fecha en que se tomaron, de 2021 a 2026. Elige una sección y un año;
          desliza o usa las flechas para recorrerlas.
        </p>
      </header>

      <div data-reveal className="flex flex-wrap gap-2" role="tablist" aria-label="Secciones de la galería">
        {SECTIONS.map(({ id, label, icon: Icon }) => {
          const active = id === section
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => chooseSection(id)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[13px] transition-ui ${
                active
                  ? 'border-accent/40 bg-accent/[0.08] text-zinc-100'
                  : 'border-line text-zinc-400 hover:bg-fg/5 hover:text-zinc-200'
              }`}
            >
              <Icon className="size-3.5" aria-hidden="true" />
              {label}
              <span className="font-mono text-[11px] text-zinc-500">{counts[id]}</span>
            </button>
          )
        })}
      </div>

      <div data-reveal className="mt-3 flex flex-wrap items-center gap-1.5" aria-label="Filtrar por año">
        {[ALL_YEARS, ...years].map((value) => {
          const active = value === year
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              onClick={() => chooseYear(value)}
              className={`rounded-md px-2.5 py-1 font-mono text-[12px] transition-ui ${
                active ? 'bg-zinc-100 text-ink' : 'text-zinc-500 hover:bg-fg/5 hover:text-zinc-200'
              }`}
            >
              {value === ALL_YEARS ? 'todos los años' : value}
            </button>
          )
        })}
        <AutoplayControls
          {...autoplay}
          delay={PHOTO_DELAY}
          stepKey={`${section}-${year}-${index}`}
          label="las fotos"
          className="ml-auto"
        />
      </div>

      {/* Escenario */}
      <div
        ref={stageRef}
        {...autoplay.bind}
        data-reveal
        className="hud mt-6 rounded-xl border border-line bg-surface/60 p-3 outline-none sm:p-4"
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-roledescription="carrusel"
        aria-label={`Galería: ${SECTIONS.find((s) => s.id === section).label}`}
      >
        <div
          className="viewport relative aspect-[4/3] w-full overflow-hidden select-none sm:aspect-[16/9]"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (swipe.current = null)}
          style={{ touchAction: 'pan-y' }}
        >
          {/* Fondo: la misma foto desenfocada rellena las bandas laterales. */}
          <img
            key={`${photo.src}-bg`}
            src={photo.thumb}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-2xl"
          />
                    {/* Deslizamiento horizontal: la foto anterior sale por un lado mientras
              la nueva entra por el otro, juntas. La key reinicia la animación. */}
          {under && under.src !== photo.src && (
            <img
              key={`${under.src}->${photo.src}`}
              src={under.src}
              alt=""
              aria-hidden="true"
              draggable="false"
              className={`absolute inset-0 h-full w-full object-contain ${dir < 0 ? 'slide-out-right' : 'slide-out-left'}`}
            />
          )}
          <img
            key={photo.src}
            src={photo.src}
            alt={photo.caption}
            width={photo.width}
            height={photo.height}
            draggable="false"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-contain ${under ? (dir < 0 ? 'slide-in-right' : 'slide-in-left') : ''}`}
          />

          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Foto anterior"
            className="tool-btn absolute top-1/2 left-3 size-10 -translate-y-1/2 bg-ink/70"
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Foto siguiente"
            className="tool-btn absolute top-1/2 right-3 size-10 -translate-y-1/2 bg-ink/70"
          >
            <ArrowRight className="size-4" />
          </button>
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <span className="rounded-md bg-ink/70 px-2 py-1 font-mono text-[11px] text-zinc-300">
              {pad(index + 1)} / {pad(total)}
            </span>
            <button
              type="button"
              onClick={() => setFullscreen(true)}
              aria-label="Ver en pantalla completa"
              className="tool-btn bg-ink/70"
            >
              <Expand className="size-4" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1" aria-live="polite">
          <p className="text-sm text-zinc-100">{photo.caption}</p>
          <p className="font-mono text-[11px] text-zinc-500">{formatDate(photo.date)}</p>
        </div>

        {/* Tira de miniaturas como línea de tiempo */}
        <div ref={stripRef} className="relative mt-4 flex gap-4 overflow-x-auto pb-2 [scrollbar-width:thin]">
          {groups.map((group) => (
            <div key={group.year} className="flex shrink-0 items-end gap-1.5">
              <span className="mr-1 self-stretch border-l border-accent/40 pl-2 font-mono text-[11px] text-accent [writing-mode:vertical-rl] rotate-180">
                {group.year}
              </span>
              {group.items.map(({ photo: p, i }) => (
                <button
                  key={p.src}
                  type="button"
                  onClick={() => setIndex(i, i < index ? -1 : 1)}
                  aria-label={`${p.caption}, ${formatDate(p.date)}`}
                  aria-current={i === index}
                  className={`h-14 w-20 shrink-0 overflow-hidden rounded-md border transition-ui sm:h-16 sm:w-24 ${
                    i === index ? 'border-accent opacity-100' : 'border-line opacity-55 hover:opacity-90'
                  }`}
                >
                  <img
                    src={p.thumb}
                    alt=""
                    width={96}
                    height={64}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {fullscreen && <Fullscreen photo={photo} onClose={() => setFullscreen(false)} />}
    </section>
  )
}
