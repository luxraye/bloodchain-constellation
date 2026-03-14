import { useAuth } from '../hooks/useAuth';
import { Droplets } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 shrink-0 flex items-center justify-between border-b border-slate-700 bg-slate-800/80 px-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shrink-0">
          <Droplets className="w-5 h-5 text-white" />
        </div>
        <span className="text-sm font-semibold text-slate-100 tracking-tight">Bloodchain</span>
        <div className="h-4 w-px bg-slate-600 hidden sm:block" />
        <span className="text-xs text-slate-500 hidden md:inline">Botswana National Blood Supply Chain</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-400">
          {user && <>Welcome, <span className="font-medium text-white">{user.name}</span></>}
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
  );
}
