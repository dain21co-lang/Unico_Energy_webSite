"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/*
 * 해연에프엔지 회사소개서 뷰어 — 좌우로 넘기는 모션 프레젠테이션
 * 원칙: 투명도 애니메이션 없이 위치·크기·모양만 움직인다 (갤럭시 빈 화면 방지)
 */

const N = 54;
const SRC = (i: number) => `/haeyeon/deck/${String(i).padStart(2, "0")}.webp`;
const EASE = [0.16, 1, 0.3, 1] as const;

/* 모핑 블롭: 같은 구조의 경로끼리 모양이 녹아들 듯 바뀐다 */
function blob(seed: number) {
  const K = 7; const pts: [number, number][] = [];
  for (let k = 0; k < K; k++) {
    const a = (k / K) * Math.PI * 2;
    const r = 62 + 26 * Math.sin(seed * 1.7 + k * 2.3) * Math.cos(seed * 0.9 + k);
    pts.push([100 + r * Math.cos(a), 100 + r * Math.sin(a)]);
  }
  const f = (n: number) => n.toFixed(1);
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let k = 0; k < K; k++) {
    const p0 = pts[(k - 1 + K) % K], p1 = pts[k], p2 = pts[(k + 1) % K], p3 = pts[(k + 2) % K];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
  }
  return d + "Z";
}
const BLOBS = Array.from({ length: 24 }, (_, k) => blob(k + 3));
const POS_A = [
  { x: "34%", y: "-18%", scale: 1.2, rotate: 0 },
  { x: "-44%", y: "48%", scale: 1.0, rotate: 40 },
  { x: "42%", y: "56%", scale: 0.9, rotate: -30 },
  { x: "-30%", y: "-10%", scale: 0.85, rotate: 70 },
  { x: "28%", y: "24%", scale: 1.3, rotate: -15 },
  { x: "-22%", y: "66%", scale: 1.1, rotate: 20 },
];
const POS_B = [
  { x: "-38%", y: "62%", scale: 0.8, rotate: 10 },
  { x: "40%", y: "-6%", scale: 0.7, rotate: -40 },
  { x: "-26%", y: "-16%", scale: 0.9, rotate: 30 },
  { x: "44%", y: "70%", scale: 1.0, rotate: -10 },
  { x: "-40%", y: "30%", scale: 0.75, rotate: 60 },
];
/* 페이지가 드러나는 모양: 장마다 다른 마스크에서 시작해 사각형으로 모핑 */
const REVEAL = [
  "inset(10% 10% 10% 10% round 48px)",
  "inset(0% 50% 0% 50% round 12px)",
  "inset(45% 0% 45% 0% round 12px)",
  "inset(20% 30% 20% 30% round 999px)",
];

