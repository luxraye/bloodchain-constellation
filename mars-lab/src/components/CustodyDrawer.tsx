import { X, User, Clock, Droplets, Barcode, Package } from 'lucide-react'
import type { LabAsset } from '../types'
import StatusBadge, { ViralBadge } from './StatusBadge'
import { formatIsbt128 } from '../lib/isbt128'

interface Props {
  asset: LabAsset | null
  onClose: () => void
  onSplit: (asset: LabAsset) => void
  onDiscard: (asset: LabAsset) => void
  onRelease: (asset: LabAsset) => void
}

function daysUntilExpiry(iso: string): number {
  return Math.floor((Date.parse(iso) - Date.now()) / 86_400_000)
}

function derivedViralStatus(asset: LabAsset): 'PENDING' | 'SAFE' | 'BIOHAZARD' {
  if (asset.status === 'BIOHAZARD' || asset.status === 'DISCARDED') return 'BIOHAZARD'
  if (!asset.viralScreening) return 'PENDING'
  const markers = Object.values(asset.viralScreening)
  if (markers.some((m) => m === 'POSITIVE')) return 'BIOHAZARD'
  if (markers.some((m) => m === 'PENDING')) return 'PENDING'
  return 'SAFE'
}

const markerLabel: Record<string, string> = {
  hiv: 'HIV 1/2',
  hepB: 'Hep B (HBsAg)',
  hepC: 'Hep C (Anti-HCV)',
  syphilis: 'Syphilis (RPR)',
}

export default function CustodyDrawer({ asset, onClose, onSplit, onDiscard, onRelease }: Props) {
  if (!asset) return null

  const expDays = daysUntilExpiry(asset.expirationDate)
  const viralStatus = derivedViralStatus(asset)
  const canAct = asset.status !== 'RELEASED' && asset.status !== 'DISCARDED'
  const canSplit = asset.status === 'QUARANTINE' || asset.status === 'INCOMING' || asset.status === 'TESTING'

  return (
    <div className="flex h-full w-[400px] flex-col border-l border-slate-800 bg-slate-950">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Chain of Custody</div>
          <div className="mt-0.5 font-mono-ui text-sm text-cyan-300">{formatIsbt128(asset.id)}</div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto scroll-thin px-4 py-3 space-y-4">
        {/* Identity */}
        <section className="space-y-2">
          <SectionLabel text="Unit Identity" />
          <div className="grid grid-cols-2 gap-2">
            <InfoCell icon={<Barcode className="h-3 w-3" />} label="ISBT-128" value={formatIsbt128(asset.id)} mono />
            <InfoCell icon={<Droplets className="h-3 w-3" />} label="Blood Type" value={asset.bloodType} />
            <InfoCell icon={<Package className="h-3 w-3" />} label="Component" value={asset.componentType} />
            <InfoCell icon={<User className="h-3 w-3" />} label="Donor" value={asset.donorId} mono />
          </div>
        </section>

        {/* Status & Expiry */}
        <section className="space-y-2">
          <SectionLabel text="Status" />
          <div className="flex items-center gap-3">
            <StatusBadge status={asset.status} />
            <ViralBadge status={viralStatus} />
          </div>
          <div className="flex items-center gap-2 rounded border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-400">Expiry:</span>
            <span className={`font-mono-ui font-medium ${expDays <= 5 ? 'text-red-400' : expDays <= 14 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {expDays > 0 ? `${expDays} days` : 'EXPIRED'}
            </span>
          </div>
        </section>

        {/* Viral Screening Panel */}
        <section className="space-y-2">
          <SectionLabel text="Viral Screening" />
          <div className="space-y-1">
            {Object.entries(asset.viralScreening ?? {}).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between rounded bg-slate-900/60 px-3 py-1.5 text-xs">
                <span className="text-slate-400">{markerLabel[key] ?? key}</span>
                <span
                  className={`font-mono-ui font-medium ${val === 'NEGATIVE' ? 'text-emerald-400' : val === 'POSITIVE' ? 'text-red-400' : 'text-sky-400'
                    }`}
                >
                  {val}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Chain of Custody Timeline */}
        <section className="space-y-2">
          <SectionLabel text="Custody Timeline" />
          <div className="relative pl-4">
            <div className="absolute left-[7px] top-1 bottom-1 w-px bg-slate-700" />
            {(asset.chainOfCustody ?? []).map((evt, i) => (
              <div key={i} className="relative mb-3 last:mb-0">
                <div className="absolute -left-4 top-1 h-2 w-2 rounded-full border border-slate-600 bg-slate-800" />
                <div className="rounded bg-slate-900/60 px-3 py-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-200">{evt.action}</span>
                    <span className="font-mono-ui text-[10px] text-slate-500">
                      {new Date(evt.time).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1 text-slate-400">
                    <User className="h-3 w-3" /> {evt.actor}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer Actions */}
      {canAct && (
        <div className="border-t border-slate-800 px-4 py-3 space-y-2">
          {canSplit && (
            <button
              type="button"
              onClick={() => onSplit(asset)}
              className="w-full rounded border border-cyan-500/40 bg-cyan-900/30 px-3 py-2 text-xs font-medium text-cyan-300 hover:bg-cyan-900/50"
            >
              Split Component
            </button>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onRelease(asset)}
              className="flex-1 rounded bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-500"
            >
              Release
            </button>
            <button
              type="button"
              onClick={() => onDiscard(asset)}
              className="flex-1 rounded bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-500"
            >
              Discard (Biohazard)
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-medium">{text}</div>
  )
}

function InfoCell({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="rounded border border-slate-800 bg-slate-900/60 px-2.5 py-1.5">
      <div className="flex items-center gap-1 text-[10px] text-slate-500">
        {icon} {label}
      </div>
      <div className={`mt-0.5 text-xs text-slate-200 ${mono ? 'font-mono-ui' : ''}`}>
        {value}
      </div>
    </div>
  )
}
