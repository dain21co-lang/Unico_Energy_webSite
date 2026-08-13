import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";
import Image from "next/image";
const FACTS = [
  { label: "법인명", value: "(주)유니코에너지그룹\nUNICO ENERGY GROUP CO., LTD." },
  { label: "본사", value: "서울특별시 강남구 영동대로 511\n무역센터(WTC Trade Tower) 30층" },
  {
    label: "핵심 사업",
    value: "에너지 트레이딩 · 전략 원자재 유통\n첨단 신소재 공급망 · 글로벌 물류 인프라",
  },
  { label: "글로벌 네트워크", value: "아시아 · 중동 · 아프리카 · 유럽 거점" },
];

const TRUST_STATS = [
  { value: "6", label: "핵심 사업 분야" },
  { value: "3", label: "글로벌 거점" },
  { value: "2", label: "전략 항만 터미널" },
  { value: "2024", label: "년 설립" },
];

export function About() {
  return (
    <section id="about" className="relative scroll-mt-20 bg-paper py-28 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-navy-950 to-[#161e25] px-6 py-12 sm:px-12 sm:py-16">
          <p className="text-xs font-semibold tracking-[0.3em] text-gold-400">
            UNICO ENERGY GROUP
          </p>
          <h2 className="mt-4 text-2xl font-bold leading-snug text-silver-300 sm:text-3xl">
            실물 자산과 금융을 잇는 글로벌 파트너
          </h2>
          <p className="mt-5 max-w-2xl break-keep text-sm leading-relaxed text-silver-400 sm:text-base">
           빙산의 일각 아래에는,{" "}
<span className="text-gold-400">최영창회장이 지난 30+년 —</span>
실물자산 시장에서 쌓아온 경험과 네트워크가 있습니다
          </p>

          <div className="mt-10 flex items-center gap-2 sm:mt-12 sm:gap-8">
            <div className="min-w-0 flex-1 text-center sm:text-right">
              <p className="text-3xl font-extrabold text-gradient-gold sm:text-4xl">
                30+ 년
              </p>
              <p className="mt-2 text-xs leading-relaxed text-silver-400 sm:text-sm">
                최영창 회장
                <br />
                실물자산 경력
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
                법인 설립
              </p>
            </div>
          </div>

          <p className="mt-8 text-center text-[11px] tracking-wide text-silver-500 sm:text-xs">
            개인의 경력 위에 세워진 법인
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
            <SectionLabel index="01. COMPANY" title="기업 개요" />
            <p className="mt-8 text-xl font-medium leading-relaxed text-ink-100">
              국경을 넘어 미래를 잇는
              <br />
              에너지 플랫폼의 중심
            </p>
            <p className="mt-6 max-w-lg break-keep leading-loose text-ink-300">
              (주)유니코에너지그룹은 대한민국 서울 무역센터에 본사를 두고,
              글로벌 거점 네트워크를 통해 원자재 공급망을 확장해 나가는
              트레이딩에너지 플랫폼 기업입니다. 격변하는 국제 정세 속에서
              시장 진입 기회를 선제적으로 포착하여, 공급과 수요의 불균형을
              해소하고 전 세계 파트너들에게 차별화된 가치를 제공하고자
              합니다
            </p>
            <p className="mt-5 max-w-lg break-keep leading-loose text-ink-300">
              단순히 자원을 사고파는 전통적 중개무역을 넘어, 실물 자산과
              금융 구조화를 결합한 비즈니스 모델로 시장의 변화를 준비하고
              있습니다
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
                숨겨진 가치를 발견하고, 세상에 연결합니다
              </span>
              <span className="mt-2 block">
                유니코에너지그룹은 원유, 비철금속, 희소자원을 아우르는
                글로벌 트레이딩 네트워크와 전략적 투자 역량을 바탕으로,
                실물 자산이 가진 진짜 가치를 금융 시장과 연결합니다
              </span>
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <dl className="relative grid gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 sm:grid-cols-2">
  <div className="absolute inset-0 -z-0">
    <Image
      src="/images/unico-global-network.jpg"
      alt="글로벌 네트워크"
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