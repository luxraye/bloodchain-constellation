import { useState } from 'react';
import { Truck, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: authError } = await login(email.trim(), password);
      if (authError) setError(authError.message);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-900">
      <div className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-800/80 p-8 shadow-xl mx-4">
        {/* Logo */}
        <div className="mb-6 flex items-center gap-3">
          <div className="h-10 w-1 rounded-full bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.6)]" />
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Bloodchain · Transit
            </div>
            <div className="font-mono text-lg text-slate-100">
              Voyager
            </div>
          </div>
        </div>

        <p className="mb-5 text-sm text-slate-400">
          Sign in with your Bloodchain account to access the job board and relay.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label htmlFor="email" className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="courier@bloodchain.bw"
                required
                className="h-10 w-full rounded-lg border border-slate-600 bg-slate-700 pl-9 pr-3 text-sm text-slate-200 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-10 w-full rounded-lg border border-slate-600 bg-slate-700 pl-9 pr-3 text-sm text-slate-200 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 placeholder:text-slate-600"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-950/60 border border-red-800 px-3 py-2 text-xs text-red-400">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-orange-500 px-4 py-3 font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</> : 'Continue to Job Board'}
          </button>
        </form>
      </div>
    </div>
  );
}
