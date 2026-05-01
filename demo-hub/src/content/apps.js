// Production URLs — set VITE_* in Render; local defaults for dev.

function normalizeUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  let targetUrl = url
  if (!url.includes('.') && !url.includes('localhost')) {
    targetUrl = `${url}.onrender.com`
  }
  const protocol =
    targetUrl.includes('localhost') || targetUrl.includes('127.0.0.1') ? 'http://' : 'https://'
  return protocol + targetUrl
}

function appendGuestParam(url) {
  if (!url) return ''
  const target = new URL(normalizeUrl(url))
  target.searchParams.set('guest', '1')
  return target.toString()
}

export const URLS = {
  highCommand: appendGuestParam(import.meta.env.VITE_HIGH_COMMAND_URL || 'http://localhost:5173'),
  marsLab: appendGuestParam(import.meta.env.VITE_MARS_LAB_URL || 'http://localhost:5174'),
  voyager: appendGuestParam(import.meta.env.VITE_VOYAGER_URL || 'http://localhost:5175'),
  scyther: appendGuestParam(import.meta.env.VITE_SCYTHER_URL || 'http://localhost:5176'),
  azure: appendGuestParam(import.meta.env.VITE_AZURE_URL || 'http://localhost:5177'),
}

export const APPS = [
  {
    name: 'High Command',
    role: 'Administrative control center',
    icon: '⚔',
    accentColor: '#d4a853',
    description:
      'Administrative interface for user access, blood supply analytics, audit views, and verification workflows aligned with national oversight needs.',
    stack: ['React', 'Vite', 'TanStack', 'Tremor', 'Supabase'],
    url: URLS.highCommand,
    deviceFrame: null,
    showQr: false,
    status: 'live',
  },
  {
    name: 'Mars Lab',
    role: 'Laboratory workstation',
    icon: '🔬',
    accentColor: '#22d3ee',
    description:
      'Lab workflow for screening, barcode-driven specimen handling, component workflows, and regulatory documentation export.',
    stack: ['React', 'TanStack Table', 'jsPDF', 'Supabase'],
    url: URLS.marsLab,
    deviceFrame: null,
    showQr: false,
    status: 'live',
  },
  {
    name: 'Voyager',
    role: 'Logistics map',
    icon: '🗺',
    accentColor: '#818cf8',
    description:
      'Transit and logistics view with map-based inventory and route context for cold-chain awareness.',
    stack: ['React', 'MapLibre GL', 'Deck.gl', 'Supabase'],
    url: URLS.voyager,
    deviceFrame: null,
    showQr: true,
    status: 'alert',
  },
  {
    name: 'Scyther',
    role: 'Field collection (tablet)',
    icon: '📟',
    accentColor: '#4ade80',
    description:
      'Edge-first collection workflows with offline-first local storage and sync when connectivity returns.',
    stack: ['React', 'WatermelonDB', 'html5-qrcode', 'Supabase'],
    url: URLS.scyther,
    deviceFrame: 'ipad',
    showQr: true,
    status: 'live',
  },
  {
    name: 'Azure',
    role: 'Citizen portal (PWA)',
    icon: '🩸',
    accentColor: '#f87171',
    description:
      'Public-facing mobile-first donor experience: sign-in, profile, appeals, and trust-oriented donor journey.',
    stack: ['React PWA', 'Framer Motion', 'Supabase', 'vite-pwa'],
    url: URLS.azure,
    deviceFrame: 'iphone',
    showQr: true,
    status: 'live',
  },
]
