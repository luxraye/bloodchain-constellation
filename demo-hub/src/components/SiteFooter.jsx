import { SITE } from '../content/site'

export default function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-sky-100 bg-white py-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 gap-y-8 md:flex-row md:items-start">
          <div className="flex items-center gap-3">
            <img
              src="/branding/logo.png"
              alt="Bloodchain"
              width={44}
              height={44}
              className="h-11 w-11 rounded-xl object-contain"
            />
            <div>
              <p className="text-sm font-bold text-slate-900">{SITE.organization}</p>
              <p className="text-[11px] text-slate-500">{SITE.incubationLine}</p>
            </div>
          </div>
          <div className="text-center text-xs text-slate-500 md:text-right">
            <p className="mb-2">
              © {year} {SITE.organization}. All rights reserved.
            </p>
            <p className="mb-2 max-w-md leading-relaxed text-slate-600">
              Prototype software for demonstration. Not a medical device. Not a substitute for national policy or
              licensed clinical systems.
            </p>
            <p className="mb-2 text-slate-600">
              Contact: {SITE.contactName} ·{' '}
              <a
                href={`mailto:${SITE.contactEmail}`}
                className="text-sky-700 underline decoration-sky-200 underline-offset-2 hover:text-sky-900"
              >
                {SITE.contactEmail}
              </a>
              {' · '}
              <a
                href={`tel:${SITE.contactPhoneTel}`}
                className="text-sky-700 underline decoration-sky-200 underline-offset-2 hover:text-sky-900"
              >
                {SITE.contactPhoneDisplay}
              </a>
            </p>
            {SITE.repoUrl ? (
              <a
                href={SITE.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sky-700 underline decoration-sky-200 underline-offset-2 hover:text-sky-900"
              >
                Source repository
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  )
}
