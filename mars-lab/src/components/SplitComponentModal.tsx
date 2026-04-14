import { useState } from 'react'
import { X, Scissors } from 'lucide-react'
import type { LabAsset } from '../types'
import { formatIsbt128 } from '../lib/isbt128'

interface Props {
  asset: LabAsset
  onClose: () => void
  onConfirm: (assetId: string, components: string[]) => void
}

const COMPONENTS = [
  { id: 'RBC', label: 'Red Blood Cells (RBC)', color: 'text-red-400 border-red-500/40' },
  { id: 'PLT', label: 'Platelets', color: 'text-amber-400 border-amber-500/40' },
  { id: 'FFP', label: 'Fresh Frozen Plasma (FFP)', color: 'text-sky-400 border-sky-500/40' },
]

export default function SplitComponentModal({ asset, onClose, onConfirm }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const handleConfirm = () => {
    if (selected.size === 0) return
    onConfirm(asset.id, Array.from(selected))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-900/50">
              <Scissors className="h-4 w-4 text-cyan-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-100">Split Component</div>
              <div className="font-mono-ui text-[11px] text-cyan-400">{formatIsbt128(asset.id)}</div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-300">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3">
          <p className="text-xs text-slate-400">
            Split <span className="font-medium text-slate-200">{asset.componentType}</span> ({asset.bloodType}) into derived components.
            Select the target fractions:
          </p>

          <div className="space-y-2">
            {COMPONENTS.map((comp) => {
              const checked = selected.has(comp.id)
              return (
                <label
                  key={comp.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition ${
                    checked
                      ? `${comp.color} bg-slate-800/80`
                      : 'border-slate-700 text-slate-400 hover:border-slate-600 hover:bg-slate-800/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(comp.id)}
                    className="h-4 w-4 accent-cyan-500 rounded"
                  />
                  <span className="text-sm font-medium">{comp.label}</span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-800 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={selected.size === 0}
            className="rounded-lg bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Confirm Split ({selected.size})
          </button>
        </div>
      </div>
    </div>
  )
}
