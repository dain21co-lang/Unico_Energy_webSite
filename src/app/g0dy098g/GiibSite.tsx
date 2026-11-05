"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode, CSSProperties } from "react";
import { motion, AnimatePresence, useInView, animate } from "framer-motion";
import { CO, BUSINESS, PROCESS, PRINCIPLES, IMAGES, IMG_POS, SAMPLE, RECORD_STATS, CASES, SECTORS } from "./data";
import { LangCtx, useLang, pick, CO_EN, BUSINESS_EN, PROCESS_EN, PRINCIPLES_EN, RECORD_STATS_EN, CASES_EN, SECTORS_EN, MENU_EN } from "./i18n";
import type { Lang } from "./i18n";

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
      <motion.path d={blob(index * 3 + 1, 100, 105, 82, 0.18)} fill="#10223a" animate={{ d: blob(index * 3 + 1, 100, 105, 82, 0.18) }} transition={{ duration: 0.9, ease: EASE }} />
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
      <img src="/g0dy098g/logo-mark.svg" alt="" width={size} height={size} />
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
      <rect width="340" height="300" fill="#10223a" />
      <rect width="340" height="300" fill="url(#giSky)" />
      <defs>
        <linearGradient id="giSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1f3b5f" /><stop offset="100%" stopColor="#0b1828" /></linearGradient>
        <linearGradient id="giBar" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e9d2ad" /><stop offset="100%" stopColor="#b98a52" /></linearGradient>
      </defs>
      {[[170, 40], [40, 120], [300, 110], [70, 210], [280, 215]].map(([x, y], i) => (
        <g key={i}>
          <line x1={170} y1={150} x2={x} y2={y} stroke="#b98a52" strokeWidth="1.2" strokeDasharray="4 6" className="gi-flow" />
          <circle cx={x} cy={y} r="4.5" fill="#e9d2ad" className="gi-node" style={{ animationDelay: `${i * 0.4}s` }} />
        </g>
      ))}
      {bars.map(([x, h], i) => (
        <motion.rect key={x} x={x - 12} y={270 - h} width="24" height={h} rx="2" fill={i % 3 === 1 ? "url(#giBar)" : "#24405f"} stroke="#b98a52" strokeWidth="0.6"
          initial={{ scaleY: 0 }} animate={{ scaleY: [0, 1, 0.82 + (i % 3) * 0.06, 1] }} transition={{ duration: 6, times: [0, 0.2, 0.6, 1], delay: i * 0.08, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          style={{ transformOrigin: `${x}px 270px` }} />
      ))}
      <line x1="0" y1="270.5" x2="340" y2="270.5" stroke="#e9d2ad" strokeWidth="1.5" />
      <circle cx={170} cy={150} r={20} fill="#10223a" stroke="#e9d2ad" strokeWidth="2" />
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
        <motion.div className="h-full w-full" initial={{ scale: 1.12 }} animate={{ scale: seen ? 1 : 1.12 }} transition={{ duration: 1.6, ease: EASE }}>
          {src ? <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: IMG_POS[k] }} /> : <HubScene variant={variant} />}
        </motion.div>
        {tag && <span className="absolute bottom-2 left-2 bg-white px-1.5 py-0.5 text-[10px] font-semibold" style={{ color: "var(--gi-black)" }}>{tag}</span>}
      </motion.div>
    </div>
  );
}

/* 화면 폭 가득 영상: 막이 옆으로 걷히며 등장, 화면에 보일 때만 재생 */
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
    <section ref={ref} className="relative" style={{ background: "#080e18" }}>
      <motion.div className="relative aspect-[16/9] w-full overflow-hidden" initial={{ clipPath: "inset(0% 100% 0% 0%)" }} animate={{ clipPath: seen ? "inset(0% 0% 0% 0%)" : "inset(0% 100% 0% 0%)" }} transition={{ duration: 1.2, ease: EASE }}>
        <video ref={vid} src="/g0dy098g/video/film.mp4" poster="/g0dy098g/video/film-poster.webp" muted loop playsInline preload="metadata" className="h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,14,24,0) 55%, rgba(8,14,24,.85) 100%)" }} />
        <div className="absolute bottom-3 left-5 right-5 flex items-end justify-between text-white">
          <span className="gi-en text-[10px] font-semibold" style={{ color: "var(--gi-sand)" }}>SEOUL · REAL ESTATE</span>
          <span className="text-[12px] text-white/75">{pick(lang, "도시의 가치를 구조로 담습니다", "Structuring the value of the city")}</span>
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

