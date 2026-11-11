"use client";

import { useCallback, useEffect, useState } from "react";
import type React from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

/*
 * 강화 장석광산 기반 조력발전 인프라 소재 플랫폼 — 모바일 전용 웹 문서 (재편집본)
 * 원문: H&L Partners 종합 파일 46장. 텍스트·수치는 원문 그대로 옮기되,
 * 수치·평가액·전망·금융 구조에는 '가정' 표시를 붙였고 원금 보장·규제 우회 단정 표현은 사실 표현으로 바꿨다.
 * 원칙: 투명도 애니메이션 없이 위치·크기·모양·마스크·색만 움직인다.
 */

const IMG = (f: string) => `/m3k8fz1/${f}.webp`;
const EASE = [0.16, 1, 0.3, 1] as const;

type Ctx = { go: (n: number) => void; active: boolean };
type Slide = { id: string; ch: number; photo?: string; pos?: string; cap?: string; render: (c: Ctx) => ReactNode };

/* ───────── 공통 조각 ───────── */
const wrap = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } };
const item = { hidden: { y: 34, scale: 0.97 }, show: { y: 0, scale: 1, transition: { duration: 0.9, ease: EASE } } };
function S({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <motion.div variants={wrap} initial="hidden" animate="show" className={className}>{children}</motion.div>;
}
function It({ children, className = "", style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return <motion.div variants={item} className={className} style={style}>{children}</motion.div>;
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

/* ───────── 강화 문서 전용 조각 ───────── */
const GOLD = "var(--k-gold)"; const SUB = "var(--k-sub)"; const BLUE = "#7fa3cf";
function Asm({ t = "가정" }: { t?: string }) {
  return <span className="ml-1.5 inline-block rounded-sm border px-1 py-px align-middle text-[9px] font-bold leading-[1.3] tracking-normal" style={{ borderColor: GOLD, color: GOLD, WebkitTextFillColor: "#c9a96e", fontFamily: "inherit" }}>{t}</span>;
}
function Card({ n, t, d, hl }: { n?: string; t: ReactNode; d?: ReactNode; hl?: boolean }) {
  return (
    <It className="glass flex gap-3 rounded-xl p-3.5">
      {n && <span className="corm w-7 shrink-0 text-[24px] font-semibold leading-none goldtext">{n}</span>}
      <div className="min-w-0">
        <p className="text-[14.5px] font-bold leading-[1.45]" style={{ color: hl ? "var(--k-champ)" : undefined }}>{t}</p>
        {d && <p className="mt-1 text-[12.5px] leading-[1.65]" style={{ color: SUB }}>{d}</p>}
      </div>
    </It>
  );
}
function KV({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <It className="glass rounded-xl px-4 py-1">
      {rows.map(([k, v], i) => (
        <div key={k} className="grid grid-cols-[84px_1fr] gap-3 py-2.5 text-[12.5px] leading-[1.6]" style={{ borderTop: i ? "1px solid rgba(255,255,255,.08)" : "none" }}>
          <span className="font-bold" style={{ color: GOLD }}>{k}</span><span>{v}</span>
        </div>
      ))}
    </It>
  );
}
function Big({ label, pre, to, d = 0, unit, sub, asm }: { label: string; pre?: string; to: number; d?: number; unit: string; sub?: string; asm?: boolean }) {
  return (
    <It>
      <p className="text-[12px] font-bold" style={{ color: SUB }}>{label}{asm && <Asm />}</p>
      <p className="serif mt-1.5 flex items-end gap-1 text-[44px] font-black leading-none">{pre && <span className="text-[26px]" style={{ color: "#e3c78d" }}>{pre}</span>}<Count to={to} d={d} /><span className="pb-1 text-[18px] font-bold" style={{ color: "var(--k-champ)" }}>{unit}</span></p>
      {sub && <p className="mt-1.5 text-[11.5px]" style={{ color: SUB }}>{sub}</p>}
    </It>
  );
}
/* 가로 막대 */
function HBar({ l, v, max, txt, c = "#c9a96e", delay = 0 }: { l: string; v: number; max: number; txt: string; c?: string; delay?: number }) {
  return (
    <It>
      <div className="flex items-baseline justify-between text-[12.5px]"><span className="font-bold">{l}</span><span className="font-bold" style={{ color: "var(--k-champ)" }}>{txt}</span></div>
      <div className="mt-1.5 h-[10px] overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,.08)" }}>
        <motion.div className="h-full origin-left rounded-full" style={{ background: c, width: `${(v / max) * 100}%` }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, delay: 0.4 + delay, ease: EASE }} />
      </div>
    </It>
  );
}
/* 세로 누적 막대 */
function VBars({ data, max }: { data: { l: string; a: number; b: number; top: string }[]; max: number }) {
  const H = 170;
  return (
    <It className="glass rounded-xl p-3.5">
      <div className="flex items-end justify-between gap-2" style={{ height: H + 34 }}>
        {data.map((x, i) => (
          <div key={x.l} className="flex flex-1 flex-col items-center justify-end">
            <motion.span className="mb-1 text-[11.5px] font-bold" style={{ color: "var(--k-champ)" }} initial={{ y: 12 }} animate={{ y: 0 }} transition={{ duration: 0.6, delay: 0.9 + i * 0.12 }}>{x.top}</motion.span>
            <motion.div className="flex w-full origin-bottom flex-col justify-end overflow-hidden rounded-t-md" style={{ height: ((x.a + x.b) / max) * H }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1.1, delay: 0.35 + i * 0.12, ease: EASE }}>
              <div style={{ height: `${(x.b / (x.a + x.b)) * 100}%`, background: "linear-gradient(180deg,#f3e3bd,#c9a96e)" }} />
              <div style={{ height: `${(x.a / (x.a + x.b)) * 100}%`, background: "#56677d" }} />
            </motion.div>
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex justify-between gap-2 border-t pt-1.5 text-center text-[11px]" style={{ borderColor: "rgba(255,255,255,.12)", color: SUB }}>{data.map((x) => <span key={x.l} className="flex-1">{x.l}</span>)}</div>
    </It>
  );
}
/* 세로 단계 */
function Steps({ items }: { items: { k: string; t: string; d?: ReactNode }[] }) {
  return (
    <div className="relative pl-7">
      <motion.span className="absolute bottom-3 left-[9px] top-3 w-px origin-top" style={{ background: GOLD }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1.6, delay: 0.3, ease: EASE }} />
      <div className="grid gap-3">
        {items.map((x, i) => (
          <It key={x.t} className="relative">
            <motion.span className="absolute -left-7 top-3 h-[19px] w-[19px] rounded-full border-2" style={{ borderColor: GOLD, background: "var(--k-night)" }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.5 + i * 0.25 }} />
            <div className="glass rounded-xl p-3.5">
              <p className="corm text-[13px] font-semibold uppercase tracking-[0.18em]" style={{ color: GOLD }}>{x.k}</p>
              <p className="mt-0.5 text-[15px] font-bold leading-[1.4]">{x.t}</p>
              {x.d && <p className="mt-1 text-[12.5px] leading-[1.65]" style={{ color: SUB }}>{x.d}</p>}
            </div>
          </It>
        ))}
      </div>
    </div>
  );
}
function Quote({ children }: { children: ReactNode }) {
  return <It className="mt-4 rounded-xl border-l-2 py-2.5 pl-3.5 pr-2" ><p className="serif text-[14.5px] font-bold leading-[1.6]" style={{ color: "var(--k-champ)" }}>{children}</p></It>;
}
function Dn() {
  return <It className="flex justify-center py-0.5"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2" aria-hidden="true"><path d="M12 5v14 M6 13l6 6 6-6" /></svg></It>;
}
/* 위치 관계 도식 */
function MapGh() {
  const pts: [number, number, string, string][] = [[118, 86, "강화 제1광산", "Ganghwa Mine"], [70, 168, "인천국제공항", "Incheon Int'l Airport"], [236, 196, "송도 11공구 · 대학 캠퍼스", "Songdo Zone 11"], [176, 250, "인천만 조력발전 예정지", "Tidal Power Site"]];
  return (
    <svg viewBox="0 0 320 290" className="w-full" role="img" aria-label="강화 제1광산과 인천국제공항, 송도 11공구, 인천만 조력발전 예정지의 위치 관계 도식">
      <path d="M40,40 C80,18 150,24 176,54 C196,78 186,112 160,126 C128,142 82,136 58,112 C34,90 22,60 40,40Z" fill="rgba(127,163,207,.14)" stroke="rgba(127,163,207,.5)" strokeWidth="1" />
      <path d="M210,60 C250,48 300,70 312,120 C320,170 300,240 262,270 L226,282 C214,240 222,200 206,160 C196,128 196,84 210,60Z" fill="rgba(127,163,207,.1)" stroke="rgba(127,163,207,.4)" strokeWidth="1" />
      <path d="M40,150 C62,140 100,150 104,172 C104,190 70,196 48,186 C34,178 30,160 40,150Z" fill="rgba(127,163,207,.12)" stroke="rgba(127,163,207,.4)" strokeWidth="1" />
      <text x="96" y="52" fontSize="9" fill="#9eabbf">강화도</text><text x="262" y="110" fontSize="9" fill="#9eabbf">인천</text>
      <motion.circle cx="118" cy="86" r="128" fill="none" stroke="#c9a96e" strokeWidth="1" strokeDasharray="4 5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.4 }} />
      <text x="212" y="24" fontSize="9" fill="#c9a96e">15km Radius</text>
      {pts.slice(1).map(([x, y], i) => (
        <motion.path key={i} d={`M118,86 L${x},${y}`} stroke="#ecdcb6" strokeWidth="1.6" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.9 + i * 0.25, ease: EASE }} />
      ))}
      {pts.map(([x, y, a, b], i) => (
        <g key={a}>
          <motion.circle cx={x} cy={y} r={i ? 5 : 8} fill={i ? "#7fa3cf" : "#c9a96e"} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.6 + i * 0.25 }} style={{ transformOrigin: `${x}px ${y}px` }} />
          <text x={x + (i === 2 ? 10 : 12)} y={y + (i === 2 ? 18 : 2)} fontSize={i ? 10 : 12} fontWeight="700" fill={i ? "#f4efe5" : "#ecdcb6"} textAnchor={i === 2 ? "end" : "start"}>{a}</text>
          <text x={x + (i === 2 ? 10 : 12)} y={y + (i === 2 ? 29 : 13)} fontSize="7.5" fill="#9eabbf" textAnchor={i === 2 ? "end" : "start"}>{b}</text>
        </g>
      ))}
    </svg>
  );
}
/* 파형 비교 */
function Waves() {
  const sine = Array.from({ length: 61 }, (_, k) => `${k ? "L" : "M"}${10 + k * 5},${70 - 38 * Math.sin((k / 60) * Math.PI * 6)}`).join(" ");
  const jag = "M10,96 L28,60 L40,112 L58,30 L72,98 L90,74 L104,120 L122,52 L140,104 L156,40 L172,116 L190,68 L206,100 L224,34 L240,110 L258,82 L276,124 L292,58 L310,96";
  return (
    <svg viewBox="0 0 320 150" className="w-full" role="img" aria-label="기상 의존적 발전과 조력발전의 출력 변동 비교 도식">
      {[0, 1, 2, 3, 4].map((k) => <g key={k}><line x1={10 + k * 75} y1="10" x2={10 + k * 75} y2="130" stroke="rgba(255,255,255,.07)" /><text x={10 + k * 75} y="145" fontSize="8" fill="#717c8c" textAnchor="middle">{`${String(k * 6).padStart(2, "0")}:00`}</text></g>)}
      <motion.path d={jag} fill="none" stroke="#8792a3" strokeWidth="1.4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, delay: 0.4 }} />
      <motion.path d={sine} fill="none" stroke="#e3c78d" strokeWidth="2.6" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.2, delay: 0.9, ease: "easeInOut" }} />
    </svg>
  );
}
/* 동심원 */
function Rings({ items }: { items: string[] }) {
  return (
    <It className="relative mx-auto" >
      <div className="relative mx-auto flex h-[230px] w-[230px] items-end justify-center">
        {items.map((t, i) => {
          const sz = 230 - i * 62;
          return (
            <motion.div key={t} className="absolute bottom-0 flex items-start justify-center rounded-full border pt-2.5" style={{ width: sz, height: sz, left: (230 - sz) / 2, borderColor: i === items.length - 1 ? GOLD : "rgba(127,163,207,.45)", background: i === items.length - 1 ? "linear-gradient(160deg,#e3c78d,#a8864e)" : `rgba(86,103,125,${0.22 + i * 0.16})` }}
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.9, delay: 0.3 + i * 0.22, ease: EASE }}>
              <span className="text-[11.5px] font-bold" style={{ color: i === items.length - 1 ? "#10161f" : "var(--k-ivory)" }}>{t}</span>
            </motion.div>
          );
        })}
      </div>
    </It>
  );
}
const ASM_NOTE = "수치·평가액·전망은 사업 주체가 제시한 가정이며 확정된 사실이 아닙니다.";

