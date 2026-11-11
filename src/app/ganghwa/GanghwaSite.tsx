"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence, animate, useInView } from "framer-motion";

/*
 * 강화 제1광산 임시 홈페이지 — 모바일 전용
 * 내용 출처: H&L Partners 투자 검토 자료(46장)와 2025년 기획서. 수치·수요·일정은 원자료 기재 가정이며 '가정' 표시를 붙였다.
 * 금융 구조(SPC·CB)는 이 사이트에 싣지 않고 검토 자료(/m3k8fz1)에서만 다룬다.
 * 원칙: 투명도 애니메이션 없이 위치·크기·마스크만 움직인다.
 */
const IMG = (f: string) => `/ganghwa/${f}.webp`;
const EASE = [0.16, 1, 0.3, 1] as const;
const NAV: [string, string][] = [["about", "광산 소개"], ["mineral", "광물"], ["location", "입지"], ["demand", "수요"], ["business", "사업 모델"], ["eco", "친환경 채굴"], ["roadmap", "로드맵"], ["contact", "문의"]];

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
  return <span ref={ref}>{v.toLocaleString("ko-KR", { minimumFractionDigits: d, maximumFractionDigits: d })}</span>;
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
function Asm({ t = "가정" }: { t?: string }) {
  return <span className="ml-1.5 inline-block border px-1 py-px align-middle text-[9.5px] font-bold leading-[1.3]" style={{ borderColor: "var(--gw-copper)", color: "var(--gw-copper)" }}>{t}</span>;
}
function Head({ no, en, children, sub, dark, wm }: { no: string; en: string; children: ReactNode; sub?: ReactNode; dark?: boolean; wm?: string }) {
  return (
    <div className="relative mb-6">
      {wm && <span className={`gw-wm ${dark ? "dark" : ""}`} aria-hidden="true">{wm}</span>}
      <div className="gw-en relative flex items-center gap-2 text-[11px] font-bold" style={{ color: dark ? "var(--gw-copper2)" : "var(--gw-copper)" }}><span>{no}</span><span className="h-px w-7" style={{ background: "currentColor" }} /><span>{en}</span></div>
      <h2 className="relative mt-2.5 text-[26px] font-bold leading-[1.35] tracking-tight" style={{ color: dark ? "#fff" : "var(--gw-ink)" }}><Lift>{children}</Lift></h2>
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
  const pts: [number, number, string, string][] = [[118, 86, "강화 제1광산", "Ganghwa Mine"], [70, 168, "인천국제공항", "Incheon Int'l Airport"], [236, 196, "송도 11공구 · 대학 캠퍼스", "Songdo Zone 11"], [176, 250, "인천만 조력발전 예정지", "Tidal Power Site"]];
  return (
    <svg ref={ref} viewBox="0 0 320 290" className="w-full" role="img" aria-label="강화 제1광산과 인천국제공항, 송도 11공구, 인천만 조력발전 예정지의 위치 관계 도식">
      <path d="M40,40 C80,18 150,24 176,54 C196,78 186,112 160,126 C128,142 82,136 58,112 C34,90 22,60 40,40Z" fill="#e4edf6" stroke="#a9c2dc" />
      <path d="M210,60 C250,48 300,70 312,120 C320,170 300,240 262,270 L226,282 C214,240 222,200 206,160 C196,128 196,84 210,60Z" fill="#edf2f7" stroke="#c0cfdf" />
      <path d="M40,150 C62,140 100,150 104,172 C104,190 70,196 48,186 C34,178 30,160 40,150Z" fill="#e4edf6" stroke="#a9c2dc" />
      <text x="96" y="52" fontSize="9" fill="#7a8794">강화도</text><text x="262" y="110" fontSize="9" fill="#7a8794">인천</text>
      <motion.circle cx="118" cy="86" r="128" fill="none" stroke="#1260b8" strokeWidth="1" strokeDasharray="4 5" initial={{ pathLength: 0 }} animate={{ pathLength: seen ? 1 : 0 }} transition={{ duration: 2, delay: 0.2 }} />
      <text x="212" y="24" fontSize="9" fill="#1260b8">15km Radius</text>
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

const HERO = [
  { img: "hero", pos: "50% 55%", alt: "조력발전 방조제 참고 이미지 (AI)", cap: "조력발전 방조제 참고 이미지 · AI", en: "Infrastructure Materials", t: ["수도권에서 가장 가까운", "장석 광산,", "강화 제1광산"], d: "장석 생산에서 골재, 인프라 소재까지. 조력발전·송도 매립 수요와 연계하는 사업 구상입니다." },
  { img: "site", pos: "50% 60%", alt: "강화군 화도면 온수리 일대 전경", cap: "강화군 온수리 일대 전경", en: "Ganghwa · Incheon", t: ["인천 강화,", "온수리에서", "시작합니다"], d: "2013년 광업권이 설정된 강화 제1광산. 인천국제공항과 송도가 가까운 자리입니다." },
  { img: "tunnel", pos: "50% 50%", alt: "터널식 채굴 갱구 참고 이미지", cap: "터널식 채굴 참고 이미지", en: "Eco Tunnel Mining", t: ["땅 위는 그대로,", "채굴은", "터널 안에서"], d: "노천 채굴 대신 갱도·터널식 채굴로 경관과 산림 훼손을 줄이는 방식을 구상합니다." },
];
const MINERALS = [
  { k: "장석", en: "FELDSPAR", img: "feldspar", pos: "50% 50%", cap: "장석 표본", t: "안정적 기반 사업", d: "A/B/C급 장석 및 폐장석 생산, 세라믹 및 유리 원료 공급.", n: <>연 매출 73.2억 원, 순이익률 33.3% 예상<Asm /></>, tag: "실적 증빙 미확인" },
  { k: "골재", en: "AGGREGATE", img: "aggregate", pos: "50% 50%", cap: "골재 규격별 표본", t: "인프라 자재 사업", d: "건축용, 매립용, 기반시설용 골재(KS규격 준수 목표). 방조제 및 송도 인프라 공급 참여를 검토합니다.", n: <>일반 골재 매출 150억 원 예상<Asm /></>, tag: "공급계약 미확인" },
  { k: "엑시톤", en: "ADVANCED MATERIAL", img: "feldspar", pos: "30% 40%", cap: "참고 이미지", t: "첨단 소재 구상", d: "원자료는 엑시톤 중성자 수치 200 이상 함유를 주장합니다. 탄소포집, 바이오, 의료 활용은 검증 전 사업 가정입니다.", n: <>성분·성능 시험성적서 확인 필요<Asm t="검증 필요" /></>, tag: "용어·단위·측정근거 미확인" },
];
const PHASES = [
  { k: "Phase 1", en: "Raw Material", t: "원물 생산", l: ["A/B/C급 장석 및 폐장석 생산", "세라믹 및 유리 원료 공급 (안정적 캐시카우)"] },
  { k: "Phase 2", en: "Infrastructure Materials", t: "인프라 자재", l: ["건축용, 매립용, 기반시설용 골재(KS규격 준수)", "방조제 및 송도 인프라 직공급"] },
  { k: "Phase 3", en: "Advanced Materials", t: "첨단 소재", l: ["엑시톤 고부가 분말 가공", "탄소포집, 에너지 효율 향상, 의료/바이오 특수 용도 적용 (검증 필요)"] },
];
const ESG = [
  { k: "E", n: "Environment", l: ["친환경 저탄소 채굴 공법 도입", "조력발전 및 재생에너지 인프라 핵심 소재 기여", "물류 탄소 발자국 최소화"] },
  { k: "S", n: "Social", l: ["지역사회 양질의 일자리 창출", "산업 안전망 및 무재해 작업장 구축 목표", "주민 상생 및 인프라 개선 기여"] },
  { k: "G", n: "Governance", l: ["투명한 자금 집행", "감사를 통한 리스크 통제 체계", "주주 및 투자자 가치 제고"] },
];

export default function GanghwaSite() {
  const [active, setActive] = useState("about");
  const [ph, setPh] = useState(0);
  const [esg, setEsg] = useState(0);
  const [top, setTop] = useState(false);
  const [hs, setHs] = useState(0);
  useEffect(() => { const id = setTimeout(() => setHs((h) => (h + 1) % 3), 6000); return () => clearTimeout(id); }, [hs]);
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
        <div className="px-4 py-1.5 text-center text-[11px]" style={{ background: "var(--gw-deep)", color: "#aebac6" }}>사업 준비 단계의 임시 홈페이지 · 수치와 일정은 확정 전 가정입니다</div>

        {/* 상단 바 */}
        <header className="sticky top-0 z-40 border-b" style={{ background: "rgba(255,255,255,.96)", borderColor: "var(--gw-line)", backdropFilter: "blur(10px)" }}>
          <div className="flex h-[52px] items-center justify-between px-4">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-left leading-none">
              <span className="gw-en block text-[9px] font-bold" style={{ color: "var(--gw-copper)" }}>Ganghwa Mine No.1</span>
              <span className="mt-1 block text-[17px] font-black tracking-tight">강화 제1광산</span>
            </button>
            <button onClick={() => go("contact")} className="px-3.5 py-1.5 text-[12.5px] font-bold text-white" style={{ background: "var(--gw-copper)" }}>사업 문의</button>
          </div>
          <nav className="gw-noscroll flex gap-4 overflow-x-auto px-4 text-[12px]">
            {NAV.map(([id, l]) => (
              <button key={id} onClick={() => go(id)} className="relative shrink-0 pb-2.5 pt-0.5 font-bold" style={{ color: active === id ? "var(--gw-ink)" : "#9aa3ad" }}>
                {l}{active === id && <motion.span layoutId="gw-nav" className="absolute inset-x-0 bottom-0 h-[2px]" style={{ background: "var(--gw-copper)" }} transition={{ duration: 0.35, ease: EASE }} />}
              </button>
            ))}
          </nav>
        </header>

        {/* 첫 화면 — 번호 탭으로 넘기는 3장 (삼표식) */}
        <section className="relative h-[80dvh] min-h-[580px] overflow-hidden" style={{ background: "var(--gw-deep)" }}>
          <AnimatePresence initial={false}>
            <motion.div key={hs} className="absolute inset-0" initial={{ clipPath: "inset(0 0 0 100%)" }} animate={{ clipPath: "inset(0 0 0 0%)" }} exit={{ clipPath: "inset(0 0 0 0%)", zIndex: -1 }} transition={{ duration: 0.9, ease: EASE }}>
              <motion.img src={IMG(HERO[hs].img)} alt={HERO[hs].alt} className="h-full w-full object-cover" style={{ objectPosition: HERO[hs].pos }} initial={{ scale: 1.14 }} animate={{ scale: 1 }} transition={{ duration: 7, ease: "easeOut" }} />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(12,35,64,.45) 0%, rgba(12,35,64,.1) 30%, rgba(12,35,64,.78) 66%, #0c2340 100%)" }} />
          <span className="absolute right-3 top-3 bg-white/85 px-1.5 py-0.5 text-[10px]" style={{ color: "var(--gw-ink)" }}>{HERO[hs].cap}</span>
          <div className="absolute inset-x-0 bottom-[58px] px-6 pb-6 text-white">
            <div className="gw-en text-[11px] font-semibold" style={{ color: "var(--gw-copper2)" }}>{HERO[hs].en}</div>
            <h1 key={hs} className="mt-3 text-[31px] font-bold leading-[1.3] tracking-tight">
              {HERO[hs].t.map((x, i) => <span key={x} className="block overflow-hidden"><motion.span className="block" initial={{ y: "108%" }} animate={{ y: "0%" }} transition={{ duration: 0.9, delay: 0.15 + i * 0.13, ease: EASE }} style={{ color: i === HERO[hs].t.length - 1 ? "var(--gw-copper2)" : undefined }}>{x}</motion.span></span>)}
            </h1>
            <motion.p key={`p${hs}`} className="mt-3 text-[14px] leading-[1.75] text-white/80" initial={{ y: 20 }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.5, ease: EASE }}>{HERO[hs].d}</motion.p>
          </div>
          <div className="absolute inset-x-0 bottom-0 grid grid-cols-3">
            {HERO.map((x, i) => (
              <button key={x.img} onClick={() => setHs(i)} className="relative h-[58px] text-[13px] font-bold" style={{ background: hs === i ? "#fff" : "rgba(8,26,48,.86)", color: hs === i ? "var(--gw-copper)" : "#fff" }} aria-label={`${i + 1}번째 화면`}>
                0{i + 1}
                {hs === i && <motion.span key={`b${hs}`} className="absolute inset-x-0 top-0 h-[3px] origin-left" style={{ background: "var(--gw-copper)" }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 6, ease: "linear" }} />}
              </button>
            ))}
          </div>
        </section>

        {/* 숫자 타일 (시벨코식) */}
        <section className="grid grid-cols-2">
          {[["총 매장량 (원자료)", 1.78, 2, "억 톤", "#cfe2f6", "var(--gw-ink)"], ["광업권 설정", 2013, 0, "년", "#0c2340", "#fff"], ["인천공항 반경", 15, 0, "km", "#1260b8", "#fff"], ["골재 수요 (가정)", 1370, 0, "만㎥", "#e9eff6", "var(--gw-ink)"]].map(([l, v, d, u, bg, fg], i) => (
            <div key={l as string} className="flex h-[132px] flex-col justify-center px-6" style={{ background: bg as string, color: fg as string }}>
              <div className="text-[34px] font-black leading-none">{i === 1 ? "2013" : <Roll to={v as number} d={d as number} />}<span className="ml-1 text-[14px] font-bold">{u}</span></div>
              <div className="mt-2 text-[12px] font-bold" style={{ opacity: 1 }}>{l}</div>
            </div>
          ))}
        </section>

        {/* 01 광산 소개 */}
        <section id="about" className="px-6 pt-16 pb-14">
          <Head no="01" wm="MINE" en="The Mine" sub="강화 제1광산은 인천 강화군 화도면 온수리 일대에 위치한 장석 광산입니다. 2013년 광업권이 설정되었고, 친환경 터널식 채굴 방식의 개발을 구상하고 있습니다.">강화 제1광산 개요</Head>
          <Photo src={IMG("site")} alt="강화군 화도면 온수리 일대 전경" className="h-[200px]" pos="50% 60%" cap="강화군 온수리 일대 전경" />
          <dl className="mt-5 border-t" style={{ borderColor: "var(--gw-line)" }}>
            {[["자산명", "강화 제1광산"], ["법적 권리", "광업권 등록번호 79560호, 79562호 (2013년 4월 설정)"], ["위치", "인천광역시 강화군 화도면 온수리 일대"], ["개발권자", "진수웅 기술사 (한자엔지니어링)"], ["광종", "장석 (이오라이트 및 엑시톤 함유 — 원자료 기재)"], ["총 매장량", "178,185,150톤 (65,994,500㎥)"]].map(([k, v], i) => (
              <motion.div key={k} className="grid grid-cols-[84px_1fr] gap-3 border-b py-3 text-[13.5px] leading-[1.6]" style={{ borderColor: "var(--gw-line)" }} initial={{ x: -18 }} whileInView={{ x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}>
                <dt className="font-bold" style={{ color: "var(--gw-copper)" }}>{k}</dt><dd>{v}</dd>
              </motion.div>
            ))}
          </dl>
          <p className="mt-3 text-[11px] leading-[1.6]" style={{ color: "var(--gw-sub)" }}>권리 사항과 매장량은 원자료 기재 내용입니다. 현재 권리자·존속 여부·매장량 산정 근거는 등록원부와 보고서로 확인이 필요합니다.</p>
        </section>

        {/* 02 광물 */}
        <section id="mineral" className="px-6 pt-14 pb-14" style={{ background: "var(--gw-paper)" }}>
          <Head no="02" wm="MINERALS" en="Minerals" sub="하나의 광산에서 세 가지 사업을 구상합니다.">장석, 골재,<br />그리고 첨단 소재</Head>
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
          <p className="mt-2 text-[11px]" style={{ color: "var(--gw-sub)" }}>옆으로 넘겨 보세요 →</p>
          <Rise className="mt-6">
            <div className="text-[13px] font-bold" style={{ color: "var(--gw-copper)" }}>성분 구성 (원자료 기재)</div>
            <div className="mt-3 grid gap-3">
              <Bar l="SiO₂ — 세라믹, 유리 원료" v={71.95} max={72} txt="71.95%" c="var(--gw-ink)" />
              <Bar l="Al₂O₃ — 내화재, 세라믹" v={14.99} max={72} txt="14.99%" c="var(--gw-sea)" />
              <Bar l="Na₂O — 유리, 세라믹 융제" v={6.1} max={72} txt="6.10%" />
              <Bar l="K₂O — 유리, 도자기" v={3.25} max={72} txt="3.25%" c="var(--gw-copper2)" />
            </div>
            <p className="mt-3 text-[11px] leading-[1.6]" style={{ color: "var(--gw-sub)" }}>성분비는 공인 시험기관 성적서로 확인이 필요합니다.</p>
          </Rise>
        </section>

        {/* 03 입지 */}
        <section id="location" className="px-6 pt-16 pb-14">
          <Head no="03" wm="LOCATION" en="Location & Logistics" sub="인천국제공항, 송도 11공구, 인천만 조력발전 예정지가 가까운 거리에 있습니다. 해상 운송으로 수요처에 직접 공급하는 방안을 검토합니다.">수도권에 가장 가까운<br />대규모 광산</Head>
          <div className="border bg-white p-2" style={{ borderColor: "var(--gw-line)" }}><MapArt /><p className="px-2 pb-1 text-[10px]" style={{ color: "var(--gw-sub)" }}>위치 관계 도식 · 실제 축척과 다름</p></div>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <Rise><div className="h-full p-4 text-white" style={{ background: "var(--gw-ink)" }}><div className="gw-en text-[9.5px] font-bold" style={{ color: "var(--gw-copper2)" }}>Main · 해상 운송</div><div className="mt-1.5 text-[15px] font-bold leading-[1.45]">2,000톤급 바지선 활용</div><p className="mt-1.5 text-[12px] leading-[1.6] text-white/70">강화 → 송도/조력발전 해상 직공급</p></div></Rise>
            <Rise delay={0.1}><div className="h-full border bg-white p-4" style={{ borderColor: "var(--gw-line)" }}><div className="gw-en text-[9.5px] font-bold" style={{ color: "var(--gw-copper)" }}>Sub · 육상 운송</div><div className="mt-1.5 text-[15px] font-bold leading-[1.45]">강화대교 및 인천대로</div><p className="mt-1.5 text-[12px] leading-[1.6]" style={{ color: "var(--gw-sub)" }}>보조 경로로 활용</p></div></Rise>
          </div>
          <p className="mt-3 text-[11px] leading-[1.6]" style={{ color: "var(--gw-sub)" }}>운송 계획안입니다. 바지선·장비 계약과 실제 물류비는 확인 전입니다.</p>
        </section>

        {/* 04 수요 */}
        <section id="demand" className="px-6 pt-14 pb-14" style={{ background: "var(--gw-deep)" }}>
          <Head no="04" wm="DEMAND" en="Demand" dark sub="인천만 조력발전 방조제와 송도 매립, 대학 캠퍼스 확장에 필요한 골재 수요를 가정한 검토치입니다. 확정 수주가 아닙니다.">방조제와 매립이<br />만드는 골재 수요</Head>
          <Rise>
            <div className="text-white">
              <div className="text-[12px] font-bold text-white/60">2025~2030년 골재 수요<span className="ml-1.5 border px-1 py-px text-[9.5px]" style={{ borderColor: "var(--gw-copper2)", color: "var(--gw-copper2)" }}>가정</span></div>
              <div className="mt-1.5 text-[46px] font-bold leading-none" style={{ color: "var(--gw-copper2)" }}><span className="text-[22px] text-white">총 </span><Roll to={1370} /><span className="ml-1 text-[17px] text-white">만㎥ 이상</span></div>
            </div>
          </Rise>
          <div className="mt-6 grid gap-4 text-white">
            {[["송도 11공구 매립 (~2030년)", 650, "약 650만㎥", "#8fc4f5"], ["인천만 조력발전 방조제", 500, "약 500만㎥", "#6fa9c4"], ["인천대·연세대·인하대 캠퍼스 확장", 220, "약 220만㎥", "#8b98a6"]].map(([l, v, t, c]) => (
              <Rise key={l as string}>
                <div className="flex items-baseline justify-between text-[13px]"><span className="font-bold">{l}</span><span className="font-bold" style={{ color: "var(--gw-copper2)" }}>{t}</span></div>
                <div className="mt-1.5 h-[10px] overflow-hidden" style={{ background: "rgba(255,255,255,.1)" }}><motion.div className="h-full origin-left" style={{ background: c as string, width: `${((v as number) / 650) * 100}%` }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: EASE }} /></div>
              </Rise>
            ))}
          </div>
          <Rise className="mt-7">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-4" style={{ background: "rgba(255,255,255,.07)" }}><div className="text-[11px] text-white/60">방조제 총 연장 (원자료)</div><div className="mt-1 text-[28px] font-bold leading-none text-white"><Roll to={18.3} d={1} /><span className="ml-0.5 text-[13px]" style={{ color: "var(--gw-copper2)" }}>km</span></div><div className="mt-1.5 text-[10.5px] leading-[1.5] text-white/60">동측 5.8 + 서측 7.3 + 남측 5.2km</div></div>
              <div className="p-4" style={{ background: "rgba(255,255,255,.07)" }}><div className="text-[11px] text-white/60">공급 단가 비교 (가정)</div><div className="mt-1 text-[15px] font-bold leading-[1.5] text-white">35,000원/㎥<span className="block text-[11.5px] font-normal text-white/60">수입산 40,000원/㎥ 대비</span></div></div>
            </div>
          </Rise>
          <p className="mt-4 text-[11px] leading-[1.6]" style={{ color: "#8fa0b0" }}>인천만 조력발전은 계획·검토 단계의 사업으로 추진 여부와 일정은 정부 정책에 따릅니다. 수요량·단가·수입 제한 여부는 최신 공식자료와 계약으로 확인이 필요합니다.</p>
        </section>

        {/* 05 사업 모델 */}
        <section id="business" className="px-6 pt-16 pb-14">
          <Head no="05" wm="BUSINESS" en="Business Model" sub="원물 생산에서 인프라 자재, 첨단 소재로 넓혀 가는 단계별 구상입니다.">밸류체인 확장</Head>
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
              <p className="mt-1.5 text-[14px] font-bold leading-[1.65]">채굴 장비, 선별 시설, 운송 수단은 전문업체 지입 및 수수료(렌탈) 방식으로 도입해 초기 자본 부담을 줄이는 방안<Asm t="계획안" /></p>
            </div>
          </Rise>
        </section>

        {/* 06 친환경 채굴 */}
        <section id="eco" className="pt-14 pb-14" style={{ background: "var(--gw-paper)" }}>
          <div className="px-6"><Head no="06" wm="ECO" en="Eco Mining & ESG" sub="노천 채굴이 아닌 갱도·터널식 채굴로 경관과 산림 훼손을 줄이는 것을 목표로 합니다.">땅 위를 지키는<br />터널식 채굴 구상</Head></div>
          <Photo src={IMG("tunnel")} alt="터널식 채굴 갱구 참고 이미지" className="h-[240px]" cap="터널식 채굴 참고 이미지" />
          <div className="px-6">
            <div className="mt-5 grid gap-2.5">
              {[["표토층 보존", "지표를 유지하고 지하로 채굴하는 방식 (달성 여부 미검증)"], ["소음·분진 저감", "밀폐형 시스템 도입 구상 (성능 미검증)"], ["자연 배수구조 활용", "지형을 따르는 배수 계획"], ["해안 규제", "해안 50m 관련 규제 적합성 검토 필요"]].map(([a, b], i) => (
                <motion.div key={a} className="flex gap-3 border bg-white p-3.5" style={{ borderColor: "var(--gw-line)" }} initial={{ x: i % 2 ? 30 : -30 }} whileInView={{ x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}>
                  <span className="gw-en w-6 shrink-0 text-[13px] font-bold" style={{ color: "var(--gw-copper)" }}>0{i + 1}</span>
                  <div><div className="text-[14.5px] font-bold">{a}</div><div className="mt-0.5 text-[12.5px] leading-[1.6]" style={{ color: "var(--gw-sub)" }}>{b}</div></div>
                </motion.div>
              ))}
            </div>
            <div className="mt-7 text-[13px] font-bold" style={{ color: "var(--gw-copper)" }}>ESG 경영 추진안 — 눌러서 펼쳐 보세요</div>
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
            <p className="mt-3 text-[11px] leading-[1.6]" style={{ color: "var(--gw-sub)" }}>환경관리와 ESG는 추진 계획입니다. 인허가, 환경영향평가, 인증 취득을 의미하지 않습니다.</p>
          </div>
        </section>

        {/* 07 로드맵 */}
        <section id="roadmap" className="px-6 pt-16 pb-14">
          <Head no="07" wm="VISION" en="Vision & Roadmap" sub="시기와 성과가 확정되지 않은 단계별 추진 구상입니다. 기술 검증, 계약, 인허가가 먼저 이루어져야 합니다.">비전 및 로드맵</Head>
          <div className="relative pl-8">
            <motion.div className="absolute bottom-2 left-[7px] top-2 w-px origin-top" style={{ background: "var(--gw-copper)" }} initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease: EASE }} />
            {[["Horizon 1 · 단기", "Mining Operation", "장석 안정적 생산 및 초기 인프라(터널) 구축. 수도권 핵심 골재 공급망 편입."], ["Horizon 2 · 중기", "Infrastructure Partner", "인천만 조력발전 및 송도 매립 프로젝트 핵심 벤더 도약. 채굴 후 지하 갱도를 활용한 부가가치 창출(친환경 저장고, 안전 대피소, 연구시설)."], ["Horizon 3 · 장기", "Advanced Material Platform", "엑시톤 기반 탄소포집 및 의료/바이오 소재 양산. 국가 에너지 인프라 소재 생태계의 중심축."]].map(([k, e, d], i) => (
              <Rise key={k} delay={i * 0.1} className="relative mb-7">
                <motion.span className="absolute -left-8 top-1 h-[15px] w-[15px] rounded-full border-2" style={{ borderColor: "var(--gw-copper)", background: i === 2 ? "var(--gw-copper)" : "var(--gw-stone)" }} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }} />
                <div className="gw-en text-[11px] font-bold" style={{ color: "var(--gw-copper)" }}>{k}</div>
                <div className="mt-0.5 text-[18px] font-bold">{e}</div>
                <p className="mt-1 text-[13.5px] leading-[1.7]" style={{ color: "var(--gw-sub)" }}>{d}</p>
              </Rise>
            ))}
          </div>
          <Rise><p className="mt-2 border-l-2 py-1 pl-4 text-[16px] font-bold leading-[1.6]" style={{ borderColor: "var(--gw-copper)" }}>자원의 본질을 혁신하여,<br />지속 가능한 인프라의 미래를 짓습니다.</p></Rise>
        </section>

        {/* 08 문의 */}
        <section id="contact" className="px-6 pt-14 pb-14" style={{ background: "var(--gw-deep)" }}>
          <Head no="08" wm="CONTACT" en="Contact" dark sub="사업 제휴와 투자 검토 문의를 받습니다.">문의</Head>
          <dl className="grid gap-px text-[13.5px]" style={{ background: "rgba(255,255,255,.12)" }}>
            {[["기획·자문", "(주)에이치앤엘 파트너스 · H&L Partners"], ["담당", "이봉수"], ["이메일", "ybssby@naver.com"], ["웹사이트", "www.handl.top"], ["소재지", "인천광역시 강화군 화도면 온수리 일대"]].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[84px_1fr] gap-3 px-4 py-3 text-white" style={{ background: "var(--gw-deep)" }}><dt className="font-bold" style={{ color: "var(--gw-copper2)" }}>{k}</dt><dd className="leading-[1.6]">{v}</dd></div>
            ))}
          </dl>
          <a href="mailto:ybssby@naver.com?subject=%EA%B0%95%ED%99%94%20%EC%A0%9C1%EA%B4%91%EC%82%B0%20%EC%82%AC%EC%97%85%20%EB%AC%B8%EC%9D%98" className="mt-5 block py-3.5 text-center text-[15px] font-bold" style={{ background: "var(--gw-copper)", color: "#fff" }}>이메일로 문의하기</a>
          <a href="/m3k8fz1" className="mt-2.5 flex items-center justify-between border px-5 py-4 text-white" style={{ borderColor: "rgba(143,196,245,.5)" }}>
            <span><span className="gw-en block text-[10px] font-bold" style={{ color: "var(--gw-copper2)" }}>Investment Memorandum</span><span className="mt-0.5 block text-[15px] font-bold">투자 검토 자료 보기</span><span className="block text-[11.5px] text-white/60">45장 · 옆으로 넘겨 보는 문서 (수치와 금융 구조는 가정)</span></span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8fc4f5" strokeWidth="2" aria-hidden="true"><path d="M5 12h14 M13 6l6 6-6 6" /></svg>
          </a>
        </section>

        <footer className="px-6 pt-8 pb-12" style={{ background: "#081a30", color: "#8fa0b0" }}>
          <div className="text-[18px] font-black text-white">강화 제1광산</div>
          <p className="mt-3 text-[11.5px] leading-[1.75]">사업 준비 단계에서 내용을 소개하는 임시 홈페이지입니다. 매장량, 매출, 수요, 단가, 일정은 기획 자료에 적힌 가정이며 실측·실적·계약으로 확인된 수치가 아닙니다. 첫 화면과 방조제 사진은 AI로 만든 참고 이미지이고, 터널 사진은 채굴 방식의 이해를 돕기 위한 참고 이미지입니다. 이 페이지는 투자 권유나 원금·수익 보장을 위한 자료가 아닙니다.</p>
          <p className="gw-en mt-5 text-[10px]">© 2026 Ganghwa Mine No.1</p>
        </footer>

        <AnimatePresence>
          {top && (
            <motion.button key="t" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="맨 위로" className="fixed bottom-5 right-4 z-40 flex h-11 w-11 items-center justify-center text-white shadow-lg" style={{ background: "var(--gw-ink)" }} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8fc4f5" strokeWidth="2.2" aria-hidden="true"><path d="M12 19V5 M6 11l6-6 6 6" /></svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
