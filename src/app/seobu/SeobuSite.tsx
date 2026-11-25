"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence, animate, useInView } from "framer-motion";
import { PROJECT, SCALE, COMPARE, FLOORS, UNITS, HISTORY, SURROUND } from "./data";

/* THE K 사이트와 같은 디자인 시스템(딥 틸 · 샌드 · 코랄)으로 재구성한 서부시장 임시 홈페이지
   원칙: 투명도는 움직이지 않는다 — 위치·크기·마스크·색만 움직인다 */
const IMG = (f: string) => `/seobu/img/${f}.webp`;
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
  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      <motion.div className="absolute inset-0 overflow-hidden" style={{ background: "#e9e6de" }} initial={{ clipPath: "inset(100% 0% 0% 0%)" }} animate={{ clipPath: seen ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" }} transition={{ duration: 1.1, ease: EASE }}>
        <motion.img src={src} alt={alt} className="h-full w-full object-cover" style={{ objectPosition: pos }} initial={{ scale: 1.14 }} animate={{ scale: seen ? 1 : 1.14 }} transition={{ duration: 1.6, ease: EASE }} />
        {cap && <span className="absolute bottom-2 left-2 bg-white/90 px-1.5 py-0.5 text-[10px]" style={{ color: "var(--tk-char)" }}>{cap}</span>}
      </motion.div>
    </div>
  );
}

function Roll({ to, decimals = 0 }: { to: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.3, ease: EASE, onUpdate: setV });
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
  tool: "M14 6l4 4 M4 20l6-6 M13 7l4-4 4 4-4 4z M10 14l-4 4",
  home: "M3 11l9-7 9 7 M5 10v10h14V10 M10 20v-6h4v6",
  shop: "M4 9l1.5-5h13L20 9 M4 9h16v11H4z M4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0 M10 20v-5h4v5",
  users: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M2.5 20a6.5 6.5 0 0 1 13 0 M16 4.5a3.5 3.5 0 0 1 0 6.5 M18 14a6 6 0 0 1 3.5 6",
  fit: "M6 8v8 M18 8v8 M3 10v4 M21 10v4 M6 12h12",
  pin: "M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  train: "M7 3h10a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V5a2 2 0 0 1 2-2z M5 10h14 M8 21l2-4 M16 21l-2-4 M9 14h.01 M15 14h.01",
  book: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z M4 19V5",
  tree: "M12 22v-6 M12 16l-5-5h3L6 7h3L12 2l3 5h3l-4 4h3z",
  chart: "M4 20V4 M4 20h16 M8 16v-4 M12 16V8 M16 16v-6",
  doc: "M6 3h9l4 4v14H6z M14 3v5h5 M9 13h7 M9 17h7",
  arrow: "M5 12h14 M13 6l6 6-6 6",
  down: "M6 9l6 6 6-6",
  up: "M12 19V5 M5 12l7-7 7 7",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2",
  mail: "M4 6h16v12H4z M4 7l8 6 8-6",
};

const NAV: [string, string, string][] = [["home", "HOME", "홈"], ["onetake", "ONE TAKE", "원테이크 영상"], ["about", "ABOUT", "사업 소개"], ["station", "DOUBLE STATION", "더블 역세권"], ["spaces", "SPACES", "공간 미리보기"], ["plan", "PLAN", "개발 계획"], ["scale", "SCALE", "사업 규모"], ["history", "HISTORY", "추진 현황"], ["contact", "CONTACT", "문의"]];

const VID = (f: string) => `/seobu/video/${f}`;

/* 첫 화면 3구간 — 원테이크 영상에서 잘라낸 장면 */
const HERO = [
  { v: "h1", tab: "증산역에서", no: "01", en: "FROM THE STATION", a: "역에서", b: "시작되는 하루", d: "6호선 증산역 입구에서 하천을 따라 몇 걸음." },
  { v: "h2", tab: "하천 건너 집", no: "02", en: "ACROSS THE STREAM", a: "하천 건너", b: "시장 위의 집", d: "불빛 흐르는 하천 너머, 새 건물이 모습을 드러냅니다." },
  { v: "h3", tab: "새절역까지", no: "03", en: "BETWEEN TWO STATIONS", a: "그리고", b: "또 하나의 역", d: "반대편으로는 새절역. 두 역 사이에 자리합니다." },
];

/* 원테이크 영상 챕터 (통합본 기준 초) */
const CHAPTERS: [number, string][] = [[0, "증산역"], [12, "하천·건물"], [22, "옥상 정원"], [46, "새절역"], [59, "다시 건물로"], [68, "정문·로비"], [84, "라운지·아트리움"], [114, "복도·세대"]];

/* 공간 미리보기 — 영상 카드 */
const CLIPS = [
  { v: "s-roof", en: "SKY GARDEN", t: "옥상 정원", s: "퍼골라 아래 불 밝힌 정원 너머로 하천과 동네가 펼쳐집니다." },
  { v: "s-entry", en: "MAIN ENTRANCE", t: "정문", s: "상가층 모서리, 따뜻한 조명의 주출입구." },
  { v: "s-atrium", en: "ATRIUM", t: "아트리움", s: "천창 아래 나무와 나선계단이 있는 공용 공간." },
  { v: "s-corridor", en: "CORRIDOR", t: "주거 복도", s: "나무 벽과 간접조명이 이어지는 조용한 복도." },
  { v: "s-home", en: "RESIDENCE", t: "세대 내부", s: "현관을 지나 거실, 통창 너머 하천 야경까지." },
];

const GALLERY = [
  { f: "lux-aerial", t: "저녁 조감도", s: "AI 이미지 · 예시" },
  { f: "aerial", t: "조감도", s: "사업계획서(2025.02) 수록" },
  { f: "elev-a", t: "입면도", s: "사업계획서 수록" },
  { f: "elev-b", t: "입면도", s: "사업계획서 수록" },
  { f: "site-1", t: "현재 사업지", s: "사업계획서 수록 현황사진" },
  { f: "site-3", t: "현재 사업지", s: "사업계획서 수록 현황사진" },
  { f: "ai-night", t: "저녁 모습", s: "AI 이미지 · 예시" },
];

const SPACES = [
  { k: "home", en: "RESIDENCE", t: "공동주택", d: "지상 2~12층, 총 110세대. 편리하고 쾌적한 생활환경을 지향합니다.", tag: "110세대 · 지상 2~12층", img: "ai-home" },
  { k: "shop", en: "RETAIL", t: "판매시설", d: "지하 2층~지상 1층. 시장의 상업기능을 잇고 주민의 생활 편의를 더합니다.", tag: "지하 2층~지상 1층", img: "ai-retail2" },
  { k: "fit", en: "COMMUNITY", t: "운동시설", d: "부대복리시설로 계획된 운동시설. 건강한 생활과 주민 커뮤니티를 위한 공간입니다.", tag: "부대복리시설 · 위치·규모 확인 필요", img: "ai-fitness" },
];

