import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, Package, Clock, AlertTriangle, ScanLine } from 'lucide-react';
import StatusBadge from './StatusBadge';
import SlideToConfirm from './SlideToConfirm';
import { useJobs } from '../context/JobContext';

export default function JobCard({ job }) {
    const navigate = useNavigate();
    const { acceptJob, setActiveJob } = useJobs();
    const isEmergency = job.priority === 'STAT';
    const isPending = job.status === 'PENDING';
    const isActive = job.status === 'IN_TRANSIT';

    const handleAccept = () => {
        acceptJob(job.id);
        navigate('/active');
    };

    const handleTap = () => {
        if (isActive || job.status === 'FLAGGED') {
            setActiveJob(job.id);
            navigate('/active');
        }
    };

    return (
        <div
            className={`glass-card p-4 animate-slide-in cursor-pointer transition-all duration-200 hover:border-slate-600 
        ${isEmergency && (isPending || isActive) ? 'animate-pulse-emergency border-2 border-red-500' : ''}
        ${isActive ? 'border-l-4 border-l-orange-500' : ''}
      `}
            onClick={!isPending ? handleTap : undefined}
        >
            {/* Header Row */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    {isEmergency && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider">
                            <AlertTriangle className="w-3 h-3" />
                            STAT
                        </span>
                    )}
                    <StatusBadge status={job.status} />
                </div>
                <span className="text-xs text-slate-500 font-mono">{job.id}</span>
            </div>

            {/* Route */}
            <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-slate-200 font-semibold truncate">{job.route.source}</span>
                    </div>
                    <div className="flex items-center gap-2 ml-2 my-1">
                        <div className="w-px h-4 bg-slate-600 ml-1.5" />
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                        <span className="text-slate-200 font-semibold truncate">{job.route.destination}</span>
                    </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-600 shrink-0" />
            </div>

            {/* Payload + Meta */}
            <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Package className="w-3.5 h-3.5" />
                    <span>{job.payload}</span>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{job.route.distance} · {job.route.eta}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-mono">Manifest: {job.manifestId}</span>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            alert(`[Scan] PWA barcode scan pending\nUnit: ${job.id}\nManifest: ${job.manifestId}`);
                        }}
                        className="flex items-center gap-1 rounded border border-orange-500/40 bg-orange-500/10 px-2 py-0.5 text-orange-400 hover:bg-orange-500/20 transition"
                    >
                        <ScanLine className="w-3 h-3" />
                        Scan
                    </button>
                </div>
            </div>

            {/* Incidents indicator */}
            {job.incidents.length > 0 && (
                <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-xs text-red-400 font-medium">
                        {job.incidents.length} incident{job.incidents.length > 1 ? 's' : ''} reported
                    </span>
                </div>
            )}

            {/* Accept Job: full-width swipeable, massive tap target for couriers (drive-safe) */}
            {isPending && (
                <div className="mt-4 w-full min-h-[80px]">
                    <SlideToConfirm
                        onConfirm={handleAccept}
                        label="Slide to Accept Job"
                        color={isEmergency ? 'red' : 'orange'}
                    />
                </div>
            )}
        </div>
    );
}
