"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { preload } from "react-dom";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ROOMS, SERVICE, COLORS, LABEL, PLATE, WING, CORE, EV, ESTAIR_TYP, ESTAIR_LOW, countRooms } from "../orbit/model";
import type { FloorKind, Rect } from "../orbit/model";

/*
 * ORBIT HOUSE · 신촌 스마트호스텔(가칭) — ORBIT
 * dot 시안(Grand Journey Refined)을 뼈대로, Original Lines(도면이 그려지는 연출)·Blue Space(아치 카드)를 합친 완성본
 * 원칙: 투명도 애니메이션 없음 — 위치·크기·마스크(clip-path)·선 그리기만 사용
 */
const Building3D = dynamic(() => import("../orbit/Building3D"), { ssr: false });
const IMG = (f: string) => `/sinchon/${f}.webp`;
const EASE = [0.16, 1, 0.3, 1] as const;
const C = countRooms();
const TOTAL = C.s + C.t + C.sh;
const BEDS = C.s + C.t * 2 + C.sh * 3;
/* 언어: false = 한국어, true = English */
const LangCtx = createContext(false);
const useEN = () => useContext(LangCtx);
const LBL = (en: boolean) => (en ? { s: "Single", t: "Twin", sh: "Family" } : { s: "1인 회복실", t: "2인 회복실", sh: "가족 체류실" });

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
    <span className="inline-block rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.06em]" style={{ background: light ? "rgba(255,255,255,0.86)" : "rgba(62,110,130,0.72)", color: light ? "#121212" : "#e8eef4" }}>
      {children}
    </span>
  );
}
/* 화면에 들어오면 무음 자동 반복되는 영상 카드 */
function Clip({ src, poster, kick, title, light = false }: { src: string; poster: string; kick: string; title: string; light?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const v = useRef<HTMLVideoElement>(null);
  const seen = useInView(box, { margin: "0px 0px -15% 0px" });
  const on = useInView(box, { once: true, margin: "-10% 0px" });
  const en = useEN();
  useEffect(() => { const el = v.current; if (!el) return; if (seen) el.play().catch(() => {}); else el.pause(); }, [seen]);
  return (
    <div ref={box}>
      <motion.div className="relative mx-auto aspect-[9/16] w-full max-w-[420px] overflow-hidden rounded-[26px] bg-black" initial={{ clipPath: "inset(8% 8% 8% 8% round 40px)", scale: 0.96 }} animate={on ? { clipPath: "inset(0% 0% 0% 0% round 26px)", scale: 1 } : {}} transition={{ duration: 1.1, ease: EASE }}>
        <video ref={v} src={src} poster={IMG(poster)} playsInline muted loop autoPlay preload="metadata" className="h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-5 pb-5 pt-16" style={{ background: "linear-gradient(180deg,transparent,rgba(62,110,130,0.82))" }}>
          <p className="kick text-[10px] text-[#dfe7ee]">{kick}</p>
          <p className="mt-1 text-[17px] font-black text-white">{title}</p>
        </div>
      </motion.div>
    </div>
  );
}

/* ───────── 1. 3D 여정 (스크롤 고정) ───────── */
const CHAPTERS = [
  { n: "01", en: "THE ARRIVAL", kick: "01 / IMAGINE A NEW CHAPTER", a: "Form.", b: "In motion.", sub: "선이 펼쳐지고, 층이 올라가고.\n대학병원 곁에 회복의 집이 모습을 갖춥니다.", subE: "Lines unfold, floors rise.\nA new Sinchon takes shape." },
  { n: "02", en: "THE REVEAL", kick: "02 / A DIFFERENT PERSPECTIVE", a: "See it", b: "differently.", sub: "원도면 치수 그대로.\n지하 2층 · 지상 10층, 한 건물에 담는 생애 전주기 돌봄.", subE: "True to the original drawings.\nTen floors above ground, one building, a new view." },
  { n: "03", en: "THE LAYERS", kick: "03 / OPEN UP THE POSSIBILITIES", a: "Room for", b: "new stories.", sub: "층을 펼치면 방이 보입니다.\n2층부터 10층까지, 회복실과 가족 체류실 66실.", subE: "Open the floors and the rooms appear.\n66 rooms from the 2nd to the 10th floor." },
  { n: "04", en: "THE HORIZON", kick: "04 / ONE BUILDING", a: "One city.", b: "New life.", sub: "치료는 대학병원에서,\n회복은 신촌에서.", subE: "From one night to a full semester —\nyour first home in Seoul." },
];
const FLOOR_LIST: [string, string, string][] = [["10F", "완화돌봄 스위트 · 증축 가능", "Palliative suites"], ["9F", "회복 병동 · 1인 5 · 2인 1", "Recovery ward"], ["8F", "회복 병동 · 1인 5 · 2인 1", "Recovery ward"], ["7F", "회복 병동 · 1인 5 · 2인 1", "Recovery ward"], ["6F", "회복 병동 · 1인 5 · 2인 1", "Recovery ward"], ["5F", "회복 병동 · 1인 5 · 2인 1", "Recovery ward"], ["4F", "재활 센터 · 하늘정원", "Rehab · roof garden"], ["3F", "가족 체류실 · 상담", "Family stay · counselling"], ["2F", "평생주치의 의원 · 가족실", "Clinic · family rooms"], ["1F", "로비 · 입원 상담 · 카페", "Lobby · admissions · cafe"]];

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
                <span className="serif w-7 text-[15px] italic" style={{ color: "var(--o-gold)" }}>{f}</span>
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
  { k: "f23", label: "2·3층", labelE: "2F · 3F", cad: "orbit-cad-2f", sum: "층당 12실 · 가족 체류실 6 + 2인 3 + 1인 3", sumE: "12 rooms per floor · 6 share + 3 twin + 3 single", note: "층당 337.89㎡의 가장 넓은 층 — 평생주치의 의원과 보호자 가족 체류실", noteE: "The widest floors (337.89㎡ each) — for groups and language students" },
  { k: "f4", label: "4층", labelE: "4F", cad: "orbit-cad-4f", sum: "재활 센터 + 하늘정원", sumE: "6 rooms · 5 single + 1 twin + roof garden", note: "2·3층 지붕을 하늘정원으로 — 휠체어로 오르는 회복의 마당", noteE: "The roof over 2F–3F becomes a garden for every resident" },
  { k: "typ", label: "5~10층", labelE: "5F – 10F", cad: "orbit-cad-typ", sum: "층당 6실 · 1인 회복실 5 + 2인 회복실 1", sumE: "6 rooms per floor · 5 single + 1 twin", note: "회복 병동 — 층마다 간호스테이션, 모든 방에 개별 욕실과 간호 호출", noteE: "Typical floor — private bathroom in every room, linen & laundry on each floor." },
];
const SVC_E: Record<string, string> = { 린넨: "Linen", 복도: "Corridor", 옥상정원: "Roof garden" };

function PlanSvg({ k }: { k: FloorKind }) {
  const en = useEN();
  const wide = k === "f23" || k === "f4";
  const minX = -0.8, maxX = wide ? 27.3 : 16.2, minZ = wide ? -5.2 : -0.8, maxZ = 18.4;
  const W = maxX - minX, H = maxZ - minZ;
  const blocks: Rect[] = [PLATE, CORE, EV, ...(k === "f23" ? [WING, ESTAIR_LOW] : k === "f4" ? [WING, ESTAIR_TYP] : [ESTAIR_TYP])];
  const rect = ([x0, z0, x1, z1]: Rect) => ({ x: x0, y: z0, width: x1 - x0, height: z1 - z0 });
  return (
    <svg viewBox={`${minX} ${minZ} ${W} ${H}`} className="h-full w-full">
      {blocks.map((b, i) => (
        <motion.rect key={`b${i}`} {...rect(b)} fill="none" stroke="#e3f1f4" strokeWidth={0.12} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, delay: i * 0.08, ease: EASE }} />
      ))}
      {SERVICE[k].map((s, i) => (
        <g key={`s${i}`}>
          <rect {...rect(s.r)} fill="rgba(215,231,255,0.06)" stroke="none" />
          {s.label !== "복도" && (
            <text x={(s.r[0] + s.r[2]) / 2} y={(s.r[1] + s.r[3]) / 2} fontSize={0.62} fill="#f2f9f9" textAnchor="middle" dominantBaseline="middle" fontWeight={700}>{en ? SVC_E[s.label] ?? s.label : s.label}</text>
          )}
        </g>
      ))}
      {ROOMS[k].map((r, i) => {
        const [x0, z0, x1, z1] = r.r;
        const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
        return (
          <g key={`r${i}`}>
            <motion.rect x={x0 + 0.1} y={z0 + 0.1} width={x1 - x0 - 0.2} height={z1 - z0 - 0.2} rx={0.25} fill={COLORS[r.t]} style={{ transformOrigin: `${cx}px ${cz}px`, transformBox: "view-box" }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.6, delay: 0.6 + i * 0.07, ease: EASE }} />
            <text x={cx} y={cz} fontSize={x1 - x0 < 2.4 ? 0.5 : 0.72} fill="#121212" textAnchor="middle" dominantBaseline="middle" fontWeight={800}>{en ? (r.t === "sh" ? "Share" : LBL(true)[r.t]) : r.t === "sh" ? "셰어" : LABEL[r.t]}</text>
          </g>
        );
      })}
      <text x={(CORE[0] + CORE[2]) / 2} y={(CORE[1] + CORE[3]) / 2} fontSize={0.62} fill="#f2f9f9" textAnchor="middle" dominantBaseline="middle" fontWeight={700}>{en ? "Stair · Hall" : "계단 · 홀"}</text>
      <text x={(EV[0] + EV[2]) / 2} y={(EV[1] + EV[3]) / 2} fontSize={0.6} fill="#f2f9f9" textAnchor="middle" dominantBaseline="middle" fontWeight={700}>EV</text>
      <text x={0} y={-0.25 + (wide ? 0 : 0)} fontSize={0.6} fill="#e4f1f3">12.2m × 10.4m</text>
    </svg>
  );
}

