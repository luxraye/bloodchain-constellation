import { SITE } from '../content/site'

const STATS = [
  { value: '6', label: 'Applications' },
  { value: '7', label: 'User roles' },
  { value: 'E2E', label: 'Audit ledger' },
  { value: 'JWT', label: 'Auth · Supabase' },
]

export default function HeroSection({ onExploreClick }) {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(225,29,72,0.18) 0%, transparent 70%)',
        }}
      />
      {/* Fine grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="mx-auto max-w-5xl px-6 pb-16 pt-20 text-center md:pb-24 md:pt-28">
        {/* Eyebrow */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5">
          <span className="h-1.5 w-1.5 animate-glow rounded-full bg-rose-400" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-400">
            {SITE.organization} · Live Demo
          </span>
        </div>

        {/* Headline */}
        <h2 className="mb-5 text-5xl font-black leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
          Every unit of blood.
          <br />
          <span className="bg-gradient-to-r from-rose-400 to-rose-600 bg-clip-text text-transparent">
            Tracked. Tested. Delivered.
          </span>
        </h2>

        {/* Subtext */}
        <p className="mx-auto mb-4 max-w-2xl text-base leading-relaxed text-slate-400 md:text-lg">
          {SITE.projectSubtitle}
        </p>
        <p className="mx-auto mb-10 max-w-2xl text-sm leading-relaxed text-slate-500">
          A constellation of six purpose-built applications connecting donors, collection staff, laboratories, logistics, and national oversight in one secure, auditable platform.
        </p>

        {/* CTAs */}
        <div className="mb-14 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onExploreClick}
            className="group inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-rose-900/40 transition hover:bg-rose-500"
          >
            Explore the Platform
            <svg className="h-4 w-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/10"
          >
            Request a Demo
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        {/* Stats strip */}
        <div className="mx-auto grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8 sm:grid-cols-4">
          {STATS.map(({ value, label }) => (
            <div key={label} className="bg-slate-900/80 px-4 py-4 text-center backdrop-blur-sm">
              <p className="mb-0.5 font-mono text-xl font-black text-white">{value}</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
