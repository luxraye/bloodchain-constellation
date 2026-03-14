import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
    FileHeart,
    Scan,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    ArrowRight,
    ShieldCheck,
    Activity,
} from 'lucide-react';

// Mock compatibility matrix (simplified)
const COMPATIBLE = {
    'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    'O+': ['O+', 'A+', 'B+', 'AB+'],
    'A-': ['A-', 'A+', 'AB-', 'AB+'],
    'A+': ['A+', 'AB+'],
    'B-': ['B-', 'B+', 'AB-', 'AB+'],
    'B+': ['B+', 'AB+'],
    'AB-': ['AB-', 'AB+'],
    'AB+': ['AB+'],
};

function isCompatible(unitType, patientType) {
    const recipients = COMPATIBLE[unitType];
    return recipients ? recipients.includes(patientType) : false;
}

const mockPatients = [
    { id: 'PAT-2026-001', name: 'Thabo Motswagole', bloodType: 'A+', ward: 'Ward 2' },
    { id: 'PAT-2026-002', name: 'Grace Keboneng', bloodType: 'O+', ward: 'Ward 5' },
    { id: 'PAT-2026-003', name: 'Samuel Modise', bloodType: 'B-', ward: 'ICU' },
    { id: 'PAT-2026-004', name: 'Lebogang Pilane', bloodType: 'AB+', ward: 'Ward 1' },
];

