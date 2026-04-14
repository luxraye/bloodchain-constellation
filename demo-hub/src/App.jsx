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
    <div className="min-h-screen font-sans text-slate-800">
      <header className="sticky top-0 z-40 border-b border-sky-100/80 bg-white/90 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <img
              src="/branding/logo.png"
              alt="Bloodchain"
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 rounded-xl object-contain"
            />
            <div>
              <h1 className="text-sm font-bold tracking-wide text-slate-900">Bloodchain</h1>
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                {SITE.organization} · Demo hub
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-6 sm:flex">
            <a href="#about" className="text-xs font-medium text-slate-600 transition hover:text-sky-800">
              About
            </a>
            <a href="#who-we-are" className="text-xs font-medium text-slate-600 transition hover:text-sky-800">
              Who we are
            </a>
            <a href="#constellation" className="text-xs font-medium text-slate-600 transition hover:text-sky-800">
              Apps
            </a>
            <a href="#contact" className="text-xs font-semibold text-sky-700 transition hover:text-sky-900">
              Contact
            </a>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="hidden font-mono text-xs text-slate-500 sm:inline">Prototype online</span>
          </div>
        </div>
      </header>

      <HeroSection onExploreClick={scrollToConstellation} />

      <AboutSection />
      <WhoWeAreSection />

      <section ref={constellationRef} id="constellation" className="mx-auto max-w-7xl px-6 pb-8 pt-4">
        <h3 className="mb-2 text-center text-xs font-bold uppercase tracking-[0.2em] text-sky-600">
          The constellation
        </h3>
        <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-slate-600">
          Six applications—launch each interface below. Mobile experiences open in device frames where noted.
        </p>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {APPS.map((app) => (
            <AppCard key={app.name} app={app} />
          ))}
        </div>

        <div className="mt-12 flex items-start gap-4 rounded-2xl border border-sky-100 bg-white/80 p-5 shadow-sm">
          <span className="mt-0.5 shrink-0 text-2xl">ℹ️</span>
          <div className="space-y-1 text-xs leading-relaxed text-slate-600">
            <p>
              <span className="font-semibold text-slate-800">Desktop apps</span> (High Command &amp; Mars Lab) open in a
              new browser tab.
            </p>
            <p>
              <span className="font-semibold text-slate-800">Mobile / tablet apps</span> (Azure, Scyther) can launch
              inside device-style frames with live iframes where configured.
            </p>
            <p>
              <span className="font-semibold text-slate-800">QR codes</span> are generated for PWA-friendly entry—scan
              with a device camera to open or install where supported.
            </p>
          </div>
        </div>
      </section>

      <ContactSection />
      <SiteFooter />
    </div>
  )
}
