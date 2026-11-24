import { useEffect, useRef, useState } from 'react'
import { Award, Download, Volume2 } from 'lucide-react'
import { useReveal } from '../lib/motion.js'
import ZoomCanvas from './ZoomCanvas.jsx'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, InstagramIcon } from './Instagram.jsx'

const VIDEO = '/media/divulgacion-bioluminiscencia.mp4'
// Volumen inicial: 20 %. El usuario lo puede subir con los controles.
const START_VOLUME = 0.2
const POSTER = '/media/divulgacion-bioluminiscencia.webp'
const AWARD = {
  scan: '/images/premios/amqo-divulgacion.jpg',
  preview: '/images/premios/amqo-divulgacion-sm.jpg',
  pdf: '/docs/premios/amqo-divulgacion.pdf',
  ratio: 2199 / 1647,
}

/* Video de divulgación con su reconocimiento al lado. La constancia queda a
   la vista mientras el video se reproduce; al reproducirlo, el marco de la
   constancia se ilumina para unir las dos piezas. */
export default function Divulgacion() {
  const revealRef = useRef(null)
  useReveal(revealRef)
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef(null)

  // true cuando el navegador bloqueó el sonido y el video arrancó silenciado.
  const [needsSound, setNeedsSound] = useState(false)

  /* Comportamiento al hacer scroll:
     - Al llegar a la sección (la mitad del video a la vista) arranca solo, una
       única vez. Primero intenta con sonido al 20 %; si el navegador bloquea
       el audio porque la persona aún no ha interactuado con la página,
       arranca silenciado y se ofrece «Activar sonido».
     - Si está sonando y deja de verse, se pausa; al volver, se reanuda. Lo que
       el usuario pausó con los controles se queda en pausa.
     - Con movimiento reducido no arranca solo. */
  useEffect(() => {
    const video = videoRef.current
    video.volume = START_VOLUME
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let pausedByScroll = false
    let autoStarted = false

    const autoStart = () => {
      autoStarted = true
      video.muted = false
      video.play().catch(() => {
        video.muted = true
        setNeedsSound(true)
        video.play().catch(() => {})
      })
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry.isIntersecting ? entry.intersectionRatio : 0
        if (ratio < 0.25) {
          if (!video.paused) {
            pausedByScroll = true
            video.pause()
          }
          return
        }
        if (pausedByScroll) {
          pausedByScroll = false
          // play() puede rechazarse si el navegador lo bloquea; no es un error.
          video.play().catch(() => {})
          return
        }
        if (!autoStarted && !reduce && ratio >= 0.5) autoStart()
      },
      { threshold: [0, 0.25, 0.5] },
    )
    io.observe(video)

    // Si la persona activa el sonido desde los controles, se oculta el botón.
    const onVolume = () => !video.muted && setNeedsSound(false)
    video.addEventListener('volumechange', onVolume)
    return () => {
      io.disconnect()
      video.removeEventListener('volumechange', onVolume)
    }
  }, [])

  const enableSound = () => {
    const video = videoRef.current
    video.muted = false
    video.volume = START_VOLUME
    setNeedsSound(false)
  }

  return (
    <section ref={revealRef} id="divulgacion" className="mx-auto max-w-6xl 2xl:max-w-7xl scroll-mt-20 px-5 py-16 sm:px-8 md:py-20">
      <header className="mb-10" data-reveal>
        <p className="eyebrow">
          <span className="text-accent">~/</span>divulgacion
        </p>
        <h2 className="text-gradient mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-[2.5rem] sm:leading-[1.1]">
          ¿Qué es la bioluminiscencia?
        </h2>
        <p className="mt-3 max-w-xl text-pretty">
          Un video de un minuto para explicar por qué algunos seres vivos producen luz. Ganó el primer lugar del
          concurso de divulgación «La química en la vida cotidiana» de la Academia Mexicana de Química Orgánica.
        </p>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 text-[13px] text-zinc-100 transition-ui hover:border-accent/40 hover:bg-accent/[0.06]"
        >
          <InstagramIcon className="size-4" />
          Más divulgación en Instagram · {INSTAGRAM_HANDLE}
        </a>
      </header>

      <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
        <div data-reveal className="mx-auto w-full max-w-[420px] lg:col-span-5 lg:max-w-none">
          <div className="hud relative overflow-hidden rounded-2xl border border-line bg-black">
            <video
              ref={videoRef}
              onLoadedMetadata={(event) => {
                event.currentTarget.volume = START_VOLUME
              }}
              src={VIDEO}
              poster={POSTER}
              controls
              playsInline
              preload="metadata"
              width={810}
              height={1280}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              className="aspect-[810/1280] w-full"
            >
              Tu navegador no puede reproducir este video.
            </video>
            {needsSound && (
              <button
                type="button"
                onClick={enableSound}
                className="absolute top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-ui hover:bg-black/85"
              >
                <Volume2 className="size-4" aria-hidden="true" />
                Activar sonido
              </button>
            )}
          </div>
        </div>

        <div data-reveal className="flex flex-col gap-5 lg:sticky lg:top-24 lg:col-span-7">
          <div
            className={`hud rounded-2xl border bg-surface p-3 transition-[border-color,box-shadow] duration-300 ease-[var(--ease-out)] sm:p-4 ${
              playing ? 'border-accent/50 ring-4 ring-accent/10' : 'border-line'
            }`}
          >
            <div className="aspect-[4/3.4] w-full">
              <ZoomCanvas
                src={AWARD.scan}
                preview={AWARD.preview}
                alt="Constancia del primer lugar en el concurso de divulgación de la AMQO"
                ratio={AWARD.ratio}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 rounded-md border border-amber-500/25 bg-amber-300/[0.08] px-2.5 py-1 text-xs text-amber-800">
                <Award className="size-3.5" aria-hidden="true" />
                Primer lugar, concurso de divulgación científica
              </p>
              <p className="mt-2 text-sm text-zinc-300">
                Academia Mexicana de Química Orgánica · 1 de diciembre de 2023
              </p>
            </div>
            <a
              href={AWARD.pdf}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 text-[13px] text-zinc-100 transition-ui hover:border-accent/40 hover:bg-accent/[0.06]"
            >
              <Download className="size-4" aria-hidden="true" />
              Abrir la constancia
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
