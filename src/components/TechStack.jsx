import { Atom, Brain, Terminal } from 'lucide-react'

const CATEGORIES = [
  {
    title: 'Deep Learning & IA',
    icon: Brain,
    tone: 'text-sky-300',
    tools: ['PyTorch', 'PyTorch Geometric', 'Scikit-learn'],
  },
  {
    title: 'Quimioinformática & Dinámica Molecular',
    icon: Atom,
    tone: 'text-emerald-300',
    tools: ['RDKit', 'Chemprop', 'DeepChem', 'AutoDock Vina', 'GNINA', 'GROMACS'],
    layout: 'md:col-span-2 lg:col-span-1',
  },
  {
    title: 'Lenguajes & Herramientas',
    icon: Terminal,
    tone: 'text-violet-300',
    tools: ['Python', 'C++', 'LaTeX', 'Linux'],
  },
]

export default function TechStack() {
  return (
    <section id="stack" className="border-y border-line bg-surface/40">
      <div className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-8 md:py-28">
        <header className="mb-10 md:mb-12">
          <p className="font-mono text-xs tracking-wider text-zinc-500 uppercase">
            <span className="text-accent">02</span> · Herramientas
          </p>
          <h2 className="text-gradient mt-3 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            Stack científico y computacional
          </h2>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map(({ title, icon: Icon, tone, tools, layout = '' }) => (
            <div
              key={title}
              className={`rounded-2xl border border-line bg-ink/60 p-6 transition-colors hover:border-white/15 ${layout}`}
            >
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl border border-line bg-white/[0.03]">
                  <Icon className={`size-5 ${tone}`} aria-hidden="true" />
                </span>
                <h3 className="text-base font-medium text-zinc-100">{title}</h3>
              </div>
              <ul className="mt-6 flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <li
                    key={tool}
                    className="rounded-lg border border-line bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-zinc-200 transition-colors hover:border-white/20"
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
