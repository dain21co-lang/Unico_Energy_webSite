"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

const IMG = (f: string) => `/oksu/img/${f}`;

/* 흐릿한 상태로 멈추지 않도록 투명도는 움직이지 않고 위치만 움직인다 (UNICO Reveal과 같은 원칙) */
function Rise({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ y: 28 }} whileInView={{ y: 0 }} viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

function Label({ en, kr, light }: { en: string; kr: string; light?: boolean }) {
  return (
    <div className="mb-6">
      <p className={`text-[11px] font-semibold tracking-[0.32em] ${light ? "text-[var(--ok-gold)]" : "text-[var(--ok-leaf)]"}`}>{en}</p>
      <div className={`mt-3 h-px w-14 ${light ? "bg-[var(--ok-gold)]" : "bg-[var(--ok-leaf)]"}`} />
      <p className={`mt-3 text-sm font-semibold ${light ? "text-white/60" : "text-[var(--ok-sub)]"}`}>{kr}</p>
    </div>
  );
}

function Tag({ children, real }: { children: ReactNode; real?: boolean }) {
  return (
    <span className={`absolute right-3 top-3 z-10 rounded-full px-2.5 py-0.5 text-[10.5px] font-medium text-white ${real ? "bg-[#b8862f]/90" : "bg-black/45"}`}>
      {children}
    </span>
  );
}

/* ───────── 1. 네비게이션 ───────── */
const NAV = [
  ["vision", "비전"], ["plan", "사업구성"], ["site", "입지"], ["facility", "처리시설"], ["farm", "스마트팜"], ["community", "상생"], ["contact", "문의"],
];

