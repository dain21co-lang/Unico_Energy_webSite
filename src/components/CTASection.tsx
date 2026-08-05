import { CONTACT_INFO } from "@/config/contact";
import Image from "next/image";

/**
 * CTASection
 * 히어로 다음에 배치 가능한 단독 CTA 섹션. 사이트 전체가 라이트 톤인 것과
 * 대비되는 유일한 다크 네이비 강조 섹션으로, navy-950/gold/silver 토큰만
 * 사용한다 (ink-* 스케일은 라이트 배경 전용이라 여기서는 쓰지 않음)
 */
export default function CTASection() {
  return (
    <section
      className="relative w-full overflow-hidden bg-navy-950 px-6 py-16 sm:py-20"
      aria-label="문의 및 제품 안내"
    >
      <Image
        src="/images/cta-ocean-aerial.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-navy-950/60" />

      <div className="relative z-10 mx-auto flex max-w-md flex-col items-center text-center">
        <p className="mb-3 text-sm font-medium tracking-wide text-gold-400">
          UNICO ENERGY GROUP
        </p>

        <h2 className="mb-4 text-2xl font-bold leading-snug text-silver-300 sm:text-3xl">
          실물 자산과 금융을 잇는
          <br />
          글로벌 파트너
        </h2>

        <p className="mb-4 break-keep text-base leading-relaxed text-silver-400">
          에너지·비철금속 트레이딩부터 전략적 투자까지,
          <br />
          유니코에너지그룹이 함께합니다
        </p>

        <p className="mb-10 break-keep text-sm leading-relaxed text-silver-400/80">
          <span className="text-gold-400">빙산의 일각</span> 아래, 보이지
          않는 실물자산 네트워크가 있습니다
        </p>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          {/* 주요 CTA: 문의하기 */}
          <a
            href={CONTACT_INFO.phoneHref}
            className="flex min-h-[44px] w-full items-center justify-center rounded-full bg-gold-500 px-8 py-3.5 text-base font-semibold text-navy-950 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-300 sm:w-auto"
          >
            문의하기
          </a>

          {/* 보조 CTA: 사업분야 보기 (별도 /products 라우트가 없어 페이지 내 앵커로 연결) */}
          <a
            href="#business"
            className="flex min-h-[44px] w-full items-center justify-center rounded-full border border-gold-500 px-8 py-3.5 text-base font-semibold text-silver-300 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-300 sm:w-auto"
          >
            사업분야 보기
          </a>
        </div>
      </div>
    </section>
  );
}