export default function TransfusionLog() {
    const { bloodUnits, transfusions, addTransfusion, addNotification } = useApp();
    const [patientScan, setPatientScan] = useState('');
    const [unitScan, setUnitScan] = useState('');
    const [patient, setPatient] = useState(null);
    const [unit, setUnit] = useState(null);
    const [crossMatchResult, setCrossMatchResult] = useState(null); // null | 'pass' | 'fail'
    const [flashType, setFlashType] = useState('');

    const availableUnits = bloodUnits.filter(u => u.status === 'AVAILABLE');

    const handlePatientScan = () => {
        const found = mockPatients.find(p => p.id === patientScan.trim());
        if (found) {
            setPatient(found);
            setFlashType('green');
            setTimeout(() => setFlashType(''), 600);
            addNotification(`Patient found: ${found.name}`, 'success');
        } else {
            setPatient(null);
            setFlashType('red');
            setTimeout(() => setFlashType(''), 600);
            addNotification('Patient not found', 'error');
        }
    };

    const handleSimulatePatient = () => {
        const random = mockPatients[Math.floor(Math.random() * mockPatients.length)];
        setPatientScan(random.id);
        setPatient(random);
        setFlashType('green');
        setTimeout(() => setFlashType(''), 600);
        addNotification(`Patient scanned: ${random.name}`, 'success');
    };

    const handleUnitScan = () => {
        const found = availableUnits.find(u => u.id === unitScan.trim());
        if (found) {
            setUnit(found);
            // Cross-match check
            if (patient && isCompatible(found.type, patient.bloodType)) {
                setCrossMatchResult('pass');
                setFlashType('green');
                addNotification(`Cross-match PASS: ${found.type} → ${patient.bloodType}`, 'success');
            } else if (patient) {
                setCrossMatchResult('fail');
                setFlashType('red');
                addNotification(`Cross-match FAIL: ${found.type} incompatible with ${patient.bloodType}`, 'error');
            }
            setTimeout(() => setFlashType(''), 600);
        } else {
            setUnit(null);
            setCrossMatchResult(null);
            setFlashType('red');
            setTimeout(() => setFlashType(''), 600);
            addNotification('Blood unit not found or not available', 'error');
        }
    };

    const handleSimulateUnit = () => {
        if (availableUnits.length === 0) return;
        const random = availableUnits[Math.floor(Math.random() * availableUnits.length)];
        setUnitScan(random.id);
        setUnit(random);
        if (patient && isCompatible(random.type, patient.bloodType)) {
            setCrossMatchResult('pass');
            setFlashType('green');
            addNotification(`Cross-match PASS: ${random.type} → ${patient.bloodType}`, 'success');
        } else if (patient) {
            setCrossMatchResult('fail');
            setFlashType('red');
            addNotification(`Cross-match FAIL: ${random.type} incompatible with ${patient.bloodType}`, 'error');
        }
        setTimeout(() => setFlashType(''), 600);
    };

    const handleCommit = () => {
        if (!patient || !unit || crossMatchResult !== 'pass') return;
        const txn = {
            id: `txn_${Date.now().toString(36)}`,
            patientId: patient.id,
            patientName: patient.name,
            patientType: patient.bloodType,
            unitId: unit.id,
            unitType: unit.type,
            performedBy: 'Dr. Smith',
            performedAt: new Date().toISOString(),
            ward: patient.ward,
            status: 'COMPLETED',
            notes: '',
        };
        addTransfusion(txn);
        // Reset form
        setPatient(null);
        setUnit(null);
        setPatientScan('');
        setUnitScan('');
        setCrossMatchResult(null);
    };

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <FileHeart className="w-6 h-6 text-med-blue-600" />
                    Transfusion Log
                </h1>
                <p className="text-sm text-slate-500 mt-1">Scan patient wristband + blood unit. Cross-match and commit.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Patient Scan */}
                <div className={`card p-6 ${flashType === 'green' && !unit ? 'flash-green' : flashType === 'red' && !unit ? 'flash-red' : ''}`}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-med-blue-50 flex items-center justify-center">
                            <span className="text-sm font-bold text-med-blue-600">1</span>
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-slate-900">Scan Patient Wristband</h2>
                            <p className="text-xs text-slate-400">Enter or scan the patient's ID</p>
                        </div>
                    </div>
                    <div className="flex gap-2 mb-3">
                        <input
                            value={patientScan}
                            onChange={(e) => setPatientScan(e.target.value)}
                            placeholder="e.g. PAT-2026-001"
                            className="input-field flex-1"
                            tabIndex={1}
                        />
                        <button onClick={handlePatientScan} className="btn-secondary">Scan</button>
                        <button onClick={handleSimulatePatient} className="btn-outline text-xs">Simulate</button>
                    </div>
                    {patient && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-3 animate-slide-in">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <div>
                                <p className="text-sm font-semibold text-slate-900">{patient.name}</p>
                                <p className="text-xs text-slate-500">Type: <span className="font-bold">{patient.bloodType}</span> · {patient.ward} · ID: {patient.id}</p>
                            </div>
                        </div>
                    )}
                    <div className="mt-2 text-xs text-slate-400">
                        Test IDs: PAT-2026-001, PAT-2026-002, PAT-2026-003, PAT-2026-004
                    </div>
                </div>

                {/* Unit Scan */}
                <div className={`card p-6 ${!patient ? 'opacity-50 pointer-events-none' : ''} ${flashType === 'green' && unit ? 'flash-green' : flashType === 'red' && unit ? 'flash-red' : ''}`}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-med-blue-50 flex items-center justify-center">
                            <span className="text-sm font-bold text-med-blue-600">2</span>
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-slate-900">Scan Blood Unit</h2>
                            <p className="text-xs text-slate-400">Enter or scan the blood unit barcode</p>
                        </div>
                    </div>
                    <div className="flex gap-2 mb-3">
                        <input
                            value={unitScan}
                            onChange={(e) => setUnitScan(e.target.value)}
                            placeholder="e.g. unit_001"
                            className="input-field flex-1"
                            tabIndex={2}
                        />
                        <button onClick={handleUnitScan} className="btn-secondary">Scan</button>
                        <button onClick={handleSimulateUnit} className="btn-outline text-xs">Simulate</button>
                    </div>
                    {unit && (
                        <div className={`border rounded-lg p-3 flex items-center gap-3 animate-slide-in ${crossMatchResult === 'pass' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
                            }`}>
                            {crossMatchResult === 'pass' ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            ) : (
                                <XCircle className="w-5 h-5 text-red-600" />
                            )}
                            <div>
                                <p className="text-sm font-semibold text-slate-900">Unit: {unit.id} ({unit.type})</p>
                                <p className="text-xs text-slate-500">
                                    {crossMatchResult === 'pass'
                                        ? `✓ Compatible: ${unit.type} can be given to ${patient?.bloodType}`
                                        : `✗ Incompatible: ${unit.type} cannot be given to ${patient?.bloodType}`
                                    }
                                </p>
                            </div>
                        </div>
                    )}
                    <div className="mt-2 text-xs text-slate-400">
                        Available units: {availableUnits.map(u => u.id).join(', ')}
                    </div>
                </div>
            </div>

            {/* Cross-Match Result & Commit */}
            {crossMatchResult && (
                <div className={`card p-6 mb-6 animate-slide-in ${crossMatchResult === 'pass' ? 'border-emerald-200' : 'border-red-200'
                    }`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {crossMatchResult === 'pass' ? (
                                <>
                                    <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
                                        <ShieldCheck className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-emerald-900">Cross-Match: COMPATIBLE</h3>
                                        <p className="text-xs text-emerald-600">{unit?.type} → {patient?.bloodType} ({patient?.name})</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                                        <AlertTriangle className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-red-900">Cross-Match: INCOMPATIBLE</h3>
                                        <p className="text-xs text-red-600">Cannot proceed — select a compatible unit</p>
                                    </div>
                                </>
                            )}
                        </div>
                        {crossMatchResult === 'pass' && (
                            <button onClick={handleCommit} className="btn-primary flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                Commit Transfusion
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* History Table */}
            <div className="card overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-slate-900">Transfusion History</h2>
                    <span className="text-xs text-slate-400 font-medium">{transfusions.length} records</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">ID</th>
                                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Patient</th>
                                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Patient Type</th>
                                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Unit</th>
                                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Unit Type</th>
                                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Performed By</th>
                                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Date</th>
                                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Ward</th>
                                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transfusions.map((txn) => (
                                <tr key={txn.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{txn.id}</td>
                                    <td className="px-4 py-3 text-sm font-semibold text-slate-900">{txn.patientName}</td>
                                    <td className="px-4 py-3 text-sm font-bold">{txn.patientType}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{txn.unitId}</td>
                                    <td className="px-4 py-3 text-sm font-bold">{txn.unitType}</td>
                                    <td className="px-4 py-3 text-xs text-slate-500">{txn.performedBy}</td>
                                    <td className="px-4 py-3 text-xs text-slate-500">{new Date(txn.performedAt).toLocaleString('en-GB')}</td>
                                    <td className="px-4 py-3 text-xs text-slate-500">{txn.ward}</td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">{txn.status}</span>
                                    </td>
                                </tr>
                            ))}
                            {transfusions.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="px-4 py-8 text-center text-sm text-slate-400">
                                        No transfusions recorded yet
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