/* 투자 구조도: 선이 그려지며 등장하고, 점이 자금 흐름을 따라 움직인다 */
function Structure() {
  const lang = useLang();
  const T = (ko: string, en: string) => pick(lang, ko, en);
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-60px" });
  const box = (x: number, y: number, w: number, t: string, sub: string, dark = false, i = 0) => (
    <motion.g initial={{ scale: 0.6 }} animate={{ scale: seen ? 1 : 0.6 }} transition={{ duration: 0.7, delay: 0.2 + i * 0.12, ease: EASE }} style={{ transformOrigin: `${x + w / 2}px ${y + 24}px`, transformBox: "view-box" }}>
      <rect x={x} y={y} width={w} height="48" rx="4" fill={dark ? "#10223a" : "#fff"} stroke={dark ? "#10223a" : "#16181c"} strokeWidth="1" />
      <text x={x + w / 2} y={y + 21} textAnchor="middle" fontSize="12.5" fontWeight="800" fill={dark ? "#e9d2ad" : "#0b0c0e"}>{t}</text>
      <text x={x + w / 2} y={y + 37} textAnchor="middle" fontSize="9" fill={dark ? "#c9ccd2" : "#5f6670"}>{sub}</text>
    </motion.g>
  );
  const lines = ["M175 72 V118", "M175 166 V212", "M100 142 H62", "M250 142 H288", "M175 260 V296"];
  return (
    <div ref={ref} className="mt-8">
      <svg viewBox="0 0 350 350" className="w-full">
        {lines.map((d, i) => (
          <g key={d}>
            <motion.path d={d} stroke="#b98a52" strokeWidth="1.4" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: seen ? 1 : 0 }} transition={{ duration: 0.8, delay: 0.5 + i * 0.12, ease: EASE }} />
            <path d={d} stroke="#b98a52" strokeWidth="1.4" strokeDasharray="3 6" fill="none" className="gi-flow" />
          </g>
        ))}
        {seen && lines.slice(0, 2).concat(lines[4]).map((d, i) => (
          <circle key={i} r="3.2" fill="#b98a52"><animateMotion dur={`${2.2 + i * 0.3}s`} repeatCount="indefinite" path={d} /></circle>
        ))}
        {box(100, 24, 150, T("투자자", "Investors"), T("기관 · 법인 · 개인", "Institutions · Corporates · Individuals"), false, 0)}
        {box(100, 118, 150, T("GIIB · 투자 SPC", "GIIB · Investment SPC"), T("구조화 · 실사 · 관리", "Structuring · DD · Management"), true, 1)}
        {box(0, 118, 62, T("금융기관", "Lenders"), T("브릿지·PF", "Bridge·PF"), false, 2)}
        {box(288, 118, 62, T("담보신탁", "Trust"), T("신탁·담보", "Collateral"), false, 3)}
        {box(100, 212, 150, T("부동산 자산", "Real Estate"), T("오피스 · 개발 · 호텔", "Office · Development · Hotel"), false, 4)}
        {box(100, 296, 150, T("출구", "Exit"), T("매각 · 리파이낸싱", "Sale · Refinancing"), false, 5)}
      </svg>
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

function PrinWatch({ onSeen }: { onSeen: () => void }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => { if (seen) onSeen(); }, [seen, onSeen]);
  return <span ref={ref} className="block h-px" />;
}