function Nav() {
  const [solid, setSolid] = useState(false);
  const [prog, setProg] = useState(0);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => {
      setSolid(window.scrollY > 40);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProg(h > 0 ? window.scrollY / h : 0);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`fixed left-1/2 top-0 z-50 w-full max-w-[560px] -translate-x-1/2 transition-colors duration-500 ${solid || open ? "bg-[var(--ok-deep)]/95 backdrop-blur" : "bg-transparent"}`}>
      <div className="flex items-center justify-between px-5 py-4">
        <a href="#top" className="flex items-baseline gap-2 text-white">
          <span className="text-lg font-black tracking-tight">OKSU</span>
          <span className="text-[13px] font-semibold text-white/80">옥수 개발사업</span>
        </a>
        <button aria-label="메뉴 열기" aria-expanded={open} onClick={() => setOpen(!open)} className="flex h-10 w-10 flex-col items-center justify-center gap-1.5">
          <span className={`h-0.5 w-6 bg-white transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-white transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>
      {open && (
        <nav className="grid grid-cols-2 gap-px border-t border-white/10 bg-white/10 pb-px">
          {NAV.map(([id, t]) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="bg-[var(--ok-deep)] px-5 py-4 text-[15px] font-semibold text-white/90">{t}</a>
          ))}
        </nav>
      )}
      <div className="h-[2px] bg-[var(--ok-gold)] transition-[width] duration-150" style={{ width: `${prog * 100}%` }} />
    </header>
  );
}

/* ───────── 2. 히어로 ───────── */
const SLIDES = [
  { img: "aerial_full.jpg", idx: "01", label: "처리하고", pos: "30% 50%" },
  { img: "farm_aerial.jpg", idx: "02", label: "키우고", pos: "45% 50%" },
  { img: "master.jpg", idx: "03", label: "함께 나눕니다", pos: "40% 55%" },
];

function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);
  return (
    <section id="top" className="relative h-[100svh] min-h-[640px] overflow-hidden bg-[var(--ok-deep)]">
      {SLIDES.map((s, k) => (
        <div key={s.img} className={`ok-slide ${k === i ? "on" : ""}`} style={{ backgroundImage: `url(${IMG(s.img)})`, backgroundPosition: s.pos }} />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--ok-deep)] via-[var(--ok-deep)]/55 to-[var(--ok-deep)]/20" />
      <span className="absolute right-3 top-20 z-10 rounded-full bg-black/45 px-2.5 py-0.5 text-[10.5px] font-medium text-white">조감도 · 연출 이미지</span>
      <div className="absolute inset-x-0 bottom-12 z-10 px-6">
        <p className="mb-4 text-[11px] font-semibold tracking-[0.32em] text-[var(--ok-gold)]">MEDICAL WASTE · SMART FARM COMPLEX</p>
        <h1 className="text-[2.15rem] font-extrabold leading-[1.3] tracking-tight text-white [text-shadow:0_2px_16px_rgba(0,0,0,.5)]">
          <span className="underline decoration-[var(--ok-gold)] decoration-2 underline-offset-8">처리하고, 키우고,</span>
          <br />지역과 함께 나눕니다
        </h1>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/80">
          전북 완주 봉동에서 의료폐기물을 안전하게 처리하고, 그 열로 스마트팜을 키우는 복합개발 사업입니다.
        </p>
        <a href="#vision" className="mt-6 inline-flex items-center gap-2 rounded-md border border-white/40 px-6 py-3 text-sm font-medium text-white hover:border-[var(--ok-gold)] hover:text-[var(--ok-gold)]">
          <span aria-hidden>↳</span> 사업 살펴보기
        </a>
        <div className="mt-6 flex items-center gap-5 text-sm font-semibold tracking-widest" aria-label="장면">
          {SLIDES.map((s, k) => (
            <button key={s.idx} onClick={() => setI(k)} className={`flex items-center gap-2 transition-colors ${k === i ? "text-white" : "text-white/35"}`}>
              {s.idx}
              {k === i && <span className="text-[12px] font-medium tracking-normal">{s.label}</span>}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── 3. 세 기둥 띠 ───────── */
function PillarBand() {
  const P = [
    ["친환경 처리", "의료폐기물 안전 처리"],
    ["순환 에너지", "소각열 회수 · 온실 공급"],
    ["스마트 농업", "딸기 재배 · 체험 · 판매"],
  ];
  return (
    <div className="grid grid-cols-3 divide-x divide-white/10 bg-[var(--ok-forest)] text-center">
      {P.map(([a, b]) => (
        <div key={a} className="px-2 py-5">
          <p className="text-[14px] font-bold text-white">{a}</p>
          <p className="mt-1 text-[11px] leading-snug text-white/55">{b}</p>
        </div>
      ))}
    </div>
  );
}

/* ───────── 4. 비전 ───────── */
function Vision() {
  return (
    <section id="vision" className="px-6 py-20">
      <Rise><Label en="VISION" kr="사업 비전" /></Rise>
      <Rise delay={0.05}>
        <h2 className="text-[1.75rem] font-extrabold leading-[1.4] tracking-tight">
          버려지는 것을 처리하는 시설이<br />
          <span className="text-[var(--ok-leaf)]">지역을 키우는 산업</span>이 됩니다
        </h2>
      </Rise>
      <Rise delay={0.1}>
        <p className="mt-6 text-[15.5px] leading-[1.85] text-[var(--ok-sub)]">
          의료폐기물은 감염 위험 때문에 전문 시설에서만 처리할 수 있습니다. 옥수 개발사업은 처리시설을 지역 안에 두어 먼 거리 운송을 줄이고,
          처리 과정에서 나오는 열을 스마트팜 온실에 다시 써서 농업과 일자리로 잇는 순환형 단지를 만듭니다.
        </p>
      </Rise>
      <Rise delay={0.15} className="relative mt-10 overflow-hidden rounded-xl">
        <div className="ok-pan aspect-[4/5] w-full bg-cover" style={{ backgroundImage: `url(${IMG("overview.jpg")})`, backgroundSize: "auto 100%" }} />
        <Tag>조감도 · 연출 이미지</Tag>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 pt-16">
          <p className="text-[13px] font-semibold text-white">저수지를 끼고 이어지는 세 구역</p>
        </div>
      </Rise>
      <div className="mt-10 grid grid-cols-2 gap-3">
        {[
          ["3", "개 구역", "처리시설 · 신규 건물 · 스마트팜"],
          ["4", "단계 공정", "수거 · 보관 · 소각 · 측정"],
          ["24", "시간 측정", "배출가스 자동 측정 (계획)"],
          ["3", "중 방지설비", "다이옥신 · 먼지 · 산성가스"],
        ].map(([n, u, d], k) => (
          <Rise key={d} delay={k * 0.05} className="rounded-xl border border-black/5 bg-white p-5">
            <p className="text-[2.2rem] font-black leading-none tracking-tight text-[var(--ok-forest)]">{n}<span className="ml-1 text-[13px] font-bold text-[var(--ok-leaf)]">{u}</span></p>
            <p className="mt-3 text-[12.5px] leading-snug text-[var(--ok-sub)]">{d}</p>
          </Rise>
        ))}
      </div>
    </section>
  );
}

/* ───────── 5. 사업 구성 · 인터랙티브 마스터플랜 ───────── */
const PHASES = [
  { k: "1차", color: "var(--ok-leaf)", title: "의료폐기물 처리시설", lot: "산116-1 일원", img: "site_photo.jpg", real: true,
    body: "기존 건축물을 살려 수거부터 소각, 배출가스 관리까지 한곳에서 처리합니다. 단지의 첫 단계이자 에너지의 출발점입니다.", pin: { x: 25, y: 27 } },
  { k: "2차", color: "var(--ok-p2)", title: "신규 건물", lot: "산116 일원", img: "master.jpg", real: false,
    body: "처리 능력 확대와 시설 현대화를 위한 건물을 새로 짓습니다. 용도와 규모는 1차 운영 계획에 맞춰 확정합니다.", pin: { x: 50, y: 38 } },
  { k: "3차", color: "var(--ok-p3)", title: "스마트팜 딸기 단지", lot: "저수지 아래 일원", img: "farm_aerial.jpg", real: false,
    body: "스마트 온실, 선별·포장 시설, 직거래 판매장과 체험농장을 갖춘 딸기 단지입니다. 처리시설의 열을 온실 난방에 쓰는 연계를 검토합니다.", pin: { x: 68, y: 70 } },
];

function Plan() {
  const [a, setA] = useState(0);
  const p = PHASES[a];
  return (
    <section id="plan" className="bg-[var(--ok-deep)] py-20 text-white">
      <div className="px-6">
        <Rise><Label en="MASTER PLAN" kr="사업 구성" light /></Rise>
        <Rise delay={0.05}><h2 className="text-[1.7rem] font-extrabold leading-[1.4]">세 구역이 하나의<br />순환 단지로 이어집니다</h2></Rise>
        <p className="mt-4 text-[14px] text-white/60">지도의 번호를 눌러 구역별 내용을 확인하세요.</p>
      </div>
      <div className="relative mt-8">
        <img src={IMG("master.jpg")} alt="1차·2차·3차 구역 배치 조감도" className="block w-full" />
        <Tag>조감도 · 연출 이미지</Tag>
        {PHASES.map((q, k) => (
          <button key={q.k} onClick={() => setA(k)} aria-label={`${q.k} ${q.title}`}
            className={`absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-[12px] font-black transition-transform ${k === a ? "ok-pulse scale-110 border-white" : "border-white/70 opacity-85"}`}
            style={{ left: `${q.pin.x}%`, top: `${q.pin.y}%`, background: q.color }}>
            {q.k}
          </button>
        ))}
      </div>
      <div className="px-6">
        <div className="mt-5 flex gap-2">
          {PHASES.map((q, k) => (
            <button key={q.k} onClick={() => setA(k)} className={`flex-1 rounded-md py-2.5 text-[13px] font-bold transition-colors ${k === a ? "text-white" : "bg-white/5 text-white/50"}`}
              style={k === a ? { background: q.color } : undefined}>{q.k}</button>
          ))}
        </div>
        <motion.div key={a} initial={{ y: 12 }} animate={{ y: 0 }} transition={{ duration: 0.4 }} className="mt-5 overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10">
          <div className="relative aspect-[16/9] bg-cover bg-center" style={{ backgroundImage: `url(${IMG(p.img)})` }}>
            <Tag real={p.real}>{p.real ? "실제 현장 사진" : "연출 이미지"}</Tag>
          </div>
          <div className="p-5">
            <p className="text-[12px] font-semibold tracking-widest" style={{ color: p.color }}>{p.k} · {p.lot}</p>
            <h3 className="mt-2 text-xl font-extrabold">{p.title}</h3>
            <p className="mt-3 text-[14.5px] leading-[1.8] text-white/70">{p.body}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ───────── 6. 순환 구조 ───────── */
function Cycle() {
  const S = [
    ["의료기관", "병원 · 의원 · 요양병원에서 발생"],
    ["안전 수거", "전용 차량 · 밀폐 용기"],
    ["고온 소각", "완전 연소 · 배출가스 정화"],
    ["열 회수", "스팀 · 온수로 에너지 회수"],
    ["스마트팜", "온실 난방 · 딸기 재배"],
    ["지역", "일자리 · 판매 · 체험 관광"],
  ];
  return (
    <section className="px-6 py-20">
      <Rise><Label en="CIRCULAR MODEL" kr="순환 구조" /></Rise>
      <Rise delay={0.05}><h2 className="text-[1.65rem] font-extrabold leading-[1.4]">처리에서 끝나지 않고<br /><span className="text-[var(--ok-leaf)]">농업과 지역으로</span> 돌아갑니다</h2></Rise>
      <div className="relative mt-10">
        <svg className="absolute left-[19px] top-4 h-[calc(100%-2rem)] w-2" aria-hidden>
          <line x1="4" y1="0" x2="4" y2="100%" stroke="var(--ok-leaf)" strokeWidth="2" className="ok-flow" />
        </svg>
        <ol className="relative grid gap-5">
          {S.map(([t, d], k) => (
            <Rise key={t} delay={k * 0.04}>
              <li className="flex items-start gap-4">
                <span className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[12px] font-black text-white ${k === 3 ? "bg-[var(--ok-gold)] text-[var(--ok-deep)]" : "bg-[var(--ok-forest)]"}`}>
                  {String(k + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1 rounded-xl bg-white p-4 shadow-[0_1px_0_rgba(0,0,0,.04)]">
                  <p className="text-[16px] font-bold">{t}</p>
                  <p className="mt-1 text-[13.5px] text-[var(--ok-sub)]">{d}</p>
                </div>
              </li>
            </Rise>
          ))}
        </ol>
      </div>
      <p className="mt-6 text-[12.5px] text-[var(--ok-sub)]">열 회수와 온실 공급 방식은 설비 설계 단계에서 확정합니다.</p>
    </section>
  );
}

