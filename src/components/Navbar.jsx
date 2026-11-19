import { FlaskConical } from 'lucide-react'

const GITHUB_URL = 'https://github.com/MolDesigner'
const LINKEDIN_URL = 'https://www.linkedin.com/in/%C3%A1ngel-urdez-203253301'

const NAV_ITEMS = [
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Stack', href: '#stack' },
  { label: 'Formación', href: '#formacion' },
  { label: 'Logros', href: '#logros' },
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
  'rounded-md p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/70 backdrop-blur-xl">
      <a
        href="#proyectos"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-2 focus-visible:left-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:border focus-visible:border-line focus-visible:bg-surface focus-visible:px-3 focus-visible:py-2 focus-visible:text-sm focus-visible:text-zinc-100"
      >
        Saltar al contenido
      </a>
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2 font-mono text-sm text-zinc-100">
          <FlaskConical className="size-4 text-accent" aria-hidden="true" />
          MolDesigner
        </a>

        <ul className="hidden items-center gap-7 text-sm sm:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="text-zinc-400 transition-colors hover:text-zinc-100">
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="GitHub" className={iconBtn}>
            <GithubIcon className="size-4" />
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" aria-label="LinkedIn" className={iconBtn}>
            <LinkedinIcon className="size-4" />
          </a>
        </div>
      </nav>
    </header>
  )
}
