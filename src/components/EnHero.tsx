"use client";

import { useState } from "react";
import MetalCubeHero from "./MetalCubeHero.jsx";

const PHASES = [
  { index: "01", label: "Tip of the Iceberg" },
  { index: "02", label: "Value of Raw Materials" },
  { index: "03", label: "Completed by Energy" },
];

export function EnHero() {
  const [activePhase, setActivePhase] = useState(0);

  const handleTimeUpdate = (e: any) => {
    const video = e.currentTarget;
    if (!video.duration) return;
    const ratio = video.currentTime / video.duration;
    const idx = Math.min(PHASES.length - 1, Math.floor(ratio * PHASES.length));
    setActivePhase(idx);
  };

  return (
    <section id="top" className="relative min-h-screen-safe overflow-hidden bg-navy-950">
      <div className="absolute inset-0">
        <MetalCubeHero onTimeUpdate={handleTimeUpdate} />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />

      <div className="absolute inset-x-0 bottom-10 z-10 px-6 sm:px-10 lg:px-14 xl:px-20 sm:bottom-16">
        <p className="relative top-3 mb-4 text-xs font-semibold tracking-[0.35em] text-gold-400">
          GLOBAL TRADE · ENERGY PLATFORM
        </p>

        <h1 className="max-w-xl break-keep text-[2.2rem] font-extrabold leading-[1.28] tracking-tight text-white sm:text-5xl lg:text-[3.2rem]">
          <span className="underline decoration-gold-400 decoration-2 underline-offset-8">
            Connecting Real Assets
          </span>
          <br />
          to the Future
        </h1>

        <div className="mt-3">
          
            <a href="#business"
            className="inline-flex items-center gap-2 rounded-md border border-white/40 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-gold-400 hover:text-gold-300"
          >
            <span aria-hidden="true">↳</span> Explore Our Business
          </a>
        </div>

        <div
          className="mt-4 flex items-center gap-4 text-sm font-semibold tracking-widest"
          aria-label="Video progress steps"
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