"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Lift, Rise, Kicker, Arrow, Logo, LangSwitch, EASE } from "./GiibPlus";
import { LangCtx, pick } from "./i18n";
import type { Lang } from "./i18n";

/* 사례 상세: 의뢰 배경 → 작업 범위 → 결과물 → 유사 프로젝트 문의 */
function Reveal({ src, className, pos, children }: { src: string; className?: string; pos?: string; children?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`} style={{ background: "#0b1828" }}>
      <motion.div className="absolute inset-0" initial={{ clipPath: "inset(0% 0% 100% 0%)" }} animate={{ clipPath: seen ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" }} transition={{ duration: 1.1, ease: EASE }}>
        <motion.img src={src} alt="" loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: pos }} initial={{ scale: 1.12 }} animate={{ scale: seen ? 1 : 1.12 }} transition={{ duration: 1.6, ease: EASE }} />
      </motion.div>
      {children}
    </div>
  );
}

export default function CaseSeobu() {
  const [lang, setLang] = useState<Lang>("ko");
  useEffect(() => {
    let l: string | null = null;
    try { l = new URLSearchParams(window.location.search).get("lang") ?? localStorage.getItem("gi-lang"); } catch {}
    if (l === "en") setLang("en");
  }, []);
  const T = (ko: string, en: string) => pick(lang, ko, en);
  const setL = (l: Lang) => { setLang(l); try { localStorage.setItem("gi-lang", l); } catch {} };
  const film = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [ba, setBa] = useState(50);

  const scope = [
    [T("브랜드", "Brand"), T("가칭 네이밍 · 금색 HF 로고 · 모션 로고", "Working name · gold HF logo · motion logo")],
    [T("비주얼", "Visuals"), T("AI 외관 조감도 · 실내·스트리트몰 연출 · 전후 비교", "AI aerials · interiors & street mall · before/after")],
    [T("브랜드 필름", "Brand film"), T("3분 38초 원테이크 드론 필름 · 장면 바로가기 16개", "3:38 one-take drone film · 16 chapter links")],
    [T("모바일 사이트", "Mobile site"), T("기획 · 문구 · 3D 층별 구성 · 생활권 스토리", "Planning · copy · 3D floor stack · neighborhood story")],
  ];
  const stats: [string, string][] = [["3:38", T("원테이크 필름", "one-take film")], ["16", T("장면 바로가기", "chapters")], ["1", T("주소 하나로 공유", "link to share")]];

  return (
    <LangCtx.Provider value={lang}>
      <div className="gi" lang={lang}>
        <div className="relative mx-auto w-full max-w-[480px]">
          <header className="sticky top-0 z-40 border-b bg-white" style={{ borderColor: "var(--gi-line)" }}>
            <div className="flex h-[56px] items-center justify-between px-4">
              <a href="/g0dy098g/x" aria-label="GIIB"><Logo /></a>
              <div className="flex items-center gap-3"><LangSwitch lang={lang} set={setL} /><a href="/g0dy098g/x#work" className="text-[13px] font-bold" style={{ color: "var(--gi-black)" }}>{T("← 사례", "← Work")}</a></div>
            </div>
          </header>

          {/* 커버 */}
          <section className="relative h-[88dvh] min-h-[560px] overflow-hidden" style={{ background: "#0b1828" }}>
            <img src="/seobu/img/cd-aerial.webp" alt="" className="gi-kb absolute inset-0 h-full w-full object-cover" style={{ objectPosition: "72% 40%" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,14,24,.75) 0%, rgba(8,14,24,0) 38%, rgba(8,14,24,0) 60%, rgba(8,14,24,.9) 100%)" }} />
            <div className="absolute inset-0 flex flex-col justify-between px-5 pt-8 pb-8 text-white">
              <div>
                <div className="gi-en text-[10.5px] font-bold" style={{ color: "var(--gi-sand)" }}><Lift delay={0.3}>CASE STUDY 01</Lift></div>
                <h1 className="mt-3 text-[36px] font-extrabold leading-[1.15] tracking-[-0.03em]"><Lift delay={0.45}>{T("헤리티지포레", "Heritage Forêt")}</Lift></h1>
                <Rise delay={0.6}><p className="mt-2 text-[14px] text-white/80">{T("서울서부중앙시장 재개발 · 브랜드 사이트 & 원테이크 필름", "Seoul Seobu market redevelopment · brand site & one-take film")}</p></Rise>
              </div>
              <Rise delay={0.8}>
                <div className="flex flex-wrap gap-1.5">{[T("재개발 브랜딩", "Redevelopment branding"), T("브랜드 필름", "Brand film"), T("모바일 사이트", "Mobile site")].map((t) => <span key={t} className="bg-white px-2 py-0.5 text-[11px] font-bold" style={{ color: "var(--gi-black)" }}>{t}</span>)}</div>
                <p className="mt-3 text-[10.5px] text-white/55">{T("가칭 · AI 이미지 콘셉트 시안", "Working name · AI concept visual")}</p>
              </Rise>
            </div>
          </section>

          {/* 01 의뢰 배경 */}
          <section className="px-5 pt-16 pb-14">
            <Kicker>01 · THE BRIEF</Kicker>
            <h2 className="mt-4 text-[28px] font-extrabold leading-[1.25] tracking-[-0.03em]" style={{ color: "var(--gi-black)" }}><Lift>{T("시장이 아니라,", "Not a market,")}</Lift><Lift delay={0.08}>{T("머물고 싶은 주소로.", "an address to live in.")}</Lift></h2>
            <div className="mt-6 space-y-3 text-[15px] leading-[1.85]" style={{ color: "var(--gi-text)" }}>
              <p>{T("2004년 조합 인가 이후 오랜 시간 이어져 온 재개발 사업입니다. 조합원과 투자자, 관계 기관에게 사업의 미래를 휴대폰 주소 하나로 바로 보여줄 방법이 필요했습니다.", "A redevelopment project running since the cooperative was approved in 2004. Members, investors and partners needed to see its future instantly — from a single link on their phones.")}</p>
              <p>{T("과제는 '오래된 시장'이라는 인상을 넘어, 불광천 물빛 곁의 품격 있는 레지던스로 다시 보이게 하는 것이었습니다.", "The task: move past the image of an old market and present it as a refined residence beside the stream.")}</p>
            </div>
          </section>

          {/* 02 작업 범위 */}
          <section className="px-5 pt-14 pb-14" style={{ background: "var(--gi-paper)" }}>
            <Kicker>02 · SCOPE</Kicker>
            <h2 className="mt-4 text-[28px] font-extrabold leading-[1.25] tracking-[-0.03em]" style={{ color: "var(--gi-black)" }}><Lift>{T("한 팀이 처음부터 끝까지.", "One team, end to end.")}</Lift></h2>
            <dl className="mt-7 border-t" style={{ borderColor: "var(--gi-black)" }}>
              {scope.map(([k, v], i) => (
                <motion.div key={k} className="grid grid-cols-[96px_1fr] gap-3 border-b py-4" style={{ borderColor: "var(--gi-line)" }} initial={{ x: -20 }} whileInView={{ x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}>
                  <dt className="text-[14px] font-extrabold" style={{ color: "var(--gi-black)" }}>{k}</dt><dd className="text-[14px] leading-[1.65]" style={{ color: "var(--gi-sub)" }}>{v}</dd>
                </motion.div>
              ))}
            </dl>
          </section>

          {/* 03 결과물 */}
          <section className="px-5 pt-16 pb-14">
            <Kicker>03 · DELIVERABLES</Kicker>
            <h2 className="mt-4 text-[28px] font-extrabold leading-[1.25] tracking-[-0.03em]" style={{ color: "var(--gi-black)" }}><Lift>{T("끊김 없는 3분 38초.", "3:38, without a cut.")}</Lift></h2>
            {/* 브랜드 필름: 누르기 전에도 대표 이미지가 먼저 보인다 */}
            <div className="relative -mx-5 mt-7 aspect-[9/16] overflow-hidden" style={{ background: "#0b1828" }}>
              <video ref={film} src="/seobu/video/onetake.mp4" poster="/seobu/video/onetake.webp" playsInline controls={playing} preload="none" className="absolute inset-0 h-full w-full object-cover" />
              {!playing && (
                <button onClick={() => { setPlaying(true); film.current?.play().catch(() => {}); }} className="absolute inset-0 flex flex-col items-center justify-end pb-10 text-white" style={{ background: "linear-gradient(180deg, rgba(8,14,24,0) 50%, rgba(8,14,24,.75) 100%)" }} aria-label={T("브랜드 필름 재생", "Play brand film")}>
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white"><svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z" /></svg></span>
                  <span className="mt-3 text-[14px] font-bold">{T("브랜드 필름 보기", "Watch the brand film")}</span>
                  <span className="mt-1 text-[11px] text-white/60">{T("AI 영상 · 콘셉트 시안", "AI film · concept")}</span>
                </button>
              )}
            </div>
            <div className="mt-6 grid grid-cols-3 border-t" style={{ borderColor: "var(--gi-black)" }}>
              {stats.map(([n, l], i) => (
                <div key={l} className={`pt-4 ${i ? "border-l pl-3" : ""}`} style={{ borderColor: "var(--gi-line)" }}>
                  <div className="text-[30px] font-extrabold leading-none tracking-[-0.03em]" style={{ color: "var(--gi-black)" }}>{n}</div>
                  <div className="mt-2 text-[11.5px]" style={{ color: "var(--gi-sub)" }}>{l}</div>
                </div>
              ))}
            </div>

            <h3 className="mt-14 text-[20px] font-extrabold" style={{ color: "var(--gi-black)" }}>{T("오늘의 거리, 내일의 거리", "Today's street, tomorrow's")}</h3>
            <div className="relative -mx-5 mt-4 aspect-[9/14] overflow-hidden select-none" style={{ background: "#0b1828" }}>
              <img src="/seobu/img/ai-oldmarket.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
              <img src="/seobu/img/ai-retail.webp" alt="" className="absolute inset-0 h-full w-full object-cover" style={{ clipPath: `inset(0 0 0 ${ba}%)` }} />
              <div className="pointer-events-none absolute inset-y-0" style={{ left: `${ba}%`, width: 2, background: "#fff" }} />
              <span className="absolute left-3 top-3 bg-white px-1.5 py-0.5 text-[10.5px] font-bold" style={{ color: "var(--gi-black)" }}>{T("오늘", "Today")}</span>
              <span className="absolute right-3 top-3 px-1.5 py-0.5 text-[10.5px] font-bold text-white" style={{ background: "var(--gi-copper)" }}>{T("이후 · AI 예시", "After · AI")}</span>
              <input type="range" min={0} max={100} value={ba} onChange={(e) => setBa(+e.target.value)} aria-label={T("전후 비교", "Before and after")} className="absolute inset-0 h-full w-full cursor-ew-resize" style={{ opacity: 0 }} />
            </div>
            <p className="mt-2 text-[11.5px]" style={{ color: "var(--gi-sub)" }}>{T("가운데 선을 옆으로 밀어 비교해 보세요.", "Drag the line to compare.")}</p>

            <div className="mt-12 grid grid-cols-2 gap-2.5">
              <Reveal src="/seobu/video/g-morning.webp" className="aspect-[3/4]" />
              <Reveal src="/seobu/video/g-lobby.webp" className="aspect-[3/4]" />
              <Reveal src="/seobu/video/g-gallery.webp" className="col-span-2 aspect-[4/3]" />
            </div>
            <p className="mt-2 text-[11.5px]" style={{ color: "var(--gi-sub)" }}>{T("스트리트몰 · 그랜드 로비 · 마켓 갤러리 — AI 이미지 콘셉트 시안", "Street mall · grand lobby · market gallery — AI concept")}</p>

            <a href="/seobu/m" target="_blank" rel="noopener" className="mt-10 flex items-center justify-between px-5 py-4 text-[15px] font-bold text-white" style={{ background: "var(--gi-black)" }}>{T("실제 사이트 열어보기", "Open the live site")} <Arrow /></a>
          </section>

          {/* 04 유사 프로젝트 문의 */}
          <section className="px-5 pt-14 pb-16" style={{ background: "var(--gi-ink)" }}>
            <Kicker light>04 · YOUR PROJECT</Kicker>
            <h2 className="mt-4 text-[28px] font-extrabold leading-[1.25] tracking-[-0.03em] text-white"><Lift>{T("비슷한 사업이", "Have a similar")}</Lift><Lift delay={0.08}>{T("있으신가요?", "project?")}</Lift></h2>
            <p className="mt-4 text-[14.5px] leading-[1.8]" style={{ color: "#a9b6c8" }}>{T("재개발·개발 사업의 브랜드와 사이트, 투자자용 자료까지 한 번에 상의하실 수 있습니다. 초기 진단은 무료이며, 보수는 결과로 받습니다.", "Talk to us about branding, sites and investor materials for redevelopment or development projects. The first diagnosis is free; we are paid on results.")}</p>
            <a href="/g0dy098g/x#contact" className="mt-8 flex items-center justify-between px-5 py-4 text-[15px] font-bold" style={{ background: "#fff", color: "var(--gi-black)" }}>{T("유사 프로젝트 문의", "Discuss a similar project")} <Arrow /></a>
            <a href="/g0dy098g/x#work" className="mt-3 flex items-center justify-between border px-5 py-4 text-[15px] font-bold text-white" style={{ borderColor: "#3a4c66" }}>{T("다른 사례 보기", "More work")} <Arrow /></a>
          </section>
        </div>
      </div>
    </LangCtx.Provider>
  );
}
