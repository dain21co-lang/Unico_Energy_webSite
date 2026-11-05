"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, animate, useInView, AnimatePresence } from "framer-motion";

/* 원칙: 투명도는 움직이지 않는다 (갤럭시 빈 화면 방지) — 위치·크기·마스크·모양만 움직인다 */
const IMG = (f: string) => `/jeongseon/img/${f}.webp`;
const EASE = [0.16, 1, 0.3, 1] as const;

function Rise({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ y: 28 }} whileInView={{ y: 0 }} viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

/* 글자가 아래에서 마스크를 뚫고 올라오는 제목 */
/* 가려진 요소는 화면 진입 감지가 안 되므로, 감지는 바깥 상자에서 하고 안쪽만 움직인다 */
function Lift({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true });
  return (
    <span ref={ref} className={`block overflow-hidden ${className ?? ""}`}>
      <motion.span className="block" initial={{ y: "105%" }} animate={{ y: seen ? "0%" : "105%" }}
        transition={{ duration: 0.9, delay, ease: EASE }}>
        {children}
      </motion.span>
    </span>
  );
}

/* 사진: 마스크가 열리며 살짝 당겨지는 등장 */
function Photo({ src, alt, className, from = "bottom", tag }: { src: string; alt: string; className?: string; from?: "bottom" | "left" | "right"; tag?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-30px" });
  const start = from === "left" ? "inset(0% 100% 0% 0% round 14px)" : from === "right" ? "inset(0% 0% 0% 100% round 14px)" : "inset(100% 0% 0% 0% round 14px)";
  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      <motion.div className="absolute inset-0 overflow-hidden" initial={{ clipPath: start }} animate={{ clipPath: seen ? "inset(0% 0% 0% 0% round 14px)" : start }} transition={{ duration: 1.1, ease: EASE }}>
        <motion.img src={src} alt={alt} className="h-full w-full object-cover" initial={{ scale: 1.18 }} animate={{ scale: seen ? 1 : 1.18 }} transition={{ duration: 1.6, ease: EASE }} />
        {tag && <span className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: "rgba(11,23,20,.78)", color: "var(--js-gold)" }}>{tag}</span>}
      </motion.div>
    </div>
  );
}

function Count({ to, decimals = 0, prefix = "", suffix = "" }: { to: number; decimals?: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.6, ease: EASE, onUpdate: (x) => setV(x) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{prefix}{v.toFixed(decimals)}{suffix}</span>;
}

function Head({ no, en, children, sub }: { no: string; en: string; children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="mb-7">
      <Rise>
        <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em]" style={{ color: "var(--js-gold)" }}>
          <span>{no}</span>
          <motion.span className="h-px w-10 origin-left" style={{ background: "var(--js-gold)" }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.2, ease: EASE }} />
          <span>{en}</span>
        </div>
      </Rise>
      <h2 className="js-serif text-[26px] font-bold leading-[1.32]"><Lift>{children}</Lift></h2>
      {sub && <Rise delay={0.15}><p className="mt-3 text-[14px] leading-[1.75]" style={{ color: "var(--js-sub)" }}>{sub}</p></Rise>}
    </div>
  );
}

function Icon({ d, size = 22 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
  );
}
const I = {
  key: "M14.5 9.5a4.5 4.5 0 1 1-1.3-3.2 M14.5 9.5L21 16v3h-3v-2h-2v-2h-2l-1.5-1.5 M8 9.5h.01",
  room: "M3 20V9l9-6 9 6v11 M8 20v-6h8v6 M12 9.5h.01",
  bolt: "M13 2L4 14h7l-1 8 9-12h-7z",
  chart: "M3 20h18 M6 16l4-5 3 3 5-7 M18 7h-3 M18 7v3",
  pin: "M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  road: "M8 3L5 21 M16 3l3 18 M12 5v2 M12 11v2 M12 17v2",
  wave: "M2 12c2.5-3 5-3 7.5 0s5 3 7.5 0 3.5-2 5-1 M2 17c2.5-3 5-3 7.5 0s5 3 7.5 0 3.5-2 5-1",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3 2",
  up: "M12 19V5 M5 12l7-7 7 7",
};

/* 물결 모핑 */
const WAVES = [
  "M0 40 C 60 18, 120 58, 200 36 S 330 14, 400 38 L400 80 L0 80 Z",
  "M0 34 C 70 56, 140 14, 210 40 S 340 60, 400 30 L400 80 L0 80 Z",
  "M0 44 C 50 26, 130 30, 190 46 S 320 24, 400 42 L400 80 L0 80 Z",
];

const NAV = [["concept", "컨셉"], ["location", "입지"], ["building", "건물"], ["ai", "AI 시스템"], ["journey", "고객 여정"], ["numbers", "수익"], ["invest", "투자비"], ["roadmap", "일정"], ["pre", "추진 전제"]] as const;

const SPOTS = [
  { img: "high1", name: "하이원 리조트", d: "스키·골프·카지노 복합 리조트" },
  { img: "skywalk", name: "병방치 스카이워크", d: "동강 한반도 지형 위 유리 전망대" },
  { img: "hwaam", name: "화암동굴", d: "금광 갱도와 석회 동굴을 잇는 테마 동굴" },
  { img: "mindung", name: "민둥산", d: "가을 억새로 이름난 정선의 명산" },
  { img: "dorongi", name: "도롱이 연못", d: "숲에 둘러싸인 고요한 생태 연못" },
  { img: "donggang", name: "동강 전망 자연휴양림", d: "동강 굽이를 내려다보는 숲속 휴양림" },
];

