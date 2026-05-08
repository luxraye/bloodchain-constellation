import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'
import DeviceEmulatorModal from './DeviceEmulatorModal'

const STATUS_CONFIG = {
  live: {
    dot: 'bg-emerald-400',
    label: 'Live',
    labelColor: 'text-emerald-400',
  },
  alert: {
    dot: 'bg-amber-400 animate-glow',
    label: 'Alert',
    labelColor: 'text-amber-400',
  },
  offline: {
    dot: 'bg-slate-500',
    label: 'Offline',
    labelColor: 'text-slate-500',
  },
}

export default function AppCard({ app }) {
  const [modalOpen, setModalOpen] = useState(false)
  const status = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.offline

  return (
    <>
      <div
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-slate-900/70 p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/16 hover:bg-slate-900/90"
        style={{ boxShadow: `0 0 0 0 ${app.accentColor}00` }}
      >
        {/* Accent left border */}
        <div
          className="absolute left-0 top-6 h-10 w-0.5 rounded-r-full transition-all duration-300 group-hover:h-16"
          style={{ background: app.accentColor }}
        />

        {/* Top row: icon + name + status */}
        <div className="mb-4 flex items-start justify-between pl-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black"
              style={{
                background: app.accentColor + '18',
                color: app.accentColor,
                border: `1px solid ${app.accentColor}30`,
              }}
            >
              {app.icon}
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wide text-white">{app.name}</h3>
              <p className="font-mono text-[10px] text-slate-500">{app.role}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/8 bg-white/5 px-2.5 py-1">
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
            <span className={`font-mono text-[10px] font-semibold uppercase tracking-widest ${status.labelColor}`}>
              {status.label}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="mb-4 flex-1 pl-3 text-xs leading-relaxed text-slate-400">{app.description}</p>

        {/* Stack tags */}
        <div className="mb-4 flex flex-wrap gap-1.5 pl-3">
          {app.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-white/8 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-slate-400"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="pl-3">
          {app.deviceFrame ? (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold transition-all"
              style={{
                background: app.accentColor + '14',
                color: app.accentColor,
                borderColor: app.accentColor + '35',
              }}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Launch in Device Frame
            </button>
          ) : (
            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold transition-all"
              style={{
                background: app.accentColor + '14',
                color: app.accentColor,
                borderColor: app.accentColor + '35',
              }}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              Open Application
            </a>
          )}
        </div>

        {/* QR code */}
        {app.showQr && app.url && (
          <div className="mt-4 flex items-center gap-4 border-t border-white/6 pl-3 pt-4">
            <div className="shrink-0 rounded-lg border border-white/10 bg-white p-1.5">
              <QRCodeSVG value={app.url} size={48} bgColor="#fff" fgColor="#0f172a" level="M" />
            </div>
            <p className="text-[10px] leading-relaxed text-slate-500">
              Scan with a device camera to open on mobile or{' '}
              <span className="text-slate-400">Add to Home Screen</span>
            </p>
          </div>
        )}
      </div>

      {app.deviceFrame && (
        <DeviceEmulatorModal isOpen={modalOpen} onClose={() => setModalOpen(false)} app={app} />
      )}
    </>
  )
}
