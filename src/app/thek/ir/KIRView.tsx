"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PROJECT, CEO, FLOORS, CANDIDATES, ROOMS, CHECKS, ROADMAP, JOURNEY, LOCATION } from "../data";
import { SCEN, PHASE2, CAPEX1, CAPEX1_SUM, CAPEX2_ADD, COST1, FIXED1, ROOMS1N, ROOMS_ALL } from "../finance";

/*
 * THE K 스마트호스텔(가칭) IR — 모바일 전용 웹 프레젠테이션
 * 원칙: 투명도 애니메이션 없이 위치·크기·모양·마스크·색만 움직인다 (갤럭시 빈 화면 방지)
 * 근거: 감정평가서(2021.10.28) · 임대현황표(2026.02.28) · 분양 브로슈어 · 소유주 측 확인(2·3·4층 명도 가능 · 5층 놀이층, 2026.11)
 * 재무 수치는 모두 설계·시장조사 전 가정(안)이며, 계산식은 아래 FIN에 그대로 남겨 둔다.
 */

const IMG = (f: string) => `/thek/img/${f}.webp`;
const VID = (f: string) => `/thek/video/${f}`;
const EASE = [0.16, 1, 0.3, 1] as const;

/* ───────── 재무 가정 (안): ../finance.ts 한 곳에서 계산 ───────── */
const S1 = SCEN[1];
const PAY1 = CAPEX1_SUM / S1.yEb;
const PAY2 = (CAPEX1_SUM + CAPEX2_ADD) / PHASE2.yEb;

type Ctx = { go: (n: number) => void; active: boolean };
type Slide = { id: string; ch: number; photo?: string; pos?: string; render: (c: Ctx) => ReactNode };
const CHAPTERS = ["표지", "개요", "브랜드", "입지 · 건물", "공간 · 객실", "스마트 운영", "사업성 (안)", "실행 계획", "제안"];

