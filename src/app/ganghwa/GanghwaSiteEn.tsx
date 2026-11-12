"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence, animate, useInView } from "framer-motion";

/*
 * Ganghwa Mine No.1 — English temporary site (mobile only)
 * Source: H&L Partners review deck and 2025 plan. Figures, demand and timing are assumptions from the source documents.
 * Financial structure (SPC/CB) is not on this site.
 * Rule: no opacity animation; move position, scale and masks only.
 */
const IMG = (f: string) => `/ganghwa/${f}.webp`;
const EASE = [0.16, 1, 0.3, 1] as const;
const NAV: [string, string][] = [["about", "The Mine"], ["mineral", "Minerals"], ["location", "Location"], ["demand", "Demand"], ["business", "Business"], ["eco", "Eco Mining"], ["roadmap", "Roadmap"], ["docs", "Documents"], ["contact", "Contact"]];

function Rise({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return <motion.div className={className} initial={{ y: 28 }} whileInView={{ y: 0 }} viewport={{ once: true, margin: "-30px" }} transition={{ duration: 0.8, delay, ease: EASE }}>{children}</motion.div>;
}
function Lift({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true });
  return <span ref={ref} className="block overflow-hidden"><motion.span className="block" initial={{ y: "108%" }} animate={{ y: seen ? "0%" : "108%" }} transition={{ duration: 0.9, delay, ease: EASE }}>{children}</motion.span></span>;
}
function Roll({ to, d = 0 }: { to: number; d?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "-30px" });
  const [v, setV] = useState(0);
  useEffect(() => { if (!seen) return; const c = animate(0, to, { duration: 1.4, ease: EASE, onUpdate: setV }); return () => c.stop(); }, [seen, to]);
  return <span ref={ref}>{v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d })}</span>;
}
function Photo({ src, alt, className = "", pos = "50% 50%", cap }: { src: string; alt: string; className?: string; pos?: string; cap?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-30px" });
  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div className="absolute inset-0 overflow-hidden" style={{ background: "#e3e9f0" }} initial={{ clipPath: "inset(100% 0% 0% 0%)" }} animate={{ clipPath: seen ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" }} transition={{ duration: 1.1, ease: EASE }}>
        <motion.img src={src} alt={alt} className="h-full w-full object-cover" style={{ objectPosition: pos }} initial={{ scale: 1.15 }} animate={{ scale: seen ? 1 : 1.15 }} transition={{ duration: 1.8, ease: EASE }} />
      </motion.div>
      {cap && <span className="absolute bottom-2 left-2 bg-white/85 px-1.5 py-0.5 text-[10px]" style={{ color: "var(--gw-ink)" }}>{cap}</span>}
    </div>
  );
}
function Asm({ t = "Assumption" }: { t?: string }) {
  return <span className="ml-1.5 inline-block border px-1 py-px align-middle text-[9.5px] font-bold leading-[1.3]" style={{ borderColor: "var(--gw-copper)", color: "var(--gw-copper)" }}>{t}</span>;
}
function Head({ no, en, children, sub, dark, wm }: { no: string; en: string; children: ReactNode; sub?: ReactNode; dark?: boolean; wm?: string }) {
  return (
    <div className="relative mb-6">
      {wm && <span className={`gw-wm ${dark ? "dark" : ""}`} aria-hidden="true">{wm}</span>}
      <div className="gw-en relative flex items-center gap-2 text-[11px] font-bold" style={{ color: dark ? "var(--gw-copper2)" : "var(--gw-copper)" }}><span>{no}</span><span className="h-px w-7" style={{ background: "currentColor" }} /><span>{en}</span></div>
      <h2 className="relative mt-2.5 text-[25px] font-bold leading-[1.3] tracking-tight" style={{ color: dark ? "#fff" : "var(--gw-ink)" }}><Lift>{children}</Lift></h2>
      {sub && <Rise delay={0.15}><p className="mt-3 text-[14px] leading-[1.75]" style={{ color: dark ? "#b9c4cf" : "var(--gw-sub)" }}>{sub}</p></Rise>}
    </div>
  );
}
function Bar({ l, v, max, txt, c = "var(--gw-copper)" }: { l: string; v: number; max: number; txt: string; c?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-20px" });
  return (
    <div ref={ref}>
      <div className="flex items-baseline justify-between text-[13px]"><span className="font-bold">{l}</span><span className="font-bold" style={{ color: "var(--gw-copper)" }}>{txt}</span></div>
      <div className="mt-1.5 h-[10px] overflow-hidden" style={{ background: "#e3e9f0" }}><motion.div className="h-full origin-left" style={{ background: c, width: `${(v / max) * 100}%` }} initial={{ scaleX: 0 }} animate={{ scaleX: seen ? 1 : 0 }} transition={{ duration: 1.2, ease: EASE }} /></div>
    </div>
  );
}
/* 위치 관계 도식 */
function MapArt() {
  const ref = useRef<SVGSVGElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  const pts: [number, number, string, string][] = [[118, 86, "Ganghwa Mine No.1", "Hwado-myeon, Ganghwa"], [70, 168, "Incheon Int'l Airport", "Yeongjong Island"], [236, 196, "Songdo Zone 11 · Campuses", "Songdo, Incheon"], [176, 250, "Incheon Bay Tidal Site", "Planned project"]];
  return (
    <svg ref={ref} viewBox="-22 -50 362 345" className="w-full" role="img" aria-label="Diagram of Ganghwa Mine No.1 relative to Incheon Airport, Songdo Zone 11 and the Incheon Bay tidal power site">
      <path d="M40,40 C80,18 150,24 176,54 C196,78 186,112 160,126 C128,142 82,136 58,112 C34,90 22,60 40,40Z" fill="#e4edf6" stroke="#a9c2dc" />
      <path d="M210,60 C250,48 300,70 312,120 C320,170 300,240 262,270 L226,282 C214,240 222,200 206,160 C196,128 196,84 210,60Z" fill="#edf2f7" stroke="#c0cfdf" />
      <path d="M40,150 C62,140 100,150 104,172 C104,190 70,196 48,186 C34,178 30,160 40,150Z" fill="#e4edf6" stroke="#a9c2dc" />
      <text x="96" y="52" fontSize="9" fill="#7a8794">Ganghwa</text><text x="262" y="110" fontSize="9" fill="#7a8794">Incheon</text>
      <motion.circle cx="118" cy="86" r="128" fill="none" stroke="#1260b8" strokeWidth="1" strokeDasharray="4 5" initial={{ pathLength: 0 }} animate={{ pathLength: seen ? 1 : 0 }} transition={{ duration: 2, delay: 0.2 }} />
      <text x="214" y="-10" fontSize="9" fill="#1260b8">15km Radius</text>
      {pts.slice(1).map(([x, y], i) => <motion.path key={i} d={`M118,86 L${x},${y}`} stroke="#0c2340" strokeWidth="1.8" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: seen ? 1 : 0 }} transition={{ duration: 1, delay: 0.7 + i * 0.25, ease: EASE }} />)}
      {pts.map(([x, y, a, b], i) => (
        <g key={a}>
          <motion.circle cx={x} cy={y} r={i ? 5 : 8} fill={i ? "#0c2340" : "#1260b8"} initial={{ scale: 0 }} animate={{ scale: seen ? 1 : 0 }} transition={{ duration: 0.5, delay: 0.4 + i * 0.25 }} style={{ transformOrigin: `${x}px ${y}px` }} />
          <text x={x + (i === 2 ? 10 : 12)} y={y + (i === 2 ? 18 : 2)} fontSize={i ? 10 : 12} fontWeight="700" fill="#1c2733" textAnchor={i === 2 ? "end" : "start"}>{a}</text>
          <text x={x + (i === 2 ? 10 : 12)} y={y + (i === 2 ? 29 : 13)} fontSize="7.5" fill="#7a8794" textAnchor={i === 2 ? "end" : "start"}>{b}</text>
        </g>
      ))}
    </svg>
  );
}

/* 첫 화면 영상 「돌 하나의 여정」 3구간 — 구간마다 문구가 바뀌고, 번호 탭을 누르면 그 구간으로 이동 */
const SEG = [0, 9.7, 19.1];
const SEG_END = 28.75;
const HERO = [
  { en: "Ganghwa Mine No.1", t: ["A stone the hills", "of Ganghwa have held", "for ages: feldspar"], d: "Ganghwa, Incheon — the feldspar mine closest to the Seoul metropolitan area." },
  { en: "Feldspar · Glass · Ceramics", t: ["That stone", "becomes glass", "and ceramics"], d: "Feldspar is a raw material for glass and ceramics. The business starts with raw material production." },
  { en: "Infrastructure Materials", t: ["and the stone", "of seawalls that", "hold back the sea"], d: "A planned infrastructure-materials business linked to tidal power and Songdo reclamation demand." },
];
const GREETING = [
  "For ages, the hills of Ganghwa have held feldspar where they stand. We hope this resource will become glass and ceramics, and the stone of seawalls that hold back the sea — a foundation that supports everyday life.",
  "In resource development, haste costs the most. That is why we intend to choose tunnel mining, which keeps the face of the mountain intact and works quietly underground. From the very beginning, we will also work out how to share the benefits with local residents.",
  "We are at the preparation stage. Many of the figures and plans on this site are assumptions that still need verification. We will tell you plainly what has been confirmed and what remains to be done.",
];
const MINERALS = [
  { k: "Feldspar", en: "FELDSPAR", img: "feldspar", pos: "50% 50%", cap: "Feldspar sample", t: "Stable core business", d: "Production of grade A/B/C feldspar and waste feldspar; supply of ceramic and glass raw materials.", n: <>Projected annual revenue KRW 7.32 bn, 33.3% net margin<Asm /></>, tag: "Track record not yet verified" },
  { k: "Aggregate", en: "AGGREGATE", img: "aggregate", pos: "50% 50%", cap: "Aggregate by size", t: "Infrastructure materials", d: "Aggregate for construction, reclamation and infrastructure (targeting KS standards). Supply to seawall and Songdo projects is under review.", n: <>Projected aggregate revenue KRW 15 bn<Asm /></>, tag: "Supply contracts not yet confirmed" },
  { k: "Exciton", en: "ADVANCED MATERIAL", img: "feldspar", pos: "30% 40%", cap: "Reference image", t: "Advanced-material concept", d: "The source documents claim an \"exciton neutron\" value above 200. Carbon capture, bio and medical uses are unverified business assumptions.", n: <>Composition and performance test reports required<Asm t="Needs verification" /></>, tag: "Terms, units and measurement basis unverified" },
];
const PHASES = [
  { k: "Phase 1", en: "Raw Material", t: "Raw material production", l: ["Grade A/B/C feldspar and waste feldspar", "Ceramic and glass raw materials (stable cash cow)"] },
  { k: "Phase 2", en: "Infrastructure Materials", t: "Infrastructure materials", l: ["Aggregate for construction, reclamation and infrastructure (KS standards)", "Direct supply to seawall and Songdo projects"] },
  { k: "Phase 3", en: "Advanced Materials", t: "Advanced materials", l: ["High-value exciton powder processing", "Carbon capture, energy efficiency, medical/bio uses (needs verification)"] },
];
const ESG = [
  { k: "E", n: "Environment", l: ["Low-carbon, eco-friendly mining methods", "Key materials for tidal and renewable infrastructure", "Minimal logistics carbon footprint"] },
  { k: "S", n: "Social", l: ["Quality local jobs", "Target: industrial safety and zero-accident sites", "Shared benefits and better local infrastructure"] },
  { k: "G", n: "Governance", l: ["Transparent use of funds", "Risk control through audits", "Value for shareholders and investors"] },
];

/* 01 개요 — 현장 사진을 측량·탐사 화면처럼 보여 주는 장면 (사진은 실제 현장 사진, 효과만 덧입힘) */
function SiteScope() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-40px" });
  const corner = (c: string) => <motion.span className={`absolute h-5 w-5 ${c}`} style={{ borderColor: "var(--gw-copper2)" }} initial={{ scale: 0 }} animate={{ scale: seen ? 1 : 0 }} transition={{ duration: 0.5, delay: 0.9, ease: EASE }} />;
  return (
    <div ref={ref} className="relative -mx-6 h-[400px] overflow-hidden" style={{ background: "var(--gw-deep)" }}>
      <motion.div className="absolute inset-0" initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: seen ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)" }} transition={{ duration: 1.2, ease: EASE }}>
        <motion.img src={IMG("site")} alt="Site view, Ganghwa" className="h-full w-full object-cover" style={{ objectPosition: "100% 60%", filter: "grayscale(.45) contrast(1.18) brightness(.78)" }} initial={{ scale: 1.25 }} animate={{ scale: seen ? 1.06 : 1.25 }} transition={{ duration: 6, ease: "easeOut" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(12,35,64,.72) 0%, rgba(18,96,184,.18) 38%, rgba(12,35,64,.35) 62%, #0c2340 100%)" }} />
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(143,196,245,.13) 1px, transparent 1px), linear-gradient(90deg, rgba(143,196,245,.13) 1px, transparent 1px)", backgroundSize: "39px 39px" }} />
        <motion.div className="absolute inset-x-0 h-[70px]" style={{ background: "linear-gradient(180deg, transparent, rgba(143,196,245,.28) 92%, rgba(143,196,245,.9))", top: -70 }} animate={seen ? { y: [0, 470] } : {}} transition={{ duration: 3.6, ease: "linear", repeat: Infinity, repeatDelay: 1.4, delay: 1.2 }} />
      </motion.div>
      <div className="absolute inset-4">{corner("left-0 top-0 border-l-2 border-t-2")}{corner("right-0 top-0 border-r-2 border-t-2")}{corner("bottom-0 left-0 border-b-2 border-l-2")}{corner("bottom-0 right-0 border-b-2 border-r-2")}</div>
      <div className="absolute left-[80%] top-[57%]">
        <motion.span className="absolute -left-[22px] -top-[22px] h-11 w-11 rounded-full border" style={{ borderColor: "var(--gw-copper2)" }} animate={seen ? { scale: [0.5, 1.5, 0.5] } : { scale: 0 }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }} />
        <motion.span className="absolute -left-[5px] -top-[5px] h-2.5 w-2.5 rounded-full" style={{ background: "var(--gw-copper2)" }} initial={{ scale: 0 }} animate={{ scale: seen ? 1 : 0 }} transition={{ duration: 0.4, delay: 1.1 }} />
        <motion.div className="absolute right-4 top-[-38px] whitespace-nowrap border-r-2 pr-2 text-right text-white" style={{ borderColor: "var(--gw-copper2)" }} initial={{ x: 14 }} animate={{ x: seen ? 0 : 14 }} transition={{ duration: 0.6, delay: 1.3, ease: EASE }}>
          <div className="gw-en text-[9px] font-bold" style={{ color: "var(--gw-copper2)" }}>Hwado-myeon</div>
          <div className="text-[12px] font-bold">Mine area</div>
        </motion.div>
      </div>
      <div className="absolute left-8 top-8 text-white">
        <div className="gw-en text-[10px] font-bold" style={{ color: "var(--gw-copper2)" }}>Site · Hwado-myeon, Ganghwa</div>
        <div className="mt-1.5 overflow-hidden text-[22px] font-black leading-tight tracking-tight"><motion.div initial={{ y: "110%" }} animate={{ y: seen ? "0%" : "110%" }} transition={{ duration: 0.9, delay: 0.6, ease: EASE }}>Ganghwa Island,</motion.div></div>
        <div className="overflow-hidden text-[22px] font-black leading-tight tracking-tight" style={{ color: "var(--gw-copper2)" }}><motion.div initial={{ y: "110%" }} animate={{ y: seen ? "0%" : "110%" }} transition={{ duration: 0.9, delay: 0.75, ease: EASE }}>where the stone sleeps</motion.div></div>
      </div>
      <div className="absolute inset-x-8 bottom-8 grid grid-cols-3 gap-px" style={{ background: "rgba(143,196,245,.3)" }}>
        {[["Mining rights", "2", "No. 79560 · 79562"], ["Reserves", "178M t", "Per source docs"], ["Airport", "15km", "Radius"]].map(([k, v, d], i) => (
          <motion.div key={k} className="px-2.5 py-2 text-white" style={{ background: "rgba(8,26,48,.82)" }} initial={{ y: 24 }} animate={{ y: seen ? 0 : 24 }} transition={{ duration: 0.6, delay: 1.2 + i * 0.12, ease: EASE }}>
            <div className="text-[10px] font-bold" style={{ color: "var(--gw-copper2)" }}>{k}</div>
            <div className="text-[17px] font-black leading-tight">{v}</div>
            <div className="text-[9.5px] text-white/70">{d}</div>
          </motion.div>
        ))}
      </div>
      <span className="absolute right-8 top-8 bg-white/85 px-1.5 py-0.5 text-[10px]" style={{ color: "var(--gw-ink)" }}>Site photo</span>
    </div>
  );
}

