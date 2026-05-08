import { LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function Navbar({ onProfile }: { onProfile?: () => void }) {
  const { user, logout, isGuest } = useAuth()

  return (
    <header className="shrink-0 border-b border-slate-800 bg-slate-950">
      {isGuest && (
        <div className="border-b border-amber-500/20 bg-amber-500/10 px-6 py-2 text-xs font-medium text-amber-200">
          Demo Mode: lab actions are simulated locally and never write to inventory or patient records.
        </div>
      )}
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <img src="/branding/logo.png" alt="Bloodchain" className="h-9 w-9 shrink-0 rounded-xl object-contain" width={36} height={36} />
          <span className="text-sm font-semibold text-slate-200 tracking-wide">Bloodchain</span>
          <div className="h-4 w-px bg-slate-700 hidden sm:block" />
          <span className="text-xs text-slate-500 hidden md:inline">Botswana National Blood Supply Chain</span>
        </div>
        <div className="flex items-center gap-2">
          {user && (
            <button onClick={onProfile}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition">
              <span className="w-6 h-6 rounded-full bg-cyan-700 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                {user.name?.[0]?.toUpperCase() ?? 'U'}
              </span>
              <span className="hidden sm:inline">{user.name}</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => logout()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all text-xs font-medium"
          >
            <LogOut size={13} />
            {isGuest ? 'Exit Demo' : 'Sign Out'}
          </button>
        </div>
      </div>
    </header>
  )
}

