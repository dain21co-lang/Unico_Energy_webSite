import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

const PILLARS = [
  {
    letter: "E",
    title: "Environment",
    subtitle: "Environment",
    description:
      "We are expanding our share of low-carbon energy trading and reducing the carbon footprint of logistics through more efficient maritime transport.",
  },
  {
    letter: "S",
    title: "Social",
    subtitle: "Social",
    description:
      "We uphold ethical sourcing principles that exclude conflict minerals, pursuing shared growth with local communities and partner companies.",
  },
  {
    letter: "G",
    title: "Governance",
    subtitle: "Governance",
    description:
      "Through rigorous compliance systems and transparent disclosure, we pursue management trusted by all stakeholders.",
  },
];

export function EnESG() {
  return (
    <section id="esg" className="relative scroll-mt-20 bg-paper-soft py-28 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <SectionLabel index="06. ESG" title="Sustainable Management" align="center" />

        <div className="mt-6 flex justify-center">
          
           <a href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-black/15 px-6 py-3 text-sm font-medium text-ink-200 transition-colors hover:border-gold-400/60 hover:text-gold-500"
          >
            <span aria-hidden="true">↓</span> Learn More About Our ESG Policy
          </a>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal key={p.letter} delay={i * 0.12}>
              <div className="h-full rounded-2xl border border-black/10 bg-paper p-8 shadow-sm">
                <span className="text-5xl font-extrabold text-gradient-gold">
                  {p.letter}
                </span>
                <h3 className="mt-5 text-lg font-bold text-ink-100">
                  {p.title}
                </h3>
                <p className="mt-0.5 text-xs tracking-wide text-ink-400">
                  {p.subtitle}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-ink-300">
                  {p.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mx-auto mt-16 aspect-[1080/1920] w-full max-w-md overflow-hidden rounded-2xl shadow-lg">
          <div className="relative h-full w-full">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              poster="/videos/esg-poster.jpg"
            >
              <source src="/videos/esg-web.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent"/>
          </div>
        </div>
      </div>
    </section>
  );
}