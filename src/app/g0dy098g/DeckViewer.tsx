"use client";
/* GIIB 회사소개서 바로보기 — 아무 곳이나 누르면 책장이 넘어가는 뷰어 (투명도 애니메이션 없이 3D 회전만) */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const N = 40;
const STRIPS = 9;
const SRC = (i: number) => `/g0dy098g/deck/${String(i + 1).padStart(2, "0")}.webp`;
const E = [0.65, 0, 0.35, 1] as const;

export default function DeckViewer({ onClose, lang }: { onClose: () => void; lang: "ko" | "en" }) {
  const [idx, setIdx] = useState(0);
  const [flip, setFlip] = useState<null | "next" | "prev">(null);

  useEffect(() => {
    const pre = [idx + 1, idx + 2, idx - 1].filter((i) => i >= 0 && i < N);
    pre.forEach((i) => { const im = new Image(); im.src = SRC(i); });
  }, [idx]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowRight") go("next"); if (e.key === "ArrowLeft") go("prev"); };
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  });

  const go = (d: "next" | "prev") => {
    if (flip) return;
    if (d === "next" && idx >= N - 1) { setIdx(0); return; }
    if (d === "prev" && idx <= 0) return;
    setFlip(d);
  };
  const done = () => { setIdx((i) => (flip === "next" ? i + 1 : i - 1)); setFlip(null); };

  // 띠가 뒤집히는 동안 아래는 비워 두고(어두운 바탕), 띠 앞면=현재 장, 뒷면=다음 장
  const under = idx;

  return (
    <div className="fixed inset-0 z-[80] flex flex-col" style={{ background: "#0f140a" }}>
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <span className="text-[13px] font-bold tracking-[0.08em]" style={{ color: "#e9d2ad" }}>GIIB {lang === "en" ? "COMPANY PROFILE" : "회사소개서"}</span>
        <div className="flex items-center gap-3">
          <a href="/g0dy098g/deck/GIIB_company_profile.pdf" target="_blank" rel="noopener" className="border px-2.5 py-1 text-[11.5px] font-bold" style={{ borderColor: "#e9d2ad", color: "#e9d2ad" }}>PDF</a>
          <button onClick={onClose} aria-label="닫기" className="text-[26px] leading-none">×</button>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-2" onClick={() => go("next")} style={{ perspective: "1800px" }}>
        <div className="relative w-full max-w-[960px]" style={{ aspectRatio: "1286 / 910" }}>
          {/* 아래 장 */}
          {!flip && <img src={SRC(under)} alt="" className="absolute inset-0 h-full w-full object-contain shadow-2xl" draggable={false} />}
          {/* 넘어가는 장 — 세로 띠 9개가 물결처럼 차례로 뒤집히며 다음 장으로 바뀜 */}
          {flip && Array.from({ length: STRIPS }).map((_, k) => {
            const order = flip === "next" ? k : STRIPS - 1 - k;
            const from = flip === "next" ? idx : idx;
            const to = flip === "next" ? idx + 1 : idx - 1;
            const pos = `${(k / (STRIPS - 1)) * 100}% 50%`;
            return (
              <motion.div key={`${flip}-${idx}-${k}`} className="absolute inset-y-0" style={{ left: `${(k / STRIPS) * 100}%`, width: `${100 / STRIPS + 0.15}%`, transformStyle: "preserve-3d" }}
                initial={{ rotateY: 0, z: 0 }} animate={{ rotateY: flip === "next" ? -180 : 180, z: [0, 60, 0] }}
                transition={{ duration: 0.7, delay: order * 0.055, ease: E }}
                onAnimationComplete={k === (flip === "next" ? STRIPS - 1 : 0) ? done : undefined}>
                <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", backgroundImage: `url(${SRC(from)})`, backgroundSize: `${STRIPS * 100}% 100%`, backgroundPosition: pos }} />
                <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", backgroundImage: `url(${SRC(to)})`, backgroundSize: `${STRIPS * 100}% 100%`, backgroundPosition: pos }} />
              </motion.div>
            );
          })}
          {!flip && <img src={SRC(idx)} alt={`${idx + 1}쪽`} className="absolute inset-0 h-full w-full object-contain" draggable={false} />}
        </div>
      </div>

      <div className="flex items-center justify-between px-4 pb-6 pt-3 text-white">
        <button onClick={() => go("prev")} disabled={idx === 0} className="border px-3 py-2 text-[13px] font-bold" style={{ borderColor: "rgba(255,255,255,.3)", color: idx === 0 ? "rgba(255,255,255,.3)" : "#fff" }}>‹ {lang === "en" ? "Prev" : "이전"}</button>
        <div className="flex flex-col items-center">
          <span className="text-[13px] font-bold">{idx + 1} / {N}</span>
          <span className="mt-1 text-[10.5px] text-white/50">{lang === "en" ? "Tap the page to turn" : "화면을 누르면 다음 장으로 넘어갑니다"}</span>
        </div>
        <button onClick={() => go("next")} className="border px-3 py-2 text-[13px] font-bold" style={{ borderColor: "#e9d2ad", color: "#e9d2ad" }}>{idx >= N - 1 ? (lang === "en" ? "Restart" : "처음으로") : lang === "en" ? "Next ›" : "다음 ›"}</button>
      </div>
      <div className="h-[3px] w-full" style={{ background: "rgba(255,255,255,.08)" }}>
        <motion.div className="h-full origin-left" style={{ background: "#e9d2ad" }} animate={{ scaleX: (idx + 1) / N }} transition={{ duration: 0.4 }} />
      </div>
    </div>
  );
}
