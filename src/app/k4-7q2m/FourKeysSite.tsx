"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

/* 원칙: 투명도는 움직이지 않는다 (갤럭시 빈 화면 방지) — 위치·크기·회전·마스크만 움직인다 */
const EASE = [0.16, 1, 0.3, 1] as const;
const PIN = "1105";

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

function Head({ no, en, children, sub }: { no: string; en: string; children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="mb-7">
      <Rise>
        <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em]" style={{ color: "var(--fk-brass)" }}>
          <span>{no}</span>
          <motion.span className="h-px w-10 origin-left" style={{ background: "var(--fk-brass)" }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.2, ease: EASE }} />
          <span>{en}</span>
        </div>
      </Rise>
      <h2 className="fk-serif text-[26px] font-bold leading-[1.35]"><Lift>{children}</Lift></h2>
      {sub && <Rise delay={0.15}><p className="mt-3 text-[15px] leading-[1.8]" style={{ color: "var(--fk-sub)" }}>{sub}</p></Rise>}
    </div>
  );
}

/* 열쇠 그림 */
function KeyIcon({ size = 28, color = "#c9a45c" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="7.5" cy="12" r="4" /><path d="M11.5 12H21 M18 12v3 M15 12v2" />
    </svg>
  );
}

/* 나레이션 대본: 섹션 id 와 읽을 문장 */
const SCRIPT: [string, string][] = [
  ["top", "지주님, 안녕하십니까. 이 자료는 서부중앙시장 부지의 지분을 가지신 네 분께 드리는 설명자료입니다. 네 분의 열쇠가 모두 돌아가야 이 사업이 열립니다."],
  ["one", "먼저 한 줄로 말씀드리면, 땅을 파는 것도, 명의를 넘기는 것도 아닙니다. 등기부에 두 번째 순서로 담보 표시를 일정 기간 올려 두는 것입니다."],
  ["future", "이 땅은 전통시장 특별법에 따른 시장정비사업 부지로, 지하 4층, 지상 12층, 아파트 110세대와 상가를 짓는 사업시행계획 변경인가가 이미 나 있습니다."],
  ["ask", "부탁드리는 것은 시행사 측 지분 75퍼센트에 2순위 근저당 약 40억 원을 설정하는 것입니다. 돈을 빌리는 곳은 대양금속, 빌려주는 곳은 유안타증권이며, 재개발 본PF 때 먼저 갚고 지우는 조건으로 협의합니다."],
  ["order", "땅을 팔게 되면 돈을 받아 가는 순서가 있습니다. 1순위 120억 원, 이번 2순위 40억 원을 먼저 갚고, 남는 돈은 모두 지주님 몫입니다. 아래 막대를 움직여 직접 확인해 보실 수 있습니다."],
  ["safe", "계약서에는 여섯 가지 안전장치를 넣습니다. 한도를 숫자로 정하고, PF 때 먼저 갚고 지우며, 비용은 지주님께서 부담하지 않으십니다."],
  ["worst", "가장 나쁜 경우도 미리 말씀드립니다. 대양금속이 갚지 못하면 땅이 경매에 부쳐질 수 있습니다. 이것이 담보 제공의 가장 큰 위험이며, 그 경우에도 순서대로 나눈 뒤 남는 돈은 지주님께 돌아가고, 대신 갚아진 돈은 대양금속에 청구하실 수 있습니다."],
  ["know", "결정 전에 꼭 알아 두실 점이 있습니다. 대양금속은 지금 주식 거래가 정지된 상태이고, 네 분 모두 동의하셔야 진행할 수 있습니다. 이 내용은 공시 전 정보이므로 대양금속 주식 거래와 외부 공유를 삼가 주십시오."],
  ["do", "지주님께서 하실 일은 다섯 단계입니다. 설명을 듣고, 등기부를 확인하고, 동의서에 서명하시면 법무사가 등기를 하고, 상환 뒤에는 말소를 확인합니다. 등기가 끝난 것을 확인한 뒤에야 돈이 나갑니다."],
  ["end", "세 가지만 기억해 주십시오. 땅은 그대로 지주님 것입니다. 빚 표시는 지분 가치의 절반 수준입니다. 그리고 안전장치를 계약서에 넣습니다. 감사합니다."],
];

const NAV: [string, string][] = [["one", "한 줄 요약"], ["future", "이 땅의 미래"], ["ask", "부탁드리는 것"], ["order", "줄 서는 순서"], ["safe", "안전장치"], ["worst", "나쁜 경우"], ["know", "꼭 알아두실 점"], ["do", "하실 일"], ["faq", "질문"]];

const SAFE = [
  ["한도를 숫자로 못 박습니다", "근저당 금액(채권최고액)을 정해 그 이상은 책임지지 않게 합니다."],
  ["PF 때 먼저 갚고 지웁니다", "재개발 본PF가 실행되면 이 빚을 먼저 갚고 근저당을 말소합니다."],
  ["용도와 기간을 적습니다", "어떤 빚을 위해, 언제까지 담보로 쓰는지 계약서에 분명히 적습니다."],
  ["담보 제공의 대가를 정합니다", "지주님께 드릴 대가(담보 제공료 등)는 협의 후 기재합니다."],
  ["상황을 정기적으로 알려 드립니다", "대양금속의 이자 납부와 상환 상황을 정기적으로 통지합니다."],
  ["비용은 지주님 부담이 아닙니다", "설정·말소 비용(등록면허세, 법무사 비용)은 돈을 빌리는 쪽이 부담합니다."],
];

