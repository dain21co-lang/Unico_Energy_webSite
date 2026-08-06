import Image from "next/image";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

const UNITS = [
  {
    tag: "3.1",
    title: "에너지 트레이딩",
    subtitle: "Energy Trading",
    image: "/images/biz-energy.jpg",
    video: "/videos/oildrum.mp4",
    description:
      "원유·가스·정제유 직수입 라인을 기반으로 안정적인 에너지 자원 확보에 주력합니다. 국내 주요 무역항의 탱크 터미널 인프라를 활용해 수요와 공급의 시차를 조율합니다.",
  },
  {
    tag: "3.2",
    title: "알루미늄·전기동",
    subtitle: "Aluminum & Copper Cathode",
    image: "/images/unico-aluminum-copper.jpg",
    
    description:
      "중동·아프리카 제련소 네트워크를 통해 고순도 알루미늄 잉곳(A7)과 프리미엄 전기동(Copper Cathode, Grade A)을 국내외 제조 기업에 공급합니다.",
  },
  {
    tag: "3.3",
    title: "희토류·첨단소재",
    subtitle: "Rare Earth & Advanced Materials",
    image: "/images/biz-copper.jpg", // 구리분말 및 첨단 소재 관련 이미지
    description:
      "초고순도 구리 분말(Copper Powder) 및 희토류·첨단 소재의 안정적인 공급망 구축을 추진하며, 글로벌 파트너십을 통해 미래 성장 동력을 확보합니다.",
  },
  {
    tag: "3.4",
    title: "해양 · 물류 인프라",
    subtitle: "Marine & Logistics Infrastructure",
    image: "/images/oil-tanker.jpg",
    description:
      "전문 선사와의 장기 용선 계약과 AI 기반 물류 관제로 해상·육상 운송 전 구간의 효율성과 안정성을 높여 나갑니다.",
  },
  {
    tag: "3.5",
    title: "저장 · 터미널 사업",
    subtitle: "Storage & Terminal Business",
    image: "/images/biz-terminal.jpg",
    description:
      "평택항과 울산항의 대규모 저장 터미널 인프라를 기반으로 고객 맞춤형 VMI(Vendor Managed Inventory) 솔루션을 제공합니다.",
  },
  {
    tag: "3.6",
    title: "희소자원",
    subtitle: "Rare & Precious Resources",
    video: "/videos/preciousmetals.mp4",
    image: "/images/rare-resource-emerald.jpg",
    description:
      "에메랄드 등 희소 보석·자원의 소싱 네트워크 구축을 검토하고 있으며, 기존 원자재 포트폴리오에 프리미엄 희소자원 영역을 더해 사업 다각화를 추진하고 있습니다.",
  },
]
export function BusinessUnits() {
  return (
    <section id="business" className="relative scroll-mt-20 bg-paper py-28 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <SectionLabel index="03. BUSINESS UNITS" title="주요 사업 분야" align="center" />

        <div className="mt-6 flex justify-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-black/15 px-6 py-3 text-sm font-medium text-ink-200 transition-colors hover:border-gold-400/60 hover:text-gold-600"
          >
            <span aria-hidden="true">↳</span> 사업 제휴 문의하기
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