/* ───────── 7. 입지 ───────── */
function Site() {
  const L = [
    ["loc2.jpg", "교통", "익산IC · 완주IC 인접, 국도·지방도 연결"],
    ["loc3.jpg", "산업 기반", "봉동 산업단지 인접 · 전주 생활권"],
    ["loc1.jpg", "자연", "저수지 인접 · 관광·체험 자원 연계"],
    ["loc5.jpg", "확장성", "1차부터 3차까지 단계적 확장 부지"],
  ];
  return (
    <section id="site" className="bg-white py-20">
      <div className="px-6">
        <Rise><Label en="LOCATION" kr="입지" /></Rise>
        <Rise delay={0.05}><h2 className="text-[1.65rem] font-extrabold leading-[1.4]">저수지와 산업단지 사이,<br />전북 완주 봉동</h2></Rise>
        <p className="mt-4 font-mono text-[13px] text-[var(--ok-sub)]">전북 완주군 봉동읍 제내리 산116 일원</p>
      </div>
      <Rise className="relative mt-8">
        <img src={IMG("site_aerial.jpg")} alt="사업 대상지 조감도" className="block w-full" />
        <Tag>조감도 · 연출 이미지</Tag>
      </Rise>
      <div className="ok-snap mt-6 flex gap-3 overflow-x-auto px-6 pb-2">
        {L.map(([f, t, d]) => (
          <div key={t} className="w-[70%] shrink-0 overflow-hidden rounded-xl bg-[var(--ok-paper)]">
            <div className="aspect-[16/10] bg-cover bg-center" style={{ backgroundImage: `url(${IMG(f)})` }} />
            <div className="p-4"><p className="text-[15px] font-bold">{t}</p><p className="mt-1 text-[13px] text-[var(--ok-sub)]">{d}</p></div>
          </div>
        ))}
      </div>
      <p className="mt-2 px-6 text-[11.5px] text-[var(--ok-sub)]">옆으로 넘겨 보세요 · 주변 사진은 연출 이미지</p>
      <div className="mt-10 grid grid-cols-2 gap-3 px-6">
        <div className="relative overflow-hidden rounded-xl">
          <img src={IMG("site_photo.jpg")} alt="1차 부지의 기존 건축물" className="block aspect-[4/5] w-full object-cover" />
          <Tag real>실제 현장</Tag>
          <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 p-3 pt-10 text-[12px] font-semibold text-white">1차 부지 · 기존 건축물</p>
        </div>
        <div className="relative overflow-hidden rounded-xl">
          <img src={IMG("topview.jpg")} alt="위에서 본 1차 부지" className="block aspect-[4/5] w-full object-cover" />
          <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 p-3 pt-10 text-[12px] font-semibold text-white">위에서 본 부지</p>
        </div>
      </div>
    </section>
  );
}

