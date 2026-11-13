"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform, useMotionValue, useMotionValueEvent, useReducedMotion } from "framer-motion";

/* 원칙: 투명도는 움직이지 않는다 (갤럭시 빈 화면 방지) — 위치·크기·마스크만 움직인다 */
const A = (f: string) => `/sinchon/${f}`;
const EASE = [0.16, 1, 0.3, 1] as const;
type Lang = "ko" | "en";

function Rise({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ y: 26 }} whileInView={{ y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.8, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

function Lift({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true });
  return (
    <span ref={ref} className="block overflow-hidden pb-[2px]">
      <motion.span className="block" initial={{ y: "108%" }} animate={{ y: seen ? "0%" : "108%" }} transition={{ duration: 0.9, delay, ease: EASE }}>{children}</motion.span>
    </span>
  );
}

function Badge({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span className="rounded-full px-2 py-[3px] text-[10px] font-medium" style={dark ? { background: "rgba(20,18,14,.55)", color: "#f3ead8" } : { background: "rgba(251,248,242,.92)", color: "var(--sh-char)" }}>
      {children}
    </span>
  );
}

function Photo({ src, alt, className, pos = "50% 50%", badge }: { src: string; alt: string; className?: string; pos?: string; badge?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-30px" });
  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`}>
      <motion.div className="absolute inset-0" style={{ background: "#ece5d7" }} initial={{ clipPath: "inset(100% 0% 0% 0%)" }} animate={{ clipPath: seen ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" }} transition={{ duration: 1.1, ease: EASE }}>
        <motion.img src={src} alt={alt} className="h-full w-full object-cover" style={{ objectPosition: pos }} initial={{ scale: 1.12 }} animate={{ scale: seen ? 1 : 1.12 }} transition={{ duration: 1.6, ease: EASE }} />
      </motion.div>
      {badge && <div className="absolute right-2.5 top-2.5"><Badge dark>{badge}</Badge></div>}
    </div>
  );
}

function Head({ no, en, children, sub }: { no: string; en: string; children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="mb-8">
      <Rise>
        <div className="sh-en mb-3 flex items-center gap-2 text-[11px] font-semibold" style={{ color: "var(--sh-olive)" }}>
          <span>{no}</span>
          <motion.span className="h-px w-10 origin-left" style={{ background: "var(--sh-olive)" }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.2, ease: EASE }} />
          <span>{en}</span>
        </div>
      </Rise>
      <h2 className="text-[26px] font-bold leading-[1.4] tracking-tight" style={{ color: "var(--sh-ink)" }}><Lift>{children}</Lift></h2>
      {sub && <Rise delay={0.15}><p className="mt-3 text-[14.5px] leading-[1.85]" style={{ color: "var(--sh-sub)" }}>{sub}</p></Rise>}
    </div>
  );
}

function Icon({ d, size = 22 }: { d: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;
}
const I: Record<string, string> = {
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M3 12h18 M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z",
  tool: "M14.5 6.5a4 4 0 0 0-5.3 5.3L4 17l3 3 5.2-5.2a4 4 0 0 0 5.3-5.3l-2.5 2.5-2.5-.5-.5-2.5z",
  cal: "M4 6h16v14H4z M4 10h16 M8 3v4 M16 3v4",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2",
  key: "M14 10a4 4 0 1 0-3.5 4L9 15.5V18h2.5v-2H13l1.5-1.5 M15.5 8.5h.01",
  fire: "M12 3s5 4.5 5 9.5a5 5 0 0 1-10 0C7 9 9.5 7.5 9.5 7.5S10 10 12 10c0-3 0-7 0-7z",
  user: "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21a8 8 0 0 1 16 0",
  doc: "M6 3h9l4 4v14H6z M15 3v4h4 M9 12h7 M9 16h7",
  arrow: "M5 12h14 M13 6l6 6-6 6",
  up: "M12 19V5 M5 12l7-7 7 7",
  check: "M5 12l5 5L20 7",
  pin: "M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  walk: "M13 4.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M10 22l2-7 3 3v4 M8 12l2-4 4 1 2 4 M10 8l-2 6",
  train: "M7 3h10a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V5a2 2 0 0 1 2-2z M5 10h14 M8 20l-2 2 M16 20l2 2 M9 14h.01 M15 14h.01",
  bus: "M6 3h12a2 2 0 0 1 2 2v12H4V5a2 2 0 0 1 2-2z M4 11h16 M7 20v-3 M17 20v-3 M8 14h.01 M16 14h.01",
};

/* ───────── 스크롤 여행: 외관 → 라운지 → 1인실 (위로 밀면 장면이 바뀐다) ─────────
   · 스크롤 진행도(0~1)로 장면을 마스크(clipPath)로 덮고, 글자는 y 이동으로 교체 — 투명도 사용 안 함
   · 지금 보이는 장면의 영상만 재생, 화면을 벗어나면 모두 정지 */
type TFn = (ko: ReactNode, en: ReactNode) => ReactNode;
const SCENES = [
  { kind: "video", src: "exterior.mp4", poster: "exterior-poster.webp", no: "01", en: "EXTERIOR", badgeKo: "AI 영상 · 예시", badgeEn: "AI video · concept",
    ko: <>해가 지면,<br />창마다 불이 켜지는 집</>, enT: <>At dusk,<br />every window comes alive</>,
    dKo: "신촌역 가까운 모퉁이, 오래된 상가가 유학생과 여행자의 스마트 호스텔이 됩니다.", dEn: "A corner near Sinchon Station — an old commercial tower becomes a smart hostel for students and travellers." },
  { kind: "video", src: "lounge.mp4", poster: "lounge-poster.webp", no: "02", en: "SHARED LOUNGE", badgeKo: "AI 영상 · 예시", badgeEn: "AI video · concept",
    ko: <>혼자 와도,<br />혼자가 아닌 저녁</>, enT: <>Arrive alone,<br />never dine alone</>,
    dKo: "1층 카페 라운지와 공용 주방에서 처음 만난 친구들과 저녁을.", dEn: "Dinner with new friends in the ground-floor café lounge and shared kitchen." },
  { kind: "image", src: "room-arrival.webp", poster: "", no: "03", en: "YOUR ROOM", badgeKo: "AI 이미지 · 예시", badgeEn: "AI image · concept",
    ko: <>문을 열면,<br />내 방</>, enT: <>Open the door —<br />your own room</>,
    dKo: "침구·책상·개인 욕실까지, 가방만 풀면 됩니다.", dEn: "Linen, desk, private bathroom — just unpack." },
] as const;

function Journey({ t }: { t: TFn }) {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const onScreen = useInView(stage, { margin: "0px" });
  const { scrollYProgress: raw } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  /* 브라우저 자체 스크롤 타임라인과 어긋나지 않도록, 진행도를 자바스크립트 값으로 한 번 옮겨 쓴다 */
  const p = useMotionValue(0);
  useMotionValueEvent(raw, "change", (v) => p.set(v));
  useEffect(() => { p.set(raw.get()); }, [p, raw]);

  const REVEAL = ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"];
  const clip2 = useTransform(p, [0.28, 0.4], REVEAL);
  const clip3 = useTransform(p, [0.61, 0.73], REVEAL);
  const zoom1 = useTransform(p, [0, 0.4], [1, 1.07]);
  const zoom3 = useTransform(p, [0.61, 1], [1.16, 1]);
  const cap1 = useTransform(p, [0, 0.27, 0.35], ["0%", "0%", "-130%"]);
  const cap2 = useTransform(p, [0.3, 0.38, 0.6, 0.68], ["130%", "0%", "0%", "-130%"]);
  const cap3 = useTransform(p, [0.63, 0.71, 1], ["130%", "0%", "0%"]);
  const hintY = useTransform(p, [0, 0.05], ["0%", "-220%"]);
  const bar = useTransform(p, [0, 1], [0, 1]);

  useMotionValueEvent(p, "change", (v) => setActive(v < 0.34 ? 0 : v < 0.67 ? 1 : 2));

  useEffect(() => {
    vids.current.forEach((v, i) => {
      if (!v) return;
      if (onScreen && i === active) v.play().catch(() => {});
      else v.pause();
    });
  }, [active, onScreen]);

  if (reduce) {
    return (
      <section id="story" className="scroll-mt-24 space-y-8 px-6 py-16">
        {SCENES.map((s) => (
          <div key={s.no}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl" style={{ background: "#2b2720" }}>
              {s.kind === "video" ? <video className="h-full w-full object-cover" src={A(s.src)} poster={A(s.poster)} muted loop playsInline preload="metadata" /> : <img src={A(s.src)} alt="" className="h-full w-full object-cover" />}
              <div className="absolute right-2.5 top-2.5"><Badge dark>{t(s.badgeKo, s.badgeEn)}</Badge></div>
            </div>
            <div className="sh-en mt-3 text-[11px] font-semibold" style={{ color: "var(--sh-olive)" }}>{s.no} · {s.en}</div>
            <div className="mt-1 text-[20px] font-bold leading-[1.4]">{t(s.ko, s.enT)}</div>
            <p className="mt-1 text-[13.5px] leading-[1.7]" style={{ color: "var(--sh-sub)" }}>{t(s.dKo, s.dEn)}</p>
          </div>
        ))}
      </section>
    );
  }

  const caps = [cap1, cap2, cap3];
  const cur = SCENES[active];
  return (
    <section id="story" ref={wrap} className="relative" style={{ height: "400vh", userSelect: "none", WebkitUserSelect: "none", WebkitTouchCallout: "none" }}>
      <div ref={stage} className="sticky top-0 h-[100dvh] w-full overflow-hidden" style={{ background: "#2b2720" }}>
        {/* 장면 1 → 2 → 3, 아래에서 위로 마스크가 올라오며 덮는다 */}
        <motion.div className="absolute inset-0" style={{ scale: zoom1 }}>
          <video ref={(el) => { vids.current[0] = el; }} className="h-full w-full object-cover" src={A(SCENES[0].src)} poster={A(SCENES[0].poster)} muted loop playsInline preload="metadata" />
        </motion.div>
        <motion.div className="absolute inset-0" style={{ clipPath: clip2 }}>
          <video ref={(el) => { vids.current[1] = el; }} className="h-full w-full object-cover" src={A(SCENES[1].src)} poster={A(SCENES[1].poster)} muted loop playsInline preload="metadata" />
        </motion.div>
        <motion.div className="absolute inset-0" style={{ clipPath: clip3 }}>
          <motion.img src={A(SCENES[2].src)} alt="" className="h-full w-full object-cover" style={{ scale: zoom3, objectPosition: "50% 45%" }} />
        </motion.div>

        <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(20,16,10,.62) 0%, rgba(20,16,10,0) 30%, rgba(20,16,10,0) 48%, rgba(20,16,10,.78) 100%)" }} />

        {/* 진행 표시 */}
        <motion.div className="absolute left-0 top-0 z-30 h-[3px] w-full origin-left" style={{ background: "var(--sh-glow)", scaleX: bar }} />
        <div className="absolute right-3 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-2.5" aria-hidden="true">
          {SCENES.map((s, i) => (
            <span key={s.no} className="block w-[6px] rounded-full transition-all duration-500" style={{ height: active === i ? 26 : 6, background: active === i ? "var(--sh-glow)" : "rgba(255,255,255,.5)" }} />
          ))}
        </div>

        {/* 장면 번호 · 배지 */}
        <div className="absolute inset-x-0 top-[100px] z-30 flex items-center justify-between px-6">
          <div className="sh-en text-[11px] font-semibold" style={{ color: "#f3ead8" }}>{cur.no} / 03 · {cur.en}</div>
          <Badge dark>{t(cur.badgeKo, cur.badgeEn)}</Badge>
        </div>

        {/* 글자: 장면마다 아래에서 올라오고 위로 사라진다 */}
        <div className="absolute inset-x-0 bottom-[88px] z-30 px-6">
          <div className="relative">
            {SCENES.map((s, i) => (
              <div key={s.no} className={i === 0 ? "overflow-hidden" : "absolute inset-x-0 bottom-0 overflow-hidden"}>
                <motion.div style={{ y: caps[i] }}>
                  <div className="text-[30px] font-bold leading-[1.3] tracking-tight text-white">{t(s.ko, s.enT)}</div>
                  <p className="mt-2.5 max-w-[320px] text-[14px] leading-[1.75]" style={{ color: "#f2e9d8" }}>{t(s.dKo, s.dEn)}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* 밀어 보라는 안내: 조금 내려가면 사라진다 */}
        <div className="absolute inset-x-0 bottom-7 z-30 flex justify-center overflow-hidden">
          <motion.div className="flex items-center gap-2 rounded-full px-4 py-2 text-[12.5px] font-semibold" style={{ y: hintY, background: "rgba(251,245,234,.92)", color: "var(--sh-ink)" }}>
            {t("아래로 밀어 체크인해 보세요", "Scroll down to check in")}
            <span className="sh-cue"><Icon d="M6 9l6 6 6-6" size={16} /></span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ───────── 콘텐츠 (예시·추정 값은 화면에 표시) ───────── */
const ROOMS = [
  {
    id: "single", ko: "1인실", en: "Single", img: "room-single.webp", area: "약 14㎡", cap: 1,
    priceKo: "요금 협의 중", priceEn: "Rates being set",
    tagKo: "나만의 방, 나만의 욕실", tagEn: "Your own room, your own bathroom",
    featKo: ["싱글 침대·침구", "창가 원목 책상·조명", "붙박이장·전신 거울", "개인 욕실"],
    featEn: ["Single bed & linen", "Window-side oak desk & lamp", "Built-in wardrobe & mirror", "Private bathroom"],
    privacy: 100, value: 55,
  },
  {
    id: "twin", ko: "2인실", en: "Twin", img: "room-twin.webp", area: "약 20㎡", cap: 2,
    priceKo: "요금 협의 중", priceEn: "Rates being set",
    tagKo: "친구와 함께, 각자의 자리", tagEn: "Share with a friend, keep your corner",
    featKo: ["싱글 침대 2", "창가 공용 책상·의자 2", "옷장 2·칸막이 선반", "개인 욕실"],
    featEn: ["2 single beds", "Shared window desk, 2 chairs", "2 wardrobes & divider shelf", "Private bathroom"],
    privacy: 70, value: 75,
  },
  {
    id: "triple", ko: "3인실", en: "Triple", img: "room-triple.webp", area: "약 26㎡", cap: 3,
    priceKo: "요금 협의 중", priceEn: "Rates being set",
    tagKo: "셋이 써도, 커튼 하나로 내 공간", tagEn: "Three of you — a curtain makes it yours",
    featKo: ["로프트 침대+책상 1, 싱글 침대 2", "침대별 커튼·독서등", "공용 책상·의자 3", "개인 욕실"],
    featEn: ["1 loft bed + desk, 2 single beds", "Curtain & reading light per bed", "Shared desk, 3 chairs", "Private bathroom"],
    privacy: 55, value: 92,
  },
];

const SCHOOLS = [
  { id: "yonsei", ko: "연세대", en: "Yonsei", modeKo: "도보", modeEn: "Walk", icon: "walk", min: "약 10분", minEn: "~10 min", noteKo: "연세로를 따라 정문까지", noteEn: "Straight up Yonsei-ro to the main gate", x: 118, y: 52 },
  { id: "ewha", ko: "이화여대", en: "Ewha", modeKo: "도보·버스", modeEn: "Walk / Bus", icon: "bus", min: "약 15분", minEn: "~15 min", noteKo: "신촌역에서 이대 방향, 버스면 5분 안팎", noteEn: "Toward Ewha from Sinchon Stn; ~5 min by bus", x: 262, y: 58 },
  { id: "sogang", ko: "서강대", en: "Sogang", modeKo: "도보", modeEn: "Walk", icon: "walk", min: "약 15분", minEn: "~15 min", noteKo: "신촌로터리를 건너 서강대 방향", noteEn: "Across Sinchon rotary toward Sogang", x: 252, y: 222 },
  { id: "hongik", ko: "홍익대", en: "Hongik", modeKo: "지하철", modeEn: "Subway", icon: "train", min: "약 10분", minEn: "~10 min", noteKo: "2호선 신촌역 → 홍대입구역 한 정거장", noteEn: "Line 2, one stop to Hongik Univ. Stn", x: 40, y: 200 },
];

const TERMS = [
  { id: "short", ko: "단기 숙박", en: "Short stay", periodKo: "1박 – 6박", periodEn: "1 – 6 nights" },
  { id: "month", ko: "한 달 살기", en: "Monthly stay", periodKo: "1주 – 3개월", periodEn: "1 week – 3 months" },
  { id: "long", ko: "장기 체류", en: "Long stay", periodKo: "학기 단위 (약 4개월)", periodEn: "By semester (≈4 months)" },
];

const FLOORS = [
  { fl: "9F", ko: "스카이 라운지 · 스터디", en: "Sky lounge & study", tagKo: "하루를 마무리하는 꼭대기", tagEn: "The top floor to end the day",
    dKo: "조용히 공부하고, 해 질 녘 신촌을 내려다보며 쉬는 공용 공간 (구상).", dEn: "A quiet study and rest space overlooking Sinchon at dusk (concept)." },
  { fl: "3–8F", ko: "객실", en: "Rooms", tagKo: "1인실 · 2인실 · 3인실, 개인 욕실", tagEn: "Single, twin, triple — private bath",
    dKo: "가구를 갖춘 객실층입니다. 층별 객실 수는 도면 확정 뒤 정합니다.", dEn: "Furnished room floors. Room counts per floor will be set once drawings are final." },
  { fl: "2F", ko: "런드리 카페", en: "Laundry café", tagKo: "세탁하는 동안 커피 한 잔", tagEn: "Coffee while the wash runs",
    dKo: "세탁과 무인 카페를 한곳에 묶어, 기다리는 시간이 쉬는 시간이 되게 합니다 (구상).", dEn: "Laundry and a self-serve café in one place, so waiting becomes rest (concept)." },
  { fl: "1F", ko: "카페 라운지 · 프런트", en: "Café lounge & front desk", tagKo: "처음 만나는 얼굴들", tagEn: "Where you first meet",
    dKo: "체크인과 카페 라운지, 공용 주방에서 투숙객이 처음 만나는 층입니다.", dEn: "Check-in, café lounge and shared kitchen — where guests first meet." },
  { fl: "B1", ko: "피트니스 · 프로 당구 라운지", en: "Fitness & pro billiards", tagKo: "운동과 포켓볼, 퍼스널 트레이닝", tagEn: "Gym, pool and personal training",
    dKo: "피트니스와 퍼스널 트레이닝, 프로 선수 레슨·시범경기를 열 수 있는 당구 라운지를 구상합니다 (구상).", dEn: "A gym with personal training and a billiards lounge for pro lessons and exhibition matches (concept)." },
  { fl: "B2", ko: "개인물품 보관창고", en: "Personal storage", tagKo: "계절 짐, 캐리어 보관", tagEn: "Seasonal items and luggage",
    dKo: "계절 옷과 캐리어, 학기 사이 짐을 맡기는 보관함 (구상).", dEn: "Lockers for seasonal clothes, suitcases and between-term luggage (concept)." },
] as const;

export default function SinchonSite() {
  const [lang, setLang] = useState<Lang>("ko");
  const t = (ko: ReactNode, en: ReactNode) => (lang === "ko" ? ko : en);
  const [scrolled, setScrolled] = useState(false);
  const [room, setRoom] = useState(0);
  const [school, setSchool] = useState(0);
  const [term, setTerm] = useState(0);
  const [after, setAfter] = useState(true);
  const [faq, setFaq] = useState<number | null>(0);
  const [floor, setFloor] = useState<number | null>(4);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 120);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const NAV: [string, string, string][] = [
    ["story", "여행", "Tour"], ["home", "건물", "Building"], ["rooms", "객실", "Rooms"], ["school", "학교", "Schools"], ["basement", "층별", "Floors"],
    ["apply", "신청", "Apply"], ["care", "생활지원", "Care"], ["parents", "안심", "Safety"], ["docs", "자료", "Docs"], ["contact", "문의", "Contact"],
  ];

  const R = ROOMS[room];
  const S = SCHOOLS[school];
  const T = TERMS[term];

  return (
    <div className="sh">
      <div className="mx-auto max-w-[480px]">
        {/* 상단 바 */}
        <header className="fixed left-0 right-0 top-0 z-40 transition-colors duration-300" style={{ background: scrolled ? "rgba(251,248,242,.96)" : "transparent", borderBottom: scrolled ? "1px solid var(--sh-line)" : "1px solid transparent" }}>
          <div className="mx-auto flex h-14 max-w-[480px] items-center justify-between px-5">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-left" aria-label="top">
              <div className="sh-serif text-[19px] font-semibold leading-none tracking-[0.06em]" style={{ color: scrolled ? "var(--sh-ink)" : "#fbf5ea" }}>SMART HOSTEL</div>
              <div className="sh-en mt-1 text-[9px]" style={{ color: scrolled ? "var(--sh-sub)" : "#e6dcc8" }}>SINCHON · {t("가칭", "WORKING NAME")}</div>
            </button>
            <div className="flex overflow-hidden rounded-full text-[11px] font-semibold" style={{ border: `1px solid ${scrolled ? "var(--sh-line)" : "rgba(255,255,255,.4)"}` }}>
              {(["ko", "en"] as Lang[]).map((l) => (
                <button key={l} onClick={() => setLang(l)} className="relative px-3 py-1.5" style={{ color: lang === l ? (scrolled ? "#fff" : "var(--sh-ink)") : scrolled ? "var(--sh-sub)" : "#f3ead8" }}>
                  {lang === l && <motion.span layoutId="sh-lang" className="absolute inset-0 rounded-full" style={{ background: scrolled ? "var(--sh-olive)" : "#fbf5ea" }} transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                  <span className="relative">{l === "ko" ? "한국어" : "EN"}</span>
                </button>
              ))}
            </div>
          </div>
          {scrolled && (
            <nav className="sh-noscroll mx-auto flex max-w-[480px] gap-1.5 overflow-x-auto px-5 pb-2.5">
              {NAV.map(([id, ko, en]) => (
                <button key={id} onClick={() => go(id)} className="shrink-0 rounded-full px-3 py-1 text-[12px]" style={{ background: "var(--sh-cream)", color: "var(--sh-char)" }}>{t(ko, en)}</button>
              ))}
            </nav>
          )}
        </header>

        {/* 01 히어로 */}
        <section className="relative h-[100svh] min-h-[640px] overflow-hidden">
          <video className="absolute inset-0 h-full w-full object-cover" src={A("hero.mp4")} poster={A("hero-poster.webp")} autoPlay muted loop playsInline preload="auto" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(43,33,20,.55) 0%, rgba(43,33,20,.12) 38%, rgba(20,16,10,0) 55%, rgba(20,16,10,.55) 100%)" }} />
          <div className="relative z-10 flex h-full flex-col px-6 pb-8 pt-24">
            <Rise><div className="sh-en text-[11px] font-semibold" style={{ color: "#efe3cb" }}>SINCHON · SMART HOSTEL</div></Rise>
            <h1 className="mt-4 text-[38px] font-bold leading-[1.22] tracking-tight text-white">
              <Lift delay={0.1}>{t("하룻밤부터 한 학기까지,", "From one night to a semester,")}</Lift>
              <Lift delay={0.25}>{t("신촌에서 편안하게", "comfortably in Sinchon.")}</Lift>
            </h1>
            <Rise delay={0.45}><p className="mt-4 max-w-[320px] text-[14.5px] leading-[1.75]" style={{ color: "#f2e9d8" }}>{t("연세·이화·서강·홍익 생활권, 유학생과 여행자를 위한 가구 완비 스마트 호스텔", "A fully furnished smart hostel for students and travellers around Yonsei, Ewha, Sogang and Hongik.")}</p></Rise>
            <div className="mt-auto">
              <Rise delay={0.6}>
                <div className="flex gap-2.5">
                  <button onClick={() => go("rooms")} className="flex-1 rounded-full py-3.5 text-[14px] font-semibold" style={{ background: "#fbf5ea", color: "var(--sh-ink)" }}>{t("방 보기", "See rooms")}</button>
                  <button onClick={() => go("contact")} className="flex-1 rounded-full py-3.5 text-[14px] font-semibold text-white" style={{ background: "var(--sh-olive)" }}>{t("예약 문의", "Enquire")}</button>
                </div>
              </Rise>
              <Rise delay={0.75}>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  {[[t("4개 대학", "4 universities"), t("생활권", "nearby")], [t("1박부터", "From 1 night"), t("장기 체류까지", "to long stays")], [t("AI 다국어", "AI multilingual"), t("생활지원", "life support")]].map((s, i) => (
                    <div key={i} className="rounded-xl px-1 py-2.5" style={{ background: "rgba(20,16,10,.38)", border: "1px solid rgba(255,255,255,.18)" }}>
                      <div className="text-[13px] font-bold text-white">{s[0]}</div>
                      <div className="text-[11px]" style={{ color: "#e8dcc4" }}>{s[1]}</div>
                    </div>
                  ))}
                </div>
              </Rise>
              <div className="mt-4 flex items-center justify-between">
                <Badge dark>{t("AI 영상 · 예시", "AI video · concept")}</Badge>
                <span className="sh-cue text-[#f3ead8]"><Icon d="M6 9l6 6 6-6" size={20} /></span>
              </div>
            </div>
          </div>
        </section>

        {/* 콘셉트 안내 띠 */}
        <div className="px-6 py-3 text-center text-[11.5px] leading-[1.6]" style={{ background: "var(--sh-olive2)", color: "#e9e2cd" }}>
          {t("콘셉트 시안 · 오픈 준비 중 — 객실 수·요금·이동시간은 예시이며 확정 전입니다.", "Concept preview · opening in preparation — room counts, prices and travel times are illustrative.")}
        </div>

        {/* 02 스크롤 여행 */}
        <Journey t={t} />

        {/* 03 건물 */}
        <section id="home" className="scroll-mt-24 px-6 py-16" style={{ background: "var(--sh-cream)" }}>
          <Head no="02" en="THE BUILDING" sub={t("신촌역 가까운 지하 2층~지상 9층 건물을, 1층은 카페 라운지로 위층은 객실로 바꾸는 계획입니다.", "A B2–9F building near Sinchon Station — café lounge on the ground floor, guest rooms above.")}>
            {t(<>오래된 상가를,<br />스마트 호스텔로</>, <>From an old commercial tower<br />to a smart hostel</>)}
          </Head>
          <Rise>
            <div className="mb-3 flex rounded-full p-1" style={{ background: "#ebe3d3" }}>
              {[[false, t("지금 모습", "Today")], [true, t("리모델링 후 (예시)", "After (concept)")]].map(([v, label]) => (
                <button key={String(v)} onClick={() => setAfter(v as boolean)} className="relative flex-1 rounded-full py-2 text-[13px] font-semibold" style={{ color: after === v ? "#fff" : "var(--sh-char)" }}>
                  {after === v && <motion.span layoutId="sh-ba" className="absolute inset-0 rounded-full" style={{ background: "var(--sh-olive)" }} transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                  <span className="relative">{label as ReactNode}</span>
                </button>
              ))}
            </div>
          </Rise>
          <div className="relative aspect-[2/3] overflow-hidden rounded-2xl" style={{ background: "#ddd5c4" }}>
            <img src={A("before-exterior.webp")} alt="before" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: "45% 40%" }} />
            <motion.div className="absolute inset-0" initial={false} animate={{ clipPath: after ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 0% 100%)" }} transition={{ duration: 0.9, ease: EASE }}>
              <img src={A("after-exterior-day.webp")} alt="after" className="h-full w-full object-cover" style={{ objectPosition: "50% 40%" }} />
            </motion.div>
            <div className="absolute left-2.5 top-2.5"><Badge dark>{after ? t("리모델링 후 예시 · AI 이미지", "Remodel concept · AI image") : t("현재 모습 · 간판 흐림 처리", "Today · signs blurred")}</Badge></div>
          </div>
          <p className="mt-3 text-[12px] leading-[1.7]" style={{ color: "var(--sh-sub)" }}>{t("외관 리모델링 방향(설계 시안 기준): 라이트 베이지 석재와 브론즈 유리, 또는 다크 그레이 메탈 패널 두 가지로 검토 중입니다.", "Facade direction (per design proposal): light beige stone with bronze glass, or dark-grey metal panels — both under review.")}</p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[[t("지하 2~지상 9층", "B2 – 9F"), t("기존 건물 활용", "existing frame")], [t("1층", "Ground"), t("카페 라운지", "café lounge")], [t("도보 약 6분", "~6 min walk"), t("2호선 신촌역", "Line 2 Sinchon Stn")]].map((s, i) => (
              <Rise key={i} delay={i * 0.08}>
                <div className="rounded-xl bg-white px-1 py-3">
                  <div className="text-[14px] font-bold" style={{ color: "var(--sh-olive2)" }}>{s[0]}</div>
                  <div className="mt-0.5 text-[11.5px]" style={{ color: "var(--sh-sub)" }}>{s[1]}</div>
                </div>
              </Rise>
            ))}
          </div>
        </section>

        {/* 04 객실 */}
        <section id="rooms" className="scroll-mt-24 px-6 py-16">
          <Head no="03" en="ROOMS" sub={t("모든 방에 개인 욕실이 있습니다. 예산과 생활 방식에 맞게 고르세요.", "Every room has a private bathroom. Choose by budget and lifestyle.")}>
            {t(<>혼자, 둘이, 셋이<br />— 나에게 맞는 방</>, <>Alone, in two or three<br />— find your fit</>)}
          </Head>
          <div className="mb-4 flex rounded-full p-1" style={{ background: "var(--sh-cream)" }}>
            {ROOMS.map((r, i) => (
              <button key={r.id} onClick={() => setRoom(i)} className="relative flex-1 rounded-full py-2.5 text-[14px] font-semibold" style={{ color: room === i ? "#fff" : "var(--sh-char)" }}>
                {room === i && <motion.span layoutId="sh-room" className="absolute inset-0 rounded-full" style={{ background: "var(--sh-olive)" }} transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <span className="relative">{t(r.ko, r.en)}</span>
              </button>
            ))}
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl" style={{ background: "#ece5d7" }}>
            <AnimatePresence initial={false} mode="popLayout">
              <motion.img key={R.id} src={A(R.img)} alt={R.ko} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: "50% 55%" }} initial={{ clipPath: "inset(0% 0% 0% 100%)", scale: 1.06 }} animate={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1 }} exit={{ clipPath: "inset(0% 100% 0% 0%)" }} transition={{ duration: 0.8, ease: EASE }} />
            </AnimatePresence>
            <div className="absolute right-2.5 top-2.5 z-10"><Badge dark>{t("AI 이미지 · 예시", "AI image")}</Badge></div>
          </div>
          <div className="mt-5">
            <div className="text-[19px] font-bold">{t(R.tagKo, R.tagEn)}</div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl py-3" style={{ background: "var(--sh-cream)" }}><div className="text-[11px]" style={{ color: "var(--sh-sub)" }}>{t("면적(예시)", "Size (est.)")}</div><div className="mt-0.5 text-[15px] font-bold">{R.area}</div></div>
              <div className="rounded-xl py-3" style={{ background: "var(--sh-cream)" }}><div className="text-[11px]" style={{ color: "var(--sh-sub)" }}>{t("정원", "Capacity")}</div><div className="mt-0.5 text-[15px] font-bold">{R.cap}{t("명", lang === "en" && R.cap > 1 ? " ppl" : " person")}</div></div>
              <div className="rounded-xl py-3" style={{ background: "var(--sh-cream)" }}><div className="text-[11px]" style={{ color: "var(--sh-sub)" }}>{t("욕실", "Bath")}</div><div className="mt-0.5 text-[15px] font-bold">{t("개인", "Private")}</div></div>
            </div>
            <ul className="mt-4 space-y-2">
              {(lang === "ko" ? R.featKo : R.featEn).map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-[14px]" style={{ color: "var(--sh-char)" }}><span style={{ color: "var(--sh-olive)" }}><Icon d={I.check} size={16} /></span>{f}</li>
              ))}
            </ul>
            <div className="mt-5 space-y-3 rounded-2xl p-4" style={{ border: "1px solid var(--sh-line)" }}>
              {[[t("나만의 공간", "Privacy"), R.privacy], [t("비용 부담 적음", "Affordability"), R.value]].map(([label, v]) => (
                <div key={String(label)}>
                  <div className="mb-1 flex justify-between text-[12px]" style={{ color: "var(--sh-sub)" }}><span>{label as ReactNode}</span></div>
                  <div className="h-2 overflow-hidden rounded-full" style={{ background: "var(--sh-cream)" }}>
                    <motion.div key={R.id + String(label)} className="h-full origin-left rounded-full" style={{ background: "var(--sh-olive)", width: `${v}%` }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9, ease: EASE }} />
                  </div>
                </div>
              ))}
              <div className="flex items-end justify-between pt-1">
                <div>
                  <div className="text-[11px]" style={{ color: "var(--sh-sub)" }}>{t("객실 요금", "Room rate")}</div>
                  <div className="mt-0.5 text-[20px] font-bold" style={{ color: "var(--sh-olive2)" }}>{t(R.priceKo, R.priceEn)}</div>
                </div>
                <span className="rounded border border-dashed px-1.5 py-0.5 text-[11px]" style={{ borderColor: "var(--sh-olive)", color: "var(--sh-olive)" }}>{t("확정 전", "TBC")}</span>
              </div>
            </div>
            <p className="mt-3 text-[11.5px] leading-[1.7]" style={{ color: "var(--sh-sub)" }}>{t("보증금, 관리비·공과금 포함 여부, 최종 객실 구성은 설계·운영 조건이 정해진 뒤 확정됩니다.", "Deposit, utilities and final room mix will be confirmed once design and operations are set.")}</p>
          </div>
        </section>

        {/* 05 학교 */}
        <section id="school" className="scroll-mt-24 px-6 py-16" style={{ background: "var(--sh-cream)" }}>
          <Head no="04" en="YOUR CAMPUS" sub={t("다니는 학교를 고르면 예상 이동 시간을 보여 드립니다.", "Pick your school to see the estimated commute.")}>
            {t("어느 대학에 다니시나요?", "Which university are you attending?")}
          </Head>
          <div className="grid grid-cols-4 gap-1.5">
            {SCHOOLS.map((s, i) => (
              <button key={s.id} onClick={() => setSchool(i)} className="relative rounded-xl py-2.5 text-[13px] font-semibold" style={{ color: school === i ? "#fff" : "var(--sh-char)", background: school === i ? "transparent" : "#fff" }}>
                {school === i && <motion.span layoutId="sh-school" className="absolute inset-0 rounded-xl" style={{ background: "var(--sh-olive)" }} transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <span className="relative">{t(s.ko, s.en)}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl bg-white">
            <svg viewBox="0 0 320 270" className="block w-full" role="img" aria-label="map">
              <rect width="320" height="270" fill="#f3eee3" />
              <path d="M0 140 C 80 130, 150 150, 320 128" stroke="#e2d9c6" strokeWidth="14" fill="none" />
              <path d="M150 0 C 155 80, 148 160, 160 270" stroke="#e2d9c6" strokeWidth="10" fill="none" />
              <path d="M0 140 C 80 130, 150 150, 320 128" stroke="#cfc4ad" strokeWidth="1" strokeDasharray="4 5" fill="none" />
              <text x="300" y="120" textAnchor="end" fontSize="8.5" fill="#9a8f7c">{lang === "ko" ? "2호선" : "Line 2"}</text>
              {SCHOOLS.map((s, i) => (
                <g key={s.id}>
                  <motion.path d={`M160 150 Q ${(160 + s.x) / 2 + (i % 2 ? 18 : -18)} ${(150 + s.y) / 2} ${s.x} ${s.y}`} fill="none" stroke={school === i ? "#5c6838" : "#d8cfbb"} strokeWidth={school === i ? 2.4 : 1.2} strokeDasharray={school === i ? "0" : "3 4"} initial={false} animate={{ pathLength: school === i ? [0, 1] : 1 }} transition={{ duration: 0.9, ease: EASE }} />
                  <circle cx={s.x} cy={s.y} r={school === i ? 7 : 5} fill={school === i ? "#5c6838" : "#b9ad94"} />
                  <text x={s.x} y={s.y - 11} textAnchor="middle" fontSize="11" fontWeight="700" fill={school === i ? "#3e4826" : "#8a7f6b"}>{lang === "ko" ? s.ko : s.en}</text>
                </g>
              ))}
              <rect x="176" y="158" width="44" height="16" rx="8" fill="#fff" stroke="#cfc4ad" />
              <text x="198" y="169" textAnchor="middle" fontSize="8.5" fill="#6d6352">{lang === "ko" ? "신촌역" : "Sinchon"}</text>
              <motion.circle cx="160" cy="150" r="16" fill="#5c6838" fillOpacity="0.18" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2.4, repeat: Infinity }} style={{ transformOrigin: "160px 150px" }} />
              <circle cx="160" cy="150" r="8" fill="#3e4826" stroke="#fff" strokeWidth="2.5" />
              <text x="148" y="178" textAnchor="end" fontSize="10" fontWeight="700" fill="#3e4826">SMART HOSTEL</text>
              <text x="314" y="262" textAnchor="end" fontSize="8" fill="#a39880">{lang === "ko" ? "개략도 · 실제 축척 아님" : "Schematic · not to scale"}</text>
            </svg>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div key={S.id} className="flex items-center gap-4 p-5" initial={{ y: 14 }} animate={{ y: 0 }} exit={{ y: -14 }} transition={{ duration: 0.45, ease: EASE }}>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--sh-cream)", color: "var(--sh-olive)" }}><Icon d={I[S.icon]} size={24} /></div>
                <div className="min-w-0">
                  <div className="text-[12px]" style={{ color: "var(--sh-sub)" }}>{t(S.modeKo, S.modeEn)} · {t("예상", "est.")}</div>
                  <div className="text-[24px] font-bold leading-tight" style={{ color: "var(--sh-olive2)" }}>{t(S.min, S.minEn)}</div>
                  <div className="mt-0.5 text-[12.5px]" style={{ color: "var(--sh-char)" }}>{t(S.noteKo, S.noteEn)}</div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <p className="mt-3 text-[11.5px]" style={{ color: "var(--sh-sub)" }}>{t("이동 시간은 지도 기준 예상치이며, 실제 측정 후 갱신합니다.", "Times are map-based estimates and will be updated after on-site checks.")}</p>
        </section>

        {/* 층별 안내 (구상안) */}
        <section id="basement" className="scroll-mt-24 px-6 py-16">
          <Head no="FL" en="FLOOR GUIDE" sub={t("지하 2층부터 지상 9층까지, 층마다 쓰임을 나눈 구상안입니다. 층을 눌러 보세요. 확정 전 구상안입니다.", "B2 to 9F, each floor with its own purpose. Tap a floor. Concept only, not yet confirmed.")}>
            {t(<>한 건물,<br />층마다 다른 하루</>, <>One building,<br />a different day on every floor</>)}
          </Head>
          <div className="divide-y rounded-2xl" style={{ border: "1px solid var(--sh-line)", borderColor: "var(--sh-line)" }}>
            {FLOORS.map((f, i) => (
              <div key={f.fl} style={{ borderColor: "var(--sh-line)" }}>
                <button onClick={() => setFloor(floor === i ? null : i)} className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left">
                  <span className="sh-serif w-[46px] shrink-0 text-[20px] font-semibold" style={{ color: "var(--sh-olive)" }}>{f.fl}</span>
                  <span className="flex-1">
                    <span className="block text-[14.5px] font-bold">{t(f.ko, f.en)}</span>
                    <span className="block text-[12px]" style={{ color: "var(--sh-sub)" }}>{t(f.tagKo, f.tagEn)}</span>
                  </span>
                  <motion.span animate={{ rotate: floor === i ? 45 : 0 }} style={{ color: "var(--sh-olive)" }}><Icon d="M12 5v14 M5 12h14" size={18} /></motion.span>
                </button>
                <motion.div initial={false} animate={{ height: floor === i ? "auto" : 0 }} className="overflow-hidden" transition={{ duration: 0.4, ease: EASE }}>
                  <p className="px-4 pb-4 pl-[76px] text-[13px] leading-[1.75]" style={{ color: "var(--sh-sub)" }}>{t(f.dKo, f.dEn)}</p>
                </motion.div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11.5px] leading-[1.7]" style={{ color: "var(--sh-sub)" }}>{t("층별 구성은 설계와 인허가, 운영 조건에 따라 달라질 수 있습니다. 프로당구협회(PBA) 협업은 협의 전입니다.", "Floor use may change with design, permits and operations. A tie-up with the pro billiards association has not been discussed yet.")}</p>
        </section>

        {/* 06 신청 */}
        <section id="apply" className="scroll-mt-24 px-6 py-16">
          <Head no="05" en="HOW TO STAY" sub={t("머무는 기간에 맞춰 고르고, 가볍게 체크인하세요.", "Pick your length of stay and check in with ease.")}>
            {t(<>머무는 기간대로,<br />네 단계면 체크인</>, <>Stay as long as you like,<br />four steps to check in</>)}
          </Head>
          <div className="space-y-2">
            {TERMS.map((tm, i) => (
              <button key={tm.id} onClick={() => setTerm(i)} className="flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left" style={{ background: term === i ? "var(--sh-olive)" : "var(--sh-cream)", color: term === i ? "#fff" : "var(--sh-ink)" }}>
                <span className="text-[15px] font-bold">{t(tm.ko, tm.en)}</span>
                <span className="text-[12.5px]" style={{ color: term === i ? "#e6e0c8" : "var(--sh-sub)" }}>{t(tm.periodKo, tm.periodEn)}</span>
              </button>
            ))}
          </div>
          <div className="relative mt-8 pl-8">
            <motion.div className="absolute left-[11px] top-2 w-px origin-top" style={{ background: "var(--sh-olive)", height: "calc(100% - 16px)" }} initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: EASE }} />
            {[
              [t("온라인 문의", "Enquire online"), t(<>{T.ko} 체류 희망 시기와 방 유형을 남겨 주세요. 한국어·영어로 답합니다.</>, <>Tell us your dates and room type for a {T.en}. We reply in English or Korean.</>)],
              [t("영상 투어·견학", "Video tour or visit"), t("해외에 있어도 영상 통화로 방과 공용 공간을 둘러봅니다.", "Abroad? Walk through the rooms on a video call.")],
              [t("다국어 예약 안내", "Multilingual booking"), t("한·영 병기 약관으로 요금·환불 규정을 미리 확인합니다.", "Bilingual terms with clear rate and refund rules.")],
              [t("체크인", "Check in"), t("도착 전날 앱으로 비밀번호와 이용 안내를 받습니다.", "Get your door code and guest guide in the app the day before.")],
            ].map(([h, d], i) => (
              <Rise key={i} delay={i * 0.08} className="relative pb-6 last:pb-0">
                <span className="absolute -left-8 top-0 flex h-[23px] w-[23px] items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: "var(--sh-olive)" }}>{i + 1}</span>
                <div className="text-[15.5px] font-bold">{h}</div>
                <p className="mt-1 text-[13.5px] leading-[1.75]" style={{ color: "var(--sh-sub)" }}>{d}</p>
              </Rise>
            ))}
          </div>
        </section>

        {/* 07 AI 생활지원 */}
        <section id="care" className="scroll-mt-24 px-6 py-16" style={{ background: "var(--sh-olive2)" }}>
          <div className="mb-8">
            <Rise><div className="sh-en mb-3 text-[11px] font-semibold" style={{ color: "var(--sh-glow)" }}>06 · AI LIFE SUPPORT</div></Rise>
            <h2 className="text-[26px] font-bold leading-[1.4] tracking-tight text-white"><Lift>{t(<>말이 서툴러도,<br />생활은 막히지 않게</>, <>Even if Korean is new,<br />daily life just works</>)}</Lift></h2>
            <Rise delay={0.15}><p className="mt-3 text-[14.5px] leading-[1.85]" style={{ color: "#cfd3bb" }}>{t("AI는 편의를 위해, 긴급한 순간에는 사람이 직접 연결됩니다.", "AI for convenience — a real person when it matters.")}</p></Rise>
          </div>
          <Rise>
            <div className="mb-6 space-y-2.5 rounded-2xl p-4" style={{ background: "#2f3720" }}>
              <div className="ml-auto max-w-[78%] rounded-2xl rounded-br-md px-3.5 py-2.5 text-[13px]" style={{ background: "var(--sh-glow)", color: "var(--sh-ink)" }}>{t("세탁기 지금 비어 있어요? 🧺", "Is a washer free now? 🧺")}</div>
              <div className="max-w-[82%] rounded-2xl rounded-bl-md px-3.5 py-2.5 text-[13px] leading-[1.6] text-white" style={{ background: "#46512e" }}>{t("B1 세탁실 2번이 비어 있어요. 21:30으로 예약해 드릴까요?", "Washer #2 in B1 is free. Shall I book 21:30 for you?")}</div>
              <div className="flex w-14 items-center justify-center gap-1 rounded-2xl rounded-bl-md px-3 py-3" style={{ background: "#46512e" }}>
                {[0, 1, 2].map((d) => <span key={d} className="sh-dot block h-1.5 w-1.5 rounded-full bg-white" style={{ animationDelay: `${d * 0.15}s` }} />)}
              </div>
              <div className="pt-1 text-right text-[10px]" style={{ color: "#a3a88d" }}>{t("화면 예시", "UI concept")}</div>
            </div>
          </Rise>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              [I.globe, t("다국어 생활 안내", "Multilingual guide"), t("한·영·중·일로 생활 규칙, 쓰레기 분리, 동네 정보", "House rules, recycling and local tips in 4 languages")],
              [I.tool, t("수리·불편 접수", "Repairs in a snap"), t("사진 한 장이면 접수, 처리 과정을 알림으로", "Send a photo, track the fix by notification")],
              [I.cal, t("공용시설 예약", "Book shared spaces"), t("세탁기·스터디룸·라운지를 앱에서", "Washers, study rooms, lounge — in the app")],
              [I.phone, t("긴급은 사람이", "People for emergencies"), t("아프거나 위급할 땐 담당자가 바로 연결", "Sick or urgent? A staff member answers")],
            ].map(([ic, h, d], i) => (
              <Rise key={i} delay={i * 0.06}>
                <div className="h-full rounded-2xl p-4" style={{ background: "#46512e" }}>
                  <span style={{ color: "var(--sh-glow)" }}><Icon d={ic as string} /></span>
                  <div className="mt-2.5 text-[14px] font-bold text-white">{h}</div>
                  <p className="mt-1 text-[12px] leading-[1.6]" style={{ color: "#cfd3bb" }}>{d}</p>
                </div>
              </Rise>
            ))}
          </div>
        </section>

        {/* 08 부모님 안심 */}
        <section id="parents" className="scroll-mt-24 px-6 py-16">
          <Head no="07" en="FOR PARENTS" sub={t("멀리서 보내는 마음까지 생각했습니다.", "We think about the family back home, too.")}>
            {t(<>부모님이 먼저<br />안심하는 숙소</>, <>A stay parents<br />can trust first</>)}
          </Head>
          <div className="space-y-2">
            {[
              [I.key, t("출입 보안", "Secure access"), t("개인 비밀번호 출입, 외부인 출입 기록 관리 (예정)", "Personal door codes and visitor logs (planned)")],
              [I.fire, t("화재·안전 설비", "Fire & safety"), t("방마다 화재감지기, 소방·피난 기준에 맞춘 설계 (예정)", "Smoke detectors in every room, code-compliant design (planned)")],
              [I.user, t("운영 담당자", "On-site team"), t("생활 문제는 AI가, 판단이 필요한 일은 담당자가", "AI for routine, people for judgement")],
              [I.doc, t("투명한 약관", "Clear terms"), t("한·영 약관, 요금·환불 규정 사전 안내", "Bilingual terms, rate & refund rules upfront")],
            ].map(([ic, h, d], i) => (
              <Rise key={i} delay={i * 0.06}>
                <div className="flex items-start gap-3.5 rounded-2xl p-4" style={{ background: "var(--sh-cream)" }}>
                  <span className="mt-0.5 shrink-0" style={{ color: "var(--sh-olive)" }}><Icon d={ic as string} /></span>
                  <div><div className="text-[14.5px] font-bold">{h}</div><p className="mt-0.5 text-[12.5px] leading-[1.65]" style={{ color: "var(--sh-sub)" }}>{d}</p></div>
                </div>
              </Rise>
            ))}
          </div>
          <div className="mt-8 divide-y rounded-2xl" style={{ border: "1px solid var(--sh-line)", borderColor: "var(--sh-line)" }}>
            {[
              [t("하루만 묵을 수도 있나요?", "Can I stay just one night?"), t("1박 단기 숙박부터 학기 단위 장기 체류까지 검토하고 있습니다.", "We are planning stays from one night up to a full semester.")],
              [t("요금에 무엇이 포함되나요?", "What does the rate include?"), t("포함 항목은 운영 조건이 정해진 뒤 확정해 안내합니다.", "Inclusions will be confirmed once operations are finalised.")],
              [t("언제 문을 여나요?", "When do you open?"), t("리모델링 일정이 정해지면 가장 먼저 알려 드리겠습니다.", "We'll let you know first once the remodelling schedule is set.")],
            ].map(([q, a], i) => (
              <div key={i} style={{ borderColor: "var(--sh-line)" }}>
                <button onClick={() => setFaq(faq === i ? null : i)} className="flex w-full items-center justify-between px-4 py-4 text-left text-[14px] font-semibold">
                  <span>{q}</span>
                  <motion.span animate={{ rotate: faq === i ? 45 : 0 }} style={{ color: "var(--sh-olive)" }}><Icon d="M12 5v14 M5 12h14" size={18} /></motion.span>
                </button>
                <motion.div initial={false} animate={{ height: faq === i ? "auto" : 0 }} className="overflow-hidden" transition={{ duration: 0.4, ease: EASE }}>
                  <p className="px-4 pb-4 text-[13px] leading-[1.75]" style={{ color: "var(--sh-sub)" }}>{a}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </section>

        {/* 자료 */}
        <section id="docs" className="scroll-mt-24 px-6 pb-4 pt-16">
          <Head no="08" en="DOCUMENTS" sub={t("사업소개서와 IR 자료를 휴대폰에서 바로 넘겨 보실 수 있습니다.", "Swipe through the business profile and IR deck on your phone.")}>
            {t("사업 자료 바로보기", "Business documents")}
          </Head>
          <div className="space-y-3">
            {[
              ["/scprofile", "/scprofile/s01.webp", t("사업소개서", "Business profile"), t("12장 · 콘셉트·객실·운영", "12 slides · concept, rooms, operations")],
              ["/scplan", "/scplan/s01.webp", t("IR 자료", "IR deck"), t("16장 · 시장·매출·투자 계획(추정)", "16 slides · market, revenue, investment (est.)")],
            ].map(([href, img, h, d], i) => (
              <Rise key={i} delay={i * 0.08}>
                <a href={href as string} className="block overflow-hidden rounded-2xl bg-white" style={{ border: "1px solid var(--sh-line)" }}>
                  <img src={img as string} alt="" className="aspect-[16/9] w-full object-cover" />
                  <div className="flex items-center justify-between p-4">
                    <div><div className="text-[15px] font-bold">{h}</div><div className="mt-0.5 text-[12px]" style={{ color: "var(--sh-sub)" }}>{d}</div></div>
                    <span className="rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-white" style={{ background: "var(--sh-olive)" }}>{t("바로보기", "View")}</span>
                  </div>
                </a>
              </Rise>
            ))}
          </div>
        </section>

        {/* 09 문의 */}
        <section id="contact" className="scroll-mt-24 px-6 py-16" style={{ background: "var(--sh-cream)" }}>
          <Head no="09" en="CONTACT" sub={t("오픈 준비 중입니다. 문의 채널은 곧 열립니다.", "We're preparing to open. Enquiry channels are coming soon.")}>
            {t(<>다음 여행,<br />신촌에서 만나요</>, <>See you in Sinchon<br />on your next trip</>)}
          </Head>
          <div className="space-y-2.5">
            {[
              [t("예약 문의", "Booking enquiry"), t("유학생·여행자·단기 체류자", "Students, travellers & short-stay guests")],
              [t("운영·제휴 문의", "Partnership enquiry"), t("대학 국제처·어학당·운영 파트너", "University offices, language schools, operators")],
            ].map(([h, d], i) => (
              <Rise key={i} delay={i * 0.08}>
                <div className="flex items-center justify-between rounded-2xl bg-white p-4">
                  <div><div className="text-[15px] font-bold">{h}</div><div className="mt-0.5 text-[12px]" style={{ color: "var(--sh-sub)" }}>{d}</div></div>
                  <span className="rounded-full px-3 py-1.5 text-[11.5px] font-semibold" style={{ background: "var(--sh-cream)", color: "var(--sh-olive)" }}>{t("준비 중", "Soon")}</span>
                </div>
              </Rise>
            ))}
          </div>
        </section>

        <footer className="px-6 pb-12 pt-10" style={{ background: "var(--sh-ink)", color: "#b9b09f" }}>
          <div className="sh-serif text-[22px] font-semibold tracking-[0.06em] text-[#f3ead8]">SMART HOSTEL</div>
          <div className="sh-en mt-1 text-[9.5px]">SINCHON · {t("가칭", "WORKING NAME")}</div>
          <p className="mt-6 text-[11.5px] leading-[1.8]">
            {t(
              "이 페이지는 사업 검토를 위한 콘셉트 시안입니다. 사진과 영상은 AI로 만든 예시이며 실제 시설과 다를 수 있습니다. 현재 모습 사진의 간판은 흐림 처리했습니다. 객실 수·면적·요금·이동 시간은 예시·추정치이며, 설계와 운영 조건이 정해진 뒤 확정됩니다.",
              "This page is a concept preview for business review. Photos and videos are AI-generated illustrations and may differ from the actual facility. Signs in the current photo are blurred. Room counts, sizes, prices and travel times are estimates, to be confirmed after design and operations are set."
            )}
          </p>
          <div className="mt-6 text-[10.5px]" style={{ color: "#7d7466" }}>© 2026 SMART HOSTEL ({t("가칭", "working name")})</div>
        </footer>
      </div>

      {scrolled && (
        <motion.button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full text-white shadow-lg" style={{ background: "var(--sh-olive)" }} initial={{ scale: 0 }} animate={{ scale: 1 }} aria-label="top">
          <Icon d={I.up} size={20} />
        </motion.button>
      )}
    </div>
  );
}
