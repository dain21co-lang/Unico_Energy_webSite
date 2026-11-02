"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

const IMG = (f: string) => `/solumix/img/${f}`;

/* UNICO·옥수와 같은 원칙: 투명도는 움직이지 않고 위치만 움직인다 (갤럭시 빈 화면 방지) */
function Rise({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ y: 28 }} whileInView={{ y: 0 }} viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

/* 심벌: 육각형 두 모듈이 맞물린 S + 중앙의 로봇 눈 */
function Mark({ size = 40, id = "m" }: { size?: number; id?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f3e4b0" /><stop offset="1" stopColor="#b8902c" /></linearGradient>
        <linearGradient id={`${id}-s`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f4f7fb" /><stop offset="1" stopColor="#8e9ab0" /></linearGradient>
      </defs>
      <path d="M169 62 L100 22 L31 62 L31 100 L76 100" fill="none" stroke={`url(#${id}-g)`} strokeWidth="15" />
      <path d="M124 100 L169 100 L169 138 L100 178 L31 138" fill="none" stroke={`url(#${id}-s)`} strokeWidth="15" />
      <circle cx="100" cy="100" r="19" fill="none" stroke="#4fd8f5" strokeWidth="5" />
      <circle cx="100" cy="100" r="8" fill="#4fd8f5" />
    </svg>
  );
}

function Icon({ d, size = 20 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
const I = {
  chat: "M4 5h16v11H8l-4 4z M8 9h8 M8 12h5",
  pin: "M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  robot: "M7 9h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z M12 5v4 M9.5 14h.01 M14.5 14h.01",
  doc: "M7 3h7l5 5v13H7z M14 3v5h5 M10 13h6 M10 17h6",
  up: "M12 19V5 M5 12l7-7 7 7",
  arrow: "M5 12h14 M13 6l6 6-6 6",
  cart: "M3 4h2l2.5 11h10.5l2-8H6.5 M9 20h.01 M17 20h.01",
  gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z",
  chart: "M4 20V10 M10 20V4 M16 20v-7 M22 20H2",
  tool: "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z",
  down: "M6 9l6 6 6-6",
};

const CASES = [
  { img: "case-restaurant.jpg", tag: "Serving", t: "Neighborhood restaurant" },
  { img: "case-warehouse.jpg", tag: "Logistics", t: "Warehouse transport" },
  { img: "security.jpg", tag: "Security", t: "Data center patrol" },
  { img: "home.jpg", tag: "Home", t: "Everyday home service" },
  { img: "kid.jpg", tag: "Companion", t: "A robot kids love" },
  { img: "medical.jpg", tag: "Healthcare", t: "Medical assistance" },
  { img: "logistics.jpg", tag: "Logistics", t: "Autonomous delivery" },
  { img: "factory.jpg", tag: "Manufacturing", t: "Smart factory" },
];

const REFS = ["PyeongChang Winter Paralympics supplier", "SNU AI Institute consortium", "Prime Minister's Award, Korea Robot Awards", "Microsoft Robotics Studio partner", "GURO Bot at Seoul PR Hall", "KBS orchestra-conducting robot", "Featured on BBC", "ISO 9001 certified", "INNO-BIZ company", "Listed on KONEX"];

const SOLUTIONS = [
  { tag: "Service", t: "Serving Robots", bg: "#2a1d14", fg: "#f4ead9", sub: "#cdb79a", img: "case-restaurant.jpg",
    d: "Serving and guide robots for stores facing rising labor costs. Available for purchase or rental, with financing programs that lower the upfront cost." },
  { tag: "Industrial", t: "Logistics Transport", bg: "#0e2a5c", fg: "#eef3ff", sub: "#a9bde6", img: "case-warehouse.jpg",
    d: "Gyroscopic balance control keeps loads steady through narrow aisles and over floor bumps. Expanding into warehouse and factory automation with a Robot-as-a-Service model." },
  { tag: "In development", t: "Security Patrol", bg: "#0b1222", fg: "#eef2f8", sub: "#9aa7bf", img: "security.jpg",
    d: "Designed for autonomous patrols inside and around data centers and buildings, with live video to the control room and thermal detection of smoke and fire. Currently in internal testing." },
  { tag: "Living", t: "Home IoT · EV Parts", bg: "#e9edf4", fg: "#0b1222", sub: "#4a5672", img: "home.jpg",
    d: "Tuya-based smart home products with a pilot store in Seoul's Nonhyeon district, plus EV and ESS components made by injection molding, die casting, pressing and tooling." },
];

const PRODUCTS = [
  { img: "prod-platform.jpg", line: "Core", t: "Balancing Platform", d: "A compact robot platform built on 20 years of self-balancing tech", chips: ["Gyro control", "AST patent"] },
  { img: "prod-serving.jpg", line: "Service", t: "Serving Robot", d: "3 trays · autonomous driving · sale or rental", chips: ["Rental", "Autonomous"] },
  { img: "prod-transport.jpg", line: "Logistics", t: "Transport Robot", d: "Steady delivery over bumps and through tight aisles", chips: ["RaaS", "Balance control"] },
  { img: "security.jpg", line: "Security", t: "Security Patrol Robot", d: "Autonomous patrol · thermal imaging · remote monitoring (in development)", chips: ["In development"] },
];

const PATENTS: [string, string, string, string][] = [
  ["2020", "Stair-climbing drive unit and method", "제10-2070575", "KR"],
  ["2019", "Driving method for a wheelchair power-conversion unit", "제10-2043079", "KR"],
  ["2017", "Two-wheel self-balancing scooter that keeps a straight path under external force", "제10-1716237", "KR"],
  ["2014", "Two-wheel self-balancing wheelchair", "제10-1473862", "KR"],
  ["2018", "Backpack self-balancing scooter with foot steering", "US 9,919,762 B2", "US"],
  ["2016", "Straight-path control for a two-wheel self-balancing scooter", "US 9,434,438", "US"],
  ["2016", "Two-wheel self-balancing wheelchair", "US 9,445,959", "US"],
  ["2018", "Self-balancing scooter with foldable extra footboard", "特許第6379241号", "JP"],
  ["2017", "Thigh-steered self-balancing scooter", "特許第6164661号", "JP"],
  ["2018", "Self-balancing scooter with foldable extra footboard", "DE 102017104372", "DE"],
];
const FILTERS: [string, string][] = [["all", "All"], ["KR", "Korea"], ["US", "USA"], ["JP", "Japan"], ["DE", "Germany"]];

const HISTORY = [
  ["2003", "Robo3 Co., Ltd. founded"],
  ["2006", "Korea's first two-wheel balancing service robot · Microsoft Robotics partner"],
  ["2016", "Listed on KONEX · Prime Minister's Award at the Korea Robot Awards"],
  ["2018", "Robots and mobility supplied to the PyeongChang Winter Paralympics"],
  ["2020", "Government R&D with the Seoul National University AI Institute"],
  ["2026", "Renamed from ROBO3 AI Co., Ltd. to SOLUMIX Co., Ltd."],
];

const SUPPORT = [
  { icon: I.cart, t: "Purchase & Rental", d: "We will match the right robot and rental terms to your site." },
  { icon: I.gear, t: "Technology Partnership", d: "Joint development of balance control and autonomy, plus OEM/ODM." },
  { icon: I.chart, t: "Investor Relations", d: "Information on our business and growth plans." },
  { icon: I.tool, t: "After-Sales Service", d: "Request inspection or repair for your robot." },
];
const PURPOSES = ["Purchase & Rental", "Partnership", "Investor Relations", "After-Sales"];

export default function SolumixSiteEn() {
  const [more, setMore] = useState(false);
  const [f, setF] = useState("all");
  const [purpose, setPurpose] = useState(PURPOSES[0]);
  const [sent, setSent] = useState(false);
  const [open, setOpen] = useState(false);
  const rows = PATENTS.filter((p) => f === "all" || p[3] === f);
  const cases = more ? CASES : CASES.slice(0, 4);

  return (
    <div className="smx" id="top">
      {/* 상단 바 (영상 위에 투명하게) */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#050a16]/75 backdrop-blur-md">
        <div className="mx-auto flex max-w-md items-center justify-between px-5 py-3.5">
          <a href="#top" className="flex items-center gap-2"><Mark size={26} id="hd" /><span className="brand text-[17px] font-extrabold tracking-[0.06em] text-white">SOLUMIX</span></a>
          <div className="flex items-center rounded-full border border-white/30 bg-black/30 p-0.5 text-[12.5px] font-bold" role="group" aria-label="Language"><a href="/solumix" className="rounded-full px-3 py-1.5 text-white/70">한글</a><a href="/solumix/en" className="rounded-full px-3 py-1.5 bg-[var(--sx-gold)] text-[#1a1406]">EN</a></div>
        </div>
      </header>

      {/* 오른쪽 빠른 메뉴 */}
      <nav aria-label="Quick menu" className="fixed right-3 z-40 flex flex-col gap-1.5" style={{ bottom: "calc(96px + env(safe-area-inset-bottom, 0px))" }}>
        {[[I.chat, "#contact", "Contact"], [I.robot, "#products", "Products"], [I.doc, "#tech", "Patents"], [I.pin, "#location", "Location"]].map(([ic, href, label], i) => (
          <a key={label} href={href} aria-label={label}
            className={`flex h-11 w-11 items-center justify-center rounded-lg shadow-lg ${i === 0 ? "bg-[var(--sx-gold)] text-[#1a1406]" : "bg-white text-[#0b1222]"}`}>
            <Icon d={ic} />
          </a>
        ))}
      </nav>
      <a href="#top" aria-label="Back to top" className="fixed right-3 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#0e2a5c] text-white shadow-xl ring-1 ring-white/20" style={{ bottom: "calc(28px + env(safe-area-inset-bottom, 0px))" }}>
        <Icon d={I.up} />
      </a>

      {/* HERO: 메인 영상 */}
      <section className="relative h-[100svh] min-h-[620px] overflow-hidden bg-black">
        <video className="absolute inset-0 h-full w-full object-cover" src="/solumix/video/solumix-film-en.mp4" poster="/solumix/video/solumix-film-poster.jpg"
          autoPlay muted loop playsInline preload="auto" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--sx-deep)] to-transparent" />
        <a href="#intro" className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-[11px] tracking-[0.24em] text-white/80">
          <span className="brand">SCROLL</span><span className="sx-float"><Icon d={I.down} size={18} /></span>
        </a>
      </section>

      {/* 인트로 */}
      <section id="intro" className="bg-[var(--sx-deep)] pb-16 pt-12">
        <div className="mx-auto max-w-md px-5">
          <Rise>
            <p className="brand text-[11px] font-semibold tracking-[0.28em] text-[var(--sx-champ)]">AI · ROBOTICS · SMART SOLUTIONS</p>
            <h1 className="mt-4 text-[30px] font-black leading-[1.22] tracking-tight">It is not about never falling.<br /><span className="text-[var(--sx-cyan)]">It is about finding balance again.</span></h1>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--sx-silver)]">SOLUMIX began in 2003 with Korea&rsquo;s first two-wheel balancing robot. Today that same balance control helps people through their day in restaurants, warehouses and homes.</p>
            <a href="#cases" className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[14px] font-bold text-[#0b1222]">See SOLUMIX in the field <Icon d={I.arrow} size={16} /></a>
          </Rise>
          <Rise className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--sx-line)] bg-[var(--sx-line)]">
            {[["46", "Patents (16 Korea · 30 overseas)"], ["5", "Patent countries: US·JP·DE·CN·IN"], ["2016", "Listed on KONEX"], ["20+ yrs", "Self-balancing know-how"]].map(([n, l]) => (
              <div key={l} className="bg-[var(--sx-navy)] p-5">
                <p className="brand text-[26px] font-bold text-[var(--sx-champ)]">{n}</p>
                <p className="mt-1 text-[12px] text-[var(--sx-sub)]">{l}</p>
              </div>
            ))}
          </Rise>
        </div>
      </section>

      {/* USE CASES (흰 배경) */}
      <section id="cases" className="bg-white py-16 text-[#0b1222]">
        <div className="mx-auto max-w-md px-5">
          <p className="text-[13px] font-semibold text-[#5a6782]">Use cases</p>
          <h2 className="mt-2 text-[24px] font-black leading-snug">See how our robots<br />work in the field</h2>
          <p className="mt-3 text-[14px] text-[#1f4fd1]">SOLUMIX robots taking work off people&rsquo;s hands</p>
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-6">
            {cases.map((c) => (
              <Rise key={c.t}>
                <div className="overflow-hidden rounded-xl bg-[#eef1f6]"><img src={IMG(c.img)} alt={c.t} className="aspect-[4/3] w-full object-cover" /></div>
                <span className="mt-2.5 inline-block rounded border border-[#1f4fd1]/30 px-1.5 py-0.5 text-[10.5px] font-semibold text-[#1f4fd1]">{c.tag}</span>
                <p className="mt-1.5 text-[14px] font-bold">{c.t}</p>
              </Rise>
            ))}
          </div>
          <button type="button" onClick={() => setMore(!more)} className="mx-auto mt-8 flex items-center gap-2 rounded-full border border-[#cdd4e1] px-5 py-3 text-[13.5px] font-semibold">
            {more ? "Show less" : "Show more"}<span className={`transition-transform ${more ? "rotate-180" : ""}`}><Icon d={I.down} size={16} /></span>
          </button>
        </div>
      </section>

      {/* REFERENCES (어두운 배경 + 흐르는 띠) */}
      <section className="relative overflow-hidden bg-black py-16">
        <img src={IMG("face.jpg")} alt="" className="sx-kb absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80" />
        <div className="relative mx-auto max-w-md px-5">
          <p className="text-[13px] font-semibold text-[var(--sx-champ)]">Our References</p>
          <h2 className="mt-3 text-[25px] font-black leading-snug">From national events to government R&D,<br />20 years of proof in the field</h2>
        </div>
        <div className="relative mt-10 overflow-hidden">
          <div className="sx-marquee flex gap-3">
            {[...REFS, ...REFS].map((r, i) => (
              <span key={i} className="whitespace-nowrap rounded-full border border-white/25 bg-white/5 px-4 py-2 text-[13px] font-semibold text-white/90 backdrop-blur">{r}</span>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTIONS (겹쳐 쌓이는 카드) */}
      <section id="business" className="bg-[#f2f4f8] pb-10 pt-16 text-[#0b1222]">
        <div className="mx-auto max-w-md px-5">
          <div className="flex items-end justify-between">
            <div><p className="text-[13px] font-semibold text-[#5a6782]">Solutions</p><h2 className="mt-2 text-[24px] font-black">Our Business</h2></div>
            <a href="#contact" className="flex items-center gap-1 text-[12.5px] font-semibold text-[#5a6782]">Get in touch <Icon d={I.arrow} size={14} /></a>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-md px-3">
          {SOLUTIONS.map((s, i) => (
            <div key={s.t} className="sticky mb-5 overflow-hidden rounded-[22px] shadow-xl" style={{ top: 64 + i * 14, background: s.bg, color: s.fg }}>
              <div className="px-6 pb-6 pt-7">
                <span className="inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold" style={{ borderColor: s.sub, color: s.sub }}>{s.tag}</span>
                <h3 className="mt-3 text-[30px] font-black tracking-tight">{s.t}</h3>
                <p className="mt-3 text-[14px] leading-relaxed" style={{ color: s.sub }}>{s.d}</p>
              </div>
              <img src={IMG(s.img)} alt={s.t} className="aspect-[16/10] w-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTS (어두운 배경 + 가로 넘김) */}
      <section id="products" className="bg-[var(--sx-navy)] py-16">
        <div className="mx-auto max-w-md px-5">
          <p className="text-[13px] font-semibold text-[var(--sx-champ)]">Products</p>
          <h2 className="mt-2 text-[24px] font-black leading-snug">One balancing technology,<br />a full SOLUMIX lineup</h2>
        </div>
        <div className="sx-noscroll mx-auto mt-8 flex max-w-md snap-x snap-mandatory scroll-pl-5 gap-3 overflow-x-auto px-5 pb-2">
          {PRODUCTS.map((p) => (
            <div key={p.t} className="w-[78%] shrink-0 snap-start">
              <div className="overflow-hidden rounded-2xl bg-white"><img src={IMG(p.img)} alt={p.t} className="aspect-square w-full object-cover" /></div>
              <p className="brand mt-4 text-[11.5px] tracking-wider text-[var(--sx-sub)]">{p.line}</p>
              <p className="mt-1 text-[21px] font-black">{p.t}</p>
              <p className="mt-1.5 text-[13.5px] text-[var(--sx-silver)]">{p.d}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.chips.map((c) => <span key={c} className="rounded-md bg-[#1f4fd1]/30 px-2.5 py-1 text-[11.5px] font-semibold text-[#9cc0ff]">{c}</span>)}
              </div>
            </div>
          ))}
          <div className="w-2 shrink-0" />
        </div>
        <p className="mx-auto mt-4 max-w-md px-5 text-[11.5px] text-[var(--sx-sub)]">Swipe to see more →</p>
      </section>

      {/* TECHNOLOGY */}
      <section id="tech" className="bg-[var(--sx-deep)] py-16">
        <div className="mx-auto max-w-md px-5">
          <p className="text-[13px] font-semibold text-[var(--sx-champ)]">Technology</p>
          <h2 className="mt-2 text-[24px] font-black leading-snug">Pushed, it still goes straight:<br />AST straight-path control</h2>
          <div className="relative mt-7 overflow-hidden rounded-2xl">
            <img src={IMG("tech-wheel.jpg")} alt="SOLUMIX robot wheel" className="aspect-[4/5] w-full object-cover" />
            <p className="brand absolute left-4 top-4 text-[44px] font-extrabold leading-none tracking-tight text-white/20">BALANCE</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Patent filter">
            {FILTERS.map(([k, label]) => (
              <button key={k} type="button" aria-pressed={f === k} onClick={() => setF(k)}
                className={`rounded-full border px-3.5 py-1.5 text-[12.5px] ${f === k ? "border-[var(--sx-gold)] bg-[var(--sx-gold)] font-bold text-[#1a1406]" : "border-[var(--sx-line)] text-[var(--sx-silver)]"}`}>{label}</button>
            ))}
          </div>
          <div className="mt-3 overflow-x-auto rounded-2xl border border-[var(--sx-line)]">
            <table className="w-full min-w-[440px] border-collapse text-[13px]">
              <thead><tr className="text-left text-[11px] text-[var(--sx-sub)]"><th className="px-3 py-2.5 font-normal">Year</th><th className="px-3 py-2.5 font-normal">Title</th><th className="px-3 py-2.5 font-normal">No.</th></tr></thead>
              <tbody>
                {rows.map((p, i) => (
                  <tr key={i} className="border-t border-[var(--sx-line)] align-top">
                    <td className="brand px-3 py-2.5 text-[12px] text-[var(--sx-cyan)]">{p[0]}</td><td className="px-3 py-2.5">{p[1]}</td><td className="brand whitespace-nowrap px-3 py-2.5 text-[12px] text-[var(--sx-champ)]">{p[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[12px] text-[var(--sx-sub)]">Selected registered patents. SOLUMIX holds 46 in total (16 in Korea, 30 overseas).</p>
        </div>
      </section>

      {/* STORY */}
      <section className="bg-[var(--sx-navy)] py-16">
        <div className="mx-auto max-w-md px-5">
          <p className="text-[13px] font-semibold text-[var(--sx-champ)]">Our Story</p>
          <h2 className="mt-2 text-[24px] font-black leading-snug">From a small robot on a workbench<br />to the SOLUMIX of today</h2>
          <div className="mt-7 overflow-hidden rounded-2xl"><img src={IMG("hero.jpg")} alt="A glowing robotic hand holding a leaf" className="aspect-[4/5] w-full object-cover object-center" /></div>
          <ol className="mt-8 border-l border-[var(--sx-line)] pl-5">
            {HISTORY.map(([y, t]) => (
              <li key={y} className="relative pb-5 last:pb-0">
                <span className="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--sx-gold)]" />
                <p className="brand text-[13px] font-bold text-[var(--sx-champ)]">{y}</p>
                <p className="mt-0.5 text-[14px] text-[var(--sx-silver)]">{t}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* SUPPORT (밝은 카드) */}
      <section id="contact" className="bg-[#f2f4f8] py-16 text-[#0b1222]">
        <div className="mx-auto max-w-md px-5">
          <p className="text-[13px] font-semibold text-[#5a6782]">Support</p>
          <h2 className="mt-2 text-[24px] font-black">How can we help?</h2>
          <div className="mt-7 grid gap-3">
            {SUPPORT.map((s, i) => (
              <button key={s.t} type="button" onClick={() => setPurpose(PURPOSES[i])}
                className={`flex items-center justify-between gap-4 rounded-2xl bg-white p-5 text-left shadow-sm ring-1 ${purpose === PURPOSES[i] ? "ring-[#1f4fd1]" : "ring-transparent"}`}>
                <span><span className="block text-[16px] font-bold">{s.t}</span><span className="mt-1 block text-[13px] text-[#5a6782]">{s.d}</span></span>
                <span className="shrink-0 text-[#1f4fd1]"><Icon d={s.icon} size={30} /></span>
              </button>
            ))}
          </div>
          <form className="mt-6 grid gap-3 rounded-2xl bg-white p-5 shadow-sm" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <p className="text-[13px] font-semibold text-[#1f4fd1]">Topic: {purpose}</p>
            {[["smx-nm", "Name / Company", "Jane Kim / ABC Foods"], ["smx-ph", "Phone or email", "+82 10-0000-0000"]].map(([id, l, ph]) => (
              <label key={id} htmlFor={id} className="grid gap-1.5 text-[12.5px] text-[#5a6782]">{l}
                <input id={id} placeholder={ph} className="rounded-xl border border-[#d6dce7] bg-[#f7f8fb] px-3 py-3 text-[16px] text-[#0b1222] outline-none focus:border-[#1f4fd1]" />
              </label>
            ))}
            <label htmlFor="smx-msg" className="grid gap-1.5 text-[12.5px] text-[#5a6782]">Message
              <textarea id="smx-msg" rows={4} placeholder="e.g. We are considering serving-robot rentals for two stores." className="rounded-xl border border-[#d6dce7] bg-[#f7f8fb] px-3 py-3 text-[16px] text-[#0b1222] outline-none focus:border-[#1f4fd1]" />
            </label>
            <button type="submit" className="rounded-xl bg-[#0e2a5c] py-3.5 text-[15px] font-bold text-white">Send inquiry</button>
            <p className="min-h-[1em] text-[12.5px] text-[#b45309]" aria-live="polite">{sent ? "This is a preview. After launch, inquiries go straight to our team." : ""}</p>
          </form>
          <dl id="location" className="mt-6 grid gap-2.5 rounded-2xl bg-white p-5 text-[14px] shadow-sm">
            {[["Phone", "+82-2-544-9145"], ["Fax", "+82-2-544-9146"], ["Email", "robo1@robo3.com"], ["Address", "B-508, Gangdong U1 Center, 26 Godeokbizvalley-ro, Gangdong-gu, Seoul, Korea"]].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[72px_1fr] gap-3"><dt className="text-[13px] text-[#5a6782]">{k}</dt><dd className="select-all font-medium">{v}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      <footer className="bg-[#070b14] py-10 text-[12.5px] text-[var(--sx-sub)]">
        <div className="mx-auto max-w-md px-5">
          <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between border-b border-white/10 pb-4 text-[13.5px] font-semibold text-white/80">
            Site menu<span className={`transition-transform ${open ? "rotate-180" : ""}`}><Icon d={I.down} size={16} /></span>
          </button>
          {open && (
            <div className="grid grid-cols-2 gap-y-2.5 py-4 text-[13px]">
              {[["Use cases", "#cases"], ["Business", "#business"], ["Products", "#products"], ["Technology", "#tech"], ["Contact", "#contact"], ["Location", "#location"]].map(([l, h]) => <a key={l} href={h}>{l}</a>)}
            </div>
          )}
          <div className="mt-6 flex items-center gap-2 text-white"><Mark size={24} id="ft" /><span className="brand font-extrabold tracking-[0.06em]">SOLUMIX</span></div>
          <p className="mt-3">SOLUMIX Co., Ltd. (formerly ROBO3 AI Co., Ltd.) · CEO Hwang Yong-un</p>
          <p className="mt-1">Business Reg. No. 206-81-84723</p>
          <p className="brand mt-3 tracking-wider">© 2026 SOLUMIX · Intelligence in Motion</p>
        </div>
      </footer>
    </div>
  );
}
