"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode, CSSProperties } from "react";
import { motion, AnimatePresence, useInView, animate } from "framer-motion";
import { CO, BUSINESS, PROCESS, PRINCIPLES, IMAGES } from "./data";

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
function Count({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [v, setV] = useState(to > 100 ? to - 30 : 0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(to > 100 ? to - 30 : 0, to, { duration: 1.6, ease: EASE, onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{v}</span>;
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

function Pending({ children = "입력 대기" }: { children?: ReactNode }) {
  return <span className="border border-dashed px-1.5 py-0.5 text-[11.5px]" style={{ borderColor: "var(--gi-copper)", color: "var(--gi-copper)" }}>{children}</span>;
}

function Arrow({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14 M13 6l6 6-6 6" /></svg>;
}

function Logo({ dark = false, size = 32 }: { dark?: boolean; size?: number }) {
  return (
    <span className="flex items-center gap-2.5">
      <img src="/g0dy098g/logo-mark.svg" alt="" width={size} height={size} />
      <span className="leading-none">
        <span className="block text-[17px] font-extrabold tracking-[0.12em]" style={{ color: dark ? "#fff" : "var(--gi-black)" }}>GIIB</span>
        <span className="mt-1 block text-[10.5px] font-semibold" style={{ color: dark ? "var(--gi-sand)" : "var(--gi-sub)" }}>글로벌인프라허브</span>
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
          {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : <HubScene variant={variant} />}
        </motion.div>
        {tag && <span className="absolute bottom-2 left-2 bg-white px-1.5 py-0.5 text-[10px] font-semibold" style={{ color: "var(--gi-black)" }}>{tag}</span>}
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

const MENU: [string, string, string[]][] = [
  ["about", "회사소개", ["개요", "인사말"]],
  ["business", "사업영역", ["부동산 투자", "부동산 개발", "투자자문"]],
  ["approach", "투자 접근", ["4단계 프로세스", "원칙"]],
  ["record", "사업실적", []],
  ["contact", "문의", []],
];

export default function GiibSite() {
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
    <div className="gi">
      <div className="relative mx-auto w-full max-w-[480px]">
        {/* 헤더 */}
        <header className="sticky top-0 z-40 border-b bg-white" style={{ borderColor: "var(--gi-line)" }}>
          <div className="flex h-[56px] items-center justify-between px-4">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="맨 위로"><Logo /></button>
            <button onClick={() => setMenu(true)} aria-label="메뉴 열기" className="flex h-10 w-10 flex-col items-end justify-center gap-[5px]">
              <span className="h-[2px] w-6" style={{ background: "var(--gi-black)" }} /><span className="h-[2px] w-6" style={{ background: "var(--gi-black)" }} /><span className="h-[2px] w-6" style={{ background: "var(--gi-black)" }} />
            </button>
          </div>
        </header>

        {/* 전체 메뉴 (Brookfield·KIC식 펼침 목록) */}
        <AnimatePresence>
          {menu && (
            <motion.div key="m" className="fixed inset-y-0 right-0 z-50 w-full max-w-[480px] overflow-y-auto bg-white" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.5, ease: EASE }}>
              <div className="flex h-[56px] items-center justify-between border-b px-4" style={{ borderColor: "var(--gi-line)" }}>
                <Logo />
                <button onClick={() => setMenu(false)} aria-label="메뉴 닫기" className="text-[30px] leading-none" style={{ color: "var(--gi-black)" }}>×</button>
              </div>
              <div className="px-5">
                {MENU.map(([id, l, kids], i) => (
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
              <p className="px-5 pt-8 pb-10 text-[12px]" style={{ color: "var(--gi-sub)" }}>{CO.nameKo} · 대표이사 {CO.ceo}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HERO — 큰 사진 + 아래 문장 */}
        <section>
          <div className="relative h-[54dvh] min-h-[340px] overflow-hidden" style={{ background: "#10223a" }}>
            {SRC("hero") ? <img src={SRC("hero")} alt="" className="gi-kb absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0"><HubScene /></div>}
            <LiveBlob fill="rgba(201,154,98,.32)" seeds={[1, 4, 7, 2]} dur={11} className="pointer-events-none absolute -left-16 -top-16 h-[260px] w-[260px] mix-blend-screen" />
            <LiveBlob fill="rgba(31,59,95,.38)" seeds={[3, 6, 9, 5]} dur={13} r={78} className="pointer-events-none absolute -bottom-20 -right-16 h-[300px] w-[300px]" />
            {/* 아래로 쓸려 내려가는 막 (첫 등장) */}
            <motion.div className="absolute inset-0" style={{ background: "#0b0c0e" }} initial={{ clipPath: "inset(0% 0% 0% 0%)" }} animate={{ clipPath: "inset(100% 0% 0% 0%)" }} transition={{ duration: 1.2, delay: 0.1, ease: EASE }} />
          </div>
          <div className="px-5 pt-8 pb-12">
            <Kicker>REAL ESTATE INVESTMENT · DEVELOPMENT · ADVISORY</Kicker>
            <h1 className="mt-4 text-[34px] font-extrabold leading-[1.24] tracking-[-0.02em]" style={{ color: "var(--gi-black)" }}>
              <Lift delay={0.1}>부동산의 가치를,</Lift>
              <Lift delay={0.25}>구조로 완성합니다.</Lift>
            </h1>
            <Rise delay={0.4}><p className="mt-5 text-[15.5px] leading-[1.8]" style={{ color: "var(--gi-sub)" }}>글로벌인프라허브는 부동산 투자와 개발, 투자자문을 하는 회사입니다. 서류로 확인하고, 구조로 지키는 투자를 설계합니다.</p></Rise>
            <Rise delay={0.5}>
              <button onClick={() => go("business")} className="mt-7 flex items-center gap-3 px-5 py-3.5 text-[14.5px] font-bold text-white" style={{ background: "var(--gi-black)" }}>사업영역 살펴보기 <Arrow /></button>
            </Rise>
          </div>
        </section>

        {/* 큰 문장 (BlackRock식) */}
        <section id="about" className="border-t px-5 pt-14 pb-14" style={{ borderColor: "var(--gi-line)" }}>
          <Kicker>WHO WE ARE</Kicker>
          <Rise>
            <p className="mt-5 text-[25px] font-bold leading-[1.45] tracking-[-0.01em]" style={{ color: "var(--gi-black)" }}>
              좋은 자산을 찾는 일만큼,<br /><span style={{ color: "var(--gi-copper)" }}>그 자산을 지키는 구조</span>를<br />만드는 일이 중요하다고 믿습니다.
            </p>
          </Rise>
          <div className="mt-10 grid grid-cols-3 border-t" style={{ borderColor: "var(--gi-black)" }}>
            {([[2015, "설립"], [3, "사업영역"], [4, "투자 단계"]] as [number, string][]).map(([a, b], i) => (
              <Rise key={b} delay={i * 0.08}>
                <div className="pt-4" style={{ borderLeft: i ? "1px solid var(--gi-line)" : "none", paddingLeft: i ? 12 : 0 }}>
                  <div className="text-[36px] font-extrabold leading-none tracking-[-0.03em]" style={{ color: "var(--gi-black)" }}><Count to={a} /></div>
                  <div className="mt-2 text-[12px]" style={{ color: "var(--gi-sub)" }}>{b}</div>
                </div>
              </Rise>
            ))}
          </div>
          <dl className="mt-10 text-[13.5px]">
            {[["상호", CO.nameKo], ["영문", `${CO.brand} · ${CO.nameEn}`], ["대표이사", CO.ceo], ["설립", CO.founded], ["본점", CO.address || <Pending>등기 정리 후 입력</Pending>]].map(([k, v], i) => (
              <div key={i} className="grid grid-cols-[72px_1fr] gap-3 border-b py-3" style={{ borderColor: "var(--gi-line)" }}>
                <dt className="font-semibold" style={{ color: "var(--gi-black)" }}>{k}</dt><dd>{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 사업영역 — Macquarie식 사업부 목록 (눌러서 펼침) */}
        <section id="business" className="pt-14 pb-14" style={{ background: "var(--gi-paper)" }}>
          <div className="px-5">
            <Kicker>OUR BUSINESS</Kicker>
            <div className="flex items-end justify-between gap-3">
              <h2 className="mt-4 text-[28px] font-extrabold leading-[1.3] tracking-[-0.02em]" style={{ color: "var(--gi-black)" }}><Lift>세 개의 사업,<br />하나의 흐름</Lift></h2>
              <div className="h-[110px] w-[110px] shrink-0"><ShapeMorph index={biz ?? 0} /></div>
            </div>
          </div>
          <div className="mt-8 border-t" style={{ borderColor: "var(--gi-black)" }}>
            {BUSINESS.map((b, i) => (
              <div key={b.no} className="border-b bg-white" style={{ borderColor: "var(--gi-line)" }}>
                <button onClick={() => setBiz(biz === i ? null : i)} className="flex w-full items-center gap-4 px-5 py-6 text-left">
                  <span className="text-[13px] font-bold" style={{ color: "var(--gi-copper)" }}>{b.no}</span>
                  <span className="flex-1">
                    <span className="block text-[21px] font-extrabold" style={{ color: "var(--gi-black)" }}>{b.t}</span>
                    <span className="gi-en mt-1 block text-[10px] font-semibold" style={{ color: "var(--gi-sub)" }}>{b.en}</span>
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
          <h2 className="mt-4 text-[28px] font-extrabold leading-[1.3] tracking-[-0.02em]" style={{ color: "var(--gi-black)" }}><Lift>발굴에서 출구까지,<br />네 단계</Lift></h2>
          <ol className="mt-8 border-t" style={{ borderColor: "var(--gi-black)" }}>
            {PROCESS.map((p, i) => (
              <motion.li key={p.t} className="grid grid-cols-[56px_1fr] border-b py-6" style={{ borderColor: "var(--gi-line)" }}
                initial={{ x: -24 }} whileInView={{ x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}>
                <span className="relative h-[44px] w-[44px]">
                  <LiveBlob fill="#f4f3f0" seeds={[i + 1, i + 4, i + 7]} dur={7 + i} r={78} className="absolute inset-0 h-full w-full" />
                  <span className="relative flex h-full w-full items-center justify-center text-[17px] font-extrabold" style={{ color: "var(--gi-copper)" }}>{String(i + 1).padStart(2, "0")}</span>
                </span>
                <div>
                  <div className="gi-en text-[10px] font-semibold" style={{ color: "var(--gi-copper)" }}>{p.en}</div>
                  <div className="mt-1 text-[19px] font-extrabold" style={{ color: "var(--gi-black)" }}>{p.t}</div>
                  <p className="mt-1.5 text-[14px] leading-[1.7]" style={{ color: "var(--gi-sub)" }}>{p.d}</p>
                </div>
              </motion.li>
            ))}
          </ol>
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
            {PRINCIPLES.map((p, i) => (
              <Rise key={p.t} delay={i * 0.05}>
                <PrinWatch onSeen={() => setPrin(i)} />
                <div className="border-t pt-5" style={{ borderColor: "#2b2e33" }}>
                  <div className="text-[22px] font-extrabold text-white">{p.t}</div>
                  <p className="mt-1.5 text-[14px]" style={{ color: "#a3a8b0" }}>{p.d}</p>
                </div>
              </Rise>
            ))}
          </div>
        </section>

        {/* 사업실적 */}
        <section id="record" className="px-5 pt-14 pb-14">
          <Kicker>TRACK RECORD</Kicker>
          <h2 className="mt-4 text-[28px] font-extrabold tracking-[-0.02em]" style={{ color: "var(--gi-black)" }}>사업실적</h2>
          <div className="mt-6 border-t py-8" style={{ borderColor: "var(--gi-black)" }}>
            <div className="text-[17px] font-bold" style={{ color: "var(--gi-black)" }}>확인된 실적을 정리하고 있습니다.</div>
            <p className="mt-1.5 text-[14px]" style={{ color: "var(--gi-sub)" }}>계약서·증빙으로 확인되는 실적만 게시합니다.</p>
          </div>
          <Visual k="city" variant={4} className="h-[220px]" />
        </section>

        {/* 인사말 */}
        <section id="ceo" className="px-5 pt-14 pb-14" style={{ background: "var(--gi-paper)" }}>
          <Kicker>CEO MESSAGE</Kicker>
          <Rise>
            <p className="mt-5 text-[21px] font-bold leading-[1.55]" style={{ color: "var(--gi-black)" }}>&ldquo;투자자와 사업자 사이에서<br />믿을 수 있는 거점이 되겠습니다.&rdquo;</p>
          </Rise>
          <div className="mt-6 space-y-3 text-[15px] leading-[1.85]" style={{ color: "var(--gi-text)" }}>
            <p>안녕하십니까, 글로벌인프라허브 대표이사 유현근입니다.</p>
            <p>부동산 투자에서 가장 큰 손실은 확인하지 않은 숫자와 설계되지 않은 구조에서 생깁니다. 저희는 서류로 먼저 확인하고, 위험을 먼저 말씀드리며, 담보와 계약 구조로 투자자의 원금을 지키는 일을 가장 중요하게 생각합니다.</p>
          </div>
          <p className="mt-6 text-[14px]" style={{ color: "var(--gi-sub)" }}>대표이사 <b className="ml-1 text-[17px] tracking-[0.12em]" style={{ color: "var(--gi-black)" }}>{CO.ceo}</b></p>
          <p className="mt-1 text-[11px]" style={{ color: "var(--gi-copper)" }}>(인사말 초안 · 대표 확인 후 확정)</p>
        </section>

        {/* 문의 */}
        <section id="contact" className="px-5 pt-14 pb-14">
          <Kicker>CONTACT US</Kicker>
          <h2 className="mt-4 text-[28px] font-extrabold tracking-[-0.02em]" style={{ color: "var(--gi-black)" }}>문의</h2>
          <dl className="mt-6 border-t text-[14px]" style={{ borderColor: "var(--gi-black)" }}>
            {[["주소", CO.address || <Pending>등기 정리 후 입력</Pending>], ["대표전화", CO.phone ? <a href={`tel:${CO.phone}`}>{CO.phone}</a> : <Pending />], ["이메일", CO.email ? <a href={`mailto:${CO.email}`}>{CO.email}</a> : <Pending />]].map(([k, v], i) => (
              <div key={i} className="grid grid-cols-[76px_1fr] gap-3 border-b py-3.5" style={{ borderColor: "var(--gi-line)" }}>
                <dt className="font-semibold" style={{ color: "var(--gi-black)" }}>{k}</dt><dd>{v}</dd>
              </div>
            ))}
          </dl>
          <form className="mt-8 grid gap-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            {[["gi-nm", "이름 / 회사명"], ["gi-ph", "연락처"]].map(([id, l]) => (
              <label key={id} htmlFor={id} className="grid gap-1.5 text-[12.5px] font-semibold" style={{ color: "var(--gi-black)" }}>{l}
                <input id={id} className="w-full min-w-0 border-b px-0 py-2.5 text-[16px] outline-none" style={{ borderColor: "var(--gi-black)" }} />
              </label>
            ))}
            <label htmlFor="gi-msg" className="grid gap-1.5 text-[12.5px] font-semibold" style={{ color: "var(--gi-black)" }}>문의 내용
              <textarea id="gi-msg" rows={4} className="w-full min-w-0 border px-3 py-3 text-[16px] outline-none" style={{ borderColor: "var(--gi-line)" }} />
            </label>
            <button type="submit" className="mt-2 flex items-center justify-between px-5 py-4 text-[15px] font-bold text-white" style={{ background: "var(--gi-black)" }}>문의 보내기 <Arrow /></button>
            <p className="min-h-[1em] text-[12.5px]" style={{ color: "var(--gi-copper)" }} aria-live="polite">{sent ? "임시 홈페이지라 아직 전송되지 않습니다. 정식 오픈 후 담당자에게 바로 전달됩니다." : ""}</p>
          </form>
        </section>

        {/* 푸터 */}
        <footer className="px-5 pt-10 pb-12" style={{ background: "var(--gi-ink)", color: "#93a1b5" }}>
          <Logo dark size={34} />
          <div className="mt-6 border-t" style={{ borderColor: "#24405f" }}>
            {MENU.map(([id, l]) => (
              <button key={id} onClick={() => go(id)} className="flex w-full items-center justify-between border-b py-3.5 text-left text-[14px] text-white" style={{ borderColor: "#24405f" }}>{l}<Arrow size={15} /></button>
            ))}
          </div>
          <p className="mt-6 text-[12px] leading-[1.8]">{CO.nameKo} · 대표이사 {CO.ceo}<br />사업자등록번호 {CO.bizNo}{CO.address ? <><br />{CO.address}</> : null}</p>
          <p className="gi-en mt-5 text-[10.5px]">© 2026 GIIB · GLOBAL INFRA HUB</p>
          <p className="mt-3 text-[10.5px]" style={{ color: "#6f7f96" }}>임시 홈페이지 · 내용 확정 후 giibgroup.com으로 옮길 예정입니다</p>
        </footer>

        <AnimatePresence>
          {showTop && (
            <motion.button key="top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="맨 위로" className="fixed bottom-5 z-40 flex h-11 w-11 items-center justify-center"
              style={{ right: "max(16px, calc(50vw - 240px + 16px))", background: "var(--gi-black)", color: "#fff" }} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.3 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 19V5 M5 12l7-7 7 7" /></svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
