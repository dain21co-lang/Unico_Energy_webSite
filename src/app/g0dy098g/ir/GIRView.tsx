"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import GiibLogo from "../GiibLogo";

/*
 * GIIB(글로벌인프라허브) IR — 모바일 전용 웹 프레젠테이션 (THE K IR과 같은 방식)
 * 원칙: 투명도 애니메이션 없이 위치·크기·모양·마스크·색만 움직인다
 * 수치·계획은 2026년 11월 기준이며 '목표'·'(안)' 표시는 추진 계획이다.
 */

const IMG = (f: string) => `/g0dy098g/${f}.webp`;
const EASE = [0.16, 1, 0.3, 1] as const;


type Ctx = { go: (n: number) => void; active: boolean };
type Slide = { id: string; ch: number; photo?: string; pos?: string; render: (c: Ctx) => ReactNode };
const CHAPTERS = ["표지", "개요", "투자 포인트", "사업 구조", "자산 쪽 · RWA", "자문 쪽 · M&A", "딜 파이프라인", "수익 모델", "로드맵 · 제안"];

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
/* 작은 카드 */
function Card({ t, d, c = "var(--k-gold)" }: { t: ReactNode; d: ReactNode; c?: string }) {
  return (
    <It>
      <div className="glass rounded-2xl p-4" style={{ borderTop: `3px solid ${c}` }}>
        <p className="serif text-[16px] font-bold">{t}</p>
        <p className="mt-1.5 text-[12.5px] leading-[1.65]" style={{ color: "var(--k-sub)" }}>{d}</p>
      </div>
    </It>
  );
}
function Steps({ items }: { items: [string, string][] }) {
  return (
    <div className="mt-6 grid gap-2.5">
      {items.map(([t, d], k) => (
        <It key={t}>
          <div className="flex gap-3.5 border-t pt-3" style={{ borderColor: "var(--k-line)" }}>
            <span className="corm w-7 shrink-0 text-[22px] font-semibold goldtext">{String(k + 1).padStart(2, "0")}</span>
            <div><p className="serif text-[15.5px] font-bold">{t}</p><p className="mt-1 text-[12.5px] leading-[1.6]" style={{ color: "var(--k-sub)" }}>{d}</p></div>
          </div>
        </It>
      ))}
    </div>
  );
}
function Big({ n, d, suf }: { n: number; d: string; suf?: string }) {
  return (
    <It>
      <div className="border-t pt-3" style={{ borderColor: "var(--k-line)" }}>
        <p className="corm text-[44px] font-bold leading-none"><Count to={n} />{suf && <span className="goldtext">{suf}</span>}</p>
        <p className="mt-2 text-[12px]" style={{ color: "var(--k-sub)" }}>{d}</p>
      </div>
    </It>
  );
}
const GREEN = "#9fc46a", BLUE = "#5b9cf0";

