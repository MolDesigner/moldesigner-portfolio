import { useEffect, useState } from 'react'
import { FlaskConical, Menu, Moon, Sun, X } from 'lucide-react'

const GITHUB_URL = 'https://github.com/MolDesigner'
const LINKEDIN_URL = 'https://www.linkedin.com/in/%C3%A1ngel-urdez-203253301'

const NAV_ITEMS = [
  { label: 'Sobre mí', href: '#sobre-mi' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Carteles', href: '#carteles' },
  { label: 'Stack', href: '#stack' },
  { label: 'Formación', href: '#formacion' },
  { label: 'Logros', href: '#logros' },
  { label: 'Divulgación', href: '#divulgacion' },
  { label: 'Galería', href: '#galeria' },
  { label: 'Contacto', href: '#contacto' },
]

function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  )
}

function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  )
}

const iconBtn =
  'rounded-md p-2 text-zinc-400 transition-ui hover:bg-fg/5 hover:text-zinc-100'

const THEME_COLOR = { light: '#f8fafc', dark: '#05080f' }

/* El tema inicial lo fija un script en index.html antes del primer pintado;
   aquí solo se lee y se alterna. La elección se guarda en localStorage. */
function ThemeToggle() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light')
  const next = theme === 'dark' ? 'light' : 'dark'

  const toggle = () => {
    document.documentElement.dataset.theme = next
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[next])
    try {
      localStorage.setItem('theme', next)
    } catch {
      // Sin almacenamiento (modo privado): el cambio dura solo esta visita.
    }
    setTheme(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={next === 'dark' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
      title={next === 'dark' ? 'Modo oscuro' : 'Modo claro'}
      className={iconBtn}
    >
      {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  )
}

/* Sección visible: la que cruza una franja a ~35 % de la altura de la
   pantalla. Así se ilumina en la barra el enlace de donde estás. */
function useActiveSection(ids) {
  const [active, setActive] = useState(null)
  useEffect(() => {
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id)
      },
      { rootMargin: '-35% 0px -60% 0px' },
    )
    sections.forEach((section) => io.observe(section))
    const atTop = () => window.scrollY < 120 && setActive(null)
    window.addEventListener('scroll', atTop, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', atTop)
    }
  }, [ids])
  return active
}

const SECTION_IDS = NAV_ITEMS.map((item) => item.href.slice(1))

export default function Navbar() {
  // Menú desplegable para pantallas sin espacio para la barra completa.
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useActiveSection(SECTION_IDS)

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event) => event.key === 'Escape' && setMenuOpen(false)
    const onResize = () => window.innerWidth >= 1280 && setMenuOpen(false)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-50 bg-ink/75 backdrop-blur-xl">
      <a
        href="#proyectos"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-2 focus-visible:left-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:border focus-visible:border-line focus-visible:bg-surface focus-visible:px-3 focus-visible:py-2 focus-visible:text-sm focus-visible:text-zinc-100"
      >
        Saltar al contenido
      </a>
      <nav className="mx-auto flex h-14 max-w-6xl 2xl:max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2 font-mono text-sm font-medium text-zinc-100">
          <FlaskConical className="size-4 text-accent" aria-hidden="true" />
          MolDesigner
        </a>

        {/* Secciones separadas por líneas finas; la actual se ilumina. */}
        <ul className="hidden items-center divide-x divide-line text-[13px] xl:flex 2xl:text-sm">
          {NAV_ITEMS.map((item) => {
            const current = active === item.href.slice(1)
            return (
              <li key={item.href} className="px-1">
                <a
                  href={item.href}
                  aria-current={current ? 'location' : undefined}
                  className={`relative block rounded-md px-2.5 py-1.5 transition-[color,background-color,box-shadow] duration-300 ease-[var(--ease-out)] 2xl:px-3 ${
                    current
                      ? 'bg-accent/10 text-accent shadow-[0_0_18px_-4px_var(--color-accent)]'
                      : 'text-zinc-400 hover:bg-fg/5 hover:text-zinc-100'
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-2.5 -bottom-[9px] h-0.5 rounded-full bg-accent transition-opacity duration-300 ${
                      current ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </a>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="GitHub" className={iconBtn}>
            <GithubIcon className="size-4" />
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" aria-label="LinkedIn" className={iconBtn}>
            <LinkedinIcon className="size-4" />
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
            aria-label={menuOpen ? 'Cerrar el menú' : 'Abrir el menú'}
            className={`${iconBtn} xl:hidden`}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <nav id="menu-movil" aria-label="Secciones" className="grid-enter border-t border-line xl:hidden">
          <ul className="mx-auto grid max-w-6xl 2xl:max-w-7xl grid-cols-2 gap-1 px-5 py-3 sm:grid-cols-3 sm:px-8">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active === item.href.slice(1) ? 'location' : undefined}
                  className={`flex min-h-11 items-center rounded-md px-3 text-[15px] transition-ui ${
                    active === item.href.slice(1)
                      ? 'bg-accent/10 text-accent'
                      : 'text-zinc-300 hover:bg-fg/5 hover:text-zinc-100'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <div className="spectrum-line" aria-hidden="true" />
    </header>
  )
}
