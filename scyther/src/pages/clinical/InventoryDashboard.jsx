import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { daysUntilExpiry } from '../../lib/collectionHelpers.js';
import { formatIsbt128 } from '../../lib/isbt128.js';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import {
    LayoutDashboard,
    AlertTriangle,
    Clock,
    Thermometer,
    Droplets,
    TrendingDown,
    Package,
    ShieldAlert,
} from 'lucide-react';

const BLOOD_COLORS = {
    'O+': '#dc2626', 'O-': '#ef4444',
    'A+': '#2563eb', 'A-': '#3b82f6',
    'B+': '#7c3aed', 'B-': '#8b5cf6',
    'AB+': '#059669', 'AB-': '#10b981',
};

export default function InventoryDashboard() {
    const { bloodUnits, unitsLoading, inventory } = useApp();

    const availableUnits = useMemo(
        () => bloodUnits.filter(u => u.status === 'AVAILABLE'),
        [bloodUnits]
    );

    const chartData = useMemo(() => {
        const counts = {};
        availableUnits.forEach(u => {
            const t = u.type || u.bloodType;
            counts[t] = (counts[t] || 0) + 1;
        });
        return inventory.map(item => ({
            type: item.type,
            units: (counts[item.type] || 0) + item.units,
            color: item.color,
        }));
    }, [availableUnits, inventory]);

    const totalUnits = chartData.reduce((s, d) => s + d.units, 0);

    const lowStockTypes = chartData.filter(d => d.units < 5);
    const expiringUnits = bloodUnits.filter(
        u => u.status === 'AVAILABLE' && daysUntilExpiry(u) != null && daysUntilExpiry(u) <= 3 && daysUntilExpiry(u) >= 0
    );
    const quarantineUnits = bloodUnits.filter(u => u.status === 'QUARANTINE');
    const isEmpty = !unitsLoading && bloodUnits.length === 0;

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
                    <p className="font-bold">{label}</p>
                    <p className="text-slate-300">{payload[0].value} units available</p>
                </div>
            );
        }
        return null;
    };

    if (unitsLoading) {
        return (
            <div className="animate-fade-in">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <LayoutDashboard className="w-6 h-6 text-med-blue-600" />
                        Inventory Dashboard
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Fridge View — Real-time blood stock levels and alerts.</p>
                </div>
                <div className="card p-12 text-center">
                    <span className="inline-block w-8 h-8 border-2 border-med-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-slate-600 font-medium">Loading inventory…</p>
                </div>
            </div>
        );
    }

    if (isEmpty) {
        return (
            <div className="animate-fade-in">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <LayoutDashboard className="w-6 h-6 text-med-blue-600" />
                        Inventory Dashboard
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Fridge View — Real-time blood stock levels and alerts.</p>
                </div>
                <div className="card p-12 text-center">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                        <Package className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-700 mb-1">No blood units in inventory</h3>
                    <p className="text-sm text-slate-400 max-w-md mx-auto">
                        Collected units will appear here. Use the Collection flow to add units.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <LayoutDashboard className="w-6 h-6 text-med-blue-600" />
                    Inventory Dashboard
                </h1>
                <p className="text-sm text-slate-500 mt-1">Fridge View — Real-time blood stock levels and alerts.</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="card p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Package className="w-4 h-4 text-med-blue-500" />
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Stock</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{totalUnits}</p>
                    <p className="text-xs text-slate-400 mt-0.5">units available</p>
                </div>
                <div className="card p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Droplets className="w-4 h-4 text-brand-red-500" />
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Blood Types</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">8</p>
                    <p className="text-xs text-slate-400 mt-0.5">types tracked</p>
                </div>
                <div className={`card p-4 ${lowStockTypes.length > 0 ? 'border-red-200 bg-red-50' : ''}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className={`w-4 h-4 ${lowStockTypes.length > 0 ? 'text-red-500' : 'text-slate-400'}`} />
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Low Stock</span>
                    </div>
                    <p className={`text-3xl font-bold ${lowStockTypes.length > 0 ? 'text-red-700' : 'text-slate-900'}`}>
                        {lowStockTypes.length}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">types below 5</p>
                </div>
                <div className={`card p-4 ${expiringUnits.length > 0 ? 'border-amber-200 bg-amber-50' : ''}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className={`w-4 h-4 ${expiringUnits.length > 0 ? 'text-amber-500' : 'text-slate-400'}`} />
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Expiring Soon</span>
                    </div>
                    <p className={`text-3xl font-bold ${expiringUnits.length > 0 ? 'text-amber-700' : 'text-slate-900'}`}>
                        {expiringUnits.length}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">within 3 days</p>
                </div>
            </div>

            {/* Alerts */}
            {(lowStockTypes.length > 0 || expiringUnits.length > 0) && (
                <div className="space-y-3 mb-6">
                    {lowStockTypes.map(item => (
                        <div key={item.type} className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                            <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-red-800">Low Stock Warning: {item.type}</p>
                                <p className="text-xs text-red-600">Only {item.units} unit(s) remaining. Consider requesting replenishment from NBTS.</p>
                            </div>
                        </div>
                    ))}
                    {expiringUnits.map(unit => (
                        <div key={unit.id} className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                            <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-amber-800">Expiry Watch: {unit.id} ({unit.type})</p>
                                <p className="text-xs text-amber-600">
                                    Expires in {daysUntilExpiry(unit)} day(s) — {new Date(unit.expiresAt).toLocaleDateString('en-GB')}. Location: {unit.location}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart */}
                <div className="lg:col-span-2 card p-6">
                    <h2 className="text-sm font-semibold text-slate-900 mb-4">Stock Levels by Blood Type</h2>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} barCategoryGap="20%">
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="type" tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} />
                                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="units" radius={[6, 6, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Fridge Cards */}
                <div className="space-y-3">
                    <h2 className="text-sm font-semibold text-slate-900">Fridge View</h2>
                    {chartData.map(item => (
                        <div
                            key={item.type}
                            className={`card-hover p-4 flex items-center justify-between ${item.units < 5 ? 'border-red-300 bg-red-50' : ''
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: item.color + '18' }}
                                >
                                    <Droplets className="w-5 h-5" style={{ color: item.color }} />
                                </div>
                                <div>
                                    <p className="text-base font-bold text-slate-900">{item.type}</p>
                                    {item.units < 5 ? (
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400">
                                            ▼ LOW
                                        </span>
                                    ) : item.units < 10 ? (
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500">
                                            ~ MODERATE
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                                            ✓ ADEQUATE
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`text-2xl font-bold ${item.units < 5 ? 'text-red-700' : 'text-slate-900'}`}>
                                    {item.units}
                                </p>
                                <p className="text-[10px] text-slate-400 uppercase">units</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quarantine */}
            {quarantineUnits.length > 0 && (
                <div className="mt-6 card p-6">
                    <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-amber-500" />
                        In Quarantine ({quarantineUnits.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {quarantineUnits.map(unit => (
                            <div key={unit.id} className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-mono font-bold text-slate-900">{formatIsbt128(unit.id)}</p>
                                    <p className="text-xs text-slate-400 font-mono">{unit.id}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{unit.type} · Donor: {unit.donorId}</p>
                                </div>
                                <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-800 text-xs font-bold">QUARANTINE</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
