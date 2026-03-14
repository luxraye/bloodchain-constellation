import { useAuth } from '../hooks/useAuth'

export default function Navbar({ onProfile }: { onProfile?: () => void }) {
  const { user, logout } = useAuth()

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950 px-6">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shrink-0">
          <span className="text-sm font-black text-white">BC</span>
        </div>
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
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500"
        >
          Logout
        </button>
      </div>
    </header>
  )
}

