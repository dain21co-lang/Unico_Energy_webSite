"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

/*
 * 해연에프엔지 IR 뷰어 — 모바일 전용 웹 프레젠테이션
 * 원칙: 투명도 애니메이션 없이 위치·크기·모양만 움직인다 (갤럭시 빈 화면 방지)
 * 수치 출처: 2025 회계연도 감사보고서 (삼덕회계법인, 2026.06.01, 적정) / 추정·계획은 회사 사업계획서(2026.10)
 */

const P = (f: string) => `/haeyeon/ir/${f}`;
const IMG = (f: string) => `/haeyeon/img/${f}`;
const EASE = [0.16, 1, 0.3, 1] as const;

type Theme = "dark" | "light";
type Ctx = { go: (n: number) => void };
type Slide = { id: string; ch: number; theme: Theme; render: (c: Ctx) => ReactNode };

const CHAPTERS = ["표지", "투자 개요", "회사 개요", "사업 현황", "재무 현황", "성장 전략", "투자 제안"];

/* ───────── 공통 조각 ───────── */
const wrap = { hidden: {}, show: { transition: { staggerChildren: 0.075, delayChildren: 0.18 } } };
const item = { hidden: { y: 30, scale: 0.97 }, show: { y: 0, scale: 1, transition: { duration: 0.85, ease: EASE } } };

