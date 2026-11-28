"use client";
/* GIIB 회사소개서 바로보기 — 아무 곳이나 누르면 책장이 넘어가는 뷰어 (투명도 애니메이션 없이 3D 회전만) */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const N = 40;
const SRC = (i: number) => `/g0dy098g/deck/${String(i + 1).padStart(2, "0")}.webp`;
const E = [0.45, 0.05, 0.25, 1] as const;

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

  // 아래에 깔리는 장: 넘길 때 다음(또는 현재) 장
  const under = flip === "next" ? idx + 1 : idx;
  // 위에서 회전하는 장
  const top = flip === "prev" ? idx - 1 : idx;

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
          <img src={SRC(under)} alt={`${under + 1}쪽`} className="absolute inset-0 h-full w-full object-contain shadow-2xl" draggable={false} />
          {/* 넘어가는 장 */}
          {flip && (
            <motion.div key={`${flip}-${idx}`} className="absolute inset-0" style={{ transformOrigin: "0% 50%", transformStyle: "preserve-3d" }}
              initial={{ rotateY: flip === "next" ? 0 : -180 }} animate={{ rotateY: flip === "next" ? -180 : 0 }} transition={{ duration: 0.8, ease: E }} onAnimationComplete={done}>
              <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
                <img src={SRC(top)} alt="" className="h-full w-full object-contain" draggable={false} />
                {/* 접히는 쪽 그림자 */}
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0), rgba(0,0,0,.28))" }} />
              </div>
              <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "linear-gradient(90deg, #d9d6c8, #f1f0e8 60%, #e4e1d3)" }} />
            </motion.div>
          )}
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