const SYSTEMS = [
  { n: "01", icon: I.key, t: "무인 프런트 · 모바일키", items: ["키오스크·모바일 셀프 체크인/아웃", "예약 확정 시 객실 모바일키 자동 발송", "야간·새벽 도착 고객 원격 응대"] },
  { n: "02", icon: I.room, t: "IoT 스마트룸", items: ["조명·냉난방·커튼 자동 제어", "도착 시간에 맞춘 객실 예열·예냉", "설비 이상 발생 시 자동 알림"] },
  { n: "03", icon: I.bolt, t: "에너지 · 안전 통합관제", items: ["공실 자동 절전 · 사용량 실시간 관리", "CCTV·출입 기록 원격 관제", "화재·누수 센서 경보 연동"] },
  { n: "04", icon: I.chart, t: "수요예측 요금 · 채널관리", items: ["주말·성수기·지역 행사 수요 예측", "객실 요금 자동 조정 (다이내믹 프라이싱)", "OTA·자사 홈페이지 객실 통합 관리"] },
];

const JOURNEY = [
  ["예약", "AI 요금이 수요에 맞춰 바뀌고, OTA와 홈페이지가 자동으로 연동됩니다."],
  ["도착", "모바일키가 먼저 도착합니다. 프런트에서 기다리지 않고 바로 입실합니다."],
  ["객실", "도착 전에 예열·예냉이 끝나 있고, 조명과 온도는 휴대폰으로 조절합니다."],
  ["체류", "AI 컨시어지가 날씨와 요일에 맞춰 하이원·래프팅·5일장 일정을 추천합니다."],
  ["퇴실", "정산은 자동으로 끝나고, 청소 인력에게 객실이 자동 배정됩니다."],
];

const PL = [
  { k: "총매출", a: 6.25, b: 7.5, d: "+20%" },
  { k: "운영비", a: 3.0, b: 2.72, d: "−9%" },
  { k: "EBITDA", a: 3.25, b: 4.78, d: "+47%" },
  { k: "세후 순이익", a: 2.28, b: 3.1, d: "+36%" },
];

const INVEST = [
  { k: "IoT 스마트룸", d: "31실 도어락·조명·냉난방 제어", lo: 0.9, hi: 1.2 },
  { k: "무인 프런트", d: "키오스크 · 모바일키 · 셀프 체크인", lo: 0.3, hi: 0.4 },
  { k: "에너지·안전 관제", d: "공실 절전 · CCTV · 출입 · 화재/누수 센서", lo: 0.3, hi: 0.4 },
  { k: "클라우드 PMS·RMS", d: "운영 시스템 · 요금 자동화 · OTA 연동", lo: 0.2, hi: 0.3 },
  { k: "네트워크 · 설치", d: "전 층 Wi-Fi 6 · 배선 · 시공", lo: 0.2, hi: 0.3 },
  { k: "브랜딩 · 예약 홈페이지", d: "자사 예약 사이트 · AI 컨시어지 챗봇", lo: 0.2, hi: 0.3 },
];

const PHASES = [
  { p: "Phase 0", t: "2026.11 ~ 12", h: "선결 과제", items: ["관광숙박업 지위승계·등록", "소유·담보 관계 정리", "리모델링 실사·견적"] },
  { p: "Phase 1", t: "2027.01 ~ 03", h: "리모델링 · 인프라", items: ["객실·부대시설 보완 공사", "Wi-Fi 6 · 객실 IoT 설치", "클라우드 PMS 구축"] },
  { p: "Phase 2", t: "2027.04 ~ 05", h: "시범 운영 · 개장", items: ["무인 프런트·모바일키 가동", "OTA 연동 · 직원 교육", "그랜드 오픈"] },
  { p: "Phase 3", t: "2027 하반기 ~", h: "고도화", items: ["요금 AI 데이터 축적", "관광 연계 패키지 확대", "관광호텔 등급 심사 신청"] },
];