function FilmPlayer({ src, poster, className = "", ratio = "9 / 16", badgeBottom = false }: { src: string; poster: string; className?: string; ratio?: string; badgeBottom?: boolean }) {
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
    <div ref={box} className={`relative overflow-hidden bg-black ${className}`} style={{ aspectRatio: ratio, maxHeight: "78vh" }} onClick={() => setPaused((p) => !p)}>
      <video ref={ref} src={near ? src : undefined} poster={poster} muted loop playsInline preload={near ? "auto" : "none"}
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
      <span className={`absolute left-2 bg-white/85 px-1.5 py-0.5 text-[10px] ${badgeBottom ? "bottom-3" : "top-2"}`} style={{ color: "var(--tk-char)" }}>AI 영상 · 예시</span>
    </div>
  );
}

/* 첫 화면 — 영상 3구간 + 번호 탭. 각 구간이 끝나면 다음 구간으로 */
function HeroReel({ onStart }: { onStart: () => void }) {
  const [i, setI] = useState(0);
  const [p, setP] = useState(0);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  useEffect(() => {
    refs.current.forEach((v, k) => {
      if (!v) return;
      if (k === i) { v.currentTime = 0; v.play().catch(() => {}); } else v.pause();
    });
  }, [i]);
  const h = HERO[i];
  return (
    <section id="home" className="relative h-[86dvh] min-h-[600px] overflow-hidden" style={{ background: "#0a201e" }}>
      {HERO.map((x, k) => (
        <motion.div key={x.v} className="absolute inset-0" initial={false} animate={{ clipPath: k === i ? "inset(0% 0% 0% 0%)" : k < i ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)" }} transition={{ duration: 0.9, ease: EASE }} style={{ zIndex: k === i ? 2 : 1 }}>
          <video ref={(el) => { refs.current[k] = el; }} src={VID(`${x.v}.mp4`)} poster={VID(`${x.v}.webp`)} muted playsInline preload={k === 0 ? "auto" : "metadata"} aria-hidden="true"
            onTimeUpdate={(e) => { if (k === i) { const v = e.currentTarget; if (v.duration) setP(v.currentTime / v.duration); } }}
            onEnded={() => { if (k === i) setI((i + 1) % HERO.length); }} className="h-full w-full object-cover" />
        </motion.div>
      ))}
      <div className="pointer-events-none absolute inset-0 z-[3]" style={{ background: "linear-gradient(180deg,rgba(10,32,30,.78) 0%,rgba(10,32,30,.15) 34%,rgba(10,32,30,0) 55%,rgba(10,32,30,.7) 82%,#0a201e 100%)" }} />
      <span className="absolute right-3 top-3 z-[4] bg-white/85 px-1.5 py-0.5 text-[10px]" style={{ color: "var(--tk-char)" }}>AI 영상 · 예시</span>
      <div className="relative z-[4] px-6 pt-10 text-white">
        <div className="tk-en text-[11px] font-semibold" style={{ color: "var(--tk-mint)" }}>SEOUL SEOBU CENTRAL MARKET</div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={h.no} initial={{ y: 24 }} animate={{ y: 0 }} exit={{ y: -16 }} transition={{ duration: 0.6, ease: EASE }}>
            <div className="tk-en mt-4 text-[10.5px] font-bold" style={{ color: "var(--tk-coral2)" }}>{h.no} · {h.en}</div>
            <h1 className="mt-2 text-[34px] font-bold leading-[1.22] tracking-tight">{h.a}<br /><span style={{ color: "var(--tk-glow)" }}>{h.b}</span></h1>
            <p className="mt-3 text-[14.5px] leading-[1.7]" style={{ color: "#c3d6d2" }}>{h.d}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-[4] px-6 pb-6">
        <div className="grid grid-cols-3 gap-2">
          {HERO.map((x, k) => (
            <button key={x.no} onClick={() => setI(k)} className="text-left">
              <div className="h-[2px] w-full" style={{ background: "rgba(255,255,255,.25)" }}>
                <div className="h-full origin-left" style={{ background: "var(--tk-coral)", transform: `scaleX(${k < i ? 1 : k === i ? p : 0})` }} />
              </div>
              <div className="tk-en mt-2 text-[10px] font-bold" style={{ color: k === i ? "#fff" : "#7f9e99" }}>{x.no}</div>
              <div className="text-[12px] font-bold" style={{ color: k === i ? "#fff" : "#7f9e99" }}>{x.tab}</div>
            </button>
          ))}
        </div>
        <button onClick={onStart} className="mt-5 flex w-full items-center justify-center gap-2 py-3 text-[14px] font-bold text-white" style={{ background: "var(--tk-coral)" }}>
          끊김 없는 2분, 원테이크 영상 보기 <Icon d={I.arrow} size={17} />
        </button>
      </div>
    </section>
  );
}

/* 원테이크 영상 — 챕터를 누르면 그 지점으로 */
function OneTake() {
  const ref = useRef<HTMLVideoElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const near = useInView(box, { margin: "400px 0px" });
  const seen = useInView(box, { amount: 0.4 });
  const [paused, setPaused] = useState(false);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(134);
  useEffect(() => {
    const v = ref.current; if (!v) return;
    if (seen && !paused) v.play().catch(() => {}); else v.pause();
  }, [seen, paused]);
  const cur = CHAPTERS.reduce((a, c, k) => (t >= c[0] ? k : a), 0);
  const seek = (s: number) => { const v = ref.current; if (!v) return; v.currentTime = s; setPaused(false); v.play().catch(() => {}); };
  const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  return (
    <section id="onetake" className="pt-16 pb-14" style={{ background: "var(--tk-deep)" }}>
      <div className="px-6">
        <Head no="00" en="ONE TAKE" dark sub="증산역 입구에서 하천을 건너 건물로, 새절역을 돌아 현관을 지나 거실 창가까지. 장면 전환 없이 한 번에 이어지는 드론 영상입니다.">끊김 없이 이어지는<br />2분 14초</Head>
      </div>
      <div ref={box} className="relative mx-6 overflow-hidden bg-black" style={{ aspectRatio: "9 / 16", maxHeight: "80vh" }} onClick={() => setPaused((x) => !x)}>
        <video ref={ref} src={near ? VID("onetake.mp4") : undefined} poster={VID("onetake.webp")} muted playsInline loop preload={near ? "auto" : "none"}
          onLoadedMetadata={(e) => setDur(e.currentTarget.duration || 134)} onTimeUpdate={(e) => setT(e.currentTarget.currentTime)} className="h-full w-full object-cover" />
        <div className="absolute left-3 top-3 bg-black/55 px-2 py-1 text-[11px] font-bold text-white">{mmss(t)} · {CHAPTERS[cur][1]}</div>
        <div className="absolute inset-x-0 bottom-0 h-[3px]" style={{ background: "rgba(255,255,255,.2)" }}>
          <div className="h-full origin-left" style={{ background: "var(--tk-coral)", transform: `scaleX(${dur ? t / dur : 0})` }} />
        </div>
        <AnimatePresence>
          {paused && (
            <motion.span key="p" className="absolute left-1/2 top-1/2 -ml-8 -mt-8 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: "rgba(226,115,74,.9)" }} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.25 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
            </motion.span>
          )}
        </AnimatePresence>
        <span className="absolute bottom-3 left-2 bg-white/85 px-1.5 py-0.5 text-[10px]" style={{ color: "var(--tk-char)" }}>AI 영상 · 예시</span>
      </div>
      <div className="tk-noscroll mt-4 flex gap-1.5 overflow-x-auto px-6">
        {CHAPTERS.map(([s, l], k) => (
          <button key={s} onClick={() => seek(s)} className="relative shrink-0 border px-3 py-2 text-left" style={{ borderColor: k === cur ? "var(--tk-coral)" : "#24504b" }}>
            {k === cur && <motion.span layoutId="sb-ch" className="absolute inset-0" style={{ background: "var(--tk-coral)" }} transition={{ duration: 0.3, ease: EASE }} />}
            <span className="tk-en relative z-10 block text-[9.5px] font-bold" style={{ color: k === cur ? "#ffe3d6" : "#7f9e99" }}>{mmss(s)}</span>
            <span className="relative z-10 block text-[12.5px] font-bold" style={{ color: "#fff" }}>{l}</span>
          </button>
        ))}
      </div>
      <p className="mt-3 px-6 text-[11px] leading-[1.6]" style={{ color: "#7f9e99" }}>버튼을 누르면 그 장면으로 이동합니다. 화면을 누르면 멈춤·재생. AI로 만든 예시 영상으로 실제 설계와 다를 수 있습니다.</p>
    </section>
  );
}

/* 더블 역세권 — 개념 지도(축척 아님): 6호선, 불광천, 두 역, 사업지, 드론 경로 */
function StationMap() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-60px" });
  const dr = (delay: number, dur = 1.4) => ({ initial: { pathLength: 0 }, animate: { pathLength: seen ? 1 : 0 }, transition: { duration: dur, delay, ease: EASE } });
  const pop = (delay: number) => ({ initial: { scale: 0 }, animate: { scale: seen ? 1 : 0 }, transition: { duration: 0.6, delay, ease: EASE } });
  return (
    <div ref={ref} className="relative overflow-hidden" style={{ background: "linear-gradient(160deg,#143a37,#0a201e)" }}>
      <svg viewBox="0 0 360 440" className="block w-full" role="img" aria-label="증산역·새절역과 사업지 위치 개념도">
        <defs><pattern id="sbg" width="18" height="18" patternUnits="userSpaceOnUse"><path d="M18 0H0V18" fill="none" stroke="#ffffff10" /></pattern></defs>
        <rect width="360" height="440" fill="url(#sbg)" />
        {/* 불광천 */}
        <motion.path d="M70 430 C 120 360, 150 320, 175 260 S 230 140, 262 10" fill="none" stroke="#3f8fb0" strokeWidth="16" strokeLinecap="round" opacity=".55" {...dr(0.1, 1.6)} />
        <motion.path d="M70 430 C 120 360, 150 320, 175 260 S 230 140, 262 10" fill="none" stroke="#8fd3bf" strokeWidth="1.2" strokeDasharray="3 6" {...dr(0.3, 1.6)} />
        {/* 6호선 */}
        <motion.path d="M48 430 C 98 360, 128 318, 153 258 S 208 136, 240 10" fill="none" stroke="#c9792b" strokeWidth="6" strokeLinecap="round" {...dr(0.5, 1.6)} />
        {/* 드론 경로: 증산역 → 사업지 → 새절역 → 사업지 */}
        <motion.path d="M118 352 C 150 340, 186 312, 214 300 C 232 230, 214 150, 222 108 C 238 150, 236 230, 214 300" fill="none" stroke="#ffcf86" strokeWidth="2" strokeDasharray="5 5" {...dr(1.6, 2.4)} />
        {/* 증산역 */}
        <motion.g {...pop(1.2)} style={{ transformOrigin: "118px 352px" }}>
          <circle cx="118" cy="352" r="11" fill="#fff" stroke="#c9792b" strokeWidth="4" />
          <text x="132" y="380" fill="#fff" fontSize="14" fontWeight="700">증산역</text>
          <text x="132" y="396" fill="#a9c1bd" fontSize="10">6호선</text>
        </motion.g>
        {/* 새절역 */}
        <motion.g {...pop(1.35)} style={{ transformOrigin: "222px 108px" }}>
          <circle cx="222" cy="108" r="11" fill="#fff" stroke="#c9792b" strokeWidth="4" />
          <text x="150" y="92" fill="#fff" fontSize="14" fontWeight="700">새절역</text>
          <text x="166" y="108" fill="#a9c1bd" fontSize="10">6호선</text>
        </motion.g>
        {/* 사업지 */}
        <motion.g {...pop(1.9)} style={{ transformOrigin: "214px 300px" }}>
          <circle cx="214" cy="300" r="26" fill="#e2734a33" />
          <path d="M214 318 c-9-11-15-18-15-26a15 15 0 0 1 30 0c0 8-6 15-15 26z" fill="#e2734a" />
          <circle cx="214" cy="291" r="5.5" fill="#fff" />
          <rect x="236" y="282" width="104" height="38" fill="#ffffff" />
          <text x="244" y="298" fill="#0e2b29" fontSize="12" fontWeight="800">서부중앙시장</text>
          <text x="244" y="313" fill="#6b7775" fontSize="9.5">북가좌동 338-19 일원</text>
        </motion.g>
        <text x="20" y="28" fill="#8fd3bf" fontSize="10" letterSpacing="2">CONCEPT MAP · NOT TO SCALE</text>
        <g transform="translate(20 414)"><rect width="10" height="4" y="3" fill="#c9792b" /><text x="16" y="9" fill="#a9c1bd" fontSize="9.5">6호선</text><rect x="58" width="10" height="4" y="3" fill="#3f8fb0" /><text x="74" y="9" fill="#a9c1bd" fontSize="9.5">불광천</text><line x1="122" x2="134" y1="5" y2="5" stroke="#ffcf86" strokeDasharray="3 3" strokeWidth="2" /><text x="140" y="9" fill="#a9c1bd" fontSize="9.5">영상 속 드론 경로</text></g>
      </svg>
    </div>
  );
}

