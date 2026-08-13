import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

const STRATEGIES = [
  {
    no: "5.1",
    title: "Eco-Friendly Energy Business",
    subtitle: "Eco-Friendly Energy Business",
    description:
      "We are expanding infrastructure for eco-friendly commercial mobility such as electric buses, gradually increasing the share of low-carbon transition energy trading including LPG and biofuels.",
  },
  {
    no: "5.2",
    title: "Future Strategic Materials",
    subtitle: "Future Strategic Materials",
    description:
      "We are reviewing supply chain partnerships in high-purity copper materials, where demand is growing in the AI semiconductor and robotics industries, and pursuing expanded capacity to supply advanced industrial materials.",
  },
  {
    no: "5.3",
    title: "Global Investment & Partnerships",
    subtitle: "Global Investment & Partnerships",
    description:
      "We are designing efficient financial cooperation structures with quality partner companies, aiming to progressively expand strategic alliances across borders.",
  },
];

export function EnGrowthStrategy() {
  return (
    <section id="growth" className="relative scroll-mt-20 bg-paper py-28 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal>
            <SectionLabel index="05. GROWTH STRATEGY" title="Future Growth Strategy" />
            <p className="mt-8 max-w-md leading-loose text-ink-300">
              Built on a stable real-asset business foundation, UNICO ENERGY
              GROUP is progressively expanding its business portfolio into
              eco-friendly energy and advanced strategic materials.
            </p>
          </Reveal>

          <div className="space-y-6">
            {STRATEGIES.map((s, i) => (
              <Reveal key={s.no} delay={i * 0.1}>
                <div className="flex gap-6 rounded-2xl border border-black/10 bg-paper-soft p-7">
                  <span className="shrink-0 text-2xl font-extrabold text-gradient-gold">
                    {s.no}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-ink-100">
                      {s.title}
                    </h3>
                    <p className="mt-0.5 text-xs tracking-wide text-ink-400">
                      {s.subtitle}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-ink-300">
                      {s.description}
                    </p>
                  </div>
                </div>

                {s.no === "5.2" && (
                  <div className="mx-auto mt-6 aspect-[2160/3840] w-full max-w-md overflow-hidden rounded-2xl shadow-lg">
                    <video
                      className="h-full w-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    >
                      <source src="/videos/future-materials-web.mp4" type="video/mp4" />
                    </video>
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-16 aspect-[2160/3840] w-full max-w-md overflow-hidden rounded-2xl shadow-lg">
          <video
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/videos/closing-web.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}