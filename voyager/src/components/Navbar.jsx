import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ClipboardList, Map, Truck, User } from 'lucide-react';

const navItems = [
  { to: '/', icon: ClipboardList, label: 'Jobs' },
  { to: '/active', icon: Truck, label: 'Active' },
  { to: '/map', icon: Map, label: 'Map' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-14 shrink-0 flex-col border-b border-slate-700 bg-slate-800/80 lg:h-auto lg:py-0">
      <div className="flex h-14 items-center justify-between px-4 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <img src="/branding/logo.png" alt="Bloodchain" className="h-9 w-9 shrink-0 rounded-xl object-contain" width={36} height={36} />
          <span className="text-sm font-semibold tracking-tight text-slate-100">Bloodchain</span>
          <div className="hidden h-4 w-px bg-slate-600 sm:block" />
          <span className="hidden text-xs text-slate-500 md:inline lg:max-w-[200px] lg:truncate xl:max-w-none xl:whitespace-normal">
            Botswana National Blood Supply Chain
          </span>
        </div>
        <nav className="hidden items-center gap-1 lg:flex">
        {navItems.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive
                ? 'bg-orange-500/20 text-orange-400'
                : 'text-slate-400 hover:bg-slate-700/80 hover:text-slate-200'
              }`
            }
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </NavLink>
        ))}
        </nav>
        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden text-sm text-slate-400 sm:inline">
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
      </div>
    </header>
  );
}
