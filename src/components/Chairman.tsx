import Image from "next/image";
import { SectionLabel } from "./SectionLabel";

export function Chairman() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy-950 to-[#161e25] py-28 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="grid items-start gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-lg">
            <Image
              src="/images/chairman-photo.png"
              alt="유니코에너지그룹 회장 최영창"
              fill
              sizes="(min-width: 1024px) 40vw, 80vw"
              className="object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent" />
          </div>

          <div>
            <SectionLabel index="02. CHAIRMAN'S MESSAGE" title="회장 인사말" />
            <div className="mt-6 h-px w-16 divider-gold" />

            <p className="mt-8 break-keep text-xl font-medium leading-snug text-silver-300 sm:text-2xl">
              새로운 시대를 향한 도전,
              <br />
              그리고 <span className="text-gold-400">더 큰 가치의 창조</span>
            </p>

            <div className="mt-8 space-y-5 break-keep leading-loose text-silver-400">
              <p>
                존경하는 고객 여러분, 그리고 소중한 파트너와 임직원 여러분
                유니코에너지그룹에 변함없는 신뢰와 협력을 보내주시는 모든
                분들께 깊은 감사의 말씀을 드립니다
              </p>
              <p>
                오늘날 세계 경제는 그 어느 때보다 빠르고 복잡하게 변화하고
                있습니다. 지정학적 갈등과 공급망 재편, 에너지 안보 강화,
                친환경 산업으로의 전환, 그리고 인공지능(AI)을 중심으로 한
                신기술 확산은 산업과 시장의 새로운 판도를 만들어가고
                있습니다
              </p>
              <p>
                유니코에너지그룹은 원자재 무역을 중심으로 안정적인 공급망을
                구축하고, UAE의 신흥 네트워크와 싱가포르의 글로벌 금융
                경험, 대한민국의 산업 역량을 결합해 국내 기업이 글로벌
                시장으로 진출할 수 있는 종합 플랫폼으로 성장해 나가고
                있습니다
              </p>
              <p>
                리스크 관리와 청렴 경영, 인재 육성을 바탕으로 신뢰받는
                기업으로서 여러분과 함께 성공을 이루어 나가겠습니다
                여러분의 건강과 행운, 그리고 무궁한 번영이 함께하시기를
                진심으로 기원합니다. 감사합니다
              </p>
            </div>

            <div className="mt-8 flex flex-nowrap items-center gap-2">
  <p className="text-base sm:text-lg font-medium tracking-wide text-silver-300 whitespace-nowrap">
    유니코에너지그룹 회장&nbsp;&nbsp;최 영 창
    <span className="ml-2 text-silver-500"></span>
  </p>

</div>
          </div>
        </div>
      </div>
    </section>
  );
}