import { useState, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useReactTable, getCoreRowModel, flexRender, type ColumnDef } from '@tanstack/react-table';
import { useWedgeScanner } from '../../hooks/useWedgeScanner';

type TtiResult = 'PENDING' | 'NEGATIVE' | 'REACTIVE';
export interface BloodUnit {
    id: string;
    bloodGroup: string;
    hiv: TtiResult;
    hbsag: TtiResult;
    hcv: TtiResult;
    syphilis: TtiResult;
    status: 'IN_PROCESSING' | 'SAFE' | 'DISCARD' | 'SPLIT';
}

export interface BatchProcessingGridRef {
    getProcessedUnits: () => BloodUnit[];
}

const BatchProcessingGrid = forwardRef<BatchProcessingGridRef>((_, ref) => {
    const scannedCode = useWedgeScanner();

    // Mock initial pending batch
    const [data, setData] = useState<BloodUnit[]>(() => [
        { id: '1000-A29', bloodGroup: 'O+', hiv: 'PENDING', hbsag: 'PENDING', hcv: 'PENDING', syphilis: 'PENDING', status: 'IN_PROCESSING' },
        { id: '1000-B34', bloodGroup: 'A-', hiv: 'PENDING', hbsag: 'PENDING', hcv: 'PENDING', syphilis: 'PENDING', status: 'IN_PROCESSING' },
        { id: '1000-C55', bloodGroup: 'B+', hiv: 'PENDING', hbsag: 'PENDING', hcv: 'PENDING', syphilis: 'PENDING', status: 'IN_PROCESSING' },
        { id: '1000-F91', bloodGroup: 'AB-', hiv: 'PENDING', hbsag: 'PENDING', hcv: 'PENDING', syphilis: 'PENDING', status: 'IN_PROCESSING' }
    ]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useImperativeHandle(ref, () => ({
        getProcessedUnits: () => data
    }));

    // Hardware Scanner Focus
    useEffect(() => {
        if (scannedCode) {
            const index = data.findIndex(u => u.id === scannedCode);
            if (index !== -1) {
                setSelectedIndex(index);
            }
        }
    }, [scannedCode, data]);

    // Keyboard Macro Workflow
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (data.length === 0) return;
            
            // Ignore input contexts
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => Math.min(prev + 1, data.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => Math.max(prev - 1, 0));
            } else if (e.key === '1') {
                e.preventDefault();
                // Safe Macro
                setData(prev => {
                    const next = [...prev];
                    next[selectedIndex] = {
                        ...next[selectedIndex],
                        hiv: 'NEGATIVE', hbsag: 'NEGATIVE', hcv: 'NEGATIVE', syphilis: 'NEGATIVE',
                        status: 'SAFE'
                    };
                    return next;
                });
            } else if (e.key === '2') {
                e.preventDefault();
                // Biohazard Macro
                const pathogen = window.prompt("Which pathogen was REACTIVE? (hiv, hbsag, hcv, syphilis)");
                if (pathogen && ['hiv', 'hbsag', 'hcv', 'syphilis'].includes(pathogen.toLowerCase())) {
                    setData(prev => {
                        const next = [...prev];
                        next[selectedIndex] = {
                            ...next[selectedIndex],
                            [pathogen.toLowerCase()]: 'REACTIVE',
                            status: 'DISCARD'
                        };
                        return next;
                    });
                }
            } else if (e.key.toLowerCase() === 's') {
                e.preventDefault();
                // Component Split Macro
                setData(prev => {
                    const next = [...prev];
                    const parent = next[selectedIndex];
                    next.splice(selectedIndex, 1, 
                        { ...parent, id: `${parent.id}-RBC`, status: 'SPLIT' },
                        { ...parent, id: `${parent.id}-FFP`, status: 'SPLIT' },
                        { ...parent, id: `${parent.id}-PLT`, status: 'SPLIT' }
                    );
                    return next;
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, data]);

    const columns = useMemo<ColumnDef<BloodUnit>[]>(() => [
        { accessorKey: 'id', header: 'Unit ID' },
        { accessorKey: 'bloodGroup', header: 'Blood Group' },
        { accessorKey: 'hiv', header: 'HIV 1/2' },
        { accessorKey: 'hbsag', header: 'HBsAg' },
        { accessorKey: 'hcv', header: 'HCV' },
        { accessorKey: 'syphilis', header: 'Syphilis' },
        { accessorKey: 'status', header: 'Status' },
    ], []);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="w-full flex-1 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-100">Batch Processing Grid</h2>
                    <div className="text-sm font-mono text-slate-400 mt-1 space-x-2">
                        <span className="bg-slate-700 px-1 py-0.5 rounded">[↑↓] Select</span>
                        <span className="bg-emerald-900/50 text-emerald-400 px-1 py-0.5 rounded">[1] Mark Safe</span>
                        <span className="bg-red-900/50 text-red-400 px-1 py-0.5 rounded">[2] Biohazard</span>
                        <span className="bg-purple-900/50 text-purple-400 px-1 py-0.5 rounded">[S] Component Split</span>
                    </div>
                </div>
                {scannedCode && (
                    <div className="flex items-center gap-2 bg-cyan-950/50 border border-cyan-800 text-cyan-400 px-3 py-1.5 rounded-lg text-sm font-mono animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                        Scanner Active: {scannedCode}
                    </div>
                )}
            </div>
            
            <div className="overflow-auto flex-1">
                <table className="w-full text-left text-sm text-slate-200">
                    <thead className="text-xs uppercase bg-slate-950 text-slate-400 sticky top-0 z-10">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="px-6 py-4 font-bold border-b border-slate-800">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row, idx) => {
                            const isSelected = idx === selectedIndex;
                            return (
                                <tr key={row.id} className={`transition-colors border-b border-slate-800 ${isSelected ? 'bg-cyan-900/40 border-l-4 border-l-cyan-400' : 'hover:bg-slate-800/80 border-l-4 border-l-transparent'}`}>
                                    {row.getVisibleCells().map(cell => {
                                        const val = cell.getValue() as string;
                                        let cellClass = "px-6 py-3 font-mono ";
                                        if (val === 'REACTIVE' || val === 'DISCARD') {
                                            cellClass += "text-red-400 font-bold";
                                        } else if (val === 'NEGATIVE' || val === 'SAFE') {
                                            cellClass += "text-emerald-400 font-bold";
                                        } else if (val === 'SPLIT') {
                                            cellClass += "text-purple-400 font-bold";
                                        } else if (val === 'PENDING') {
                                            cellClass += "text-slate-500";
                                        }
                                        return (
                                            <td key={cell.id} className={cellClass}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
});

export default BatchProcessingGrid;
