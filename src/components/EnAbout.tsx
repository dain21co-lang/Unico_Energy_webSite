import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";
import Image from "next/image";

const FACTS = [
  { label: "Corporate Name", value: "UNICO ENERGY GROUP CO., LTD." },
  {
    label: "Headquarters",
    value: "30F, WTC Trade Tower, 511 Yeongdong-daero,\nGangnam-gu, Seoul, Republic of Korea",
  },
  {
    label: "Core Business",
    value: "Energy Trading · Strategic Raw Material Distribution\nAdvanced Materials Supply Chain · Global Logistics Infrastructure",
  },
  { label: "Global Network", value: "Asia · Middle East · Africa · Europe" },
];

const TRUST_STATS = [
  { value: "6", label: "Core Business Areas" },
  { value: "3", label: "Global Hubs" },
  { value: "2", label: "Strategic Port Terminals" },
  { value: "2024", label: "Founded" },
];

export function EnAbout() {
  return (
    <section id="about" className="relative scroll-mt-20 bg-paper py-28 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-navy-950 to-[#161e25] px-6 py-12 sm:px-12 sm:py-16">
          <p className="text-xs font-semibold tracking-[0.3em] text-gold-400">
            UNICO ENERGY GROUP
          </p>
          <h2 className="mt-4 text-2xl font-bold leading-snug text-silver-300 sm:text-3xl">
            A Global Partner Bridging Real Assets and Finance
          </h2>
          <p className="mt-5 max-w-2xl break-keep text-sm leading-relaxed text-silver-400 sm:text-base">
            Beneath the tip of the iceberg lies{" "}
            <span className="text-gold-400">Chairman Young-Chang Choi&apos;s 30+ years —</span>
            of experience and network built in the real asset market
          </p>

          <div className="mt-10 flex items-center gap-2 sm:mt-12 sm:gap-8">
            <div className="min-w-0 flex-1 text-center sm:text-right">
              <p className="text-3xl font-extrabold text-gradient-gold sm:text-4xl">
                30+ Yrs
              </p>
              <p className="mt-2 text-xs leading-relaxed text-silver-400 sm:text-sm">
                Chairman Young-Chang Choi
                <br />
                Real Asset Expertise
              </p>
            </div>

            <svg
              viewBox="0 0 100 24"
              className="h-4 w-10 flex-shrink-0 text-gold-500 sm:h-5 sm:w-24"
              fill="none"
              aria-hidden="true"
            >
              <line x1="2" y1="12" x2="88" y2="12" stroke="currentColor" strokeWidth="2" />
              <path
                d="M80 4 L94 12 L80 20"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <p className="text-3xl font-extrabold text-gradient-gold sm:text-4xl">
                2024
              </p>
              <p className="mt-2 text-xs leading-relaxed text-silver-400 sm:text-sm">
                UNICO ENERGY GROUP
                <br />
                Founded
              </p>
            </div>
          </div>

          <p className="mt-8 text-center text-[11px] tracking-wide text-silver-500 sm:text-xs">
            A Corporation Built on Individual Expertise
          </p>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-8 border-b border-black/10 pb-16 sm:grid-cols-4">
          {TRUST_STATS.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd className="text-3xl font-extrabold text-gradient-gold sm:text-4xl">
                {stat.value}
              </dd>
              <p className="mt-2 text-sm font-semibold text-ink-100">
                {stat.label}
              </p>
            </div>
          ))}
        </dl>

        <div className="mt-16 grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <Reveal>
            <SectionLabel index="01. COMPANY" title="Company Overview" />
            <p className="mt-8 text-xl font-medium leading-relaxed text-ink-100">
              Bridging Borders, Connecting the Future
              <br />
              At the Center of an Energy Platform
            </p>
            <p className="mt-6 max-w-lg break-keep leading-loose text-ink-300">
              UNICO ENERGY GROUP CO., LTD. is headquartered at the WTC Trade
              Tower in Seoul, Republic of Korea, expanding its raw material
              supply chain through a global network of strategic hubs as a
              trading and energy platform company. Amid shifting global
              conditions, we proactively seize market entry opportunities to
              resolve imbalances between supply and demand, delivering
              differentiated value to partners worldwide.
            </p>

            <p className="mt-5 max-w-lg break-keep leading-loose text-ink-300">
              Moving beyond traditional intermediary trade in raw resources,
              we are preparing for market change through a business model
              that combines real assets with financial structuring.
            </p>

            <div className="mx-auto mt-16 aspect-[1080/1874] w-full max-w-md overflow-hidden rounded-2xl shadow-lg">
              <video
                className="h-full w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                poster="/videos/purpose-poster.jpg"
              >
                <source src="/videos/purpose-web.mp4" type="video/mp4" />
              </video>
            </div>

            <p className="mt-8 max-w-lg break-keep border-l-2 border-gold-500 py-1 pl-5 leading-loose text-ink-200">
              <span className="block font-semibold text-ink-100">
                Discovering hidden value, connecting it to the world
              </span>
              <span className="mt-2 block">
                Built on a global trading network spanning crude oil,
                non-ferrous metals, and rare resources, together with
                strategic investment capabilities, UNICO ENERGY GROUP
                connects the true value of real assets to financial markets.
              </span>
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <dl className="relative grid gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 sm:grid-cols-2">
              <div className="absolute inset-0 -z-0">
                <Image
                  src="/images/unico-global-network.jpg"
                  alt="Global Network"
                  fill
                  className="object-cover opacity-99"
                />
              </div>
              {FACTS.map((fact) => (
                <div
                  key={fact.label}
                  className="relative overflow-hidden bg-paper-soft/1 p-7"
                >
                  <div className="relative z-10">
                    <dt className="text-sm sm:text-base font-bold tracking-[0.2em] text-gold-300 [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">
                      {fact.label}
                    </dt>
                    <dd className="mt-3 whitespace-pre-line text-base sm:text-lg font-semibold leading-relaxed text-white [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">
                      {fact.value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}