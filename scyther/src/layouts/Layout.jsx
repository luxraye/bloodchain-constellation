import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import {
    Droplets,
    HeartPulse,
    UserCheck,
    ClipboardList,
    Syringe,
    LayoutDashboard,
    GitPullRequest,
    FileHeart,
    ChevronLeft,
    ChevronRight,
    Activity,
    Bell,
    Users,
    UserCircle2,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import ShiftSyncLog from '../components/ShiftSyncLog';

const collectionNav = [
    { to: '/collection/check-in', icon: UserCheck, label: 'Donor Check-In' },
    { to: '/collection/screening', icon: ClipboardList, label: 'Medical Screening' },
    { to: '/collection/phlebotomy', icon: Syringe, label: 'Phlebotomy' },
];

const clinicalNav = [
    { to: '/clinical/inventory', icon: LayoutDashboard, label: 'Inventory' },
    { to: '/clinical/requests', icon: GitPullRequest, label: 'Requests' },
    { to: '/clinical/standby', icon: Users, label: 'Standby Donors' },
    { to: '/clinical/transfusion', icon: FileHeart, label: 'Transfusion Log' },
];

export default function Layout() {
    const { mode, setMode, notifications } = useApp();
    const { user, logout } = useAuth();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const navigate = useNavigate();
    const navItems = mode === 'collection' ? collectionNav : clinicalNav;

    const handleModeSwitch = (newMode) => {
        setMode(newMode);
        if (newMode === 'collection') {
            navigate('/collection/check-in');
        } else {
            navigate('/clinical/inventory');
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`${sidebarCollapsed ? 'w-[72px]' : 'w-64'
                    } bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out relative shadow-sm`}
            >
                {/* Logo */}
                <div className="h-16 flex items-center px-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-red-600 to-brand-red-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <Droplets className="w-5 h-5 text-white" />
                        </div>
                        {!sidebarCollapsed && (
                            <div className="animate-fade-in">
                                <h1 className="text-base font-bold text-slate-900 tracking-tight">Scyther</h1>
                                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Bloodchain</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mode Switcher */}
                <div className={`px-3 pt-4 pb-2 ${sidebarCollapsed ? 'px-2' : ''}`}>
                    {!sidebarCollapsed && (
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2 px-1">Mode</p>
                    )}
                    <div className={`flex ${sidebarCollapsed ? 'flex-col gap-1' : 'gap-1'} bg-slate-100 rounded-lg p-1`}>
                        <button
                            onClick={() => handleModeSwitch('collection')}
                            className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-md text-xs font-semibold transition-all duration-200 ${sidebarCollapsed ? 'w-full' : 'flex-1'
                                } ${mode === 'collection'
                                    ? 'bg-brand-red-600 text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'
                                }`}
                            title="Collection Centre"
                        >
                            <HeartPulse className="w-3.5 h-3.5 flex-shrink-0" />
                            {!sidebarCollapsed && <span>Collection</span>}
                        </button>
                        <button
                            onClick={() => handleModeSwitch('clinical')}
                            className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-md text-xs font-semibold transition-all duration-200 ${sidebarCollapsed ? 'w-full' : 'flex-1'
                                } ${mode === 'clinical'
                                    ? 'bg-med-blue-600 text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'
                                }`}
                            title="Clinical / Hospital"
                        >
                            <Activity className="w-3.5 h-3.5 flex-shrink-0" />
                            {!sidebarCollapsed && <span>Clinical</span>}
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
                    {!sidebarCollapsed && (
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2 px-1">Navigation</p>
                    )}
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
                                    ? mode === 'collection'
                                        ? 'bg-brand-red-50 text-brand-red-700 shadow-sm'
                                        : 'bg-med-blue-50 text-med-blue-700 shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                } ${sidebarCollapsed ? 'justify-center px-2' : ''}`
                            }
                            title={item.label}
                        >
                            <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${sidebarCollapsed ? '' : ''}`} />
                            {!sidebarCollapsed && <span className="animate-fade-in">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* User / Footer */}
                <div className="border-t border-slate-100 p-3">
                    <NavLink to="/profile"
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-lg p-2 transition-all duration-200 ${isActive ? 'bg-slate-100' : 'hover:bg-slate-50'} ${sidebarCollapsed ? 'justify-center' : ''}`
                        }>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-red-600 to-brand-red-700 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-white">{(user?.name || 'U')[0].toUpperCase()}</span>
                        </div>
                        {!sidebarCollapsed && (
                            <div className="flex-1 min-w-0 animate-fade-in">
                                <p className="text-sm font-semibold text-slate-900 truncate">{user?.name ?? '—'}</p>
                                <p className="text-xs text-slate-400">{user?.role ?? ''}</p>
                            </div>
                        )}
                    </NavLink>
                </div>

                {/* Collapse toggle */}
                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm z-10"
                >
                    {sidebarCollapsed ? (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    ) : (
                        <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
                    )}
                </button>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
                <ShiftSyncLog />

                {/* Toast notifications */}
                <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
                    {notifications.map((n) => (
                        <div
                            key={n.id}
                            className={`animate-slide-in px-4 py-3 rounded-lg shadow-lg text-sm font-medium max-w-sm ${n.type === 'success'
                                ? 'bg-emerald-600 text-white'
                                : n.type === 'error'
                                    ? 'bg-red-600 text-white'
                                    : n.type === 'warning'
                                        ? 'bg-amber-500 text-white'
                                        : 'bg-slate-800 text-white'
                                }`}
                        >
                            {n.message}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