export default function JeongseonSite() {
  const [sys, setSys] = useState(0);
  const [ai, setAi] = useState(true);
  const [phase, setPhase] = useState(2);
  const [floor, setFloor] = useState<number | null>(null);
  const [after, setAfter] = useState(true);
  const [showTop, setShowTop] = useState(false);
  const [wave, setWave] = useState(0);
  const spotRef = useRef<HTMLDivElement>(null);
  const [spotIdx, setSpotIdx] = useState(0);
  const plRef = useRef<HTMLDivElement>(null);
  const plSeen = useInView(plRef, { once: true, margin: "-60px" });

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    const t = setInterval(() => setWave((w) => (w + 1) % WAVES.length), 3200);
    return () => { window.removeEventListener("scroll", onScroll); clearInterval(t); };
  }, []);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 52, behavior: "smooth" });
  };

  const onSpotScroll = () => {
    const el = spotRef.current;
    if (!el) return;
    const w = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 12 : 1;
    setSpotIdx(Math.min(SPOTS.length - 1, Math.round(el.scrollLeft / w)));
  };

  const max = 8;
  const FLOORS = [
    { f: "4F", u: "객실", c: "var(--js-river)" },
    { f: "3F", u: "객실", c: "var(--js-river)" },
    { f: "2F", u: "객실", c: "var(--js-river)" },
    { f: "1F", u: "객실", c: "var(--js-river)" },
    { f: "B1", u: "커피숍 · 한식당 · 양식당(연회장 겸용)", c: "var(--js-gold)" },
    { f: "B2", u: "노래방 · 주점 · 기계실", c: "#8b9a7c" },
  ];

  return (
    <div className="js">
      <div className="relative mx-auto w-full max-w-[480px]">
        {/* 상단 바 */}
        <header className="sticky top-0 z-40 border-b" style={{ background: "rgba(11,23,20,.92)", borderColor: "var(--js-line)", backdropFilter: "blur(10px)" }}>
          <div className="flex h-[52px] items-center justify-between px-4">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="js-serif text-[16px] font-bold tracking-tight">
              정선 관광호텔 <span className="ml-1 text-[11px] font-semibold" style={{ color: "var(--js-gold)" }}>AI SMART</span>
            </button>
            <span className="rounded-full border px-2 py-0.5 text-[10px]" style={{ borderColor: "var(--js-line)", color: "var(--js-sub)" }}>투자 검토용</span>
          </div>
          <nav className="js-noscroll flex gap-1.5 overflow-x-auto px-4 pb-2">
            {NAV.map(([id, l]) => (
              <button key={id} onClick={() => go(id)} className="shrink-0 rounded-full border px-3 py-1 text-[12px]" style={{ borderColor: "var(--js-line)", color: "var(--js-mist)" }}>{l}</button>
            ))}
          </nav>
        </header>

        {/* 히어로 */}
        <section className="relative h-[88dvh] min-h-[560px] overflow-hidden">
          <img src={IMG("after1")} alt="정선 관광호텔 리모델링 후 예시 (AI 이미지)" className="js-kb absolute inset-0 h-full w-full object-cover" style={{ objectPosition: "50% 30%" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(11,23,20,.25) 0%, rgba(11,23,20,.05) 30%, rgba(11,23,20,.82) 72%, #0b1714 100%)" }} />
          <span className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: "rgba(11,23,20,.7)", color: "var(--js-gold)" }}>리모델링 후 예시 · AI 이미지</span>
          <div className="absolute inset-x-0 bottom-0 px-5 pb-16">
            <Lift className="text-[12px] font-semibold tracking-[0.2em]" delay={0.1}><span style={{ color: "var(--js-gold)" }}>강원도 정선군 정선읍 용탄리</span></Lift>
            <h1 className="js-serif mt-3 text-[36px] font-black leading-[1.22]">
              <Lift delay={0.25}>조양강 150m,</Lift>
              <Lift delay={0.4}>31실의</Lift>
              <Lift delay={0.55}>AI 스마트호텔</Lift>
            </h1>
            <Rise delay={0.8}><p className="mt-4 text-[15px] leading-[1.7]" style={{ color: "#d5e1db" }}>사람은 환대에, AI는 나머지에.<br />정선 여행의 하룻밤을 가장 가볍게 만드는 호텔을 준비합니다.</p></Rise>
            <div className="mt-6 grid grid-cols-3 gap-2">
              {[["31", "실", "객실 수"], ["150", "m", "조양강까지"], ["2027.5", "", "개장 목표(안)"]].map(([n, u, l], i) => (
                <motion.div key={l} className="rounded-xl border px-2 py-3 text-center" style={{ borderColor: "rgba(210,176,111,.45)", background: "rgba(11,23,20,.55)" }}
                  initial={{ y: 30 }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.9 + i * 0.12, ease: EASE }}>
                  <div className="js-serif text-[22px] font-bold" style={{ color: "var(--js-gold)" }}>{n}<span className="text-[13px]">{u}</span></div>
                  <div className="mt-0.5 text-[11px]" style={{ color: "var(--js-sub)" }}>{l}</div>
                </motion.div>
              ))}
            </div>
          </div>
          <svg className="absolute inset-x-0 bottom-0 h-[44px] w-full" viewBox="0 0 400 80" preserveAspectRatio="none" aria-hidden="true">
            <motion.path d={WAVES[0]} animate={{ d: WAVES[wave] }} transition={{ duration: 3, ease: "easeInOut" }} fill="#0b1714" />
          </svg>
        </section>

        {/* 흐르는 띠 */}
        <div className="overflow-hidden border-y py-2.5" style={{ borderColor: "var(--js-line)", background: "var(--js-deep)" }}>
          <div className="js-flow flex whitespace-nowrap text-[13px] font-semibold" style={{ color: "var(--js-river)" }}>
            {[0, 1].map((k) => (
              <span key={k} className="pr-6">무인 프런트 · 모바일키 · IoT 스마트룸 · 에너지 자동제어 · 수요예측 요금 · 정선 관광 연계 · 조양강 수변 ·&nbsp;</span>
            ))}
          </div>
        </div>

        {/* 01 컨셉 */}
        <section id="concept" className="px-5 pt-16 pb-12">
          <Head no="01" en="CONCEPT" sub="영업을 시작하기 전인 31실 관광호텔을, 리모델링과 함께 처음부터 AI 기반 무인·스마트 운영 구조로 엽니다. 적은 인력으로 수익을 지키는 호텔입니다.">
            처음부터 AI로 여는<br />정선의 첫 스마트호텔
          </Head>
          <div className="grid grid-cols-3 gap-2">
            {[
              { v: <>약 2~3<span className="text-[12px]">억</span></>, l: "AI 시스템 투자", c: "견적 전 추정" },
              { v: <>+<Count to={1.53} decimals={2} /><span className="text-[12px]">억</span></>, l: "연간 EBITDA 개선", c: "3.25 → 4.78억" },
              { v: <>약 <Count to={1.6} decimals={1} /><span className="text-[12px]">년</span></>, l: "투자 회수", c: "2.5억 ÷ 1.53억" },
            ].map((s, i) => (
              <Rise key={i} delay={i * 0.1}>
                <div className="h-full rounded-2xl border p-3 text-center" style={{ borderColor: "var(--js-line)", background: "var(--js-card)" }}>
                  <div className="js-serif text-[20px] font-bold" style={{ color: i === 0 ? "var(--js-gold)" : "var(--js-mist)" }}>{s.v}</div>
                  <div className="mt-1 text-[11.5px] font-semibold">{s.l}</div>
                  <div className="mt-0.5 text-[10.5px]" style={{ color: "var(--js-sub)" }}>{s.c}</div>
                </div>
              </Rise>
            ))}
          </div>
          <div className="mt-6 space-y-3">
            {[
              ["소형 · 신규 개장", "31실 규모라 전 객실에 한 번에 설치하기 쉽고, 개장 전이라 기존 운영 방식을 바꾸는 부담이 없습니다."],
              ["상시 인력 부담", "읍 단위 지역이라 야간·주말 인력을 구하기 어렵습니다. 무인·원격 운영이 현실적인 답입니다."],
              ["비대면 자유여행 수요", "하이원·래프팅을 즐기고 늦게 도착하는 손님도 모바일키로 기다림 없이 입실합니다."],
            ].map(([h, d], i) => (
              <Rise key={h} delay={i * 0.08}>
                <div className="flex gap-3 rounded-2xl border p-4" style={{ borderColor: "var(--js-line)" }}>
                  <div className="js-serif text-[22px] font-bold leading-none" style={{ color: "var(--js-gold)" }}>{i + 1}</div>
                  <div>
                    <div className="text-[15px] font-bold">{h}</div>
                    <p className="mt-1 text-[13.5px] leading-[1.7]" style={{ color: "var(--js-sub)" }}>{d}</p>
                  </div>
                </div>
              </Rise>
            ))}
          </div>
        </section>

        {/* 02 입지 */}
        <section id="location" className="pt-12 pb-12" style={{ background: "var(--js-deep)" }}>
          <div className="px-5">
            <Head no="02" en="LOCATION" sub="평창과 정선을 잇는 국도 42호선, 정선읍 초입 광하대교 옆. 조양강 상류까지 걸어서 2분 거리입니다.">
              정선 여행이<br />시작되는 길목
            </Head>
            <Photo src={IMG("map")} alt="사업지 위치도 — 정선읍 용탄리 525" className="h-[220px]" />
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[[I.wave, "조양강", "약 150m"], [I.road, "국도 42호선", "광하대교 옆"], [I.clock, "서울에서", "약 1시간 30분"]].map(([ic, a, b], i) => (
                <Rise key={a} delay={i * 0.08}>
                  <div className="rounded-xl border p-3 text-center" style={{ borderColor: "var(--js-line)", background: "var(--js-card)" }}>
                    <div className="flex justify-center" style={{ color: "var(--js-river)" }}><Icon d={ic} /></div>
                    <div className="mt-1.5 text-[11px]" style={{ color: "var(--js-sub)" }}>{a}</div>
                    <div className="text-[13px] font-bold">{b}</div>
                  </div>
                </Rise>
              ))}
            </div>
            <Rise><div className="mt-9 mb-3 flex items-end justify-between">
              <div className="js-serif text-[18px] font-bold">가까운 정선 명소</div>
              <div className="text-[12px]" style={{ color: "var(--js-sub)" }}><span style={{ color: "var(--js-gold)" }}>{spotIdx + 1}</span> / {SPOTS.length}</div>
            </div></Rise>
          </div>
          <div ref={spotRef} onScroll={onSpotScroll} className="js-noscroll flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2">
            {SPOTS.map((s, i) => (
              <motion.div key={s.name} className="w-[78%] shrink-0 snap-center overflow-hidden rounded-2xl border" style={{ borderColor: "var(--js-line)", background: "var(--js-card)" }}
                initial={{ x: 60 }} whileInView={{ x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: Math.min(i, 2) * 0.1, ease: EASE }}>
                <div className="h-[170px] overflow-hidden"><img src={IMG(s.img)} alt={s.name} className="h-full w-full object-cover" loading="lazy" /></div>
                <div className="p-3.5">
                  <div className="flex items-center gap-1.5 text-[15px] font-bold"><span style={{ color: "var(--js-gold)" }}><Icon d={I.pin} size={16} /></span>{s.name}</div>
                  <div className="mt-1 text-[12.5px]" style={{ color: "var(--js-sub)" }}>{s.d}</div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-3 flex justify-center gap-1.5">
            {SPOTS.map((_, i) => (
              <motion.span key={i} className="h-1.5 rounded-full" animate={{ width: i === spotIdx ? 18 : 6, backgroundColor: i === spotIdx ? "#d2b06f" : "#24423a" }} transition={{ duration: 0.3 }} />
            ))}
          </div>
          <p className="mt-4 px-5 text-[11.5px]" style={{ color: "var(--js-sub)" }}>정선 5일장, 동강 래프팅, 가리왕산 자연휴양림도 차로 가깝습니다.</p>
        </section>

        {/* 03 건물 */}
        <section id="building" className="px-5 pt-16 pb-12">
          <Head no="03" en="THE BUILDING" sub="2015년 사용승인을 받은 철근콘크리트 건물입니다. 아직 영업을 시작하지 않아, 리모델링과 AI 설비를 한 번에 넣기 좋습니다.">
            지하 2층 · 지상 4층<br />객실 31실
          </Head>
          {/* 리모델링 후 예시 ↔ 현재 모습: 마스크가 옆으로 쓸려 가며 바뀐다 */}
          <Rise>
            <div className="mb-2 flex rounded-full border p-1" style={{ borderColor: "var(--js-line)" }}>
              {[true, false].map((v) => (
                <button key={String(v)} onClick={() => setAfter(v)} className="relative flex-1 rounded-full py-2 text-[13px] font-bold">
                  {after === v && <motion.span layoutId="js-ba" className="absolute inset-0 rounded-full" style={{ background: v ? "var(--js-gold)" : "#3b5a4f" }} transition={{ duration: 0.4, ease: EASE }} />}
                  <span className="relative z-10" style={{ color: after === v ? (v ? "#0b1714" : "#e8efe9") : "var(--js-sub)" }}>{v ? "리모델링 후 (예시)" : "현재 모습"}</span>
                </button>
              ))}
            </div>
          </Rise>
          <div className="relative h-[460px] overflow-hidden rounded-[14px]">
            <img src={IMG("ext1")} alt="건물 외부 — 현재 모습" className="absolute inset-0 h-full w-full object-cover" />
            <motion.div className="absolute inset-0" initial={false} animate={{ clipPath: after ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 0% 100%)" }} transition={{ duration: 0.9, ease: EASE }}>
              <motion.img src={IMG("after1")} alt="리모델링 후 예시 (AI 이미지)" className="h-full w-full object-cover" style={{ objectPosition: "50% 45%" }} animate={{ scale: after ? 1 : 1.12 }} transition={{ duration: 1.2, ease: EASE }} />
            </motion.div>
            <span className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: "rgba(11,23,20,.78)", color: "var(--js-gold)" }}>{after ? "리모델링 후 예시 · AI 이미지" : "현재 모습 · 리모델링 전"}</span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Photo src={IMG("ext2")} alt="건물 외부 측면" className="h-[150px]" from="left" />
            <Photo src={IMG("ext3")} alt="건물 출입구" className="h-[150px]" from="right" />
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <Photo src={IMG("int1")} alt="내부 로비 계단" className="h-[120px]" />
            <Photo src={IMG("int2")} alt="객실 욕실" className="h-[120px]" />
            <Photo src={IMG("int3")} alt="객실 내부" className="h-[120px]" />
          </div>
          <p className="mt-2 text-[11px]" style={{ color: "var(--js-sub)" }}>&lsquo;리모델링 후&rsquo; 사진은 AI로 만든 예시입니다. 나머지는 기존 사업계획서에 실린 현재 모습이며, 리모델링 범위는 현장 실사 후 정합니다.</p>

          <Rise><div className="js-serif mt-9 mb-3 text-[18px] font-bold">층별 구성 <span className="text-[12px] font-normal" style={{ color: "var(--js-sub)" }}>· 층을 눌러 보세요</span></div></Rise>
          <div className="space-y-1.5">
            {FLOORS.map((f, i) => (
              <motion.button key={f.f} onClick={() => setFloor(floor === i ? null : i)} className="relative flex w-full items-center overflow-hidden rounded-lg border text-left"
                style={{ borderColor: floor === i ? f.c : "var(--js-line)", background: "var(--js-card)" }}
                initial={{ x: i % 2 ? 40 : -40 }} whileInView={{ x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}>
                <motion.span className="absolute inset-y-0 left-0 w-full origin-left" style={{ background: f.c }} animate={{ scaleX: floor === i ? 1 : 0.02 }} transition={{ duration: 0.5, ease: EASE }} />
                <span className="relative z-10 w-12 shrink-0 py-2.5 text-center text-[13px] font-bold" style={{ color: floor === i ? "#0b1714" : f.c }}>{f.f}</span>
                <span className="relative z-10 py-2.5 pr-3 text-[13px]" style={{ color: floor === i ? "#0b1714" : "var(--js-mist)", fontWeight: floor === i ? 700 : 400 }}>{f.u}</span>
              </motion.button>
            ))}
            <div className="flex h-2 items-center"><div className="h-[3px] w-full rounded" style={{ background: "#3b5a4f" }} /></div>
          </div>

          <div className="mt-7 overflow-hidden rounded-2xl border" style={{ borderColor: "var(--js-line)" }}>
            {[["소재지", "정선읍 용탄리 525 외 1필지"], ["대지면적", "950㎡ (287평)"], ["건축 / 연면적", "187.14㎡ / 1,266㎡"], ["구조", "철근콘크리트 라멘조"], ["객실", "31실 (실당 17.28㎡ 동일)"], ["부대시설", "지하 1·2층 각 267.69㎡"], ["주차", "계획 10대 (법정 7대)"], ["사용승인", "2015.07.22"]].map(([a, b], i) => (
              <div key={a} className="flex items-center justify-between px-4 py-2.5 text-[13px]" style={{ background: i % 2 ? "transparent" : "var(--js-card)" }}>
                <span style={{ color: "var(--js-sub)" }}>{a}</span><span className="font-semibold">{b}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 04 AI 시스템 */}
        <section id="ai" className="pt-14 pb-12" style={{ background: "var(--js-deep)" }}>
          <div className="px-5">
            <Head no="04" en="AI SYSTEMS" sub="네 가지 시스템의 데이터를 클라우드 호텔 운영 시스템(PMS) 하나로 모읍니다. 현장에 사람이 늘 없어도 본사에서 원격으로 관리합니다.">
              호텔을 움직이는<br />네 개의 AI
            </Head>
            {/* 허브 다이어그램 */}
            <div className="relative mx-auto mb-6 aspect-square w-full max-w-[320px]">
              <svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full" aria-hidden="true">
                {[[60, 60], [240, 60], [60, 240], [240, 240]].map(([x, y], i) => (
                  <motion.line key={i} x1={150} y1={150} x2={x} y2={y} stroke={sys === i ? "#d2b06f" : "#2d5248"} strokeWidth={sys === i ? 2.5 : 1.5} strokeDasharray="4 5"
                    initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 + i * 0.12 }} />
                ))}
                <motion.circle cx={150} cy={150} r={46} fill="#0b1714" stroke="#5fb3b0" strokeWidth={2} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: EASE }} style={{ transformOrigin: "150px 150px" }} />
                <motion.circle cx={150} cy={150} r={58} fill="none" stroke="#5fb3b0" strokeWidth={1} animate={{ r: [52, 66, 52] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }} />
                <text x={150} y={146} textAnchor="middle" fill="#e8efe9" fontSize="15" fontWeight="700">클라우드</text>
                <text x={150} y={166} textAnchor="middle" fill="#5fb3b0" fontSize="13" fontWeight="700">PMS</text>
              </svg>
              {SYSTEMS.map((s, i) => {
                const pos = [["left-0 top-0"], ["right-0 top-0"], ["left-0 bottom-0"], ["right-0 bottom-0"]][i][0];
                return (
                  <motion.button key={s.n} onClick={() => setSys(i)} className={`absolute ${pos} flex h-[38%] w-[38%] flex-col items-center justify-center rounded-2xl border text-center`}
                    style={{ borderColor: sys === i ? "var(--js-gold)" : "var(--js-line)", background: sys === i ? "#1e3a32" : "var(--js-card)", color: sys === i ? "var(--js-gold)" : "var(--js-mist)" }}
                    initial={{ scale: 0.6 }} whileInView={{ scale: 1 }} viewport={{ once: true }} whileTap={{ scale: 0.94 }} transition={{ duration: 0.6, delay: 0.1 * i, ease: EASE }}>
                    <Icon d={s.icon} size={24} />
                    <span className="mt-1.5 px-1 text-[11.5px] font-bold leading-tight">{s.t.split(" · ")[0]}</span>
                  </motion.button>
                );
              })}
            </div>
            <div className="relative min-h-[178px] overflow-hidden rounded-2xl border p-5" style={{ borderColor: "var(--js-gold)", background: "var(--js-card)" }}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={sys} initial={{ x: 50, clipPath: "inset(0% 0% 0% 100%)" }} animate={{ x: 0, clipPath: "inset(0% 0% 0% 0%)" }} exit={{ x: -50, clipPath: "inset(0% 100% 0% 0%)" }} transition={{ duration: 0.45, ease: EASE }}>
                  <div className="flex items-center gap-2.5">
                    <span className="js-serif flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold" style={{ background: "var(--js-gold)", color: "#0b1714" }}>{SYSTEMS[sys].n}</span>
                    <span className="text-[17px] font-bold">{SYSTEMS[sys].t}</span>
                  </div>
                  <ul className="mt-3.5 space-y-2">
                    {SYSTEMS[sys].items.map((it) => (
                      <li key={it} className="flex gap-2 text-[14px] leading-[1.6]"><span style={{ color: "var(--js-river)" }}>—</span>{it}</li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-3 flex justify-center gap-2">
              {SYSTEMS.map((s, i) => (
                <button key={s.n} onClick={() => setSys(i)} className="rounded-full border px-3 py-1 text-[12px] font-semibold" style={{ borderColor: sys === i ? "var(--js-gold)" : "var(--js-line)", color: sys === i ? "var(--js-gold)" : "var(--js-sub)" }}>{s.n}</button>
              ))}
            </div>

            {/* 벤치마크 */}
            <Rise><div className="mt-10 rounded-2xl border p-4" style={{ borderColor: "var(--js-line)" }}>
              <div className="text-[11px] font-semibold tracking-[0.18em]" style={{ color: "var(--js-gold)" }}>BENCHMARK</div>
              <div className="js-serif mt-1 text-[16px] font-bold">유성온천 관광특구 호텔의 AI 전환 모델을 31실 규모에 맞췄습니다</div>
              <div className="mt-3 grid grid-cols-[72px_1fr_1fr] gap-x-2 gap-y-2 text-[12px]">
                <span />
                <span className="font-semibold" style={{ color: "var(--js-sub)" }}>유성 (대전)</span>
                <span className="font-semibold" style={{ color: "var(--js-gold)" }}>정선 (적용안)</span>
                {[["규모", "75실 · 컨벤션 · 온천", "31실 · 부대시설 임대"], ["AI 투자", "20~27억", "약 2~3억"], ["구축", "약 6개월", "4~5개월 (리모델링 병행)"], ["운영 목표", "인건비 50~70%↓", "운영비 9%↓"], ["수요 목표", "가동률 75%+", "가동률 70% · 단가 25%↑"]].map(([a, b, c]) => (
                  <div key={a} className="contents">
                    <span style={{ color: "var(--js-sub)" }}>{a}</span><span>{b}</span><span className="font-semibold">{c}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px]" style={{ color: "var(--js-sub)" }}>유성 수치는 해당 호텔 사업계획서(2026)의 목표치입니다. 정선은 원래 인력이 적은 계획이라 절감 폭을 작게 잡았습니다.</p>
            </div></Rise>
          </div>
        </section>

        {/* 05 고객 여정 */}
        <section id="journey" className="px-5 pt-16 pb-12">
          <Head no="05" en="GUEST JOURNEY" sub="예약부터 퇴실까지, 손님이 기다리는 순간을 AI가 대신 맡습니다.">
            기다림 없는<br />하룻밤
          </Head>
          <div className="relative pl-9">
            <motion.div className="absolute left-[13px] top-1 bottom-1 w-[2px] origin-top" style={{ background: "linear-gradient(var(--js-gold), var(--js-river))" }}
              initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 1.8, ease: EASE }} />
            {JOURNEY.map(([h, d], i) => (
              <Rise key={h} delay={0.15 + i * 0.12} className="relative mb-5 last:mb-0">
                <motion.span className="absolute -left-9 top-0 flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold" style={{ background: "var(--js-gold)", color: "#0b1714" }}
                  initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.25 + i * 0.12, ease: EASE }}>{i + 1}</motion.span>
                <div className="text-[16px] font-bold">{h}</div>
                <p className="mt-1 text-[13.5px] leading-[1.7]" style={{ color: "var(--js-sub)" }}>{d}</p>
              </Rise>
            ))}
          </div>
          <Rise><div className="mt-8 rounded-2xl p-4" style={{ background: "var(--js-card)" }}>
            <div className="text-[13px] font-bold" style={{ color: "var(--js-gold)" }}>AI 컨시어지 추천 코스</div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {["하이원 리조트", "동강 래프팅", "병방치 스카이워크", "정선 5일장", "화암동굴", "민둥산"].map((t) => (
                <span key={t} className="rounded-full border px-2.5 py-1 text-[12px]" style={{ borderColor: "var(--js-line)" }}>{t}</span>
              ))}
            </div>
            <p className="mt-3 text-[12.5px] leading-[1.7]" style={{ color: "var(--js-sub)" }}>조양강 수변 입지를 살려 워케이션·가족·소규모 연수 패키지를 만들고, 제휴 할인으로 머무는 날을 늘립니다.</p>
          </div></Rise>
        </section>

        {/* 06 수익 */}
        <section id="numbers" className="pt-14 pb-12" style={{ background: "var(--js-deep)" }}>
          <div className="px-5">
            <Head no="06" en="NUMBERS" sub="객실 가동률은 70%로 그대로 두고, 평균 단가를 6.0만 원에서 7.5만 원으로 올리며 운영비를 줄이는 계획입니다. (연간, 목표치)">
              같은 가동률,<br />더 큰 이익
            </Head>
            <div className="mb-5 flex rounded-full border p-1" style={{ borderColor: "var(--js-line)" }}>
              {[false, true].map((v) => (
                <button key={String(v)} onClick={() => setAi(v)} className="relative flex-1 rounded-full py-2 text-[13px] font-bold">
                  {ai === v && <motion.span layoutId="js-tab" className="absolute inset-0 rounded-full" style={{ background: v ? "var(--js-gold)" : "#3b5a4f" }} transition={{ duration: 0.4, ease: EASE }} />}
                  <span className="relative z-10" style={{ color: ai === v ? (v ? "#0b1714" : "#e8efe9") : "var(--js-sub)" }}>{v ? "AI 전환 후 (목표)" : "기존 계획"}</span>
                </button>
              ))}
            </div>
            <div className="space-y-4" ref={plRef}>
              {PL.map((r) => {
                const val = ai ? r.b : r.a;
                return (
                  <div key={r.k}>
                    <div className="mb-1.5 flex items-baseline justify-between">
                      <span className="text-[13.5px] font-semibold">{r.k}</span>
                      <span className="flex items-baseline gap-2">
                        <span className="js-serif text-[20px] font-bold" style={{ color: ai ? "var(--js-gold)" : "var(--js-mist)" }}>{val.toFixed(2)}<span className="text-[12px]">억</span></span>
                        <motion.span className="inline-block w-11 text-right text-[12px] font-bold" style={{ color: "#7fc8a0" }} animate={{ x: ai ? 0 : 8, scale: ai ? 1 : 0 }} transition={{ duration: 0.35 }}>{r.d}</motion.span>
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full" style={{ background: "#0b1714" }}>
                      <motion.div className="h-full w-full origin-left rounded-full" style={{ background: ai ? "linear-gradient(90deg,#a98a4f,#d2b06f)" : "#4d6e63" }}
                        initial={{ scaleX: 0 }} animate={{ scaleX: plSeen ? val / max : 0 }} transition={{ duration: 0.9, ease: EASE }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-2 text-[12px]">
              {[["객실 평균 단가", "6.0 → 7.5만 원"], ["객실 가동률", "70% 유지"], ["객실 매출", "4.69 → 5.94억"], ["부대시설 임대", "1.56억 (변동 없음)"], ["AI 설비 감가상각", "연 0.5억 (5년)"], ["이자비용", "0.4억 (기존 가정)"]].map(([a, b]) => (
                <div key={a} className="rounded-xl border px-3 py-2.5" style={{ borderColor: "var(--js-line)" }}>
                  <div style={{ color: "var(--js-sub)" }}>{a}</div><div className="mt-0.5 font-bold">{b}</div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-[1.6]" style={{ color: "var(--js-sub)" }}>운영비는 월 2,500만 원에서 2,270만 원으로 (인건비·공과금·판촉비 절감, 시스템 운영비 150만 원 추가). 법인세 20% 반영. 모든 수치는 업체 견적 전 추정·목표치입니다.</p>
          </div>
        </section>

        {/* 07 투자비 */}
        <section id="invest" className="px-5 pt-16 pb-12">
          <Head no="07" en="INVESTMENT" sub="동급 소형 숙박시설의 스마트화 사례를 참고한 추정치입니다. 계획은 중간값 2.5억 원으로 잡았습니다.">
            AI 설비 투자<br />약 2.1 ~ 2.9억 원
          </Head>
          <div className="space-y-3.5">
            {INVEST.map((v, i) => (
              <Rise key={v.k} delay={i * 0.05}>
                <div className="flex items-baseline justify-between">
                  <span className="text-[14px] font-bold">{v.k}</span>
                  <span className="text-[13px] font-semibold" style={{ color: "var(--js-gold)" }}>{v.lo.toFixed(1)} ~ {v.hi.toFixed(1)}억</span>
                </div>
                <div className="mt-0.5 text-[11.5px]" style={{ color: "var(--js-sub)" }}>{v.d}</div>
                <div className="relative mt-1.5 h-2 rounded-full" style={{ background: "var(--js-card)" }}>
                  <motion.div className="absolute inset-y-0 left-0 origin-left rounded-full" style={{ width: `${(v.hi / 1.2) * 100}%`, background: "rgba(210,176,111,.35)" }}
                    initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.1 + i * 0.06, ease: EASE }} />
                  <motion.div className="absolute inset-y-0 left-0 origin-left rounded-full" style={{ width: `${(v.lo / 1.2) * 100}%`, background: "var(--js-gold)" }}
                    initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 + i * 0.06, ease: EASE }} />
                </div>
              </Rise>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2">
            <Rise><div className="h-full rounded-2xl border p-4 text-center" style={{ borderColor: "var(--js-gold)", background: "var(--js-card)" }}>
              <div className="text-[11.5px]" style={{ color: "var(--js-sub)" }}>계획 기준 금액</div>
              <div className="js-serif mt-1 text-[26px] font-bold" style={{ color: "var(--js-gold)" }}>약 <Count to={2.5} decimals={1} />억</div>
              <div className="mt-1 text-[11px]" style={{ color: "var(--js-sub)" }}>5년 감가상각 · 연 0.5억</div>
            </div></Rise>
            <Rise delay={0.1}><div className="h-full rounded-2xl border p-4" style={{ borderColor: "rgba(228,139,120,.6)" }}>
              <div className="text-[12.5px] font-bold" style={{ color: "var(--js-red)" }}>별도 확인</div>
              <p className="mt-1.5 text-[12px] leading-[1.6]" style={{ color: "var(--js-sub)" }}>리모델링·부대시설 보완비는 위 금액에 들어 있지 않습니다. 현장 실사와 견적 후 정합니다.</p>
            </div></Rise>
          </div>
        </section>

        {/* 08 로드맵 */}
        <section id="roadmap" className="pt-14 pb-12" style={{ background: "var(--js-deep)" }}>
          <div className="px-5">
            <Head no="08" en="ROADMAP" sub="일정은 관광숙박업 등록 시점과 리모델링 범위에 따라 조정됩니다.">
              2027년 5월<br />그랜드 오픈 (안)
            </Head>
            <div className="relative mb-4 grid grid-cols-4 gap-1.5">
              <div className="absolute left-[12.5%] right-[12.5%] top-[15px] h-[2px]" style={{ background: "var(--js-line)" }} />
              <motion.div className="absolute left-[12.5%] top-[15px] h-[2px] origin-left" style={{ width: "75%", background: "var(--js-gold)" }} animate={{ scaleX: phase / 3 }} transition={{ duration: 0.6, ease: EASE }} />
              {PHASES.map((p, i) => (
                <button key={p.p} onClick={() => setPhase(i)} className="relative z-10 flex flex-col items-center">
                  <motion.span className="flex h-8 w-8 items-center justify-center rounded-full border-2 text-[12px] font-bold"
                    animate={{ scale: phase === i ? 1.15 : 1, backgroundColor: i <= phase ? "#d2b06f" : "#10221d", borderColor: i <= phase ? "#d2b06f" : "#24423a", color: i <= phase ? "#0b1714" : "#9fb5ad" }} transition={{ duration: 0.35 }}>{i}</motion.span>
                  <span className="mt-1.5 text-[10.5px]" style={{ color: phase === i ? "var(--js-gold)" : "var(--js-sub)" }}>{p.t}</span>
                </button>
              ))}
            </div>
            <div className="relative min-h-[170px] overflow-hidden rounded-2xl border p-5" style={{ borderColor: "var(--js-line)", background: "var(--js-card)" }}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={phase} initial={{ y: 40, clipPath: "inset(100% 0% 0% 0%)" }} animate={{ y: 0, clipPath: "inset(0% 0% 0% 0%)" }} exit={{ y: -30, clipPath: "inset(0% 0% 100% 0%)" }} transition={{ duration: 0.45, ease: EASE }}>
                  <div className="text-[12px] font-semibold tracking-[0.15em]" style={{ color: "var(--js-gold)" }}>{PHASES[phase].p.toUpperCase()} · {PHASES[phase].t}</div>
                  <div className="js-serif mt-1 text-[19px] font-bold">{PHASES[phase].h}</div>
                  <ul className="mt-3 space-y-1.5">
                    {PHASES[phase].items.map((it) => <li key={it} className="flex gap-2 text-[14px]"><span style={{ color: "var(--js-river)" }}>—</span>{it}</li>)}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* 09 추진 전제 */}
        <section id="pre" className="px-5 pt-16 pb-14">
          <Head no="09" en="PRECONDITIONS" sub="아래 네 가지가 정리되면 대출 실행, 리모델링, 개장으로 이어집니다.">
            추진 전제
          </Head>
          <div className="space-y-2.5">
            {[
              ["관광숙박업 지위승계·등록", "등록 완료를 대출 실행과 개장의 선결 조건으로 둡니다."],
              ["소유·담보 관계 정리", "사업 주체와의 매매·임대차·담보제공 관계를 계약서로 정리합니다."],
              ["사업 주체 요건 정비", "운영 법인의 정관 목적에 숙박업을 추가하거나 운영 법인을 지정합니다."],
              ["리모델링 실사·견적", "현장 실사와 견적으로 공사비를 확정해 사업비와 수익 계산에 반영합니다."],
            ].map(([h, d], i) => (
              <motion.div key={h} className="flex gap-3 rounded-2xl border p-4" style={{ borderColor: "var(--js-line)" }}
                initial={{ x: -36 }} whileInView={{ x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}>
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-[12px] font-bold" style={{ borderColor: "var(--js-gold)", color: "var(--js-gold)" }}>{i + 1}</span>
                <div>
                  <div className="text-[14.5px] font-bold">{h}</div>
                  <p className="mt-0.5 text-[13px] leading-[1.65]" style={{ color: "var(--js-sub)" }}>{d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 푸터 */}
        <footer className="border-t px-5 pt-10 pb-14" style={{ borderColor: "var(--js-line)", background: "#08110f" }}>
          <div className="js-serif text-[20px] font-bold">정선 관광호텔</div>
          <div className="mt-1 text-[12px]" style={{ color: "var(--js-gold)" }}>AI SMART HOTEL · JEONGSEON</div>
          <div className="mt-5 space-y-1.5 text-[13px]">
            <div className="flex gap-3"><span className="w-16 shrink-0" style={{ color: "var(--js-sub)" }}>사업 주체</span><span>(주)유토컴퍼니</span></div>
            <div className="flex gap-3"><span className="w-16 shrink-0" style={{ color: "var(--js-sub)" }}>투자 자문</span><a href="https://unicoenergygroup.com" className="underline underline-offset-4">유니코에너지그룹</a></div>
            <div className="flex gap-3"><span className="w-16 shrink-0" style={{ color: "var(--js-sub)" }}>소재지</span><span>강원도 정선군 정선읍 용탄리 525 외 1필지</span></div>
          </div>
          <p className="mt-6 text-[11px] leading-[1.7]" style={{ color: "#6f857d" }}>
            이 페이지는 투자·대출 검토를 위한 임시 사이트입니다. 수익·투자 수치는 사업계획서(2026.11 보완)의 추정·목표치이며, 업체 견적과 현장 실사에 따라 달라질 수 있습니다. &lsquo;리모델링 후 예시&rsquo; 이미지는 AI로 만든 것으로 실제 완공 모습과 다를 수 있습니다. 관광지·현재 건물 사진은 기존 사업계획서에 실린 자료입니다.
          </p>
        </footer>

        <AnimatePresence>
          {showTop && (
            <motion.button key="top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="맨 위로"
              className="fixed bottom-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border"
              style={{ right: "max(16px, calc(50vw - 240px + 16px))", background: "#10221d", borderColor: "var(--js-gold)", color: "var(--js-gold)" }}
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.3 }}>
              <Icon d={I.up} size={20} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
