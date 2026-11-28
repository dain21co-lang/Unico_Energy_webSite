"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode, CSSProperties } from "react";
import { motion, AnimatePresence, useInView, animate, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { CO, PROCESS, PRINCIPLES, IMAGES, IMG_POS, SAMPLE, RECORD_STATS, CASES, SECTORS, HERO_VIDEO, VIDEOS } from "./data";
import { LangCtx, useLang, pick, CO_EN, PROCESS_EN, PRINCIPLES_EN, RECORD_STATS_EN, CASES_EN, SECTORS_EN, MENU_EN } from "./i18n";
import type { Lang } from "./i18n";
import GiibLogo, { GiibMini } from "./GiibLogo";
import DeckViewer from "./DeckViewer";

/*
 * 벤치마킹: BlackRock(흑백 타이포·여백) · Brookfield(큰 사진 + 사진 아래 문장) · Macquarie(사업부 목록)
 * 원칙: 투명도는 움직이지 않는다 (갤럭시 빈 화면 방지) — 위치·크기·마스크·선 그리기만
 */
const EASE = [0.16, 1, 0.3, 1] as const;
const SRC = (k: string) => (IMAGES[k] ? `/g0dy098g/${IMAGES[k]}` : "");

/* 모핑용 블롭: 같은 구조(점 8개 · 3차 곡선)라 seed만 바꿔도 모양이 부드럽게 변한다 */
function blob(seed: number, cx = 100, cy = 100, r = 70, jitter = 0.28) {
  const n = 8;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + jitter * Math.sin(seed * 1.7 + i * 2.3) * Math.cos(seed * 0.9 + i * 1.1);
    return [cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k];
  });
  const t = 0.36;
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) * t / 2, p1[1] + (p2[1] - p0[1]) * t / 2];
    const c2 = [p2[0] - (p3[0] - p1[0]) * t / 2, p2[1] - (p3[1] - p1[1]) * t / 2];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + " Z";
}

/* 계속 모양이 바뀌는 블롭 */
function LiveBlob({ fill, seeds, dur = 9, r = 70, className, style }: { fill: string; seeds: number[]; dur?: number; r?: number; className?: string; style?: CSSProperties }) {
  const ds = [...seeds, seeds[0]].map((sd) => blob(sd, 100, 100, r));
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden="true">
      <motion.path d={ds[0]} fill={fill} animate={{ d: ds }} transition={{ duration: dur, repeat: Infinity, ease: "easeInOut" }} />
    </svg>
  );
}

/* 모양 모핑: 점 개수가 같은 다각형끼리 바뀐다 (타워 → 크레인 → 문서) */
const SHAPES: number[][][] = [
  [[70, 170], [70, 60], [100, 30], [130, 60], [130, 170], [118, 170], [118, 100], [82, 100], [82, 170], [70, 170]],
  [[40, 170], [40, 140], [95, 140], [95, 40], [165, 40], [165, 55], [110, 55], [110, 140], [150, 140], [150, 170]],
  [[60, 170], [60, 30], [120, 30], [150, 60], [150, 170], [128, 170], [128, 75], [105, 52], [82, 52], [82, 170]],
];
const shapePath = (pts: number[][]) => "M " + pts.map(([x, y]) => `${x} ${y}`).join(" L ") + " Z";

function ShapeMorph({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <motion.path d={blob(index * 3 + 1, 100, 105, 82, 0.18)} fill="#2b3620" animate={{ d: blob(index * 3 + 1, 100, 105, 82, 0.18) }} transition={{ duration: 0.9, ease: EASE }} />
      <motion.path d={shapePath(SHAPES[0])} fill="#e9d2ad" stroke="#b98a52" strokeWidth="2" strokeLinejoin="round" animate={{ d: shapePath(SHAPES[index]) }} transition={{ duration: 0.9, ease: EASE }} />
    </svg>
  );
}

