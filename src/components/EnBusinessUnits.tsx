import Image from "next/image";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

const UNITS = [
  {
    tag: "3.1",
    title: "Energy Trading",
    subtitle: "Energy Trading",
    image: "/images/biz-energy.jpg",
    video: "/videos/oildrum.mp4",
    description:
      "We focus on securing stable energy resources through direct import lines of crude oil, gas, and refined products. We coordinate supply and demand timing by leveraging tank terminal infrastructure at major domestic trade ports.",
  },
  {
    tag: "3.2",
    title: "Aluminum & Copper Cathode",
    subtitle: "Aluminum & Copper Cathode",
    image: "/images/unico-aluminum-copper.jpg",
    video: "/videos/aluminum-copper.mp4",
    description:
      "Through a smelter network across the Middle East and Africa, we supply high-purity aluminum ingots (A7) and premium Copper Cathode (Grade A) to domestic and international manufacturers.",
  },
  {
    tag: "3.3",
    title: "Rare Earth & Advanced Materials",
    subtitle: "Rare Earth & Advanced Materials",
    video: "/videos/copper-materials.mp4",
    image: "/images/biz-copper.jpg",
    description:
      "We are pursuing a stable supply chain for ultra-high-purity Copper Powder and rare earth and advanced materials, securing future growth engines through global partnerships.",
  },
  {
    tag: "3.4",
    title: "Marine & Logistics Infrastructure",
    subtitle: "Marine & Logistics Infrastructure",
    image: "/oil-tanker.jpg",
    video: "/videos/oil-ship-storm.mp4",
    description:
      "Through long-term charter agreements with specialized shipping companies and AI-based logistics control, we are enhancing efficiency and stability across the entire maritime and land transport chain.",
  },
  {
    tag: "3.5",
    title: "LPG Storage & Terminal Business",
    subtitle: "LPG Storage & Terminal Business",
    image: "/images/biz-terminal.jpg",
    video: "/videos/lpg_terminal.mp4",
    description:
      "Based on large-scale LPG storage terminal infrastructure at Pyeongtaek and Ulsan ports, we provide customized VMI (Vendor Managed Inventory) solutions for our clients.",
  },
  {
    tag: "3.6",
    title: "Rare & Precious Resources",
    subtitle: "Rare & Precious Resources",
    video: "/videos/preciousmetals.mp4",
    image: "/images/rare-resource-emerald.jpg",
    description:
      "We are exploring the development of a sourcing network for rare gemstones and resources such as emeralds, diversifying our business by adding a premium rare resources segment to our existing raw material portfolio.",
  },
];

export function EnBusinessUnits() {
  return (
    <section id="business" className="relative scroll-mt-20 bg-paper py-28 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <SectionLabel index="03. BUSINESS UNITS" title="Core Business Areas" align="center" />

        <div className="mt-6 flex justify-center">
          
            <a href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-black/15 px-6 py-3 text-sm font-medium text-ink-200 transition-colors hover:border-gold-400/60 hover:text-gold-600"
          >
            <span aria-hidden="true">↳</span> Contact Us for Partnership
          </a>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {UNITS.map((unit, i) => (
            <Reveal key={unit.title} delay={(i % 3) * 0.1}>
              <article className="group h-full overflow-hidden rounded-2xl border border-black/10 bg-paper-soft shadow-sm transition-colors hover:border-gold-500/50 hover:shadow-md">
                <div className="relative aspect-[9/16] overflow-hidden bg-navy-950">
                  {unit.video ? (
                    <video
                      src={unit.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 h-full w-full bg-navy-950 object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <Image
                      src={unit.image}
                      alt={unit.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/10 to-transparent" />
                  <p className="absolute left-5 top-4 text-xs font-semibold tracking-[0.25em] text-gold-300">
                    {unit.tag}
                  </p>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-ink-100">
                    {unit.title}
                  </h3>
                  <p className="mt-0.5 text-xs tracking-wide text-gold-400">
                    {unit.subtitle}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-ink-300">
                    {unit.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}