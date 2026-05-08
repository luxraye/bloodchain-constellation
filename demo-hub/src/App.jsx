import { useRef } from 'react'
import './index.css'
import AppCard from './AppCard'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import WhoWeAreSection from './components/WhoWeAreSection'
import ContactSection from './components/ContactSection'
import SiteFooter from './components/SiteFooter'
import { APPS } from './content/apps'
import { SITE } from './content/site'

export default function App() {
  const constellationRef = useRef(null)

  const scrollToConstellation = () => {
    constellationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="relative min-h-screen font-sans text-slate-100">
      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-40 border-b border-white/6 bg-slate-950/90 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-3">
            <img
              src="/branding/logo.png"
              alt="Bloodchain"
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 rounded-xl object-contain"
            />
            <div>
              <h1 className="text-sm font-bold tracking-wide text-white">Bloodchain</h1>
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                {SITE.organization}
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 sm:flex">
            {[
              { label: 'About', href: '#about' },
              { label: 'Who we are', href: '#who-we-are' },
              { label: 'Apps', href: '#constellation' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="font-mono text-[11px] uppercase tracking-widest text-slate-500 transition hover:text-slate-200"
              >
                {label}
              </a>
            ))}
            <a
              href="#contact"
              className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest text-rose-400 transition hover:border-rose-500/50 hover:bg-rose-500/20"
            >
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-glow rounded-full bg-emerald-400" />
            <span className="hidden font-mono text-[10px] uppercase tracking-widest text-slate-500 sm:inline">
              Platform live
            </span>
          </div>
        </div>
      </header>

      <HeroSection onExploreClick={scrollToConstellation} />
      <AboutSection />
      <WhoWeAreSection />

      {/* ── Constellation ── */}
      <section ref={constellationRef} id="constellation" className="relative py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-2 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-500">
            The constellation
          </p>
          <h3 className="mb-3 text-center text-3xl font-extrabold tracking-tight text-white">
            Six applications. One platform.
          </h3>
          <p className="mx-auto mb-10 max-w-xl text-center text-sm leading-relaxed text-slate-400">
            Each interface is purpose-built for a specific role in the blood supply chain. Launch directly or open in a device frame where noted.
          </p>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {APPS.map((app) => (
              <AppCard key={app.name} app={app} />
            ))}
          </div>

          {/* Info bar */}
          <div className="mt-10 flex items-start gap-4 rounded-2xl border border-white/8 bg-slate-900/60 p-5 backdrop-blur-sm">
            <div className="mt-0.5 shrink-0">
              <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
            <div className="space-y-1 text-xs leading-relaxed text-slate-400">
              <p>
                <span className="font-semibold text-slate-200">Desktop apps</span> — High Command and Mars Lab open in a new browser tab.
              </p>
              <p>
                <span className="font-semibold text-slate-200">Mobile/tablet apps</span> — Azure (iPhone) and Scyther (iPad) launch inside device frames with live iframes.
              </p>
              <p>
                <span className="font-semibold text-slate-200">QR codes</span> — scan with a device camera to open or install as a PWA where supported.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ContactSection />
      <SiteFooter />
    </div>
  )
}
