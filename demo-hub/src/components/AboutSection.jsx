const VALUES = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20',
    title: 'Chain of Custody',
    body: 'Every blood unit is logged from donation through collection, lab processing, transit handoffs, and final delivery — creating an unbroken, auditable record.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/20',
    title: 'Clinical Integrity',
    body: 'Role-based access ensures the right people see only the right data. Supervisory workflows, ISBT-128 formatting, and biohazard gates mirror real-world clinical protocols.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: 'text-sky-400',
    bg: 'bg-sky-500/10 border-sky-500/20',
    title: 'National Oversight',
    body: 'High Command gives administrators and Ministry of Health auditors a live view of system-wide supply, verification queues, and activity logs — without touching clinical interfaces.',
  },
]

export default function AboutSection() {
  return (
    <section id="about" className="relative border-y border-white/6 py-20">
      {/* Subtle side glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1/2 -z-10 h-96 w-96 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(225,29,72,0.3) 0%, transparent 70%)' }}
      />

      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-2 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-500">
          What is Bloodchain?
        </p>
        <h3 className="mb-4 text-center text-3xl font-extrabold tracking-tight text-white md:text-4xl">
          Trust through visibility
        </h3>
        <p className="mx-auto mb-14 max-w-2xl text-center text-sm leading-relaxed text-slate-400">
          Bloodchain is a software platform demonstrating how a national blood ecosystem can record and surface every step — who handled a unit, when it moved, and how facilities coordinate — giving governments, hospitals, and NGOs the transparency they need to act with confidence.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {VALUES.map(({ icon, color, bg, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/8 bg-slate-900/60 p-6 backdrop-blur-sm transition hover:border-white/14"
            >
              <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border ${bg} ${color}`}>
                {icon}
              </div>
              <h4 className="mb-2 text-sm font-bold text-white">{title}</h4>
              <p className="text-sm leading-relaxed text-slate-400">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