/* 공간 미리보기 카드 — 화면에 보일 때만 재생 */
function ClipCard({ v, en, t, s }: { v: string; en: string; t: string; s: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const seen = useInView(box, { amount: 0.6 });
  const near = useInView(box, { margin: "0px 300px" });
  useEffect(() => { const el = ref.current; if (!el) return; if (seen) el.play().catch(() => {}); else el.pause(); }, [seen]);
  return (
    <div ref={box} className="w-[74%] shrink-0 snap-center">
      <div className="relative overflow-hidden bg-black" style={{ aspectRatio: "9 / 14" }}>
        <video ref={ref} src={near ? VID(`${v}.mp4`) : undefined} poster={VID(`${v}.webp`)} muted loop playsInline preload="none" className="h-full w-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 p-3" style={{ background: "linear-gradient(0deg,rgba(8,26,24,.9),rgba(8,26,24,0))" }}>
          <div className="tk-en text-[9.5px] font-bold" style={{ color: "var(--tk-coral2)" }}>{en} · AI 예시</div>
          <div className="text-[17px] font-bold text-white">{t}</div>
          <p className="mt-0.5 text-[12px] leading-[1.5]" style={{ color: "#c3d6d2" }}>{s}</p>
        </div>
      </div>
    </div>
  );
}

export default function SeobuSite() {
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState("home");
  const [future, setFuture] = useState(true);
  const [pastel, setPastel] = useState(false);
  useEffect(() => { setPastel(new URLSearchParams(window.location.search).get("tone") === "pastel"); }, []);
  const [space, setSpace] = useState(0);
  const [floor, setFloor] = useState(0);
  const [cmp, setCmp] = useState(true);
  const [open, setOpen] = useState<number | null>(0);
  const [gal, setGal] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [showTop, setShowTop] = useState(false);
  const galRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }); }, { rootMargin: "-45% 0px -50% 0px" });
    NAV.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);

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
  const unitMax = Math.max(...UNITS.map((u) => u.n));
  const mapQ = encodeURIComponent(PROJECT.address);
  const sp = SPACES[space];

  return (
    <div className={`tk${pastel ? " pastel" : ""}`}>
      <div className="relative mx-auto w-full max-w-[480px]">
        <div className="px-4 py-1.5 text-center text-[11px]" style={{ background: "var(--tk-deep)", color: "#a9c1bd" }}>임시 홈페이지 · 수치와 일정은 최신 자료와 대조 후 확정됩니다</div>

        {/* 헤더 */}
        <header className="sticky top-0 z-40 border-b" style={{ background: "rgba(255,255,255,.95)", borderColor: "var(--tk-line)", backdropFilter: "blur(10px)" }}>
          <div className="flex h-[54px] items-center justify-between px-4">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-left leading-none">
              <span className="block text-[15px] font-black tracking-tight" style={{ color: "var(--tk-deep)" }}>서부중앙시장<span style={{ color: "var(--tk-coral)" }}>.</span></span>
              <span className="tk-en mt-1 block text-[8.5px] font-bold" style={{ color: "var(--tk-sub)" }}>SEOUL SEOBU CENTRAL MARKET</span>
            </button>
            <div className="flex items-center gap-2">
              <button onClick={() => go("contact")} className="rounded-full px-3.5 py-1.5 text-[12.5px] font-bold text-white" style={{ background: "var(--tk-coral)" }}>사업 문의</button>
              <button onClick={() => setMenu(true)} aria-label="메뉴 열기" className="flex h-10 w-9 flex-col items-end justify-center gap-[5px]">
                <span className="h-[1.5px] w-6" style={{ background: "var(--tk-deep)" }} /><span className="h-[1.5px] w-4" style={{ background: "var(--tk-coral)" }} /><span className="h-[1.5px] w-6" style={{ background: "var(--tk-deep)" }} />
              </button>
            </div>
          </div>
          <nav className="tk-noscroll flex gap-4 overflow-x-auto px-4 text-[11.5px] tracking-wide">
            {NAV.map(([id, l]) => (
              <button key={id} onClick={() => go(id)} className="relative shrink-0 pb-2.5 pt-0.5 font-bold" style={{ color: active === id ? "var(--tk-deep)" : "#9aa5a3" }}>
                {l}
                {active === id && <motion.span layoutId="sb-nav" className="absolute inset-x-0 bottom-0 h-[2px]" style={{ background: "var(--tk-coral)" }} transition={{ duration: 0.35, ease: EASE }} />}
              </button>
            ))}
          </nav>
        </header>

        {/* 메뉴 */}
        <AnimatePresence>
          {menu && (
            <motion.div key="m" className="fixed inset-y-0 right-0 z-50 w-full max-w-[480px] overflow-y-auto" style={{ background: "var(--tk-deep)" }} initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.5, ease: EASE }}>
              <div className="flex h-[54px] items-center justify-between px-5">
                <span className="text-[15px] font-black text-white">서부중앙시장<span style={{ color: "var(--tk-coral2)" }}>.</span></span>
                <button onClick={() => setMenu(false)} aria-label="메뉴 닫기" className="text-[28px] leading-none text-white">×</button>
              </div>
              <div className="px-6 pt-2 pb-10">
                {NAV.map(([id, l, ko], i) => (
                  <motion.button key={id} onClick={() => go(id)} className="flex w-full items-baseline justify-between border-b py-3.5 text-left" style={{ borderColor: "#24504b" }} initial={{ x: 40 }} animate={{ x: 0 }} transition={{ duration: 0.5, delay: 0.08 + i * 0.04, ease: EASE }}>
                    <span className="text-[19px] font-bold tracking-wide text-white">{l}</span>
                    <span className="text-[12px]" style={{ color: "var(--tk-mint)" }}>{ko}</span>
                  </motion.button>
                ))}
                <button onClick={() => go("contact")} className="mt-7 w-full py-3.5 text-[15px] font-bold text-white" style={{ background: "var(--tk-coral)" }}>사업 문의</button>
                <p className="mt-6 text-[12px] leading-[1.7]" style={{ color: "#86a39f" }}>{PROJECT.nameKo}<br />{PROJECT.address} ({PROJECT.roadAddress})</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HOME — 영상 3구간 */}
        <HeroReel onStart={() => go("onetake")} />

        {/* 핵심 숫자 */}
        <section className="grid grid-cols-3 gap-px" style={{ background: "#24504b" }}>
          {[[`B${SCALE.floors.below} / ${SCALE.floors.above}F`, "지하·지상"], [`${SCALE.households.value}세대`, "공동주택"], ["6호선 2역", "증산·새절 사이"]].map(([v, l]) => (
            <div key={l} className="py-4 text-center" style={{ background: "#0a201e" }}><div className="text-[17px] font-bold text-white">{v}</div><div className="text-[10.5px]" style={{ color: "#8fb0ab" }}>{l}</div></div>
          ))}
        </section>

        <OneTake />

        {/* ABOUT */}
        <section id="about" className="px-6 pt-16 pb-14">
          <Head no="01" en="PROJECT OVERVIEW" sub="오래된 시장을 정비해, 시장이 머물던 자리에 사람이 사는 집과 지역의 상업공간을 함께 짓는 복합개발 사업입니다.">시장이 머무는 곳에,<br />사람이 사는 집을</Head>
          <div className="space-y-2.5">
            {[[I.tool, "RENEWAL", "정비", "노후한 시장 건물을 정비해 안전하고 쾌적한 공간으로."], [I.home, "RESIDENCE", "주거", "공동주택 110세대 공급으로 주거환경을 개선합니다."], [I.shop, "RETAIL", "상업", "시장의 상업기능을 새 판매시설로 잇고 복합화합니다."], [I.users, "COMMUNITY", "지역", "지역 주민과 함께하는 공간으로 동네를 살립니다."]].map(([ic, en, t, d], i) => (
              <motion.div key={en} className="flex gap-4 p-4" style={{ background: i % 2 ? "#eef6f3" : "var(--tk-sand)" }} initial={{ x: -30 }} whileInView={{ x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center" style={{ background: "var(--tk-deep)", color: "var(--tk-glow)" }}><Icon d={ic} size={22} /></span>
                <div>
                  <div className="tk-en text-[10px] font-bold" style={{ color: "var(--tk-coral)" }}>{en}</div>
                  <div className="text-[16px] font-bold" style={{ color: "var(--tk-deep)" }}>{t}</div>
                  <p className="mt-0.5 text-[13px] leading-[1.6]" style={{ color: "var(--tk-char)" }}>{d}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 지금 / 미래 */}
          <Rise><div className="mt-12 text-[18px] font-bold" style={{ color: "var(--tk-deep)" }}>시장 거리의 지금과 미래 <span className="text-[12px] font-normal" style={{ color: "var(--tk-sub)" }}>· 버튼을 눌러 비교</span></div></Rise>
          <Rise>
            <div className="mt-4 mb-2 flex border p-1" style={{ borderColor: "var(--tk-line)" }}>
              {[false, true].map((v) => (
                <button key={String(v)} onClick={() => setFuture(v)} className="relative flex-1 py-2 text-[13px] font-bold">
                  {future === v && <motion.span layoutId="sb-ba" className="absolute inset-0" style={{ background: v ? "var(--tk-deep)" : "var(--tk-sand)" }} transition={{ duration: 0.35, ease: EASE }} />}
                  <span className="relative z-10" style={{ color: future === v ? (v ? "#fff" : "var(--tk-deep)") : "var(--tk-sub)" }}>{v ? "정비 후 (예시)" : "지금"}</span>
                </button>
              ))}
            </div>
          </Rise>
          <div className="relative h-[460px] overflow-hidden">
            <img src={IMG("ai-oldmarket")} alt="지금의 시장 거리 (AI 이미지 예시)" className="absolute inset-0 h-full w-full object-cover" />
            <motion.div className="absolute inset-0" initial={false} animate={{ clipPath: future ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 0% 100%)" }} transition={{ duration: 0.8, ease: EASE }}>
              <img src={IMG("ai-retail")} alt="정비 후 상가 거리 (AI 이미지 예시)" className="h-full w-full object-cover" />
            </motion.div>
            <span className="absolute bottom-2 left-2 bg-white/90 px-1.5 py-0.5 text-[10px]" style={{ color: "var(--tk-char)" }}>{future ? "정비 후 거리" : "지금의 시장 거리"} · AI 이미지 예시</span>
          </div>

          {/* 개요 표 */}
          <dl className="mt-10 border-t text-[13.5px]" style={{ borderColor: "var(--tk-deep)" }}>
            {[["사업명", PROJECT.nameKo], ["위치", `${PROJECT.address} (${PROJECT.roadAddress})`], ["시행 주체", PROJECT.operators.join(" · ")], ["지역·지구", PROJECT.zoning], ["대지면적", `${SCALE.site.value.toLocaleString("ko-KR")}㎡ (${SCALE.site.note.split(" · ")[0]})`], ["도로", PROJECT.roads], ["개발 용도", PROJECT.uses.join(" · ")]].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[78px_1fr] gap-3 border-b py-3" style={{ borderColor: "var(--tk-line)" }}>
                <dt className="font-bold" style={{ color: "var(--tk-deep)" }}>{k}</dt><dd className="leading-[1.6]" style={{ color: "var(--tk-char)" }}>{v}</dd>
              </div>
            ))}
          </dl>

          <Rise>
            <div className="mt-10">
              <div className="mb-2 flex items-baseline justify-between">
                <div><span className="tk-en text-[10.5px] font-bold" style={{ color: "var(--tk-coral)" }}>FROM LINE TO LIFE</span><div className="text-[17px] font-bold" style={{ color: "var(--tk-deep)" }}>한 줄의 선이 건물이 되기까지</div></div>
                <span className="text-[11px]" style={{ color: "var(--tk-sub)" }}>45초</span>
              </div>
              <FilmPlayer src="/seobu/video/sketch.mp4" poster="/seobu/video/sketch-poster.webp" badgeBottom />
              <p className="mt-2 text-[11px]" style={{ color: "var(--tk-sub)" }}>사업계획서 도면을 바탕으로 만든 AI 예시 영상입니다.</p>
            </div>
          </Rise>
        </section>

        {/* 갤러리 띠 */}
        <section className="pt-2 pb-14">
          <div ref={galRef} onScroll={onGalScroll} className="tk-noscroll flex snap-x snap-mandatory gap-3 overflow-x-auto px-6">
            {GALLERY.map((g, i) => (
              <button key={g.f} onClick={() => setLightbox(i)} className="w-[78%] shrink-0 snap-center text-left">
                <Photo src={IMG(g.f)} alt={`${g.t} — ${g.s}`} className="aspect-[4/3] w-full" />
                <div className="mt-2 text-[14px] font-bold" style={{ color: "var(--tk-deep)" }}>{g.t}</div>
                <div className="text-[11.5px]" style={{ color: "var(--tk-sub)" }}>{g.s}</div>
              </button>
            ))}
          </div>
          <div className="mt-3 flex justify-center gap-1.5">
            {GALLERY.map((_, i) => <motion.span key={i} className="h-1.5 rounded-full" animate={{ width: i === gal ? 18 : 6, backgroundColor: i === gal ? "#e2734a" : "#d6d1c5" }} transition={{ duration: 0.3 }} />)}
          </div>
        </section>

        {/* LOCATION */}
        <section id="station" className="px-6 pt-16 pb-14">
          <Head no="02" en="DOUBLE STATION" sub="지하철 6호선 증산역과 새절역 사이. 불광천을 끼고 두 역을 오가는 서북권 생활권에 자리합니다.">6호선 두 역 사이,<br />하천 옆의 집</Head>
          <div className="-mx-6"><StationMap /></div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div><Photo src={VID("h1.webp")} alt="증산역 입구 (AI 영상 예시)" className="aspect-[3/4]" cap="증산역 · AI 예시" /><div className="mt-1.5 text-[13px] font-bold" style={{ color: "var(--tk-deep)" }}>증산역</div><div className="text-[11px]" style={{ color: "var(--tk-sub)" }}>사업지 남서측 · 자료 표현 &lsquo;3분 거리&rsquo;</div></div>
            <div><Photo src={IMG("saejeol")} alt="새절역 입구 (AI 이미지 예시)" className="aspect-[3/4]" cap="새절역 · AI 예시" /><div className="mt-1.5 text-[13px] font-bold" style={{ color: "var(--tk-deep)" }}>새절역</div><div className="text-[11px]" style={{ color: "var(--tk-sub)" }}>사업지 북측 · 불광천 상류 방향</div></div>
          </div>
          <div className="mt-8 text-[18px] font-bold" style={{ color: "var(--tk-deep)" }}>주변 생활권</div>
          <div className="flex items-start gap-3 p-4" style={{ background: "var(--tk-sand)" }}>
            <span style={{ color: "var(--tk-coral)" }}><Icon d={I.pin} /></span>
            <div className="flex-1"><div className="text-[14px] font-bold" style={{ color: "var(--tk-deep)" }}>{PROJECT.address}</div><div className="text-[12px]" style={{ color: "var(--tk-sub)" }}>{PROJECT.roadAddress}</div></div>
            <a href={`https://map.naver.com/p/search/${mapQ}`} target="_blank" rel="noopener" className="shrink-0 px-2.5 py-1.5 text-[11.5px] font-bold text-white" style={{ background: "var(--tk-deep)" }}>지도</a>
          </div>
          <div className="mt-4 space-y-2">
            {SURROUND.map((s, i) => {
              const ic = [I.train, I.book, I.tree, I.chart][i] ?? I.pin;
              return (
                <div key={s.k} className="border" style={{ borderColor: "var(--tk-line)" }}>
                  <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
                    <span style={{ color: "var(--tk-coral)" }}><Icon d={ic} size={20} /></span>
                    <span className="flex-1 text-[15px] font-bold" style={{ color: "var(--tk-deep)" }}>{s.k}</span>
                    <motion.span animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.3 }} style={{ color: "var(--tk-sub)" }}><Icon d={I.down} size={18} /></motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open === i && (
                      <motion.div key="b" className="overflow-hidden" initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.35, ease: EASE }}>
                        <ul className="space-y-1.5 px-4 pb-4 text-[13px] leading-[1.6]" style={{ color: "var(--tk-char)" }}>
                          {s.items.map((t) => <li key={t} className="flex gap-2"><span style={{ color: "var(--tk-coral)" }}>·</span>{t}</li>)}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-[11px] leading-[1.6]" style={{ color: "var(--tk-sub)" }}>사업계획서(2025.02) &lsquo;사업지 주변 환경분석&rsquo; 기재 내용이며, 거리·소요시간은 별도 확인 전입니다.</p>
          <Photo src={IMG("ai-stream")} alt="인근 하천 산책로 (AI 이미지 예시)" className="mt-7 h-[420px]" pos="50% 60%" cap="인근 하천 산책로 · AI 이미지 예시" />
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {["site-1", "site-2", "site-3"].map((f) => <Photo key={f} src={IMG(f)} alt="사업지 주변 현황 (사업계획서 수록)" className="h-[86px]" />)}
          </div>
        </section>

        {/* SPACES */}
        <section id="spaces" className="pt-16 pb-14" style={{ background: "var(--tk-deep)" }}>
          <div className="px-6"><Head no="03" en="SPACES" dark sub="원테이크 영상 속 공간을 한 장면씩. 옆으로 넘겨 보세요.">문을 열면<br />펼쳐지는 일상</Head></div>
          <div className="tk-noscroll flex snap-x snap-mandatory gap-3 overflow-x-auto px-6">
            {CLIPS.map((c) => <ClipCard key={c.v} {...c} />)}
          </div>
          <p className="mt-3 px-6 text-[11px] leading-[1.6]" style={{ color: "#7f9e99" }}>AI로 만든 예시 영상입니다. 실제 공간 구성·마감은 설계에 따라 달라집니다.</p>
        </section>

        {/* PLAN */}
        <section id="plan" className="pt-16 pb-14" style={{ background: "var(--tk-sand)" }}>
          <div className="px-6">
            <Head no="04" en="DEVELOPMENT PLAN" sub={`지하 ${SCALE.floors.below}층, 지상 ${SCALE.floors.above}층. 아래는 시장의 상업공간이, 위로는 주거공간이 이어지는 복합 건축물입니다.`}>주거와 상업이<br />한 건물에서 만납니다</Head>
            <div className="flex border p-1" style={{ borderColor: "#d9d2c3", background: "#fff" }}>
              {SPACES.map((s, i) => (
                <button key={s.k} onClick={() => setSpace(i)} className="relative flex-1 py-2.5">
                  {space === i && <motion.span layoutId="sb-sp" className="absolute inset-0" style={{ background: "var(--tk-coral)" }} transition={{ duration: 0.35, ease: EASE }} />}
                  <span className="tk-en relative z-10 block text-[10.5px] font-bold" style={{ color: space === i ? "#fff" : "var(--tk-deep)" }}>{s.en}</span>
                  <span className="relative z-10 block text-[10.5px]" style={{ color: space === i ? "#ffe3d6" : "var(--tk-sub)" }}>{s.t}</span>
                </button>
              ))}
            </div>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={sp.k} className="mx-6 mt-4 bg-white" initial={{ clipPath: "inset(0% 100% 0% 0%)" }} animate={{ clipPath: "inset(0% 0% 0% 0%)" }} exit={{ clipPath: "inset(0% 0% 0% 100%)" }} transition={{ duration: 0.5, ease: EASE }}>
              <div className="relative h-[360px] overflow-hidden">
                <img src={IMG(sp.img)} alt={`${sp.t} (AI 이미지 예시)`} className="h-full w-full object-cover" />
                <span className="absolute bottom-2 left-2 bg-white/90 px-1.5 py-0.5 text-[10px]" style={{ color: "var(--tk-char)" }}>AI 이미지 · 예시</span>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2"><span style={{ color: "var(--tk-coral)" }}><Icon d={I[sp.k]} size={20} /></span><span className="text-[18px] font-bold" style={{ color: "var(--tk-deep)" }}>{sp.t}</span></div>
                <p className="mt-1.5 text-[13.5px] leading-[1.7]" style={{ color: "var(--tk-char)" }}>{sp.d}</p>
                <span className="mt-3 inline-block px-2 py-1 text-[11px] font-bold" style={{ background: "var(--tk-sand)", color: "var(--tk-deep)" }}>{sp.tag}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* 층별 구성 */}
          <div className="mx-6 mt-10">
            <div className="text-[18px] font-bold" style={{ color: "var(--tk-deep)" }}>층별 구성 <span className="text-[12px] font-normal" style={{ color: "var(--tk-sub)" }}>· 층을 눌러 보세요</span></div>
            <div className="mt-4 grid grid-cols-[96px_1fr] gap-3">
              <div className="flex flex-col gap-1">
                {FLOORS.map((f, i) => (
                  <button key={f.f} onClick={() => setFloor(i)} className="relative py-2.5 text-[13px] font-bold" style={{ background: "#fff", color: floor === i ? "#fff" : "var(--tk-deep)", flexGrow: f.kind === "home" && i === 0 ? 2.4 : 1 }}>
                    {floor === i && <motion.span layoutId="sb-fl" className="absolute inset-0" style={{ background: f.kind === "home" ? "var(--tk-deep)" : f.kind === "shop" ? "var(--tk-coral)" : "#6b7775" }} transition={{ duration: 0.35, ease: EASE }} />}
                    <span className="relative z-10">{f.f}</span>
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={floor} className="bg-white p-4" initial={{ y: 16 }} animate={{ y: 0 }} exit={{ y: -16 }} transition={{ duration: 0.35, ease: EASE }}>
                  <div className="tk-en text-[10.5px] font-bold" style={{ color: "var(--tk-coral)" }}>{FLOORS[floor].f}</div>
                  <div className="mt-1 text-[19px] font-bold" style={{ color: "var(--tk-deep)" }}>{FLOORS[floor].use}</div>
                  <p className="mt-1.5 text-[13px] leading-[1.7]" style={{ color: "var(--tk-char)" }}>{FLOORS[floor].detail}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* 주택형 */}
          <div className="mx-6 mt-10 bg-white p-4">
            <div className="flex items-baseline justify-between"><span className="text-[16px] font-bold" style={{ color: "var(--tk-deep)" }}>주택형 구성</span><span className="text-[11.5px]" style={{ color: "var(--tk-sub)" }}>8개 타입 · {SCALE.households.value}세대</span></div>
            <div className="mt-3 space-y-2">
              {UNITS.map((u, i) => (
                <div key={u.t} className="grid grid-cols-[38px_62px_1fr_42px] items-center gap-2 text-[12.5px]">
                  <span className="font-bold" style={{ color: "var(--tk-deep)" }}>{u.t}형</span>
                  <span style={{ color: "var(--tk-sub)" }}>{u.area}㎡</span>
                  <div className="h-2.5" style={{ background: "var(--tk-sand)" }}>
                    <motion.div className="h-full origin-left" style={{ background: u.area >= 85 ? "var(--tk-deep)" : "var(--tk-coral)" }} initial={{ scaleX: 0 }} whileInView={{ scaleX: u.n / unitMax }} viewport={{ once: true }} transition={{ duration: 0.9, delay: i * 0.05, ease: EASE }} />
                  </div>
                  <span className="text-right font-bold" style={{ color: "var(--tk-deep)" }}>{u.n}세대</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-[1.6]" style={{ color: "var(--tk-sub)" }}>분양조견표(검토안) 기준 세대별 면적입니다. 확정된 주택형이 아니며 설계에 따라 달라질 수 있습니다.</p>
          </div>

          <div className="mx-6 mt-10">
            <div className="mb-2"><span className="tk-en text-[10.5px] font-bold" style={{ color: "var(--tk-coral)" }}>EVENING VIEW</span><div className="text-[17px] font-bold" style={{ color: "var(--tk-deep)" }}>불이 켜진 저녁의 건물</div></div>
            <FilmPlayer src="/seobu/video/film.mp4" poster="/seobu/video/film-poster.webp" ratio="16 / 9" />
          </div>
        </section>

        {/* SCALE */}
        <section id="scale" className="px-6 pt-16 pb-14" style={{ background: "var(--tk-deep)" }}>
          <Head no="05" en="PROJECT SCALE" dark sub="기존 검토자료(설계변경안) 기준이며, 최신 인허가 자료와 대조 후 확정됩니다.">숫자로 보는<br />사업 규모</Head>
          <div className="grid grid-cols-2 gap-px" style={{ background: "#24504b" }}>
            {[[SCALE.site, 1], [SCALE.households, 0], [SCALE.parking, 0], [SCALE.gfa, 1], [SCALE.far, 2], [SCALE.bcr, 2]].map(([s, dec]) => {
              const x = s as { value: number; unit: string; label: string };
              return (
                <div key={x.label} className="p-4" style={{ background: "var(--tk-deep)" }}>
                  <div className="text-[24px] font-bold text-white"><Roll to={x.value} decimals={dec as number} /><span className="ml-0.5 text-[13px]" style={{ color: "var(--tk-glow)" }}>{x.unit}</span></div>
                  <div className="text-[11.5px]" style={{ color: "#a9c1bd" }}>{x.label}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 flex border p-1" style={{ borderColor: "#24504b" }}>
            {[false, true].map((v) => (
              <button key={String(v)} onClick={() => setCmp(v)} className="relative flex-1 py-2 text-[12.5px] font-bold">
                {cmp === v && <motion.span layoutId="sb-cmp" className="absolute inset-0" style={{ background: "var(--tk-coral)" }} transition={{ duration: 0.35, ease: EASE }} />}
                <span className="relative z-10" style={{ color: cmp === v ? "#fff" : "#a9c1bd" }}>{v ? "변경안" : "당초 (사업시행인가)"}</span>
              </button>
            ))}
          </div>
          <div className="mt-2">
            {COMPARE.map((c, i) => (
              <div key={c.k} className="flex items-center justify-between border-b py-3 text-[13.5px]" style={{ borderColor: "#24504b" }}>
                <span style={{ color: "#a9c1bd" }}>{c.k}</span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={String(cmp)} className="font-bold text-white" initial={{ y: 10 }} animate={{ y: 0 }} exit={{ y: -10 }} transition={{ duration: 0.25, delay: i * 0.03 }}>{cmp ? c.b : c.a}</motion.span>
                </AnimatePresence>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-[1.6]" style={{ color: "#7f9e99" }}>감정평가서 DRAFT 기재 수치입니다.</p>
        </section>

        {/* HISTORY */}
        <section id="history" className="px-6 pt-16 pb-14">
          <Head no="06" en="PROGRESS" sub="기존 자료에 기재된 추진 이력이며, 최신 행정 상태를 뜻하지 않습니다.">추진 현황</Head>
          <div className="relative pl-6">
            <motion.span className="absolute left-[7px] top-1 bottom-1 w-px origin-top" style={{ background: "var(--tk-coral)" }} initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: EASE }} />
            {HISTORY.map((h, i) => (
              <Rise key={h.d} delay={i * 0.06} className="relative pb-6">
                <span className="absolute -left-6 top-1 h-[15px] w-[15px] rounded-full border-[3px] bg-white" style={{ borderColor: i === HISTORY.length - 1 ? "var(--tk-coral)" : "var(--tk-deep)" }} />
                <div className="tk-en text-[11px] font-bold" style={{ color: "var(--tk-coral)" }}>{h.d}</div>
                <div className="text-[16px] font-bold" style={{ color: "var(--tk-deep)" }}>{h.t}</div>
                {h.s && <div className="text-[12.5px]" style={{ color: "var(--tk-sub)" }}>{h.s}</div>}
              </Rise>
            ))}
          </div>
        </section>

        {/* MEDIA */}
        <section id="media" className="pt-16 pb-14" style={{ background: "var(--tk-sand)" }}>
          <div className="px-6"><Head no="07" en="MEDIA & NOTICE">홍보자료 및 공지사항</Head></div>
          <div className="grid grid-cols-2 gap-2 px-6">
            {GALLERY.map((g, i) => (
              <button key={g.f + i} onClick={() => setLightbox(i)} className="text-left">
                <Photo src={IMG(g.f)} alt={`${g.t} — ${g.s}`} className="h-[120px]" />
                <div className="mt-1.5 text-[13px] font-bold" style={{ color: "var(--tk-deep)" }}>{g.t}</div>
                <div className="text-[11px]" style={{ color: "var(--tk-sub)" }}>{g.s}</div>
              </button>
            ))}
          </div>
          <div className="mx-6 mt-8 bg-white">
            <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "var(--tk-line)" }}><span className="text-[15px] font-bold" style={{ color: "var(--tk-deep)" }}>공지사항</span><Pending>준비 중</Pending></div>
            <p className="px-4 py-5 text-[13px]" style={{ color: "var(--tk-sub)" }}>등록된 공지사항이 없습니다. 공지사항은 조합과 시행사 확인을 거쳐 게시됩니다.</p>
          </div>
          <div className="mx-6 mt-3 flex items-center gap-3 bg-white px-4 py-4">
            <span style={{ color: "var(--tk-coral)" }}><Icon d={I.doc} /></span>
            <div className="flex-1"><div className="text-[14px] font-bold" style={{ color: "var(--tk-deep)" }}>사업 관련 문서</div><div className="text-[12px]" style={{ color: "var(--tk-sub)" }}>공개 범위 확인 후 게시 예정</div></div>
            <Pending>준비 중</Pending>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="px-6 pt-16 pb-14">
          <Head no="08" en="CONTACT">사업 문의</Head>
          <dl className="border-t text-[14px]" style={{ borderColor: "var(--tk-deep)" }}>
            {[
              ["사업명", PROJECT.nameKo],
              ["시행 주체", PROJECT.operators.join(" · ")],
              ["사업장 위치", <>{PROJECT.address}<br /><span style={{ color: "var(--tk-sub)" }}>({PROJECT.roadAddress})</span></>],
              ["대표 연락처", PROJECT.phone ? <a href={`tel:${PROJECT.phone}`}>{PROJECT.phone}</a> : <Pending />],
              ["이메일", PROJECT.email ? <a href={`mailto:${PROJECT.email}`}>{PROJECT.email}</a> : <Pending />],
            ].map(([k, v], i) => (
              <div key={i} className="grid grid-cols-[86px_1fr] gap-3 border-b py-3.5" style={{ borderColor: "var(--tk-line)" }}>
                <dt className="font-bold" style={{ color: "var(--tk-deep)" }}>{k}</dt><dd className="leading-[1.6]" style={{ color: "var(--tk-char)" }}>{v}</dd>
              </div>
            ))}
          </dl>
          <a href={`https://map.naver.com/p/search/${mapQ}`} target="_blank" rel="noopener" className="mt-5 flex items-center justify-center gap-2 py-3.5 text-[14px] font-bold text-white" style={{ background: "var(--tk-coral)" }}><Icon d={I.pin} size={18} />지도에서 위치 보기</a>
        </section>

        {/* 엔딩 */}
        <section className="relative overflow-hidden bg-black" style={{ aspectRatio: "9 / 14" }}>
          <video src={VID("s-roof.mp4")} poster={VID("s-roof.webp")} autoPlay muted loop playsInline preload="none" aria-label="옥상 정원에서 내려다본 하천과 동네 (AI 영상 예시)" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(8,26,24,.82) 0%,rgba(8,26,24,.25) 38%,rgba(8,26,24,0) 60%,#081a18 100%)" }} />
          <div className="absolute inset-x-0 top-0 flex flex-col items-center px-6 pt-12 text-center">
            <div className="tk-en text-[11px] font-semibold" style={{ color: "var(--tk-mint)" }}>SEOUL SEOBU CENTRAL MARKET</div>
            <Rise delay={0.2}><p className="mt-5 text-[15px] leading-[1.7]" style={{ color: "#c3d6d2" }}>시장이 머물던 자리에,</p></Rise>
            <Rise delay={0.35}><p className="text-[21px] font-bold leading-[1.6] text-white">사람이 사는 집과 동네의 내일을.</p></Rise>
          </div>
          <span className="absolute bottom-3 left-3 bg-white/85 px-1.5 py-0.5 text-[10px]" style={{ color: "var(--tk-char)" }}>AI 영상 · 예시</span>
        </section>

        <footer className="px-6 pt-10 pb-12" style={{ background: "#081a18", color: "#86a39f" }}>
          <div className="tk-en text-[11px] font-semibold" style={{ color: "var(--tk-coral2)" }}>SEOUL SEOBU CENTRAL MARKET</div>
          <div className="mt-1 text-[16px] font-bold text-white">{PROJECT.nameKo}</div>
          <p className="mt-4 text-[12px] leading-[1.8]">{PROJECT.operators.join(" · ")}<br />{PROJECT.address}</p>
          <p className="mt-5 text-[11px] leading-[1.7]" style={{ color: "#5f7e79" }}>
            이 페이지는 사업 소개를 위한 임시 홈페이지입니다. 조감도·입면도·현황사진은 사업계획서(2025.02)에 수록된 자료이며 설계에 따라 변경될 수 있습니다. &lsquo;AI 이미지·영상&rsquo; 표시가 있는 자료는 이해를 돕기 위한 예시로 실제와 다를 수 있습니다. 규모·주택형·일정은 최신 인허가 자료와 대조 후 확정됩니다.
          </p>
          <p className="tk-en mt-5 text-[10.5px]">© 2026 SEOUL SEOBU CENTRAL MARKET</p>
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