/* ───────── 공통 조각 ───────── */
const wrap = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } };
const item = { hidden: { y: 34, scale: 0.97 }, show: { y: 0, scale: 1, transition: { duration: 0.9, ease: EASE } } };
function S({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <motion.div variants={wrap} initial="hidden" animate="show" className={className}>{children}</motion.div>;
}
function It({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <motion.div variants={item} className={className}>{children}</motion.div>;
}

/* 오도미터 숫자 */
function Count({ to, d = 0, delay = 0.35 }: { to: number; d?: number; delay?: number }) {
  const str = to.toLocaleString("ko-KR", { minimumFractionDigits: d, maximumFractionDigits: d });
  let di = 0;
  return (
    <span className="inline-flex items-start" style={{ height: "1em", lineHeight: 1, color: "#e3c78d", WebkitTextFillColor: "#e3c78d" }} aria-label={str}>
      {str.split("").map((ch, k) => {
        if (!/\d/.test(ch)) return <span key={k} aria-hidden="true" style={{ lineHeight: 1 }}>{ch}</span>;
        const n = Number(ch); const order = di++;
        return (
          <span key={k} aria-hidden="true" className="relative inline-block overflow-hidden text-center" style={{ height: "1em", width: "0.56em" }}>
            <motion.span className="absolute inset-x-0 top-0 flex flex-col" initial={{ y: "0em" }} animate={{ y: `${-(n + 10)}em` }}
              transition={{ duration: 1.5 + order * 0.12, delay: delay + order * 0.06, ease: EASE }}>
              {Array.from({ length: 20 }, (_, m) => <span key={m} style={{ height: "1em", lineHeight: 1 }}>{m % 10}</span>)}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}

function Head({ ey, t, sub }: { ey: string; t: ReactNode; sub?: ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2.5">
        <motion.span className="block h-px w-8 origin-left" style={{ background: "var(--k-gold)" }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.1, ease: EASE }} />
        <p className="corm text-[14px] font-semibold uppercase tracking-[0.28em]" style={{ color: "var(--k-gold)" }}>{ey}</p>
      </div>
      <h2 className="serif mt-2.5 overflow-hidden text-[25px] font-bold leading-[1.38]">
        <motion.span className="block" initial={{ y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 0.95, delay: 0.2, ease: EASE }}>{t}</motion.span>
      </h2>
      {sub && <motion.p className="mt-3 text-[13.5px] leading-[1.75]" style={{ color: "var(--k-sub)" }} initial={{ y: 16 }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.35, ease: EASE }}>{sub}</motion.p>}
    </div>
  );
}

function Body({ children, center, bottom }: { children: ReactNode; center?: boolean; bottom?: boolean }) {
  return (
    <div className="scroll relative z-10 h-full px-5 pb-[98px] pt-[78px]">
      <div className={`flex min-h-full flex-col ${center ? "justify-center" : ""} ${bottom ? "justify-end" : ""}`}>{children}</div>
    </div>
  );
}

/* 마스크로 열리며 천천히 다가오는 사진 */
function Pic({ src, alt, className = "", pos = "center", cap, delay = 0.15 }: { src: string; alt: string; className?: string; pos?: string; cap?: string; delay?: number }) {
  return (
    <motion.div className={`relative overflow-hidden ${className}`} initial={{ clipPath: "inset(0% 0% 100% 0% round 18px)" }} animate={{ clipPath: "inset(0% 0% 0% 0% round 18px)" }} transition={{ duration: 1.1, delay, ease: EASE }}>
      <motion.img src={src} alt={alt} className="h-full w-full object-cover" style={{ objectPosition: pos }} initial={{ scale: 1.22 }} animate={{ scale: 1.03 }} transition={{ duration: 7, ease: "easeOut" }} />
      {cap && <span className="absolute bottom-2 left-2 rounded bg-black/55 px-1.5 py-0.5 text-[9.5px] text-white/90">{cap}</span>}
    </motion.div>
  );
}

function Src({ children }: { children: ReactNode }) {
  return <It><p className="mt-5 text-[10.5px] leading-relaxed" style={{ color: "var(--k-mute)" }}>{children}</p></It>;
}

/* 금색 테두리 원형 아이콘 */
function Ico({ d, size = 22 }: { d: string; size?: number }) {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border" style={{ borderColor: "var(--k-line)", color: "var(--k-gold)", background: "rgba(201,169,110,.08)" }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
    </span>
  );
}
const IC = {
  bed: "M3 18V8 M3 13h18v5 M21 18v-3 M7 13V10h5v3",
  key: "M14 10a4 4 0 1 0-3.5 4L9 15.5V18h2.5v-2H13l1.5-1.5 M15.5 8.5h.01",
  shield: "M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6z M9 12l2 2 4-4",
  sofa: "M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3 M3 11h18v5H3z M5 16v2 M19 16v2",
  chart: "M4 20V4 M4 20h16 M8 16v-4 M12 16V8 M16 16v-6",
  bolt: "M13 3L5 14h6l-1 7 8-11h-6z",
  pin: "M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  brief: "M4 8h16v11H4z M9 8V5h6v3 M4 13h16",
  users: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M2.5 20a6.5 6.5 0 0 1 13 0 M16 4.5a3.5 3.5 0 0 1 0 6.5 M18 14a6 6 0 0 1 3.5 6",
  map: "M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z M9 4v14 M15 6v14",
  home: "M3 11l9-7 9 7 M5 10v10h14V10 M10 20v-6h4v6",
  layers: "M12 3l9 5-9 5-9-5z M3 13l9 5 9-5 M3 17l9 5 9-5",
  phone: "M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z M11 18h2",
  check: "M5 12l5 5L20 7",
  hand: "M7 11V6a1.5 1.5 0 0 1 3 0v4 M10 10V4.5a1.5 1.5 0 0 1 3 0V10 M13 10V5.5a1.5 1.5 0 0 1 3 0V12 M16 9a1.5 1.5 0 0 1 3 0v4a7 7 0 0 1-7 7h-1a6 6 0 0 1-5-3l-2-4a1.5 1.5 0 0 1 2.6-1.5L7 13",
};

const won = (v: number, d = 0) => v.toLocaleString("ko-KR", { minimumFractionDigits: d, maximumFractionDigits: d });

/* 브랜드 필름: 장이 열려 있을 때만 무음 재생 */
function FilmSlide({ active }: { active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => { const v = ref.current; if (!v) return; if (active) v.play().catch(() => {}); else v.pause(); }, [active]);
  return (
    <motion.div className="relative mx-auto w-[86%] overflow-hidden rounded-[22px] shadow-[0_30px_80px_rgba(0,0,0,.5)]" style={{ aspectRatio: "9 / 16", maxHeight: "58dvh" }}
      initial={{ clipPath: "inset(50% 50% 50% 50% round 22px)" }} animate={{ clipPath: "inset(0% 0% 0% 0% round 22px)" }} transition={{ duration: 1.2, ease: EASE }}>
      <video ref={ref} src={VID("brand_film.mp4")} poster={VID("film-poster.webp")} muted loop playsInline preload="metadata" className="h-full w-full object-cover" />
      <span className="absolute left-2 top-2 rounded bg-black/55 px-1.5 py-0.5 text-[9.5px] text-white/90">AI 영상 · 예시</span>
    </motion.div>
  );
}

/* 관제 화면 미니어처 */
function Dash() {
  const [cells, setCells] = useState<number[]>(() => Array.from({ length: 18 }, (_, i) => ((i * 7) % 5 === 0 ? 2 : (i * 3) % 4 === 0 ? 1 : 0)));
  useEffect(() => {
    const t = setInterval(() => setCells((c) => { const n = [...c]; const k = Math.floor(Math.random() * n.length); n[k] = (n[k] + 1) % 3; return n; }), 1600);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="glass rounded-2xl p-3.5">
      <div className="flex items-center justify-between text-[10.5px]">
        <span className="flex items-center gap-1.5"><span className="pulse inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />LIVE · 2F</span>
        <span style={{ color: "var(--k-sub)" }}>관제 화면 예시</span>
      </div>
      <div className="mt-2.5 grid grid-cols-6 gap-1">
        {cells.map((c, i) => (
          <motion.div key={i} className="flex h-7 items-center justify-center rounded text-[8.5px] font-bold" animate={{ backgroundColor: c === 0 ? "#ecdcb6" : c === 1 ? "#5fb7a0" : "#1d2f4f", color: c === 2 ? "#6f7d93" : "#0a1322" }} transition={{ duration: 0.5 }}>{String(i + 1).padStart(2, "0")}</motion.div>
        ))}
      </div>
      <div className="mt-2 flex gap-3 text-[9.5px]" style={{ color: "var(--k-sub)" }}>
        <span><i className="mr-1 inline-block h-2 w-2 rounded-sm align-middle" style={{ background: "#ecdcb6" }} />투숙</span>
        <span><i className="mr-1 inline-block h-2 w-2 rounded-sm align-middle" style={{ background: "#5fb7a0" }} />청소·점검</span>
        <span><i className="mr-1 inline-block h-2 w-2 rounded-sm align-middle" style={{ background: "#1d2f4f" }} />빈 방 절전</span>
      </div>
    </div>
  );
}

/* 도넛 (객실 구성) */
function Donut({ data, size = 170 }: { data: { v: number; c: string }[]; size?: number }) {
  const total = data.reduce((s, d) => s + d.v, 0); const R = 70; const C = 2 * Math.PI * R; let acc = 0;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className="-rotate-90">
      <circle cx="100" cy="100" r={R} fill="none" stroke="#1d2f4f" strokeWidth="22" />
      {data.map((d, i) => {
        const len = (d.v / total) * C; const off = acc; acc += len;
        return <motion.circle key={i} cx="100" cy="100" r={R} fill="none" stroke={d.c} strokeWidth="22" strokeDasharray={`${len - 2} ${C}`}
          initial={{ strokeDashoffset: len }} animate={{ strokeDashoffset: -off }} transition={{ duration: 1.3, delay: 0.4 + i * 0.2, ease: EASE }} />;
      })}
    </svg>
  );
}

/* 지도 그래픽 (도식) */
function MapArt() {
  return (
    <svg viewBox="0 0 320 220" className="w-full">
      <defs><radialGradient id="kg" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#c9a96e" stopOpacity=".55" /><stop offset="1" stopColor="#c9a96e" stopOpacity="0" /></radialGradient></defs>
      <rect width="320" height="220" rx="18" fill="#0f1b30" />
      {[40, 80, 120, 160, 200, 240, 280].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="220" stroke="#16253f" />)}
      {[40, 80, 120, 160, 200].map((y) => <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="#16253f" />)}
      <motion.path d="M-10 150 C 60 140, 90 100, 150 108 S 260 70, 330 60" fill="none" stroke="#2c4a75" strokeWidth="9" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: "easeInOut" }} />
      <motion.path d="M30 -10 C 70 60, 120 90, 150 108 S 200 180, 210 230" fill="none" stroke="#24406a" strokeWidth="6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, delay: 0.2, ease: "easeInOut" }} />
      <motion.path d="M-10 70 C 80 80, 120 40, 330 30" fill="none" stroke="#c9a96e" strokeWidth="2" strokeDasharray="6 5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.4, ease: "easeInOut" }} />
      <text x="250" y="24" fontSize="9" fill="#c9a96e">경의중앙선</text>
      <motion.circle cx="150" cy="108" r="16" fill="none" stroke="#c9a96e" strokeWidth="1.5" initial={{ scale: 0 }} animate={{ scale: [0, 1, 1.25, 1] }} style={{ transformOrigin: "150px 108px" }} transition={{ duration: 1.4, delay: 0.9 }} />
      <text x="128" y="96" fontSize="8.5" fill="#9eabbf">금촌로터리</text>
      <circle cx="166" cy="128" r="40" fill="url(#kg)" />
      <motion.g initial={{ y: -30 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 180, damping: 12, delay: 1.2 }}>
        <path d="M166 104c-8 0-14 6-14 14 0 10 14 22 14 22s14-12 14-22c0-8-6-14-14-14z" fill="#e2734a" />
        <circle cx="166" cy="118" r="5" fill="#fff" />
      </motion.g>
      <rect x="186" y="132" width="98" height="26" rx="6" fill="#0a1322" stroke="#c9a96e" strokeWidth=".8" />
      <text x="235" y="149" fontSize="10" fill="#ecdcb6" textAnchor="middle" fontWeight="700">THE K 빌딩</text>
      <text x="16" y="208" fontSize="8" fill="#6f7d93">위치 도식 (실제 축척 아님)</text>
    </svg>
  );
}

/* ───────── 슬라이드 ───────── */
const SLIDES: Slide[] = [
  /* 01 표지 */
  { id: "cover", ch: 0, render: ({ active }) => (
    <>
      <video src={VID("hero.mp4")} poster={VID("hero-poster.webp")} autoPlay={active} muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,19,34,.82) 0%, rgba(10,19,34,.2) 38%, rgba(10,19,34,.35) 62%, #0a1322 100%)" }} />
      <Body bottom>
        <S>
          <It className="flex items-center gap-3"><motion.span className="block h-px w-10 origin-left" style={{ background: "var(--k-gold)" }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9, delay: 0.4 }} /><p className="corm text-[14px] font-semibold uppercase tracking-[0.32em]" style={{ color: "var(--k-gold)" }}>Business Plan & IR 2026</p></It>
          <h1 className="mt-3 overflow-hidden text-[52px] font-black leading-[1.02] tracking-tight"><motion.span className="block" initial={{ y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 1, delay: 0.3, ease: EASE }}>THE K<span style={{ color: "var(--k-coral)" }}>.</span></motion.span></h1>
          <It><p className="corm text-[22px] font-semibold uppercase tracking-[0.34em] goldtext">Smart Hostel</p></It>
          <It><p className="serif mt-4 text-[17px] font-medium leading-[1.6]">파주 금촌, 머무는 방식이<br />스마트해집니다</p></It>
          <It><p className="mt-3 text-[11.5px] tracking-wide" style={{ color: "var(--k-sub)" }}>더케이 스마트호스텔(가칭) 사업계획서 · 투자제안서 · 2026. 11</p></It>
          <It><p className="hint mt-6 flex items-center gap-2 text-[12.5px] font-semibold" style={{ color: "var(--k-champ)" }}>옆으로 밀어 넘겨 보세요 <span aria-hidden="true">→</span></p></It>
        </S>
      </Body>
    </>
  ) },

  /* 02 목차 */
  { id: "contents", ch: 0, render: ({ go }) => (
    <Body center>
      <S>
        <Head ey="Contents" t="목차" />
        <div className="mt-5 grid">
          {CHAPTERS.slice(1).map((c, k) => {
            const start = SLIDES.findIndex((x) => x.ch === k + 1);
            return (
              <It key={c}>
                <button type="button" onClick={() => go(start)} className="flex w-full items-center gap-4 border-t py-3 text-left" style={{ borderColor: "var(--k-line)" }}>
                  <span className="corm w-9 text-[30px] font-semibold leading-none goldtext">{String(k + 1).padStart(2, "0")}</span>
                  <span className="serif flex-1 text-[17px] font-bold">{c}</span>
                  <span className="text-[11px]" style={{ color: "var(--k-mute)" }}>{String(start + 1).padStart(2, "0")}</span>
                </button>
              </It>
            );
          })}
        </div>
      </S>
    </Body>
  ) },

  /* 03 요약 */
  { id: "summary", ch: 1, render: () => (
    <Body center>
      <S>
        <Head ey="Executive Summary" t={<>머물고, 일하고, 놀고 —<br />한 건물의 스마트호스텔</>} sub="2020년 준공된 파주 금촌 The K 빌딩 3·4층을 프런트 없이 AI·IoT로 운영하는 호스텔로 전환합니다." />
        <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl" style={{ background: "var(--k-line)" }}>
          {[[ROOMS1N, "실", "1단계 객실 (안)", "3·4층 8개 호실"], [950, "㎡", "1단계 전용면적", "두 개 층"], [ROOMS_ALL, "실", "2단계 확장 시 (안)", "2층 추가"], [24, "h", "무인 운영", "모바일 체크인 · 원격 관제"]].map(([v, u, l, s]) => (
            <It key={l as string} className="bg-[#111e35] p-4">
              <p className="text-[11.5px]" style={{ color: "var(--k-sub)" }}>{l}</p>
              <p className="corm mt-1 text-[44px] font-semibold leading-none goldtext"><Count to={v as number} /><span className="ml-0.5 text-[20px]">{u}</span></p>
              <p className="mt-1.5 text-[11px]" style={{ color: "var(--k-mute)" }}>{s}</p>
            </It>
          ))}
        </div>
        <It className="glass mt-4 rounded-2xl p-4 text-[13px] leading-[1.75]" ><b style={{ color: "var(--k-champ)" }}>전략</b>  관광진흥법상 호스텔업 등록을 추진하고, 유학생·외국인 근로자 장기 투숙과 단기 숙박을 함께 운영해 안정성과 수익성을 동시에 잡습니다.</It>
        <Src>출처: 감정평가서(2021) · 임대현황표(2026.02.28) · 소유주 측 확인(2·3·4층 명도 가능) · 객실 수는 설계 전 가정(안)</Src>
      </S>
    </Body>
  ) },

  /* 04 투자 포인트 */
  { id: "points", ch: 1, render: () => (
    <Body center>
      <S>
        <Head ey="Investment Highlights" t="핵심 투자 포인트" />
        <div className="mt-5 grid gap-2.5">
          {[[IC.home, "준공 6년 차 신축급 건물", "지하 1층·지상 5층, 엘리베이터·스프링클러·주차 39대"], [IC.layers, "한 건물에서 머물고 놀고", "3·4층 호스텔 · 5층 놀이층(코인노래방·놀숲·당구장) · 1층 K-편의점"], [IC.key, "인건비를 줄인 무인 운영", "모바일 체크인·원격 관제로 프런트 상주 인력 최소화"], [IC.chart, "장기 + 단기 혼합 운영", "유학생·외국인 근로자 장기 투숙이 바닥을, 단기·데이 유스가 수익을"], [IC.pin, "넉넉한 주차 · K-편의점", "자주식 39대, 1층 편의점은 24시간 간편식사·한강라면 K문화 체험"]].map(([ic, t, d], i) => (
            <It key={t} className={`flex items-center gap-3.5 rounded-2xl p-3.5 ${i === 3 ? "border border-[#c9a96e]" : "glass"}`}>
              <Ico d={ic} />
              <span className="flex-1"><span className="serif block text-[15px] font-bold" style={{ color: i === 3 ? "var(--k-champ)" : undefined }}>{t}</span><span className="mt-0.5 block text-[12px] leading-snug" style={{ color: "var(--k-sub)" }}>{d}</span></span>
              <span className="corm text-[22px] font-semibold goldtext">{String(i + 1).padStart(2, "0")}</span>
            </It>
          ))}
        </div>
      </S>
    </Body>
  ) },

  /* 05 비전 */
  { id: "vision", ch: 2, photo: "lounge", pos: "50% 55%", render: () => (
    <Body bottom>
      <S>
        <Head ey="Brand Vision" t={<>Stay smart,<br /><span className="goldtext">live local.</span></>} sub="호텔의 깔끔함과 호스텔의 합리적인 가격, 동네에 사는 듯한 일상을 한 건물에 담습니다." />
        <div className="mt-6 grid grid-cols-3 gap-2">
          {[[IC.bed, "STAY", "머물다"], [IC.brief, "WORK", "일하다"], [IC.users, "CONNECT", "연결하다"]].map(([ic, en, ko], i) => (
            <It key={en} className="glass flex flex-col items-center rounded-2xl py-4">
              <motion.div initial={{ rotate: -90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ duration: 0.8, delay: 0.5 + i * 0.12, ease: EASE }}><Ico d={ic} /></motion.div>
              <span className="corm mt-2 text-[15px] font-bold tracking-[0.2em]" style={{ color: "var(--k-champ)" }}>{en}</span>
              <span className="text-[11px]" style={{ color: "var(--k-sub)" }}>{ko}</span>
            </It>
          ))}
        </div>
      </S>
    </Body>
  ) },

  /* 06 브랜드 아이덴티티 */
  { id: "identity", ch: 2, render: () => (
    <Body center>
      <S>
        <Head ey="Brand Identity" t="세 개의 약속" />
        <It className="relative mx-auto mt-6 flex h-[150px] w-[150px] items-center justify-center">
          <motion.div className="liquid absolute inset-0" style={{ background: "linear-gradient(135deg,#1d2f4f,#0f1b30)", border: "1px solid var(--k-line)" }} />
          <motion.span className="relative text-[64px] font-black leading-none" initial={{ scale: 0.4, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 140, damping: 12, delay: 0.4 }}><span className="goldtext">K</span><span style={{ color: "var(--k-coral)" }}>.</span></motion.span>
        </It>
        <div className="mt-6 grid gap-2.5">
          {[["SMART STAY", "프런트 없는 체크인", "예약부터 체크아웃까지 휴대폰 하나로. 늦은 밤 도착해도 기다릴 필요가 없습니다."], ["SMART LOUNGE", "함께 쓰는 거실", "혼자 머물러도 외롭지 않게, 일하고 쉬고 이야기하는 공유 라운지."], ["AI SECURITY", "AI가 지키는 밤", "출입 기록·공용부 모니터링·이상 신호 즉시 알림으로 24시간 안전하게."]].map(([en, t, d]) => (
            <It key={en} className="glass rounded-2xl p-4">
              <p className="corm text-[12.5px] font-bold tracking-[0.24em]" style={{ color: "var(--k-gold)" }}>{en}</p>
              <p className="serif text-[16px] font-bold">{t}</p>
              <p className="mt-1 text-[12.5px] leading-[1.6]" style={{ color: "var(--k-sub)" }}>{d}</p>
            </It>
          ))}
        </div>
      </S>
    </Body>
  ) },

  /* 07 대표 인사말 */
  { id: "ceo", ch: 2, render: () => (
    <Body>
      <S>
        <It className="relative">
          <Pic src={IMG("ceo")} alt={`${CEO.title} ${CEO.name}`} pos="50% 20%" className="h-[300px] w-full" />
          <div className="absolute inset-x-0 bottom-0 h-24 rounded-b-[18px]" style={{ background: "linear-gradient(180deg,transparent,#0a1322)" }} />
        </It>
        <div className="-mt-6 relative">
          <Head ey="CEO Message" t={<>{CEO.headline[0]}<br /><span className="goldtext">{CEO.headline[1]}</span></>} />
        </div>
        <It><p className="mt-4 text-[13px] leading-[1.9]" style={{ color: "#c9d2df" }}>{CEO.body[0]} {CEO.body[1]}</p></It>
        <It><p className="mt-3 text-[13px] leading-[1.9]" style={{ color: "#c9d2df" }}>{CEO.body[3]}</p></It>
        <It className="mt-5 flex items-end justify-between border-t border-[rgba(201,169,110,0.28)] pt-3">
          <div>
            <p className="text-[11px]" style={{ color: "var(--k-sub)" }}>{PROJECT.nameKo} {CEO.title}</p>
            <p className="serif text-[22px] font-bold tracking-[0.3em]">{CEO.name}</p>
          </div>
          <p className="text-right text-[10.5px] leading-[1.5]" style={{ color: "var(--k-mute)" }}>前 TV조선 보도국 · SBS 탐사보도팀<br />기자 15년 (2010–2025)</p>
        </It>
      </S>
    </Body>
  ) },

  /* 08 입지 */
  { id: "location", ch: 3, render: () => (
    <Body center>
      <S>
        <Head ey="Location" t={<>파주 금촌,<br />생활권 한가운데</>} />
        <It className="mt-5"><MapArt /></It>
        <div className="mt-4 grid gap-2">
          {LOCATION.map((l, i) => (
            <It key={l} className="flex items-start gap-3 text-[13px] leading-[1.6]">
              <span className="corm mt-[1px] text-[15px] font-bold goldtext">{String(i + 1).padStart(2, "0")}</span><span>{l}</span>
            </It>
          ))}
        </div>
        <Src>입지 문구: 감정평가서 &lsquo;대상부동산 개황&rsquo; · 역·관광지 거리는 현장 확인 후 표기</Src>
      </S>
    </Body>
  ) },

  /* 09 건물 개요 */
  { id: "building", ch: 3, render: () => (
    <Body center>
      <S>
        <Head ey="The K Building" t="건물 개요" />
        <div className="mt-5 grid grid-cols-[1fr_1fr] gap-2">
          <It><Pic src={IMG("real-nw")} alt="현재 건물 사진" className="h-[150px] w-full" cap="현재 · 감정평가서 사진" /></It>
          <It><Pic src={IMG("ext-2")} alt="스마트호스텔 외관 예시" className="h-[150px] w-full" pos="50% 40%" cap="오픈 후 예시 · AI" delay={0.3} /></It>
        </div>
        <It className="glass mt-4 rounded-2xl px-4 py-1">
          {[["소재지", "파주시 금촌동 958-12 외 (한마음2길 20)"], ["구조·규모", "철근콘크리트 · 지하 1층, 지상 5층"], ["연면적 / 대지", "4,414.16㎡ / 1,358.1㎡"], ["사용승인", "2020년 4월 20일"], ["구성", "구분건물 26개 호실"], ["설비", "승강기 · 스프링클러 · 화재탐지 · 주차 39대"], ["용도지역", "제2종일반주거지역"]].map(([k, v]) => (
            <div key={k} className="grid grid-cols-[86px_1fr] gap-2 border-b py-2.5 text-[12.5px] last:border-0" style={{ borderColor: "rgba(201,169,110,.15)" }}>
              <span style={{ color: "var(--k-gold)" }}>{k}</span><span>{v}</span>
            </div>
          ))}
        </It>
        <Src>출처: 감정평가서(중앙감정평가법인, 2021.10.28 기준) · 분양 브로슈어</Src>
      </S>
    </Body>
  ) },

  /* 10 공실 현황 */
  { id: "vacancy", ch: 3, render: () => {
    const vac = FLOORS.reduce((s, f) => s + f.units.filter((u) => u.s === "vacant").length, 0);
    return (
      <Body center>
        <S>
          <Head ey="Vacancy" t={<>비어 있는 <span className="goldtext"><Count to={vac} /></span>개 호실</>} sub="3·4층은 공실과 명도 가능 호실을 합쳐 호스텔로, 2층은 2단계 확장 공간으로 씁니다. 304호 노래방은 5층 놀이층으로 옮깁니다." />
          <div className="mt-6 space-y-1.5">
            {FLOORS.map((f, fi) => (
              <It key={f.f} className="flex items-center gap-2">
                <span className="corm w-8 text-[18px] font-bold" style={{ color: f.f === "3F" || f.f === "4F" ? "var(--k-champ)" : "var(--k-mute)" }}>{f.f}</span>
                <div className="flex flex-1 gap-1">
                  {f.units.map((u, ui) => (
                    <motion.div key={u.n} className="flex h-9 items-center justify-center rounded text-[9.5px] font-bold" style={{ flex: u.m2 }}
                      initial={{ scaleY: 0 }} animate={{ scaleY: 1, backgroundColor: u.s === "vacant" ? "#c9a96e" : u.s === "check" ? "#3a4a66" : "#1a2a46", color: u.s === "vacant" ? "#0a1322" : "#9eabbf" }}
                      transition={{ duration: 0.5, delay: 0.4 + fi * 0.08 + ui * 0.03, ease: EASE }}>{u.n}</motion.div>
                  ))}
                </div>
              </It>
            ))}
          </div>
          <It className="mt-3 flex gap-4 text-[11px]" ><span style={{ color: "var(--k-sub)" }}><i className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ background: "#c9a96e" }} />공실</span><span style={{ color: "var(--k-sub)" }}><i className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ background: "#1a2a46" }} />사용 중</span><span style={{ color: "var(--k-sub)" }}><i className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ background: "#3a4a66" }} />확인 필요</span></It>
          <Src>임대현황표(2026.02.28) 기준 사용/공실만 표시 · 칸 너비는 전용면적 비율 · 현황은 수시로 바뀜</Src>
        </S>
      </Body>
    );
  } },

  /* 11 후보 공간 */
  { id: "candidates", ch: 3, render: () => (
    <Body center>
      <S>
        <Head ey="Space Plan" t="1단계 3·4층, 확장 2층" />
        {CANDIDATES.map((c, i) => (
          <It key={c.k} className="glass mt-4 overflow-hidden rounded-2xl">
            <Pic src={IMG(c.img)} alt={`${c.f} 평면 투시도`} className="h-[120px] w-full" delay={0.25 + i * 0.2} />
            <div className="flex items-end justify-between px-4 pt-3">
              <div><p className="corm text-[12px] font-bold tracking-[0.22em]" style={{ color: "var(--k-gold)" }}>{i === 0 ? "PHASE 1" : "PHASE 2"}</p><p className="serif text-[16px] font-bold">{c.f}</p><p className="text-[11px]" style={{ color: "var(--k-sub)" }}>{c.units}</p></div>
              <p className="corm text-[26px] font-semibold goldtext">{c.m2.toFixed(0)}㎡</p>
            </div>
            <p className="px-4 pb-3.5 pt-1 text-[12px] leading-[1.6]" style={{ color: "var(--k-sub)" }}>{c.pros[0]} · {c.cons[0]}</p>
          </It>
        ))}
        <Src>평면 투시도: 분양 브로슈어 · 면적은 전용면적 합계</Src>
      </S>
    </Body>
  ) },

  /* 12 객실 구성 */
  { id: "mix", ch: 4, render: () => (
    <Body center>
      <S>
        <Head ey="Room Mix" t={`1단계 ${ROOMS1N}실 구성 (안)`} />
        <It className="relative mx-auto mt-5 flex items-center justify-center">
          <Donut data={ROOMS.map((r, k) => ({ v: r.n, c: ["#c9a96e", "#ecdcb6", "#e2734a"][k] }))} size={190} />
          <div className="absolute text-center"><p className="corm text-[48px] font-semibold leading-none goldtext"><Count to={ROOMS1N} /></p><p className="text-[11px]" style={{ color: "var(--k-sub)" }}>객실</p></div>
        </It>
        <div className="mt-5 grid gap-2">
          {ROOMS.map((r, i) => (
            <It key={r.k} className="glass flex items-center gap-3 rounded-xl px-4 py-3">
              <span className="h-3 w-3 rounded-full" style={{ background: ["#c9a96e", "#ecdcb6", "#e2734a"][i] }} />
              <span className="serif flex-1 text-[14.5px] font-bold">{r.t}</span>
              <span className="text-[12px]" style={{ color: "var(--k-sub)" }}>약 {r.m2}㎡ · {r.bed}</span>
              <span className="corm w-10 text-right text-[20px] font-bold goldtext">{r.n}실</span>
            </It>
          ))}
        </div>
        <Src>객실 크기·수는 설계 전 가정(안) · 3·4층 약 950㎡ 기준</Src>
      </S>
    </Body>
  ) },

  /* 13 객실 타입 */
  { id: "rooms", ch: 4, render: () => (
    <Body center>
      <S>
        <Head ey="Room Types" t="모든 객실에 개별 욕실" />
        <div className="mt-5 grid gap-2.5">
          {[["room-single", "스마트 싱글", "출장·단기 체류 1인", "4.5만 원~ / 1박 (안)"], ["room-double", "스마트 더블", "커플·2인 동행", "6만 원~ / 1박 (안)"], ["room-family", "패밀리 트윈", "가족·소규모 일행 3~4인", "8만 원~ / 1박 (안)"]].map(([f, t, d, p], i) => (
            <It key={f} className="glass grid grid-cols-[112px_1fr] gap-3 overflow-hidden rounded-2xl">
              <Pic src={IMG(f)} alt={`${t} (AI 이미지 예시)`} className="h-[108px] w-full" pos="50% 45%" delay={0.3 + i * 0.15} />
              <div className="py-3 pr-3">
                <p className="serif text-[15.5px] font-bold">{t}</p>
                <p className="mt-0.5 text-[12px]" style={{ color: "var(--k-sub)" }}>{d}</p>
                <p className="corm mt-2 text-[16px] font-bold goldtext">{p}</p>
              </div>
            </It>
          ))}
        </div>
        <Src>객실 사진은 AI 이미지 예시 · 요금은 주변 시세 조사 전 가정</Src>
      </S>
    </Body>
  ) },

  /* 14 장기 체류 */
  { id: "longstay", ch: 4, photo: "longstay", pos: "50% 40%", render: () => (
    <Body bottom>
      <S>
        <Head ey="Long Stay · STAY 30" t={<>하루를 머물러도,<br /><span className="goldtext">한 달을 살아도</span></>} />
        <div className="mt-5 grid grid-cols-3 gap-2">
          {ROOMS.map((r) => (
            <It key={r.k} className="glass rounded-xl p-3 text-center">
              <p className="text-[11px]" style={{ color: "var(--k-sub)" }}>{r.t.replace("스마트 ", "")}</p>
              <p className="corm text-[24px] font-bold leading-tight goldtext">{r.month}<span className="text-[13px]">만</span></p>
              <p className="text-[10px]" style={{ color: "var(--k-mute)" }}>월 (안)</p>
            </It>
          ))}
        </div>
        <It className="glass mt-3 rounded-2xl p-4 text-[12.5px] leading-[1.8]" >주 1회 청소·침구 교체 · 업무 라운지·공유 주방 · 택배 수령 · 보증금 부담 최소화<br /><span style={{ color: "var(--k-sub)" }}>유학생·외국인 근로자의 장기 투숙이 매출의 바닥을 받칩니다.</span></It>
      </S>
    </Body>
  ) },

  /* 15 공용시설 */
  { id: "facilities", ch: 4, render: () => (
    <Body center>
      <S>
        <Head ey="Facilities" t="방 밖의 시간까지, 한 건물에서" />
        <div className="mt-5 grid grid-cols-2 gap-2">
          {[["lounge", "스마트 라운지"], ["kitchen", "공유 주방"], ["work", "업무 존"], ["laundry", "세탁 · 스마트 락커"]].map(([f, t], i) => (
            <It key={f} className="relative">
              <Pic src={IMG(f)} alt={`${t} (AI 이미지 예시)`} className="h-[150px] w-full" pos="50% 45%" delay={0.25 + i * 0.12} />
              <div className="absolute inset-x-0 bottom-0 rounded-b-[18px] p-2.5" style={{ background: "linear-gradient(180deg,transparent,rgba(10,19,34,.92))" }}>
                <p className="serif text-[13.5px] font-bold">{t}</p>
              </div>
            </It>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {[["store", "1층 K-편의점", "간편식사 · 한강라면"], ["play", "5층 놀이층", "코인노래방 · 당구장"]].map(([f, t2, d], i) => (
            <It key={f} className="relative">
              <Pic src={IMG(f)} alt={`${t2} (AI 이미지 예시)`} className="h-[150px] w-full" pos="50% 40%" delay={0.7 + i * 0.12} />
              <div className="absolute inset-x-0 bottom-0 rounded-b-[18px] p-2.5" style={{ background: "linear-gradient(180deg,transparent,rgba(10,19,34,.92))" }}>
                <p className="serif text-[13px] font-bold">{t2}</p><p className="text-[9.5px]" style={{ color: "var(--k-champ)" }}>{d}</p>
              </div>
            </It>
          ))}
        </div>
        <Src>AI 이미지 예시 · 공용공간 구성은 설계 후 확정 · 편의점·놀이층은 유치 계획</Src>
      </S>
    </Body>
  ) },

  /* 16 스마트 운영 */
  { id: "journey", ch: 5, render: () => (
    <Body center>
      <S>
        <Head ey="Smart Operation" t={<>예약부터 체크아웃까지<br />휴대폰 하나로</>} />
        <div className="relative mt-6 pl-9">
          <motion.div className="absolute bottom-3 left-[17px] top-3 w-px origin-top" style={{ background: "var(--k-gold)" }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1.8, delay: 0.3, ease: EASE }} />
          {JOURNEY.map((j, i) => (
            <It key={j.en} className="relative mb-4 last:mb-0">
              <motion.span className="absolute -left-9 top-0 flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold" style={{ background: i === 1 ? "var(--k-gold)" : "var(--k-navy2)", color: i === 1 ? "#0a1322" : "var(--k-champ)", border: "1px solid var(--k-line)" }}
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.5 + i * 0.15 }}>{String(i + 1).padStart(2, "0")}</motion.span>
              <p className="corm text-[11.5px] font-bold tracking-[0.22em]" style={{ color: "var(--k-gold)" }}>{j.en}</p>
              <p className="serif text-[15px] font-bold">{j.t}</p>
              <p className="mt-0.5 text-[12px] leading-[1.6]" style={{ color: "var(--k-sub)" }}>{j.d}</p>
            </It>
          ))}
        </div>
      </S>
    </Body>
  ) },

  /* 17 무인 체크인 */
  { id: "checkin", ch: 5, photo: "checkin", pos: "50% 35%", render: () => (
    <Body bottom>
      <S>
        <Head ey="Self Check-in" t={<>프런트 없이,<br /><span className="goldtext">기다림 없이</span></>} sub="키오스크나 휴대폰 QR로 들어오고, 객실 문은 모바일 키로 엽니다. 늦은 밤 도착해도 바로 쉴 수 있습니다." />
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[["24h", "체크인"], ["0명", "프런트 상주"], ["1개", "휴대폰이면 끝"]].map(([v, l]) => (
            <It key={l} className="glass rounded-xl py-3 text-center"><p className="corm text-[24px] font-bold goldtext">{v}</p><p className="text-[10.5px]" style={{ color: "var(--k-sub)" }}>{l}</p></It>
          ))}
        </div>
      </S>
    </Body>
  ) },

  /* 18 AI 보안 */
  { id: "security", ch: 5, render: () => (
    <Body center>
      <S>
        <Head ey="AI Security" t="사람 대신 AI가 지키는 밤" />
        <div className="mt-5 grid grid-cols-[0.9fr_1.1fr] gap-2.5">
          <It><Pic src={IMG("security")} alt="새벽 관제 화면을 확인하는 대표 (AI 영상 장면 예시)" className="h-[250px] w-full" pos="50% 35%" cap="AI 이미지 · 예시" /></It>
          <div className="grid content-start gap-2">
            {[[IC.bolt, "IoT 에너지", "빈 방 자동 절전"], [IC.shield, "원격 보안", "출입·화재 즉시 알림"], [IC.phone, "AI 컨시어지", "다국어 24시간 응답"]].map(([ic, t, d]) => (
              <It key={t} className="glass flex items-center gap-2.5 rounded-xl p-2.5"><Ico d={ic} size={18} /><div><p className="text-[13px] font-bold">{t}</p><p className="text-[10.5px]" style={{ color: "var(--k-sub)" }}>{d}</p></div></It>
            ))}
          </div>
        </div>
        <It className="mt-3"><Dash /></It>
        <Src>장비·솔루션 도입 범위는 설계 단계에서 확정</Src>
      </S>
    </Body>
  ) },

  /* 19 고객층 */
  { id: "segments", ch: 5, render: () => (
    <Body center>
      <S>
        <Head ey="Target" t="누가 머물까" sub="파주를 찾는 단기·중기 체류객을 네 그룹으로 나눠, 객실·요금·서비스를 맞춥니다." />
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          {[[IC.users, "유학생 · 외국인 근로자", "중동·대만·동남아 출신 장기 투숙", "월 단위"], [IC.brief, "출장 · 파견", "산업단지·공사 현장 단기 근무자", "평일 · 1~4주"], [IC.map, "관광 · 여행", "임진각·DMZ, 헤이리, 출판도시", "주말·성수기"], [IC.home, "데이 유스", "낮 시간 휴식·업무 시간제 이용", "당일"]].map(([ic, t, d, tag], i) => (
            <It key={t} className="glass rounded-2xl p-3.5">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.45 + i * 0.1 }}><Ico d={ic} size={19} /></motion.div>
              <p className="serif mt-2 text-[14.5px] font-bold">{t}</p>
              <p className="mt-0.5 text-[11.5px] leading-[1.5]" style={{ color: "var(--k-sub)" }}>{d}</p>
              <p className="mt-2 inline-block rounded-full px-2 py-0.5 text-[10px]" style={{ background: "rgba(201,169,110,.14)", color: "var(--k-champ)" }}>{tag}</p>
            </It>
          ))}
        </div>
        <Src>장기 투숙·데이 유스 수요는 소유주 측 현장 의견 · 시장조사 후 보완</Src>
      </S>
    </Body>
  ) },

  /* 20 왜 지금 */
  { id: "whynow", ch: 6, render: () => (
    <Body center>
      <S>
        <Head ey="Why Now" t={<>호스텔이 다시<br /><span className="goldtext">주목받는 이유</span></>} />
        <div className="mt-5 grid gap-2.5">
          {[[IC.map, "방한 외국인 증가 · 숙박 수요 다변화", "호스텔 등 다양한 숙박 형태에 대한 관심 확대 (야놀자파트너스 보도자료, 2026.08)"], [IC.brief, "대형 플랫폼의 호스텔 진출", "야놀자파트너스, 브랜드 호스텔 '스테이 아리재' 론칭 · 호스텔 사업자 컨설팅 확대"], [IC.users, "금촌의 장기 투숙 수요", "중동·대만·동남아 유학생과 근로자 — 소유주 측 현장 의견"], [IC.key, "무인 운영의 비용 경쟁력", "프런트 인력 없이 데이 유스·야간 체크인까지 대응"]].map(([ic, t2, d]) => (
            <It key={t2} className="glass flex items-center gap-3.5 rounded-2xl p-3.5"><Ico d={ic} /><div><p className="serif text-[14.5px] font-bold">{t2}</p><p className="mt-0.5 text-[11.5px] leading-[1.55]" style={{ color: "var(--k-sub)" }}>{d}</p></div></It>
          ))}
        </div>
        <Src>출처: 야놀자 보도자료 &lsquo;야놀자파트너스, 브랜드 호스텔 스테이 아리재 론칭&rsquo;(2026.08.07) · 현장 의견은 시장조사로 보완</Src>
      </S>
    </Body>
  ) },

  /* 21 단계 전략 */
  { id: "phases", ch: 6, render: () => (
    <Body center>
      <S>
        <Head ey="Phased Strategy" t={<>두 개 층으로 열고,<br />검증하며 넓힙니다</>} />
        <div className="relative mt-6">
          <motion.div className="absolute bottom-6 left-[22px] top-6 w-[2px] origin-top" style={{ background: "linear-gradient(var(--k-gold),var(--k-coral))" }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1.6, delay: 0.4, ease: EASE }} />
          {[["준비", "인허가 · 명도", "호스텔업 등록 요건 확인 · 3·4층 명도 · 노래방 5층 이전 · 신탁 동의", "파주시 확인 후 설계·공사 착수"], ["1단계", `3·4층 ${ROOMS1N}실 오픈`, "장기 투숙 + 단기 숙박 혼합 운영", `투자 약 ${CAPEX1_SUM.toFixed(1)}억 원 (안)`], ["2단계", `2층 · 총 ${ROOMS_ALL}실`, "공실 4개 호실 + 202호 명도로 20실 추가", `추가 투자 약 ${CAPEX2_ADD.toFixed(1)}억 원 (안)`]].map(([k, t2, s2, d], i) => (
            <It key={k} className="relative mb-3 flex gap-4 last:mb-0">
              <motion.span className="relative z-10 flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full text-[12px] font-bold" style={{ background: i === 1 ? "var(--k-gold)" : "var(--k-navy2)", color: i === 1 ? "#0a1322" : "var(--k-champ)", border: "1px solid var(--k-line)" }}
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.6 + i * 0.25 }}>{k}</motion.span>
              <div className="glass flex-1 rounded-2xl p-3.5">
                <p className="serif text-[15.5px] font-bold">{t2}</p>
                <p className="mt-0.5 text-[11.5px]" style={{ color: "var(--k-sub)" }}>{s2}</p>
                <p className="mt-2 text-[12px]" style={{ color: "var(--k-champ)" }}>{d}</p>
              </div>
            </It>
          ))}
        </div>
        <Src>등록이 늦어지면 2층 공실(500㎡ 미만)을 다중생활시설로 먼저 운영하는 대안을 둡니다</Src>
      </S>
    </Body>
  ) },

  /* 22 매출 시뮬레이션 */
  { id: "revenue", ch: 6, render: () => {
    const max = Math.max(...SCEN.map((p) => p.yRev));
    return (
      <Body center>
        <S>
          <Head ey="Revenue (안)" t={`1단계 ${ROOMS1N}실 연 매출 시뮬레이션`} />
          <div className="mt-7 flex h-[230px] items-end justify-around gap-3 border-b px-2" style={{ borderColor: "var(--k-line)" }}>
            {SCEN.map((p, i) => (
              <div key={p.k} className="flex flex-1 flex-col items-center">
                <p className="corm mb-1.5 text-[22px] font-bold goldtext"><Count to={p.yRev} d={2} delay={0.6 + i * 0.2} /><span className="text-[12px]">억</span></p>
                <motion.div className="w-full max-w-[64px] origin-bottom rounded-t-lg" style={{ height: `${(p.yRev / max) * 170}px`, background: i === 0 ? "linear-gradient(#ecdcb6,#9c8050)" : i === 1 ? "linear-gradient(#c9a96e,#7a5f33)" : "linear-gradient(#e2734a,#8a3f22)" }}
                  initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1.2, delay: 0.5 + i * 0.2, ease: EASE }} />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-around text-center">
            {SCEN.map((p) => <div key={p.k} className="flex-1"><p className="text-[12px] font-bold">{p.k}</p><p className="text-[9.5px] leading-tight" style={{ color: "var(--k-mute)" }}>{p.d}</p></div>)}
          </div>
          <It className="glass mt-5 rounded-2xl p-3.5 text-[11.5px] leading-[1.8] text-[#9eabbf]">
            장기 투숙: 월 요금 × 입실률 90%<br />단기 숙박: 1박 요금 × 30일 × 가동률<br />부가매출: 데이 유스·편의점 임대·세탁 등 객실 매출의 5%<br />2단계 {ROOMS_ALL}실(기준): 연 약 {PHASE2.yRev.toFixed(2)}억 원
          </It>
          <Src>요금은 싱글 1박 4.5만·월 50만 원 등 주변 시세 조사 전 가정(안)</Src>
        </S>
      </Body>
    );
  } },

  /* 23 비용 구조 */
  { id: "cost", ch: 6, render: () => (
    <Body center>
      <S>
        <Head ey="Cost Structure (안)" t="40실을 작은 팀으로" sub="프런트 상주 인력 없이 현장 관리 1명과 청소 파트타임으로 운영하고, 나머지는 시스템이 맡습니다." />
        <div className="mt-5 grid grid-cols-[150px_1fr] items-center gap-4">
          <div className="relative flex items-center justify-center">
            <Donut data={COST1.map((c) => ({ v: c.v, c: c.c }))} size={150} />
            <div className="absolute text-center"><p className="corm text-[28px] font-bold leading-none goldtext"><Count to={FIXED1} /></p><p className="text-[10px]" style={{ color: "var(--k-sub)" }}>만 원 / 월</p></div>
          </div>
          <div className="grid gap-2 text-[12px]">
            {COST1.map((c) => (
              <It key={c.t} className="flex items-start gap-2"><i className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: c.c }} /><div className="flex-1"><p className="font-bold">{c.t} <span className="corm float-right text-[15px] goldtext">{c.v}만</span></p><p className="text-[10.5px]" style={{ color: "var(--k-mute)" }}>{c.d}</p></div></It>
            ))}
          </div>
        </div>
        <It className="glass mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl text-center">
          <div className="p-3"><p className="text-[11px]" style={{ color: "var(--k-sub)" }}>변동비 · 장기 투숙</p><p className="corm text-[24px] font-bold goldtext">매출의 5%</p></div>
          <div className="p-3"><p className="text-[11px]" style={{ color: "var(--k-sub)" }}>변동비 · 단기 숙박</p><p className="corm text-[24px] font-bold goldtext">매출의 25%</p></div>
        </It>
        <Src>단기 변동비는 예약 채널 수수료·세탁·청소 포함 · 임차료는 건물주와 협의 사항으로 별도</Src>
      </S>
    </Body>
  ) },

  /* 24 손익 */
  { id: "ebitda", ch: 6, render: () => (
    <Body center>
      <S>
        <Head ey="Operating Profit (안)" t={<>혼합 운영으로 <span className="goldtext">균형</span>을 잡습니다</>} />
        <div className="mt-5 grid gap-2.5">
          {[...SCEN.map((p) => ({ k: `1단계 · ${p.k}`, s: p.d, yRev: p.yRev, yEb: p.yEb })), { k: `2단계 · ${ROOMS_ALL}실`, s: "기준 가정", yRev: PHASE2.yRev, yEb: PHASE2.yEb }].map((p, i, arr) => (
            <It key={p.k} className="glass rounded-2xl p-3.5">
              <div className="flex items-baseline justify-between">
                <p className="serif text-[14.5px] font-bold">{p.k}</p>
                <p className="corm text-[12.5px]" style={{ color: "var(--k-sub)" }}>매출 {p.yRev.toFixed(2)}억</p>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full" style={{ background: "#1d2f4f" }}>
                <motion.div className="h-full origin-left rounded-full" style={{ width: `${(p.yEb / Math.max(...arr.map((x) => x.yEb))) * 100}%`, background: i === 3 ? "var(--k-coral)" : "var(--k-gold)" }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, delay: 0.6 + i * 0.15, ease: EASE }} />
              </div>
              <div className="mt-1.5 flex items-baseline justify-between">
                <p className="text-[10.5px]" style={{ color: "var(--k-mute)" }}>{p.s} · 임차료 전 영업이익 (연)</p>
                <p className="corm text-[22px] font-bold goldtext"><Count to={p.yEb} d={2} delay={0.7 + i * 0.15} /><span className="text-[12px]">억</span></p>
              </div>
            </It>
          ))}
        </div>
        <Src>영업이익 = 매출 − 고정비 − 변동비 (임차료·감가상각·이자·세금 전) · 모두 가정(안)</Src>
      </S>
    </Body>
  ) },

  /* 25 투자 계획 */
  { id: "capex", ch: 6, render: () => (
    <Body center>
      <S>
        <Head ey="Investment Plan (안)" t={<>1단계 약 <span className="goldtext"><Count to={CAPEX1_SUM} d={1} /></span>억 원</>} sub={`3·4층 ${ROOMS1N}실 공사·장비·오픈 자금입니다. 공사비는 견적 전 단가로 잡았습니다.`} />
        <div className="mt-5 grid gap-2">
          {CAPEX1.map((c, i) => (
            <It key={c.t} className="glass rounded-xl p-3">
              <div className="flex items-baseline justify-between"><p className="text-[13px] font-bold">{c.t}</p><p className="corm text-[20px] font-bold goldtext">{c.v.toFixed(1)}억</p></div>
              <p className="text-[10.5px]" style={{ color: "var(--k-mute)" }}>{c.d}</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full" style={{ background: "#1d2f4f" }}><motion.div className="h-full origin-left rounded-full" style={{ width: `${(c.v / CAPEX1[0].v) * 100}%`, background: "var(--k-gold)" }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.5 + i * 0.12, ease: EASE }} /></div>
            </It>
          ))}
        </div>
        <It className="mt-3 grid grid-cols-3 gap-2 text-center">
          {[["1단계 기준", `약 ${PAY1.toFixed(1)}년`, "투자 회수 (안)"], ["2단계 추가", `+${CAPEX2_ADD.toFixed(1)}억`, "20실"], ["2단계 기준", `약 ${PAY2.toFixed(1)}년`, "투자 회수 (안)"]].map(([a2, b2, c2]) => (
            <div key={a2} className="glass rounded-xl py-2.5"><p className="text-[10px]" style={{ color: "var(--k-sub)" }}>{a2}</p><p className="corm text-[19px] font-bold goldtext">{b2}</p><p className="text-[9.5px]" style={{ color: "var(--k-mute)" }}>{c2}</p></div>
          ))}
        </It>
        <Src>투자 회수 = 투자금 ÷ 연 영업이익(임차료 전) · 실제 견적·임대 조건에 따라 달라짐</Src>
      </S>
    </Body>
  ) },

  /* 25 사전 확인 */
  { id: "checks", ch: 7, render: () => (
    <Body center>
      <S>
        <Head ey="Pre-conditions" t="문을 열기 전에 확인할 것" />
        <div className="mt-5 grid gap-2">
          {CHECKS.map((c, i) => (
            <It key={c.t} className="glass rounded-xl p-3.5">
              <div className="flex items-center gap-2">
                <span className="corm text-[16px] font-bold goldtext">{String(i + 1).padStart(2, "0")}</span>
                <p className="flex-1 text-[14px] font-bold">{c.t}</p>
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={c.s === "핵심" ? { background: "var(--k-coral)", color: "#fff" } : { border: "1px solid var(--k-line)", color: "var(--k-champ)" }}>{c.s}</span>
              </div>
              <p className="mt-1 text-[11.5px] leading-[1.6]" style={{ color: "var(--k-sub)" }}>{c.d}</p>
            </It>
          ))}
        </div>
      </S>
    </Body>
  ) },

  /* 26 리스크 */
  { id: "risks", ch: 7, render: () => (
    <Body center>
      <S>
        <Head ey="Risk & Response" t="리스크와 대응" />
        <div className="mt-5 grid gap-2">
          {[["호스텔업 등록 지연", "2층 공실(500㎡ 미만)을 다중생활시설로 먼저 운영, 등록 후 전환"], ["수요 변동", "단기·장기 고객군 병행, 기업·기관 장기 계약으로 바닥 수요 확보"], ["무인 운영 장애", "원격 관제 + 비상 연락 체계, 장애 시 현장 담당 즉시 출동"], ["명도 일정 지연", "4층 우선 착공, 3층은 명도·노래방 이전 후 순차 공사"], ["공사비 초과", "평당 단가·실당 비용 상한 설정, 예비비 별도 편성"], ["기존 임차인 민원", "출입 동선 분리, 방음 시공, 관리비 분담 사전 합의"]].map(([r, a], i) => (
            <It key={r} className="grid grid-cols-[1fr_auto_1.4fr] items-center gap-2">
              <div className="rounded-xl p-2.5 text-[12px] font-bold" style={{ background: "#1a2a46" }}>{r}</div>
              <motion.span className="text-[14px]" style={{ color: "var(--k-gold)" }} initial={{ x: -8 }} animate={{ x: 0 }} transition={{ repeat: Infinity, repeatType: "mirror", duration: 0.9, delay: i * 0.1 }}>→</motion.span>
              <div className="glass rounded-xl p-2.5 text-[11px] leading-[1.5]">{a}</div>
            </It>
          ))}
        </div>
      </S>
    </Body>
  ) },

  /* 27 추진 일정 */
  { id: "roadmap", ch: 7, render: () => (
    <Body center>
      <S>
        <Head ey="Roadmap" t="추진 순서" sub="각 단계는 앞 단계의 확인 결과에 따라 진행합니다. 일정은 인허가·견적 후 확정합니다." />
        <div className="relative mt-6 pl-10">
          <motion.div className="absolute bottom-4 left-[19px] top-4 w-px origin-top" style={{ background: "var(--k-gold)" }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1.6, delay: 0.3, ease: EASE }} />
          {ROADMAP.map((r, i) => (
            <It key={r.t} className="relative mb-4 last:mb-0">
              <motion.span className="absolute -left-10 top-0 flex h-[38px] w-[38px] items-center justify-center rounded-full text-[12px] font-bold" style={{ background: i === 0 ? "var(--k-gold)" : "var(--k-navy2)", color: i === 0 ? "#0a1322" : "var(--k-champ)", border: "1px solid var(--k-line)" }}
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.5 + i * 0.15 }}>{i + 1}</motion.span>
              <p className="serif text-[15.5px] font-bold">{r.t}</p>
              <p className="text-[12px]" style={{ color: "var(--k-sub)" }}>{r.d}</p>
            </It>
          ))}
        </div>
      </S>
    </Body>
  ) },

  /* 28 제안 */
  { id: "proposal", ch: 8, render: () => (
    <Body center>
      <S>
        <Head ey="Proposal" t={<>함께 만들<br /><span className="goldtext">첫 번째 THE K</span></>} />
        <div className="mt-5 grid gap-2.5">
          {[[IC.hand, "투자 · 공동 사업", `1단계 약 ${CAPEX1_SUM.toFixed(1)}억 원(안) — 3·4층 ${ROOMS1N}실 공사·장비·오픈 자금`], [IC.users, "운영 파트너", "전문 숙박 운영사 위탁 운영 검토 — 예약·가격·관리 노하우 결합"], [IC.home, "건물 · 임대 조건", "3·4층 장기 임대·명도 일정, 5층 놀이층 재배치, 용도변경과 신탁 동의 절차 공동 진행"], [IC.bolt, "AI · 기술 파트너", "무인 체크인·IoT·관제 솔루션 실증 협력"]].map(([ic, t, d]) => (
            <It key={t} className="glass flex items-center gap-3.5 rounded-2xl p-3.5"><Ico d={ic} /><div><p className="serif text-[15px] font-bold">{t}</p><p className="mt-0.5 text-[12px] leading-[1.55]" style={{ color: "var(--k-sub)" }}>{d}</p></div></It>
          ))}
        </div>
        <Src>본 자료는 사업 검토용 초안이며 투자 권유·수익 보장이 아닙니다. 수치는 모두 확정 전 가정(안)입니다.</Src>
      </S>
    </Body>
  ) },

  /* 29 브랜드 필름 */
  { id: "film", ch: 8, render: ({ active }) => (
    <Body center>
      <S>
        <Head ey="Brand Film" t="파주의 밤, 깨어 있는 건물 하나" />
        <div className="mt-5"><FilmSlide active={active} /></div>
      </S>
    </Body>
  ) },

  /* 30 맺음 */
  { id: "closing", ch: 8, photo: "hero", pos: "50% 70%", render: () => (
    <Body center>
      <S className="text-center">
        <It><p className="corm text-[14px] font-semibold uppercase tracking-[0.34em]" style={{ color: "var(--k-gold)" }}>Thank you</p></It>
        <h2 className="mt-3 overflow-hidden text-[60px] font-black leading-none"><motion.span className="block" initial={{ y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 1, delay: 0.3, ease: EASE }}>THE K<span style={{ color: "var(--k-coral)" }}>.</span></motion.span></h2>
        <It><p className="corm mt-1 text-[22px] italic goldtext">Stay smart, live local.</p></It>
        <It><p className="serif mt-6 whitespace-pre-line text-[16px] leading-[1.8]">{CEO.closing}</p></It>
        <It><p className="mt-6 text-[11.5px] leading-[1.7]" style={{ color: "var(--k-sub)" }}>{PROJECT.nameKo}(가칭) · {CEO.title} {CEO.name}<br />{PROJECT.address} ({PROJECT.roadAddress})</p></It>
        <It><a href="/thek" className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-bold" style={{ background: "var(--k-gold)", color: "#0a1322" }}>홈페이지 보기 →</a></It>
      </S>
    </Body>
  ) },
];

