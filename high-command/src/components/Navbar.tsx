import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 border-b border-surface-400/50 bg-surface-50 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-command-gold to-yellow-600 flex items-center justify-center text-black font-black text-sm shrink-0">
            BC
          </div>
          <span className="text-sm font-semibold text-white tracking-wide hidden sm:inline">Bloodchain</span>
        </div>
        <div className="h-4 w-px bg-surface-400 hidden sm:block" />
        <span className="text-xs text-neutral-500 hidden md:inline">Botswana National Blood Supply Chain</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-neutral-400">
          {user && <>Welcome, <span className="text-white font-medium">{user.name}</span></>}
        </span>
        <button
          type="button"
          onClick={() => logout()}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