/* 맺음 장면 — 처음 첫 화면이던 정지 이미지 3장과 번호 탭 구성을 그대로 살려 문안만 새로 쓴 섹션 */
const CLOSE = [
  { img: "hero", pos: "50% 55%", alt: "Tidal seawall reference image (AI)", cap: "Seawall reference · AI", en: "Why Ganghwa · Proximity", t: ["The feldspar mine", "closest to Seoul:", "Ganghwa Mine No.1"], d: "We aim to supply the stone that West Coast infrastructure needs — such as Incheon Bay tidal power and Songdo reclamation — from close by." },
  { img: "site", pos: "50% 60%", alt: "Site view, Hwado-myeon, Ganghwa", cap: "Site view, Ganghwa", en: "Why Ganghwa · Origin", t: ["Mining rights since 2013,", "a new start", "on Ganghwa"], d: "Hwado-myeon, Ganghwa — near Incheon Airport and Songdo. The plan is to grow step by step from feldspar to aggregate and infrastructure materials." },
  { img: "tunnel", pos: "50% 50%", alt: "Tunnel mining portal reference image (AI)", cap: "Tunnel mining reference · AI", en: "Why Ganghwa · Method", t: ["Leave the mountain,", "mine the value", "from within"], d: "Instead of open-pit mining, we aim to use adit and tunnel mining to reduce damage to the landscape and forest." },
];
function Closing() {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, { amount: 0.35 });
  const [i, setI] = useState(0);
  useEffect(() => { if (!seen) return; const t = setTimeout(() => setI((x) => (x + 1) % CLOSE.length), 6500); return () => clearTimeout(t); }, [seen, i]);
  const c = CLOSE[i];
  return (
    <section ref={ref} className="relative h-[640px] overflow-hidden" style={{ background: "var(--gw-deep)" }}>
      <AnimatePresence initial={false}>
        <motion.div key={i} className="absolute inset-0" initial={{ clipPath: "inset(0 0 0 100%)" }} animate={{ clipPath: "inset(0 0 0 0%)" }} exit={{ clipPath: "inset(0 0 0 0%)", zIndex: -1 }} transition={{ duration: 0.9, ease: EASE }}>
          <motion.img src={IMG(c.img)} alt={c.alt} className="h-full w-full object-cover" style={{ objectPosition: c.pos }} initial={{ scale: 1.14 }} animate={{ scale: seen ? 1 : 1.14 }} transition={{ duration: 7, ease: "easeOut" }} />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(12,35,64,.55) 0%, rgba(12,35,64,.08) 28%, rgba(12,35,64,.78) 64%, #0c2340 100%)" }} />
      <div className="absolute left-6 top-6 text-white">
        <div className="gw-en text-[10px] font-bold" style={{ color: "var(--gw-copper2)" }}>Why Ganghwa</div>
        <div className="mt-1 text-[14px] font-bold">Why Ganghwa Mine No.1</div>
      </div>
      <span className="absolute right-3 top-3 bg-white/85 px-1.5 py-0.5 text-[10px]" style={{ color: "var(--gw-ink)" }}>{c.cap}</span>
      <div className="absolute inset-x-0 bottom-[58px] px-6 pb-6 text-white">
        <div className="gw-en text-[11px] font-semibold" style={{ color: "var(--gw-copper2)" }}>{c.en}</div>
        <h2 key={i} className="mt-3 text-[26px] font-bold leading-[1.25] tracking-tight">
          {c.t.map((x, k) => <span key={x} className="block overflow-hidden"><motion.span className="block" initial={{ y: "108%" }} animate={{ y: seen ? "0%" : "108%" }} transition={{ duration: 0.9, delay: 0.15 + k * 0.13, ease: EASE }} style={{ color: k === c.t.length - 1 ? "var(--gw-copper2)" : undefined }}>{x}</motion.span></span>)}
        </h2>
        <motion.p key={`p${i}`} className="mt-3 text-[14px] leading-[1.75] text-white/80" initial={{ y: 20 }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.5, ease: EASE }}>{c.d}</motion.p>
      </div>
      <div className="absolute inset-x-0 bottom-0 grid grid-cols-3">
        {CLOSE.map((x, k) => (
          <button key={x.img} onClick={() => setI(k)} className="relative h-[58px] text-[13px] font-bold" style={{ background: i === k ? "#fff" : "rgba(8,26,48,.86)", color: i === k ? "var(--gw-copper)" : "#fff" }} aria-label={`Why Ganghwa scene ${k + 1}`}>
            0{k + 1}
            {i === k && <motion.span key={`b${i}${seen}`} className="absolute inset-x-0 top-0 h-[3px] origin-left" style={{ background: "var(--gw-copper)" }} initial={{ scaleX: 0 }} animate={{ scaleX: seen ? 1 : 0 }} transition={{ duration: 6.5, ease: "linear" }} />}
          </button>
        ))}
      </div>
    </section>
  );
}

