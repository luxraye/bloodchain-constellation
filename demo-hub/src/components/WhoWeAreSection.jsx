import { SITE } from '../content/site'

export default function WhoWeAreSection() {
  return (
    <section id="who-we-are" className="py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-8 flex justify-center">
          <img
            src="/branding/logo.png"
            alt=""
            width={80}
            height={80}
            className="h-16 w-auto rounded-xl object-contain opacity-90"
          />
        </div>
        <h3 className="mb-6 text-center text-xs font-bold uppercase tracking-[0.2em] text-sky-600">Who we are</h3>
        <div className="rounded-2xl border border-sky-100 bg-white p-8 text-center shadow-sm">
          <p className="mb-2 text-xl font-bold text-slate-900">{SITE.organization}</p>
          <p className="mb-6 text-sm font-medium text-slate-600">{SITE.incubationLine}</p>
          <p className="text-sm leading-relaxed text-slate-500">{SITE.prototypeNote}</p>
        </div>
      </div>
    </section>
  )
}