const SLIDES: Slide[] = [
  /* 0 표지 */
  { id: "cover", ch: 0, photo: "intro-seoul", render: () => (
    <Body center>
      <S className="text-center">
        <It><GiibLogo className="mx-auto block w-[250px]" style={{ filter: "drop-shadow(0 8px 22px rgba(0,0,0,.5))" }} /></It>
        <It><p className="corm mt-6 text-[15px] font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--k-gold)" }}>Investor Relations 2026</p></It>
        <It><h1 className="serif mt-3 text-[27px] font-bold leading-[1.4]">기업과 자산의 가치를<br /><span className="goldtext">설계합니다</span></h1></It>
        <It><p className="mt-4 text-[13px]" style={{ color: "var(--k-sub)" }}>상장사 M&A · 구조조정 · RWA · IR</p></It>
        <It><p className="hint mt-10 text-[12px]" style={{ color: "var(--k-champ)" }}>밀어서 넘기기 →</p></It>
      </S>
    </Body>
  ) },
  /* 1 회사 개요 */
  { id: "company", ch: 1, render: () => (
    <Body>
      <S>
        <It><Head ey="Company" t="회사 개요" /></It>
        <div className="mt-6 grid gap-0">
          {[["상호", "주식회사 글로벌인프라허브 (GIIB)"], ["대표이사", "유현근"], ["설립", "2015년 5월"], ["사업자등록번호", "622-88-00109"], ["본점", "서울특별시 (본점 이전 예정)"], ["핵심 사업", "상장사 M&A · 구조조정 · RWA · IR · 가치평가"], ["향후", "M&A 홀딩스 · 자산운용사/PE 등록 추진"]].map(([k, v]) => (
            <It key={k}><div className="flex gap-4 border-t py-3 text-[13.5px]" style={{ borderColor: "var(--k-line)" }}><span className="w-[92px] shrink-0 font-bold" style={{ color: "var(--k-gold)" }}>{k}</span><span>{v}</span></div></It>
          ))}
        </div>
        <Src>본점 주소는 등기 정리 후 확정됩니다.</Src>
      </S>
    </Body>
  ) },
  /* 2 대표 메시지 */
  { id: "ceo", ch: 1, photo: "ceo2", pos: "50% 20%", render: () => (
    <Body bottom>
      <S>
        <It><p className="corm text-[14px] font-semibold uppercase tracking-[0.28em]" style={{ color: "var(--k-gold)" }}>CEO Message</p></It>
        <It><h2 className="serif mt-2 text-[24px] font-bold leading-[1.4]">“부동산과 금융을 잇는<br />믿을 수 있는 거점이 되겠습니다.”</h2></It>
        <It><p className="mt-3 text-[13px] leading-[1.75]" style={{ color: "#d8dccb" }}>등기부와 재무제표를 먼저 보고, 위험을 먼저 말씀드리며, 구조로 투자자의 원금을 지키겠습니다. 이제 상장사 M&A와 실물자산의 디지털 증권화까지 딜의 처음과 끝을 책임지겠습니다.</p></It>
        <It><p className="serif mt-3 text-[14px] font-bold" style={{ color: "var(--k-champ)" }}>대표이사 유현근</p></It>
      </S>
    </Body>
  ) },
  /* 3 한 장 요약 */
  { id: "summary", ch: 1, render: () => (
    <Body>
      <S>
        <It><Head ey="Executive Summary" t="한 장으로 보는 GIIB" /></It>
        <div className="mt-5 grid gap-0">
          {[["WHAT", "부동산 × 금융으로 자산가치를 키우는 플랫폼"], ["WHY", "상장사 10곳+ 직접 네트워크 · 원본 대조 검증 · 직접 만드는 IR"], ["HOW", "발굴 → 구조화 → 자본 연결 → 클로징 → 사후관리"], ["NOW", "대양금속 · 크라우드웍스 · 에이전트AI · GB LABS 등 14건 진행"], ["NEXT", "M&A 홀딩스 → 자산운용사 · PE 등록(목표)"]].map(([k, v]) => (
            <It key={k}><div className="flex gap-4 border-t py-3.5" style={{ borderColor: "var(--k-line)" }}><span className="corm w-14 shrink-0 text-[15px] font-bold tracking-[0.12em] goldtext">{k}</span><span className="text-[13.5px] leading-[1.6]">{v}</span></div></It>
          ))}
        </div>
        <Src>진행 건수는 2026년 11월 투자유치·자문 진행 기준이며 성사 여부는 확정되지 않았습니다.</Src>
      </S>
    </Body>
  ) },
  /* 4 투자 포인트 1 */
  { id: "pt1", ch: 2, render: () => (
    <Body center>
      <S>
        <It><Head ey="Point 01" t={<>상장사와 <span className="goldtext">직접</span> 연결된 네트워크</>} sub="코스피 · 코스닥 상장사 10곳 이상과 직접 연결되어 매수자 · 매도자 · 투자자를 중간 단계 없이 잇습니다." /></It>
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Big n={10} suf="+" d="직접 연결된 상장사" />
          <Big n={14} d="진행 중인 딜 · 프로젝트" />
        </div>
      </S>
    </Body>
  ) },
  /* 5 투자 포인트 2 */
  { id: "pt2", ch: 2, render: () => (
    <Body center>
      <S>
        <It><Head ey="Point 02" t={<>자산 쪽과 자문 쪽,<br /><span className="goldtext">두 축을 한 회사가</span></>} sub="자산을 찾는 쪽과 기업을 설계하는 쪽이 따로 움직이면 딜이 끊깁니다. GIIB는 두 축을 함께 운영합니다." /></It>
        <div className="mt-6 grid grid-cols-2 gap-2.5">
          <Card t="자산 쪽" d="부동산 개발 · 엣지 AI 데이터센터 · NPL" c={GREEN} />
          <Card t="자문 쪽" d="상장사 M&A · 구조조정 · IR · 가치평가" c={BLUE} />
        </div>
      </S>
    </Body>
  ) },
  /* 6 투자 포인트 3 */
  { id: "pt3", ch: 2, photo: "ma", pos: "45% 40%", render: () => (
    <Body bottom>
      <S>
        <It><p className="corm text-[14px] font-semibold uppercase tracking-[0.28em]" style={{ color: "var(--k-gold)" }}>Point 03 · The GIIB Link</p></It>
        <It><h2 className="serif mt-2 text-[25px] font-bold leading-[1.4]">실물자산 <span className="goldtext">×</span> 상장사 M&A</h2></It>
        <It><p className="mt-3 text-[13px] leading-[1.75]" style={{ color: "#d8dccb" }}>발굴한 데이터센터 · 부동산 · NPL 자산을 상장사의 신사업으로 편입하면, 상장사는 성장 스토리를, 자산은 확실한 출구를 얻습니다. 두 쪽을 함께 가진 회사만 할 수 있는 딜입니다.</p></It>
      </S>
    </Body>
  ) },
  /* 7 투자 포인트 4 */
  { id: "pt4", ch: 2, render: () => (
    <Body center>
      <S>
        <It><Head ey="Point 04" t={<>검증하고, <span className="goldtext">보여 줍니다</span></>} /></It>
        <div className="mt-6 grid gap-2.5">
          <Card t="원본 대조 검증" d="등기부 · 재무제표 · 계약서를 원본과 맞춰 숨은 위험을 먼저 찾습니다." />
          <Card t="디지털 딜룸" d="사업 사이트 · 브랜드 필름 · IR을 직접 만들어 투자자 설득 시간을 줄입니다. 15건 이상 제작 · 운영." />
          <Card t="혼합형 보수" d="외부 실비만 먼저, GIIB의 보수는 거래가 성사된 뒤에 받습니다." />
        </div>
      </S>
    </Body>
  ) },
  /* 8 사업 구조 */
  { id: "structure", ch: 3, render: () => (
    <Body center>
      <S>
        <It><Head ey="How We Work" t="자산 발굴부터 딜 클로징까지" /></It>
        <It>
          <svg viewBox="0 0 320 250" className="mt-6 w-full" aria-hidden="true">
            <rect x="8" y="10" width="140" height="80" rx="12" fill="rgba(159,196,106,.12)" stroke="#9fc46a" />
            <text x="78" y="44" textAnchor="middle" fill="#ecdcb6" fontSize="15" fontWeight="700">자산 쪽</text>
            <text x="78" y="66" textAnchor="middle" fill="#b5b9a6" fontSize="10">RWA 3대 사업</text>
            <rect x="172" y="10" width="140" height="80" rx="12" fill="rgba(91,156,240,.12)" stroke="#5b9cf0" />
            <text x="242" y="44" textAnchor="middle" fill="#ecdcb6" fontSize="15" fontWeight="700">자문 쪽</text>
            <text x="242" y="66" textAnchor="middle" fill="#b5b9a6" fontSize="10">상장사 M&A · 구조조정</text>
            <motion.path d="M78 92 C78 150 160 140 160 182" fill="none" stroke="#9fc46a" strokeWidth="2" strokeDasharray="5 5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.5 }} />
            <motion.path d="M242 92 C242 150 160 140 160 182" fill="none" stroke="#5b9cf0" strokeWidth="2" strokeDasharray="5 5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.7 }} />
            <circle cx="160" cy="196" r="14" fill="#c9a96e" className="pulse" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
            <text x="160" y="234" textAnchor="middle" fill="#ecdcb6" fontSize="14" fontWeight="700">DEAL CLOSING</text>
          </svg>
        </It>
      </S>
    </Body>
  ) },
  /* 9 다섯 단계 */
  { id: "steps", ch: 3, render: () => (
    <Body>
      <S>
        <It><Head ey="End to End" t="딜 클로징까지 다섯 단계" /></It>
        <Steps items={[["발굴", "자산과 기업, 거래 상대방을 찾고 1차로 거릅니다."], ["구조화", "SPV · 지분 · 메자닌 · 트랜치로 거래 구조를 설계합니다."], ["자본 연결", "상장사 네트워크와 금융기관, 투자자를 연결합니다."], ["클로징", "실사 · 계약 · 이사회 · 공시 일정을 맞춰 마무리합니다."], ["사후관리", "신사업 정착, 자산 운용과 출구까지 관리합니다."]]} />
      </S>
    </Body>
  ) },
  /* 10 RWA 개요 */
  { id: "rwa", ch: 4, render: () => (
    <Body>
      <S>
        <It><Head ey="Real-World Assets" t={<>실물자산을, <span className="goldtext">투자 기회로</span></>} sub="검증된 데이터를 바탕으로 부동산 개발 · 엣지 AI 데이터센터 · 부실채권을 디지털 증권(RWA) 형태의 투자 기회로 구조화합니다." /></It>
        <Steps items={[["자산 데이터", "권리관계 · 공정 · 가동 · 회수 데이터를 원천에서 수집"], ["독립 검증", "감정평가 · 실사 · 제3자 검증"], ["디지털 증권화", "검증된 권리를 토큰증권으로 분할"], ["정산 · 보고", "수익 배분 · 정산 내역을 투자자별 보고"]]} />
        <Src>토큰증권 발행 · 유통은 관련 법령과 인가 범위 안에서 적격 파트너와 함께 진행합니다.</Src>
      </S>
    </Body>
  ) },
  /* 11~13 RWA 3대 */
  ...([["rwa1", "rwa1", "RWA 01 · Real Estate", "부동산 개발 RWA", "인허가 · 부지 확보를 마친 개발 프로젝트를 SPV로 구조화하고, 지분 · 수익권을 작은 단위로 나눕니다. 수익원은 분양 · 매각 차익과 준공 후 임대, 공정률은 마일스톤별로 공개합니다."],
    ["rwa2", "rwa2", "RWA 02 · Edge AI Data Center", "엣지 AI 데이터센터 RWA", "AI 수요지 가까이 모듈형 데이터센터를 세우고, GPU 임대 · 코로케이션 · 장기 용량 계약의 현금흐름에 참여합니다. 전력 사용량 · 가동률 · PUE를 정기 보고합니다."],
    ["rwa3", "rwa3", "RWA 03 · NPL", "NPL 부실채권 RWA", "담보가 확보된 부실채권을 풀 단위로 매입하고, 경매 · 공매 배당과 상환 · 담보 처분 회수금을 선순위 · 후순위 트랜치로 나눠 제공합니다."]] as const).map(([id, ph, ey, t, d]) => ({
    id, ch: 4, photo: ph, render: () => (
      <Body bottom>
        <S>
          <It><p className="corm text-[14px] font-semibold uppercase tracking-[0.28em]" style={{ color: "var(--k-gold)" }}>{ey}</p></It>
          <It><h2 className="serif mt-2 text-[25px] font-bold leading-[1.4]">{t}</h2></It>
          <It><p className="mt-3 text-[13px] leading-[1.75]" style={{ color: "#d8dccb" }}>{d}</p></It>
        </S>
      </Body>
    ),
  } as Slide)),
  /* 14 RWA 구조 */
  { id: "rwa-structure", ch: 4, render: () => (
    <Body center>
      <S>
        <It><Head ey="Structure" t="실물자산이 투자 단위가 되기까지" /></It>
        <div className="mt-6 grid gap-2">
          {[["실물자산", "부동산 개발 · 엣지 DC · NPL", GREEN], ["SPV", "자산별 특수목적법인", "#c9a96e"], ["트랜치", "선순위(안정) · 후순위(수익)", "#c9a96e"], ["토큰증권", "인가 범위 내 분할 발행", BLUE], ["투자자", "기관 · 적격 투자자", "#ecdcb6"]].map(([t, d, c], k) => (
            <It key={t}>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[12px] font-bold" style={{ borderColor: c, color: c }}>{k + 1}</span>
                <div className="glass flex-1 rounded-xl px-3.5 py-2.5"><span className="serif text-[15px] font-bold">{t}</span><span className="ml-2 text-[12px]" style={{ color: "var(--k-sub)" }}>{d}</span></div>
              </div>
            </It>
          ))}
        </div>
        <Src>현금흐름은 임대료 · 분양대금 · GPU 임대료 · 회수금에서 나와 선순위부터 배분됩니다.</Src>
      </S>
    </Body>
  ) },
  /* 15 상장사 M&A */
  { id: "ma", ch: 5, render: () => (
    <Body>
      <S>
        <It><Head ey="Listed-Company M&A" t={<>상장사 M&A,<br /><span className="goldtext">구조부터 공시까지</span></>} sub="경영권 거래, 자본 조달, 신사업 편입을 한 흐름으로 설계합니다." /></It>
        <It><Pic src={IMG("ma")} alt="상장사 M&A 계약 체결 (AI 이미지 예시)" className="mt-5 h-[170px]" cap="AI 이미지 · 예시" /></It>
        <div className="mt-5 grid grid-cols-3 gap-3">
          <Big n={10} suf="+" d="연결 상장사" />
          <Big n={6} d="서비스" />
          <Big n={6} d="딜 단계" />
        </div>
      </S>
    </Body>
  ) },
  /* 16 서비스 6 */
  { id: "services", ch: 5, render: () => (
    <Body>
      <S>
        <It><Head ey="Services" t="상장사 M&A 서비스 여섯 가지" /></It>
        <div className="mt-5 grid grid-cols-2 gap-2">
          {[["경영권 인수 · 매각", "상대 발굴 · 조건 협상"], ["제3자배정 유상증자", "투자자 · 보호예수 구조"], ["CB · BW 메자닌", "전환 · 상환 · 담보 검토"], ["상장적격성 · 개선계획", "실질심사 대응 자료"], ["신사업 · 자산 편입", "RWA 자산을 신사업으로"], ["공시 · IR · 주주", "공시 일정 · 설명 자료"]].map(([t, d]) => (
            <It key={t}><div className="glass h-full rounded-xl p-3.5"><p className="serif text-[14px] font-bold leading-[1.35]">{t}</p><p className="mt-1 text-[11.5px]" style={{ color: "var(--k-sub)" }}>{d}</p></div></It>
          ))}
        </div>
      </S>
    </Body>
  ) },
  /* 17 딜 6단계 */
  { id: "ma-steps", ch: 5, render: () => (
    <Body>
      <S>
        <It><Head ey="Deal Timeline" t="상장사 딜 진행 여섯 단계" /></It>
        <Steps items={[["타깃 · 밸류에이션", "재무 · 지분 구조로 적정 가치를 잡습니다."], ["거래 구조 설계", "구주 · 유상증자 · 메자닌 조합"], ["자금 · 투자자 연결", "상장사 네트워크 · 금융기관"], ["실사 · 계약", "원본 대조로 위험을 계약에 반영"], ["이사회 · 공시 · 클로징", "결의 · 공시 일정에 맞춰 마무리"], ["PMI · 신사업 정착", "신사업과 자산을 매출로 연결"]]} />
      </S>
    </Body>
  ) },
  /* 18 구조조정 · IR */
  { id: "advisory", ch: 5, render: () => (
    <Body center>
      <S>
        <It><Head ey="Restructuring · IR" t="구조조정 · 사업계획서 · 가치평가" /></It>
        <div className="mt-6 grid gap-2.5">
          <Card t="기업 구조조정" d="재무구조 진단, 개선계획 · 소명 자료, 자산 매각 · 부채 재조정, 정상화 로드맵" />
          <Card t="사업계획서 · IR" d="투자자가 숫자로 납득할 수 있는 국문 · 영문 자료" />
          <Card t="검토보고서 · 가치평가" d="원본 대조 검토보고서, 가치평가는 공인 회계법인 · 감정평가법인과 연계 발행" />
        </div>
      </S>
    </Body>
  ) },
  /* 19 디지털 딜룸 */
  { id: "dealroom", ch: 5, photo: "dealroom", render: () => (
    <Body bottom>
      <S>
        <It><p className="corm text-[14px] font-semibold uppercase tracking-[0.28em]" style={{ color: "var(--k-gold)" }}>Digital Deal Room</p></It>
        <It><h2 className="serif mt-2 text-[25px] font-bold leading-[1.4]">주소 하나로 보여 주는 딜</h2></It>
        <It><p className="mt-3 text-[13px] leading-[1.75]" style={{ color: "#d8dccb" }}>모바일 사업 사이트, 원테이크 브랜드 필름, 투자자 전용 검토 페이지와 이 IR까지 직접 만듭니다. 투자자가 같은 그림을 보면 설득 시간이 짧아집니다.</p></It>
      </S>
    </Body>
  ) },
  /* 20 딜 맵 */
  { id: "dealmap", ch: 6, render: () => (
    <Body>
      <S>
        <It><Head ey="Deal Map" t="한눈에 보는 진행 중인 딜" /></It>
        <div className="mt-5 grid grid-cols-3 gap-1.5">
          {["대양금속", "크라우드웍스", "에이전트AI", "GB LABS", "유니코에너지그룹", "서부중앙시장", "케어하우스", "가산 메디컬·AI", "더케이 호스텔", "정선 스마트호텔", "옥수 · 강화", "솔루믹스 · 해연"].map((n, k) => (
            <It key={n}><div className="flex h-[64px] items-center justify-center rounded-lg px-1.5 text-center text-[12px] font-bold leading-[1.3]" style={{ background: k < 3 ? "#c9a96e" : "rgba(43,54,32,.85)", color: k < 3 ? "#10160b" : "var(--k-ivory)", border: "1px solid var(--k-line)" }}>{n}</div></It>
          ))}
        </div>
        <Src>2026년 11월 기준 진행 건이며 성사 여부 · 조건 · 일정은 확정되지 않았습니다.</Src>
      </S>
    </Body>
  ) },
  /* 21 상장사 · AI 딜 */
  { id: "deals-listed", ch: 6, render: () => (
    <Body center>
      <S>
        <It><Head ey="Listed · AI" t="상장사 · AI 딜" /></It>
        <div className="mt-6 grid gap-2.5">
          <Card t="대양금속 · KOSPI" d="상장사 투자유치 자문, 투자 검토용 국문 · 영문 사이트 제작" />
          <Card t="크라우드웍스 · KOSDAQ" d="AI 데이터 기업과의 투자 · 사업 연계, 엣지 AI 데이터센터와의 시너지" c={BLUE} />
          <Card t="에이전트AI" d="AI 에이전트 사업 투자유치 · 상장사 신사업 편입 구조 검토" c={GREEN} />
          <Card t="GB LABS" d="AI · 빅데이터 디지털 헬스케어, 투자유치 · 공식 사이트 · IR" />
        </div>
      </S>
    </Body>
  ) },
  /* 22 실물 프로젝트 */
  { id: "deals-assets", ch: 6, photo: "rwa1", render: () => (
    <Body bottom>
      <S>
        <It><p className="corm text-[14px] font-semibold uppercase tracking-[0.28em]" style={{ color: "var(--k-gold)" }}>Real Asset Projects</p></It>
        <It><h2 className="serif mt-2 text-[24px] font-bold leading-[1.4]">실물자산 프로젝트</h2></It>
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {["서부중앙시장 재개발", "가산 메디컬 · AI 빌딩", "평생주치의 케어하우스", "더케이 · 신촌 스마트호스텔", "정선 AI 스마트호텔", "옥수 복합 · 강화 광산"].map((t) => (
            <It key={t}><div className="glass rounded-lg px-3 py-2.5 text-[12.5px] font-bold">{t}</div></It>
          ))}
        </div>
      </S>
    </Body>
  ) },
  /* 23 네트워크 */
  { id: "network", ch: 6, render: () => (
    <Body center>
      <S>
        <It><Head ey="Listed Network" t="함께하는 상장사 네트워크" sub="매수자 · 매도자 · 투자자를 직접 잇는 협업 · 연계 대상입니다." /></It>
        <div className="mt-6 flex flex-wrap gap-2">
          {["대양금속", "크라우드웍스", "에이전트AI", "대호에이엘", "삼아알미늄", "스피어", "캐리", "제이케이시냅스", "솔루믹스", "삼이그룹"].map((n) => (
            <It key={n}><span className="inline-block rounded-full border px-3.5 py-2 text-[13px] font-bold" style={{ borderColor: "var(--k-gold)", color: "var(--k-champ)" }}>{n}</span></It>
          ))}
        </div>
        <Src>개별 거래 여부와 조건은 확정되지 않았습니다.</Src>
      </S>
    </Body>
  ) },
  /* 24 수익 모델 */
  { id: "revenue", ch: 7, render: () => (
    <Body>
      <S>
        <It><Head ey="Revenue Model (안)" t="네 갈래의 수익 구조" sub="딜이 커질수록 수익원이 겹겹이 쌓이는 구조입니다." /></It>
        <div className="mt-5 grid gap-2.5">
          <Card t="① 자문 성공보수" d="상장사 M&A · 투자유치 · 구조조정 딜 성사 시 규모별 차등 요율" />
          <Card t="② 구조화 수수료" d="RWA · SPV · 트랜치 설계와 투자자 연결" c={GREEN} />
          <Card t="③ 운용 보수 (목표)" d="자산운용사 · PE 등록 후 펀드 운용 보수 · 성과 보수" c={BLUE} />
          <Card t="④ 홀딩스 지분 가치 (목표)" d="M&A 홀딩스로 담은 기업 · 자산의 가치 상승" />
        </div>
        <Src>③ · ④는 추진 계획이며 등록 · 인가 결과에 따라 달라집니다.</Src>
      </S>
    </Body>
  ) },
  /* 25 보수 구조 */
  { id: "fee", ch: 7, render: () => (
    <Body>
      <S>
        <It><Head ey="Fee Structure" t={<>실비는 먼저, <span className="goldtext">보수는 결과로</span></>} /></It>
        <Steps items={[["무료 진단", "첫 상담과 기초 검토는 비용 없이"], ["실비 견적", "외부 실사 · 감정 · 법무 비용만 먼저 안내"], ["구조 설계 · 실행", "거래 구조 설계와 실행"], ["딜 클로징", "계약 · 자금 집행으로 마무리"], ["성공보수", "GIIB의 보수는 성사 뒤에"]]} />
      </S>
    </Body>
  ) },
  /* 26 원칙 */
  { id: "principles", ch: 7, render: () => (
    <Body center>
      <S>
        <It><Head ey="Principles" t="리스크를 다루는 네 가지 원칙" /></It>
        <div className="mt-6 grid grid-cols-2 gap-2">
          <Card t="서류로 확인" d="말보다 등기부와 재무제표를 먼저" />
          <Card t="위험을 먼저" d="좋은 점보다 걸리는 점부터" />
          <Card t="구조로 보호" d="담보 · 계약 구조로 원금 보호" />
          <Card t="끝까지 관리" d="투자 이후 출구까지" />
        </div>
      </S>
    </Body>
  ) },
  /* 27 로드맵 */
  { id: "roadmap", ch: 8, render: () => (
    <Body center>
      <S>
        <It><Head ey="Roadmap" t={<>부동산 × 금융,<br /><span className="goldtext">자산가치를 키우는 플랫폼</span></>} /></It>
        <div className="mt-6 grid gap-0">
          {[["지금", "자산 쪽(RWA) + 자문 쪽(상장사 M&A) 동시 운영"], ["다음", "기업 인수 · 합병의 홀딩스 — 인수 기업과 자산을 담는 지주 역할"], ["목표", "자산운용사 또는 PE(GP) 등록 추진"], ["이후", "부동산 × 금융 자산가치 증대 플랫폼으로 운용"]].map(([k, v], n) => (
            <It key={k}><div className="flex gap-4 border-t py-3.5" style={{ borderColor: "var(--k-line)" }}><span className="serif w-12 shrink-0 text-[17px] font-bold" style={{ color: n === 0 ? "var(--k-gold)" : "var(--k-champ)" }}>{k}</span><span className="text-[13.5px] leading-[1.6]">{v}</span></div></It>
          ))}
        </div>
        <Src>‘목표’ 이후는 추진 계획이며 등록 형태와 일정은 관계 기관 심사에 따릅니다.</Src>
      </S>
    </Body>
  ) },
  /* 28 제안 */
  { id: "proposal", ch: 8, render: () => (
    <Body center>
      <S>
        <It><Head ey="Proposal" t="함께하는 네 가지 방식" /></It>
        <div className="mt-6 grid grid-cols-2 gap-2">
          <Card t="공동 투자" d="SPV · 트랜치에 기관 · 적격 투자자로 참여" c={GREEN} />
          <Card t="자산 공급" d="부동산 · 데이터센터 · NPL 자산 제안" c={GREEN} />
          <Card t="딜 소싱" d="상장사 인수 · 매각 · 투자유치 의뢰" c={BLUE} />
          <Card t="전략 제휴" d="상장사 신사업 · 자산 편입 공동 설계" c={BLUE} />
        </div>
      </S>
    </Body>
  ) },
  /* 29 마무리 */
  { id: "closing", ch: 8, photo: "city", render: () => (
    <Body center>
      <S className="text-center">
        <It><GiibLogo animate={false} className="mx-auto block w-[210px]" /></It>
        <It><h2 className="serif mt-6 text-[22px] font-bold leading-[1.45]">자산 발굴부터 딜 클로징까지,<br /><span className="goldtext">GIIB가 함께합니다</span></h2></It>
        <It><p className="mt-4 text-[13px]" style={{ color: "var(--k-champ)" }}>주식회사 글로벌인프라허브 · 대표이사 유현근</p></It>
        <It><a href="/g0dy098g/x" className="mt-7 inline-block rounded-full px-6 py-3 text-[14px] font-bold" style={{ background: "var(--k-gold)", color: "#10160b" }}>사이트로 돌아가기</a></It>
        <It><p className="mt-6 text-[10.5px]" style={{ color: "var(--k-mute)" }}>본 자료는 회사 소개용이며 특정 증권의 매수 · 매도를 권유하지 않습니다.</p></It>
      </S>
    </Body>
  ) },
];

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