/* ───────── 8. 처리시설 · 분류 탭 ───────── */
const WASTE = [
  { t: "격리 의료폐기물", d: "감염병 환자의 격리 진료 과정에서 나온 폐기물입니다. 가장 엄격한 기준으로 수거하고 처리합니다.", items: ["격리 병상 진료 폐기물"] },
  { t: "위해 의료폐기물", d: "인체에 직접 위해를 줄 수 있는 폐기물입니다.", items: ["조직물류 (혈액·체액·조직)", "손상성 (주삿바늘·칼날)", "병리계 · 생물화학 · 혈액오염"] },
  { t: "일반 의료폐기물", d: "직접 위험성은 낮지만 의료행위에서 나온 폐기물입니다.", items: ["혈액·체액이 묻은 거즈·붕대", "일회용 기저귀 · 주사기 등"] },
];

function Facility() {
  const [t, setT] = useState(1);
  return (
    <section id="facility" className="ok-grain relative bg-[var(--ok-forest)] py-20 text-white">
      <div className="relative px-6">
        <Rise><Label en="PHASE 1 · FACILITY" kr="1차 의료폐기물 처리시설" light /></Rise>
        <Rise delay={0.05}><h2 className="text-[1.65rem] font-extrabold leading-[1.4]">받는 것부터<br />내보내는 것까지 관리합니다</h2></Rise>
        <p className="mt-4 text-[14.5px] leading-relaxed text-white/65">「폐기물관리법」 기준에 따라 수거·운반·보관·처리 전 과정을 기록하고 관리합니다.</p>

        <div className="mt-8 flex gap-1 rounded-lg bg-black/20 p-1" role="tablist">
          {WASTE.map((w, k) => (
            <button key={w.t} role="tab" aria-selected={k === t} onClick={() => setT(k)}
              className={`flex-1 rounded-md px-1 py-2.5 text-[12.5px] font-bold transition-colors ${k === t ? "bg-[var(--ok-gold)] text-[var(--ok-deep)]" : "text-white/60"}`}>{w.t.replace(" 의료폐기물", "")}</button>
          ))}
        </div>
        <motion.div key={t} initial={{ y: 10 }} animate={{ y: 0 }} className="mt-4 rounded-xl bg-white/[.06] p-5 ring-1 ring-white/10">
          <h3 className="text-lg font-bold">{WASTE[t].t}</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-white/70">{WASTE[t].d}</p>
          <ul className="mt-4 grid gap-2">
            {WASTE[t].items.map((x) => <li key={x} className="flex gap-2 text-[14px]"><span className="text-[var(--ok-gold)]">—</span>{x}</li>)}
          </ul>
        </motion.div>
        <p className="mt-3 text-[12px] text-white/45">받을 수 있는 폐기물 종류는 처리업 허가 내용에 따라 확정해 공개합니다.</p>
      </div>
    </section>
  );
}

