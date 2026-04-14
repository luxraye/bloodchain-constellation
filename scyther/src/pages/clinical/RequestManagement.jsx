import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
} from '@tanstack/react-table';
import {
    GitPullRequest,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Send,
    Filter,
    ArrowUpDown,
    Plus,
    X,
} from 'lucide-react';

const urgencyColors = {
    CRITICAL: 'bg-red-100 text-red-800 border-red-200',
    URGENT: 'bg-amber-100 text-amber-800 border-amber-200',
    ROUTINE: 'bg-slate-100 text-slate-700 border-slate-200',
};

const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    VERIFIED: 'bg-emerald-100 text-emerald-800',
    FULFILLED: 'bg-med-blue-100 text-med-blue-800',
    REJECTED: 'bg-red-100 text-red-800',
};

export default function RequestManagement() {
    const { requests, updateRequest, addNotification } = useApp();
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [showNewRequest, setShowNewRequest] = useState(false);
    const [newRequest, setNewRequest] = useState({
        bloodType: 'O+',
        unitsNeeded: 10,
        urgency: 'ROUTINE',
        reason: '',
    });

    const handleVerify = (id) => {
        updateRequest(id, { status: 'VERIFIED', verifiedBy: 'Dr. Smith' });
        addNotification('Request verified by Dr. Smith', 'success');
    };

    const handleReject = (id) => {
        updateRequest(id, { status: 'REJECTED', verifiedBy: 'Dr. Smith' });
        addNotification('Request rejected', 'warning');
    };

    const handleNewOutbound = () => {
        const req = {
            id: `req_${Date.now().toString(36)}`,
            requesterType: 'HOSPITAL_INTERNAL',
            patientName: 'Hospital Bulk Order',
            bloodType: newRequest.bloodType,
            unitsNeeded: newRequest.unitsNeeded,
            urgency: newRequest.urgency,
            reason: newRequest.reason || `Bulk order: ${newRequest.unitsNeeded} units ${newRequest.bloodType}`,
            contactPhone: null,
            verifiedBy: 'Dr. Smith',
            status: 'VERIFIED',
            createdAt: new Date().toISOString(),
        };
        // We'd add to context, but for now just notify
        addNotification(`Outbound request submitted: ${newRequest.unitsNeeded} units of ${newRequest.bloodType}`, 'success');
        setShowNewRequest(false);
        setNewRequest({ bloodType: 'O+', unitsNeeded: 10, urgency: 'ROUTINE', reason: '' });
    };

    const columns = useMemo(() => [
        {
            accessorKey: 'id',
            header: 'ID',
            cell: ({ getValue }) => <span className="font-mono text-xs text-slate-500">{getValue()}</span>,
            size: 100,
        },
        {
            accessorKey: 'requesterType',
            header: 'Source',
            cell: ({ getValue }) => (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${getValue() === 'PATIENT_FAMILY' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                    {getValue() === 'PATIENT_FAMILY' ? 'Family' : 'Hospital'}
                </span>
            ),
        },
        {
            accessorKey: 'patientName',
            header: 'Patient / Reason',
            cell: ({ row }) => (
                <div>
                    <p className="text-sm font-semibold text-slate-900">{row.original.patientName}</p>
                    <p className="text-xs text-slate-400 truncate max-w-[200px]">{row.original.reason}</p>
                </div>
            ),
        },
        {
            accessorKey: 'bloodType',
            header: 'Type',
            cell: ({ getValue }) => <span className="font-bold text-sm">{getValue()}</span>,
        },
        {
            accessorKey: 'unitsNeeded',
            header: 'Units',
            cell: ({ getValue }) => <span className="font-bold text-sm">{getValue()}</span>,
        },
        {
            accessorKey: 'urgency',
            header: 'Urgency',
            cell: ({ getValue }) => (
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${urgencyColors[getValue()]}`}>
                    {getValue()}
                </span>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ getValue }) => (
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColors[getValue()]}`}>
                    {getValue()}
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                if (row.original.status !== 'PENDING') {
                    return <span className="text-xs text-slate-400">—</span>;
                }
                return (
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => handleVerify(row.original.id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-xs font-semibold transition-all"
                        >
                            <CheckCircle2 className="w-3 h-3" />
                            Verify
                        </button>
                        <button
                            onClick={() => handleReject(row.original.id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 text-xs font-semibold transition-all"
                        >
                            <XCircle className="w-3 h-3" />
                            Reject
                        </button>
                    </div>
                );
            },
        },
    ], []);

    const table = useReactTable({
        data: requests,
        columns,
        state: { sorting, globalFilter },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    const pendingCount = requests.filter(r => r.status === 'PENDING').length;

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <GitPullRequest className="w-6 h-6 text-med-blue-600" />
                        Request Management
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Verify family emergency requests and create outbound orders to NBTS.</p>
                </div>
                <div className="flex items-center gap-3">
                    {pendingCount > 0 && (
                        <span className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-full">
                            <AlertTriangle className="w-3 h-3" />
                            {pendingCount} pending
                        </span>
                    )}
                    <button
                        onClick={() => setShowNewRequest(!showNewRequest)}
                        className="btn-secondary flex items-center gap-2"
                    >
                        {showNewRequest ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {showNewRequest ? 'Cancel' : 'New NBTS Order'}
                    </button>
                </div>
            </div>

            {/* New Outbound Request Form */}
            {showNewRequest && (
                <div className="card p-6 mb-6 animate-slide-in border-med-blue-200 bg-med-blue-50/30">
                    <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Send className="w-4 h-4 text-med-blue-600" />
                        Outbound Order to NBTS
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="label-field">Blood Type</label>
                            <select
                                value={newRequest.bloodType}
                                onChange={(e) => setNewRequest({ ...newRequest, bloodType: e.target.value })}
                                className="input-field"
                            >
                                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="label-field">Units Needed</label>
                            <input
                                type="number"
                                value={newRequest.unitsNeeded}
                                onChange={(e) => setNewRequest({ ...newRequest, unitsNeeded: parseInt(e.target.value) || 0 })}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="label-field">Urgency</label>
                            <select
                                value={newRequest.urgency}
                                onChange={(e) => setNewRequest({ ...newRequest, urgency: e.target.value })}
                                className="input-field"
                            >
                                <option value="ROUTINE">Routine</option>
                                <option value="URGENT">Urgent</option>
                                <option value="CRITICAL">Critical</option>
                            </select>
                        </div>
                        <div>
                            <label className="label-field">Reason</label>
                            <input
                                type="text"
                                value={newRequest.reason}
                                onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                                placeholder="e.g. Monthly replenishment"
                                className="input-field"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button onClick={handleNewOutbound} className="btn-secondary flex items-center gap-2">
                            <Send className="w-4 h-4" />
                            Submit Order
                        </button>
                    </div>
                </div>
            )}

            {/* Search/Filter */}
            <div className="card p-4 mb-4 flex items-center gap-3">
                <Filter className="w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Filter requests by patient, type, status..."
                    className="input-field"
                />
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id} className="border-b border-slate-200 bg-slate-50">
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            onClick={header.column.getToggleSortingHandler()}
                                            className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 cursor-pointer hover:text-slate-700 select-none"
                                        >
                                            <div className="flex items-center gap-1">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getCanSort() && <ArrowUpDown className="w-3 h-3 text-slate-300" />}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map(row => (
                                <tr
                                    key={row.id}
                                    className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${row.original.urgency === 'CRITICAL' && row.original.status === 'PENDING'
                                            ? 'bg-red-50/40'
                                            : ''
                                        }`}
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="px-4 py-3">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {table.getRowModel().rows.length === 0 && (
                    <div className="p-8 text-center text-sm text-slate-400">No requests found.</div>
                )}
            </div>
        </div>
    );
}
