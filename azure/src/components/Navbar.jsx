import { useAuth } from '../hooks/useAuth'

export default function Navbar({ profileName }) {
  const { user, logout, isGuest } = useAuth()

  // Priority: backend profile name > Supabase user metadata > email prefix > fallback
  const firstName = (profileName || user?.name || user?.email)
    ?.split(/[\s@]/)[0] || 'Donor'

  return (
    <header className="shrink-0 border-b border-slate-200 bg-white">
      {isGuest && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-900 lg:px-10">
          Demo Mode: changes stay in this tab only and are cleared when you close it.
        </div>
      )}
      <div className="flex h-14 items-center justify-between px-4 lg:px-10">
        <div className="flex items-center gap-3">
          <img src="/branding/logo.png" alt="Bloodchain" className="h-9 w-9 shrink-0 rounded-xl object-contain" width={36} height={36} />
          <span className="text-sm font-semibold text-slate-800 tracking-tight">Bloodchain</span>
          <div className="h-4 w-px bg-slate-200 hidden sm:block" />
          <span className="text-xs text-slate-500 hidden md:inline">Botswana National Blood Supply Chain</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">
            {user && <>Welcome, <span className="font-medium text-slate-900">{firstName}</span></>}
          </span>
          <button
            type="button"
            onClick={() => logout()}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500"
          >
            {isGuest ? 'Switch to Real Login' : 'Logout'}
          </button>
        </div>
      </div>
    </header>
  )
}