/* ───────── 9. 처리 공정 (가로 넘김) ───────── */
function Process() {
  const F = [
    ["수거 · 운반", "전용 차량과 밀폐 용기로 의료기관에서 수거합니다. 종류별로 나눠 포장하고 차량 위치를 추적합니다.", "loc2.jpg"],
    ["임시 보관 · 검수", "온도와 습도를 관리하는 보관소에 둡니다. 전자 인계 기록으로 종류·발생처·수거일을 확인합니다.", "topview.jpg"],
    ["고온 소각", "2단계 연소로 완전히 태웁니다. 열은 스팀으로 회수하고 소각재는 기준에 맞게 매립합니다.", "incin_unit.jpg"],
    ["측정 · 공개", "배출가스를 자동 측정해 실시간 보고하고, 주변 환경을 정기적으로 조사해 공개합니다.", "incin_line.jpg"],
  ];
  const [i, setI] = useState(0);
  return (
    <section className="py-20">
      <div className="px-6">
        <Rise><Label en="PROCESS" kr="처리 공정" /></Rise>
        <Rise delay={0.05}><h2 className="text-[1.65rem] font-extrabold leading-[1.4]">네 단계로<br />안전하게 처리합니다</h2></Rise>
      </div>
      <div className="ok-snap mt-8 flex gap-3 overflow-x-auto px-6 pb-2"
        onScroll={(e) => { const el = e.currentTarget; setI(Math.round(el.scrollLeft / (el.clientWidth * 0.82))); }}>
        {F.map(([t, d, f], k) => (
          <div key={t} className="relative w-[82%] shrink-0 overflow-hidden rounded-2xl bg-[var(--ok-deep)] text-white">
            <div className="aspect-[4/3] bg-[#7d7a85] bg-cover bg-center opacity-90" style={{ backgroundImage: `url(${IMG(f)})` }} />
            <span className="absolute left-4 top-4 font-mono text-[42px] font-black leading-none text-white/90 [text-shadow:0_2px_12px_rgba(0,0,0,.5)]">{String(k + 1).padStart(2, "0")}</span>
            <div className="p-5"><p className="text-lg font-extrabold">{t}</p><p className="mt-2 text-[14px] leading-relaxed text-white/70">{d}</p></div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-2" aria-hidden>
        {F.map((_, k) => <span key={k} className={`h-1.5 rounded-full transition-all ${k === Math.min(i, 3) ? "w-6 bg-[var(--ok-leaf)]" : "w-1.5 bg-black/15"}`} />)}
      </div>
      <p className="mt-3 text-center text-[11.5px] text-[var(--ok-sub)]">설비 사진은 예시 그림입니다</p>
    </section>
  );
}

/* ───────── 10. 환경 · 안전 ───────── */
function Safety() {
  const S = [
    ["대기", "굴뚝 배출가스 24시간 자동 측정과 측정값 공개. 다이옥신은 활성탄 분사와 촉매 반응탑으로 줄입니다."],
    ["수질", "폐수는 자체 처리 후 재이용하고, 지하수 관측정으로 변화를 살핍니다."],
    ["토양 · 생태", "주변 지점을 정기 측정하고 부지 경계에 완충 녹지를 둡니다."],
    ["작업자", "보호구 지급, 정기 안전교육과 비상 대응 훈련을 합니다."],
    ["외부 점검", "외부 전문기관의 정기 점검을 받고 결과를 공개합니다."],
  ];
  return (
    <section className="bg-white px-6 py-20">
      <Rise><Label en="ENVIRONMENT & SAFETY" kr="환경 · 안전" /></Rise>
      <Rise delay={0.05}><h2 className="text-[1.65rem] font-extrabold leading-[1.4]">숨기지 않고,<br /><span className="text-[var(--ok-leaf)]">보이게</span> 관리합니다</h2></Rise>
      <div className="mt-8 grid gap-0 divide-y divide-black/5 border-y border-black/5">
        {S.map(([t, d]) => (
          <details key={t} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between text-[16px] font-bold">
              {t}<span className="text-[var(--ok-leaf)] transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-[14px] leading-relaxed text-[var(--ok-sub)]">{d}</p>
          </details>
        ))}
      </div>
      <div className="mt-8 grid grid-cols-3 gap-2">
        {[["incin_unit.jpg", "고온 소각로"], ["incin_cut.jpg", "처리동 구조"], ["incin_line.jpg", "방지 설비"]].map(([f, t]) => (
          <div key={t}><div className="aspect-square rounded-lg bg-[#7d7a85] bg-cover bg-center" style={{ backgroundImage: `url(${IMG(f)})` }} /><p className="mt-1.5 text-center text-[11.5px] text-[var(--ok-sub)]">{t}</p></div>
        ))}
      </div>
      <p className="mt-2 text-[11.5px] text-[var(--ok-sub)]">설비 그림은 예시입니다</p>
    </section>
  );
}

/* ───────── 11. 스마트팜 ───────── */
function Farm() {
  const F = [
    ["farm1.jpg", "스마트 온실", "자동 온도·습도 조절과 수경재배로 연중 생산"],
    ["farm2.jpg", "자동화 시스템", "온도·습도·CO₂ 환경 제어와 생육 모니터링"],
    ["farm3.jpg", "선별 · 포장", "품질 선별, 위생 포장, 유통망 연계"],
    ["farm4.jpg", "체험 · 판매", "수확 체험, 직거래 판매장, 카페와 휴게공간"],
  ];
  return (
    <section id="farm" className="bg-[var(--ok-deep)] py-20 text-white">
      <div className="px-6">
        <Rise><Label en="PHASE 2 · 3 · SMART FARM" kr="2차 · 3차 개발" light /></Rise>
        <Rise delay={0.05}><h2 className="text-[1.65rem] font-extrabold leading-[1.4]">저수지 아래,<br />사계절 딸기가 자랍니다</h2></Rise>
      </div>
      <div className="relative mt-8 overflow-hidden">
        <div className="ok-pan aspect-[4/3] w-full bg-cover" style={{ backgroundImage: `url(${IMG("farm_aerial.jpg")})`, backgroundSize: "auto 100%" }} />
        <Tag>조감도 · 연출 이미지</Tag>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 px-6">
        {F.map(([f, t, d], k) => (
          <Rise key={t} delay={k * 0.05} className="overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10">
            <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url(${IMG(f)})` }} />
            <div className="p-3.5"><p className="text-[14.5px] font-bold">{t}</p><p className="mt-1 text-[12px] leading-snug text-white/60">{d}</p></div>
          </Rise>
        ))}
      </div>
      <div className="mx-6 mt-6 flex items-center gap-4 overflow-hidden rounded-xl bg-[var(--ok-gold)] text-[var(--ok-deep)]">
        <div className="h-24 w-28 shrink-0 bg-cover bg-center" style={{ backgroundImage: `url(${IMG("berry.jpg")})` }} />
        <p className="pr-4 text-[14px] font-bold leading-snug">처리시설의 열로 온실을 데우는 연계가 이 단지의 핵심 시너지입니다</p>
      </div>
      <p className="mt-3 px-6 text-[11.5px] text-white/40">스마트팜 사진은 모두 연출 이미지입니다</p>
    </section>
  );
}

/* ───────── 12. 상생 · 절차 · FAQ ───────── */
function Community() {
  const C = [
    ["소통 창구", "상설 창구와 정기 간담회, 온라인 정보 공개"],
    ["주민 감시단", "주민이 참여하는 환경 모니터링과 정기 보고"],
    ["지역 발전 기금", "매출 일부를 교육·복지·환경 개선에"],
    ["지역 일자리", "처리시설·스마트팜 운영 인력 지역 우선 채용"],
  ];
  const STEP = ["사업계획 승인", "환경영향평가", "주민 공청회", "처리업 허가", "착공 · 준공"];
  const Q = [
    ["냄새나 연기가 나지 않나요?", "밀폐 보관과 고온 완전 연소, 다중 방지설비로 냄새와 배출가스를 관리합니다. 굴뚝 측정값은 실시간으로 공개할 계획입니다."],
    ["수거 차량이 마을로 다니나요?", "수거 경로는 주거지와 학교를 피하도록 설계하고, 차량 위치를 추적해 관리합니다."],
    ["주민은 어떻게 참여하나요?", "주민 감시단과 정기 간담회를 통해 운영을 함께 점검하고, 지역 발전 기금 사용처도 함께 정합니다."],
    ["언제 문을 여나요?", "인허가 절차를 거쳐 1차 시설부터 단계적으로 준공합니다. 일정은 확정되는 대로 이 페이지에 공개합니다."],
  ];
  return (
    <section id="community" className="px-6 py-20">
      <Rise><Label en="COMMUNITY" kr="지역 상생" /></Rise>
      <Rise delay={0.05}><h2 className="text-[1.65rem] font-extrabold leading-[1.4]">주민과 함께<br />운영합니다</h2></Rise>
      <div className="mt-8 grid grid-cols-2 gap-3">
        {C.map(([t, d], k) => (
          <Rise key={t} delay={k * 0.05} className="rounded-xl bg-white p-4">
            <p className="text-[15px] font-bold">{t}</p><p className="mt-1.5 text-[12.5px] leading-snug text-[var(--ok-sub)]">{d}</p>
          </Rise>
        ))}
      </div>

      <h3 className="mt-14 text-[12px] font-semibold tracking-[0.3em] text-[var(--ok-leaf)]">ROADMAP</h3>
      <ol className="mt-5 grid gap-0 border-l-2 border-[var(--ok-leaf)]/30 pl-6">
        {STEP.map((s, k) => (
          <li key={s} className="relative pb-6 last:pb-0">
            <span className="absolute -left-[33px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--ok-leaf)] ring-4 ring-[var(--ok-paper)]" />
            <p className="text-[15.5px] font-bold">{s}</p>
            <p className="mt-0.5 text-[12.5px] text-[var(--ok-sub)]">{k === 4 ? "1차 → 2차 → 3차 순서로" : "일정 확정 후 공개"}</p>
          </li>
        ))}
      </ol>

      <h3 className="mt-14 text-[12px] font-semibold tracking-[0.3em] text-[var(--ok-leaf)]">FAQ</h3>
      <div className="mt-4 grid gap-2">
        {Q.map(([q, a]) => (
          <details key={q} className="group rounded-xl bg-white px-4 py-3.5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[15px] font-bold">
              <span><span className="mr-2 text-[var(--ok-leaf)]">Q.</span>{q}</span>
              <span className="text-[var(--ok-leaf)] transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-[14px] leading-relaxed text-[var(--ok-sub)]">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ───────── 13. 문의 · 푸터 ───────── */
function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-[var(--ok-deep)] px-6 py-24 text-white">
      <div className="ok-pan absolute inset-0 bg-cover opacity-25" style={{ backgroundImage: `url(${IMG("aerial_full.jpg")})`, backgroundSize: "auto 100%" }} />
      <div className="relative">
        <p className="text-[11px] font-semibold tracking-[0.32em] text-[var(--ok-gold)]">CONTACT</p>
        <h2 className="mt-4 text-[1.9rem] font-extrabold leading-[1.35]">함께할 파트너를<br />찾고 있습니다</h2>
        <p className="mt-4 text-[14.5px] leading-relaxed text-white/70">투자 · 운영 · 의료기관 협력에 관심 있는 분은 연락 주세요.</p>
        <div className="mt-8 grid gap-px overflow-hidden rounded-xl bg-white/10">
          <div className="flex justify-between bg-[var(--ok-deep)]/80 px-5 py-4 text-[14px]"><span className="text-white/55">시행사</span><span className="font-semibold">신규 법인 설립 후 안내</span></div>
          <div className="flex justify-between bg-[var(--ok-deep)]/80 px-5 py-4 text-[14px]"><span className="text-white/55">연락처</span><span className="font-semibold">준비 중</span></div>
          <div className="flex justify-between bg-[var(--ok-deep)]/80 px-5 py-4 text-[14px]"><span className="text-white/55">위치</span><span className="font-semibold">전북 완주군 봉동읍 제내리</span></div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-black px-6 py-8 text-[11.5px] leading-relaxed text-white/45">
      <p className="text-[14px] font-black text-white/80">OKSU <span className="ml-1 font-semibold">옥수 개발사업</span></p>
      <p className="mt-2">의료폐기물 처리시설 및 스마트팜 복합개발 · 임시 안내 페이지</p>
      <p className="mt-2">「연출 이미지」와 「예시 그림」은 실제 시설이 아닙니다. 규모·일정·인허가 사항은 확정 후 공개합니다.</p>
    </footer>
  );
}

export default function OksuSite() {
  return (
    <div className="oksu mx-auto w-full max-w-[560px] shadow-[0_0_60px_rgba(0,0,0,.08)]">
      <Nav />
      <main>
        <Hero />
        <PillarBand />
        <Vision />
        <Plan />
        <Cycle />
        <Site />
        <Facility />
        <Process />
        <Safety />
        <Farm />
        <Community />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
