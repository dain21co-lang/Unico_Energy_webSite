"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence, animate, useInView } from "framer-motion";
import { PROJECT, BUILDING, FLOORS, CANDIDATES, ROOMS, SHARED, JOURNEY, DEMAND, LOCATION, CHECKS, ROADMAP } from "./data";
import type { UnitState } from "./data";

/* 원칙: 투명도는 움직이지 않는다 (갤럭시 빈 화면 방지) — 위치·크기·마스크·색·SVG 경로만 움직인다 */
const IMG = (f: string) => `/thek/img/${f}.webp`;
const EASE = [0.16, 1, 0.3, 1] as const;

function Rise({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ y: 26 }} whileInView={{ y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.8, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

function Lift({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true });
  return (
    <span ref={ref} className={`block overflow-hidden ${className ?? ""}`}>
      <motion.span className="block" initial={{ y: "105%" }} animate={{ y: seen ? "0%" : "105%" }} transition={{ duration: 0.9, delay, ease: EASE }}>{children}</motion.span>
    </span>
  );
}

function Photo({ src, alt, className, pos = "50% 50%", cap }: { src: string; alt: string; className?: string; pos?: string; cap?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-30px" });
  const [err, setErr] = useState(false);
  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      <motion.div className="absolute inset-0 overflow-hidden" style={{ background: "#e9e6de" }} initial={{ clipPath: "inset(100% 0% 0% 0%)" }} animate={{ clipPath: seen ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" }} transition={{ duration: 1.1, ease: EASE }}>
        {err ? (
          <div className="flex h-full w-full items-center justify-center text-[12px]" style={{ color: "var(--tk-sub)" }}>이미지 준비 중</div>
        ) : (
          <motion.img src={src} alt={alt} onError={() => setErr(true)} className="h-full w-full object-cover" style={{ objectPosition: pos }} initial={{ scale: 1.14 }} animate={{ scale: seen ? 1 : 1.14 }} transition={{ duration: 1.6, ease: EASE }} />
        )}
        {cap && <span className="absolute bottom-2 left-2 bg-white/90 px-1.5 py-0.5 text-[10px]" style={{ color: "var(--tk-char)" }}>{cap}</span>}
      </motion.div>
    </div>
  );
}

/* 숫자가 바뀔 때 이전 값에서 굴러가는 카운터 */
function Roll({ to, decimals = 0 }: { to: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [v, setV] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(prev.current, to, { duration: 1.1, ease: EASE, onUpdate: (x) => { prev.current = x; setV(x); } });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{v.toLocaleString("ko-KR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</span>;
}

function Head({ no, en, children, sub, dark = false }: { no: string; en: string; children: ReactNode; sub?: ReactNode; dark?: boolean }) {
  return (
    <div className="mb-8">
      <Rise>
        <div className="tk-en mb-3 flex items-center gap-2 text-[11px] font-semibold" style={{ color: "var(--tk-coral)" }}>
          <span>{no}</span>
          <motion.span className="h-px w-10 origin-left" style={{ background: "var(--tk-coral)" }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.2, ease: EASE }} />
          <span>{en}</span>
        </div>
      </Rise>
      <h2 className="text-[26px] font-bold leading-[1.38] tracking-tight" style={{ color: dark ? "#fff" : "var(--tk-deep)" }}><Lift>{children}</Lift></h2>
      {sub && <Rise delay={0.15}><p className="mt-3 text-[14.5px] leading-[1.8]" style={{ color: dark ? "#a9c1bd" : "var(--tk-sub)" }}>{sub}</p></Rise>}
    </div>
  );
}

function Pending({ children = "입력 대기" }: { children?: ReactNode }) {
  return <span className="rounded border border-dashed px-1.5 py-0.5 text-[11.5px]" style={{ borderColor: "var(--tk-coral)", color: "var(--tk-coral)" }}>{children}</span>;
}

function Icon({ d, size = 22 }: { d: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;
}
const I: Record<string, string> = {
  bed: "M3 18V8 M3 13h18v5 M21 18v-3 M7 13V10h5v3",
  key: "M14 10a4 4 0 1 0-3.5 4L9 15.5V18h2.5v-2H13l1.5-1.5 M15.5 8.5h.01",
  bot: "M12 3v3 M6 9h12v9H6z M9 13h.01 M15 13h.01 M9.5 16h5 M3 12v3 M21 12v3",
  bolt: "M13 3L5 14h6l-1 7 8-11h-6z",
  shield: "M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6z M9 12l2 2 4-4",
  chart: "M4 20V4 M4 20h16 M8 16v-4 M12 16V8 M16 16v-6",
  sofa: "M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3 M3 11h18v5H3z M5 16v2 M19 16v2",
  cup: "M5 8h11v5a5 5 0 0 1-10 0z M16 9h2a2 2 0 0 1 0 4h-2 M8 3v2 M11 3v2",
  wash: "M5 3h14v18H5z M5 7h14 M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M8 5h.01",
  box: "M4 7l8-4 8 4v10l-8 4-8-4z M4 7l8 4 8-4 M12 11v10",
  brief: "M4 8h16v11H4z M9 8V5h6v3 M4 13h16",
  users: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M2.5 20a6.5 6.5 0 0 1 13 0 M16 4.5a3.5 3.5 0 0 1 0 6.5 M18 14a6 6 0 0 1 3.5 6",
  map: "M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z M9 4v14 M15 6v14",
  home: "M3 11l9-7 9 7 M5 10v10h14V10 M10 20v-6h4v6",
  pin: "M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  arrow: "M5 12h14 M13 6l6 6-6 6",
  down: "M6 9l6 6 6-6",
  up: "M12 19V5 M5 12l7-7 7 7",
  plus: "M12 5v14 M5 12h14",
  check: "M5 12l5 5L20 7",
  mail: "M4 6h16v12H4z M4 7l8 6 8-6",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2",
};

const NAV: [string, string][] = [["concept", "사업 소개"], ["building", "건물"], ["space", "공간 계획"], ["smart", "AI 운영"], ["location", "입지·수요"], ["revenue", "수익 구조"], ["check", "사전 확인"], ["contact", "문의"]];

const GALLERY = [
  { f: "real-s", t: "현재 건물 (남측)", s: "감정평가서 사진 · 2021" },
  { f: "real-nw", t: "현재 건물 (북서측)", s: "감정평가서 사진 · 2021" },
  { f: "r-se", t: "남동측 투시도", s: "분양 브로슈어 · 간판은 예시" },
  { f: "r-nw", t: "북서측 야간 투시도", s: "분양 브로슈어 · 간판은 예시" },
  { f: "section", t: "횡단면도", s: "분양 브로슈어" },
  { f: "r-court", t: "5층 중정 테라스", s: "분양 브로슈어 투시도" },
];

const STATE: Record<UnitState, { l: string; bg: string; fg: string }> = {
  use: { l: "사용 중", bg: "#dfe7e5", fg: "#3a4644" },
  vacant: { l: "공실", bg: "#e2734a", fg: "#fff" },
  check: { l: "확인 필요", bg: "#fff", fg: "#b9653f" },
};

/* ── 첫 화면 건물 그래픽: 윤곽이 그려지고 2층 창이 하나씩 켜진다 ── */
const edgeX = (y: number) => Math.min(330, 240 + (y - 90)); // 사선 지붕 오른쪽 경계
const FL = [
  { top: 90, left: 84 }, { top: 130, left: 62 }, { top: 170, left: 40 }, { top: 210, left: 20 }, { top: 250, left: 20 },
];
function HeroBuilding() {
  const ref = useRef<SVGSVGElement>(null);
  const seen = useInView(ref, { once: true });
  const wins = useMemo(() => {
    const out: { x: number; y: number; fl: number; lit: boolean }[] = [];
    FL.forEach((f, fi) => {
      if (fi === 4) return;
      const y = f.top + 11;
      for (let x = f.left + 12; x + 14 <= edgeX(y) - 8; x += 22) out.push({ x, y, fl: fi, lit: fi !== 3 && (x * 7 + fi * 13) % 5 === 0 });
    });
    return out;
  }, []);
  let h = 0;
  return (
    <svg ref={ref} viewBox="0 0 360 310" className="block w-full" aria-label="The K 빌딩 2층에 들어서는 스마트호스텔 개념 그래픽">
      <defs>
        <linearGradient id="tk-glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1f4a46" /><stop offset="1" stopColor="#123430" /></linearGradient>
      </defs>
      <motion.path d="M20 290 V210 H40 V170 H62 V130 H84 V90 H240 L330 180 V290 Z" fill="url(#tk-glass)" stroke="#8fd3bf" strokeWidth="1.4"
        initial={{ pathLength: 0 }} animate={{ pathLength: seen ? 1 : 0 }} transition={{ duration: 2, ease: "easeInOut" }} />
      {[250, 210, 170, 130].map((y, i) => (
        <motion.line key={y} x1={FL[Math.min(4, 4 - i)].left} x2={edgeX(y)} y1={y} y2={y} stroke="#8fd3bf" strokeWidth="0.8"
          initial={{ pathLength: 0 }} animate={{ pathLength: seen ? 1 : 0 }} transition={{ duration: 1, delay: 0.8 + i * 0.15, ease: "easeInOut" }} />
      ))}
      {/* 1층 상가 유리 */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.rect key={i} x={30 + i * 50} y={258} width={42} height={26} fill="#1b403c" stroke="#3f7a72" strokeWidth="0.6"
          initial={{ scaleY: 0 }} animate={{ scaleY: seen ? 1 : 0 }} style={{ transformOrigin: `${51 + i * 50}px 284px` }} transition={{ duration: 0.6, delay: 1.4 + i * 0.05, ease: EASE }} />
      ))}
      {wins.map((w, i) => {
        const hostel = w.fl === 3;
        const order = hostel ? h++ : 0;
        return (
          <motion.rect key={i} x={w.x} y={w.y} width={14} height={18} rx={1}
            initial={{ fill: "#163c38" }}
            animate={{ fill: seen ? (hostel ? "#ffcf86" : w.lit ? "#5c8f86" : "#1a433f") : "#163c38" }}
            transition={{ duration: 0.5, delay: hostel ? 2.1 + order * 0.14 : 1.6 + (i % 7) * 0.08 }} />
        );
      })}
      {/* 2층 표시 */}
      <motion.g initial={{ x: 30 }} animate={{ x: seen ? 0 : 30 }} transition={{ duration: 0.8, delay: 3.6, ease: EASE }}>
        <motion.line x1="330" y1="230" x2="346" y2="230" stroke="#e2734a" strokeWidth="1.4" />
        <rect x="300" y="190" width="58" height="26" rx="3" fill="#e2734a" />
        <text x="329" y="201" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#fff" letterSpacing="1">2F</text>
        <text x="329" y="211" textAnchor="middle" fontSize="6.5" fill="#fff">스마트호스텔(안)</text>
      </motion.g>
      <motion.line x1="0" y1="290" x2="360" y2="290" stroke="#8fd3bf" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: seen ? 1 : 0 }} transition={{ duration: 1.2, ease: "easeInOut" }} />
    </svg>
  );
}

/* ── 객실 평면 그림 (안) ── */
function RoomPlan({ k }: { k: string }) {
  const S = 30;
  const dim = k === "single" ? [3, 3] : k === "double" ? [3.4, 3.6] : [4, 4];
  const W = dim[0] * S, H = dim[1] * S;
  const ox = (200 - W) / 2, oy = (150 - H) / 2;
  const beds = k === "single" ? [[0.15, 0.2, 1, 2]] : k === "double" ? [[0.15, 0.2, 1.5, 2]] : [[0.15, 0.2, 1, 2], [1.35, 0.2, 1, 2]];
  return (
    <svg viewBox="0 0 200 150" className="block w-full">
      <rect x={ox} y={oy} width={W} height={H} fill="#fff" stroke="#0e2b29" strokeWidth="2.5" />
      {/* 욕실 */}
      <rect x={ox + W - 1.3 * S} y={oy} width={1.3 * S} height={1.4 * S} fill="#eaf5f2" stroke="#0e2b29" strokeWidth="1.2" />
      <text x={ox + W - 0.65 * S} y={oy + 0.8 * S} textAnchor="middle" fontSize="7" fill="#3a4644">욕실</text>
      {beds.map(([x, y, w, hh], i) => (
        <motion.g key={i} initial={{ y: -8 }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: EASE }}>
          <rect x={ox + x * S} y={oy + y * S} width={w * S} height={hh * S} rx="3" fill="#f4efe6" stroke="#e2734a" strokeWidth="1.2" />
          <rect x={ox + x * S + 4} y={oy + y * S + 4} width={w * S - 8} height={10} rx="2" fill="#f19a74" />
        </motion.g>
      ))}
      {/* 책상 */}
      <rect x={ox + W - 1.1 * S} y={oy + H - 0.55 * S} width={1 * S} height={0.45 * S} fill="#d9cfbf" stroke="#8a7b66" strokeWidth="0.8" />
      {/* 문 */}
      <line x1={ox + W - 2.2 * S} y1={oy + H} x2={ox + W - 1.4 * S} y2={oy + H} stroke="#fff" strokeWidth="4" />
      <path d={`M${ox + W - 2.2 * S} ${oy + H} A ${0.8 * S} ${0.8 * S} 0 0 1 ${ox + W - 1.4 * S} ${oy + H - 0.8 * S}`} fill="none" stroke="#8fd3bf" strokeWidth="1" />
      <text x={ox + W / 2} y={oy + H + 13} textAnchor="middle" fontSize="7.5" fill="#6b7775">{dim[0]}m × {dim[1]}m (안)</text>
    </svg>
  );
}

/* ── 2층 전환 전후 도식 ── */
function FloorSwap({ after }: { after: boolean }) {
  const units = FLOORS.find((f) => f.f === "2F")!.units;
  const total = units.reduce((a, u) => a + u.m2, 0);
  let x = 0;
  return (
    <svg viewBox="0 0 320 120" className="block w-full">
      {units.map((u) => {
        const w = (u.m2 / total) * 316;
        const ux = 2 + x; x += w;
        const target = u.s === "vacant";
        const rooms = target ? Math.max(3, Math.round(u.m2 / 22)) : 0;
        return (
          <g key={u.n}>
            <motion.rect x={ux} y={10} width={w - 3} height={90} initial={false}
              animate={{ fill: target ? (after ? "#0e2b29" : "#ece9e2") : "#dfe7e5" }} transition={{ duration: 0.6 }} stroke="#c9c4b8" strokeWidth="0.8" />
            {target && Array.from({ length: rooms }).map((_, r) => {
              const rw = (w - 9) / rooms;
              return (
                <motion.rect key={r} x={ux + 3 + r * rw} y={16} width={rw - 2} height={36} rx={1.5} initial={false}
                  animate={{ scaleY: after ? 1 : 0, fill: "#ffcf86" }} style={{ transformOrigin: `${ux + 3 + r * rw}px 16px` }} transition={{ duration: 0.45, delay: after ? 0.2 + r * 0.06 : 0, ease: EASE }} />
              );
            })}
            <text x={ux + (w - 3) / 2} y={target ? 78 : 60} textAnchor="middle" fontSize="9" fontWeight="700" fill={target && after ? "#fff" : "#3a4644"}>{u.n}</text>
            <text x={ux + (w - 3) / 2} y={target ? 90 : 72} textAnchor="middle" fontSize="7" fill={target && after ? "#8fd3bf" : "#6b7775"}>{target ? (after ? "객실" : "공실") : u.s === "use" ? "영업 중" : "확인"}</text>
          </g>
        );
      })}
      <line x1="2" y1="108" x2="318" y2="108" stroke="#0e2b29" strokeWidth="1.5" />
      <text x="2" y="118" fontSize="7" fill="#6b7775">2층 호실 배치를 면적 비율로 단순화한 도식</text>
    </svg>
  );
}

export default function TheKSite() {
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState("");
  const [after, setAfter] = useState(true);
  const [floor, setFloor] = useState(3);
  const [cand, setCand] = useState(0);
  const [room, setRoom] = useState(0);
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);
  const [mode, setMode] = useState<"month" | "night">("month");
  const [occ, setOcc] = useState(85);
  const [open, setOpen] = useState<number | null>(0);
  const [gal, setGal] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [showTop, setShowTop] = useState(false);
  const galRef = useRef<HTMLDivElement>(null);
  const smartRef = useRef<HTMLDivElement>(null);
  const smartSeen = useInView(smartRef, { margin: "-30%" });

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    NAV.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);

  /* 투숙 흐름 자동 넘김 — 화면에 보일 때만, 손으로 누르면 멈춤 */
  useEffect(() => {
    if (!auto || !smartSeen) return;
    const t = setTimeout(() => setStep((s) => (s + 1) % JOURNEY.length), 3800);
    return () => clearTimeout(t);
  }, [auto, smartSeen, step]);

  const go = (id: string) => {
    setMenu(false);
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 54, behavior: "smooth" });
  };
  const onGalScroll = () => {
    const el = galRef.current; if (!el) return;
    const w = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 12 : 1;
    setGal(Math.min(GALLERY.length - 1, Math.round(el.scrollLeft / w)));
  };
  const switchMode = (m: "month" | "night") => { setMode(m); setOcc(m === "month" ? 85 : 60); };

  const counts = useMemo(() => {
    const c = { use: 0, vacant: 0, check: 0 };
    FLOORS.forEach((f) => f.units.forEach((u) => { c[u.s]++; }));
    return c;
  }, []);
  const roomTotal = ROOMS.reduce((a, r) => a + r.n, 0);
  const rev = ROOMS.map((r) => ({ ...r, v: (mode === "month" ? r.month : r.night * 30) * r.n * (occ / 100) }));
  const revSum = rev.reduce((a, r) => a + r.v, 0);
  const mapQ = encodeURIComponent("경기도 파주시 금촌동 958-12");

  return (
    <div className="tk">
      <div className="relative mx-auto w-full max-w-[480px]">
        <div className="px-4 py-1.5 text-center text-[11px]" style={{ background: "var(--tk-deep)", color: "#a9c1bd" }}>임시 홈페이지 · 사업명은 가칭이며, (안) 표시 수치는 설계·시장조사 전 가정입니다</div>

        {/* 헤더 */}
        <header className="sticky top-0 z-40 border-b" style={{ background: "rgba(255,255,255,.95)", borderColor: "var(--tk-line)", backdropFilter: "blur(10px)" }}>
          <div className="flex h-[54px] items-center justify-between px-4">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2.5 text-left leading-tight">
              <span className="flex h-8 w-8 items-center justify-center text-[15px] font-black text-white" style={{ background: "var(--tk-deep)" }}>K</span>
              <span>
                <span className="tk-en block text-[9.5px] font-semibold" style={{ color: "var(--tk-coral)" }}>{PROJECT.nameEn}</span>
                <span className="block text-[15px] font-bold" style={{ color: "var(--tk-deep)" }}>{PROJECT.nameKo} <span className="text-[11px] font-normal" style={{ color: "var(--tk-sub)" }}>({PROJECT.tag})</span></span>
              </span>
            </button>
            <button onClick={() => setMenu(true)} aria-label="메뉴 열기" className="flex h-10 w-10 flex-col items-end justify-center gap-[5px]">
              <span className="h-[1.5px] w-6" style={{ background: "var(--tk-deep)" }} /><span className="h-[1.5px] w-4" style={{ background: "var(--tk-coral)" }} /><span className="h-[1.5px] w-6" style={{ background: "var(--tk-deep)" }} />
            </button>
          </div>
          <nav className="tk-noscroll flex gap-4 overflow-x-auto px-4 text-[13px]">
            {NAV.map(([id, l]) => (
              <button key={id} onClick={() => go(id)} className="relative shrink-0 pb-2.5 pt-0.5 font-semibold" style={{ color: active === id ? "var(--tk-deep)" : "#9aa5a3" }}>
                {l}
                {active === id && <motion.span layoutId="tk-nav" className="absolute inset-x-0 bottom-0 h-[2px]" style={{ background: "var(--tk-coral)" }} transition={{ duration: 0.35, ease: EASE }} />}
              </button>
            ))}
          </nav>
        </header>

        {/* 메뉴 */}
        <AnimatePresence>
          {menu && (
            <motion.div key="m" className="fixed inset-y-0 right-0 z-50 w-full max-w-[480px]" style={{ background: "var(--tk-deep)" }} initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.5, ease: EASE }}>
              <div className="flex h-[54px] items-center justify-between px-5">
                <span className="tk-en text-[11px] font-semibold" style={{ color: "var(--tk-coral2)" }}>MENU</span>
                <button onClick={() => setMenu(false)} aria-label="메뉴 닫기" className="text-[28px] leading-none text-white">×</button>
              </div>
              <div className="px-6 pt-2">
                {NAV.map(([id, l], i) => (
                  <motion.button key={id} onClick={() => go(id)} className="flex w-full items-baseline justify-between border-b py-3.5 text-left" style={{ borderColor: "#24504b" }}
                    initial={{ x: 40 }} animate={{ x: 0 }} transition={{ duration: 0.5, delay: 0.1 + i * 0.04, ease: EASE }}>
                    <span className="text-[20px] font-bold text-white">{l}</span>
                    <span className="tk-en text-[11px]" style={{ color: "var(--tk-mint)" }}>0{i + 1}</span>
                  </motion.button>
                ))}
                <p className="mt-7 text-[12px] leading-[1.7]" style={{ color: "#86a39f" }}>{PROJECT.building}<br />{PROJECT.address} ({PROJECT.roadAddress})</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HERO */}
        <section className="relative overflow-hidden px-6 pt-12" style={{ background: "radial-gradient(120% 70% at 80% 10%, #1d4a46 0%, #0e2b29 55%, #0a201e 100%)" }}>
          {/* 흐르는 격자 */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="tk-drift absolute inset-y-0 left-0 w-[200%]" style={{ backgroundImage: "linear-gradient(#ffffff0d 1px, transparent 1px), linear-gradient(90deg, #ffffff0d 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
          </div>
          <div className="relative text-white">
            <div className="tk-en text-[11.5px] font-semibold" style={{ color: "var(--tk-mint)" }}><Lift delay={0.1}>THE K SMART HOSTEL · PAJU</Lift></div>
            <h1 className="mt-3 text-[32px] font-bold leading-[1.3] tracking-tight">
              <Lift delay={0.25}>파주 금촌,</Lift>
              <Lift delay={0.4}>머무는 방식이</Lift>
              <Lift delay={0.55}><span style={{ color: "var(--tk-glow)" }}>스마트해집니다</span></Lift>
            </h1>
            <Rise delay={0.8}><p className="mt-4 text-[14.5px] leading-[1.75]" style={{ color: "#c3d6d2" }}>The K 빌딩의 비어 있는 층을<br />AI·IoT로 운영하는 무인 스마트호스텔로 바꿉니다.</p></Rise>
          </div>
          <div className="relative -mx-2 mt-6"><HeroBuilding /></div>
          <div className="relative -mx-6 grid grid-cols-3 border-t" style={{ borderColor: "#24504b", background: "#0a201e" }}>
            {[[<><Roll to={roomTotal} />실</>, "객실 계획 (안)"], [<>24h</>, "무인 체크인"], [<><Roll to={366} />㎡</>, "2층 후보 공간"]].map(([v, l], i) => (
              <div key={i} className="px-3 py-4 text-center" style={{ borderLeft: i ? "1px solid #24504b" : undefined }}>
                <div className="text-[22px] font-bold" style={{ color: "var(--tk-glow)" }}>{v}</div>
                <div className="mt-0.5 text-[11px]" style={{ color: "#8fb0ab" }}>{l}</div>
              </div>
            ))}
          </div>
          <button onClick={() => go("concept")} aria-label="아래로" className="tk-cue absolute bottom-[86px] right-5 text-white/60"><Icon d={I.down} size={28} /></button>
        </section>

        {/* 01 사업 소개 */}
        <section id="concept" className="px-6 pt-16 pb-14">
          <Head no="01" en="CONCEPT" sub="임대가 나가지 않던 공실 호실을 묶어, 프런트 없이 휴대폰으로 체크인하는 소형 스마트호스텔로 전환합니다. 건물은 공실을 줄이고, 방문객은 합리적인 가격에 깔끔한 방을 얻습니다.">비어 있는 층을,<br />머무는 공간으로</Head>
          <div className="grid grid-cols-3 gap-2">
            {[[I.bed, "공실 → 객실", "호실 묶음 전환"], [I.key, "무인 운영", "모바일 체크인"], [I.chart, "건물 가치", "공실 해소"]].map(([ic, a, b], i) => (
              <Rise key={a} delay={i * 0.08}>
                <div className="flex h-full flex-col items-center border px-2 py-4 text-center" style={{ borderColor: "var(--tk-line)" }}>
                  <span style={{ color: "var(--tk-coral)" }}><Icon d={ic} size={26} /></span>
                  <span className="mt-2 text-[14px] font-bold" style={{ color: "var(--tk-deep)" }}>{a}</span>
                  <span className="text-[11.5px]" style={{ color: "var(--tk-sub)" }}>{b}</span>
                </div>
              </Rise>
            ))}
          </div>

          <Rise>
            <div className="mt-9 mb-2 flex border p-1" style={{ borderColor: "var(--tk-line)" }}>
              {[false, true].map((v) => (
                <button key={String(v)} onClick={() => setAfter(v)} className="relative flex-1 py-2 text-[13px] font-bold">
                  {after === v && <motion.span layoutId="tk-ba" className="absolute inset-0" style={{ background: v ? "var(--tk-deep)" : "var(--tk-sand)" }} transition={{ duration: 0.35, ease: EASE }} />}
                  <span className="relative z-10" style={{ color: after === v ? (v ? "#fff" : "var(--tk-deep)") : "var(--tk-sub)" }}>{v ? "전환 후 (안)" : "지금 (2층)"}</span>
                </button>
              ))}
            </div>
          </Rise>
          <div className="border p-3" style={{ borderColor: "var(--tk-line)" }}><FloorSwap after={after} /></div>
          <p className="mt-2 text-[11px] leading-[1.6]" style={{ color: "var(--tk-sub)" }}>버튼을 눌러 보세요. 2026.02.28 임대현황표 기준 공실 4개 호실(201·203·204·205호)을 객실로 바꾸는 방안입니다.</p>

          <div className="mt-8 grid gap-2.5">
            {[["공실 해소", "임차인이 정해지지 않던 호실에서 매달 숙박 매출"], ["저비용 운영", "프런트·야간 상주 인력 없이 앱과 원격 관리"], ["AI 실증", "무인 체크인·IoT·로봇 순찰을 실제 시설에서 운영"], ["지역 수요", "출장·방문·관광으로 파주를 찾는 단기 체류객"]].map(([a, b], i) => (
              <motion.div key={a} className="flex items-center gap-4 p-4" style={{ background: "var(--tk-sand)" }} initial={{ x: -30 }} whileInView={{ x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}>
                <span className="tk-en w-9 shrink-0 text-[12px] font-bold" style={{ color: "var(--tk-coral)" }}>0{i + 1}</span>
                <div><div className="text-[15px] font-bold" style={{ color: "var(--tk-deep)" }}>{a}</div><div className="text-[13px]" style={{ color: "var(--tk-sub)" }}>{b}</div></div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 02 건물 */}
        <section id="building" className="pt-14 pb-14" style={{ background: "var(--tk-sand)" }}>
          <div className="px-6">
            <Head no="02" en="THE K BUILDING" sub="2020년 준공된 지하 1층, 지상 5층 근린생활·업무 복합건물입니다. 1층은 음식점이 영업 중이고, 엘리베이터 2대와 자주식 주차장을 갖췄습니다.">The K 빌딩</Head>
          </div>
          <div ref={galRef} onScroll={onGalScroll} className="tk-noscroll flex snap-x snap-mandatory gap-3 overflow-x-auto px-6">
            {GALLERY.map((g, i) => (
              <button key={g.f} onClick={() => setLightbox(i)} className="w-[84%] shrink-0 snap-center bg-white text-left">
                <Photo src={IMG(g.f)} alt={`${g.t} — ${g.s}`} className="h-[220px]" />
                <div className="px-4 py-3">
                  <div className="text-[14.5px] font-bold" style={{ color: "var(--tk-deep)" }}>{g.t}</div>
                  <div className="text-[11.5px]" style={{ color: "var(--tk-sub)" }}>{g.s}</div>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-3 flex justify-center gap-1.5">
            {GALLERY.map((_, i) => <motion.span key={i} className="h-1.5 rounded-full" animate={{ width: i === gal ? 18 : 6, backgroundColor: i === gal ? "#e2734a" : "#cfcabd" }} transition={{ duration: 0.3 }} />)}
          </div>
          <div className="px-6">
            <Rise>
              <dl className="mt-8 border-t bg-white px-4 text-[13.5px]" style={{ borderColor: "var(--tk-deep)" }}>
                {[["위치", <>{PROJECT.address}<br /><span style={{ color: "var(--tk-sub)" }}>({PROJECT.roadAddress})</span></>] as [string, ReactNode], ...BUILDING].map(([k, v], i) => (
                  <div key={i} className="grid grid-cols-[76px_1fr] gap-3 border-b py-3" style={{ borderColor: "var(--tk-line)" }}>
                    <dt className="font-semibold" style={{ color: "var(--tk-deep)" }}>{k}</dt><dd className="leading-[1.6]">{v}</dd>
                  </div>
                ))}
              </dl>
            </Rise>
            <p className="mt-2 text-[11px]" style={{ color: "var(--tk-sub)" }}>출처: 감정평가서(2021.10.28 기준) · 분양 브로슈어</p>

            {/* 층별 호실 현황 */}
            <Rise><div className="mt-10 mb-1 text-[18px] font-bold" style={{ color: "var(--tk-deep)" }}>층별 호실 현황 <span className="text-[12px] font-normal" style={{ color: "var(--tk-sub)" }}>· 층을 눌러 보세요</span></div></Rise>
            <div className="mb-3 flex gap-3 text-[11.5px]" style={{ color: "var(--tk-char)" }}>
              {(["vacant", "use", "check"] as UnitState[]).map((s) => (
                <span key={s} className="flex items-center gap-1"><span className="inline-block h-3 w-3 border" style={{ background: STATE[s].bg, borderColor: s === "check" ? "#b9653f" : STATE[s].bg }} />{STATE[s].l} {counts[s]}</span>
              ))}
            </div>
            <div className="grid grid-cols-[64px_1fr] gap-3">
              <div className="space-y-1">
                {FLOORS.map((f, i) => {
                  const v = f.units.filter((u) => u.s === "vacant").length;
                  return (
                    <button key={f.f} onClick={() => setFloor(i)} className="relative flex h-11 w-full items-center justify-between overflow-hidden border px-2 text-left" style={{ borderColor: floor === i ? "var(--tk-deep)" : "var(--tk-line)", background: "#fff" }}>
                      <motion.span className="absolute inset-y-0 left-0 w-full origin-left" style={{ background: "var(--tk-deep)" }} animate={{ scaleX: floor === i ? 1 : 0 }} transition={{ duration: 0.4, ease: EASE }} />
                      <span className="relative z-10 text-[13px] font-bold" style={{ color: floor === i ? "#fff" : "var(--tk-deep)" }}>{f.f}</span>
                      {v > 0 && <span className="relative z-10 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white" style={{ background: "var(--tk-coral)" }}>{v}</span>}
                    </button>
                  );
                })}
                <div className="h-[3px]" style={{ background: "var(--tk-char)" }} />
              </div>
              <div className="relative overflow-hidden bg-white p-4">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={floor} initial={{ y: 20, clipPath: "inset(100% 0% 0% 0%)" }} animate={{ y: 0, clipPath: "inset(0% 0% 0% 0%)" }} exit={{ y: -14, clipPath: "inset(0% 0% 100% 0%)" }} transition={{ duration: 0.4, ease: EASE }}>
                    <div className="tk-en text-[11px] font-semibold" style={{ color: "var(--tk-coral)" }}>{FLOORS[floor].f}</div>
                    <div className="text-[16px] font-bold" style={{ color: "var(--tk-deep)" }}>{FLOORS[floor].use}</div>
                    <div className="mt-3 grid grid-cols-2 gap-1.5">
                      {FLOORS[floor].units.map((u, k) => (
                        <motion.div key={u.n} className="border px-2 py-1.5" style={{ background: STATE[u.s].bg, color: STATE[u.s].fg, borderColor: u.s === "check" ? "#e3b49c" : STATE[u.s].bg, borderStyle: u.s === "check" ? "dashed" : "solid" }}
                          initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ duration: 0.35, delay: 0.05 + k * 0.04, ease: EASE }}>
                          <div className="text-[13px] font-bold">{u.n}호</div>
                          <div className="text-[10.5px]">{u.m2}㎡ · {STATE[u.s].l}</div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            <p className="mt-2 text-[11px] leading-[1.6]" style={{ color: "var(--tk-sub)" }}>임대현황표(2026.02.28) 기준이며 임대 현황은 수시로 바뀝니다. 면적은 전용면적입니다.</p>
          </div>
        </section>

        {/* 03 공간 계획 */}
        <section id="space" className="px-6 pt-16 pb-14">
          <Head no="03" en="SPACE PLAN" sub="공실이 몰려 있는 두 층을 후보로 검토합니다. 두 곳 모두 500㎡ 미만이라 소형 다중생활시설 기준 안에 들어갑니다.">어디에, 어떻게<br />객실을 놓을까</Head>
          <div className="flex border p-1" style={{ borderColor: "var(--tk-line)" }}>
            {CANDIDATES.map((c, i) => (
              <button key={c.k} onClick={() => setCand(i)} className="relative flex-1 py-2.5 text-[13px] font-bold">
                {cand === i && <motion.span layoutId="tk-cand" className="absolute inset-0" style={{ background: "var(--tk-deep)" }} transition={{ duration: 0.35, ease: EASE }} />}
                <span className="relative z-10" style={{ color: cand === i ? "#fff" : "var(--tk-sub)" }}>후보 {c.k} · {c.f}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={cand} initial={{ clipPath: "inset(0% 100% 0% 0%)" }} animate={{ clipPath: "inset(0% 0% 0% 0%)" }} exit={{ clipPath: "inset(0% 0% 0% 100%)" }} transition={{ duration: 0.5, ease: EASE }}>
              <div className="relative mt-3 overflow-hidden" style={{ background: "#f2f2f0" }}>
                <img src={IMG(CANDIDATES[cand].img)} alt={`${CANDIDATES[cand].f} 평면 투시도 (분양 브로슈어)`} className="block w-full" />
                <span className="absolute left-2 top-2 bg-white/90 px-1.5 py-0.5 text-[10px]" style={{ color: "var(--tk-char)" }}>{CANDIDATES[cand].f} 평면 투시도 · 분양 브로슈어</span>
              </div>
              <div className="mt-3 flex items-end justify-between border-b pb-3" style={{ borderColor: "var(--tk-line)" }}>
                <div><div className="text-[12px]" style={{ color: "var(--tk-sub)" }}>대상 호실</div><div className="text-[16px] font-bold" style={{ color: "var(--tk-deep)" }}>{CANDIDATES[cand].units}</div></div>
                <div className="text-right"><div className="text-[12px]" style={{ color: "var(--tk-sub)" }}>전용 합계</div><div className="text-[20px] font-bold" style={{ color: "var(--tk-coral)" }}>{CANDIDATES[cand].m2.toFixed(1)}㎡</div></div>
              </div>
              <ul className="mt-3 space-y-1.5 text-[13px] leading-[1.6]">
                {CANDIDATES[cand].pros.map((p) => <li key={p} className="flex gap-2"><span className="mt-0.5 shrink-0" style={{ color: "#2f8f7a" }}><Icon d={I.check} size={16} /></span>{p}</li>)}
                {CANDIDATES[cand].cons.map((p) => <li key={p} className="flex gap-2" style={{ color: "var(--tk-char)" }}><span className="mt-0.5 shrink-0" style={{ color: "var(--tk-coral)" }}><Icon d={I.plus} size={16} /></span>{p}</li>)}
              </ul>
            </motion.div>
          </AnimatePresence>

          {/* 객실 타입 */}
          <Rise><div className="mt-12 text-[18px] font-bold" style={{ color: "var(--tk-deep)" }}>객실 구성 <span className="text-[12px] font-normal" style={{ color: "var(--tk-sub)" }}>· 2층 기준 {roomTotal}실 (안)</span></div></Rise>
          <div className="mt-3 flex gap-1.5">
            {ROOMS.map((r, i) => (
              <button key={r.k} onClick={() => setRoom(i)} className="relative flex-1 rounded-full border py-2 text-[12.5px] font-bold" style={{ borderColor: room === i ? "var(--tk-coral)" : "var(--tk-line)" }}>
                {room === i && <motion.span layoutId="tk-room" className="absolute inset-0 rounded-full" style={{ background: "var(--tk-coral)" }} transition={{ duration: 0.35, ease: EASE }} />}
                <span className="relative z-10" style={{ color: room === i ? "#fff" : "var(--tk-char)" }}>{r.t.replace("스마트 ", "")}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 overflow-hidden" style={{ background: "var(--tk-sand)" }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={room} initial={{ y: 24, clipPath: "inset(100% 0% 0% 0%)" }} animate={{ y: 0, clipPath: "inset(0% 0% 0% 0%)" }} exit={{ y: -16, clipPath: "inset(0% 0% 100% 0%)" }} transition={{ duration: 0.45, ease: EASE }}>
                <div className="px-6 pt-5"><RoomPlan k={ROOMS[room].k} /></div>
                <div className="px-5 pb-5">
                  <div className="tk-en text-[10.5px] font-semibold" style={{ color: "var(--tk-coral)" }}>{ROOMS[room].en}</div>
                  <div className="text-[19px] font-bold" style={{ color: "var(--tk-deep)" }}>{ROOMS[room].t}</div>
                  <p className="mt-1.5 text-[13.5px] leading-[1.7]" style={{ color: "var(--tk-char)" }}>{ROOMS[room].d}</p>
                  <div className="mt-3 grid grid-cols-3 gap-px" style={{ background: "var(--tk-line)" }}>
                    {[["면적", `약 ${ROOMS[room].m2}㎡`], ["객실 수", `${ROOMS[room].n}실`], ["침대", ROOMS[room].bed]].map(([a, b]) => (
                      <div key={a} className="bg-white px-2 py-2.5 text-center"><div className="text-[10.5px]" style={{ color: "var(--tk-sub)" }}>{a}</div><div className="text-[12.5px] font-bold" style={{ color: "var(--tk-deep)" }}>{b}</div></div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2">
            {SHARED.map((s, i) => (
              <Rise key={s.t} delay={i * 0.06}>
                <div className="h-full border p-4" style={{ borderColor: "var(--tk-line)" }}>
                  <span style={{ color: "var(--tk-coral)" }}><Icon d={I[s.icon]} size={24} /></span>
                  <div className="mt-2 text-[14.5px] font-bold" style={{ color: "var(--tk-deep)" }}>{s.t}</div>
                  <div className="text-[12px] leading-[1.5]" style={{ color: "var(--tk-sub)" }}>{s.d}</div>
                </div>
              </Rise>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-[1.6]" style={{ color: "var(--tk-sub)" }}>객실 크기·수·공용공간은 설계 전 가정입니다. 다중생활시설 기준상 객실 안 취사시설은 두지 않습니다.</p>
        </section>

        {/* 04 AI 운영 */}
        <section id="smart" className="px-6 pt-16 pb-14" style={{ background: "var(--tk-deep)" }}>
          <Head dark no="04" en="SMART OPERATION" sub="프런트 직원 없이 예약부터 체크아웃까지 휴대폰과 AI로 처리합니다. 관리자는 한 화면에서 객실·출입·에너지를 봅니다.">사람 대신 AI가<br />24시간 지킵니다</Head>
          <div ref={smartRef}>
            <div className="grid grid-cols-5 gap-1">
              {JOURNEY.map((j, i) => (
                <button key={j.en} onClick={() => { setStep(i); setAuto(false); }} className="text-left">
                  <div className="relative h-[3px] overflow-hidden" style={{ background: "#24504b" }}>
                    <motion.div key={i === step ? `on${step}` : `off${i}`} className="absolute inset-0 origin-left" style={{ background: "var(--tk-coral)" }}
                      initial={{ scaleX: i === step && auto ? 0 : i < step ? 1 : 0 }} animate={{ scaleX: i <= step ? 1 : 0 }} transition={{ duration: i === step && auto ? 3.8 : 0.3, ease: "linear" }} />
                  </div>
                  <div className="mt-2 text-[11px] font-bold" style={{ color: i === step ? "#fff" : "#6f908b" }}>{j.t}</div>
                </button>
              ))}
            </div>
            <div className="relative mt-5 min-h-[218px] overflow-hidden" style={{ background: "var(--tk-deep2)" }}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={step} className="p-5" initial={{ x: 40, clipPath: "inset(0% 0% 0% 100%)" }} animate={{ x: 0, clipPath: "inset(0% 0% 0% 0%)" }} exit={{ x: -30, clipPath: "inset(0% 100% 0% 0%)" }} transition={{ duration: 0.45, ease: EASE }}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center" style={{ background: "var(--tk-coral)", color: "#fff" }}><Icon d={[I.phone, I.key, I.bolt, I.shield, I.check][step]} size={22} /></span>
                    <div>
                      <div className="tk-en text-[10.5px] font-semibold" style={{ color: "var(--tk-mint)" }}>STEP 0{step + 1} · {JOURNEY[step].en}</div>
                      <div className="text-[19px] font-bold text-white">{JOURNEY[step].t}</div>
                    </div>
                  </div>
                  <p className="mt-4 text-[14px] leading-[1.75]" style={{ color: "#c3d6d2" }}>{JOURNEY[step].d}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">{JOURNEY[step].tags.map((t) => <span key={t} className="border px-2 py-0.5 text-[11.5px]" style={{ borderColor: "#3c6b66", color: "var(--tk-mint)" }}>{t}</span>)}</div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-px" style={{ background: "#24504b" }}>
            {[[I.bot, "AI 컨시어지", "다국어 24시간"], [I.bolt, "IoT 에너지", "빈 방 자동 절전"], [I.shield, "원격 보안", "출입·화재 알림"]].map(([ic, a, b]) => (
              <div key={a} className="p-3.5 text-center" style={{ background: "var(--tk-deep)" }}>
                <span className="inline-block" style={{ color: "var(--tk-glow)" }}><Icon d={ic} size={22} /></span>
                <div className="mt-1 text-[12.5px] font-bold text-white">{a}</div>
                <div className="text-[10.5px]" style={{ color: "#8fb0ab" }}>{b}</div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-[1.6]" style={{ color: "#7f9e99" }}>무인 운영 장비와 AI·로봇 솔루션의 도입 범위는 협의 중이며, 설계 단계에서 확정합니다.</p>
        </section>

        {/* 05 입지·수요 */}
        <section id="location" className="pt-16 pb-14">
          <div className="px-6">
            <Head no="05" en="LOCATION & DEMAND" sub="금촌로터리 남측, 근린생활시설이 모인 금촌 생활권 한가운데에 자리합니다.">파주 금촌에서<br />누가 머물까</Head>
            <Rise>
              <div className="relative h-[250px] overflow-hidden border" style={{ borderColor: "var(--tk-line)" }}>
                <iframe title="The K 빌딩 위치 지도" src={`https://maps.google.com/maps?q=${mapQ}&z=16&output=embed`} className="h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </Rise>
            <div className="mt-2 flex items-center justify-between text-[12px]">
              <span className="flex items-center gap-1" style={{ color: "var(--tk-char)" }}><Icon d={I.pin} size={14} />파주시 금촌동 958-12</span>
              <a href={`https://map.naver.com/p/search/${mapQ}`} target="_blank" rel="noopener" className="font-semibold underline underline-offset-4" style={{ color: "var(--tk-deep)" }}>네이버 지도</a>
            </div>
            <ul className="mt-5 space-y-2 text-[13.5px] leading-[1.6]">
              {LOCATION.map((l, i) => (
                <motion.li key={l} className="flex gap-2.5" initial={{ x: -20 }} whileInView={{ x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}>
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--tk-coral)" }} />{l}
                </motion.li>
              ))}
            </ul>
            <p className="mt-2 text-[11px]" style={{ color: "var(--tk-sub)" }}>입지 문구: 감정평가서 &lsquo;대상부동산 개황&rsquo; 기재 내용</p>
            <Rise><div className="mt-10 text-[18px] font-bold" style={{ color: "var(--tk-deep)" }}>예상 수요층 <span className="text-[12px] font-normal" style={{ color: "var(--tk-sub)" }}>· 사업 가정</span></div></Rise>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {DEMAND.map((d, i) => (
                <motion.div key={d.t} className="p-4" style={{ background: i === 0 || i === 3 ? "var(--tk-sand)" : "#eef6f3" }} initial={{ scale: 0.9 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}>
                  <span style={{ color: "var(--tk-deep)" }}><Icon d={I[d.icon]} size={24} /></span>
                  <div className="mt-2 text-[14.5px] font-bold" style={{ color: "var(--tk-deep)" }}>{d.t}</div>
                  <div className="text-[12px] leading-[1.5]" style={{ color: "var(--tk-sub)" }}>{d.d}</div>
                </motion.div>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-[1.6]" style={{ color: "var(--tk-sub)" }}>수요층은 사업 가정이며, 주변 숙박시설 가격과 투숙 수요는 시장조사 후 반영합니다.</p>
          </div>
        </section>

        {/* 06 수익 구조 */}
        <section id="revenue" className="px-6 pt-16 pb-14" style={{ background: "var(--tk-deep)" }}>
          <Head dark no="06" en="REVENUE MODEL" sub={<>월 단위 장기 투숙으로 먼저 열고, 인허가가 확인되면 하루 단위 숙박을 더하는 구조입니다. 아래는 <b className="text-white">가격·입실률을 가정한 계산기(안)</b>입니다.</>}>입실률을 움직여<br />매출을 보세요</Head>
          <div className="flex border p-1" style={{ borderColor: "#24504b" }}>
            {([["month", "월 단위 (다중생활시설)"], ["night", "일 단위 (숙박업 가정)"]] as const).map(([k, l]) => (
              <button key={k} onClick={() => switchMode(k)} className="relative flex-1 py-2.5 text-[12.5px] font-bold">
                {mode === k && <motion.span layoutId="tk-mode" className="absolute inset-0" style={{ background: "var(--tk-coral)" }} transition={{ duration: 0.35, ease: EASE }} />}
                <span className="relative z-10" style={{ color: mode === k ? "#fff" : "#8fb0ab" }}>{l}</span>
              </button>
            ))}
          </div>
          <div className="mt-6 text-center">
            <div className="text-[12px]" style={{ color: "#8fb0ab" }}>예상 월 매출 (안)</div>
            <div className="mt-1 text-[40px] font-bold leading-none" style={{ color: "var(--tk-glow)" }}>약 <Roll to={Math.round(revSum)} /><span className="text-[18px]">만원</span></div>
            <div className="mt-2 text-[12px]" style={{ color: "#8fb0ab" }}>연 환산 약 {(revSum * 12 / 10000).toFixed(2)}억원</div>
          </div>
          <div className="mt-6">
            <div className="mb-1 flex justify-between text-[12.5px]">
              <span style={{ color: "#c3d6d2" }}>입실률</span><span className="font-bold text-white">{occ}%</span>
            </div>
            <input type="range" min={30} max={100} step={5} value={occ} onChange={(e) => setOcc(+e.target.value)} className="tk-range" style={{ ["--p" as string]: `${((occ - 30) / 70) * 100}%` }} aria-label="입실률" />
            <div className="flex justify-between text-[10.5px]" style={{ color: "#6f908b" }}><span>30%</span><span>100%</span></div>
          </div>
          <div className="mt-6 space-y-3">
            {rev.map((r) => (
              <div key={r.k}>
                <div className="flex justify-between text-[12.5px]">
                  <span className="text-white">{r.t} <span style={{ color: "#8fb0ab" }}>× {r.n}실 · {mode === "month" ? `월 ${r.month}만원` : `1박 ${r.night}만원`}</span></span>
                  <span className="font-bold text-white">{Math.round(r.v).toLocaleString()}만</span>
                </div>
                <div className="mt-1 h-2" style={{ background: "#1b4440" }}>
                  <motion.div className="h-full origin-left" style={{ background: r.k === "single" ? "var(--tk-coral)" : r.k === "double" ? "var(--tk-glow)" : "var(--tk-mint)" }} initial={false} animate={{ scaleX: revSum ? r.v / revSum : 0 }} transition={{ duration: 0.6, ease: EASE }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-7 border p-4 text-[12px] leading-[1.75]" style={{ borderColor: "#3c6b66", color: "#a9c1bd" }}>
            <div className="mb-1 font-bold" style={{ color: "var(--tk-coral2)" }}>계산 전제 (안)</div>
            · 객실 {roomTotal}실, 가격은 주변 시세 조사 전 가정치<br />
            · 일 단위는 30일 기준이며, 숙박업 인허가가 확인될 때만 해당<br />
            · 매출만 표시 — 임대료·인건비·공사비·장비비는 견적 후 반영
          </div>
        </section>

        {/* 07 사전 확인 */}
        <section id="check" className="px-6 pt-16 pb-14">
          <Head no="07" en="CHECKPOINTS" sub="숙박 영업은 용도지역과 건물 용도에 따라 가능 범위가 정해집니다. 공사 전에 아래 사항을 먼저 확인합니다.">문을 열기 전에<br />먼저 확인할 것</Head>
          <div className="border-t" style={{ borderColor: "var(--tk-deep)" }}>
            {CHECKS.map((c, i) => (
              <div key={c.t} className="border-b" style={{ borderColor: "var(--tk-line)" }}>
                <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center gap-3 py-4 text-left">
                  <span className="tk-en w-6 text-[12px] font-bold" style={{ color: "var(--tk-coral)" }}>0{i + 1}</span>
                  <span className="flex-1 text-[15px] font-bold" style={{ color: "var(--tk-deep)" }}>{c.t}</span>
                  <span className="px-1.5 py-0.5 text-[10.5px] font-bold" style={c.s === "핵심" ? { background: "var(--tk-coral)", color: "#fff" } : { border: "1px solid var(--tk-line)", color: "var(--tk-char)" }}>{c.s}</span>
                  <motion.span animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.3 }} style={{ color: "var(--tk-deep)" }}><Icon d={I.plus} size={18} /></motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div key="b" className="overflow-hidden" initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.35, ease: EASE }}>
                      <p className="pb-4 pl-9 text-[13.5px] leading-[1.75]" style={{ color: "var(--tk-char)" }}>{c.d}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <Rise><div className="mt-12 mb-5 text-[18px] font-bold" style={{ color: "var(--tk-deep)" }}>추진 순서 <span className="text-[12px] font-normal" style={{ color: "var(--tk-sub)" }}>· (안)</span></div></Rise>
          <div className="relative pl-8">
            <motion.div className="absolute left-[7px] top-2 bottom-2 w-px origin-top" style={{ background: "var(--tk-coral)" }} initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 1.6, ease: EASE }} />
            {ROADMAP.map((r, i) => (
              <Rise key={r.t} delay={0.1 + i * 0.08} className="relative mb-6 last:mb-0">
                <motion.span className="absolute -left-8 top-1 h-[15px] w-[15px] rounded-full border-2" style={{ borderColor: "var(--tk-coral)", background: i === 0 ? "var(--tk-coral)" : "#fff" }} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }} />
                <div className="tk-en text-[11.5px] font-bold" style={{ color: "var(--tk-coral)" }}>STEP 0{i + 1}</div>
                <div className="text-[16px] font-bold" style={{ color: "var(--tk-deep)" }}>{r.t}</div>
                <div className="text-[13px]" style={{ color: "var(--tk-sub)" }}>{r.d}</div>
              </Rise>
            ))}
          </div>
        </section>

        {/* 08 문의 */}
        <section id="contact" className="px-6 pt-14 pb-14" style={{ background: "var(--tk-sand)" }}>
          <Head no="08" en="CONTACT">사업 문의</Head>
          <dl className="border-t bg-white px-4 text-[14px]" style={{ borderColor: "var(--tk-deep)" }}>
            {[
              ["사업명", `${PROJECT.nameKo} (${PROJECT.tag})`],
              ["대상 건물", PROJECT.building],
              ["위치", <>{PROJECT.address}<br /><span style={{ color: "var(--tk-sub)" }}>({PROJECT.roadAddress})</span></>],
              ["운영 법인", PROJECT.operator || <Pending />],
              ["연락처", PROJECT.phone ? <a href={`tel:${PROJECT.phone}`}>{PROJECT.phone}</a> : <Pending />],
              ["이메일", PROJECT.email ? <a href={`mailto:${PROJECT.email}`}>{PROJECT.email}</a> : <Pending />],
            ].map(([k, v], i) => (
              <div key={i} className="grid grid-cols-[78px_1fr] gap-3 border-b py-3.5" style={{ borderColor: "var(--tk-line)" }}>
                <dt className="font-semibold" style={{ color: "var(--tk-deep)" }}>{k}</dt><dd className="leading-[1.6]">{v}</dd>
              </div>
            ))}
          </dl>
          <a href={`https://map.naver.com/p/search/${mapQ}`} target="_blank" rel="noopener" className="mt-5 flex items-center justify-center gap-2 py-3.5 text-[14px] font-bold text-white" style={{ background: "var(--tk-deep)" }}><Icon d={I.pin} size={18} />지도에서 위치 보기</a>
        </section>

        <footer className="px-6 pt-10 pb-12" style={{ background: "#081a18", color: "#86a39f" }}>
          <div className="tk-en text-[11px] font-semibold" style={{ color: "var(--tk-coral2)" }}>{PROJECT.nameEn}</div>
          <div className="mt-1 text-[16px] font-bold text-white">{PROJECT.nameKo} <span className="text-[12px] font-normal" style={{ color: "#86a39f" }}>({PROJECT.tag})</span></div>
          <p className="mt-4 text-[12px] leading-[1.8]">{PROJECT.building}<br />{PROJECT.address}</p>
          <p className="mt-5 text-[11px] leading-[1.7]" style={{ color: "#5f7e79" }}>
            이 페이지는 사업 구상을 소개하기 위한 임시 홈페이지입니다. 건물 사진은 감정평가서(2021) 수록 사진이고, 투시도·평면도는 분양 브로슈어 자료로 그 안의 간판·인물은 예시입니다. 건물 그래픽·객실 평면·전후 도식은 이해를 돕기 위해 그린 그림입니다. 객실 구성·가격·매출은 설계와 시장조사 전 가정치이며, 숙박 영업 가능 여부는 인허가 확인 후 확정됩니다. 임대 현황은 2026.02.28 기준으로 수시로 바뀝니다.
          </p>
          <p className="tk-en mt-5 text-[10.5px]">© 2026 THE K SMART HOSTEL</p>
        </footer>

        <AnimatePresence>
          {lightbox !== null && (
            <motion.div key="lb" className="fixed inset-0 z-50 flex flex-col items-center justify-center px-3" style={{ background: "rgba(8,26,24,.95)" }} initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.45, ease: EASE }} onClick={() => setLightbox(null)}>
              <img src={IMG(GALLERY[lightbox].f)} alt={GALLERY[lightbox].t} className="max-h-[78vh] w-full max-w-[480px] object-contain" />
              <div className="mt-3 text-center text-[13px] text-white">{GALLERY[lightbox].t} · <span className="text-white/60">{GALLERY[lightbox].s}</span></div>
              <div className="mt-2 text-[12px] text-white/50">화면을 누르면 닫힙니다</div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showTop && (
            <motion.button key="top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="맨 위로" className="fixed bottom-5 z-40 flex h-11 w-11 items-center justify-center shadow-lg"
              style={{ right: "max(16px, calc(50vw - 240px + 16px))", background: "var(--tk-deep)", color: "var(--tk-glow)" }} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.3 }}>
              <Icon d={I.up} size={20} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
