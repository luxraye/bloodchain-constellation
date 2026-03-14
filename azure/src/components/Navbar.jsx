import { useAuth } from '../hooks/useAuth'
import { Droplets } from 'lucide-react'

export default function Navbar({ profileName }) {
  const { user, logout } = useAuth()

  // Priority: backend profile name > Supabase user metadata > email prefix > fallback
  const firstName = (profileName || user?.name || user?.email)
    ?.split(/[\s@]/)[0] || 'Donor'

  return (
    <header className="h-14 shrink-0 flex items-center justify-between border-b border-slate-200 bg-white px-4">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="Bloodchain" className="w-9 h-9 object-contain" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-600 to-red-700 hidden items-center justify-center shrink-0">
          <Droplets className="w-5 h-5 text-white" />
        </div>
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
