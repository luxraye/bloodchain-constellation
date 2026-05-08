import { SITE } from '../content/site'

export default function WhoWeAreSection() {
  return (
    <section id="who-we-are" className="py-20">
      <div className="mx-auto max-w-3xl px-6">
        <p className="mb-2 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-500">
          Who we are
        </p>
        <h3 className="mb-10 text-center text-3xl font-extrabold tracking-tight text-white">
          Built for healthcare. Designed for Africa.
        </h3>

        <div className="overflow-hidden rounded-2xl border border-white/8 bg-slate-900/60 backdrop-blur-sm">
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-rose-600 via-rose-500 to-rose-700" />

          <div className="p-8 text-center">
            <p className="mb-1 text-xl font-bold text-white">{SITE.organization}</p>
            <p className="mb-6 font-mono text-xs text-slate-500">{SITE.incubationLine}</p>

            <div className="mx-auto mb-6 h-px max-w-xs bg-white/6" />

            <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-400">
              {SITE.prototypeNote}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {[
                { label: 'React · Vite', color: 'text-sky-400 border-sky-500/20 bg-sky-500/8' },
                { label: 'Supabase Auth', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/8' },
                { label: 'Postgres · Prisma', color: 'text-violet-400 border-violet-500/20 bg-violet-500/8' },
                { label: 'Render Deploy', color: 'text-amber-400 border-amber-500/20 bg-amber-500/8' },
              ].map(({ label, color }) => (
                <span
                  key={label}
                  className={`rounded-lg border px-3 py-1 font-mono text-[11px] font-medium ${color}`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
