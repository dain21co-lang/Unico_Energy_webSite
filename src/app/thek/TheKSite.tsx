"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence, animate, useInView } from "framer-motion";
import { PROJECT, CEO, BUILDING, FLOORS, CANDIDATES, ROOMS, LONGSTAY, AMENITIES, FACILITIES, AI_READY, JOURNEY, NEARBY, TRIPS, DEMAND, LOCATION, CHECKS, ROADMAP } from "./data";
import type { UnitState } from "./data";
import { model, FIXED1, CAPEX1_SUM } from "./finance";

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
  drop: "M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z",
  wifi: "M2 9a15 15 0 0 1 20 0 M5 12.5a10 10 0 0 1 14 0 M8.5 16a5 5 0 0 1 7 0 M12 19.5h.01",
  desk: "M3 9h18 M5 9v11 M19 9v11 M14 9v6h5 M7 5h5v4H7z",
  cal: "M4 6h16v14H4z M4 10h16 M8 3v4 M16 3v4",
  user: "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21a8 8 0 0 1 16 0",
  send: "M4 12l16-8-6 16-3-6z M11 14l9-10",
  cam: "M3 7h4l2-3h6l2 3h4v12H3z M12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2",
};

const NAV: [string, string, string][] = [["home", "HOME", "홈"], ["about", "ABOUT", "브랜드·사업 소개"], ["rooms", "ROOMS", "객실"], ["smart", "SMART SYSTEM", "AI·비대면 운영"], ["facilities", "FACILITIES", "공용시설"], ["location", "LOCATION", "위치·교통"], ["reservation", "RESERVATION", "예약·입실 문의"], ["contact", "CONTACT", "상담·제휴"]];

/* AI 이미지 슬롯 — AI_READY에 파일이 있으면 사진, 없으면 디자인 패널 */
function Shot({ f, label, className, pos = "50% 50%", dark = false }: { f: string; label: string; className?: string; pos?: string; dark?: boolean }) {
  if (AI_READY.includes(f)) return <Photo src={IMG(f)} alt={`${label} (AI 이미지 예시)`} className={className} pos={pos} cap="AI 이미지 · 예시" />;
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`} style={{ background: dark ? "linear-gradient(150deg,#1d4a46,#0e2b29)" : "linear-gradient(150deg,#f4efe6,#e9dfcf)" }}>
      <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(${dark ? "#ffffff14" : "#0e2b2912"} 1px, transparent 1px)`, backgroundSize: "14px 14px" }} />
      <motion.div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full" style={{ background: dark ? "#e2734a33" : "#e2734a22" }} animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span style={{ color: dark ? "#8fd3bf" : "#e2734a" }}><Icon d={I.cam} size={26} /></span>
        <span className="mt-1.5 text-[12px] font-semibold" style={{ color: dark ? "#c3d6d2" : "#3a4644" }}>{label}</span>
        <span className="text-[10.5px]" style={{ color: dark ? "#7f9e99" : "#8a8f8c" }}>AI 이미지 준비 중</span>
      </div>
    </div>
  );
}

const GALLERY = [
  { f: "ext-2", t: "오픈 후 외관 (예시)", s: "AI 영상 · 예시" },
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

/* ── 첫 화면 건물 그래픽: 윤곽이 그려지고 3·4층 창이 하나씩 켜진다 ── */
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
      for (let x = f.left + 12; x + 14 <= edgeX(y) - 8; x += 22) out.push({ x, y, fl: fi, lit: (fi === 0 || fi === 3) && (x * 7 + fi * 13) % 5 === 0 });
    });
    return out;
  }, []);
  let h = 0;
  return (
    <svg ref={ref} viewBox="0 0 360 310" className="block w-full" aria-label="The K 빌딩 3·4층에 들어서는 스마트호스텔 개념 그래픽">
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
        const hostel = w.fl === 1 || w.fl === 2;
        const order = hostel ? h++ : 0;
        return (
          <motion.rect key={i} x={w.x} y={w.y} width={14} height={18} rx={1}
            initial={{ fill: "#163c38" }}
            animate={{ fill: seen ? (hostel ? "#ffcf86" : w.lit ? "#5c8f86" : "#1a433f") : "#163c38" }}
            transition={{ duration: 0.5, delay: hostel ? 2.1 + order * 0.14 : 1.6 + (i % 7) * 0.08 }} />
        );
      })}
      {/* 3·4층 표시 */}
      <motion.g initial={{ x: 30 }} animate={{ x: seen ? 0 : 30 }} transition={{ duration: 0.8, delay: 3.6, ease: EASE }}>
        <rect x="290" y="150" width="64" height="26" rx="3" fill="#e2734a" />
        <text x="322" y="161" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#fff" letterSpacing="1">3·4F</text>
        <text x="322" y="171" textAnchor="middle" fontSize="6.5" fill="#fff">스마트호스텔(안)</text>
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

/* ── 3·4층 전환 전후 도식 ── */
function FloorSwap({ after }: { after: boolean }) {
  const rows = FLOORS.filter((f) => f.f === "4F" || f.f === "3F");
  return (
    <svg viewBox="0 0 320 150" className="block w-full">
      {rows.map((fl, ri) => {
        const total = fl.units.reduce((a, u) => a + u.m2, 0);
        let x = 0;
        const y = 8 + ri * 64;
        return (
          <g key={fl.f}>
            <text x="0" y={y + 32} fontSize="10" fontWeight="700" fill="#0e2b29">{fl.f}</text>
            {fl.units.map((u, ui) => {
              const w = (u.m2 / total) * 290;
              const ux = 26 + x; x += w;
              const rooms = Math.max(3, Math.round(u.m2 / 24));
              const keep = u.n === "304";
              return (
                <g key={u.n}>
                  <motion.rect x={ux} y={y} width={w - 3} height={54} initial={false} animate={{ fill: after && !keep ? "#0e2b29" : keep && after ? "#e2734a" : u.s === "vacant" ? "#ece9e2" : "#dfe7e5" }} transition={{ duration: 0.6, delay: after ? ri * 0.15 : 0 }} stroke="#c9c4b8" strokeWidth="0.8" />
                  {Array.from({ length: rooms }).map((_, r) => {
                    const rw = (w - 9) / rooms;
                    return <motion.rect key={r} x={ux + 3 + r * rw} y={y + 5} width={rw - 2} height={22} rx={1.5} initial={false} animate={{ scaleY: after && !keep ? 1 : 0, fill: "#ffcf86" }} style={{ transformOrigin: `${ux + 3 + r * rw}px ${y + 5}px` }} transition={{ duration: 0.45, delay: after ? 0.25 + ri * 0.2 + ui * 0.05 + r * 0.03 : 0, ease: EASE }} />;
                  })}
                  <text x={ux + (w - 3) / 2} y={y + 40} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={after ? "#fff" : "#3a4644"}>{u.n}</text>
                  <text x={ux + (w - 3) / 2} y={y + 50} textAnchor="middle" fontSize="6.5" fill={after ? "#8fd3bf" : "#6b7775"}>{keep ? (after ? "5층 이전" : "노래방") : after ? "객실" : u.s === "vacant" ? "공실" : "명도 협의"}</text>
                </g>
              );
            })}
          </g>
        );
      })}
      <text x="26" y="146" fontSize="7" fill="#6b7775">3·4층 호실 배치를 면적 비율로 단순화한 도식 · 304호 노래방은 5층 이전</text>
    </svg>
  );
}

/* 브랜드 필름 — 화면에 보이면 소리 없이 자동 재생, 벗어나면 멈춤. 누르면 일시정지/재생 */
function FilmPlayer() {
  const ref = useRef<HTMLVideoElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const near = useInView(box, { margin: "300px 0px" });
  const seen = useInView(box, { amount: 0.45 });
  const [paused, setPaused] = useState(false);
  const [prog, setProg] = useState(0);
  useEffect(() => {
    const v = ref.current; if (!v) return;
    if (seen && !paused) v.play().catch(() => {}); else v.pause();
  }, [seen, paused]);
  return (
    <div ref={box} className="relative overflow-hidden bg-black" style={{ aspectRatio: "9 / 16", maxHeight: "78vh" }} onClick={() => setPaused((p) => !p)}>
      <video ref={ref} src={near ? "/thek/video/brand_film.mp4" : undefined} poster="/thek/video/film-poster.webp" muted loop playsInline preload={near ? "auto" : "none"}
        onTimeUpdate={(e) => { const v = e.currentTarget; if (v.duration) setProg(v.currentTime / v.duration); }} className="h-full w-full object-cover" />
      <div className="absolute inset-x-0 bottom-0 h-[3px]" style={{ background: "rgba(255,255,255,.2)" }}>
        <div className="h-full origin-left" style={{ background: "var(--tk-coral)", transform: `scaleX(${prog})` }} />
      </div>
      <AnimatePresence>
        {paused && (
          <motion.span key="p" className="absolute left-1/2 top-1/2 -ml-8 -mt-8 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: "rgba(226,115,74,.9)" }} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.25 }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
          </motion.span>
        )}
      </AnimatePresence>
      <span className="absolute left-2 top-2 bg-white/85 px-1.5 py-0.5 text-[10px]" style={{ color: "var(--tk-char)" }}>AI 영상 · 예시</span>
    </div>
  );
}

