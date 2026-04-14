export default function AboutSection() {
  return (
    <section id="about" className="border-y border-sky-100/90 bg-white/60 py-16 backdrop-blur-sm">
      <div className="mx-auto max-w-3xl px-6">
        <h3 className="mb-6 text-center text-xs font-bold uppercase tracking-[0.2em] text-sky-600">
          What is Bloodchain?
        </h3>
        <p className="mb-4 text-center text-lg font-semibold text-slate-900">Trust through visibility</p>
        <div className="space-y-4 text-sm leading-relaxed text-slate-600">
          <p>
            Bloodchain is a <strong className="text-slate-800">software prototype</strong> that shows how a national
            blood ecosystem could record and surface key steps—who handled a unit, when it moved, and how facilities
            coordinate—without replacing clinical judgment or statutory policy.
          </p>
          <p>
            The <strong className="text-slate-800">constellation</strong> of apps below mirrors real roles: public
            donors, field collection, laboratory, logistics, and administration. Together they tell one story of a unit
            of blood across its lifecycle.
          </p>
          <p>
            The goal is to <strong className="text-slate-800">demonstrate</strong> architecture, security-minded design,
            and user experience for stakeholders—governments, hospitals, NGOs, and funders—before any production
            deployment.
          </p>
        </div>
      </div>
    </section>
  )
}
