import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

/* La página siempre arranca arriba, en la foto de perfil. El script de
   index.html ya lo intenta antes del primer pintado, pero el navegador puede
   restaurar la posición al terminar de cargar; por eso se repite aquí y en el
   evento load. */
function startAtTop() {
  if (location.hash) history.replaceState(null, '', location.pathname + location.search)
  window.scrollTo({ top: 0, behavior: 'instant' })
}
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
startAtTop()
window.addEventListener('load', () => requestAnimationFrame(startAtTop), { once: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
