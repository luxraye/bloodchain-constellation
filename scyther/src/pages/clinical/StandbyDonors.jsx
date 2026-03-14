import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
    Users,
    Send,
    CheckCircle2,
    XCircle,
    Eye,
    AlertTriangle,
    Clock,
    MapPin,
    Phone,
    ChevronDown,
    ChevronUp,
    FileText,
    Navigation,
    Shield,
    UserCheck,
    Droplets,
    Zap,
} from 'lucide-react';

const STATUS_CONFIG = {
    STANDBY: { label: 'On Standby', color: 'bg-amber-100 text-amber-800 border-amber-200', dot: 'bg-amber-400' },
    SCREENING_SENT: { label: 'Screening Sent', color: 'bg-blue-100 text-blue-800 border-blue-200', dot: 'bg-blue-400' },
    SCREENING_SUBMITTED: { label: 'Screening Returned', color: 'bg-purple-100 text-purple-800 border-purple-200', dot: 'bg-purple-400' },
    APPROVED: { label: 'Approved', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-400' },
    DIRECTIVE_SENT: { label: 'Directive Sent', color: 'bg-teal-100 text-teal-800 border-teal-200', dot: 'bg-teal-400' },
    REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-800 border-red-200', dot: 'bg-red-400' },
};

const PIPELINE_STEPS = ['STANDBY', 'SCREENING_SENT', 'SCREENING_SUBMITTED', 'APPROVED', 'DIRECTIVE_SENT'];

function getStepIndex(status) {
    const idx = PIPELINE_STEPS.indexOf(status);
    return idx >= 0 ? idx : (status === 'REJECTED' ? -1 : 0);
}

export default function StandbyDonors() {
    const { standbyDonors, updateStandbyDonor, addNotification } = useApp();
    const [expandedId, setExpandedId] = useState(null);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [directiveForm, setDirectiveForm] = useState(null); // { id, ... }

    const filtered = useMemo(() => {
        if (filterStatus === 'ALL') return standbyDonors;
        return standbyDonors.filter(d => d.status === filterStatus);
    }, [standbyDonors, filterStatus]);

    const statusCounts = useMemo(() => {
        const counts = { ALL: standbyDonors.length };
        standbyDonors.forEach(d => {
            counts[d.status] = (counts[d.status] || 0) + 1;
        });
        return counts;
    }, [standbyDonors]);

    // ---- Actions ----
    const handleSendScreening = (id) => {
        updateStandbyDonor(id, {
            status: 'SCREENING_SENT',
            screeningForm: { sentAt: new Date().toISOString(), sentBy: 'Dr. Smith' },
        });
        addNotification('Preliminary screening form sent to donor', 'success');
    };

    const handleSimulateScreeningReturn = (donor) => {
        updateStandbyDonor(donor.id, {
            status: 'SCREENING_SUBMITTED',
            screeningResponse: {
                submittedAt: new Date().toISOString(),
                weight: 60 + Math.floor(Math.random() * 30),
                lastMeal: `${2 + Math.floor(Math.random() * 4)} hours ago`,
                recentIllness: false,
                medications: 'None',
                pregnant: false,
                travelHistory: 'No recent travel',
                tattooOrPiercing: Math.random() > 0.85,
                feelingWell: true,
                hadSurgery: false,
            },
        });
        addNotification(`Screening response received from ${donor.donorName}`, 'info');
    };

    const handleApprove = (id) => {
        updateStandbyDonor(id, { status: 'APPROVED' });
        addNotification('Donor approved — ready to send directive', 'success');
    };

    const handleReject = (id, reason) => {
        updateStandbyDonor(id, {
            status: 'REJECTED',
            directive: { rejectedAt: new Date().toISOString(), rejectedBy: 'Dr. Smith', reason: reason || 'Did not pass screening criteria' },
        });
        addNotification('Donor rejected', 'warning');
    };

    const handleOpenDirectiveForm = (donor) => {
        setDirectiveForm({
            id: donor.id,
            donorName: donor.donorName,
            location: 'Princess Marina Hospital, Blood Bank Wing',
            date: 'today',
            timeStart: '14:00',
            timeEnd: '16:00',
            doctorName: 'Dr. Smith',
            supportAgent: 'Agent Kgomotso',
            supportPhone: '+267 361 0000',
            notes: 'Please bring your Omang ID and drink plenty of water before arriving.',
        });
    };

    const handleSendDirective = () => {
        if (!directiveForm) return;
        const timeWindow = `${directiveForm.timeStart} – ${directiveForm.timeEnd} ${directiveForm.date}`;
        updateStandbyDonor(directiveForm.id, {
            status: 'DIRECTIVE_SENT',
            directive: {
                sentAt: new Date().toISOString(),
                sentBy: directiveForm.doctorName,
                location: directiveForm.location,
                timeWindow,
                doctorName: directiveForm.doctorName,
                supportAgent: directiveForm.supportAgent,
                supportPhone: directiveForm.supportPhone,
                notes: directiveForm.notes,
            },
        });
        addNotification(`Donation directive sent to ${directiveForm.donorName}`, 'success');
        setDirectiveForm(null);
    };

    const toggle = (id) => setExpandedId(expandedId === id ? null : id);

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Users className="w-6 h-6 text-med-blue-600" />
                        Standby Donor Management
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Manage donors who responded to blood requests from the Azure App. Screen, approve, and send donation directives.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 font-bold px-3 py-1.5 rounded-full">
                        <Zap className="w-3 h-3" />
                        {statusCounts['STANDBY'] || 0} awaiting
                    </span>
                    <span className="flex items-center gap-1.5 bg-purple-50 border border-purple-200 text-purple-800 font-bold px-3 py-1.5 rounded-full">
                        <FileText className="w-3 h-3" />
                        {statusCounts['SCREENING_SUBMITTED'] || 0} to review
                    </span>
                </div>
            </div>

            {/* Pipeline Overview */}
            <div className="card p-4 mb-6">
                <div className="flex items-center gap-1 overflow-x-auto">
                    <button
                        onClick={() => setFilterStatus('ALL')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${filterStatus === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        All ({statusCounts.ALL || 0})
                    </button>
                    {PIPELINE_STEPS.map(step => (
                        <button
                            key={step}
                            onClick={() => setFilterStatus(step)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${filterStatus === step
                                    ? STATUS_CONFIG[step].color + ' border'
                                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                }`}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[step].dot}`} />
                            {STATUS_CONFIG[step].label} ({statusCounts[step] || 0})
                        </button>
                    ))}
                    <button
                        onClick={() => setFilterStatus('REJECTED')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${filterStatus === 'REJECTED'
                                ? STATUS_CONFIG.REJECTED.color + ' border'
                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                            }`}
                    >
                        <div className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG.REJECTED.dot}`} />
                        Rejected ({statusCounts.REJECTED || 0})
                    </button>
                </div>
            </div>

            {/* Directive Form Modal */}
            {directiveForm && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setDirectiveForm(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-slide-in" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Navigation className="w-5 h-5 text-med-blue-600" />
                                Send Donation Directive
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                                Send instructions to <span className="font-semibold">{directiveForm.donorName}</span> about where and when to donate.
                            </p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="label-field flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" />Donation Location</label>
                                <input
                                    value={directiveForm.location}
                                    onChange={(e) => setDirectiveForm({ ...directiveForm, location: e.target.value })}
                                    className="input-field"
                                    placeholder="e.g. Princess Marina Hospital, Blood Bank Wing"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="label-field">Date</label>
                                    <select
                                        value={directiveForm.date}
                                        onChange={(e) => setDirectiveForm({ ...directiveForm, date: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="today">Today</option>
                                        <option value="tomorrow">Tomorrow</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label-field">From</label>
                                    <input
                                        type="time"
                                        value={directiveForm.timeStart}
                                        onChange={(e) => setDirectiveForm({ ...directiveForm, timeStart: e.target.value })}
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="label-field">To</label>
                                    <input
                                        type="time"
                                        value={directiveForm.timeEnd}
                                        onChange={(e) => setDirectiveForm({ ...directiveForm, timeEnd: e.target.value })}
                                        className="input-field"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="label-field flex items-center gap-1"><UserCheck className="w-3 h-3 text-slate-400" />Ask for Doctor</label>
                                    <input
                                        value={directiveForm.doctorName}
                                        onChange={(e) => setDirectiveForm({ ...directiveForm, doctorName: e.target.value })}
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="label-field">Support Agent Name</label>
                                    <input
                                        value={directiveForm.supportAgent}
                                        onChange={(e) => setDirectiveForm({ ...directiveForm, supportAgent: e.target.value })}
                                        className="input-field"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="label-field flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" />Support Phone Number</label>
                                <input
                                    value={directiveForm.supportPhone}
                                    onChange={(e) => setDirectiveForm({ ...directiveForm, supportPhone: e.target.value })}
                                    className="input-field"
                                    placeholder="+267 000 000"
                                />
                            </div>
                            <div>
                                <label className="label-field">Additional Notes</label>
                                <textarea
                                    value={directiveForm.notes}
                                    onChange={(e) => setDirectiveForm({ ...directiveForm, notes: e.target.value })}
                                    className="input-field min-h-[80px] resize-none"
                                    placeholder="e.g. Bring your Omang ID, drink plenty of water..."
                                />
                            </div>

                            {/* Preview */}
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                <p className="text-[10px] uppercase text-slate-400 font-semibold mb-2">Directive Preview</p>
                                <div className="text-sm text-slate-700 space-y-1 leading-relaxed">
                                    <p>
                                        "You can proceed to donate at <span className="font-semibold">{directiveForm.location}</span> between{' '}
                                        <span className="font-semibold">{directiveForm.timeStart}</span> and{' '}
                                        <span className="font-semibold">{directiveForm.timeEnd} {directiveForm.date}</span>.
                                    </p>
                                    <p>
                                        Ask for <span className="font-semibold">{directiveForm.doctorName}</span> at reception.
                                    </p>
                                    <p>
                                        Contact <span className="font-semibold">{directiveForm.supportAgent}</span> for more info using{' '}
                                        <span className="font-semibold">{directiveForm.supportPhone}</span>."
                                    </p>
                                    {directiveForm.notes && (
                                        <p className="text-xs text-slate-500 italic mt-1">Note: {directiveForm.notes}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
                            <button onClick={() => setDirectiveForm(null)} className="btn-outline">Cancel</button>
                            <button onClick={handleSendDirective} className="btn-secondary flex items-center gap-2">
                                <Send className="w-4 h-4" />
                                Send Directive
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Donor Cards */}
            <div className="space-y-3">
                {filtered.map(donor => {
                    const isExpanded = expandedId === donor.id;
                    const stepIdx = getStepIndex(donor.status);
                    const config = STATUS_CONFIG[donor.status] || STATUS_CONFIG.STANDBY;

                    return (
                        <div key={donor.id} className="card overflow-hidden animate-fade-in">
                            {/* Card Header */}
                            <div
                                className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                                onClick={() => toggle(donor.id)}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Avatar */}
                                    <div className="relative">
                                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                                            <span className="text-sm font-bold text-slate-600">
                                                {donor.donorName.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </div>
                                        <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${config.dot}`} />
                                    </div>
                                    {/* Info */}
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-bold text-slate-900">{donor.donorName}</h3>
                                            <span className="flex items-center gap-1 text-xs font-bold text-brand-red-600">
                                                <Droplets className="w-3 h-3" />
                                                {donor.bloodType}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            Responded to: <span className="font-medium text-slate-500">{donor.linkedRequestPatient}</span>
                                            {' · '}{donor.distance} away
                                            {' · '}{new Date(donor.respondedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${config.color}`}>
                                        {config.label}
                                    </span>
                                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {isExpanded && (
                                <div className="px-5 pb-5 border-t border-slate-100 animate-fade-in">
                                    {/* Pipeline Progress */}
                                    <div className="py-4">
                                        <div className="flex items-center gap-0">
                                            {PIPELINE_STEPS.map((step, i) => {
                                                const isCompleted = stepIdx >= i;
                                                const isCurrent = stepIdx === i;
                                                const isRejected = donor.status === 'REJECTED';
                                                return (
                                                    <div key={step} className="flex items-center flex-1">
                                                        <div className="flex flex-col items-center flex-1">
                                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isRejected && isCurrent ? 'bg-red-600 text-white' :
                                                                    isCompleted ? 'bg-med-blue-600 text-white' :
                                                                        'bg-slate-200 text-slate-400'
                                                                }`}>
                                                                {isCompleted ? '✓' : i + 1}
                                                            </div>
                                                            <span className={`text-[9px] mt-1 font-semibold text-center leading-tight ${isCompleted ? 'text-med-blue-600' : 'text-slate-400'
                                                                }`}>
                                                                {STATUS_CONFIG[step].label}
                                                            </span>
                                                        </div>
                                                        {i < PIPELINE_STEPS.length - 1 && (
                                                            <div className={`h-0.5 flex-1 -mt-4 mx-1 rounded ${stepIdx > i ? 'bg-med-blue-400' : 'bg-slate-200'
                                                                }`} />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Contact Info */}
                                    <div className="flex items-center gap-4 mb-4 text-xs text-slate-500">
                                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {donor.phone}</span>
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {donor.distance} from location</span>
                                        <span>Gender: {donor.gender} · Age: {donor.age}</span>
                                    </div>

                                    {/* Screening Response Review */}
                                    {donor.screeningResponse && (
                                        <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 mb-4">
                                            <h4 className="text-xs font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
                                                <FileText className="w-3.5 h-3.5 text-med-blue-500" />
                                                Preliminary Screening Response
                                                <span className="text-slate-400 font-normal ml-1">
                                                    Submitted {new Date(donor.screeningResponse.submittedAt).toLocaleString('en-GB')}
                                                </span>
                                            </h4>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                <div className="bg-white rounded-md p-2.5 border border-slate-100">
                                                    <p className="text-[9px] uppercase text-slate-400 font-semibold">Weight</p>
                                                    <p className="text-sm font-bold text-slate-900">{donor.screeningResponse.weight} kg</p>
                                                </div>
                                                <div className="bg-white rounded-md p-2.5 border border-slate-100">
                                                    <p className="text-[9px] uppercase text-slate-400 font-semibold">Last Meal</p>
                                                    <p className="text-sm font-bold text-slate-900">{donor.screeningResponse.lastMeal}</p>
                                                </div>
                                                <div className="bg-white rounded-md p-2.5 border border-slate-100">
                                                    <p className="text-[9px] uppercase text-slate-400 font-semibold">Recent Illness</p>
                                                    <p className={`text-sm font-bold ${donor.screeningResponse.recentIllness ? 'text-red-600' : 'text-emerald-600'}`}>
                                                        {donor.screeningResponse.recentIllness ? 'Yes ⚠' : 'No ✓'}
                                                    </p>
                                                </div>
                                                <div className="bg-white rounded-md p-2.5 border border-slate-100">
                                                    <p className="text-[9px] uppercase text-slate-400 font-semibold">Medications</p>
                                                    <p className="text-sm font-bold text-slate-900">{donor.screeningResponse.medications}</p>
                                                </div>
                                                <div className="bg-white rounded-md p-2.5 border border-slate-100">
                                                    <p className="text-[9px] uppercase text-slate-400 font-semibold">Feeling Well</p>
                                                    <p className={`text-sm font-bold ${donor.screeningResponse.feelingWell ? 'text-emerald-600' : 'text-red-600'}`}>
                                                        {donor.screeningResponse.feelingWell ? 'Yes ✓' : 'No ⚠'}
                                                    </p>
                                                </div>
                                                <div className="bg-white rounded-md p-2.5 border border-slate-100">
                                                    <p className="text-[9px] uppercase text-slate-400 font-semibold">Tattoo/Piercing</p>
                                                    <p className={`text-sm font-bold ${donor.screeningResponse.tattooOrPiercing ? 'text-red-600' : 'text-emerald-600'}`}>
                                                        {donor.screeningResponse.tattooOrPiercing ? 'Yes ⚠' : 'No ✓'}
                                                    </p>
                                                </div>
                                                <div className="bg-white rounded-md p-2.5 border border-slate-100">
                                                    <p className="text-[9px] uppercase text-slate-400 font-semibold">Travel History</p>
                                                    <p className="text-sm font-bold text-slate-900">{donor.screeningResponse.travelHistory}</p>
                                                </div>
                                                <div className="bg-white rounded-md p-2.5 border border-slate-100">
                                                    <p className="text-[9px] uppercase text-slate-400 font-semibold">Pregnant</p>
                                                    <p className={`text-sm font-bold ${donor.screeningResponse.pregnant ? 'text-red-600' : 'text-emerald-600'}`}>
                                                        {donor.screeningResponse.pregnant ? 'Yes ⚠' : 'No ✓'}
                                                    </p>
                                                </div>
                                                <div className="bg-white rounded-md p-2.5 border border-slate-100">
                                                    <p className="text-[9px] uppercase text-slate-400 font-semibold">Surgery</p>
                                                    <p className={`text-sm font-bold ${donor.screeningResponse.hadSurgery ? 'text-red-600' : 'text-emerald-600'}`}>
                                                        {donor.screeningResponse.hadSurgery ? 'Yes ⚠' : 'No ✓'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Sent Directive View */}
                                    {donor.status === 'DIRECTIVE_SENT' && donor.directive && !donor.directive.rejectedAt && (
                                        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-4">
                                            <h4 className="text-xs font-semibold text-teal-800 mb-2 flex items-center gap-1.5">
                                                <Navigation className="w-3.5 h-3.5" />
                                                Directive Sent — {new Date(donor.directive.sentAt).toLocaleString('en-GB')}
                                            </h4>
                                            <div className="bg-white rounded-md p-3 border border-teal-100 text-sm text-slate-700 leading-relaxed">
                                                <p>
                                                    "You can proceed to donate at <strong>{donor.directive.location}</strong> between <strong>{donor.directive.timeWindow}</strong>.
                                                </p>
                                                <p className="mt-1">
                                                    Ask for <strong>{donor.directive.doctorName}</strong> at reception.
                                                </p>
                                                <p className="mt-1">
                                                    Contact <strong>{donor.directive.supportAgent}</strong> for more info using <strong>{donor.directive.supportPhone}</strong>."
                                                </p>
                                                {donor.directive.notes && (
                                                    <p className="mt-2 text-xs text-slate-500 italic">Note: {donor.directive.notes}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Rejection info */}
                                    {donor.status === 'REJECTED' && donor.directive?.rejectedAt && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start gap-3">
                                            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-semibold text-red-800">Rejected by {donor.directive.rejectedBy}</p>
                                                <p className="text-xs text-red-600 mt-0.5">{donor.directive.reason}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100">
                                        {donor.status === 'STANDBY' && (
                                            <button
                                                onClick={() => handleSendScreening(donor.id)}
                                                className="btn-secondary flex items-center gap-2 text-sm"
                                            >
                                                <Send className="w-3.5 h-3.5" />
                                                Send Screening Form
                                            </button>
                                        )}

                                        {donor.status === 'SCREENING_SENT' && (
                                            <>
                                                <div className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    Waiting for donor to submit screening...
                                                </div>
                                                <button
                                                    onClick={() => handleSimulateScreeningReturn(donor)}
                                                    className="btn-outline text-xs flex items-center gap-1.5"
                                                >
                                                    <Zap className="w-3 h-3" />
                                                    Simulate Response
                                                </button>
                                            </>
                                        )}

                                        {donor.status === 'SCREENING_SUBMITTED' && (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(donor.id)}
                                                    className="btn-success flex items-center gap-2 text-sm"
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    Approve Donor
                                                </button>
                                                <button
                                                    onClick={() => handleReject(donor.id)}
                                                    className="btn-danger flex items-center gap-2 text-sm"
                                                >
                                                    <XCircle className="w-3.5 h-3.5" />
                                                    Reject
                                                </button>
                                            </>
                                        )}

                                        {donor.status === 'APPROVED' && (
                                            <button
                                                onClick={() => handleOpenDirectiveForm(donor)}
                                                className="btn-secondary flex items-center gap-2 text-sm"
                                            >
                                                <Navigation className="w-3.5 h-3.5" />
                                                Send Donation Directive
                                            </button>
                                        )}

                                        {donor.status === 'DIRECTIVE_SENT' && (
                                            <div className="flex items-center gap-1.5 text-xs text-teal-700 bg-teal-50 px-3 py-2 rounded-lg">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Directive sent — awaiting donor arrival
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {filtered.length === 0 && (
                    <div className="card p-12 text-center">
                        <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-base font-semibold text-slate-600">No donors in this category</h3>
                        <p className="text-sm text-slate-400 mt-1">
                            {filterStatus === 'ALL'
                                ? 'No donors have responded to blood requests yet.'
                                : `No donors with status "${STATUS_CONFIG[filterStatus]?.label || filterStatus}".`
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
