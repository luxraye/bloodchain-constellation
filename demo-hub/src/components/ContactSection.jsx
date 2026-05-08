import { useState } from 'react'
import { SITE } from '../content/site'
import ContactFormModal from './ContactFormModal'

const CONTACT_ACTIONS = [
  {
    key: 'general',
    label: 'General enquiry',
    primary: true,
  },
  {
    key: 'partnership',
    label: 'Partnership / pilot',
    primary: false,
  },
  {
    key: 'media',
    label: 'Media / demo request',
    primary: false,
  },
]

export default function ContactSection() {
  const [activeForm, setActiveForm] = useState(null) // null | 'general' | 'partnership' | 'media'

  return (
    <>
      <section id="contact" className="relative border-t border-white/6 py-20">
        {/* Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-1/2 -z-10 h-96 w-96 -translate-y-1/2 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(225,29,72,0.4) 0%, transparent 70%)' }}
        />

        <div className="mx-auto max-w-3xl px-6">
          <p className="mb-2 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-500">
            Get in touch
          </p>
          <h3 className="mb-4 text-center text-3xl font-extrabold tracking-tight text-white">
            Ready to see it live?
          </h3>
          <p className="mx-auto mb-10 max-w-md text-center text-sm leading-relaxed text-slate-400">
            We work directly with health ministries, hospitals, and NGOs. Reach out to{' '}
            <span className="font-semibold text-slate-200">{SITE.contactName}</span> to arrange a guided
            walkthrough or discuss a pilot.
          </p>

          {/* Contact card */}
          <div className="mb-8 overflow-hidden rounded-2xl border border-white/8 bg-slate-900/60 backdrop-blur-sm">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
            <div className="flex flex-col items-center gap-3 p-6 sm:flex-row sm:justify-center">
              <a
                href={`mailto:${SITE.contactEmail}`}
                className="inline-flex items-center gap-2 font-mono text-sm text-slate-300 transition hover:text-white"
              >
                <svg className="h-4 w-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                {SITE.contactEmail}
              </a>
              <span className="hidden text-white/20 sm:inline">·</span>
              <a
                href={`tel:${SITE.contactPhoneTel}`}
                className="inline-flex items-center gap-2 font-mono text-sm text-slate-300 transition hover:text-white"
              >
                <svg className="h-4 w-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                {SITE.contactPhoneDisplay}
              </a>
            </div>
          </div>

          {/* CTA buttons — open modal */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            {CONTACT_ACTIONS.map(({ key, label, primary }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveForm(key)}
                className={
                  primary
                    ? 'inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-rose-900/40 transition hover:bg-rose-500'
                    : 'inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/10'
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <ContactFormModal
        isOpen={activeForm !== null}
        onClose={() => setActiveForm(null)}
        inquiryType={activeForm ?? 'general'}
      />
    </>
  )
}
