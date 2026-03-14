import { useState } from 'react'
import { Droplets, Mail, Lock, AlertCircle, Loader2, ShieldCheck } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function LoginScreen() {
    const { login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const { error: authError } = await login(email.trim(), password)
            if (authError) setError(authError.message)
        } catch {
            setError('Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-4">
            {/* Background grid */}
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,163,6,0.08),transparent_60%)]" />

            <div className="relative w-full max-w-sm">
                {/* Logo */}
                <div className="mb-8 flex flex-col items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-command-gold/80 to-amber-700 shadow-lg shadow-command-gold/20">
                        <Droplets className="h-7 w-7 text-neutral-950" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-xl font-bold tracking-tight text-neutral-100">Bloodchain · High Command</h1>
                        <p className="text-xs text-neutral-500 mt-0.5">Administrative Operations Centre</p>
                    </div>
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
                    <div className="flex items-center gap-2 mb-4">
                        <ShieldCheck className="h-4 w-4 text-command-gold" />
                        <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Secure Access</span>
                    </div>
                    <h2 className="text-base font-semibold text-neutral-100 mb-1">Administrator Sign-In</h2>
                    <p className="text-xs text-neutral-500 mb-5">ADMIN role required to access this console.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="text-xs font-medium text-neutral-400">Email address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="admin@bloodchain.bw"
                                    required
                                    className="h-10 w-full rounded-lg border border-neutral-700 bg-neutral-800 pl-9 pr-3 text-sm text-neutral-100 outline-none transition focus:border-command-gold focus:ring-2 focus:ring-command-gold/20 placeholder:text-neutral-600"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="password" className="text-xs font-medium text-neutral-400">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                                <input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="h-10 w-full rounded-lg border border-neutral-700 bg-neutral-800 pl-9 pr-3 text-sm text-neutral-100 outline-none transition focus:border-command-gold focus:ring-2 focus:ring-command-gold/20 placeholder:text-neutral-600"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 rounded-lg bg-red-950 border border-red-800 px-3 py-2 text-xs text-red-400">
                                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-command-gold text-sm font-semibold text-neutral-950 shadow-sm transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Authenticating…</> : 'Access Command Centre'}
                        </button>
                    </form>
                </div>

                <p className="mt-5 text-center text-[11px] text-neutral-600">
                    Authorised administrators only · Bloodchain Botswana Pilot v1
                </p>
            </div>
        </div>
    )
}