function Plans() {
  const [tab, setTab] = useState(0);
  const [mode, setMode] = useState<"cad" | "rooms">("rooms");
  const en = useEN();
  const t = PLAN_TABS[tab];
  return (
    <section id="plans" className="relative px-6 pb-20 pt-24" style={{ background: "linear-gradient(180deg,#3e6e82 0%,#5b97ac 100%)" }}>
      <Head kick="05 / THE ORIGINAL LINES" a="Every future." b="Begins with a line." sub={en ? <>Imagination, grounded in the original lines.<br />A draft room plan laid over the original drawings.</> : <>상상에 근거를 더하는 원래의 선.<br />원도면 위에 회복실 배치(안)를 올렸습니다.</>} />
      <div className="mt-8 flex gap-2">
        {PLAN_TABS.map((p, i) => (
          <button key={p.k} onClick={() => setTab(i)} className="relative flex-1 rounded-full py-3 text-[14px] font-bold" style={{ color: i === tab ? "#3e6e82" : "#dfe7ee" }}>
            {i === tab && <motion.span layoutId="ptab" className="absolute inset-0 rounded-full" style={{ background: "var(--o-line)" }} transition={{ duration: 0.45, ease: EASE }} />}
            {i !== tab && <span className="pill absolute inset-0" />}
            <span className="relative">{en ? p.labelE : p.label}</span>
          </button>
        ))}
      </div>
      <div className="glass relative mt-4 overflow-hidden rounded-[22px] p-3">
        <div className="mb-2 flex items-center justify-between px-1">
          <p className="kick text-[9.5px]" style={{ color: "var(--o-sub)" }}>{mode === "cad" ? "ORIGINAL CAD · 2023" : (en ? "ROOM PLAN · DRAFT" : "ROOM PLAN · 배치(안)")}</p>
          <div className="relative flex rounded-full bg-black/25 p-0.5 text-[11.5px] font-bold">
            {(["rooms", "cad"] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)} className="relative rounded-full px-3 py-1.5" style={{ color: mode === m ? "#3e6e82" : "#c9d4de" }}>
                {mode === m && <motion.span layoutId="pmode" className="absolute inset-0 rounded-full" style={{ background: "var(--o-gold)" }} transition={{ duration: 0.35 }} />}
                <span className="relative">{m === "rooms" ? (en ? "Rooms" : "방 배치") : en ? "Original" : "원도면"}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="relative aspect-[1.23] w-full overflow-hidden rounded-[14px]" style={{ background: "#3e6e82" }}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={`${t.k}-${mode}`} className="absolute inset-0 flex items-center justify-center p-2" initial={{ clipPath: "inset(0% 100% 0% 0%)" }} animate={{ clipPath: "inset(0% 0% 0% 0%)" }} exit={{ clipPath: "inset(0% 0% 0% 100%)" }} transition={{ duration: 0.8, ease: EASE }}>
              {mode === "cad" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={IMG(t.cad)} alt={en ? `${t.labelE} original drawing (2023)` : `${t.label} 원도면(2023)`} className="h-full w-full object-contain" />
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
      <p className="mt-5 text-[11.5px] leading-[1.7] text-[#e4f1f3]">{en ? "The originals are images of the 2023 drawing set (B2 + 10 floors). The room plan is a schematic draft based on their dimensions, to be finalised after structural, plumbing and permit review." : "원도면은 2023년 도면(지하 2층 · 지상 10층) 이미지입니다. 방 배치는 원도면 치수를 기준으로 한 개략(안)이며, 객실 수는 병원 운영 전문가 그룹의 판단과 운영 방향에 따라 달라질 수 있습니다. 10층 위는 추가 공간 증축이 가능합니다."}</p>
    </section>
  );
}

/* ───────── 3. 생활 (아이보리) ───────── */
const ROOM_CARDS = [
  { img: "care/room-single", t: "1인 회복실", tE: "Single", size: "약 16㎡", sizeE: "approx. 16㎡", n: C.s, d: "항암 기간 감염 걱정 없이, 간호 호출과 개별 욕실.", dE: "Private recovery room." },
  { img: "care/room-twin", t: "2인 회복실", tE: "Twin", size: "약 18~20㎡", sizeE: "approx. 18–20㎡", n: C.t, d: "환자와 보호자가 함께, 또는 환자 두 분이.", dE: "Patient and carer together." },
  { img: "care/room-family", t: "가족 체류실", tE: "Family stay", size: "약 26㎡", sizeE: "approx. 26㎡", n: C.sh, d: "지방에서 올라온 보호자 가족이 치료 기간 머무는 방.", dE: "For families staying during treatment." },
];
const LIFE = [
  { img: "care/doctor", t: "나를 오래 아는 주치의", tE: "A doctor who knows you", en: "LIFELONG DOCTOR" },
  { img: "care/rehab", t: "다시 걷는 연습", tE: "Learning to walk again", en: "REHAB" },
  { img: "care/nutrition", t: "치료 단계에 맞춘 한 끼", tE: "Meals for every stage", en: "NUTRITION" },
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
              <img src={IMG(r.img)} alt={en ? `${r.tE} concept` : `${r.t} · AI 예시`} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="text-[19px] font-black">{en ? r.tE : r.t}</p>
              <p className="serif text-[22px] italic">{r.n}{en ? " rooms" : "실"}</p>
            </div>
            <p className="text-[12.5px] font-bold text-[#121212]">{en ? `${r.sizeE} · one night to a semester` : `${r.size} · 회복 기간 동안`}</p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-[#4a4f55]">{en ? r.dE : r.d}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-1.5">
        {ROOM_CARDS.map((_, k) => (
          <span key={k} className="h-1.5 rounded-full bg-[#121212] transition-all" style={{ width: k === Math.min(i, ROOM_CARDS.length - 1) ? 22 : 6, background: k === Math.min(i, ROOM_CARDS.length - 1) ? "#121212" : "#c9c1b0" }} />
        ))}
      </div>
    </div>
  );
}

function Life() {
  const en = useEN();
  return (
    <section id="life" className="paper relative px-6 pb-20 pt-24">
      <Head dark={false} kick="06 / CARE IN FULL COLOUR" a="Not just a ward." b="A place to heal." sub={en ? <>The moment lines turn into the warmth of daily life.<br />Every room has a private bathroom and comes fully furnished.</> : <>공간의 선이 돌봄의 온도로 바뀌는 순간.<br />주치의·간호사·요양보호사가 한 팀으로 곁을 지킵니다.</>} />
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
                <p className="kick text-[9.5px] text-[#121212]">{l.en}</p>
                <p className="mt-2 text-[18px] font-black leading-snug">{en ? l.tE : l.t}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="mt-14">
        <Clip src="/sinchon/care/coop-lounge.mp4" poster="care/lounge-poster" kick={en ? "COMMUNITY CARE" : "공동체가 함께 돌봅니다"} title={en ? "Care, shared by a community" : "돌봄의 무게를 혼자 지지 않도록"} />
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
        <img src={IMG("care/rooftop")} alt={en ? "Rooftop garden concept" : "하늘정원 · AI 예시"} className="h-full w-full object-cover" />
      </motion.div>
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(62,110,130,0.78) 0%,rgba(62,110,130,0) 38%,rgba(62,110,130,0) 60%,rgba(62,110,130,0.85) 100%)" }} />
      <div className="absolute inset-x-6 top-20">
        <p className="kick text-[#e6ecf2]">A DIFFERENT KIND OF CARE</p>
        <h2 className="serif mt-3 text-[48px] leading-[0.96]">Above the city.<br /><em>Closer to healing.</em></h2>
      </div>
      <div className="absolute inset-x-6 bottom-10">
        <p className="text-[15px] font-medium leading-[1.75] text-[#e6ecf2]">{en ? <>A busy city and a quiet day of your own.<br />Find the balance in the 4F roof garden, right above the city.</> : <>병실 문을 열고 바람을 쐬는 시간.<br />4층 하늘정원에서 환자와 가족이 함께 쉬어 갑니다.</>}</p>
      </div>
    </section>
  );
}