function S({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <motion.div variants={wrap} initial="hidden" animate="show" className={className}>{children}</motion.div>;
}
function It({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <motion.div variants={item} className={className}>{children}</motion.div>;
}

/* 오도미터: 자리마다 0~9 숫자 띠가 굴러가 목표 숫자에 멈춘다 */
function Count({ to, d = 0, delay = 0.3 }: { to: number; d?: number; delay?: number }) {
  const str = to.toLocaleString("ko-KR", { minimumFractionDigits: d, maximumFractionDigits: d });
  let di = 0;
  return (
    <span className="inline-flex items-start" style={{ height: "1em", lineHeight: 1 }} aria-label={str}>
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

/* 제목: 선이 그어진 뒤, 마스크 안에서 글이 솟아오른다 */
function Head({ ey, t, dark }: { ey: string; t: ReactNode; dark?: boolean }) {
  return (
    <div>
      <div className="flex items-center gap-2.5">
        <motion.span className="block h-[2px] w-7 origin-left bg-[var(--ir-gold)]" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.7, delay: 0.1, ease: EASE }} />
        <p className={`corm text-[14px] font-semibold uppercase tracking-[0.26em] ${dark ? "text-[var(--ir-gold-ink)]" : "text-[var(--ir-gold-ink)]"}`}>{ey}</p>
      </div>
      <h2 className="serif mt-2 overflow-hidden text-[24px] font-bold leading-[1.36] text-[var(--ir-ink)]">
        <motion.span className="block" initial={{ y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 0.9, delay: 0.2, ease: EASE }}>{t}</motion.span>
      </h2>
    </div>
  );
}

/* 살아 움직이는 물방울 모양 사진 틀 */
function Liquid({ src, alt, className = "", pos = "center" }: { src: string; alt: string; className?: string; pos?: string }) {
  return (
    <motion.div className={`liquid relative overflow-hidden ${className}`} initial={{ scale: 0.6, rotate: -8 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 1.2, ease: EASE }}>
      <motion.img src={src} alt={alt} className="h-full w-full object-cover" style={{ objectPosition: pos }} initial={{ scale: 1.25 }} animate={{ scale: 1.04 }} transition={{ duration: 8, ease: "easeOut" }} />
    </motion.div>
  );
}

/* 외곽선이 그려지는 큰 숫자 */
function Outline({ n, className = "" }: { n: string; className?: string }) {
  return (
    <svg viewBox="0 0 220 130" className={className} aria-hidden="true">
      <motion.text x="0" y="112" fontSize="150" fontFamily="'Cormorant Garamond', Georgia, serif" fontWeight="600" fill="none" stroke="#2e7d32" strokeWidth="1.6"
        strokeDasharray="900" initial={{ strokeDashoffset: 900 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 2.2, ease: "easeInOut" }}>{n}</motion.text>
    </svg>
  );
}

function Src({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return <It><p className={`mt-5 text-[11px] leading-relaxed ${dark ? "text-[var(--ir-mute)]" : "text-[#56704a]"}`}>{children}</p></It>;
}

/* 슬라이드 껍데기: 배경은 무대(stage)가 모핑으로 칠하고, 사진 슬라이드만 자기 배경을 갖는다 */
function Body({ children, center, bottom }: { children: ReactNode; center?: boolean; bottom?: boolean }) {
  return (
    <div className="scroll relative z-10 h-full px-5 pb-[96px] pt-[76px]">
      <div className={`flex min-h-full flex-col ${center ? "justify-center" : ""} ${bottom ? "justify-end" : ""}`}>{children}</div>
    </div>
  );
}

function Divider({ n, en, ko, desc, img, pos }: { n: string; en: string; ko: string; desc: string; img: string; pos?: string }) {
  return (
    <Body center>
      <div className="relative">
        <Outline n={n} className="w-[62%]" />
        <Liquid src={img} alt="" pos={pos} className="absolute -right-2 top-[30px] h-[230px] w-[230px] shadow-[0_24px_60px_rgba(30,80,30,0.22)]" />
      </div>
      <S className="mt-[150px]">
        <It><p className="corm text-[22px] italic tracking-[0.08em] text-[var(--ir-gold-ink)]">{en}</p></It>
        <It><h2 className="serif mt-1 text-[40px] font-bold leading-tight">{ko}</h2></It>
        <It><motion.div className="mt-5 h-[2px] w-14 origin-left bg-[var(--ir-gold)]" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.6 }} /></It>
        <It><p className="mt-5 text-[14.5px] leading-relaxed text-[var(--ir-sub)]">{desc}</p></It>
      </S>
    </Body>
  );
}

const card = "rounded-2xl border border-[var(--ir-line)] bg-[var(--ir-paper)]";
const dcard = "rounded-2xl bg-[var(--ir-deep)]";

/* ───────── 30장 ───────── */
const SLIDES: Slide[] = [
  /* 01 표지 */
  { id: "cover", ch: 0, theme: "dark", render: () => (
    <Body center>
      <div className="relative mx-auto mt-1 w-full">
        <Liquid src={P("butcher.webp")} alt="해연에프엔지 가공장에서 원육을 손질하는 장인" pos="60% 20%" className="mx-auto aspect-[4/5] w-[82%] shadow-[0_30px_70px_rgba(30,80,30,0.25)]" />
        <motion.img src={IMG("symbol.png")} alt="해연에프엔지 심볼" className="absolute bottom-[-18px] left-[6%] h-[72px] w-[72px] rounded-full bg-white object-contain p-1 shadow-lg"
          initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.8 }} />
      </div>
      <S className="mt-9">
        <It className="flex items-center gap-3"><motion.span className="block h-[2px] w-10 origin-left bg-[var(--ir-gold)]" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.4 }} /><p className="corm text-[15px] font-semibold uppercase tracking-[0.3em] text-[var(--ir-gold-ink)]">Investor Relations 2026</p></It>
        <h1 className="serif mt-3 overflow-hidden text-[44px] font-black leading-[1.1] tracking-tight"><motion.span className="block" initial={{ y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 1, delay: 0.3, ease: EASE }}>해연에프엔지</motion.span></h1>
        <It><p className="corm text-[24px] italic text-[var(--ir-gold-ink)]">Haeyeon F&amp;G Co., Ltd.</p></It>
        <It><p className="serif mt-3 text-[16px] font-medium leading-[1.6] text-[var(--ir-sub)]">좋은 고기는 손끝에서, 더 좋은 고기는 데이터에서.</p></It>
        <It><p className="mt-4 text-[11.5px] tracking-wide text-[var(--ir-mute)]">농업회사법인 해연에프엔지 주식회사 · 2026. 11 · 투자설명 자료</p></It>
        <It><p className="hint mt-5 flex items-center gap-2 text-[12.5px] font-semibold text-[var(--ir-gold-ink)]">옆으로 밀어 넘겨 보세요 <span aria-hidden="true">→</span></p></It>
        <It><p className="mt-1.5 text-[11.5px] text-[var(--ir-mute)]">화면을 터치하면 나레이션이 시작되고, 동영상처럼 자동으로 넘어갑니다.</p></It>
      </S>
    </Body>
  ) },

  /* 02 목차 */
  { id: "contents", ch: 0, theme: "light", render: ({ go }) => (
    <Body center>
      <S>
        <Head ey="Table of Contents" t="목차" />
        <div className="mt-6 grid gap-2.5">
          {[["01", "투자 개요", "핵심 숫자 · 투자 포인트", 2], ["02", "회사 개요", "연혁 · 주주 · 사업장", 4], ["03", "사업 현황", "사업모델 · 제품 · 생산 · 거래처", 9], ["04", "재무 현황", "2025 감사보고서 기준", 15], ["05", "성장 전략", "AI 발골·절단 스마트 팩토리", 21], ["06", "투자 제안", "투자 구조 · 리스크 관리", 27]].map(([n, t, d, to]) => (
            <It key={n as string}>
              <button type="button" onClick={() => go(to as number)} className="flex w-full items-center gap-4 border-t border-[var(--ir-gold)]/60 py-3.5 text-left">
                <span className="corm w-10 text-[34px] font-semibold leading-none text-[var(--ir-gold-ink)]">{n}</span>
                <span className="flex-1"><span className="serif block text-[18px] font-bold">{t}</span><span className="block text-[12.5px] text-[var(--ir-sub)]">{d}</span></span>
                <span aria-hidden="true" className="text-[var(--ir-gold-ink)]">→</span>
              </button>
            </It>
          ))}
        </div>
      </S>
    </Body>
  ) },

  /* 03 투자 요약 */
  { id: "summary", ch: 1, theme: "dark", render: () => (
    <Body center>
      <S>
        <Head dark ey="01 · Investment Summary" t={<>연 매출 341억 원 기업이<br />AI 스마트 팩토리로<br />다음 단계를 엽니다</>} />
        <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-[var(--ir-gold)]/30">
          {[[341, 0, "2025 매출액", "2년 연속 340억대"], [15.4, 1, "매출총이익", "전년 대비 +17.2%"], [8.1, 1, "영업활동 현금흐름", "전년 4.3억의 1.9배"], [96.6, 1, "총자산", "유형자산 88.4억"]].map(([v, d, l, s]) => (
            <It key={l as string} className="bg-[var(--ir-night)] p-4">
              <p className="text-[12px] text-[var(--ir-subd)]">{l}</p>
              <p className="corm mt-1 text-[46px] font-semibold leading-none text-[var(--ir-champ)]"><Count to={v as number} d={d as number} /><span className="ml-0.5 text-[24px] text-[var(--ir-gold)]">억</span></p>
              <p className="mt-1.5 text-[11.5px] text-[var(--ir-mute)]">{s}</p>
            </It>
          ))}
        </div>
        <It className={`${dcard} mt-4 p-4 text-[13.5px] leading-relaxed text-[var(--ir-subd)]`}><b className="text-[var(--ir-cream)]">사업</b>  제천 HACCP 가공 거점에서 우육·돈육·가금육을 가공해 B2B로 공급하고, 수도권 수익형 부동산에서 임대수익을 얻습니다.</It>
        <It className={`${dcard} mt-2.5 p-4 text-[13.5px] leading-relaxed text-[var(--ir-subd)]`}><b className="text-[var(--ir-cream)]">성장</b>  AI 비전·로봇 자동 발골·절단으로 노무비와 원물 손실을 줄여, 같은 매출에서 더 많은 이익을 남기는 구조로 전환합니다.</It>
        <Src dark>출처: 2025 회계연도 감사보고서 (삼덕회계법인, 감사의견 적정) · 2024년은 감사받지 않은 비교 수치</Src>
      </S>
    </Body>
  ) },

  /* 04 투자 포인트 */
  { id: "highlights", ch: 1, theme: "light", render: () => (
    <Body center>
      <S>
        <Head ey="01 · Investment Highlights" t="핵심 투자 포인트" />
        <div className="mt-5 grid gap-2.5">
          {[["검증된 매출 규모", "2024·2025년 2년 연속 연 매출 340억 원대"], ["인허가 완비 가공 거점", "HACCP 인증, 식육포장처리업·축산물가공업 허가"], ["외부감사 ‘적정’ 의견", "2025 회계연도 삼덕회계법인 감사"], ["실물 자산의 뒷받침", "유형자산 88억 원, 임대매출 2.7억 > 이자비용 2.4억"], ["개선되는 수익 체력", "매출총이익 +17.2%, 부채비율 664% → 522%"], ["AI 자동화 레버리지", "연 20억 원 이상 원가 개선 잠재력 (회사 추정)"]].map(([t, d], i) => (
            <It key={t} className={`flex items-center gap-4 rounded-xl p-3.5 ${i === 5 ? "bg-[var(--ir-night)] text-[var(--ir-cream)]" : "border border-[var(--ir-line)] bg-[var(--ir-paper)]"}`}>
              <span className={`corm w-8 text-[30px] font-semibold leading-none ${i === 5 ? "text-[var(--ir-gold)]" : "text-[var(--ir-gold-ink)]"}`}>{String(i + 1).padStart(2, "0")}</span>
              <span className="flex-1"><span className="serif block text-[15.5px] font-bold">{t}</span><span className={`mt-0.5 block text-[12.5px] leading-snug ${i === 5 ? "text-[var(--ir-subd)]" : "text-[var(--ir-sub)]"}`}>{d}</span></span>
            </It>
          ))}
        </div>
      </S>
    </Body>
  ) },

  /* 05 기업 개요 */
  { id: "glance", ch: 2, theme: "light", render: () => (
    <Body>
      <S>
        <Head ey="02 · Company at a Glance" t="기업 개요" />
        <It className="relative mt-5 overflow-hidden rounded-2xl">
          <img src={IMG("plant-front.jpg")} alt="해연에프엔지 제천 가공 공장" className="aspect-[16/8] w-full object-cover" />
          <img src={IMG("logo.png")} alt="해연에프엔지 로고" className="absolute bottom-2.5 left-2.5 h-10 rounded-md bg-[var(--ir-paper)] px-2 py-1 object-contain" />
        </It>
        <dl className="mt-4">
          {[["법인명", "농업회사법인 해연에프엔지 주식회사"], ["설립일", "2020년 8월 31일"], ["대표이사", "이남미 (최대주주, 45%)"], ["주요 사업", "축산물 가공·저장, 농축산물 유통, 부동산 임대"], ["가공 거점", "충북 제천시 송학주천로 54 (HACCP)"], ["자본금", "9억 원 · 90,000주 (2026년)"], ["2025 매출", "341억 원 (감사 확인)"], ["외부감사", "삼덕회계법인 · 적정 의견"]].map(([k, v], i) => (
            <It key={k} className={`flex gap-3 py-2.5 ${i === 0 ? "border-t-2 border-[var(--ir-ink)]" : "border-t border-[var(--ir-line)]"}`}>
              <dt className="w-[72px] shrink-0 text-[12.5px] font-bold text-[var(--ir-gold-ink)]">{k}</dt>
              <dd className="text-[13px] leading-snug">{v}</dd>
            </It>
          ))}
        </dl>
        <Src>자본금은 2026년 회사 제시 기준 (2025년 말 감사보고서: 6억 원, 60,000주)</Src>
      </S>
    </Body>
  ) },

  /* 06 CEO */
  { id: "ceo", ch: 2, theme: "dark", render: () => (
    <Body center>
      <S>
        <It className="relative mx-auto mt-1 w-[62%]">
          <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-sm border-2 border-[var(--ir-gold)]" />
          <img src={IMG("ceo.jpg")} alt="해연에프엔지 대표이사 이남미" className="relative aspect-[4/5] w-full rounded-sm object-cover object-top" />
        </It>
        <It><p className="corm mt-7 text-[14px] font-semibold uppercase tracking-[0.26em] text-[var(--ir-gold)]">02 · Message from CEO</p></It>
        <It><h2 className="serif mt-2 text-[21px] font-bold leading-[1.45]">생산자에게는 안정적인 판로를,<br />소비자에게는 믿을 수 있는 먹거리를</h2></It>
        <It className="mt-4 border-l-2 border-[var(--ir-gold)] pl-4 text-[13.5px] leading-[1.8] text-[var(--ir-subd)]">
          <p>엄격한 제조 공정과 기술을 결합해 먹거리의 새로운 가치를 만드는 축산물 가공·유통 전문기업입니다.</p>
          <p className="mt-2">이제 AI 기반 스마트 팩토리로 전환해 원물 분석부터 정밀 가공, 위생 포장까지 지능형 공정을 도입하고, 생산자와 소비자가 함께 성장하는 선순환으로 보답하겠습니다.</p>
        </It>
        <It className="mt-5 flex items-baseline justify-end gap-3"><span className="text-[12px] text-[var(--ir-mute)]">대표이사</span><span className="serif text-[22px] font-bold tracking-[0.3em] text-[var(--ir-champ)]">이남미</span></It>
      </S>
    </Body>
  ) },

  /* 07 연혁 */
  { id: "history", ch: 2, theme: "dark", render: () => (
    <>
      <div className="absolute inset-0 overflow-hidden"><img src={P("field.webp")} alt="" className="h-full w-full object-cover opacity-[0.07]" /></div>
      <Body center>
        <S>
          <Head dark ey="02 · Milestones" t="설립 6년, 가공 거점에서 자산과 기술로" />
          <div className="relative mt-6 pl-7">
            <motion.div className="absolute bottom-1 left-[7px] top-2 w-[2px] origin-top bg-[var(--ir-gold)]" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1.8, ease: EASE, delay: 0.3 }} />
            {[["2020", "법인 설립", "식육포장처리업 · 축산물가공업 허가"], ["2023", "HACCP 인증", "식육포장처리업 제2023-6-0339호"], ["2024", "자산 기반 구축", "인천 가좌동 공장건물 취득 89.5억, IBK 시설자금 75억"], ["2025", "매출 341억", "매출총이익 +17%, 임대매출 2.7억"], ["2026", "첫 외부감사 ‘적정’", "2025 회계연도 감사보고서 (6월)"], ["NEXT", "AI 스마트 팩토리", "본점 전남 영암 이전, AI 발골·절단 자동화"]].map(([y, t, d], i) => (
              <It key={y} className="relative pb-4">
                <span className={`absolute -left-7 top-1.5 h-4 w-4 rounded-full border-[3px] border-[var(--ir-night)] ${i === 5 ? "bg-[#a7d45a]" : "bg-[var(--ir-gold)]"}`} />
                <p className={`corm text-[24px] font-semibold leading-none ${i === 5 ? "text-[#a7d45a]" : "text-[var(--ir-champ)]"}`}>{y}</p>
                <p className="mt-1 text-[14.5px] font-bold">{t}</p>
                <p className="text-[12.5px] leading-snug text-[var(--ir-subd)]">{d}</p>
              </It>
            ))}
          </div>
          <Src dark>출처: 감사보고서 주석, 인허가 서류, 회사 사업계획서 (2026.10)</Src>
        </S>
      </Body>
    </>
  ) },

  /* 08 주주 */
  { id: "shareholders", ch: 2, theme: "light", render: () => {
    const segs = [[0.45, "#1E3512"], [0.3, "#8CC63F"], [0.25, "#6E8A5A"]] as const;
    let acc = 0;
    return (
      <Body center>
        <S>
          <Head ey="02 · Shareholders" t="주주 구성과 지배구조" />
          <It className="relative mx-auto mt-6 h-[210px] w-[210px]">
            <svg viewBox="0 0 200 200" className="h-full w-full" aria-label="지분 구성: 이남미 45%, 박용준 30%, 유토컴퍼니 25%">
              <circle cx="100" cy="100" r="74" fill="none" stroke="#EEF3E8" strokeWidth="30" />
              {segs.map(([f, c], i) => {
                const start = acc; acc += f;
                return (
                  <g key={c} transform={`rotate(${-90 + start * 360} 100 100)`}>
                    <motion.circle cx="100" cy="100" r="74" fill="none" stroke={c} strokeWidth="30"
                      initial={{ pathLength: 0 }} animate={{ pathLength: f - 0.004 }} transition={{ duration: 1.1, delay: 0.35 + i * 0.35, ease: EASE }} />
                  </g>
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="corm text-[34px] font-semibold leading-none"><Count to={90000} /></p>
              <p className="mt-1 text-[11px] text-[var(--ir-sub)]">발행 주식 (주)</p>
            </div>
          </It>
          <div className="mt-6">
            {[["#1E3512", "이남미", "대표이사", "40,500", "45%"], ["#8CC63F", "박용준", "사내이사", "27,000", "30%"], ["#6E8A5A", "㈜유토컴퍼니", "법인 주주", "22,500", "25%"]].map(([c, n, r, q, p]) => (
              <It key={n} className="flex items-center gap-3 border-t border-[var(--ir-line)] py-2.5 text-[13.5px]">
                <span className="h-3 w-3 rounded-sm" style={{ background: c }} />
                <span className="flex-1 font-bold">{n} <span className="ml-1 text-[12px] font-normal text-[var(--ir-sub)]">{r}</span></span>
                <span className="w-16 text-right tabular-nums text-[var(--ir-sub)]">{q}</span>
                <span className="corm w-12 text-right text-[20px] font-semibold">{p}</span>
              </It>
            ))}
          </div>
          <It className="mt-3 rounded-xl border-l-4 border-[var(--ir-gold)] bg-[var(--ir-paper)] p-3.5 text-[12.5px] leading-relaxed text-[var(--ir-sub)]">경영진 지분 75%로 의사결정이 빠르고 책임경영 구조가 명확합니다. IBK 장기차입금에는 대표이사가 연대보증을 제공하고 있습니다.</It>
          <Src>2026년 회사 제시 기준 · 2025년 말 감사보고서도 동일 지분율 (60,000주)</Src>
        </S>
      </Body>
    );
  } },

  /* 09 사업장 */
  { id: "sites", ch: 2, theme: "light", render: () => (
    <Body>
      <S>
        <Head ey="02 · Locations" t="산지와 수도권을 잇는 사업장 네트워크" />
        <It className={`${dcard} mt-5 overflow-hidden`}>
          <img src={IMG("plant-side.jpg")} alt="제천 가공 공장" className="aspect-[16/7] w-full object-cover" />
          <div className="p-4">
            <p className="corm text-[13px] font-semibold uppercase tracking-[0.2em] text-[var(--ir-gold)]">Processing Hub · Jecheon</p>
            <p className="serif mt-1 text-[17px] font-bold text-[var(--ir-cream)]">제천지점 — HACCP 가공장</p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--ir-subd)]">송학주천로 54 · 위생 가공시설, 냉동창고 300㎡, MDCM 설비, 자체 콜드체인</p>
          </div>
        </It>
        <div className="mt-2.5 grid grid-cols-2 gap-2.5">
          {[["본점 · 전남 영암", "호남 산지 직매입·AI 가공 거점"], ["인천지점 · 가좌동", "6층 공장건물, 전 층 임대"], ["하남미사지점", "그랑파사쥬 1층 상가 3개 호실"], ["서울사무소", "강동U1지식산업센터 B동 508호"]].map(([t, d]) => (
            <It key={t} className={`${card} p-3.5`}><p className="serif text-[14px] font-bold leading-snug">{t}</p><p className="mt-1 text-[12px] leading-snug text-[var(--ir-sub)]">{d}</p></It>
          ))}
        </div>
        <Src>본점·하남미사지점은 2026년 회사 제시 자료 기준</Src>
      </S>
    </Body>
  ) },

  /* 10 간지: 사업 */
  { id: "div-biz", ch: 3, theme: "dark", render: () => <Divider n="03" en="Business Overview" ko="사업 현황" desc="산지에서 식탁까지 — 원물 조달, 정밀 가공, B2B 공급, 그리고 부동산 임대로 이어지는 사업 구조" img={P("carcass.webp")} pos="30% 50%" /> },

  /* 11 사업모델 */
  { id: "model", ch: 3, theme: "light", render: () => (
    <Body center>
      <S>
        <Head ey="03 · Business Model" t="조달 · 가공 · 공급이 한 회사 안에서" />
        <div className="mt-5">
          {[["Sourcing", "원물 조달", "양돈조합·육가공사 매입과 산지 농가 직구매 병행", false], ["Processing", "정밀 가공", "제천 HACCP 가공장 1·2차 정육, 기계발골육(MDCM), 냉동 보관", true], ["Distribution", "B2B 공급", "축산 유통사·외식 프랜차이즈·정육점에 자체 콜드체인 납품", false]].map(([en, t, d, dk], i) => (
            <div key={en as string}>
              {i > 0 && <div className="flow mx-auto h-5 w-[2px]" />}
              <It className={`rounded-2xl p-4 ${dk ? "bg-[var(--ir-night)] text-[var(--ir-cream)]" : "border border-[var(--ir-line)] bg-[var(--ir-paper)]"}`}>
                <p className={`corm text-[13px] font-semibold uppercase tracking-[0.2em] ${dk ? "text-[var(--ir-gold)]" : "text-[var(--ir-gold-ink)]"}`}>{en}</p>
                <p className="serif mt-0.5 text-[17px] font-bold">{t}</p>
                <p className={`mt-1 text-[12.5px] leading-relaxed ${dk ? "text-[var(--ir-subd)]" : "text-[var(--ir-sub)]"}`}>{d}</p>
              </It>
            </div>
          ))}
        </div>
        <It className={`${card} mt-4 p-4`}>
          <div className="flex items-baseline justify-between"><p className="text-[12.5px] text-[var(--ir-sub)]">2025 매출 구성</p><p className="serif text-[18px] font-bold">341억 원</p></div>
          <div className="mt-2.5 flex h-4 overflow-hidden rounded-full bg-[#eef3e8]">
            <motion.div className="h-full bg-[var(--ir-ink)]" initial={{ width: "0%" }} animate={{ width: "99.2%" }} transition={{ duration: 1.4, delay: 0.5, ease: EASE }} />
            <motion.div className="h-full bg-[var(--ir-gold)]" initial={{ width: "0%" }} animate={{ width: "0.8%" }} transition={{ duration: 0.6, delay: 1.7 }} />
          </div>
          <div className="mt-2 flex justify-between text-[11.5px]"><span><b>제품</b> 338.2억 (99.2%)</span><span className="text-[var(--ir-gold-ink)]"><b>임대</b> 2.7억 (전년비 +125%)</span></div>
        </It>
        <Src>출처: 2025 감사보고서 손익계산서 · 거래 구조는 회사 사업계획서 기준</Src>
      </S>
    </Body>
  ) },

  /* 12 제품 */
  { id: "products", ch: 3, theme: "dark", render: () => (
    <Body center>
      <S>
        <Head dark ey="03 · Product Portfolio" t="축종별 정육부터 가공 원료육까지" />
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          {[[P("pack.webp"), "우육", "부위별 정육, 외식·정육점 공급"], [P("meat.webp"), "돈육", "양돈조합 원물 1·2차 가공"], [P("chicken.webp"), "가금육", "계육·압육 부분육"], [IMG("line-2.jpg"), "기계발골육", "MDCM 설비, 소시지·햄 원료"]].map(([src, t, d]) => (
            <It key={t} className={`${dcard} overflow-hidden`}>
              <div className="overflow-hidden"><motion.img src={src} alt={t} className="aspect-[4/3] w-full object-cover" initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 3, ease: EASE }} /></div>
              <div className="p-3"><p className="serif text-[15px] font-bold">{t}</p><p className="mt-0.5 text-[11.5px] leading-snug text-[var(--ir-subd)]">{d}</p></div>
            </It>
          ))}
        </div>
        <It className="serif mt-5 border-l-2 border-[var(--ir-gold)] pl-4 text-[14.5px] font-medium leading-relaxed text-[var(--ir-champ)]">한 마리를 남김없이 — 정육과 원료육을 함께 다뤄 원물 1단위당 매출을 높입니다.</It>
      </S>
    </Body>
  ) },

  /* 13 생산·품질 */
  { id: "production", ch: 3, theme: "light", render: () => (
    <Body center>
      <S>
        <Head ey="03 · Production & Quality" t="HACCP 기준의 6단계 가공 공정" />
        <div className="mt-5 flex gap-3">
          <It className="w-[44%] shrink-0 overflow-hidden rounded-2xl bg-[var(--ir-night)]">
            <video src="/haeyeon/video/process.mp4" poster="/haeyeon/video/process-poster.jpg" autoPlay muted loop playsInline preload="metadata" aria-label="6단계 가공 공정 영상" className="aspect-[9/16] w-full object-cover" />
          </It>
          <div className="flex flex-1 flex-col justify-between gap-1.5">
            {["원물 입고", "검수 · 선별", "1차 가공", "2차 정밀 가공", "위생 포장", "출고 · 배송"].map((t, i) => (
              <It key={t} className={`flex items-center gap-2.5 rounded-lg px-3 py-2 ${i === 5 ? "bg-[var(--ir-night)] text-[var(--ir-cream)]" : "border border-[var(--ir-line)] bg-[var(--ir-paper)]"}`}>
                <span className={`corm text-[20px] font-semibold leading-none ${i === 5 ? "text-[var(--ir-gold)]" : "text-[var(--ir-gold-ink)]"}`}>{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[13px] font-bold">{t}</span>
              </It>
            ))}
          </div>
        </div>
        <div className="mt-4 grid gap-1.5">
          {[["HACCP", "식육포장처리업 안전관리인증 제2023-6-0339호"], ["식육포장처리업", "허가 제2020-0444121호 (제천시)"], ["축산물가공업", "허가 제2020-0423044호 (충청북도)"]].map(([k, v]) => (
            <It key={k} className="flex items-start gap-2 border-t border-[var(--ir-line)] pt-2 text-[12.5px]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4E7A12" strokeWidth="2.2" className="mt-0.5 shrink-0" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
              <span><b>{k}</b>  <span className="text-[var(--ir-sub)]">{v}</span></span>
            </It>
          ))}
        </div>
      </S>
    </Body>
  ) },

  /* 14 거래 네트워크 */
  { id: "network", ch: 3, theme: "light", render: () => (
    <Body center>
      <S>
        <Head ey="03 · Supply & Customers" t="복수 조달선과 고정 B2B 거래선" />
        <It className={`${card} mt-5 p-4`}>
          <p className="corm text-[13px] font-semibold uppercase tracking-[0.2em] text-[var(--ir-gold-ink)]">Sourcing · 주요 매입처</p>
          <p className="mt-1.5 text-[13.5px] leading-[1.8]">㈜부경양돈조합 · ㈜스마일팜미트 · 산지 농가 직구매<br /><span className="text-[var(--ir-sub)]">+ 호남권 산지 직매입 확대 예정</span></p>
        </It>
        <It className="relative my-3 flex items-center justify-center">
          <motion.span className="absolute h-24 w-24 rounded-full border border-[var(--ir-gold)]" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
          <img src={IMG("symbol.png")} alt="해연에프엔지 심볼" className="relative h-20 w-20 rounded-full bg-[var(--ir-paper)] object-contain shadow-lg" />
        </It>
        <It className="rounded-2xl bg-[var(--ir-night)] p-4 text-[var(--ir-cream)]">
          <p className="corm text-[13px] font-semibold uppercase tracking-[0.2em] text-[var(--ir-gold)]">Customers · 주요 매출처</p>
          <p className="mt-1.5 text-[13.5px] leading-[1.8] text-[var(--ir-subd)]">농업회사법인 ㈜신선축산 · 백조한우축산 · 복수한우 · 촌놈들연탄구이 가맹점 4곳 · 청예푸드 · 하나로정육점</p>
        </It>
        <It className="mt-4 overflow-hidden border-y border-[var(--ir-line)] py-2.5">
          <div className="marquee flex gap-6 whitespace-nowrap text-[12.5px] font-semibold text-[var(--ir-gold-ink)]">
            {Array.from({ length: 2 }).flatMap((_, k) => ["부경양돈조합", "스마일팜미트", "신선축산", "백조한우축산", "복수한우", "촌놈들연탄구이", "청예푸드", "하나로정육점"].map((n) => <span key={`${k}-${n}`}>◆ {n}</span>))}
          </div>
        </It>
        <Src>출처: 회사 사업계획서 (2026.10) · 가맹점: 괴정·둔산·월평·봉명점</Src>
      </S>
    </Body>
  ) },

  /* 15 부동산 */
  { id: "realestate", ch: 3, theme: "dark", render: () => (
    <Body center>
      <S>
        <Head dark ey="03 · Real Estate Income" t="수익형 부동산이 만드는 안정 현금흐름" />
        <It className={`${dcard} mt-5 border-t-4 border-[var(--ir-gold)] p-4`}>
          <div className="flex items-baseline justify-between"><p className="serif text-[16px] font-bold">인천지점 · 가좌동</p><p className="text-[11px] text-[var(--ir-mute)]">감사 확인</p></div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {[[89.5, "취득원가 (토지+건물)"], [80.1, "담보 감정가"], [2.7, "2025 임대매출"], [2.7, "임대보증금"]].map(([v, l], i) => (
              <div key={i}><p className="text-[11px] text-[var(--ir-mute)]">{l}</p><p className="corm text-[32px] font-semibold leading-tight text-[var(--ir-champ)]"><Count to={v as number} d={1} />억</p></div>
            ))}
          </div>
          <p className="mt-2 text-[11.5px] leading-snug text-[var(--ir-subd)]">6층 공장건물 전 층 임대 · 든든한 한끼, 오렌지몽키코리아, ㈜국화, ㈜원테크놀러지 외</p>
        </It>
        <It className={`${dcard} mt-2.5 border-t-4 border-[var(--ir-moss)] p-4`}>
          <div className="flex items-baseline justify-between"><p className="serif text-[16px] font-bold">하남미사지점</p><p className="text-[11px] text-[var(--ir-mute)]">회사 제시</p></div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div><p className="text-[11px] text-[var(--ir-mute)]">매입가</p><p className="corm text-[32px] font-semibold leading-tight text-[var(--ir-champ)]"><Count to={75} />억</p></div>
            <div><p className="text-[11px] text-[var(--ir-mute)]">연 임대수익</p><p className="corm text-[32px] font-semibold leading-tight text-[var(--ir-champ)]"><Count to={2.4} d={1} />억</p></div>
          </div>
          <p className="mt-2 text-[11.5px] leading-snug text-[var(--ir-subd)]">그랑파사쥬 1층 3개 호실 · 글로벌 커피 프랜차이즈 전체 임차</p>
        </It>
        <It className="mt-3 rounded-xl bg-[var(--ir-gold)] p-3.5 text-[13px] font-medium leading-relaxed text-[var(--ir-night)]"><b>2025 임대매출 2.73억 &gt; 이자비용 2.38억</b> — 차입 이자를 임대수익으로 감당하는 구조</It>
        <Src dark>인천: 감사보고서 주석 5·8·13 · 하남미사: 2026 회사 자료 (2025년 말 재무제표 미반영)</Src>
      </S>
    </Body>
  ) },

  /* 16 간지: 재무 */
  { id: "div-fin", ch: 4, theme: "dark", render: () => <Divider n="04" en="Financial Review" ko="재무 현황" desc="2025 회계연도 감사보고서 (삼덕회계법인, 감사의견 적정) 기준 · 단위 억 원" img={P("aerial.webp")} /> },

  /* 17 손익계산서 */
  { id: "income", ch: 4, theme: "light", render: () => (
    <Body center>
      <S>
        <Head ey="04 · Income Statement" t="손익계산서 요약" />
        <It className="mt-5 overflow-hidden rounded-2xl border border-[var(--ir-line)] bg-[var(--ir-paper)]">
          <table className="w-full text-[13px]">
            <thead><tr className="bg-[var(--ir-night)] text-[var(--ir-cream)]"><th className="px-3 py-2.5 text-left font-semibold">억 원</th><th className="px-2 py-2.5 text-right font-semibold">2024</th><th className="px-2 py-2.5 text-right font-semibold">2025</th><th className="px-3 py-2.5 text-right font-semibold">증감</th></tr></thead>
            <tbody>
              {[["매출액", "340.1", "341.0", "+0.2%", 1], ["매출원가", "327.0", "325.6", "−0.4%", 0], ["매출총이익", "13.1", "15.4", "+17.2%", 1], ["판매관리비", "4.0", "9.3", "+133%", 0], ["영업이익", "9.1", "6.0", "−33.7%", 1], ["영업외비용", "10.5", "2.4", "−77%", 0], ["세전이익", "−1.4", "3.6", "흑자전환", 0], ["당기순이익", "−2.9", "2.1", "흑자전환", 1]].map(([k, a, b, c, bold]) => (
                <tr key={k as string} className={`border-t border-[var(--ir-line)] ${bold ? "font-bold" : ""}`}>
                  <td className="px-3 py-2.5">{k}</td><td className="px-2 py-2.5 text-right tabular-nums text-[var(--ir-sub)]">{a}</td><td className="px-2 py-2.5 text-right tabular-nums">{b}</td><td className={`px-3 py-2.5 text-right text-[12px] ${String(c).startsWith("+") || c === "흑자전환" ? "text-[var(--ir-gold-ink)]" : "text-[var(--ir-sub)]"}`}>{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </It>
        <It className="mt-3 text-[12.5px] leading-relaxed text-[var(--ir-sub)]">2024년 영업외비용에는 일회성 기타대손상각비 9.3억 원이 포함되어 있습니다. 이를 제외하면 2024년 세전이익은 7.9억 원입니다.</It>
        <Src>출처: 2025 감사보고서 · 2024년은 감사받지 않은 비교 재무제표</Src>
      </S>
    </Body>
  ) },

  /* 18 수익성 추이 */
  { id: "trend", ch: 4, theme: "light", render: () => {
    const groups: [string, number, number][] = [["매출총이익", 13.1, 15.4], ["영업이익", 9.1, 6.0], ["당기순이익", -2.9, 2.1]];
    const max = 16; const H = 150; const NEG = 46;
    return (
      <Body center>
        <S>
          <Head ey="04 · Profitability" t="이익 구조 — 총이익은 늘고, 비용은 정리 중" />
          <It className={`${card} mt-5 p-4`}>
            <div className="flex justify-end gap-3 text-[11px]"><span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-[#c9d8b6]" />2024</span><span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-[var(--ir-ink)]" />2025</span></div>
            <div className="relative mt-2" style={{ height: H + NEG + 24 }}>
              <div className="absolute inset-x-0 border-t border-[var(--ir-sub)]/50" style={{ top: H }} />
              <div className="absolute inset-0 grid grid-cols-3">
                {groups.map(([l, a, b], gi) => (
                  <div key={l} className="relative">
                    {[a, b].map((v, k) => {
                      const h = (Math.abs(v) / max) * H;
                      return (
                        <div key={k} className="absolute flex w-[34%] flex-col items-center" style={{ left: k === 0 ? "14%" : "52%", top: v >= 0 ? H - h - 18 : H, height: h + 18 }}>
                          {v >= 0 && <span className={`text-[11px] font-bold tabular-nums ${k ? "" : "text-[var(--ir-sub)]"}`}>{v.toFixed(1)}</span>}
                          <motion.div className={`w-full ${v >= 0 ? "origin-bottom rounded-t-md" : "origin-top rounded-b-md"} ${k ? "bg-[var(--ir-ink)]" : "bg-[#c9d8b6]"}`} style={{ height: h }}
                            initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1, delay: 0.4 + gi * 0.2 + k * 0.12, ease: EASE }} />
                          {v < 0 && <span className="text-[11px] font-bold tabular-nums text-[#9a5a3a]">{v.toFixed(1)}</span>}
                        </div>
                      );
                    })}
                    <p className="absolute inset-x-0 text-center text-[11.5px] font-semibold" style={{ top: H + NEG }}>{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </It>
          <It className="mt-3 rounded-xl border-l-4 border-[var(--ir-gold)] bg-[var(--ir-paper)] p-3.5 text-[12.5px] leading-relaxed text-[var(--ir-sub)]"><b className="text-[var(--ir-ink)]">총이익률 3.9% → 4.5%</b>  원가 관리로 매출총이익이 2.3억 늘었습니다.</It>
          <It className="mt-2 rounded-xl border-l-4 border-[var(--ir-moss)] bg-[var(--ir-paper)] p-3.5 text-[12.5px] leading-relaxed text-[var(--ir-sub)]"><b className="text-[var(--ir-ink)]">영업이익 감소 요인</b>  복리후생비 +2.4억, 매출채권 대손상각 1.7억 (보수적 충당금 설정)</It>
          <Src>단위 억 원 · 출처: 2025 감사보고서 손익계산서</Src>
        </S>
      </Body>
    );
  } },

  /* 19 재무상태 */
  { id: "balance", ch: 4, theme: "dark", render: () => {
    const H = 220;
    const Bar = ({ parts, label, delay }: { parts: [number, string, string][]; label: string; delay: number }) => (
      <div className="flex flex-1 flex-col items-center">
        <motion.div className="flex w-full origin-bottom flex-col overflow-hidden rounded-lg" style={{ height: H }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1.2, delay, ease: EASE }}>
          {parts.map(([v, c, t]) => (
            <div key={t} className="flex items-center justify-center text-center text-[11px] font-bold leading-tight" style={{ flex: v, background: c, color: c === "#F5C518" || c === "#8CC63F" || c === "#E6F4C9" ? "#16201a" : "#ffffff" }}>{v >= 6 ? <span>{t}<br />{v.toFixed(1)}</span> : null}</div>
          ))}
        </motion.div>
        <p className="mt-2 text-[12.5px] font-bold">{label}</p>
      </div>
    );
    return (
      <Body center>
        <S>
          <Head dark ey="04 · Balance Sheet" t="자산 96.6억 원의 91%가 토지·건물" />
          <It className="mt-6 flex gap-5 px-3">
            <Bar label="자산 96.6억" delay={0.4} parts={[[0.6, "#6E8A5A", "기타"], [7.6, "#E6F4C9", "유동자산"], [88.4, "#8CC63F", "유형자산"]]} />
            <Bar label="부채 81.1 + 자본 15.5" delay={0.7} parts={[[15.5, "#F5C518", "자본"], [6.1, "#6E8A5A", "기타부채"], [75.0, "#24561a", "장기차입금"]]} />
          </It>
          <div className="mt-5 grid gap-2">
            {[["장기차입금 75억", "IBK 중소기업시설자금, 금리 2.99%, 인천 부동산 담보 (감정 80.1억)"], ["특수관계자 차입 8.6억 → 0", "2025년 중 전액 상환, 부채 8.3억 감소"], ["자본 15.5억", "이익잉여금 9.5억 누적, 전년 대비 +2.1억"]].map(([t, d]) => (
              <It key={t} className={`${dcard} p-3.5`}><p className="text-[13.5px] font-bold text-[var(--ir-champ)]">{t}</p><p className="mt-0.5 text-[12px] leading-snug text-[var(--ir-subd)]">{d}</p></It>
            ))}
          </div>
          <Src dark>출처: 2025 감사보고서 재무상태표, 주석 5·8·13·16</Src>
        </S>
      </Body>
    );
  } },

  /* 20 현금흐름 */
  { id: "cashflow", ch: 4, theme: "light", render: () => {
    const R = 8.4;
    const rows: [string, number, number, string, string][] = [["기초 현금", 0, 0.14, "0.1", "#c9d8b6"], ["영업활동", 0.14, 8.08, "+8.1", "#1E3512"], ["투자활동", 8.22, 0, "0.0", "#c9d8b6"], ["재무활동", 0.02, 8.2, "−8.2", "#6E8A5A"], ["기말 현금", 0, 0.02, "0.0", "#c9d8b6"]];
    return (
      <Body center>
        <S>
          <Head ey="04 · Cash Flow" t="영업에서 번 현금으로 차입을 갚았습니다" />
          <It className={`${card} mt-5 p-4`}>
            {rows.map(([l, s, w, v, c], i) => (
              <div key={l} className="flex items-center gap-3 py-2">
                <span className="w-[64px] shrink-0 text-[12.5px] font-semibold">{l}</span>
                <div className="relative h-6 flex-1">
                  <motion.div className="absolute top-0 h-full origin-left rounded-sm" style={{ left: `${(s / R) * 100}%`, width: `${Math.max((w / R) * 100, 0.8)}%`, background: c }}
                    initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9, delay: 0.4 + i * 0.25, ease: EASE }} />
                </div>
                <span className="w-10 shrink-0 text-right text-[12.5px] font-bold tabular-nums">{v}</span>
              </div>
            ))}
          </It>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <It className="rounded-xl bg-[var(--ir-night)] p-3.5 text-[var(--ir-cream)]"><p className="text-[11.5px] text-[var(--ir-subd)]">영업활동 현금흐름</p><p className="corm text-[34px] font-semibold leading-tight text-[var(--ir-champ)]">+<Count to={8.1} d={1} />억</p><p className="text-[11px] text-[var(--ir-mute)]">전년 +4.3억</p></It>
            <It className={`${card} p-3.5`}><p className="text-[11.5px] text-[var(--ir-sub)]">특수관계자 차입 상환</p><p className="corm text-[34px] font-semibold leading-tight">−<Count to={12.0} d={1} />억</p><p className="text-[11px] text-[var(--ir-sub)]">신규 차입 3.4억 포함 순상환</p></It>
          </div>
          <It className="mt-3 text-[12.5px] leading-relaxed text-[var(--ir-sub)]">기말 현금은 0.02억 원으로 낮아, 투자 유치를 통한 운전자금 확충이 필요한 시점입니다.</It>
          <Src>단위 억 원 · 출처: 2025 감사보고서 현금흐름표</Src>
        </S>
      </Body>
    );
  } },

  /* 21 재무 건전성 */
  { id: "health", ch: 4, theme: "light", render: () => (
    <Body center>
      <S>
        <Head ey="04 · Key Ratios" t="재무 지표 — 1년 사이의 개선" />
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          {[["부채비율", "664%", 522, "%", 0, "낮을수록 좋음"], ["유동비율", "105%", 224, "%", 0, "높을수록 좋음"], ["매출총이익률", "3.9%", 4.5, "%", 1, "높을수록 좋음"], ["EBITDA ÷ 이자", "", 3.0, "배", 1, "2025년 기준"]].map(([k, a, b, u, d, n]) => (
            <It key={k as string} className={`${card} p-4`}>
              <p className="text-[12px] font-bold text-[var(--ir-gold-ink)]">{k}</p>
              <p className="mt-1.5 text-[12px] text-[var(--ir-sub)]">{a ? `2024 ${a} →` : "\u00a0"}</p>
              <p className="corm text-[40px] font-semibold leading-none"><Count to={b as number} d={d as number} /><span className="text-[20px]">{u}</span></p>
              <p className="mt-1.5 text-[11px] text-[var(--ir-sub)]">{n}</p>
            </It>
          ))}
        </div>
        <It className="mt-3 rounded-xl bg-[var(--ir-night)] p-4 text-[12.5px] leading-relaxed text-[var(--ir-subd)]">부채비율은 여전히 높은 수준입니다. 다만 차입의 대부분이 <b className="text-[var(--ir-cream)]">장기 저리 정책자금(2.99%)</b>이고, 담보 부동산과 임대수익이 뒷받침합니다. 투자 유치는 이 비율을 낮추는 가장 빠른 방법입니다.</It>
        <Src>EBITDA = 영업이익 6.0억 + 감가상각비 1.2억 · 이자비용 2.4억 · 출처: 2025 감사보고서</Src>
      </S>
    </Body>
  ) },

  /* 22 간지: 성장 */
  { id: "div-ai", ch: 5, theme: "dark", render: () => <Divider n="05" en="Growth Strategy" ko="AI 스마트 팩토리" desc="장인의 손끝을 데이터로 — AI 비전과 로봇으로 발골·절단을 자동화합니다" img={P("robot.webp")} pos="50% 30%" /> },

  /* 23 문제 */
  { id: "problem", ch: 5, theme: "dark", render: () => (
    <Body center>
      <S>
        <Head dark ey="05 · The Problem" t="이익을 막는 가장 큰 병목은 사람의 손입니다" />
        <It className="mt-6 text-center">
          <p className="text-[12.5px] text-[var(--ir-subd)]">연간 현장 가공 인력 비용</p>
          <p className="corm text-[84px] font-semibold leading-none text-[var(--ir-champ)]"><Count to={31.9} d={1} /><span className="text-[34px] text-[var(--ir-gold)]">억</span></p>
          <p className="mt-1 text-[12px] text-[var(--ir-mute)]">일용 노무비 24.6억 + 제조 복리후생비 7.3억</p>
        </It>
        <div className="mt-6 grid gap-2.5">
          {[["숙련 발골 인력 구인난", "고령화로 숙련공이 줄고 새로 배우는 사람은 적습니다"], ["노무비 급증", "회사 제조원가 기준 전년 대비 약 4배 증가"], ["수작업 수율 편차", "숙련도·피로도에 따라 뼈에 남는 살코기와 절단 규격이 달라집니다"]].map(([t, d], i) => (
            <It key={t} className={`${dcard} flex gap-3 p-3.5`}><span className="corm text-[24px] font-semibold leading-none text-[var(--ir-gold)]">{i + 1}</span><span><span className="block text-[14px] font-bold">{t}</span><span className="mt-0.5 block text-[12px] leading-snug text-[var(--ir-subd)]">{d}</span></span></It>
          ))}
        </div>
        <Src dark>출처: 회사 제시 2025 제조원가명세서 (사업계획서 2026.10)</Src>
      </S>
    </Body>
  ) },

  /* 24 해법 */
  { id: "solution", ch: 5, theme: "light", render: () => (
    <Body center>
      <S>
        <Head ey="05 · The Solution" t="스캔 → 판단 → 실행, 세 단계의 AI 발골" />
        <It className="relative mt-5 overflow-hidden rounded-2xl">
          <img src={P("scan.webp")} alt="AI 비전으로 원육을 스캔하는 모습" className="aspect-[16/9] w-full object-cover" />
          <div className="scanline absolute inset-x-0 top-0 h-[10%] bg-gradient-to-b from-transparent via-[#7fe3f5]/50 to-transparent" />
          <span className="absolute left-2.5 top-2.5 rounded-full bg-[var(--ir-night)]/80 px-2.5 py-1 text-[10.5px] font-bold tracking-wider text-[#a7d45a]">● AI VISION</span>
        </It>
        <div className="mt-3 grid gap-2">
          {[["01 SCAN", "멀티모달 3D 비전 · X-ray", "원육의 외형·지방층과 내부 뼈·관절 위치를 3차원으로 재구성"], ["02 DECIDE", "딥러닝 절단 경로", "숙련 발골사의 칼질 데이터를 학습해 0.1초 안에 최적 분리선 산출"], ["03 EXECUTE", "다관절 로봇 · 포스 피드백", "근육 저항과 뼈 강도를 감지하며 뼈를 깎지 않고 표면을 따라 발골"]].map(([n, t, d]) => (
            <It key={n} className={`${card} p-3.5`}>
              <p className="corm text-[13px] font-semibold tracking-[0.18em] text-[var(--ir-gold-ink)]">{n}</p>
              <p className="text-[14px] font-bold">{t}</p>
              <p className="mt-0.5 text-[12px] leading-snug text-[var(--ir-sub)]">{d}</p>
            </It>
          ))}
        </div>
        <Src>광학 센싱 협력사 · 다오옵틱 / 기술 개요: 회사 사업계획서</Src>
      </S>
    </Body>
  ) },

  /* 25 경제 효과 */
  { id: "impact", ch: 5, theme: "dark", render: () => (
    <Body center>
      <S>
        <Head dark ey="05 · Economic Impact" t="같은 매출, 더 많은 이익" />
        <It className={`${dcard} mt-5 p-4`}>
          <p className="text-[12px] font-bold text-[var(--ir-gold)]">연간 원가 개선 민감도 (억 원)</p>
          <table className="mt-2 w-full text-[13px]">
            <tbody>
              {[["노무비 30% 절감", "9.6"], ["노무비 50% 절감", "16.0"], ["정육 수율 +1%p", "2.8"], ["정육 수율 +2%p", "5.5"], ["정육 수율 +3%p", "8.3"]].map(([k, v]) => (
                <tr key={k} className="border-t border-[var(--ir-line)]"><td className="py-2 text-[var(--ir-subd)]">{k}</td><td className="corm py-2 text-right text-[20px] font-semibold text-[var(--ir-champ)]">{v}</td></tr>
              ))}
            </tbody>
          </table>
        </It>
        <It className="mt-4">
          <p className="text-[12px] text-[var(--ir-subd)]">예시: 노무비 50% 절감 + 수율 +2%p</p>
          {[["2025 영업이익", 6.0, "#6E8A5A"], ["원가 개선 잠재력", 21.5, "#2E7D32"]].map(([l, v, c], i) => (
            <div key={l as string} className="mt-2">
              <div className="flex justify-between text-[12px]"><span>{l}</span><span className="font-bold tabular-nums">{(v as number).toFixed(1)}억</span></div>
              <div className="mt-1 h-3 overflow-hidden rounded-full bg-[var(--ir-line)]">
                <motion.div className="h-full rounded-full" style={{ background: c as string }} initial={{ width: "0%" }} animate={{ width: `${((v as number) / 21.5) * 100}%` }} transition={{ duration: 1.3, delay: 0.6 + i * 0.4, ease: EASE }} />
              </div>
            </div>
          ))}
        </It>
        <Src dark>회사 추정 · 기준: 노무비·제조 복리후생비 31.9억, 원재료비 275억 · 설비 감가상각·금융비용 차감 전 금액</Src>
      </S>
    </Body>
  ) },

  /* 26 로드맵 */
  { id: "roadmap", ch: 5, theme: "light", render: () => (
    <Body center>
      <S>
        <Head ey="05 · Roadmap" t="3단계 실행 계획" />
        <div className="relative mt-6 pl-8">
          <motion.div className="absolute bottom-3 left-[11px] top-3 w-[2px] origin-top bg-[var(--ir-gold)]" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1.6, delay: 0.3, ease: EASE }} />
          {[["STEP 1", "기술 검증 · 파일럿", "제천 라인에 비전 스캐닝 도입, 축종별 데이터 구축, 협력사와 절단 알고리즘 검증"], ["STEP 2", "전남 AI 스마트 육가공 센터", "국내 최대 축산 산지인 전남에 거점 구축, 산지 직매입과 농가 상생"], ["STEP 3", "확산 · 고단가 시장 진입", "균일 규격이 필요한 프랜차이즈·단체급식·군납·온라인 B2C로 확대"]].map(([s, t, d], i) => (
            <It key={s} className="relative pb-5">
              <span className={`absolute -left-8 top-0 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${i === 2 ? "bg-[var(--ir-night)] text-[var(--ir-gold)]" : "bg-[var(--ir-gold)] text-[var(--ir-night)]"}`}>{i + 1}</span>
              <p className="corm text-[13px] font-semibold tracking-[0.2em] text-[var(--ir-gold-ink)]">{s}</p>
              <p className="serif text-[17px] font-bold">{t}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--ir-sub)]">{d}</p>
            </It>
          ))}
        </div>
        <It className="rounded-xl border border-dashed border-[var(--ir-gold)] p-3.5 text-[12.5px] leading-relaxed text-[var(--ir-sub)]">세부 일정과 투자 금액은 투자 구조 확정 후 함께 제시합니다.</It>
        <Src>추진 계획 · 회사 사업계획서 (2026.10)</Src>
      </S>
    </Body>
  ) },

  /* 27 시장 */
  { id: "market", ch: 5, theme: "dark", render: () => (
    <>
      <div className="absolute inset-0 overflow-hidden"><img src={P("table.webp")} alt="" className="h-full w-full object-cover opacity-[0.06]" /></div>
      <Body center>
        <S>
          <Head dark ey="05 · Market Opportunity" t="균일한 규격을 원하는 시장으로" />
          <div className="mt-5 grid grid-cols-2 gap-2.5">
            {[["대형 외식 프랜차이즈", "전 매장 동일 규격·맛"], ["학교·공공 단체급식", "위생·이력 관리 필수"], ["군납", "대량·정량 공급"], ["온라인 프리미엄 B2C", "소포장·균일 품질"]].map(([t, d]) => (
              <It key={t} className={`${dcard} border-t-2 border-[var(--ir-gold)] p-3.5`}><p className="serif text-[14.5px] font-bold leading-snug">{t}</p><p className="mt-1 text-[12px] text-[var(--ir-subd)]">{d}</p></It>
            ))}
          </div>
          <It className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-[var(--ir-gold)]/30">
            <div className="bg-[var(--ir-night)] p-4 text-center"><p className="corm text-[44px] font-semibold leading-none text-[var(--ir-champ)]">1/3</p><p className="mt-1.5 text-[11.5px] text-[var(--ir-subd)]">생산 시간 단축 목표</p></div>
            <div className="bg-[var(--ir-night)] p-4 text-center"><p className="corm text-[44px] font-semibold leading-none text-[var(--ir-champ)]">3×</p><p className="mt-1.5 text-[11.5px] text-[var(--ir-subd)]">총생산량 확대 목표</p></div>
          </It>
          <It className="mt-4 text-[12.5px] leading-relaxed text-[var(--ir-subd)]">AI 공정이 만드는 ‘같은 규격, 같은 품질’은 수작업으로는 들어가기 어려웠던 대형 고정 수요의 입장권입니다.</It>
          <Src dark>목표치: 회사 사업계획서 (2026.10) 기준 추정</Src>
        </S>
      </Body>
    </>
  ) },

  /* 28 투자 제안 */
  { id: "proposal", ch: 6, theme: "light", render: () => (
    <Body center>
      <S>
        <Head ey="06 · Investment Proposal" t="투자 제안 (안)" />
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <It className="rounded-2xl bg-[var(--ir-night)] p-4 text-[var(--ir-cream)]"><p className="text-[11.5px] text-[var(--ir-subd)]">투자 규모</p><p className="serif mt-1 text-[24px] font-bold text-[var(--ir-champ)]">[  ]억 원</p></It>
          <It className={`${card} p-4`}><p className="text-[11.5px] text-[var(--ir-sub)]">투자 방식</p><p className="serif mt-1 text-[16px] font-bold leading-snug">유상증자 · CB 등<br />[협의]</p></It>
        </div>
        <It className={`${card} mt-3 p-4`}>
          <p className="text-[12.5px] font-bold text-[var(--ir-gold-ink)]">자금 사용 계획</p>
          {[["AI 비전·로봇 발골 설비", "[  ]%"], ["전남 AI 스마트 육가공 센터", "[  ]%"], ["원물 매입 운전자금", "[  ]%"], ["재무구조 개선", "[  ]%"]].map(([k, v], i) => (
            <div key={k} className="mt-2.5 flex items-center gap-3 border-t border-[var(--ir-line)] pt-2.5">
              <span className="corm w-5 text-[18px] font-semibold text-[var(--ir-gold-ink)]">{i + 1}</span>
              <span className="flex-1 text-[13.5px]">{k}</span>
              <span className="text-[13px] font-bold text-[var(--ir-sub)]">{v}</span>
            </div>
          ))}
        </It>
        <It className="mt-3 rounded-xl border-l-4 border-[var(--ir-gold)] bg-[var(--ir-paper)] p-3.5 text-[12.5px] leading-relaxed text-[var(--ir-sub)]">투자금은 <b className="text-[var(--ir-ink)]">이익 구조를 바꾸는 설비</b>와 <b className="text-[var(--ir-ink)]">부채비율 개선</b>에 우선 배정합니다. 세부 조건은 협의 후 확정합니다.</It>
      </S>
    </Body>
  ) },

  /* 29 리스크 */
  { id: "risks", ch: 6, theme: "light", render: () => (
    <Body center>
      <S>
        <Head ey="06 · Risks & Mitigation" t="리스크와 대응 방안" />
        <div className="mt-5 grid gap-2">
          {[["높은 레버리지", "부채비율 522%", "장기 저리 정책자금, 임대수익으로 이자 충당, 증자로 비율 개선"], ["낮은 이익률", "영업이익률 1.8%", "AI 자동화·수율 개선, 고단가 채널 확대"], ["매출채권 회수", "대손충당금 1.7억", "거래처 신용 관리 강화, 보증보험 활용"], ["원물 가격 변동", "원재료 비중 높음", "복수 조달선, 산지 직매입 확대"], ["유동성", "기말 현금 0.02억", "영업현금흐름 흑자 유지, 운전자금 확충"], ["기술 실행", "AI 도입 초기 단계", "파일럿부터 단계적 도입, 광학 협력사와 공동 검증"]].map(([t, m, d]) => (
            <It key={t} className={`${card} p-3`}>
              <div className="flex items-baseline justify-between gap-2"><p className="text-[13.5px] font-bold">{t}</p><p className="text-[11px] font-semibold text-[#9a5a3a]">{m}</p></div>
              <p className="mt-1 text-[12px] leading-snug text-[var(--ir-sub)]"><span className="font-bold text-[var(--ir-gold-ink)]">대응</span>  {d}</p>
            </It>
          ))}
        </div>
      </S>
    </Body>
  ) },

  /* 30 마무리 */
  { id: "closing", ch: 6, theme: "dark", render: ({ go }) => (
    <Body center>
      <Liquid src={P("family.webp")} alt="가족이 함께 고기를 구워 먹는 저녁 식탁" pos="50% 30%" className="mx-auto aspect-square w-[68%] shadow-[0_30px_70px_rgba(30,80,30,0.25)]" />
      <S className="mt-7">
        <It><p className="corm text-[40px] italic leading-none text-[var(--ir-gold-ink)]">Thank you</p></It>
        <h2 className="serif mt-2 overflow-hidden text-[32px] font-bold"><motion.span className="block" initial={{ y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 0.9, delay: 0.3, ease: EASE }}>감사합니다</motion.span></h2>
        <It><p className="serif mt-2 text-[14.5px] leading-relaxed text-[var(--ir-sub)]">좋은 고기를 넘어, 더 나은 식탁의 기준을 함께 만들겠습니다.</p></It>
        <It className="mt-4 grid gap-1.5 border-t border-[var(--ir-line)] pt-3.5 text-[12.5px]">
          {[["대표전화", "02-544-9145"], ["이메일", "manmi1004@naver.com"], ["서울사무소", "강동구 고덕비즈밸리로 26, B동 508호"], ["가공 거점", "충북 제천시 송학주천로 54"]].map(([k, v]) => (
            <p key={k} className="flex gap-3"><span className="w-[68px] shrink-0 text-[var(--ir-mute)]">{k}</span><span>{v}</span></p>
          ))}
        </It>
        <It className="mt-4 grid grid-cols-2 gap-2.5">
          <button type="button" onClick={() => go(0)} className="rounded-full border border-[var(--ir-gold-ink)] py-3 text-[13.5px] font-bold text-[var(--ir-gold-ink)]">처음부터 다시</button>
          <a href="/haeyeon" className="rounded-full bg-[var(--ir-gold-ink)] py-3 text-center text-[13.5px] font-bold text-white">사이트로 돌아가기</a>
        </It>
        <It><p className="mt-3 text-[10.5px] leading-relaxed text-[var(--ir-mute)]">본 자료의 계획·추정치는 회사 제시 자료에 근거하며 실제 결과와 다를 수 있습니다. 과거 재무 수치는 2025 회계연도 감사보고서 기준입니다.</p></It>
      </S>
    </Body>
  ) },
];