const STAYS: [number, string][] = [[1, "1박"], [2, "2박"], [3, "3박"], [7, "1주"], [30, "한 달 (STAY 30)"]];
const LOGS = ["203호 모바일 키 체크인", "복도 B 순찰 완료", "205호 빈 방 절전 전환", "라운지 재실 6명", "201호 청소 완료 · 점검 기록", "택배 2건 락커 보관", "출입 이상 없음 · 야간 모드"];

export default function TheKSite() {
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState("home");
  const [after, setAfter] = useState(true);
  const [floor, setFloor] = useState(3);
  const [cand, setCand] = useState(0);
  const [roomMode, setRoomMode] = useState<"short" | "long">("short");
  const [room, setRoom] = useState(0);
  const [plan, setPlan] = useState(false);
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);
  const [lsh, setLsh] = useState(50);
  const [occ, setOcc] = useState(65);
  const [open, setOpen] = useState<number | null>(0);
  const [partner, setPartner] = useState<number | null>(null);
  const [gal, setGal] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [showTop, setShowTop] = useState(false);
  const [bk, setBk] = useState({ date: "", stay: 1, room: "single", guests: 1, name: "", phone: "", note: "" });
  const [sent, setSent] = useState<"" | "sms" | "copied" | "ready">("");
  const [cells, setCells] = useState<number[]>(() => Array.from({ length: 18 }, (_, i) => (i * 7) % 5 === 0 ? 2 : (i * 3) % 4 === 0 ? 1 : 0));
  const [logAt, setLogAt] = useState(0);
  const galRef = useRef<HTMLDivElement>(null);
  const roomRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (!auto || !smartSeen) return;
    const t = setTimeout(() => setStep((s) => (s + 1) % JOURNEY.length), 3800);
    return () => clearTimeout(t);
  }, [auto, smartSeen, step]);

  /* 관제 화면 예시 — 화면에 보일 때만 살아 움직임 */
  useEffect(() => {
    if (!smartSeen) return;
    const t = setInterval(() => {
      setCells((c) => { const n = [...c]; const k = Math.floor(Math.random() * n.length); n[k] = (n[k] + 1) % 3; return n; });
      setLogAt((l) => l + 1);
    }, 2200);
    return () => clearInterval(t);
  }, [smartSeen]);

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
  const onRoomScroll = () => {
    const el = roomRef.current; if (!el) return;
    const w = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 12 : 1;
    setRoom(Math.min(ROOMS.length - 1, Math.round(el.scrollLeft / w)));
  };
  const findRoom = () => { setRoomMode(bk.stay >= 30 ? "long" : "short"); go("rooms"); };

  const counts = useMemo(() => {
    const c = { use: 0, vacant: 0, check: 0 };
    FLOORS.forEach((f) => f.units.forEach((u) => { c[u.s]++; }));
    return c;
  }, []);
  const roomTotal = ROOMS.reduce((a, r) => a + r.n, 0);
  const sim = model(ROOMS, lsh / 100, occ / 100, FIXED1);
  const picked = ROOMS.find((r) => r.k === bk.room) ?? ROOMS[0];
  const est = bk.stay >= 30 ? picked.month : Math.round(picked.night * bk.stay * 10) / 10;
  const mapQ = encodeURIComponent("경기도 파주시 금촌동 958-12");
  const inputCls = "w-full border bg-white px-3 py-2.5 text-[14px] outline-none focus:border-[#e2734a]";

  const submit = async () => {
    const msg = `[${PROJECT.nameKo} 입실 문의]\n체크인: ${bk.date || "미정"}\n기간: ${STAYS.find((s) => s[0] === bk.stay)?.[1]}\n객실: ${picked.t} · ${bk.guests}명\n이름: ${bk.name || "-"}\n연락처: ${bk.phone || "-"}\n요청: ${bk.note || "-"}`;
    if (PROJECT.phone) { window.location.href = `sms:${PROJECT.phone}?body=${encodeURIComponent(msg)}`; setSent("sms"); return; }
    try { await navigator.clipboard.writeText(msg); setSent("copied"); } catch { setSent("ready"); }
  };

  return (
    <div className="tk">
      <div className="relative mx-auto w-full max-w-[480px]">
        <div className="px-4 py-1.5 text-center text-[11px]" style={{ background: "var(--tk-deep)", color: "#a9c1bd" }}>오픈 준비 중 · 브랜드명은 가칭이며 (안) 표시 내용은 확정 전입니다</div>

        {/* 헤더 */}
        <header className="sticky top-0 z-40 border-b" style={{ background: "rgba(255,255,255,.95)", borderColor: "var(--tk-line)", backdropFilter: "blur(10px)" }}>
          <div className="flex h-[54px] items-center justify-between px-4">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-baseline gap-1.5 text-left leading-none">
              <span className="text-[22px] font-black tracking-tight" style={{ color: "var(--tk-deep)" }}>THE K<span style={{ color: "var(--tk-coral)" }}>.</span></span>
              <span className="tk-en text-[9.5px] font-bold" style={{ color: "var(--tk-sub)" }}>SMART HOSTEL</span>
            </button>
            <div className="flex items-center gap-2">
              <button onClick={() => go("reservation")} className="rounded-full px-3.5 py-1.5 text-[12.5px] font-bold text-white" style={{ background: "var(--tk-coral)" }}>예약 문의</button>
              <button onClick={() => setMenu(true)} aria-label="메뉴 열기" className="flex h-10 w-9 flex-col items-end justify-center gap-[5px]">
                <span className="h-[1.5px] w-6" style={{ background: "var(--tk-deep)" }} /><span className="h-[1.5px] w-4" style={{ background: "var(--tk-coral)" }} /><span className="h-[1.5px] w-6" style={{ background: "var(--tk-deep)" }} />
              </button>
            </div>
          </div>
          <nav className="tk-noscroll flex gap-4 overflow-x-auto px-4 text-[11.5px] tracking-wide">
            {NAV.map(([id, l]) => (
              <button key={id} onClick={() => go(id)} className="relative shrink-0 pb-2.5 pt-0.5 font-bold" style={{ color: active === id ? "var(--tk-deep)" : "#9aa5a3" }}>
                {l}
                {active === id && <motion.span layoutId="tk-nav" className="absolute inset-x-0 bottom-0 h-[2px]" style={{ background: "var(--tk-coral)" }} transition={{ duration: 0.35, ease: EASE }} />}
              </button>
            ))}
          </nav>
        </header>

        {/* 메뉴 */}
        <AnimatePresence>
          {menu && (
            <motion.div key="m" className="fixed inset-y-0 right-0 z-50 w-full max-w-[480px] overflow-y-auto" style={{ background: "var(--tk-deep)" }} initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.5, ease: EASE }}>
              <div className="flex h-[54px] items-center justify-between px-5">
                <span className="text-[20px] font-black text-white">THE K<span style={{ color: "var(--tk-coral)" }}>.</span></span>
                <button onClick={() => setMenu(false)} aria-label="메뉴 닫기" className="text-[28px] leading-none text-white">×</button>
              </div>
              <div className="px-6 pt-2 pb-10">
                {NAV.map(([id, l, ko], i) => (
                  <motion.button key={id} onClick={() => go(id)} className="flex w-full items-baseline justify-between border-b py-3.5 text-left" style={{ borderColor: "#24504b" }}
                    initial={{ x: 40 }} animate={{ x: 0 }} transition={{ duration: 0.5, delay: 0.08 + i * 0.04, ease: EASE }}>
                    <span className="text-[19px] font-bold tracking-wide text-white">{l}</span>
                    <span className="text-[12px]" style={{ color: "var(--tk-mint)" }}>{ko}</span>
                  </motion.button>
                ))}
                <button onClick={() => go("reservation")} className="mt-7 w-full py-3.5 text-[15px] font-bold text-white" style={{ background: "var(--tk-coral)" }}>예약 · 입실 문의</button>
                <a href="/thek/ir" className="mt-2 block w-full border py-3.5 text-center text-[15px] font-bold" style={{ borderColor: "#c9a96e", color: "#ecdcb6" }}>사업계획서 (IR) 보기</a>
                <p className="mt-6 text-[12px] leading-[1.7]" style={{ color: "#86a39f" }}>{PROJECT.building}<br />{PROJECT.address} ({PROJECT.roadAddress})</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HOME */}
        <section id="home" className="relative overflow-hidden px-6 pt-11" style={{ background: "radial-gradient(120% 70% at 80% 10%, #1d4a46 0%, #0e2b29 55%, #0a201e 100%)" }}>
          {AI_READY.includes("hero") && (
            <>
              <img src="/thek/video/hero-poster.webp" alt="더케이 스마트호스텔 외관 (AI 영상 예시)" className="absolute inset-x-0 top-0 h-[calc(100%-120px)] w-full object-cover" style={{ objectPosition: "50% 100%" }} />
              <video src="/thek/video/hero.mp4" poster="/thek/video/hero-poster.webp" autoPlay muted loop playsInline preload="auto" aria-hidden="true" className="absolute inset-x-0 top-0 h-[calc(100%-120px)] w-full object-cover" style={{ objectPosition: "50% 100%" }} />
              <div className="absolute inset-x-0 top-0 h-[calc(100%-120px)]" style={{ background: "linear-gradient(180deg,rgba(10,32,30,.78) 0%,rgba(10,32,30,.35) 30%,rgba(10,32,30,0) 55%,rgba(10,32,30,.15) 85%,#0a201e 100%)" }} />
              <span className="absolute right-3 top-3 z-10 bg-white/85 px-1.5 py-0.5 text-[10px]" style={{ color: "var(--tk-char)" }}>AI 영상 · 예시</span>
            </>
          )}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="tk-drift absolute inset-y-0 left-0 w-[200%]" style={{ backgroundImage: "linear-gradient(#ffffff0b 1px, transparent 1px), linear-gradient(90deg, #ffffff0b 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
          </div>
          <div className="relative text-white">
            <div className="tk-en text-[11px] font-semibold" style={{ color: "var(--tk-mint)" }}><Lift delay={0.1}>PREMIUM SMART HOSTEL · PAJU</Lift></div>
            <h1 className="mt-3 text-[34px] font-bold leading-[1.22] tracking-tight">
              <Lift delay={0.25}>Stay smart,</Lift>
              <Lift delay={0.4}><span style={{ color: "var(--tk-glow)" }}>live local.</span></Lift>
            </h1>
            <Rise delay={0.7}><p className="mt-3 text-[15px] leading-[1.7]" style={{ color: "#c3d6d2" }}>파주 금촌에서, 프런트 없이 휴대폰 하나로<br />들어오고 쉬고 일하는 스마트호스텔.</p></Rise>
            <Rise delay={0.85}>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["AI SECURITY", "SMART LOUNGE", "24H CHECK-IN"].map((t) => <span key={t} className="tk-en border px-2 py-1 text-[9.5px] font-bold" style={{ borderColor: "#3c6b66", color: "var(--tk-mint)" }}>{t}</span>)}
              </div>
            </Rise>
          </div>
          {!AI_READY.includes("hero") && <div className="relative -mx-2 mt-4"><HeroBuilding /></div>}
          {AI_READY.includes("hero") && <div className="h-[330px]" />}
          {/* 예약 바 */}
          <Rise delay={0.4} className="relative -mx-2 -mb-px">
            <div className="bg-white p-4 shadow-2xl" style={{ borderTop: "3px solid var(--tk-coral)" }}>
              <div className="text-[15px] font-bold" style={{ color: "var(--tk-deep)" }}>언제, 얼마나 머무세요?</div>
              <div className="mt-3 grid grid-cols-[1.25fr_1fr_.8fr] gap-1.5">
                <label className="block"><span className="text-[10.5px]" style={{ color: "var(--tk-sub)" }}>체크인</span>
                  <input type="date" value={bk.date} onChange={(e) => setBk({ ...bk, date: e.target.value })} className={`${inputCls} px-2 text-[12.5px]`} style={{ borderColor: "var(--tk-line)" }} /></label>
                <label className="block"><span className="text-[10.5px]" style={{ color: "var(--tk-sub)" }}>기간</span>
                  <select value={bk.stay} onChange={(e) => setBk({ ...bk, stay: +e.target.value })} className={`${inputCls} px-2 text-[12.5px]`} style={{ borderColor: "var(--tk-line)" }}>{STAYS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
                <label className="block"><span className="text-[10.5px]" style={{ color: "var(--tk-sub)" }}>인원</span>
                  <select value={bk.guests} onChange={(e) => setBk({ ...bk, guests: +e.target.value })} className={`${inputCls} px-2 text-[12.5px]`} style={{ borderColor: "var(--tk-line)" }}>{[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}명</option>)}</select></label>
              </div>
              <button onClick={findRoom} className="mt-3 flex w-full items-center justify-center gap-2 py-3 text-[14px] font-bold text-white" style={{ background: "var(--tk-deep)" }}>객실 찾기 <Icon d={I.arrow} size={17} /></button>
            </div>
          </Rise>
        </section>

        {/* ABOUT */}
        <section id="about" className="px-6 pt-16 pb-14">
          <Head no="01" en="ABOUT" sub="THE K는 파주 금촌 The K 빌딩에 들어서는 스마트호스텔(가칭)입니다. 호텔의 깔끔함과 호스텔의 합리적인 가격, 동네에 사는 듯한 일상을 한 건물에 담습니다.">머무는 하루가<br />가볍고 깔끔하게</Head>
          <div className="space-y-2.5">
            {[[I.key, "SMART STAY", "프런트 없는 체크인", "예약부터 체크아웃까지 휴대폰 하나로. 늦은 밤 도착해도 기다릴 필요가 없습니다."], [I.sofa, "SMART LOUNGE", "함께 쓰는 거실", "혼자 머물러도 외롭지 않게, 일하고 쉬고 이야기하는 공유 라운지."], [I.shield, "AI SECURITY", "AI가 지키는 밤", "출입 기록과 공용부 모니터링, 이상 신호 즉시 알림으로 24시간 안전하게."]].map(([ic, en, t, d], i) => (
              <motion.div key={en} className="flex gap-4 p-4" style={{ background: i === 1 ? "#eef6f3" : "var(--tk-sand)" }} initial={{ x: -30 }} whileInView={{ x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center" style={{ background: "var(--tk-deep)", color: "var(--tk-glow)" }}><Icon d={ic} size={22} /></span>
                <div>
                  <div className="tk-en text-[10px] font-bold" style={{ color: "var(--tk-coral)" }}>{en}</div>
                  <div className="text-[16px] font-bold" style={{ color: "var(--tk-deep)" }}>{t}</div>
                  <p className="mt-0.5 text-[13px] leading-[1.6]" style={{ color: "var(--tk-char)" }}>{d}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 대표 인사말 */}
          <div className="-mx-6 mt-12 overflow-hidden" style={{ background: "var(--tk-deep)" }}>
            <Photo src={IMG("ceo")} alt={`${CEO.title} ${CEO.name}`} className="h-[440px]" pos="50% 22%" />
            <div className="relative px-6 pt-8 pb-10">
              <div className="tk-en text-[10.5px] font-bold" style={{ color: "var(--tk-coral2)" }}>GREETING · 대표 인사말</div>
              <h3 className="mt-3 text-[25px] font-bold leading-[1.4] text-white">
                <Lift>{CEO.headline[0]}</Lift>
                <Lift delay={0.15}><span style={{ color: "var(--tk-glow)" }}>{CEO.headline[1]}</span></Lift>
              </h3>
              <motion.div className="mt-5 h-px w-12 origin-left" style={{ background: "var(--tk-coral)" }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: EASE }} />
              <div className="mt-5 space-y-4">
                {CEO.body.map((p, i) => (
                  <Rise key={i} delay={i * 0.06}><p className="text-[14.5px] leading-[1.95]" style={{ color: "#c9dbd7" }}>{p}</p></Rise>
                ))}
              </div>
              <Rise>
                <p className="mt-7 whitespace-pre-line text-[17px] font-bold leading-[1.7] text-white">{CEO.closing}</p>
                <div className="mt-6 flex items-end justify-between border-t pt-4" style={{ borderColor: "#24504b" }}>
                  <div>
                    <div className="text-[11.5px]" style={{ color: "#8fb0ab" }}>{PROJECT.nameKo} {CEO.title}</div>
                    <div className="mt-0.5 text-[24px] font-bold tracking-[0.3em] text-white">{CEO.name}</div>
                  </div>
                  <span className="text-[30px] font-black leading-none" style={{ color: "var(--tk-coral)" }}>K.</span>
                </div>
              </Rise>
              <div className="mt-8 p-4" style={{ background: "#0a201e" }}>
                <div className="tk-en mb-3 text-[10px] font-bold" style={{ color: "var(--tk-mint)" }}>PROFILE</div>
                <div className="space-y-2">
                  {CEO.career.map((c, i) => (
                    <motion.div key={c.t} className="grid grid-cols-[52px_1fr] gap-2 text-[12.5px]" initial={{ x: -16 }} whileInView={{ x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.04, ease: EASE }}>
                      <span className="font-bold" style={{ color: "var(--tk-glow)" }}>{c.y}</span><span style={{ color: "#c3d6d2" }}>{c.t}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Rise>
            <div className="mt-10">
              <div className="mb-2 flex items-baseline justify-between">
                <div><span className="tk-en text-[10.5px] font-bold" style={{ color: "var(--tk-coral)" }}>BRAND FILM</span><div className="text-[17px] font-bold" style={{ color: "var(--tk-deep)" }}>파주의 밤, 깨어 있는 건물 하나</div></div>
                <span className="text-[11px]" style={{ color: "var(--tk-sub)" }}>40초</span>
              </div>
              <FilmPlayer />
              <p className="mt-2 text-[11px]" style={{ color: "var(--tk-sub)" }}>AI로 만든 예시 영상으로, 실제 건물·객실과 다를 수 있습니다.</p>
            </div>
          </Rise>

          <Rise><div className="mt-12 text-[18px] font-bold" style={{ color: "var(--tk-deep)" }}>사업 소개 <span className="text-[12px] font-normal" style={{ color: "var(--tk-sub)" }}>· 빈 층을 머무는 공간으로</span></div></Rise>
          <p className="mt-2 text-[13.5px] leading-[1.75]" style={{ color: "var(--tk-char)" }}>2020년 준공된 지하 1층·지상 5층 근린생활·업무 복합건물의 공실 호실을 묶어 객실로 바꿉니다. 건물은 공실을 줄이고, 방문객은 도심 한가운데서 합리적인 숙소를 얻습니다.</p>
          <Rise>
            <div className="mt-5 mb-2 flex border p-1" style={{ borderColor: "var(--tk-line)" }}>
              {[false, true].map((v) => (
                <button key={String(v)} onClick={() => setAfter(v)} className="relative flex-1 py-2 text-[13px] font-bold">
                  {after === v && <motion.span layoutId="tk-ba" className="absolute inset-0" style={{ background: v ? "var(--tk-deep)" : "var(--tk-sand)" }} transition={{ duration: 0.35, ease: EASE }} />}
                  <span className="relative z-10" style={{ color: after === v ? (v ? "#fff" : "var(--tk-deep)") : "var(--tk-sub)" }}>{v ? "전환 후 (안)" : "지금 (3·4층)"}</span>
                </button>
              ))}
            </div>
          </Rise>
          <div className="border p-3" style={{ borderColor: "var(--tk-line)" }}><FloorSwap after={after} /></div>
          <p className="mt-2 text-[11px] leading-[1.6]" style={{ color: "var(--tk-sub)" }}>3·4층(약 950㎡)을 40실 안팎의 객실로 바꾸는 1단계 방안입니다. 소유주 측 확인: 2·3·4층 명도 가능, 5층은 노래방·당구장 등이 모이는 놀이층으로.</p>
        </section>

        {/* 건물 갤러리 띠 */}
        <section className="pt-2 pb-14">
          <div ref={galRef} onScroll={onGalScroll} className="tk-noscroll flex snap-x snap-mandatory gap-3 overflow-x-auto px-6">
            {GALLERY.map((g, i) => (
              <button key={g.f} onClick={() => setLightbox(i)} className="w-[78%] shrink-0 snap-center text-left">
                {g.f === "ext-2" ? (
                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                    <video src="/thek/video/exterior.mp4" poster="/thek/video/exterior-poster.webp" autoPlay muted loop playsInline preload="metadata" aria-label="오픈 후 외관 (AI 영상 예시)" className="h-full w-full object-cover" />
                  </div>
                ) : <Photo src={IMG(g.f)} alt={`${g.t} — ${g.s}`} className="aspect-video w-full" />}
                <div className="mt-2 text-[14px] font-bold" style={{ color: "var(--tk-deep)" }}>{g.t}</div>
                <div className="text-[11.5px]" style={{ color: "var(--tk-sub)" }}>{g.s}</div>
              </button>
            ))}
          </div>
          <div className="mt-3 flex justify-center gap-1.5">
            {GALLERY.map((_, i) => <motion.span key={i} className="h-1.5 rounded-full" animate={{ width: i === gal ? 18 : 6, backgroundColor: i === gal ? "#e2734a" : "#d6d1c5" }} transition={{ duration: 0.3 }} />)}
          </div>
          <div className="mx-6 mt-6 grid grid-cols-2 gap-px" style={{ background: "var(--tk-line)" }}>
            {[["2020", "준공 (사용승인)"], ["B1 / 5F", "지하 1층 · 지상 5층"], ["4,414㎡", "연면적"], ["39대", "자주식 주차"]].map(([v, l]) => (
              <div key={l} className="bg-white p-4"><div className="text-[20px] font-bold" style={{ color: "var(--tk-deep)" }}>{v}</div><div className="text-[11.5px]" style={{ color: "var(--tk-sub)" }}>{l}</div></div>
            ))}
          </div>
        </section>

        {/* ROOMS */}
        <section id="rooms" className="pt-16 pb-14" style={{ background: "var(--tk-sand)" }}>
          <div className="px-6">
            <Head no="02" en="ROOMS" sub="하룻밤 머무는 여행자부터 몇 달 지내는 출장자까지. 모든 객실에 개별 욕실과 모바일 키를 갖춥니다.">하루를 머물러도,<br />한 달을 살아도</Head>
            <div className="flex border p-1" style={{ borderColor: "#d9d2c3", background: "#fff" }}>
              {([["short", "ROOM TO STAY", "1박부터"], ["long", "LONG STAY", "한 달 살기"]] as const).map(([k, a, b]) => (
                <button key={k} onClick={() => setRoomMode(k)} className="relative flex-1 py-2.5">
                  {roomMode === k && <motion.span layoutId="tk-rm" className="absolute inset-0" style={{ background: "var(--tk-coral)" }} transition={{ duration: 0.35, ease: EASE }} />}
                  <span className="tk-en relative z-10 block text-[11px] font-bold" style={{ color: roomMode === k ? "#fff" : "var(--tk-deep)" }}>{a}</span>
                  <span className="relative z-10 block text-[10.5px]" style={{ color: roomMode === k ? "#ffe3d6" : "var(--tk-sub)" }}>{b}</span>
                </button>
              ))}
            </div>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            {roomMode === "short" ? (
              <motion.div key="s" initial={{ clipPath: "inset(0% 100% 0% 0%)" }} animate={{ clipPath: "inset(0% 0% 0% 0%)" }} exit={{ clipPath: "inset(0% 0% 0% 100%)" }} transition={{ duration: 0.5, ease: EASE }}>
                <div className="mt-4 flex items-center justify-between px-6">
                  <span className="text-[12px]" style={{ color: "var(--tk-sub)" }}>옆으로 넘겨 보세요 · {room + 1}/{ROOMS.length}</span>
                  <div className="flex border text-[11.5px] font-bold" style={{ borderColor: "#d9d2c3" }}>
                    {[false, true].map((v) => <button key={String(v)} onClick={() => setPlan(v)} className="px-2.5 py-1" style={{ background: plan === v ? "var(--tk-deep)" : "#fff", color: plan === v ? "#fff" : "var(--tk-char)" }}>{v ? "평면" : "사진"}</button>)}
                  </div>
                </div>
                <div ref={roomRef} onScroll={onRoomScroll} className="tk-noscroll mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6">
                  {ROOMS.map((r) => (
                    <div key={r.k} className="w-[86%] shrink-0 snap-center bg-white">
                      <div className="relative h-[230px] overflow-hidden">
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.div key={plan ? "p" : "i"} className="absolute inset-0" initial={{ clipPath: "inset(100% 0% 0% 0%)" }} animate={{ clipPath: "inset(0% 0% 0% 0%)" }} exit={{ clipPath: "inset(0% 0% 100% 0%)" }} transition={{ duration: 0.4, ease: EASE }}>
                            {plan ? <div className="flex h-full items-center bg-white px-8"><RoomPlan k={r.k} /></div> : <Shot f={`room-${r.k}`} label={`${r.t} 객실`} className="h-full w-full" />}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                      <div className="p-5">
                        <div className="flex items-baseline justify-between">
                          <div><div className="tk-en text-[10.5px] font-bold" style={{ color: "var(--tk-coral)" }}>{r.en}</div><div className="text-[19px] font-bold" style={{ color: "var(--tk-deep)" }}>{r.t}</div></div>
                          <div className="text-right"><div className="text-[10.5px]" style={{ color: "var(--tk-sub)" }}>1박 (안)</div><div className="text-[18px] font-bold" style={{ color: "var(--tk-coral)" }}>{r.night}만원~</div></div>
                        </div>
                        <p className="mt-2 text-[13px] leading-[1.65]" style={{ color: "var(--tk-char)" }}>{r.d}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5 text-[11.5px]">
                          {[`약 ${r.m2}㎡`, r.bed, `${r.n}실`].map((t) => <span key={t} className="border px-2 py-0.5" style={{ borderColor: "var(--tk-line)", color: "var(--tk-char)" }}>{t}</span>)}
                        </div>
                        <button onClick={() => { setBk({ ...bk, room: r.k, stay: bk.stay >= 30 ? 1 : bk.stay }); go("reservation"); }} className="mt-4 w-full border py-2.5 text-[13px] font-bold" style={{ borderColor: "var(--tk-deep)", color: "var(--tk-deep)" }}>이 객실로 문의</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex justify-center gap-1.5">
                  {ROOMS.map((_, i) => <motion.span key={i} className="h-1.5 rounded-full" animate={{ width: i === room ? 18 : 6, backgroundColor: i === room ? "#e2734a" : "#d6d1c5" }} transition={{ duration: 0.3 }} />)}
                </div>
              </motion.div>
            ) : (
              <motion.div key="l" className="px-6" initial={{ clipPath: "inset(0% 0% 0% 100%)" }} animate={{ clipPath: "inset(0% 0% 0% 0%)" }} exit={{ clipPath: "inset(0% 100% 0% 0%)" }} transition={{ duration: 0.5, ease: EASE }}>
                <div className="mt-4 bg-white">
                  <Shot f="longstay" label="장기 체류 객실" className="h-[300px]" pos="50% 45%" dark />
                  <div className="p-5">
                    <div className="flex items-baseline justify-between">
                      <div><div className="tk-en text-[10.5px] font-bold" style={{ color: "var(--tk-coral)" }}>{LONGSTAY.t}</div><div className="text-[19px] font-bold" style={{ color: "var(--tk-deep)" }}>{LONGSTAY.sub}</div></div>
                      <div className="text-right"><div className="text-[10.5px]" style={{ color: "var(--tk-sub)" }}>월 (안)</div><div className="text-[18px] font-bold" style={{ color: "var(--tk-coral)" }}>{LONGSTAY.from}만원~</div></div>
                    </div>
                    <p className="mt-2 text-[13px] leading-[1.65]" style={{ color: "var(--tk-char)" }}>{LONGSTAY.d}</p>
                    <ul className="mt-3 space-y-1.5 text-[13px]">
                      {LONGSTAY.items.map((t) => <li key={t} className="flex gap-2"><span className="shrink-0" style={{ color: "#2f8f7a" }}><Icon d={I.check} size={16} /></span>{t}</li>)}
                    </ul>
                    <div className="mt-4 grid grid-cols-3 gap-px" style={{ background: "var(--tk-line)" }}>
                      {ROOMS.map((r) => <div key={r.k} className="bg-white px-1 py-2 text-center"><div className="text-[10.5px]" style={{ color: "var(--tk-sub)" }}>{r.t.replace("스마트 ", "")}</div><div className="text-[13px] font-bold" style={{ color: "var(--tk-deep)" }}>월 {r.month}만</div></div>)}
                    </div>
                    <button onClick={() => { setBk({ ...bk, stay: 30 }); go("reservation"); }} className="mt-4 w-full py-2.5 text-[13px] font-bold text-white" style={{ background: "var(--tk-deep)" }}>한 달 살기 문의</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="px-6">
            <Rise><div className="mt-9 mb-3 text-[15px] font-bold" style={{ color: "var(--tk-deep)" }}>모든 객실 기본 제공</div></Rise>
            <div className="grid grid-cols-3 gap-2">
              {AMENITIES.map((a, i) => (
                <motion.div key={a.t} className="flex flex-col items-center bg-white py-3.5" initial={{ scale: 0.85 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.04, ease: EASE }}>
                  <span style={{ color: "var(--tk-coral)" }}><Icon d={I[a.icon]} size={22} /></span>
                  <span className="mt-1 text-[12px] font-semibold" style={{ color: "var(--tk-deep)" }}>{a.t}</span>
                </motion.div>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-[1.6]" style={{ color: "var(--tk-sub)" }}>객실 구성·크기·요금은 오픈 전 계획(안)이며 설계와 시장조사 후 확정됩니다.</p>
          </div>
        </section>

        {/* SMART SYSTEM */}
        <section id="smart" className="px-6 pt-16 pb-14" style={{ background: "var(--tk-deep)" }}>
          <Head dark no="03" en="SMART SYSTEM" sub="예약, 체크인, 객실 제어, 보안까지. 사람이 상주하지 않아도 AI와 IoT가 24시간 호스텔을 운영합니다.">사람 대신 AI가<br />24시간 지킵니다</Head>
          <div className="-mx-6 mb-6">
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              <video src="/thek/video/checkin.mp4" poster="/thek/video/checkin-poster.webp" autoPlay muted loop playsInline preload="metadata" aria-label="무인 체크인 장면 (AI 영상 예시)" className="h-full w-full object-cover" />
              <span className="absolute bottom-2 left-2 bg-white/90 px-1.5 py-0.5 text-[10px]" style={{ color: "var(--tk-char)" }}>무인 체크인 · AI 영상 예시</span>
            </div>
          </div>
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

            {/* AI SECURITY 관제 화면 예시 */}
            <div className="mt-8 flex items-baseline justify-between">
              <div><div className="tk-en text-[10.5px] font-bold" style={{ color: "var(--tk-coral2)" }}>AI SECURITY</div><div className="text-[17px] font-bold text-white">관리자 관제 화면</div></div>
              <span className="text-[10.5px]" style={{ color: "#7f9e99" }}>화면 예시</span>
            </div>
            <div className="mt-3 border p-4" style={{ borderColor: "#24504b", background: "#0a201e" }}>
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-white"><motion.span className="inline-block h-2 w-2 rounded-full" style={{ background: "#4ade80" }} animate={{ scale: [1, 1.6, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />LIVE · 2F</span>
                <span style={{ color: "#7f9e99" }}>객실 {cells.length}</span>
              </div>
              <div className="mt-3 grid grid-cols-6 gap-1">
                {cells.map((c, i) => (
                  <motion.div key={i} className="flex h-8 items-center justify-center text-[9px] font-bold" animate={{ backgroundColor: c === 0 ? "#ffcf86" : c === 1 ? "#8fd3bf" : "#1b4440", color: c === 2 ? "#6f908b" : "#0e2b29" }} transition={{ duration: 0.5 }}>{String(i + 1).padStart(2, "0")}</motion.div>
                ))}
              </div>
              <div className="mt-2 flex gap-3 text-[10px]" style={{ color: "#8fb0ab" }}>
                <span><span className="mr-1 inline-block h-2 w-2" style={{ background: "#ffcf86" }} />투숙</span><span><span className="mr-1 inline-block h-2 w-2" style={{ background: "#8fd3bf" }} />청소·점검</span><span><span className="mr-1 inline-block h-2 w-2" style={{ background: "#1b4440" }} />빈 방 절전</span>
              </div>
              <div className="mt-3 h-[66px] overflow-hidden border-t pt-2" style={{ borderColor: "#24504b" }}>
                <AnimatePresence initial={false}>
                  {[0, 1, 2].map((k) => {
                    const n = logAt - k;
                    return (
                      <motion.div key={n} layout className="flex justify-between py-0.5 text-[11px]" initial={{ y: -14 }} animate={{ y: 0 }} transition={{ duration: 0.35 }}>
                        <span style={{ color: k === 0 ? "#fff" : "#7f9e99" }}>{LOGS[((n % LOGS.length) + LOGS.length) % LOGS.length]}</span>
                        <span style={{ color: "#5f7e79" }}>{k === 0 ? "방금" : `${k * 2}분 전`}</span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
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
          <Shot f="security" label="AI 보안·관제 장면" className="mt-6 h-[430px]" pos="50% 30%" dark />
          <p className="mt-3 text-[11px] leading-[1.6]" style={{ color: "#7f9e99" }}>관제 화면은 운영 방식을 보여 주는 예시입니다. 무인 장비와 AI·로봇 솔루션의 도입 범위는 협의 중이며 설계 단계에서 확정합니다.</p>
        </section>

        {/* FACILITIES */}
        <section id="facilities" className="px-6 pt-16 pb-14">
          <Head no="04" en="FACILITIES" sub="객실 밖에서도 생활이 이어지도록. 라운지와 주방, 업무 공간을 투숙객 모두가 함께 씁니다.">방 밖의 시간까지<br />편안하게</Head>
          <div className="-mx-6">
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              <video src="/thek/video/lounge.mp4" poster="/thek/video/lounge-poster.webp" autoPlay muted loop playsInline preload="metadata" aria-label="스마트 라운지 장면 (AI 영상 예시)" className="h-full w-full object-cover" />
              <span className="absolute bottom-2 left-2 bg-white/90 px-1.5 py-0.5 text-[10px]" style={{ color: "var(--tk-char)" }}>스마트 라운지 · AI 영상 예시</span>
            </div>
          </div>
          <div className="mt-4 grid gap-3">
            {FACILITIES.map((f, i) => (
              <Rise key={f.k} delay={i * 0.05}>
                <div className="grid grid-cols-[110px_1fr] gap-3 border p-2.5" style={{ borderColor: "var(--tk-line)" }}>
                  {!AI_READY.includes(f.k) || f.k === "lounge" ? (
                    <div className="flex h-[110px] items-center justify-center" style={{ background: f.k === "lounge" ? "var(--tk-deep)" : "var(--tk-coral)", color: f.k === "lounge" ? "var(--tk-glow)" : "#fff" }}><Icon d={I[f.icon]} size={32} /></div>
                  ) : <Shot f={f.k} label={f.t} className="h-[110px]" pos="50% 45%" />}
                  <div className="py-1">
                    <div className="tk-en text-[9.5px] font-bold" style={{ color: "var(--tk-coral)" }}>{f.en}</div>
                    <div className="text-[15px] font-bold" style={{ color: "var(--tk-deep)" }}>{f.t}</div>
                    <p className="mt-0.5 text-[12px] leading-[1.55]" style={{ color: "var(--tk-sub)" }}>{f.d}</p>
                  </div>
                </div>
              </Rise>
            ))}
          </div>
          <div className="mt-6 p-4" style={{ background: "var(--tk-sand)" }}>
            <div className="text-[14px] font-bold" style={{ color: "var(--tk-deep)" }}>편의 서비스 (안)</div>
            <div className="mt-2 flex flex-wrap gap-1.5 text-[12px]">
              {["다국어 안내 (영·중·아랍어 등)", "택배 수령", "짐 보관", "데이 유스 (시간제)", "셀프 조식", "장기 투숙 청소"].map((t) => <span key={t} className="bg-white px-2.5 py-1" style={{ color: "var(--tk-char)" }}>{t}</span>)}
            </div>
          </div>
        </section>

        {/* LOCATION */}
        <section id="location" className="pt-16 pb-14" style={{ background: "var(--tk-sand)" }}>
          <div className="px-6">
            <Head no="05" en="LOCATION" sub="금촌로터리 남측, 근린생활시설이 모인 금촌 생활권 한가운데. 경의중앙선과 버스로 서울·일산과 이어집니다.">파주 금촌,<br />동네 한가운데</Head>
            <Rise>
              <div className="relative h-[250px] overflow-hidden border bg-white" style={{ borderColor: "var(--tk-line)" }}>
                <iframe title="The K 빌딩 위치 지도" src={`https://maps.google.com/maps?q=${mapQ}&z=16&output=embed`} className="h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </Rise>
            <div className="mt-2 flex items-center justify-between text-[12px]">
              <span className="flex items-center gap-1" style={{ color: "var(--tk-char)" }}><Icon d={I.pin} size={14} />{PROJECT.address.replace(" 외", "")} ({PROJECT.roadAddress})</span>
              <a href={`https://map.naver.com/p/search/${mapQ}`} target="_blank" rel="noopener" className="font-semibold underline underline-offset-4" style={{ color: "var(--tk-deep)" }}>네이버 지도</a>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {NEARBY.map((n, i) => (
                <motion.div key={n.t} className="bg-white p-3" initial={{ y: 16 }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}>
                  <div className="text-[13.5px] font-bold" style={{ color: "var(--tk-deep)" }}>{n.t}</div>
                  <div className="mt-0.5 text-[11px] leading-[1.45]" style={{ color: "var(--tk-sub)" }}>{n.d}</div>
                </motion.div>
              ))}
            </div>
            <ul className="mt-5 space-y-1.5 text-[13px] leading-[1.6]">
              {LOCATION.map((l) => <li key={l} className="flex gap-2.5"><span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--tk-coral)" }} />{l}</li>)}
            </ul>
            <Rise><div className="mt-9 text-[15px] font-bold" style={{ color: "var(--tk-deep)" }}>파주 여행 거점으로</div></Rise>
            <div className="tk-noscroll -mx-6 mt-3 flex gap-2 overflow-x-auto px-6">
              {TRIPS.map((t) => <span key={t} className="shrink-0 border bg-white px-3 py-2 text-[12.5px] font-semibold" style={{ borderColor: "var(--tk-line)", color: "var(--tk-deep)" }}>{t}</span>)}
            </div>
            <Rise><div className="mt-9 text-[15px] font-bold" style={{ color: "var(--tk-deep)" }}>이런 분께 맞아요</div></Rise>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {DEMAND.map((d, i) => (
                <motion.div key={d.t} className="bg-white p-4" initial={{ scale: 0.9 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}>
                  <span style={{ color: "var(--tk-coral)" }}><Icon d={I[d.icon]} size={22} /></span>
                  <div className="mt-1.5 text-[14px] font-bold" style={{ color: "var(--tk-deep)" }}>{d.t}</div>
                  <div className="text-[11.5px] leading-[1.5]" style={{ color: "var(--tk-sub)" }}>{d.d}</div>
                </motion.div>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-[1.6]" style={{ color: "var(--tk-sub)" }}>입지 문구는 감정평가서 기재 내용이며, 역·관광지까지 거리와 소요시간은 확인 후 표기합니다.</p>
          </div>
        </section>

        {/* RESERVATION */}
        <section id="reservation" className="px-6 pt-16 pb-14">
          <Head no="06" en="RESERVATION" sub="오픈 전에는 사전 입실 문의로 받습니다. 원하는 날짜와 객실을 남겨 주시면 오픈 일정과 요금을 안내해 드립니다.">객실 예약 ·<br />입실 문의</Head>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <label className="block"><span className="text-[11.5px] font-semibold" style={{ color: "var(--tk-deep)" }}>체크인</span>
                <input type="date" value={bk.date} onChange={(e) => setBk({ ...bk, date: e.target.value })} className={inputCls} style={{ borderColor: "var(--tk-line)" }} /></label>
              <label className="block"><span className="text-[11.5px] font-semibold" style={{ color: "var(--tk-deep)" }}>기간</span>
                <select value={bk.stay} onChange={(e) => setBk({ ...bk, stay: +e.target.value })} className={inputCls} style={{ borderColor: "var(--tk-line)" }}>{STAYS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
            </div>
            <div>
              <span className="text-[11.5px] font-semibold" style={{ color: "var(--tk-deep)" }}>객실</span>
              <div className="mt-1 grid grid-cols-3 gap-1.5">
                {ROOMS.map((r) => (
                  <button key={r.k} onClick={() => setBk({ ...bk, room: r.k })} className="relative border py-2.5 text-[12.5px] font-bold" style={{ borderColor: bk.room === r.k ? "var(--tk-coral)" : "var(--tk-line)" }}>
                    {bk.room === r.k && <motion.span layoutId="tk-bkr" className="absolute inset-0" style={{ background: "var(--tk-coral)" }} transition={{ duration: 0.3, ease: EASE }} />}
                    <span className="relative z-10" style={{ color: bk.room === r.k ? "#fff" : "var(--tk-char)" }}>{r.t.replace("스마트 ", "")}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-[.8fr_1.2fr] gap-2">
              <label className="block"><span className="text-[11.5px] font-semibold" style={{ color: "var(--tk-deep)" }}>인원</span>
                <select value={bk.guests} onChange={(e) => setBk({ ...bk, guests: +e.target.value })} className={inputCls} style={{ borderColor: "var(--tk-line)" }}>{[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}명</option>)}</select></label>
              <label className="block"><span className="text-[11.5px] font-semibold" style={{ color: "var(--tk-deep)" }}>이름</span>
                <input value={bk.name} onChange={(e) => setBk({ ...bk, name: e.target.value })} placeholder="홍길동" className={inputCls} style={{ borderColor: "var(--tk-line)" }} /></label>
            </div>
            <label className="block"><span className="text-[11.5px] font-semibold" style={{ color: "var(--tk-deep)" }}>연락처</span>
              <input value={bk.phone} onChange={(e) => setBk({ ...bk, phone: e.target.value })} inputMode="tel" placeholder="010-0000-0000" className={inputCls} style={{ borderColor: "var(--tk-line)" }} /></label>
            <label className="block"><span className="text-[11.5px] font-semibold" style={{ color: "var(--tk-deep)" }}>요청 사항</span>
              <textarea value={bk.note} onChange={(e) => setBk({ ...bk, note: e.target.value })} rows={2} placeholder="도착 시간, 주차 필요 여부 등" className={inputCls} style={{ borderColor: "var(--tk-line)" }} /></label>
          </div>
          <div className="mt-5 flex items-center justify-between p-4" style={{ background: "var(--tk-deep)" }}>
            <div>
              <div className="text-[11px]" style={{ color: "#8fb0ab" }}>{picked.t} · {STAYS.find((s) => s[0] === bk.stay)?.[1]}</div>
              <div className="text-[11px]" style={{ color: "#8fb0ab" }}>예상 요금 (안)</div>
            </div>
            <div className="text-[24px] font-bold" style={{ color: "var(--tk-glow)" }}>{bk.stay >= 30 ? "월 " : ""}<Roll to={est} decimals={bk.stay >= 30 || Number.isInteger(est) ? 0 : 1} /><span className="text-[13px]">만원</span></div>
          </div>
          <button onClick={submit} className="mt-3 flex w-full items-center justify-center gap-2 py-3.5 text-[15px] font-bold text-white" style={{ background: "var(--tk-coral)" }}><Icon d={I.send} size={18} />입실 문의 보내기</button>
          <AnimatePresence>
            {sent && (
              <motion.div key={sent} className="mt-3 overflow-hidden border p-4 text-[13px] leading-[1.7]" style={{ borderColor: "var(--tk-coral)", color: "var(--tk-char)" }} initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.35, ease: EASE }}>
                {sent === "sms" ? "문자 앱에서 내용을 확인하고 보내 주세요." : <>
                  <b style={{ color: "var(--tk-deep)" }}>오픈 준비 중입니다.</b> 문의 접수 연락처가 등록되면 이 버튼으로 바로 보낼 수 있습니다. {sent === "copied" ? "작성하신 내용은 복사해 두었습니다." : ""}
                </>}
              </motion.div>
            )}
          </AnimatePresence>
          <p className="mt-3 text-[11px] leading-[1.6]" style={{ color: "var(--tk-sub)" }}>요금은 오픈 전 계획(안)이며 실제 요금과 다를 수 있습니다. 문의 내용은 이 페이지에 저장되지 않습니다.</p>
        </section>

        {/* CONTACT */}
        <section id="contact" className="px-6 pt-16 pb-14" style={{ background: "var(--tk-sand)" }}>
          <Head no="07" en="CONTACT" sub="입실 상담은 물론, 기업 숙박·제휴·투자 문의도 받습니다.">상담 및<br />제휴 문의</Head>
          <div className="grid grid-cols-2 gap-2">
            {[[I.user, "입실 상담", "단기·장기 투숙, 단체"], [I.brief, "제휴 · 투자", "기업 숙박, 운영 파트너"]].map(([ic, a, b]) => (
              <div key={a} className="bg-white p-4">
                <span style={{ color: "var(--tk-coral)" }}><Icon d={ic} size={24} /></span>
                <div className="mt-2 text-[15px] font-bold" style={{ color: "var(--tk-deep)" }}>{a}</div>
                <div className="text-[12px]" style={{ color: "var(--tk-sub)" }}>{b}</div>
              </div>
            ))}
          </div>
          <dl className="mt-4 border-t bg-white px-4 text-[14px]" style={{ borderColor: "var(--tk-deep)" }}>
            {[
              ["브랜드", `${PROJECT.nameKo} (${PROJECT.tag})`],
              ["위치", <>{PROJECT.building}<br />{PROJECT.address} <span style={{ color: "var(--tk-sub)" }}>({PROJECT.roadAddress})</span></>],
              ["운영 법인", PROJECT.operator || <Pending />],
              ["연락처", PROJECT.phone ? <a href={`tel:${PROJECT.phone}`}>{PROJECT.phone}</a> : <Pending />],
              ["이메일", PROJECT.email ? <a href={`mailto:${PROJECT.email}`}>{PROJECT.email}</a> : <Pending />],
            ].map(([k, v], i) => (
              <div key={i} className="grid grid-cols-[72px_1fr] gap-3 border-b py-3.5" style={{ borderColor: "var(--tk-line)" }}>
                <dt className="font-semibold" style={{ color: "var(--tk-deep)" }}>{k}</dt><dd className="leading-[1.6]">{v}</dd>
              </div>
            ))}
          </dl>

          <a href="/thek/ir" className="relative mt-8 flex items-center justify-between overflow-hidden px-5 py-4 text-white" style={{ background: "linear-gradient(120deg,#0a1322,#182a48)" }}>
            <span>
              <span className="tk-en block text-[10px] font-bold" style={{ color: "#c9a96e" }}>BUSINESS PLAN & IR</span>
              <span className="block text-[16px] font-bold">사업계획서 바로 보기</span>
              <span className="block text-[11.5px]" style={{ color: "#9eabbf" }}>31장 · 옆으로 넘겨 보는 투자제안서</span>
            </span>
            <span className="flex h-11 w-11 items-center justify-center rounded-full" style={{ background: "#c9a96e", color: "#0a1322" }}><Icon d={I.arrow} size={20} /></span>
          </a>

          {/* 파트너용 정보 */}
          <div className="mt-10">
            <div className="tk-en text-[10.5px] font-bold" style={{ color: "var(--tk-coral)" }}>PARTNER BRIEF</div>
            <div className="text-[18px] font-bold" style={{ color: "var(--tk-deep)" }}>사업 파트너용 정보</div>
            <p className="mt-1 text-[12.5px]" style={{ color: "var(--tk-sub)" }}>제휴·투자 검토를 위한 건물 현황과 사업 가정입니다. 눌러서 펼쳐 보세요.</p>
            <div className="mt-4 space-y-2">
              {["건물 · 공실 현황", "후보 공간", "수익 구조 (안)", "사전 확인 · 추진 순서"].map((t, pi) => (
                <div key={t} className="bg-white">
                  <button onClick={() => setPartner(partner === pi ? null : pi)} className="flex w-full items-center justify-between px-4 py-4 text-left">
                    <span className="text-[15px] font-bold" style={{ color: "var(--tk-deep)" }}><span className="tk-en mr-2 text-[11px]" style={{ color: "var(--tk-coral)" }}>0{pi + 1}</span>{t}</span>
                    <motion.span animate={{ rotate: partner === pi ? 45 : 0 }} transition={{ duration: 0.3 }} style={{ color: "var(--tk-deep)" }}><Icon d={I.plus} size={18} /></motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {partner === pi && (
                      <motion.div key="c" className="overflow-hidden" initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.4, ease: EASE }}>
                        <div className="px-4 pb-5">
                          {pi === 0 && (
                            <>
                              <dl className="text-[13px]">
                                {BUILDING.map(([k, v]) => (
                                  <div key={k} className="grid grid-cols-[72px_1fr] gap-3 border-b py-2.5" style={{ borderColor: "var(--tk-line)" }}><dt className="font-semibold" style={{ color: "var(--tk-deep)" }}>{k}</dt><dd>{v}</dd></div>
                                ))}
                              </dl>
                              <div className="mt-5 mb-2 flex gap-3 text-[11.5px]" style={{ color: "var(--tk-char)" }}>
                                {(["vacant", "use", "check"] as UnitState[]).map((s) => (
                                  <span key={s} className="flex items-center gap-1"><span className="inline-block h-3 w-3 border" style={{ background: STATE[s].bg, borderColor: s === "check" ? "#b9653f" : STATE[s].bg }} />{STATE[s].l} {counts[s]}</span>
                                ))}
                              </div>
                              <div className="grid grid-cols-[58px_1fr] gap-2">
                                <div className="space-y-1">
                                  {FLOORS.map((f, i) => {
                                    const v = f.units.filter((u) => u.s === "vacant").length;
                                    return (
                                      <button key={f.f} onClick={() => setFloor(i)} className="relative flex h-10 w-full items-center justify-between overflow-hidden border px-2" style={{ borderColor: floor === i ? "var(--tk-deep)" : "var(--tk-line)" }}>
                                        <motion.span className="absolute inset-y-0 left-0 w-full origin-left" style={{ background: "var(--tk-deep)" }} animate={{ scaleX: floor === i ? 1 : 0 }} transition={{ duration: 0.4, ease: EASE }} />
                                        <span className="relative z-10 text-[12.5px] font-bold" style={{ color: floor === i ? "#fff" : "var(--tk-deep)" }}>{f.f}</span>
                                        {v > 0 && <span className="relative z-10 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white" style={{ background: "var(--tk-coral)" }}>{v}</span>}
                                      </button>
                                    );
                                  })}
                                </div>
                                <div className="grid grid-cols-2 content-start gap-1.5">
                                  {FLOORS[floor].units.map((u) => (
                                    <div key={u.n} className="border px-2 py-1.5" style={{ background: STATE[u.s].bg, color: STATE[u.s].fg, borderColor: u.s === "check" ? "#e3b49c" : STATE[u.s].bg, borderStyle: u.s === "check" ? "dashed" : "solid" }}>
                                      <div className="text-[12.5px] font-bold">{u.n}호</div><div className="text-[10px]">{u.m2}㎡ · {STATE[u.s].l}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <p className="mt-2 text-[10.5px] leading-[1.6]" style={{ color: "var(--tk-sub)" }}>출처: 감정평가서(2021.10.28) · 임대현황표(2026.02.28, 사용/공실만 표시 · 수시 변동)</p>
                            </>
                          )}
                          {pi === 1 && (
                            <>
                              <div className="flex border p-1" style={{ borderColor: "var(--tk-line)" }}>
                                {CANDIDATES.map((c, i) => (
                                  <button key={c.k} onClick={() => setCand(i)} className="relative flex-1 py-2 text-[12.5px] font-bold">
                                    {cand === i && <motion.span layoutId="tk-cand" className="absolute inset-0" style={{ background: "var(--tk-deep)" }} transition={{ duration: 0.35, ease: EASE }} />}
                                    <span className="relative z-10" style={{ color: cand === i ? "#fff" : "var(--tk-sub)" }}>후보 {c.k} · {c.f}</span>
                                  </button>
                                ))}
                              </div>
                              <img src={IMG(CANDIDATES[cand].img)} alt={`${CANDIDATES[cand].f} 평면 투시도 (분양 브로슈어)`} className="mt-3 block w-full" />
                              <div className="mt-2 flex items-end justify-between border-b pb-2" style={{ borderColor: "var(--tk-line)" }}>
                                <div className="text-[14px] font-bold" style={{ color: "var(--tk-deep)" }}>{CANDIDATES[cand].units}</div>
                                <div className="text-[17px] font-bold" style={{ color: "var(--tk-coral)" }}>{CANDIDATES[cand].m2.toFixed(1)}㎡</div>
                              </div>
                              <ul className="mt-2 space-y-1 text-[12.5px] leading-[1.6]">
                                {CANDIDATES[cand].pros.map((p) => <li key={p} className="flex gap-2"><span className="mt-0.5 shrink-0" style={{ color: "#2f8f7a" }}><Icon d={I.check} size={15} /></span>{p}</li>)}
                                {CANDIDATES[cand].cons.map((p) => <li key={p} className="flex gap-2" style={{ color: "var(--tk-char)" }}><span className="mt-0.5 shrink-0" style={{ color: "var(--tk-coral)" }}><Icon d={I.plus} size={15} /></span>{p}</li>)}
                              </ul>
                              <p className="mt-2 text-[10.5px]" style={{ color: "var(--tk-sub)" }}>평면 투시도: 분양 브로슈어 · 객실 {roomTotal}실은 1단계 3·4층 기준 가정</p>
                            </>
                          )}
                          {pi === 2 && (
                            <div className="-mx-4 -mb-5 p-4" style={{ background: "var(--tk-deep)" }}>
                              <div className="text-[12px] font-bold text-white">1단계 3·4층 {roomTotal}실 · 사업성 계산기 (안)</div>
                              <div className="mt-4 text-center">
                                <div className="text-[12px]" style={{ color: "#8fb0ab" }}>예상 월 매출 (안)</div>
                                <div className="mt-1 text-[36px] font-bold leading-none" style={{ color: "var(--tk-glow)" }}>약 <Roll to={Math.round(sim.rev)} /><span className="text-[16px]">만원</span></div>
                                <div className="mt-2 text-[12px]" style={{ color: "#8fb0ab" }}>연 매출 약 {sim.yRev.toFixed(2)}억 · 임차료 전 영업이익 약 {sim.yEb.toFixed(2)}억</div>
                              </div>
                              <div className="mt-5">
                                <div className="mb-1 flex justify-between text-[12.5px]"><span style={{ color: "#c3d6d2" }}>장기 투숙 비중</span><span className="font-bold text-white">{lsh}%</span></div>
                                <input type="range" min={0} max={100} step={10} value={lsh} onChange={(e) => setLsh(+e.target.value)} className="tk-range" style={{ ["--p" as string]: `${lsh}%` }} aria-label="장기 투숙 비중" />
                              </div>
                              <div className="mt-3">
                                <div className="mb-1 flex justify-between text-[12.5px]"><span style={{ color: "#c3d6d2" }}>단기 숙박 가동률</span><span className="font-bold text-white">{occ}%</span></div>
                                <input type="range" min={30} max={95} step={5} value={occ} onChange={(e) => setOcc(+e.target.value)} className="tk-range" style={{ ["--p" as string]: `${((occ - 30) / 65) * 100}%` }} aria-label="단기 숙박 가동률" />
                              </div>
                              <div className="mt-4 space-y-2.5">
                                {([["장기 투숙 (입실률 90%)", sim.longR, "var(--tk-mint)"], ["단기 숙박", sim.shortR, "var(--tk-coral)"], ["부가매출 (데이 유스·편의점 임대 등)", sim.extra, "var(--tk-glow)"]] as [string, number, string][]).map(([l, v, c]) => (
                                  <div key={l}>
                                    <div className="flex justify-between text-[12px]"><span className="text-white">{l}</span><span className="font-bold text-white">{Math.round(v).toLocaleString()}만</span></div>
                                    <div className="mt-1 h-2" style={{ background: "#1b4440" }}><motion.div className="h-full origin-left" style={{ background: c }} initial={false} animate={{ scaleX: sim.rev ? v / sim.rev : 0 }} transition={{ duration: 0.6, ease: EASE }} /></div>
                                  </div>
                                ))}
                              </div>
                              <p className="mt-4 text-[11px] leading-[1.7]" style={{ color: "#a9c1bd" }}>· 요금은 주변 시세 조사 전 가정치 · 고정비 월 1,130만 원, 변동비 장기 5%·단기 25% · 임차료·감가상각·이자·세금 전 · 1단계 투자 약 {CAPEX1_SUM.toFixed(1)}억 원(안)</p>
                            </div>
                          )}
                          {pi === 3 && (
                            <>
                              <div className="border-t" style={{ borderColor: "var(--tk-deep)" }}>
                                {CHECKS.map((c, i) => (
                                  <div key={c.t} className="border-b" style={{ borderColor: "var(--tk-line)" }}>
                                    <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center gap-2 py-3 text-left">
                                      <span className="flex-1 text-[14px] font-bold" style={{ color: "var(--tk-deep)" }}>{c.t}</span>
                                      <span className="px-1.5 py-0.5 text-[10px] font-bold" style={c.s === "핵심" ? { background: "var(--tk-coral)", color: "#fff" } : { border: "1px solid var(--tk-line)", color: "var(--tk-char)" }}>{c.s}</span>
                                    </button>
                                    <AnimatePresence initial={false}>
                                      {open === i && (
                                        <motion.div key="b" className="overflow-hidden" initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.3, ease: EASE }}>
                                          <p className="pb-3 text-[12.5px] leading-[1.7]" style={{ color: "var(--tk-char)" }}>{c.d}</p>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-5 space-y-3">
                                {ROADMAP.map((r, i) => (
                                  <div key={r.t} className="flex gap-3">
                                    <span className="tk-en flex h-7 w-7 shrink-0 items-center justify-center text-[11px] font-bold" style={{ background: i === 0 ? "var(--tk-coral)" : "var(--tk-sand)", color: i === 0 ? "#fff" : "var(--tk-deep)" }}>{i + 1}</span>
                                    <div><div className="text-[14px] font-bold" style={{ color: "var(--tk-deep)" }}>{r.t}</div><div className="text-[12px]" style={{ color: "var(--tk-sub)" }}>{r.d}</div></div>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="px-6 pt-10 pb-12" style={{ background: "#081a18", color: "#86a39f" }}>
          <div className="text-[24px] font-black text-white">THE K<span style={{ color: "var(--tk-coral)" }}>.</span> <span className="tk-en text-[10px] font-bold" style={{ color: "#86a39f" }}>SMART HOSTEL</span></div>
          <div className="mt-1 text-[13px] text-white/80">{PROJECT.nameKo} ({PROJECT.tag})</div>
          <p className="mt-4 text-[12px] leading-[1.8]">{PROJECT.building}<br />{PROJECT.address} ({PROJECT.roadAddress})</p>
          <p className="mt-5 text-[11px] leading-[1.7]" style={{ color: "#5f7e79" }}>
            오픈 준비 중인 사업을 소개하는 임시 홈페이지입니다. 건물 사진은 감정평가서(2021) 수록 사진, 투시도·평면도는 분양 브로슈어 자료이며 그 안의 간판·인물은 예시입니다. 대표 사진은 실제 사진을 바탕으로 배경을 연출했습니다. &lsquo;AI 이미지&rsquo; 표시 사진과 건물 그래픽·객실 평면·관제 화면은 이해를 돕기 위한 예시로 실제와 다를 수 있습니다. 객실 구성·요금·매출은 확정 전 계획(안)이며, 숙박 영업 범위는 인허가 확인 후 확정됩니다.
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
