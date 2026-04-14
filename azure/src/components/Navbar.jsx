import { useAuth } from '../hooks/useAuth'

export default function Navbar({ profileName }) {
  const { user, logout } = useAuth()

  // Priority: backend profile name > Supabase user metadata > email prefix > fallback
  const firstName = (profileName || user?.name || user?.email)
    ?.split(/[\s@]/)[0] || 'Donor'

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-10">
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
          Logout
        </button>
      </div>
    </header>
  )
}
