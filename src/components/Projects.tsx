import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

/* 유니코가 함께하는 공간 프로젝트 — 신촌 · 정선호텔 · 더케이 · 서부시장 (GB LABS식 섹션 카드) */
const ITEMS = {
  ko: [
    { no: "01", href: "/sinchon/orbit", img: "/sinchon/after-exterior.webp", name: "신촌 ORBIT HOUSE", sub: "SINCHON · SMART HOSTEL", desc: "대학가와 병원 사이, 잠든 상가 건물을 하루부터 한 학기까지 머무는 스마트호스텔로 깨우는 구상." },
    { no: "02", href: "/jeongseon", img: "/jeongseon/img/after-night.webp", name: "정선호텔", sub: "JEONGSEON HOTEL", desc: "동강과 화암동굴 사이, 정선 관광호텔을 AI 스마트호텔로 다시 짓는 구상." },
    { no: "03", href: "/thek", img: "/thek/img/hero.webp", name: "더케이", sub: "THE K · SMART HOSTEL", desc: "파주 금촌의 상가 건물을 무인 체크인 스마트호스텔로 바꾸는 구상." },
    { no: "04", href: "/seobu", img: "/seobu/img/ai-night.webp", name: "서울서부중앙시장", sub: "SEOBU CENTRAL MARKET", desc: "오래된 시장을 주거·상업·생활이 이어지는 복합단지로 재개발하는 구상." },
  ],
  en: [
    { no: "01", href: "/sinchon/orbit", img: "/sinchon/after-exterior.webp", name: "Sinchon ORBIT HOUSE", sub: "SMART HOSTEL", desc: "Waking up a sleeping commercial building between universities and a hospital as a smart hostel — from one night to a semester." },
    { no: "02", href: "/jeongseon", img: "/jeongseon/img/after-night.webp", name: "Jeongseon Hotel", sub: "AI SMART HOTEL", desc: "Rebuilding a tourist hotel between the Donggang River and Hwaam Cave as an AI smart hotel." },
    { no: "03", href: "/thek", img: "/thek/img/hero.webp", name: "The K", sub: "SMART HOSTEL", desc: "Turning a commercial building in Paju into a self check-in smart hostel." },
    { no: "04", href: "/seobu", img: "/seobu/img/ai-night.webp", name: "Seobu Central Market", sub: "MIXED-USE REDEVELOPMENT", desc: "Redeveloping a traditional Seoul market into homes, retail and everyday life in one place." },
  ],
};

export function Projects({ lang = "ko" }: { lang?: "ko" | "en" }) {
  const en = lang === "en";
  const items = ITEMS[lang];
  return (
    <section id="projects" className="relative scroll-mt-20 bg-navy-950 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <SectionLabel index={en ? "PROJECTS" : "PROJECTS · 공간 프로젝트"} title={en ? "Beyond resources, into places" : "자원을 넘어, 공간으로"} tone="dark" />
        <p className="mt-6 max-w-xl break-keep text-sm leading-relaxed text-white/70">
          {en
            ? "UNICO brings its network of capital and partners to real-estate projects that give old places a new purpose."
            : "유니코는 자본과 파트너 네트워크를 바탕으로, 오래된 공간에 새로운 쓰임을 더하는 프로젝트를 함께합니다."}
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={it.no} delay={i * 0.08}>
              <a href={it.href} className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.img} alt={it.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
                <span className="absolute left-5 top-5 font-serif text-lg italic text-gold-300">{it.no}</span>
                <div className="absolute inset-x-5 bottom-5">
                  <p className="text-[10px] font-semibold tracking-[0.3em] text-gold-300">{it.sub}</p>
                  <h3 className="mt-2 text-2xl font-bold text-white">{it.name}</h3>
                  <p className="mt-2 break-keep text-[13px] leading-relaxed text-white/80">{it.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-white">
                    {en ? "View project" : "프로젝트 보기"} <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-[11px] text-white/45">{en ? "Concept proposals. Images are AI-generated visualisations." : "검토 중인 구상안이며, 이미지는 AI로 만든 예시입니다."}</p>
      </div>
    </section>
  );
}
