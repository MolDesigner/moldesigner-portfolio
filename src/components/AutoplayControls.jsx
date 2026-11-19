import { Pause, Play } from 'lucide-react'

/* Botón de pausa y barra de progreso del ciclo actual. La barra usa
   transform: scaleX (nunca width) y se reinicia con `stepKey`. */
export default function AutoplayControls({ running, paused, setPaused, delay, stepKey, label, className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        type="button"
        onClick={() => setPaused((value) => !value)}
        aria-pressed={paused}
        aria-label={paused ? `Reanudar la rotación de ${label}` : `Pausar la rotación de ${label}`}
        className="tool-btn size-8"
      >
        {paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
      </button>
      <div aria-hidden="true" className="h-px w-24 overflow-hidden rounded-full bg-zinc-800">
        <div
          key={`${stepKey}-${running}`}
          className={`h-full origin-left bg-accent transition-opacity duration-200 ${running ? 'opacity-100' : 'opacity-0'}`}
          style={running ? { animation: `autoplay-progress ${delay}ms linear forwards` } : { transform: 'scaleX(0)' }}
        />
      </div>
    </div>
  )
}
