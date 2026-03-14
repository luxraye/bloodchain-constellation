import { AlertTriangle, Beaker, CheckCircle, Clock, Package, ShieldCheck, XCircle } from 'lucide-react'
import type { LabAssetStatus } from '../types'

const CONFIG: Record<
  LabAssetStatus,
  { label: string; bg: string; text: string; border: string; Icon: typeof Beaker }
> = {
  INCOMING: {
    label: 'INCOMING',
    bg: 'bg-sky-900/40',
    text: 'text-sky-300',
    border: 'border-sky-500/40',
    Icon: Package,
  },
  TESTING: {
    label: 'TESTING',
    bg: 'bg-sky-900/40',
    text: 'text-sky-300',
    border: 'border-sky-500/40',
    Icon: Beaker,
  },
  QUARANTINE: {
    label: 'QUARANTINE',
    bg: 'bg-amber-900/40',
    text: 'text-amber-300',
    border: 'border-amber-500/40',
    Icon: Clock,
  },
  RELEASED: {
    label: 'RELEASED',
    bg: 'bg-emerald-900/40',
    text: 'text-emerald-300',
    border: 'border-emerald-500/40',
    Icon: CheckCircle,
  },
  BIOHAZARD: {
    label: 'BIOHAZARD',
    bg: 'bg-red-950/70',
    text: 'text-red-300',
    border: 'border-red-500/60',
    Icon: AlertTriangle,
  },
  DISCARDED: {
    label: 'DISCARDED',
    bg: 'bg-red-950/70',
    text: 'text-red-400',
    border: 'border-red-500/60',
    Icon: XCircle,
  },
}

interface Props {
  status: LabAssetStatus
  compact?: boolean
}

export default function StatusBadge({ status, compact }: Props) {
  const c = CONFIG[status] ?? CONFIG.INCOMING
  const { Icon } = c

  return (
    <span
      className={`inline-flex items-center gap-1 rounded border ${c.border} ${c.bg} px-2 py-0.5 font-mono-ui text-[11px] font-medium ${c.text}`}
    >
      <Icon className="h-3 w-3" />
      {!compact && c.label}
    </span>
  )
}

export function ViralBadge({ status }: { status: 'PENDING' | 'SAFE' | 'BIOHAZARD' }) {
  if (status === 'SAFE')
    return (
      <span className="inline-flex items-center gap-1 rounded border border-emerald-500/40 bg-emerald-900/40 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
        <ShieldCheck className="h-3 w-3" /> CLEAR
      </span>
    )
  if (status === 'BIOHAZARD')
    return (
      <span className="inline-flex items-center gap-1 rounded border border-red-500/60 bg-red-950/70 px-2 py-0.5 text-[11px] font-medium text-red-300">
        <AlertTriangle className="h-3 w-3" /> REACTIVE
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1 rounded border border-sky-500/40 bg-sky-900/40 px-2 py-0.5 text-[11px] font-medium text-sky-300">
      <Beaker className="h-3 w-3" /> PENDING
    </span>
  )
}
