import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

const HUBS = [
  {
    no: "01",
    region: "Asia Headquarters",
    place: "Seoul WTC, Republic of Korea",
    description:
      "The control tower that oversees the global platform and designs financial structuring. Tank terminal and logistics infrastructure at Pyeongtaek and Ulsan ports.",
  },
  {
    no: "02",
    region: "Middle East & Africa Network",
    place: "Dubai, Bahrain, Oman, Congo, Zambia",
    description:
      "A resource hub securing aluminum and premium non-ferrous metal supply chains through direct contracts with major smelters and refiners.",
  },
  {
    no: "03",
    region: "European Network",
    place: "Switzerland, Georgia, Germany, UK",
    description:
      "A trusted base reviewing and advancing international certification procedures, linking the value of real assets to global capital markets.",
  },
];

const PILLARS = [
  {
    title: "Global Supply Chain Competitiveness",
    description:
      "We pursue both price competitiveness and supply stability through direct import lines that minimize intermediary steps and diversified sourcing channels.",
  },
  {
    title: "Quality Management System",
    description:
      "We aim for reliable supply by applying cross-verification systems that meet global standards across all raw materials handled.",
  },
  {
    title: "AI & Digital Supply Chain",
    description:
      "We proactively respond to supply chain variables through a digital control system that analyzes logistics data in real time.",
  },
  {
    title: "ESG Sustainable Management",
    description:
      "We uphold the transition to low-carbon energy, ethical resource sourcing, and transparent governance as core management principles.",
  },
];

export function EnCompetitiveness() {
  return (
    <section id="competitiveness" className="relative scroll-mt-20 bg-paper-soft py-28 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <SectionLabel
          index="04. COMPETITIVENESS"
          title="Three Hub Strategy"
          align="center"
        />

        <p className="mx-auto mt-6 max-w-2xl text-center leading-relaxed text-ink-300">
          Three hubs across Asia, the Middle East & Africa, and Europe are
          organically connected, coordinating the flow of resources and
          capital worldwide.
        </p>

        <div className="mt-6 flex justify-center">
          
            <a href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-black/15 px-6 py-3 text-sm font-medium text-ink-200 transition-colors hover:border-gold-400/60 hover:text-gold-600"
          >
            <span aria-hidden="true">{"\u21b3"}</span> Contact Us for Partnership
          </a>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {HUBS.map((hub, i) => (
            <Reveal key={hub.no} delay={i * 0.12}>
              <div className="h-full rounded-2xl border border-black/10 bg-paper p-8 shadow-sm">
                <p className="text-3xl font-extrabold text-gradient-gold">
                  {hub.no}
                </p>
                <h3 className="mt-4 text-lg font-bold text-ink-100">
                  {hub.region}
                </h3>
                <p className="mt-1 text-xs tracking-wide text-ink-400">
                  {hub.place}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-ink-300">
                  {hub.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 0.08}>
              <div className="h-full bg-paper p-7">
                <h4 className="text-sm font-bold text-gold-600">
                  {pillar.title}
                </h4>
                <p className="mt-3 text-sm leading-relaxed text-ink-300">
                  {pillar.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mx-auto mt-16 aspect-[2160/3840] w-full max-w-md overflow-hidden rounded-2xl shadow-lg">
          <video
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/videos/hub-unico-web.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}