const CHAPTERS = ["표지", "자산", "시장 · 수요", "사업 모델", "리스크", "금융 구조 (가정)", "ESG · 공공성", "비전"];

const SLIDES: Slide[] = [
  { id: "cover", ch: 0, photo: "seawall", pos: "38% 50%", cap: "방조제 참고 이미지 · AI", render: () => (
    <Body bottom>
      <S>
        <It><p className="corm text-[13px] font-semibold uppercase tracking-[0.3em]" style={{ color: GOLD }}>Confidential · Investment Memorandum</p></It>
        <It><p className="mt-4 text-[13px] font-bold" style={{ color: "var(--k-champ)" }}>재생에너지 인프라 소재 플랫폼</p></It>
        <h1 className="serif mt-2 overflow-hidden text-[32px] font-black leading-[1.3]">
          {["강화 장석광산 기반", "조력발전 인프라", "소재 플랫폼"].map((t, i) => <motion.span key={t} className={`block ${i === 2 ? "goldtext" : ""}`} initial={{ y: "110%" }} animate={{ y: "0%" }} transition={{ duration: 1, delay: 0.3 + i * 0.14, ease: EASE }}>{t}</motion.span>)}
        </h1>
        <It><p className="mt-4 text-[12.5px] leading-[1.8]" style={{ color: SUB }}>PART 1 프로젝트 본질 · PART 2 금융 구조(가정)<br />PART 3 ESG · 공공성</p></It>
        <It><p className="mt-5 border-t pt-3 text-[11.5px]" style={{ borderColor: "var(--k-line)", color: SUB }}>(주)에이치엔엘파트너스 · H&amp;L PARTNERS</p></It>
        <It><p className="hint mt-3 text-[12px] font-bold" style={{ color: "var(--k-champ)" }}>옆으로 밀어 넘겨 보세요 →</p></It>
      </S>
    </Body>
  ) },
  { id: "notice", ch: 0, render: () => (
    <Body center>
      <S>
        <Head ey="Before You Read" t={<>이 문서를 읽기 전에</>} />
        <div className="mt-6 grid gap-2.5">
          <Card n="01" t="가정에 기반한 검토 자료입니다" d="매장량의 가치, 감정가, 수요, 매출·수익 전망, 금융 구조는 사업 주체가 제시한 가정입니다. '가정' 표시가 붙은 항목은 확정된 사실이 아닙니다." />
          <Card n="02" t="확인이 필요한 서류" d="광업권 등록원부, 감정평가서 원본, 성분 분석 성적서, 인허가 및 수요처 계약, 법률·회계 검토." />
          <Card n="03" t="투자 권유 문서가 아닙니다" d="이 자료는 원금이나 수익을 보장하지 않으며, 담보가 있더라도 회수 금액은 담보의 실제 처분 가치에 따라 달라집니다." />
        </div>
      </S>
    </Body>
  ) },

  /* ── 자산 ── */
  { id: "asset", ch: 1, render: () => (
    <Body>
      <S>
        <Head ey="The Asset" t={<>1.78억 톤의 매장량,<br />세 개의 사업 축</>} />
        <div className="mt-6 grid grid-cols-2 gap-3">
          <It className="glass rounded-xl p-3.5"><p className="text-[11.5px] font-bold" style={{ color: SUB }}>총 매장량</p><p className="serif mt-1.5 text-[30px] font-black leading-none"><Count to={1.78} d={2} /><span className="ml-0.5 text-[15px]" style={{ color: "var(--k-champ)" }}>억 톤</span></p><p className="mt-1.5 text-[10.5px]" style={{ color: SUB }}>178,185,150 ton</p></It>
          <It className="glass rounded-xl p-3.5"><p className="text-[11.5px] font-bold" style={{ color: SUB }}>종합 감정가치<Asm /></p><p className="serif mt-1.5 text-[30px] font-black leading-none"><Count to={1900} /><span className="ml-0.5 text-[15px]" style={{ color: "var(--k-champ)" }}>억 원</span></p><p className="mt-1.5 text-[10.5px]" style={{ color: SUB }}>DCF 및 자산가치 혼합</p></It>
        </div>
        <div className="mt-3 grid gap-2.5">
          <Card n="1" t="안정적 캐시카우 — 장석" d={<>연 매출 73.2억 원, 순이익률 33.3%의 기반 수익<Asm /></>} />
          <Card n="2" t="대규모 인프라 수요 — 골재" d={<>인천만 방조제(18.3km) 및 송도 매립 수요 500만㎥ 이상 공급 기회<Asm /></>} />
          <Card n="3" t="미래 첨단 소재 — 엑시톤" d={<>엑시톤 중성자 200 이상 함유, 탄소포집 및 ESG 밸류체인 진입<Asm t="원문 주장 · 검증 필요" /></>} />
        </div>
      </S>
    </Body>
  ) },
  { id: "mine", ch: 1, render: () => (
    <Body>
      <S>
        <Head ey="Factsheet" t="강화 제1광산 개요" />
        <div className="mt-5"><Pic src={IMG("site")} alt="강화군 화도면 온수리 일대 전경" className="h-[150px] w-full" pos="50% 60%" cap="강화군 온수리 일대 전경" /></div>
        <div className="mt-3">
          <KV rows={[["자산명", "강화 제1광산"], ["법적 권리", "광업권 등록번호 79560호, 79562호 (2013년 4월 설정)"], ["위치", "인천광역시 강화군 화도면 온수리 일대"], ["개발권자", "진수웅 기술사 (한자엔지니어링)"], ["광종", "장석 (이오라이트 및 엑시톤 함유)"], ["총 매장량", <b key="v" style={{ color: "var(--k-champ)" }}>178,185,150톤 (65,994,500㎥)</b>]]} />
        </div>
        <Src>광업권 등록 사항과 매장량은 등록원부·매장량 산정 보고서로 확인이 필요합니다.</Src>
      </S>
    </Body>
  ) },
  { id: "mineral", ch: 1, render: () => {
    const comp = [{ k: "SiO₂", v: 71.95, u: "세라믹, 유리 원료", c: "#56677d" }, { k: "Al₂O₃", v: 14.99, u: "내화재, 세라믹", c: "#7fa3cf" }, { k: "Na₂O", v: 6.1, u: "유리, 세라믹 융제", c: "#c9a96e" }, { k: "K₂O", v: 3.25, u: "유리, 도자기", c: "#ecdcb6" }];
    return (
      <Body>
        <S>
          <Head ey="Mineral Profile" t="매장량 및 광물 특성" />
          <It className="glass mt-5 flex items-center gap-3 rounded-xl p-3">
            <div className="relative shrink-0"><Donut data={comp.map((x) => ({ v: x.v, c: x.c }))} size={128} /><span className="absolute inset-0 flex items-center justify-center text-center text-[9.5px] font-bold leading-tight" style={{ color: SUB }}>Elemental<br />Decomposition</span></div>
            <div className="grid flex-1 gap-1.5">{comp.map((x) => <div key={x.k} className="text-[11.5px] leading-tight"><span className="mr-1.5 inline-block h-2 w-2 rounded-sm" style={{ background: x.c }} /><b>{x.k} {x.v.toFixed(2)}%</b><br /><span style={{ color: SUB }}>{x.u}</span></div>)}</div>
          </It>
          <div className="mt-3 grid grid-cols-[96px_1fr] gap-3">
            <Pic src={IMG("feldspar")} alt="장석 결정 표본" className="h-[96px] w-[96px]" cap="장석 표본" delay={0.5} />
            <It><p className="serif text-[16px] font-bold leading-[1.4]" style={{ color: "var(--k-champ)" }}>고부가가치<br />특수 광물 함유</p><p className="mt-1.5 text-[11.5px] leading-[1.6]" style={{ color: SUB }}>이오라이트(~10%) — 고부가가치 특수 세라믹 원료.</p></It>
          </div>
          <div className="mt-3"><Card t={<>엑시톤(Exciton) 중성자<Asm t="원문 주장 · 검증 필요" /></>} d="수치 200 이상 함유. 탄소포집, 바이오, 의료 등 미래 ESG 산업의 핵심 소재. (톤당 300~1,000만 원 고가 거래 가능성)" /></div>
          <Src>성분비와 특수 광물 함유는 공인 시험기관 성적서로 확인이 필요합니다.</Src>
        </S>
      </Body>
    );
  } },

  /* ── 시장 · 수요 ── */
  { id: "macro", ch: 2, render: () => (
    <Body>
      <S>
        <Head ey="Macro Trend" t={<>에너지 전환이 만드는<br />폭발적인 인프라 소재 수요</>} />
        <div className="mt-6">
          <Steps items={[
            { k: "Global", t: "글로벌 탄소중립 및 에너지 전환", d: "재생에너지 비중 확대 패러다임." },
            { k: "National", t: "국가 대형 신재생 인프라 확충", d: "대규모 조력발전 및 친환경 매립 프로젝트의 국책화." },
            { k: "Incheon", t: "인천만 조력발전 및 송도 인프라", d: "대규모 해상 토목 공사 본격화." },
            { k: "Demand", t: "폭발적인 인프라 소재 수요", d: "친환경 인프라 구축용 골재 및 소재 수요 발생 (국내 자급 필요성 대두)." },
          ]} />
        </div>
      </S>
    </Body>
  ) },
  { id: "trend", ch: 2, render: () => (
    <Body>
      <S>
        <Head ey="Global Trend" t={<>글로벌 에너지 전환 트렌드와<br />해양 인프라의 폭발적 성장</>} sub="글로벌 해양 재생에너지 및 인프라 시장 규모 추이 — 해양 에너지/인프라 섹터 연평균 성장률(CAGR) 급증." />
        <It className="glass mt-4 rounded-xl p-3.5">
          <div className="flex h-[110px] items-end gap-2">{[14, 20, 29, 41, 56, 76, 100].map((h, i) => <motion.div key={i} className="flex-1 origin-bottom rounded-t" style={{ height: `${h}%`, background: i > 4 ? "linear-gradient(180deg,#f3e3bd,#c9a96e)" : "#56677d" }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.9, delay: 0.4 + i * 0.09, ease: EASE }} />)}</div>
          <div className="mt-1.5 flex gap-2 text-center text-[10px]" style={{ color: SUB }}>{[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((y) => <span key={y} className="flex-1">{y}</span>)}</div>
          <p className="mt-1.5 text-[10px]" style={{ color: "var(--k-mute)" }}>추세 도식 · 원문에 수치 없음</p>
        </It>
        <div className="mt-3 grid gap-2.5">
          <Card n="1" t="RE100 가속화" d="글로벌 기업들의 100% 재생에너지 사용 요구." />
          <Card n="2" t="에너지 안보" d="지정학적 리스크를 탈피하기 위한 각국의 자원 자립 인프라 투자." />
          <Card n="3" t="해상 인프라 대형화" d="대규모 전력망 구축을 위한 방조제 및 해상 구조물 수요 급증." />
        </div>
      </S>
    </Body>
  ) },
  { id: "tide", ch: 2, render: () => (
    <Body>
      <S>
        <Head ey="Incheon Bay" t={<>세계 최대 조수간만의 차,<br />인천 해역의 독보적 에너지 잠재력</>} />
        <div className="mt-6"><Big label="조수간만의 차" pre="최대" to={9} unit="m+" sub="세계 5대 갯벌 및 최고 수준의 조수간만 차" /></div>
        <div className="mt-5 grid gap-2.5">
          <Card t="방조제 건설 예상 입지 ↔ 본 광산 입지" d="Expected Barrage Site와 Mining Site가 같은 해역에 놓입니다." />
          <Card t="글로벌 조력발전의 메카로 성장할 압도적 지형적 이점" />
          <Card t="수도권 산업단지 중심부로의 최단 거리 전력 공급망" />
        </div>
        <Src>인천만 조력발전은 계획·검토 단계의 사업으로, 추진 여부와 일정은 정부 정책에 따릅니다.</Src>
      </S>
    </Body>
  ) },
  { id: "location", ch: 2, render: () => (
    <Body>
      <S>
        <Head ey="Strategic Location & Logistics" t={<>수도권에 가장 가까운<br />대규모 광산</>} />
        <It className="glass mt-4 rounded-xl p-2"><MapGh /><p className="px-2 pb-1 text-[10px]" style={{ color: "var(--k-mute)" }}>위치 관계 도식 · 실제 축척과 다름</p></It>
        <Quote>수도권 최인접 대규모 광산: 물류비용 최소화를 통한 압도적 마진율 확보 및 적기 공급(JIT) 인프라 구축<Asm /></Quote>
      </S>
    </Body>
  ) },
  { id: "tidal", ch: 2, render: () => (
    <Body>
      <S>
        <Head ey="Infrastructure Opportunity" t="인천만 조력발전 인프라 기회" sub="프로젝트: 인천만 조력발전 방조제" />
        <div className="mt-5"><Big label="방조제 총 연장" to={18.3} d={1} unit="km" sub="동측 5.8km + 서측 7.3km + 남측 5.2km" /></div>
        <It className="glass mt-4 rounded-xl p-3.5"><p className="text-[13.5px] font-bold leading-[1.5]">수요량: <span style={{ color: "var(--k-champ)" }}>약 500만㎥ 이상</span>의 매립/구조용 골재 필수<Asm /></p></It>
        <It><p className="mt-5 text-[12px] font-bold" style={{ color: GOLD }}>수입 대체 및 가격 경쟁력<Asm /></p></It>
        <div className="mt-2.5 grid gap-3">
          <HBar l="중국산 골재 (기존 단가 / 수입 금지)" v={40000} max={40000} txt="40,000원/㎥" c="#56677d" />
          <HBar l="강화 제1광산 (압도적 가격 경쟁력 우위)" v={35000} max={40000} txt="35,000원/㎥" delay={0.2} />
        </div>
      </S>
    </Body>
  ) },
  { id: "demand", ch: 2, render: () => (
    <Body>
      <S>
        <Head ey="Aggregate Demand" t="방조제 및 토목 골재 수요" />
        <div className="mt-5"><Big label="2025~2030년 확정적/잠재적 골재 수요" pre="총" to={1370} unit="만㎥ 이상" asm /></div>
        <div className="mt-5 grid gap-3.5">
          <HBar l="송도 11공구 매립 (~2030년)" v={650} max={650} txt="약 650만㎥" />
          <HBar l="인천만 조력발전 방조제" v={500} max={650} txt="약 500만㎥" c="#7fa3cf" delay={0.15} />
          <HBar l="인천대·연세대·인하대 캠퍼스 확장" v={220} max={650} txt="약 220만㎥" c="#56677d" delay={0.3} />
        </div>
        <Quote>당사의 6,599만㎥ 매장량은 이를 장기적으로 소화 가능한 유일한 수도권 대안.<Asm /></Quote>
      </S>
    </Body>
  ) },
  { id: "tam", ch: 2, render: () => (
    <Body>
      <S>
        <Head ey="Market Sizing" t="시장 규모 및 수익성 변환" />
        <div className="mt-4"><Rings items={["TAM · 수도권 전체 골재 시장", "SAM · 타겟 인프라 시장", "SOM"]} /></div>
        <It><p className="mt-3 text-[11.5px] leading-[1.7]" style={{ color: SUB }}>TAM 수도권 대규모 매립/토목 수요 · SAM 송도 매립 및 조력발전 골재(약 1,370만㎥) · SOM 방조제 최우선 타겟 매출 500만㎥ × 35,000원</p></It>
        <div className="mt-4"><Big label="단기 타겟 매출" to={1750} unit="억 원" asm /></div>
        <div className="mt-4"><KV rows={[["수입산(중국)", "40,000원/㎥ · 현재 수입 제한 리스크"], ["내륙 운송 골재", "단가 산정 불가 · 물류비 과다로 채산성 부족"], ["강화 제1광산", <b key="v" style={{ color: "var(--k-champ)" }}>35,000원/㎥ · 해상 물류 기반 압도적 단가 경쟁력</b>]]} /></div>
      </S>
    </Body>
  ) },

  /* ── 사업 모델 ── */
  { id: "model", ch: 3, render: () => (
    <Body>
      <S>
        <Head ey="Value-Add & Margin Expansion" t="비즈니스 모델: 밸류체인 확장" />
        <div className="mt-6">
          <Steps items={[
            { k: "Phase 1 · Raw Material", t: "원물 생산", d: "A/B/C급 장석 및 폐장석 생산 · 세라믹 및 유리 원료 공급 (안정적 캐시카우)" },
            { k: "Phase 2 · Infrastructure Materials", t: "인프라 자재", d: "건축용, 매립용, 기반시설용 골재(KS규격 준수) · 방조제 및 송도 인프라 직공급" },
            { k: "Phase 3 · Advanced Materials", t: "첨단 소재", d: <>엑시톤 고부가 분말 가공 · 탄소포집, 에너지 효율 향상, 의료/바이오 특수 용도 적용<Asm t="검증 필요" /></> },
          ]} />
        </div>
        <It className="mt-4"><Pic src={IMG("aggregate")} alt="골재 규격별 표본" className="h-[84px] w-full" cap="골재 규격별 표본" delay={0.9} /></It>
      </S>
    </Body>
  ) },
  { id: "logistics", ch: 3, render: () => (
    <Body>
      <S>
        <Head ey="Logistics & Supply" t="해상 운송 및 공급 체계" />
        <div className="mt-5 grid gap-2.5">
          <Card n="M" t="Main — 해상 운송" d="2,000톤급 바지선 활용 (강화 → 송도/조력발전 해상 직공급)" hl />
          <Card n="S" t="Sub — 육상 운송" d="강화대교 및 인천대로 보조 활용" />
        </div>
        <It><p className="corm mt-6 text-[15px] font-semibold uppercase tracking-[0.2em]" style={{ color: GOLD }}>CAPEX-Light Strategy</p></It>
        <div className="mt-2.5 grid gap-1.5">
          <Card t="채굴 장비 / 선별 시설 / 운송 수단" />
          <Dn />
          <Card t="전문업체 지입 및 수수료(렌탈) 방식 도입" />
          <Dn />
          <Card hl t={<>효과<Asm /></>} d="초기 자본(CAPEX) 부담 최소화 (핵심 인프라 10억 원 외 분산), 고정비 절감, 운영 유연성 극대화." />
        </div>
      </S>
    </Body>
  ) },
  { id: "valuation", ch: 3, render: () => (
    <Body>
      <S>
        <Head ey="Revenue & Valuation" t={<>수익 모델 및<br />자산 밸류에이션<Asm /></>} />
        <It className="glass mt-5 overflow-hidden rounded-xl">
          <div className="grid grid-cols-[1fr_1fr_1.3fr] px-3.5 py-2 text-[11.5px] font-bold" style={{ background: "rgba(201,169,110,.14)", color: GOLD }}><span>구분</span><span>매출</span><span>순이익</span></div>
          {[["장석", "73.2억", "24.4억 (순이익률 33.3%)"], ["일반 골재", "150억", "50억"], ["엑시톤 소재", "50억", "35억 (생산 1,000톤 기준)"]].map((r) => <div key={r[0]} className="grid grid-cols-[1fr_1fr_1.3fr] border-t px-3.5 py-2.5 text-[12.5px]" style={{ borderColor: "rgba(255,255,255,.08)" }}><b>{r[0]}</b><span>{r[1]}</span><span style={{ color: "var(--k-champ)" }}>{r[2]}</span></div>)}
        </It>
        <It><p className="mt-2 text-[10.5px]" style={{ color: SUB }}>* 방조제 특수 수요 1,750억 원은 별도 단기 고수익으로 산정</p></It>
        <div className="mt-5 grid gap-3">
          <HBar l="DCF 기반 가치 (장석+골재+엑시톤 미래현금흐름)" v={1650} max={1900} txt="1,650억 원" c="#56677d" />
          <HBar l="자산가치 반영 (매장량 자산가치 2,670억 원 중 보수적 반영)" v={250} max={1900} txt="+ 250억 원" c="#7fa3cf" delay={0.2} />
          <HBar l="최종 종합 감정가치" v={1900} max={1900} txt="1,900억 원" delay={0.4} />
        </div>
        <Src>{ASM_NOTE} 금융 구조 장의 담보 평가액(400억 원)과는 산정 기준이 다릅니다.</Src>
      </S>
    </Body>
  ) },
  { id: "forecast", ch: 3, render: () => (
    <Body>
      <S>
        <Head ey="5-Year Outlook" t={<>자원 판매 기반<br />중장기 매출 전망<Asm /></>} sub="장석 및 골재 · 단위: 억 원" />
        <div className="mt-4"><VBars max={850} data={[{ l: "1년차", a: 120, b: 30, top: "150억" }, { l: "2년차", a: 180, b: 70, top: "250억" }, { l: "3년차", a: 200, b: 250, top: "450억" }, { l: "4년차", a: 220, b: 430, top: "650억" }, { l: "5년차", a: 250, b: 600, top: "850억" }]} /></div>
        <It><p className="mt-2 text-[11px]" style={{ color: SUB }}><span className="mr-1 inline-block h-2 w-2 rounded-sm" style={{ background: "#56677d" }} />인프라 골재(안정적 Base) <span className="ml-2 mr-1 inline-block h-2 w-2 rounded-sm" style={{ background: "#c9a96e" }} />고부가가치 엑시톤 및 장석(폭발적 Upside) · 3년차 고부가가치 소재 비중 역전</p></It>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <It className="glass rounded-xl p-3"><p className="text-[11px] font-bold" style={{ color: GOLD }}>영업 이익률 (Margin)</p><p className="mt-1 text-[13px] font-bold leading-[1.5]">3년차 기점 35% 상회 전망</p></It>
          <It className="glass rounded-xl p-3"><p className="text-[11px] font-bold" style={{ color: GOLD }}>부채 상환 능력 (DSCR)</p><p className="mt-1 text-[13px] font-bold leading-[1.5]">연간 매출액 기반 CB 이자 지급 및 원금 상환 재원 300% 이상 초과 달성 전망</p></It>
        </div>
      </S>
    </Body>
  ) },
  { id: "leap", ch: 3, render: () => (
    <Body>
      <S>
        <Head ey="Three Stages" t={<>친환경 골재에서 첨단 엑시톤·<br />탄소포집 소재 기업으로의 도약</>} />
        <div className="mt-6 grid gap-2.5">
          {[["1단계", "친환경 터널식 골재 및 광물 채굴", "안정적 초기 캐시플로우 창출.", "72%"], ["2단계", "조력발전 및 해상 인프라 밸류체인 장악", "방조제 건설 기초 소재 독점 공급망 구축.", "86%"], ["3단계", "단순 광산업을 넘어선 기후 테크 리더", "단기적 고수익 창출을 넘어, 미래 기후 변화 대응 시장을 선점하는 장기적 확장 비전.", "100%"]].map(([k, t, d, w], i) => (
            <motion.div key={k} className="glass origin-left rounded-xl p-3.5" style={{ width: w }} initial={{ x: -60, scaleX: 0.6 }} animate={{ x: 0, scaleX: 1 }} transition={{ duration: 0.9, delay: 0.3 + i * 0.2, ease: EASE }}>
              <p className="corm text-[13px] font-semibold tracking-[0.18em]" style={{ color: GOLD }}>{k}</p><p className="mt-0.5 text-[14.5px] font-bold leading-[1.4]">{t}</p><p className="mt-1 text-[12px] leading-[1.6]" style={{ color: SUB }}>{d}</p>
            </motion.div>
          ))}
        </div>
      </S>
    </Body>
  ) },

  /* ── 리스크 ── */
  { id: "risk", ch: 4, render: () => (
    <Body>
      <S>
        <Head ey="Risk Analysis" t="리스크 분석 및 통제" sub="영향도(Impact) × 발생 가능성(Probability)" />
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          {[["R1", "환경 규제 및 인허가", "해안지역(50m 이내) 보호 및 경관 훼손 논쟁 가능성"], ["R2", "조력발전 정책 지연", "방조제 착공 지연으로 인한 대규모 골재 수요 시점 이연"], ["R4", "원자재 및 운송비 변동", "유가 상승 등에 따른 마진 압박"], ["R3", "엑시톤 상용화 불확실성", "특수 광물 시장 진입 및 기술 검증 지연"]].map(([k, t, d], i) => (
            <motion.div key={k} className="glass rounded-xl p-3" initial={{ scale: 0.6, rotate: i % 2 ? 4 : -4 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 0.8, delay: 0.3 + i * 0.12, ease: EASE }}>
              <p className="corm text-[22px] font-semibold leading-none goldtext">{k}</p><p className="mt-1.5 text-[13px] font-bold leading-[1.4]">{t}</p><p className="mt-1 text-[11.5px] leading-[1.55]" style={{ color: SUB }}>{d}</p>
            </motion.div>
          ))}
        </div>
      </S>
    </Body>
  ) },
  { id: "mitigation", ch: 4, render: () => (
    <Body>
      <S>
        <Head ey="Mitigation Strategy" t={<>리스크 대응 및<br />기술적 완화 전략</>} />
        <div className="mt-5 grid gap-2.5">
          <Card n="R1" t="친환경 공법" d="노천 채굴이 아닌 갱도/터널식 채굴로 환경 훼손 제로화." />
          <Card n="R2" t="포트폴리오 다각화" d="송도 11공구, 대학 캠퍼스 등 확정 수요 선공급 및 장석 기본매출로 버퍼 확보." />
          <Card n="R3" t="산학협력" d="대학/연구기관과 R&D 파트너십으로 검증 가속." />
          <Card n="R4" t="수수료/지입 구조" d="유동적 물류비용 전가를 통한 마진 방어." />
        </div>
        <div className="mt-3"><Pic src={IMG("tunnel")} alt="터널식 채굴 갱구 참고 이미지" className="h-[130px] w-full" cap="터널식 채굴 참고 이미지" delay={0.8} /></div>
        <It><p className="mt-2 text-[11.5px] leading-[1.7]" style={{ color: SUB }}>표토층 100% 보존 · 해안 50m 규제 완벽 준수 · 친환경 터널식 지하채굴 · 자연 배수구조 활용</p></It>
      </S>
    </Body>
  ) },

  /* ── 금융 구조 (가정) ── */
  { id: "fin-intro", ch: 5, render: () => (
    <Body center>
      <S>
        <It><p className="corm text-[13px] font-semibold uppercase tracking-[0.3em]" style={{ color: GOLD }}>Part 2 · Financial Structure</p></It>
        <h2 className="serif mt-3 text-[30px] font-black leading-[1.35]">금융 구조<br /><span className="goldtext">검토안</span></h2>
        <It><p className="mt-5 text-[13.5px] leading-[1.85]" style={{ color: SUB }}>이 장의 평가액, 발행 조건, 지분 배분, 담보 설정, 회수 경로는 모두 <b style={{ color: "var(--k-champ)" }}>가정</b>입니다. 감정평가서와 법률·회계 검토, 상장사 이사회와 감독 당국의 절차를 거치기 전 단계의 구상입니다.</p></It>
        <div className="mt-5 grid gap-2.5">
          <Card t="담보는 원금 보장이 아닙니다" d="회수 금액은 담보의 실제 처분 가치와 절차에 따라 달라집니다." />
          <Card t="공시·심사 의무는 구조와 무관하게 적용됩니다" d="현물출자 가액 평가, 전환사채 발행, 최대주주 변경에 따르는 절차는 별도로 검토해야 합니다." />
        </div>
      </S>
    </Body>
  ) },
  { id: "fin-overview", ch: 5, render: () => (
    <Body>
      <S>
        <Head ey="Structure Overview" t={<>프로젝트 금융 구조 개요<Asm /></>} sub="강화 조력발전 및 광물 플랫폼" />
        <div className="mt-5 grid gap-1.5">
          <Card n="A" t="자산 기반 — 강화 제1광산 광업권" d="400억 원 규모의 검증된 실물 자산 · 고부가가치 장석 및 골재 매장" />
          <Dn />
          <Card n="B" hl t="운용 플랫폼 — 선출자 SPC" d="10억 원 규모 프로젝트 전담 법인 · 광업권 현물출자(자산 권리 이관)" />
          <Dn />
          <Card n="C" t="자본 엔진 — 코스닥 상장사" d="400억 원 규모 담보부 전환사채(CB) 발행 (100억 원 × 4회) · 조력발전 인프라 소재 공급망 구축 · 상장사 기업가치 극대화의 핵심 축" />
        </div>
        <Quote>광업권 현물출자와 SPC 설립, 담보부 CB 발행으로 이어지는 투명하고 안전한 금융 구조.<Asm t="목표" /></Quote>
      </S>
    </Body>
  ) },
  { id: "fin-spc", ch: 5, render: () => (
    <Body>
      <S>
        <Head ey="SPC First" t={<>금융감독원 규제 리스크를<br />원천 차단하는 선(先)출자 SPC 구조<Asm t="가정 · 법률 검토 전" /></>} />
        <It className="glass mt-5 rounded-xl p-3.5">
          <p className="text-[12px] font-bold" style={{ color: SUB }}>기존 방식 — 직접 투자 구조 (고위험)</p>
          <p className="mt-1 text-[13px] font-bold">상장사 → 광업권 인수</p>
          <ul className="mt-2 grid gap-1 text-[12px] leading-[1.6]" style={{ color: SUB }}><li>· 금감원 엄격한 심사 및 규제 노출</li><li>· 대주주 지위 변동에 따른 경영권 리스크</li><li>· 자본 시장 내 구조적 불확실성 증대</li></ul>
        </It>
        <It className="mt-2.5 rounded-xl border p-3.5" style={{ borderColor: GOLD, background: "rgba(201,169,110,.1)" }}>
          <p className="text-[12px] font-bold" style={{ color: GOLD }}>본 건 구조 — SPC 선출자 우회 구조 (안정성 확보)<Asm /></p>
          <p className="mt-1 text-[13px] font-bold">광업권 → 초기 SPC(현물출자 완료<Asm t="예정" />) ← 담보부 CB 발행</p>
          <ul className="mt-2 grid gap-1 text-[12px] leading-[1.6]"><li>· 대주주 지위 변동 리스크 원천 차단</li><li>· 규제 리스크 우회를 통한 신속한 자금 집행</li><li>· 실물 자산 기반의 견고한 지배구조 확립</li></ul>
        </It>
        <Src>위 효과는 사업 주체의 가정입니다. 관련 심사·공시 의무의 적용 여부는 법률 검토로 확인해야 하며, 이 구조가 해당 절차를 면제하는 것은 아닙니다.</Src>
      </S>
    </Body>
  ) },
  { id: "fin-equity", ch: 5, render: () => (
    <Body>
      <S>
        <Head ey="SPC Capital" t={<>SPC 설립 및<br />지분 배분 로직<Asm /></>} sub="초기 자본금 10억 원 규모" />
        <div className="mt-5 grid gap-3.5">
          <HBar l="현금 유동성 — 법인 설립, 회계/법률 자문 및 초기 제반 비용" v={10} max={410} txt="10억 원" c="#7fa3cf" />
          <HBar l="광업권 현물출자 — 강화 제1광산 실물 자산 자본화 완료(예정)" v={400} max={410} txt="400억 원" c="#56677d" delay={0.15} />
          <HBar l="SPC 총 자산" v={410} max={410} txt="410억 원" delay={0.3} />
        </div>
        <It className="mt-5 rounded-xl border p-3.5" style={{ borderColor: GOLD, background: "rgba(201,169,110,.1)" }}>
          <p className="serif text-[17px] font-bold" style={{ color: "var(--k-champ)" }}>브릿지 투자자 특별 혜택 <span className="corm text-[13px]">(Asymmetric Upside)</span></p>
          <div className="mt-2.5 grid grid-cols-2 gap-2.5 text-[12.5px]"><div><p style={{ color: SUB }}>초기 리스크 테이킹</p><p className="mt-0.5 font-bold">10억 원 출자</p></div><div><p style={{ color: SUB }}>지분 프리미엄 보상</p><p className="mt-0.5 font-bold">50억 원 상당의 SPC Equity 배분 (약 12%)</p></div></div>
        </It>
        <Src>지분 가치는 광업권 현물출자 가액(400억 원)이 감정평가로 인정된다는 가정에 따릅니다.</Src>
      </S>
    </Body>
  ) },
  { id: "fin-asset", ch: 5, render: () => (
    <Body>
      <S>
        <Head ey="Underlying Asset" t={<>핵심 기초 자산:<br />강화 제1광산 가치 평가<Asm /></>} />
        <div className="mt-5"><Big label="공식 감정평가액 — 보수적 산정 기준 적용을 통한 객관적 담보 가치 입증" to={400} unit="억 원" sub="40,000,000,000 KRW" asm /></div>
        <div className="mt-5 grid gap-2.5">
          <Card t="핵심 매장 자원" d="고부가가치 장석 및 대규모 해상 인프라용 골재 · 터널식 친환경 채굴 공법 적용으로 환경 리스크 제로화" />
          <Card t="메가 프로젝트 대기 수요 (Off-take)" d="인천 송도 매립지 & 조력발전 방조제 건설 — 확실한 해상 인프라 수요처 확보로 채굴 즉시 수익화 전환" />
        </div>
        <Src>감정평가서 원본 확인이 필요합니다. 앞 장의 종합 감정가치 1,900억 원(DCF 혼합)과 이 담보 평가액 400억 원은 서로 다른 기준의 숫자입니다.</Src>
      </S>
    </Body>
  ) },
  { id: "fin-bridge", ch: 5, render: () => (
    <Body>
      <S>
        <Head ey="Bridge Funding" t={<>10억 원 브릿지<br />투자 유치 구조<Asm /></>} sub="상장사 담보부 CB(400억 원) 발행을 완벽하게 준비하기 위한 필수 초기 인프라 구축" />
        <div className="mt-5"><Big label="초기 브릿지 펀딩 조달 → SPC 마중물 자본" to={10} unit="억 원" /></div>
        <div className="mt-5 grid gap-2.5">
          <Card n="01" t="SPC 법인 설립 및 구조화 비용" d="완벽한 금융 및 지배구조 설계를 위한 초기 자본" />
          <Card n="02" t="공식 감정평가 수수료" d="400억 원 규모 광업권 현물출자를 위한 공인 평가 집행" />
          <Card n="03" t="금감원 대응 및 실사(DD) 비용" d="법률 및 회계 실사(Due Diligence)를 통한 리스크 완벽 제거" />
        </div>
      </S>
    </Body>
  ) },
  { id: "fin-use", ch: 5, render: () => (
    <Body>
      <S>
        <Head ey="Use of Proceeds" t={<>담보부 CB 대금<br />집행 계획<Asm /></>} sub="자금 유입: 상장사 담보부 CB 대금 400억 원" />
        <It className="mt-4 flex items-center gap-4">
          <div className="relative shrink-0"><Donut data={[{ v: 50, c: "#c9a96e" }, { v: 25, c: "#7fa3cf" }, { v: 25, c: "#56677d" }]} size={120} /><span className="absolute inset-0 flex items-center justify-center text-[13px] font-bold" style={{ color: "var(--k-champ)" }}>400억</span></div>
          <div className="grid gap-1.5 text-[12px]">{[["#c9a96e", "CAPEX 50%"], ["#7fa3cf", "OPEX 25%"], ["#56677d", "ESG & Future 25%"]].map(([c, t]) => <span key={t}><span className="mr-1.5 inline-block h-2 w-2 rounded-sm" style={{ background: c }} /><b>{t}</b></span>)}</div>
        </It>
        <div className="mt-4 grid gap-2.5">
          <Card t="CAPEX — 자본적 지출 (50%)" d="최신 터널식 친환경 채굴 설비 · 대규모 파쇄장 구축 · 물류 및 운송 인프라 · 안전 및 환경 관리 시스템" />
          <Card t="OPEX — 운영 지출 (25%)" d="초기 골재 채굴 인건비 · 장석 가공 및 분류 공정 · 현장 운영 및 물류비용" />
          <Card t="ESG & Future — 에너지 그린 인프라 (25%)" d="조력발전 해상 인프라 소재 가공 · 탄소포집 엑시톤 자원 연구 개발" />
        </div>
        <Quote>수익화 전환: 생산된 골재의 즉각적인 판매망 투입을 통한 초기 Cash Flow 극대화<Asm t="목표" /></Quote>
      </S>
    </Body>
  ) },
  { id: "fin-tranche", ch: 5, render: () => (
    <Body>
      <S>
        <Head ey="Issuance Structure" t={<>담보부 CB 발행 구조<Asm /></>} sub="총 발행 규모: 400억 원 (코스닥 상장사 주체)" />
        <div className="mt-5 flex items-end gap-2">
          {[1, 2, 3, 4].map((n) => (
            <motion.div key={n} className="glass flex-1 origin-bottom rounded-lg px-1 py-2 text-center" style={{ height: 52 + n * 16 }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.8, delay: 0.3 + n * 0.14, ease: EASE }}>
              <p className="corm text-[12px] font-semibold" style={{ color: GOLD }}>Tranche {n}</p><p className="text-[12.5px] font-bold">100억 원</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 grid gap-2.5">
          <Card n="A" t="4회 분할 발행 구조" d="100억 원씩 4회에 걸쳐 순차적 발행. 시장 충격(Overhang)을 완화하고 채굴 공정률과 연동하여 자본 효율성을 극대화." />
          <Card n="B" t="2회 분할(50% 권리) 구조" d="200억 원씩 2회에 걸쳐 대규모 단위로 발행. 신속한 인프라 구축 자금 조달 및 강력한 초기 드라이브 확보." />
        </div>
        <Quote>핵심 목적: 대규모 자본의 일시 유입에 따른 오버행(Overhang) 이슈 사전 차단 및 자금 집행의 투명성/안정성 확보</Quote>
      </S>
    </Body>
  ) },
  { id: "fin-terms", ch: 5, render: () => (
    <Body>
      <S>
        <Head ey="Term Sheet" t={<>기관 투자자 수익성 및 안정성을<br />보장하는 담보부 CB 주요 발행 조건<Asm t="목표 · 가정" /></>} />
        <div className="mt-5">
          <KV rows={[["발행 형태", "제X회차 무기명식 이권부 무보증 담보부 전환사채"], ["표면 이율", <span key="a"><b style={{ color: "var(--k-champ)" }}>0.0%</b> — 초기 이자 비용 최소화 및 전환 가치 집중</span>], ["만기 수익률", <span key="b"><b style={{ color: "var(--k-champ)" }}>4.0%</b> (YTM) — 투자자 하방 경직성 확보</span>], ["만기일", "발행일로부터 3년 (안정적 엑시트 윈도우)"], ["전환 가액", "기준 주가 대비 픽싱 (발행 후 70% 한도 리픽싱 조항 포함)"], ["담보 조건", <span key="c">SPC 보유 400억 원 규모 광업권 1순위 근저당 설정 (완벽한 원금 보장<Asm t="목표 · 가정" />)</span>]]} />
        </div>
        <div className="mt-3 grid gap-2.5">
          <Card n="1" t="주가 상승 시 전환을 통한 막대한 Capital Gain" />
          <Card n="2" t="주가 하락 시 400억 실물 자산 매각 대금을 통한 원금 회수" />
          <Card n="3" t="상장사 주도의 객관적 비용 집행으로 회계 투명성 입증" />
        </div>
        <Src>조건과 효과는 확정 전 가정입니다. 원금 회수액은 담보의 실제 처분 가치에 따라 달라집니다.</Src>
      </S>
    </Body>
  ) },
  { id: "fin-collateral", ch: 5, render: () => (
    <Body>
      <S>
        <Head ey="Collateral Mechanism" t={<>400억 원 실물 자산 기반의<br />완벽한 1:1 담보 설정 메커니즘<Asm t="목표 · 가정" /></>} />
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <It className="glass rounded-xl p-3"><p className="text-[11px] font-bold" style={{ color: GOLD }}>담보 제공자</p><p className="mt-1 text-[13px] font-bold">선출자 SPC</p><p className="text-[11.5px]" style={{ color: SUB }}>광업권 100% 보유 법인</p></It>
          <It className="glass rounded-xl p-3"><p className="text-[11px] font-bold" style={{ color: GOLD }}>담보권자</p><p className="mt-1 text-[13px] font-bold">코스닥 상장사</p><p className="text-[11.5px]" style={{ color: SUB }}>CB 발행 주체 및 자금 통제권자</p></It>
        </div>
        <It className="relative mx-auto mt-5 flex h-[170px] w-[170px] items-center justify-center">
          <motion.div className="liquid absolute inset-0 border" style={{ borderColor: GOLD, background: "rgba(201,169,110,.1)" }} animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} />
          <motion.div className="liquid absolute inset-6" style={{ background: "rgba(86,103,125,.5)" }} animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} />
          <div className="relative text-center"><p className="text-[10.5px]" style={{ color: SUB }}>담보 자산 400억 원</p><p className="corm my-0.5 text-[26px] font-semibold goldtext">LTV 100%</p><p className="text-[10.5px]" style={{ color: SUB }}>발행 부채 400억 원</p></div>
        </It>
        <It><p className="mt-3 text-center text-[12.5px] font-bold" style={{ color: "var(--k-champ)" }}>LTV 100% 매칭 – 자산 기반 강력한 원금 보장 구조<Asm t="목표 · 가정" /></p></It>
        <div className="mt-5 grid gap-2.5">
          <Card t="법적 권리" d={<>1순위 질권 및 근저당 설정 완료<Asm t="예정" /></>} />
          <Card t="방어 기제" d="부도 또는 유동성 위기 발생 시 즉각적인 실물 담보권 실행(Foreclosure)을 통한 현금화 가능" />
        </div>
        <Src>LTV 100%는 감정가 400억 원이 유지된다는 가정입니다. 광업권은 처분 시장이 좁아 실제 회수액은 감정가와 다를 수 있습니다.</Src>
      </S>
    </Body>
  ) },
  { id: "fin-downside", ch: 5, render: () => (
    <Body>
      <S>
        <Head ey="Downside Scenarios" t={<>다운사이드(Downside) 리스크를<br />원천 차단하는 다중 투자자 보호 장치<Asm t="목표 · 가정" /></>} sub="스트레스 시나리오별 방어 메커니즘" />
        <div className="mt-5 grid gap-2.5">
          <Card n="01" t="주가 하락 및 전환 가치 상실" d="만기 시 원리금 상환 청구(Put Option) 실행 및 조력발전 방조제 골재 판매 대금 기반의 강력한 현금 에스크로(Escrow) 가동." />
          <Card n="02" t="상장사 유동성 위기 및 디폴트 발생" d={<>400억 원 규모의 실물 광업권 담보 즉각 실행(Foreclosure). 제3자 독립적 매각 권리 발동을 통한 원금 100% 보전<Asm t="목표" />.</>} />
          <Card n="03" t="금감원 심사 지연 및 대주주 지위 리스크" d={<>선(先) 현물출자 SPC 구조를 통해 상장사 직접 인수에 따른 규제 리스크 원천 배제. 지배구조의 완벽한 분리 및 안정성 확보<Asm t="법률 검토 전" />.</>} />
        </div>
        <Quote>결론: 어떠한 시장 환경 및 기업 리스크 하에서도 투자 원금 손실을 방어하는 철벽 구조 완성<Asm t="목표 · 가정" /></Quote>
        <Src>실제 회수액은 담보 처분가와 수요처 매출 실현 여부에 따라 달라집니다.</Src>
      </S>
    </Body>
  ) },
  { id: "fin-upside", ch: 5, render: () => (
    <Body>
      <S>
        <Head ey="Upside Momentum" t={<>주가 상승(Upside Potential)을 견인하는<br />고부가가치 자원 및 ESG 모멘텀<Asm /></>} />
        <It className="glass mt-4 rounded-xl p-2">
          <svg viewBox="0 0 320 150" className="w-full" role="img" aria-label="기본 매출선과 성장 모멘텀 곡선 도식">
            <line x1="14" y1="134" x2="310" y2="134" stroke="rgba(255,255,255,.2)" /><line x1="14" y1="134" x2="14" y2="10" stroke="rgba(255,255,255,.2)" />
            <motion.path d="M14,118 L300,92" stroke="#8792a3" strokeWidth="2" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.4 }} />
            <motion.path d="M150,106 C200,104 250,84 296,14" stroke="#e3c78d" strokeWidth="2.6" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, delay: 1.1, ease: EASE }} />
            {[[196, 100, "1"], [244, 76, "2"], [278, 40, "3"]].map(([x, y, n], i) => <g key={n}><motion.circle cx={x} cy={y} r="8" fill="#10161f" stroke="#c9a96e" strokeWidth="1.4" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.6 + i * 0.25 }} style={{ transformOrigin: `${x}px ${y}px` }} /><text x={x as number} y={(y as number) + 3.5} fontSize="9" fontWeight="700" fill="#ecdcb6" textAnchor="middle">{n}</text></g>)}
            <text x="20" y="108" fontSize="8.5" fill="#9eabbf">Baseline Revenue</text><text x="150" y="122" fontSize="8.5" fill="#c9a96e">모멘텀 트리거</text>
          </svg>
        </It>
        <div className="mt-3 grid gap-2.5">
          <Card t="전통적 캐시카우" d="인프라용 골재의 대규모 안정적 공급 (Baseline Revenue)" />
          <Card n="1" t="인천 송도 및 조력발전 해상 인프라 구축의 핵심 벤더 진입" />
          <Card n="2" t="탄소포집 및 바이오 산업용 고부가가치 엑시톤(Exciton) 소재 상용화" />
          <Card n="3" t="친환경 터널식 채굴 기반 ESG 경영 모범 사례 등극" />
        </div>
        <Quote>단순 광업을 넘어선 '친환경 인프라 & 미래 소재 플랫폼'으로의 시장 인식 대전환 — 상장사 기업가치(EV) 리레이팅 달성<Asm t="목표" /></Quote>
      </S>
    </Body>
  ) },
  { id: "fin-exit", ch: 5, render: () => (
    <Body>
      <S>
        <Head ey="Exit Strategy" t={<>시장 상황에 유연하게 대응하는<br />이원화된 엑시트(Exit) 전략<Asm /></>} sub="CB 전환 기간 도래 및 만기 시점" />
        <It className="mt-5 rounded-xl border p-3.5" style={{ borderColor: GOLD, background: "rgba(201,169,110,.1)" }}>
          <p className="text-[12px] font-bold" style={{ color: GOLD }}>시나리오 A — 코스닥 상장사 주가 급등</p>
          <p className="mt-1.5 text-[13px] font-bold leading-[1.6]">전환권 행사(Conversion to Equity) → 코스닥 시장 내 주식 매각을 통한 막대한 자본 이득(Capital Gain) 실현</p>
        </It>
        <It className="glass mt-2.5 rounded-xl p-3.5">
          <p className="text-[12px] font-bold" style={{ color: BLUE }}>시나리오 B — 주가 보합 또는 시장 침체</p>
          <p className="mt-1.5 text-[13px] font-bold leading-[1.6]">만기 상환 청구(Put Option) 및 원리금 수취 → 조력발전 골재 판매 매출 현금흐름을 통한 안정적인 100% 원리금 회수<Asm t="목표" /></p>
        </It>
        <Quote>'Heads I win, Tails I don't lose' — 수익 비대칭성 구조의 완벽한 실현. 채굴 자원의 확실한 수요처 확보가 하방 현금흐름을 강력 지지함.<Asm t="목표 · 가정" /></Quote>
        <Src>상환 재원은 수요처 확보와 골재 매출이 실현된다는 가정에 따릅니다.</Src>
      </S>
    </Body>
  ) },
  { id: "fin-points", ch: 5, render: () => (
    <Body>
      <S>
        <Head ey="Investment Points" t={<>핵심 투자 포인트: 완벽하게 통제된<br />리스크와 극대화된 수익성<Asm t="목표 · 가정" /></>} />
        <It className="mx-auto mt-4 w-[210px]">
          <svg viewBox="0 0 220 190" role="img" aria-label="구조 안정성, 수익 확대, 담보력의 세 축 도식">
            <motion.path d="M110,14 L206,176 L14,176 Z" fill="rgba(201,169,110,.08)" stroke="#c9a96e" strokeWidth="2" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.8, delay: 0.3 }} />
            <text x="110" y="120" fontSize="10" fontWeight="700" fill="#ecdcb6" textAnchor="middle">모든 구조가 상호 지지하는</text><text x="110" y="134" fontSize="10" fontWeight="700" fill="#ecdcb6" textAnchor="middle">무결점 금융 펀더멘탈</text>
          </svg>
        </It>
        <div className="mt-3 grid gap-2.5">
          <Card n="1" t="선출자 SPC 기반 규제 리스크 차단 (Structural Stability)" d="상장사 직접 인수 우회를 통한 금감원 리스크 배제 및 회계적 투명성 완비" />
          <Card n="2" t="친환경 ESG & 소재 산업 진출 (Upside)" d="조력발전 인프라 모멘텀이 보장하는 강력한 현금흐름과 코스닥 상장사 주식 전환 차익 극대화" />
          <Card n="3" t="무결점 실물 자산 담보력 (Downside Protection)" d="평가액 400억 원의 강화 제1광산 실물 광업권을 통한 100% 원금 방어선 구축" />
        </div>
      </S>
    </Body>
  ) },
  { id: "fin-effect", ch: 5, render: () => (
    <Body>
      <S>
        <Head ey="Strategic Effect" t={<>인프라 소재 플랫폼을 통한<br />상장사 가치 재창출<Asm /></>} />
        <div className="mt-5 grid gap-1.5">
          <Card n="A" t="강화 제1광산" d="안정적 캐시카우 확보" /><Dn />
          <Card n="B" t="조력발전 및 해상 메가 인프라" d="미래 산업 진출 & ESG 프리미엄" /><Dn />
          <Card n="C" hl t="코스닥 상장사" d="기업가치 퀀텀 점프" />
        </div>
        <div className="mt-4 grid gap-2.5">
          <Card t="변동성 높은 기존 사업을 보완하는 강력하고 예측 가능한 실물 자산 매출 파이프라인 추가" />
          <Card t="조력발전 방조제 건설 및 탄소포집 소재 밸류체인 핵심 벤더 편입을 통한 친환경 ESG 경영 확립" />
          <Card t="최종 결과: 성공적인 400억 자본 유치 및 플랫폼 확장을 통한 상장사 총 기업가치(Enterprise Value)의 폭발적 성장 도출" />
        </div>
      </S>
    </Body>
  ) },

  /* ── ESG · 공공성 ── */
  { id: "esg-roadmap", ch: 6, render: () => (
    <Body>
      <S>
        <Head ey="Net Zero Roadmap" t={<>국가 탄소중립 로드맵과<br />완벽히 일치하는 전략적 궤도</>} sub="한국의 2050 탄소중립 시나리오와 재생에너지 비중 확대 정책은 거스를 수 없는 국가적 사명입니다. 본 프로젝트는 이 거대한 흐름의 가장 안정적인 기반이 됩니다." />
        <It className="relative mt-7 px-1">
          <motion.div className="h-[3px] origin-left rounded-full" style={{ background: "linear-gradient(90deg,#56677d,#c9a96e)" }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.6, delay: 0.4, ease: EASE }} />
          <div className="mt-2 flex justify-between text-[12px] font-bold"><span>2030 NDC<br /><span className="text-[10px] font-normal" style={{ color: SUB }}>국가온실가스감축목표</span></span><span className="text-right" style={{ color: "var(--k-champ)" }}>2050 넷제로<br /><span className="text-[10px] font-normal" style={{ color: SUB }}>Net Zero</span></span></div>
        </It>
        <div className="mt-5 grid gap-2.5">
          <Card n="1" t="친환경 광물 공급망 확보" /><Card n="2" t="재생에너지 인프라 구축" /><Card n="3" t="탄소포집 밸류체인 완성" />
        </div>
        <Quote>해상 재생에너지 인프라 확충 — 정부 목표 완벽 부합</Quote>
      </S>
    </Body>
  ) },
  { id: "esg-baseload", ch: 6, render: () => (
    <Body>
      <S>
        <Head ey="Base-load Power" t={<>태양광과 풍력의 한계를 넘어선<br />압도적 기저 전력, <span className="goldtext">조력발전</span></>} />
        <It className="glass mt-4 rounded-xl p-2"><Waves /><p className="px-2 pb-1 text-[10.5px]" style={{ color: SUB }}><span className="mr-1 inline-block h-[2px] w-4 align-middle" style={{ background: "#8792a3" }} />기상 의존적 변동성(Volatile) <span className="ml-2 mr-1 inline-block h-[3px] w-4 align-middle" style={{ background: "#e3c78d" }} />100% 예측 가능한 강력한 기저 전력 · 도식</p></It>
        <div className="mt-3 grid gap-2.5">
          <Card t="날씨에 구애받지 않는 안정적 대규모 전력 생산" />
          <Card t="해양 생태계와 공존하는 현대적 친환경 발전 시스템" />
          <Card t="국가 전력망 안정화를 위한 필수 대체 에너지" />
        </div>
      </S>
    </Body>
  ) },
  { id: "esg-supply", ch: 6, render: () => (
    <Body>
      <S>
        <Head ey="Direct Supply Chain" t={<>조력발전 방조제의 핵심 뼈대,<br />친환경 엑시톤 골재 직접 공급망</>} sub="강화 제1광산(Ganghwa Mine No.1) → 방조제" />
        <div className="mt-5 grid gap-2.5">
          <Card n="1" t="고품질 골재 및 엑시톤 소재 직공급" d="해상 인프라의 내구성을 결정하는 소재." />
          <Card n="2" t="기초 소재의 안정적 확보" d="초대형 방조제 건설에 필수적인 막대한 기초 소재." />
          <Card n="3" t="인하우스(In-house) 조달망" d="외부 의존도를 낮추고 공기 지연 리스크를 완벽히 차단." />
        </div>
        <It><p className="corm mt-6 text-[15px] font-semibold uppercase tracking-[0.2em]" style={{ color: GOLD }}>Scope 3 Carbon</p></It>
        <div className="mt-2.5 grid grid-cols-2 gap-2.5">
          <It className="glass rounded-xl p-3"><p className="text-[11px] font-bold" style={{ color: SUB }}>기존 원거리 조달</p><p className="mt-1 text-[12px] leading-[1.6]">타지역 골재 장거리 운송에 따른 막대한 물류비용 및 탄소 배출 발생.</p></It>
          <It className="rounded-xl border p-3" style={{ borderColor: GOLD, background: "rgba(201,169,110,.1)" }}><p className="text-[11px] font-bold" style={{ color: GOLD }}>당사 근거리 직공급</p><p className="mt-1 text-[12px] leading-[1.6]">인프라 현장과 초인접한 입지로 운송 거리 최소화 및 물류 탄소 발자국(Carbon Footprint) 혁신적 절감.</p></It>
        </div>
        <Src>Scope 3 저감률은 원문에 수치가 없어 실측·산정이 필요합니다.</Src>
      </S>
    </Body>
  ) },
  { id: "esg-tunnel", ch: 6, render: () => (
    <Body>
      <S>
        <Head ey="Tunnel Mining" t={<>산림 훼손 제로(0), 첨단 통제형<br />친환경 터널식 채굴 공법<Asm t="목표" /></>} />
        <div className="mt-5"><Pic src={IMG("tunnel")} alt="터널식 채굴 갱구 참고 이미지" className="h-[160px] w-full" cap="터널식 채굴 참고 이미지" /></div>
        <It><p className="mt-2.5 text-[12.5px] font-bold" style={{ color: "var(--k-champ)" }}>외부 경관 및 산림 훼손 원천 차단 (Zero Surface Damage)</p></It>
        <div className="mt-3 grid gap-2.5">
          <Card n="1" t="소음/분진 완벽 통제" d="외부로 유출되는 환경 공해를 100% 차단하는 밀폐형 시스템." />
          <Card n="2" t="친환경 엑시톤 채굴" d="환경 영향을 최소화한 첨단 소재 추출 프로세스." />
          <Card n="3" t="안전성 확보" d="붕괴 위험을 방지하는 견고한 터널식 프레임워크 적용." />
        </div>
      </S>
    </Body>
  ) },
  { id: "esg-frame", ch: 6, render: () => (
    <Body>
      <S>
        <Head ey="ESG Framework" t={<>글로벌 스탠다드에 부합하는<br />철저한 ESG 경영 프레임워크</>} />
        <div className="mt-5 grid gap-2.5">
          {[["E", "Environment", ["친환경 저탄소 채굴 공법 도입", "조력발전 및 재생에너지 인프라 핵심 소재 기여", "물류 탄소 발자국 최소화"]], ["S", "Social", ["지역사회 양질의 일자리 창출", "최고 수준의 산업 안전망 및 무재해 작업장 구축", "주민 상생 및 인프라 개선 기여"]], ["G", "Governance", ["SPC 기반의 철저하고 투명한 자금 집행", "상장사 연계 및 감사를 통한 리스크 통제 체계", "주주 및 투자자 가치 극대화 구조"]]].map(([k, n, l], i) => (
            <motion.div key={k as string} className="glass flex gap-3.5 rounded-xl p-3.5" initial={{ x: i % 2 ? 60 : -60 }} animate={{ x: 0 }} transition={{ duration: 0.9, delay: 0.3 + i * 0.15, ease: EASE }}>
              <span className="corm text-[52px] font-semibold leading-[0.9] goldtext">{k}</span>
              <div><p className="corm text-[14px] font-semibold uppercase tracking-[0.18em]" style={{ color: GOLD }}>{n}</p><ul className="mt-1 grid gap-0.5 text-[12.5px] leading-[1.6]">{(l as string[]).map((x) => <li key={x}>· {x}</li>)}</ul></div>
            </motion.div>
          ))}
        </div>
      </S>
    </Body>
  ) },
  { id: "esg-region", ch: 6, render: () => (
    <Body>
      <S>
        <Head ey="Regional Impact" t={<>단순한 에너지 개발을 넘어선<br />거대한 지역 경제 파급 효과</>} />
        <div className="mt-4"><Rings items={["3차 지역 상권", "2차 연관 산업", "1차 직접 고용", "광산 · SPC"]} /></div>
        <div className="mt-4 grid gap-2.5">
          <Card n="1" t="1차 직접 고용" d="채굴, 운송, 엔지니어링 및 현장 관리 전문 인력 창출." />
          <Card n="2" t="2차 연관 산업 고용" d="조력발전 방조제 건설, 물류 인프라 확충, 기자재 공급망 활성화." />
          <Card n="3" t="3차 지역 상권 활성화" d="인구 유입 및 소비 진작에 따른 강화 및 인천 지역 경제 부흥." />
        </div>
        <Quote>지역 경제를 부흥시키는 강력하고 지속 가능한 일자리 엔진(Job Engine).</Quote>
      </S>
    </Body>
  ) },
  { id: "esg-share", ch: 6, render: () => (
    <Body>
      <S>
        <Head ey="Profit Sharing" t={<>지역 사회와 이익을 공유하는<br />100% 주민 수용성 확보 모델<Asm t="목표" /></>} sub="프로젝트 수익(Project Revenue)의 환원 경로" />
        <div className="mt-5 grid gap-2.5">
          <Card n="1" t="지역 주민 우선 채용 할당제 운영" />
          <Card n="2" t="진입 도로 확충 및 주변 환경 정비 투자" />
          <Card n="3" t="지역 발전 기금 조성 및 주민 복지 프로그램 지원" />
        </div>
        <Quote>단순한 보상을 넘어, 지역 주민이 프로젝트의 성공을 함께 누리는 참여형 이익 공유(Profit-sharing) 생태계를 구축합니다.</Quote>
      </S>
    </Body>
  ) },
  { id: "esg-public", ch: 6, render: () => (
    <Body>
      <S>
        <Head ey="Public Infrastructure" t={<>사적 이익을 넘어 국가 백년대계를<br />위한 공공 인프라 마중물</>} />
        <div className="mt-5"><Pic src={IMG("seawall")} alt="방조제 참고 이미지" className="h-[140px] w-full" pos="40% 50%" cap="방조제 참고 이미지 · AI" /></div>
        <div className="mt-3 grid gap-2.5">
          <Card t="국가 전력망 안정화" d="기저 전력인 조력발전을 통해 수도권 및 국가 첨단 산업단지에 흔들림 없는 에너지를 공급합니다." />
          <Card t="해안 방재 기능 강화" d="견고한 방조제 인프라는 기후 변화로 인한 해수면 상승 및 자연재해로부터 해안선을 보호하는 방패가 됩니다." />
          <Card t="핵심 자원 자립도 향상" d="해상 인프라 구축에 필요한 필수 소재를 내재화하여 국가적 자원 안보에 기여합니다." />
        </div>
      </S>
    </Body>
  ) },
  { id: "esg-wheel", ch: 6, render: () => (
    <Body>
      <S>
        <Head ey="Synergy Wheel" t={<>정부, 지자체, 투자자, 지역사회의<br />완벽한 시너지 휠(Wheel)</>} />
        <It className="relative mx-auto mt-4 flex h-[150px] w-[150px] items-center justify-center">
          <motion.svg viewBox="0 0 200 200" className="absolute inset-0" animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: "linear" }} aria-hidden="true">
            {[0, 1, 2, 3].map((k) => <circle key={k} cx="100" cy="100" r="84" fill="none" stroke={k % 2 ? "#c9a96e" : "#7fa3cf"} strokeWidth="14" strokeDasharray="118 410" strokeDashoffset={-k * 132} strokeLinecap="round" />)}
          </motion.svg>
          <p className="serif text-center text-[13px] font-bold leading-[1.4]" style={{ color: "var(--k-champ)" }}>상호<br />Win-Win<br />생태계 완성</p>
        </It>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {[["투자자", "Investors", "자본 조달, 거버넌스 감시, 재무적 수익 창출."], ["운영사/SPC", "Operator", "친환경 터널식 채굴 실행, 인프라 핵심 소재 적기 공급."], ["지자체/정부", "Government", "국가 에너지 정책 지원, 원활한 인허가 행정, 공공 인프라 확보."], ["지역사회", "Community", "100% 주민 수용성 제공, 지역 노동력 공급, 상생 이익 향유."]].map(([t, e, d]) => (
            <It key={t} className="glass rounded-xl p-3"><p className="text-[13.5px] font-bold">{t}</p><p className="corm text-[11px] uppercase tracking-[0.16em]" style={{ color: GOLD }}>{e}</p><p className="mt-1 text-[11.5px] leading-[1.6]" style={{ color: SUB }}>{d}</p></It>
          ))}
        </div>
      </S>
    </Body>
  ) },

  /* ── 비전 ── */
  { id: "vision", ch: 7, render: () => (
    <Body>
      <S>
        <Head ey="Vision & Roadmap" t="비전 및 로드맵" />
        <div className="mt-6">
          <Steps items={[
            { k: "Horizon 1 · 단기 — Mining Operation", t: "장석 안정적 생산 및 초기 인프라(터널) 구축", d: "수도권 핵심 골재 공급망 편입" },
            { k: "Horizon 2 · 중기 — Infrastructure Partner", t: "인천만 조력발전 및 송도 매립 프로젝트 핵심 벤더 도약", d: "채굴 후 동굴(지하 갱도)을 활용한 부가가치 창출 (친환경 저장고, 안전 대피소, 연구시설)" },
            { k: "Horizon 3 · 장기 — Advanced Material Platform", t: "엑시톤 기반 탄소포집 및 의료/바이오 소재 양산", d: "단순 자원 개발을 넘어선 '국가 에너지 인프라 소재 생태계'의 중심축 완성" },
          ]} />
        </div>
        <Quote>자원의 본질을 혁신하여, 지속 가능한 인프라의 미래를 짓습니다.</Quote>
      </S>
    </Body>
  ) },
  { id: "closing", ch: 7, photo: "seawall", pos: "70% 50%", cap: "방조제 참고 이미지 · AI", render: () => (
    <Body bottom>
      <S>
        <It><p className="corm text-[13px] font-semibold uppercase tracking-[0.3em]" style={{ color: GOLD }}>Closing</p></It>
        <h2 className="serif mt-3 overflow-hidden text-[27px] font-black leading-[1.4]"><motion.span className="block" initial={{ y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 1, delay: 0.3, ease: EASE }}>지속 가능한 미래를 건설하는<br /><span className="goldtext">가장 확실한 국가 인프라 투자</span><Asm t="목표" /></motion.span></h2>
        <div className="mt-4 grid gap-1.5 text-[13px] leading-[1.6]">
          {["국가 에너지 안보 및 탄소중립 정책 완벽 부합", "친환경 현지 조달을 통한 독보적 ESG 달성", "SPC & 상장사 CB 구조를 통한 투자 안정성 극대화"].map((t) => <It key={t} className="flex gap-2"><span style={{ color: GOLD }}>✓</span><span>{t}</span></It>)}
        </div>
        <It><p className="serif mt-5 text-[15px] font-bold leading-[1.7]" style={{ color: "var(--k-champ)" }}>본 프로젝트는 압도적 수익성과 국가적 명분을 동시에 달성하는 대체 불가능한 기회입니다. 대한민국의 에너지 지형을 바꾸는 위대한 여정에 귀하를 초대합니다.</p></It>
        <It><p className="mt-5 border-t pt-3 text-[11px] leading-[1.7]" style={{ borderColor: "var(--k-line)", color: SUB }}>(주)에이치엔엘파트너스 · H&amp;L PARTNERS<br />{ASM_NOTE}</p></It>
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

export default function GhView() {
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
    <div className="ghd">
      <div className="relative mx-auto h-[100dvh] w-full max-w-[480px] overflow-hidden">
        {/* 무대 배경 */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(120% 80% at 80% 0%, #2c3a4f 0%, #171e2a 55%, #0f141c 100%)" }} />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="drift absolute inset-y-0 left-0 w-[200%]" style={{ backgroundImage: "linear-gradient(rgba(201,169,110,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,.05) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
        </div>
        {/* 모핑 블롭 */}
        <motion.svg aria-hidden="true" viewBox="0 0 200 200" className="pointer-events-none absolute left-0 top-0 w-full" style={{ filter: "blur(28px)" }}
          animate={BLOB_POS[i % BLOB_POS.length]} transition={{ type: "spring", stiffness: 36, damping: 14 }}>
          <defs><linearGradient id="gb1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#c9a96e" stopOpacity=".42" /><stop offset="100%" stopColor="#7a5f33" stopOpacity=".18" /></linearGradient></defs>
          <motion.path fill="url(#gb1)" initial={false} animate={{ d: BLOBS[i % 40] }} transition={{ duration: 1.5, ease: EASE }} />
        </motion.svg>
        <motion.svg aria-hidden="true" viewBox="0 0 200 200" className="pointer-events-none absolute left-0 top-0 w-full" style={{ filter: "blur(34px)" }}
          animate={BLOB2_POS[i % BLOB2_POS.length]} transition={{ type: "spring", stiffness: 28, damping: 12 }}>
          <motion.path fill="rgba(127,163,207,.2)" initial={false} animate={{ d: BLOBS[(i + 13) % 40] }} transition={{ duration: 1.7, ease: EASE }} />
        </motion.svg>

        {/* 사진 배경 장 */}
        <AnimatePresence initial={false}>
          {s.photo && (
            <motion.div key={`bg-${s.id}`} className="absolute inset-0 z-[5]" initial={{ clipPath: "circle(0% at 50% 50%)" }} animate={{ clipPath: "circle(150% at 50% 50%)" }} exit={{ clipPath: "circle(0% at 50% 50%)" }} transition={{ duration: 0.9, ease: EASE }}>
              <motion.img src={IMG(s.photo)} alt="" className="h-full w-full object-cover" style={{ objectPosition: s.pos ?? "center" }} initial={{ scale: 1.2 }} animate={{ scale: 1.04 }} transition={{ duration: 9, ease: "easeOut" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(15,20,28,.72) 0%, rgba(15,20,28,.15) 30%, rgba(15,20,28,.6) 52%, #0f141c 90%)" }} />
              <span className="absolute right-4 top-[62px] rounded bg-black/50 px-1.5 py-0.5 text-[9.5px] text-white/85">{s.cap ?? "참고 이미지"}</span>
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
                {k === i && <motion.span layoutId="ghd-cursor" className="absolute inset-x-[-2px] top-[4px] h-[6px] rounded-full" style={{ background: "var(--k-champ)" }} transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              </button>
            ))}
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-[11.5px] font-bold" style={{ color: "var(--k-champ)" }}>강화 제1광산</span>
            <motion.p key={s.ch} initial={{ y: -8 }} animate={{ y: 0 }} className="corm text-[13px] font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--k-gold)" }}>{CHAPTERS[s.ch]}</motion.p>
            <button type="button" onClick={() => setMenu(true)} aria-label="목차 열기" className="text-[12px] font-bold" style={{ color: "var(--k-champ)" }}>목차</button>
          </div>
        </div>

        {/* 하단 */}
        <div className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-between px-5 pb-[calc(20px+env(safe-area-inset-bottom,0px))]">
          <button type="button" onClick={prev} disabled={i === 0} aria-label="이전 장" className="flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md disabled:invisible" style={{ borderColor: "var(--k-line)", background: "rgba(27,36,50,.6)", color: "var(--k-champ)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <p className="corm text-[17px] font-semibold tabular-nums" style={{ color: "var(--k-champ)" }}>
            <motion.span key={i} initial={{ y: 10 }} animate={{ y: 0 }} className="inline-block">{String(i + 1).padStart(2, "0")}</motion.span>
            <span className="mx-1.5" style={{ color: "var(--k-mute)" }}>/</span>{N}
          </p>
          <button type="button" onClick={next} disabled={i === N - 1} aria-label="다음 장" className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full shadow-lg disabled:invisible" style={{ background: "var(--k-gold)", color: "#0f141c" }}>
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