/* 오도미터 숫자: 자리마다 0~9 띠가 굴러 목표 숫자에 멈춘다 */
function Odo({ n }: { n: number }) {
  const s = String(n).padStart(2, "0");
  return (
    <span className="inline-flex" style={{ height: "1em", lineHeight: 1 }} aria-label={s}>
      {s.split("").map((ch, k) => (
        <span key={k} aria-hidden="true" className="relative inline-block overflow-hidden text-center" style={{ height: "1em", width: "0.6em" }}>
          <motion.span className="absolute inset-x-0 top-0 flex flex-col" initial={false} animate={{ y: `${-Number(ch)}em` }} transition={{ duration: 0.9, ease: EASE }}>
            {Array.from({ length: 10 }, (_, m) => <span key={m} style={{ height: "1em", lineHeight: 1 }}>{m}</span>)}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export default function DeckView() {
  const [i, setI] = useState(1);
  const [dir, setDir] = useState(1);
  const strip = useRef<HTMLDivElement>(null);

  const go = useCallback((n: number) => {
    const t = Math.min(N, Math.max(1, n));
    setI((c) => { if (t !== c) setDir(t > c ? 1 : -1); return t; });
  }, []);
  const next = useCallback(() => go(i + 1), [go, i]);
  const prev = useCallback(() => go(i - 1), [go, i]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === "ArrowRight") next(); if (e.key === "ArrowLeft") prev(); };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [next, prev]);

  /* 썸네일 띠: 현재 장이 가운데 오도록 */
  useEffect(() => {
    const el = strip.current?.querySelector<HTMLElement>(`[data-p="${i}"]`);
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [i]);

  /* 앞뒤 장 미리 불러오기 */
  useEffect(() => {
    [i + 1, i + 2, i - 1].forEach((n) => { if (n >= 1 && n <= N) { const im = new Image(); im.src = SRC(n); } });
  }, [i]);

  return (
    <div className="hy" style={{ background: "#0d1710", color: "#fff" }}>
    <div className="relative mx-auto flex h-[100dvh] w-full max-w-[560px] flex-col overflow-hidden">
      {/* 모핑 블롭 두 개 */}
      <motion.svg aria-hidden="true" viewBox="0 0 200 200" className="pointer-events-none absolute left-0 top-0 w-full" style={{ filter: "blur(3px)" }}
        animate={POS_A[i % POS_A.length]} transition={{ type: "spring", stiffness: 36, damping: 14 }}>
        <defs><linearGradient id="dk-g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1f4a23" /><stop offset="100%" stopColor="#14301a" /></linearGradient></defs>
        <motion.path fill="url(#dk-g1)" initial={false} animate={{ d: BLOBS[i % BLOBS.length] }} transition={{ duration: 1.4, ease: EASE }} />
      </motion.svg>
      <motion.svg aria-hidden="true" viewBox="0 0 200 200" className="pointer-events-none absolute left-0 top-0 w-full"
        animate={POS_B[i % POS_B.length]} transition={{ type: "spring", stiffness: 28, damping: 12 }}>
        <motion.path fill="#22381a" initial={false} animate={{ d: BLOBS[(i + 9) % BLOBS.length] }} transition={{ duration: 1.6, ease: EASE }} />
      </motion.svg>

      {/* 상단 */}
      <header className="relative z-20 flex items-center justify-between px-4 pb-2 pt-[calc(12px+env(safe-area-inset-top,0px))]">
        <a href="/pqw8nt7" className="flex items-center gap-1 text-[13px] font-bold text-[#cfe6b5]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
          사이트로
        </a>
        <p className="text-[13px] font-black tracking-wide">회사소개서</p>
        <a href="/pqw8nt7/files/haeyeon-company-profile.pdf" target="_blank" rel="noopener" className="rounded-full bg-[var(--hy-orange)] px-3 py-1.5 text-[12px] font-bold text-white">PDF</a>
      </header>
      <div className="relative z-20 mx-4 h-[3px] overflow-hidden rounded-full bg-white/10">
        <motion.div className="h-full origin-left bg-[#a7d45a]" initial={false} animate={{ scaleX: i / N }} transition={{ duration: 0.6, ease: EASE }} />
      </div>

      {/* 쪽 번호 */}
      <div className="relative z-20 mt-5 flex items-end justify-between px-5">
        <p className="font-serif text-[64px] font-semibold leading-none text-[#a7d45a]"><Odo n={i} /></p>
        <p className="pb-2 text-[13px] font-semibold text-white/60">/ {N}</p>
      </div>

      {/* 무대 */}
      <div className="relative z-10 min-h-0 w-full flex-1 overflow-hidden" style={{ perspective: 1200 }}>
        {/* 페이지 테두리: 장마다 모서리가 모핑 */}
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-x-3 top-1/2 z-20 aspect-[1287/910] -translate-y-1/2 border border-[#a7d45a]/40"
          initial={false} animate={{ borderRadius: i % 2 ? 22 : 6, scale: i % 2 ? 1.025 : 1.01 }} transition={{ type: "spring", stiffness: 70, damping: 18 }} />
        <AnimatePresence initial={false} custom={dir}>
          <motion.section key={i} custom={dir} className="absolute inset-0 flex items-center justify-center px-3"
            variants={{
              enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", rotateY: d > 0 ? -28 : 28, scale: 0.82 }),
              center: { x: "0%", rotateY: 0, scale: 1 },
              exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", rotateY: d > 0 ? 28 : -28, scale: 0.82 }),
            }}
            initial="enter" animate="center" exit="exit"
            transition={{ x: { type: "spring", stiffness: 240, damping: 30 }, rotateY: { duration: 0.65, ease: EASE }, scale: { duration: 0.55 } }}
            aria-roledescription="slide" aria-label={`${i} / ${N}`}>
            <motion.div className="w-full min-w-0 max-w-full cursor-grab touch-pan-y active:cursor-grabbing" drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.25} dragMomentum={false}
              onDragEnd={(_, info) => {
                if (info.offset.x < -50 || info.velocity.x < -420) next();
                else if (info.offset.x > 50 || info.velocity.x > 420) prev();
              }}>
              <motion.div className="relative w-full overflow-hidden rounded-md bg-white shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
                initial={{ clipPath: REVEAL[i % REVEAL.length] }} animate={{ clipPath: "inset(0% 0% 0% 0% round 6px)" }} transition={{ duration: 0.95, delay: 0.12, ease: EASE }}>
                <motion.img src={SRC(i)} alt={`회사소개서 ${i}페이지`} width={1287} height={910} draggable={false} className="block h-auto w-full select-none"
                  initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 1.6, ease: EASE }} />
                {/* 빛줄기: 페이지 위를 한 번 쓸고 지나감 */}
                <motion.div aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent"
                  initial={{ x: "-160%" }} animate={{ x: "420%" }} transition={{ duration: 1.3, delay: 0.5, ease: "easeInOut" }} />
              </motion.div>
            </motion.div>
          </motion.section>
        </AnimatePresence>
      </div>

      {/* 썸네일 띠 */}
      <div ref={strip} className="relative z-20 flex shrink-0 gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {Array.from({ length: N }, (_, k) => k + 1).map((n) => (
          <button key={n} type="button" data-p={n} onClick={() => go(n)} aria-label={`${n}페이지로`}
            className={`relative shrink-0 overflow-hidden rounded-[4px] transition-transform duration-300 ${n === i ? "scale-110 ring-2 ring-[#a7d45a]" : "scale-95"}`}>
            <img src={SRC(n)} alt="" loading="lazy" width={64} height={45} className="block h-[45px] w-[64px] object-cover" />
          </button>
        ))}
      </div>

      {/* 하단 버튼 */}
      <footer className="relative z-20 shrink-0 pb-[calc(12px+env(safe-area-inset-bottom,0px))]">
        <div className="flex items-center justify-center gap-5">
          <button type="button" aria-label="이전 페이지" disabled={i === 1} onClick={prev} className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/5 disabled:text-white/30">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <p className="text-[12px] text-white/60">좌우로 밀어서 넘기세요</p>
          <button type="button" aria-label="다음 페이지" disabled={i === N} onClick={next} className="flex h-12 w-12 items-center justify-center rounded-full bg-[#a7d45a] text-[#0d1710] disabled:bg-white/10 disabled:text-white/30">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>
      </footer>
    </div>
    </div>
  );
}