/* ───────── 나레이션 원고 (장 순서와 같음) — 휴대폰 내장 한국어 음성으로 읽어 준다 ───────── */
const NARR: Record<string, string> = {
  cover: "해연에프엔지 투자설명 자료입니다. 좋은 고기는 손끝에서, 더 좋은 고기는 데이터에서. 지금부터 해연에프엔지를 소개합니다.",
  contents: "자료는 투자 개요, 회사 개요, 사업 현황, 재무 현황, 성장 전략, 그리고 투자 제안 순서로 구성되어 있습니다.",
  summary: "해연에프엔지는 2025년 매출 341억 원, 매출총이익 15억 4천만 원, 영업활동 현금흐름 8억 1천만 원을 기록했습니다. 총자산은 96억 6천만 원입니다.",
  highlights: "핵심 투자 포인트는 여섯 가지입니다. 검증된 매출 규모, 인허가를 갖춘 가공 거점, 외부감사 적정 의견, 실물 자산, 개선되는 수익 체력, 그리고 AI 자동화를 통한 원가 개선 잠재력입니다.",
  glance: "2020년 8월 설립된 농업회사법인으로, 충북 제천의 HACCP 가공장을 거점으로 축산물 가공과 유통, 부동산 임대 사업을 하고 있습니다.",
  ceo: "이남미 대표이사는 생산자에게는 안정적인 판로를, 소비자에게는 믿을 수 있는 먹거리를 약속합니다. AI 스마트 팩토리로의 전환으로 투자자 여러분께 보답하겠습니다.",
  history: "2020년 설립 이후 2023년 HACCP 인증, 2024년 인천 공장건물 취득, 2025년 매출 341억 원을 달성했고, 2026년 첫 외부감사에서 적정 의견을 받았습니다.",
  shareholders: "주주는 이남미 대표이사 45퍼센트, 박용준 사내이사 30퍼센트, 유토컴퍼니 25퍼센트로, 경영진 지분이 75퍼센트입니다.",
  sites: "제천의 HACCP 가공장을 중심으로 전남 영암 본점, 인천과 하남미사 지점, 그리고 서울사무소를 두고 있습니다.",
  "div-biz": "다음은 사업 현황입니다.",
  model: "원물 조달부터 정밀 가공, B2B 공급까지 한 회사 안에서 이루어집니다. 2025년 매출의 99퍼센트가 제품 매출입니다.",
  products: "우육, 돈육, 가금육 정육과 소시지, 햄 원료가 되는 기계발골육까지, 한 마리를 남김없이 다룹니다.",
  production: "원물 입고부터 출고까지 여섯 단계 공정을 HACCP 기준으로 관리하며, 식육포장처리업과 축산물가공업 허가를 모두 갖추고 있습니다.",
  network: "부경양돈조합과 스마일팜미트 등 복수의 조달선과, 신선축산, 백조한우축산 등 고정 B2B 거래선을 확보하고 있습니다.",
  realestate: "인천 가좌동 공장건물은 전 층 임대 중이며, 2025년 임대매출 2억 7천만 원이 이자비용 2억 4천만 원을 웃돌았습니다.",
  "div-fin": "다음은 재무 현황입니다. 2025 회계연도 감사보고서를 기준으로 합니다.",
  income: "2025년 매출은 341억 원으로 전년 수준을 유지했고, 매출총이익은 17퍼센트 늘었습니다. 당기순이익은 흑자로 전환했습니다.",
  trend: "총이익률은 3.9퍼센트에서 4.5퍼센트로 높아졌습니다. 영업이익은 복리후생비와 보수적인 대손충당금 설정으로 줄었습니다.",
  balance: "자산 96억 6천만 원 가운데 91퍼센트가 토지와 건물입니다. 차입금 75억 원은 금리 2.99퍼센트의 장기 정책자금입니다.",
  cashflow: "영업활동에서 8억 1천만 원의 현금을 벌어, 특수관계자 차입금을 모두 갚았습니다.",
  health: "부채비율은 664퍼센트에서 522퍼센트로, 유동비율은 105퍼센트에서 224퍼센트로 개선되었습니다.",
  "div-ai": "다음은 성장 전략, AI 스마트 팩토리입니다.",
  problem: "현장 가공 인력 비용은 연간 31억 9천만 원에 이릅니다. 숙련 인력 부족과 수작업 수율 편차가 이익을 가로막고 있습니다.",
  solution: "AI 비전이 원육을 스캔하고, 딥러닝이 절단 경로를 정하며, 로봇이 정밀하게 발골합니다.",
  impact: "노무비 50퍼센트 절감과 정육 수율 2퍼센트포인트 개선만으로도, 연간 21억 5천만 원의 원가 개선이 가능하다고 회사는 추정합니다.",
  roadmap: "기술 검증과 파일럿, 전남 AI 스마트 육가공 센터 구축, 그리고 고단가 시장 진입의 세 단계로 실행합니다.",
  market: "같은 규격, 같은 품질은 프랜차이즈와 단체급식, 군납, 온라인 프리미엄 시장으로 들어가는 입장권입니다.",
  proposal: "투자금은 이익 구조를 바꾸는 설비와 부채비율 개선에 우선 배정합니다. 세부 조건은 협의 후 확정합니다.",
  risks: "높은 레버리지와 낮은 이익률 등 주요 리스크와 그에 대한 대응 방안을 함께 정리했습니다.",
  closing: "끝까지 들어 주셔서 감사합니다. 해연에프엔지는 좋은 고기를 넘어, 더 나은 식탁의 기준을 함께 만들겠습니다.",
};

