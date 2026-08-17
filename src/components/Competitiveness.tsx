import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

const HUBS = [
  {
    no: "01",
    region: "아시아 본사",
    place: "대한민국 · 서울 무역센터",
    description: "글로벌 플랫폼을 관제하고 금융 구조화를 설계하는 컨트롤 타워. 평택항·울산항의 탱크 터미널과 물류",
  },
 {
    no: "02",
    region: "중동 · 아프리카 네트워크",
    place: "두바이 · 바레인 · 오만 · 콩고 · 잠비아",
    description: "메이저 제련소 및 정유사와의 직접 계약을 통해 알루미늄과 프리미엄 비철금속 공급망을 확보하는 자원",
  },
 {
    no: "03",
    region: "유럽 네트워크",
    place: "스위스 · 조지아 · 독일 · 영국",
    description: "국제 공인 인증 절차를 검토·추진하며 실물 자산의 가치를 글로벌 자본시장과 연계하는 신뢰 기반 거점",
  },
];

const PILLARS = [
  {
    title: "글로벌 공급망 경쟁력",
    description:
      "중간 유통 단계를 최소화한 직수입 다이렉트 라인과 다변화된 소싱 채널로 가격 경쟁력과 공급 안정성을 함께 추구합니다",
  },
  {
    title: "품질관리 시스템",
    description:
      "취급 원자재 전반에 걸쳐 글로벌 스탠다드에 부합하는 교차 검증 체계를 적용하여 신뢰할 수 있는 공급을 지향합니다",
  },
  {
    title: "AI · 디지털 공급망",
    description:
      "물류 데이터를 실시간으로 분석하는 디지털 관제 체계를 통해 공급망 변수에 선제적으로 대응합니다",
  },
  {
    title: "ESG 지속가능경영",
    description:
      "저탄소 에너지 전환과 윤리적 자원 조달, 투명한 지배구조를 경영의 기본 원칙으로 삼습니다",
  },
];

export function Competitiveness() {
  return (
    <section id="competitiveness" className="relative scroll-mt-20 bg-paper-soft py-28 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <SectionLabel
          index="04. COMPETITIVENESS"
          title="Three Hub Strategy"
          align="center"
        />
        <p className="mx-auto mt-6 max-w-2xl text-center leading-relaxed text-ink-300">
          아시아, 중동·아프리카, 유럽 세 거점이 유기적으로 연결되어 글로벌
          자원과 자본의 흐름을 조율합니다
        </p>

        <div className="mt-6 flex justify-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-black/15 px-6 py-3 text-sm font-medium text-ink-200 transition-colors hover:border-gold-400/60 hover:text-gold-600"
          >
            <span aria-hidden="true">↳</span> 파트너십 문의하기
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