import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'
import DeviceEmulatorModal from './DeviceEmulatorModal'

export default function AppCard({ app }) {
  const [modalOpen, setModalOpen] = useState(false)

  const statusColor = app.status === 'live'
    ? 'bg-emerald-500'
    : app.status === 'alert'
    ? 'bg-amber-400 animate-pulse-slow'
    : 'bg-slate-600'

  return (
    <>
      <div className="relative flex flex-col rounded-2xl border border-white/5 bg-surface-100 p-5 shadow-lg hover:border-white/10 transition-all duration-300 group animate-fade-in overflow-hidden">
        {/* Subtle radial glow */}
        <div
          className="absolute -top-12 -right-12 h-48 w-48 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl"
          style={{ background: app.accentColor + '22' }}
        />

        {/* Header */}
        <div className="flex items-start justify-between mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl text-xl font-bold shrink-0"
              style={{ background: app.accentColor + '22', color: app.accentColor }}
            >
              {app.icon}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">{app.name}</h3>
              <p className="text-[11px] text-slate-500 font-mono">{app.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${statusColor}`} />
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">{app.status}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 leading-relaxed mb-4 relative z-10 flex-1">{app.description}</p>

        {/* Tech stack pills */}
        <div className="flex flex-wrap gap-1.5 mb-4 relative z-10">
          {app.stack.map(tech => (
            <span key={tech} className="px-2 py-0.5 text-[10px] font-mono rounded-md bg-surface-200 text-slate-400 border border-white/5">
              {tech}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 relative z-10">
          {app.deviceFrame ? (
            <button
              onClick={() => setModalOpen(true)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-bold transition-all"
              style={{ background: app.accentColor + '22', color: app.accentColor, border: `1px solid ${app.accentColor}44` }}
            >
              <span>⊞</span> Launch Emulator
            </button>
          ) : (
            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-bold transition-all"
              style={{ background: app.accentColor + '22', color: app.accentColor, border: `1px solid ${app.accentColor}44` }}
            >
              <span>↗</span> Launch App
            </a>
          )}
        </div>

        {/* QR Code Block (only if app has url) */}
        {app.showQr && app.url && (
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-4 relative z-10">
            <div className="bg-white rounded-lg p-1.5 shrink-0">
              <QRCodeSVG value={app.url} size={56} bgColor="#fff" fgColor="#030712" level="M" />
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              For a native device experience, scan with your phone camera and tap{' '}
              <span className="text-slate-300 font-medium">"Add to Home Screen"</span>
            </p>
          </div>
        )}
      </div>

      {/* Device Modal */}
      {app.deviceFrame && (
        <DeviceEmulatorModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          app={app}
        />
      )}
    </>
  )
}
