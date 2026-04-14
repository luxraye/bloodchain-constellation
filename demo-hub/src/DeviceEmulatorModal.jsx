import { QRCodeSVG } from 'qrcode.react'

export default function DeviceEmulatorModal({ isOpen, onClose, app }) {
  if (!isOpen) return null

  const isPhone = app.deviceFrame === 'iphone'
  const isTablet = app.deviceFrame === 'ipad'

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center overflow-y-auto bg-slate-900/75 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div className="animate-fade-in flex flex-col items-center gap-6" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-20 flex items-center gap-3 rounded-2xl border border-sky-100 bg-white/95 px-6 py-3 shadow-lg backdrop-blur-xl">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-lg font-bold"
            style={{ background: app.accentColor + '22', color: app.accentColor }}
          >
            {app.icon}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">{app.name}</h2>
            <p className="text-[11px] text-slate-500">
              {isPhone ? 'iPhone 15 Pro · 390×844' : 'iPad Pro · 1024×768'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-8 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
          >
            ✕
          </button>
        </div>

        {isPhone && (
          <div className="iphone-frame" style={{ width: 418, height: 872 }}>
            <div className="iphone-screen" style={{ width: 390, height: 844 }}>
              <iframe
                src={app.url}
                title={app.name}
                width={390}
                height={844}
                style={{ border: 'none', display: 'block' }}
                allow="camera; microphone"
              />
            </div>
          </div>
        )}

        {isTablet && (
          <div className="ipad-frame" style={{ width: 1072, height: 808 }}>
            <div className="ipad-screen" style={{ width: 1024, height: 768 }}>
              <iframe
                src={app.url}
                title={app.name}
                width={1024}
                height={768}
                style={{ border: 'none', display: 'block' }}
                allow="camera; microphone"
              />
            </div>
          </div>
        )}

        {app.showQr && (
          <div className="flex items-center gap-4 rounded-2xl border border-sky-100 bg-white px-5 py-3 shadow-md">
            <div className="shrink-0 rounded-lg border border-sky-100 bg-white p-1.5">
              <QRCodeSVG value={app.url} size={52} bgColor="#fff" fgColor="#0f172a" level="M" />
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-slate-600">
              For a native device experience, scan with your phone camera and tap{' '}
              <span className="font-semibold text-slate-900">&quot;Add to Home Screen&quot;</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
