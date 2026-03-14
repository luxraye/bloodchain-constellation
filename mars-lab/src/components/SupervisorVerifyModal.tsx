import { useState } from 'react'
import { X, ShieldAlert } from 'lucide-react'
import type { LabAsset } from '../types'
import { formatIsbt128 } from '../lib/isbt128'

interface Props {
  asset: LabAsset
  onClose: () => void
  onVerified: (assetId: string) => void
}

export default function SupervisorVerifyModal({ asset, onClose, onVerified }: Props) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (pin.length < 4) {
      setError('PIN must be at least 4 digits')
      return
    }

    // Hardcoded supervisor PIN for offline dev & pilot demo
    if (pin !== '1234') {
      setError('Incorrect PIN — contact your supervisor')
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onVerified(asset.id)
    }, 400)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl border border-red-500/40 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-red-500/30 bg-red-950/30 px-5 py-4 rounded-t-xl">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-900/60">
              <ShieldAlert className="h-4 w-4 text-red-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-red-300">Biohazard Discard</div>
              <div className="text-[11px] text-red-400/70">Supervisor verification required</div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-300">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div className="rounded-lg border border-red-500/20 bg-red-950/20 px-3 py-2 text-xs text-red-300">
            You are about to permanently discard unit{' '}
            <span className="font-mono-ui font-bold text-red-200">{formatIsbt128(asset.id)}</span>{' '}
            ({asset.bloodType}) as biohazard waste. This action is <strong>irreversible</strong>.
          </div>

          <div>
            <label htmlFor="supervisor-pin" className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] text-slate-500">
              Supervisor PIN
            </label>
            <input
              id="supervisor-pin"
              type="password"
              inputMode="numeric"
              maxLength={8}
              autoFocus
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 4+ digit PIN"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-center font-mono-ui text-lg tracking-[0.3em] text-slate-100 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
            {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-600 bg-slate-800 px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || pin.length < 4}
              className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying…' : 'Confirm Discard'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
