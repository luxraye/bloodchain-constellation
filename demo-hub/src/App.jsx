import './index.css'
import AppCard from './AppCard'

// ──────────────────────────────────────────────────────────
// PRODUCTION URLS — Replace with live Render/Vercel URLs
// after deployment. Demo will use placeholders if not set.
// ──────────────────────────────────────────────────────────
// Utility to ensure URLs have a protocol (Render only provides the host string)
const normalizeUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  // If it's localhost or an IP, use http, otherwise https
  const protocol = (url.includes('localhost') || url.includes('127.0.0.1')) ? 'http://' : 'https://';
  return protocol + url;
}

const URLS = {
  highCommand: normalizeUrl(import.meta.env.VITE_HIGH_COMMAND_URL  || 'http://localhost:5173'),
  marsLab:     normalizeUrl(import.meta.env.VITE_MARS_LAB_URL      || 'http://localhost:5174'),
  voyager:     normalizeUrl(import.meta.env.VITE_VOYAGER_URL        || 'http://localhost:5175'),
  scyther:     normalizeUrl(import.meta.env.VITE_SCYTHER_URL        || 'http://localhost:5176'),
  azure:       normalizeUrl(import.meta.env.VITE_AZURE_URL          || 'http://localhost:5177'),
}

const APPS = [
  {
    name: 'High Command',
    role: 'Administrative Control Center',
    icon: '⚔',
    accentColor: '#d4a853',
    description: 'Full MoH administrative interface. Manage users, RBAC roles, blood supply analytics, audit ledger, and citizen trust verification queues.',
    stack: ['React', 'Vite', 'TanStack', 'Tremor', 'Supabase'],
    url: URLS.highCommand,
    deviceFrame: null,
    showQr: false,
    status: 'live',
  },
  {
    name: 'Mars Lab',
    role: 'Laboratory Workstation',
    icon: '🔬',
    accentColor: '#22d3ee',
    description: 'High-density lab workstation for TTI screening, keyboard-wedge barcode scanning, component splitting, and regulatory compliance manifest generation.',
    stack: ['React', 'TanStack Table', 'jsPDF', 'Supabase'],
    url: URLS.marsLab,
    deviceFrame: null,
    showQr: false,
    status: 'live',
  },
  {
    name: 'Voyager',
    role: 'Logistics Command Map',
    icon: '🗺',
    accentColor: '#818cf8',
    description: 'Real-time national blood logistics map powered by Deck.gl and MapLibre GL JS. Displays geo-node inventory, active transit routes, and cold-chain alerts.',
    stack: ['React', 'MapLibre GL', 'Deck.gl', 'Supabase'],
    url: URLS.voyager,
    deviceFrame: null,
    showQr: true,
    status: 'alert',
  },
  {
    name: 'Scyther',
    role: 'Field Edge Node (Tablet)',
    icon: '📟',
    accentColor: '#4ade80',
    description: 'Offline-first MoH field tablet app. WatermelonDB local edge database, barcode collection via html5-qrcode hardware module, and auto-sync on reconnection.',
    stack: ['React', 'WatermelonDB', 'html5-qrcode', 'Supabase'],
    url: URLS.scyther,
    deviceFrame: 'ipad',
    showQr: true,
    status: 'live',
  },
  {
    name: 'Azure',
    role: 'Citizen Public Portal (PWA)',
    icon: '🩸',
    accentColor: '#f87171',
    description: 'Mobile-first Progressive Web App for citizens. Passwordless Magic Link auth, 3-Tier Trust Tier KYC verification, donation history, and urgent blood appeal alerts.',
    stack: ['React PWA', 'Framer Motion', 'Supabase OTP', 'vite-pwa'],
    url: URLS.azure,
    deviceFrame: 'iphone',
    showQr: true,
    status: 'live',
  },
]

export default function App() {
  return (
    <div className="min-h-screen bg-oled font-sans">
      {/* Header */}
      <header className="border-b border-white/[0.06] bg-surface-50/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-red-600 to-rose-800 flex items-center justify-center text-white font-black text-sm shadow-lg">
              BC
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide">BLOODCHAIN CONSTELLATION</h1>
              <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Unipod Alpha · Ministry of Health, Botswana</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-slate-400">All Systems Operational</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-900/50 bg-rose-900/10 px-4 py-1.5 text-xs font-semibold text-rose-400 mb-6">
          🛡 SRS v2.0 · Deployment Stage: Alpha
        </div>
        <h2 className="text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-4">
          The Software Constellation
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
          Six mission-critical applications unified under one national blood supply chain architecture.
          Select any app below to launch the live interface or test in a hardware-accurate device emulator.
        </p>
      </section>

      {/* App Grid */}
      <main className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {APPS.map(app => (
            <AppCard key={app.name} app={app} />
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-12 rounded-2xl border border-white/5 bg-surface-50 p-5 flex items-start gap-4">
          <span className="text-2xl shrink-0 mt-0.5">ℹ️</span>
          <div className="space-y-1 text-xs text-slate-500 leading-relaxed">
            <p><span className="text-slate-300 font-semibold">Desktop apps</span> (High Command &amp; Mars Lab) open directly in a new browser tab.</p>
            <p><span className="text-slate-300 font-semibold">Mobile/Tablet apps</span> (Azure, Scyther) launch inside hardware-accurate CSS device emulators powered by live production iframes.</p>
            <p><span className="text-slate-300 font-semibold">QR codes</span> are dynamically generated for PWA installation — scan with a device camera to install natively.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