const FAQ = [
  ["땅을 팔거나 명의를 넘기나요?", "아닙니다. 소유권과 지분은 그대로이고, 등기부에 근저당 1건이 추가될 뿐입니다."],
  ["재개발 분양이나 조합원 권리에 영향이 있나요?", "사업과 조합원 권리는 그대로입니다. 다만 본PF 때 대주단이 담보 정리를 요구하므로, PF 실행 시 먼저 갚고 지우는 조건을 넣습니다."],
  ["제 돈이 들어가나요?", "아닙니다. 설정·말소 비용도 돈을 빌리는 쪽이 부담하도록 계약에 넣습니다."],
  ["세금이 나오나요?", "근저당 설정만으로 양도세가 생기지는 않습니다. 정확한 세무 사항은 세무사 확인을 받아 안내드리겠습니다."],
  ["언제 지워지나요?", "재개발 본PF가 실행되거나 대양금속이 빚을 다 갚으면 바로 말소합니다."],
  ["거절해도 되나요?", "물론입니다. 담보 제공은 지주님의 자유로운 결정이며, 강제되지 않습니다."],
];

const STEPS = [
  ["설명 듣기와 질문", "이 자료와 계약서 초안을 받아 보시고 궁금한 점을 확인합니다."],
  ["등기부와 지분 확인", "공유자 명단과 각자의 지분, 1순위 대출 내용을 함께 확인합니다."],
  ["동의서·담보제공계약 서명", "인감도장, 인감증명서, 신분증, 등기권리증(등기필증)을 준비합니다."],
  ["근저당 등기", "법무사가 등기소에 접수합니다. 등기가 끝난 것을 확인한 뒤에야 돈이 나갑니다."],
  ["상환 후 말소 확인", "PF 실행이나 상환이 끝나면 근저당이 지워졌는지 등기부로 확인합니다."],
];

const PREP = ["인감도장", "인감증명서 (본인 발급)", "신분증", "등기권리증 (등기필증)"];

/* 지분 가치 기준 세 가지 */
const BASES = [
  { k: "보수적", v: 270.6, d: "2023년 감정 초안 360.8억의 75%" },
  { k: "예상 하단", v: 300, d: "시행사 예상 400억의 75%" },
  { k: "예상 상단", v: 337.5, d: "시행사 예상 450억의 75%" },
];

