import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'
import DeviceEmulatorModal from './DeviceEmulatorModal'

export default function AppCard({ app }) {
  const [modalOpen, setModalOpen] = useState(false)

  const statusColor = app.status === 'live'
    ? 'bg-emerald-500'
    : app.status === 'alert'
      ? 'bg-amber-400 animate-pulse-slow'
      : 'bg-slate-400'

  return (
    <>
      <div className="group animate-fade-in relative flex flex-col overflow-hidden rounded-2xl border border-sky-100 bg-white p-5 shadow-md transition-all duration-300 hover:border-sky-200 hover:shadow-lg">
        <div
          className="absolute -right-12 -top-12 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: app.accentColor + '22' }}
        />

        <div className="relative z-10 mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl font-bold"
              style={{ background: app.accentColor + '18', color: app.accentColor }}
            >
              {app.icon}
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wide text-slate-900">{app.name}</h3>
              <p className="font-mono text-[11px] text-slate-500">{app.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${statusColor}`} />
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">{app.status}</span>
          </div>
        </div>

        <p className="relative z-10 mb-4 flex-1 text-xs leading-relaxed text-slate-600">{app.description}</p>

        <div className="relative z-10 mb-4 flex flex-wrap gap-1.5">
          {app.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-sky-100 bg-sky-50/80 px-2 py-0.5 font-mono text-[10px] text-slate-600"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="relative z-10 flex items-center gap-2">
          {app.deviceFrame ? (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-bold transition-all"
              style={{
                background: app.accentColor + '22',
                color: app.accentColor,
                border: `1px solid ${app.accentColor}44`,
              }}
            >
              <span>⊞</span> Launch Emulator
            </button>
          ) : (
            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-bold transition-all"
              style={{
                background: app.accentColor + '22',
                color: app.accentColor,
                border: `1px solid ${app.accentColor}44`,
              }}
            >
              <span>↗</span> Launch App
            </a>
          )}
        </div>

        {app.showQr && app.url && (
          <div className="relative z-10 mt-4 flex items-center gap-4 border-t border-sky-100 pt-4">
            <div className="shrink-0 rounded-lg border border-sky-100 bg-white p-1.5">
              <QRCodeSVG value={app.url} size={56} bgColor="#fff" fgColor="#0f172a" level="M" />
            </div>
            <p className="text-[10px] leading-relaxed text-slate-500">
              For a native device experience, scan with your phone camera and tap{' '}
              <span className="font-medium text-slate-700">&quot;Add to Home Screen&quot;</span>
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
