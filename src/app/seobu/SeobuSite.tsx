"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence, animate, useInView } from "framer-motion";
import { PROJECT, SCALE, COMPARE, VARIANTS, FLOORS, UNITS, HISTORY, SURROUND } from "./data";

/* 원칙: 투명도는 움직이지 않는다 (갤럭시 빈 화면 방지) — 위치·크기·마스크만 움직인다 */
const IMG = (f: string) => `/seobu/img/${f}.webp`;
const EASE = [0.16, 1, 0.3, 1] as const;

function Rise({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ y: 26 }} whileInView={{ y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.8, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

function Lift({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true });
  return (
    <span ref={ref} className={`block overflow-hidden ${className ?? ""}`}>
      <motion.span className="block" initial={{ y: "105%" }} animate={{ y: seen ? "0%" : "105%" }} transition={{ duration: 0.9, delay, ease: EASE }}>{children}</motion.span>
    </span>
  );
}

function Photo({ src, alt, className, pos = "50% 50%", cap }: { src: string; alt: string; className?: string; pos?: string; cap?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-30px" });
  const [err, setErr] = useState(false);
  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      <motion.div className="absolute inset-0 overflow-hidden" style={{ background: "#e9e7e1" }} initial={{ clipPath: "inset(100% 0% 0% 0%)" }} animate={{ clipPath: seen ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" }} transition={{ duration: 1.1, ease: EASE }}>
        {err ? (
          <div className="flex h-full w-full items-center justify-center text-[12px]" style={{ color: "var(--sb-sub)" }}>이미지 준비 중</div>
        ) : (
          <motion.img src={src} alt={alt} onError={() => setErr(true)} className="h-full w-full object-cover" style={{ objectPosition: pos }} initial={{ scale: 1.14 }} animate={{ scale: seen ? 1 : 1.14 }} transition={{ duration: 1.6, ease: EASE }} />
        )}
        {cap && <span className="absolute bottom-2 left-2 bg-white/90 px-1.5 py-0.5 text-[10px]" style={{ color: "var(--sb-char)" }}>{cap}</span>}
      </motion.div>
    </div>
  );
}

function Count({ to, decimals = 0 }: { to: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.6, ease: EASE, onUpdate: (x) => setV(x) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{v.toLocaleString("ko-KR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</span>;
}

function Head({ no, en, children, sub, dark = false }: { no: string; en: string; children: ReactNode; sub?: ReactNode; dark?: boolean }) {
  return (
    <div className="mb-8">
      <Rise>
        <div className="sb-en mb-3 flex items-center gap-2 text-[11px] font-semibold" style={{ color: "var(--sb-gold)" }}>
          <span>{no}</span>
          <motion.span className="h-px w-10 origin-left" style={{ background: "var(--sb-gold)" }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.2, ease: EASE }} />
          <span>{en}</span>
        </div>
      </Rise>
      <h2 className="text-[26px] font-bold leading-[1.38] tracking-tight" style={{ color: dark ? "#fff" : "var(--sb-navy)" }}><Lift>{children}</Lift></h2>
      {sub && <Rise delay={0.15}><p className="mt-3 text-[14.5px] leading-[1.8]" style={{ color: dark ? "#b8c0cc" : "var(--sb-sub)" }}>{sub}</p></Rise>}
    </div>
  );
}

function Pending({ children = "입력 대기" }: { children?: ReactNode }) {
  return <span className="rounded border border-dashed px-1.5 py-0.5 text-[11.5px]" style={{ borderColor: "var(--sb-gold)", color: "var(--sb-gold)" }}>{children}</span>;
}

function Icon({ d, size = 22 }: { d: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;
}
const I = {
  home: "M3 11l9-7 9 7 M5 10v10h14V10 M10 20v-6h4v6",
  shop: "M4 8h16l-1 4H5z M5 12v8h14v-8 M9 20v-5h6v5 M4 8l2-4h12l2 4",
  fit: "M6 8v8 M18 8v8 M3 10v4 M21 10v4 M6 12h12",
  pin: "M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  arrow: "M5 12h14 M13 6l6 6-6 6",
  down: "M6 9l6 6 6-6",
  up: "M12 19V5 M5 12l7-7 7 7",
  doc: "M7 3h7l5 5v13H7z M14 3v5h5 M10 13h6 M10 17h6",
  mail: "M4 6h16v12H4z M4 7l8 6 8-6",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2",
};

const NAV: [string, string][] = [["overview", "사업 소개"], ["plan", "개발 계획"], ["location", "입지"], ["scale", "사업 규모"], ["history", "추진 현황"], ["media", "홍보자료"], ["contact", "문의"]];

const PLANS = [
  { icon: I.home, t: "공동주택", en: "RESIDENCE", img: "elev-b", pos: "50% 40%", d: "지상 2~12층, 총 110세대 규모의 새로운 주거공간. 편리하고 쾌적한 생활환경을 지향합니다.", tags: ["110세대", "지상 2~12층"] },
  { icon: I.shop, t: "판매시설", en: "RETAIL", img: "cover", pos: "60% 85%", d: "지하 2층부터 지상 1층까지 이어지는 상업공간. 시장의 상업기능을 잇고 지역 주민의 생활 편의를 더합니다.", tags: ["지하 2층~지상 1층", "생활 편의"] },
  { icon: I.fit, t: "운동시설", en: "COMMUNITY", img: "", pos: "", d: "부대복리시설로 계획된 운동시설. 건강한 생활과 여가, 주민 커뮤니티를 위한 공간입니다.", tags: ["부대복리시설", "위치·규모 확인 필요"] },
];

const GALLERY = [
  { f: "aerial", t: "조감도", s: "사업계획서(2025.02) 수록" },
  { f: "elev-a", t: "입면도", s: "사업계획서 수록" },
  { f: "elev-b", t: "입면도", s: "사업계획서 수록" },
  { f: "elev-d", t: "입면도", s: "사업계획서 수록" },
  { f: "site-1", t: "현재 사업지", s: "사업계획서 수록 현황사진" },
  { f: "site-3", t: "현재 사업지", s: "사업계획서 수록 현황사진" },
];

export default function SeobuSite() {
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState("");
  const [cmp, setCmp] = useState<"b" | "a">("b");
  const [floor, setFloor] = useState<number | null>(0);
  const [area, setArea] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [showTop, setShowTop] = useState(false);
  const areaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    NAV.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);

  const go = (id: string) => {
    setMenu(false);
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 54, behavior: "smooth" });
  };
  const onAreaScroll = () => {
    const el = areaRef.current; if (!el) return;
    const w = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 12 : 1;
    setArea(Math.min(SURROUND.length - 1, Math.round(el.scrollLeft / w)));
  };
  const maxN = Math.max(...UNITS.map((u) => u.n));
  const mapQ = encodeURIComponent("서울특별시 서대문구 북가좌동 338-19");

  return (
    <div className="sb">
      <div className="relative mx-auto w-full max-w-[480px]">
        {/* 임시 안내 띠 */}
        <div className="px-4 py-1.5 text-center text-[11px]" style={{ background: "var(--sb-navy)", color: "#c9d0db" }}>임시 홈페이지 · 수치와 일정은 최신 자료와 대조 후 확정됩니다</div>

        {/* 헤더 */}
        <header className="sticky top-0 z-40 border-b" style={{ background: "rgba(255,255,255,.95)", borderColor: "var(--sb-line)", backdropFilter: "blur(10px)" }}>
          <div className="flex h-[54px] items-center justify-between px-4">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-left leading-tight">
              <span className="sb-en block text-[10px] font-semibold" style={{ color: "var(--sb-gold)" }}>SEOUL SEOBU CENTRAL MARKET</span>
              <span className="block text-[15px] font-bold" style={{ color: "var(--sb-navy)" }}>서울서부중앙시장 재개발사업</span>
            </button>
            <button onClick={() => setMenu(true)} aria-label="메뉴 열기" className="flex h-10 w-10 flex-col items-end justify-center gap-[5px]">
              <span className="h-[1.5px] w-6" style={{ background: "var(--sb-navy)" }} /><span className="h-[1.5px] w-4" style={{ background: "var(--sb-navy)" }} /><span className="h-[1.5px] w-6" style={{ background: "var(--sb-navy)" }} />
            </button>
          </div>
          <nav className="sb-noscroll flex gap-4 overflow-x-auto px-4 text-[13px]">
            {NAV.map(([id, l]) => (
              <button key={id} onClick={() => go(id)} className="relative shrink-0 pb-2.5 pt-0.5 font-semibold" style={{ color: active === id ? "var(--sb-navy)" : "#9aa1ad" }}>
                {l}
                {active === id && <motion.span layoutId="sb-nav" className="absolute inset-x-0 bottom-0 h-[2px]" style={{ background: "var(--sb-gold)" }} transition={{ duration: 0.35, ease: EASE }} />}
              </button>
            ))}
          </nav>
        </header>

        {/* 모바일 메뉴 */}
        <AnimatePresence>
          {menu && (
            <motion.div key="m" className="fixed inset-y-0 right-0 z-50 w-full max-w-[480px]" style={{ background: "var(--sb-navy)" }} initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.5, ease: EASE }}>
              <div className="flex h-[54px] items-center justify-between px-5">
                <span className="sb-en text-[11px] font-semibold" style={{ color: "var(--sb-gold2)" }}>MENU</span>
                <button onClick={() => setMenu(false)} aria-label="메뉴 닫기" className="text-[28px] leading-none text-white">×</button>
              </div>
              <div className="px-6 pt-4">
                {NAV.map(([id, l], i) => (
                  <motion.button key={id} onClick={() => go(id)} className="flex w-full items-baseline justify-between border-b py-4 text-left" style={{ borderColor: "#24364f" }}
                    initial={{ x: 40 }} animate={{ x: 0 }} transition={{ duration: 0.5, delay: 0.12 + i * 0.04, ease: EASE }}>
                    <span className="text-[21px] font-bold text-white">{l}</span>
                    <span className="sb-en text-[11px]" style={{ color: "var(--sb-gold2)" }}>0{i + 1}</span>
                  </motion.button>
                ))}
                <p className="mt-8 text-[12px] leading-[1.7]" style={{ color: "#8d99ab" }}>{PROJECT.address}<br />{PROJECT.operators.join(" · ")}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HERO */}
        <section className="relative h-[78dvh] min-h-[540px] overflow-hidden" style={{ background: "var(--sb-navy)" }}>
          <img src={IMG("aerial")} alt="서울서부중앙시장 재개발사업 조감도 (사업계획서 수록)" className="sb-kb absolute inset-0 h-full w-full object-cover" style={{ objectPosition: "47% 40%" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(13,26,46,.35) 0%, rgba(13,26,46,.05) 32%, rgba(13,26,46,.78) 72%, #0d1a2e 100%)" }} />
          <span className="absolute right-3 top-3 bg-white/85 px-1.5 py-0.5 text-[10px]" style={{ color: "var(--sb-char)" }}>사업계획서(2025.02) 수록 조감도 · 설계에 따라 변경될 수 있음</span>
          <div className="absolute inset-x-0 bottom-0 px-6 pb-16 text-white">
            <div className="sb-en text-[11.5px] font-semibold" style={{ color: "var(--sb-gold2)" }}><Lift delay={0.1}>SEOUL SEOBU CENTRAL MARKET</Lift></div>
            <h1 className="mt-3 text-[31px] font-bold leading-[1.32] tracking-tight">
              <Lift delay={0.25}>새로운 주거와 상업의 중심,</Lift>
              <Lift delay={0.4}>서울서부중앙시장의</Lift>
              <Lift delay={0.55}><span style={{ color: "var(--sb-gold2)" }}>새로운 미래</span></Lift>
            </h1>
            <Rise delay={0.8}><p className="mt-4 text-[14.5px] leading-[1.75] text-white/80">주거와 상업, 생활의 가치가 하나로 연결되는<br />새로운 도시공간을 만들어 갑니다.</p></Rise>
            <Rise delay={0.95}>
              <button onClick={() => go("overview")} className="mt-6 flex items-center gap-2 px-5 py-3 text-[14px] font-bold" style={{ background: "var(--sb-gold)", color: "var(--sb-navy)" }}>사업 소개 보기 <Icon d={I.arrow} size={18} /></button>
            </Rise>
          </div>
          <button onClick={() => go("overview")} aria-label="아래로" className="sb-cue absolute bottom-4 left-1/2 -ml-4 text-white/70"><Icon d={I.down} size={32} /></button>
        </section>

        {/* 01 사업 소개 */}
        <section id="overview" className="px-6 pt-16 pb-14">
          <Head no="01" en="PROJECT OVERVIEW" sub="오래된 시장을 정비해, 시장이 머물던 자리에 사람이 사는 집과 지역의 상업공간을 함께 짓는 복합개발 사업입니다.">시장이 머무는 곳에,<br />사람이 사는 집을</Head>
          <div className="grid grid-cols-3 gap-2">
            {[[I.home, "주거", "공동주택"], [I.shop, "상업", "판매시설"], [I.fit, "생활", "운동시설"]].map(([ic, a, b], i) => (
              <Rise key={a} delay={i * 0.08}>
                <div className="flex flex-col items-center border px-2 py-4 text-center" style={{ borderColor: "var(--sb-line)" }}>
                  <span style={{ color: "var(--sb-gold)" }}><Icon d={ic} size={26} /></span>
                  <span className="mt-2 text-[15px] font-bold" style={{ color: "var(--sb-navy)" }}>{a}</span>
                  <span className="text-[11.5px]" style={{ color: "var(--sb-sub)" }}>{b}</span>
                </div>
              </Rise>
            ))}
          </div>
          <Rise>
            <dl className="mt-8 border-t text-[13.5px]" style={{ borderColor: "var(--sb-navy)" }}>
              {[
                ["사업명", PROJECT.nameKo],
                ["위치", <>{PROJECT.address}<br /><span style={{ color: "var(--sb-sub)" }}>({PROJECT.roadAddress})</span></>],
                ["시행 주체", <>{PROJECT.operators[0]}<br />{PROJECT.operators[1]}</>],
                ["지역·지구", PROJECT.zoning],
                ["대지면적", <>2,531.9㎡ <span style={{ color: "var(--sb-sub)" }}>(사업시행면적 2,381.10㎡)</span></>],
                ["도로", PROJECT.roads],
                ["개발 용도", PROJECT.uses.join(" · ")],
              ].map(([k, v], i) => (
                <div key={i} className="grid grid-cols-[78px_1fr] gap-3 border-b py-3" style={{ borderColor: "var(--sb-line)" }}>
                  <dt className="font-semibold" style={{ color: "var(--sb-navy)" }}>{k}</dt><dd className="leading-[1.6]">{v}</dd>
                </div>
              ))}
            </dl>
          </Rise>
          <div className="mt-8 grid gap-2.5">
            {[["정비", "노후한 시장 건물을 정비해 안전하고 쾌적한 공간으로"], ["주거", "공동주택 공급으로 주거환경 개선"], ["상업", "시장의 상업기능을 새 판매시설로 잇고 복합화"], ["지역", "주민과 함께하는 공간으로 지역 활성화"]].map(([a, b], i) => (
              <motion.div key={a} className="flex items-center gap-4 p-4" style={{ background: "var(--sb-paper)" }} initial={{ x: -30 }} whileInView={{ x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}>
                <span className="sb-en w-12 shrink-0 text-[12px] font-bold" style={{ color: "var(--sb-gold)" }}>0{i + 1}</span>
                <div><div className="text-[15px] font-bold" style={{ color: "var(--sb-navy)" }}>{a}</div><div className="text-[13px]" style={{ color: "var(--sb-sub)" }}>{b}</div></div>
              </motion.div>
            ))}
          </div>
          <p className="mt-3 text-[11px]" style={{ color: "var(--sb-sub)" }}>사업 추진 목적은 공공성과 지역 활성화 관점에서 정리한 것입니다.</p>
        </section>

        {/* 02 개발 계획 */}
        <section id="plan" className="pt-14 pb-14" style={{ background: "var(--sb-paper)" }}>
          <div className="px-6">
            <Head no="02" en="DEVELOPMENT PLAN" sub="지하 4층, 지상 12층. 아래는 시장의 상업공간이, 위로는 주거공간이 이어지는 복합 건축물입니다.">주거와 상업이<br />한 건물에서 만납니다</Head>
            <div className="grid gap-4">
              {PLANS.map((p, i) => (
                <Rise key={p.t} delay={i * 0.05}>
                  <div className="overflow-hidden bg-white">
                    {p.img ? <Photo src={IMG(p.img)} alt={`${p.t} — 사업계획서 수록 이미지`} className="h-[200px]" pos={p.pos} cap="사업계획서 수록" /> : (
                      <div className="flex h-[140px] items-center justify-center" style={{ background: "linear-gradient(135deg, #15253d, #0d1a2e)" }}>
                        <div className="text-center"><span style={{ color: "var(--sb-gold2)" }}><Icon d={p.icon} size={40} /></span><div className="mt-1 text-[11px] text-white/60">이미지 준비 중</div></div>
                      </div>
                    )}
                    <div className="p-5">
                      <div className="sb-en text-[10.5px] font-semibold" style={{ color: "var(--sb-gold)" }}>{p.en}</div>
                      <div className="mt-1 flex items-center gap-2 text-[19px] font-bold" style={{ color: "var(--sb-navy)" }}>{p.t}</div>
                      <p className="mt-2 text-[13.5px] leading-[1.75]" style={{ color: "var(--sb-char)" }}>{p.d}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">{p.tags.map((t) => <span key={t} className="border px-2 py-0.5 text-[11.5px]" style={{ borderColor: "var(--sb-line)", color: "var(--sb-char)" }}>{t}</span>)}</div>
                    </div>
                  </div>
                </Rise>
              ))}
            </div>

            {/* 층별 구성 */}
            <Rise><div className="mt-12 mb-3 text-[18px] font-bold" style={{ color: "var(--sb-navy)" }}>층별 구성 <span className="text-[12px] font-normal" style={{ color: "var(--sb-sub)" }}>· 층을 눌러 보세요</span></div></Rise>
            <div className="grid grid-cols-[1fr_1.1fr] gap-3">
              <div className="space-y-1">
                {FLOORS.map((f, i) => {
                  const c = f.kind === "home" ? "#2c4a73" : f.kind === "shop" ? "#b89b62" : "#8b93a1";
                  return (
                    <motion.button key={f.f} onClick={() => setFloor(i)} className="relative flex w-full items-center overflow-hidden border text-left" style={{ borderColor: floor === i ? c : "var(--sb-line)", background: "#fff", height: f.kind === "home" && i === 0 ? 84 : 40 }}
                      initial={{ x: -30 }} whileInView={{ x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}>
                      <motion.span className="absolute inset-y-0 left-0 w-full origin-left" style={{ background: c }} animate={{ scaleX: floor === i ? 1 : 0.04 }} transition={{ duration: 0.45, ease: EASE }} />
                      <span className="relative z-10 pl-3 text-[13px] font-bold" style={{ color: floor === i ? "#fff" : "var(--sb-navy)" }}>{f.f}</span>
                    </motion.button>
                  );
                })}
                <div className="h-[3px]" style={{ background: "var(--sb-char)" }} />
              </div>
              <div className="relative overflow-hidden bg-white p-4">
                <AnimatePresence mode="wait" initial={false}>
                  {floor !== null && (
                    <motion.div key={floor} initial={{ y: 24, clipPath: "inset(100% 0% 0% 0%)" }} animate={{ y: 0, clipPath: "inset(0% 0% 0% 0%)" }} exit={{ y: -16, clipPath: "inset(0% 0% 100% 0%)" }} transition={{ duration: 0.4, ease: EASE }}>
                      <div className="sb-en text-[11px] font-semibold" style={{ color: "var(--sb-gold)" }}>{FLOORS[floor].f}</div>
                      <div className="mt-1 text-[18px] font-bold" style={{ color: "var(--sb-navy)" }}>{FLOORS[floor].use}</div>
                      <p className="mt-2 text-[13px] leading-[1.7]" style={{ color: "var(--sb-char)" }}>{FLOORS[floor].detail}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* 주택형 */}
            <Rise><div className="mt-12 text-[18px] font-bold" style={{ color: "var(--sb-navy)" }}>주택형 구성 <span className="text-[12px] font-normal" style={{ color: "var(--sb-sub)" }}>· 8개 타입 110세대</span></div></Rise>
            <div className="mt-4 space-y-2 bg-white p-5">
              {UNITS.map((u, i) => (
                <div key={u.t} className="grid grid-cols-[44px_1fr_48px] items-center gap-2 text-[13px]">
                  <span className="font-bold" style={{ color: "var(--sb-navy)" }}>{u.t}형</span>
                  <div className="relative h-5" style={{ background: "var(--sb-paper)" }}>
                    <motion.div className="absolute inset-y-0 left-0 origin-left" style={{ width: `${(u.n / maxN) * 100}%`, background: u.area > 80 ? "#2c4a73" : "#b89b62" }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.1 + i * 0.05, ease: EASE }} />
                    <span className="absolute inset-y-0 left-2 flex items-center text-[11px] font-semibold text-white">{u.area}㎡</span>
                  </div>
                  <span className="text-right font-semibold">{u.n}세대</span>
                </div>
              ))}
              <p className="pt-2 text-[11px] leading-[1.6]" style={{ color: "var(--sb-sub)" }}>분양조견표(검토안) 기준 세대별 면적입니다. 확정된 주택형이 아니며 설계에 따라 달라질 수 있습니다.</p>
            </div>
          </div>
        </section>

        {/* 03 입지 */}
        <section id="location" className="pt-16 pb-14">
          <div className="px-6">
            <Head no="03" en="LOCATION & VALUE" sub="서대문구 북가좌동, 은평구 증산동과 맞닿은 서북권 생활권에 자리합니다.">서울 서북권의<br />생활 중심지</Head>
            <Rise>
              <div className="relative h-[260px] overflow-hidden border" style={{ borderColor: "var(--sb-line)" }}>
                <iframe title="사업지 위치 지도" src={`https://maps.google.com/maps?q=${mapQ}&z=16&output=embed`} className="h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </Rise>
            <div className="mt-2 flex items-center justify-between text-[12px]">
              <span className="flex items-center gap-1" style={{ color: "var(--sb-char)" }}><Icon d={I.pin} size={14} />{PROJECT.address.replace(" 일원", "")}</span>
              <a href={`https://map.naver.com/p/search/${mapQ}`} target="_blank" rel="noopener" className="font-semibold underline underline-offset-4" style={{ color: "var(--sb-navy)" }}>네이버 지도</a>
            </div>
          </div>
          <div ref={areaRef} onScroll={onAreaScroll} className="sb-noscroll mt-7 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6">
            {SURROUND.map((s, i) => (
              <motion.div key={s.k} className="w-[80%] shrink-0 snap-center border p-5" style={{ borderColor: "var(--sb-line)", background: i % 2 ? "var(--sb-paper)" : "#fff" }}
                initial={{ x: 50 }} whileInView={{ x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: Math.min(i, 2) * 0.08, ease: EASE }}>
                <div className="sb-en text-[11px] font-semibold" style={{ color: "var(--sb-gold)" }}>0{i + 1}</div>
                <div className="mt-1 text-[18px] font-bold" style={{ color: "var(--sb-navy)" }}>{s.k}</div>
                <ul className="mt-3 space-y-1.5 text-[13px] leading-[1.6]" style={{ color: "var(--sb-char)" }}>{s.items.map((t) => <li key={t}>· {t}</li>)}</ul>
              </motion.div>
            ))}
          </div>
          <div className="mt-3 flex justify-center gap-1.5">
            {SURROUND.map((_, i) => <motion.span key={i} className="h-1.5 rounded-full" animate={{ width: i === area ? 18 : 6, backgroundColor: i === area ? "#b89b62" : "#d9dce2" }} transition={{ duration: 0.3 }} />)}
          </div>
          <div className="px-6">
            <p className="mt-3 text-[11px] leading-[1.6]" style={{ color: "var(--sb-sub)" }}>주변 환경은 사업계획서(2025.02) &lsquo;사업지 주변 환경분석&rsquo;에 기재된 내용이며, 거리·소요시간은 별도 확인 전입니다.</p>
            <Rise><div className="mt-9 mb-3 text-[16px] font-bold" style={{ color: "var(--sb-navy)" }}>사업지 주변</div></Rise>
            <div className="grid grid-cols-2 gap-2">
              {["street-1", "street-2", "street-3", "street-4"].map((f) => <Photo key={f} src={IMG(f)} alt="사업지 주변 거리 (사업계획서 수록)" className="h-[110px]" />)}
            </div>
            <p className="mt-2 text-[11px]" style={{ color: "var(--sb-sub)" }}>사진: 사업계획서 수록 사업지 주변 현황</p>
          </div>
        </section>

        {/* 04 사업 규모 */}
        <section id="scale" className="px-6 pt-14 pb-14" style={{ background: "var(--sb-navy)" }}>
          <Head dark no="04" en="PROJECT SCALE" sub={<>아래 수치는 <b style={{ color: "#fff" }}>기존 검토자료(설계변경안) 기준</b>이며, 최신 인허가 자료와 대조 후 확정됩니다.</>}>사업 규모</Head>
          <div className="grid grid-cols-2 gap-px" style={{ background: "#24364f" }}>
            {[
              [<><Count to={SCALE.site.value} decimals={1} /><span className="text-[14px]">㎡</span></>, "대지면적"],
              [<>B{SCALE.floors.below} / {SCALE.floors.above}F</>, "지하 4층 · 지상 12층"],
              [<><Count to={SCALE.households.value} /><span className="text-[14px]">세대</span></>, "공동주택"],
              [<><Count to={SCALE.parking.value} /><span className="text-[14px]">대</span></>, "주차대수"],
            ].map(([v, l], i) => (
              <div key={i} className="p-5" style={{ background: "var(--sb-navy)" }}>
                <div className="text-[26px] font-bold" style={{ color: "var(--sb-gold2)" }}>{v}</div>
                <div className="mt-1 text-[12px]" style={{ color: "#a9b3c1" }}>{l}</div>
              </div>
            ))}
          </div>
          <div className="mt-px grid grid-cols-3 gap-px" style={{ background: "#24364f" }}>
            {[[SCALE.gfa, 0], [SCALE.far, 2], [SCALE.bcr, 2]].map(([s, dec], i) => {
              const o = s as { value: number; unit: string; label: string };
              return (
                <div key={i} className="p-4" style={{ background: "var(--sb-navy2)" }}>
                  <div className="text-[17px] font-bold text-white"><Count to={o.value} decimals={dec as number} />{o.unit}</div>
                  <div className="mt-0.5 text-[11px]" style={{ color: "#a9b3c1" }}>{o.label}</div>
                </div>
              );
            })}
          </div>

          {/* 당초 ↔ 변경안 */}
          <Rise><div className="mt-10 text-[16px] font-bold text-white">사업시행인가 당초안과 변경안</div></Rise>
          <div className="mt-3 flex border p-1" style={{ borderColor: "#24364f" }}>
            {(["a", "b"] as const).map((k) => (
              <button key={k} onClick={() => setCmp(k)} className="relative flex-1 py-2 text-[13px] font-bold">
                {cmp === k && <motion.span layoutId="sb-cmp" className="absolute inset-0" style={{ background: "var(--sb-gold)" }} transition={{ duration: 0.35, ease: EASE }} />}
                <span className="relative z-10" style={{ color: cmp === k ? "var(--sb-navy)" : "#a9b3c1" }}>{k === "a" ? "당초 (사업시행인가)" : "변경안 (설계변경)"}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 divide-y" style={{ borderColor: "#24364f" }}>
            {COMPARE.map((c) => (
              <div key={c.k} className="flex items-center justify-between border-b py-2.5 text-[14px]" style={{ borderColor: "#24364f" }}>
                <span style={{ color: "#a9b3c1" }}>{c.k}</span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={cmp} className="font-bold text-white" initial={{ y: 12 }} animate={{ y: 0 }} exit={{ y: -12 }} transition={{ duration: 0.25 }}>{cmp === "a" ? c.a : c.b}</motion.span>
                </AnimatePresence>
              </div>
            ))}
          </div>
          <div className="mt-6 border p-4 text-[12px] leading-[1.7]" style={{ borderColor: "#3a4b63", color: "#b8c0cc" }}>
            <div className="mb-2 font-bold" style={{ color: "var(--sb-gold2)" }}>자료별 수치 차이 (확인 필요)</div>
            <div className="grid grid-cols-[64px_1fr_1fr] gap-x-2 gap-y-1">
              <span /><span className="text-[11px]">사업계획서 개요</span><span className="text-[11px]">설계변경 심의사항</span>
              {VARIANTS.map((v) => <div key={v.k} className="contents"><span>{v.k}</span><span className="text-white">{v.plan}</span><span className="text-white">{v.review}</span></div>)}
            </div>
          </div>
        </section>

        {/* 05 추진 현황 */}
        <section id="history" className="px-6 pt-16 pb-14">
          <Head no="05" en="PROJECT HISTORY" sub="기존 자료에 기재된 주요 추진 이력입니다. 최신 행정 상태는 별도 확인 후 반영합니다.">사업 추진현황</Head>
          <div className="relative pl-8">
            <motion.div className="absolute left-[7px] top-2 bottom-2 w-px origin-top" style={{ background: "var(--sb-gold)" }} initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 1.6, ease: EASE }} />
            {HISTORY.map((h, i) => (
              <Rise key={h.d} delay={0.1 + i * 0.1} className="relative mb-7">
                <motion.span className="absolute -left-8 top-1 h-[15px] w-[15px] rounded-full border-2" style={{ borderColor: "var(--sb-gold)", background: i === HISTORY.length - 1 ? "var(--sb-gold)" : "#fff" }} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }} />
                <div className="sb-en text-[13px] font-bold" style={{ color: "var(--sb-gold)" }}>{h.d}</div>
                <div className="mt-0.5 text-[17px] font-bold" style={{ color: "var(--sb-navy)" }}>{h.t}</div>
                {h.s && <div className="text-[13px]" style={{ color: "var(--sb-sub)" }}>{h.s}</div>}
              </Rise>
            ))}
            <Rise className="relative">
              <span className="absolute -left-8 top-1 h-[15px] w-[15px] rounded-full border-2 border-dashed" style={{ borderColor: "var(--sb-gold)" }} />
              <div className="sb-en text-[13px] font-bold" style={{ color: "var(--sb-gold)" }}>NOW</div>
              <div className="mt-1 flex items-center gap-2 text-[15px] font-bold" style={{ color: "var(--sb-navy)" }}>현재 단계 · 향후 일정 <Pending>최신 자료 확인 후 입력</Pending></div>
            </Rise>
          </div>
        </section>

        {/* 06 홍보자료 · 공지 */}
        <section id="media" className="pt-14 pb-14" style={{ background: "var(--sb-paper)" }}>
          <div className="px-6"><Head no="06" en="MEDIA & NOTICE">홍보자료 및 공지사항</Head></div>
          <div className="grid grid-cols-2 gap-2 px-6">
            {GALLERY.map((g, i) => (
              <button key={g.f + i} onClick={() => setLightbox(i)} className="text-left">
                <Photo src={IMG(g.f)} alt={`${g.t} — ${g.s}`} className="h-[120px]" />
                <div className="mt-1.5 text-[13px] font-bold" style={{ color: "var(--sb-navy)" }}>{g.t}</div>
                <div className="text-[11px]" style={{ color: "var(--sb-sub)" }}>{g.s}</div>
              </button>
            ))}
          </div>
          <div className="mx-6 mt-8 bg-white">
            <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "var(--sb-line)" }}>
              <span className="text-[15px] font-bold" style={{ color: "var(--sb-navy)" }}>공지사항</span><Pending>준비 중</Pending>
            </div>
            <p className="px-4 py-5 text-[13px]" style={{ color: "var(--sb-sub)" }}>등록된 공지사항이 없습니다. 공지사항은 조합과 시행사 확인을 거쳐 게시됩니다.</p>
          </div>
          <div className="mx-6 mt-3 flex items-center gap-3 bg-white px-4 py-4">
            <span style={{ color: "var(--sb-gold)" }}><Icon d={I.doc} /></span>
            <div className="flex-1"><div className="text-[14px] font-bold" style={{ color: "var(--sb-navy)" }}>사업 관련 문서</div><div className="text-[12px]" style={{ color: "var(--sb-sub)" }}>공개 범위 확인 후 게시 예정</div></div>
            <Pending>준비 중</Pending>
          </div>
        </section>

        {/* 07 문의 */}
        <section id="contact" className="px-6 pt-16 pb-14">
          <Head no="07" en="CONTACT">사업 문의</Head>
          <dl className="border-t text-[14px]" style={{ borderColor: "var(--sb-navy)" }}>
            {[
              ["사업명", PROJECT.nameKo],
              ["시행 주체", PROJECT.operators.join(" · ")],
              ["사업장 위치", <>{PROJECT.address}<br /><span style={{ color: "var(--sb-sub)" }}>({PROJECT.roadAddress})</span></>],
              ["대표 연락처", PROJECT.phone ? <a href={`tel:${PROJECT.phone}`}>{PROJECT.phone}</a> : <Pending />],
              ["이메일", PROJECT.email ? <a href={`mailto:${PROJECT.email}`}>{PROJECT.email}</a> : <Pending />],
            ].map(([k, v], i) => (
              <div key={i} className="grid grid-cols-[86px_1fr] gap-3 border-b py-3.5" style={{ borderColor: "var(--sb-line)" }}>
                <dt className="font-semibold" style={{ color: "var(--sb-navy)" }}>{k}</dt><dd className="leading-[1.6]">{v}</dd>
              </div>
            ))}
          </dl>
          <a href={`https://map.naver.com/p/search/${mapQ}`} target="_blank" rel="noopener" className="mt-5 flex items-center justify-center gap-2 py-3.5 text-[14px] font-bold text-white" style={{ background: "var(--sb-navy)" }}><Icon d={I.pin} size={18} />지도에서 위치 보기</a>
        </section>

        {/* 푸터 */}
        <footer className="px-6 pt-10 pb-12" style={{ background: "#09121f", color: "#8d99ab" }}>
          <div className="sb-en text-[11px] font-semibold" style={{ color: "var(--sb-gold2)" }}>SEOUL SEOBU CENTRAL MARKET</div>
          <div className="mt-1 text-[16px] font-bold text-white">{PROJECT.nameKo}</div>
          <p className="mt-4 text-[12px] leading-[1.8]">{PROJECT.operators.join(" · ")}<br />{PROJECT.address}</p>
          <p className="mt-5 text-[11px] leading-[1.7]" style={{ color: "#66748a" }}>
            이 페이지는 사업 소개를 위한 임시 홈페이지입니다. 조감도·입면도·현황사진은 사업계획서(2025.02)에 수록된 자료이며 설계에 따라 변경될 수 있습니다. 규모 수치는 감정평가서 DRAFT 및 설계변경안 등 기존 검토자료 기준으로, 확정된 인허가 수치가 아닙니다.
          </p>
          <p className="sb-en mt-5 text-[10.5px]">© 2026 SEOUL SEOBU CENTRAL MARKET</p>
        </footer>

        {/* 사진 크게 보기 */}
        <AnimatePresence>
          {lightbox !== null && (
            <motion.div key="lb" className="fixed inset-0 z-50 flex flex-col items-center justify-center px-3" style={{ background: "rgba(9,18,31,.94)" }} initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.45, ease: EASE }} onClick={() => setLightbox(null)}>
              <img src={IMG(GALLERY[lightbox].f)} alt={GALLERY[lightbox].t} className="max-h-[78vh] w-full max-w-[480px] object-contain" />
              <div className="mt-3 text-center text-[13px] text-white">{GALLERY[lightbox].t} · <span className="text-white/60">{GALLERY[lightbox].s}</span></div>
              <div className="mt-2 text-[12px] text-white/50">화면을 누르면 닫힙니다</div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showTop && (
            <motion.button key="top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="맨 위로" className="fixed bottom-5 z-40 flex h-11 w-11 items-center justify-center shadow-lg"
              style={{ right: "max(16px, calc(50vw - 240px + 16px))", background: "var(--sb-navy)", color: "var(--sb-gold2)" }} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.3 }}>
              <Icon d={I.up} size={20} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
