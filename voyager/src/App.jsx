import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { JobProvider } from './context/JobContext';
import ShiftSyncLog from './components/ShiftSyncLog.jsx';
import { useAuth } from './hooks/useAuth';
import BottomNav from './components/BottomNav';
import Navbar from './components/Navbar';
import DevSyncTool from './components/DevSyncTool';
import JobFeed from './pages/JobFeed';
import ActiveJob from './pages/ActiveJob';
import MapView from './pages/MapView';
import Profile from './pages/Profile';
import LoginScreen from './components/LoginScreen';
import { ClipboardList, Truck, Map, User, Lock, LogOut, Activity } from 'lucide-react';

const NAV_ITEMS = [
    { to: '/', icon: ClipboardList, label: 'Job Board', end: true },
    { to: '/active', icon: Truck, label: 'Active Job' },
    { to: '/map', icon: Map, label: 'Ecosystem Map' },
    { to: '/profile', icon: User, label: 'My Profile' },
];

const ALLOWED_ROLES = ['TRANSIT', 'ADMIN', 'LOGISTICS_COMMAND', 'SUPER_ADMIN'];

function DesktopSidebar() {
    const { user, logout } = useAuth();
    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : 'DR';

    return (
        <aside className="hidden lg:flex flex-col w-[220px] shrink-0 border-r border-slate-800 bg-slate-950">
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 h-14 border-b border-slate-800 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shrink-0">
                    <Truck size={14} className="text-white" />
                </div>
                <div className="min-w-0">
                    <h1 className="text-xs font-bold text-white tracking-widest uppercase">Voyager</h1>
                    <p className="text-[9px] text-slate-600 font-mono tracking-widest truncate">BLOODCHAIN LOGISTICS</p>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
                {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                                isActive
                                    ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                    : 'text-slate-500 hover:text-white hover:bg-slate-800 border border-transparent'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon
                                    size={16}
                                    className={`shrink-0 ${isActive ? 'text-orange-400' : 'text-slate-600 group-hover:text-slate-300'}`}
                                />
                                <span className="text-[13px]">{label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* System status */}
            <div className="px-4 py-3 border-t border-slate-800">
                <div className="flex items-center gap-2">
                    <Activity size={11} className="text-emerald-500" />
                    <span className="text-[10px] text-slate-600 font-mono">Logistics online</span>
                </div>
            </div>

            {/* User strip */}
            <div className="border-t border-slate-800 p-2 shrink-0">
                {user && (
                    <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
                        <div className="w-7 h-7 rounded-full bg-orange-500/15 border border-orange-500/25 flex items-center justify-center text-[10px] font-bold text-orange-400 shrink-0">
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-200 truncate">{user.name}</p>
                            <p className="text-[10px] text-slate-600 font-mono truncate">{user.role}</p>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => logout()}
                    className="w-full flex items-center justify-center gap-2 px-2.5 py-2 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-slate-800 transition-all text-xs"
                >
                    <LogOut size={13} />
                    <span className="text-[11px]">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}

function AccessDenied() {
    const { user, logout } = useAuth();
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-900 p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-950 flex items-center justify-center mb-2">
                <Lock size={22} className="text-red-400" />
            </div>
            <h1 className="text-xl font-bold text-slate-100">Access Denied</h1>
            <p className="text-sm text-slate-400 max-w-sm">
                <span className="font-medium text-slate-200">{user.name}</span>, your role
                (<span className="font-mono text-sky-400">{user.role}</span>) does not have
                access to Voyager. Only <span className="font-mono text-sky-400">TRANSIT</span>,{' '}
                <span className="font-mono text-sky-400">LOGISTICS_COMMAND</span>, or restricted
                admin clearance users can use this app.
            </p>
            <button
                onClick={() => logout()}
                className="mt-2 rounded-lg bg-sky-600 px-5 py-2 text-sm font-medium text-white hover:bg-sky-500 transition"
            >
                Log out
            </button>
        </div>
    );
}

export default function App() {
    const { user, loading, hasRole } = useAuth();

    if (loading) return (
        <div className="flex min-h-screen items-center justify-center bg-slate-900">
            <div className="h-8 w-8 rounded-full border-2 border-sky-800 border-t-sky-400 animate-spin" />
        </div>
    );
    if (!user) return <LoginScreen />;
    if (!hasRole(...ALLOWED_ROLES)) return <AccessDenied />;

    return (
        <>
            <BrowserRouter>
                <JobProvider>
                    <div className="flex h-screen w-full bg-slate-900 overflow-hidden">
                        {/* Desktop sidebar — lg+ only */}
                        <DesktopSidebar />

                        {/* Main column */}
                        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                            {/* Mobile-only top navbar */}
                            <div className="lg:hidden">
                                <Navbar />
                            </div>

                            {/* Page content */}
                            <div className="min-h-0 flex-1 overflow-hidden">
                                <Routes>
                                    <Route path="/" element={<JobFeed />} />
                                    <Route path="/active" element={<ActiveJob />} />
                                    <Route path="/map" element={<MapView />} />
                                    <Route path="/profile" element={<Profile />} />
                                </Routes>
                            </div>

                            {/* Mobile bottom nav */}
                            <BottomNav />
                        </div>
                    </div>
                </JobProvider>
            </BrowserRouter>
            <DevSyncTool />
            <ShiftSyncLog />
        </>
    );
}