export default function GIRView() {
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
    <div className="kir gir">
      <div className="relative mx-auto h-[100dvh] w-full max-w-[480px] overflow-hidden">
        {/* 무대 배경 */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(120% 80% at 80% 0%, #2b3620 0%, #172010 55%, #10160b 100%)" }} />
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
          <motion.path fill="rgba(159,196,106,.2)" initial={false} animate={{ d: BLOBS[(i + 13) % 40] }} transition={{ duration: 1.7, ease: EASE }} />
        </motion.svg>

        {/* 사진 배경 장 */}
        <AnimatePresence initial={false}>
          {s.photo && (
            <motion.div key={`bg-${s.id}`} className="absolute inset-0 z-[5]" initial={{ clipPath: "circle(0% at 50% 50%)" }} animate={{ clipPath: "circle(150% at 50% 50%)" }} exit={{ clipPath: "circle(0% at 50% 50%)" }} transition={{ duration: 0.9, ease: EASE }}>
              <motion.img src={IMG(s.photo)} alt="" className="h-full w-full object-cover" style={{ objectPosition: s.pos ?? "center" }} initial={{ scale: 1.2 }} animate={{ scale: 1.04 }} transition={{ duration: 9, ease: "easeOut" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(16,22,11,.7) 0%, rgba(16,22,11,.1) 30%, rgba(16,22,11,.55) 55%, #10160b 92%)" }} />
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
            <a href="/g0dy098g/x" className="flex items-center gap-1 text-[12px] font-bold" style={{ color: "var(--k-champ)" }}>
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
