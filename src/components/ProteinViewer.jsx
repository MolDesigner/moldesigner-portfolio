import { useEffect, useRef, useState } from 'react'
import { Crosshair, Pause, Play, RotateCcw } from 'lucide-react'

/* Visor 3D de una estructura del PDB con 3Dmol.js. La librería (~600 kB) se
   importa solo cuando el visor se monta, así no pesa en la carga inicial.
   La proteína va en caricatura con gradiente N→C; el ligando, en barras. */
// Giro sobre el eje horizontal (x): la proteína rota de arriba abajo.
const SPIN_AXIS = 'x'
const SITE_RADIUS = 4

// Residuos completos (byres) a menos de SITE_RADIUS Å del ligando, sin él.
const siteSelection = (ligand) => ({
  within: { distance: SITE_RADIUS, sel: { resn: ligand } },
  byres: true,
  not: { resn: ligand },
})

/* Encuadra el sitio de unión (ligando + residuos cercanos) y pone en el
   ligando el centro de rotación: el giro queda alrededor del sitio. */
function frameSite(viewer, ligand, duration) {
  if (!ligand) {
    viewer.zoomTo({}, duration)
    return
  }
  viewer.zoomTo({ or: [{ resn: ligand }, siteSelection(ligand)] }, duration)
  viewer.center({ resn: ligand }, duration)
}

export default function ProteinViewer({ src, ligand, caption }) {
  const hostRef = useRef(null)
  const viewerRef = useRef(null)
  const [status, setStatus] = useState('loading')
  const [spinning, setSpinning] = useState(true)

  useEffect(() => {
    let cancelled = false
    const host = hostRef.current

    // La rueda sola sigue desplazando la página; con Ctrl/⌘ hace zoom en la
    // molécula. Detener la propagación en fase de captura impide que 3Dmol la
    // reciba, sin cancelar el scroll nativo.
    const onWheel = (event) => {
      if (!event.ctrlKey && !event.metaKey) event.stopPropagation()
    }
    host.addEventListener('wheel', onWheel, { capture: true })

    async function load() {
      try {
        const [lib, response] = await Promise.all([import('3dmol'), fetch(src)])
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.text()
        if (cancelled) return
        const $3Dmol = lib.createViewer ? lib : lib.default
        const viewer = $3Dmol.createViewer(host, { backgroundColor: '#03060b', backgroundAlpha: 0, antialias: true })
        viewer.addModel(data, 'pdb')
        // Proteína como cinta tenue de contexto; el sitio de unión en detalle.
        viewer.setStyle({}, { cartoon: { color: 'spectrum', opacity: 0.55 } })
        if (ligand) {
          const site = siteSelection(ligand)
          // Residuos a menos de 4 Å del ligando: barras finas con su etiqueta.
          viewer.setStyle(site, {
            cartoon: { color: 'spectrum', opacity: 0.55 },
            stick: { radius: 0.17, colorscheme: 'default' },
          })
          viewer.setStyle({ resn: ligand }, { stick: { colorscheme: 'greenCarbon', radius: 0.32 } })
          viewer.addResLabels(site, {
            font: 'IBM Plex Mono',
            fontSize: 10,
            fontColor: 'white',
            backgroundColor: '#0f172a',
            backgroundOpacity: 0.65,
            borderThickness: 0,
            inFront: true,
          })
        }
        frameSite(viewer, ligand, 0)
        viewer.render()
        viewer.spin(SPIN_AXIS, 0.4)
        viewerRef.current = viewer
        setStatus('ready')
      } catch {
        if (!cancelled) setStatus('error')
      }
    }
    load()

    return () => {
      cancelled = true
      host.removeEventListener('wheel', onWheel, { capture: true })
      viewerRef.current?.spin(false)
      viewerRef.current?.clear()
      viewerRef.current = null
      host.replaceChildren()
    }
  }, [src, ligand])

  const toggleSpin = () => {
    const viewer = viewerRef.current
    if (!viewer) return
    viewer.spin(spinning ? false : SPIN_AXIS, 0.4)
    setSpinning(!spinning)
  }

  const focusLigand = () => {
    const viewer = viewerRef.current
    if (!viewer || !ligand) return
    frameSite(viewer, ligand, 600)
  }

  const reset = () => {
    const viewer = viewerRef.current
    if (!viewer) return
    viewer.zoomTo({}, 600)
  }

  return (
    <div className="flex flex-col lg:min-h-0 lg:flex-1">
      <div className="viewport relative aspect-[16/10] w-full overflow-hidden lg:aspect-auto lg:min-h-0 lg:flex-1">
        <div ref={hostRef} className="absolute inset-0" aria-label={caption} role="img" />
        {status !== 'ready' && (
          <p className="absolute inset-0 flex items-center justify-center font-mono text-xs text-zinc-500">
            {status === 'error' ? 'No se pudo cargar la estructura.' : 'Cargando estructura…'}
          </p>
        )}
        <div className="absolute top-3 right-3 flex gap-1">
          <button type="button" onClick={toggleSpin} aria-label={spinning ? 'Pausar giro' : 'Girar'} className="tool-btn bg-ink/70">
            {spinning ? <Pause className="size-4" /> : <Play className="size-4" />}
          </button>
          {ligand && (
            <button type="button" onClick={focusLigand} aria-label="Volver al sitio de unión" title="Volver al sitio de unión" className="tool-btn bg-ink/70">
              <Crosshair className="size-4" />
            </button>
          )}
          <button type="button" onClick={reset} aria-label="Ver la proteína completa" title="Ver la proteína completa" className="tool-btn bg-ink/70">
            <RotateCcw className="size-4" />
          </button>
        </div>
        <p className="pointer-events-none absolute bottom-3 left-3 hidden font-mono text-[10px] text-zinc-500 sm:block">
          Arrastra para rotar · Ctrl + rueda para acercar
        </p>
      </div>
    </div>
  )
}