/* 숫자가 올라가는 카운터 */
function Count({ to, comma = false }: { to: number; comma?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [v, setV] = useState(to > 100 ? to - 30 : 0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(to > 100 ? to - 30 : 0, to, { duration: 1.6, ease: EASE, onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{comma ? v.toLocaleString("ko-KR") : v}</span>;
}

function Rise({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ y: 24 }} whileInView={{ y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.8, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

function Lift({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true });
  return (
    <span ref={ref} className="block overflow-hidden">
      <motion.span className="block" initial={{ y: "105%" }} animate={{ y: seen ? "0%" : "105%" }} transition={{ duration: 0.9, delay, ease: EASE }}>{children}</motion.span>
    </span>
  );
}

function Kicker({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <div className="gi-en text-[11px] font-bold" style={{ color: light ? "var(--gi-sand)" : "var(--gi-copper)" }}>{children}</div>;
}

function Pending({ children }: { children?: ReactNode }) {
  const lang = useLang();
  children = children ?? pick(lang, "입력 대기", "Pending");
  return <span className="border border-dashed px-1.5 py-0.5 text-[11.5px]" style={{ borderColor: "var(--gi-copper)", color: "var(--gi-copper)" }}>{children}</span>;
}

function Arrow({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14 M13 6l6 6-6 6" /></svg>;
}

function Logo({ dark = false, size = 32 }: { dark?: boolean; size?: number }) {
  const lang = useLang();
  return (
    <span className="flex items-center gap-2.5">
      <GiibMini size={size} />
      <span className="leading-none">
        <span className="block text-[17px] font-extrabold tracking-[0.12em]" style={{ color: dark ? "#fff" : "var(--gi-black)" }}>GIIB</span>
        <span className="mt-1 block text-[10.5px] font-semibold" style={{ color: dark ? "var(--gi-sand)" : "var(--gi-sub)" }}>{pick(lang, "글로벌인프라허브", "Global Infra Hub")}</span>
      </span>
    </span>
  );
}

/* 사진이 없을 때 대신 보여 줄 그래픽: 거점(hub)과 건물 */
function HubScene({ variant = 0 }: { variant?: number }) {
  const bars = [[60, 70], [92, 120], [124, 90], [156, 150], [188, 105], [220, 135], [252, 80], [284, 110]].map(([x, h], i) => [x, variant ? Math.round(h * (0.6 + ((i * 37 + variant * 13) % 50) / 100)) : h]);
  return (
    <svg viewBox="0 0 340 300" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <rect width="340" height="300" fill="#2b3620" />
      <rect width="340" height="300" fill="url(#giSky)" />
      <defs>
        <linearGradient id="giSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3c4a2c" /><stop offset="100%" stopColor="#1c2414" /></linearGradient>
        <linearGradient id="giBar" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e9d2ad" /><stop offset="100%" stopColor="#b98a52" /></linearGradient>
      </defs>
      {[[170, 40], [40, 120], [300, 110], [70, 210], [280, 215]].map(([x, y], i) => (
        <g key={i}>
          <line x1={170} y1={150} x2={x} y2={y} stroke="#b98a52" strokeWidth="1.2" strokeDasharray="4 6" className="gi-flow" />
          <circle cx={x} cy={y} r="4.5" fill="#e9d2ad" className="gi-node" style={{ animationDelay: `${i * 0.4}s` }} />
        </g>
      ))}
      {bars.map(([x, h], i) => (
        <motion.rect key={x} x={x - 12} y={270 - h} width="24" height={h} rx="2" fill={i % 3 === 1 ? "url(#giBar)" : "#3d4a2e"} stroke="#b98a52" strokeWidth="0.6"
          initial={{ scaleY: 0 }} animate={{ scaleY: [0, 1, 0.82 + (i % 3) * 0.06, 1] }} transition={{ duration: 6, times: [0, 0.2, 0.6, 1], delay: i * 0.08, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          style={{ transformOrigin: `${x}px 270px` }} />
      ))}
      <line x1="0" y1="270.5" x2="340" y2="270.5" stroke="#e9d2ad" strokeWidth="1.5" />
      <circle cx={170} cy={150} r={20} fill="#2b3620" stroke="#e9d2ad" strokeWidth="2" />
      <text x="170" y="154.5" textAnchor="middle" fill="#e9d2ad" fontSize="11" fontWeight="800" letterSpacing="1.5">HUB</text>
    </svg>
  );
}

/* Brookfield식 사진 블록: 마스크가 열리며 등장, 사진이 없으면 그래픽 */
function Visual({ k, className, variant = 0, tag }: { k: string; className?: string; variant?: number; tag?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-30px" });
  const src = SRC(k);
  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      <motion.div className="absolute inset-0 overflow-hidden" initial={{ clipPath: "inset(0% 0% 100% 0%)" }} animate={{ clipPath: seen ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" }} transition={{ duration: 1.1, ease: EASE }}>
        <motion.div className="relative h-full w-full" initial={{ scale: 1.12 }} animate={{ scale: seen ? 1 : 1.12 }} transition={{ duration: 1.6, ease: EASE }}>
          {src ? <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: IMG_POS[k] }} /> : <HubScene variant={variant} />}
          {VIDEOS[k] && seen && <video src={`/g0dy098g/${VIDEOS[k]}`} poster={src || undefined} autoPlay muted loop playsInline aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: IMG_POS[k] }} />}
        </motion.div>
        {tag && <span className="absolute bottom-2 left-2 bg-white px-1.5 py-0.5 text-[10px] font-semibold" style={{ color: "var(--gi-black)" }}>{tag}</span>}
      </motion.div>
    </div>
  );
}

/* 화면 폭 가득 영상: 막이 옆으로 걷히며 등장, 화면에 보일 때만 재생 */
const FILM_VIDEO = "video/dealroom.mp4"; // 딜 룸 반복 영상(Flow 시작·끝 같은 프레임)
function Film() {
  const lang = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const seen = useInView(ref, { once: true, margin: "-40px" });
  const onScreen = useInView(ref);
  useEffect(() => {
    const v = vid.current; if (!v) return;
    if (onScreen) v.play().catch(() => {}); else v.pause();
  }, [onScreen]);
  return (
    <section ref={ref} className="relative" style={{ background: "#11150c" }}>
      <motion.div className="relative aspect-[16/9] w-full overflow-hidden" initial={{ clipPath: "inset(0% 100% 0% 0%)" }} animate={{ clipPath: seen ? "inset(0% 0% 0% 0%)" : "inset(0% 100% 0% 0%)" }} transition={{ duration: 1.2, ease: EASE }}>
        <img src="/g0dy098g/dealroom.webp" alt={pick(lang, "딜 룸에서 거래 구조를 검토하는 팀", "Team reviewing a deal structure in the deal room")} className="absolute inset-0 h-full w-full object-cover" />
        {FILM_VIDEO && <video ref={vid} src={`/g0dy098g/${FILM_VIDEO}`} poster="/g0dy098g/dealroom.webp" muted loop playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(17,21,12,0) 55%, rgba(17,21,12,.85) 100%)" }} />
        <div className="absolute bottom-3 left-5 right-5 flex items-end justify-between text-white">
          <span className="gi-en text-[10px] font-semibold" style={{ color: "var(--gi-sand)" }}>ASSET × ADVISORY</span>
          <span className="text-[12px] text-white/75">{pick(lang, "자산과 기업을 하나의 딜로", "Assets and companies, one deal")}</span>
        </div>
      </motion.div>
    </section>
  );
}

/* 예시 표시 */
function SampleTag() {
  const lang = useLang();
  if (!SAMPLE) return null;
  return <span className="ml-2 inline-block border px-1.5 py-[1px] align-middle text-[10px] font-semibold tracking-normal" style={{ borderColor: "var(--gi-copper)", color: "var(--gi-copper)" }}>{pick(lang, "예시", "Sample")}</span>;
}

/* 투자 구조도 — 어두운 카드 위 컬러 노드, 흐르는 그라데이션 선과 빛 입자, 가운데 모핑 블롭.
 * 단계가 차례로 강조되고(자동), 누르면 그 단계 설명이 아래에 바뀐다 */
const ST_NODES = [
  { k: "inv", x: 100, y: 22, w: 150, c: "#f0a45a", ko: ["투자자", "기관 · 법인 · 개인"], en: ["Investors", "Institutions · Corporates · Individuals"],
    dko: "기관·법인·개인 투자자의 자금이 들어옵니다.", den: "Capital comes in from institutions, corporates and individuals." },
  { k: "spc", x: 105, y: 150, w: 140, c: "#e9d2ad", ko: ["GIIB · 투자 SPC", "구조화 · 실사 · 관리"], en: ["GIIB · Investment SPC", "Structuring · DD · Management"],
    dko: "GIIB가 투자 SPC를 세워 실사·구조화·관리를 맡습니다. 투자금은 회사 자산과 분리됩니다.", den: "GIIB sets up an investment SPC and runs due diligence, structuring and management. Investor money stays ring-fenced." },
  { k: "lend", x: 4, y: 150, w: 74, c: "#5b9cf0", ko: ["금융기관", "브릿지·PF"], en: ["Lenders", "Bridge·PF"],
    dko: "브릿지·PF 대출로 부족한 자금을 채웁니다.", den: "Bridge and PF loans fill the funding gap." },
  { k: "trust", x: 272, y: 150, w: 74, c: "#3cc3a8", ko: ["담보신탁", "신탁·담보"], en: ["Trust", "Collateral"],
    dko: "자산을 신탁에 맡겨 담보를 확보하고 투자자를 보호합니다.", den: "Assets are placed in trust to secure collateral and protect investors." },
  { k: "asset", x: 100, y: 278, w: 150, c: "#a58cf2", ko: ["부동산 자산", "오피스 · 개발 · 호텔"], en: ["Real Estate", "Office · Development · Hotel"],
    dko: "오피스·개발부지·호텔 등 실제 자산을 매입하고 개발합니다.", den: "Real assets — offices, development sites, hotels — are acquired or developed." },
  { k: "exit", x: 100, y: 388, w: 150, c: "#ef7f74", ko: ["출구", "매각 · 리파이낸싱"], en: ["Exit", "Sale · Refinancing"],
    dko: "매각이나 리파이낸싱으로 수익을 회수합니다.", den: "Returns are realized through sale or refinancing." },
];
/* 흐름 순서: 투자자 → SPC ← 금융기관 · 담보신탁, SPC → 자산 → 출구 */
const ST_ORDER = [0, 2, 3, 1, 4, 5];
const ST_LINES = [
  { d: "M175 78 V150", from: "#f0a45a", to: "#e9d2ad", g: [175, 78, 175, 150] },
  { d: "M78 178 H105", from: "#5b9cf0", to: "#e9d2ad", g: [78, 178, 105, 178] },
  { d: "M272 178 H245", from: "#3cc3a8", to: "#e9d2ad", g: [272, 178, 245, 178] },
  { d: "M175 206 V278", from: "#e9d2ad", to: "#a58cf2", g: [175, 206, 175, 278] },
  { d: "M175 334 V388", from: "#a58cf2", to: "#ef7f74", g: [175, 334, 175, 388] },
];

function StIcon({ k, c }: { k: string; c: string }) {
  const p = { fill: "none", stroke: c, strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (k) {
    case "inv": return <g {...p}><circle cx="-3" cy="-3" r="2.6" /><path d="M-8 5 q5 -6 10 0" /><circle cx="4.5" cy="-2" r="2.1" /><path d="M2 5 q3 -4.5 7 0" /></g>;
    case "spc": return <g {...p}><circle r="2.4" fill={c} /><circle r="6.5" /><path d="M0 -6.5 V-9 M6.5 0 H9 M0 6.5 V9 M-6.5 0 H-9" /></g>;
    case "lend": return <g {...p}><path d="M-8 -2 L0 -7 L8 -2 Z M-6 0 V5 M-2 0 V5 M2 0 V5 M6 0 V5 M-8 7 H8" /></g>;
    case "trust": return <g {...p}><path d="M0 -8 L7 -5 V0 C7 4 4 7 0 8 C-4 7 -7 4 -7 0 V-5 Z" /><path d="M-3 0 L-1 2.5 L3.5 -2.5" /></g>;
    case "asset": return <g {...p}><path d="M-7 8 V-4 L-1 -7 V8 M-1 -2 H7 V8 M-9 8 H9 M-4.5 -1 V0 M-4.5 3 V4 M2.5 2 V3 M4.5 2 V3" /></g>;
    default: return <g {...p}><path d="M-6 6 L6 -6 M-1 -6 H6 V1" /><path d="M-7 -1 V7 H1" /></g>;
  }
}

function Structure() {
  const lang = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-60px" });
  const onScreen = useInView(ref);
  const [step, setStep] = useState(0); // ST_ORDER 안의 위치
  const [manual, setManual] = useState(false);
  useEffect(() => {
    if (!seen || manual || !onScreen) return;
    const t = window.setInterval(() => setStep((s) => (s + 1) % ST_ORDER.length), 2600);
    return () => window.clearInterval(t);
  }, [seen, manual, onScreen]);
  const active = ST_ORDER[step];
  const node = ST_NODES[active];
  return (
    <div ref={ref} className="relative mt-6 pt-2 pb-2">
      {/* 배경에서 천천히 모양이 바뀌는 컬러 블롭 */}
      <LiveBlob fill="rgba(150,170,110,.20)" seeds={[2, 5, 8, 3]} dur={12} className="pointer-events-none absolute -left-20 -top-16 h-[240px] w-[240px]" />
      <LiveBlob fill="rgba(165,140,242,.16)" seeds={[4, 7, 1, 6]} dur={14} r={76} className="pointer-events-none absolute -right-24 top-40 h-[260px] w-[260px]" />
      <LiveBlob fill="rgba(60,195,168,.14)" seeds={[6, 9, 3, 8]} dur={10} className="pointer-events-none absolute -bottom-20 left-10 h-[220px] w-[220px]" />
      <svg viewBox="0 0 350 450" className="relative w-full" style={{ overflow: "visible" }} role="img" aria-label={pick(lang, "투자 구조도", "Investment structure diagram")}>
        <defs>
          {ST_LINES.map((l, i) => (
            <linearGradient key={i} id={`gi-st-g${i}`} gradientUnits="userSpaceOnUse" x1={l.g[0]} y1={l.g[1]} x2={l.g[2]} y2={l.g[3]}>
              <stop offset="0%" stopColor={l.from} /><stop offset="100%" stopColor={l.to} />
            </linearGradient>
          ))}
          <radialGradient id="gi-st-core" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#e9d2ad" stopOpacity=".55" /><stop offset="100%" stopColor="#b98a52" stopOpacity="0" /></radialGradient>
          <filter id="gi-st-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <pattern id="gi-st-grid" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M22 0 H0 V22" fill="none" stroke="#ffffff" strokeOpacity=".05" strokeWidth="1" /></pattern>
        </defs>
        <rect width="350" height="450" fill="url(#gi-st-grid)" />

        {/* 가운데 SPC 뒤: 모핑 블롭 + 퍼지는 고리 */}
        <motion.path d={blob(1, 175, 178, 62, 0.22)} fill="url(#gi-st-core)" animate={{ d: [blob(1, 175, 178, 62, 0.22), blob(4, 175, 178, 66, 0.26), blob(7, 175, 178, 60, 0.2), blob(1, 175, 178, 62, 0.22)] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
        {[0, 1].map((i) => (
          <motion.circle key={i} cx="175" cy="178" r="58" fill="none" stroke="#e9d2ad" strokeOpacity=".35" strokeWidth="1" initial={{ scale: 0.7 }} animate={seen ? { scale: [0.7, 1.35] } : {}} transition={{ duration: 3.2, delay: i * 1.6, repeat: Infinity, ease: "easeOut" }} style={{ transformOrigin: "175px 178px", transformBox: "view-box" }} />
        ))}

        {/* 연결선: 그려지며 등장 → 흐르는 점선 → 빛 입자 */}
        {ST_LINES.map((l, i) => (
          <g key={l.d}>
            <motion.path d={l.d} stroke={`url(#gi-st-g${i})`} strokeWidth="2.4" strokeLinecap="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: seen ? 1 : 0 }} transition={{ duration: 0.9, delay: 0.4 + i * 0.15, ease: EASE }} />
            <path d={l.d} stroke="#ffffff" strokeOpacity=".55" strokeWidth="1" strokeDasharray="2 7" fill="none" className="gi-flow" />
            {seen && [0, 1].map((j) => (
              <circle key={j} r="3.4" fill={j ? l.to : l.from} filter="url(#gi-st-glow)">
                <animateMotion dur={`${1.8 + i * 0.15}s`} begin={`${j * 0.9 + i * 0.2}s`} repeatCount="indefinite" path={l.d} />
              </circle>
            ))}
          </g>
        ))}

        {/* 노드 */}
        {ST_NODES.map((n, i) => {
          const on = active === i;
          const big = n.k === "spc";
          const h = big ? 56 : 56;
          const narrow = n.w < 100;
          const [t, sub] = lang === "en" ? n.en : n.ko;
          return (
            <motion.g key={n.k} onClick={() => { setManual(true); setStep(ST_ORDER.indexOf(i)); }} style={{ cursor: "pointer", transformOrigin: `${n.x + n.w / 2}px ${n.y + h / 2}px`, transformBox: "view-box" }}
              initial={{ scale: 0.5 }} animate={{ scale: seen ? (on ? 1.07 : 1) : 0.5 }} transition={{ duration: 0.6, delay: seen && !manual ? 0 : 0.15 + i * 0.1, ease: EASE }}>
              <rect x={n.x} y={n.y} width={n.w} height={h} rx="12" fill={big ? "#34422a" : "#27321c"} stroke={n.c} strokeWidth={on ? 2.2 : 1} strokeOpacity={on ? 1 : 0.55} filter={on ? "url(#gi-st-glow)" : undefined} />
              {narrow ? (
                <>
                  <g transform={`translate(${n.x + n.w / 2} ${n.y + 15})`}><StIcon k={n.k} c={n.c} /></g>
                  <text x={n.x + n.w / 2} y={n.y + 37} textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#ffffff">{t}</text>
                  <text x={n.x + n.w / 2} y={n.y + 49} textAnchor="middle" fontSize="8.5" fill="#b3bca3">{sub}</text>
                </>
              ) : (
                <>
                  <circle cx={n.x + 24} cy={n.y + h / 2} r="14" fill={n.c} fillOpacity=".16" stroke={n.c} strokeOpacity=".5" />
                  <g transform={`translate(${n.x + 24} ${n.y + h / 2})`}><StIcon k={n.k} c={n.c} /></g>
                  <text x={n.x + 46} y={n.y + 25} fontSize={big ? 12.5 : 13} fontWeight="800" fill={big ? "#e9d2ad" : "#ffffff"}>{t}</text>
                  <text x={n.x + 46} y={n.y + 40} fontSize="9" fill="#b3bca3">{sub}</text>
                </>
              )}
            </motion.g>
          );
        })}
      </svg>

      {/* 단계 표시 + 설명 */}
      <div className="relative mt-2 flex justify-center gap-1.5">
        {ST_ORDER.map((ni, i) => (
          <button key={ni} aria-label={`${i + 1}`} onClick={() => { setManual(true); setStep(i); }} className="h-1.5 rounded-full" style={{ width: step === i ? 22 : 8, background: step === i ? ST_NODES[ni].c : "#48573a", transition: "width .4s, background .4s" }} />
        ))}
      </div>
      <div className="relative mt-4 min-h-[76px] overflow-hidden px-2">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={`${active}-${lang}`} initial={{ y: 24 }} animate={{ y: 0 }} exit={{ y: -24 }} transition={{ duration: 0.35, ease: EASE }}>
            <div className="flex items-center gap-2 text-[15px] font-extrabold text-white">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: node.c }} />
              <span className="gi-en text-[10px]" style={{ color: node.c }}>{`0${step + 1}`}</span>
              {(lang === "en" ? node.en : node.ko)[0]}
            </div>
            <p className="mt-1.5 text-[13.5px] leading-[1.7]" style={{ color: "#c8cfb9" }}>{lang === "en" ? node.den : node.dko}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* 섹터 비중 도넛: 선이 차오르고, 누르는 항목에 따라 가운데 숫자가 바뀐다 */
function Donut() {
  const lang = useLang();
  const label = (i: number) => pick(lang, SECTORS[i].t, SECTORS_EN[i]);
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-60px" });
  const [on, setOn] = useState(0);
  const R = 62, C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <div ref={ref} className="mt-8 grid grid-cols-[150px_1fr] items-center gap-5">
      <svg viewBox="0 0 160 160" className="w-full">
        <g transform="rotate(-90 80 80)">
          <circle cx="80" cy="80" r={R} fill="none" stroke="#ecebe7" strokeWidth="18" />
          {SECTORS.map((s, i) => {
            const len = (s.v / 100) * C, off = acc; acc += len;
            return <motion.circle key={s.t} cx="80" cy="80" r={R} fill="none" stroke={s.c} strokeDashoffset={-off}
              initial={{ strokeDasharray: `0 ${C}`, strokeWidth: 18 }} animate={{ strokeDasharray: seen ? `${len - 1.5} ${C - len + 1.5}` : `0 ${C}`, strokeWidth: on === i ? 24 : 18 }}
              transition={{ duration: 0.9, delay: seen ? 0.2 + i * 0.2 : 0, ease: EASE, strokeWidth: { duration: 0.3 } }} onClick={() => setOn(i)} style={{ cursor: "pointer" }} />;
          })}
        </g>
        <motion.text key={on} x="80" y="84" textAnchor="middle" fontSize="28" fontWeight="800" fill="#0b0c0e" initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ duration: 0.4, ease: EASE }} style={{ transformOrigin: "80px 76px", transformBox: "view-box" }}>{SECTORS[on].v}%</motion.text>
        <text x="80" y="103" textAnchor="middle" fontSize="11" fill="#5f6670">{label(on)}</text>
      </svg>
      <ul className="space-y-2.5">
        {SECTORS.map((s, i) => (
          <li key={s.t}>
            <button onClick={() => setOn(i)} className="flex w-full items-center gap-2.5 text-left text-[14px]" style={{ color: on === i ? "var(--gi-black)" : "var(--gi-sub)", fontWeight: on === i ? 800 : 500 }}>
              <span className="h-3 w-3 shrink-0" style={{ background: s.c }} />{label(i)}<span className="ml-auto">{s.v}%</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* 사례 카드: 옆으로 넘기기 (코람코식) */
function Cases() {
  const lang = useLang();
  return (
    <div className="gi-noscroll -mx-5 mt-8 flex snap-x snap-mandatory scroll-pl-5 gap-3 overflow-x-auto px-5 pb-2">
      {CASES.map((c0, i) => { const c = lang === "en" ? { ...c0, ...CASES_EN[i] } : c0; return (
        <motion.article key={c.t} className="w-[78%] shrink-0 snap-start border" style={{ borderColor: "var(--gi-line)", background: "#fff" }}
          initial={{ y: 30 }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}>
          <Visual k={c.img} variant={i + 1} className="h-[180px]" tag={c.tag} />
          <div className="p-4">
            <div className="text-[17px] font-extrabold leading-[1.35]" style={{ color: "var(--gi-black)" }}>{c.t}</div>
            <p className="mt-2 text-[13px] leading-[1.7]" style={{ color: "var(--gi-sub)" }}>{c.d}</p>
            <dl className="mt-3 grid grid-cols-2 border-t pt-3 text-[12px]" style={{ borderColor: "var(--gi-line)" }}>
              <div><dt style={{ color: "var(--gi-sub)" }}>{pick(lang, "규모", "Size")}</dt><dd className="mt-0.5 text-[15px] font-extrabold" style={{ color: "var(--gi-black)" }}>{c.size}</dd></div>
              <div><dt style={{ color: "var(--gi-sub)" }}>{pick(lang, "역할", "Role")}</dt><dd className="mt-0.5 font-bold" style={{ color: "var(--gi-copper)" }}>{c.role}</dd></div>
            </dl>
          </div>
        </motion.article>
      ); })}
    </div>
  );
}

/* 남색 거점(HUB) 모션그래픽 — 첫 시안의 메인 그래픽을 문의 아래 띠로 */
function HubBand() {
  const lang = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref} className="relative mt-6 h-[280px]">
      <motion.div className="absolute inset-0 overflow-hidden" style={{ background: "#2b3620" }} initial={{ clipPath: "inset(0% 0% 100% 0%)" }} animate={{ clipPath: seen ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" }} transition={{ duration: 1.1, ease: EASE }}>
        <HubScene />
        <LiveBlob fill="rgba(201,154,98,.22)" seeds={[1, 4, 7, 2]} dur={11} className="pointer-events-none absolute -left-16 -top-14 h-[200px] w-[200px]" />
        <LiveBlob fill="rgba(60,74,44,.45)" seeds={[3, 6, 9, 5]} dur={13} r={78} className="pointer-events-none absolute -right-16 top-1/3 h-[220px] w-[220px]" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-4 pb-3" style={{ background: "linear-gradient(180deg, rgba(22,28,16,0) 0%, rgba(22,28,16,.85) 100%)" }}>
          <span className="gi-en text-[10px] font-bold" style={{ color: "var(--gi-sand)" }}>GLOBAL INFRA HUB</span>
          <span className="text-[12px] text-white/80">{pick(lang, "사람과 자본, 자산을 잇는 거점", "Connecting people, capital and assets")}</span>
        </div>
      </motion.div>
    </div>
  );
}

function PrinWatch({ onSeen }: { onSeen: () => void }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => { if (seen) onSeen(); }, [seen, onSeen]);
  return <span ref={ref} className="block h-px" />;
}

/* 한/영 전환 버튼: 동그란 표시가 미끄러지듯 옮겨 간다 */
function LangSwitch({ lang, set, dark = false }: { lang: Lang; set: (l: Lang) => void; dark?: boolean }) {
  return (
    <div role="group" aria-label="Language" className="relative inline-flex h-8 items-center rounded-full border p-[3px] text-[11px] font-bold" style={{ borderColor: dark ? "#56634a" : "var(--gi-line)" }}>
      {(["ko", "en"] as Lang[]).map((l) => (
        <button key={l} onClick={() => set(l)} aria-pressed={lang === l} className="relative z-10 h-full w-9 rounded-full" style={{ color: lang === l ? "#fff" : dark ? "#a6af96" : "var(--gi-sub)" }}>
          {lang === l && <motion.span layoutId={dark ? "gi-lang-d" : "gi-lang"} className="absolute inset-0 -z-10 rounded-full" style={{ background: dark ? "var(--gi-copper)" : "var(--gi-ink)" }} transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
          {l === "ko" ? "KO" : "EN"}
        </button>
      ))}
    </div>
  );
}

/* ───────── 통합 솔루션 · 포트폴리오 · 보수 구조 (2026-11 확장) ───────── */
const SOLUTIONS = [
  { no: "01", en: "LISTED-CO M&A · CAPITAL", ko: "상장사 M&A · 투자유치", eko: "Listed-Company M&A · Capital", c: "#5b9cf0",
    dko: "상장사 네트워크를 바탕으로 인수·매각과 투자유치를 연결하고, 거래 구조와 조건을 설계합니다.",
    den: "Backed by a network of listed companies, we connect acquisitions, sales and investment, and design deal structures and terms.",
    iko: ["인수·매각 자문 및 상대방 발굴", "상장사 투자유치 연계", "메자닌(CB·BW)·유상증자 구조 검토", "실사·계약 구조 자문"],
    ien: ["Buy/sell-side advisory & counterpart sourcing", "Listed-company investment links", "Mezzanine (CB·BW) & rights-issue review", "DD & contract structuring"] },
  { no: "02", en: "RESTRUCTURING", ko: "기업 구조조정", eko: "Corporate Restructuring", c: "#f0a45a",
    dko: "재무구조를 진단하고, 상장적격성 실질심사·개선계획처럼 시간이 걸린 문제를 서류와 구조로 풀어 갑니다.",
    den: "We diagnose capital structure and resolve long-running issues — listing-eligibility reviews, improvement plans — with documents and structure.",
    iko: ["재무구조·부채 진단", "개선계획·소명 자료 작성 지원", "자산 매각·부채 재조정 구조", "경영 정상화 로드맵"],
    ien: ["Capital & debt diagnosis", "Improvement-plan support documents", "Asset sale & debt rescheduling", "Normalization roadmap"] },
  { no: "03", en: "BUSINESS PLAN · IR", ko: "사업계획서 · IR", eko: "Business Plan · IR", c: "#3cc3a8",
    dko: "투자자가 숫자로 납득할 수 있는 사업계획서와 IR 자료를 국문·영문으로 만듭니다.",
    den: "Business plans and IR materials — in Korean and English — that investors can verify in numbers.",
    iko: ["사업계획서", "IR 자료(국문·영문)", "회사소개서", "재무 시뮬레이션"],
    ien: ["Business plans", "IR decks (KO·EN)", "Company profiles", "Financial simulations"] },
  { no: "04", en: "REVIEW · VALUATION", ko: "검토보고서 · 가치평가", eko: "Review Reports · Valuation", c: "#a58cf2",
    dko: "등기부·재무제표·계약서를 원본과 대조한 검토보고서를 만들고, 가치평가는 공인 회계법인·감정평가법인과 연계해 발행합니다.",
    den: "Review reports cross-checked against registries, financial statements and contracts; valuations issued with licensed accounting and appraisal firms.",
    iko: ["원본 대조 검토보고서", "담보·권리관계 분석", "가치평가 가정·자료 준비", "외부 평가기관 연계 발행"],
    ien: ["Source-verified review reports", "Collateral & title analysis", "Valuation assumptions & data prep", "Issued with licensed firms"] },
];

function SolIcon({ i, c }: { i: number; c: string }) {
  const p = { fill: "none", stroke: c, strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths = [
    "M-9 7 L-3 1 L1 5 L9 -4 M4 -4 H9 V1",
    "M-8 -3 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0 M-2 3 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0",
    "M-7 -9 H4 L8 -5 V9 H-7 Z M-4 -2 H5 M-4 2 H5 M-4 6 H1",
    "M-3 -3 m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 M1.5 1.5 L8 8",
    "M-9 -7 H9 V5 H-9 Z M-3 9 H3 M0 5 V9 M-2 -3 L3 -1 L-2 1 Z",
  ];
  return <g {...p}><path d={paths[i]} /></g>;
}

function Solutions() {
  const lang = useLang();
  const [open, setOpen] = useState(0);
  return (
    <section id="solutions" className="px-5 pt-20 pb-16" style={{ background: "#fff" }}>
      <Kicker>ADVISORY SIDE · SOLUTIONS</Kicker>
      <h2 className="mt-5 text-[34px] font-extrabold leading-[1.18] tracking-[-0.03em]" style={{ color: "var(--gi-black)" }}><Lift>{lang === "en" ? "From assets" : "자산에서"}</Lift><Lift delay={0.08}>{lang === "en" ? "to companies." : "기업까지."}</Lift></h2>
      <p className="mt-5 max-w-[34ch] text-[14.5px] leading-[1.8]" style={{ color: "var(--gi-sub)" }}>{pick(lang, "상장사 M&A와 구조조정, 사업계획서·IR·검토보고서·가치평가까지 한 팀이 끝까지 맡습니다. 지금 투자유치 중인 프로젝트도 직접 열어 보실 수 있습니다.", "One team carries listed-company M&A, restructuring, business plans, IR, review reports and valuation through to the end — and you can open the projects we are raising for right now.")}</p>
      {/* 서비스 바로가기 — 이름만 한 줄로 (The Boundary식) */}
      <div className="mt-8 text-[17px] font-bold leading-[1.9]" style={{ color: "#b4b7bc" }}>
        {SOLUTIONS.map((s, i) => (
          <span key={s.no}>
            <button onClick={() => setOpen(i)} className="transition-colors" style={{ color: open === i ? "var(--gi-black)" : undefined }}>{lang === "en" ? s.eko : s.ko}</button>
            {i < SOLUTIONS.length - 1 && <span className="mx-2 font-light">/</span>}
          </span>
        ))}
      </div>
      <div className="mt-8 border-t" style={{ borderColor: "var(--gi-black)" }}>
        {SOLUTIONS.map((s, i) => {
          const on = open === i;
          return (
            <div key={s.no} className="border-b" style={{ borderColor: "var(--gi-line)" }}>
              <button onClick={() => setOpen(on ? -1 : i)} className="flex w-full items-baseline gap-4 py-6 text-left">
                <span className="gi-en w-6 shrink-0 text-[11px] font-bold" style={{ color: "var(--gi-copper)" }}>{s.no}</span>
                <span className="flex-1">
                  <span className="block text-[22px] font-extrabold tracking-[-0.02em]" style={{ color: "var(--gi-black)" }}>{lang === "en" ? s.eko : s.ko}</span>
                  {lang === "ko" && <span className="gi-en mt-1 block text-[10px] font-semibold" style={{ color: "var(--gi-sub)" }}>{s.en}</span>}
                </span>
                <motion.span animate={{ rotate: on ? 45 : 0 }} transition={{ duration: 0.3 }} className="text-[26px] font-light leading-none" style={{ color: "var(--gi-black)" }}>+</motion.span>
              </button>
              <AnimatePresence initial={false}>
                {on && (
                  <motion.div key="d" className="overflow-hidden" initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.45, ease: EASE }}>
                    <div className="pb-7 pl-10">
                      <p className="text-[15px] leading-[1.8]" style={{ color: "var(--gi-text)" }}>{lang === "en" ? s.den : s.dko}</p>
                      <ul className="mt-4">
                        {(lang === "en" ? s.ien : s.iko).map((it) => (
                          <li key={it} className="flex items-center justify-between border-t py-3 text-[14px]" style={{ borderColor: "var(--gi-line)" }}>{it}<span style={{ color: "var(--gi-copper)" }}><Arrow size={15} /></span></li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      <button onClick={() => { const el = document.getElementById("contact"); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 56, behavior: "smooth" }); }} className="mt-10 inline-flex items-center gap-3 border px-5 py-3.5 text-[14.5px] font-bold" style={{ borderColor: "var(--gi-black)", color: "var(--gi-black)" }}>{pick(lang, "딜 상담하기", "Discuss your deal")} <Arrow /></button>
    </section>
  );
}

/* ───────── 사업 구조: 자산 쪽 + 자문 쪽 → 딜 클로징 (2026-11-27 재구성) ───────── */
const PILLARS = [
  { side: "ASSET SIDE", ko: "자산 쪽", en: "Asset side", c: "#9fc46a", go: "rwa", img: "develop",
    dko: "실물자산을 발굴·검증하고, 투자할 수 있는 구조로 만듭니다.", den: "We source and verify real assets and turn them into investable structures.",
    items: [["부동산 개발 RWA", "Real estate development RWA"], ["엣지 AI 데이터센터 RWA", "Edge AI data center RWA"], ["NPL 부실채권 RWA", "NPL RWA"]] },
  { side: "ADVISORY SIDE", ko: "자문 쪽", en: "Advisory side", c: "#5b9cf0", go: "ma", img: "advisory",
    dko: "상장사의 경영권과 자본 구조를 설계하고, 딜을 성사시킵니다.", den: "We design control and capital structures for listed companies and get deals done.",
    items: [["상장사 M&A · 투자유치", "Listed-company M&A · capital"], ["기업 구조조정", "Corporate restructuring"], ["사업계획서 · IR · 가치평가", "Plans · IR · valuation"]] },
];
const CLOSE_FLOW = [["발굴", "Source"], ["구조화", "Structure"], ["자본 연결", "Capital"], ["클로징", "Close"], ["사후관리", "After-care"]];

function Pillars({ onGo }: { onGo: (id: string) => void }) {
  const lang = useLang();
  return (
    <section id="business" className="px-5 pt-16 pb-16" style={{ background: "var(--gi-paper)" }}>
      <Kicker>HOW WE WORK</Kicker>
      <h2 className="mt-4 text-[30px] font-extrabold leading-[1.25] tracking-[-0.025em]" style={{ color: "var(--gi-black)" }}><Lift>{lang === "en" ? "From sourcing assets" : "자산 발굴부터"}</Lift><Lift delay={0.08}><span style={{ color: "var(--gi-copper)" }}>{lang === "en" ? "to deal closing." : "딜 클로징까지."}</span></Lift></h2>
      <p className="mt-5 max-w-[34ch] text-[14.5px] leading-[1.8]" style={{ color: "var(--gi-sub)" }}>{pick(lang, "자산 쪽에서 찾은 실물자산을 자문 쪽이 상장사의 신사업·자본 구조와 연결합니다. 한 회사가 처음부터 끝까지 맡기 때문에 딜이 중간에 끊기지 않습니다.", "Assets sourced on one side are connected by the advisory side to listed companies' new businesses and capital structures. One firm carries the deal end to end, so nothing falls through the gaps.")}</p>

      <div className="mt-9 space-y-3">
        {PILLARS.map((p, i) => (
          <Rise key={p.side} delay={i * 0.08}>
            <div className="bg-white">
              <Visual k={p.img} variant={i + 1} className="h-[180px]" />
              <motion.div className="h-[3px] origin-left" style={{ background: p.c }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.15 + i * 0.1, ease: EASE }} />
              <div className="p-5">
                <div className="flex items-baseline justify-between">
                  <span className="gi-en text-[10px] font-bold" style={{ color: p.c }}>{p.side}</span>
                  <span className="gi-en text-[10px] font-bold" style={{ color: "#b4b7bc" }}>0{i + 1}</span>
                </div>
                <div className="mt-2 text-[23px] font-extrabold tracking-[-0.02em]" style={{ color: "var(--gi-black)" }}>{lang === "en" ? p.en : p.ko}</div>
                <p className="mt-2 text-[14px] leading-[1.7]" style={{ color: "var(--gi-sub)" }}>{lang === "en" ? p.den : p.dko}</p>
                <ul className="mt-4">
                  {p.items.map(([k, e]) => (
                    <li key={k} className="flex items-center gap-3 border-t py-3 text-[14.5px] font-semibold" style={{ borderColor: "var(--gi-line)", color: "var(--gi-text)" }}><span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: p.c }} />{lang === "en" ? e : k}</li>
                  ))}
                </ul>
                <button onClick={() => onGo(p.go)} className="mt-3 inline-flex items-center gap-2 text-[13.5px] font-bold" style={{ color: "var(--gi-black)" }}>{pick(lang, "자세히 보기", "Learn more")} <Arrow size={15} /></button>
              </div>
            </div>
          </Rise>
        ))}
      </div>

      {/* 두 줄기가 하나로 모이는 그림 */}
      <svg viewBox="0 0 350 120" className="mt-2 block w-full" aria-hidden="true">
        <path d="M70 0 C70 60, 175 50, 175 96" fill="none" stroke="#9fc46a" strokeWidth="2" strokeDasharray="6 6" className="gi-flow" />
        <path d="M280 0 C280 60, 175 50, 175 96" fill="none" stroke="#5b9cf0" strokeWidth="2" strokeDasharray="6 6" className="gi-flow" />
        <circle cx="175" cy="104" r="9" fill="var(--gi-copper)" className="gi-node" />
        <circle cx="175" cy="104" r="4" fill="#fff" />
      </svg>
      <div className="text-center">
        <div className="gi-en text-[11px] font-bold" style={{ color: "var(--gi-copper)" }}>DEAL CLOSING</div>
        <div className="mt-1 text-[19px] font-extrabold" style={{ color: "var(--gi-black)" }}>{pick(lang, "하나의 딜로 완성", "Completed as one deal")}</div>
      </div>
      <ol className="mt-7 grid grid-cols-5 gap-1.5">
        {CLOSE_FLOW.map(([k, e], i) => (
          <li key={k}>
            <div className="h-[3px] overflow-hidden" style={{ background: "var(--gi-line)" }}>
              <motion.div className="h-full origin-left" style={{ background: "var(--gi-black)" }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 * i, ease: EASE }} />
            </div>
            <div className="gi-en mt-2 text-[9px] font-bold" style={{ color: "var(--gi-sub)" }}>0{i + 1}</div>
            <div className="mt-0.5 text-[12.5px] font-bold" style={{ color: "var(--gi-black)" }}>{lang === "en" ? e : k}</div>
          </li>
        ))}
      </ol>

      {/* GIIB만의 연결 */}
      <Rise>
        <div className="mt-10 p-5 text-white" style={{ background: "#1c2414" }}>
          <div className="gi-en text-[10px] font-bold" style={{ color: "var(--gi-sand)" }}>THE GIIB LINK</div>
          <div className="mt-3 text-[20px] font-extrabold leading-[1.4]">{lang === "en" ? <>Real assets <span style={{ color: "var(--gi-sand)" }}>×</span> listed-company M&amp;A</> : <>실물자산 <span style={{ color: "var(--gi-sand)" }}>×</span> 상장사 M&amp;A</>}</div>
          <p className="mt-3 text-[14px] leading-[1.75] text-white/75">{pick(lang, "발굴한 데이터센터·부동산·NPL 자산을 상장사의 신사업으로 편입하면, 상장사는 성장 스토리를 얻고 자산은 확실한 출구를 얻습니다. 두 쪽을 함께 가진 회사만 할 수 있는 딜입니다.", "When sourced data-center, real-estate and NPL assets are folded into a listed company's new business, the company gains a growth story and the asset gains a clear exit — a deal only a firm with both sides can do.")}</p>
        </div>
      </Rise>
    </section>
  );
}

/* ───────── 상장사 M&A — 특화 섹션 ───────── */
const MA_SERVICES = [
  ["경영권 인수·매각", "Control acquisitions & sales", "인수 후보·매각 상대 발굴, 가격·조건 협상"],
  ["제3자배정 유상증자", "Third-party rights issues", "투자자 연결, 납입·보호예수 구조 설계"],
  ["CB · BW 메자닌", "CB · BW mezzanine", "전환·상환 조건, 담보·리픽싱 구조 검토"],
  ["상장적격성 · 개선계획", "Listing review · improvement plans", "실질심사 대응 자료, 개선계획 이행 설계"],
  ["신사업 · 실물자산 편입", "New business & asset injection", "RWA 자산을 상장사 신사업으로 연결"],
  ["공시 · IR · 주주 소통", "Disclosure · IR · shareholders", "공시 일정, IR 자료, 주주 설명 자료"],
] as const;
const MA_SERVICES_EN_D = ["Sourcing buyers and targets, negotiating price and terms", "Investor introductions, payment and lock-up structuring", "Conversion, redemption, collateral and refixing review", "Review-response materials, improvement-plan design", "Linking RWA assets to a listed company's new business", "Disclosure calendar, IR decks, shareholder materials"];
const MA_STEPS = [
  ["타깃 · 밸류에이션", "Target · valuation", "인수·매각 대상과 상대방을 찾고, 재무·지분 구조를 분석해 적정 가치를 잡습니다.", "We find targets and counterparties, analyze financials and shareholding, and set a fair value."],
  ["거래 구조 설계", "Deal structure", "구주 인수, 유상증자, 메자닌을 조합해 자금 부담과 경영권 안정성을 함께 맞춥니다.", "We combine share purchases, rights issues and mezzanine to balance funding and control."],
  ["자금 · 투자자 연결", "Capital · investors", "상장사 네트워크와 금융기관을 연결해 인수 자금과 투자자를 확보합니다.", "We line up acquisition funding and investors through our listed-company and financial network."],
  ["실사 · 계약", "Due diligence · contracts", "등기부·재무제표·계약서를 원본과 대조해 숨은 위험을 찾고 계약에 반영합니다.", "Registries, financials and contracts are checked against originals; hidden risks go into the contract."],
  ["이사회 · 공시 · 클로징", "Board · disclosure · closing", "이사회·주총 결의와 공시 일정을 맞춰 잔금과 경영권 이전을 마무리합니다.", "Board and shareholder resolutions and the disclosure calendar are aligned to close payment and control transfer."],
  ["PMI · 신사업 정착", "PMI · new business", "인수 후 신사업과 실물자산을 실제 매출로 연결해 기업가치를 끌어올립니다.", "After closing, new businesses and assets are turned into real revenue to lift corporate value."],
];

function ListedMA() {
  const lang = useLang();
  const [step, setStep] = useState(0);
  const S = MA_STEPS[step];
  return (
    <section id="ma" className="px-5 pt-20 pb-16 text-white" style={{ background: "#141a0e" }}>
      <Kicker light>LISTED-COMPANY M&amp;A</Kicker>
      <h2 className="mt-5 text-[34px] font-extrabold leading-[1.18] tracking-[-0.03em]"><Lift>{lang === "en" ? "Listed-company M&A," : "상장사 M&A,"}</Lift><Lift delay={0.08}><span style={{ color: "var(--gi-sand)" }}>{lang === "en" ? "structure to disclosure." : "구조부터 공시까지."}</span></Lift></h2>
      <p className="mt-5 max-w-[34ch] text-[14.5px] leading-[1.8] text-white/70">{pick(lang, "코스피·코스닥 상장사와 직접 연결된 네트워크로 경영권 거래, 자본 조달, 신사업 편입을 한 흐름으로 설계합니다.", "Through a network directly connected to KOSPI and KOSDAQ companies, we design control deals, capital raising and new-business injection as one flow.")}</p>

      {SRC("ma") && <Visual k="ma" className="mt-8 h-[220px]" />}
      <div className="mt-9 grid grid-cols-3 border-t" style={{ borderColor: "rgba(233,210,173,.35)" }}>
        {([[<><Count to={10} />+</>, pick(lang, "직접 연결된 상장사", "Listed companies, direct")], ["2", pick(lang, "코스피 · 코스닥", "KOSPI · KOSDAQ")], ["6", pick(lang, "단계 전 과정 수행", "Steps, end to end")]] as [ReactNode, string][]).map(([a, b], i) => (
          <div key={b} className="pt-4" style={{ borderLeft: i ? "1px solid rgba(255,255,255,.12)" : "none", paddingLeft: i ? 12 : 0 }}>
            <div className="text-[34px] font-extrabold leading-none tracking-[-0.03em]" style={{ color: i === 0 ? "var(--gi-sand)" : "#fff" }}>{a}</div>
            <div className="mt-2 text-[11.5px] leading-[1.4] text-white/60">{b}</div>
          </div>
        ))}
      </div>

      {/* 서비스 6칸 */}
      <div className="mt-10 grid grid-cols-2 gap-px" style={{ background: "rgba(255,255,255,.1)" }}>
        {MA_SERVICES.map(([k, e, d], i) => (
          <Rise key={k} delay={(i % 2) * 0.06}>
            <div className="h-full p-4" style={{ background: "#141a0e" }}>
              <div className="gi-en text-[10px] font-bold" style={{ color: "var(--gi-sand)" }}>0{i + 1}</div>
              <div className="mt-2 text-[15px] font-bold leading-[1.35]">{lang === "en" ? e : k}</div>
              <div className="mt-1.5 text-[12px] leading-[1.55] text-white/55">{lang === "en" ? MA_SERVICES_EN_D[i] : d}</div>
            </div>
          </Rise>
        ))}
      </div>

      {/* 딜 진행 6단계 — 눌러서 보기 */}
      <div className="mt-12">
        <div className="gi-en text-[10px] font-bold" style={{ color: "var(--gi-sand)" }}>DEAL TIMELINE</div>
        <div className="mt-4 flex gap-1.5">
          {MA_STEPS.map((s, i) => (
            <button key={s[0]} onClick={() => setStep(i)} className="flex-1 text-left" aria-label={lang === "en" ? s[1] : s[0]}>
              <div className="h-[4px] overflow-hidden" style={{ background: "rgba(255,255,255,.14)" }}>
                <motion.div className="h-full origin-left" style={{ background: "var(--gi-sand)" }} animate={{ scaleX: i <= step ? 1 : 0 }} transition={{ duration: 0.4, ease: EASE }} />
              </div>
              <div className="gi-en mt-2 text-[10px] font-bold" style={{ color: i === step ? "var(--gi-sand)" : "rgba(255,255,255,.4)" }}>0{i + 1}</div>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={step} initial={{ x: 20 }} animate={{ x: 0 }} exit={{ x: -20 }} transition={{ duration: 0.3, ease: EASE }} className="mt-4 min-h-[118px]">
            <div className="text-[21px] font-extrabold">{lang === "en" ? S[1] : S[0]}</div>
            <p className="mt-2 text-[14px] leading-[1.75] text-white/75">{lang === "en" ? S[3] : S[2]}</p>
          </motion.div>
        </AnimatePresence>
        <div className="mt-2 flex gap-2">
          <button onClick={() => setStep((s) => Math.max(0, s - 1))} className="border px-4 py-2.5 text-[13px] font-bold" style={{ borderColor: "rgba(255,255,255,.3)" }}>←</button>
          <button onClick={() => setStep((s) => Math.min(MA_STEPS.length - 1, s + 1))} className="flex-1 border px-4 py-2.5 text-[13px] font-bold" style={{ borderColor: "var(--gi-sand)", color: "var(--gi-sand)" }}>{pick(lang, "다음 단계 →", "Next step →")}</button>
        </div>
      </div>

      {/* 왜 GIIB */}
      <ul className="mt-12 border-t" style={{ borderColor: "rgba(255,255,255,.14)" }}>
        {[[pick(lang, "상장사 네트워크", "Listed-company network"), pick(lang, "매수자·매도자·투자자를 직접 연결합니다.", "We connect buyers, sellers and investors directly.")], [pick(lang, "원본 대조 검증", "Source-verified"), pick(lang, "등기부·재무제표·계약서를 원본과 맞춰 봅니다.", "Registries, financials and contracts checked against originals.")], [pick(lang, "자산 파이프라인", "Asset pipeline"), pick(lang, "RWA 자산이 상장사 신사업의 재료가 됩니다.", "RWA assets become material for listed companies' new businesses.")]].map(([k, v]) => (
          <li key={k} className="flex gap-4 border-b py-4" style={{ borderColor: "rgba(255,255,255,.14)" }}>
            <span className="w-[104px] shrink-0 text-[14px] font-bold" style={{ color: "var(--gi-sand)" }}>{k}</span>
            <span className="flex-1 text-[13.5px] leading-[1.65] text-white/75">{v}</span>
          </li>
        ))}
      </ul>
      <button onClick={() => { const el = document.getElementById("contact"); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 56, behavior: "smooth" }); }} className="mt-9 flex w-full items-center justify-between px-5 py-4 text-[15px] font-bold" style={{ background: "var(--gi-sand)", color: "#141a0e" }}>{pick(lang, "상장사 M&A 상담하기", "Discuss a listed-company deal")} <Arrow /></button>
    </section>
  );
}

/* ───────── RWA(실물자산 디지털 증권화) — 한 섹션 (2026-11-27) ───────── */
const RWA_LINES = [
  { no: "01", ko: "부동산 개발", en: "Real Estate Development", c: "#e9d2ad",
    dko: "인허가·부지 확보를 마친 개발 프로젝트를 SPV 단위로 구조화하고, 지분·수익권을 작은 단위로 나눠 적격 투자자에게 제공합니다.",
    den: "Permitted development projects are structured as SPVs, with equity and revenue rights split into smaller units for qualified investors.",
    rows: [["기초자산", "Underlying", "오피스 · 물류 · 주거·복합", "Office · logistics · residential & mixed-use"], ["수익원", "Returns", "분양·매각 차익, 준공 후 임대", "Sale gains, post-completion rent"], ["공시", "Disclosure", "공정률·자금 집행을 마일스톤별 공개", "Progress & spending by milestone"]] },
  { no: "02", ko: "엣지 AI 데이터센터", en: "Edge AI Data Center", c: "#9fc46a",
    dko: "AI 수요지 가까이 모듈형 데이터센터를 세우고, GPU 임대와 코로케이션 계약에서 나오는 수익을 투자 단위로 나눕니다.",
    den: "Modular data centers near AI demand, with income from GPU leasing and colocation contracts divided into investment units.",
    rows: [["기초자산", "Underlying", "모듈형 설비 · GPU 서버 · 전력·냉각", "Modular facilities · GPU servers · power & cooling"], ["수익원", "Returns", "GPU 임대, 코로케이션, 장기 용량 계약", "GPU leasing, colocation, long-term capacity"], ["검증", "Verification", "전력 사용량·가동률·PUE 정기 보고", "Power use, uptime and PUE reported regularly"]] },
  { no: "03", ko: "NPL 부실채권", en: "Non-Performing Loans", c: "#5b9cf0",
    dko: "담보가 확보된 부실채권을 풀 단위로 매입하고, 회수 현금흐름을 선순위·후순위로 나눠 위험과 수익을 고를 수 있게 합니다.",
    den: "Secured NPL pools are acquired and their recovery cash flows split into senior and subordinated tranches.",
    rows: [["기초자산", "Underlying", "부동산 담보 중심 NPL 풀", "Real-estate-backed NPL pools"], ["수익원", "Returns", "경매·공매 배당, 상환·재조정, 담보 처분", "Auction proceeds, repayment, collateral sale"], ["구조", "Structure", "선순위(안정) · 후순위(수익) 트랜치", "Senior (stability) · subordinated (upside)"]] },
];
const RWA_FLOW = [["자산 데이터", "Asset data"], ["독립 검증", "Independent check"], ["디지털 증권화", "Digital securities"], ["정산·보고", "Settlement · reports"]];

function Rwa() {
  const lang = useLang();
  const [tab, setTab] = useState(0);
  const L = RWA_LINES[tab];
  return (
    <section id="rwa" className="px-5 pt-20 pb-16" style={{ background: "#1c2414", color: "#f1f0e8" }}>
      <Kicker light>ASSET SIDE · REAL-WORLD ASSETS</Kicker>
      <h2 className="mt-5 text-[34px] font-extrabold leading-[1.18] tracking-[-0.03em]"><Lift>{lang === "en" ? "Real assets," : "실물자산을,"}</Lift><Lift delay={0.08}><span style={{ color: "var(--gi-sand)" }}>{lang === "en" ? "made investable." : "투자 기회로."}</span></Lift></h2>
      <p className="mt-5 max-w-[34ch] text-[14.5px] leading-[1.8]" style={{ color: "#c9cbbd" }}>{pick(lang, "검증된 데이터를 바탕으로 부동산 개발, 엣지 AI 데이터센터, 부실채권을 디지털 증권(RWA) 형태의 투자 기회로 구조화합니다.", "Built on verified data, we structure real estate development, edge AI data centers and NPLs into digital-security (RWA) opportunities.")}</p>

      {/* 3대 자산 탭 */}
      <div className="mt-9 flex border-b" style={{ borderColor: "rgba(241,240,232,.18)" }}>
        {RWA_LINES.map((r, i) => (
          <button key={r.no} onClick={() => setTab(i)} className="relative flex-1 pb-3 text-left">
            <span className="gi-en block text-[10px] font-bold" style={{ color: tab === i ? r.c : "#7d826f" }}>{r.no}</span>
            <span className="mt-1 block text-[13.5px] font-bold leading-[1.3]" style={{ color: tab === i ? "#fff" : "#9a9e8d" }}>{lang === "en" ? r.en : r.ko}</span>
            {tab === i && <motion.span layoutId="gi-rwa-bar" className="absolute bottom-[-1px] left-0 h-[2px] w-full" style={{ background: r.c }} transition={{ duration: 0.45, ease: EASE }} />}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={tab} initial={{ x: 24 }} animate={{ x: 0 }} exit={{ x: -24 }} transition={{ duration: 0.35, ease: EASE }} className="pt-7">
          {SRC(`rwa${tab + 1}`) && <Visual k={`rwa${tab + 1}`} className="mb-6 h-[200px]" />}
          <p className="text-[15px] leading-[1.8]" style={{ color: "#e4e5da" }}>{lang === "en" ? L.den : L.dko}</p>
          <dl className="mt-6">
            {L.rows.map(([k, ke, v, ve]) => (
              <div key={k} className="flex gap-4 border-t py-3.5 text-[14px]" style={{ borderColor: "rgba(241,240,232,.14)" }}>
                <dt className="w-[72px] shrink-0 font-bold" style={{ color: L.c }}>{lang === "en" ? ke : k}</dt>
                <dd className="flex-1" style={{ color: "#e4e5da" }}>{lang === "en" ? ve : v}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </AnimatePresence>

      {/* 데이터 → 증권화 흐름 */}
      <div className="mt-10 border p-5" style={{ borderColor: "rgba(241,240,232,.16)" }}>
        <div className="gi-en text-[10px] font-bold" style={{ color: "var(--gi-sand)" }}>VERIFIED DATA FIRST</div>
        <ol className="mt-4 grid grid-cols-4 gap-1.5">
          {RWA_FLOW.map(([k, e], i) => (
            <li key={k} className="relative">
              <div className="h-[3px] w-full overflow-hidden" style={{ background: "rgba(241,240,232,.12)" }}>
                <motion.div className="h-full origin-left" style={{ background: "var(--gi-sand)" }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.25 * i, ease: EASE }} />
              </div>
              <div className="gi-en mt-2 text-[9px] font-bold" style={{ color: "#7d826f" }}>0{i + 1}</div>
              <div className="mt-0.5 text-[12px] font-bold leading-[1.35]">{lang === "en" ? e : k}</div>
            </li>
          ))}
        </ol>
      </div>
      <p className="mt-6 text-[11.5px] leading-[1.7]" style={{ color: "#8e9282" }}>{pick(lang, "토큰증권의 발행·유통은 관련 법령과 인가 범위 안에서 적격 파트너와 함께 진행합니다. 본 내용은 사업 소개이며 투자 권유가 아닙니다.", "Token securities are issued and traded only within applicable law and licensing, with qualified partners. This is a business overview, not an investment solicitation.")}</p>
    </section>
  );
}


/* ───────── 비전 · 로드맵 (유이사 방향 반영, 2026-11-28) ───────── */
const ROADMAP = [
  ["지금", "NOW", "자산 쪽(RWA) + 자문 쪽(상장사 M&A) 동시 운영", "Running the asset side (RWA) and advisory side (listed M&A) together"],
  ["다음", "NEXT", "기업 인수·합병의 홀딩스 — 인수한 기업과 자산을 담는 지주 역할", "Holdings for M&A — a holding vehicle for acquired companies and assets"],
  ["목표", "GOAL", "자산운용사 또는 PE(사모펀드 운용사) 등록 추진", "Registering as an asset manager or PE (GP)"],
];
function VisionRoadmap() {
  const lang = useLang();
  return (
    <section id="vision" className="px-5 pt-16 pb-14" style={{ background: "#fff" }}>
      <Kicker>VISION · ROADMAP</Kicker>
      <h2 className="mt-4 text-[30px] font-extrabold leading-[1.25] tracking-[-0.025em]" style={{ color: "var(--gi-black)" }}>
        <Lift>{lang === "en" ? "Real estate × finance," : "부동산 × 금융,"}</Lift>
        <Lift delay={0.08}><span style={{ color: "var(--gi-copper)" }}>{lang === "en" ? "a platform for asset value." : "자산가치를 키우는 플랫폼."}</span></Lift>
      </h2>
      <p className="mt-5 max-w-[34ch] text-[14.5px] leading-[1.8]" style={{ color: "var(--gi-sub)" }}>{pick(lang, "부동산의 실물 가치와 금융의 구조화 역량을 하나로 묶어, 자산이 더 높은 가치로 거래되고 운용되도록 설계합니다.", "We combine the physical value of real estate with financial structuring, so assets trade and are managed at higher value.")}</p>
      <div className="mt-8 grid grid-cols-3 gap-2">
        {[[pick(lang, "실물자산", "Real assets"), "#9fc46a"], [pick(lang, "금융 구조화", "Structuring"), "#5b9cf0"], [pick(lang, "가치 증대", "Value up"), "var(--gi-copper)"]].map(([t, c], i) => (
          <Rise key={t} delay={i * 0.08}>
            <div className="border-t-[3px] bg-[var(--gi-paper)] px-3 py-4 text-center text-[13.5px] font-bold" style={{ borderColor: c, color: "var(--gi-black)" }}>{t}</div>
          </Rise>
        ))}
      </div>
      <ol className="relative mt-10 border-l pl-6" style={{ borderColor: "var(--gi-line)" }}>
        {ROADMAP.map(([k, e, d, de], i) => (
          <li key={k} className="relative pb-7 last:pb-0">
            <motion.span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full" style={{ background: i < 1 ? "var(--gi-copper)" : "#fff", border: "2px solid var(--gi-copper)" }} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.15 }} />
            <div className="flex items-baseline gap-2"><span className="text-[17px] font-extrabold" style={{ color: "var(--gi-black)" }}>{lang === "en" ? e : k}</span>{lang === "ko" && <span className="gi-en text-[10px] font-bold" style={{ color: "var(--gi-copper)" }}>{e}</span>}</div>
            <p className="mt-1.5 text-[14px] leading-[1.7]" style={{ color: "var(--gi-text)" }}>{lang === "en" ? de : d}</p>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-[11.5px]" style={{ color: "var(--gi-sub)" }}>{pick(lang, "‘목표’는 추진 계획이며, 등록 형태와 일정은 관계 기관 심사에 따라 확정됩니다.", "Goals are plans; registration type and timing depend on regulatory review.")}</p>
    </section>
  );
}

type ProjectLink = [ko: string, en: string, detailKo: string, detailEn: string, href: string, image?: string, englishHref?: string];

const PROJECT_LINKS: ProjectLink[] = [
      ["대양금속","Daeyang Metal","기업 사이트 샘플","Corporate website sample","https://daeyang-metal-sample.vercel.app","","https://daeyang-metal-sample.vercel.app/en"],
      ["GB LABS","GB LABS","AI 디지털 헬스케어 · 공식","AI digital health · official","https://gblabs.co.kr","gblabs"],
      ["유니코에너지그룹","UNICO ENERGY GROUP","에너지·원자재 · 공식","Energy & commodities · official","/","unico"],
      ["서부중앙시장 재개발","Seobu market redevelopment","주거·상업 재개발","Redevelopment","/seobu/m","seobu"],
      ["금촌동 The K 스마트호스텔","The K Smart Hostel (Geumchon)","숙박 · 리모델링","Hospitality · remodeling","/thek","thek"],
      ["가산 메디컬·AI 빌딩(가칭)","Gasan Medical·AI Building","오피스 리포지셔닝","Office repositioning","/gasan/m4r9","gasan"],
      ["신촌 AI 스마트호스텔","Sinchon AI Smart Hostel","숙박 · 리모델링","Hospitality · remodeling","/sinchon","hostel"],
      ["정선 AI 스마트호텔","Jeongseon AI smart hotel","호텔 · 관광","Hotel","/jeongseon","jeongseon"],
      ["해연에프엔지","Haeyeon F&G","기업 홈페이지","Corporate","/pqw8nt7","haeyeon"],
      ["K-BEAUTY EUROPA","K-BEAUTY EUROPA","K-뷰티 유럽 진출","K-beauty in Europe","https://www.gblabs.co.kr/ko/k-beauty-europa","kbeauty"],
      ["옥수 복합 개발","Oksu mixed-use","개발 · 환경","Development","/oksu","oksu"],
      ["강화 광산 인프라 소재","Ganghwa mine materials","자원 · 인프라","Resources","/r4d7k2xq","ganghwa"],
      ["MURUA KOREA","MURUA KOREA","브랜드 사이트","Brand website","https://www.gblabs.co.kr/ko/murua-korea"],
      ["솔루믹스","SOLUMIX","코넥스 상장사","KONEX-listed","/xxrhbd2","solumix"],
      ["평생주치의 케어하우스","Lifelong-care house","헬스케어 · 돌봄","Healthcare","/sinchon/orbit-care","care"],
];

const COMPANY_LINKS: ProjectLink[] = [
      ["에이전트AI","Agent AI","AI 에이전트 · 기업 홈페이지","AI agents · corporate website","https://www.agentai.xyz/"],
      ["크라우드웍스","Crowdworks","기업 홈페이지","Corporate website","https://www.crowdworks.ai/"],
      ["대호에이엘","Daeho AL","기업 홈페이지","Corporate website","https://daeho-al.com/"],
      ["제이케이시냅스(구 소니드)","JK Synapse (formerly Sonid)","기업 홈페이지","Corporate website","http://www.jksynapse.co.kr/"],
      ["스피어","Sphere","기업 홈페이지","Corporate website","https://spherecorp.kr/"],
      ["캐리(구 윌링스)","Carry (formerly Willings)","기업 홈페이지","Corporate website","https://www.willings.co.kr/"],
      ["삼아알미늄","Sama Aluminium","기업 홈페이지","Corporate website","https://www.sama-al.com/kor/"],
      ["삼이그룹","Sami Group","기업 홈페이지","Corporate website","https://topprice.kr/"],
];

function CompanyDirectory() {
  const lang = useLang();
  const reduceMotion = useReducedMotion();
  return (
    <section className="relative mt-9 pt-5">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-white/20">
        <motion.div className="h-full origin-left bg-gradient-to-r from-[#ead2a2] via-[#b98a52] to-transparent" initial={reduceMotion ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.85, ease: EASE }} />
      </div>
      <h3 className="px-2 text-[18px] font-extrabold">{pick(lang, "상장사 관련 기업 소개", "Related Company Profiles")}</h3>
      <ul className="mt-3 grid grid-cols-2 gap-2">
        {COMPANY_LINKS.map(([ko, en, detailKo, detailEn, href], index) => (
          <motion.li key={href} initial={reduceMotion ? false : { y: 12 }} whileInView={{ y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.45, delay: Math.floor(index / 2) * 0.08, ease: EASE }}>
            <motion.a whileTap={reduceMotion ? undefined : { scale: 0.97 }} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener" className="flex h-full items-center justify-between gap-2 rounded-sm border border-white/20 px-2.5 py-3 transition-colors hover:border-[#ead2a2]/60 hover:bg-white/5 active:border-[#ead2a2]/60 active:bg-white/10 focus-visible:border-[#ead2a2]/60 focus-visible:outline-2">
              <span className="min-w-0">
                <span className="block break-words text-[13px] font-bold leading-snug">{pick(lang, ko, en)}</span>
                <span className="mt-1 block text-[10px] text-white/70">{pick(lang, detailKo, detailEn)}</span>
              </span>
              <span aria-hidden="true" className="shrink-0 text-[#ead2a2]">↗</span>
            </motion.a>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

function ProjectShowcase() {
  const lang = useLang();
  const video = useRef<HTMLVideoElement>(null);
  const inView = useInView(video);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    if (inView) element.play().catch(() => {});
    else element.pause();
  }, [inView]);
  return (
    <section id="work" style={{ background: "var(--gi-ink)", color: "#fff" }}>
      <div className="relative flex aspect-[16/9] items-end overflow-hidden px-5 pb-6">
        <video ref={video} src="/g0dy098g/video/film.mp4" poster="/g0dy098g/video/film-poster.webp" muted loop playsInline preload="metadata" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        <div className="relative">
          <div className="gi-en text-[11px] font-bold text-[#ead2a2]">05 · LIVE DEALS</div>
          <h2 className="mt-2 text-[clamp(24px,7vw,32px)] font-extrabold leading-tight tracking-tight">
            {pick(lang, "투자유치 진행 프로젝트", "Investment Projects")}
          </h2>
        </div>
      </div>
      <div className="px-3 pt-4 pb-9">
        <ul className="grid grid-cols-4 gap-x-2 gap-y-4">
          {PROJECT_LINKS.map(([ko, en, detailKo, detailEn, href, image, englishHref]) => (
            <li key={href} className="min-w-0">
              <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener" className="block focus-visible:outline-2 focus-visible:outline-offset-2" aria-label={`${pick(lang, ko, en)} · ${pick(lang, detailKo, detailEn)}`}>
                <span className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-sm bg-[#36452a]">
                  {image ? <img src={image === "gblabs" ? "/gasan/m4r9/gblabs-logo-dark.png" : `/g0dy098g/work/${image}.webp`} alt="" loading="lazy" className={image === "gblabs" ? "h-full w-full bg-[#eeeee7] object-contain p-2" : "h-full w-full object-cover object-top"} /> : <span aria-hidden="true" className="px-1 text-center text-[10px] font-bold tracking-wider text-[#ead2a2]">{englishHref ? <>DAEYANG<br />METAL</> : en}</span>}
                </span>
                <span className="mt-2 block break-words text-[11px] font-semibold leading-snug">{pick(lang, ko, en)}</span>
              </a>
              {englishHref && <div className="mt-1 flex flex-wrap gap-x-2 text-[10px] text-[#ead2a2]">
                <a href={href} target="_blank" rel="noopener" className="py-1" aria-label="대양금속 한국어">KO ↗</a>
                <a href={englishHref} target="_blank" rel="noopener" className="py-1" aria-label="Daeyang Metal English">EN ↗</a>
              </div>}
            </li>
          ))}
        </ul>
        <CompanyDirectory />
      </div>
    </section>
  );
}

const FEE_STEPS = [
  { ko: "무료 진단", en: "Free diagnosis", c: "#3cc3a8" },
  { ko: "실비 견적", en: "Cost estimate", c: "#9fc46a" },
  { ko: "구조 설계·실행", en: "Structure & execute", c: "#5b9cf0" },
  { ko: "딜 클로징", en: "Deal closing", c: "#f0a45a" },
  { ko: "성공보수", en: "Success fee", c: "#e9d2ad" },
];
const FEE_CARDS = [
  { n: "0", ko: ["진단은 무료", "첫 미팅과 거래 구조 검토, 실행 가능성 판단까지 비용을 받지 않습니다."], en: ["Free diagnosis", "First meeting, structure review and feasibility check at no cost."] },
  { n: "실비", ko: ["실비만 먼저", "회계법인·감정평가·법무법인 수수료 등 외부 비용만 견적과 영수증 그대로 먼저 받습니다. 저희 마진은 붙이지 않습니다."], en: ["Costs only, upfront", "Only third-party costs — accounting, appraisal, legal — are paid first, at quote and receipt, with no markup."] },
  { n: "%", ko: ["보수는 결과 후", "거래 성사·자금 집행·인가 확정처럼 약속한 결과가 나온 뒤에 성공보수를 받습니다."], en: ["Fee after results", "Our success fee is paid only after the agreed result — closing, funding, approval."] },
  { n: "L", ko: ["규모별 차등 요율", "거래 규모가 커질수록 요율이 낮아지는 레만(Lehman) 방식을 기본으로 합니다."], en: ["Tiered rates", "Lehman-style rates that decline as the deal grows."] },
];
const FEE_ROWS = [
  { ko: "처음 내는 돈", en: "Paid upfront", a: ["큰 착수금", "Large retainer"], b: ["외부 기관 실비만", "Third-party costs only"] },
  { ko: "딜이 무산되면", en: "If the deal fails", a: ["착수금은 돌려받기 어려움", "Retainer rarely refunded"], b: ["성공보수 0원", "Success fee: zero"] },
  { ko: "자문사의 관심", en: "Advisor's incentive", a: ["수임 자체", "Winning the mandate"], b: ["거래 성사", "Closing the deal"] },
  { ko: "비용 투명성", en: "Cost transparency", a: ["총액 위주 청구", "Lump-sum billing"], b: ["견적·영수증 공개", "Quotes & receipts shared"] },
];
const FEE_TRUST = [
  { ko: ["비밀유지계약(NDA) 먼저", "상장사 거래는 NDA를 맺은 뒤 시작하고, 미공개 정보는 담당자 외에 공유하지 않습니다."], en: ["NDA first", "Listed-company work starts only after an NDA; non-public information stays with the deal team."] },
  { ko: ["계약서에 모두 적습니다", "실비 항목, 성공보수 요율, 지급 시점과 조건을 계약서에 명시합니다."], en: ["Everything in the contract", "Cost items, success-fee rates, timing and conditions are written into the contract."] },
  { ko: ["분쟁 소지 있는 거래는 사절", "법적 분쟁 위험이 있는 거래는 보수와 관계없이 맡지 않습니다."], en: ["No risky deals", "We decline any deal with legal-dispute risk, regardless of the fee."] },
];

function Fee() {
  const lang = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-60px" });
  const n = FEE_STEPS.length;
  return (
    <section id="fee" className="px-5 pt-16 pb-16">
      <Kicker>FEE STRUCTURE</Kicker>
      <h2 className="mt-4 text-[30px] font-extrabold leading-[1.25] tracking-[-0.03em]" style={{ color: "var(--gi-black)" }}><Lift>{lang === "en" ? "Costs first," : "실비는 먼저,"}</Lift><Lift delay={0.08}><span style={{ color: "var(--gi-copper)" }}>{lang === "en" ? "fees on results." : "보수는 결과로."}</span></Lift></h2>
      <p className="mt-4 text-[14.5px] leading-[1.8]" style={{ color: "var(--gi-sub)" }}>{pick(lang, "외부 기관에 실제로 나가는 비용만 먼저 받고, 저희 보수는 거래가 성사된 뒤에 받습니다. 자문사와 고객이 같은 결과를 바라보게 하는 구조입니다.", "We take only real third-party costs upfront and earn our fee after the deal closes — so advisor and client aim for the same result.")}</p>
      <div ref={ref} className="relative mt-8 rounded-[16px] px-4 py-5" style={{ background: "#1c2414" }}>
        <svg viewBox="0 0 320 70" className="w-full" aria-hidden="true">
          <path d="M20 35 H300" stroke="#44523a" strokeWidth="3" strokeLinecap="round" fill="none" />
          <motion.path d="M20 35 H300" stroke="url(#gi-fee-g)" strokeWidth="3" strokeLinecap="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: seen ? 1 : 0 }} transition={{ duration: 2.6, ease: EASE }} />
          <defs><linearGradient id="gi-fee-g" x1="0" x2="1"><stop offset="0" stopColor="#3cc3a8" /><stop offset=".25" stopColor="#9fc46a" /><stop offset=".5" stopColor="#5b9cf0" /><stop offset=".75" stopColor="#f0a45a" /><stop offset="1" stopColor="#e9d2ad" /></linearGradient></defs>
          {seen && <circle r="4" fill="#fff"><animateMotion dur="2.8s" repeatCount="indefinite" path="M20 35 H300" /></circle>}
          {FEE_STEPS.map((st, i) => {
            const x = 20 + i * (280 / (n - 1));
            return (
              <motion.g key={st.ko} initial={{ scale: 0 }} animate={{ scale: seen ? 1 : 0 }} transition={{ duration: 0.5, delay: 0.3 + i * 0.45, ease: EASE }} style={{ transformOrigin: `${x}px 35px`, transformBox: "view-box" }}>
                <circle cx={x} cy="35" r="11" fill="#1c2414" stroke={st.c} strokeWidth="2.4" />
                <text x={x} y="39" textAnchor="middle" fontSize="10" fontWeight="800" fill={st.c}>{i + 1}</text>
              </motion.g>
            );
          })}
        </svg>
        <div className="mt-1 grid grid-cols-5 gap-0.5 text-center text-[10.5px] font-bold leading-[1.35] text-white">
          {FEE_STEPS.map((st) => <span key={st.ko}>{lang === "en" ? st.en : st.ko}</span>)}
        </div>
        <div className="mt-3 grid grid-cols-5 text-center text-[10px] font-semibold" style={{ color: "#b3bca3" }}>
          <span>{pick(lang, "무료", "Free")}</span><span style={{ color: "#c9de9b" }}>{pick(lang, "실비 선지급", "Costs first")}</span><span>—</span><span>—</span><span style={{ color: "#e9d2ad" }}>{pick(lang, "보수 후지급", "Fee after")}</span>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2.5">
        {FEE_CARDS.map((c, i) => {
          const [t, d] = lang === "en" ? c.en : c.ko;
          return (
            <Rise key={i} delay={i * 0.06}>
              <div className="h-full rounded-[14px] border p-4" style={{ borderColor: "var(--gi-line)", background: "#fff" }}>
                <div className="text-[26px] font-extrabold leading-none" style={{ color: "var(--gi-copper)" }}>{c.n}</div>
                <div className="mt-3 text-[15px] font-extrabold" style={{ color: "var(--gi-black)" }}>{t}</div>
                <p className="mt-1.5 text-[12.5px] leading-[1.65]" style={{ color: "var(--gi-sub)" }}>{d}</p>
              </div>
            </Rise>
          );
        })}
      </div>

      {/* 일반 착수금 방식과 비교 */}
      <h3 className="mt-12 text-[20px] font-extrabold" style={{ color: "var(--gi-black)" }}>{pick(lang, "무엇이 다른가요", "How it compares")}</h3>
      <div className="mt-4 overflow-hidden rounded-[14px] border" style={{ borderColor: "var(--gi-line)" }}>
        <div className="grid grid-cols-[88px_1fr_1fr] text-[12px] font-bold">
          <span className="px-3 py-2.5" style={{ background: "var(--gi-paper)" }} />
          <span className="px-3 py-2.5" style={{ background: "var(--gi-paper)", color: "var(--gi-sub)" }}>{pick(lang, "일반 착수금 방식", "Typical retainer")}</span>
          <span className="px-3 py-2.5 text-white" style={{ background: "var(--gi-ink)" }}>GIIB {pick(lang, "혼합형", "hybrid")}</span>
        </div>
        {FEE_ROWS.map((r, i) => (
          <motion.div key={r.ko} className="grid grid-cols-[88px_1fr_1fr] border-t text-[12.5px] leading-[1.5]" style={{ borderColor: "var(--gi-line)" }} initial={{ x: 24 }} whileInView={{ x: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.06, ease: EASE }}>
            <span className="px-3 py-3 font-bold" style={{ color: "var(--gi-black)" }}>{lang === "en" ? r.en : r.ko}</span>
            <span className="px-3 py-3" style={{ color: "var(--gi-sub)" }}>{lang === "en" ? r.a[1] : r.a[0]}</span>
            <span className="px-3 py-3 font-bold" style={{ color: "var(--gi-ink)", background: "rgba(43,54,32,.05)" }}>{lang === "en" ? r.b[1] : r.b[0]}</span>
          </motion.div>
        ))}
      </div>

      {/* 신뢰 장치 */}
      <div className="mt-10 space-y-4">
        {FEE_TRUST.map((t, i) => {
          const [h, d] = lang === "en" ? t.en : t.ko;
          return (
            <Rise key={i} delay={i * 0.05}>
              <div className="flex gap-3 border-t pt-4" style={{ borderColor: "var(--gi-line)" }}>
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold text-white" style={{ background: "var(--gi-ink)" }}>✓</span>
                <div><div className="text-[15.5px] font-extrabold" style={{ color: "var(--gi-black)" }}>{h}</div><p className="mt-1 text-[13px] leading-[1.7]" style={{ color: "var(--gi-sub)" }}>{d}</p></div>
              </div>
            </Rise>
          );
        })}
      </div>
    </section>
  );
}

/* 인트로 — The Boundary식: 화면 가득 한 장면 + 짧은 타이포. 이미지는 처음부터 보이고, 내릴수록 살짝 확대되며 메인으로 이어진다 */
function Intro({ onNext, onWork }: { onNext: () => void; onWork: () => void }) {
  const lang = useLang();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.16]);
  const ty = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  return (
    <section ref={ref} className="relative h-[calc(100svh-56px)] min-h-[520px] overflow-hidden" style={{ background: "#161d10" }}>
      <motion.div className="absolute inset-0" style={{ scale, transformOrigin: "60% 60%" }}>
        <img src="/g0dy098g/intro-seoul.webp" alt={pick(lang, "서울 석양 항공 전경", "Seoul at sunset, aerial view")} className="absolute inset-0 h-full w-full object-cover" />
        <video src="/g0dy098g/video/intro-seoul2.mp4" poster="/g0dy098g/intro-seoul.webp" autoPlay muted loop playsInline preload="auto" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
      </motion.div>
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(17,21,12,.35) 0%, rgba(17,21,12,0) 30%, rgba(17,21,12,0) 52%, rgba(17,21,12,.78) 100%)" }} />
      <motion.div className="absolute inset-x-0 top-[8%] flex justify-center" style={{ y: ty }}>
        <GiibLogo className="block w-[250px]" style={{ filter: "drop-shadow(0 8px 22px rgba(10,12,6,.5))" }} />
      </motion.div>
      <motion.div className="absolute inset-x-0 bottom-[12%] px-6 text-white" style={{ y: ty }}>
        <div className="mt-5 text-[24px] font-bold leading-[1.35] tracking-[-0.01em]"><Lift delay={0.6}>{pick(lang, "기업과 자산의 가치를", "We design the value")}</Lift><Lift delay={0.72}>{pick(lang, "설계합니다.", "of companies and assets.")}</Lift></div>
        <div className="mt-3 text-[12.5px] font-semibold tracking-[0.02em] text-white/75"><Lift delay={0.85}>{pick(lang, "상장사 M&A · 구조조정 · RWA · IR", "Listed-company M&A · Restructuring · RWA · IR")}</Lift></div>
      </motion.div>
      <div className="absolute inset-x-0 bottom-7 flex justify-center gap-7">
        <button onClick={onNext} className="flex items-center gap-2 border-b border-white/70 pb-1 text-[14px] font-bold text-white">
          {pick(lang, "사업영역 보기", "Explore")}
          <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>↓</motion.span>
        </button>
        <button onClick={onWork} className="flex items-center gap-2 border-b pb-1 text-[14px] font-bold" style={{ color: "var(--gi-sand)", borderColor: "var(--gi-sand)" }}>{pick(lang, "사례 보기", "View work")} <span>→</span></button>
      </div>
    </section>
  );
}

const MENU: [string, string, string[]][] = [
  ["about", "회사소개", ["개요", "인사말"]],
  ["vision", "비전 · 로드맵", []],
  ["business", "사업 구조", ["자산 쪽", "자문 쪽", "딜 클로징"]],
  ["ma", "상장사 M&A", []],
  ["solutions", "자문 솔루션", ["상장사 M&A·투자유치", "구조조정", "사업계획서·IR", "검토보고서·가치평가"]],
  ["rwa", "RWA 사업", ["부동산 개발", "엣지 AI 데이터센터", "NPL"]],
  ["work", "투자유치 진행 프로젝트", []],
  ["approach", "투자 접근", ["4단계 프로세스", "원칙"]],
  ["fee", "보수 구조", []],
  ["contact", "문의", []],
];

export default function GiibPlus() {
  const [lang, setLangRaw] = useState<Lang>("ko");
  const [wipe, setWipe] = useState(0);
  const T = (ko: string, en: string) => pick(lang, ko, en);
  const setLang = (l: Lang) => {
    if (l === lang) return;
    setWipe((w) => w + 1);
    window.setTimeout(() => setLangRaw(l), 260);
    try { localStorage.setItem("gi-lang", l); } catch {}
    try { const u = new URL(window.location.href); if (l === "en") u.searchParams.set("lang", "en"); else u.searchParams.delete("lang"); window.history.replaceState(null, "", u.toString()); } catch {}
  };
  useEffect(() => {
    let l: string | null = null;
    try { l = new URLSearchParams(window.location.search).get("lang"); } catch {}
    if (!l) { try { l = localStorage.getItem("gi-lang"); } catch {} }
    if (l === "en") setLangRaw("en");
  }, []);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const MENU_EN2: Record<string, [string, string[]]> = { about: MENU_EN[0], vision: ["Vision · Roadmap", []], business: ["How We Work", ["Asset side", "Advisory side", "Deal closing"]], ma: ["Listed-Company M&A", []], solutions: ["Advisory Solutions", ["Listed M&A · Capital", "Restructuring", "Plans · IR", "Review · Valuation"]], rwa: ["RWA", ["Real Estate", "Edge AI Data Center", "NPL"]], work: ["Live Deals", []], approach: MENU_EN[2], fee: ["Fee Structure", []], record: MENU_EN[3], contact: MENU_EN[4] };
  const menuList: [string, string, string[]][] = MENU.map(([id, l, k]) => (lang === "en" ? [id, MENU_EN2[id][0], MENU_EN2[id][1]] : [id, l, k]));
  const proc_ = PROCESS.map((p, i) => (lang === "en" ? { ...p, ...PROCESS_EN[i] } : p));
  const prin_ = PRINCIPLES.map((p, i) => (lang === "en" ? { ...p, ...PRINCIPLES_EN[i] } : p));
  const stats_ = lang === "en" ? RECORD_STATS_EN : RECORD_STATS;
  const coName = T(CO.nameKo, CO_EN.name), coCeo = T(CO.ceo, CO_EN.ceo);
  const coAddr = lang === "en" ? CO_EN.address : CO.address;
  const [menu, setMenu] = useState(false);
  const [deck, setDeck] = useState(false);
  const [sub, setSub] = useState<number | null>(null);
  const [prin, setPrin] = useState(0);
  const [sent, setSent] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setMenu(false);
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 56, behavior: "smooth" });
  };

  return (
    <LangCtx.Provider value={lang}>
    <div className="gi gi-olive" lang={lang}>
      {/* 언어 전환 때 구리색 막이 한 번 지나간다 */}
      {wipe > 0 && (
        <motion.div key={wipe} className="pointer-events-none fixed inset-0 z-[60]" style={{ background: "var(--gi-ink)" }}
          initial={{ clipPath: "inset(0% 100% 0% 0%)" }} animate={{ clipPath: ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 0% 100%)"] }} transition={{ duration: 0.6, times: [0, 0.45, 1], ease: "easeInOut" }}>
          <div className="flex h-full items-center justify-center"><img src="/g0dy098g/logo-mark-olive.svg" alt="" width={56} height={56} /></div>
        </motion.div>
      )}
      <div className="relative mx-auto w-full max-w-[480px]">
        {/* 헤더 */}
        <header className="sticky top-0 z-40 border-b bg-white" style={{ borderColor: "var(--gi-line)" }}>
          <div className="flex h-[56px] items-center justify-between px-4">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="맨 위로"><Logo /></button>
            <div className="flex items-center gap-2">
            <span className="flex shrink-0 overflow-hidden"><button onClick={() => setDeck(true)} className="px-2 py-1.5 text-[11px] font-bold leading-none" style={{ background: "#1c2414", color: "var(--gi-sand)" }}>{T("소개서", "Profile")}</button><a href="/g0dy098g/ir" className="border-l px-2 py-1.5 text-[11px] font-bold leading-none" style={{ background: "#1c2414", color: "var(--gi-sand)", borderColor: "rgba(233,210,173,.35)" }}>IR</a></span>
            <LangSwitch lang={lang} set={setLang} />
            <button onClick={() => setMenu(true)} aria-label={T("메뉴 열기", "Open menu")} className="flex h-10 w-10 flex-col items-end justify-center gap-[5px]">
              <span className="h-[2px] w-6" style={{ background: "var(--gi-black)" }} /><span className="h-[2px] w-6" style={{ background: "var(--gi-black)" }} /><span className="h-[2px] w-6" style={{ background: "var(--gi-black)" }} />
            </button>
            </div>
          </div>
        </header>

        {/* 전체 메뉴 (Brookfield·KIC식 펼침 목록) */}
        <AnimatePresence>
          {menu && (
            <motion.div key="m" className="fixed inset-y-0 right-0 z-50 w-full max-w-[480px] overflow-y-auto bg-white" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.5, ease: EASE }}>
              <div className="flex h-[56px] items-center justify-between border-b px-4" style={{ borderColor: "var(--gi-line)" }}>
                <Logo />
                <div className="flex items-center gap-3"><LangSwitch lang={lang} set={setLang} />
                <button onClick={() => setMenu(false)} aria-label="메뉴 닫기" className="text-[30px] leading-none" style={{ color: "var(--gi-black)" }}>×</button></div>
              </div>
              <div className="px-5">
                {menuList.map(([id, l, kids], i) => (
                  <div key={id} className="border-b" style={{ borderColor: "var(--gi-line)" }}>
                    <button onClick={() => (kids.length ? setSub(sub === i ? null : i) : go(id))} className="flex w-full items-center justify-between py-5 text-left">
                      <span className="text-[20px] font-bold" style={{ color: "var(--gi-black)" }}>{l}</span>
                      {kids.length ? <motion.span animate={{ rotate: sub === i ? 180 : 0 }} className="text-[18px]">⌄</motion.span> : <Arrow />}
                    </button>
                    <AnimatePresence initial={false}>
                      {sub === i && (
                        <motion.div key="s" className="overflow-hidden" initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.3, ease: EASE }}>
                          <div className="pb-4">
                            {kids.map((k) => <button key={k} onClick={() => go(id)} className="block py-2 text-[15px]" style={{ color: "var(--gi-sub)" }}>{k}</button>)}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
              <p className="px-5 pt-8 pb-10 text-[12px]" style={{ color: "var(--gi-sub)" }}>{coName} · {T("대표이사", "CEO")} {coCeo}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {deck && <DeckViewer lang={lang} onClose={() => setDeck(false)} />}
        <Intro onNext={() => go("main")} onWork={() => go("work")} />

        {/* HERO — 코람코·글로벌PMC식: 화면 가득 찬 어두운 이미지 위에 문장 */}
        <section id="main" className="relative h-[86dvh] min-h-[560px] overflow-hidden" style={{ background: "#1c2414" }}>
          {SRC("hero") ? <img src={SRC("hero")} alt={T("서울 도심 야경", "Seoul skyline at dusk")} className="gi-kb absolute inset-0 h-full w-full object-cover" style={{ objectPosition: IMG_POS.hero }} /> : <div className="absolute inset-0"><HubScene /></div>}
          {HERO_VIDEO && <video src={`/g0dy098g/${HERO_VIDEO}`} poster={SRC("hero") || undefined} autoPlay muted loop playsInline preload="auto" aria-hidden="true" className="gi-kb absolute inset-0 h-full w-full object-cover" style={{ objectPosition: IMG_POS.hero }} />}
          {!SRC("hero") && (<><LiveBlob fill="rgba(201,154,98,.22)" seeds={[1, 4, 7, 2]} dur={11} className="pointer-events-none absolute -left-24 -top-16 h-[240px] w-[240px]" />
          <LiveBlob fill="rgba(60,74,44,.38)" seeds={[3, 6, 9, 5]} dur={13} r={78} className="pointer-events-none absolute -right-20 top-1/3 h-[300px] w-[300px]" /></>)}
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(17,21,12,.8) 0%, rgba(17,21,12,.45) 34%, rgba(17,21,12,0) 52%, rgba(17,21,12,0) 74%, rgba(17,21,12,.85) 100%)" }} />
          {/* 문장은 하늘 쪽(위)에 두고 버튼만 아래에 둬서 도심이 가려지지 않게 */}
          <div className="absolute inset-0 flex flex-col justify-between px-5 pt-9 pb-8 text-white">
            <div>
            <div className="gi-en text-[11px] font-bold" style={{ color: "var(--gi-sand)" }}><Lift delay={0.9}>LISTED-COMPANY M&amp;A · RWA · ADVISORY</Lift></div>
            <h1 className={`mt-3 font-extrabold tracking-[-0.02em] ${lang === "en" ? "text-[29px] leading-[1.22]" : "text-[31px] leading-[1.3]"}`}>
              <Lift delay={1.05}>{T("상장사 M&A부터 실물자산까지,", "From listed-company M&A to real assets,")}</Lift>
              <Lift delay={1.2}><span style={{ color: "var(--gi-sand)" }}>{T("딜의 처음과 끝을 맡습니다.", "we carry the deal end to end.")}</span></Lift>
            </h1>
            <Rise delay={1.4}><p className="mt-4 text-[14.5px] leading-[1.75] text-white/75">{T("자산 쪽(부동산 개발·엣지 AI 데이터센터·NPL)과 자문 쪽(상장사 M&A·구조조정·IR)을 한 회사가 함께 움직여, 자산 발굴부터 딜 클로징까지 끊김 없이 이어 갑니다.", "GIIB runs an asset side (real estate, edge AI data centers, NPL) and an advisory side (listed-company M&A, restructuring, IR) together — from sourcing to closing, without gaps.")}</p></Rise>
            </div>
            <Rise delay={1.55}>
              <div className="mt-6">
                <div className="mb-3 flex items-baseline justify-end gap-2 leading-none"><span className="gi-en text-[10px] text-white/60">SINCE</span><span className="text-[26px] font-extrabold tracking-[-0.03em]"><Count to={2015} /></span></div>
                <div className="flex gap-2.5">
                  <button onClick={() => go("ma")} className="flex flex-1 items-center justify-between px-4 py-3.5 text-[14px] font-bold" style={{ background: "#fff", color: "var(--gi-black)" }}>{T("상장사 M&A", "Listed M&A")} <Arrow /></button>
                  <button onClick={() => go("business")} className="flex flex-1 items-center justify-between border px-4 py-3.5 text-[14px] font-bold text-white" style={{ borderColor: "rgba(255,255,255,.75)" }}>{T("사업 구조", "How we work")} <Arrow /></button>
                </div>
              </div>
            </Rise>
          </div>
          {/* 첫 등장: 검은 막이 아래로 걷힌다 */}
          <motion.div className="absolute inset-0" style={{ background: "#161d10" }} initial={{ clipPath: "inset(0% 0% 0% 0%)" }} animate={{ clipPath: "inset(100% 0% 0% 0%)" }} transition={{ duration: 1.2, delay: 0.1, ease: EASE }} />
        </section>

        {/* 큰 문장 (BlackRock식) */}
        <section id="about" className="border-t px-5 pt-14 pb-14" style={{ borderColor: "var(--gi-line)" }}>
          <Kicker>WHO WE ARE</Kicker>
          <Rise>
            <p className="mt-5 text-[25px] font-bold leading-[1.45] tracking-[-0.01em]" style={{ color: "var(--gi-black)" }}>
              {lang === "en" ? <>Finding good assets matters.<br />Building <span style={{ color: "var(--gi-copper)" }}>the structure that protects them</span><br />matters just as much.</> : <>좋은 자산을 찾는 일만큼,<br /><span style={{ color: "var(--gi-copper)" }}>그 자산을 지키는 구조</span>를<br />만드는 일이 중요하다고 믿습니다.</>}
            </p>
          </Rise>
          <div className="mt-10 grid grid-cols-3 border-t" style={{ borderColor: "var(--gi-black)" }}>
            {([[10, T("직접 연결된 상장사", "Listed cos., direct")], [2, T("사업 축 · 자산·자문", "Pillars · asset & advisory")], [15, T("제작 사례", "Projects built")]] as [number, string][]).map(([a, b], i) => (
              <Rise key={b} delay={i * 0.08}>
                <div className="pt-4" style={{ borderLeft: i ? "1px solid var(--gi-line)" : "none", paddingLeft: i ? 12 : 0 }}>
                  <div className="text-[36px] font-extrabold leading-none tracking-[-0.03em]" style={{ color: "var(--gi-black)" }}><Count to={a} />{i === 0 && <span style={{ color: "var(--gi-copper)" }}>+</span>}</div>
                  <div className="mt-2 text-[12px]" style={{ color: "var(--gi-sub)" }}>{b}</div>
                </div>
              </Rise>
            ))}
          </div>
          <dl className="mt-10 text-[13.5px]">
            {[[T("상호", "Company"), coName], [T("영문", "Brand"), `${CO.brand} · ${CO.nameEn}`], [T("대표이사", "CEO"), coCeo], [T("설립", "Founded"), T(CO.founded, CO_EN.founded)], [T("본점", "Head office"), coAddr || <Pending>{T("등기 정리 후 입력", "Pending")}</Pending>]].map(([k, v], i) => (
              <div key={i} className="grid grid-cols-[92px_1fr] gap-3 border-b py-3" style={{ borderColor: "var(--gi-line)" }}>
                <dt className="font-semibold" style={{ color: "var(--gi-black)" }}>{k}</dt><dd>{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 영상 띠 — 서울 스카이라인 드론 */}
        <Film />
        <VisionRoadmap />

        <Pillars onGo={go} />
        <ListedMA />
        <Solutions />
        <ProjectShowcase />
        <Rwa />

        {/* 투자 접근 — 번호 목록 */}
        <section id="approach" className="px-5 pt-14 pb-14">
          <Kicker>OUR APPROACH</Kicker>
          <h2 className="mt-4 text-[28px] font-extrabold leading-[1.3] tracking-[-0.02em]" style={{ color: "var(--gi-black)" }}><Lift>{lang === "en" ? <>From sourcing to exit,<br />in four steps</> : <>발굴에서 출구까지,<br />네 단계</>}</Lift></h2>
          <Visual k="approach" variant={2} className="mt-7 h-[200px]" />
          <ol className="mt-8 border-t" style={{ borderColor: "var(--gi-black)" }}>
            {proc_.map((p, i) => (
              <motion.li key={p.en} className="grid grid-cols-[56px_1fr] border-b py-6" style={{ borderColor: "var(--gi-line)" }}
                initial={{ x: -24 }} whileInView={{ x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}>
                <span className="relative h-[44px] w-[44px]">
                  <LiveBlob fill="#f4f3f0" seeds={[i + 1, i + 4, i + 7]} dur={7 + i} r={78} className="absolute inset-0 h-full w-full" />
                  <span className="relative flex h-full w-full items-center justify-center text-[17px] font-extrabold" style={{ color: "var(--gi-copper)" }}>{String(i + 1).padStart(2, "0")}</span>
                </span>
                <div>
                  {lang === "ko" && <div className="gi-en text-[10px] font-semibold" style={{ color: "var(--gi-copper)" }}>{p.en}</div>}
                  <div className="mt-1 text-[19px] font-extrabold" style={{ color: "var(--gi-black)" }}>{p.t}</div>
                  <p className="mt-1.5 text-[14px] leading-[1.7]" style={{ color: "var(--gi-sub)" }}>{p.d}</p>
                </div>
              </motion.li>
            ))}
          </ol>
          {/* 구조도는 화면 폭 가득 어두운 띠로, 아래 '원칙' 검은 섹션과 이어지게 */}
          <div className="relative -mx-5 -mb-14 mt-12 overflow-hidden px-5 pt-12 pb-10" style={{ background: "linear-gradient(180deg, #2a3520 0%, #1d2616 55%, #161d10 100%)" }}>
            <Kicker light>HOW WE STRUCTURE</Kicker>
            <h3 className="mt-3 text-[22px] font-extrabold leading-[1.35] text-white">{T("투자 구조 한눈에 보기", "Our investment structure at a glance")}<SampleTag /></h3>
            <p className="mt-2 text-[14px] leading-[1.7]" style={{ color: "#b9c2a8" }}>{T("투자자의 자금은 SPC와 담보신탁으로 분리해 지키고, 자산 운영과 출구까지 하나의 구조로 관리합니다.", "Investor capital is ring-fenced through an SPC and a collateral trust, and everything from operations to exit is managed as one structure.")}</p>
            <Structure />
          </div>
        </section>

        {/* 원칙 — 어두운 띠 */}
        <section className="relative overflow-hidden px-5 pt-14 pb-14" style={{ background: "#161d10" }}>
          <svg viewBox="0 0 200 200" className="pointer-events-none absolute -right-28 top-4 h-[230px] w-[230px]" aria-hidden="true">
            <motion.path d={blob(prin * 2 + 1, 100, 100, 72, 0.32)} fill="none" stroke="#b98a52" strokeWidth="1.2" animate={{ d: blob(prin * 2 + 1, 100, 100, 72, 0.32), rotate: prin * 45 }} transition={{ duration: 1.1, ease: EASE }} style={{ transformOrigin: "100px 100px" }} />
            <motion.path d={blob(prin * 2 + 5, 100, 100, 54, 0.3)} fill="rgba(185,138,82,.12)" animate={{ d: blob(prin * 2 + 5, 100, 100, 54, 0.3) }} transition={{ duration: 1.1, ease: EASE }} />
            <motion.text x="100" y="112" textAnchor="middle" fontSize="38" fontWeight="800" fill="#e9d2ad" key={prin} initial={{ y: 20 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>{`0${prin + 1}`}</motion.text>
          </svg>
          <Kicker light>OUR PRINCIPLES</Kicker>
          <div className="relative mt-6 space-y-6">
            {prin_.map((p, i) => (
              <Rise key={i} delay={i * 0.05}>
                <PrinWatch onSeen={() => setPrin(i)} />
                <div className="border-t pt-5" style={{ borderColor: "#2e3824" }}>
                  <div className="text-[22px] font-extrabold text-white">{p.t}</div>
                  <p className="mt-1.5 text-[14px]" style={{ color: "#a3a8b0" }}>{p.d}</p>
                </div>
              </Rise>
            ))}
          </div>
        </section>

        <Fee />

        {/* 사업실적(예시) — 가상 숫자라 미리보기에서는 숨김. 실제 실적이 오면 SAMPLE=false 후 다시 표시 */}
        {!SAMPLE && (<>
        {/* 사업실적 — 코람코식 숫자 + 사례 카드 + 섹터 비중 */}
        <section id="record" className="px-5 pt-14 pb-14">
          <Kicker>TRACK RECORD</Kicker>
          <h2 className="mt-4 text-[28px] font-extrabold tracking-[-0.02em]" style={{ color: "var(--gi-black)" }}>{T("사업실적", "Track Record")}<SampleTag /></h2>
          <div className="mt-6 grid grid-cols-3 border-t" style={{ borderColor: "var(--gi-black)" }}>
            {stats_.map((r, i) => (
              <div key={i} className={`py-5 ${i ? "border-l pl-3" : ""}`} style={{ borderColor: "var(--gi-line)" }}>
                <div className="text-[26px] font-extrabold leading-none tracking-[-0.03em]" style={{ color: "var(--gi-black)" }}><Count to={r.n} comma /><span className="ml-0.5 text-[12px] font-bold" style={{ color: "var(--gi-copper)" }}>{r.unit}</span></div>
                <div className="mt-2 text-[11.5px]" style={{ color: "var(--gi-sub)" }}>{r.t}</div>
              </div>
            ))}
          </div>
          <Cases />
          <div className="mt-12">
            <Kicker>PORTFOLIO MIX</Kicker>
            <h3 className="mt-3 text-[22px] font-extrabold" style={{ color: "var(--gi-black)" }}>{T("검토 자산 섹터 비중", "Sector mix of assets reviewed")}<SampleTag /></h3>
            <Donut />
          </div>
          <Visual k="city" variant={4} className="mt-10 h-[220px]" />
          {SAMPLE && <p className="mt-3 text-[11px]" style={{ color: "var(--gi-sub)" }}>{T("※ 이 영역의 숫자와 사례는 화면 구성을 위한 예시이며, 확인된 실적으로 교체됩니다.", "※ Figures and cases in this section are illustrative samples and will be replaced with verified records.")}</p>}
        </section>

        </>)}

        {/* 인사말 */}
        <section id="ceo" className="px-5 pt-14 pb-14" style={{ background: "var(--gi-paper)" }}>
          <Kicker>CEO MESSAGE</Kicker>
          {SRC("ceo2") && <Visual k="ceo2" className="mt-5 h-[440px]" tag={T("대표이사 유현근", "CEO Hyun-geun You")} />}
          <Rise>
            <p className="mt-5 text-[21px] font-bold leading-[1.55]" style={{ color: "var(--gi-black)" }}>&ldquo;{lang === "en" ? <>We will be a trusted hub<br />between investors and sponsors.</> : <>투자자와 사업자 사이에서<br />믿을 수 있는 거점이 되겠습니다.</>}&rdquo;</p>
          </Rise>
          <div className="mt-6 space-y-3 text-[15px] leading-[1.85]" style={{ color: "var(--gi-text)" }}>
            {lang === "en" ? (<>
              <p>Hello, I am Hyun-geun You, CEO of Global Infra Hub.</p>
              <p>The biggest losses in real estate investment come from unverified numbers and undesigned structures. We verify with documents first, speak about risks first, and above all protect investor capital through collateral and contract structures.</p>
              <p>Good assets are many, but few have a structure strong enough to protect them to the end. We take responsibility for one continuous flow — sourcing, due diligence, structuring, execution and management — helping investors and sponsors make decisions they can trust in numbers.</p>
              <p>Beyond real estate, we now take on corporate restructuring, M&amp;A and capital raising. One team builds the business plans, IR, review reports and deal sites — we take only third-party costs upfront and earn our fee on results.</p>
              <p>As GIIB starts anew, we will work honestly to become a real estate investment hub you can rely on. Thank you.</p>
            </>) : (<>
              <p>안녕하십니까, 글로벌인프라허브 대표이사 유현근입니다.</p>
              <p>부동산 투자에서 가장 큰 손실은 확인하지 않은 숫자와 설계되지 않은 구조에서 생깁니다. 저희는 서류로 먼저 확인하고, 위험을 먼저 말씀드리며, 담보와 계약 구조로 투자자의 원금을 지키는 일을 가장 중요하게 생각합니다.</p>
              <p>좋은 자산은 많지만, 그 자산을 끝까지 지켜 낼 구조를 갖춘 곳은 많지 않습니다. 글로벌인프라허브는 발굴과 실사, 구조화, 실행과 관리까지 한 흐름으로 책임지며, 투자자와 사업자 모두가 숫자로 납득할 수 있는 결정을 돕겠습니다.</p>
              <p>이제는 부동산을 넘어 기업의 구조조정과 M&A, 투자유치까지 함께합니다. 사업계획서와 IR, 검토보고서, 사업 사이트까지 한 팀이 직접 만들고, 외부 실비만 먼저 받되 저희 보수는 결과로 받겠습니다.</p>
              <p>새롭게 출발하는 글로벌인프라허브가 믿고 맡길 수 있는 부동산 투자의 거점이 될 수 있도록 늘 정직하게 일하겠습니다. 감사합니다.</p>
            </>)}
          </div>
          <p className="mt-6 text-[14px]" style={{ color: "var(--gi-sub)" }}>{T("대표이사", "CEO")} <b className="ml-1 text-[17px]" style={{ color: "var(--gi-black)", letterSpacing: lang === "en" ? "0.02em" : "0.12em" }}>{coCeo}</b></p>
        </section>

        {/* 문의 */}
        <section id="contact" className="px-5 pt-14 pb-14">
          <Kicker>CONTACT US</Kicker>
          <h2 className="mt-4 text-[28px] font-extrabold tracking-[-0.02em]" style={{ color: "var(--gi-black)" }}>{T("문의", "Contact")}</h2>
          <dl className="mt-6 border-t text-[14px]" style={{ borderColor: "var(--gi-black)" }}>
            {([[T("주소", "Address"), coAddr || <Pending>{T("등기 정리 후 입력", "Pending")}</Pending>], CO.phone ? [T("대표전화", "Phone"), <a key="p" href={`tel:${CO.phone}`}>{CO.phone}</a>] : null, [T("이메일", "Email"), CO.email ? <a href={`mailto:${CO.email}`}>{CO.email}</a> : <Pending />]].filter(Boolean) as [string, ReactNode][]).map(([k, v], i) => (
              <div key={i} className="grid grid-cols-[76px_1fr] gap-3 border-b py-3.5" style={{ borderColor: "var(--gi-line)" }}>
                <dt className="font-semibold" style={{ color: "var(--gi-black)" }}>{k}</dt><dd>{v}</dd>
              </div>
            ))}
          </dl>
          <form className="mt-8 grid gap-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            {[["gi-nm", T("이름 / 회사명", "Name / Company")], ["gi-ph", T("연락처", "Phone")]].map(([id, l]) => (
              <label key={id} htmlFor={id} className="grid gap-1.5 text-[12.5px] font-semibold" style={{ color: "var(--gi-black)" }}>{l}
                <input id={id} className="w-full min-w-0 border-b px-0 py-2.5 text-[16px] outline-none" style={{ borderColor: "var(--gi-black)" }} />
              </label>
            ))}
            <label htmlFor="gi-msg" className="grid gap-1.5 text-[12.5px] font-semibold" style={{ color: "var(--gi-black)" }}>{T("문의 내용", "Message")}
              <textarea id="gi-msg" rows={4} className="w-full min-w-0 border px-3 py-3 text-[16px] outline-none" style={{ borderColor: "var(--gi-line)" }} />
            </label>
            <button type="submit" className="mt-2 flex items-center justify-between px-5 py-4 text-[15px] font-bold text-white" style={{ background: "var(--gi-black)" }}>{T("문의 보내기", "Send Inquiry")} <Arrow /></button>
            <p className="min-h-[1em] text-[12.5px]" style={{ color: "var(--gi-copper)" }} aria-live="polite">{sent ? T("임시 홈페이지라 아직 전송되지 않습니다. 정식 오픈 후 담당자에게 바로 전달됩니다.", "This is a preview site, so messages are not sent yet. After launch they will go straight to our team.") : ""}</p>
          </form>
          <HubBand />
        </section>

        {/* 푸터 */}
        <footer className="px-5 pt-10 pb-12" style={{ background: "var(--gi-ink)", color: "#a6af96" }}>
          <Logo dark size={34} />
          <div className="mt-5"><LangSwitch lang={lang} set={setLang} dark /></div>
          <div className="mt-6 border-t" style={{ borderColor: "#3d4a2e" }}>
            {menuList.map(([id, l]) => (
              <button key={id} onClick={() => go(id)} className="flex w-full items-center justify-between border-b py-3.5 text-left text-[14px] text-white" style={{ borderColor: "#3d4a2e" }}>{l}<Arrow size={15} /></button>
            ))}
          </div>
          <p className="mt-6 text-[12px] leading-[1.8]">{coName} · {T("대표이사", "CEO")} {coCeo}<br />{T("사업자등록번호", "Business Reg. No.")} {CO.bizNo}{coAddr ? <><br />{coAddr}</> : null}</p>
          <p className="gi-en mt-5 text-[10.5px]">© 2026 GIIB · GLOBAL INFRA HUB</p>
          <p className="mt-3 text-[10.5px]" style={{ color: "#7d8770" }}>{T("임시 홈페이지 · 내용 확정 후 giibgroup.com으로 옮길 예정입니다", "Preview site · will move to giibgroup.com once finalized")}</p>
        </footer>

        <AnimatePresence>
          {showTop && (
            <motion.button key="top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label={T("맨 위로", "Back to top")} className="fixed bottom-5 z-40 flex h-11 w-11 items-center justify-center"
              style={{ right: "max(16px, calc(50vw - 240px + 16px))", background: "var(--gi-black)", color: "#fff" }} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.3 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 19V5 M5 12l7-7 7 7" /></svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
    </LangCtx.Provider>
  );
}
