import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

const PILLARS = [
  {
    letter: "E",
    title: "환경",
    subtitle: "Environment",
    description:
      "저탄소 에너지 트레이딩 비중을 확대하고, 해양 운송의 효율화를 통해 물류 과정의 탄소 발자국을 줄여 나갑니다.",
  },
  {
    letter: "S",
    title: "사회",
    subtitle: "Social",
    description:
      "분쟁 광물을 배제한 윤리적 자원 조달을 원칙으로 하며, 현지 지역사회 및 파트너사와의 상생을 추구합니다.",
  },
  {
    letter: "G",
    title: "지배구조",
    subtitle: "Governance",
    description:
      "철저한 컴플라이언스 체계와 투명한 정보 공개를 통해 이해관계자로부터 신뢰받는 경영을 지향합니다.",
  },
];

export function ESG() {
  return (
    <section id="esg" className="relative scroll-mt-20 bg-paper-soft py-28 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <SectionLabel index="06. ESG" title="지속가능경영" align="center" />

        <div className="mt-6 flex justify-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-black/15 px-6 py-3 text-sm font-medium text-ink-200 transition-colors hover:border-gold-400/60 hover:text-gold-600"
          >
            <span aria-hidden="true">↳</span> ESG 정책 더 알아보기
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
    <img
      src="/images/unico-ship-blueprint-v2.jpg"
      alt="유니코에너지그룹 선박 설계도"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
  </div></div>
</div>
    </section>
  );
}