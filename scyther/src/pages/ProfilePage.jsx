import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getMyProfile, updateMyProfile } from '../services/api';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({ name: '', facilityId: '' });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        getMyProfile().then(p => {
            if (p) { setProfile(p); setForm({ name: p.name || '', facilityId: p.facilityId || '' }); }
        });
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true); setError(''); setSaved(false);
        try {
            const updated = await updateMyProfile(form);
            setProfile(updated);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch (err) {
            setError(err?.response?.data?.error || 'Failed to save');
        } finally { setSaving(false); }
    };

    const roleColor = { MEDICAL: 'text-emerald-400', LAB: 'text-amber-400', TRANSIT: 'text-sky-400', ADMIN: 'text-yellow-400', PUBLIC: 'text-slate-400' };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-lg mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
                        <p className="text-sm text-slate-500 mt-0.5">Manage your account details</p>
                    </div>
                    <span className={`text-xs font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-slate-100 ${roleColor[user?.role] || 'text-slate-500'}`}>
                        {user?.role}
                    </span>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Avatar banner */}
                    <div className="h-20 bg-gradient-to-r from-brand-red-600 to-brand-red-700" />
                    <div className="px-6 pb-6">
                        <div className="-mt-8 mb-4 w-16 h-16 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-2xl font-black text-brand-red-600">
                            {(profile?.name || user?.name || '?')[0].toUpperCase()}
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Full Name</label>
                                <input className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-brand-red-400 focus:ring-2 focus:ring-brand-red-100 transition"
                                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                                <input className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500 cursor-not-allowed" value={profile?.email || user?.email || ''} disabled />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Facility / Hospital</label>
                                <input className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-brand-red-400 focus:ring-2 focus:ring-brand-red-100 transition"
                                    placeholder="e.g. Princess Marina Hospital" value={form.facilityId} onChange={e => setForm({ ...form, facilityId: e.target.value })} />
                            </div>

                            {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
                            {saved && <p className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">✓ Profile saved</p>}

                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={saving}
                                    className="flex-1 rounded-lg bg-brand-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-red-700 disabled:opacity-60 transition">
                                    {saving ? 'Saving…' : 'Save Changes'}
                                </button>
                                <button type="button" onClick={() => logout()}
                                    className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
                                    Sign Out
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Info panel */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Account Info</h2>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div><p className="text-xs text-slate-400">User ID</p><p className="font-mono text-slate-700 truncate text-xs">{profile?.id?.slice(0, 12) ?? '—'}…</p></div>
                        <div><p className="text-xs text-slate-400">Role</p><p className="font-semibold text-slate-700">{profile?.role ?? user?.role}</p></div>
                        <div><p className="text-xs text-slate-400">Status</p><p className={`font-semibold ${profile?.status === 'ACTIVE' ? 'text-emerald-600' : 'text-red-500'}`}>{profile?.status ?? 'ACTIVE'}</p></div>
                        <div><p className="text-xs text-slate-400">Member Since</p><p className="text-slate-700">{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—'}</p></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
