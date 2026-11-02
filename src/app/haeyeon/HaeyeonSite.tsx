"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

const IMG = (f: string) => `/haeyeon/img/${f}`;

/* UNICO·솔루믹스와 같은 원칙: 투명도는 움직이지 않고 위치만 움직인다 (갤럭시 빈 화면 방지) */
function Rise({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ y: 26 }} whileInView={{ y: 0 }} viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

function Icon({ d, size = 20 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
const I = {
  arrow: "M5 12h14 M13 6l6 6-6 6",
  up: "M12 19V5 M5 12l7-7 7 7",
  chat: "M4 5h16v11H8l-4 4z M8 9h8 M8 12h5",
  pin: "M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  factory: "M3 21V10l6 4V10l6 4V6l6 3v12z M7 17h2 M12 17h2 M17 17h2",
  chip: "M8 8h8v8H8z M10 3v3 M14 3v3 M10 18v3 M14 18v3 M3 10h3 M3 14h3 M18 10h3 M18 14h3",
  users: "M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20 M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M20 20v-1.5a3.5 3.5 0 0 0-2.5-3.35 M15.5 4.15a3.5 3.5 0 0 1 0 6.7",
  scale: "M12 4v16 M5 8h14 M5 8l-3 6a3 3 0 0 0 6 0z M19 8l-3 6a3 3 0 0 0 6 0z",
  shield: "M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z M9 12l2 2 4-4",
  coin: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M9.5 9.5c0-1.1 1.1-2 2.5-2s2.5.9 2.5 2-1.1 1.6-2.5 2-2.5 1-2.5 2.1 1.1 1.9 2.5 1.9 2.5-.9 2.5-2 M12 6v1.5 M12 16.5V18",
  scan: "M4 8V5a1 1 0 0 1 1-1h3 M16 4h3a1 1 0 0 1 1 1v3 M20 16v3a1 1 0 0 1-1 1h-3 M8 20H5a1 1 0 0 1-1-1v-3 M4 12h16",
  brain: "M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3h1V4z M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3h-1V4z",
  blade: "M4 20L18 6a2.8 2.8 0 0 1 4 4L8 24 M14 10l4 4",
  down: "M6 9l6 6 6-6",
};

export default function HaeyeonSite({ en = false }: { en?: boolean }) {
  const L = (ko: ReactNode, eng: ReactNode) => (en ? eng : ko);
  const s = (ko: string, eng: string) => (en ? eng : ko);
  const [purpose, setPurpose] = useState(0);
  const [sent, setSent] = useState(false);

  const STATS = [
    [s("338억", "₩33.8B"), s("2025년 매출 (외부감사 기준)", "2025 revenue (audited)")],
    ["2020", s("설립 · 충북 제천 본사 공장", "Founded · Jecheon HQ plant")],
    ["HACCP", s("위생 공정 · 가공 허가 보유", "Hygiene process · licensed")],
    ["B2B", s("쿠팡 로켓배송 등 온라인 공급", "Online supply incl. Coupang")],
  ];
  const PROBLEMS = [
    { icon: I.users, t: s("숙련 인력이 사라집니다", "Skilled hands are disappearing"), d: s("발골·정형 숙련공은 고령화되고, 새로 배우려는 사람은 줄고 있습니다.", "Boning and trimming experts are aging, and few newcomers want to learn.") },
    { icon: I.scale, t: s("수율이 사람마다 다릅니다", "Yield varies by worker"), d: s("같은 원물도 작업자의 손에 따라 남는 고기의 양이 달라집니다.", "The same carcass yields different amounts depending on who cuts it.") },
    { icon: I.shield, t: s("위생 기준은 높아집니다", "Hygiene standards keep rising"), d: s("사람 손이 많이 닿을수록 관리해야 할 위험도 커집니다.", "The more hands touch the meat, the more risk there is to manage.") },
    { icon: I.coin, t: s("인건비는 오릅니다", "Labor costs keep climbing"), d: s("가공 단가 경쟁 속에서 인건비 부담이 수익을 깎습니다.", "In a price-driven market, labor costs eat into margins.") },
  ];
  const BUSINESS = [
    { img: "carcass.jpg", tag: s("운영중", "Operating"), t: s("축산물 가공", "Meat Processing"), d: s("우육·돈육·계육·압육을 1·2차 정밀 가공해 최상의 상태로 생산합니다.", "Primary and secondary processing of beef, pork, chicken and duck.") },
    { img: "rice.jpg", tag: s("운영중", "Operating"), t: s("농산물·쌀 유통", "Grain & Produce"), d: s("엄선한 쌀과 잡곡, 농산물을 가공·포장해 공급합니다.", "Carefully selected rice, grains and produce, processed and packed.") },
    { img: "meat.jpg", tag: s("운영중", "Operating"), t: s("B2B·온라인 공급", "B2B & Online Supply"), d: s("제조사 납품과 쿠팡 로켓배송 등 온라인 채널로 전국에 공급합니다.", "Supplying manufacturers and online channels such as Coupang nationwide.") },
    { img: "tof.jpg", tag: s("추진 계획", "In planning"), t: s("AI 스마트 육가공", "AI Smart Meat Processing"), d: s("3D 비전으로 원물을 읽고 로봇이 정밀하게 절단하는 스마트 공정을 준비합니다.", "Preparing a smart line where 3D vision reads each carcass and robots cut precisely."), plan: true },
  ];
  const STEPS = [
    s("원물 입고", "Intake"), s("검수·선별", "Inspection"), s("1차 가공", "Primary cut"), s("2차 정밀 가공", "Precision cut"), s("위생 포장", "Packing"), s("출고·배송", "Delivery"),
  ];
  const AI = [
    { n: "01", icon: I.scan, t: s("스캔", "Scan"), d: s("멀티모달 3D 비전과 X-ray로 원물의 뼈·근막·지방 구조를 읽습니다.", "Multimodal 3D vision and X-ray read bone, membrane and fat structure.") },
    { n: "02", icon: I.brain, t: s("판단", "Decide"), d: s("숙련공의 작업 데이터를 학습한 AI가 가장 손실이 적은 절단 경로를 계산합니다.", "AI trained on expert cuts calculates the lowest-loss cutting path.") },
    { n: "03", icon: I.blade, t: s("실행", "Execute"), d: s("다관절 로봇이 계산된 경로를 따라 정밀하게 발골·절단합니다.", "Multi-axis robots bone and cut precisely along that path.") },
  ];
  const PRODUCTS = [
    { img: "carcass.jpg", t: s("우육·돈육", "Beef & Pork"), d: s("부위별 정형 · 냉장/냉동", "Cut by part · chilled/frozen") },
    { img: "chicken.jpg", t: s("계육·압육", "Chicken & Duck"), d: s("가공 원료육 · 소시지 원료", "Processing meat · sausage material") },
    { img: "rice.jpg", t: s("쌀·잡곡", "Rice & Grains"), d: s("선별 · 소포장 유통", "Sorted · retail packs") },
    { img: "meat.jpg", t: s("식자재 공급", "Foodservice Supply"), d: s("급식·외식·제조사 납품", "Catering, restaurants, manufacturers") },
  ];
  const CHANNELS = ["Coupang", "SSG.COM", "E-mart", "NAVER", "Gmarket", "AUCTION", "11st", "Lotte ON", "Homeplus", "GS SHOP", "CJ OnStyle", "Hmall"];
  const PURPOSES = [s("납품·구매", "Purchasing"), s("OEM·공동개발", "OEM / Co-dev"), s("유통 제휴", "Distribution"), s("투자·IR", "Investor relations")];

  return (
    <div className="hy" id="top">
      {/* 상단 바 */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-md items-center justify-between px-5 py-2.5">
          <a href="#top" className="flex items-center"><img src={IMG("logo.png")} alt={s("해연에프엔지", "Haeyeon F&G")} className="h-9 w-auto" /></a>
          <div className="flex items-center rounded-full border border-[var(--hy-line)] p-0.5 text-[12.5px] font-bold" role="group" aria-label="Language">
            <a href="/haeyeon" className={`rounded-full px-3 py-1.5 ${en ? "text-[var(--hy-sub)]" : "bg-[var(--hy-forest)] text-white"}`}>한글</a>
            <a href="/haeyeon/en" className={`rounded-full px-3 py-1.5 ${en ? "bg-[var(--hy-forest)] text-white" : "text-[var(--hy-sub)]"}`}>EN</a>
          </div>
        </div>
      </header>

      {/* 빠른 메뉴 */}
      <nav aria-label="Quick menu" className="fixed right-3 z-40 flex flex-col gap-1.5" style={{ bottom: "calc(92px + env(safe-area-inset-bottom, 0px))" }}>
        {[[I.chat, "#contact", s("문의", "Contact")], [I.factory, "#production", s("생산", "Production")], [I.chip, "#foodtech", "AI"], [I.pin, "#location", s("오시는 길", "Location")]].map(([ic, href, label], i) => (
          <a key={label} href={href} aria-label={label}
            className={`flex h-11 w-11 items-center justify-center rounded-lg shadow-lg ${i === 0 ? "bg-[var(--hy-orange)] text-white" : "bg-white text-[var(--hy-ink)] ring-1 ring-black/5"}`}>
            <Icon d={ic} />
          </a>
        ))}
      </nav>
      <a href="#top" aria-label="Back to top" className="fixed right-3 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--hy-forest)] text-white shadow-xl" style={{ bottom: "calc(26px + env(safe-area-inset-bottom, 0px))" }}>
        <Icon d={I.up} />
      </a>

      {/* HERO */}
      <section className="relative h-[100svh] min-h-[640px] overflow-hidden bg-[var(--hy-night)]">
        <img src={IMG("carcass.jpg")} alt="" className="hy-kb absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--hy-night)]/55 via-[var(--hy-night)]/35 to-[var(--hy-night)]/95" />
        <div className="relative mx-auto flex h-full max-w-md flex-col justify-end px-5 pb-14 pt-24 text-white">
          <p className="hy-brand text-[11px] font-semibold tracking-[0.28em] text-[var(--hy-lime)]">HAEYEON F&amp;G · FOOD × TECHNOLOGY</p>
          <div className="mt-4 h-[3px] w-12 bg-[var(--hy-orange)]" />
          <h1 className="mt-5 text-[32px] font-black leading-[1.25] tracking-tight">
            {L(<>좋은 고기는 손끝에서,<br />더 좋은 고기는<br /><span className="text-[var(--hy-lime)]">데이터에서.</span></>,
               <>Great meat comes from skilled hands.<br /><span className="text-[var(--hy-lime)]">Better meat comes from data.</span></>)}
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-white/80">{s("충북 제천의 HACCP 가공 공장에서 축산물과 농산물을 가공·유통하는 해연에프엔지가, AI 스마트 육가공으로 다음 기준을 준비합니다.", "From its HACCP plant in Jecheon, Korea, Haeyeon F&G processes and distributes meat and produce, and is preparing the next standard with AI smart meat processing.")}</p>
          <div className="mt-7 flex flex-col gap-2.5">
            <a href="#business" className="flex items-center justify-between rounded-lg bg-[var(--hy-orange)] px-5 py-3.5 text-[14.5px] font-bold">{s("사업 영역 보기", "See our business")}<Icon d={I.arrow} size={18} /></a>
            <a href="#foodtech" className="flex items-center justify-between rounded-lg border border-white/40 bg-white/5 px-5 py-3.5 text-[14.5px] font-bold backdrop-blur">{s("AI 스마트 육가공", "AI smart processing")}<Icon d={I.arrow} size={18} /></a>
          </div>
        </div>
      </section>

      {/* 숫자 */}
      <section className="bg-white py-12">
        <div className="mx-auto grid max-w-md grid-cols-2 gap-3 px-5">
          {STATS.map(([n, l]) => (
            <Rise key={l} className="rounded-xl border border-[var(--hy-line)] p-4">
              <p className="hy-brand text-[24px] font-extrabold text-[var(--hy-forest)]">{n}</p>
              <p className="mt-1 text-[12px] leading-snug text-[var(--hy-sub)]">{l}</p>
            </Rise>
          ))}
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="bg-[var(--hy-paper)] py-16">
        <div className="mx-auto max-w-md px-5">
          <p className="hy-brand text-[11px] font-bold tracking-[0.24em] text-[var(--hy-orange)]">THE PROBLEM</p>
          <h2 className="mt-3 text-[26px] font-black leading-snug">{L(<>사람이 버티기 어려운<br />육가공 현장</>, <>A meat-processing floor<br />that people can no longer sustain</>)}</h2>
          <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--hy-sub)]">{s("우리 식탁을 지키는 가공 현장은 지금 네 가지 문제를 동시에 겪고 있습니다.", "The plants that feed our tables face four problems at once.")}</p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {PROBLEMS.map((p, i) => (
              <Rise key={p.t} delay={i * 0.05} className="rounded-xl bg-white p-4 shadow-sm">
                <span className="text-[var(--hy-orange)]"><Icon d={p.icon} size={24} /></span>
                <p className="hy-brand mt-3 text-[10.5px] font-semibold tracking-wider text-[var(--hy-sub)]">0{i + 1}</p>
                <p className="mt-1 text-[15px] font-bold leading-snug">{p.t}</p>
                <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--hy-sub)]">{p.d}</p>
              </Rise>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION / BUSINESS */}
      <section id="business" className="bg-white py-16">
        <div className="mx-auto max-w-md px-5">
          <p className="hy-brand text-[11px] font-bold tracking-[0.24em] text-[var(--hy-orange)]">HAEYEON SOLUTION</p>
          <h2 className="mt-3 text-[26px] font-black leading-snug">{L(<>해연에프엔지는<br />현장과 기술로 답합니다</>, <>Haeyeon F&amp;G answers<br />with the floor and with technology</>)}</h2>
          <div className="mt-8 grid gap-5">
            {BUSINESS.map((b, i) => (
              <Rise key={b.t} delay={i * 0.04} className="overflow-hidden rounded-2xl border border-[var(--hy-line)] bg-white shadow-sm">
                <img src={IMG(b.img)} alt={b.t} className="aspect-[16/9] w-full object-cover" />
                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-[18px] font-black">{b.t}</h3>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${b.plan ? "bg-[var(--hy-orange)]/10 text-[var(--hy-orange)]" : "bg-[var(--hy-forest)]/10 text-[var(--hy-forest)]"}`}>{b.tag}</span>
                  </div>
                  <p className="mt-2 text-[14px] leading-relaxed text-[var(--hy-sub)]">{b.d}</p>
                </div>
              </Rise>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTION */}
      <section id="production" className="bg-[var(--hy-paper)] py-16">
        <div className="mx-auto max-w-md px-5">
          <p className="hy-brand text-[11px] font-bold tracking-[0.24em] text-[var(--hy-orange)]">PRODUCTION</p>
          <h2 className="mt-3 text-[26px] font-black leading-snug">{L(<>충북 제천,<br />HACCP 가공 공장</>, <>Our HACCP plant<br />in Jecheon</>)}</h2>
          <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--hy-sub)]">{s("충청북도 제천시 송학주천로 54. 원물 입고부터 출고까지 한 공장 안에서 관리합니다.", "54 Songhakjucheon-ro, Jecheon. From intake to delivery, everything is managed under one roof.")}</p>
          <Rise className="mt-7 overflow-hidden rounded-2xl shadow-md"><img src={IMG("plant-front.jpg")} alt={s("해연에프엔지 제천 공장 전경", "Haeyeon F&G Jecheon plant")} className="aspect-[16/8] w-full object-cover" /></Rise>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {["line-1.jpg", "line-2.jpg", "line-3.jpg", "line-4.jpg"].map((f) => (
              <Rise key={f} className="overflow-hidden rounded-xl"><img src={IMG(f)} alt={s("가공 설비", "Processing equipment")} className="aspect-[4/3] w-full object-cover" /></Rise>
            ))}
          </div>
          <ol className="mt-8 grid grid-cols-3 gap-2">
            {STEPS.map((t, i) => (
              <li key={t} className="rounded-lg bg-white px-2 py-3 text-center shadow-sm">
                <p className="hy-brand text-[11px] font-bold text-[var(--hy-orange)]">STEP {i + 1}</p>
                <p className="mt-1 text-[12.5px] font-bold leading-tight">{t}</p>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-wrap gap-2">
            {[s("HACCP 위생 공정", "HACCP process"), s("식육포장처리업 허가", "Meat packing license"), s("축산물가공업 허가", "Meat processing license"), s("ISO 품질관리 체계", "Quality control system")].map((c) => (
              <span key={c} className="flex items-center gap-1.5 rounded-full border border-[var(--hy-forest)]/30 bg-white px-3 py-1.5 text-[12.5px] font-semibold text-[var(--hy-forest)]"><Icon d={I.shield} size={14} />{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* AI FOODTECH (어두운 섹션) */}
      <section id="foodtech" className="bg-[var(--hy-night)] py-16 text-white">
        <div className="mx-auto max-w-md px-5">
          <div className="flex items-center gap-2">
            <p className="hy-brand text-[11px] font-bold tracking-[0.24em] text-[var(--hy-lime)]">AI FOODTECH</p>
            <span className="rounded-full bg-[var(--hy-orange)] px-2 py-0.5 text-[10.5px] font-bold">{s("추진 계획", "In planning")}</span>
          </div>
          <h2 className="mt-3 text-[26px] font-black leading-snug">{L(<>보이지 않던 뼈와 결을,<br /><span className="text-[var(--hy-lime)]">AI가 먼저 읽습니다</span></>, <>AI reads the bone and grain<br /><span className="text-[var(--hy-lime)]">before the blade moves</span></>)}</h2>
          <p className="mt-3 text-[14.5px] leading-relaxed text-white/70">{s("숙련공의 감각을 데이터로 옮겨, 누가 작업해도 같은 수율과 같은 위생을 지키는 스마트 육가공 센터를 준비하고 있습니다.", "We are turning expert intuition into data, building a smart processing center that delivers the same yield and hygiene no matter who is on shift.")}</p>
          <div className="mt-8 grid gap-3">
            {AI.map((a) => (
              <Rise key={a.n} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--hy-lime)]/15 text-[var(--hy-lime)]"><Icon d={a.icon} size={24} /></span>
                <div>
                  <p className="hy-brand text-[11px] font-bold text-white/50">{a.n}</p>
                  <p className="text-[17px] font-bold">{a.t}</p>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-white/70">{a.d}</p>
                </div>
              </Rise>
            ))}
          </div>
          <Rise className="mt-8 overflow-hidden rounded-2xl bg-white/[0.04] ring-1 ring-white/10">
            <div className="grid grid-cols-2">
              <img src={IMG("mla-sem.jpg")} alt={s("MLA 마이크로 렌즈 현미경 사진", "MLA micro-lens SEM image")} className="aspect-square w-full object-cover" />
              <img src={IMG("tof.jpg")} alt={s("ToF 비전 센서 모듈", "ToF vision sensor module")} className="aspect-square w-full object-cover" />
            </div>
            <div className="p-5">
              <p className="text-[15px] font-bold">{s("광학 센싱 협력 검토", "Optical sensing partnership under review")}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-white/70">{s("국내 실리콘 MLA 렌즈 전문기업 다오옵틱과 원물 3D 인식용 센서 적용을 검토하고 있습니다.", "We are reviewing 3D carcass-sensing applications with DAO Optic, a Korean silicon MLA lens specialist.")}</p>
            </div>
          </Rise>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-md px-5">
          <p className="hy-brand text-[11px] font-bold tracking-[0.24em] text-[var(--hy-orange)]">PRODUCTS</p>
          <h2 className="mt-3 text-[26px] font-black leading-snug">{s("주요 판매 및 생산품", "What we make and supply")}</h2>
        </div>
        <div className="hy-noscroll mx-auto mt-7 flex max-w-md snap-x snap-mandatory scroll-pl-5 gap-3 overflow-x-auto px-5 pb-2">
          {PRODUCTS.map((p) => (
            <div key={p.t} className="w-[70%] shrink-0 snap-start">
              <div className="overflow-hidden rounded-2xl bg-[var(--hy-paper)]"><img src={IMG(p.img)} alt={p.t} className="aspect-[4/5] w-full object-cover" /></div>
              <p className="mt-3 text-[18px] font-black">{p.t}</p>
              <p className="mt-0.5 text-[13px] text-[var(--hy-sub)]">{p.d}</p>
            </div>
          ))}
          <div className="w-2 shrink-0" />
        </div>
        <p className="mx-auto mt-3 max-w-md px-5 text-[11.5px] text-[var(--hy-sub)]">{s("옆으로 넘겨 보세요 →", "Swipe to see more →")}</p>
      </section>

      {/* CHANNELS */}
      <section className="overflow-hidden bg-[var(--hy-forest)] py-14 text-white">
        <div className="mx-auto max-w-md px-5">
          <p className="hy-brand text-[11px] font-bold tracking-[0.24em] text-[var(--hy-lime)]">CHANNELS</p>
          <h2 className="mt-3 text-[23px] font-black leading-snug">{L(<>온라인부터 대형 유통까지,<br />전국으로 공급합니다</>, <>From online to major retail,<br />we supply nationwide</>)}</h2>
          <p className="mt-3 text-[13.5px] text-white/70">{s("2021년 쿠팡 로켓배송 B2B 매출 23억 원 달성", "₩2.3B in Coupang Rocket Delivery B2B sales in 2021")}</p>
        </div>
        <div className="mt-8 overflow-hidden">
          <div className="hy-marquee flex gap-2.5">
            {[...CHANNELS, ...CHANNELS].map((c, i) => (
              <span key={i} className="hy-brand whitespace-nowrap rounded-full bg-white/10 px-4 py-2 text-[13px] font-semibold">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-[var(--hy-paper)] py-16">
        <div className="mx-auto max-w-md px-5">
          <p className="hy-brand text-[11px] font-bold tracking-[0.24em] text-[var(--hy-orange)]">ABOUT</p>
          <h2 className="mt-3 text-[26px] font-black leading-snug">{L(<>정직하고 신선한 기업,<br />젊고 도전적인 기업</>, <>Honest and fresh,<br />young and bold</>)}</h2>
          <Rise className="mt-7 overflow-hidden rounded-2xl"><img src={IMG("farm.jpg")} alt="" className="aspect-[16/9] w-full object-cover" /></Rise>
          <p className="mt-6 text-[14.5px] leading-[1.8] text-[var(--hy-ink)]">{s("해연에프엔지는 쌀과 잡곡 등 엄선된 농산물부터 우수한 품질의 축산물을 1·2차 정밀 가공해 최상의 상태로 생산하는 농축산 가공·유통 전문기업입니다. 생산자에게는 안정적인 판로를, 소비자에게는 신뢰할 수 있는 먹거리를 전하며 생산자와 소비자가 함께 상생하는 구조를 만들어 갑니다.", "Haeyeon F&G is an agri-food processing and distribution company that turns carefully selected grains and high-quality meat into products at their best through primary and secondary processing. We give producers a stable market and consumers food they can trust.")}</p>
          <p className="mt-5 text-[14px] font-bold text-[var(--hy-forest)]">{s("대표이사  이 남 미", "CEO  Lee Nam-mi")}</p>
          <dl className="mt-8 grid gap-2.5 rounded-2xl bg-white p-5 text-[13.5px] shadow-sm">
            {[[s("회사명", "Company"), s("농업회사법인 해연에프엔지 주식회사", "Haeyeon F&G Co., Ltd. (agricultural corporation)")], [s("설립", "Founded"), s("2020년 8월 31일", "August 31, 2020")], [s("본사·공장", "HQ & plant"), s("충청북도 제천시 송학주천로 54", "54 Songhakjucheon-ro, Jecheon, Chungbuk")], [s("서울사무소", "Seoul office"), s("서울 강동구 고덕비즈밸리로 26, 강동U1지식산업센터 B동 509호", "B-509, Gangdong U1 Center, 26 Godeokbizvalley-ro, Seoul")]].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[76px_1fr] gap-3"><dt className="text-[var(--hy-sub)]">{k}</dt><dd className="font-medium">{v}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="bg-white py-16">
        <div className="mx-auto max-w-md px-5">
          <p className="hy-brand text-[11px] font-bold tracking-[0.24em] text-[var(--hy-orange)]">PARTNERSHIP</p>
          <h2 className="mt-3 text-[26px] font-black">{s("해연에프엔지와 함께하세요", "Partner with Haeyeon F&G")}</h2>
          <form className="mt-7 grid gap-3 rounded-2xl border border-[var(--hy-line)] p-5" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <div className="flex flex-wrap gap-2" role="group" aria-label={s("문의 분야", "Topic")}>
              {PURPOSES.map((p, i) => (
                <button key={p} type="button" aria-pressed={purpose === i} onClick={() => setPurpose(i)}
                  className={`rounded-full border px-3 py-1.5 text-[12.5px] font-semibold ${purpose === i ? "border-[var(--hy-forest)] bg-[var(--hy-forest)] text-white" : "border-[var(--hy-line)] text-[var(--hy-sub)]"}`}>{p}</button>
              ))}
            </div>
            {[["hy-nm", s("이름 / 회사명", "Name / Company"), s("홍길동 / ○○식품", "Jane Kim / ABC Foods")], ["hy-ph", s("연락처", "Phone or email"), "010-0000-0000"]].map(([id, l, ph]) => (
              <label key={id} htmlFor={id} className="grid gap-1.5 text-[12.5px] text-[var(--hy-sub)]">{l}
                <input id={id} placeholder={ph} className="rounded-lg border border-[var(--hy-line)] bg-[var(--hy-paper)] px-3 py-3 text-[16px] text-[var(--hy-ink)] outline-none focus:border-[var(--hy-forest)]" />
              </label>
            ))}
            <label htmlFor="hy-msg" className="grid gap-1.5 text-[12.5px] text-[var(--hy-sub)]">{s("문의 내용", "Message")}
              <textarea id="hy-msg" rows={4} placeholder={s("예) 돈육 정육 월 5톤 납품을 검토 중입니다.", "e.g. We are looking for 5 tons of pork per month.")} className="rounded-lg border border-[var(--hy-line)] bg-[var(--hy-paper)] px-3 py-3 text-[16px] text-[var(--hy-ink)] outline-none focus:border-[var(--hy-forest)]" />
            </label>
            <button type="submit" className="rounded-lg bg-[var(--hy-orange)] py-3.5 text-[15px] font-bold text-white">{s("문의 보내기", "Send inquiry")}</button>
            <p className="min-h-[1em] text-[12.5px] text-[var(--hy-orange)]" aria-live="polite">{sent ? s("시안 화면입니다. 정식 오픈 후에는 담당자에게 바로 전달됩니다.", "This is a preview. After launch, inquiries go straight to our team.") : ""}</p>
          </form>
          <dl id="location" className="mt-6 grid gap-2.5 text-[14px]">
            {[[s("대표전화", "Phone"), en ? "+82-2-544-9145" : "02-544-9145"], [s("팩스", "Fax"), en ? "+82-2-544-9146" : "02-544-9146"], [s("이메일", "Email"), "manmi1004@naver.com"]].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[76px_1fr] gap-3"><dt className="text-[13px] text-[var(--hy-sub)]">{k}</dt><dd className="select-all font-semibold">{v}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      <footer className="bg-[var(--hy-night)] py-10 text-[12.5px] text-white/60">
        <div className="mx-auto max-w-md px-5">
          <p className="hy-brand text-[15px] font-extrabold tracking-wider text-white">HAEYEON F&amp;G</p>
          <p className="mt-3">{s("농업회사법인 해연에프엔지 주식회사 · 대표이사 이남미", "Haeyeon F&G Co., Ltd. · CEO Lee Nam-mi")}</p>
          <p className="mt-1">{s("사업자등록번호 784-86-01834", "Business Reg. No. 784-86-01834")}</p>
          <p className="mt-1">{s("충청북도 제천시 송학주천로 54", "54 Songhakjucheon-ro, Jecheon, Chungbuk, Korea")}</p>
          <p className="hy-brand mt-4 tracking-wider">© 2026 HAEYEON F&amp;G · Food Innovation, Powered by Technology</p>
        </div>
      </footer>
    </div>
  );
}
