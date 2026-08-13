import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

const STRATEGIES = [
  {
    no: "5.1",
    title: "친환경 에너지 사업",
    subtitle: "Eco-Friendly Energy Business",
    description:
      "전기 버스 등 친환경 상용 모빌리티 인프라 보급을 확대하고, LPG·바이오 연료 등 저탄소 전환 에너지 트레이딩 비중을 점진적으로 늘려가고 있습니다",
  },
  {
    no: "5.2",
    title: "미래 전략 원자재",
    subtitle: "Future Strategic Materials",
    description:
      "AI 반도체·로보틱스 산업에서 수요가 커지는 고순도 구리 소재 분야의 공급망 파트너십을 검토하며, 첨단 산업 소재 공급 역량 확장을 추진합니다",
  },
  {
    no: "5.3",
    title: "글로벌 투자 및 파트너십",
    subtitle: "Global Investment & Partnerships",
    description: "우량 파트너사와의 효율적 재무 협력구조를 설계하고, 국경을 넘는 전략적 제휴를 단계적으로 확대해 나가고자 합니다"
  },
];

export function GrowthStrategy() {
  return (
    <section id="growth" className="relative scroll-mt-20 bg-paper py-28 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal>
            <SectionLabel index="05. GROWTH STRATEGY" title="미래 성장 전략" />
            <p className="mt-8 max-w-md leading-loose text-ink-300">
              유니코에너지그룹은 안정적인 실물 자산 사업을 기반으로, 친환경
              에너지와 첨단 전략 원자재 영역으로 사업 포트폴리오를 단계적으로
              확장해 나가고자 합니다
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
                      <source
                        src="/videos/future-materials-web.mp4"
                        type="video/mp4"
                      />
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