/* ───────── 모핑 블롭 ───────── */
function blob(seed: number) {
  const N = 7; const pts: [number, number][] = [];
  for (let k = 0; k < N; k++) {
    const a = (k / N) * Math.PI * 2;
    const r = 62 + 26 * Math.sin(seed * 1.7 + k * 2.3) * Math.cos(seed * 0.9 + k);
    pts.push([100 + r * Math.cos(a), 100 + r * Math.sin(a)]);
  }
  const f = (n: number) => n.toFixed(1);
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let k = 0; k < N; k++) {
    const p0 = pts[(k - 1 + N) % N], p1 = pts[k], p2 = pts[(k + 1) % N], p3 = pts[(k + 2) % N];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
  }
  return d + "Z";
}
const BLOBS = Array.from({ length: 40 }, (_, k) => blob(k + 1));
const BLOB_POS = [
  { x: "40%", y: "-16%", scale: 1.2, rotate: 0 }, { x: "-44%", y: "54%", scale: 1.0, rotate: 40 }, { x: "48%", y: "60%", scale: 0.9, rotate: -30 },
  { x: "-32%", y: "-10%", scale: 0.85, rotate: 70 }, { x: "32%", y: "28%", scale: 1.25, rotate: -15 }, { x: "-22%", y: "72%", scale: 1.1, rotate: 20 },
];
const BLOB2_POS = [
  { x: "-36%", y: "70%", scale: 0.7, rotate: 10 }, { x: "56%", y: "-6%", scale: 0.6, rotate: -40 }, { x: "-40%", y: "8%", scale: 0.55, rotate: 60 },
  { x: "52%", y: "74%", scale: 0.75, rotate: -20 }, { x: "-46%", y: "40%", scale: 0.6, rotate: 30 }, { x: "58%", y: "42%", scale: 0.5, rotate: -60 },
];

