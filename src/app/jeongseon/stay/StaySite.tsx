"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

/* 원칙: 투명도는 움직이지 않는다 (갤럭시 빈 화면 방지) — 위치·크기·마스크만 움직인다 */
const IMG = (f: string) => `/jeongseon/img/${f}.webp`;
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

function Photo({ src, alt, className, tag = true }: { src: string; alt: string; className?: string; tag?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-30px" });
  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      <motion.div className="absolute inset-0 overflow-hidden" initial={{ clipPath: "inset(100% 0% 0% 0%)" }} animate={{ clipPath: seen ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" }} transition={{ duration: 1.1, ease: EASE }}>
        <motion.img src={src} alt={alt} className="h-full w-full object-cover" initial={{ scale: 1.16 }} animate={{ scale: seen ? 1 : 1.16 }} transition={{ duration: 1.6, ease: EASE }} />
        {tag && <span className="absolute right-2 bottom-2 px-1.5 py-0.5 text-[9.5px]" style={{ background: "rgba(246,242,234,.85)", color: "var(--st-sub)" }}>AI 이미지 · 예시</span>}
      </motion.div>
    </div>
  );
}

function Label({ en, ko }: { en: string; ko: string }) {
  return (
    <Rise>
      <div className="st-en text-[13px] uppercase" style={{ color: "var(--st-gold)" }}>{en}</div>
      <div className="mt-0.5 text-[11.5px]" style={{ color: "var(--st-sub)" }}>{ko}</div>
    </Rise>
  );
}

const WMO: Record<number, string> = { 0: "맑음", 1: "대체로 맑음", 2: "구름 조금", 3: "흐림", 45: "안개", 48: "안개", 51: "이슬비", 53: "이슬비", 55: "이슬비", 61: "비", 63: "비", 65: "강한 비", 71: "눈", 73: "눈", 75: "많은 눈", 80: "소나기", 81: "소나기", 82: "소나기", 95: "뇌우" };

const ROOMS = [
  { name: "스탠다드 더블", en: "STANDARD DOUBLE", bed: "퀸 침대 1", img: "after-room" },
  { name: "스탠다드 트윈", en: "STANDARD TWIN", bed: "싱글 침대 2", img: "after-room" },
];

const STEPS = [
  { t: "예약", d: "홈페이지나 예약 앱에서 날짜를 고르면 끝. 결제와 동시에 확정됩니다." },
  { t: "모바일키 도착", d: "도착 당일, 객실 번호와 모바일키가 휴대폰으로 먼저 옵니다." },
  { t: "셀프 체크인", d: "로비 키오스크나 휴대폰으로 1분. 프런트 앞에서 기다리지 않습니다." },
  { t: "스마트룸", d: "도착 전에 맞춰 둔 온도, 휴대폰으로 켜는 조명과 커튼." },
  { t: "자동 체크아웃", d: "퇴실 버튼 한 번이면 정산까지 끝. 영수증은 메일로 보내 드립니다." },
];

const MOODS = [
  { k: "맑은 날", list: [["오전", "병방치 스카이워크", "동강의 한반도 지형을 발밑으로 내려다보는 유리 전망대"], ["오후", "동강 래프팅", "여름이면 강 위에서 보내는 가장 시원한 두 시간"], ["저녁", "조양강 노을 산책", "호텔에서 걸어서 2분, 강물에 지는 해"]] },
  { k: "비 오는 날", list: [["오전", "화암동굴", "옛 금광 갱도와 석회 동굴을 잇는 동굴 탐방"], ["점심", "정선 아리랑시장", "곤드레밥과 콧등치기 국수, 메밀전병"], ["오후", "호텔 카페", "빗소리 들리는 창가에서 커피 한 잔"]] },
  { k: "가족과 함께", list: [["오전", "하이원 리조트", "계절마다 즐길 거리가 바뀌는 산 위의 리조트"], ["오후", "화암동굴", "아이들이 가장 좋아하는 정선 코스"], ["장날", "정선 5일장", "끝자리 2·7일에 열리는 강원도 대표 오일장"]] },
  { k: "산과 숲", list: [["가을", "민둥산 억새", "산 정상을 덮는 은빛 억새 물결"], ["아침", "도롱이 연못", "숲에 둘러싸인 고요한 생태 연못"], ["하루", "동강 전망 자연휴양림", "동강 굽이를 내려다보는 숲속 산책"]] },
];

export default function StaySite() {
  const today = new Date();
  const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const [inD, setInD] = useState(fmt(today));
  const [outD, setOutD] = useState(fmt(new Date(today.getTime() + 86400000)));
  const [guests, setGuests] = useState("2");
  const [sheet, setSheet] = useState(false);
  const [room, setRoom] = useState(0);
  const [mood, setMood] = useState(0);
  const [weather, setWeather] = useState<{ t: number; c: string } | null>(null);
  const [menu, setMenu] = useState(false);
  const [fab, setFab] = useState(false);
  useEffect(() => {
    const on = () => setFab(window.scrollY > 640);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=37.38&longitude=128.66&current=temperature_2m,weather_code&timezone=Asia%2FSeoul")
      .then((r) => r.json())
      .then((j) => { const c = j?.current; if (c) setWeather({ t: Math.round(c.temperature_2m), c: WMO[c.weather_code as number] ?? "" }); })
      .catch(() => {});
  }, []);

  const go = (id: string) => {
    setMenu(false);
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 56, behavior: "smooth" });
  };
  const nights = Math.max(1, Math.round((new Date(outD).getTime() - new Date(inD).getTime()) / 86400000) || 1);

  return (
    <div className="st">
      <div className="relative mx-auto w-full max-w-[480px]">
        {/* 시안 안내 띠 */}
        <div className="px-4 py-1.5 text-center text-[11px]" style={{ background: "var(--st-pine)", color: "#e9efe9" }}>홈페이지 디자인 시안 · 2027년 5월 개장 예정(안)</div>

        {/* 헤더 */}
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b px-4" style={{ background: "rgba(246,242,234,.94)", borderColor: "var(--st-line)", backdropFilter: "blur(8px)" }}>
          <button onClick={() => setMenu(true)} aria-label="메뉴" className="flex h-9 w-9 flex-col items-start justify-center gap-[5px]">
            <span className="h-[1.5px] w-6" style={{ background: "var(--st-ink)" }} /><span className="h-[1.5px] w-4" style={{ background: "var(--st-ink)" }} />
          </button>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex flex-col items-center leading-none">
            <svg width="26" height="12" viewBox="0 0 26 12" aria-hidden="true"><path d="M1 11 L8 3 L12 7.5 L16 2 L25 11" fill="none" stroke="#2f4a3e" strokeWidth="1.4" /></svg>
            <span className="st-en mt-1 text-[14px] font-semibold">JEONGSEON HOTEL</span>
          </button>
          <button onClick={() => setSheet(true)} className="px-3 py-1.5 text-[12px] font-bold" style={{ background: "var(--st-pine)", color: "#fff" }}>예약</button>
        </header>

        {/* 메뉴 */}
        <AnimatePresence>
          {menu && (
            <motion.div key="menu" className="fixed inset-y-0 left-0 z-50 w-full max-w-[480px]" style={{ background: "var(--st-paper)" }}
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.5, ease: EASE }}>
              <div className="flex h-14 items-center justify-between px-4">
                <span className="st-en text-[14px] font-semibold">MENU</span>
                <button onClick={() => setMenu(false)} className="text-[24px] leading-none" aria-label="닫기">×</button>
              </div>
              <nav className="px-6 pt-6">
                {[["about", "호텔 소개", "ABOUT"], ["rooms", "객실", "ROOMS"], ["smart", "스마트 스테이", "SMART STAY"], ["dining", "다이닝", "DINING"], ["explore", "정선 여행", "EXPLORE"], ["location", "오시는 길", "LOCATION"]].map(([id, ko, en], i) => (
                  <motion.button key={id} onClick={() => go(id)} className="flex w-full items-baseline justify-between border-b py-4 text-left" style={{ borderColor: "var(--st-line)" }}
                    initial={{ x: -30 }} animate={{ x: 0 }} transition={{ duration: 0.5, delay: 0.15 + i * 0.05, ease: EASE }}>
                    <span className="st-serif text-[20px] font-semibold">{ko}</span><span className="st-en text-[12px]" style={{ color: "var(--st-gold)" }}>{en}</span>
                  </motion.button>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 히어로 */}
        <section className="relative h-[78dvh] min-h-[520px] overflow-hidden">
          <video className="absolute inset-0 h-full w-full object-cover" src="/jeongseon/video/hero.mp4" poster="/jeongseon/video/hero-poster.webp" autoPlay muted loop playsInline preload="auto" aria-label="정선 관광호텔 영상 (AI 예시)" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(20,18,14,.1) 30%, rgba(20,18,14,.62) 100%)" }} />
          {weather && (
            <motion.div className="absolute left-4 top-4 flex items-center gap-2 px-3 py-1.5 text-[12px] font-semibold" style={{ background: "rgba(246,242,234,.88)" }}
              initial={{ y: -20 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
              <span>정선 지금</span><span style={{ color: "var(--st-pine)" }}>{weather.c} {weather.t}°</span>
            </motion.div>
          )}
          <div className="absolute inset-x-0 bottom-0 px-5 pb-8 text-white">
            <div className="st-en text-[13px]"><Lift>A RIVERSIDE STAY IN JEONGSEON</Lift></div>
            <h1 className="st-serif mt-2 text-[30px] font-semibold leading-[1.35]">
              <Lift delay={0.15}>강이 깨우는 아침,</Lift>
              <Lift delay={0.3}>산이 덮어 주는 밤</Lift>
            </h1>
          </div>
          <span className="absolute right-2 top-4 px-1.5 py-0.5 text-[9.5px]" style={{ background: "rgba(246,242,234,.85)", color: "var(--st-sub)" }}>AI 영상 · 예시</span>
        </section>

        {/* 예약 바 */}
        <div className="relative z-10 mx-4 -mt-5 border p-4 shadow-[0_10px_30px_rgba(40,30,10,.12)]" style={{ background: "#fff", borderColor: "var(--st-line)" }}>
          <div className="grid grid-cols-2 gap-3">
            <label className="border-b pb-2" style={{ borderColor: "var(--st-line)" }}>
              <div className="text-[10.5px]" style={{ color: "var(--st-sub)" }}>체크인</div>
              <input type="date" value={inD} min={fmt(today)} onChange={(e) => { setInD(e.target.value); if (e.target.value >= outD) setOutD(fmt(new Date(new Date(e.target.value).getTime() + 86400000))); }} />
            </label>
            <label className="border-b pb-2" style={{ borderColor: "var(--st-line)" }}>
              <div className="text-[10.5px]" style={{ color: "var(--st-sub)" }}>체크아웃</div>
              <input type="date" value={outD} min={inD} onChange={(e) => setOutD(e.target.value)} />
            </label>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <label className="flex-1 border-b pb-2" style={{ borderColor: "var(--st-line)" }}>
              <div className="text-[10.5px]" style={{ color: "var(--st-sub)" }}>인원</div>
              <select value={guests} onChange={(e) => setGuests(e.target.value)}>
                {["1", "2", "3"].map((g) => <option key={g} value={g}>성인 {g}명</option>)}
              </select>
            </label>
            <motion.button whileTap={{ scale: 0.96 }} onClick={() => setSheet(true)} className="px-5 py-3 text-[13.5px] font-bold" style={{ background: "var(--st-pine)", color: "#fff" }}>객실 확인</motion.button>
          </div>
        </div>

        {/* 소개 */}
        <section id="about" className="px-6 pt-16 pb-14">
          <Label en="About" ko="호텔 소개" />
          <h2 className="st-serif mt-4 text-[24px] font-semibold leading-[1.45]">
            <Lift>조양강까지 150m,</Lift><Lift delay={0.12}>서른한 개의 방</Lift>
          </h2>
          <Rise delay={0.15}>
            <p className="mt-4 text-[14.5px] leading-[1.9]" style={{ color: "var(--st-sub)" }}>
              평창에서 정선으로 들어서는 길목, 광하대교 옆. 아침이면 강에서 물안개가 오르고, 밤이면 산이 창을 가득 채웁니다.
              크지 않아서 조용하고, 필요한 것은 휴대폰 하나로 해결되는 호텔. 정선 여행의 하룻밤을 가볍게 만들어 드립니다.
            </p>
          </Rise>
          <div className="mt-8 grid grid-cols-5 gap-2">
            <Photo src={IMG("after-river")} alt="조양강 아침 산책" className="col-span-3 h-[260px]" />
            <div className="col-span-2 flex flex-col gap-2">
              <Photo src={IMG("after-night")} alt="저녁의 호텔 외관" className="h-[126px]" tag={false} />
              <Photo src={IMG("after1")} alt="새벽의 호텔 외관" className="h-[126px]" tag={false} />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 border-y py-4 text-center" style={{ borderColor: "var(--st-line)" }}>
            {[["31", "객실"], ["150m", "조양강"], ["24h", "셀프 체크인"]].map(([a, b]) => (
              <Rise key={b}><div className="st-en text-[24px] font-semibold" style={{ color: "var(--st-pine)" }}>{a}</div><div className="text-[11.5px]" style={{ color: "var(--st-sub)" }}>{b}</div></Rise>
            ))}
          </div>
        </section>

        {/* 객실 */}
        <section id="rooms" className="pt-14 pb-14" style={{ background: "var(--st-sand)" }}>
          <div className="px-6">
            <Label en="Rooms" ko="객실" />
            <h2 className="st-serif mt-4 text-[24px] font-semibold leading-[1.45]"><Lift>창밖은 정선의 산</Lift></h2>
            <div className="mt-6 flex gap-5 border-b" style={{ borderColor: "var(--st-line)" }}>
              {ROOMS.map((r, i) => (
                <button key={r.name} onClick={() => setRoom(i)} className="relative pb-2.5 text-[14px] font-semibold" style={{ color: room === i ? "var(--st-ink)" : "var(--st-sub)" }}>
                  {r.name}
                  {room === i && <motion.span layoutId="st-room" className="absolute inset-x-0 -bottom-px h-[2px]" style={{ background: "var(--st-pine)" }} />}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5 px-6">
            <div className="relative h-[380px] overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.img key={room} src={IMG(ROOMS[room].img)} alt={ROOMS[room].name} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: room ? "70% 50%" : "40% 50%" }}
                  initial={{ clipPath: "inset(0% 0% 0% 100%)", scale: 1.1 }} animate={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1 }} exit={{ clipPath: "inset(0% 100% 0% 0%)" }} transition={{ duration: 0.8, ease: EASE }} />
              </AnimatePresence>
              <span className="absolute right-2 bottom-2 z-10 px-1.5 py-0.5 text-[9.5px]" style={{ background: "rgba(246,242,234,.85)", color: "var(--st-sub)" }}>AI 이미지 · 예시</span>
            </div>
            <div className="bg-white p-5">
              <div className="st-en text-[12px]" style={{ color: "var(--st-gold)" }}>{ROOMS[room].en}</div>
              <div className="st-serif mt-1 text-[20px] font-semibold">{ROOMS[room].name}</div>
              <div className="mt-4 grid grid-cols-2 gap-y-2.5 text-[13px]">
                {[["객실 면적", "17.28㎡"], ["침대", ROOMS[room].bed], ["기준 인원", "2인"], ["체크인·아웃", "15:00 · 11:00 (안)"]].map(([a, b]) => (
                  <div key={a}><div className="text-[11px]" style={{ color: "var(--st-sub)" }}>{a}</div><div className="font-semibold">{b}</div></div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["모바일키", "스마트 조명·냉난방", "무료 Wi-Fi", "마운틴 뷰", "어메니티"].map((t) => (
                  <span key={t} className="border px-2 py-0.5 text-[11.5px]" style={{ borderColor: "var(--st-line)" }}>{t}</span>
                ))}
              </div>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => setSheet(true)} className="mt-5 w-full py-3 text-[13.5px] font-bold" style={{ background: "var(--st-ink)", color: "#fff" }}>이 객실 예약하기</motion.button>
            </div>
          </div>
        </section>

        {/* 스마트 스테이 */}
        <section id="smart" className="px-6 pt-16 pb-14">
          <Label en="Smart Stay" ko="스마트 스테이" />
          <h2 className="st-serif mt-4 text-[24px] font-semibold leading-[1.45]"><Lift>휴대폰 하나로</Lift><Lift delay={0.12}>예약부터 퇴실까지</Lift></h2>
          <Photo src={IMG("after-lobby")} alt="로비 셀프 체크인 키오스크" className="mt-6 h-[300px]" />
          <div className="relative mt-8 pl-8">
            <motion.div className="absolute left-[11px] top-1 bottom-1 w-px origin-top" style={{ background: "var(--st-gold)" }} initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 1.6, ease: EASE }} />
            {STEPS.map((s, i) => (
              <Rise key={s.t} delay={0.1 + i * 0.1} className="relative mb-6 last:mb-0">
                <span className="st-en absolute -left-8 top-0 flex h-[23px] w-[23px] items-center justify-center text-[12px] font-semibold" style={{ background: "var(--st-paper)", border: "1px solid var(--st-gold)", color: "var(--st-gold)" }}>{i + 1}</span>
                <div className="text-[15.5px] font-bold">{s.t}</div>
                <p className="mt-1 text-[13.5px] leading-[1.7]" style={{ color: "var(--st-sub)" }}>{s.d}</p>
              </Rise>
            ))}
          </div>
        </section>

        {/* 다이닝 */}
        <section id="dining" className="relative">
          <Photo src={IMG("after-cafe")} alt="지하 1층 카페·한식당" className="h-[440px]" />
          <div className="relative z-10 mx-5 -mt-16 bg-white p-6">
            <Label en="Dining" ko="다이닝" />
            <h2 className="st-serif mt-3 text-[21px] font-semibold leading-[1.45]">정선의 맛을 담은<br />카페 & 한식 다이닝</h2>
            <p className="mt-3 text-[13.5px] leading-[1.8]" style={{ color: "var(--st-sub)" }}>지하 1층. 아침에는 커피와 간단한 식사, 저녁에는 곤드레·산나물 같은 정선의 제철 재료로 차린 한 상. 연회장으로도 쓸 수 있어 가족 모임과 소규모 연수에 알맞습니다.</p>
          </div>
        </section>

        {/* 정선 여행 — AI 컨시어지 */}
        <section id="explore" className="px-6 pt-16 pb-14">
          <Label en="Explore Jeongseon" ko="정선 여행" />
          <h2 className="st-serif mt-4 text-[24px] font-semibold leading-[1.45]"><Lift>오늘의 정선,</Lift><Lift delay={0.12}>AI 컨시어지가 골라 드립니다</Lift></h2>
          <Rise delay={0.15}><p className="mt-3 text-[13.5px] leading-[1.8]" style={{ color: "var(--st-sub)" }}>실제 서비스에서는 날씨와 요일, 일행에 맞춰 코스를 자동으로 추천합니다. 아래에서 미리 골라 보세요.</p></Rise>
          <div className="st-noscroll mt-5 flex gap-2 overflow-x-auto">
            {MOODS.map((m, i) => (
              <button key={m.k} onClick={() => setMood(i)} className="relative shrink-0 border px-3.5 py-1.5 text-[13px] font-semibold" style={{ borderColor: mood === i ? "var(--st-pine)" : "var(--st-line)", color: mood === i ? "#fff" : "var(--st-ink)" }}>
                {mood === i && <motion.span layoutId="st-mood" className="absolute inset-0" style={{ background: "var(--st-pine)" }} transition={{ duration: 0.35, ease: EASE }} />}
                <span className="relative z-10">{m.k}</span>
              </button>
            ))}
          </div>
          <div className="relative mt-5 min-h-[250px] overflow-hidden border bg-white" style={{ borderColor: "var(--st-line)" }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={mood} className="p-5" initial={{ x: 40, clipPath: "inset(0% 0% 0% 100%)" }} animate={{ x: 0, clipPath: "inset(0% 0% 0% 0%)" }} exit={{ x: -40, clipPath: "inset(0% 100% 0% 0%)" }} transition={{ duration: 0.45, ease: EASE }}>
                <div className="mb-3 flex items-center gap-2 text-[12px] font-semibold" style={{ color: "var(--st-pine)" }}>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] text-white" style={{ background: "var(--st-pine)" }}>AI</span>
                  {MOODS[mood].k}에 어울리는 코스예요
                </div>
                {MOODS[mood].list.map(([when, name, d], i) => (
                  <div key={name} className="flex gap-3 border-t py-3" style={{ borderColor: i ? "var(--st-line)" : "transparent" }}>
                    <span className="st-en w-10 shrink-0 pt-0.5 text-[12.5px] font-semibold" style={{ color: "var(--st-gold)" }}>{when}</span>
                    <div><div className="text-[14.5px] font-bold">{name}</div><div className="mt-0.5 text-[12.5px] leading-[1.6]" style={{ color: "var(--st-sub)" }}>{d}</div></div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="st-noscroll -mx-6 mt-6 flex gap-2 overflow-x-auto px-6">
            {[["skywalk", "병방치 스카이워크"], ["hwaam", "화암동굴"], ["mindung", "민둥산"], ["high1", "하이원"], ["dorongi", "도롱이 연못"], ["donggang", "동강"]].map(([f, n]) => (
              <div key={f} className="w-[42%] shrink-0">
                <div className="h-[120px] overflow-hidden"><img src={IMG(f)} alt={n} className="h-full w-full object-cover" loading="lazy" /></div>
                <div className="mt-1.5 text-[12.5px] font-semibold">{n}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 오시는 길 */}
        <section id="location" className="px-6 pt-14 pb-14" style={{ background: "var(--st-sand)" }}>
          <Label en="Location" ko="오시는 길" />
          <h2 className="st-serif mt-4 text-[22px] font-semibold">정선읍 초입, 광하대교 옆</h2>
          <Photo src={IMG("map")} alt="위치도" className="mt-5 h-[200px]" tag={false} />
          <div className="mt-4 space-y-2 text-[13.5px]">
            <div className="flex gap-3"><span className="w-14 shrink-0" style={{ color: "var(--st-sub)" }}>주소</span><span>강원도 정선군 정선읍 용탄리 525</span></div>
            <div className="flex gap-3"><span className="w-14 shrink-0" style={{ color: "var(--st-sub)" }}>자동차</span><span>평창–정선 국도 42호선, 정선읍 들어서는 길목</span></div>
            <div className="flex gap-3"><span className="w-14 shrink-0" style={{ color: "var(--st-sub)" }}>주차</span><span>호텔 앞 주차장 (10대)</span></div>
          </div>
        </section>

        {/* 푸터 */}
        <footer className="px-6 pt-10 pb-24" style={{ background: "#1f2a24", color: "#d9e0da" }}>
          <div className="st-en text-[18px] font-semibold text-white">JEONGSEON HOTEL</div>
          <div className="mt-1 text-[12px]">정선 관광호텔 · 2027년 5월 개장 예정(안)</div>
          <p className="mt-5 text-[11px] leading-[1.7]" style={{ color: "#8fa198" }}>
            이 페이지는 개장 전 고객용 홈페이지 디자인 시안입니다. 사진과 영상 중 &lsquo;AI 예시&rsquo; 표시가 있는 것은 AI로 만든 리모델링 후 예시이며 실제와 다를 수 있습니다. 객실 구성·시간·서비스는 계획안입니다.
          </p>
          <a href="/jeongseon" className="mt-5 inline-block border-b text-[12px]" style={{ borderColor: "#5d6f66" }}>사업 개요 보기 →</a>
        </footer>

        {/* 떠 있는 예약 버튼 */}
        <motion.button onClick={() => setSheet(true)} className="fixed bottom-4 z-40 px-5 py-3 text-[13.5px] font-bold shadow-lg"
          style={{ right: "max(16px, calc(50vw - 240px + 16px))", background: "var(--st-pine)", color: "#fff" }}
          initial={{ y: 90 }} animate={{ y: fab && !sheet ? 0 : 90 }} transition={{ duration: 0.5, ease: EASE }} whileTap={{ scale: 0.95 }}>
          예약 문의
        </motion.button>

        {/* 예약 시트 */}
        <AnimatePresence>
          {sheet && (
            <>
              <div key="dim" className="fixed inset-0 z-50" style={{ background: "rgba(20,18,14,.45)" }} onClick={() => setSheet(false)} />
              <motion.div key="sheet" className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] bg-white px-6 pt-5 pb-8"
                initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.5, ease: EASE }} style={{ x: "-50%" }}>
                <div className="mx-auto mb-5 h-1 w-10 rounded-full" style={{ background: "var(--st-line)" }} />
                <div className="st-en text-[12px]" style={{ color: "var(--st-gold)" }}>RESERVATION</div>
                <div className="st-serif mt-1 text-[20px] font-semibold">개장 후 예약이 열립니다</div>
                <div className="mt-4 border p-4 text-[13.5px]" style={{ borderColor: "var(--st-line)" }}>
                  <div className="flex justify-between"><span style={{ color: "var(--st-sub)" }}>선택하신 일정</span><span className="font-semibold">{inD.slice(5).replace("-", ".")} – {outD.slice(5).replace("-", ".")} · {nights}박</span></div>
                  <div className="mt-1.5 flex justify-between"><span style={{ color: "var(--st-sub)" }}>인원</span><span className="font-semibold">성인 {guests}명</span></div>
                </div>
                <p className="mt-4 text-[13.5px] leading-[1.8]" style={{ color: "var(--st-sub)" }}>
                  정선 관광호텔은 <b style={{ color: "var(--st-ink)" }}>2027년 5월 개장 예정(안)</b>입니다. 개장 일정이 확정되면 이 화면에서 바로 예약하고, 결제와 동시에 모바일키를 받으실 수 있습니다.
                </p>
                <button onClick={() => setSheet(false)} className="mt-6 w-full py-3 text-[14px] font-bold" style={{ background: "var(--st-pine)", color: "#fff" }}>확인</button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
