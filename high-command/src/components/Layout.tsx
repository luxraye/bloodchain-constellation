import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const navItems = [
    { to: '/', label: 'Situation Room', icon: '◉' },
    { to: '/users', label: 'Keymaster', icon: '⚿' },
    { to: '/ledger', label: 'Master Ledger', icon: '⛓' },
    { to: '/reports', label: 'Ministry Reporter', icon: '⚙' },
    { to: '/verifications', label: 'Citizen Auditing', icon: '🛡' },
];

export default function Layout() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-oled overflow-hidden font-inter">
            {/* Sidebar */}
            <aside
                className={`${collapsed ? 'w-[68px]' : 'w-[260px]'
                    } flex flex-col border-r border-surface-400/50 bg-surface-50 transition-all duration-300 ease-in-out shrink-0`}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-4 h-16 border-b border-surface-400/50">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-command-gold to-yellow-600 flex items-center justify-center text-black font-black text-sm shrink-0">
                        HC
                    </div>
                    {!collapsed && (
                        <div className="animate-fade-in">
                            <h1 className="text-sm font-bold text-white tracking-wide">HIGH COMMAND</h1>
                            <p className="text-[10px] text-neutral-500 font-mono tracking-widest">BLOODCHAIN ADMIN</p>
                        </div>
                    )}
                </div>

                {/* Nav Items */}
                <nav className="flex-1 py-4 px-2 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/'}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
                                    ? 'bg-command-gold/10 text-command-gold border border-command-gold/20'
                                    : 'text-neutral-500 hover:text-white hover:bg-surface-200 border border-transparent'
                                }`
                            }
                        >
                            <span className="text-lg shrink-0 w-6 text-center">{item.icon}</span>
                            {!collapsed && <span className="animate-fade-in">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* Collapse Toggle */}
                <div className="p-3 border-t border-surface-400/50">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-neutral-500 hover:text-white hover:bg-surface-200 transition-all text-sm"
                    >
                        <span className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}>◂</span>
                        {!collapsed && <span className="text-xs">Collapse</span>}
                    </button>
                </div>

                {/* System Status */}
                {!collapsed && (
                    <div className="p-4 border-t border-surface-400/50 animate-fade-in">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-xs text-neutral-400">System Online</span>
                        </div>
                        <p className="text-[10px] text-neutral-600 font-mono">v2.4.0 · Gaborone Node</p>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <Navbar />

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