/* ───────── 4. 스마트 운영 ───────── */
const STEPS = [
  { en: "CONSULT", t: "입원 상담", tE: "Consultation", d: "대학병원 진료 기록을 주치의가 함께 검토", dE: "Your doctor reviews your hospital records" },
  { en: "ADMIT", t: "회복실 입실", tE: "Admission", d: "치료 일정에 맞춰 1인·2인 회복실 배정", dE: "A recovery room matched to your treatment" },
  { en: "CARE", t: "팀 돌봄", tE: "Team care", d: "주치의·간호사·요양보호사·영양·상담이 한 팀으로", dE: "Doctor, nurse, carer, nutrition and counselling as one team" },
  { en: "LINK", t: "대학병원 연계", tE: "Hospital link", d: "통원 셔틀과 전문의 협진 연계(구상)로 치료를 잇습니다", dE: "Shuttle and remote consults keep treatment connected" },
  { en: "HOME", t: "집으로, 그리고 계속", tE: "Home, and beyond", d: "퇴원 후 방문진료·방문간호로 돌봄을 이어 갑니다", dE: "Home visits continue the care after discharge" },
];
function Smart() {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, margin: "-25% 0px" });
  const en = useEN();
  return (
    <section id="smart" className="relative px-6 pb-20 pt-24" style={{ background: "#5b97ac" }}>
      <Head kick="07 / CARE JOURNEY" a="Five steps." b="Never alone." sub={en ? "From admission to home, care that stays connected." : "입원 상담부터 집으로 돌아간 뒤까지, 끊기지 않는 돌봄의 다섯 단계."} />
      <div className="mt-8">
        <Clip src="/sinchon/care/coop-doctor-ko.mp4" poster="care/film-coop-doctor-ko" kick={en ? "LIFELONG DOCTOR" : "평생주치의"} title={en ? "A doctor who knows you" : "나를 오래 아는 주치의가 곁에"} />
      </div>
      <div ref={ref} className="relative mt-10 pl-8">
        <motion.span className="absolute left-[7px] top-2 bottom-2 w-px origin-top" style={{ background: "linear-gradient(180deg,var(--o-mint),var(--o-gold))" }} initial={{ scaleY: 0 }} animate={on ? { scaleY: 1 } : {}} transition={{ duration: 1.6, ease: EASE }} />
        {STEPS.map((s, i) => (
          <motion.div key={s.en} className="relative pb-7 last:pb-0" initial={{ clipPath: "inset(0% 100% 0% 0%)", x: -10 }} animate={on ? { clipPath: "inset(0% 0% 0% 0%)", x: 0 } : {}} transition={{ duration: 0.7, delay: 0.25 + i * 0.22, ease: EASE }}>
            <span className="absolute -left-8 top-1 h-[15px] w-[15px] rounded-full border-2" style={{ borderColor: i < 2 ? "var(--o-mint)" : "var(--o-gold)", background: "#5b97ac" }} />
            <p className="kick text-[10px]" style={{ color: i < 2 ? "var(--o-mint)" : "var(--o-gold)" }}>0{i + 1} · {s.en}</p>
            <p className="mt-1 text-[18px] font-black">{en ? s.tE : s.t}</p>
            <p className="mt-0.5 text-[13.5px] leading-relaxed text-[#b9c6d2]">{en ? s.dE : s.d}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-12 grid grid-cols-2 gap-2.5">
        {(en ? [["1F", "Self check-in desk", "No queue, day or night"], ["B1", "K-beauty & daily goods", "A shop downstairs for residents and visitors"], ["B2", "Korean buffet", "Home-style meals, resident discount"], ["4F", "Roof garden", "A breather above the city"]] : [["1F", "로비 · 입원 상담", "보호자 카페와 약국"], ["2F", "평생주치의 의원", "원격협진·방문진료 거점"], ["B1", "재활운동 센터 (구상)", "회복 단계별 운동"], ["B2", "수중 보행훈련 (구상)", "물속에서 다시 걷는 연습"]]).map(([f, t, d]) => (
          <Reveal key={f}>
            <div className="h-full rounded-2xl border border-white/10 p-4">
              <p className="serif text-[26px] italic leading-none" style={{ color: "var(--o-gold)" }}>{f}</p>
              <p className="mt-2 text-[14px] font-bold leading-snug">{t}</p>
              <p className="mt-1 text-[12px] text-[#f2f9f9]">{d}</p>
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
    <section id="exterior" className="relative px-6 pb-20 pt-24" style={{ background: "linear-gradient(180deg,#5b97ac,#3e6e82)" }}>
      <Head kick="08 / THE EXTERIOR STUDY" a="From drawing." b="Into dimension." sub={en ? "Thin lines gain light and depth. Slide to compare today with a remodelling concept." : "가느다란 선에 빛과 깊이가 더해집니다. 손가락으로 밀어 지금과 케어하우스로 바뀐 예시를 비교해 보세요."} />
      <div className="relative mt-8 aspect-[941/1300] w-full overflow-hidden rounded-[24px] bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={IMG("care/after-real")} alt={en ? "Remodelling concept" : "리모델링 후 예시"} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0% ${100 - v}% 0% 0%)` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMG("before-exterior")} alt={en ? "Today (signage blurred)" : "현재 모습(간판 흐림 처리)"} className="absolute inset-0 h-full w-full object-cover" style={{ filter: "grayscale(0.35) contrast(1.05)" }} />
        </div>
        <div className="pointer-events-none absolute inset-y-0 w-px bg-white" style={{ left: `${v}%` }}>
          <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[15px] font-black text-[#3e6e82] shadow-lg">⇆</span>
        </div>
        <div className="absolute left-3 top-3"><Badge>{en ? "Today" : "지금"}</Badge></div>
        <input type="range" min={0} max={100} value={v} onChange={(e) => setV(Number(e.target.value))} className="cmp absolute inset-0 cursor-ew-resize" aria-label={en ? "Before and after" : "전후 비교"} />
      </div>
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

/* 객실 — 눈금 하나가 방 하나 */
function RingRooms({ on }: { on: boolean }) {
  const en = useEN();
  const list = [...Array(C.s).fill("s"), ...Array(C.t).fill("t"), ...Array(C.sh).fill("sh")] as ("s" | "t" | "sh")[];
  const col = { s: "#fff8ea", t: "#121212", sh: "#e8979c" };
  return (
    <svg viewBox="-60 -60 120 120" className="h-full w-full">
      <motion.circle r={34} fill="none" stroke="#121212" strokeOpacity={0.25} strokeWidth={0.8} initial={{ pathLength: 0 }} animate={on ? { pathLength: 1 } : {}} transition={{ duration: 1.2, ease: EASE }} />
      {list.map((t, i) => {
        const a = (i / list.length) * Math.PI * 2 - Math.PI / 2;
        const r0 = 39, r1 = t === "t" ? 54 : t === "sh" ? 51 : 48;
        return <motion.line key={i} x1={Math.cos(a) * r0} y1={Math.sin(a) * r0} x2={Math.cos(a) * r1} y2={Math.sin(a) * r1} stroke={col[t]} strokeWidth={2.6} strokeLinecap="round" initial={{ pathLength: 0 }} animate={on ? { pathLength: 1 } : {}} transition={{ duration: 0.35, delay: 0.3 + i * 0.03, ease: EASE }} />;
      })}
      <motion.g initial={{ scale: 0 }} animate={on ? { scale: 1 } : {}} transition={{ duration: 0.8, delay: 1.6, ease: EASE }}>
        <text y={-4} textAnchor="middle" fontSize={8} fontWeight={800} fill="#121212">{en ? "9 floors" : "9개 층"}</text>
        <text y={8} textAnchor="middle" fontSize={6.5} fontWeight={700} fill="#121212">2F – 10F</text>
      </motion.g>
    </svg>
  );
}

/* 베드 — 점 하나가 침대 하나 */
function DotsBeds({ on }: { on: boolean }) {
  const list = [...Array(C.s).fill("s"), ...Array(C.t * 2).fill("t"), ...Array(C.sh * 3).fill("sh")] as ("s" | "t" | "sh")[];
  const col = { s: "#fff8ea", t: "#121212", sh: "#e8979c" };
  return (
    <svg viewBox={`0 0 100 ${Math.ceil(list.length / 10) * 9.8 + 2.4}`} className="h-full w-full">
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
      <motion.path d="M-4 96 C 20 90, 34 76, 58 74 S 100 70, 124 52" fill="none" stroke="#e8979c" strokeWidth={4} strokeLinecap="round" initial={{ pathLength: 0 }} animate={on ? { pathLength: 1 } : {}} transition={{ duration: 1.4, ease: EASE }} />
      <text x={100} y={74} fontSize={6} fontWeight={800} fill="#e8979c">{en ? "Line 2" : "2호선"}</text>
      {pins.map(([x, y, n], i) => (
        <g key={n}>
          <motion.line x1={58} y1={74} x2={x} y2={y} stroke="#121212" strokeWidth={0.8} strokeDasharray="2 2" initial={{ pathLength: 0 }} animate={on ? { pathLength: 1 } : {}} transition={{ duration: 0.6, delay: 1 + i * 0.2 }} />
          <motion.g style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }} initial={{ scale: 0, y: -10 }} animate={on ? { scale: 1, y: 0 } : {}} transition={{ type: "spring", stiffness: 260, damping: 14, delay: 1.2 + i * 0.2 }}>
            <path d={`M${x} ${y} l-4.5 -7 a5.4 5.4 0 1 1 9 0 z`} fill="#121212" />
            <circle cx={x} cy={y - 9.4} r={2} fill="#eaf4ef" />
            <text x={x} y={y + 8} textAnchor="middle" fontSize={7} fontWeight={800} fill="#121212">{n}</text>
          </motion.g>
        </g>
      ))}
      <circle cx={58} cy={74} r={10} fill="none" stroke="#fff8ea" strokeWidth={1.2} className="ping" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
      <circle cx={58} cy={74} r={5} fill="#fff8ea" stroke="#121212" strokeWidth={1.6} />
      <text x={58} y={90} textAnchor="middle" fontSize={6.5} fontWeight={800} fill="#121212">{en ? "Sinchon Stn." : "신촌역"}</text>
    </svg>
  );
}

/* 24시간 — 하루를 도는 시계 */
function Clock24({ on }: { on: boolean }) {
  return (
    <svg viewBox="-60 -60 120 120" className="h-full w-full">
      <motion.circle r={46} fill="none" stroke="#121212" strokeWidth={1.4} initial={{ pathLength: 0 }} animate={on ? { pathLength: 1 } : {}} transition={{ duration: 1.2, ease: EASE }} />
      <motion.path d="M0 -40 A40 40 0 0 1 0 40" fill="none" stroke="#fff8ea" strokeWidth={7} initial={{ pathLength: 0 }} animate={on ? { pathLength: 1 } : {}} transition={{ duration: 1.4, delay: 0.3, ease: EASE }} />
      <motion.path d="M0 40 A40 40 0 0 1 0 -40" fill="none" stroke="#121212" strokeWidth={7} initial={{ pathLength: 0 }} animate={on ? { pathLength: 1 } : {}} transition={{ duration: 1.4, delay: 1.2, ease: EASE }} />
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return <line key={i} x1={Math.sin(a) * 48} y1={-Math.cos(a) * 48} x2={Math.sin(a) * (i % 6 ? 51 : 55)} y2={-Math.cos(a) * (i % 6 ? 51 : 55)} stroke="#121212" strokeWidth={i % 6 ? 1 : 2} />;
      })}
      <text y={-22} textAnchor="middle" fontSize={8} fill="#121212">☀</text>
      <text y={28} textAnchor="middle" fontSize={8} fill="#fff8ea">☾</text>
      <g className={on ? "spin24" : ""}>
        <line x1={0} y1={6} x2={0} y2={-36} stroke="#121212" strokeWidth={2.6} strokeLinecap="round" />
        <circle r={3.6} fill="#121212" />
      </g>
    </svg>
  );
}

const STATS = [
  { n: TOTAL, u: "실", uE: "rooms", l: "회복실 · 가족 체류실", lE: "Rooms", d: `1인 ${C.s} · 2인 ${C.t} · 가족 체류 ${C.sh} — 눈금 하나가 방 하나`, dE: `${C.s} single · ${C.t} twin · ${C.sh} share — one tick, one room`, Art: RingRooms },
  { n: BEDS, u: "베드", uE: "beds", l: "환자·보호자 침대", lE: "Beds", d: `회복실과 가족 체류실 — 점 하나가 침대 하나`, dE: `${C.s} + ${C.t * 2} + ${C.sh * 3} — one dot, one bed`, Art: DotsBeds },
  { n: 4, u: "곳", uE: "", l: "대학 · 의료 생활권", lE: "Universities nearby", d: "연세대·세브란스병원 생활권 · 이화 · 서강 · 홍익", dE: "Yonsei · Ewha · Sogang · Hongik, near Sinchon Station", Art: MapUnis },
  { n: 3, u: "개월", uE: "mo", l: "퇴원 후 단기 회복 체류", lE: "Short recovery stay", d: "식사 · 재활 · 돌봄과 가족의 동행 (구상)", dE: "Day or night, no queue to get in", Art: Clock24 },
];
function StatRow({ s, i }: { s: (typeof STATS)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, margin: "-18% 0px" });
  const Art = s.Art;
  const en = useEN();
  return (
    <div ref={ref} className={`relative flex items-center gap-4 border-t border-[#121212]/20 py-6 ${i % 2 ? "flex-row-reverse text-right" : ""}`}>
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
    <section className="relative overflow-hidden pb-16 pt-20" style={{ background: "var(--o-gold)", color: "#121212" }}>
      {/* 모핑 덩어리 */}
      <div className="liquid pointer-events-none absolute -right-24 top-10 h-[340px] w-[340px]" style={{ background: "radial-gradient(circle at 35% 35%, #f6e7c6, #e9d2a6 60%, transparent 72%)" }} />
      <div className="liquid2 pointer-events-none absolute -left-28 bottom-24 h-[300px] w-[300px]" style={{ background: "radial-gradient(circle at 60% 40%, #a9e2d9, #f2a7a0 55%, transparent 72%)" }} />
      {/* 흐르는 글씨 */}
      <div className="pointer-events-none relative overflow-hidden whitespace-nowrap">
        <div className="drift serif inline-block text-[64px] italic leading-none" style={{ color: "transparent", WebkitTextStroke: "1px rgba(29,38,48,0.35)" }}>
          {`recovery · family · meals · rehab · lifelong doctor · `.repeat(4)}
        </div>
      </div>
      <div className="relative px-6">
        <p className="kick mt-8 text-[#121212]">09 / IN NUMBERS</p>
        <h2 className="serif mt-3 text-[42px] leading-[0.98]">Small numbers.<br /><em>Big care.</em></h2>
        <div className="mt-8">
          {STATS.map((s, i) => <StatRow key={s.l} s={s} i={i} />)}
        </div>
        <div className="mt-4 overflow-hidden rounded-[22px] bg-[#121212] px-5 py-5 text-[#eaf4ef]">
          <div className="flex items-center gap-1.5">
            {(["s", "t", "sh"] as const).map((k) => <span key={k} className="h-2.5 flex-1 origin-left rounded-full" style={{ background: k === "s" ? "#fff8ea" : k === "t" ? "#eaf4ef" : "#f2a7a0", flexGrow: C[k] }} />)}
          </div>
          <p className="mt-3 text-[14px] font-bold leading-relaxed">{en ? <>From one night to a full semester —<br />your first home in Seoul.</> : <>건강할 때부터 생의 마지막까지,<br />나를 아는 주치의가 곁에 있습니다.</>}</p>
        </div>
      </div>
      <div className="pointer-events-none relative mt-12 overflow-hidden whitespace-nowrap">
        <div className="drift-r serif inline-block text-[44px] italic leading-none text-[#121212]/80">
          {"SINCHON CARE HOUSE · GB LABS · ".repeat(6)}
        </div>
      </div>
    </section>
  );
}

/* ───────── 7. 영상 ───────── */
const FILMS = [
  { k: "home", t: "회복 후, 집으로", tE: "Homecoming", src: "/sinchon/care/homecoming.mp4", poster: "care/homecoming-poster" },
  { k: "approach", t: "건물 외관 드론", tE: "Exterior", src: "/sinchon/care/approach.mp4", poster: "care/approach-poster" },
  { k: "care", t: "공동체 돌봄", tE: "Community care", src: "/sinchon/care/coop-care-ko.mp4", poster: "care/film-coop-care-ko" },
  { k: "nurse", t: "간호", tE: "Nursing", src: "/sinchon/care/coop-nurse.mp4", poster: "care/film-coop-nurse" },
  { k: "lounge", t: "가족 라운지", tE: "Family lounge", src: "/sinchon/care/coop-lounge.mp4", poster: "care/film-coop-lounge" },
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
    <section id="film" className="relative px-6 pb-20 pt-24" style={{ background: "#3e6e82" }}>
      <Head kick="10 / THE FILM" a="The whole story." b="In motion." sub={en ? <>From the building to daily life, and back to the city.<br />The full 2 min 41 s film, uncut.</> : <>신촌의 노을에서 회복실 창가까지,<br />그리고 공동체가 함께 돌보는 하루.</>} />
      <div className="mt-7 flex flex-wrap gap-2">
        {FILMS.map((x, k) => (
          <button key={x.k} onClick={() => setI(k)} className="relative rounded-full px-4 py-2.5 text-[13.5px] font-bold" style={{ color: k === i ? "#3e6e82" : "#dfe7ee" }}>
            {k === i && <motion.span layoutId="ftab" className="absolute inset-0 rounded-full" style={{ background: "var(--o-mint)" }} />}
            {k !== i && <span className="pill absolute inset-0" />}
            <span className="relative">{en ? x.tE : x.t}</span>
          </button>
        ))}
      </div>
      <div ref={box} className="relative mx-auto mt-4 aspect-[9/16] w-full max-w-[420px] overflow-hidden rounded-[26px] bg-black">
        <video key={f.k} ref={v} src={f.src} poster={IMG(f.poster)} playsInline muted loop autoPlay preload="metadata" className="h-full w-full object-cover" />
        <button onClick={toggleSound} className="glass absolute bottom-4 left-4 rounded-full px-4 py-2.5 text-[13px] font-bold" aria-label={sound ? "sound off" : "sound on"}>
          {sound ? (en ? "🔊 Sound off" : "🔊 소리 끄기") : en ? "🔇 Sound on" : "🔇 소리 켜기"}
        </button>
      </div>
    </section>
  );
}

/* ───────── 8. 자료 · 마무리 ───────── */
const DOCS = [
  { href: "https://gblabs.co.kr/ko/coop", t: "평생주치의 의료·돌봄 협동조합", tE: "Cooperative", d: "GB LABS · 필요성 · 운영 모델 · 로드맵", dE: "GB LABS cooperative page" },
  { href: "/sinchon/care", t: "케어하우스 입점 시안", tE: "Care house proposal", d: "층별 시설 · 입점 구조 · 환자·가족 안내", dE: "Floors · structure · families" },
  { href: "https://gblabs.co.kr", t: "GB LABS", tE: "GB LABS", d: "AI · 빅데이터 디지털 헬스케어", dE: "Digital health company" },
];

/* ───────── 가상 시뮬레이션 · 돌봄을 뒷받침하는 작은 데이터실 ───────── */
const FLOW = [
  { k: "sense", t: "병실 센서", d: "회복실의 생체신호·움직임 센서가 상태를 계속 읽습니다." },
  { k: "edge", t: "현장 처리", d: "건물 안 작은 데이터실이 바로 분석해, 멀리 보내지 않고도 이상 징후를 찾습니다." },
  { k: "care", t: "돌봄 담당자 확인", d: "간호스테이션과 주치의 화면에 알림이 뜨고, 담당자가 곁으로 갑니다." },
];
const INFRA = [
  { k: "power", t: "전력", d: "안정적인 전기 공급과 비상전원(UPS)이 먼저입니다. 건물의 수전 여유를 확인해야 합니다." },
  { k: "cool", t: "냉각", d: "장비의 열을 밖으로 내보낼 경로가 필요합니다. 지하라면 배기 동선이 핵심입니다." },
  { k: "flood", t: "침수 대비", d: "지하 공간은 물막이판·차수 설계·바닥 높이 확보로 침수에 대비합니다." },
];
function DcStep({ i, set, children }: { i: number; set: (n: number) => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { margin: "-45% 0px -35% 0px" });
  useEffect(() => { if (seen) set(i); }, [seen, i, set]);
  return <div ref={ref} id={`dcstep-${i}`} className="flex min-h-[46svh] flex-col justify-center py-6">{children}</div>;
}
function DcSim() {
  const [idx, setIdx] = useState(0);
  const f = Math.min(idx, 2);
  const on: Record<string, boolean> = { power: idx >= 3, cool: idx >= 4, flood: idx >= 5 };
  const hi = (i: number) => (f === i ? "#f2a7a0" : "#ffffff");
  const IMGS = ["dc-1-room", "dc-2-edge", "dc-3-nurse", "dc-4-power", "dc-5-cool", "dc-6-flood"];
  const steps = [...FLOW.map((x, i) => ({ n: `0${i + 1}`, t: x.t, d: x.d, tag: "흐름" })), ...INFRA.map((x, i) => ({ n: `0${i + 4}`, t: x.t, d: x.d, tag: "지하 설비" }))].map((x, i) => ({ ...x, img: IMGS[i] }));
  return (
    <section id="dc" className="relative px-6 pb-16 pt-20" style={{ background: "#eaf4ef", color: "#121212" }}>
      <p className="kick text-[10px] text-[#3e6e82]">VIRTUAL SIMULATION · 가상</p>
      <h3 className="mt-3 text-[24px] font-black leading-snug">돌봄을 뒷받침하는<br />작은 데이터실</h3>
      <p className="mt-2 text-[13.5px] leading-relaxed text-[#4a4f55]">아래로 내리면 병실 센서에서 담당자 확인까지, 그리고 지하 설비가 하나씩 켜집니다.</p>
      <div className="mt-5 overflow-hidden rounded-[22px] bg-[#0e1f24]"><video src="/sinchon/care/mg-hidden.mp4" poster="/sinchon/care/mg-hidden-poster.webp" autoPlay muted loop playsInline preload="metadata" className="block aspect-[9/16] w-full object-cover" /></div>
      <motion.div className="mt-5 overflow-hidden rounded-[22px] bg-[#d9e4e2]" initial={{ y: 28, clipPath: "inset(10% 0% 0% 0% round 22px)" }} whileInView={{ y: 0, clipPath: "inset(0% 0% 0% 0% round 22px)" }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: EASE }}>
        <img src="/sinchon/care/dc-exterior.webp" alt="고급 회복 시설 콘셉트 이미지" className="block aspect-[4/5] w-full object-cover" loading="lazy" decoding="async" />
      </motion.div>
      <p className="mt-2 text-[11px] text-[#7a7466]">콘셉트 이미지 · 실제 건물 외관과 다를 수 있습니다</p>
      <div className="relative">
      <div id="dcsticky" className="sticky top-[60px] z-10 mt-5 rounded-[22px] bg-[#eaf4ef]/95 pb-1 pt-1 backdrop-blur">
        <div className="mx-auto max-w-[360px]">
          <svg viewBox="0 0 300 300" className="h-auto w-full max-h-[44svh]">
            {/* 지면 */}
            <rect x={0} y={178} width={300} height={3} fill="#121212" />
            <text x={6} y={174} fontSize={8} fontWeight={800} fill="#3e6e82">지상</text>
            <text x={6} y={192} fontSize={8} fontWeight={800} fill="#3e6e82">지하</text>
            {/* 병실 층 */}
            {Array.from({ length: 5 }, (_, i) => (
              <g key={i}>
                <rect x={80} y={40 + i * 26} width={140} height={24} rx={2} fill={i === 4 ? "#d9eef0" : "#fde3dc"} stroke="#121212" strokeWidth={1} />
                {i < 4 && [0, 1, 2].map((j) => (
                  <circle key={j} cx={100 + j * 40} cy={52 + i * 26} r={3} fill={hi(0)} stroke="#121212" strokeWidth={0.8}>
                    {f === 0 && <animate attributeName="r" values="2.5;4.5;2.5" dur={`${1 + j * 0.3}s`} repeatCount="indefinite" />}
                  </circle>
                ))}
              </g>
            ))}
            <text x={150} y={34} textAnchor="middle" fontSize={8.5} fontWeight={800} fill="#121212">회복실 층 · 병실 센서</text>
            {/* 간호스테이션 */}
            <rect x={160} y={146} width={52} height={16} rx={3} fill={hi(2)} stroke="#121212" strokeWidth={1} />
            <text x={186} y={157} textAnchor="middle" fontSize={7.5} fontWeight={900} fill="#121212">간호스테이션</text>
            {/* 지하 */}
            <rect x={80} y={186} width={140} height={34} rx={3} fill="#cfe6ec" stroke="#121212" strokeWidth={1} />
            <text x={110} y={207} textAnchor="middle" fontSize={8} fontWeight={800} fill="#3e6e82">재활 공간</text>
            <rect x={160} y={192} width={52} height={22} rx={3} fill={hi(1)} stroke="#121212" strokeWidth={1.2} />
            <text x={186} y={206} textAnchor="middle" fontSize={7.5} fontWeight={900} fill="#121212">작은 데이터실</text>
            <text x={186} y={232} textAnchor="middle" fontSize={7} fill="#4a4f55">층 · 위치 · 규모 미정</text>
            {/* 흐름 선 */}
            <path d="M210 60 C 250 80, 250 180, 212 200" stroke="#5b97ac" strokeWidth={1.6} fill="none" strokeDasharray="4 4"><animate attributeName="stroke-dashoffset" from="0" to="-16" dur="0.8s" repeatCount="indefinite" /></path>
            <path d="M186 192 L186 162" stroke="#f2a7a0" strokeWidth={1.8} strokeDasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="-12" dur="0.6s" repeatCount="indefinite" /></path>
            <circle r={3.5} fill="#ffffff" stroke="#3e6e82" strokeWidth={1.5}>
              <animateMotion dur="3s" repeatCount="indefinite" path="M210 60 C 250 80, 250 180, 212 200 L186 200 L186 162" />
            </circle>
            {/* 전력 */}
            {on.power && (
              <g>
                <path d="M300 190 L232 190 L232 203 L212 203" stroke="#e8b04a" strokeWidth={2.4} fill="none"><animate attributeName="stroke-dasharray" values="0 200;200 0" dur="1s" fill="freeze" /></path>
                <text x={262} y={185} textAnchor="middle" fontSize={7.5} fontWeight={900} fill="#b07a12">수전 · UPS</text>
              </g>
            )}
            {/* 냉각 */}
            {on.cool && (
              <g>
                <path d="M200 192 L200 120 L230 120 L230 20" stroke="#7aa6e8" strokeWidth={2.2} fill="none" strokeDasharray="6 4"><animate attributeName="stroke-dashoffset" from="0" to="-20" dur="0.7s" repeatCount="indefinite" /></path>
                <text x={232} y={16} textAnchor="middle" fontSize={7.5} fontWeight={900} fill="#3e6eb0">배기 · 냉각</text>
              </g>
            )}
            {/* 침수 대비 */}
            {on.flood && (
              <g>
                <rect x={40} y={164} width={36} height={14} fill="#5b97ac" />
                <rect x={224} y={164} width={36} height={14} fill="#5b97ac" />
                <text x={58} y={160} textAnchor="middle" fontSize={7.5} fontWeight={900} fill="#3e6e82">물막이</text>
                <text x={242} y={160} textAnchor="middle" fontSize={7.5} fontWeight={900} fill="#3e6e82">물막이</text>
                <path d="M80 222 L220 222" stroke="#3e6e82" strokeWidth={3} />
                <text x={150} y={246} textAnchor="middle" fontSize={7} fill="#3e6e82">차수 설계 · 바닥 높이 확보</text>
              </g>
            )}
            <text x={150} y={286} textAnchor="middle" fontSize={7.5} fill="#7a7466">단순화한 가상 단면도</text>
          </svg>
        </div>
        <div className="mt-1 flex gap-1 overflow-x-auto px-1 pb-2" style={{ scrollbarWidth: "none" }}>
          {steps.map((x, k) => (
            <button key={k} onClick={() => { const el = document.getElementById(`dcstep-${k}`); const st = document.getElementById("dcsticky"); if (!el) return; const off = (st ? st.getBoundingClientRect().height : 0) + 72; window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - off + 40, behavior: "smooth" }); }} className="shrink-0 rounded-full px-2.5 py-1.5 text-[11px] font-bold transition-colors" style={{ background: k === idx ? "#3e6e82" : k < idx ? "#cfe6ec" : "#ffffff", color: k === idx ? "#fff" : "#3e6e82" }}>
              {k + 1}. {x.t}
            </button>
          ))}
        </div>
      </div>
      <div className="relative">
        {steps.map((x, i) => (
          <DcStep key={x.n} i={i} set={setIdx}>
            <div className="w-full rounded-[20px] bg-white p-5 shadow-sm" style={{ outline: i === idx ? "2px solid #3e6e82" : "none" }}>
              <p className="text-[11px] font-bold tracking-[0.15em] text-[#5b97ac]">{x.n} · {x.tag}</p>
              <p className="mt-1 text-[19px] font-black text-[#3e6e82]">{x.t}</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#4a4f55]">{x.d}</p>
            </div>
            <motion.div className="mt-5 overflow-hidden rounded-[20px] bg-[#d9e4e2]" initial={{ y: 28, clipPath: "inset(12% 0% 0% 0% round 20px)" }} whileInView={{ y: 0, clipPath: "inset(0% 0% 0% 0% round 20px)" }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: EASE }}>
              <img src={`/sinchon/care/${x.img}.webp`} alt={`${x.t} · 콘셉트 이미지`} className="block aspect-video w-full object-cover" loading="lazy" decoding="async" />
            </motion.div>
          </DcStep>
        ))}
      </div>
      </div>
      <div className="mt-10 space-y-6">
        <div><div className="overflow-hidden rounded-[18px] bg-[#0e1f24]"><video src="/sinchon/care/mg-signal.mp4" poster="/sinchon/care/mg-signal-poster.webp" autoPlay muted loop playsInline preload="metadata" className="block aspect-[9/16] w-full object-cover" /></div><p className="mt-2 text-[15px] font-black text-[#3e6e82]">병실의 신호가 담당자에게</p></div>
        <div><div className="overflow-hidden rounded-[18px] bg-[#0e1f24]"><video src="/sinchon/care/mg-layers.mp4" poster="/sinchon/care/mg-layers-poster.webp" autoPlay muted loop playsInline preload="metadata" className="block aspect-[9/16] w-full object-cover" /></div><p className="mt-2 text-[15px] font-black text-[#3e6e82]">지하의 디지털 레이어</p></div>
      </div>
      <div className="mt-6 rounded-2xl bg-[#3e6e82] px-4 py-3 text-[12.5px] leading-relaxed text-white">기존 지하 재활 구상은 그대로 두고, 데이터실의 층 · 위치 · 장비 규모는 지하층 평면 · 단면 · 바닥 하중 · 수전 여유를 확인한 뒤 정합니다.</div>
      <p className="mt-4 text-[11px] leading-relaxed text-[#7a7466]">이 화면은 검토용 가상 시뮬레이션이며, 확정된 시설 계획이나 계약 내용이 아닙니다.</p>
    </section>
  );
}

