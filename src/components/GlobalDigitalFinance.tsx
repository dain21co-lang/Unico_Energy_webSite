"use client";

import React from "react";

const NAVY = "#0A1628";
const GOLD = "#C9A84C";

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
  { label: "Energy &\nOil Trading", active: false },
  { label: "Non-Ferrous\nMetals", active: false },
  { label: "Raw\nMaterials", active: false },
  { label: "Global\nLogistics", active: false },
  { label: "Digital Asset &\nGlobal Finance", active: true },
];

export default function GlobalDigitalFinance() {
  return (
    <section
      id="global-digital-finance"
      className="relative w-full bg-white py-20 md:py-28"
    >
      {/* top gold accent bar */}
      <div className="absolute top-0 left-0 h-1.5 w-full" style={{ backgroundColor: GOLD }} />

      <div className="mx-auto max-w-6xl px-6">
        {/* header */}
        <p className="text-xs md:text-sm tracking-widest text-gray-500 mb-2">
          2-05. GLOBAL SUPPLY CHAIN
        </p>
        <h2
          className="text-3xl md:text-5xl font-bold mb-4"
          style={{ color: NAVY }}
        >
          Digital Asset &amp; Global Finance
        </h2>
        <p className="text-sm md:text-base text-gray-500 italic mb-10">
          디지털자산 · 글로벌 파이낸스 — 실물자산과 글로벌 자본을 연결하는 새로운 확장 영역
        </p>

        <hr className="border-gray-200 mb-10" />

        {/* lead paragraph */}
        <div
          className="rounded-xl px-8 py-7 md:px-12 md:py-8 mb-16"
          style={{ backgroundColor: NAVY }}
        >
          <p className="text-white text-sm md:text-base leading-relaxed text-center">
            유니코에너지그룹은 에너지·원자재·인프라 사업을 통해 축적한 글로벌 네트워크를
            기반으로, 기관 투자자 중심의 디지털자산 장외거래(OTC) 및 실물자산 유동화(RWA)
            분야로 사업 영역을 전략적으로 검토·확장하고 있습니다. 중동·아시아 금융
            허브와의 연계를 통해 실물자산과 디지털 자본시장을 잇는 글로벌 결제·파이낸싱
            플랫폼 구축을 중장기 방향으로 하고 있습니다.
          </p>
        </div>

        {/* core areas */}
        <h3 className="text-lg md:text-xl font-bold mb-6" style={{ color: NAVY }}>
          핵심 추진 영역
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {coreAreas.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border bg-[#F3F2F1] px-6 py-7 hover:shadow-md transition-shadow"
              style={{ borderColor: GOLD }}
            >
              <h4
                className="text-lg md:text-xl font-serif font-bold text-center mb-3"
                style={{ color: NAVY }}
              >
                {item.title}
              </h4>
              <div
                className="h-[3px] w-10 mx-auto mb-4"
                style={{ backgroundColor: GOLD }}
              />
              <p
                className="text-sm font-semibold text-center whitespace-pre-line mb-2"
                style={{ color: NAVY }}
              >
                {item.kr}
              </p>
              <p className="text-xs text-gray-500 text-center whitespace-pre-line">
                {item.en}
              </p>
            </div>
          ))}
        </div>

        {/* hierarchy position */}
        <h3 className="text-lg md:text-xl font-bold mb-6" style={{ color: NAVY }}>
          GLOBAL SUPPLY CHAIN 내 위치
        </h3>
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div
            className="rounded-lg px-5 py-4 text-center shrink-0"
            style={{ backgroundColor: NAVY }}
          >
            <span className="text-sm md:text-base font-bold" style={{ color: GOLD }}>
              GLOBAL
              <br />
              SUPPLY CHAIN
            </span>
          </div>

          <span className="text-xl shrink-0" style={{ color: GOLD }}>
            &#8250;
          </span>

          <div className="flex flex-wrap gap-3">
            {chainSteps.map((step) => (
              <div
                key={step.label}
                className="rounded-lg px-4 py-4 text-center border whitespace-pre-line text-xs md:text-sm font-semibold min-w-[130px]"
                style={
                  step.active
                    ? { backgroundColor: NAVY, borderColor: GOLD, borderWidth: 2, color: GOLD }
                    : { backgroundColor: "#FFFFFF", borderColor: "#D1D3D4", color: NAVY }
                }
              >
                {step.label}
              </div>
            ))}
          </div>
        </div>

        {/* disclaimer */}
        <p className="text-xs text-gray-400 italic">
          ※ 본 사업 영역은 전략적 검토 및 추진 단계에 있으며, 관련 라이선스·법인 설립
          등은 해당 국가의 규제 절차에 따라 순차적으로 진행됩니다.
        </p>
      </div>
    </section>
  );
}