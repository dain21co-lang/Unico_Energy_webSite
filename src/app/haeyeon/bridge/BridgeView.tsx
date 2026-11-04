"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

/*
 * 해연에프엔지 브릿지·PF 자금조달 제안 — 모바일 전용 모션 프레젠테이션 (IR 뷰어와 같은 엔진)
 * 원칙: 투명도 애니메이션 없이 위치·크기·모양만 움직인다 (갤럭시 빈 화면 방지)
 * 수치 출처: 2025 회계연도 결산 재무제표 / 추정·계획은 회사 사업계획서(2026.10)
 */

// (사진 경로 도우미는 IR과 공유하지 않음)
/* 성우(CLOVA Voice) 녹음 파일이 있는 장 번호 (public/haeyeon/ir/voice/NN.mp3). 없는 장은 휴대폰 음성으로 읽는다 */
const VOICE_SET = new Set<number>();
const IMG = (f: string) => `/haeyeon/img/${f}`;
const EASE = [0.16, 1, 0.3, 1] as const;

type Theme = "dark" | "light";
type Ctx = { go: (n: number) => void };
type Slide = { id: string; ch: number; theme: Theme; render: (c: Ctx) => ReactNode };

const CHAPTERS = ["표지", "제안 개요", "거래 구조", "담보 · 규모", "실행 계획", "상환 · 확인"];

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
        <Liquid src={IMG("plant-front.jpg")} alt="해연에프엔지 제천 가공 공장" pos="50% 50%" className="mx-auto aspect-square w-[78%] shadow-[0_30px_70px_rgba(30,80,30,0.25)]" />
        <motion.img src={IMG("symbol.png")} alt="해연에프엔지 심볼" className="absolute bottom-[-18px] left-[8%] h-[72px] w-[72px] rounded-full bg-white object-contain p-1 shadow-lg"
          initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.8 }} />
      </div>
      <S className="mt-9">
        <It className="flex items-center gap-3"><motion.span className="block h-[2px] w-10 origin-left bg-[var(--ir-gold)]" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.4 }} /><p className="corm text-[15px] font-semibold uppercase tracking-[0.3em] text-[var(--ir-gold-ink)]">Bridge to PF · Proposal</p></It>
        <h1 className="serif mt-3 overflow-hidden text-[34px] font-black leading-[1.2] tracking-tight"><motion.span className="block" initial={{ y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 1, delay: 0.3, ease: EASE }}>브릿지 · PF<br />자금조달 제안</motion.span></h1>
        <It><p className="serif mt-3 text-[16px] font-medium leading-[1.6] text-[var(--ir-sub)]">옥수 개발부지와 정선호텔을 담보로,<br />해연에프엔지가 브릿지 후 PF로 이어갑니다.</p></It>
        <It><p className="mt-4 text-[11.5px] tracking-wide text-[var(--ir-mute)]">농업회사법인 해연에프엔지 주식회사 · PF 주관 유안타증권 · 2026. 11 · 협의용 초안</p></It>
        <It><p className="hint mt-5 flex items-center gap-2 text-[12.5px] font-semibold text-[var(--ir-gold-ink)]">옆으로 밀어 넘겨 보세요 <span aria-hidden="true">→</span></p></It>
      </S>
    </Body>
  ) },

  /* 02 한눈에 */
  { id: "glance", ch: 1, theme: "dark", render: () => (
    <Body center>
      <S>
        <Head ey="01 · At a Glance" t={<>담보 50억 원으로<br />브릿지를 열고, PF로 갚습니다</>} />
        <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-[var(--ir-gold)]/30">
          <It className="bg-white p-4"><p className="text-[12px] text-[var(--ir-sub)]">담보 예상감정</p><p className="corm mt-1 text-[46px] font-semibold leading-none text-[var(--ir-gold-ink)]"><Count to={50} /><span className="ml-0.5 text-[22px]">억</span></p><p className="mt-1.5 text-[11.5px] text-[var(--ir-mute)]">옥수 25억 + 정선호텔 25억</p></It>
          <It className="bg-white p-4"><p className="text-[12px] text-[var(--ir-sub)]">브릿지 규모</p><p className="corm mt-1 whitespace-nowrap text-[36px] font-semibold leading-none text-[var(--ir-gold-ink)]"><Count to={25} />~<Count to={35} /><span className="ml-0.5 text-[22px]">억</span></p><p className="mt-1.5 text-[11.5px] text-[var(--ir-mute)]">담보비율 50~70% 기준 협의</p></It>
          <It className="bg-white p-4"><p className="text-[12px] text-[var(--ir-sub)]">기간</p><p className="corm mt-1 whitespace-nowrap text-[36px] font-semibold leading-none text-[var(--ir-gold-ink)]"><Count to={6} />~<Count to={12} /><span className="ml-0.5 text-[18px]">개월</span></p><p className="mt-1.5 text-[11.5px] text-[var(--ir-mute)]">PF 전환 시점까지</p></It>
          <It className="bg-white p-4"><p className="text-[12px] text-[var(--ir-sub)]">상환 재원</p><p className="serif mt-2 text-[26px] font-bold leading-none text-[var(--ir-gold-ink)]">PF 인출금</p><p className="mt-2.5 text-[11.5px] text-[var(--ir-mute)]">PF 주관: 유안타증권</p></It>
        </div>
        <It className="mt-4 rounded-xl bg-[var(--ir-tint)] p-4 text-[13px] leading-relaxed text-[var(--ir-sub)]"><b className="text-[var(--ir-ink)]">차주</b> 농업회사법인 해연에프엔지㈜ · <b className="text-[var(--ir-ink)]">담보 제공</b> 최회장 측 소유자 · <b className="text-[var(--ir-ink)]">금리·수수료</b> [협의]</It>
        <Src>예상감정은 최회장 측 제시 금액이며, 정식 감정평가 후 확정합니다.</Src>
      </S>
    </Body>
  ) },

  /* 03 거래 구조 (흐름이 그려지는 그림) */
  { id: "structure", ch: 2, theme: "light", render: () => {
    const nodes: [string, string, string, number, boolean][] = [
      ["담보 제공", "옥수 부지 · 정선호텔", "최회장 측 소유자", 0, false],
      ["대주", "브릿지 [  ]억 원", "근저당 설정 후 실행", 1, true],
      ["차주 · 해연에프엔지", "자금 집행", "호텔 공사 · 옥수 착수 · 운전자금", 2, false],
      ["PF 전환", "PF 주관 · 유안타증권", "홍상무 측 주관 → PF 인출금으로 브릿지 상환", 3, true],
    ];
    return (
      <Body center>
        <S>
          <Head ey="02 · Deal Structure" t="담보 → 브릿지 → 사업 → PF, 네 단계로 돈이 돕니다" />
          <div className="relative mt-6">
            <svg className="absolute left-[22px] top-[28px] h-[calc(100%-56px)] w-4" viewBox="0 0 16 300" preserveAspectRatio="none" aria-hidden="true">
              <motion.line x1="8" y1="0" x2="8" y2="300" stroke="#8cc63f" strokeWidth="3" strokeDasharray="6 6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.2, delay: 0.4, ease: "easeInOut" }} />
            </svg>
            {nodes.map(([t, a, b, k, hi]) => (
              <It key={t} className="relative mb-3 flex items-start gap-4">
                <motion.span className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[15px] font-bold ${hi ? "bg-[var(--ir-gold-ink)] text-white" : "border-2 border-[var(--ir-gold-ink)] bg-white text-[var(--ir-gold-ink)]"}`}
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.5 + k * 0.45 }}>{k + 1}</motion.span>
                <div className={`flex-1 rounded-xl p-3.5 ${hi ? "bg-[var(--ir-tint)]" : "border border-[var(--ir-line)] bg-white"}`}>
                  <p className="text-[11.5px] font-bold text-[var(--ir-gold-ink)]">{t}</p>
                  <p className="serif text-[16px] font-bold">{a}</p>
                  <p className="mt-0.5 text-[12px] text-[var(--ir-sub)]">{b}</p>
                </div>
              </It>
            ))}
          </div>
          <It className="mt-1 rounded-xl border border-dashed border-[var(--ir-gold-ink)]/50 p-3 text-[12px] leading-relaxed text-[var(--ir-sub)]">차주(해연)와 담보 소유자가 다르므로 소유자의 담보제공(물상보증) 동의서가 필요합니다.</It>
        </S>
      </Body>
    );
  } },

  /* 04 차주 */
  { id: "borrower", ch: 2, theme: "dark", render: () => (
    <Body center>
      <S>
        <Head ey="02 · Borrower" t="차주 해연에프엔지 — 연 매출 341억 원" />
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          {[[341, 0, "2025 매출액", "억"], [15.4, 1, "매출총이익", "억"], [8.1, 1, "영업활동 현금흐름", "억"], [96.6, 1, "총자산", "억"]].map(([v, d, l, u]) => (
            <It key={l as string} className={`${card} p-4`}><p className="text-[12px] text-[var(--ir-sub)]">{l}</p><p className="corm mt-1 text-[40px] font-semibold leading-none text-[var(--ir-gold-ink)]"><Count to={v as number} d={d as number} /><span className="text-[20px]">{u}</span></p></It>
          ))}
        </div>
        <div className="mt-3 grid gap-2">
          {[["가공 거점", "충북 제천 HACCP 가공장 · 식육포장처리업·축산물가공업 허가"], ["수익형 자산", "인천 가좌동 공장건물(전 층 임대) · 하남미사 상가"], ["주요 차입", "IBK 중소기업시설자금 75억 원 (금리 2.99%)"]].map(([k, v]) => (
            <It key={k} className="flex gap-3 border-t border-[var(--ir-line)] pt-2.5 text-[12.5px]"><span className="w-[68px] shrink-0 font-bold text-[var(--ir-gold-ink)]">{k}</span><span className="text-[var(--ir-sub)]">{v}</span></It>
          ))}
        </div>
        <Src>2025 회계연도 결산 기준 · 상세는 해연에프엔지 IR 자료 참조</Src>
      </S>
    </Body>
  ) },

  /* 05 담보 */
  { id: "collateral", ch: 3, theme: "light", render: () => (
    <Body center>
      <S>
        <Head ey="03 · Collateral" t="담보 두 건, 예상감정 합계 50억 원" />
        <div className="mt-5 grid gap-3">
          {[["옥수 개발부지", "전북 완주군 봉동읍 제내리", "의료폐기물 처리시설 + 스마트팜 복합개발 예정지", "의료폐기물 처리업 허가 추진 중"], ["정선호텔", "[주소 확인 필요]", "호텔 · 공사비 25억 원 예정", "호텔 자료 수령 예정"]].map(([n, a, u, note], i) => (
            <It key={n} className={`${card} relative overflow-hidden p-4`}>
              <motion.div className="absolute inset-y-0 left-0 w-1.5 origin-top bg-[var(--ir-gold)]" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.9, delay: 0.5 + i * 0.3 }} />
              <div className="flex items-baseline justify-between"><p className="serif text-[18px] font-bold">{n}</p><p className="corm text-[34px] font-semibold leading-none text-[var(--ir-gold-ink)]"><Count to={25} delay={0.5 + i * 0.3} /><span className="text-[17px]">억</span></p></div>
              <p className="mt-1 text-[12.5px] text-[var(--ir-sub)]">{a}</p>
              <p className="text-[12.5px] text-[var(--ir-sub)]">{u}</p>
              <p className="mt-2 inline-block rounded-full bg-[var(--ir-tint)] px-2.5 py-1 text-[11px] font-semibold text-[var(--ir-gold-ink)]">{note}</p>
            </It>
          ))}
        </div>
        <It className="mt-3 grid grid-cols-3 gap-2 text-center text-[11.5px]">
          {["정식 감정평가", "신탁등기 없음", "담보제공 동의서"].map((t) => <p key={t} className="rounded-lg border border-[var(--ir-line)] px-1 py-2.5 font-semibold text-[var(--ir-sub)]">{t}</p>)}
        </It>
        <Src>예상감정은 최회장 측 제시 · 위 세 가지를 거쳐 담보 가치를 확정합니다.</Src>
      </S>
    </Body>
  ) },

  /* 06 규모 시나리오 */
  { id: "ltv", ch: 3, theme: "light", render: () => (
    <Body center>
      <S>
        <Head ey="03 · Bridge Size" t="담보비율에 따라 25억~35억 원" />
        <It className={`${card} mt-5 p-4`}>
          <div className="flex justify-between text-[12px]"><span className="font-bold">담보 예상감정</span><span className="font-bold tabular-nums">50억</span></div>
          <div className="mt-1 h-4 rounded-full bg-[#eef3e8]" />
          {[[50, 25, "보수적 — 감정가 하락에도 여유"], [60, 30, "중간안"], [70, 35, "적극적 — 금리·수수료 상승"]].map(([p, v, d], i) => (
            <div key={p as number} className="mt-4">
              <div className="flex items-baseline justify-between"><span className="text-[13px] font-bold">LTV {p}%</span><span className="corm text-[26px] font-semibold leading-none text-[var(--ir-gold-ink)]"><Count to={v as number} delay={0.5 + i * 0.3} />억</span></div>
              <div className="mt-1 h-4 overflow-hidden rounded-full bg-[#eef3e8]">
                <motion.div className="h-full rounded-full" style={{ background: i === 1 ? "#2e7d32" : "#8cc63f" }} initial={{ width: "0%" }} animate={{ width: `${p}%` }} transition={{ duration: 1.2, delay: 0.5 + i * 0.3, ease: EASE }} />
              </div>
              <p className="mt-1 text-[11.5px] text-[var(--ir-sub)]">{d}</p>
            </div>
          ))}
        </It>
        <It className="mt-3 rounded-xl bg-[var(--ir-tint)] p-3.5 text-[12.5px] leading-relaxed text-[var(--ir-sub)]">선순위 채권이 있으면: <b className="text-[var(--ir-ink)]">감정가 × LTV − 선순위 채권최고액</b>이 실제 가능 금액입니다.</It>
      </S>
    </Body>
  ) },

  /* 07 자금 용도 */
  { id: "use", ch: 4, theme: "dark", render: () => (
    <Body center>
      <S>
        <Head ey="04 · Use of Funds" t="PF로 이어질 사업 가치에 먼저 씁니다" />
        <div className="mt-5 grid gap-2.5">
          {[["정선호텔 공사비", "총 공사비 25억 원 중", "공사비 근거 수령 예정"], ["옥수 개발 착수", "인허가 · 설계", "사업계획서 기준"], ["해연 운전자금", "원물 매입", "기말 현금 0.02억 원 보강"], ["금융비용", "선취 이자 · 수수료", "금리 협의 후"]].map(([t, a, b], i) => (
            <It key={t} className={`${dcard} flex items-center gap-4 p-4`}>
              <span className="corm text-[30px] font-semibold leading-none text-[var(--ir-gold-ink)]">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex-1"><span className="block text-[14.5px] font-bold">{t}</span><span className="block text-[12px] text-[var(--ir-sub)]">{a} · {b}</span></span>
              <span className="text-[14px] font-bold text-[var(--ir-sub)]">[  ]억</span>
            </It>
          ))}
        </div>
        <It className="mt-3 flex items-center justify-between rounded-xl bg-[var(--ir-gold-ink)] px-4 py-3 text-white"><span className="text-[13px] font-bold">합계</span><span className="text-[15px] font-bold">[  ]억 원</span></It>
        <Src>금액은 브릿지 규모가 정해지면 확정합니다.</Src>
      </S>
    </Body>
  ) },

  /* 08 로드맵 */
  { id: "roadmap", ch: 4, theme: "light", render: () => (
    <Body center>
      <S>
        <Head ey="04 · Roadmap" t="12개월 안에 브릿지에서 PF로" />
        <div className="relative mt-6 pl-9">
          <motion.div className="absolute bottom-6 left-[14px] top-3 w-[3px] origin-top rounded-full bg-[var(--ir-gold)]" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 2, delay: 0.3, ease: EASE }} />
          {[["0", "D ~ D+1개월", "준비", "정식 감정 · 등기 확인 · 담보제공 동의 · 약정", "감정가·조건 확정"], ["1", "D+1개월", "브릿지 실행", "근저당 설정 후 [  ]억 원 실행", "자금 집행 계획 승인"], ["2", "D+1 ~ 6개월", "사업 진행", "호텔 공사 · 옥수 인허가·설계 · 해연 운영", "인허가·공정 달성"], ["3", "D+6 ~ 12개월", "PF 전환 · 상환", "유안타증권 주관 PF · 시공사 선정 → PF 인출 → 브릿지 상환", "근저당 말소"]].map(([n, w, t, d, g], i) => (
            <It key={n} className="relative pb-5">
              <motion.span className={`absolute -left-9 top-0 flex h-[30px] w-[30px] items-center justify-center rounded-full text-[13px] font-bold ${i === 3 ? "bg-[var(--ir-gold-ink)] text-white" : "border-2 border-[var(--ir-gold-ink)] bg-white text-[var(--ir-gold-ink)]"}`}
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.5 + i * 0.4 }}>{n}</motion.span>
              <p className="text-[11.5px] font-bold text-[var(--ir-gold-ink)]">{w}</p>
              <p className="serif text-[17px] font-bold">{t}</p>
              <p className="mt-0.5 text-[12.5px] text-[var(--ir-sub)]">{d}</p>
              <p className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-[var(--ir-tint)] px-2.5 py-1 text-[11px] font-semibold text-[var(--ir-gold-ink)]"><span aria-hidden="true">◆</span>관문 · {g}</p>
            </It>
          ))}
        </div>
      </S>
    </Body>
  ) },

  /* 09 상환·리스크 */
  { id: "repay", ch: 5, theme: "dark", render: () => (
    <Body center>
      <S>
        <Head ey="05 · Repayment & Risks" t="상환 재원은 세 겹으로 둡니다" />
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[["1순위", "PF 인출금"], ["2순위", "해연 영업현금"], ["3순위", "담보 처분"]].map(([k, v], i) => (
            <motion.div key={k} className={`rounded-xl p-3 text-center ${i === 0 ? "bg-[var(--ir-gold-ink)] text-white" : "border border-[var(--ir-line)] bg-white"}`}
              initial={{ y: 40, scale: 0.9 }} animate={{ y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.4 + i * 0.2 }}>
              <p className={`text-[11px] font-bold ${i === 0 ? "text-white/80" : "text-[var(--ir-gold-ink)]"}`}>{k}</p>
              <p className="mt-1 text-[13.5px] font-bold leading-snug">{v}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 grid gap-2">
          {[["감정가 차이", "정식 감정 후 금액 확정, LTV 보수적 적용"], ["인허가 일정", "옥수 허가 일정을 PF 조건에 반영, 지역 협의 병행"], ["PF 지연", "브릿지 기간 연장 조항, 보조 상환 재원"], ["차주 재무", "담보 중심 설계, 자금 사용 내역 정기 보고"], ["공사 리스크", "공사비 근거 검토, 기성고 지급"]].map(([t, d]) => (
            <It key={t} className={`${card} p-3`}><p className="text-[13px] font-bold">{t}</p><p className="mt-0.5 text-[12px] text-[var(--ir-sub)]"><span className="font-bold text-[var(--ir-gold-ink)]">대응</span>  {d}</p></It>
          ))}
        </div>
      </S>
    </Body>
  ) },

  /* 10 확인 사항·마무리 */
  { id: "closing", ch: 5, theme: "light", render: ({ go }) => (
    <Body center>
      <S>
        <Head ey="05 · Next Steps" t="아래 사항은 추후 보정합니다" />
        <div className="mt-5 grid gap-1.5">
          {["정선호텔 주소·규모·현황 자료", "정선호텔 공사비 25억 원 산출 근거", "두 물건 등기부 — 소유자·선순위 (신탁등기는 없음)", "소유자 담보제공 동의", "정식 감정평가 기관·일정", "브릿지 금액·금리·기간 희망안", "옥수 의료폐기물 처리업 허가 진행 단계"].map((t, i) => (
            <It key={t} className="flex items-center gap-3 border-t border-[var(--ir-line)] py-2.5 text-[13px]">
              <motion.span className="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-[var(--ir-gold-ink)]" initial={{ rotate: -90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ delay: 0.4 + i * 0.12 }} />
              <span>{t}</span>
            </It>
          ))}
        </div>
        <It className="mt-5 grid grid-cols-2 gap-2.5">
          <button type="button" onClick={() => go(0)} className="rounded-full border border-[var(--ir-gold-ink)] py-3 text-[13.5px] font-bold text-[var(--ir-gold-ink)]">처음부터 다시</button>
          <a href="/haeyeon/ir" className="rounded-full bg-[var(--ir-gold-ink)] py-3 text-center text-[13.5px] font-bold text-white">해연 IR 보기</a>
        </It>
        <It><p className="mt-3 text-[10.5px] leading-relaxed text-[var(--ir-mute)]">본 자료는 협의용 초안으로, 위 사항과 금액·조건은 정식 감정과 실사 후 보정·확정됩니다.</p></It>
      </S>
    </Body>
  ) },
];

/* ───────── 나레이션 원고 (장 순서와 같음) — 휴대폰 내장 한국어 음성으로 읽어 준다 ───────── */
const NARR: Record<string, string> = {};

/* 녹음 파일 재생 도우미 */
function playClip(a: HTMLAudioElement, src: string, onEnd: () => void) { a.src = src; a.onended = onEnd; a.play().catch(() => {}); }
function stopClip(a: HTMLAudioElement) { a.onended = null; a.pause(); }
function loopBgm(a: HTMLAudioElement) { a.loop = true; a.volume = 0.22; a.play().catch(() => {}); }

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

export default function BridgeView({ autoVoice = false, onClose }: { autoVoice?: boolean; onClose?: () => void } = {}) {
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
  const canSpeak = useSyncExternalStore(() => () => {}, () => false, () => false);
  const spoken = useRef(-1);
  const active = useRef(autoVoice);
  const userOff = useRef(false);
  const idxRef = useRef(0);
  useEffect(() => { idxRef.current = i; }, [i]);
  const [kakaoNoVoice, setKakaoNoVoice] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  /* 배경음악: 잔잔한 피아노·패드 루프 (직접 작곡·합성, 저작권 문제 없음) */
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const startBgm = useCallback(() => {
    const w = window as unknown as { __hyBgm?: HTMLAudioElement };
    const a = bgmRef.current ?? w.__hyBgm ?? new Audio("/haeyeon/ir/bgm.mp3");
    bgmRef.current = a; w.__hyBgm = a;
    loopBgm(a);
  }, []);
  const stopBgm = useCallback(() => { if (bgmRef.current) bgmRef.current.pause(); }, []);
  const stopAll = useCallback(() => {
    if (audioRef.current) stopClip(audioRef.current);
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
  }, []);
  const speak = useCallback((idx: number) => {
    stopAll();
    spoken.current = idx;
    const after = () => { if (!active.current) return; window.setTimeout(() => { if (!active.current) return; setState(([c]) => (c === idx && c < N - 1 ? [c + 1, 1] : [c, 0])); }, 800); };
    /* 성우 녹음 파일이 준비되면 그것을 우선 재생 (모든 휴대폰·카카오톡에서 같은 목소리) */
    if (VOICE_SET.has(idx + 1)) {
      const a = audioRef.current ?? new Audio(); audioRef.current = a;
      playClip(a, `/haeyeon/ir/voice/${String(idx + 1).padStart(2, "0")}.mp3`, after);
      return;
    }
    const synth = window.speechSynthesis; if (!synth) return;
    const u = new SpeechSynthesisUtterance(NARR[SLIDES[idx].id] ?? "");
    /* 여성 목소리 우선, 차분하고 고급스럽게: 살짝 느리게, 살짝 높게 */
    u.lang = "ko-KR"; u.rate = 0.88; u.pitch = 1.02; u.volume = 0.95;
    const vs = synth.getVoices().filter((v) => v.lang.toLowerCase().replace("_", "-").startsWith("ko"));
    const female = vs.filter((v) => !/minsu|injoon|hyunsu|bongjin|gookmin|male|남성|남자/i.test(v.name));
    const best = female.find((v) => /sunhi|yuna|sora|heami|seoyeon|jimin|female|여성|여자/i.test(v.name))
      ?? female.find((v) => /natural|premium|enhanced|neural/i.test(v.name))
      ?? female.find((v) => /google|samsung/i.test(v.name)) ?? female[0] ?? vs[0];
    if (best) u.voice = best;
    u.onend = after;
    synth.speak(u);
  }, [N, stopAll]);
  useEffect(() => { if (voiceOn && spoken.current !== i) speak(i); }, [i, voiceOn, speak]);
  useEffect(() => { if (!voiceOn) { stopAll(); stopBgm(); spoken.current = -1; } else startBgm(); }, [voiceOn, stopAll, stopBgm, startBgm]);
  useEffect(() => () => { stopAll(); stopBgm(); }, [stopAll, stopBgm]);
  const toggleVoice = () => {
    if (!voiceOn) { userOff.current = false; active.current = true; startBgm(); speak(i); setVoiceOn(true); } else { userOff.current = true; active.current = false; stopBgm(); setVoiceOn(false); }
  };

  /* 휴대폰 브라우저는 첫 터치 전에는 소리를 막는다 → 화면을 처음 만지는 순간 나레이션을 자동으로 시작 */
  useEffect(() => {
    if (!canSpeak) return;
    const start = (e: Event) => {
      const el = e.target as HTMLElement | null;
      if (el && el.closest && el.closest("[data-voice-btn]")) return;
      if (active.current || userOff.current) return;
      active.current = true; startBgm(); speak(idxRef.current); setVoiceOn(true);
    };
    window.addEventListener("pointerdown", start, { once: true, capture: true });
    window.addEventListener("keydown", start, { once: true, capture: true });
    return () => { window.removeEventListener("pointerdown", start, { capture: true }); window.removeEventListener("keydown", start, { capture: true }); };
  }, [canSpeak, speak, startBgm]);

  /* 안드로이드 카카오톡 인앱브라우저는 음성 기능이 없다 → 외부 브라우저로 열기 안내 */
  useEffect(() => {
    const ua = navigator.userAgent || "";
    if (VOICE_SET.size === 0 || !/KAKAOTALK/i.test(ua)) return;
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
              <button type="button" onClick={() => { active.current = false; stopAll(); stopBgm(); onClose(); }} className="flex items-center gap-1 text-[12px] font-bold text-[var(--ir-gold-ink)]">
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