/* ───────── 모핑 블롭: 같은 구조의 SVG 경로끼리 모양이 녹아들 듯 바뀐다 ───────── */
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
const BLOBS = Array.from({ length: 30 }, (_, k) => blob(k + 1));
const BLOB_POS = [
  { x: "38%", y: "-14%", scale: 1.15, rotate: 0 },
  { x: "-42%", y: "52%", scale: 1.0, rotate: 40 },
  { x: "46%", y: "58%", scale: 0.9, rotate: -30 },
  { x: "-30%", y: "-12%", scale: 0.85, rotate: 70 },
  { x: "30%", y: "26%", scale: 1.25, rotate: -15 },
  { x: "-20%", y: "70%", scale: 1.1, rotate: 20 },
];
const BLOB2_POS = [
  { x: "-34%", y: "68%", scale: 0.7, rotate: 10 },
  { x: "54%", y: "-6%", scale: 0.6, rotate: -40 },
  { x: "-38%", y: "8%", scale: 0.55, rotate: 60 },
  { x: "50%", y: "72%", scale: 0.75, rotate: -20 },
  { x: "-44%", y: "40%", scale: 0.6, rotate: 30 },
  { x: "56%", y: "40%", scale: 0.5, rotate: -60 },
];

export default function IRView({ autoVoice = false, onClose }: { autoVoice?: boolean; onClose?: () => void } = {}) {
  const [[i, dir], setState] = useState<[number, number]>([0, 0]);
  const [menu, setMenu] = useState(false);
  const N = SLIDES.length;
  const s = SLIDES[i];
  const dark = false;

  const go = useCallback((n: number) => {
    setMenu(false);
    setState(([cur]) => {
      const t = Math.max(0, Math.min(N - 1, n));
      return t === cur ? [cur, 0] : [t, t > cur ? 1 : -1];
    });
  }, [N]);
  const next = useCallback(() => setState(([c]) => (c < N - 1 ? [c + 1, 1] : [c, 0])), [N]);
  const prev = useCallback(() => setState(([c]) => (c > 0 ? [c - 1, -1] : [c, 0])), []);

  /* 나레이션: 켜면 장마다 읽고, 다 읽으면 다음 장으로 자동 진행 (동영상처럼) */
  const [voiceOn, setVoiceOn] = useState(autoVoice);
  const canSpeak = useSyncExternalStore(() => () => {}, () => "speechSynthesis" in window, () => false);
  const spoken = useRef(-1);
  const active = useRef(autoVoice);
  const userOff = useRef(false);
  const idxRef = useRef(0);
  useEffect(() => { idxRef.current = i; }, [i]);
  const [kakaoNoVoice, setKakaoNoVoice] = useState(false);
  const speak = useCallback((idx: number) => {
    const synth = window.speechSynthesis; if (!synth) return;
    synth.cancel();
    spoken.current = idx;
    const u = new SpeechSynthesisUtterance(NARR[SLIDES[idx].id] ?? "");
    u.lang = "ko-KR"; u.rate = 1.0; u.pitch = 1.0;
    const vs = synth.getVoices().filter((v) => v.lang.toLowerCase().startsWith("ko"));
    const best = vs.find((v) => /google|samsung|yuna|sora|heami|premium|enhanced/i.test(v.name)) ?? vs[0];
    if (best) u.voice = best;
    u.onend = () => { if (!active.current) return; window.setTimeout(() => { if (!active.current) return; setState(([c]) => (c === idx && c < N - 1 ? [c + 1, 1] : [c, 0])); }, 700); };
    synth.speak(u);
  }, [N]);
  useEffect(() => { if (voiceOn && spoken.current !== i) speak(i); }, [i, voiceOn, speak]);
  useEffect(() => { if (!voiceOn && typeof window !== "undefined" && window.speechSynthesis) { window.speechSynthesis.cancel(); spoken.current = -1; } }, [voiceOn]);
  useEffect(() => () => { if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel(); }, []);
  const toggleVoice = () => {
    if (!voiceOn) { userOff.current = false; active.current = true; speak(i); setVoiceOn(true); } else { userOff.current = true; active.current = false; setVoiceOn(false); }
  };

  /* 휴대폰 브라우저는 첫 터치 전에는 소리를 막는다 → 화면을 처음 만지는 순간 나레이션을 자동으로 시작 */
  useEffect(() => {
    if (!canSpeak) return;
    const start = (e: Event) => {
      const el = e.target as HTMLElement | null;
      if (el && el.closest && el.closest("[data-voice-btn]")) return;
      if (active.current || userOff.current) return;
      active.current = true; speak(idxRef.current); setVoiceOn(true);
    };
    window.addEventListener("pointerdown", start, { once: true, capture: true });
    window.addEventListener("keydown", start, { once: true, capture: true });
    return () => { window.removeEventListener("pointerdown", start, { capture: true }); window.removeEventListener("keydown", start, { capture: true }); };
  }, [canSpeak, speak]);

  /* 안드로이드 카카오톡 인앱브라우저는 음성 기능이 없다 → 외부 브라우저로 열기 안내 */
  useEffect(() => {
    const ua = navigator.userAgent || "";
    if (!/KAKAOTALK/i.test(ua)) return;
    const t0 = window.setTimeout(() => {
      const ok = "speechSynthesis" in window && window.speechSynthesis.getVoices().some((v) => v.lang.toLowerCase().startsWith("ko"));
      if (!ok) setKakaoNoVoice(true);
    }, 1200);
    return () => window.clearTimeout(t0);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); prev(); }
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);


  return (
    <div className="ir">
      <div className="relative mx-auto h-[100dvh] w-full max-w-[480px] overflow-hidden">
        {/* 무대 배경: 테마에 따라 색이 모핑 */}
        <motion.div className="absolute inset-0" animate={{ backgroundColor: "#ffffff" }} transition={{ duration: 0.7 }} />
        {/* 모핑 블롭 두 개: 장을 넘길 때마다 모양·위치·크기가 녹아들 듯 바뀐다 */}
        <motion.svg aria-hidden="true" viewBox="0 0 200 200" className="pointer-events-none absolute left-0 top-0 w-full" style={{ filter: "blur(2px)" }}
          animate={BLOB_POS[i % BLOB_POS.length]} transition={{ type: "spring", stiffness: 38, damping: 14 }}>
          <defs><linearGradient id="ir-g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#ebf6dc" /><stop offset="100%" stopColor="#d5ecb4" /></linearGradient></defs>
          <motion.path fill="url(#ir-g1)" initial={false} animate={{ d: BLOBS[i] }} transition={{ duration: 1.4, ease: EASE }} />
        </motion.svg>
        <motion.svg aria-hidden="true" viewBox="0 0 200 200" className="pointer-events-none absolute left-0 top-0 w-full"
          animate={BLOB2_POS[i % BLOB2_POS.length]} transition={{ type: "spring", stiffness: 30, damping: 12 }}>
          <motion.path fill="#fff4c2" initial={false} animate={{ d: BLOBS[(i + 11) % 30] }} transition={{ duration: 1.6, ease: EASE }} />
        </motion.svg>
        {/* 얇은 그린 프레임: 장마다 모서리가 살짝 모핑 */}
        <motion.div aria-hidden="true" className="pointer-events-none absolute z-20 border border-[#d6e6c6]"
          animate={{ top: 12, left: 12, right: 12, bottom: 12, borderRadius: i % 2 ? 26 : 8 }}
          transition={{ type: "spring", stiffness: 70, damping: 18 }} />
        {/* 슬라이드 */}
        <AnimatePresence initial={false} custom={dir}>
          <motion.section key={s.id} custom={dir} className={`absolute inset-0 z-10 text-[var(--ir-ink)] ${s.theme === "dark" ? "flip" : ""}`}
            variants={{
              enter: (d: number) => ({ x: d >= 0 ? "100%" : "-100%", scale: 0.86, rotateY: d >= 0 ? -24 : 24 }),
              center: { x: "0%", scale: 1, rotateY: 0 },
              exit: (d: number) => ({ x: d >= 0 ? "-100%" : "100%", scale: 0.86, rotateY: d >= 0 ? 24 : -24 }),
            }}
            initial="enter" animate="center" exit="exit"
            transition={{ x: { type: "spring", stiffness: 260, damping: 32 }, scale: { duration: 0.5 }, rotateY: { duration: 0.6 } }}
            style={{ transformPerspective: 1200 }}
            aria-roledescription="slide" aria-label={`${i + 1} / ${N}`}>
            <motion.div className="stage absolute inset-0" drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.22} dragMomentum={false}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60 || info.velocity.x < -450) next();
                else if (info.offset.x > 60 || info.velocity.x > 450) prev();
              }}>
              {s.render({ go })}
            </motion.div>
          </motion.section>
        </AnimatePresence>

        {/* 상단: 진행 막대 + 장 이름 */}
        <div className="absolute inset-x-0 top-0 z-30 px-5 pt-[calc(14px+env(safe-area-inset-top,0px))]">
          <div className="relative flex gap-[3px]">
            {SLIDES.map((x, k) => (
              <button key={x.id} type="button" aria-label={`${k + 1}번째 장으로`} onClick={() => go(k)} className="relative h-[14px] flex-1">
                <span className={`absolute inset-x-0 top-[6px] h-[2px] rounded-full ${k <= i ? (dark ? "bg-[var(--ir-gold)]" : "bg-[var(--ir-gold-ink)]") : dark ? "bg-white/20" : "bg-black/15"}`} />
                {k === i && <motion.span layoutId="ir-cursor" className={`absolute inset-x-[-2px] top-[4px] h-[6px] rounded-full ${dark ? "bg-[var(--ir-champ)]" : "bg-[var(--ir-gold-ink)]"}`} transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              </button>
            ))}
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            {onClose ? (
              <button type="button" onClick={() => { if (window.speechSynthesis) window.speechSynthesis.cancel(); active.current = false; onClose(); }} className="flex items-center gap-1 text-[12px] font-bold text-[var(--ir-gold-ink)]">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>사이트
              </button>
            ) : (
              <a href="/haeyeon" className="flex items-center gap-1 text-[12px] font-bold text-[var(--ir-gold-ink)]">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>사이트
              </a>
            )}
            <motion.p layout key={s.ch} initial={{ y: -8 }} animate={{ y: 0 }} className={`corm text-[13px] font-semibold uppercase tracking-[0.22em] ${dark ? "text-[var(--ir-gold)]" : "text-[var(--ir-gold-ink)]"}`}>{CHAPTERS[s.ch]}</motion.p>
            <span className="flex items-center gap-3">
              {kakaoNoVoice && (
                <a data-voice-btn href={`kakaotalk://web/openExternal?url=${encodeURIComponent("https://unicoenergygroup.com/haeyeon/ir")}`}
                  className="rounded-full bg-[var(--ir-gold-ink)] px-2.5 py-1 text-[11px] font-bold text-white">소리로 듣기</a>
              )}
              {canSpeak && !kakaoNoVoice && (
                <button type="button" data-voice-btn onClick={toggleVoice} aria-pressed={voiceOn} aria-label={voiceOn ? "나레이션 끄기" : "나레이션 켜기"}
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-bold ${voiceOn ? "bg-[var(--ir-gold-ink)] text-white" : "border border-[var(--ir-gold-ink)]/50 text-[var(--ir-gold-ink)]"}`}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z" />{voiceOn ? <path d="M16 8.5a5 5 0 0 1 0 7 M19 6a8.5 8.5 0 0 1 0 12" /> : <path d="M17 9l5 6 M22 9l-5 6" />}</svg>
                  {voiceOn ? "재생 중" : "소리"}
                </button>
              )}
              <button type="button" onClick={() => setMenu(true)} aria-label="목차 열기" className="text-[12px] font-bold text-[var(--ir-gold-ink)]">목차</button>
            </span>
          </div>
        </div>

        {/* 하단: 이전·다음 */}
        <div className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-between px-5 pb-[calc(20px+env(safe-area-inset-bottom,0px))]">
          <button type="button" onClick={prev} disabled={i === 0} aria-label="이전 장" className={`flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md disabled:invisible ${dark ? "border-[var(--ir-gold)]/50 bg-[var(--ir-night)]/50 text-[var(--ir-champ)]" : "border-[var(--ir-gold-ink)]/40 bg-[var(--ir-paper)]/70 text-[var(--ir-gold-ink)]"}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <p className={`corm text-[17px] font-semibold tabular-nums ${dark ? "text-[var(--ir-champ)]" : "text-[var(--ir-ink)]"}`}>
            <motion.span key={i} initial={{ y: 10 }} animate={{ y: 0 }} className="inline-block">{String(i + 1).padStart(2, "0")}</motion.span>
            <span className="mx-1.5 opacity-50">/</span>{N}
          </p>
          <button type="button" onClick={next} disabled={i === N - 1} aria-label="다음 장" className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--ir-gold)] text-[var(--ir-night)] shadow-lg disabled:invisible">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>

        {/* 목차 시트 */}
        <AnimatePresence>
          {menu && (
            <motion.div key="menu" className="absolute inset-0 z-40 bg-[var(--ir-night)] px-6 pt-16 text-[var(--ir-cream)]"
              initial={{ clipPath: "circle(0% at 92% 4%)" }} animate={{ clipPath: "circle(150% at 92% 4%)" }} exit={{ clipPath: "circle(0% at 92% 4%)" }} transition={{ duration: 0.6, ease: EASE }}>
              <button type="button" onClick={() => setMenu(false)} aria-label="목차 닫기" className="absolute right-5 top-5 text-[13px] font-bold text-[var(--ir-champ)]">닫기 ✕</button>
              <p className="corm text-[14px] font-semibold uppercase tracking-[0.26em] text-[var(--ir-gold)]">Contents</p>
              <div className="mt-4 grid gap-1">
                {CHAPTERS.map((c, k) => {
                  const start = SLIDES.findIndex((x) => x.ch === k);
                  return (
                    <button key={c} type="button" onClick={() => go(start)} className={`flex items-center gap-4 border-t border-white/10 py-3.5 text-left ${s.ch === k ? "text-[var(--ir-champ)]" : ""}`}>
                      <span className="corm w-8 text-[26px] font-semibold text-[var(--ir-gold)]">{String(k).padStart(2, "0")}</span>
                      <span className="serif flex-1 text-[18px] font-bold">{c}</span>
                      <span className="text-[12px] text-[var(--ir-mute)]">{start + 1}</span>
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
