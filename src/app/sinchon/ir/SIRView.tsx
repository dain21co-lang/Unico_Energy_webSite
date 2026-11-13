"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

/*
 * 신촌 스마트호스텔(가칭) SEMESTER HOUSE IR — 모바일 전용 웹 프레젠테이션 (더케이 IR과 같은 구성)
 * 원칙: 투명도 애니메이션 없이 위치·크기·모양·마스크·색만 움직인다 (갤럭시 빈 화면 방지)
 * 근거: 건축물대장 · 감정평가서(2023.10) 면적 · 설계도면(2·5~8·9층, 2004) · 공개 시세(2026.5 보도)
 * 객실 수와 재무 수치는 모두 설계·시장조사 전 가정(안)이며, 계산식은 아래 FIN에 그대로 남겨 둔다.
 */

const IMG = (f: string) => `/sinchon/${f}.webp`;
const VID = (f: string) => `/sinchon/${f}`;
const EASE = [0.16, 1, 0.3, 1] as const;

/* ───────── 재무 가정 (안) ───────── */
const PRICE = { s: 95, t: 150, sh: 195 }; // 객실당 월 환산 요금(만 원): 1인실 · 2인실 · 3인 셰어룸
const P1 = { s: 14, t: 8, sh: 10 }; // 1단계 2~5층
const ALL = { s: 33, t: 11, sh: 10 }; // 2단계 2~9층 (기준층 1인실 5 + 2인실 1)
const n = (r: { s: number; t: number; sh: number }) => r.s + r.t + r.sh;
const ROOMS1N = n(P1), ROOMS_ALL = n(ALL);
const BEDS_ALL = ALL.s + ALL.t * 2 + ALL.sh * 3;
const full = (r: { s: number; t: number; sh: number }) => (r.s * PRICE.s + r.t * PRICE.t + r.sh * PRICE.sh) * 12 / 10000; // 억 원/년, 만실·학기 요금 기준
const L_OCC = 0.92, S_OCC = 0.75, S_PREM = 1.25, VAR_L = 0.05, VAR_S = 0.25;
function sim(rooms: { s: number; t: number; sh: number }, longShare: number, fixedM: number, anc: number, ancOpex: number) {
  const R0 = full(rooms);
  const LR = R0 * longShare * L_OCC, SR = R0 * (1 - longShare) * S_OCC * S_PREM;
  const yRev = LR + SR + anc;
  const yEb = yRev - (fixedM * 12) / 10000 - LR * VAR_L - SR * VAR_S - ancOpex;
  return { yRev, yEb };
}
const FIXED1 = 2000, FIXED2 = 2800; // 만 원/월
const SCEN = [
  { k: "학기 중심", d: "학기 80 · 단기 20", ...sim(P1, 0.8, FIXED1, 0.4, 0.1) },
  { k: "혼합 (기준)", d: "학기 60 · 단기 40", ...sim(P1, 0.6, FIXED1, 0.4, 0.1) },
  { k: "단기 중심", d: "학기 40 · 단기 60", ...sim(P1, 0.4, FIXED1, 0.4, 0.1) },
];
const PHASE2 = sim(ALL, 0.6, FIXED2, 1.8, 0.5);
const COST1 = [
  { t: "인건비", v: 900, d: "현장 관리 1명 + 청소 파트타임", c: "#c9a96e" },
  { t: "관리비 · 공과금", v: 650, d: "전기·수도·가스·통신·건물 관리", c: "#ecdcb6" },
  { t: "시스템 · 보험", v: 250, d: "무인 체크인·관제·예약 시스템, 보험", c: "#e2734a" },
  { t: "마케팅", v: 200, d: "대학·어학당 제휴, 예약 채널", c: "#5fb7a0" },
];
const CAPEX1 = [
  { t: "객실 리모델링 (2~5층 32실)", v: 7.4, d: "실당 약 2,300만 원 · 객실별 욕실 배관 포함" },
  { t: "외관 · 승강기 · 소방", v: 5.0, d: "외관 개선, 승강기 보강, 숙박 소방 기준" },
  { t: "1층 리셉션 · 카페 라운지", v: 1.0, d: "무인 체크인 키오스크, 라운지" },
  { t: "예비비", v: 0.4, d: "공사비 초과 대비" },
];
const CAPEX1_SUM = CAPEX1.reduce((s, c) => s + c.v, 0);
const CAPEX2_ADD = 11.2; // 6~9층 22실 5.1억 + 지하 시설 6.1억
const S1 = SCEN[1];
const PAY1 = CAPEX1_SUM / S1.yEb;
const PAY2 = (CAPEX1_SUM + CAPEX2_ADD) / PHASE2.yEb;

