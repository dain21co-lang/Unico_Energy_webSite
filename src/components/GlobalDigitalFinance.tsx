import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

const coreAreas = [
  {
    title: "Institutional OTC",
    kr: "법인·기관 대상 디지털자산\n장외거래 네트워크 검토",
    en: "Institutional-grade digital asset\nOTC network under strategic review",
  },
  {
    title: "RWA Financing",
    kr: "실물자산의 토큰화 및\n글로벌 자본 조달 구조 설계",
    en: "Structuring real-world asset\ntokenization for global capital access",
  },
  {
    title: "Global Settlement",
    kr: "아시아·중동 간 글로벌\n결제·금융 인프라 확장",
    en: "Expanding global settlement\ninfrastructure across Asia and the Middle East",
  },
];

const chainSteps = [
  "Energy &\nOil Trading",
  "Non-Ferrous\nMetals",
  "Raw\nMaterials",
  "Global\nLogistics",
];

export default function GlobalDigitalFinance() {
  return (
    <section
      id="global-digital-finance"
      className="relative scroll-mt-20 bg-paper-soft py-28 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <SectionLabel
          index="03-1. GLOBAL SUPPLY CHAIN"
          title="디지털자산 · 글로벌 파이낸스"
        />
        <p className="mt-4 text-xs font-semibold tracking-[0.2em] text-gold-600">
          DIGITAL ASSET &amp; GLOBAL FINANCE
        </p>
        <p className="mt-5 max-w-2xl break-keep leading-loose text-ink-300">
          실물자산과 글로벌 자본을 연결하는 새로운 확장 영역입니다
        </p>

        <Reveal>
          <div className="mt-10 overflow-hidden rounded-2xl bg-gradient-to-br from-navy-950 to-[#161e25] px-6 py-10 sm:px-12">
            <p className="break-keep text-sm leading-loose text-silver-300 sm:text-base">
              유니코에너지그룹은 에너지·원자재·인프라 사업을 통해 축적한 글로벌
              네트워크를 기반으로, 기관 투자자 중심의 디지털자산 장외거래(OTC)
              및 실물자산 유동화(RWA) 분야로 사업 영역을 전략적으로 검토하고
              있습니다. 중동·아시아 금융 허브와의 연계를 통해 실물자산과 디지털
              자본시장을 잇는 글로벌 결제·파이낸싱 플랫폼 구축을 중장기 방향으로
              하고 있습니다
            </p>
          </div>
        </Reveal>

        <h3 className="mt-16 text-lg font-bold text-ink-100">핵심 검토 영역</h3>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {coreAreas.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1}>
              <div className="h-full rounded-2xl border border-black/10 bg-paper p-7 shadow-sm">
                <h4 className="text-lg font-bold text-ink-100">{item.title}</h4>
                <div className="mt-3 h-px w-10 divider-gold" />
                <p className="mt-4 whitespace-pre-line break-keep text-sm font-semibold leading-relaxed text-ink-200">
                  {item.kr}
                </p>
                <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-ink-400">
                  {item.en}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <h3 className="mt-16 text-lg font-bold text-ink-100">
          GLOBAL SUPPLY CHAIN 내 위치
        </h3>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {chainSteps.map((label) => (
            <div
              key={label}
              className="flex items-center justify-center whitespace-pre-line rounded-xl border border-black/10 bg-paper px-3 py-4 text-center text-xs font-semibold leading-snug text-ink-200 sm:text-sm"
            >
              {label}
            </div>
          ))}
          <div className="col-span-2 flex items-center justify-center whitespace-pre-line rounded-xl border-2 border-gold-500 bg-navy-950 px-3 py-4 text-center text-xs font-bold leading-snug text-gold-400 sm:col-span-1 sm:text-sm">
            {"Digital Asset &\nGlobal Finance"}
          </div>
        </div>

        <p className="mt-8 break-keep text-xs leading-relaxed text-ink-400">
          ※ 본 사업 영역은 전략적 검토 및 추진 단계에 있으며, 관련 라이선스·법인
          설립 등은 해당 국가의 규제 절차에 따라 순차적으로 진행됩니다
        </p>
      </div>
    </section>
  );
}
