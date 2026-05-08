import { SITE } from '../content/site'

export default function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-white/6 bg-slate-950 py-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-center">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img
              src="/branding/logo.png"
              alt="Bloodchain"
              width={36}
              height={36}
              className="h-9 w-9 rounded-xl object-contain opacity-90"
            />
            <div>
              <p className="text-sm font-bold text-white">{SITE.organization}</p>
              <p className="font-mono text-[10px] text-slate-600">{SITE.incubationLine}</p>
            </div>
          </div>

          {/* Centre: nav links */}
          <div className="flex items-center gap-6">
            {['About', 'Apps', 'Contact'].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                className="font-mono text-[11px] uppercase tracking-widest text-slate-600 transition hover:text-slate-300"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Right: legal */}
          <div className="text-center text-xs text-slate-600 md:text-right">
            <p className="mb-1">© {year} {SITE.organization}. All rights reserved.</p>
            <p className="max-w-xs leading-relaxed">
              Demonstration software. Not a medical device. Not a substitute for national policy or licensed clinical systems.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