/* 한/영 전환 버튼: 동그란 표시가 미끄러지듯 옮겨 간다 */
function LangSwitch({ lang, set, dark = false }: { lang: Lang; set: (l: Lang) => void; dark?: boolean }) {
  return (
    <div role="group" aria-label="Language" className="relative inline-flex h-8 items-center rounded-full border p-[3px] text-[11px] font-bold" style={{ borderColor: dark ? "#3a4c66" : "var(--gi-line)" }}>
      {(["ko", "en"] as Lang[]).map((l) => (
        <button key={l} onClick={() => set(l)} aria-pressed={lang === l} className="relative z-10 h-full w-9 rounded-full" style={{ color: lang === l ? "#fff" : dark ? "#93a1b5" : "var(--gi-sub)" }}>
          {lang === l && <motion.span layoutId={dark ? "gi-lang-d" : "gi-lang"} className="absolute inset-0 -z-10 rounded-full" style={{ background: dark ? "var(--gi-copper)" : "var(--gi-ink)" }} transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
          {l === "ko" ? "KO" : "EN"}
        </button>
      ))}
    </div>
  );
}

const MENU: [string, string, string[]][] = [
  ["about", "회사소개", ["개요", "인사말"]],
  ["business", "사업영역", ["부동산 투자", "부동산 개발", "투자자문"]],
  ["approach", "투자 접근", ["4단계 프로세스", "원칙"]],
  ["record", "사업실적", []],
  ["contact", "문의", []],
];

export default function GiibSite() {
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
  const menuList: [string, string, string[]][] = MENU.map(([id, l, k], i) => (lang === "en" ? [id, MENU_EN[i][0], MENU_EN[i][1]] : [id, l, k]));
  const biz_ = BUSINESS.map((b, i) => (lang === "en" ? { ...b, ...BUSINESS_EN[i] } : b));
  const proc_ = PROCESS.map((p, i) => (lang === "en" ? { ...p, ...PROCESS_EN[i] } : p));
  const prin_ = PRINCIPLES.map((p, i) => (lang === "en" ? { ...p, ...PRINCIPLES_EN[i] } : p));
  const stats_ = lang === "en" ? RECORD_STATS_EN : RECORD_STATS;
  const coName = T(CO.nameKo, CO_EN.name), coCeo = T(CO.ceo, CO_EN.ceo);
  const coAddr = lang === "en" ? CO_EN.address : CO.address;
  const [menu, setMenu] = useState(false);
  const [sub, setSub] = useState<number | null>(null);
  const [biz, setBiz] = useState<number | null>(0);
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
    <div className="gi" lang={lang}>
      {/* 언어 전환 때 구리색 막이 한 번 지나간다 */}
      {wipe > 0 && (
        <motion.div key={wipe} className="pointer-events-none fixed inset-0 z-[60]" style={{ background: "var(--gi-ink)" }}
          initial={{ clipPath: "inset(0% 100% 0% 0%)" }} animate={{ clipPath: ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 0% 100%)"] }} transition={{ duration: 0.6, times: [0, 0.45, 1], ease: "easeInOut" }}>
          <div className="flex h-full items-center justify-center"><img src="/g0dy098g/logo-mark.svg" alt="" width={56} height={56} /></div>
        </motion.div>
      )}
      <div className="relative mx-auto w-full max-w-[480px]">
        {/* 헤더 */}
        <header className="sticky top-0 z-40 border-b bg-white" style={{ borderColor: "var(--gi-line)" }}>
          <div className="flex h-[56px] items-center justify-between px-4">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="맨 위로"><Logo /></button>
            <div className="flex items-center gap-2">
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

        {/* HERO — 코람코·글로벌PMC식: 화면 가득 찬 어두운 이미지 위에 문장 */}
        <section className="relative h-[86dvh] min-h-[560px] overflow-hidden" style={{ background: "#0b1828" }}>
          {SRC("hero") ? <img src={SRC("hero")} alt={T("서울 도심 야경", "Seoul skyline at dusk")} className="gi-kb absolute inset-0 h-full w-full object-cover" style={{ objectPosition: IMG_POS.hero }} /> : <div className="absolute inset-0"><HubScene /></div>}
          {!SRC("hero") && (<><LiveBlob fill="rgba(201,154,98,.22)" seeds={[1, 4, 7, 2]} dur={11} className="pointer-events-none absolute -left-24 -top-16 h-[240px] w-[240px]" />
          <LiveBlob fill="rgba(31,59,95,.38)" seeds={[3, 6, 9, 5]} dur={13} r={78} className="pointer-events-none absolute -right-20 top-1/3 h-[300px] w-[300px]" /></>)}
          <div className="absolute inset-0" style={{ background: lang === "en" ? "linear-gradient(180deg, rgba(8,14,24,.8) 0%, rgba(8,14,24,.45) 34%, rgba(8,14,24,0) 52%, rgba(8,14,24,0) 74%, rgba(8,14,24,.85) 100%)" : "linear-gradient(180deg, rgba(8,14,24,.15) 0%, rgba(8,14,24,.25) 40%, rgba(8,14,24,.9) 78%, #080e18 100%)" }} />
          {/* 영문은 문장이 길어 도심을 가리므로, 문장은 하늘 쪽(위)에 두고 버튼만 아래에 둔다 */}
          <div className={lang === "en" ? "absolute inset-0 flex flex-col justify-between px-5 pt-9 pb-8 text-white" : "absolute inset-x-0 bottom-0 px-5 pb-10 text-white"}>
            <div>
            <div className="gi-en text-[11px] font-bold" style={{ color: "var(--gi-sand)" }}><Lift delay={0.9}>REAL ESTATE · DEVELOPMENT · ADVISORY</Lift></div>
            <h1 className={`mt-3 font-extrabold tracking-[-0.02em] ${lang === "en" ? "text-[29px] leading-[1.22]" : "text-[31px] leading-[1.3]"}`}>
              <Lift delay={1.05}>{T("사는 데서 끝내지 않습니다.", "Acquisition is only the beginning.")}</Lift>
              <Lift delay={1.2}><span style={{ color: "var(--gi-sand)" }}>{T("자산의 가치를 설계합니다.", "We design the value of assets.")}</span></Lift>
            </h1>
            <Rise delay={1.4}><p className="mt-4 text-[14.5px] leading-[1.75] text-white/75">{T("글로벌인프라허브는 부동산 투자·개발과 투자자문을 하는 회사입니다. 서류로 확인하고, 구조로 지키는 투자를 설계합니다.", "GIIB invests in, develops and advises on real estate. We verify with documents and design investments protected by structure.")}</p></Rise>
            </div>
            <Rise delay={1.55}>
              <div className="mt-6 flex items-end justify-between gap-3">
                <button onClick={() => go("business")} className="flex items-center gap-3 px-5 py-3.5 text-[14.5px] font-bold" style={{ background: "#fff", color: "var(--gi-black)" }}>{T("사업영역 살펴보기", "Explore Our Business")} <Arrow /></button>
                <div className="text-right leading-none">
                  <div className="gi-en text-[10px] text-white/60">SINCE</div>
                  <div className="mt-1 text-[40px] font-extrabold tracking-[-0.03em]"><Count to={2015} /></div>
                </div>
              </div>
            </Rise>
          </div>
          {/* 첫 등장: 검은 막이 아래로 걷힌다 */}
          <motion.div className="absolute inset-0" style={{ background: "#0b0c0e" }} initial={{ clipPath: "inset(0% 0% 0% 0%)" }} animate={{ clipPath: "inset(100% 0% 0% 0%)" }} transition={{ duration: 1.2, delay: 0.1, ease: EASE }} />
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
            {([[2015, T("설립", "Founded")], [3, T("사업영역", "Business areas")], [4, T("투자 단계", "Investment stages")]] as [number, string][]).map(([a, b], i) => (
              <Rise key={b} delay={i * 0.08}>
                <div className="pt-4" style={{ borderLeft: i ? "1px solid var(--gi-line)" : "none", paddingLeft: i ? 12 : 0 }}>
                  <div className="text-[36px] font-extrabold leading-none tracking-[-0.03em]" style={{ color: "var(--gi-black)" }}><Count to={a} /></div>
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

        {/* 사업영역 — Macquarie식 사업부 목록 (눌러서 펼침) */}
        <section id="business" className="pt-14 pb-14" style={{ background: "var(--gi-paper)" }}>
          <div className="px-5">
            <Kicker>OUR BUSINESS</Kicker>
            <div className="flex items-end justify-between gap-3">
              <h2 className="mt-4 text-[28px] font-extrabold leading-[1.3] tracking-[-0.02em]" style={{ color: "var(--gi-black)" }}><Lift>{lang === "en" ? <>Three businesses,<br />one flow</> : <>세 개의 사업,<br />하나의 흐름</>}</Lift></h2>
              <div className="h-[110px] w-[110px] shrink-0"><ShapeMorph index={biz ?? 0} /></div>
            </div>
          </div>
          <div className="mt-8 border-t" style={{ borderColor: "var(--gi-black)" }}>
            {biz_.map((b, i) => (
              <div key={b.no} className="border-b bg-white" style={{ borderColor: "var(--gi-line)" }}>
                <button onClick={() => setBiz(biz === i ? null : i)} className="flex w-full items-center gap-4 px-5 py-6 text-left">
                  <span className="text-[13px] font-bold" style={{ color: "var(--gi-copper)" }}>{b.no}</span>
                  <span className="flex-1">
                    <span className="block text-[21px] font-extrabold" style={{ color: "var(--gi-black)" }}>{b.t}</span>
                    {lang === "ko" && <span className="gi-en mt-1 block text-[10px] font-semibold" style={{ color: "var(--gi-sub)" }}>{b.en}</span>}
                  </span>
                  <motion.span animate={{ rotate: biz === i ? 45 : 0 }} transition={{ duration: 0.3 }} className="text-[28px] font-light leading-none" style={{ color: "var(--gi-black)" }}>+</motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {biz === i && (
                    <motion.div key="d" className="overflow-hidden" initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.45, ease: EASE }}>
                      <div className="px-5 pb-7">
                        <Visual k={["invest", "develop", "advisory"][i]} variant={i + 1} className="h-[200px]" />
                        <p className="mt-5 text-[15px] leading-[1.8]" style={{ color: "var(--gi-text)" }}>{b.d}</p>
                        <ul className="mt-4">
                          {b.items.map((it) => (
                            <li key={it} className="flex items-center justify-between border-t py-3 text-[14px]" style={{ borderColor: "var(--gi-line)" }}>{it}<span style={{ color: "var(--gi-copper)" }}><Arrow size={15} /></span></li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

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
          <div className="mt-12">
            <Kicker>HOW WE STRUCTURE</Kicker>
            <h3 className="mt-3 text-[22px] font-extrabold leading-[1.35]" style={{ color: "var(--gi-black)" }}>{T("투자 구조 한눈에 보기", "Our investment structure at a glance")}<SampleTag /></h3>
            <p className="mt-2 text-[14px] leading-[1.7]" style={{ color: "var(--gi-sub)" }}>{T("투자자의 자금은 SPC와 담보신탁으로 분리해 지키고, 자산 운영과 출구까지 하나의 구조로 관리합니다.", "Investor capital is ring-fenced through an SPC and a collateral trust, and everything from operations to exit is managed as one structure.")}</p>
            <Structure />
          </div>
        </section>

        {/* 원칙 — 어두운 띠 */}
        <section className="relative overflow-hidden px-5 pt-14 pb-14" style={{ background: "var(--gi-black)" }}>
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
                <div className="border-t pt-5" style={{ borderColor: "#2b2e33" }}>
                  <div className="text-[22px] font-extrabold text-white">{p.t}</div>
                  <p className="mt-1.5 text-[14px]" style={{ color: "#a3a8b0" }}>{p.d}</p>
                </div>
              </Rise>
            ))}
          </div>
        </section>

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

        {/* 인사말 */}
        <section id="ceo" className="px-5 pt-14 pb-14" style={{ background: "var(--gi-paper)" }}>
          <Kicker>CEO MESSAGE</Kicker>
          {SRC("ceo") && <Visual k="ceo" className="mt-5 h-[440px]" tag={T("대표이사 유현근", "CEO Hyun-geun Yoo")} />}
          <Rise>
            <p className="mt-5 text-[21px] font-bold leading-[1.55]" style={{ color: "var(--gi-black)" }}>&ldquo;{lang === "en" ? <>We will be a trusted hub<br />between investors and sponsors.</> : <>투자자와 사업자 사이에서<br />믿을 수 있는 거점이 되겠습니다.</>}&rdquo;</p>
          </Rise>
          <div className="mt-6 space-y-3 text-[15px] leading-[1.85]" style={{ color: "var(--gi-text)" }}>
            {lang === "en" ? (<>
              <p>Hello, I am Hyun-geun Yoo, CEO of Global Infra Hub.</p>
              <p>The biggest losses in real estate investment come from unverified numbers and undesigned structures. We verify with documents first, speak about risks first, and above all protect investor capital through collateral and contract structures.</p>
              <p>Good assets are many, but few have a structure strong enough to protect them to the end. We take responsibility for one continuous flow — sourcing, due diligence, structuring, execution and management — helping investors and sponsors make decisions they can trust in numbers.</p>
              <p>As GIIB starts anew, we will work honestly to become a real estate investment hub you can rely on. Thank you.</p>
            </>) : (<>
              <p>안녕하십니까, 글로벌인프라허브 대표이사 유현근입니다.</p>
              <p>부동산 투자에서 가장 큰 손실은 확인하지 않은 숫자와 설계되지 않은 구조에서 생깁니다. 저희는 서류로 먼저 확인하고, 위험을 먼저 말씀드리며, 담보와 계약 구조로 투자자의 원금을 지키는 일을 가장 중요하게 생각합니다.</p>
              <p>좋은 자산은 많지만, 그 자산을 끝까지 지켜 낼 구조를 갖춘 곳은 많지 않습니다. 글로벌인프라허브는 발굴과 실사, 구조화, 실행과 관리까지 한 흐름으로 책임지며, 투자자와 사업자 모두가 숫자로 납득할 수 있는 결정을 돕겠습니다.</p>
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
        </section>

        {/* 푸터 */}
        <footer className="px-5 pt-10 pb-12" style={{ background: "var(--gi-ink)", color: "#93a1b5" }}>
          <Logo dark size={34} />
          <div className="mt-5"><LangSwitch lang={lang} set={setLang} dark /></div>
          <div className="mt-6 border-t" style={{ borderColor: "#24405f" }}>
            {menuList.map(([id, l]) => (
              <button key={id} onClick={() => go(id)} className="flex w-full items-center justify-between border-b py-3.5 text-left text-[14px] text-white" style={{ borderColor: "#24405f" }}>{l}<Arrow size={15} /></button>
            ))}
          </div>
          <p className="mt-6 text-[12px] leading-[1.8]">{coName} · {T("대표이사", "CEO")} {coCeo}<br />{T("사업자등록번호", "Business Reg. No.")} {CO.bizNo}{coAddr ? <><br />{coAddr}</> : null}</p>
          <p className="gi-en mt-5 text-[10.5px]">© 2026 GIIB · GLOBAL INFRA HUB</p>
          <p className="mt-3 text-[10.5px]" style={{ color: "#6f7f96" }}>{T("임시 홈페이지 · 내용 확정 후 giibgroup.com으로 옮길 예정입니다", "Preview site · will move to giibgroup.com once finalized")}</p>
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
