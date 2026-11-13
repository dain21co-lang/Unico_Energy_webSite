"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ROOMS, SERVICE, COLORS, LABEL, PLATE, WING, CORE, EV, ESTAIR_TYP, ESTAIR_LOW, countRooms } from "./model";
import type { FloorKind, Rect } from "./model";

/*
 * SEMESTER HOUSE · 신촌 스마트호스텔(가칭) — ORBIT
 * dot 시안(Grand Journey Refined)을 뼈대로, Original Lines(도면이 그려지는 연출)·Blue Space(아치 카드)를 합친 완성본
 * 원칙: 투명도 애니메이션 없음 — 위치·크기·마스크(clip-path)·선 그리기만 사용
 */
const Building3D = dynamic(() => import("./Building3D"), { ssr: false });
const IMG = (f: string) => `/sinchon/${f}.webp`;
const EASE = [0.16, 1, 0.3, 1] as const;
const C = countRooms();
const TOTAL = C.s + C.t + C.sh;
const BEDS = C.s + C.t * 2 + C.sh * 3;
/* 언어: false = 한국어, true = English */
const LangCtx = createContext(false);
const useEN = () => useContext(LangCtx);
const LBL = (en: boolean) => (en ? { s: "Single", t: "Twin", sh: "Triple share" } : LABEL);

/* ───────── 공통 ───────── */
function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, margin: "-12% 0px" });
  return (
    <div ref={ref} className={className}>
      <motion.div initial={{ clipPath: "inset(0% 0% 100% 0%)", y: 26 }} animate={on ? { clipPath: "inset(0% 0% 0% 0%)", y: 0 } : {}} transition={{ duration: 0.9, delay, ease: EASE }}>
        {children}
      </motion.div>
    </div>
  );
}
function Head({ kick, a, b, sub, dark = true }: { kick: string; a: string; b: string; sub?: ReactNode; dark?: boolean }) {
  return (
    <div>
      <Reveal><p className="kick" style={{ color: dark ? "var(--o-sub)" : "#7a7466" }}>{kick}</p></Reveal>
      <Reveal delay={0.08}>
        <h2 className="serif mt-4 text-[46px] leading-[0.98] tracking-[-0.01em]">
          {a}
          <br />
          <em>{b}</em>
        </h2>
      </Reveal>
      {sub && (
        <Reveal delay={0.16}>
          <p className="mt-5 text-[15px] font-medium leading-[1.75]" style={{ color: dark ? "#c9d4de" : "#4a4f55" }}>{sub}</p>
        </Reveal>
      )}
    </div>
  );
}
function Badge({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <span className="inline-block rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.06em]" style={{ background: light ? "rgba(255,255,255,0.86)" : "rgba(18,26,34,0.72)", color: light ? "#1d2630" : "#e8eef4" }}>
      {children}
    </span>
  );
}
/* ───────── 1. 3D 여정 (스크롤 고정) ───────── */
const CHAPTERS = [
  { n: "01", en: "THE ARRIVAL", kick: "01 / IMAGINE A NEW CHAPTER", a: "Form.", b: "In motion.", sub: "선이 펼쳐지고, 층이 올라가고.\n새로운 신촌이 모습을 갖춥니다.", subE: "Lines unfold, floors rise.\nA new Sinchon takes shape." },
  { n: "02", en: "THE REVEAL", kick: "02 / A DIFFERENT PERSPECTIVE", a: "See it", b: "differently.", sub: "2004년 원도면 치수 그대로.\n9개 층, 하나의 건물을 다른 시선으로.", subE: "True to the original 2004 drawings.\nNine floors, one building, a new view." },
  { n: "03", en: "THE LAYERS", kick: "03 / OPEN UP THE POSSIBILITIES", a: "Room for", b: "new stories.", sub: "층을 펼치면 객실이 보입니다.\n2층부터 9층까지 54개의 방.", subE: "Open the floors and the rooms appear.\n54 rooms from the 2nd to the 9th floor." },
  { n: "04", en: "THE HORIZON", kick: "04 / ONE BUILDING", a: "One city.", b: "New life.", sub: "하루 숙박부터 한 학기까지,\n신촌의 첫 서울집.", subE: "From one night to a full semester —\nyour first home in Seoul." },
];
const FLOOR_LIST: [string, string, string][] = [["9F", "1인실 4", "Single 4"], ["8F", "1인실 5 · 2인실 1", "Single 5 · Twin 1"], ["7F", "1인실 5 · 2인실 1", "Single 5 · Twin 1"], ["6F", "1인실 5 · 2인실 1", "Single 5 · Twin 1"], ["5F", "1인실 5 · 2인실 1", "Single 5 · Twin 1"], ["4F", "1인실 5 · 2인실 1", "Single 5 · Twin 1"], ["3F", "셰어 5 · 2인실 3 · 1인실 2", "Share 5 · Twin 3 · Single 2"], ["2F", "셰어 5 · 2인실 3 · 1인실 2", "Share 5 · Twin 3 · Single 2"], ["1F", "리셉션 · 카페 라운지", "Reception · Café lounge"]];

