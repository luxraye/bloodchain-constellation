/**
 * LoginScreen — Scyther / Mars-Lab shared design
 * Clinical-grade branded email+password form calling supabase.auth.signInWithPassword()
 */
import { useState } from 'react'
import { Droplets, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'

export default function LoginScreen() {
    const { login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const { error: authError } = await login(email.trim(), password)
            if (authError) setError(authError.message)
        } catch (err) {
            setError('Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="mb-8 flex flex-col items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-red-600 to-brand-red-700 shadow-lg shadow-brand-red-600/30">
                        <Droplets className="h-7 w-7 text-white" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">Bloodchain · Scyther</h1>
                        <p className="text-xs text-slate-500 mt-0.5">Botswana National Blood Supply Chain</p>
                    </div>
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-base font-semibold text-slate-900 mb-1">Sign in to your account</h2>
                    <p className="text-xs text-slate-500 mb-5">Medical staff and lab personnel only.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="text-xs font-medium text-slate-700">Email address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="you@bloodchain.bw"
                                    required
                                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-500/20 placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="password" className="text-xs font-medium text-slate-700">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-500/20 placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
                                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-brand-red-600 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</> : 'Sign In'}
                        </button>
                    </form>
                </div>

                <p className="mt-5 text-center text-[11px] text-slate-400">
                    Authorised personnel only · Bloodchain Botswana Pilot v1
                </p>
            </div>
        </div>
    )
}