const FLOORS = [
  { f: "9F", rooms: ["s", "s", "s", "s"] },
  { f: "8F", rooms: ["s", "s", "s", "s", "s", "t"] },
  { f: "7F", rooms: ["s", "s", "s", "s", "s", "t"] },
  { f: "6F", rooms: ["s", "s", "s", "s", "s", "t"] },
  { f: "5F", rooms: ["s", "s", "s", "s", "s", "t"] },
  { f: "4F", rooms: ["s", "s", "s", "s", "s", "t"] },
  { f: "3F", rooms: ["sh", "sh", "sh", "sh", "sh", "t", "t", "t", "s", "s"] },
  { f: "2F", rooms: ["sh", "sh", "sh", "sh", "sh", "t", "t", "t", "s", "s"] },
];
const LOCATION = ["2호선 신촌역 도보권, 신촌 명물거리 상권 한가운데", "연세대 도보 약 10분 · 이화여대 도보·버스 약 15분", "서강대 도보 약 15분 · 홍익대 지하철 1정거장", "카페·식당·편의점이 모여 있어 생활이 편한 동네"];
const JOURNEY = [
  { en: "BOOK", t: "다국어 예약", d: "웹·앱에서 1박부터 한 학기까지 선택" },
  { en: "ARRIVE", t: "줄 서지 않는 입실", d: "도착 전날 받은 비밀번호로 바로 입실" },
  { en: "LIVE", t: "AI 생활 안내", d: "한·영·중·일 안내, 수리 접수, 시설 예약" },
  { en: "EXTEND", t: "앱에서 바로 연장", d: "단기 숙박을 학기 플랜으로 전환" },
  { en: "LEAVE", t: "가벼운 퇴실", d: "보관창고 연계, 다음 학기 재예약" },
];
const CHECKS = [
  { t: "숙박시설 용도 가능 여부", s: "핵심", d: "제3종일반주거 · 신촌지구 지구단위계획 · 교육환경 상대보호구역 — 관할 구청·건축사와 사전 협의" },
  { t: "객실 욕실 배관", s: "핵심", d: "기존 배관(P.D)은 화장실·코어 쪽뿐 — 객실별 배관 경로와 바닥 높이 검토" },
  { t: "소방 · 피난", s: "확인", d: "남측 주계단 + 동측 비상계단 2개소 — 숙박 기준 적합 여부" },
  { t: "승강기 용량", s: "확인", d: "15인승 1대 — 입·퇴실 몰리는 시간대 운영 계획" },
  { t: "운영 구조 · 임대 조건", s: "확인", d: "위탁운영·임차·수익배분 방식 협의" },
];
const ROADMAP = [
  { t: "인허가 사전 협의", d: "용도·소방·배관 검토 (1~2개월)" },
  { t: "설계 · 견적", d: "층별 객실 배치와 공사비 확정 (3~4개월)" },
  { t: "1단계 공사 · 오픈", d: `2~5층 ${ROOMS1N}실 + 1층 라운지` },
  { t: "2단계 확장", d: `6~9층 ${ROOMS_ALL - ROOMS1N}실 + 지하 시설` },
  { t: "정상 운영", d: "대학·어학당 제휴, 학기 단위 모집" },
];

type Ctx = { go: (n: number) => void; active: boolean };
type Slide = { id: string; ch: number; photo?: string; pos?: string; render: (c: Ctx) => ReactNode };
const CHAPTERS = ["표지", "개요", "브랜드", "입지 · 건물", "공간 · 객실", "스마트 운영", "사업성 (안)", "실행 계획", "제안"];

/* 브랜드 로고 (텍스트) */
function Logo({ width = 200 }: { width?: number }) {
  return (
    <motion.div style={{ width }} initial={{ clipPath: "inset(0% 100% 0% 0%)" }} animate={{ clipPath: "inset(0% 0% 0% 0%)" }} transition={{ duration: 1.2, delay: 0.3, ease: EASE }}>
      <p className="corm text-[34px] font-bold leading-none tracking-[0.08em] goldtext">SEMESTER</p>
      <p className="corm text-[34px] font-bold leading-none tracking-[0.08em]" style={{ color: "var(--k-ivory)" }}>HOUSE<span style={{ color: "var(--k-coral)" }}>.</span></p>
      <p className="mt-2 text-[10px] font-bold tracking-[0.34em]" style={{ color: "var(--k-champ)" }}>SINCHON SMART HOSTEL</p>
    </motion.div>
  );
}

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
      <video ref={ref} src={VID("exterior.mp4")} poster={IMG("exterior-poster")} muted loop playsInline preload="metadata" className="h-full w-full object-cover" />
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
        <span className="flex items-center gap-1.5"><span className="pulse inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />LIVE · 5F</span>
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
  const U = [["연세대", 70, 40], ["이화여대", 252, 46], ["서강대", 250, 186], ["홍익대", 40, 170]] as const;
  return (
    <svg viewBox="0 0 320 220" className="w-full">
      <defs><radialGradient id="kg" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#c9a96e" stopOpacity=".55" /><stop offset="1" stopColor="#c9a96e" stopOpacity="0" /></radialGradient></defs>
      <rect width="320" height="220" rx="18" fill="#0f1b30" />
      {[40, 80, 120, 160, 200, 240, 280].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="220" stroke="#16253f" />)}
      {[40, 80, 120, 160, 200].map((y) => <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="#16253f" />)}
      <motion.path d="M-10 128 C 70 120, 120 116, 160 118 S 260 106, 330 100" fill="none" stroke="#2c4a75" strokeWidth="9" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: "easeInOut" }} />
      <motion.path d="M150 -10 C 152 60, 150 100, 160 118 S 170 180, 176 230" fill="none" stroke="#24406a" strokeWidth="6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, delay: 0.2, ease: "easeInOut" }} />
      <motion.path d="M-10 136 C 80 130, 200 126, 330 112" fill="none" stroke="#c9a96e" strokeWidth="2" strokeDasharray="6 5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.4, ease: "easeInOut" }} />
      <text x="278" y="104" fontSize="9" fill="#c9a96e">2호선</text>
      <motion.circle cx="178" cy="126" r="14" fill="none" stroke="#c9a96e" strokeWidth="1.5" initial={{ scale: 0 }} animate={{ scale: [0, 1, 1.25, 1] }} style={{ transformOrigin: "178px 126px" }} transition={{ duration: 1.4, delay: 0.9 }} />
      <text x="190" y="146" fontSize="8.5" fill="#9eabbf">신촌역</text>
      {U.map(([t, x, y], i) => (
        <motion.g key={t} initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformOrigin: `${x}px ${y}px` }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1 + i * 0.12 }}>
          <circle cx={x} cy={y} r="5" fill="#ecdcb6" /><text x={x} y={y - 9} fontSize="10" fill="#ecdcb6" textAnchor="middle" fontWeight="700">{t}</text>
        </motion.g>
      ))}
      <circle cx="156" cy="110" r="40" fill="url(#kg)" />
      <motion.g initial={{ y: -30 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 180, damping: 12, delay: 1.2 }}>
        <path d="M156 86c-8 0-14 6-14 14 0 10 14 22 14 22s14-12 14-22c0-8-6-14-14-14z" fill="#e2734a" />
        <circle cx="156" cy="100" r="5" fill="#fff" />
      </motion.g>
      <rect x="88" y="150" width="110" height="24" rx="6" fill="#0a1322" stroke="#c9a96e" strokeWidth=".8" />
      <text x="143" y="166" fontSize="10" fill="#ecdcb6" textAnchor="middle" fontWeight="700">SEMESTER HOUSE</text>
      <text x="16" y="208" fontSize="8" fill="#6f7d93">위치 도식 (실제 축척 아님)</text>
    </svg>
  );
}