function Journey({ paused }: { paused: React.MutableRefObject<boolean> }) {
  const wrap = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [ch, setCh] = useState(0);
  const [pct, setPct] = useState(0);
  const en = useEN();
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const el = wrap.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
      progress.current = p;
      setPct(p);
      setCh(p < 0.25 ? 0 : p < 0.5 ? 1 : p < 0.8 ? 2 : 3);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);
  const c = CHAPTERS[ch];
  return (
    <section ref={wrap} id="top" style={{ height: "440vh" }} className="relative">
      <div className="stage grain sticky top-0 h-[100svh] overflow-hidden">
        <Building3D progress={progress} paused={paused} className="absolute inset-x-0 bottom-0 top-[25%]" />
        {/* 문구 */}
        <div className="pointer-events-none absolute inset-x-0 top-[78px] px-6">
          <AnimatePresence mode="wait">
            <motion.div key={c.n} initial={{ clipPath: "inset(0% 0% 100% 0%)", y: 22 }} animate={{ clipPath: "inset(0% 0% 0% 0%)", y: 0 }} exit={{ clipPath: "inset(0% 0% 0% 100%)", y: -10 }} transition={{ duration: 0.7, ease: EASE }}>
              <p className="kick" style={{ color: "var(--o-sub)" }}>{c.kick}</p>
              <h1 className="serif mt-3 text-[54px] leading-[0.94]">
                {c.a}
                <br />
                <em>{c.b}</em>
              </h1>
              <p className="mt-4 whitespace-pre-line text-[14.5px] font-medium leading-[1.7]" style={{ color: "#d3dce5" }}>{en ? c.subE : c.sub}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        {/* 03 단계: 층별 목록과 범례 */}
        <motion.div className="pointer-events-none absolute right-3 top-[44%] w-[148px]" initial={false} animate={{ clipPath: ch === 2 ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 0% 100%)", x: ch === 2 ? 0 : 20 }} transition={{ duration: 0.7, ease: EASE }}>
          <div className="glass rounded-2xl px-3 py-2.5">
            {FLOOR_LIST.map(([f, d, de]) => (
              <div key={f} className="flex items-baseline gap-2 py-[3px]">
                <span className="serif w-6 text-[15px] italic" style={{ color: "var(--o-gold)" }}>{f}</span>
                <span className="text-[10.5px] font-medium leading-tight text-[#dfe7ee]">{en ? de : d}</span>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div className="pointer-events-none absolute inset-x-5 bottom-[92px]" initial={false} animate={{ clipPath: ch >= 2 ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)", y: ch >= 2 ? 0 : 16 }} transition={{ duration: 0.7, ease: EASE }}>
          <div className="glass flex items-center justify-between rounded-2xl px-4 py-3">
            {(["s", "t", "sh"] as const).map((t) => (
              <div key={t} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-[3px]" style={{ background: COLORS[t] }} />
                <span className="text-[12px] font-bold">{LBL(en)[t]} <span className="serif text-[17px] italic">{C[t]}</span></span>
              </div>
            ))}
          </div>
        </motion.div>
        {/* 장 번호 · 진행 */}
        <div className="pointer-events-none absolute bottom-7 left-6 right-24 flex items-end gap-3">
          <span className="serif text-[44px] italic leading-none">{c.n}</span>
          <div className="mb-1.5 flex-1">
            <p className="kick text-[10px]" style={{ color: "#dfe7ee" }}>{c.en}</p>
            <div className="mt-2 h-px w-full bg-white/15">
              <div className="h-px origin-left bg-[var(--o-line)]" style={{ transform: `scaleX(${pct})` }} />
            </div>
          </div>
        </div>
        <motion.p className="nudge pointer-events-none absolute bottom-[150px] left-0 right-0 text-center text-[11px] font-bold tracking-[0.2em] text-white/70" initial={false} animate={{ y: pct < 0.03 ? 0 : 60, clipPath: pct < 0.03 ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" }}>
          {en ? "↓ Scroll down · drag to rotate" : "↓ 아래로 밀어 보세요 · 손가락으로 돌려 보세요"}
        </motion.p>
      </div>
    </section>
  );
}

/* ───────── 2. 원도면 · 객실 배치 ───────── */
const PLAN_TABS: { k: FloorKind; label: string; labelE: string; cad: string; sum: string; sumE: string; note: string; noteE: string }[] = [
  { k: "f23", label: "2·3층", labelE: "2F · 3F", cad: "orbit-cad-2f", sum: "층당 10실 · 셰어룸 5 + 2인실 3 + 1인실 2", sumE: "10 rooms per floor · 5 share + 3 twin + 2 single", note: "동측 날개까지 넓은 층 — 그룹·어학연수생", noteE: "The widest floors, with the east wing — for groups and language students" },
  { k: "typ", label: "4~8층", labelE: "4F – 8F", cad: "orbit-cad-typ", sum: "층당 6실 · 1인실 5 + 2인실 1", sumE: "6 rooms per floor · 5 single + 1 twin", note: "기준층 — 모든 객실 개별 욕실, 기존 화장실 자리는 린넨·세탁", noteE: "Typical floor — private bathroom in every room; the old washrooms become linen & laundry" },
  { k: "f9", label: "9층", labelE: "9F", cad: "orbit-cad-9f", sum: "4실 · 1인실 4 + 지붕발코니", sumE: "4 rooms · 4 single + roof balcony", note: "가장 조용한 꼭대기 층", noteE: "The quietest floor, at the very top" },
];
const SVC_E: Record<string, string> = { 린넨: "Linen", 지붕발코니: "Roof balcony", 복도: "Corridor" };

function PlanSvg({ k }: { k: FloorKind }) {
  const en = useEN();
  const wide = k === "f23";
  const minX = -0.8, maxX = wide ? 27.3 : 16.2, minZ = wide ? -5.2 : -0.8, maxZ = 18.4;
  const W = maxX - minX, H = maxZ - minZ;
  const blocks: Rect[] = [PLATE, CORE, EV, ...(wide ? [WING, ESTAIR_LOW] : [ESTAIR_TYP])];
  const rect = ([x0, z0, x1, z1]: Rect) => ({ x: x0, y: z0, width: x1 - x0, height: z1 - z0 });
  return (
    <svg viewBox={`${minX} ${minZ} ${W} ${H}`} className="h-full w-full">
      {blocks.map((b, i) => (
        <motion.rect key={`b${i}`} {...rect(b)} fill="none" stroke="#d7e7ff" strokeWidth={0.12} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, delay: i * 0.08, ease: EASE }} />
      ))}
      {SERVICE[k].map((s, i) => (
        <g key={`s${i}`}>
          <rect {...rect(s.r)} fill="rgba(215,231,255,0.06)" stroke="none" />
          {s.label !== "복도" && (
            <text x={(s.r[0] + s.r[2]) / 2} y={(s.r[1] + s.r[3]) / 2} fontSize={0.62} fill="#a9b8c6" textAnchor="middle" dominantBaseline="middle" fontWeight={700}>{en ? SVC_E[s.label] ?? s.label : s.label}</text>
          )}
        </g>
      ))}
      {ROOMS[k].map((r, i) => {
        const [x0, z0, x1, z1] = r.r;
        const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
        return (
          <g key={`r${i}`}>
            <motion.rect x={x0 + 0.1} y={z0 + 0.1} width={x1 - x0 - 0.2} height={z1 - z0 - 0.2} rx={0.25} fill={COLORS[r.t]} style={{ transformOrigin: `${cx}px ${cz}px`, transformBox: "view-box" }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.6, delay: 0.6 + i * 0.07, ease: EASE }} />
            <text x={cx} y={cz} fontSize={x1 - x0 < 2.4 ? 0.5 : 0.72} fill="#1d2630" textAnchor="middle" dominantBaseline="middle" fontWeight={800}>{en ? (r.t === "sh" ? "Share" : LBL(true)[r.t]) : r.t === "sh" ? "셰어" : LABEL[r.t]}</text>
          </g>
        );
      })}
      <text x={(CORE[0] + CORE[2]) / 2} y={(CORE[1] + CORE[3]) / 2} fontSize={0.62} fill="#a9b8c6" textAnchor="middle" dominantBaseline="middle" fontWeight={700}>{en ? "Stair · Hall" : "계단 · 홀"}</text>
      <text x={(EV[0] + EV[2]) / 2} y={(EV[1] + EV[3]) / 2} fontSize={0.6} fill="#a9b8c6" textAnchor="middle" dominantBaseline="middle" fontWeight={700}>EV</text>
      <text x={0} y={-0.25 + (wide ? 0 : 0)} fontSize={0.6} fill="#74869a">12.2m × 10.4m</text>
    </svg>
  );
}

function Plans() {
  const [tab, setTab] = useState(1);
  const [mode, setMode] = useState<"cad" | "rooms">("rooms");
  const en = useEN();
  const t = PLAN_TABS[tab];
  return (
    <section id="plans" className="relative px-6 pb-20 pt-24" style={{ background: "linear-gradient(180deg,#121a22 0%,#1a2430 100%)" }}>
      <Head kick="05 / THE ORIGINAL LINES" a="Every future." b="Begins with a line." sub={en ? <>Imagination, grounded in the original lines.<br />A draft room plan laid over the 2004 drawings.</> : <>상상에 근거를 더하는 원래의 선.<br />2004년 원도면 위에 객실 배치(안)를 올렸습니다.</>} />
      <div className="mt-8 flex gap-2">
        {PLAN_TABS.map((p, i) => (
          <button key={p.k} onClick={() => setTab(i)} className="relative flex-1 rounded-full py-3 text-[14px] font-bold" style={{ color: i === tab ? "#121a22" : "#dfe7ee" }}>
            {i === tab && <motion.span layoutId="ptab" className="absolute inset-0 rounded-full" style={{ background: "var(--o-line)" }} transition={{ duration: 0.45, ease: EASE }} />}
            {i !== tab && <span className="pill absolute inset-0" />}
            <span className="relative">{en ? p.labelE : p.label}</span>
          </button>
        ))}
      </div>
      <div className="glass relative mt-4 overflow-hidden rounded-[22px] p-3">
        <div className="mb-2 flex items-center justify-between px-1">
          <p className="kick text-[9.5px]" style={{ color: "var(--o-sub)" }}>{mode === "cad" ? "ORIGINAL CAD · 2004" : (en ? "ROOM PLAN · DRAFT" : "ROOM PLAN · 배치(안)")}</p>
          <div className="relative flex rounded-full bg-black/25 p-0.5 text-[11.5px] font-bold">
            {(["rooms", "cad"] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)} className="relative rounded-full px-3 py-1.5" style={{ color: mode === m ? "#121a22" : "#c9d4de" }}>
                {mode === m && <motion.span layoutId="pmode" className="absolute inset-0 rounded-full" style={{ background: "var(--o-gold)" }} transition={{ duration: 0.35 }} />}
                <span className="relative">{m === "rooms" ? (en ? "Rooms" : "객실 배치") : en ? "Original" : "원도면"}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="relative aspect-[1.23] w-full overflow-hidden rounded-[14px]" style={{ background: "#121a22" }}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={`${t.k}-${mode}`} className="absolute inset-0 flex items-center justify-center p-2" initial={{ clipPath: "inset(0% 100% 0% 0%)" }} animate={{ clipPath: "inset(0% 0% 0% 0%)" }} exit={{ clipPath: "inset(0% 0% 0% 100%)" }} transition={{ duration: 0.8, ease: EASE }}>
              {mode === "cad" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={IMG(t.cad)} alt={en ? `${t.labelE} original drawing (2004)` : `${t.label} 원도면(2004)`} className="h-full w-full object-contain" />
              ) : (
                <PlanSvg k={t.k} />
              )}
            </motion.div>
          </AnimatePresence>
          <div className="scan pointer-events-none absolute inset-x-0 top-0 h-1/3" style={{ background: "linear-gradient(180deg,transparent,rgba(142,219,211,0.07),transparent)" }} />
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={t.k} initial={{ clipPath: "inset(0% 0% 100% 0%)", y: 12 }} animate={{ clipPath: "inset(0% 0% 0% 0%)", y: 0 }} exit={{ clipPath: "inset(100% 0% 0% 0%)" }} transition={{ duration: 0.5, ease: EASE }} className="mt-5">
          <p className="serif text-[30px] italic leading-tight">{en ? t.labelE : t.label}</p>
          <p className="mt-1 text-[17px] font-black">{en ? t.sumE : t.sum}</p>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#b9c6d2]">{en ? t.noteE : t.note}</p>
        </motion.div>
      </AnimatePresence>
      <div className="mt-6 grid grid-cols-3 gap-2">
        {(["s", "t", "sh"] as const).map((k) => (
          <div key={k} className="rounded-2xl border border-white/10 px-3 py-3">
            <span className="block h-1.5 w-8 rounded-full" style={{ background: COLORS[k] }} />
            <p className="mt-2 text-[12px] font-bold text-[#c9d4de]">{LBL(en)[k]}</p>
            <p className="serif text-[30px] italic leading-none">{C[k]}<span className="ml-0.5 text-[14px] not-italic">{en ? " rooms" : "실"}</span></p>
          </div>
        ))}
      </div>
      <p className="mt-5 text-[11.5px] leading-[1.7] text-[#8193a6]">{en ? "The originals are images of the 2004 drawings with the title block hidden. The room plan is a schematic draft based on their dimensions, to be finalised after structural, plumbing and permit review." : "원도면은 2004년 도면 이미지이며 표제란은 가렸습니다. 객실 배치는 원도면 치수를 기준으로 한 개략(안)이며, 구조·배관·인허가 검토 후 확정합니다."}</p>
    </section>
  );
}

/* ───────── 3. 생활 (아이보리) ───────── */
const ROOM_CARDS = [
  { img: "room-single", t: "1인실", tE: "Single", size: "약 16㎡", sizeE: "approx. 16㎡", n: C.s, d: "책상·수납·개별 욕실. 나만의 속도로.", dE: "Desk, storage and a private bathroom. Live at your own pace." },
  { img: "room-twin", t: "2인실", tE: "Twin", size: "약 18~20㎡", sizeE: "approx. 18–20㎡", n: C.t, d: "친구·형제와 함께, 각자의 침대와 책상.", dE: "Share with a friend or sibling — your own bed and desk each." },
  { img: "room-triple", t: "3인 셰어룸", tE: "Triple share", size: "약 26㎡", sizeE: "approx. 26㎡", n: C.sh, d: "어학연수·교환학생 그룹을 위한 넓은 방.", dE: "A roomy space for language-course and exchange-student groups." },
];
const LIFE = [
  { img: "orbit-room", t: "나에게 돌아오는 방", tE: "A room to come home to", en: "PRIVATE ROOM" },
  { img: "orbit-study", t: "함께 자라는 시간", tE: "Time to grow together", en: "STUDY & COMMUNITY" },
  { img: "orbit-dinner", t: "한 끼에서 시작되는 인연", tE: "Friendships that start over a meal", en: "SHARED KITCHEN" },
];

function RoomCarousel() {
  const box = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const en = useEN();
  return (
    <div>
      <div ref={box} className="snap -mx-6 flex gap-4 px-6 pb-2" onScroll={(e) => { const el = e.currentTarget; setI(Math.round(el.scrollLeft / (el.clientWidth * 0.78))); }}>
        {ROOM_CARDS.map((r) => (
          <div key={r.t} className="w-[74%] shrink-0">
            <div className="arch relative aspect-[3/4.3] bg-[#ddd6c6]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG(r.img)} alt={en ? `${r.tE} concept` : `${r.t} 콘셉트`} className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute left-3 top-[18%]"><Badge light>{en ? "AI image · sample" : "AI 이미지 · 예시"}</Badge></div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="text-[19px] font-black">{en ? r.tE : r.t}</p>
              <p className="serif text-[22px] italic">{r.n}{en ? " rooms" : "실"}</p>
            </div>
            <p className="text-[12.5px] font-bold text-[#8a7d62]">{en ? `${r.sizeE} · one night to a semester` : `${r.size} · 하루부터 한 학기까지`}</p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-[#4a4f55]">{en ? r.dE : r.d}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-1.5">
        {ROOM_CARDS.map((_, k) => (
          <span key={k} className="h-1.5 rounded-full bg-[#1d2630] transition-all" style={{ width: k === Math.min(i, ROOM_CARDS.length - 1) ? 22 : 6, background: k === Math.min(i, ROOM_CARDS.length - 1) ? "#1d2630" : "#c9c1b0" }} />
        ))}
      </div>
    </div>
  );
}

function Life() {
  const en = useEN();
  return (
    <section id="life" className="paper relative px-6 pb-20 pt-24">
      <Head dark={false} kick="06 / LIFE IN FULL COLOUR" a="Not just a room." b="Your Seoul." sub={en ? <>The moment lines turn into the warmth of daily life.<br />Every room has a private bathroom and comes fully furnished.</> : <>공간의 선이 생활의 온도로 바뀌는 순간.<br />모든 객실에 개별 욕실, 가구는 모두 갖춰져 있습니다.</>} />
      <div className="mt-9"><RoomCarousel /></div>
      <div className="mt-16 space-y-10">
        {LIFE.map((l, i) => (
          <Reveal key={l.t}>
            <div className={`flex items-end gap-4 ${i % 2 ? "flex-row-reverse" : ""}`}>
              <div className="arch relative aspect-[9/14] w-[58%] shrink-0 bg-[#ddd6c6]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={IMG(l.img)} alt={en ? l.tE : l.t} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className={`pb-3 ${i % 2 ? "text-right" : ""}`}>
                <p className="kick text-[9.5px] text-[#8a7d62]">{l.en}</p>
                <p className="mt-2 text-[18px] font-black leading-snug">{en ? l.tE : l.t}</p>
                <p className="mt-1 text-[11.5px] text-[#8a8577]">{en ? "Space concept · AI image" : "공간 연출 예시 · AI 이미지"}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Rooftop() {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, margin: "-20% 0px" });
  const en = useEN();
  return (
    <section ref={ref} className="relative h-[92svh] overflow-hidden">
      <motion.div className="absolute inset-0" initial={{ clipPath: "inset(14% 10% 14% 10% round 28px)", scale: 1.12 }} animate={on ? { clipPath: "inset(0% 0% 0% 0% round 0px)", scale: 1 } : {}} transition={{ duration: 1.4, ease: EASE }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={IMG("orbit-roof")} alt={en ? "Rooftop lounge concept" : "옥상 휴식 공간 콘셉트"} className="h-full w-full object-cover" />
      </motion.div>
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(18,26,34,0.78) 0%,rgba(18,26,34,0) 38%,rgba(18,26,34,0) 60%,rgba(18,26,34,0.85) 100%)" }} />
      <div className="absolute inset-x-6 top-20">
        <p className="kick text-[#e6ecf2]">A DIFFERENT KIND OF STAY</p>
        <h2 className="serif mt-3 text-[48px] leading-[0.96]">Above the city.<br /><em>Closer to life.</em></h2>
      </div>
      <div className="absolute inset-x-6 bottom-10">
        <p className="text-[15px] font-medium leading-[1.75] text-[#e6ecf2]">{en ? <>A busy city and a quiet day of your own.<br />Find the balance on the 4F roof garden and the 9F roof balcony.</> : <>분주한 도시와 고요한 나의 하루.<br />4층 옥상정원과 9층 지붕발코니에서 그 사이의 균형을.</>}</p>
        <div className="mt-3"><Badge>{en ? "Space concept · AI image" : "공간 연출 예시 · AI 이미지"}</Badge></div>
      </div>
    </section>
  );
}

/* ───────── 4. 스마트 운영 ───────── */
const STEPS = [
  { en: "BOOK", t: "다국어 예약", tE: "Book in your language", d: "웹·앱에서 1박부터 한 학기까지 고르고 결제", dE: "Choose anything from one night to a semester on web or app, and pay" },
  { en: "ARRIVE", t: "줄 서지 않는 입실", tE: "No queue at check-in", d: "도착 전날 받은 비밀번호로 바로 객실까지", dE: "Go straight to your room with the code sent the day before" },
  { en: "LIVE", t: "AI 생활 안내", tE: "AI concierge", d: "한·영·중·일 24시간 안내, 수리 접수, 시설 예약", dE: "24/7 help in Korean, English, Chinese and Japanese — repairs, bookings" },
  { en: "EXTEND", t: "앱에서 바로 연장", tE: "Extend in the app", d: "단기 숙박을 학기 플랜으로 그대로 전환", dE: "Turn a short stay into a semester plan in a tap" },
  { en: "LEAVE", t: "가벼운 퇴실", tE: "Leave light", d: "짐은 지하 보관창고에, 다음 학기 재예약", dE: "Keep your things in basement storage and rebook next semester" },
];
function Smart() {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, margin: "-25% 0px" });
  const en = useEN();
  return (
    <section id="smart" className="relative px-6 pb-20 pt-24" style={{ background: "#1a2430" }}>
      <Head kick="07 / SMART STAY" a="Five steps." b="No front desk." sub={en ? "From booking to check-out, a smart hostel day that runs on your phone." : "예약부터 퇴실까지, 휴대폰 하나로 이어지는 스마트호스텔의 하루."} />
      <div ref={ref} className="relative mt-10 pl-8">
        <motion.span className="absolute left-[7px] top-2 bottom-2 w-px origin-top" style={{ background: "linear-gradient(180deg,var(--o-mint),var(--o-gold))" }} initial={{ scaleY: 0 }} animate={on ? { scaleY: 1 } : {}} transition={{ duration: 1.6, ease: EASE }} />
        {STEPS.map((s, i) => (
          <motion.div key={s.en} className="relative pb-7 last:pb-0" initial={{ clipPath: "inset(0% 100% 0% 0%)", x: -10 }} animate={on ? { clipPath: "inset(0% 0% 0% 0%)", x: 0 } : {}} transition={{ duration: 0.7, delay: 0.25 + i * 0.22, ease: EASE }}>
            <span className="absolute -left-8 top-1 h-[15px] w-[15px] rounded-full border-2" style={{ borderColor: i < 2 ? "var(--o-mint)" : "var(--o-gold)", background: "#1a2430" }} />
            <p className="kick text-[10px]" style={{ color: i < 2 ? "var(--o-mint)" : "var(--o-gold)" }}>0{i + 1} · {s.en}</p>
            <p className="mt-1 text-[18px] font-black">{en ? s.tE : s.t}</p>
            <p className="mt-0.5 text-[13.5px] leading-relaxed text-[#b9c6d2]">{en ? s.dE : s.d}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-12 grid grid-cols-2 gap-2.5">
        {(en ? [["1F", "Reception · Café lounge", "The neighbourhood living room"], ["B1", "Storage · Billiards lounge", "Keep your things between semesters"], ["B2", "Fitness · PT", "Residents + outside members"], ["4F·9F", "Roof garden · Roof balcony", "A breather above the city"]] : [["1F", "리셉션 · 카페 라운지", "누구나 들르는 동네 거실"], ["B1", "보관창고 · 당구 라운지", "학기 사이 짐 보관"], ["B2", "피트니스 · PT", "입주자 + 외부 회원"], ["4F·9F", "옥상정원 · 지붕발코니", "도시 위의 쉼"]]).map(([f, t, d]) => (
          <Reveal key={f}>
            <div className="h-full rounded-2xl border border-white/10 p-4">
              <p className="serif text-[26px] italic leading-none" style={{ color: "var(--o-gold)" }}>{f}</p>
              <p className="mt-2 text-[14px] font-bold leading-snug">{t}</p>
              <p className="mt-1 text-[12px] text-[#9fb0c0]">{d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ───────── 5. 외관 전후 ───────── */
function Exterior() {
  const [v, setV] = useState(50);
  const en = useEN();
  return (
    <section id="exterior" className="relative px-6 pb-20 pt-24" style={{ background: "linear-gradient(180deg,#1a2430,#121a22)" }}>
      <Head kick="08 / THE EXTERIOR STUDY" a="From drawing." b="Into dimension." sub={en ? "Thin lines gain light and depth. Slide to compare today with a remodelling concept." : "가느다란 선에 빛과 깊이가 더해집니다. 손가락으로 밀어 지금과 리모델링 후 예시를 비교해 보세요."} />
      <div className="relative mt-8 aspect-[941/1300] w-full overflow-hidden rounded-[24px] bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={IMG("after-exterior-day")} alt={en ? "Remodelling concept" : "리모델링 후 예시"} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0% ${100 - v}% 0% 0%)` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMG("before-exterior")} alt={en ? "Today (signage blurred)" : "현재 모습(간판 흐림 처리)"} className="absolute inset-0 h-full w-full object-cover" style={{ filter: "grayscale(0.35) contrast(1.05)" }} />
        </div>
        <div className="pointer-events-none absolute inset-y-0 w-px bg-white" style={{ left: `${v}%` }}>
          <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[15px] font-black text-[#121a22] shadow-lg">⇆</span>
        </div>
        <div className="absolute left-3 top-3"><Badge>{en ? "Today" : "지금"}</Badge></div>
        <div className="absolute right-3 top-3"><Badge light>{en ? "Remodelling concept · AI image" : "리모델링 후 예시 · AI 이미지"}</Badge></div>
        <input type="range" min={0} max={100} value={v} onChange={(e) => setV(Number(e.target.value))} className="cmp absolute inset-0 cursor-ew-resize" aria-label={en ? "Before and after" : "전후 비교"} />
      </div>
      <p className="mt-4 text-[11.5px] leading-[1.7] text-[#8193a6]">{en ? "Signage and the building name are blurred in the current photo. The remodelled view is an AI-generated concept, not a final design." : "현재 사진의 간판·건물명은 흐림 처리했습니다. 리모델링 후 모습은 AI로 만든 예시이며 확정 설계가 아닙니다."}</p>
    </section>
  );
}

/* ───────── 6. 숫자 ───────── */
/* 슬롯머신처럼 굴러가는 숫자 */
function Roll({ value, on, delay = 0 }: { value: number; on: boolean; delay?: number }) {
  const digits = String(value).split("").map(Number);
  return (
    <span className="inline-flex overflow-hidden" style={{ height: "1em", lineHeight: 1 }}>
      {digits.map((d, i) => (
        <span key={i} className="relative inline-block" style={{ height: "1em" }}>
          <motion.span className="flex flex-col" initial={{ y: "0em" }} animate={on ? { y: `${-(d + 10)}em` } : {}} transition={{ duration: 1.6 + i * 0.25, delay: delay + i * 0.12, ease: [0.2, 0.9, 0.25, 1] }}>
            {Array.from({ length: 20 }, (_, k) => (
              <span key={k} style={{ height: "1em", lineHeight: 1 }}>{k % 10}</span>
            ))}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* 54실 — 객실 하나가 눈금 하나 */
function RingRooms({ on }: { on: boolean }) {
  const en = useEN();
  const list = [...Array(C.s).fill("s"), ...Array(C.t).fill("t"), ...Array(C.sh).fill("sh")] as ("s" | "t" | "sh")[];
  const col = { s: "#fbf8f0", t: "#1d2630", sh: "#2f8f86" };
  return (
    <svg viewBox="-60 -60 120 120" className="h-full w-full">
      <motion.circle r={34} fill="none" stroke="#1d2630" strokeOpacity={0.25} strokeWidth={0.8} initial={{ pathLength: 0 }} animate={on ? { pathLength: 1 } : {}} transition={{ duration: 1.2, ease: EASE }} />
      {list.map((t, i) => {
        const a = (i / list.length) * Math.PI * 2 - Math.PI / 2;
        const r0 = 39, r1 = t === "t" ? 54 : t === "sh" ? 51 : 48;
        return <motion.line key={i} x1={Math.cos(a) * r0} y1={Math.sin(a) * r0} x2={Math.cos(a) * r1} y2={Math.sin(a) * r1} stroke={col[t]} strokeWidth={2.6} strokeLinecap="round" initial={{ pathLength: 0 }} animate={on ? { pathLength: 1 } : {}} transition={{ duration: 0.35, delay: 0.3 + i * 0.03, ease: EASE }} />;
      })}
      <motion.g initial={{ scale: 0 }} animate={on ? { scale: 1 } : {}} transition={{ duration: 0.8, delay: 1.6, ease: EASE }}>
        <text y={-4} textAnchor="middle" fontSize={8} fontWeight={800} fill="#1d2630">{en ? "9 floors" : "9개 층"}</text>
        <text y={8} textAnchor="middle" fontSize={6.5} fontWeight={700} fill="#5f5236">2F – 9F</text>
      </motion.g>
    </svg>
  );
}

/* 85베드 — 점 하나가 침대 하나 */
function DotsBeds({ on }: { on: boolean }) {
  const list = [...Array(C.s).fill("s"), ...Array(C.t * 2).fill("t"), ...Array(C.sh * 3).fill("sh")] as ("s" | "t" | "sh")[];
  const col = { s: "#fbf8f0", t: "#1d2630", sh: "#2f8f86" };
  return (
    <svg viewBox="0 0 100 92" className="h-full w-full">
      {list.map((t, i) => {
        const cx = 6 + (i % 10) * 9.8, cy = 6 + Math.floor(i / 10) * 9.8;
        return <motion.circle key={i} cx={cx} cy={cy} r={3.4} fill={col[t]} style={{ transformBox: "fill-box", transformOrigin: "center" }} initial={{ scale: 0 }} animate={on ? { scale: [0, 1.5, 1] } : {}} transition={{ duration: 0.5, delay: 0.2 + i * 0.018, ease: EASE }} />;
      })}
    </svg>
  );
}

/* 4개 대학 — 2호선과 신촌역 */
function MapUnis({ on }: { on: boolean }) {
  const en = useEN();
  const pins: [number, number, string][] = en ? [[56, 22, "Yonsei"], [94, 38, "Ewha"], [22, 60, "Sogang"], [10, 92, "Hongik"]] : [[56, 22, "연세"], [94, 38, "이화"], [22, 60, "서강"], [10, 92, "홍익"]];
  return (
    <svg viewBox="0 0 120 112" className="h-full w-full">
      <motion.path d="M-4 96 C 20 90, 34 76, 58 74 S 100 70, 124 52" fill="none" stroke="#2f8f86" strokeWidth={4} strokeLinecap="round" initial={{ pathLength: 0 }} animate={on ? { pathLength: 1 } : {}} transition={{ duration: 1.4, ease: EASE }} />
      <text x={100} y={74} fontSize={6} fontWeight={800} fill="#2f8f86">{en ? "Line 2" : "2호선"}</text>
      {pins.map(([x, y, n], i) => (
        <g key={n}>
          <motion.line x1={58} y1={74} x2={x} y2={y} stroke="#1d2630" strokeWidth={0.8} strokeDasharray="2 2" initial={{ pathLength: 0 }} animate={on ? { pathLength: 1 } : {}} transition={{ duration: 0.6, delay: 1 + i * 0.2 }} />
          <motion.g style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }} initial={{ scale: 0, y: -10 }} animate={on ? { scale: 1, y: 0 } : {}} transition={{ type: "spring", stiffness: 260, damping: 14, delay: 1.2 + i * 0.2 }}>
            <path d={`M${x} ${y} l-4.5 -7 a5.4 5.4 0 1 1 9 0 z`} fill="#1d2630" />
            <circle cx={x} cy={y - 9.4} r={2} fill="#dcc29b" />
            <text x={x} y={y + 8} textAnchor="middle" fontSize={7} fontWeight={800} fill="#1d2630">{n}</text>
          </motion.g>
        </g>
      ))}
      <circle cx={58} cy={74} r={10} fill="none" stroke="#fbf8f0" strokeWidth={1.2} className="ping" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
      <circle cx={58} cy={74} r={5} fill="#fbf8f0" stroke="#1d2630" strokeWidth={1.6} />
      <text x={58} y={90} textAnchor="middle" fontSize={6.5} fontWeight={800} fill="#1d2630">{en ? "Sinchon Stn." : "신촌역"}</text>
    </svg>
  );
}

/* 24시간 — 하루를 도는 시계 */
function Clock24({ on }: { on: boolean }) {
  return (
    <svg viewBox="-60 -60 120 120" className="h-full w-full">
      <motion.circle r={46} fill="none" stroke="#1d2630" strokeWidth={1.4} initial={{ pathLength: 0 }} animate={on ? { pathLength: 1 } : {}} transition={{ duration: 1.2, ease: EASE }} />
      <motion.path d="M0 -40 A40 40 0 0 1 0 40" fill="none" stroke="#fbf8f0" strokeWidth={7} initial={{ pathLength: 0 }} animate={on ? { pathLength: 1 } : {}} transition={{ duration: 1.4, delay: 0.3, ease: EASE }} />
      <motion.path d="M0 40 A40 40 0 0 1 0 -40" fill="none" stroke="#1d2630" strokeWidth={7} initial={{ pathLength: 0 }} animate={on ? { pathLength: 1 } : {}} transition={{ duration: 1.4, delay: 1.2, ease: EASE }} />
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return <line key={i} x1={Math.sin(a) * 48} y1={-Math.cos(a) * 48} x2={Math.sin(a) * (i % 6 ? 51 : 55)} y2={-Math.cos(a) * (i % 6 ? 51 : 55)} stroke="#1d2630" strokeWidth={i % 6 ? 1 : 2} />;
      })}
      <text y={-22} textAnchor="middle" fontSize={8} fill="#5f5236">☀</text>
      <text y={28} textAnchor="middle" fontSize={8} fill="#fbf8f0">☾</text>
      <g className={on ? "spin24" : ""}>
        <line x1={0} y1={6} x2={0} y2={-36} stroke="#1d2630" strokeWidth={2.6} strokeLinecap="round" />
        <circle r={3.6} fill="#1d2630" />
      </g>
    </svg>
  );
}

const STATS = [
  { n: TOTAL, u: "실", uE: "rooms", l: "객실", lE: "Rooms", d: "1인실 33 · 2인실 11 · 셰어룸 10 — 눈금 하나가 방 하나", dE: "33 single · 11 twin · 10 share — one tick, one room", Art: RingRooms },
  { n: BEDS, u: "베드", uE: "beds", l: "침대", lE: "Beds", d: "1인 33 · 2인 22 · 3인 30 — 점 하나가 침대 하나", dE: "33 + 22 + 30 — one dot, one bed", Art: DotsBeds },
  { n: 4, u: "곳", uE: "", l: "대학 생활권", lE: "Universities nearby", d: "연세 · 이화 · 서강 · 홍익, 신촌역 도보권", dE: "Yonsei · Ewha · Sogang · Hongik, near Sinchon Station", Art: MapUnis },
  { n: 24, u: "시간", uE: "/7", l: "무인 체크인 · AI 안내", lE: "Self check-in · AI help", d: "낮에도 밤에도, 줄 서지 않는 입실", dE: "Day or night, no queue to get in", Art: Clock24 },
];
function StatRow({ s, i }: { s: (typeof STATS)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, margin: "-18% 0px" });
  const Art = s.Art;
  const en = useEN();
  return (
    <div ref={ref} className={`relative flex items-center gap-4 border-t border-[#1d2630]/20 py-6 ${i % 2 ? "flex-row-reverse text-right" : ""}`}>
      <motion.div className="h-[124px] w-[124px] shrink-0" initial={{ rotate: i % 2 ? 20 : -20, scale: 0.6 }} animate={on ? { rotate: 0, scale: 1 } : {}} transition={{ duration: 1.1, ease: EASE }}>
        <Art on={on} />
      </motion.div>
      <div className="min-w-0 flex-1">
        <p className="serif text-[66px] italic leading-none"><Roll value={s.n} on={on} delay={0.2} /><span className="ml-1 align-baseline text-[18px] font-black not-italic">{en ? s.uE : s.u}</span></p>
        <motion.p className="mt-2 text-[15px] font-black" initial={{ clipPath: "inset(0% 100% 0% 0%)" }} animate={on ? { clipPath: "inset(0% 0% 0% 0%)" } : {}} transition={{ duration: 0.8, delay: 0.6, ease: EASE }}>{en ? s.lE : s.l}</motion.p>
        <motion.p className="mt-1 text-[12.5px] font-medium leading-snug text-[#4b4232]" initial={{ clipPath: "inset(0% 100% 0% 0%)" }} animate={on ? { clipPath: "inset(0% 0% 0% 0%)" } : {}} transition={{ duration: 0.9, delay: 0.8, ease: EASE }}>{en ? s.dE : s.d}</motion.p>
      </div>
    </div>
  );
}
function Numbers() {
  const en = useEN();
  return (
    <section className="relative overflow-hidden pb-16 pt-20" style={{ background: "var(--o-gold)", color: "#1d2630" }}>
      {/* 모핑 덩어리 */}
      <div className="liquid pointer-events-none absolute -right-24 top-10 h-[340px] w-[340px]" style={{ background: "radial-gradient(circle at 35% 35%, #f6e7c6, #e9d2a6 60%, transparent 72%)" }} />
      <div className="liquid2 pointer-events-none absolute -left-28 bottom-24 h-[300px] w-[300px]" style={{ background: "radial-gradient(circle at 60% 40%, #a9e2d9, #8edbd3 55%, transparent 72%)" }} />
      {/* 흐르는 글씨 */}
      <div className="pointer-events-none relative overflow-hidden whitespace-nowrap">
        <div className="drift serif inline-block text-[64px] italic leading-none" style={{ color: "transparent", WebkitTextStroke: "1px rgba(29,38,48,0.35)" }}>
          {"54 rooms · 85 beds · 4 universities · 24/7 · ".repeat(4)}
        </div>
      </div>
      <div className="relative px-6">
        <p className="kick mt-8 text-[#5f5236]">09 / IN NUMBERS</p>
        <h2 className="serif mt-3 text-[42px] leading-[0.98]">Small numbers.<br /><em>Big welcome.</em></h2>
        <div className="mt-8">
          {STATS.map((s, i) => <StatRow key={s.l} s={s} i={i} />)}
        </div>
        <div className="mt-4 overflow-hidden rounded-[22px] bg-[#1d2630] px-5 py-5 text-[#f3f0e8]">
          <div className="flex items-center gap-1.5">
            {(["s", "t", "sh"] as const).map((k) => <span key={k} className="h-2.5 flex-1 origin-left rounded-full" style={{ background: k === "s" ? "#fbf8f0" : k === "t" ? "#dcc29b" : "#8edbd3", flexGrow: C[k] }} />)}
          </div>
          <p className="mt-3 text-[14px] font-bold leading-relaxed">{en ? <>From one night to a full semester —<br />your first home in Seoul.</> : <>하루 숙박부터 한 학기 체류까지,<br />신촌의 첫 서울집.</>}</p>
        </div>
      </div>
      <div className="pointer-events-none relative mt-12 overflow-hidden whitespace-nowrap">
        <div className="drift-r serif inline-block text-[44px] italic leading-none text-[#1d2630]/80">
          {"SEMESTER HOUSE · SINCHON · ".repeat(6)}
        </div>
      </div>
    </section>
  );
}

/* ───────── 7. 영상 ───────── */
const FILMS = [
  { k: "full", t: "전체 이야기 2:41", tE: "Full story 2:41", src: "/sinchon/fullstory.mp4", poster: "fullstory-poster" },
  { k: "exterior", t: "외관", tE: "Exterior", src: "/sinchon/exterior.mp4", poster: "exterior-poster" },
  { k: "hero", t: "첫 장면", tE: "Opening", src: "/sinchon/hero.mp4", poster: "hero-poster" },
  { k: "lounge", t: "라운지", tE: "Lounge", src: "/sinchon/lounge.mp4", poster: "lounge-poster" },
];
function Film() {
  const [i, setI] = useState(0);
  const [sound, setSound] = useState(false);
  const en = useEN();
  const box = useRef<HTMLDivElement>(null);
  const v = useRef<HTMLVideoElement>(null);
  const seen = useInView(box, { margin: "0px 0px -20% 0px" });
  const f = FILMS[i];
  // 화면에 들어오면 무음으로 자동 반복, 벗어나면 멈춤
  useEffect(() => {
    const el = v.current;
    if (!el) return;
    if (seen) { el.muted = !sound; el.play().catch(() => { el.muted = true; setSound(false); el.play().catch(() => {}); }); }
    else el.pause();
  }, [seen, i, sound]);
  const toggleSound = () => { const el = v.current; if (!el) return; const next = !sound; el.muted = !next; setSound(next); if (el.paused) el.play().catch(() => {}); };
  return (
    <section id="film" className="relative px-6 pb-20 pt-24" style={{ background: "#121a22" }}>
      <Head kick="10 / THE FILM" a="The whole story." b="In motion." sub={en ? <>From the building to daily life, and back to the city.<br />The full 2 min 41 s film, uncut.</> : <>건물에서 일상으로, 그리고 다시 도시로.<br />함께 만든 2분 41초를 자르지 않고 그대로 담았습니다.</>} />
      <div className="mt-7 flex flex-wrap gap-2">
        {FILMS.map((x, k) => (
          <button key={x.k} onClick={() => setI(k)} className="relative rounded-full px-4 py-2.5 text-[13.5px] font-bold" style={{ color: k === i ? "#121a22" : "#dfe7ee" }}>
            {k === i && <motion.span layoutId="ftab" className="absolute inset-0 rounded-full" style={{ background: "var(--o-mint)" }} />}
            {k !== i && <span className="pill absolute inset-0" />}
            <span className="relative">{en ? x.tE : x.t}</span>
          </button>
        ))}
      </div>
      <div ref={box} className="relative mx-auto mt-4 aspect-[9/16] w-full max-w-[420px] overflow-hidden rounded-[26px] bg-black">
        <video key={f.k} ref={v} src={f.src} poster={IMG(f.poster)} playsInline muted loop autoPlay preload="metadata" className="h-full w-full object-cover" />
        <div className="pointer-events-none absolute left-3 top-3"><Badge>{en ? "AI video · sample" : "AI 영상 · 예시"}</Badge></div>
        <button onClick={toggleSound} className="glass absolute bottom-4 left-4 rounded-full px-4 py-2.5 text-[13px] font-bold" aria-label={sound ? "sound off" : "sound on"}>
          {sound ? (en ? "🔊 Sound off" : "🔊 소리 끄기") : en ? "🔇 Sound on" : "🔇 소리 켜기"}
        </button>
      </div>
    </section>
  );
}

/* ───────── 8. 자료 · 마무리 ───────── */
const DOCS = [
  { href: "/sinchon/ir", t: "IR 모션 프레젠테이션", tE: "IR motion presentation", d: "휴대폰에서 밀어 넘기는 32장", dE: "32 swipeable slides (Korean)" },
  { href: "/scprofile", t: "사업소개서", tE: "Business profile", d: "콘셉트 · 객실 · 운영 12장", dE: "Concept · rooms · operations, 12 slides (Korean)" },
  { href: "/scplan", t: "IR 자료", tE: "IR deck", d: "시장 · 객실 배치 · 투자 계획 17장", dE: "Market · room plan · investment, 17 slides (Korean)" },
  { href: "/sinchon", t: "고객용 소개 사이트", tE: "Guest website", d: "객실 · 요금 · 동네 안내", dE: "Rooms · rates · neighbourhood" },
];
function Docs() {
  const en = useEN();
  return (
    <section id="docs" className="px-6 pb-16 pt-20" style={{ background: "#1a2430" }}>
      <p className="kick" style={{ color: "var(--o-sub)" }}>11 / DOCUMENTS</p>
      <h3 className="mt-3 text-[24px] font-black">{en ? "Project documents" : "사업 자료 바로보기"}</h3>
      <div className="mt-6 space-y-2.5">
        {DOCS.map((d) => (
          <a key={d.href} href={d.href} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border border-white/12 px-5 py-4 active:scale-[0.99]">
            <span>
              <span className="block text-[16px] font-black">{en ? d.tE : d.t}</span>
              <span className="block text-[12.5px] text-[#9fb0c0]">{en ? d.dE : d.d}</span>
            </span>
            <span className="serif text-[24px] italic" style={{ color: "var(--o-gold)" }}>↗</span>
          </a>
        ))}
      </div>
    </section>
  );
}
function Closing() {
  const en = useEN();
  return (
    <section className="stage relative overflow-hidden px-6 pb-14 pt-28 text-center">
      <p className="kick" style={{ color: "var(--o-sub)" }}>SEMESTER HOUSE · SINCHON</p>
      <Reveal><h2 className="serif mt-5 text-[52px] leading-[0.96]">Space becomes<br /><em>possibility.</em></h2></Reveal>
      <p className="mt-6 text-[15px] font-bold">{en ? "Sinchon Smart Hostel (working title)" : "신촌 스마트호스텔(가칭)"}</p>
      <p className="mt-1 text-[14px] text-[#c9d4de]">{en ? "One night to a semester — a first Seoul home for students from abroad" : "하루부터 한 학기까지, 유학생의 첫 서울집"}</p>
      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="pill mt-8 px-6 py-3 text-[14px] font-bold">{en ? "Back to top ↑" : "처음으로 ↑"}</button>
      <div className="mt-16 space-y-1.5 text-[11px] leading-[1.7] text-[#7f91a4]">
        {en ? (
          <>
            <p>PRIVATE CONCEPT REVIEW</p>
            <p>The 3D line model and room plan are schematic visualisations based on the 2004 drawings — not a survey, permit or final design.</p>
            <p>AI-generated images and videos are samples and may differ from reality. Use as lodging is subject to prior consultation with the authorities.</p>
          </>
        ) : (
          <>
            <p>PRIVATE CONCEPT REVIEW · 검토용 콘셉트 시안</p>
            <p>3D 선 모델과 객실 배치는 2004년 원도면 치수를 참고한 개략 연출이며, 실측·인허가·확정 설계가 아닙니다.</p>
            <p>사진·영상 중 AI로 만든 예시는 실제와 다를 수 있습니다. 숙박시설 용도 가능 여부는 관할 기관과 사전 협의가 필요합니다.</p>
          </>
        )}
      </div>
    </section>
  );
}

/* ───────── 머리 · 떠 있는 버튼 · 안내 ───────── */

export default function OrbitSite({ lang = "ko" }: { lang?: "ko" | "en" }) {
  const en = lang === "en";
  const paused = useRef(false);
  const [isPaused, setPaused] = useState(false);
  const [info, setInfo] = useState(false);
  const toggle = () => { paused.current = !paused.current; setPaused(paused.current); };
  return (
    <LangCtx.Provider value={en}>
    <main className="orb mx-auto min-h-screen w-full max-w-[480px]" lang={en ? "en" : "ko"}>
      <header className="fixed inset-x-0 top-0 z-40 mx-auto flex max-w-[480px] items-center justify-between gap-3 px-5 pt-4" style={{ background: "linear-gradient(180deg,rgba(18,26,34,0.85),rgba(18,26,34,0))", paddingBottom: 18 }}>
        <p className="min-w-0 truncate whitespace-nowrap text-[13px] font-black tracking-[0.22em]">SEMESTER HOUSE</p>
        <div className="flex shrink-0 items-center gap-2">
          <a href={en ? "/sinchon/orbit" : "/sinchon/orbit/en"} className="pill glass whitespace-nowrap px-3 py-2 text-[12px] font-bold">{en ? "한국어" : "EN"}</a>
          <button onClick={() => setInfo(true)} className="pill glass whitespace-nowrap px-3.5 py-2 text-[12px] font-bold">{en ? "About" : "안내"}</button>
        </div>
      </header>

      <Journey paused={paused} />
      <Plans />
      <Life />
      <Rooftop />
      <Smart />
      <Exterior />
      <Numbers />
      <Film />
      <Docs />
      <Closing />

      <button onClick={toggle} className="glass fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full text-[15px]" style={{ right: "max(20px, calc(50vw - 240px + 20px))" }} aria-label={isPaused ? "resume rotation" : "pause rotation"}>
        {isPaused ? "▶" : "❙❙"}
      </button>

      <motion.div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[480px]" initial={false} animate={{ y: info ? 0 : "105%" }} transition={{ duration: 0.5, ease: EASE }}>
        <div className="rounded-t-[26px] border-t border-white/10 px-6 pb-9 pt-6" style={{ background: "#1a2430" }}>
          <div className="flex items-center justify-between">
            <p className="serif text-[28px] italic">{en ? "Space, seen differently." : "공간을, 다른 시선으로."}</p>
            <button onClick={() => setInfo(false)} className="pill h-9 w-9 text-[16px]" aria-label="close">×</button>
          </div>
          <div className="mt-4 space-y-3 text-[13.5px] leading-[1.75] text-[#c9d4de]">
            {en ? (
              <>
                <p>The building on the first screen is not a photo or a video: it is a real-time 3D line model built from the 2004 drawings (12.2m × 10.4m typical floor, east wing on 2F–3F, south stair and lift core, east escape stair). Scroll down and the floors stack, open up and fill with 54 coloured rooms. Drag sideways to rotate it.</p>
                <p>Floor heights, window spacing and roof details are assumptions for visualisation, not a survey. The room plan is a schematic draft for review.</p>
                <p>Palette: silver-blue lines on charcoal navy → mint → champagne gold, with warm ivory for the life section.</p>
              </>
            ) : (
              <>
            <p>첫 화면의 건물은 사진이나 영상이 아니라, 2004년 원도면의 치수(기준층 12.2m × 10.4m, 2~3층 동측 날개, 남측 계단·승강기 코어, 동측 비상계단)로 세운 실시간 3D 선 모델입니다. 아래로 밀면 층이 쌓이고, 펼쳐지며, 54개 객실이 색으로 채워집니다. 손가락으로 좌우로 끌면 돌아갑니다.</p>
            <p>층고·창 간격·옥상 세부는 연출용 가정이며 실측 복원이 아닙니다. 객실 배치는 검토용 개략(안)입니다.</p>
            <p>색: 차콜 네이비 위에 실버 블루 선 → 민트 → 샴페인 골드, 그리고 생활 구간은 따뜻한 아이보리.</p>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </main>
    </LangCtx.Provider>
  );
}