function Docs() {
  const en = useEN();
  return (
    <section id="docs" className="px-6 pb-16 pt-20" style={{ background: "#5b97ac" }}>
      <p className="kick" style={{ color: "var(--o-sub)" }}>11 / DOCUMENTS</p>
      <h3 className="mt-3 text-[24px] font-black">{en ? "Learn more" : "더 알아보기"}</h3>
      <div className="mt-6 space-y-2.5">
        {DOCS.map((d) => (
          <a key={d.href} href={d.href} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border border-white/12 px-5 py-4 active:scale-[0.99]">
            <span>
              <span className="block text-[16px] font-black">{en ? d.tE : d.t}</span>
              <span className="block text-[12.5px] text-[#f2f9f9]">{en ? d.dE : d.d}</span>
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
      <p className="kick" style={{ color: "var(--o-sub)" }}>SINCHON CARE HOUSE · GB LABS</p>
      <Reveal><h2 className="serif mt-5 text-[52px] leading-[0.96]">Space becomes<br /><em>care.</em></h2></Reveal>
      <p className="mt-6 text-[15px] font-bold">{en ? "Sinchon Care House (working title)" : "신촌 평생주치의 케어하우스(가칭)"}</p>
      <p className="mt-1 text-[14px] text-[#c9d4de]">{en ? "Treatment at the hospital, recovery in Sinchon" : "치료는 대학병원에서, 회복은 신촌에서 — 의료복지사회적협동조합"}</p>
      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="pill mt-8 px-6 py-3 text-[14px] font-bold">{en ? "Back to top ↑" : "처음으로 ↑"}</button>
      <div className="mt-16 space-y-1.5 text-[11px] leading-[1.7] text-[#7f91a4]">
        {en ? (
          <>
            <p>PRIVATE CONCEPT REVIEW</p>
            <p>Everything on this site — text, numbers, images and videos — is a virtual scenario.</p>
          </>
        ) : (
          <>
            <img src="/sinchon/care/gblabs-logo-white.png" alt="GB LABS" className="mx-auto mb-4 h-7 w-auto opacity-90" />
            <p>입점 검토용 시안 · 이미지와 영상은 AI 예시</p>
            <p>층별 구성·운영 구조는 인허가 검토 후 확정합니다.</p>
          </>
        )}
      </div>
    </section>
  );
}


/* ───────── 누구를 위한 곳인가 ───────── */
const TINT = ["#d9eef0", "#fde3dc", "#e6e9f8"];
const WHO = [
  { n: "01", t: "지방에서 올라온 환우", d: "세브란스에서 암 치료를 받는 동안, 서울에 머물 곳이 필요한 분", stay: "단기 2~3개월" },
  { n: "02", t: "수술 후 집에서 관리가 어려운 환우", d: "퇴원은 했지만 상처 관리·영양·재활을 체계적으로 이어 가야 하는 분", stay: "단기 2~3개월" },
  { n: "03", t: "정기적으로 통원하는 환우", d: "항암·방사선·외래 일정이 이어져 병원 가까이 머무는 것이 나은 분", stay: "통원 기간 동안" },
];
function Who() {
  return (
    <section id="who" className="paper relative px-6 pb-20 pt-20">
      <Head dark={false} kick="WHO WE CARE FOR" a="Between hospital" b="and home." sub={<>퇴원해도 바로 집으로 가기 어려운 분들을 위한,<br />요양원 가기 전의 고급 회복 중간집입니다.</>} />
      <div className="mt-8 space-y-3">
        {WHO.map((w, i) => (
          <Reveal key={w.n} delay={i * 0.08}>
            <div className="rounded-[22px] p-5" style={{ background: TINT[i] }}>
              <div className="flex items-baseline justify-between">
                <span className="serif text-[30px] italic leading-none text-[#3e6e82]">{w.n}</span>
                <span className="rounded-full bg-white/80 px-3 py-1 text-[11.5px] font-bold text-[#3e6e82]">{w.stay}</span>
              </div>
              <p className="mt-3 text-[18px] font-black leading-snug">{w.t}</p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-[#4a4f55]">{w.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="mt-8 grid grid-cols-3 gap-2 text-center">
        {[["세브란스", "가장 가까운 대형 건물", "#8cc2d2"], ["전국", "대기 중인 환우", "#f2a7a0"], ["주차타워", "별도 주차 시설 완비", "#a9c4e8"]].map(([a, b, c], i) => (
          <Reveal key={a} delay={0.1 + i * 0.1}>
            <div className="h-full rounded-2xl px-2 py-4 text-white" style={{ background: c }}><p className="text-[16px] font-black">{a}</p><p className="mt-1 text-[11px] leading-snug opacity-90">{b}</p></div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}



/* ───────── 그늘막 오프닝 필름 (dot 모션그래픽) ───────── */
function ShadeFilm() {
  return (
    <section className="relative bg-[#0e1f24]">
      <video src="/sinchon/care/mg-shade.mp4" poster="/sinchon/care/mg-shade-poster.webp" autoPlay muted loop playsInline preload="metadata" className="block aspect-[9/16] max-h-[100svh] w-full object-cover" />
    </section>
  );
}

/* ───────── 도심 속 회복의 그늘막 ───────── */
function Shade() {
  return (
    <section id="shade" className="paper relative px-6 pb-20 pt-24">
      <Head dark={false} kick="OUR PHILOSOPHY" a="A shade" b="for recovery." sub={<>도심 속 회복의 그늘막.</>} />
      <Reveal>
        <div className="arch relative mt-8 aspect-[4/5] bg-[#ddd6c6]">
          <video src="/sinchon/care/coop-hug.mp4" poster="/sinchon/care/film-coop-hug.webp" autoPlay muted loop playsInline preload="metadata" className="h-full w-full object-cover" />
        </div>
      </Reveal>
      <div className="mt-8 space-y-3 text-[15.5px] leading-[1.85] text-[#1d2630]">
        <p>골프장의 그늘막처럼, 치료와 치료 사이 잠시 쉬어 가는 자리.</p>
        <p>병원 치료 이후에도 이어져야 할 회복과 돌봄. 편안한 체류 공간과 식사, 재활, 가족의 동행까지 함께 고려한 새로운 공간을 구상합니다.</p>
        <p className="font-bold">치료와 일상 사이, 몸과 마음이 쉬어 갈 수 있는 공간을 지향합니다.</p>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-2 text-center">
        {[["회복", "퇴원 후 일상 복귀까지"], ["체류", "환자와 가족이 함께"], ["지원", "식사 · 재활 · 돌봄"]].map(([a, b], i) => (
          <Reveal key={a} delay={i * 0.08}><div className="h-full rounded-2xl px-2 py-4" style={{ background: ["#d9eef0", "#fde3dc", "#e6e9f8"][i] }}><p className="text-[17px] font-black text-[#3e6e82]">{a}</p><p className="mt-1 text-[11px] leading-snug text-[#4a4f55]">{b}</p></div></Reveal>
        ))}
      </div>
    </section>
  );
}

/* ───────── 지하 1·2층 특화 재활 ───────── */
function Rehab() {
  return (
    <section id="rehab" className="relative px-6 pb-20 pt-24" style={{ background: "linear-gradient(180deg,#3e6e82,#5b97ac)" }}>
      <Head kick="B1 · B2 / SPECIAL REHAB" a="A space" b="to move again." sub="회복을 위한 특별한 공간. 지하 1·2층을 활용한 재활운동, 수중 보행훈련 등 특화 프로그램을 검토합니다." />
      <div className="mt-8 grid grid-cols-2 gap-3">
        {[["/sinchon/care/rehab.webp", "B1", "재활운동 센터", "회복 단계에 맞춘 운동과 신체기능 회복"], ["/sinchon/care/aqua.webp", "B2", "수중 보행훈련", "부력으로 관절 부담을 줄이는 보행 연습"]].map(([img, f, t, d]) => (
          <Reveal key={f}>
            <div>
              <div className="relative aspect-[3/4] overflow-hidden rounded-[18px] bg-[#8cc2d2]">
                <img src={img} alt={`${t} · 구상 이미지`} className="h-full w-full object-cover" loading="lazy" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/sinchon/care/stage-home.webp"; }} />
                <span className="absolute left-2 top-2 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-bold">구상 이미지</span>
              </div>
              <p className="serif mt-3 text-[22px] italic leading-none" style={{ color: "var(--o-gold)" }}>{f}</p>
              <p className="mt-1 text-[16px] font-black">{t}</p>
              <p className="mt-0.5 text-[12.5px] leading-relaxed text-[#f2f9f9]">{d}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="mt-6 text-[11.5px] leading-[1.7] text-[#e4f1f3]">공간의 구조와 방수·설비·피난·장애인 접근성, 의료시설 인허가에 맞춰 세부 계획을 구체화할 예정입니다.</p>
    </section>
  );
}

/* ───────── 신촌 대학가 약도 (애니메이션) ───────── */
const UNIS: [number, number, string, string][] = [[150, 62, "연세대학교", "세브란스병원"], [256, 108, "이화여대", ""], [212, 312, "서강대학교", ""], [44, 132, "홍익대학교", ""]];
const STNS: [number, number, string, string, number][] = [[150, 232, "2호선 신촌역", "", 0.9], [222, 166, "경의·중앙선 신촌역", "(신촌기차역)", 0.9], [40, 232, "홍대입구역", "", 2.7], [254, 232, "이대역", "", 2.85]];
function CampusMap() {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, amount: 0.2 });
  const T = { duration: 1.2, ease: EASE };
  return (
    <div ref={ref} className="relative aspect-[300/370] w-full overflow-hidden rounded-[14px] bg-[#f2f9f9]">
      <svg viewBox="0 0 300 370" className="absolute inset-0 h-full w-full">
        {/* 대학가 영역 */}
        <motion.ellipse cx={150} cy={190} rx={150} ry={170} fill="#d9eef0" initial={{ scale: 0.6 }} animate={on ? { scale: 1 } : {}} transition={{ duration: 1.4, ease: EASE }} style={{ transformOrigin: "150px 190px" }} />
        {/* 도로 */}
        <path d="M150 370 L150 0" stroke="#e4f1f3" strokeWidth={10} />
        {/* 2호선 */}
        <motion.path d="M0 232 L300 232" stroke="#4caf50" strokeWidth={5} fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={on ? { pathLength: 1 } : {}} transition={T} />
        {/* 경의중앙선 */}
        <motion.path d="M0 252 C 20 244, 30 238, 40 232 C 100 205, 170 182, 222 166 L 300 142" stroke="#7fc7c4" strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray="1 0" initial={{ pathLength: 0 }} animate={on ? { pathLength: 1 } : {}} transition={{ ...T, delay: 0.3 }} />
        <text x={292} y={138} textAnchor="end" fontSize={7} fontWeight={800} fill="#3e8f8b">경의중앙선</text>
        <text x={292} y={226} textAnchor="end" fontSize={7} fontWeight={800} fill="#2e7d32">2호선</text>
        {/* 역 */}
        {STNS.map(([x, y, n, l, dl], i) => (
          <motion.g key={n + l} initial={{ scale: 0 }} animate={on ? { scale: 1 } : {}} transition={{ type: "spring", stiffness: 260, damping: 16, delay: dl }} style={{ transformOrigin: `${x}px ${y}px` }}>
            {i < 2 && <circle cx={x} cy={y} r={11} fill="#4caf50" opacity={0.25}><animate attributeName="r" values="8;16;8" dur="2.2s" repeatCount="indefinite" /></circle>}
            <circle cx={x} cy={y} r={i < 2 ? 7.5 : 5.5} fill={i < 2 ? "#fff8ea" : "#ffffff"} stroke="#121212" strokeWidth={i < 2 ? 2 : 1.4} />
            <text x={x} y={y + (y > 200 ? 18 : -11)} textAnchor="middle" fontSize={8.5} fontWeight={900} fill="#121212">{n}</text>
            <text x={x} y={y + (y > 200 ? 27 : -3) } textAnchor="middle" fontSize={6} fontWeight={700} fill="#4a4f55" style={{ display: y > 200 ? "block" : "none" }}>{l}</text>
            {y < 200 && <text x={x + 10} y={y + 3} fontSize={6} fontWeight={700} fill="#4a4f55">{l}</text>}
          </motion.g>
        ))}
        {/* 대학 */}
        {UNIS.map(([x, y, n, sub], i) => (
          <motion.g key={n} initial={{ y: -14, scale: 0 }} animate={on ? { y: 0, scale: 1 } : {}} transition={{ type: "spring", stiffness: 220, damping: 14, delay: i === 0 ? 1.5 : 2.6 + i * 0.15 }} style={{ transformOrigin: `${x}px ${y}px` }}>
            <rect x={x - (sub ? 38 : 30)} y={y - 13} width={sub ? 76 : 60} height={sub ? 30 : 20} rx={8} fill={i === 0 ? "#e6e9f8" : "#ffffff"} stroke="#121212" strokeWidth={1.3} />
            <text x={x} y={y + 1} textAnchor="middle" fontSize={8.5} fontWeight={900} fill="#121212">{n}</text>
            {sub && <text x={x} y={y + 12} textAnchor="middle" fontSize={7.5} fontWeight={800} fill="#3e6e82">{sub}</text>}
          </motion.g>
        ))}
        {/* 세브란스 연결 */}
        <motion.line x1={164} y1={196} x2={152} y2={78} stroke="#3e6e82" strokeWidth={1.3} strokeDasharray="4 4" initial={{ pathLength: 0 }} animate={on ? { pathLength: 1 } : {}} transition={{ duration: 0.8, delay: 1.8 }} />
        {/* 케어하우스 */}
        <circle cx={166} cy={204} fill="none" stroke="#f2a7a0"><animate attributeName="r" values="10;30" dur="2s" repeatCount="indefinite" /><animate attributeName="stroke-width" values="3;0" dur="2s" repeatCount="indefinite" /></circle>
        <motion.g initial={{ scale: 0 }} animate={on ? { scale: 1 } : {}} transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.6 }} style={{ transformOrigin: "166px 204px" }}>
          <rect x={156} y={186} width={20} height={30} rx={3} fill="#f2a7a0" stroke="#121212" strokeWidth={1.5} />
          <rect x={160} y={191} width={12} height={2.5} fill="#fff8ea" /><rect x={160} y={197} width={12} height={2.5} fill="#fff8ea" /><rect x={160} y={203} width={12} height={2.5} fill="#fff8ea" />
          <rect x={182} y={192} width={64} height={16} rx={8} fill="#121212" />
          <text x={214} y={203} textAnchor="middle" fontSize={7.5} fontWeight={900} fill="#ffffff">SINCHON CARE</text>
        </motion.g>
        <rect x={52} y={346} width={196} height={17} rx={8.5} fill="#ffffff" />
        <text x={150} y={357.5} textAnchor="middle" fontSize={8.5} fontWeight={800} fill="#3e6e82">두 신촌역 사이 · 국내 최대 대학가</text>
      </svg>
    </div>
  );
}

function OnceVideo({ src, poster, className }: { src: string; poster: string; className: string }) {
  const v = useRef<HTMLVideoElement>(null);
  const seen = useInView(v, { once: true, amount: 0.15 });
  useEffect(() => { if (seen && v.current) { v.current.playbackRate = 1.6; v.current.play().catch(() => {}); } }, [seen]);
  return <video ref={v} src={src} poster={poster} muted playsInline preload="auto" className={className} />;
}

/* ───────── 대학과 의료, 신촌이라는 입지 ───────── */
function Place() {
  return (
    <section id="place" className="paper relative px-6 pb-20 pt-24">
      <Head dark={false} kick="LOCATION" a="University, medicine," b="and Sinchon." sub={<>대학과 의료, 신촌이라는 입지.<br />연세대학교와 세브란스병원이 가까운 신촌 도심 생활권.</>} />
      <Reveal>
        <div className="mt-8 overflow-hidden rounded-[22px] border-[3px] border-[#121212] bg-[#f2f9f9] p-2">
          <CampusMap />
          <p className="px-1 pt-3 text-[14px] font-black leading-snug text-[#3e6e82]">대학과 병원이 가까운 신촌,<br />환자와 가족을 위한 회복의 그늘막</p>
          <p className="px-1 pb-1 pt-2 text-[10.5px] text-[#4a4f55]">위치 관계를 단순화한 개략도입니다. 거리와 소요시간은 실제 경로 확인 후 표기합니다.</p>
        </div>
      </Reveal>
      <div className="mt-6 space-y-2.5">
        {[["의료", "연세의료원 생활권 — 치료와 회복을 같은 동네에서"], ["교육", "연세 · 이화 · 서강 · 홍익, 대학가의 활기"], ["교통", "지하철 2호선, 주요 간선도로와 버스 노선"], ["건물", "도로에 면한 코너 건물, 별도 주차타워"]].map(([a, b]) => (
          <div key={a} className="flex items-baseline gap-3 border-t border-[#121212]/15 pt-2.5"><span className="w-10 shrink-0 text-[14px] font-black text-[#3e6e82]">{a}</span><span className="text-[13.5px] leading-relaxed text-[#1d2630]">{b}</span></div>
        ))}
      </div>
      <p className="mt-5 text-[11px] text-[#7a7466]">인근 대학·병원은 위치 안내이며, 공식 제휴를 뜻하지 않습니다.</p>
    </section>
  );
}

/* ───────── 왜 수술 병원 가까이여야 하나 ───────── */
const NEAR_WHY = [
  { k: "01", t: "이상 징후에 바로 수술 병원으로", d: "수술 후 열이 나거나 상처에 문제가 생기면, 먼 길을 돌지 않고 수술받은 병원으로 곧장 갑니다." },
  { k: "02", t: "외래·항암 통원이 가벼워집니다", d: "항암·방사선·외래 일정마다 지방을 오가는 대신, 대학병원 생활권 안에서 치료를 이어 갑니다." },
  { k: "03", t: "수술 의료진과 끊김 없는 연계", d: "주치의가 수술 병원의 진료 기록을 함께 보고, 전문의 협진 연계를 구상합니다." },
  { k: "04", t: "보호자의 시간과 체력을 아낍니다", d: "병원과 숙소를 오가던 시간을 줄여, 가족이 환자 곁에 더 오래 머물 수 있습니다." },
];
function NearWhy() {
  return (
    <section id="near" className="relative px-6 pb-20 pt-24" style={{ background: "linear-gradient(180deg,#5b97ac,#3e6e82)" }}>
      <Head kick="WHY CLOSE TO THE HOSPITAL" a="Closer to surgery." b="Faster to heal." sub="수술 병원과 가까워야 하는 이유. 회복기의 안전은 거리에서 시작됩니다." />
      <div className="mt-8 space-y-3">
        {NEAR_WHY.map((x) => (
          <Reveal key={x.k}>
            <div className="glass rounded-[20px] p-5">
              <p className="serif text-[28px] italic leading-none" style={{ color: "var(--o-gold)" }}>{x.k}</p>
              <p className="mt-2 text-[17px] font-black leading-snug">{x.t}</p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-[#f2f9f9]">{x.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between rounded-2xl bg-white/10 px-5 py-4">
        <span className="text-[14px] font-bold">세브란스병원 · 연세의료원</span>
        <span className="serif text-[22px] italic" style={{ color: "var(--o-gold)" }}>같은 생활권</span>
      </div>
    </section>
  );
}

/* ───────── 수익 구조 ───────── */
const REV = [
  { f: "2~10F", t: "회복 레지던스 체류", d: "1인·2인 회복실, 가족 체류실 — 2~3개월 단기 체류 중심. 1인실 하루 20만 원선 (서울 중급 병원 1인실 기준)" },
  { f: "2F", t: "의료·간호 서비스", d: "평생주치의 진료, 방문간호, 재활 — 건강보험·장기요양·정책자금 연계 검토" },
  { f: "B1", t: "회복식 레스토랑 · 델리", d: "암 환우 맞춤 영양식을 입주자와 외래 환우·보호자에게, 포장·배달까지" },
  { f: "B2", t: "웰니스 숍 · 통원 셔틀", d: "항암 관리 용품과 웰니스 제품, 대학병원 통원 셔틀 — 주차는 별도 주차타워" },
  { f: "10F+", t: "증축 가능 공간", d: "10층 위 추가 공간 증축 여지 — 운영 방향에 맞춘 확장" },
];
function Revenue() {
  return (
    <section id="revenue" className="relative px-6 pb-20 pt-24" style={{ background: "linear-gradient(180deg,#3e6e82,#5b97ac)" }}>
      <Head kick="REVENUE MODEL" a="Care that" b="sustains itself." sub="위층의 회복 레지던스에, 지하 1·2층이 매일의 현금 흐름을 더하는 구조입니다." />
      <div className="mt-8 space-y-2.5">
        {REV.map((x) => (
          <Reveal key={x.t}>
            <div className="grid grid-cols-[80px_1fr] gap-3 rounded-2xl border border-white/15 p-4">
              <p className="serif text-[22px] italic leading-none" style={{ color: "var(--o-gold)" }}>{x.f}</p>
              <div><p className="text-[16px] font-black">{x.t}</p><p className="mt-1 text-[12.5px] leading-relaxed text-[#f2f9f9]">{x.d}</p></div>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="mt-6 rounded-2xl bg-white/12 p-5">
        <p className="kick text-[10px]" style={{ color: "var(--o-sub)" }}>REFERENCE · 1인실 기준</p>
        <p className="mt-2 flex items-baseline gap-2"><span className="serif text-[44px] italic leading-none" style={{ color: "var(--o-gold)" }}>20</span><span className="text-[15px] font-black">만 원 / 1일</span></p>
        <p className="mt-2 text-[12.5px] leading-relaxed text-[#f2f9f9]">서울 시내 중간 수준 병원(대형·종합병원이 아닌 통건물 전문병원) 1인실 기준가를 참고했습니다.</p>
      </div>
      <p className="mt-6 text-[11.5px] leading-[1.7] text-[#e4f1f3]">객실 수는 병원 운영 전문가 그룹이 운영 방향에 맞춰 정하며, 수익성과 지하층 매출 구성은 수지분석으로 검증한 뒤 확정합니다.</p>
    </section>
  );
}

/* ───────── 머리 · 떠 있는 버튼 · 안내 ───────── */

/* ───────── 대표 인사말 (정장 프로필) ───────── */
function CeoMessage() {
  preload("/sinchon/care/ceo-gown.webp", { as: "image", fetchPriority: "high" });
  const caps = ["고려대학교 의과대학·동 대학원 마취통증의학 (석사·박사)", "고려대학교 안암병원 마취통증의학과 교수", "대한의학회 정책이사", "전) 고려대학교 의과대학 교육 부학장", "전) 대한중환자의학회 부회장"];
  return (
    <section id="ceo" className="paper relative px-6 pb-20 pt-20">
      <Reveal><p className="kick" style={{ color: "#121212" }}>MESSAGE · 대표 인사말</p></Reveal>
      <Reveal delay={0.05}>
        <h2 className="serif mt-4 text-[40px] leading-[1.02]">혼자 짊어지지 않는<br /><em>돌봄.</em></h2>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="relative mt-8">
          <div className="absolute inset-0 translate-x-3 translate-y-3 border-[3px] border-[#121212] bg-[#8cc2d2]" />
          <img src="/sinchon/care/ceo-gown.webp" alt="GB LABS 대표이사 임춘학" className="relative block aspect-[4/5] w-full border-[3px] border-[#121212] object-cover object-top" loading="eager" fetchPriority="high" decoding="async" />
        </div>
      </Reveal>
      <Reveal delay={0.15}>
        <div className="mt-10 space-y-4 text-[15px] leading-[1.9] text-[#1d2630]">
          <p>안녕하십니까, GB LABS 대표이사 임춘학입니다.</p>
          <p>마취통증의학을 전공한 의사로 오랜 시간 환자의 가장 힘든 순간을 곁에서 지켜보았습니다. 병상 옆에서 가장 아프게 마주한 것은 병 그 자체보다, 그 무게를 홀로 감당하는 환자와 가족의 얼굴이었습니다.</p>
          <p>대학병원에서 치료를 받는 동안, 많은 환자와 보호자가 머물 곳을 찾아 병원 주변을 헤맵니다. 신촌 케어하우스는 그 질문에 대한 저희의 답입니다. 치료는 대학병원에서 받고, 회복은 나를 아는 주치의와 간호 팀이 있는 이곳에서 — 가족도 같은 건물에서 곁을 지킬 수 있도록.</p>
          <p>의사와 간호사, 요양보호사, 상담·복지 전문가가 한 팀이 되어 건강할 때부터 생의 마지막까지 함께하는 의료·돌봄 공동체. 의료복지사회적협동조합과 함께 신촌에서 그 첫걸음을 내딛겠습니다.</p>
        </div>
      </Reveal>
      <Reveal delay={0.2}>
        <div className="mt-8 border-t-[3px] border-[#121212] pt-4">
          <img src="/sinchon/care/gblabs-logo-dark.png" alt="GB LABS" className="h-6 w-auto" />
          <p className="mt-3 text-[14px] font-black">대표이사 임춘학</p>
          <ul className="mt-3 space-y-1 text-[12px] leading-[1.6] text-[#4a4f55]">{caps.map((c) => <li key={c}>{c}</li>)}</ul>
        </div>
      </Reveal>
    </section>
  );
}

/* ───────── 0. 첫 화면 영상 (옥상 라운지 드론 장면) ───────── */
function HeroFilm() {
  return (
    <section id="intro" className="relative h-[100svh] min-h-[600px] overflow-hidden" style={{ background: "#3e6e82" }}>
      <video className="absolute inset-0 h-full w-full object-cover" src="/sinchon/care/intro.mp4" poster="/sinchon/care/intro-poster.webp" autoPlay muted loop playsInline preload="auto" />
      <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(62,110,130,0.45) 0%,rgba(62,110,130,0) 24%,rgba(62,110,130,0) 52%,rgba(62,110,130,0.9) 100%)" }} />
      <div className="absolute inset-x-0 bottom-0 px-6 pb-14">
        <p className="kick text-[var(--o-mint)]">신촌 평생주치의 케어하우스(가칭)</p>
        <h1 className="mt-3 text-[36px] font-black leading-[1.2] tracking-tight">도심 속,<br /><span className="text-[var(--o-gold)]">회복의 그늘막.</span></h1>
        <p className="mt-3 text-[15px] font-bold text-[var(--o-sub)]">치료는 대학병원에서, 회복은 신촌에서.<br />치료와 일상 사이, 나와 가족이 잠시 쉬어 가는 곳.</p>
        <p className="mt-2 text-[11px] font-bold tracking-[0.18em] text-white/80">SINCHON CARE · GB LABS<br />PREMIUM MEDICAL RECOVERY &amp; CARE LIVING</p>
        <p className="mt-2 text-[11px] text-white/70">입점 검토용 시안 · 이미지와 영상은 AI 예시</p>
        <a href="#ceo" className="nudge mt-6 inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.2em] text-[var(--o-sub)]">아래로 ↓</a>
      </div>
    </section>
  );
}

export default function OrbitCareSite({ lang = "ko" }: { lang?: "ko" | "en" }) {
  const en = lang === "en";
  const paused = useRef(false);
  const [isPaused, setPaused] = useState(false);
  const [info, setInfo] = useState(false);
  const toggle = () => { paused.current = !paused.current; setPaused(paused.current); };
  return (
    <LangCtx.Provider value={en}>
    <main className="orb mx-auto min-h-screen w-full max-w-[480px]" lang={en ? "en" : "ko"}>
      <header className="fixed inset-x-0 top-0 z-40 mx-auto flex max-w-[480px] items-center justify-between gap-3 px-5 pt-4" style={{ background: "linear-gradient(180deg,rgba(62,110,130,0.85),rgba(62,110,130,0))", paddingBottom: 18 }}>
        <img src="/sinchon/care/gblabs-logo-white.png" alt="GB LABS" className="h-6 w-auto" />
        <div className="flex shrink-0 items-center gap-2">
                    <a href="#dc" className="pill glass whitespace-nowrap px-3 py-2 text-[12px] font-bold">지하 데이터실</a>
          <button onClick={() => setInfo(true)} className="pill glass whitespace-nowrap px-3.5 py-2 text-[12px] font-bold">{en ? "About" : "안내"}</button>
        </div>
      </header>

      <HeroFilm />
      <CeoMessage />
      <ShadeFilm />
      <Shade />
      <Who />
      <Place />
      <NearWhy />
      <Journey paused={paused} />
      <Plans />
      <Life />
      <Rooftop />
      <Rehab />
      <Smart />
      <Exterior />
      <Numbers />
      <Film />
      <DcSim />
      <Docs />
      <Closing />

      <button onClick={toggle} className="glass fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full text-[15px]" style={{ right: "max(20px, calc(50vw - 240px + 20px))" }} aria-label={isPaused ? "resume rotation" : "pause rotation"}>
        {isPaused ? "▶" : "❙❙"}
      </button>

      <motion.div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[480px]" initial={false} animate={{ y: info ? 0 : "105%" }} transition={{ duration: 0.5, ease: EASE }}>
        <div className="rounded-t-[26px] border-t border-white/10 px-6 pb-9 pt-6" style={{ background: "#5b97ac" }}>
          <div className="flex items-center justify-between">
            <p className="serif text-[28px] italic">{en ? "Space, seen differently." : "공간을, 다른 시선으로."}</p>
            <button onClick={() => setInfo(false)} className="pill h-9 w-9 text-[16px]" aria-label="close">×</button>
          </div>
          <div className="mt-4 space-y-3 text-[13.5px] leading-[1.75] text-[#c9d4de]">
            {en ? (
              <>
                <p>The building on the first screen is not a photo or a video: it is a real-time 3D line model built from the original drawings (B2 + 10 floors, 12.2m × 10.4m typical floor, east wing on 2F–3F, south stair and lift core, east escape stair). Scroll down and the floors stack, open up and fill with 66 coloured rooms. Drag sideways to rotate it.</p>
                <p>Floor heights, window spacing and roof details are assumptions for visualisation, not a survey. The room plan is a schematic draft for review.</p>
                <p>Palette: silver-blue lines on charcoal navy → mint → champagne gold, with warm ivory for the life section.</p>
              </>
            ) : (
              <>
            <p>인사말 아래의 건물은 사진이나 영상이 아니라, 원도면(지하 2층 · 지상 10층)의 치수로 세운 실시간 3D 선 모델입니다. 아래로 밀면 층이 쌓이고, 펼쳐지며, 66개의 회복실·가족 체류실이 색으로 채워집니다. 손가락으로 좌우로 끌면 돌아갑니다.</p>
            <p>층고·창 간격·옥상 세부는 연출용 가정입니다. 방 배치와 층별 용도는 의료시설 인허가 검토 전의 개략(안)입니다.</p>
            <p>GB LABS · 평생주치의 의료·돌봄 의료복지사회적협동조합 입점 검토용 시안</p>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </main>
    </LangCtx.Provider>
  );
}
