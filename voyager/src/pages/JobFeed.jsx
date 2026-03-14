import { useState, useMemo } from 'react';
import { Truck, Filter, Package } from 'lucide-react';
import JobCard from '../components/JobCard';
import { useJobs } from '../context/JobContext';

const FILTERS = ['ALL', 'PENDING', 'IN_TRANSIT', 'DELIVERED', 'FLAGGED'];

export default function JobFeed() {
    const { jobs, driver, jobsLoading, jobsError, refreshJobs } = useJobs();
    const [filter, setFilter] = useState('ALL');

    const filteredJobs = useMemo(() => {
        let list = filter === 'ALL' ? jobs : jobs.filter(j => j.status === filter);
        // Sort: STAT first, then by status priority
        const statusOrder = { IN_TRANSIT: 0, FLAGGED: 1, PENDING: 2, DELIVERED: 3 };
        return list.sort((a, b) => {
            if (a.priority === 'STAT' && b.priority !== 'STAT') return -1;
            if (b.priority === 'STAT' && a.priority !== 'STAT') return 1;
            return (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
        });
    }, [jobs, filter]);

    const stats = useMemo(() => ({
        total: jobs.length,
        active: jobs.filter(j => j.status === 'IN_TRANSIT').length,
        pending: jobs.filter(j => j.status === 'PENDING').length,
        flagged: jobs.filter(j => j.status === 'FLAGGED').length,
    }), [jobs]);

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="px-4 pt-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                                <Truck className="w-4 h-4 text-orange-400" />
                            </div>
                            <h1 className="text-xl font-bold text-white">Job Board</h1>
                        </div>
                        <p className="text-sm text-slate-500">
                            {driver.callsign} · {driver.vehicle}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-black text-orange-400">{stats.active}</div>
                        <div className="text-xs text-slate-500">Active</div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="glass-card px-3 py-2 text-center">
                        <div className="text-lg font-bold text-white">{stats.pending}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Pending</div>
                    </div>
                    <div className="glass-card px-3 py-2 text-center">
                        <div className="text-lg font-bold text-emerald-400">{jobs.filter(j => j.status === 'DELIVERED').length}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Delivered</div>
                    </div>
                    <div className="glass-card px-3 py-2 text-center">
                        <div className="text-lg font-bold text-red-400">{stats.flagged}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Flagged</div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                    {FILTERS.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${filter === f
                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            {f === 'IN_TRANSIT' ? 'In Transit' : f.charAt(0) + f.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Job List */}
            <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-3">
                {jobsLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-10 h-10 border-2 border-orange-500/40 border-t-orange-400 rounded-full animate-spin mb-3" />
                        <p className="text-slate-500 font-medium">Loading jobs…</p>
                    </div>
                ) : jobsError ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <p className="text-red-400 font-medium mb-2">{jobsError}</p>
                        <button onClick={refreshJobs} className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm">Retry</button>
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center mb-4">
                            <Package className="w-8 h-8 text-slate-500" />
                        </div>
                        <p className="text-slate-300 font-medium">No pending blood units at this time</p>
                        <p className="text-sm text-slate-500 mt-1">
                            {filter === 'ALL' ? 'When RELEASED units are ready for pickup, they will appear here.' : `No ${filter.toLowerCase().replace('_', ' ')} jobs.`}
                        </p>
                    </div>
                ) : (
                    filteredJobs.map((job, i) => (
                        <div key={job.id} style={{ animationDelay: `${i * 60}ms` }}>
                            <JobCard job={job} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
