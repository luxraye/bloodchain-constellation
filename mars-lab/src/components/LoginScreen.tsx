import { useState } from 'react'
import { Droplets, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export function LoginScreen() {
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
    <div className="flex h-screen w-screen items-center justify-center bg-slate-950">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.06),transparent_60%)]" />

      <div className="relative w-full max-w-sm px-4">
        {/* Logo row */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-700 shadow-lg shadow-cyan-500/30">
            <Droplets className="h-6 w-6 text-white" />
          </div>
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">NBTS · Mars</p>
            <h1 className="font-mono text-lg text-slate-100">Lab Workstation</h1>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl backdrop-blur">
          <div className="mb-1 flex items-center gap-2">
            <div className="h-8 w-0.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.6)]" />
            <h2 className="text-sm font-semibold text-slate-200">Authenticate to continue</h2>
          </div>
          <p className="mb-5 ml-2.5 text-xs text-slate-500">LAB or ADMIN role required.</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="email" className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="lab@bloodchain.bw"
                  required
                  className="h-9 w-full rounded-lg border border-slate-700 bg-slate-800 pl-8 pr-3 font-mono text-xs text-slate-200 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-9 w-full rounded-lg border border-slate-700 bg-slate-800 pl-8 pr-3 font-mono text-xs text-slate-200 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 placeholder:text-slate-600"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-950/60 border border-red-900 px-3 py-2 text-xs text-red-400">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 text-xs font-semibold text-white shadow-sm transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Authenticating…</> : '→ Access Lab Console'}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-[10px] text-slate-600">
          Bloodchain Botswana · Authorised Clinical Personnel Only
        </p>
      </div>
    </div>
  )
}