export default function KIRView() {
  const [[i, dir], setState] = useState<[number, number]>([0, 0]);
  const [menu, setMenu] = useState(false);
  const N = SLIDES.length;
  const s = SLIDES[i];

  const go = useCallback((n: number) => {
    setMenu(false);
    setState(([cur]) => { const t = Math.max(0, Math.min(N - 1, n)); return t === cur ? [cur, 0] : [t, t > cur ? 1 : -1]; });
  }, [N]);
  const next = useCallback(() => setState(([c]) => (c < N - 1 ? [c + 1, 1] : [c, 0])), [N]);
  const prev = useCallback(() => setState(([c]) => (c > 0 ? [c - 1, -1] : [c, 0])), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); prev(); }
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  /* 다음 장 사진 미리 받기 */
  useEffect(() => {
    const n = SLIDES[i + 1];
    if (n?.photo) { const im = new Image(); im.src = IMG(n.photo); }
  }, [i]);

  return (
    <div className="kir">
      <div className="relative mx-auto h-[100dvh] w-full max-w-[480px] overflow-hidden">
        {/* 무대 배경 */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(120% 80% at 80% 0%, #182a48 0%, #0d182b 55%, #0a1322 100%)" }} />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="drift absolute inset-y-0 left-0 w-[200%]" style={{ backgroundImage: "linear-gradient(rgba(201,169,110,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,.05) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
        </div>
        {/* 모핑 블롭 */}
        <motion.svg aria-hidden="true" viewBox="0 0 200 200" className="pointer-events-none absolute left-0 top-0 w-full" style={{ filter: "blur(28px)" }}
          animate={BLOB_POS[i % BLOB_POS.length]} transition={{ type: "spring", stiffness: 36, damping: 14 }}>
          <defs><linearGradient id="kb1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#c9a96e" stopOpacity=".42" /><stop offset="100%" stopColor="#7a5f33" stopOpacity=".18" /></linearGradient></defs>
          <motion.path fill="url(#kb1)" initial={false} animate={{ d: BLOBS[i % 40] }} transition={{ duration: 1.5, ease: EASE }} />
        </motion.svg>
        <motion.svg aria-hidden="true" viewBox="0 0 200 200" className="pointer-events-none absolute left-0 top-0 w-full" style={{ filter: "blur(34px)" }}
          animate={BLOB2_POS[i % BLOB2_POS.length]} transition={{ type: "spring", stiffness: 28, damping: 12 }}>
          <motion.path fill="rgba(226,115,74,.22)" initial={false} animate={{ d: BLOBS[(i + 13) % 40] }} transition={{ duration: 1.7, ease: EASE }} />
        </motion.svg>

        {/* 사진 배경 장 */}
        <AnimatePresence initial={false}>
          {s.photo && (
            <motion.div key={`bg-${s.id}`} className="absolute inset-0 z-[5]" initial={{ clipPath: "circle(0% at 50% 50%)" }} animate={{ clipPath: "circle(150% at 50% 50%)" }} exit={{ clipPath: "circle(0% at 50% 50%)" }} transition={{ duration: 0.9, ease: EASE }}>
              <motion.img src={IMG(s.photo)} alt="" className="h-full w-full object-cover" style={{ objectPosition: s.pos ?? "center" }} initial={{ scale: 1.2 }} animate={{ scale: 1.04 }} transition={{ duration: 9, ease: "easeOut" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,19,34,.7) 0%, rgba(10,19,34,.1) 30%, rgba(10,19,34,.55) 55%, #0a1322 92%)" }} />
              <span className="absolute right-4 top-[62px] rounded bg-black/50 px-1.5 py-0.5 text-[9.5px] text-white/85">AI 이미지 · 예시</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 금색 프레임 */}
        <motion.div aria-hidden="true" className="pointer-events-none absolute z-20 border" style={{ borderColor: "rgba(201,169,110,.32)" }}
          animate={{ top: 12, left: 12, right: 12, bottom: 12, borderRadius: i % 2 ? 28 : 6 }} transition={{ type: "spring", stiffness: 70, damping: 18 }} />

        {/* 슬라이드 */}
        <AnimatePresence initial={false} custom={dir}>
          <motion.section key={s.id} custom={dir} className="absolute inset-0 z-10"
            variants={{
              enter: (d: number) => ({ x: d >= 0 ? "100%" : "-100%", scale: 0.86, rotateY: d >= 0 ? -26 : 26 }),
              center: { x: "0%", scale: 1, rotateY: 0 },
              exit: (d: number) => ({ x: d >= 0 ? "-100%" : "100%", scale: 0.86, rotateY: d >= 0 ? 26 : -26 }),
            }}
            initial="enter" animate="center" exit="exit"
            transition={{ x: { type: "spring", stiffness: 250, damping: 32 }, scale: { duration: 0.5 }, rotateY: { duration: 0.6 } }}
            style={{ transformPerspective: 1200 }} aria-roledescription="slide" aria-label={`${i + 1} / ${N}`}>
            <motion.div className="stage absolute inset-0" drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.22} dragMomentum={false}
              onDragEnd={(_, info) => { if (info.offset.x < -60 || info.velocity.x < -450) next(); else if (info.offset.x > 60 || info.velocity.x > 450) prev(); }}>
              {s.render({ go, active: true })}
            </motion.div>
          </motion.section>
        </AnimatePresence>

        {/* 상단 */}
        <div className="absolute inset-x-0 top-0 z-30 px-5 pt-[calc(14px+env(safe-area-inset-top,0px))]">
          <div className="relative flex gap-[3px]">
            {SLIDES.map((x, k) => (
              <button key={x.id} type="button" aria-label={`${k + 1}번째 장으로`} onClick={() => go(k)} className="relative h-[14px] flex-1">
                <span className="absolute inset-x-0 top-[6px] h-[2px] rounded-full" style={{ background: k <= i ? "var(--k-gold)" : "rgba(255,255,255,.16)" }} />
                {k === i && <motion.span layoutId="kir-cursor" className="absolute inset-x-[-2px] top-[4px] h-[6px] rounded-full" style={{ background: "var(--k-champ)" }} transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              </button>
            ))}
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <a href="/thek" className="flex items-center gap-1 text-[12px] font-bold" style={{ color: "var(--k-champ)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>사이트
            </a>
            <motion.p key={s.ch} initial={{ y: -8 }} animate={{ y: 0 }} className="corm text-[13px] font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--k-gold)" }}>{CHAPTERS[s.ch]}</motion.p>
            <button type="button" onClick={() => setMenu(true)} aria-label="목차 열기" className="text-[12px] font-bold" style={{ color: "var(--k-champ)" }}>목차</button>
          </div>
        </div>

        {/* 하단 */}
        <div className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-between px-5 pb-[calc(20px+env(safe-area-inset-bottom,0px))]">
          <button type="button" onClick={prev} disabled={i === 0} aria-label="이전 장" className="flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md disabled:invisible" style={{ borderColor: "var(--k-line)", background: "rgba(17,30,53,.6)", color: "var(--k-champ)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <p className="corm text-[17px] font-semibold tabular-nums" style={{ color: "var(--k-champ)" }}>
            <motion.span key={i} initial={{ y: 10 }} animate={{ y: 0 }} className="inline-block">{String(i + 1).padStart(2, "0")}</motion.span>
            <span className="mx-1.5" style={{ color: "var(--k-mute)" }}>/</span>{N}
          </p>
          <button type="button" onClick={next} disabled={i === N - 1} aria-label="다음 장" className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full shadow-lg disabled:invisible" style={{ background: "var(--k-gold)", color: "#0a1322" }}>
            <span className="shine absolute inset-y-0 left-0 w-1/3 bg-white/40" />
            <svg className="relative" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>

        {/* 목차 시트 */}
        <AnimatePresence>
          {menu && (
            <motion.div key="menu" className="scroll absolute inset-0 z-40 px-6 pt-16" style={{ background: "var(--k-night)" }}
              initial={{ clipPath: "circle(0% at 92% 4%)" }} animate={{ clipPath: "circle(150% at 92% 4%)" }} exit={{ clipPath: "circle(0% at 92% 4%)" }} transition={{ duration: 0.6, ease: EASE }}>
              <button type="button" onClick={() => setMenu(false)} aria-label="목차 닫기" className="absolute right-5 top-5 text-[13px] font-bold" style={{ color: "var(--k-champ)" }}>닫기 ✕</button>
              <p className="corm text-[14px] font-semibold uppercase tracking-[0.26em]" style={{ color: "var(--k-gold)" }}>Contents</p>
              <div className="mt-4 grid gap-1 pb-10">
                {CHAPTERS.map((c, k) => {
                  const start = SLIDES.findIndex((x) => x.ch === k);
                  return (
                    <button key={c} type="button" onClick={() => go(start)} className="flex items-center gap-4 border-t py-3.5 text-left" style={{ borderColor: "rgba(255,255,255,.08)", color: s.ch === k ? "var(--k-champ)" : undefined }}>
                      <span className="corm w-8 text-[26px] font-semibold goldtext">{String(k).padStart(2, "0")}</span>
                      <span className="serif flex-1 text-[18px] font-bold">{c}</span>
                      <span className="text-[12px]" style={{ color: "var(--k-mute)" }}>{start + 1}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
