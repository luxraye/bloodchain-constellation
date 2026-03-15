import { QRCodeSVG } from 'qrcode.react'

export default function DeviceEmulatorModal({ isOpen, onClose, app }) {
  if (!isOpen) return null

  const isPhone = app.deviceFrame === 'iphone'
  const isTablet = app.deviceFrame === 'ipad'

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="flex flex-col items-center gap-6 animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        {/* App Label */}
        <div className="flex items-center gap-3 bg-oled/60 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/5 sticky top-0 z-20">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-lg font-bold"
            style={{ background: app.accentColor + '22', color: app.accentColor }}
          >
            {app.icon}
          </div>
          <div>
            <h2 className="text-base font-bold text-white">{app.name}</h2>
            <p className="text-[11px] text-slate-500">{isPhone ? 'iPhone 15 Pro · 390×844' : 'iPad Pro · 1024×768'}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-8 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition text-lg"
          >
            ✕
          </button>
        </div>

        {/* Device Frame */}
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

        {/* QR Code below device for PWA install */}
        {app.showQr && (
          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-surface-100 px-5 py-3">
            <div className="bg-white rounded-lg p-1.5 shrink-0">
              <QRCodeSVG value={app.url} size={52} bgColor="#fff" fgColor="#030712" level="M" />
            </div>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              For a native device experience, scan with your phone camera and tap{' '}
              <span className="text-white font-semibold">"Add to Home Screen"</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
