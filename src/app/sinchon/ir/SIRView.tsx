"use client";

import { useCallback, useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

/*
 * 신촌 스마트호스텔(가칭) SEMESTER HOUSE IR — 모바일 전용 웹 프레젠테이션
 * 원칙: 투명도 애니메이션 없이 위치·크기·모양·마스크·색만 움직인다 (갤럭시 빈 화면 방지)
 * 근거: 건축물대장 · 감정평가서(2023.10) 면적 · 공개 시세(2026.5 보도) · 객실 수와 재무 수치는 모두 설계 전 추정(안)
 */

const IMG = (f: string) => `/sinchon/${f}.webp`;
const EASE = [0.16, 1, 0.3, 1] as const;

/* ───────── 재무 추정(안) — 한 곳에서 계산 ───────── */
const ROOMS = [
  { n: "1인실", rooms: 30, beds: 30, area: "약 14㎡", month: 95, short: "1박 7만 원~", semester: "월 90만 원대", img: "room-single" },
  { n: "2인실", rooms: 16, beds: 32, area: "약 20㎡", month: 150, short: "1박 9만 원~", semester: "1인 월 70만 원대", img: "room-twin" },
  { n: "3인 셰어룸", rooms: 10, beds: 30, area: "약 26㎡", month: 195, short: "1인 1박 3.5만 원~", semester: "1인 월 60만 원대", img: "room-triple" },
];
const OCC = 0.85, PREMIUM = 1.06, ANC = 1.8, OPEX_R = 0.38, OPEX_A = 0.5, CAPEX = 24;
const roomRev = (occ: number) => ROOMS.reduce((a, r) => a + r.rooms * r.month, 0) * 12 * PREMIUM * occ / 10000; // 억 원
const noi = (occ: number) => roomRev(occ) + ANC - roomRev(occ) * OPEX_R - OPEX_A;
const R85 = roomRev(OCC), N85 = noi(OCC);
const byType = ROOMS.map((r) => ({ n: r.n, v: (r.rooms * r.month * 12 * PREMIUM * OCC) / 10000 }));
const ROOMS_N = ROOMS.reduce((a, r) => a + r.rooms, 0), BEDS_N = ROOMS.reduce((a, r) => a + r.beds, 0);
const f1 = (v: number) => v.toFixed(1);

type Ctx = { go: (n: number) => void; active: boolean };
type Slide = { id: string; ch: number; photo?: string; pos?: string; dark?: boolean; render: (c: Ctx) => ReactNode };
const CHAPTERS = ["표지", "개요", "시장 · 입지", "건물 · 공간", "상품 · 객실", "스마트 운영", "사업성 (안)", "실행 계획", "맺음"];

/* ───────── 공통 조각 ───────── */
const wrap = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } };
const item = { hidden: { y: 34, scale: 0.97 }, show: { y: 0, scale: 1, transition: { duration: 0.9, ease: EASE } } };
function S({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <motion.div variants={wrap} initial="hidden" animate="show" className={className}>{children}</motion.div>;
}
function It({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return <motion.div variants={item} className={className} style={style}>{children}</motion.div>;
}

/* 오도미터 숫자 */
function Count({ to, d = 0, delay = 0.35 }: { to: number; d?: number; delay?: number }) {
  const str = to.toLocaleString("ko-KR", { minimumFractionDigits: d, maximumFractionDigits: d });
  let di = 0;
  return (
    <span className="inline-flex items-start" style={{ height: "1em", lineHeight: 1 }} aria-label={str}>
      {str.split("").map((ch, k) => {
        if (!/\d/.test(ch)) return <span key={k} aria-hidden="true" style={{ lineHeight: 1 }}>{ch}</span>;
        const n = Number(ch); const order = di++;
        return (
          <span key={k} aria-hidden="true" className="relative inline-block overflow-hidden text-center" style={{ height: "1em", width: "0.6em" }}>
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

function Pill({ children, y = false, className = "" }: { children: ReactNode; y?: boolean; className?: string }) {
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold ${className}`} style={{ background: y ? "var(--y)" : "var(--k)", color: y ? "var(--k)" : "#fff" }}>{children}</span>;
}

function Head({ ey, t, sub, dark }: { ey: string; t: ReactNode; sub?: ReactNode; dark?: boolean }) {
  return (
    <div>
      <motion.div initial={{ scale: 0.6, y: 10 }} animate={{ scale: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05, ease: EASE }} className="origin-left">
        <Pill y={dark}>{ey}</Pill>
      </motion.div>
      <h2 className="mt-3 overflow-hidden text-[27px] font-black leading-[1.32] tracking-tight" style={{ color: dark ? "#fff" : "var(--k)" }}>
        <motion.span className="block" initial={{ y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 0.95, delay: 0.2, ease: EASE }}>{t}</motion.span>
      </h2>
      {sub && <motion.p className="mt-3 text-[13.5px] leading-[1.75]" style={{ color: dark ? "#e6e4dc" : "var(--sub)" }} initial={{ y: 16 }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.35, ease: EASE }}>{sub}</motion.p>}
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

function Pic({ src, alt, className = "", pos = "center", cap, delay = 0.15 }: { src: string; alt: string; className?: string; pos?: string; cap?: string; delay?: number }) {
  return (
    <motion.div className={`relative overflow-hidden ${className}`} initial={{ clipPath: "inset(0% 0% 100% 0% round 20px)" }} animate={{ clipPath: "inset(0% 0% 0% 0% round 20px)" }} transition={{ duration: 1.1, delay, ease: EASE }}>
      <motion.img src={src} alt={alt} className="h-full w-full object-cover" style={{ objectPosition: pos }} initial={{ scale: 1.22 }} animate={{ scale: 1.03 }} transition={{ duration: 7, ease: "easeOut" }} />
      {cap && <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[9.5px] text-white">{cap}</span>}
    </motion.div>
  );
}

function Src({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return <It><p className="mt-5 text-[10.5px] leading-relaxed" style={{ color: dark ? "#cfcdc4" : "var(--mute)" }}>{children}</p></It>;
}

function Ico({ d, y = true }: { d: string; y?: boolean }) {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ background: y ? "var(--y)" : "var(--k)", color: y ? "var(--k)" : "var(--y)" }}>
      <svg width={21} height={21} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
    </span>
  );
}
const IC = {
  key: "M14 10a4 4 0 1 0-3.5 4L9 15.5V18h2.5v-2H13l1.5-1.5 M15.5 8.5h.01",
  shield: "M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6z M9 12l2 2 4-4",
  chart: "M4 20V4 M4 20h16 M8 16v-4 M12 16V8 M16 16v-6",
  pin: "M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  home: "M3 11l9-7 9 7 M5 10v10h14V10 M10 20v-6h4v6",
  layers: "M12 3l9 5-9 5-9-5z M3 13l9 5 9-5 M3 17l9 5 9-5",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M3 12h18 M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z",
  tool: "M14.5 6.5a4 4 0 0 0-5.3 5.3L4 17l3 3 5.2-5.2a4 4 0 0 0 5.3-5.3l-2.5 2.5-2.5-.5-.5-2.5z",
  cal: "M4 6h16v14H4z M4 10h16 M8 3v4 M16 3v4",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2",
  fire: "M12 3s5 4.5 5 9.5a5 5 0 0 1-10 0C7 9 9.5 7.5 9.5 7.5S10 10 12 10c0-3 0-7 0-7z",
  user: "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21a8 8 0 0 1 16 0",
  doc: "M6 3h9l4 4v14H6z M15 3v4h4 M9 12h7 M9 16h7",
  users: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M2.5 20a6.5 6.5 0 0 1 13 0 M16 4.5a3.5 3.5 0 0 1 0 6.5 M18 14a6 6 0 0 1 3.5 6",
};

/* 도넛 */
function Donut({ data, size = 170 }: { data: { v: number; c: string }[]; size?: number }) {
  const r = 70, C = 2 * Math.PI * r; let acc = 0;
  return (
    <svg width={size} height={size} viewBox="0 0 180 180" aria-hidden="true">
      <circle cx="90" cy="90" r={r} fill="none" stroke="var(--cream)" strokeWidth="26" />
      {data.map((d, k) => {
        const len = C * d.v; const off = -acc * C; acc += d.v;
        return <motion.circle key={k} cx="90" cy="90" r={r} fill="none" stroke={d.c} strokeWidth="26" strokeDasharray={`${len} ${C}`} strokeDashoffset={off} transform="rotate(-90 90 90)"
          initial={{ strokeDasharray: `0 ${C}` }} animate={{ strokeDasharray: `${len} ${C}` }} transition={{ duration: 1.2, delay: 0.4 + k * 0.3, ease: EASE }} />;
      })}
    </svg>
  );
}

/* 학교 개략도 */
function MapArt() {
  const P = [["연세대", 52, 40, "도보 10분"], ["이화여대", 250, 52, "도보·버스 15분"], ["서강대", 236, 212, "도보 15분"], ["홍익대", 40, 196, "지하철 10분"]] as const;
  return (
    <svg viewBox="0 0 300 260" className="w-full" aria-hidden="true">
      <rect width="300" height="260" rx="20" fill="var(--cream)" />
      <path d="M0 140 C 80 130, 150 150, 300 128" stroke="#e7e4d9" strokeWidth="14" fill="none" />
      <path d="M150 0 C 155 80, 148 160, 160 260" stroke="#e7e4d9" strokeWidth="10" fill="none" />
      {P.map(([n, x, y, t], k) => (
        <g key={n}>
          <motion.path d={`M150 135 Q ${(150 + x) / 2 + (k % 2 ? 16 : -16)} ${(135 + y) / 2} ${x} ${y}`} fill="none" stroke="#111" strokeWidth="2" strokeDasharray="5 5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.4 + k * 0.2, ease: EASE }} />
          <circle cx={x} cy={y} r="7" fill="#111" />
          <text x={x} y={y - 13} textAnchor="middle" fontSize="12" fontWeight="800" fill="#111">{n}</text>
          <text x={x} y={y + 22} textAnchor="middle" fontSize="9.5" fill="#66655f">{t}</text>
        </g>
      ))}
      <circle className="pulse" cx="150" cy="135" r="18" fill="#ffe11a" style={{ transformOrigin: "150px 135px", transformBox: "fill-box" }} />
      <circle cx="150" cy="135" r="11" fill="#ffe11a" stroke="#111" strokeWidth="2.5" />
      <text x="292" y="252" textAnchor="end" fontSize="8.5" fill="#9a988f">개략도 · 실제 축척 아님</text>
    </svg>
  );
}

/* 표 */
function Table({ rows, last }: { rows: (string | number)[][]; last?: boolean }) {
  return (
    <div className="overflow-hidden rounded-2xl" style={{ border: "1px solid var(--line)" }}>
      {rows.map((r, i) => (
        <It key={i} className="grid text-[12.5px]" style={{ gridTemplateColumns: `1.5fr repeat(${r.length - 1}, 1fr)`, background: i === 0 ? "var(--k)" : last && i === rows.length - 1 ? "var(--y)" : i % 2 ? "#fff" : "var(--cream)", color: i === 0 ? "#fff" : "var(--k)", fontWeight: i === 0 || (last && i === rows.length - 1) ? 800 : 500 }}>
          {r.map((c, j) => <span key={j} className={`px-3 py-2.5 ${j ? "text-right" : ""}`}>{c}</span>)}
        </It>
      ))}
    </div>
  );
}

/* ───────── 슬라이드 ───────── */
const SLIDES: Slide[] = [
  { id: "cover", ch: 0, dark: true, render: ({ active }) => (
    <>
      <video src="/sinchon/hero.mp4" poster={IMG("hero-poster")} autoPlay={active} muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(17,17,17,.55) 0%, rgba(17,17,17,.05) 35%, rgba(17,17,17,.35) 60%, rgba(17,17,17,.92) 100%)" }} />
      <Body bottom>
        <S>
          <It><Pill y>Business Plan & IR 2026</Pill></It>
          <It><h1 className="mt-4 text-[40px] font-black leading-[1.15] text-white">신촌에서<br />하루부터<br />한 학기까지</h1></It>
          <It><p className="mt-3 text-[16px] font-bold" style={{ color: "var(--y)" }}>SEMESTER HOUSE · 신촌 AI 스마트호스텔(가칭)</p></It>
          <It><p className="mt-2 text-[11.5px] text-white/80">사업계획서 · 투자제안서 · 2026. 11 · 검토용 초안</p></It>
          <It><p className="hint mt-6 flex items-center gap-2 text-[12.5px] font-bold text-white">옆으로 밀어 넘겨 보세요 <span aria-hidden="true">→</span></p></It>
        </S>
      </Body>
    </>
  ) },

  { id: "contents", ch: 0, render: ({ go }) => (
    <Body center>
      <S>
        <Head ey="Contents" t="목차" />
        <div className="mt-5 grid">
          {CHAPTERS.slice(1).map((c, k) => {
            const start = SLIDES.findIndex((x) => x.ch === k + 1);
            return (
              <It key={c}>
                <button type="button" onClick={() => go(start)} className="flex w-full items-center gap-4 border-t py-3 text-left" style={{ borderColor: "var(--line)" }}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-black" style={{ background: k % 2 ? "var(--k)" : "var(--y)", color: k % 2 ? "var(--y)" : "var(--k)" }}>{String(k + 1).padStart(2, "0")}</span>
                  <span className="flex-1 text-[17px] font-extrabold">{c}</span>
                  <span className="text-[11px]" style={{ color: "var(--mute)" }}>{String(start + 1).padStart(2, "0")}</span>
                </button>
              </It>
            );
          })}
        </div>
      </S>
    </Body>
  ) },

  { id: "summary", ch: 1, render: () => (
    <Body center>
      <S>
        <Head ey="Executive Summary" t={<>신촌 한복판,<br />유학생의 첫 서울집</>} sub="신촌역 도보권 9층 건물을 리모델링해, 하루 숙박부터 한 학기 장기 체류까지 한 곳에서 해결하는 AI 스마트호스텔을 만듭니다." />
        <div className="mt-6 grid grid-cols-2 gap-2">
          {[[ROOMS_N, "실", "객실 (안)", "1인실·2인실·3인 셰어룸"], [BEDS_N, "베드", "수용 인원 (안)", "단기 + 학기 체류"], [4, "곳", "도보권 대학", "연세·이화·서강·홍익"], [24, "h", "AI 운영", "다국어 안내 · 무인 체크인"]].map(([v, u, l, s], k) => (
            <It key={l as string} className="rounded-[20px] p-4" style={{ background: k === 0 ? "var(--y)" : "var(--cream)" }}>
              <p className="text-[11.5px] font-bold" style={{ color: "var(--sub)" }}>{l}</p>
              <p className="mt-1 text-[42px] font-black leading-none"><Count to={v as number} /><span className="ml-1 text-[17px]">{u}</span></p>
              <p className="mt-1.5 text-[11px]" style={{ color: "var(--sub)" }}>{s}</p>
            </It>
          ))}
        </div>
        <Src>객실 수는 건축물대장·감정평가서의 층별 면적 기준 추정(안)이며 설계 후 확정합니다.</Src>
      </S>
    </Body>
  ) },

  { id: "points", ch: 1, render: () => (
    <Body center>
      <S>
        <Head ey="Investment Highlights" t="핵심 투자 포인트" />
        <div className="mt-5 grid gap-2.5">
          {[[IC.pin, "대학 4곳이 걸어서 닿는 입지", "연세·이화·서강·홍익, 신촌역 도보권"], [IC.layers, "두 상품으로 1년 내내", "학기 체류가 바닥 매출을, 단기 숙박이 빈 방을 채움"], [IC.home, "신축 대신 리모델링", "기존 9층 건물을 살려 기간·비용 절감"], [IC.key, "AI 무인 운영", "다국어 안내·무인 체크인으로 인건비 최소화"], [IC.users, "지하 1,350㎡ 부대 수익", "당구 라운지·피트니스·보관창고"]].map(([ic, t, d], i) => (
            <It key={t} className="flex items-center gap-3.5 rounded-[20px] p-3.5" style={{ background: i === 1 ? "var(--k)" : "var(--cream)", color: i === 1 ? "#fff" : "var(--k)" }}>
              <Ico d={ic} />
              <span className="flex-1"><span className="block text-[15px] font-extrabold">{t}</span><span className="mt-0.5 block text-[12px] leading-snug" style={{ color: i === 1 ? "#d6d4cc" : "var(--sub)" }}>{d}</span></span>
              <span className="text-[20px] font-black" style={{ color: i === 1 ? "var(--y)" : "var(--k)" }}>{String(i + 1).padStart(2, "0")}</span>
            </It>
          ))}
        </div>
      </S>
    </Body>
  ) },

  { id: "vision", ch: 1, photo: "lounge", pos: "50% 55%", dark: true, render: () => (
    <Body bottom>
      <S>
        <It><Pill y>Vision</Pill></It>
        <It><h2 className="mt-3 text-[30px] font-black leading-[1.3] text-white">혼자 와도,<br />혼자가 아닌 저녁</h2></It>
        <It><p className="mt-3 text-[13.5px] leading-[1.75] text-white/85">낯선 도시의 첫날을 덜 낯설게. 방은 쉬는 곳, 라운지는 친구를 만나는 곳으로 설계합니다.</p></It>
      </S>
    </Body>
  ) },

  { id: "market", ch: 2, render: () => (
    <Body center>
      <S>
        <Head ey="Market" t="늘어나는 유학생, 부족한 방" />
        <It className="mt-5 rounded-[20px] p-5" style={{ background: "var(--y)" }}>
          <p className="text-[12px] font-bold">국내 외국인 유학생 (2025)</p>
          <p className="mt-1 text-[44px] font-black leading-none">약 <Count to={25.3} d={1} />만 명</p>
          <p className="mt-2 text-[12.5px] font-bold">전년 대비 +21.3% · 연세대 국제처 &ldquo;기숙사 공급 매우 제한적&rdquo;</p>
        </It>
        <It className="mt-4"><p className="mb-2 text-[13px] font-extrabold">인근 시설 월 요금 (1인)</p></It>
        <Table last rows={[["시설", "유형", "월 요금"], ["맹그로브 신촌", "3인실", "약 70만"], ["맹그로브 신촌", "1인실", "100만~"], ["42SHARE 연세홀", "1인실", "100~136만"], ["우리 (예시)", "1인 / 셰어", "90만 / 60만대"]]} />
        <Src>출처: 교육부 집계(확인 필요), 연세대 국제처 2026 안내, 공개 안내·보도(2026.5). 전국 수치를 이 건물 수요로 바로 환산할 수는 없습니다.</Src>
      </S>
    </Body>
  ) },

  { id: "location", ch: 2, render: () => (
    <Body center>
      <S>
        <Head ey="Location" t="걸어서 닿는 대학 4곳" sub="지도 기준 예상 시간이며 실측 후 갱신합니다." />
        <It className="mt-5"><MapArt /></It>
      </S>
    </Body>
  ) },

  { id: "building", ch: 3, render: () => (
    <Body center>
      <S>
        <Head ey="The Building" t="오래된 상가를, 학생의 집으로" />
        <div className="mt-5 grid grid-cols-2 gap-2">
          <It><Pic src={IMG("before-exterior")} alt="현재" className="aspect-[3/4]" pos="45% 40%" cap="현재 · 간판 흐림" /></It>
          <It><Pic src={IMG("after-exterior-day")} alt="리모델링 후" className="aspect-[3/4]" pos="50% 40%" cap="리모델링 후 · AI 예시" delay={0.3} /></It>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[["지상 9층", "지하 2층"], ["3,367㎡", "연면적"], ["1,649㎡", "객실 전환(2~9층)"]].map(([a, b]) => (
            <It key={a} className="rounded-2xl py-3" style={{ background: "var(--cream)" }}><p className="text-[16px] font-black">{a}</p><p className="mt-0.5 text-[10.5px]" style={{ color: "var(--sub)" }}>{b}</p></It>
          ))}
        </div>
        <Src>출처: 건축물대장·감정평가서. 용도지역 제3종일반주거 · 신촌지구 지구단위계획구역.</Src>
      </S>
    </Body>
  ) },

  { id: "stack", ch: 3, render: () => (
    <Body center>
      <S>
        <Head ey="Floor Plan" t="층마다 다른 역할" sub="기존 면적 기준 배치(안)입니다." />
        <div className="mt-5 grid gap-1.5">
          {[["9F", "1인실 5", "조용한 장기 체류층", 0], ["4–8F", "1인실 25 · 2인실 10", "층당 1인실 5 + 2인실 2", 0], ["2–3F", "3인 셰어룸 10 · 2인실 6", "그룹·어학연수생 중심", 0], ["1F", "리셉션 · 카페 라운지", "누구나 들르는 동네 거실", 1], ["B1", "보관창고 · 당구 라운지", "PBA 제휴 아카데미(검토)", 2], ["B2", "피트니스 · PT 스튜디오", "입주자 + 외부 회원", 2]].map(([f, a, b, t]) => (
            <It key={f as string} className="flex items-center gap-3 rounded-2xl px-4 py-3" style={{ background: t === 0 ? "var(--cream)" : t === 1 ? "var(--y)" : "var(--k)", color: t === 2 ? "#fff" : "var(--k)" }}>
              <span className="w-12 text-[17px] font-black" style={{ color: t === 2 ? "var(--y)" : "var(--k)" }}>{f}</span>
              <span className="flex-1"><span className="block text-[14px] font-extrabold">{a}</span><span className="block text-[11px]" style={{ color: t === 2 ? "#cfcdc4" : "var(--sub)" }}>{b}</span></span>
            </It>
          ))}
        </div>
      </S>
    </Body>
  ) },

  { id: "basement", ch: 3, render: () => (
    <Body center>
      <S>
        <Head ey="Basement" t={<>지하 1,350㎡를<br />동네의 놀이터로</>} sub="객실이 될 수 없는 지하를 입주자와 지역 주민이 함께 쓰는 수익 공간으로 바꿉니다." />
        <div className="mt-5 grid gap-2.5">
          {[["당구 라운지 · 아카데미", "프로당구협회(PBA) 제휴 검토 — 프로 선수 레슨, 시범 경기, 외국 선수 장기 투숙 연결", "검토"], ["피트니스 · PT 스튜디오", "입주자 할인 + 외부 회원제, 퍼스널 트레이닝 중심", "계획"], ["개인 보관창고", "학기 사이 짐 보관 수요 흡수, 가성비 좋은 부대 수익", "계획"]].map(([a, b, t], i) => (
            <It key={a} className="rounded-[20px] p-4" style={{ background: i === 0 ? "var(--y)" : "var(--cream)" }}>
              <div className="flex items-center justify-between"><p className="text-[16px] font-extrabold">{a}</p><Pill y={i !== 0}>{t}</Pill></div>
              <p className="mt-1.5 text-[12.5px] leading-[1.6]" style={{ color: "#3a3a35" }}>{b}</p>
            </It>
          ))}
        </div>
      </S>
    </Body>
  ) },

  { id: "mix", ch: 4, render: () => (
    <Body center>
      <S>
        <Head ey="Product Mix" t={<>하루 머물러도,<br />한 학기 살아도</>} sub="학기 체류로 바닥 매출을 깔고, 단기 숙박으로 빈 방과 방학 기간을 채웁니다." />
        <It className="mt-5 flex items-center gap-4">
          <Donut data={[{ v: 0.6, c: "#111111" }, { v: 0.4, c: "#ffe11a" }]} size={150} />
          <div className="grid gap-3">
            <div><p className="text-[30px] font-black leading-none">60%</p><p className="mt-1 text-[12.5px] font-bold">학기 체류 · 1~6개월</p></div>
            <div><p className="text-[30px] font-black leading-none" style={{ WebkitTextStroke: "1px #111", color: "var(--y)" }}>40%</p><p className="mt-1 text-[12.5px] font-bold">단기 숙박 · 1박~4주</p></div>
          </div>
        </It>
        <Src>목표 비중(추정)</Src>
      </S>
    </Body>
  ) },

  { id: "rooms", ch: 4, render: () => (
    <Body center>
      <S>
        <Head ey="Rooms" t="모든 객실에 개인 욕실" sub="요금은 주변 시세를 참고한 예시입니다." />
        <div className="mt-5 grid gap-2.5">
          {ROOMS.map((r, i) => (
            <It key={r.n} className="flex gap-3 rounded-[20px] p-2.5" style={{ background: "var(--cream)" }}>
              <Pic src={IMG(r.img)} alt={r.n} className="h-[104px] w-[86px] shrink-0" pos="50% 55%" delay={0.2 + i * 0.12} />
              <div className="flex-1 py-1">
                <div className="flex items-baseline justify-between"><p className="text-[16px] font-extrabold">{r.n}</p><p className="text-[11px]" style={{ color: "var(--sub)" }}>{r.rooms}실 · {r.area}</p></div>
                <p className="mt-2 text-[11px]" style={{ color: "var(--sub)" }}>단기 <b className="ml-1 text-[13px] text-[#111]">{r.short}</b></p>
                <p className="mt-1 text-[11px]" style={{ color: "var(--sub)" }}>학기 <b className="ml-1 text-[13px] text-[#111]">{r.semester}</b></p>
              </div>
            </It>
          ))}
        </div>
        <Src>객실 이미지는 AI로 만든 예시 · 요금 확정 전</Src>
      </S>
    </Body>
  ) },

  { id: "smart", ch: 5, render: () => (
    <Body center>
      <S>
        <Head ey="Smart Operation" t={<>AI는 편리하게,<br />위급할 땐 사람이</>} />
        <div className="mt-5 grid grid-cols-2 gap-2">
          {[[IC.key, "무인 체크인", "앱으로 출입 비밀번호"], [IC.globe, "다국어 안내", "한·영·중·일"], [IC.tool, "수리 접수", "사진 한 장이면 끝"], [IC.cal, "시설 예약", "세탁·스터디·당구·PT"], [IC.phone, "24시간 비상", "담당자 직접 응답"], [IC.chart, "데이터 운영", "입실률·요금 실시간 조정"]].map(([ic, a, b], i) => (
            <It key={a} className="rounded-[20px] p-3.5" style={{ background: i === 4 ? "var(--k)" : "var(--cream)", color: i === 4 ? "#fff" : "var(--k)" }}>
              <Ico d={ic} />
              <p className="mt-2.5 text-[14.5px] font-extrabold">{a}</p>
              <p className="mt-0.5 text-[11.5px]" style={{ color: i === 4 ? "#cfcdc4" : "var(--sub)" }}>{b}</p>
            </It>
          ))}
        </div>
      </S>
    </Body>
  ) },

  { id: "journey", ch: 5, render: () => (
    <Body center>
      <S>
        <Head ey="Guest Journey" t="예약부터 퇴실까지, 앱 하나로" />
        <div className="relative mt-6 pl-12">
          <motion.span className="absolute left-[21px] top-2 w-[2px] origin-top" style={{ background: "var(--k)", height: "calc(100% - 16px)" }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1.4, delay: 0.3, ease: EASE }} />
          {[["예약", "다국어 웹·앱, 단기/학기 선택"], ["입실", "비밀번호 출입, 줄 서지 않음"], ["생활", "AI 안내·시설 예약·커뮤니티"], ["연장", "앱에서 바로 학기 플랜 전환"], ["퇴실", "보관창고 연계, 다음 학기 재예약"]].map(([a, b], i) => (
            <It key={a} className="relative pb-5 last:pb-0">
              <span className="absolute -left-12 top-0 flex h-[44px] w-[44px] items-center justify-center rounded-full text-[14px] font-black" style={{ background: i === 2 ? "var(--y)" : "#fff", border: "2px solid #111" }}>{String(i + 1).padStart(2, "0")}</span>
              <p className="pt-1 text-[17px] font-extrabold">{a}</p>
              <p className="mt-0.5 text-[12.5px]" style={{ color: "var(--sub)" }}>{b}</p>
            </It>
          ))}
        </div>
      </S>
    </Body>
  ) },

  { id: "safety", ch: 5, photo: "room-single", pos: "50% 50%", dark: true, render: () => (
    <Body bottom>
      <S>
        <Head dark ey="Safety & Trust" t="부모님이 먼저 안심하는 숙소" />
        <div className="mt-4 grid gap-2">
          {[[IC.key, "출입 보안", "개인 비밀번호, 방문자 기록"], [IC.fire, "화재·피난", "객실별 화재감지기, 소방 기준 설계"], [IC.user, "운영 담당자", "일상은 AI, 판단은 사람"], [IC.doc, "투명한 약관", "한·영 병기, 보증금·환불 사전 고지"]].map(([ic, a, b]) => (
            <It key={a} className="flex items-center gap-3 rounded-2xl p-3" style={{ background: "rgba(17,17,17,.72)" }}>
              <Ico d={ic} />
              <span><span className="block text-[14px] font-extrabold text-white">{a}</span><span className="block text-[11.5px] text-white/75">{b}</span></span>
            </It>
          ))}
        </div>
      </S>
    </Body>
  ) },

  { id: "revenue", ch: 6, render: () => {
    const rows = [...byType, { n: "부대 시설", v: ANC }];
    const max = Math.max(...rows.map((r) => r.v));
    return (
      <Body center>
        <S>
          <Head ey="Revenue (est.)" t={<>연 매출 약 {f1(R85 + ANC)}억 원</>} sub={`입실률 ${OCC * 100}%, 단기 숙박 프리미엄 ${Math.round((PREMIUM - 1) * 100)}% 반영(추정)`} />
          <div className="mt-5 grid gap-3">
            {rows.map((r, i) => (
              <It key={r.n}>
                <div className="mb-1 flex justify-between text-[12.5px] font-bold"><span>{r.n}</span><span>{f1(r.v)}억</span></div>
                <div className="h-3 overflow-hidden rounded-full" style={{ background: "var(--cream)" }}>
                  <motion.div className="h-full origin-left rounded-full" style={{ width: `${(r.v / max) * 100}%`, background: i === 3 ? "var(--y)" : "var(--k)" }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.1, delay: 0.4 + i * 0.12, ease: EASE }} />
                </div>
              </It>
            ))}
          </div>
          <It className="mt-5 rounded-[20px] p-4 text-[12px] leading-[1.75]" style={{ background: "var(--cream)" }}>
            <b>산출</b> · 1인실 월 95만×30 + 2인실 월 150만×16 + 3인 셰어룸 월 195만×10 = 만실 월 7,200만 원 × 12개월 × 1.06 × 85% = {f1(R85)}억 + 부대 {ANC}억
          </It>
        </S>
      </Body>
    );
  } },

  { id: "pl", ch: 6, render: () => (
    <Body center>
      <S>
        <Head ey="P&L (est.)" t={<>연 영업이익(NOI)<br />약 {f1(N85)}억 원</>} />
        <div className="mt-5"><Table last rows={[["구분", "연간(억)"], ["객실 매출", f1(R85)], ["부대 매출", f1(ANC)], ["총매출", f1(R85 + ANC)], ["객실 운영비 (38%)", `△${f1(R85 * OPEX_R)}`], ["부대 운영비", `△${f1(OPEX_A)}`], ["영업이익(NOI)", f1(N85)]]} /></div>
        <Src>청소·인건비·플랫폼 수수료·공과금 포함. 임차료·금융비용 반영 전이며 운영 구조에 따라 달라집니다.</Src>
      </S>
    </Body>
  ) },

  { id: "capex", ch: 6, render: () => (
    <Body center>
      <S>
        <Head ey="CAPEX (est.)" t={<>필요 자금<br />약 <Count to={CAPEX} />억 원</>} sub="리모델링 중심의 추정 공사비입니다." />
        <div className="mt-5"><Table last rows={[["항목", "억 원"], ["객실층 리모델링 (2~9층)", "12.5"], ["지하 시설 (B1·B2)", "6.1"], ["외관·승강기·소방", "5.0"], ["예비비", "0.4"], ["합계", "24.0"]]} /></div>
        <Src>객실층 약 499평 × 평당 250만 원, 지하 약 409평 × 평당 150만 원 기준. 정밀 실사·설계 후 확정합니다.</Src>
      </S>
    </Body>
  ) },

  { id: "sensitivity", ch: 6, render: () => (
    <Body center>
      <S>
        <Head ey="Sensitivity" t={<>입실률 70%여도<br />회수 5년 안</>} />
        <div className="mt-5 grid gap-2">
          {[0.7, 0.85, 0.95].map((o, i) => (
            <It key={o} className="flex items-center justify-between rounded-[20px] px-5 py-4" style={{ background: i === 1 ? "var(--y)" : "var(--cream)" }}>
              <span><span className="block text-[11px] font-bold" style={{ color: "var(--sub)" }}>입실률</span><span className="block text-[30px] font-black leading-none">{Math.round(o * 100)}%</span></span>
              <span className="text-right"><span className="block text-[12px]">NOI <b className="text-[17px]">{f1(noi(o))}억</b></span><span className="mt-1 block text-[12px]">회수 <b className="text-[17px]">{f1(CAPEX / noi(o))}년</b></span></span>
            </It>
          ))}
        </div>
        <Src>필요 자금 {CAPEX}억 원 기준 · 추정</Src>
      </S>
    </Body>
  ) },

  { id: "structure", ch: 7, render: () => (
    <Body center>
      <S>
        <Head ey="Structure" t="건물 보유와 운영을 나눈다" sub="운영법인이 건물을 위탁 또는 임차해 리모델링·운영을 맡는 구조(안)입니다." />
        <div className="mt-5 grid gap-2">
          {[["건물 보유자", "건물 제공 · 운영 수익 일부 수취", 0], ["운영법인", "리모델링 투자 · 호스텔·부대시설 운영", 1], ["고객", "유학생·여행객·지역 회원", 2]].map(([a, b, t], i) => (
            <div key={a as string}>
              <It className="rounded-[20px] p-4 text-center" style={{ background: t === 1 ? "var(--y)" : t === 2 ? "var(--k)" : "var(--cream)", color: t === 2 ? "#fff" : "var(--k)" }}>
                <p className="text-[18px] font-black" style={{ color: t === 2 ? "var(--y)" : undefined }}>{a}</p>
                <p className="mt-1 text-[12.5px]" style={{ color: t === 2 ? "#d6d4cc" : "#3a3a35" }}>{b}</p>
              </It>
              {i < 2 && <It className="py-1 text-center text-[20px] font-black">⇅</It>}
            </div>
          ))}
        </div>
        <Src>계약 형태(위탁운영·임차·수익배분)는 협의 중이며 확정 전입니다.</Src>
      </S>
    </Body>
  ) },

  { id: "roadmap", ch: 7, render: () => (
    <Body center>
      <S>
        <Head ey="Roadmap" t="오픈까지 약 12개월(안)" />
        <div className="mt-5 grid gap-2">
          {[["1–2개월", "인허가 검토", "용도·소방 사전 협의"], ["3–4개월", "설계", "객실·지하 시설"], ["5–10개월", "공사", "층별 순차 리모델링"], ["11개월", "사전 모집", "대학·어학당 제휴"], ["12개월", "오픈", "가을학기 목표"]].map(([m, a, b], i) => (
            <It key={a} className="flex items-center gap-3 rounded-2xl px-4 py-3" style={{ background: i === 4 ? "var(--y)" : "var(--cream)" }}>
              <Pill>{m}</Pill>
              <span className="flex-1"><span className="block text-[15px] font-extrabold">{a}</span><span className="block text-[11.5px]" style={{ color: "var(--sub)" }}>{b}</span></span>
            </It>
          ))}
        </div>
        <Src>일정 추정</Src>
      </S>
    </Body>
  ) },

  { id: "risks", ch: 7, render: () => (
    <Body center>
      <S>
        <Head ey="Risks" t="먼저 확인할 것들" />
        <div className="mt-5 grid gap-2">
          {[["인허가", "제3종일반주거·지구단위계획·교육환경 상대보호구역 — 숙박시설(호스텔) 용도 가능 여부를 착수 전 관할 구청·건축사와 확인", "최우선"], ["공사비", "구조·설비 상태에 따라 증액 가능 — 정밀 실사 후 확정", "실사"], ["수요 변동", "학기·방학 편차 — 단기 숙박과 부대시설로 보완", "상품 믹스"], ["운영", "다국어 응대·안전 — AI + 24시간 담당자 이중 체계", "운영 체계"]].map(([a, b, t], i) => (
            <It key={a} className="rounded-[20px] p-4" style={{ background: i === 0 ? "var(--k)" : "var(--cream)", color: i === 0 ? "#fff" : "var(--k)" }}>
              <div className="flex items-center justify-between"><p className="text-[16px] font-extrabold" style={{ color: i === 0 ? "var(--y)" : undefined }}>{a}</p><Pill y={i === 0}>{t}</Pill></div>
              <p className="mt-1.5 text-[12px] leading-[1.6]" style={{ color: i === 0 ? "#d6d4cc" : "#3a3a35" }}>{b}</p>
            </It>
          ))}
        </div>
      </S>
    </Body>
  ) },

  { id: "closing", ch: 8, photo: "hero-poster", pos: "50% 70%", dark: true, render: () => (
    <Body bottom>
      <S>
        <It><Pill y>Thank you</Pill></It>
        <It><h2 className="mt-3 text-[32px] font-black leading-[1.25] text-white">신촌의 첫 서울집을<br />함께 만듭니다</h2></It>
        <It><a href="/sinchon" className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-3 text-[14px] font-bold" style={{ background: "var(--y)", color: "var(--k)" }}>사이트 보기 →</a></It>
        <Src dark>본 자료는 사업 검토를 위한 초안입니다. 매출·비용·일정·객실 수는 추정치이며 투자 권유가 아닙니다. 인허가와 설계 결과에 따라 사업 내용이 달라질 수 있습니다. 이미지는 AI로 만든 예시입니다.</Src>
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
  { x: "44%", y: "-20%", scale: 1.15, rotate: 0 }, { x: "-46%", y: "58%", scale: 1.0, rotate: 40 }, { x: "50%", y: "64%", scale: 0.9, rotate: -30 },
  { x: "-34%", y: "-14%", scale: 0.85, rotate: 70 }, { x: "36%", y: "30%", scale: 1.2, rotate: -15 }, { x: "-24%", y: "76%", scale: 1.05, rotate: 20 },
];
const BLOB2_POS = [
  { x: "-38%", y: "72%", scale: 0.6, rotate: 10 }, { x: "58%", y: "-8%", scale: 0.55, rotate: -40 }, { x: "-42%", y: "6%", scale: 0.5, rotate: 60 },
  { x: "54%", y: "76%", scale: 0.65, rotate: -20 }, { x: "-48%", y: "40%", scale: 0.55, rotate: 30 }, { x: "60%", y: "44%", scale: 0.45, rotate: -60 },
];

export default function SIRView() {
  const [[i, dir], setState] = useState<[number, number]>([0, 0]);
  const [menu, setMenu] = useState(false);
  const N = SLIDES.length;
  const s = SLIDES[i];
  const dark = !!s.dark;

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

  useEffect(() => {
    const n = SLIDES[i + 1];
    if (n?.photo) { const im = new Image(); im.src = IMG(n.photo); }
  }, [i]);

  const ink = dark ? "#fff" : "var(--k)";

  return (
    <div className="sir">
      <div className="relative mx-auto h-[100dvh] w-full max-w-[480px] overflow-hidden">
        <div className="absolute inset-0" style={{ background: "#fff" }} />
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(17,17,17,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(17,17,17,.035) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
        <motion.svg aria-hidden="true" viewBox="0 0 200 200" className="pointer-events-none absolute left-0 top-0 w-full" style={{ filter: "blur(18px)" }}
          animate={BLOB_POS[i % BLOB_POS.length]} transition={{ type: "spring", stiffness: 36, damping: 14 }}>
          <motion.path fill="#ffe11a" fillOpacity={0.55} initial={false} animate={{ d: BLOBS[i % 40] }} transition={{ duration: 1.5, ease: EASE }} />
        </motion.svg>
        <motion.svg aria-hidden="true" viewBox="0 0 200 200" className="pointer-events-none absolute left-0 top-0 w-full" style={{ filter: "blur(26px)" }}
          animate={BLOB2_POS[i % BLOB2_POS.length]} transition={{ type: "spring", stiffness: 28, damping: 12 }}>
          <motion.path fill="#a6e3d4" fillOpacity={0.5} initial={false} animate={{ d: BLOBS[(i + 13) % 40] }} transition={{ duration: 1.7, ease: EASE }} />
        </motion.svg>

        <AnimatePresence initial={false}>
          {s.photo && (
            <motion.div key={`bg-${s.id}`} className="absolute inset-0 z-[5]" initial={{ clipPath: "circle(0% at 50% 50%)" }} animate={{ clipPath: "circle(150% at 50% 50%)" }} exit={{ clipPath: "circle(0% at 50% 50%)" }} transition={{ duration: 0.9, ease: EASE }}>
              <motion.img src={IMG(s.photo)} alt="" className="h-full w-full object-cover" style={{ objectPosition: s.pos ?? "center" }} initial={{ scale: 1.2 }} animate={{ scale: 1.04 }} transition={{ duration: 9, ease: "easeOut" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(17,17,17,.6) 0%, rgba(17,17,17,.05) 30%, rgba(17,17,17,.45) 58%, rgba(17,17,17,.94) 95%)" }} />
              <span className="absolute right-4 top-[62px] rounded-full bg-black/55 px-2 py-0.5 text-[9.5px] text-white">AI 이미지 · 예시</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div aria-hidden="true" className="pointer-events-none absolute z-20 border-2"
          animate={{ top: 10, left: 10, right: 10, bottom: 10, borderRadius: i % 2 ? 30 : 14, borderColor: dark ? "rgba(255,225,26,.7)" : "rgba(17,17,17,.9)" }} transition={{ type: "spring", stiffness: 70, damping: 18 }} />

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

        <div className="absolute inset-x-0 top-0 z-30 px-5 pt-[calc(14px+env(safe-area-inset-top,0px))]">
          <div className="relative flex gap-[3px]">
            {SLIDES.map((x, k) => (
              <button key={x.id} type="button" aria-label={`${k + 1}번째 장으로`} onClick={() => go(k)} className="relative h-[14px] flex-1">
                <span className="absolute inset-x-0 top-[6px] h-[3px] rounded-full" style={{ background: k <= i ? (dark ? "var(--y)" : "var(--k)") : dark ? "rgba(255,255,255,.25)" : "rgba(17,17,17,.12)" }} />
                {k === i && <motion.span layoutId="sir-cursor" className="absolute inset-x-[-2px] top-[4px] h-[7px] rounded-full" style={{ background: "var(--y)", boxShadow: "0 0 0 1.5px #111" }} transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              </button>
            ))}
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <a href="/sinchon" className="flex items-center gap-1 text-[12px] font-bold" style={{ color: ink }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>사이트
            </a>
            <motion.p key={s.ch} initial={{ y: -8 }} animate={{ y: 0 }} className="rounded-full px-2.5 py-0.5 text-[11.5px] font-extrabold" style={{ background: dark ? "var(--y)" : "var(--k)", color: dark ? "var(--k)" : "#fff" }}>{CHAPTERS[s.ch]}</motion.p>
            <button type="button" onClick={() => setMenu(true)} aria-label="목차 열기" className="text-[12px] font-bold" style={{ color: ink }}>목차</button>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-between px-5 pb-[calc(20px+env(safe-area-inset-bottom,0px))]">
          <button type="button" onClick={prev} disabled={i === 0} aria-label="이전 장" className="flex h-11 w-11 items-center justify-center rounded-full border-2 disabled:invisible" style={{ borderColor: dark ? "#fff" : "var(--k)", background: dark ? "rgba(17,17,17,.5)" : "#fff", color: ink }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <p className="text-[16px] font-black tabular-nums" style={{ color: ink }}>
            <motion.span key={i} initial={{ y: 10 }} animate={{ y: 0 }} className="inline-block">{String(i + 1).padStart(2, "0")}</motion.span>
            <span className="mx-1.5" style={{ color: dark ? "rgba(255,255,255,.5)" : "var(--mute)" }}>/</span>{N}
          </p>
          <button type="button" onClick={next} disabled={i === N - 1} aria-label="다음 장" className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-[#111] shadow-lg disabled:invisible" style={{ background: "var(--y)", color: "var(--k)" }}>
            <span className="shine absolute inset-y-0 left-0 w-1/3 bg-white/50" />
            <svg className="relative" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>

        <AnimatePresence>
          {menu && (
            <motion.div key="menu" className="scroll absolute inset-0 z-40 px-6 pt-16" style={{ background: "var(--y)" }}
              initial={{ clipPath: "circle(0% at 92% 4%)" }} animate={{ clipPath: "circle(150% at 92% 4%)" }} exit={{ clipPath: "circle(0% at 92% 4%)" }} transition={{ duration: 0.6, ease: EASE }}>
              <button type="button" onClick={() => setMenu(false)} aria-label="목차 닫기" className="absolute right-5 top-5 text-[13px] font-bold">닫기 ✕</button>
              <Pill>Contents</Pill>
              <div className="mt-4 grid gap-1 pb-10">
                {CHAPTERS.map((c, k) => {
                  const start = SLIDES.findIndex((x) => x.ch === k);
                  return (
                    <button key={c} type="button" onClick={() => go(start)} className="flex items-center gap-4 border-t py-3.5 text-left" style={{ borderColor: "rgba(17,17,17,.15)" }}>
                      <span className="w-8 text-[24px] font-black">{String(k).padStart(2, "0")}</span>
                      <span className="flex-1 text-[18px] font-extrabold" style={{ textDecoration: s.ch === k ? "underline" : undefined, textUnderlineOffset: 5 }}>{c}</span>
                      <span className="text-[12px] text-[#3a3a35]">{start + 1}</span>
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
