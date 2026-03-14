import { useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import BatchProcessingGrid, { type BatchProcessingGridRef } from '../components/laboratory/BatchProcessingGrid';
import { generateCustodyManifest } from '../lib/pdf/ComplianceManifest';
import { FileText, Activity } from 'lucide-react';

export default function LabDashboard() {
  const { user } = useAuth();
  const gridRef = useRef<BatchProcessingGridRef>(null);

  const handleExportManifest = () => {
    if (gridRef.current) {
      const units = gridRef.current.getProcessedUnits();
      // Generate a manifest for the current batch
      generateCustodyManifest(`BATCH-${new Date().getTime().toString().slice(-6)}`, units, user?.name || 'Unknown Tech');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 overflow-hidden gap-6">
      
      {/* Header and Telemetry */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-3">
            <Activity className="w-8 h-8 text-cyan-400" />
            Mars Processing Lab
          </h1>
          <p className="text-slate-400 mt-1 font-medium">High-Velocity TTI Diagnostics & Component Separation</p>
        </div>

        <button 
          onClick={handleExportManifest}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 px-4 py-2.5 rounded-lg border border-slate-700 transition-colors shadow-sm"
        >
          <FileText className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-sm">Export MoH Compliance Manifest</span>
        </button>
      </div>

      {/* Hardware Telemetry Mock */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800/60 rounded-xl p-4 flex items-center justify-between shadow shadow-slate-950/50">
             <div className="flex flex-col">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Centrifuge A</span>
                <span className="text-slate-300 font-mono text-sm mt-1 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    In Use (12m remaining)
                </span>
             </div>
          </div>
          <div className="bg-slate-900 border border-slate-800/60 rounded-xl p-4 flex items-center justify-between shadow shadow-slate-950/50">
             <div className="flex flex-col">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Abbott Architect Analyzer</span>
                <span className="text-slate-300 font-mono text-sm mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Idle (Awaiting Rack)
                </span>
             </div>
          </div>
          <div className="bg-slate-900 border border-slate-800/60 rounded-xl p-4 flex items-center justify-between shadow shadow-slate-950/50">
             <div className="flex flex-col">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Storage Refrigerator 4</span>
                <span className="text-slate-300 font-mono text-sm mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    Core Temp: 4.2°C
                </span>
             </div>
          </div>
      </div>

      {/* The TanStack Grid */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <BatchProcessingGrid ref={gridRef} />
      </div>

    </div>
  );
}
