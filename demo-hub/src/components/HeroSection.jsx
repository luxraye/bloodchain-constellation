import { SITE } from '../content/site'

export default function HeroSection({ onExploreClick }) {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-10 pt-10 text-center md:pb-14 md:pt-14">
      <div className="mb-8 flex justify-center">
        <img
          src="/branding/logo.png"
          alt="Bloodchain"
          width={320}
          height={320}
          className="h-28 w-auto max-w-[min(100%,280px)] rounded-2xl object-contain md:h-32"
        />
      </div>
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-100/80 px-4 py-1.5 text-xs font-semibold text-sky-800">
        Prototype · {SITE.organization}
      </div>
      <h2 className="mb-4 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 md:text-5xl">
        {SITE.projectTitle}
      </h2>
      <p className="mx-auto mb-2 max-w-2xl text-lg font-medium text-slate-700">{SITE.projectSubtitle}</p>
      <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-slate-600">
        A connected set of applications for transparency and accountability across donation, collection, laboratory
        processing, logistics, and oversight—demonstrating how digital tools can support a safer blood supply
        ecosystem.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onExploreClick}
          className="rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-sky-200/80 transition hover:from-sky-500 hover:to-blue-500"
        >
          Explore the constellation
        </button>
        <a
          href="#contact"
          className="rounded-xl border border-sky-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-sky-300 hover:bg-sky-50"
        >
          Contact &amp; collaboration
        </a>
      </div>
    </section>
  )
}
