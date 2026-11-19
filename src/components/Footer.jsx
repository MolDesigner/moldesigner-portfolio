import { Mail } from 'lucide-react'

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

const CURRENT_YEAR = new Date().getFullYear()

const CONTACTS = [
  { label: 'langelur7@gmail.com', href: 'mailto:langelur7@gmail.com', Icon: Mail, external: false },
  { label: 'GitHub', href: 'https://github.com/MolDesigner', Icon: GithubIcon, external: true },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/luis-%C3%A1ngel-urdez-rojas-203253301/',
    Icon: LinkedinIcon,
    external: true,
  },
]

export default function Footer() {
  return (
    <footer id="contacto" className="scroll-mt-20 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-gradient text-2xl font-semibold tracking-tight">¿Colaboramos?</p>
          <p className="mt-2 max-w-sm text-sm text-pretty">
            Abierto a proyectos de investigación en IA aplicada a química, farmacia y biomedicina.
          </p>
        </div>

        <ul className="flex flex-col gap-3 text-sm sm:flex-row sm:flex-wrap sm:gap-6">
          {CONTACTS.map(({ label, href, Icon, external }) => (
            <li key={label}>
              <a
                href={href}
                {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                className="inline-flex items-center gap-2 text-zinc-400 transition-colors hover:text-zinc-100"
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto max-w-6xl border-t border-line px-5 py-6 font-mono text-xs text-zinc-600 sm:px-8">
        © {CURRENT_YEAR} Luis Ángel Urdez Rojas · MolDesigner
      </div>
    </footer>
  )
}
