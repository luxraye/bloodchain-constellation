import { useAuth } from '../hooks/useAuth';
import { useNetwork } from '../hooks/useNetwork';
import { Droplets, Wifi, WifiOff, RefreshCw } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isOnline, isSyncing } = useNetwork();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-red-600 to-brand-red-700 flex items-center justify-center shrink-0 shadow-sm">
          <Droplets className="w-5 h-5 text-white" />
        </div>
        <span className="text-sm font-semibold text-slate-800 tracking-tight">Bloodchain</span>
        <div className="h-4 w-px bg-slate-200 hidden sm:block" />
        <span className="text-xs text-slate-500 hidden md:inline">Botswana National Blood Supply Chain</span>
      </div>

      <div className="flex items-center gap-3">
        {/* ── Network status badge ────────────────────────────── */}
        {isSyncing ? (
          <div className="flex items-center gap-1.5 rounded-full border border-amber-400/60 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span className="hidden sm:inline">Syncing Pending Records…</span>
          </div>
        ) : isOnline ? (
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/60 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <Wifi className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Connected</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 rounded-full border border-red-400/60 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
            <WifiOff className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Offline Mode — Data Secured Locally</span>
          </div>
        )}
        {/* ───────────────────────────────────────────────────── */}

        {user && (
          <span className="text-sm text-slate-600">
            Welcome, <span className="font-semibold text-slate-900">{user.name}</span>
          </span>
        )}
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

