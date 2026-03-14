import { NavLink } from 'react-router-dom';
import { ClipboardList, Truck, Map, User } from 'lucide-react';

const tabs = [
    { to: '/', icon: ClipboardList, label: 'Jobs' },
    { to: '/active', icon: Truck, label: 'Active' },
    { to: '/map', icon: Map, label: 'Map' },
    { to: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 safe-bottom">
            <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
                {tabs.map(tab => (
                    <NavLink
                        key={tab.to}
                        to={tab.to}
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${isActive
                                ? 'text-orange-400'
                                : 'text-slate-500 hover:text-slate-300'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <tab.icon className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_0_6px_rgba(249,115,22,0.5)]' : ''}`} />
                                <span className="text-[10px] font-semibold">{tab.label}</span>
                                {isActive && (
                                    <div className="w-1 h-1 rounded-full bg-orange-500 -mt-0.5" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
