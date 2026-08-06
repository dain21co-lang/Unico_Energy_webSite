"use client";

import { useState } from "react";
import MetalCubeHero from "./MetalCubeHero.jsx";

// const GlassOrbs = dynamic(() => import("./GlassOrbs"), { ssr: false });
// const AlchemistSphere = dynamic(
//   () => import("./canvas/AlchemistSphere"),
//   { ssr: false },
// );

/**
 * Hero — POSCO Holdings 스타일 벤치마킹
 * 좌우 분할 대신 풀블리드 영상 위에 하단좌측 텍스트를 오버레이하고,
 * 영상 하나(빙산 → 원자재 → 원유)의 재생 진행률을 01/02/03 인디케이터에 매핑한다
 */

const PHASES = [
  { index: "01", label: "빙산의 일각" },
  { index: "02", label: "원자재의 가치" },
  { index: "03", label: "에너지로 완성" },
];

export function Hero() {
  const [activePhase, setActivePhase] = useState(0);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (!video.duration) return;
    const ratio = video.currentTime / video.duration;
    const idx = Math.min(
      PHASES.length - 1,
      Math.floor(ratio * PHASES.length)
    );
    setActivePhase(idx);
  };

  return (
    <section
      id="top"
      className="relative min-h-screen-safe overflow-hidden bg-navy-950"
    >
      {/* 풀블리드 영상 배경 */}
      <div className="absolute inset-0">
        <MetalCubeHero onTimeUpdate={handleTimeUpdate} />
      </div>

      {/* 가독성을 위한 스크림 (하단이 진하고 상단은 옅게) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />

      {/* 텍스트 오버레이: 하단좌측 고정 (POSCO 방식) */}
      <div className="absolute inset-x-0 bottom-10 z-10 px-6 sm:px-10 lg:px-14 xl:px-20 sm:bottom-16">
        <p className="mb-4 text-xs font-semibold tracking-[0.35em] text-gold-400">
          GLOBAL TRADE · ENERGY PLATFORM
        </p>

        <h1 className="max-w-xl break-keep text-[2.2rem] font-extrabold leading-[1.28] tracking-tight text-white sm:text-5xl lg:text-[3.2rem]">
          <span className="underline decoration-gold-400 decoration-2 underline-offset-8">
            실물 자산과 미래를
          </span>
          <br />
          잇는 글로벌 파트너
        </h1>

        <div className="mt-3">
          <a
            href="#about"
            className="inline-flex items-center gap-2 rounded-md border border-white/40 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-gold-400 hover:text-gold-300"
          >
            <span aria-hidden="true">↳</span> 사업영역 더 알아보기
          </a>
        </div>

        {/* 재생 진행률에 연동되는 01/02/03 인디케이터 */}
        <div
          className="mt-4 flex items-center gap-4 text-sm font-semibold tracking-widest"
          aria-label="영상 진행 단계"
        >
          {PHASES.map((phase, i) => (
            <span
              key={phase.index}
              className={
                i === activePhase
                  ? "text-white transition-colors"
                  : "text-white/35 transition-colors"
              }
            >
              {phase.index}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
