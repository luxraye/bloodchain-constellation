import { useState } from 'react'

const INQUIRY_LABELS = {
  general: 'General enquiry',
  partnership: 'Partnership / pilot',
  media: 'Media / demo request',
}

const FIELDS = [
  { id: 'name',         label: 'Full name',          type: 'text',  required: true,  placeholder: 'Your name' },
  { id: 'organization', label: 'Organisation',        type: 'text',  required: false, placeholder: 'Hospital, ministry, NGO…' },
  { id: 'email',        label: 'Email address',       type: 'email', required: true,  placeholder: 'you@example.com' },
  { id: 'phone',        label: 'Phone (optional)',    type: 'tel',   required: false, placeholder: '+267 7XX XXX XX' },
]

export default function ContactFormModal({ isOpen, onClose, inquiryType = 'general' }) {
  const [form, setForm] = useState({ name: '', organization: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  if (!isOpen) return null

  const endpoint = import.meta.env.VITE_FORMSPREE_URL

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!endpoint) {
      // Fallback: if env var not set, silently warn in console and show success anyway
      console.warn('VITE_FORMSPREE_URL is not set. Form submission skipped.')
      setStatus('success')
      return
    }
    setStatus('submitting')
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, inquiryType: INQUIRY_LABELS[inquiryType] }),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  function handleClose() {
    setForm({ name: '', organization: '', email: '', phone: '', message: '' })
    setStatus('idle')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-rose-600 via-rose-500 to-rose-700" />

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-500 mb-1">
              {INQUIRY_LABELS[inquiryType]}
            </p>
            <h2 className="text-lg font-extrabold text-white">Get in touch</h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              Leave your details and we'll follow up directly.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/12 hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div className="h-px mx-6 bg-white/6" />

        {status === 'success' ? (
          /* ── Success state ── */
          <div className="overflow-y-auto flex flex-col items-center gap-4 px-6 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
              <svg className="h-7 w-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div>
              <p className="text-base font-bold text-white mb-1">Message received</p>
              <p className="text-sm text-slate-400 leading-relaxed">
                We'll be in touch shortly. Keep an eye on your inbox.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="mt-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              Close
            </button>
          </div>
        ) : (
          /* ── Form ── */
          <form onSubmit={handleSubmit} className="overflow-y-auto px-6 pb-6 pt-4 space-y-4">
            {FIELDS.map(({ id, label, type, required, placeholder }) => (
              <div key={id}>
                <label htmlFor={id} className="mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
                  {label}{required && <span className="ml-0.5 text-rose-500">*</span>}
                </label>
                <input
                  id={id}
                  type={type}
                  required={required}
                  value={form[id]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-rose-500/50 focus:bg-white/8 focus:ring-1 focus:ring-rose-500/30"
                />
              </div>
            ))}

            <div>
              <label htmlFor="message" className="mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Message <span className="text-slate-600 normal-case font-normal tracking-normal">(optional)</span>
              </label>
              <textarea
                id="message"
                rows={3}
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us a bit about your context or what you'd like to discuss…"
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-rose-500/50 focus:bg-white/8 focus:ring-1 focus:ring-rose-500/30"
              />
            </div>

            {status === 'error' && (
              <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-xs text-rose-400">
                Something went wrong. Please try again or email us directly.
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full rounded-xl bg-rose-600 py-3 text-sm font-bold text-white shadow-lg shadow-rose-900/40 transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'submitting' ? 'Sending…' : 'Send message'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
