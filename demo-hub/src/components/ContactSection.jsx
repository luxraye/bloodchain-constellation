import { mailtoCollaboration, mailtoGeneral, mailtoMediaDemo, SITE } from '../content/site'

export default function ContactSection() {
  return (
    <section id="contact" className="border-t border-sky-100 bg-sky-50/50 py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-6 flex justify-center">
          <img
            src="/branding/logo.png"
            alt=""
            width={72}
            height={72}
            className="h-14 w-auto rounded-xl object-contain"
          />
        </div>
        <h3 className="mb-2 text-center text-xs font-bold uppercase tracking-[0.2em] text-sky-600">Get in touch</h3>
        <p className="mb-2 text-center text-sm font-medium text-slate-800">{SITE.contactName}</p>
        <p className="mb-8 text-center text-sm text-slate-600">
          Email{' '}
          <a
            href={`mailto:${SITE.contactEmail}`}
            className="font-mono text-sky-700 underline-offset-2 hover:underline"
          >
            {SITE.contactEmail}
          </a>
          {' · '}
          <a href={`tel:${SITE.contactPhoneTel}`} className="font-mono text-sky-700 underline-offset-2 hover:underline">
            {SITE.contactPhoneDisplay}
          </a>
          . Buttons below open your mail app with a pre-filled subject.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          <a
            href={mailtoGeneral()}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 px-5 py-3 text-center text-sm font-bold text-white shadow-md transition hover:from-sky-500 hover:to-blue-500"
          >
            General contact
          </a>
          <a
            href={mailtoCollaboration()}
            className="inline-flex items-center justify-center rounded-xl border border-sky-200 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 shadow-sm transition hover:border-sky-300 hover:bg-sky-50"
          >
            Collaboration / partnership
          </a>
          <a
            href={mailtoMediaDemo()}
            className="inline-flex items-center justify-center rounded-xl border border-sky-200 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 shadow-sm transition hover:border-sky-300 hover:bg-sky-50"
          >
            Media / demo request
          </a>
        </div>
      </div>
    </section>
  )
}
