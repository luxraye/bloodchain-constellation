import { useState, useEffect, useCallback } from 'react';
import { Clock, ChevronRight, ChevronLeft, RefreshCw } from 'lucide-react';
import apiClient from '../lib/api.js';

const ACTION_COLORS = {
    Released: 'text-emerald-400 bg-emerald-400/10',
    Screened: 'text-sky-400 bg-sky-400/10',
    Collected: 'text-violet-400 bg-violet-400/10',
    Quarantined: 'text-amber-400 bg-amber-400/10',
    'Dispatched for Transit': 'text-orange-400 bg-orange-400/10',
    Administered: 'text-rose-400 bg-rose-400/10',
    Discarded: 'text-red-500 bg-red-500/10',
};

function fmtTime(iso) {
    return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export default function ShiftSyncLog() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchLogs = useCallback(async () => {
        try {
            const { data } = await apiClient.get('/activity/shift-sync');
            setLogs(data.data ?? []);
            setLastUpdated(new Date());
        } catch { /* silent fallback */ }
        finally { setLoading(false); }
    }, []);

    useEffect(() => {
        fetchLogs();
        const id = setInterval(fetchLogs, 30_000);
        return () => clearInterval(id);
    }, [fetchLogs]);

    if (collapsed) {
        return (
            <button
                onClick={() => setCollapsed(false)}
                className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex items-center gap-1 bg-slate-900/90 border border-slate-700 rounded-l-xl px-2 py-4 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition shadow-xl"
            >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="[writing-mode:vertical-rl] rotate-180">SHIFT SYNC</span>
            </button>
        );
    }

    return (
        <div className="fixed right-0 top-0 h-full w-72 z-40 flex flex-col bg-slate-900/95 border-l border-slate-700/50 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Shift Sync</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <button onClick={fetchLogs} className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition">
                        <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setCollapsed(true)} className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition">
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {lastUpdated && (
                <div className="px-4 py-1.5 text-[10px] text-slate-500 border-b border-slate-800">
                    {lastUpdated.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} · 30s refresh
                </div>
            )}

            <div className="flex-1 overflow-y-auto py-2">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-5 h-5 border-2 border-slate-700 border-t-orange-400 rounded-full animate-spin" />
                    </div>
                ) : logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                        <Clock className="w-7 h-7 text-slate-700 mb-2" />
                        <p className="text-xs text-slate-500">No team activity today</p>
                    </div>
                ) : logs.map((log) => {
                    const color = ACTION_COLORS[log.actionPerformed] ?? 'text-slate-400 bg-slate-400/10';
                    const unit = log.assetId ? `#${log.assetId.slice(-6).toUpperCase()}` : '';
                    return (
                        <div key={log.id} className="px-4 py-2.5 border-b border-slate-800/60 hover:bg-slate-800/40 transition last:border-0">
                            <div className="flex items-start justify-between gap-2">
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide mt-0.5 ${color}`}>
                                    {log.actionPerformed}
                                </span>
                                <span className="text-[10px] text-slate-500 shrink-0">{fmtTime(log.createdAt)}</span>
                            </div>
                            <p className="text-xs text-slate-300 mt-1">
                                <span className="font-semibold text-white">{log.userName.split(' ')[0]}</span>
                                <span className="text-slate-500"> ({log.userRole})</span>
                                {unit && <span className="font-mono text-slate-400"> · {unit}</span>}
                            </p>
                            <p className="text-[10px] text-slate-600 mt-0.5 truncate">{log.facility}</p>
                        </div>
                    );
                })}
            </div>

            <div className="px-4 py-2 border-t border-slate-700/50 text-[10px] text-slate-500">
                {logs.length} action{logs.length !== 1 ? 's' : ''} today
            </div>
        </div>
    );
}