export default function FourKeysSite() {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(0);
  const [keys, setKeys] = useState(0);
  const [open, setOpen] = useState(false);
  const [base, setBase] = useState(0);
  const [rate, setRate] = useState(70);
  const [faq, setFaq] = useState<number | null>(null);
  const [prep, setPrep] = useState<boolean[]>([false, false, false, false]);
  const [playing, setPlaying] = useState(false);
  const [line, setLine] = useState(-1);
  const playRef = useRef(false);

  useEffect(() => {
    try { if (sessionStorage.getItem("fk-ok") === "1") setUnlocked(true); } catch { /* 저장소 사용 불가 */ }
    return () => { try { window.speechSynthesis?.cancel(); } catch { /* 음성 미지원 */ } };
  }, []);

  const press = (d: string) => {
    const next = (pin + d).slice(0, 4);
    setPin(next);
    if (next.length === 4) {
      if (next === PIN) {
        setTimeout(() => { setUnlocked(true); try { sessionStorage.setItem("fk-ok", "1"); } catch { /* 저장소 사용 불가 */ } }, 250);
      } else {
        setShake((s) => s + 1);
        setTimeout(() => setPin(""), 450);
      }
    }
  };

  const turn = () => {
    if (keys < 4) {
      const n = keys + 1;
      setKeys(n);
      if (n === 4) setTimeout(() => setOpen(true), 900);
    }
  };

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 60, behavior: "smooth" });
  };

  /* 나레이션: 기기 음성으로 섹션을 차례로 읽으며 화면을 따라 내린다 */
  const speak = (i: number) => {
    const synth = typeof window !== "undefined" ? window.speechSynthesis : undefined;
    if (!synth || !playRef.current || i >= SCRIPT.length) { playRef.current = false; setPlaying(false); setLine(-1); return; }
    const [id, text] = SCRIPT[i];
    setLine(i);
    if (id === "top") window.scrollTo({ top: 0, behavior: "smooth" }); else go(id);
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ko-KR"; u.rate = 0.9; u.pitch = 1;
    const ko = synth.getVoices().filter((v) => v.lang.toLowerCase().replace("_", "-").startsWith("ko"));
    if (ko[0]) u.voice = ko[0];
    u.onend = () => setTimeout(() => speak(i + 1), 500);
    u.onerror = () => { playRef.current = false; setPlaying(false); setLine(-1); };
    synth.speak(u);
  };
  const toggleVoice = () => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    if (playing) { playRef.current = false; synth.cancel(); setPlaying(false); setLine(-1); return; }
    if (!open) { setKeys(4); setOpen(true); }
    playRef.current = true; setPlaying(true);
    synth.cancel();
    setTimeout(() => speak(0), 300);
  };

  /* 줄 서는 순서 계산 */
  const total = (BASES[base].v * rate) / 100;
  const s1 = Math.min(120, total);
  const s2 = Math.min(40, Math.max(0, total - 120));
  const mine = Math.max(0, total - 160);
  const full = 337.5;
  const ltv = (160 / BASES[base].v) * 100;

  /* ───────── 비밀번호 화면 ───────── */
  if (!unlocked) {
    return (
      <div className="fk">
        <div className="mx-auto flex min-h-[100dvh] w-full max-w-[480px] flex-col items-center justify-center px-6">
          <div className="fk-pulse flex h-16 w-16 items-center justify-center rounded-full border" style={{ borderColor: "var(--fk-brass)" }}><KeyIcon size={30} /></div>
          <div className="fk-serif mt-5 text-[24px] font-bold">네 개의 열쇠</div>
          <div className="mt-1.5 text-[13px]" style={{ color: "var(--fk-sub)" }}>지분 소유자 네 분께만 드리는 비공개 자료입니다</div>
          <motion.div key={shake} className="mt-8 flex gap-3" animate={shake ? { x: [0, -12, 12, -8, 8, 0] } : {}} transition={{ duration: 0.4 }}>
            {[0, 1, 2, 3].map((i) => (
              <motion.span key={i} className="h-3.5 w-3.5 rounded-full border" style={{ borderColor: "var(--fk-brass)" }} animate={{ backgroundColor: i < pin.length ? "#c9a45c" : "#0f0e0c", scale: i < pin.length ? 1.15 : 1 }} transition={{ duration: 0.2 }} />
            ))}
          </motion.div>
          <div className="mt-3 h-5 text-[12.5px]" style={{ color: "var(--fk-sub)" }}>안내받으신 네 자리 번호를 눌러 주세요</div>
          <div className="mt-5 grid w-full max-w-[290px] grid-cols-3 gap-3">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "←"].map((d, i) => d === "" ? <span key={i} /> : (
              <motion.button key={i} whileTap={{ scale: 0.9 }} onClick={() => (d === "←" ? setPin(pin.slice(0, -1)) : press(d))}
                className="fk-serif flex h-16 items-center justify-center rounded-full border text-[24px] font-bold" style={{ borderColor: "var(--fk-line)", background: "var(--fk-card)" }}>{d}</motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ───────── 본문 ───────── */
  return (
    <div className="fk" id="top">
      <div className="relative mx-auto w-full max-w-[480px]">
        {/* 상단 바 */}
        <header className="sticky top-0 z-40 border-b" style={{ background: "rgba(15,14,12,.93)", borderColor: "var(--fk-line)", backdropFilter: "blur(10px)" }}>
          <div className="flex h-[52px] items-center justify-between px-4">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2">
              <KeyIcon size={20} /><span className="fk-serif text-[16px] font-bold">네 개의 열쇠</span>
            </button>
            <span className="rounded-full border px-2 py-0.5 text-[10.5px]" style={{ borderColor: "var(--fk-wine)", color: "#e7a6ae" }}>비공개 · 협의용 초안</span>
          </div>
          <nav className="fk-noscroll flex gap-1.5 overflow-x-auto px-4 pb-2">
            {NAV.map(([id, l]) => (
              <button key={id} onClick={() => go(id)} className="shrink-0 rounded-full border px-3 py-1 text-[12.5px]" style={{ borderColor: "var(--fk-line)" }}>{l}</button>
            ))}
          </nav>
        </header>

        {/* 금고 */}
        <section className="relative overflow-hidden px-5 pt-10 pb-12" style={{ background: "radial-gradient(120% 70% at 50% 30%, #2a241b 0%, #0f0e0c 70%)" }}>
          <div className="text-center">
            <div className="text-[12px] font-semibold tracking-[0.25em]" style={{ color: "var(--fk-brass)" }}>서부중앙시장 부지 · 지분 소유자 네 분께</div>
            <h1 className="fk-serif mt-3 text-[30px] font-black leading-[1.3]">
              <Lift delay={0.1}>네 분의 열쇠가</Lift>
              <Lift delay={0.25}>모두 돌아가야</Lift>
              <Lift delay={0.4}><span style={{ color: "var(--fk-brass2)" }}>이 사업이 열립니다</span></Lift>
            </h1>
          </div>

          <div className="relative mx-auto mt-8 aspect-square w-full max-w-[320px]" style={{ perspective: 900 }}>
            {/* 금고 안쪽 (문이 열리면 보임) */}
            <div className="absolute inset-[6%] flex flex-col items-center justify-center rounded-full border text-center" style={{ borderColor: "var(--fk-brass)", background: "radial-gradient(circle, #3a2f1c 0%, #171512 75%)" }}>
              <div className="text-[12px] tracking-[0.2em]" style={{ color: "var(--fk-brass)" }}>INSIDE</div>
              <div className="fk-serif mt-2 text-[20px] font-bold leading-[1.4]">지하 4층 · 지상 12층<br />110세대와 상가</div>
              <div className="mt-2 text-[12.5px]" style={{ color: "var(--fk-sub)" }}>사업시행계획(변경)인가 완료</div>
              <button onClick={() => go("one")} className="mt-4 rounded-full px-4 py-1.5 text-[13px] font-bold" style={{ background: "var(--fk-brass)", color: "#0f0e0c" }}>설명 보기 ↓</button>
            </div>
            {/* 금고 문 */}
            <motion.div className="absolute inset-0 origin-left" initial={false} animate={{ rotateY: open ? -112 : 0 }} transition={{ duration: 1.6, ease: EASE }} style={{ transformStyle: "preserve-3d" }}>
              <svg viewBox="0 0 320 320" className="h-full w-full" aria-hidden="true">
                <defs>
                  <radialGradient id="fkDoor" cx="40%" cy="35%" r="75%"><stop offset="0%" stopColor="#4a4033" /><stop offset="60%" stopColor="#2a251e" /><stop offset="100%" stopColor="#15130f" /></radialGradient>
                </defs>
                <circle cx="160" cy="160" r="156" fill="url(#fkDoor)" stroke="#c9a45c" strokeWidth="3" />
                <circle cx="160" cy="160" r="128" fill="none" stroke="#5a4d38" strokeWidth="1.5" strokeDasharray="3 6" />
                {/* 네 개의 빛 고리 */}
                {[0, 1, 2, 3].map((i) => {
                  const a0 = -90 + i * 90 + 6, a1 = a0 + 78;
                  const r = 142, rad = (d: number) => (d * Math.PI) / 180;
                  const p = `M ${160 + r * Math.cos(rad(a0))} ${160 + r * Math.sin(rad(a0))} A ${r} ${r} 0 0 1 ${160 + r * Math.cos(rad(a1))} ${160 + r * Math.sin(rad(a1))}`;
                  return <motion.path key={i} d={p} fill="none" stroke="#e6cc8f" strokeWidth="6" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: keys > i ? 1 : 0 }} transition={{ duration: 0.8, ease: EASE }} />;
                })}
                {/* 가운데 손잡이 */}
                <motion.g animate={{ rotate: keys * 90 }} transition={{ duration: 0.8, ease: EASE }} style={{ transformOrigin: "160px 160px" }}>
                  <circle cx="160" cy="160" r="34" fill="#1b1814" stroke="#c9a45c" strokeWidth="2.5" />
                  {[0, 60, 120, 180, 240, 300].map((d) => <line key={d} x1="160" y1="160" x2={160 + 58 * Math.cos((d * Math.PI) / 180)} y2={160 + 58 * Math.sin((d * Math.PI) / 180)} stroke="#c9a45c" strokeWidth="5" strokeLinecap="round" />)}
                  <circle cx="160" cy="160" r="12" fill="#c9a45c" />
                </motion.g>
                {/* 열쇠 구멍 네 개 */}
                {[[160, 62], [258, 160], [160, 258], [62, 160]].map(([x, y], i) => (
                  <g key={i}>
                    <circle cx={x} cy={y} r="17" fill="#0f0e0c" stroke={keys > i ? "#e6cc8f" : "#5a4d38"} strokeWidth="2" />
                    <motion.g animate={{ rotate: keys > i ? 90 : 0 }} transition={{ duration: 0.6, ease: EASE }} style={{ transformOrigin: `${x}px ${y}px` }}>
                      <circle cx={x} cy={y - 4} r="4" fill={keys > i ? "#e6cc8f" : "#6b5d45"} />
                      <rect x={x - 2} y={y - 2} width="4" height="10" fill={keys > i ? "#e6cc8f" : "#6b5d45"} />
                    </motion.g>
                  </g>
                ))}
              </svg>
            </motion.div>
          </div>

          <div className="mt-6 flex flex-col items-center">
            {!open ? (
              <>
                <motion.button whileTap={{ scale: 0.94 }} onClick={turn} className="fk-pulse flex items-center gap-2 rounded-full px-6 py-3.5 text-[16px] font-bold" style={{ background: "var(--fk-brass)", color: "#0f0e0c" }}>
                  <KeyIcon size={22} color="#0f0e0c" /> {keys === 0 ? "첫 번째 열쇠 돌리기" : keys === 1 ? "두 번째 열쇠" : keys === 2 ? "세 번째 열쇠" : "마지막 열쇠"}
                </motion.button>
                <div className="mt-3 flex gap-2">
                  {[0, 1, 2, 3].map((i) => <motion.span key={i} animate={{ scale: keys > i ? 1.1 : 1 }}><KeyIcon size={22} color={keys > i ? "#e6cc8f" : "#5a4d38"} /></motion.span>)}
                </div>
              </>
            ) : (
              <div className="text-center text-[14px] leading-[1.7]" style={{ color: "var(--fk-sub)" }}>네 개의 열쇠가 모두 돌아갔습니다.<br />아래에서 하나씩 설명드리겠습니다.</div>
            )}
          </div>
        </section>

        {/* 01 한 줄 요약 */}
        <section id="one" className="px-5 pt-14 pb-12" style={{ background: "var(--fk-deep)" }}>
          <Head no="01" en="IN ONE LINE">땅을 파는 것도,<br />명의를 넘기는 것도 아닙니다</Head>
          <Rise>
            <div className="rounded-2xl border p-5" style={{ borderColor: "var(--fk-brass)", background: "var(--fk-card)" }}>
              <p className="text-[16px] leading-[1.85]">등기부에 <b style={{ color: "var(--fk-brass2)" }}>두 번째 순서로 &lsquo;담보 표시&rsquo;</b>를 일정 기간 올려 두는 것입니다.</p>
              <p className="mt-3 text-[13.5px] leading-[1.7]" style={{ color: "var(--fk-sub)" }}>법률 용어로 &lsquo;2순위 근저당 설정&rsquo;이라고 합니다. 소유권과 재개발 사업은 그대로 유지됩니다.</p>
            </div>
          </Rise>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <Rise><div className="h-full rounded-2xl border p-4" style={{ borderColor: "rgba(143,191,154,.5)" }}>
              <div className="text-[13px] font-bold" style={{ color: "var(--fk-green)" }}>그대로</div>
              <ul className="mt-2 space-y-1.5 text-[13px] leading-[1.55]">{["땅의 소유권과 지분", "재개발 사업과 조합원 권리", "기존 1순위 대출 조건", "땅의 사용과 사업 일정"].map((t) => <li key={t}>· {t}</li>)}</ul>
            </div></Rise>
            <Rise delay={0.08}><div className="h-full rounded-2xl border p-4" style={{ borderColor: "rgba(180,80,94,.6)" }}>
              <div className="text-[13px] font-bold" style={{ color: "#e7a6ae" }}>바뀌는 것</div>
              <ul className="mt-2 space-y-1.5 text-[13px] leading-[1.55]">{["등기부 을구에 2순위 근저당 1건 추가", "설정 기간 동안 매각·추가 담보 시 근저당 권리자와 협의"].map((t) => <li key={t}>· {t}</li>)}</ul>
            </div></Rise>
          </div>
        </section>

        {/* 02 이 땅의 미래 */}
        <section id="future" className="px-5 pt-14 pb-12">
          <Head no="02" en="THE FUTURE OF THIS LAND" sub="전통시장 특별법에 따른 시장정비사업 부지라 일반 주거지보다 높게 지을 수 있습니다.">이 땅이<br />품고 있는 것</Head>
          <Skyline />
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            {[["최대 약", "450%", "용적률"], ["지상", "12층", "지하 4층"], ["아파트", "110세대", "+ 상가"]].map(([a, b, c], i) => (
              <Rise key={c} delay={i * 0.06}><div className="rounded-xl border px-1 py-3" style={{ borderColor: "var(--fk-line)", background: "var(--fk-card)" }}>
                <div className="text-[11px]" style={{ color: "var(--fk-sub)" }}>{a}</div>
                <div className="fk-serif text-[20px] font-bold" style={{ color: "var(--fk-brass2)" }}>{b}</div>
                <div className="text-[11px]" style={{ color: "var(--fk-sub)" }}>{c}</div>
              </div></Rise>
            ))}
          </div>
          <Rise><div className="mt-4 rounded-2xl border p-4 text-[13.5px] leading-[1.75]" style={{ borderColor: "var(--fk-line)" }}>
            <div className="flex justify-between"><span style={{ color: "var(--fk-sub)" }}>인허가</span><span className="font-semibold">사업시행계획(변경)인가 · 2022.12 고시</span></div>
            <div className="mt-1 flex justify-between"><span style={{ color: "var(--fk-sub)" }}>사업 주체</span><span className="font-semibold">조합 + ㈜공명 공동사업시행</span></div>
            <div className="mt-1 flex justify-between"><span style={{ color: "var(--fk-sub)" }}>예상 시장가치</span><span className="font-semibold">전체 400~450억 원 이상</span></div>
            <p className="mt-2 text-[11.5px]" style={{ color: "var(--fk-sub)" }}>시장가치는 시행사 측 예상치입니다. 2023년 감정 초안은 360.8억 원이었고, 정식 숫자는 새 감정평가로 확정합니다.</p>
          </div></Rise>
        </section>

        {/* 03 부탁드리는 것 */}
        <section id="ask" className="px-5 pt-14 pb-12" style={{ background: "var(--fk-deep)" }}>
          <Head no="03" en="WHAT WE ASK">무엇을, 누구에게,<br />얼마나</Head>
          <div className="space-y-2.5">
            {[
              ["대상 토지", "북가좌동 338-19 중 시행사 측 지분 75%", "전체 약 766평 중 약 570평 · 소유자 네 분"],
              ["방식 · 규모", "2순위 근저당 약 40억 원", "기존 1순위(약 120억 원) 뒤 두 번째 순서"],
              ["돈을 빌리는 회사", "대양금속㈜", "KOSPI 상장 · 스테인리스 강판 제조"],
              ["돈을 빌려주는 곳", "유안타증권", "근저당의 권리자가 됩니다"],
              ["기간", "재개발 본PF 실행 때까지 (예정)", "PF가 실행되면 먼저 갚고 지우는 조건으로 협의"],
            ].map(([k, v, d], i) => (
              <motion.div key={k} className="flex gap-3 rounded-2xl border p-4" style={{ borderColor: "var(--fk-line)", background: "var(--fk-card)" }}
                initial={{ x: i % 2 ? 30 : -30 }} whileInView={{ x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}>
                <span className="fk-serif w-6 shrink-0 text-[18px] font-bold" style={{ color: "var(--fk-brass)" }}>{i + 1}</span>
                <div>
                  <div className="text-[12px]" style={{ color: "var(--fk-sub)" }}>{k}</div>
                  <div className="text-[16px] font-bold">{v}</div>
                  <div className="mt-0.5 text-[12.5px]" style={{ color: "var(--fk-sub)" }}>{d}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 04 줄 서는 순서 — 직접 움직여 보는 계산기 */}
        <section id="order" className="px-5 pt-14 pb-12">
          <Head no="04" en="WHO GETS PAID FIRST" sub="땅을 팔게 되면 돈을 받아 가는 순서가 있습니다. 1번이 먼저, 2번이 그다음, 남는 돈은 모두 지주님 몫입니다.">줄 서는 순서,<br />직접 움직여 보세요</Head>
          <div className="mb-3 flex rounded-full border p-1" style={{ borderColor: "var(--fk-line)" }}>
            {BASES.map((b, i) => (
              <button key={b.k} onClick={() => setBase(i)} className="relative flex-1 rounded-full py-2 text-[13px] font-bold">
                {base === i && <motion.span layoutId="fk-base" className="absolute inset-0 rounded-full" style={{ background: "var(--fk-brass)" }} transition={{ duration: 0.35, ease: EASE }} />}
                <span className="relative z-10" style={{ color: base === i ? "#0f0e0c" : "var(--fk-sub)" }}>{b.k}</span>
              </button>
            ))}
          </div>
          <div className="text-center text-[12px]" style={{ color: "var(--fk-sub)" }}>지분 가치 <b style={{ color: "var(--fk-cream)" }}>{BASES[base].v.toFixed(1)}억 원</b> · {BASES[base].d}</div>

          <div className="mt-6 rounded-2xl border p-5" style={{ borderColor: "var(--fk-line)", background: "var(--fk-card)" }}>
            <div className="flex items-baseline justify-between">
              <span className="text-[13.5px] font-semibold">경매에서 팔린 값</span>
              <span className="fk-serif text-[22px] font-bold" style={{ color: "var(--fk-brass2)" }}>{total.toFixed(1)}억 <span className="text-[13px]" style={{ color: "var(--fk-sub)" }}>({rate}%)</span></span>
            </div>
            <input type="range" min={40} max={100} step={5} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="mt-4" aria-label="경매 낙찰가율" />
            <div className="mt-1 flex justify-between text-[11px]" style={{ color: "var(--fk-sub)" }}><span>40% (아주 나쁜 경우)</span><span>100%</span></div>

            {/* 막대 */}
            <div className="mt-6 flex h-12 overflow-hidden rounded-lg" style={{ background: "#0f0e0c" }}>
              <motion.div className="flex items-center justify-center text-[11px] font-bold" style={{ background: "#6b5d45" }} animate={{ width: `${(s1 / full) * 100}%` }} transition={{ duration: 0.5, ease: EASE }}>{s1 > 25 ? "1순위" : ""}</motion.div>
              <motion.div className="flex items-center justify-center text-[11px] font-bold" style={{ background: "#b4505e" }} animate={{ width: `${(s2 / full) * 100}%` }} transition={{ duration: 0.5, ease: EASE }}>{s2 > 18 ? "2순위" : ""}</motion.div>
              <motion.div className="flex items-center justify-center text-[11px] font-bold" style={{ background: "#8fbf9a", color: "#0f0e0c" }} animate={{ width: `${(mine / full) * 100}%` }} transition={{ duration: 0.5, ease: EASE }}>{mine > 70 ? "지주님 몫" : ""}</motion.div>
            </div>
            <div className="mt-4 space-y-2 text-[14px]">
              <div className="flex justify-between"><span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm" style={{ background: "#6b5d45" }} />1순위 (기존 대출)</span><b>{s1.toFixed(1)}억</b></div>
              <div className="flex justify-between"><span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm" style={{ background: "#b4505e" }} />2순위 (이번 근저당)</span><b>{s2.toFixed(1)}억</b></div>
              <div className="flex justify-between border-t pt-2" style={{ borderColor: "var(--fk-line)" }}><span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm" style={{ background: "#8fbf9a" }} />지주님 몫으로 남는 돈</span><b className="fk-serif text-[20px]" style={{ color: "var(--fk-green)" }}>{mine.toFixed(1)}억</b></div>
            </div>
            {total < 160 && <p className="mt-3 text-[12px] leading-[1.6]" style={{ color: "#e7a6ae" }}>이 경우 2순위가 다 갚아지지 않고, 지주님 몫은 남지 않습니다. 그래서 새 감정평가와 담보 비율 확인이 중요합니다.</p>}
          </div>
          <Rise><div className="mt-4 rounded-2xl p-4 text-center" style={{ background: "#211d16" }}>
            <div className="text-[12.5px]" style={{ color: "var(--fk-sub)" }}>빚 표시(1순위 120억 + 이번 40억)는 지분 가치의</div>
            <div className="fk-serif mt-1 text-[30px] font-black" style={{ color: "var(--fk-brass2)" }}>{ltv.toFixed(0)}%</div>
            <div className="text-[12px]" style={{ color: "var(--fk-sub)" }}>{BASES[base].k} 기준 · 기준을 바꾸면 달라집니다</div>
          </div></Rise>
          <p className="mt-3 text-[11.5px] leading-[1.6]" style={{ color: "var(--fk-sub)" }}>1순위 대출도 이 지분에 설정되어 있다고 가정한 계산입니다. 실제 숫자는 새 감정평가로 확정합니다.</p>
        </section>

        {/* 05 안전장치 */}
        <section id="safe" className="px-5 pt-14 pb-12" style={{ background: "var(--fk-deep)" }}>
          <Head no="05" en="SAFEGUARDS">계약서에 넣을<br />여섯 가지 조건</Head>
          <div className="grid grid-cols-2 gap-2.5">
            {SAFE.map(([h, d], i) => (
              <Rise key={h} delay={(i % 2) * 0.06}><div className="h-full rounded-2xl border p-4" style={{ borderColor: "var(--fk-line)", background: "var(--fk-card)" }}>
                <div className="flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold" style={{ background: "var(--fk-brass)", color: "#0f0e0c" }}>{i + 1}</div>
                <div className="mt-2.5 text-[14.5px] font-bold leading-[1.4]">{h}</div>
                <p className="mt-1.5 text-[12.5px] leading-[1.6]" style={{ color: "var(--fk-sub)" }}>{d}</p>
              </div></Rise>
            ))}
          </div>
        </section>

        {/* 06 가장 나쁜 경우 */}
        <section id="worst" className="px-5 pt-14 pb-12">
          <Head no="06" en="THE WORST CASE" sub="담보를 제공하시기 전에 가장 나쁜 경우를 정확히 알고 계셔야 합니다.">가장 나쁜 경우도<br />미리 보여 드립니다</Head>
          <div className="relative pl-9">
            <motion.div className="absolute left-[13px] top-1 bottom-1 w-[2px] origin-top" style={{ background: "linear-gradient(#c9a45c, #b4505e)" }} initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 1.6, ease: EASE }} />
            {[
              ["먼저 대양금속에 청구합니다", "유안타증권은 돈을 빌린 대양금속에 먼저 상환을 요구합니다."],
              ["그래도 안 되면 경매에 부칠 수 있습니다", "근저당 권리자는 법원 경매를 신청할 수 있습니다. 이것이 담보 제공의 가장 큰 위험입니다."],
              ["경매 대금은 순서대로 나뉩니다", "1순위 120억, 2순위 40억을 먼저 갚고 남는 돈은 지주님께 돌아갑니다."],
              ["대신 갚아진 돈은 돌려받을 권리가 있습니다", "지주님 땅으로 대양금속 빚이 갚아지면, 그 금액을 대양금속에 청구할 수 있습니다(민법상 구상권)."],
            ].map(([h, d], i) => (
              <Rise key={h} delay={0.1 + i * 0.1} className="relative mb-6 last:mb-0">
                <span className="absolute -left-9 top-0 flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold" style={{ background: i === 1 ? "var(--fk-wine)" : "var(--fk-brass)", color: i === 1 ? "#fff" : "#0f0e0c" }}>{i + 1}</span>
                <div className="text-[16px] font-bold">{h}</div>
                <p className="mt-1 text-[14px] leading-[1.7]" style={{ color: "var(--fk-sub)" }}>{d}</p>
              </Rise>
            ))}
          </div>
          <Rise><div className="mt-6 rounded-2xl border p-4" style={{ borderColor: "var(--fk-line)", background: "var(--fk-card)" }}>
            <div className="text-[12.5px]" style={{ color: "var(--fk-sub)" }}>계산 예시 (가정) · 지분 가치의 70%에 팔릴 때</div>
            <div className="mt-2 grid grid-cols-2 gap-3 text-center">
              <div><div className="text-[11.5px]" style={{ color: "var(--fk-sub)" }}>예상 하단 기준</div><div className="fk-serif text-[24px] font-bold" style={{ color: "var(--fk-green)" }}>약 50억</div></div>
              <div><div className="text-[11.5px]" style={{ color: "var(--fk-sub)" }}>보수적 기준</div><div className="fk-serif text-[24px] font-bold" style={{ color: "var(--fk-green)" }}>약 29.4억</div></div>
            </div>
            <p className="mt-2 text-center text-[12px]" style={{ color: "var(--fk-sub)" }}>160억 원을 갚고 지주님 몫으로 남는 돈</p>
          </div></Rise>
        </section>

        {/* 07 꼭 알아두실 점 */}
        <section id="know" className="px-5 pt-14 pb-12" style={{ background: "var(--fk-deep)" }}>
          <Head no="07" en="BEFORE YOU DECIDE">결정 전에<br />알고 계셔야 할 것</Head>
          <div className="space-y-2.5">
            {[
              ["대양금속은 지금 주식 거래가 정지된 상태입니다", "거래소 심사가 진행 중입니다. 상환 능력은 유안타증권의 심사 결과로 함께 확인합니다."],
              ["지분 소유자 네 분 모두 동의해야 합니다", "시행사 측 지분 75%를 가진 네 분 중 한 분이라도 동의하지 않으시면 진행할 수 없습니다."],
              ["재개발 일정이 늦어지면 기간도 늘어납니다", "근저당은 PF 실행 때 지우는 조건이라, 사업 일정에 따라 설정 기간이 달라집니다."],
              ["숫자는 새 감정 후 다시 확인합니다", "이 자료의 금액은 2023년 감정 초안과 시행사 측 예상치를 함께 쓴 것입니다."],
            ].map(([h, d]) => (
              <Rise key={h}><div className="rounded-2xl border p-4" style={{ borderColor: "var(--fk-line)" }}>
                <div className="text-[15px] font-bold">{h}</div>
                <p className="mt-1 text-[13.5px] leading-[1.65]" style={{ color: "var(--fk-sub)" }}>{d}</p>
              </div></Rise>
            ))}
            <Rise><div className="rounded-2xl border p-4" style={{ borderColor: "var(--fk-wine)", background: "rgba(180,80,94,.1)" }}>
              <div className="text-[15px] font-bold" style={{ color: "#e7a6ae" }}>공시 전 비공개 정보입니다</div>
              <p className="mt-1 text-[13.5px] leading-[1.65]">상장회사의 자금조달 계획은 공시 전까지 미공개 정보입니다. 공시 전까지 대양금속 주식 거래와 이 자료의 외부 공유를 삼가 주십시오. 네 분과 관계자 모두를 보호하기 위한 안내입니다.</p>
            </div></Rise>
          </div>
        </section>

        {/* 08 하실 일 */}
        <section id="do" className="px-5 pt-14 pb-12">
          <Head no="08" en="WHAT YOU DO">다섯 단계면<br />끝납니다</Head>
          <div className="space-y-2">
            {STEPS.map(([h, d], i) => (
              <motion.div key={h} className="flex gap-3 rounded-2xl border p-4" style={{ borderColor: i === 3 ? "var(--fk-brass)" : "var(--fk-line)", background: "var(--fk-card)" }}
                initial={{ x: -30 }} whileInView={{ x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}>
                <span className="fk-serif shrink-0 text-[13px] font-bold" style={{ color: "var(--fk-brass)" }}>{i + 1}단계</span>
                <div><div className="text-[15px] font-bold">{h}</div><p className="mt-0.5 text-[13px] leading-[1.6]" style={{ color: "var(--fk-sub)" }}>{d}</p></div>
              </motion.div>
            ))}
          </div>
          <Rise><div className="mt-6 rounded-2xl border p-4" style={{ borderColor: "var(--fk-brass)" }}>
            <div className="text-[14px] font-bold">서명하실 때 준비물 <span className="text-[12px] font-normal" style={{ color: "var(--fk-sub)" }}>· 눌러서 표시해 보세요</span></div>
            <div className="mt-3 grid gap-2">
              {PREP.map((p, i) => (
                <button key={p} onClick={() => setPrep(prep.map((v, k) => (k === i ? !v : v)))} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[14.5px]" style={{ background: "#0f0e0c" }}>
                  <motion.span className="flex h-6 w-6 items-center justify-center rounded-md border text-[14px] font-bold" style={{ borderColor: "var(--fk-brass)" }} animate={{ backgroundColor: prep[i] ? "#c9a45c" : "#0f0e0c", color: prep[i] ? "#0f0e0c" : "#0f0e0c" }}>✓</motion.span>
                  <span style={{ textDecoration: prep[i] ? "line-through" : "none", color: prep[i] ? "var(--fk-sub)" : "var(--fk-cream)" }}>{p}</span>
                </button>
              ))}
            </div>
          </div></Rise>
        </section>

        {/* 09 질문 */}
        <section id="faq" className="px-5 pt-14 pb-12" style={{ background: "var(--fk-deep)" }}>
          <Head no="09" en="QUESTIONS">눌러서<br />답을 보세요</Head>
          <div className="space-y-2">
            {FAQ.map(([q, a], i) => (
              <div key={q} className="overflow-hidden rounded-2xl border" style={{ borderColor: faq === i ? "var(--fk-brass)" : "var(--fk-line)", background: "var(--fk-card)" }}>
                <button onClick={() => setFaq(faq === i ? null : i)} className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-[15px] font-bold">
                  {q}<motion.span animate={{ rotate: faq === i ? 45 : 0 }} className="text-[22px] leading-none" style={{ color: "var(--fk-brass)" }}>+</motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {faq === i && (
                    <motion.div key="a" initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.35, ease: EASE }} className="overflow-hidden">
                      <p className="px-4 pb-4 text-[14px] leading-[1.7]" style={{ color: "var(--fk-sub)" }}>{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* 정리 */}
        <section id="end" className="px-5 pt-14 pb-28">
          <Head no="10" en="REMEMBER">세 가지만<br />기억해 주세요</Head>
          {[["땅은 그대로 지주님 것입니다", "등기부에 2순위 담보 표시만 일정 기간 올라갑니다."], ["빚 표시는 지분 가치의 47~59%입니다", "1순위 120억과 이번 40억을 합친 160억 원 기준입니다."], ["안전장치를 계약서에 넣습니다", "한도, PF 때 우선 상환과 말소, 대가, 정기 통지, 비용 부담을 문서로 정합니다."]].map(([h, d], i) => (
            <Rise key={h} delay={i * 0.08}><div className="mb-2.5 flex gap-3 rounded-2xl border p-4" style={{ borderColor: "var(--fk-line)", background: "var(--fk-card)" }}>
              <KeyIcon size={26} color="#e6cc8f" />
              <div><div className="text-[15.5px] font-bold">{h}</div><p className="mt-0.5 text-[13px]" style={{ color: "var(--fk-sub)" }}>{d}</p></div>
            </div></Rise>
          ))}
          <p className="mt-8 text-[11px] leading-[1.7]" style={{ color: "#7d7565" }}>
            이 자료는 이해를 돕기 위한 협의용 초안이며 법률·세무 자문이 아닙니다. 실제 조건은 새 감정평가와 유안타증권 심사, 법률 검토를 거쳐 계약서로 확정됩니다. 자료: 서부중앙시장 감정평가서(초안, 2023.03), 서울서부중앙시장 재개발 사업계획서(2025.02), 시행사 측 설명(2026.11).
          </p>
        </section>

        {/* 나레이션 버튼 */}
        <div className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[480px] px-4 pb-4">
          <AnimatePresence>
            {playing && line >= 0 && (
              <motion.div key="cap" className="mb-2 rounded-xl border px-3 py-2 text-[12.5px] leading-[1.55]" style={{ background: "rgba(15,14,12,.95)", borderColor: "var(--fk-line)" }}
                initial={{ y: 30 }} animate={{ y: 0 }} exit={{ y: 120 }} transition={{ duration: 0.4, ease: EASE }}>
                {SCRIPT[line][1]}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button whileTap={{ scale: 0.97 }} onClick={toggleVoice} className="flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-bold shadow-xl" style={{ background: playing ? "var(--fk-wine)" : "var(--fk-brass)", color: playing ? "#fff" : "#0f0e0c" }}>
            {playing ? "■  읽기 멈춤" : "▶  처음부터 읽어 드릴게요"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

/* 땅 위로 건물이 솟아오르는 그림 (지하 4층 · 지상 12층) */
function Skyline() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-60px" });
  const floors = 12;
  return (
    <div ref={ref} className="relative overflow-hidden rounded-2xl border" style={{ borderColor: "var(--fk-line)", background: "linear-gradient(180deg, #1c1813 0%, #0f0e0c 100%)" }}>
      <svg viewBox="0 0 340 260" className="block w-full" aria-label="지하 4층 지상 12층 건물 그림">
        {/* 땅 */}
        <rect x="0" y="200" width="340" height="60" fill="#211c15" />
        <line x1="0" y1="200" x2="340" y2="200" stroke="#c9a45c" strokeWidth="1.5" />
        {/* 지하 4층 */}
        {[0, 1, 2, 3].map((i) => (
          <motion.rect key={`b${i}`} x="70" y={203 + i * 13} width="200" height="11" fill="#2e271d" stroke="#5a4d38" strokeWidth="1"
            initial={{ scaleX: 0 }} animate={{ scaleX: seen ? 1 : 0 }} transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: EASE }} style={{ transformOrigin: "170px 0px" }} />
        ))}
        {/* 지금의 시장 (낮은 건물) */}
        <motion.rect x="90" y="180" width="160" height="20" fill="#4a4033" initial={{ scaleY: 1 }} animate={{ scaleY: seen ? 0 : 1 }} transition={{ duration: 0.6, delay: 0.5 }} style={{ transformOrigin: "0px 200px" }} />
        {/* 지상 12층이 한 층씩 */}
        {Array.from({ length: floors }).map((_, i) => (
          <motion.g key={i} initial={{ y: 40, scaleY: 0 }} animate={{ y: seen ? 0 : 40, scaleY: seen ? 1 : 0 }} transition={{ duration: 0.45, delay: 0.9 + i * 0.12, ease: EASE }} style={{ transformOrigin: `170px ${200 - i * 14}px` }}>
            <rect x={i < 2 ? 70 : 110} y={186 - i * 14} width={i < 2 ? 200 : 120} height="13" fill={i < 2 ? "#6b5d45" : "#3a3125"} stroke="#c9a45c" strokeWidth="0.8" />
            {i >= 2 && [0, 1, 2, 3, 4, 5].map((w) => <rect key={w} x={118 + w * 19} y={189 - i * 14} width="9" height="6" fill={(i + w) % 3 === 0 ? "#e6cc8f" : "#5a4d38"} />)}
          </motion.g>
        ))}
        <text x="282" y="196" fill="#a59d8c" fontSize="10">상가</text>
        <text x="236" y="90" fill="#a59d8c" fontSize="10">아파트 110세대</text>
        <text x="282" y="236" fill="#a59d8c" fontSize="10">지하 4층</text>
      </svg>
      <div className="absolute left-3 top-3 rounded-full px-2 py-0.5 text-[10.5px]" style={{ background: "rgba(15,14,12,.8)", color: "var(--fk-brass)" }}>인가 내용을 단순화한 그림</div>
    </div>
  );
}