const TYPE = { s: { t: "1인실", c: "#c9a96e" }, t: { t: "2인실", c: "#ecdcb6" }, sh: { t: "3인 셰어룸", c: "#e2734a" } } as const;

/* ───────── 슬라이드 ───────── */
const SLIDES: Slide[] = [
  /* 01 표지 */
  { id: "cover", ch: 0, render: ({ active }) => (
    <>
      <video src={VID("hero.mp4")} poster={IMG("hero-poster")} autoPlay={active} muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,19,34,.82) 0%, rgba(10,19,34,.2) 38%, rgba(10,19,34,.35) 62%, #0a1322 100%)" }} />
      <Body bottom>
        <S>
          <It className="flex items-center gap-3"><motion.span className="block h-px w-10 origin-left" style={{ background: "var(--k-gold)" }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9, delay: 0.4 }} /><p className="corm text-[14px] font-semibold uppercase tracking-[0.32em]" style={{ color: "var(--k-gold)" }}>Business Plan & IR 2026</p></It>
          <h1 className="mt-4"><Logo width={230} /></h1>
          <It><p className="serif mt-4 text-[17px] font-medium leading-[1.6]">신촌에서, 하루부터<br />한 학기까지 머무는 집</p></It>
          <It><p className="mt-3 text-[11.5px] tracking-wide" style={{ color: "var(--k-sub)" }}>신촌 스마트호스텔(가칭) 사업계획서 · 투자제안서 · 2026. 11</p></It>
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
        <Head ey="Executive Summary" t={<>머물고, 공부하고, 어울리는 —<br />신촌의 스마트호스텔</>} sub="신촌역 도보권 9층 건물의 2~9층을 프런트 없이 AI·IoT로 운영하는 호스텔로 바꿉니다." />
        <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl" style={{ background: "var(--k-line)" }}>
          {[[ROOMS_ALL, "실", "전체 객실 (안)", `2~9층 · ${BEDS_ALL}베드`], [1649, "㎡", "객실 전환 면적", "2~9층 합계"], [ROOMS1N, "실", "1단계 오픈 (안)", "2~5층 먼저"], [24, "h", "무인 운영", "모바일 체크인 · 원격 관제"]].map(([v, u, l, s]) => (
            <It key={l as string} className="bg-[#111e35] p-4">
              <p className="text-[11.5px]" style={{ color: "var(--k-sub)" }}>{l}</p>
              <p className="corm mt-1 text-[44px] font-semibold leading-none goldtext"><Count to={v as number} /><span className="ml-0.5 text-[20px]">{u}</span></p>
              <p className="mt-1.5 text-[11px]" style={{ color: "var(--k-mute)" }}>{s}</p>
            </It>
          ))}
        </div>
        <It className="glass mt-4 rounded-2xl p-4 text-[13px] leading-[1.75]"><b style={{ color: "var(--k-champ)" }}>전략</b>  유학생·교환학생·어학연수생의 학기 체류가 바닥 매출을 받치고, 방문객 단기 숙박이 빈 방과 방학 기간을 채웁니다.</It>
        <Src>출처: 건축물대장 · 감정평가서(2023) · 설계도면(2004) · 객실 수는 설계 전 가정(안)</Src>
      </S>
    </Body>
  ) },

  /* 04 투자 포인트 */
  { id: "points", ch: 1, render: () => (
    <Body center>
      <S>
        <Head ey="Investment Highlights" t="핵심 투자 포인트" />
        <div className="mt-5 grid gap-2.5">
          {[[IC.pin, "대학 4곳이 걸어서 닿는 입지", "연세·이화·서강·홍익, 2호선 신촌역 도보권"], [IC.home, "신축 대신 리모델링", "지상 9층·지하 2층 기존 건물을 살려 기간·비용 절감"], [IC.key, "인건비를 줄인 무인 운영", "모바일 체크인·원격 관제로 프런트 상주 인력 최소화"], [IC.chart, "학기 + 단기 혼합 운영", "학기 체류가 바닥을, 단기 숙박이 수익을"], [IC.layers, "지하 1,350㎡ 부대 수익", "당구 라운지·피트니스·보관창고"]].map(([ic, t, d], i) => (
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
        <Head ey="Brand Vision" t={<>One night to<br /><span className="goldtext">one semester.</span></>} sub="호텔의 깔끔함과 호스텔의 합리적인 가격, 학교 앞에 사는 듯한 일상을 한 건물에 담습니다." />
        <div className="mt-6 grid grid-cols-3 gap-2">
          {[[IC.bed, "STAY", "머물다"], [IC.brief, "STUDY", "공부하다"], [IC.users, "CONNECT", "어울리다"]].map(([ic, en, ko], i) => (
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
          <motion.span className="relative text-[64px] font-black leading-none" initial={{ scale: 0.4, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 140, damping: 12, delay: 0.4 }}><span className="goldtext">S</span><span style={{ color: "var(--k-coral)" }}>.</span></motion.span>
        </It>
        <div className="mt-6 grid gap-2.5">
          {[["SMART STAY", "프런트 없는 체크인", "예약부터 퇴실까지 휴대폰 하나로. 늦은 밤 공항에서 와도 기다릴 필요가 없습니다."], ["SMART LOUNGE", "함께 쓰는 거실", "혼자 와도 외롭지 않게, 공부하고 요리하고 이야기하는 공유 라운지."], ["AI CARE", "AI가 돕고, 사람이 지키는", "한·영·중·일 생활 안내와 24시간 비상 연결로 부모님도 안심합니다."]].map(([en, t, d]) => (
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

  /* 07 시장 */
  { id: "market", ch: 2, render: () => (
    <Body center>
      <S>
        <Head ey="Market" t={<>늘어나는 유학생,<br /><span className="goldtext">부족한 방</span></>} />
        <It className="glass mt-5 rounded-2xl p-4">
          <p className="text-[11.5px]" style={{ color: "var(--k-sub)" }}>국내 외국인 유학생 (2025)</p>
          <p className="corm mt-1 text-[46px] font-semibold leading-none goldtext">약 <Count to={25.3} d={1} />만 명</p>
          <p className="mt-2 text-[12px]" style={{ color: "var(--k-champ)" }}>전년 대비 +21.3% · 연세대 국제처 &ldquo;기숙사 공급 매우 제한적&rdquo;</p>
        </It>
        <div className="mt-3 grid gap-1.5">
          {[["맹그로브 신촌", "3인실", "약 70만"], ["맹그로브 신촌", "1인실", "100만~"], ["42SHARE 연세홀", "1인실", "100~136만"], ["SEMESTER HOUSE (안)", "1인실 / 셰어", "90만 / 60만대"]].map(([a, b, c], i) => (
            <It key={a + b} className={`grid grid-cols-[1.4fr_1fr_1fr] items-center rounded-xl px-3.5 py-2.5 text-[12.5px] ${i === 3 ? "border border-[#c9a96e]" : "glass"}`}>
              <span className="font-bold" style={{ color: i === 3 ? "var(--k-champ)" : undefined }}>{a}</span><span style={{ color: "var(--k-sub)" }}>{b}</span><span className="corm text-right text-[16px] font-bold goldtext">{c}</span>
            </It>
          ))}
        </div>
        <Src>출처: 교육부 집계(확인 필요) · 연세대 국제처 2026 안내 · 공개 안내·보도(2026.5) · 월 요금 1인 기준</Src>
      </S>
    </Body>
  ) },

  /* 08 입지 */
  { id: "location", ch: 3, render: () => (
    <Body center>
      <S>
        <Head ey="Location" t={<>신촌,<br />대학가 한가운데</>} />
        <It className="mt-5"><MapArt /></It>
        <div className="mt-4 grid gap-2">
          {LOCATION.map((l, i) => (
            <It key={l} className="flex items-start gap-3 text-[13px] leading-[1.6]">
              <span className="corm mt-[1px] text-[15px] font-bold goldtext">{String(i + 1).padStart(2, "0")}</span><span>{l}</span>
            </It>
          ))}
        </div>
        <Src>이동 시간은 지도 기준 예상치 · 실측 후 갱신</Src>
      </S>
    </Body>
  ) },

  /* 09 건물 개요 */
  { id: "building", ch: 3, render: () => (
    <Body center>
      <S>
        <Head ey="The Building" t="건물 개요" />
        <div className="mt-5 grid grid-cols-[1fr_1fr] gap-2">
          <It><Pic src={IMG("before-exterior")} alt="현재 건물 사진" className="h-[150px] w-full" pos="45% 40%" cap="현재 · 간판 흐림" /></It>
          <It><Pic src={IMG("after-exterior-day")} alt="스마트호스텔 외관 예시" className="h-[150px] w-full" pos="50% 40%" cap="리모델링 후 예시 · AI" delay={0.3} /></It>
        </div>
        <It className="glass mt-4 rounded-2xl px-4 py-1">
          {[["위치", "서울 서대문구 창천동 · 신촌역 도보권"], ["구조·규모", "철골철근콘크리트 · 지하 2층, 지상 9층"], ["연면적 / 대지", "3,367.05㎡ / 784.5㎡"], ["사용승인", "2005년 9월"], ["기준층", "약 12.2m × 10.4m 본체 + 코어 · 비상계단"], ["설비", "15인승 승강기 · 계단 2개소 · 기계식 주차 36대"], ["용도지역", "제3종일반주거 · 지구단위계획구역"]].map(([k, v]) => (
            <div key={k} className="grid grid-cols-[86px_1fr] gap-2 border-b py-2.5 text-[12.5px] last:border-0" style={{ borderColor: "rgba(201,169,110,.15)" }}>
              <span style={{ color: "var(--k-gold)" }}>{k}</span><span>{v}</span>
            </div>
          ))}
        </It>
        <Src>출처: 건축물대장 · 감정평가서(2023.10.31 기준) · 설계도면(2004)</Src>
      </S>
    </Body>
  ) },

  /* 10 층별 객실 */
  { id: "floors", ch: 3, render: () => (
    <Body center>
      <S>
        <Head ey="Floor Stack" t={<>2~9층에 <span className="goldtext"><Count to={ROOMS_ALL} /></span>개 객실</>} sub={`2·3층은 넓은 면적에 셰어룸을, 기준층(4~8층)은 층당 6실, 9층은 지붕발코니 쪽 4실입니다. 1단계는 2~5층 ${ROOMS1N}실을 먼저 엽니다.`} />
        <div className="mt-6 space-y-1.5">
          {FLOORS.map((f, fi) => (
            <It key={f.f} className="flex items-center gap-2">
              <span className="corm w-8 text-[18px] font-bold" style={{ color: ["2F", "3F", "4F", "5F"].includes(f.f) ? "var(--k-champ)" : "var(--k-mute)" }}>{f.f}</span>
              <div className="flex flex-1 gap-1">
                {f.rooms.map((r, ui) => (
                  <motion.div key={ui} className="flex h-8 flex-1 items-center justify-center rounded text-[9px] font-bold"
                    initial={{ scaleY: 0 }} animate={{ scaleY: 1, backgroundColor: TYPE[r as keyof typeof TYPE].c, color: "#0a1322" }}
                    transition={{ duration: 0.5, delay: 0.4 + fi * 0.08 + ui * 0.03, ease: EASE }}>{r === "sh" ? "3" : r === "t" ? "2" : "1"}</motion.div>
                ))}
              </div>
            </It>
          ))}
        </div>
        <It className="mt-3 flex gap-4 text-[11px]">
          {Object.values(TYPE).map((t) => <span key={t.t} style={{ color: "var(--k-sub)" }}><i className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ background: t.c }} />{t.t}</span>)}
        </It>
        <Src>설계도면 치수 기준 배치(안) · 1층 리셉션·카페 라운지, 지하 1·2층 부대시설</Src>
      </S>
    </Body>
  ) },

  /* 11 기준층 배치 */
  { id: "typical", ch: 3, render: () => (
    <Body center>
      <S>
        <Head ey="Typical Floor (안)" t="기준층 객실 배치" sub="남서쪽 코어에서 들어와 가운데 복도를 따라 양쪽으로 방을 놓습니다. 기존 화장실 자리는 배관을 살려 린넨·세탁실로 씁니다." />
        <It className="mt-5"><motion.div className="overflow-hidden rounded-2xl bg-white" initial={{ clipPath: "inset(0% 0% 100% 0% round 18px)" }} animate={{ clipPath: "inset(0% 0% 0% 0% round 18px)" }} transition={{ duration: 1.1, delay: 0.3, ease: EASE }}>
          <img src="/sinchon/typ-layout.svg" alt="기준층 객실 배치(안) — 1인실 5, 2인실 1" className="block w-full" />
        </motion.div></It>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          {[["6실", "층당 객실"], ["16~18㎡", "객실 크기"], ["2개소", "피난 계단"]].map(([v, l]) => (
            <It key={l} className="glass rounded-xl py-2.5"><p className="corm text-[20px] font-bold goldtext">{v}</p><p className="text-[10.5px]" style={{ color: "var(--k-sub)" }}>{l}</p></It>
          ))}
        </div>
        <Src>설계도면(2004) 5~8층 평면 치수 기준 개략도 · 실제 배치는 구조·배관 검토 후 확정</Src>
      </S>
    </Body>
  ) },

  /* 12 도면 */
  { id: "plans", ch: 3, render: () => (
    <Body center>
      <S>
        <Head ey="Existing Plans" t="원 설계도면으로 본 공간" />
        {[["plan-typ", "5~8층 기준층", "본체 약 127㎡ + 남측 코어 · 동측 비상계단", "기준층"], ["plan-2f", "2층 (3층 동일 면적)", "본체 + 동측 날개 · 셰어룸 중심 배치", "2·3층"]].map(([f, t, d, tag], i) => (
          <It key={f} className="glass mt-4 overflow-hidden rounded-2xl">
            <Pic src={IMG(f)} alt={`${t} 설계도면`} className="h-[150px] w-full" pos="50% 40%" delay={0.25 + i * 0.2} />
            <div className="flex items-end justify-between px-4 pb-3.5 pt-3">
              <div><p className="corm text-[12px] font-bold tracking-[0.22em]" style={{ color: "var(--k-gold)" }}>{tag}</p><p className="serif text-[16px] font-bold">{t}</p><p className="text-[11px]" style={{ color: "var(--k-sub)" }}>{d}</p></div>
            </div>
          </It>
        ))}
        <Src>출처: 오시리스타워 신축공사 설계도면(2004) A-304·A-307</Src>
      </S>
    </Body>
  ) },

  /* 13 객실 구성 */
  { id: "mix", ch: 4, render: () => (
    <Body center>
      <S>
        <Head ey="Room Mix" t={`전체 ${ROOMS_ALL}실 구성 (안)`} />
        <It className="relative mx-auto mt-5 flex items-center justify-center">
          <Donut data={[{ v: ALL.s, c: TYPE.s.c }, { v: ALL.t, c: TYPE.t.c }, { v: ALL.sh, c: TYPE.sh.c }]} size={190} />
          <div className="absolute text-center"><p className="corm text-[48px] font-semibold leading-none goldtext"><Count to={ROOMS_ALL} /></p><p className="text-[11px]" style={{ color: "var(--k-sub)" }}>객실 · {BEDS_ALL}베드</p></div>
        </It>
        <div className="mt-5 grid gap-2">
          {[["s", ALL.s, "약 16㎡ · 싱글"], ["t", ALL.t, "약 18~20㎡ · 싱글 2"], ["sh", ALL.sh, "약 26㎡ · 커튼 침대 3"]].map(([k, v, d]) => (
            <It key={k as string} className="glass flex items-center gap-3 rounded-xl px-4 py-3">
              <span className="h-3 w-3 rounded-full" style={{ background: TYPE[k as keyof typeof TYPE].c }} />
              <span className="serif flex-1 text-[14.5px] font-bold">{TYPE[k as keyof typeof TYPE].t}</span>
              <span className="text-[12px]" style={{ color: "var(--k-sub)" }}>{d}</span>
              <span className="corm w-10 text-right text-[20px] font-bold goldtext">{v}실</span>
            </It>
          ))}
        </div>
        <Src>객실 크기·수는 설계 전 가정(안) · 2~9층 1,648.7㎡ 기준</Src>
      </S>
    </Body>
  ) },

  /* 14 객실 타입 */
  { id: "rooms", ch: 4, render: () => (
    <Body center>
      <S>
        <Head ey="Room Types" t="모든 객실에 개별 욕실" />
        <div className="mt-5 grid gap-2.5">
          {[["room-single", "스마트 싱글", "유학생·교환학생 1인", "1박 7만 원~ · 월 90만 원대 (안)"], ["room-twin", "스마트 트윈", "친구·형제 2인", "1박 9만 원~ · 1인 월 70만 원대 (안)"], ["room-triple", "셰어 트리플", "어학연수생·그룹 3인 · 침대별 커튼", "1인 1박 3.5만 원~ · 월 60만 원대 (안)"]].map(([f, t, d, p], i) => (
            <It key={f} className="glass grid grid-cols-[112px_1fr] gap-3 overflow-hidden rounded-2xl">
              <Pic src={IMG(f)} alt={`${t} (AI 이미지 예시)`} className="h-[108px] w-full" pos="50% 55%" delay={0.3 + i * 0.15} />
              <div className="py-3 pr-3">
                <p className="serif text-[15.5px] font-bold">{t}</p>
                <p className="mt-0.5 text-[12px]" style={{ color: "var(--k-sub)" }}>{d}</p>
                <p className="corm mt-2 text-[14.5px] font-bold goldtext">{p}</p>
              </div>
            </It>
          ))}
        </div>
        <Src>객실 사진은 AI 이미지 예시 · 요금은 주변 시세 참고 가정</Src>
      </S>
    </Body>
  ) },

  /* 15 학기 체류 */
  { id: "longstay", ch: 4, photo: "hero-poster", pos: "50% 65%", render: () => (
    <Body bottom>
      <S>
        <Head ey="Semester Stay" t={<>하루를 머물러도,<br /><span className="goldtext">한 학기를 살아도</span></>} />
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[["싱글", "90"], ["트윈 (1인)", "70"], ["셰어 (1인)", "60"]].map(([t, v]) => (
            <It key={t} className="glass rounded-xl p-3 text-center">
              <p className="text-[11px]" style={{ color: "var(--k-sub)" }}>{t}</p>
              <p className="corm text-[24px] font-bold leading-tight goldtext">{v}<span className="text-[13px]">만~</span></p>
              <p className="text-[10px]" style={{ color: "var(--k-mute)" }}>월 (안)</p>
            </It>
          ))}
        </div>
        <It className="glass mt-3 rounded-2xl p-4 text-[12.5px] leading-[1.8]">주 1회 청소·침구 교체 · 스터디 라운지·공유 주방 · 택배 수령 · 한·영 계약서<br /><span style={{ color: "var(--k-sub)" }}>봄·가을 학기 체류가 매출의 바닥을 받칩니다.</span></It>
      </S>
    </Body>
  ) },

  /* 16 공용시설 */
  { id: "facilities", ch: 4, render: () => (
    <Body center>
      <S>
        <Head ey="Facilities" t="방 밖의 시간까지, 한 건물에서" />
        <div className="mt-5 grid grid-cols-2 gap-2">
          {[["lounge", "공유 주방 · 라운지"], ["hero-poster", "창가 스터디 존"], ["room-arrival", "도착 · 셀프 체크인"], ["exterior-poster", "1층 카페 라운지"]].map(([f, t], i) => (
            <It key={f} className="relative">
              <Pic src={IMG(f)} alt={`${t} (AI 이미지 예시)`} className="h-[150px] w-full" pos="50% 50%" delay={0.25 + i * 0.12} />
              <div className="absolute inset-x-0 bottom-0 rounded-b-[18px] p-2.5" style={{ background: "linear-gradient(180deg,transparent,rgba(10,19,34,.92))" }}>
                <p className="serif text-[13.5px] font-bold">{t}</p>
              </div>
            </It>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {[["B1", "당구 라운지", "PBA 제휴 검토"], ["B2", "피트니스 · PT", "외부 회원제"], ["B1", "개인 보관창고", "학기 사이 짐"]].map(([f, t2, d], i) => (
            <It key={t2} className="glass rounded-xl p-3">
              <p className="corm text-[18px] font-bold goldtext">{f}</p>
              <p className="serif mt-0.5 text-[13px] font-bold">{t2}</p>
              <p className="text-[10px]" style={{ color: "var(--k-champ)" }}>{d}</p>
              <motion.span className="mt-2 block h-[2px] origin-left" style={{ background: "var(--k-gold)" }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.8 + i * 0.12 }} />
            </It>
          ))}
        </div>
        <Src>AI 이미지 예시 · 공용공간·지하 시설 구성은 설계 후 확정</Src>
      </S>
    </Body>
  ) },

  /* 17 스마트 운영 */
  { id: "journey", ch: 5, render: () => (
    <Body center>
      <S>
        <Head ey="Smart Operation" t={<>예약부터 퇴실까지<br />휴대폰 하나로</>} />
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

  /* 18 무인 체크인 */
  { id: "checkin", ch: 5, photo: "room-arrival", pos: "50% 45%", render: () => (
    <Body bottom>
      <S>
        <Head ey="Self Check-in" t={<>프런트 없이,<br /><span className="goldtext">기다림 없이</span></>} sub="도착 전날 받은 비밀번호로 들어오고, 객실 문은 모바일 키로 엽니다. 밤늦게 공항에서 와도 바로 쉴 수 있습니다." />
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[["24h", "체크인"], ["4개", "안내 언어"], ["1개", "휴대폰이면 끝"]].map(([v, l]) => (
            <It key={l} className="glass rounded-xl py-3 text-center"><p className="corm text-[24px] font-bold goldtext">{v}</p><p className="text-[10.5px]" style={{ color: "var(--k-sub)" }}>{l}</p></It>
          ))}
        </div>
      </S>
    </Body>
  ) },

  /* 19 AI 보안 */
  { id: "security", ch: 5, render: () => (
    <Body center>
      <S>
        <Head ey="AI Care & Security" t="AI가 돕고, 사람이 지키는 밤" />
        <div className="mt-5 grid grid-cols-[0.9fr_1.1fr] gap-2.5">
          <It><Pic src={IMG("room-single")} alt="스마트 싱글 객실 (AI 이미지 예시)" className="h-[250px] w-full" pos="50% 50%" cap="AI 이미지 · 예시" /></It>
          <div className="grid content-start gap-2">
            {[[IC.bolt, "IoT 에너지", "빈 방 자동 절전"], [IC.shield, "출입 · 화재", "개인 비밀번호 · 객실별 감지기"], [IC.phone, "AI 컨시어지", "다국어 24시간 · 비상 시 사람 연결"]].map(([ic, t, d]) => (
              <It key={t} className="glass flex items-center gap-2.5 rounded-xl p-2.5"><Ico d={ic} size={18} /><div><p className="text-[13px] font-bold">{t}</p><p className="text-[10.5px]" style={{ color: "var(--k-sub)" }}>{d}</p></div></It>
            ))}
          </div>
        </div>
        <It className="mt-3"><Dash /></It>
        <Src>장비·솔루션 도입 범위는 설계 단계에서 확정</Src>
      </S>
    </Body>
  ) },

  /* 20 고객층 */
  { id: "segments", ch: 5, render: () => (
    <Body center>
      <S>
        <Head ey="Target" t="누가 머물까" sub="신촌을 찾는 학생과 방문객을 네 그룹으로 나눠, 객실·요금·서비스를 맞춥니다." />
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          {[[IC.users, "교환학생 · 유학생", "연세·이화·서강·홍익 학기 체류", "학기 단위"], [IC.brief, "어학연수생", "어학당 1~3개월 과정", "월 단위"], [IC.home, "방문 가족 · 입시생", "입학·면접·학부모 방문", "1박~1주"], [IC.map, "여행 · 학회", "홍대·신촌 관광, 학술 행사", "주말·성수기"]].map(([ic, t, d, tag], i) => (
            <It key={t} className="glass rounded-2xl p-3.5">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.45 + i * 0.1 }}><Ico d={ic} size={19} /></motion.div>
              <p className="serif mt-2 text-[14.5px] font-bold">{t}</p>
              <p className="mt-0.5 text-[11.5px] leading-[1.5]" style={{ color: "var(--k-sub)" }}>{d}</p>
              <p className="mt-2 inline-block rounded-full px-2 py-0.5 text-[10px]" style={{ background: "rgba(201,169,110,.14)", color: "var(--k-champ)" }}>{tag}</p>
            </It>
          ))}
        </div>
        <Src>고객군별 비중은 시장조사 후 보완</Src>
      </S>
    </Body>
  ) },

  /* 21 왜 지금 */
  { id: "whynow", ch: 6, render: () => (
    <Body center>
      <S>
        <Head ey="Why Now" t={<>지금 신촌에<br /><span className="goldtext">호스텔이 필요한 이유</span></>} />
        <div className="mt-5 grid gap-2.5">
          {[[IC.users, "외국인 유학생 빠른 증가", "약 25.3만 명(2025), 전년 대비 +21.3% — 교육부 집계(확인 필요)"], [IC.home, "학교 기숙사 부족", "연세대 국제처 2026 안내: 기숙사 공급 매우 제한적, 교외 주거 별도 안내"], [IC.chart, "이미 형성된 가격대", "인근 공유주거 월 70~136만 원 (2026.5 보도·공개 안내)"], [IC.key, "무인 운영의 비용 경쟁력", "프런트 인력 없이 야간 체크인·다국어 응대"]].map(([ic, t2, d]) => (
            <It key={t2} className="glass flex items-center gap-3.5 rounded-2xl p-3.5"><Ico d={ic} /><div><p className="serif text-[14.5px] font-bold">{t2}</p><p className="mt-0.5 text-[11.5px] leading-[1.55]" style={{ color: "var(--k-sub)" }}>{d}</p></div></It>
          ))}
        </div>
        <Src>전국 수치를 이 건물 수요로 바로 환산할 수는 없습니다 · 시장조사로 보완</Src>
      </S>
    </Body>
  ) },

  /* 22 단계 전략 */
  { id: "phases", ch: 6, render: () => (
    <Body center>
      <S>
        <Head ey="Phased Strategy" t={<>네 개 층으로 열고,<br />검증하며 넓힙니다</>} />
        <div className="relative mt-6">
          <motion.div className="absolute bottom-6 left-[22px] top-6 w-[2px] origin-top" style={{ background: "linear-gradient(var(--k-gold),var(--k-coral))" }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1.6, delay: 0.4, ease: EASE }} />
          {[["준비", "인허가 · 설계", "숙박 용도·소방·배관 사전 협의 · 층별 배치 설계", "구청·건축사 확인 후 착공"], ["1단계", `2~5층 ${ROOMS1N}실 오픈`, "셰어룸·트윈 중심 + 1층 라운지", `투자 약 ${CAPEX1_SUM.toFixed(1)}억 원 (안)`], ["2단계", `6~9층 · 총 ${ROOMS_ALL}실`, `${ROOMS_ALL - ROOMS1N}실 추가 + 지하 당구·피트니스·보관창고`, `추가 투자 약 ${CAPEX2_ADD.toFixed(1)}억 원 (안)`]].map(([k, t2, s2, d], i) => (
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
        <Src>숙박 용도가 막히면 사업 구조 전체를 다시 검토합니다</Src>
      </S>
    </Body>
  ) },

  /* 23 매출 시뮬레이션 */
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
            학기 체류: 월 요금 × 입실률 {L_OCC * 100}%<br />단기 숙박: 월 환산 요금 × {S_PREM} × 가동률 {S_OCC * 100}%<br />부가매출: 1층 카페 임대 등 연 0.4억<br />2단계 {ROOMS_ALL}실(기준): 연 약 {PHASE2.yRev.toFixed(2)}억 원
          </It>
          <Src>요금은 싱글 월 95만·트윈 150만·셰어 195만 원(객실당) 등 주변 시세 참고 가정(안)</Src>
        </S>
      </Body>
    );
  } },

  /* 24 비용 구조 */
  { id: "cost", ch: 6, render: () => (
    <Body center>
      <S>
        <Head ey="Cost Structure (안)" t={`${ROOMS1N}실을 작은 팀으로`} sub="프런트 상주 인력 없이 현장 관리 1명과 청소 파트타임으로 운영하고, 나머지는 시스템이 맡습니다." />
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
          <div className="p-3"><p className="text-[11px]" style={{ color: "var(--k-sub)" }}>변동비 · 학기 체류</p><p className="corm text-[24px] font-bold goldtext">매출의 {VAR_L * 100}%</p></div>
          <div className="p-3"><p className="text-[11px]" style={{ color: "var(--k-sub)" }}>변동비 · 단기 숙박</p><p className="corm text-[24px] font-bold goldtext">매출의 {VAR_S * 100}%</p></div>
        </It>
        <Src>단기 변동비는 예약 채널 수수료·세탁·청소 포함 · 임차료는 건물 측과 협의 사항으로 별도 · 2단계 고정비 월 {FIXED2.toLocaleString()}만 원</Src>
      </S>
    </Body>
  ) },

  /* 25 손익 */
  { id: "ebitda", ch: 6, render: () => (
    <Body center>
      <S>
        <Head ey="Operating Profit (안)" t={<>혼합 운영으로 <span className="goldtext">균형</span>을 잡습니다</>} />
        <div className="mt-5 grid gap-2.5">
          {[...SCEN.map((p) => ({ k: `1단계 · ${p.k}`, s: p.d, yRev: p.yRev, yEb: p.yEb })), { k: `2단계 · ${ROOMS_ALL}실`, s: "혼합 기준 + 지하 시설", yRev: PHASE2.yRev, yEb: PHASE2.yEb }].map((p, i, arr) => (
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

  /* 26 투자 계획 */
  { id: "capex", ch: 6, render: () => (
    <Body center>
      <S>
        <Head ey="Investment Plan (안)" t={<>1단계 약 <span className="goldtext"><Count to={CAPEX1_SUM} d={1} /></span>억 원</>} sub={`2~5층 ${ROOMS1N}실 공사·장비·오픈 자금입니다. 공사비는 견적 전 단가로 잡았습니다.`} />
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
          {[["1단계 기준", `약 ${PAY1.toFixed(1)}년`, "투자 회수 (안)"], ["2단계 추가", `+${CAPEX2_ADD.toFixed(1)}억`, `${ROOMS_ALL - ROOMS1N}실 + 지하`], ["2단계 기준", `약 ${PAY2.toFixed(1)}년`, "투자 회수 (안)"]].map(([a2, b2, c2]) => (
            <div key={a2} className="glass rounded-xl py-2.5"><p className="text-[10px]" style={{ color: "var(--k-sub)" }}>{a2}</p><p className="corm text-[19px] font-bold goldtext">{b2}</p><p className="text-[9.5px]" style={{ color: "var(--k-mute)" }}>{c2}</p></div>
          ))}
        </It>
        <Src>투자 회수 = 투자금 ÷ 연 영업이익(임차료 전) · 실제 견적·임대 조건에 따라 달라짐</Src>
      </S>
    </Body>
  ) },

  /* 27 사전 확인 */
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

  /* 28 리스크 */
  { id: "risks", ch: 7, render: () => (
    <Body center>
      <S>
        <Head ey="Risk & Response" t="리스크와 대응" />
        <div className="mt-5 grid gap-2">
          {[["숙박 용도 불가", "착공 전 구청 사전 협의 — 막히면 사업 구조 재검토"], ["욕실 배관 공사비", "기존 배관 활용 배치, 실당 비용 상한·예비비 편성"], ["학기·방학 수요 편차", "방학 기간 단기 숙박·어학연수 프로그램으로 보완"], ["무인 운영 장애", "원격 관제 + 비상 연락 체계, 장애 시 현장 담당 출동"], ["승강기 혼잡", "입·퇴실 시간 분산 예약, 짐 보관 서비스"], ["기존 1층 임차인", "출입 동선 분리, 방음 시공, 관리비 분담 사전 합의"]].map(([r, a], i) => (
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

  /* 29 추진 일정 */
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

  /* 30 제안 */
  { id: "proposal", ch: 8, render: () => (
    <Body center>
      <S>
        <Head ey="Proposal" t={<>함께 만들<br /><span className="goldtext">신촌의 첫 서울집</span></>} />
        <div className="mt-5 grid gap-2.5">
          {[[IC.hand, "투자 · 공동 사업", `1단계 약 ${CAPEX1_SUM.toFixed(1)}억 원(안) — 2~5층 ${ROOMS1N}실 공사·장비·오픈 자금`], [IC.users, "운영 파트너", "전문 숙박 운영사 위탁 운영 검토 — 예약·가격·관리 노하우 결합"], [IC.home, "건물 · 운영 조건", "위탁운영·임차·수익배분 구조와 인허가 절차를 건물 측과 공동 진행"], [IC.bolt, "대학 · 기술 파트너", "대학 국제처·어학당 제휴, 무인 체크인·IoT 솔루션 협력"]].map(([ic, t, d]) => (
            <It key={t} className="glass flex items-center gap-3.5 rounded-2xl p-3.5"><Ico d={ic} /><div><p className="serif text-[15px] font-bold">{t}</p><p className="mt-0.5 text-[12px] leading-[1.55]" style={{ color: "var(--k-sub)" }}>{d}</p></div></It>
          ))}
        </div>
        <Src>본 자료는 사업 검토용 초안이며 투자 권유·수익 보장이 아닙니다. 수치는 모두 확정 전 가정(안)입니다.</Src>
      </S>
    </Body>
  ) },

  /* 31 브랜드 필름 */
  { id: "film", ch: 8, render: ({ active }) => (
    <Body center>
      <S>
        <Head ey="Brand Film" t="신촌의 밤, 불이 켜지는 집" />
        <div className="mt-5"><FilmSlide active={active} /></div>
      </S>
    </Body>
  ) },

  /* 32 맺음 */
  { id: "closing", ch: 8, photo: "hero-poster", pos: "50% 70%", render: () => (
    <Body center>
      <S className="text-center">
        <It><p className="corm text-[14px] font-semibold uppercase tracking-[0.34em]" style={{ color: "var(--k-gold)" }}>Thank you</p></It>
        <div className="mt-4 flex justify-center"><Logo width={230} /></div>
        <It><p className="corm mt-3 text-[22px] italic goldtext">One night to one semester.</p></It>
        <It><p className="serif mt-6 text-[16px] leading-[1.8]">신촌을 찾는 세계의 학생들에게<br />가장 편한 첫 서울집이 되겠습니다.</p></It>
        <It><p className="mt-6 text-[11.5px] leading-[1.7]" style={{ color: "var(--k-sub)" }}>SEMESTER HOUSE · 신촌 스마트호스텔(가칭)<br />서울 서대문구 창천동 · 신촌역 도보권</p></It>
        <It><a href="/sinchon" className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-bold" style={{ background: "var(--k-gold)", color: "#0a1322" }}>홈페이지 보기 →</a></It>
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

export default function SIRView() {
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
            <a href="/sinchon" className="flex items-center gap-1 text-[12px] font-bold" style={{ color: "var(--k-champ)" }}>
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