export default function GanghwaSiteEn() {
  const [active, setActive] = useState("about");
  const [ph, setPh] = useState(0);
  const [esg, setEsg] = useState(0);
  const [top, setTop] = useState(false);
  const [hs, setHs] = useState(0);
  const [hp, setHp] = useState(0);
  const heroV = useRef<HTMLVideoElement>(null);
  const onHeroTime = () => {
    const v = heroV.current; if (!v) return;
    const s = v.currentTime; const i = s < SEG[1] ? 0 : s < SEG[2] ? 1 : 2;
    const end = i < 2 ? SEG[i + 1] : SEG_END;
    setHs((h) => (h === i ? h : i)); setHp(Math.min(1, Math.max(0, (s - SEG[i]) / (end - SEG[i]))));
  };
  const seekHero = (i: number) => { const v = heroV.current; setHs(i); setHp(0); if (v) { v.currentTime = SEG[i] + 0.05; v.play().catch(() => {}); } };
  const go = (id: string) => { const e = document.getElementById(id); if (e) window.scrollTo({ top: e.getBoundingClientRect().top + window.scrollY - 92, behavior: "smooth" }); };
  useEffect(() => {
    const on = () => {
      setTop(window.scrollY > 600);
      let cur = NAV[0][0];
      for (const [id] of NAV) { const e = document.getElementById(id); if (e && e.getBoundingClientRect().top < 160) cur = id; }
      setActive(cur);
    };
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <div className="gw" style={{ overflowX: "clip" }}>
      <div className="relative mx-auto w-full max-w-[480px]">
        <div className="px-4 py-1.5 text-center text-[11px]" style={{ background: "var(--gw-deep)", color: "#aebac6" }}>This site presents a business plan (draft), not actual operations · Figures and timing are assumptions · <a href="/ganghwa" style={{ color: "#e3cf9f", textDecoration: "underline" }}>한국어</a></div>

        {/* 상단 바 */}
        <header className="sticky top-0 z-40 border-b" style={{ background: "rgba(255,255,255,.96)", borderColor: "var(--gw-line)", backdropFilter: "blur(10px)" }}>
          <div className="flex h-[52px] items-center justify-between px-4">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-left leading-none">
              <span className="gw-en block text-[9px] font-bold" style={{ color: "var(--gw-copper)" }}>Ganghwa Mine No.1</span>
              <span className="mt-1 block text-[16px] font-black tracking-tight">Ganghwa Mine</span>
            </button>
            <button onClick={() => go("contact")} className="px-3.5 py-1.5 text-[12.5px] font-bold text-white" style={{ background: "var(--gw-copper)" }}>Contact</button>
          </div>
          <nav className="gw-noscroll flex gap-4 overflow-x-auto px-4 text-[12px]">
            {NAV.map(([id, l]) => (
              <button key={id} onClick={() => go(id)} className="relative shrink-0 pb-2.5 pt-0.5 font-bold" style={{ color: active === id ? "var(--gw-ink)" : "#9aa3ad" }}>
                {l}{active === id && <motion.span layoutId="gw-nav" className="absolute inset-x-0 bottom-0 h-[2px]" style={{ background: "var(--gw-copper)" }} transition={{ duration: 0.35, ease: EASE }} />}
              </button>
            ))}
          </nav>
        </header>

        {/* 첫 화면 — 영상 3구간 + 번호 탭 (삼표식) */}
        <section className="relative h-[80dvh] min-h-[580px] overflow-hidden" style={{ background: "var(--gw-deep)" }}>
          <video ref={heroV} src="/ganghwa/hero2.mp4" poster="/ganghwa/hero-poster.webp" autoPlay muted loop playsInline preload="auto" onTimeUpdate={onHeroTime} aria-label="Feldspar becoming glass, ceramics and seawall stone (AI video example)" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: "50% 40%" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(12,35,64,.45) 0%, rgba(12,35,64,.05) 28%, rgba(12,35,64,.72) 64%, #0c2340 100%)" }} />
          <span className="absolute right-3 top-3 bg-white/85 px-1.5 py-0.5 text-[10px]" style={{ color: "var(--gw-ink)" }}>AI video · example</span>
          <div className="absolute inset-x-0 bottom-[58px] px-6 pb-6 text-white">
            <div key={`e${hs}`} className="gw-en overflow-hidden text-[11px] font-semibold" style={{ color: "var(--gw-copper2)" }}><motion.span className="block" initial={{ y: "110%" }} animate={{ y: "0%" }} transition={{ duration: 0.7, ease: EASE }}>{HERO[hs].en}</motion.span></div>
            <h1 key={hs} className="mt-3 text-[28px] font-bold leading-[1.25] tracking-tight">
              {HERO[hs].t.map((x, i) => <span key={x} className="block overflow-hidden"><motion.span className="block" initial={{ y: "108%" }} animate={{ y: "0%" }} transition={{ duration: 0.9, delay: 0.1 + i * 0.13, ease: EASE }} style={{ color: i === HERO[hs].t.length - 1 ? "var(--gw-copper2)" : undefined }}>{x}</motion.span></span>)}
            </h1>
            <motion.p key={`p${hs}`} className="mt-3 text-[14px] leading-[1.75] text-white/80" initial={{ y: 20 }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.45, ease: EASE }}>{HERO[hs].d}</motion.p>
          </div>
          <div className="absolute inset-x-0 bottom-0 grid grid-cols-3">
            {HERO.map((x, i) => (
              <button key={x.en} onClick={() => seekHero(i)} className="relative h-[58px] text-[13px] font-bold" style={{ background: hs === i ? "#fff" : "rgba(8,26,48,.86)", color: hs === i ? "var(--gw-copper)" : "#fff" }} aria-label={`Scene ${i + 1}`}>
                0{i + 1}
                {hs === i && <span className="absolute inset-x-0 top-0 h-[3px] origin-left" style={{ background: "var(--gw-copper)", transform: `scaleX(${hp})` }} />}
              </button>
            ))}
          </div>
        </section>

        {/* 숫자 타일 (시벨코식) */}
        <section className="grid grid-cols-2">
          {[["Total reserves (source)", 178, 0, "M t", "#cfe2f6", "var(--gw-ink)"], ["Mining rights since", 2013, 0, "", "#0c2340", "#fff"], ["From Incheon Airport", 15, 0, "km", "#1260b8", "#fff"], ["Aggregate demand (assumed)", 13.7, 1, "M m³", "#e9eff6", "var(--gw-ink)"]].map(([l, v, d, u, bg, fg], i) => (
            <div key={l as string} className="flex h-[132px] flex-col justify-center px-6" style={{ background: bg as string, color: fg as string }}>
              <div className="text-[34px] font-black leading-none">{i === 1 ? "2013" : <Roll to={v as number} d={d as number} />}<span className="ml-1 text-[14px] font-bold">{u}</span></div>
              <div className="mt-2 text-[12px] font-bold" style={{ opacity: 1 }}>{l}</div>
            </div>
          ))}
        </section>

        {/* 자료 바로보기 */}
        <section className="grid grid-cols-2 gap-px" style={{ background: "#0c2340" }}>
          <a href="/gwprofile" className="flex items-center justify-between bg-white px-4 py-4 text-[13.5px] font-bold" style={{ color: "var(--gw-ink)" }}><span className="flex items-center gap-2"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M7 3h7l5 5v13H7z M14 3v5h5 M10 13h6 M10 17h6" /></svg>Company Profile</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14 M13 6l6 6-6 6" /></svg></a>
          <a href="/gwplan" className="flex items-center justify-between px-4 py-4 text-[13.5px] font-bold" style={{ background: "#10263f", color: "#e3cf9f" }}><span className="flex items-center gap-2"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 19V9 M10 19V5 M16 19v-7 M22 19H2" /></svg>IR Deck</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14 M13 6l6 6-6 6" /></svg></a>
        </section>

        {/* 인사말 */}
        <section className="pt-12 pb-14" style={{ background: "var(--gw-deep)" }}>
          <div className="relative mx-6"><Photo src={IMG("chairman-office")} alt="Chairman Oh Se-heum" className="h-[440px]" pos="50% 26%" /><div className="pointer-events-none absolute inset-x-0 bottom-0 h-44" style={{ background: "linear-gradient(180deg,transparent,rgba(12,35,64,.92))" }} /><div className="absolute bottom-5 left-5 right-5 text-white"><div className="gw-en text-[11px] font-bold" style={{ color: "var(--gw-copper2)" }}>Greeting</div><h2 className="mt-2 text-[25px] font-bold leading-[1.4] tracking-tight"><Lift>What the land holds,</Lift><Lift delay={0.12}><span style={{ color: "var(--gw-copper2)" }}>a foundation for the next generation</span></Lift></h2></div><span className="absolute right-2 top-2 bg-white/85 px-1.5 py-0.5 text-[10px]" style={{ color: "var(--gw-ink)" }}>AI-staged · based on his photo</span></div>
          <div className="px-6 pt-7 text-white">
            <div className="grid gap-4">
              {GREETING.map((x, i) => <Rise key={i} delay={i * 0.06}><p className="text-[14.5px] leading-[1.95]" style={{ color: "#c9d6e4" }}>{x}</p></Rise>)}
            </div>
            <Rise>
              <p className="mt-7 text-[17px] font-bold leading-[1.7]">We will move forward step by step, the right way.<br />We ask for your interest and partnership.</p>
              <div className="mt-6 flex items-end justify-between border-t pt-4" style={{ borderColor: "rgba(255,255,255,.18)" }}>
                <div><div className="text-[11.5px]" style={{ color: "#9fb3c8" }}>Chairman, H&amp;L Partners Co., Ltd.</div><div className="mt-0.5 text-[22px] font-bold tracking-[0.06em]">Oh Se-heum<span className="ml-1 text-[12px] tracking-normal" style={{ color: "#9fb3c8" }}>(Jong-guk)</span></div></div>
                <span className="gw-en text-[10px] font-bold text-white/50">H&amp;L Partners</span>
              </div>
            </Rise>
          </div>
        </section>

        {/* 01 광산 소개 */}
        <section id="about" className="px-6 pt-16 pb-14">
          <Head no="01" wm="MINE" en="The Mine" sub="Ganghwa Mine No.1 is a feldspar mine in Hwado-myeon, Ganghwa-gun, Incheon. Mining rights were registered in 2013, and development by eco-friendly tunnel mining is being planned.">About the Mine</Head>
          <SiteScope />
          <dl className="mt-5 border-t" style={{ borderColor: "var(--gw-line)" }}>
            {[["Asset", "Ganghwa Mine No.1"], ["Legal rights", "Mining right reg. No. 79560 and 79562 (registered April 2013)"], ["Location", "Onsu-ri area, Hwado-myeon, Ganghwa-gun, Incheon"], ["Developer", "Oh Jong-guk"], ["Mineral", "Feldspar (with eolite and exciton — per source docs)"], ["Total reserves", "178,185,150 t (65,994,500 m³)"]].map(([k, v], i) => (
              <motion.div key={k} className="grid grid-cols-[104px_1fr] gap-3 border-b py-3 text-[13.5px] leading-[1.6]" style={{ borderColor: "var(--gw-line)" }} initial={{ x: -18 }} whileInView={{ x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}>
                <dt className="font-bold" style={{ color: "var(--gw-copper)" }}>{k}</dt><dd>{v}</dd>
              </motion.div>
            ))}
          </dl>
          <p className="mt-3 text-[11px] leading-[1.6]" style={{ color: "var(--gw-sub)" }}>Rights and reserves are as stated in the source documents. The current holder, validity and the basis of the reserve estimate need to be confirmed with the official register and reports.</p>
        </section>

        {/* 02 광물 */}
        <section id="mineral" className="px-6 pt-14 pb-14" style={{ background: "var(--gw-paper)" }}>
          <Head no="02" wm="MINERALS" en="Minerals" sub="Three businesses planned from a single mine.">Feldspar, aggregate,<br />and advanced materials</Head>
          <div className="relative -mx-6 mb-6 h-[560px] overflow-hidden bg-black">
            <video src="/ganghwa/field.mp4" poster="/ganghwa/field-poster.webp" autoPlay muted loop playsInline preload="metadata" aria-label="Examining a feldspar sample with a loupe at the mine site (AI video example)" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 h-48" style={{ background: "linear-gradient(180deg,transparent,rgba(8,26,48,.6) 40%,rgba(8,26,48,.92))" }} />
            <span className="absolute left-3 top-3 bg-white/85 px-1.5 py-0.5 text-[10px]" style={{ color: "var(--gw-ink)" }}>AI video · example</span>
            <div className="absolute inset-x-0 bottom-5 px-6 text-white">
              <div className="gw-en text-[10px] font-bold" style={{ color: "var(--gw-copper2)" }}>On Site</div>
              <p className="mt-1.5 text-[17px] font-bold leading-[1.5]">We look at every stone ourselves.<br />Value is confirmed on site.</p>
            </div>
          </div>
          <div className="gw-snap gw-noscroll -mx-6 flex gap-3 overflow-x-auto px-6 pb-1">
            {MINERALS.map((x, i) => (
              <div key={x.k} className="relative h-[400px] w-[78%] shrink-0 overflow-hidden text-white" style={{ background: "var(--gw-deep)" }}>
                <img src={IMG(x.img)} alt={x.cap} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: x.pos, filter: i === 2 ? "saturate(.25) contrast(1.05)" : "none" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(12,35,64,.25) 0%, rgba(12,35,64,.55) 40%, rgba(8,26,48,.94) 78%)" }} />
                <span className="absolute right-2 top-2 bg-white/85 px-1.5 py-0.5 text-[10px]" style={{ color: "var(--gw-ink)" }}>{x.cap}</span>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="gw-en text-[10px] font-bold" style={{ color: "var(--gw-copper2)" }}>0{i + 1} · {x.en}</div>
                  <div className="mt-1 text-[26px] font-black leading-tight">{x.k}</div>
                  <div className="mt-0.5 text-[14px] font-bold text-white/85">{x.t}</div>
                  <p className="mt-2.5 text-[12.5px] leading-[1.65] text-white/75">{x.d}</p>
                  <p className="mt-3 border-t pt-2.5 text-[12.5px] font-bold" style={{ borderColor: "rgba(255,255,255,.25)" }}>{x.n}</p>
                  <p className="mt-0.5 text-[10.5px] text-white/60">{x.tag}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px]" style={{ color: "var(--gw-sub)" }}>Swipe sideways →</p>
          <Rise className="mt-6">
            <div className="text-[13px] font-bold" style={{ color: "var(--gw-copper)" }}>Composition (per source docs)</div>
            <div className="mt-3 grid gap-3">
              <Bar l="SiO₂ — ceramics, glass" v={71.95} max={72} txt="71.95%" c="var(--gw-ink)" />
              <Bar l="Al₂O₃ — refractories, ceramics" v={14.99} max={72} txt="14.99%" c="var(--gw-sea)" />
              <Bar l="Na₂O — glass, ceramic flux" v={6.1} max={72} txt="6.10%" />
              <Bar l="K₂O — glass, porcelain" v={3.25} max={72} txt="3.25%" c="var(--gw-copper2)" />
            </div>
            <p className="mt-3 text-[11px] leading-[1.6]" style={{ color: "var(--gw-sub)" }}>Composition needs to be confirmed by an accredited laboratory report.</p>
          </Rise>
        </section>

        {/* 03 입지 */}
        <section id="location" className="px-6 pt-16 pb-14">
          <Head no="03" wm="LOCATION" en="Location & Logistics" sub="Incheon Airport, Songdo Zone 11 and the planned Incheon Bay tidal power site are all nearby. Direct supply to customers by sea is under review.">A large-scale mine<br />closest to Seoul</Head>
          <div className="relative -mx-6 mb-5 h-[540px] overflow-hidden bg-black">
            <video src="/ganghwa/voyage.mp4" poster="/ganghwa/barge-poster.webp" autoPlay muted loop playsInline preload="metadata" aria-label="A barge loaded with feldspar leaves at dawn and unloads at a Songdo pier (AI video example)" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 h-52" style={{ background: "linear-gradient(180deg,transparent,rgba(8,26,48,.6) 40%,rgba(8,26,48,.92))" }} />
            <span className="absolute left-3 top-3 bg-white/85 px-1.5 py-0.5 text-[10px]" style={{ color: "var(--gw-ink)" }}>AI video · example</span>
            <div className="absolute inset-x-0 bottom-5 px-6 text-white">
              <div className="gw-en text-[10px] font-bold" style={{ color: "var(--gw-copper2)" }}>By Sea · Ganghwa → Songdo</div>
              <p className="mt-1.5 text-[17px] font-bold leading-[1.5]">Along the dawn sea route,<br />Ganghwa stone heads to its customers.</p>
            </div>
          </div>
          <div className="border bg-white p-2" style={{ borderColor: "var(--gw-line)" }}><MapArt /><p className="px-2 pb-1 text-[10px]" style={{ color: "var(--gw-sub)" }}>Schematic · not to scale</p></div>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <Rise><div className="h-full p-4 text-white" style={{ background: "var(--gw-ink)" }}><div className="gw-en text-[9.5px] font-bold" style={{ color: "var(--gw-copper2)" }}>Main · By sea</div><div className="mt-1.5 text-[15px] font-bold leading-[1.45]">2,000-ton barges</div><p className="mt-1.5 text-[12px] leading-[1.6] text-white/70">Direct sea supply: Ganghwa → Songdo / tidal site</p></div></Rise>
            <Rise delay={0.1}><div className="h-full border bg-white p-4" style={{ borderColor: "var(--gw-line)" }}><div className="gw-en text-[9.5px] font-bold" style={{ color: "var(--gw-copper)" }}>Sub · By land</div><div className="mt-1.5 text-[15px] font-bold leading-[1.45]">Ganghwa Bridge &amp; Incheon-daero</div><p className="mt-1.5 text-[12px] leading-[1.6]" style={{ color: "var(--gw-sub)" }}>Used as a secondary route</p></div></Rise>
          </div>
          <p className="mt-3 text-[11px] leading-[1.6]" style={{ color: "var(--gw-sub)" }}>Transport plan only. Barge and equipment contracts and actual logistics costs are not yet confirmed.</p>
        </section>

        {/* 04 수요 */}
        <section id="demand" className="px-6 pt-14 pb-14" style={{ background: "var(--gw-deep)" }}>
          <Head no="04" wm="DEMAND" en="Demand" dark sub="Estimated aggregate demand for the Incheon Bay tidal seawall, Songdo reclamation and university campus expansion. These are not confirmed orders.">Aggregate demand from<br />seawalls and reclamation</Head>
          <Rise>
            <div className="text-white">
              <div className="text-[12px] font-bold text-white/60">Aggregate demand, 2025–2030<span className="ml-1.5 border px-1 py-px text-[9.5px]" style={{ borderColor: "var(--gw-copper2)", color: "var(--gw-copper2)" }}>Assumption</span></div>
              <div className="mt-1.5 text-[46px] font-bold leading-none" style={{ color: "var(--gw-copper2)" }}><span className="text-[22px] text-white">Over </span><Roll to={13.7} d={1} /><span className="ml-1 text-[17px] text-white">million m³</span></div>
            </div>
          </Rise>
          <div className="mt-6 grid gap-4 text-white">
            {[["Songdo Zone 11 reclamation (to 2030)", 650, "approx. 6.5M m³", "#8fc4f5"], ["Incheon Bay tidal power seawall", 500, "approx. 5.0M m³", "#6fa9c4"], ["Incheon Nat'l, Yonsei, Inha campus expansion", 220, "approx. 2.2M m³", "#8b98a6"]].map(([l, v, t, c]) => (
              <Rise key={l as string}>
                <div className="flex items-baseline justify-between text-[13px]"><span className="font-bold">{l}</span><span className="font-bold" style={{ color: "var(--gw-copper2)" }}>{t}</span></div>
                <div className="mt-1.5 h-[10px] overflow-hidden" style={{ background: "rgba(255,255,255,.1)" }}><motion.div className="h-full origin-left" style={{ background: c as string, width: `${((v as number) / 650) * 100}%` }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: EASE }} /></div>
              </Rise>
            ))}
          </div>
          <Rise className="mt-7">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-4" style={{ background: "rgba(255,255,255,.07)" }}><div className="text-[11px] text-white/60">Total seawall length (source)</div><div className="mt-1 text-[28px] font-bold leading-none text-white"><Roll to={18.3} d={1} /><span className="ml-0.5 text-[13px]" style={{ color: "var(--gw-copper2)" }}>km</span></div><div className="mt-1.5 text-[10.5px] leading-[1.5] text-white/60">East 5.8 + West 7.3 + South 5.2 km</div></div>
              <div className="p-4" style={{ background: "rgba(255,255,255,.07)" }}><div className="text-[11px] text-white/60">Supply price (assumed)</div><div className="mt-1 text-[15px] font-bold leading-[1.5] text-white">KRW 35,000/m³<span className="block text-[11.5px] font-normal text-white/60">vs. imported KRW 40,000/m³</span></div></div>
            </div>
          </Rise>
          <p className="mt-4 text-[11px] leading-[1.6]" style={{ color: "#8fa0b0" }}>Incheon Bay tidal power is at the planning and review stage; whether and when it proceeds depends on government policy. Demand, prices and import restrictions need to be confirmed with current official data and contracts.</p>
        </section>

        {/* 05 사업 모델 */}
        <section id="business" className="px-6 pt-16 pb-14">
          <Head no="05" wm="BUSINESS" en="Business Model" sub="A step-by-step plan from raw materials to infrastructure and advanced materials.">Expanding the value chain</Head>
          <div className="flex gap-2">
            {PHASES.map((x, i) => (
              <button key={x.k} onClick={() => setPh(i)} className="relative flex-1 border py-2.5 text-[13px] font-bold" style={{ borderColor: ph === i ? "var(--gw-copper)" : "var(--gw-line)", color: ph === i ? "#fff" : "var(--gw-sub)", background: "#fff" }}>
                {ph === i && <motion.span layoutId="gw-ph" className="absolute inset-0" style={{ background: "var(--gw-copper)" }} transition={{ duration: 0.4, ease: EASE }} />}
                <span className="relative">{x.k}</span>
              </button>
            ))}
          </div>
          <div className="relative mt-3 overflow-hidden border bg-white" style={{ borderColor: "var(--gw-line)", minHeight: 190 }}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div key={ph} className="p-5" initial={{ y: 40, clipPath: "inset(100% 0 0 0)" }} animate={{ y: 0, clipPath: "inset(0% 0 0 0)" }} exit={{ y: -30, clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.5, ease: EASE }}>
                <div className="gw-en text-[10px] font-bold" style={{ color: "var(--gw-copper)" }}>{PHASES[ph].en}</div>
                <div className="mt-1 text-[22px] font-bold">{PHASES[ph].t}</div>
                <ul className="mt-3 grid gap-2 text-[13.5px] leading-[1.65]" style={{ color: "var(--gw-sub)" }}>{PHASES[ph].l.map((t) => <li key={t} className="flex gap-2"><span style={{ color: "var(--gw-copper)" }}>—</span><span>{t}</span></li>)}</ul>
              </motion.div>
            </AnimatePresence>
          </div>
          <Rise className="mt-6">
            <div className="border-l-2 py-1 pl-4" style={{ borderColor: "var(--gw-copper)" }}>
              <div className="gw-en text-[10px] font-bold" style={{ color: "var(--gw-copper)" }}>CAPEX-Light Strategy</div>
              <p className="mt-1.5 text-[14px] font-bold leading-[1.65]">Mining equipment, sorting facilities and transport are to be brought in through specialist contractors on a fee/rental basis to reduce upfront capital<Asm t="Plan" /></p>
            </div>
          </Rise>
        </section>

        {/* 06 친환경 채굴 */}
        <section id="eco" className="pt-14 pb-14" style={{ background: "var(--gw-paper)" }}>
          <div className="px-6"><Head no="06" wm="ECO" en="Eco Mining & ESG" sub="We aim to reduce damage to the landscape and forest by using adit and tunnel mining instead of open-pit mining.">Tunnel mining that<br />protects the surface</Head></div>
          <div className="relative h-[560px] overflow-hidden bg-black">
            <video src="/ganghwa/tunnel.mp4" poster="/ganghwa/tunnel-poster.webp" autoPlay muted loop playsInline preload="metadata" aria-label="Entering a portal under the forest into a lit tunnel (AI video example)" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 h-28" style={{ background: "linear-gradient(180deg,transparent,rgba(8,26,48,.75))" }} />
            <span className="absolute left-3 top-3 bg-white/85 px-1.5 py-0.5 text-[10px]" style={{ color: "var(--gw-ink)" }}>AI video · example</span>
            <p className="absolute inset-x-0 bottom-4 px-6 text-[15px] font-bold leading-[1.5] text-white">The forest stays. Mining happens inside the mountain.</p>
          </div>
          <div className="px-6">
            <div className="mt-5 grid gap-2.5">
              {[["Topsoil preserved", "Keep the surface and mine underground (not yet verified)"], ["Less noise and dust", "Planned enclosed systems (performance unverified)"], ["Natural drainage", "Drainage plan that follows the terrain"], ["Coastal rules", "Compliance with the 50 m coastal regulation needs review"]].map(([a, b], i) => (
                <motion.div key={a} className="flex gap-3 border bg-white p-3.5" style={{ borderColor: "var(--gw-line)" }} initial={{ x: i % 2 ? 30 : -30 }} whileInView={{ x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}>
                  <span className="gw-en w-6 shrink-0 text-[13px] font-bold" style={{ color: "var(--gw-copper)" }}>0{i + 1}</span>
                  <div><div className="text-[14.5px] font-bold">{a}</div><div className="mt-0.5 text-[12.5px] leading-[1.6]" style={{ color: "var(--gw-sub)" }}>{b}</div></div>
                </motion.div>
              ))}
            </div>
            <div className="mt-7 text-[13px] font-bold" style={{ color: "var(--gw-copper)" }}>ESG plan — tap to expand</div>
            <div className="mt-2.5 grid gap-2">
              {ESG.map((x, i) => (
                <div key={x.k} className="border bg-white" style={{ borderColor: esg === i ? "var(--gw-ink)" : "var(--gw-line)" }}>
                  <button onClick={() => setEsg(esg === i ? -1 : i)} className="flex w-full items-center gap-3 px-4 py-3 text-left">
                    <span className="text-[26px] font-black leading-none" style={{ color: "var(--gw-copper)" }}>{x.k}</span>
                    <span className="gw-en flex-1 text-[12px] font-bold">{x.n}</span>
                    <motion.span animate={{ rotate: esg === i ? 45 : 0 }} className="text-[20px] leading-none" style={{ color: "var(--gw-sub)" }}>+</motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {esg === i && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.4, ease: EASE }} className="overflow-hidden">
                        <ul className="grid gap-1.5 px-4 pb-4 text-[13px] leading-[1.6]" style={{ color: "var(--gw-sub)" }}>{x.l.map((t) => <li key={t}>· {t}</li>)}</ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-[1.6]" style={{ color: "var(--gw-sub)" }}>Environmental management and ESG are plans. They do not mean permits, environmental impact assessments or certifications have been obtained.</p>
          </div>
        </section>

        {/* 07 로드맵 */}
        <section id="roadmap" className="px-6 pt-16 pb-14">
          <Head no="07" wm="VISION" en="Vision & Roadmap" sub="A phased plan with no fixed timing or results. Technical validation, contracts and permits must come first.">Vision &amp; Roadmap</Head>
          <div className="relative pl-8">
            <motion.div className="absolute bottom-2 left-[7px] top-2 w-px origin-top" style={{ background: "var(--gw-copper)" }} initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease: EASE }} />
            {[["Horizon 1 · Short term", "Mining Operation", "Stable feldspar production and initial infrastructure (tunnel). Join the capital region's core aggregate supply chain."], ["Horizon 2 · Mid term", "Infrastructure Partner", "Become a key vendor for Incheon Bay tidal power and Songdo reclamation. Add value with post-mining tunnels (eco storage, shelters, research facilities)."], ["Horizon 3 · Long term", "Advanced Material Platform", "Exciton-based carbon capture and medical/bio materials. A hub of the national energy-infrastructure materials ecosystem."]].map(([k, e, d], i) => (
              <Rise key={k} delay={i * 0.1} className="relative mb-7">
                <motion.span className="absolute -left-8 top-1 h-[15px] w-[15px] rounded-full border-2" style={{ borderColor: "var(--gw-copper)", background: i === 2 ? "var(--gw-copper)" : "var(--gw-stone)" }} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }} />
                <div className="gw-en text-[11px] font-bold" style={{ color: "var(--gw-copper)" }}>{k}</div>
                <div className="mt-0.5 text-[18px] font-bold">{e}</div>
                <p className="mt-1 text-[13.5px] leading-[1.7]" style={{ color: "var(--gw-sub)" }}>{d}</p>
              </Rise>
            ))}
          </div>
          <Rise><p className="mt-2 border-l-2 py-1 pl-4 text-[16px] font-bold leading-[1.6]" style={{ borderColor: "var(--gw-copper)" }}>Reinventing the essence of resources<br />to build a sustainable infrastructure future.</p></Rise>
        </section>

        {/* 자료실 */}
        <section id="docs" className="px-6 pt-14 pb-14" style={{ background: "var(--gw-paper)" }}>
          <Head no="08" wm="DOCS" en="Documents" sub="Swipe through on your phone, or turn it sideways for a larger view. Documents are in Korean.">Company Profile &amp; IR</Head>
          <a href="/gwprofile" className="block overflow-hidden border bg-white" style={{ borderColor: "var(--gw-line)" }}>
            <img src="/ganghwa/profile-cover.webp" alt="Company profile cover" className="aspect-video w-full object-cover" />
            <div className="flex items-center justify-between px-4 py-3"><span><span className="gw-en block text-[10px] font-bold" style={{ color: "var(--gw-copper)" }}>Company Profile</span><span className="block text-[16px] font-bold">H&amp;L Partners Company Profile</span></span><span className="text-[12px] font-bold" style={{ color: "var(--gw-sub)" }}>15 pp · KR</span></div>
          </a>
          <div className="mt-2.5 grid grid-cols-2 gap-2.5">
            <a href="/gwprofile" className="flex items-center justify-center gap-1.5 py-3.5 text-[14px] font-bold text-white" style={{ background: "var(--gw-copper)" }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M7 3h7l5 5v13H7z M14 3v5h5 M10 13h6 M10 17h6" /></svg>View</a>
            <a href="/gwprofile/HnL_company_profile.pdf" download="HnL_Partners_Company_Profile_KR.pdf" className="flex items-center justify-center gap-1.5 border bg-white py-3.5 text-[14px] font-bold" style={{ borderColor: "var(--gw-line)", color: "var(--gw-ink)" }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 4v11 M7 10l5 5 5-5 M5 20h14" /></svg>Download PDF</a>
          </div>
          <a href="/gwplan" className="mt-6 flex items-center gap-4 p-4 text-white" style={{ background: "#10263f", boxShadow: "inset 0 0 0 1px rgba(201,169,110,.55)" }}>
            <img src="/ganghwa/plan-cover.webp" alt="" className="h-[72px] w-[128px] shrink-0 object-cover" />
            <span className="min-w-0 flex-1"><span className="gw-en block text-[10px] font-bold" style={{ color: "#e3cf9f" }}>Investment Memorandum</span><span className="mt-0.5 block text-[16px] font-bold">View IR Deck</span><span className="block text-[11.5px] text-white/60">Business plan (draft), 45 slides · Korean · figures are assumptions</span></span>
            <span style={{ color: "#e3cf9f" }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14 M13 6l6 6-6 6" /></svg></span>
          </a>
          <a href="/m3k8fz1" className="mt-2.5 flex items-center gap-4 p-4 text-white" style={{ background: "#0c1622", boxShadow: "inset 0 0 0 1px rgba(201,169,110,.35)" }}>
            <img src="/m3k8fz1/og.jpg" alt="" className="h-[72px] w-[128px] shrink-0 object-cover" />
            <span className="min-w-0 flex-1"><span className="gw-en block text-[10px] font-bold" style={{ color: "#e3cf9f" }}>Motion Presentation</span><span className="mt-0.5 block text-[16px] font-bold">IR Motion Presentation</span><span className="block text-[11.5px] text-white/60">Vertical, 45 pages · Korean · motion-graphic web version</span></span>
            <span style={{ color: "#e3cf9f" }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14 M13 6l6 6-6 6" /></svg></span>
          </a>
        </section>

        {/* 맺음 — 처음 첫 화면 3장 */}
        <Closing />

        {/* 08 문의 */}
        <section id="contact" className="px-6 pt-14 pb-14" style={{ background: "var(--gw-deep)" }}>
          <Head no="09" wm="CONTACT" en="Contact" dark sub="We welcome inquiries about partnerships and investment review.">Contact</Head>
          <dl className="grid gap-px text-[13.5px]" style={{ background: "rgba(255,255,255,.12)" }}>
            {[["Company", "H&L Partners Co., Ltd."], ["Chairman", "Oh Se-heum (Jong-guk)"], ["Contact", "Lee Bong-su"], ["Phone", "+82 10-7213-0060"], ["Email", "ybssby8@gmail.com"], ["Website", "www.handl.top"], ["Address", "3F, 56 Nonhyeon-ro 79-gil, Gangnam-gu, Seoul, Korea"], ["Mine site", "Hwado-myeon, Ganghwa-gun, Incheon, Korea"]].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[88px_1fr] gap-3 px-4 py-3 text-white" style={{ background: "var(--gw-deep)" }}><dt className="font-bold" style={{ color: "var(--gw-copper2)" }}>{k}</dt><dd className="leading-[1.6]">{v}</dd></div>
            ))}
          </dl>
          <a href="tel:01072130060" className="mt-5 block py-3.5 text-center text-[15px] font-bold" style={{ background: "#fff", color: "var(--gw-ink)" }}>Call</a>
          <a href="mailto:ybssby8@gmail.com?subject=Ganghwa%20Mine%20No.1%20Inquiry" className="mt-2.5 block py-3.5 text-center text-[15px] font-bold" style={{ background: "var(--gw-copper)", color: "#fff" }}>Email</a>
          <a href="/gwplan" className="mt-2.5 flex items-center justify-between border px-5 py-4 text-white" style={{ borderColor: "rgba(143,196,245,.5)" }}>
            <span><span className="gw-en block text-[10px] font-bold" style={{ color: "var(--gw-copper2)" }}>Investment Memorandum</span><span className="mt-0.5 block text-[15px] font-bold">View IR Deck</span><span className="block text-[11.5px] text-white/60">Business plan (draft), 45 slides · Korean</span></span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8fc4f5" strokeWidth="2" aria-hidden="true"><path d="M5 12h14 M13 6l6 6-6 6" /></svg>
          </a>
          <a href="/m3k8fz1" className="mt-2.5 flex items-center justify-between border px-5 py-4 text-white" style={{ borderColor: "rgba(143,196,245,.5)" }}>
            <span><span className="gw-en block text-[10px] font-bold" style={{ color: "var(--gw-copper2)" }}>Motion Presentation</span><span className="mt-0.5 block text-[15px] font-bold">View IR Motion Presentation</span><span className="block text-[11.5px] text-white/60">Vertical, 45 pages · Korean</span></span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8fc4f5" strokeWidth="2" aria-hidden="true"><path d="M5 12h14 M13 6l6 6-6 6" /></svg>
          </a>
        </section>

        <footer className="px-6 pt-8 pb-12" style={{ background: "#081a30", color: "#8fa0b0" }}>
          <div className="text-[18px] font-black text-white">Ganghwa Mine No.1</div>
          <p className="mt-3 text-[11.5px] leading-[1.75]">This temporary site presents a business plan (draft), not actual operations. Reserves, revenue, demand, prices and timing are assumptions from the planning documents, not figures confirmed by measurement, results or contracts. The videos and seawall images are AI-made examples; people in the videos are staged scenes modeled on project members. Tunnel images are references to explain the mining method. The chairman's portrait is an AI-staged office scene based on a photo he provided. This page is not an investment solicitation and does not guarantee principal or returns. The Korean version prevails.</p>
          <p className="gw-en mt-5 text-[10px]">© 2026 Ganghwa Mine No.1</p>
        </footer>

        <AnimatePresence>
          {top && (
            <motion.button key="t" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top" className="fixed bottom-5 right-4 z-40 flex h-11 w-11 items-center justify-center text-white shadow-lg" style={{ background: "var(--gw-ink)" }} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8fc4f5" strokeWidth="2.2" aria-hidden="true"><path d="M12 19V5 M6 11l6-6 6 6" /></svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
