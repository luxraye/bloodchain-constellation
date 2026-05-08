import { LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout, isGuest } = useAuth();

  return (
    <header className="shrink-0 border-b border-surface-400/50 bg-surface-50">
      {isGuest && (
        <div className="border-b border-command-gold/20 bg-command-gold/10 px-6 py-2 text-xs font-medium text-command-gold">
          Demo Mode: admin actions are simulated locally and never write to live users, audits, or verification queues.
        </div>
      )}
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="/branding/logo.png" alt="Bloodchain" className="h-9 w-9 shrink-0 rounded-xl object-contain" width={36} height={36} />
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-surface-200 border border-transparent hover:border-surface-400/60 transition-all text-xs font-medium"
          >
            <LogOut size={13} />
            {isGuest ? 'Exit Demo' : 'Sign Out'}
          </button>
        </div>
      </div>
    </header>
  );
}
