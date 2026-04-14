import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useApp } from '../../context/AppContext';
import { generateUnitId } from '../../lib/collectionHelpers.js';
import {
    ClipboardList,
    AlertTriangle,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    Weight,
    Activity,
    Droplets,
    ShieldCheck,
    XCircle,
    Stethoscope,
} from 'lucide-react';

const screeningSchema = z.object({
    gender: z.enum(['Male', 'Female'], { required_error: 'Select gender' }),
    weight: z.coerce.number().min(1, 'Required').max(300, 'Invalid weight'),
    hemoglobin: z.coerce.number().min(1, 'Required').max(25, 'Invalid Hb'),
    bpSystolic: z.coerce.number().min(60, 'Too low').max(250, 'Too high'),
    bpDiastolic: z.coerce.number().min(30, 'Too low').max(150, 'Too high'),
    temperature: z.coerce.number().min(35, 'Too low').max(42, 'Too high').optional().or(z.literal('')),
    pulse: z.coerce.number().min(40, 'Too low').max(200, 'Too high').optional().or(z.literal('')),
    questionnaire: z.boolean().optional(),
});

export default function MedicalScreening() {
    const { activeDonor, setActiveScreening, addNotification } = useApp();
    const navigate = useNavigate();
    const [outcome, setOutcome] = useState(null); // null | 'pass' | 'defer'
    const [deferReasons, setDeferReasons] = useState([]);
    const [flashType, setFlashType] = useState('');
    const [generatedUnitId, setGeneratedUnitId] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
    } = useForm({
        resolver: zodResolver(screeningSchema),
        defaultValues: {
            gender: activeDonor?.gender || '',
            weight: '',
            hemoglobin: '',
            bpSystolic: '',
            bpDiastolic: '',
            temperature: '',
            pulse: '',
            questionnaire: false,
        },
    });

    const onSubmit = (data) => {
        const reasons = [];

        // Weight check
        if (data.weight < 50) {
            reasons.push(`Weight ${data.weight}kg is below the minimum 50kg threshold`);
        }

        // Hemoglobin check
        if (data.gender === 'Female' && data.hemoglobin < 12.5) {
            reasons.push(`Hemoglobin ${data.hemoglobin} g/dL is below 12.5 g/dL (female minimum)`);
        }
        if (data.gender === 'Male' && data.hemoglobin < 13.5) {
            reasons.push(`Hemoglobin ${data.hemoglobin} g/dL is below 13.5 g/dL (male minimum)`);
        }

        // BP check (optional extra logic)
        if (data.bpSystolic > 180 || data.bpDiastolic > 100) {
            reasons.push(`Blood pressure ${data.bpSystolic}/${data.bpDiastolic} is too high`);
        }
        if (data.bpSystolic < 90 || data.bpDiastolic < 50) {
            reasons.push(`Blood pressure ${data.bpSystolic}/${data.bpDiastolic} is too low`);
        }

        if (reasons.length > 0) {
            setOutcome('defer');
            setDeferReasons(reasons);
            setFlashType('red');
            addNotification('Donor DEFERRED — see screening results', 'error');
        } else {
            const unitId = generateUnitId();
            setOutcome('pass');
            setGeneratedUnitId(unitId);
            setDeferReasons([]);
            setFlashType('green');
            setActiveScreening({
                ...data,
                unitId,
                donorId: activeDonor?.id,
                screenedAt: new Date().toISOString(),
            });
            addNotification(`Donor PASSED — Unit ID: ${unitId}`, 'success');
        }
        setTimeout(() => setFlashType(''), 600);
    };

    const handleProceedToPhlebotomy = () => {
        navigate('/collection/phlebotomy');
    };

    // Auto-advance to Phlebotomy when vitals pass — no confirmation modal, direct to barcode step
    useEffect(() => {
        if (outcome !== 'pass') return;
        const t = setTimeout(() => navigate('/collection/phlebotomy'), 600);
        return () => clearTimeout(t);
    }, [outcome, navigate]);

    const handleBack = () => {
        navigate('/collection/check-in');
    };

    return (
        <div className={`max-w-3xl mx-auto animate-fade-in ${flashType === 'green' ? 'flash-green' : flashType === 'red' ? 'flash-red' : ''}`}>
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                    <button onClick={handleBack} className="btn-ghost p-1.5" tabIndex={0}>
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <ClipboardList className="w-6 h-6 text-brand-red-600" />
                        Medical Screening
                    </h1>
                </div>
                <p className="text-sm text-slate-500 ml-10">Record vitals and run eligibility checks. All fields are tab-navigable.</p>
            </div>

            {/* Donor Info Banner */}
            {activeDonor && (
                <div className="card p-4 mb-6 flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-red-100 flex items-center justify-center">
                            <Stethoscope className="w-4 h-4 text-brand-red-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900">{activeDonor.firstName} {activeDonor.lastName}</p>
                            <p className="text-xs text-slate-400">Blood Type: {activeDonor.bloodType} · Omang: {activeDonor.omang}</p>
                        </div>
                    </div>
                    <div className="text-xs text-slate-400 font-medium">
                        Screening for donation #{(activeDonor.totalDonations || 0) + 1}
                    </div>
                </div>
            )}

            {!activeDonor && (
                <div className="card p-8 text-center mb-6">
                    <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-700">No donor selected</p>
                    <p className="text-xs text-slate-400 mt-1">Please go to Donor Check-In first to select a donor.</p>
                    <button onClick={handleBack} className="btn-primary mt-4">Go to Check-In</button>
                </div>
            )}

            {/* Screening Form */}
            {activeDonor && !outcome && (
                <form onSubmit={handleSubmit(onSubmit)} className="card p-6">
                    <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-brand-red-500" />
                        Vitals Input
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Gender */}
                        <div>
                            <label className="label-field">Gender</label>
                            <select {...register('gender')} className="input-field" tabIndex={1}>
                                <option value="">Select...</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender.message}</p>}
                        </div>

                        {/* Weight */}
                        <div>
                            <label className="label-field flex items-center gap-1">
                                <Weight className="w-3.5 h-3.5 text-slate-400" /> Weight (kg)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                placeholder="e.g. 65"
                                {...register('weight')}
                                className={`input-field ${errors.weight ? 'border-red-400' : ''}`}
                                tabIndex={2}
                            />
                            {errors.weight && <p className="text-xs text-red-500 mt-1">{errors.weight.message}</p>}
                            <p className="text-[10px] text-slate-400 mt-0.5">Minimum: 50 kg</p>
                        </div>

                        {/* Hemoglobin */}
                        <div>
                            <label className="label-field flex items-center gap-1">
                                <Droplets className="w-3.5 h-3.5 text-slate-400" /> Hemoglobin (g/dL)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                placeholder="e.g. 14.2"
                                {...register('hemoglobin')}
                                className={`input-field ${errors.hemoglobin ? 'border-red-400' : ''}`}
                                tabIndex={3}
                            />
                            {errors.hemoglobin && <p className="text-xs text-red-500 mt-1">{errors.hemoglobin.message}</p>}
                            <p className="text-[10px] text-slate-400 mt-0.5">Min: 12.5 (F) / 13.5 (M)</p>
                        </div>

                        {/* Blood Pressure */}
                        <div>
                            <label className="label-field">Blood Pressure</label>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="number"
                                    placeholder="Systolic"
                                    {...register('bpSystolic')}
                                    className={`input-field ${errors.bpSystolic ? 'border-red-400' : ''}`}
                                    tabIndex={4}
                                />
                                <span className="text-slate-400 font-bold">/</span>
                                <input
                                    type="number"
                                    placeholder="Diastolic"
                                    {...register('bpDiastolic')}
                                    className={`input-field ${errors.bpDiastolic ? 'border-red-400' : ''}`}
                                    tabIndex={5}
                                />
                            </div>
                            {(errors.bpSystolic || errors.bpDiastolic) && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.bpSystolic?.message || errors.bpDiastolic?.message}
                                </p>
                            )}
                        </div>

                        {/* Temperature (optional) */}
                        <div>
                            <label className="label-field">Temperature °C <span className="text-slate-300 font-normal">(optional)</span></label>
                            <input
                                type="number"
                                step="0.1"
                                placeholder="e.g. 36.6"
                                {...register('temperature')}
                                className="input-field"
                                tabIndex={6}
                            />
                        </div>

                        {/* Pulse (optional) */}
                        <div>
                            <label className="label-field">Pulse (bpm) <span className="text-slate-300 font-normal">(optional)</span></label>
                            <input
                                type="number"
                                placeholder="e.g. 72"
                                {...register('pulse')}
                                className="input-field"
                                tabIndex={7}
                            />
                        </div>
                    </div>

                    {/* Questionnaire */}
                    <div className="mt-5 p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                {...register('questionnaire')}
                                className="mt-1 w-4 h-4 rounded border-slate-300 text-brand-red-600 focus:ring-brand-red-500"
                                tabIndex={8}
                            />
                            <div>
                                <p className="text-sm font-medium text-slate-700">Pre-donation questionnaire completed</p>
                                <p className="text-xs text-slate-400">Donor has answered all screening questions and signed consent</p>
                            </div>
                        </label>
                    </div>

                    {/* Submit */}
                    <div className="mt-6 flex justify-end">
                        <button type="submit" className="btn-primary flex items-center gap-2" tabIndex={9}>
                            <ShieldCheck className="w-4 h-4" />
                            Run Eligibility Check
                        </button>
                    </div>
                </form>
            )}

            {/* Outcome: PASS — brief state then auto-advance to Phlebotomy (no confirmation modal) */}
            {outcome === 'pass' && (
                <div className="card overflow-hidden animate-slide-in">
                    <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-emerald-900">Screening Passed</h3>
                            <p className="text-xs text-emerald-600">Taking you to phlebotomy for barcode scanning…</p>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="bg-emerald-50 rounded-lg p-4 mb-4">
                            <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider mb-1">Generated Unit ID</p>
                            <p className="text-2xl font-mono font-bold text-emerald-900">{generatedUnitId}</p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => { setOutcome(null); reset(); }} className="btn-outline">
                                Screen Another
                            </button>
                            <button onClick={handleProceedToPhlebotomy} className="btn-primary flex items-center gap-2">
                                Go to Phlebotomy now
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Outcome: DEFER */}
            {outcome === 'defer' && (
                <div className="card overflow-hidden animate-shake">
                    <div className="bg-red-50 border-b border-red-100 px-6 py-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                            <XCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-red-900">Donor Deferred</h3>
                            <p className="text-xs text-red-600">Donor does not meet the eligibility criteria</p>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-2 mb-4">
                            {deferReasons.map((reason, i) => (
                                <div key={i} className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-lg p-3">
                                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-700">{reason}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end gap-3">
                            <button onClick={handleBack} className="btn-outline">
                                Return to Check-In
                            </button>
                            <button onClick={() => { setOutcome(null); reset(); }} className="btn-danger">
                                Re-screen Donor
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
