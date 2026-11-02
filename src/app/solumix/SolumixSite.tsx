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

function Label({ en, kr }: { en: string; kr: string }) {
  return (
    <div className="mb-6">
      <p className="text-[11px] font-semibold tracking-[0.32em] text-[var(--sx-gold)]">{en}</p>
      <div className="mt-3 h-px w-14 bg-[var(--sx-gold)]" />
      <p className="mt-3 text-sm font-semibold text-[var(--sx-sub)]">{kr}</p>
    </div>
  );
}

function Tag({ children, prep }: { children: ReactNode; prep?: boolean }) {
  return (
    <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10.5px] font-semibold tracking-wider ${prep ? "border-amber-400/50 text-amber-300" : "border-[var(--sx-cyan)]/50 text-[var(--sx-cyan)]"}`}>
      {children}
    </span>
  );
}

/* 심벌: 육각형 두 모듈이 맞물린 S + 중앙의 로봇 눈(렌즈) */
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
      <circle cx="169" cy="62" r="7" fill="#050a16" stroke="#e9d9a6" strokeWidth="4" />
      <circle cx="31" cy="138" r="7" fill="#050a16" stroke="#c9d2e2" strokeWidth="4" />
    </svg>
  );
}

const BUSINESS = [
  { img: "home.jpg", t: "자율주행 서비스 로봇", tag: "운영중", d: "서빙·안내·홍보 로봇을 판매·렌탈합니다. 자체 개발과 해외 OEM/ODM을 함께 운영하고, 초기 부담을 낮추는 렌탈·금융 프로그램을 제공합니다." },
  { img: "logistics.jpg", t: "B2B 물류 운반 로봇", tag: "확장중", d: "자이로스코프 기반 균형 제어로 좁은 통로와 복잡한 지형에서도 안정적으로 운반합니다. 물류센터·제조공장 자동화와 RaaS(구독형 로봇) 모델로 확장합니다." },
  { img: "security.jpg", t: "보안 순찰 로봇", tag: "개발중", prep: true, d: "IDC·건물 내외부 자율순찰, 관제 영상 스트리밍, 열화상 기반 연기·화재 식별, 3kg급 소화기 탑재를 목표로 설계·내부 시험 중입니다." },
  { img: "brain.jpg", t: "AI 음성·챗봇 솔루션", tag: "연구개발", prep: true, d: "생성형 음성 합성과 상황 인지형 대화 엔진을 로봇에 적용해 안내·상담·헬스케어 현장에서 자연스럽게 대화하는 로봇을 연구합니다." },
  { img: "medical.jpg", t: "디지털 헬스케어", tag: "협력", d: "관계사 GBI·GB LABS와 함께 IT와 헬스케어를 융합한 의료 데이터·원격 진료 지원 모델과 의료 보조 로봇을 개발합니다." },
];

const LINEUP = [
  ["2006", "투휠 밸런싱 서비스로봇", "국내 최초"],
  ["2007", "T-bot", "국내 최초 텔레프레즌스 로봇"],
  ["2010", "RMP-900", "투휠 셀프밸런싱 오픈 플랫폼"],
  ["2014", "BB-Chair", "다이얼 조향 좌식 밸런싱"],
  ["2015", "BB-Backpack", "초경량 백팩형 전동 스쿠터"],
  ["2018", "Oak-Bot · 모빌리티 체어", "동계패럴림픽 공급"],
  ["2019", "GURO Bot", "사이니지 안내 로봇"],
  ["2020~", "휠체어 전동 전환 장치", "계단 승월 구동 특허"],
];

const REFS = [
  ["2020", "서울대 AI연구원 컨소시엄", "안내로봇 인터랙션 AI 데이터 정부과제 참여 · 스마트팩토리 공급 3건"],
  ["2019", "서울 홍보관 GURO Bot 납품", "스마트팜·팩토리 사업 참여 · ISO 9001 인증"],
  ["2018", "동계패럴림픽 공급", "모빌리티 체어, 사이니지 로봇, Oak-Bot"],
  ["2016", "대한민국 로봇대상 국무총리 표창", "AST 특허 미국·일본 등록 · 코넥스 상장"],
  ["2006", "Microsoft Robotics Studio 파트너", "기업부설연구소 인정 · BBC 한국 기술 특집 출연"],
];

const HISTORY = [
  ["2003", "㈜로보쓰리 설립"],
  ["2004", "벤처기업 인증 · 국내 최초 KBS 오케스트라 지휘 로봇"],
  ["2007", "INNO-BIZ 선정 · 국책은행 초기 기술투자 유치"],
  ["2016", "코넥스 상장 · 국무총리 표창"],
  ["2017", "AI 기반 배달 서비스로봇 개발 착수"],
  ["2026", "㈜로보쓰리에이아이 → ㈜솔루믹스 상호 변경"],
];

const PATENTS: [string, string, string, string][] = [
  ["2020", "계단 승월형 구동장치 및 승월 구동방법", "제10-2070575", "KR"],
  ["2019", "전동주행 전환용 휠체어 동력장치의 주행방법", "제10-2043079", "KR"],
  ["2017", "외력 발생시 직진 주행이 유지되는 투휠 셀프밸런싱 스쿠터의 주행방법", "제10-1716237", "KR"],
  ["2014", "투휠 셀프 밸런싱 휠체어", "제10-1473862", "KR"],
  ["2006", "4족보행 로보트", "제10-0563961", "KR"],
  ["2018", "족동형 조향장치가 장착된 백팩형 셀프밸런싱스쿠터", "US 9,919,762 B2", "US"],
  ["2018", "추가 탑승식 발판 접이형 셀프 밸런싱 스쿠터", "US 10,167,038 B2", "US"],
  ["2016", "외력 발생시 직진 주행 유지 투휠 셀프밸런싱 스쿠터 주행방법", "US 9,434,438", "US"],
  ["2016", "투휠 셀프 밸런싱 휠체어", "US 9,445,959", "US"],
  ["2018", "추가 탑승식 발판 접이형 셀프 밸런싱 스쿠터", "特許第6379241号", "JP"],
  ["2017", "허벅지조향형 셀프밸런싱스쿠터", "特許第6164661号", "JP"],
  ["2018", "추가 탑승식 발판 접이형 셀프 밸런싱 스쿠터", "DE 102017104372", "DE"],
  ["2017", "핸즈프리형 전동스쿠터", "DE 11 2011 101 993", "DE"],
];
const FILTERS: [string, string][] = [["all", "전체"], ["KR", "국내"], ["US", "미국"], ["JP", "일본"], ["DE", "독일"]];
const PURPOSES = ["제품·렌탈", "사업 제휴", "기술 협력", "투자 상담"];

export default function SolumixSite() {
  const [f, setF] = useState("all");
  const [purpose, setPurpose] = useState(PURPOSES[0]);
  const [sent, setSent] = useState(false);
  const rows = PATENTS.filter((p) => f === "all" || p[3] === f);

  return (
    <div className="smx">
      {/* 상단 바 */}
      <header className="sticky top-0 z-30 border-b border-[var(--sx-line)] bg-[var(--sx-deep)]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-md items-center justify-between px-5 py-3">
          <a href="#top" className="flex items-center gap-2"><Mark size={26} id="hd" /><span className="brand text-[17px] font-extrabold tracking-[0.06em]">SOLUMIX</span></a>
          <nav className="flex gap-1 text-[12.5px] text-[var(--sx-sub)]" aria-label="주 메뉴">
            <a className="px-2 py-1.5" href="#about">회사</a><a className="px-2 py-1.5" href="#business">사업</a><a className="px-2 py-1.5" href="#tech">기술</a><a className="px-2 py-1.5" href="#contact">문의</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMG("hero.jpg")} alt="" className="sx-kb h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--sx-deep)]/30 via-[var(--sx-deep)]/40 to-[var(--sx-deep)]" />
          <div className="sx-scan absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-[var(--sx-cyan)]/10 to-transparent" />
        </div>
        <div className="relative mx-auto flex min-h-[88vh] max-w-md flex-col justify-end px-5 pb-12 pt-24">
          <div className="sx-float mb-6"><Mark size={92} id="hero" /></div>
          <p className="brand text-[42px] font-extrabold leading-none tracking-[0.06em]">SOLUMIX</p>
          <p className="brand mt-3 text-[11px] font-semibold tracking-[0.28em] text-[var(--sx-champ)]">AI · ROBOTICS · SMART SOLUTIONS</p>
          <div className="mt-7 h-px w-16 bg-[var(--sx-gold)]" />
          <h1 className="mt-6 text-[28px] font-black leading-[1.3] tracking-tight">넘어지지 않는 기술로,<br /><span className="text-[var(--sx-cyan)]">미래를 배달하는</span> 로봇 회사</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--sx-silver)]">2003년 국내 최초 투휠 밸런싱 로봇에서 출발해, 이제 AI·자율주행·로봇을 잇는 토털 플랫폼으로 나아갑니다.</p>
          <p className="brand mt-6 text-[12px] tracking-[0.2em] text-[var(--sx-sub)]">INTELLIGENCE IN MOTION</p>
        </div>
      </section>

      {/* 숫자 */}
      <section className="mx-auto max-w-md px-5 pb-14">
        <Rise className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--sx-line)] bg-[var(--sx-line)]">
          {[["46", "보유 특허 (국내 16 · 해외 30)"], ["5개국", "미·일·독·중·인도 특허"], ["2016", "코넥스 상장"], ["20년+", "셀프밸런싱 원천기술"]].map(([n, l]) => (
            <div key={l} className="bg-[var(--sx-navy)] p-5">
              <p className="brand text-[26px] font-bold text-[var(--sx-champ)]">{n}</p>
              <p className="mt-1 text-[12px] text-[var(--sx-sub)]">{l}</p>
            </div>
          ))}
        </Rise>
      </section>

      {/* 회사 */}
      <section id="about" className="border-t border-[var(--sx-line)] bg-[var(--sx-navy)] py-16">
        <div className="mx-auto max-w-md px-5">
          <Label en="ABOUT SOLUMIX" kr="회사 소개" />
          <Rise>
            <h2 className="text-[24px] font-black leading-snug">로봇 제조를 넘어,<br />AI 로봇 토털 플랫폼으로</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--sx-silver)]">솔루믹스는 ‘로보쓰리’에서 ‘로보쓰리에이아이’를 거쳐 새 이름으로 출발합니다. 이름은 바뀌어도, 사람 곁에서 균형을 잃지 않고 움직이는 로봇을 만든다는 원칙은 그대로입니다.</p>
          </Rise>
          <Rise className="mt-8 overflow-hidden rounded-2xl shadow-lg">
            <img src={IMG("kid.jpg")} alt="아이와 함께 놀아주는 서비스 로봇" className="aspect-[4/3] w-full object-cover" />
          </Rise>
          <div className="mt-8 grid gap-3">
            {[
              ["01", "기술의 의미 재정립", "기능 구현이 아니라 사람의 생활이 실제로 나아지는 기술을 개발합니다."],
              ["02", "사람 중심의 혁신", "기술이 삶과 조화를 이루고 새로운 가능성을 여는 방향을 제시합니다."],
              ["03", "글로벌 비전", "지능형 로봇의 가치를 세계로 알리고, 누구나 그 혜택을 누리게 합니다."],
            ].map(([n, t, d], i) => (
              <Rise key={n} delay={i * 0.06} className="rounded-2xl border border-[var(--sx-line)] bg-[var(--sx-panel)] p-5">
                <p className="brand text-[12px] font-bold tracking-widest text-[var(--sx-gold)]">CEO MESSAGE {n}</p>
                <p className="mt-2 text-[16px] font-bold">{t}</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--sx-sub)]">{d}</p>
              </Rise>
            ))}
          </div>
          <Rise className="mt-8 grid grid-cols-3 gap-2 text-center">
            {[["혁신", "Innovation"], ["연결", "Connection"], ["확장", "Expansion"]].map(([k, e]) => (
              <div key={e} className="rounded-xl border border-[var(--sx-line)] py-4">
                <p className="text-[15px] font-bold text-[var(--sx-champ)]">{k}</p>
                <p className="brand mt-1 text-[10.5px] tracking-wider text-[var(--sx-sub)]">{e}</p>
              </div>
            ))}
          </Rise>
        </div>
      </section>

      {/* 사업 */}
      <section id="business" className="py-16">
        <div className="mx-auto max-w-md px-5">
          <Label en="BUSINESS" kr="핵심 사업 영역" />
          <Rise><h2 className="text-[24px] font-black leading-snug">균형 제어 기술 하나로<br />다섯 개의 현장을 움직입니다</h2></Rise>
          <div className="mt-8 grid gap-5">
            {BUSINESS.map((b, i) => (
              <Rise key={b.t} delay={i * 0.04} className="overflow-hidden rounded-2xl border border-[var(--sx-line)] bg-[var(--sx-panel)] shadow-lg">
                <img src={IMG(b.img)} alt={b.t} className="aspect-[16/10] w-full object-cover" />
                <div className="p-5">
                  <div className="flex items-center justify-between gap-3"><h3 className="text-[17px] font-bold">{b.t}</h3><Tag prep={b.prep}>{b.tag}</Tag></div>
                  <p className="mt-2 text-[14px] leading-relaxed text-[var(--sx-sub)]">{b.d}</p>
                </div>
              </Rise>
            ))}
            <Rise className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[var(--sx-line)] bg-[var(--sx-panel)] p-4">
                <div className="flex items-center justify-between gap-2"><p className="text-[15px] font-bold">홈 IoT</p><Tag>운영중</Tag></div>
                <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--sx-sub)]">Tuya 기반 스마트홈 제품 · 논현동 파일럿 매장</p>
              </div>
              <div className="rounded-2xl border border-[var(--sx-line)] bg-[var(--sx-panel)] p-4">
                <div className="flex items-center justify-between gap-2"><p className="text-[15px] font-bold">EV·ESS 부품</p><Tag>운영중</Tag></div>
                <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--sx-sub)]">사출·다이캐스팅·프레스·금형 공정</p>
              </div>
            </Rise>
          </div>
        </div>
      </section>

      {/* 기술·제품 */}
      <section id="tech" className="border-t border-[var(--sx-line)] bg-[var(--sx-navy)] py-16">
        <div className="mx-auto max-w-md px-5">
          <Label en="TECHNOLOGY" kr="기술과 제품의 계보" />
          <Rise>
            <h2 className="text-[24px] font-black leading-snug">자이로스코프 균형 제어,<br />20년을 쌓아 온 원천기술</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--sx-silver)]">외력이 가해져도 똑바로 나아가는 직진 유지 기술(AST)은 미국·일본에 등록된 솔루믹스의 대표 특허입니다.</p>
          </Rise>
          <Rise className="mt-8 overflow-hidden rounded-2xl shadow-lg">
            <img src={IMG("humanoid.jpg")} alt="균형을 잡는 휴머노이드 로봇" className="aspect-[4/3] w-full bg-black object-contain" />
          </Rise>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {LINEUP.map(([y, n, d]) => (
              <Rise key={n} className="rounded-xl border border-[var(--sx-line)] p-3.5">
                <p className="brand text-[11px] font-semibold text-[var(--sx-cyan)]">{y}</p>
                <p className="mt-1 text-[14px] font-bold leading-snug">{n}</p>
                <p className="mt-0.5 text-[12px] text-[var(--sx-sub)]">{d}</p>
              </Rise>
            ))}
          </div>

          <div className="mt-12">
            <p className="text-[16px] font-bold">특허 포트폴리오</p>
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="특허 필터">
              {FILTERS.map(([k, label]) => (
                <button key={k} type="button" aria-pressed={f === k} onClick={() => setF(k)}
                  className={`rounded-full border px-3.5 py-1.5 text-[12.5px] ${f === k ? "border-[var(--sx-gold)] bg-[var(--sx-gold)] font-bold text-[#1a1406]" : "border-[var(--sx-line)] text-[var(--sx-silver)]"}`}>{label}</button>
              ))}
            </div>
            <div className="mt-3 overflow-x-auto rounded-2xl border border-[var(--sx-line)]">
              <table className="w-full min-w-[440px] border-collapse text-[13px]">
                <thead><tr className="text-left text-[11px] text-[var(--sx-sub)]"><th className="px-3 py-2.5 font-normal">연도</th><th className="px-3 py-2.5 font-normal">발명의 명칭</th><th className="px-3 py-2.5 font-normal">번호</th></tr></thead>
                <tbody>
                  {rows.map((p, i) => (
                    <tr key={i} className="border-t border-[var(--sx-line)] align-top">
                      <td className="brand px-3 py-2.5 text-[12px] text-[var(--sx-cyan)]">{p[0]}</td><td className="px-3 py-2.5">{p[1]}</td><td className="brand whitespace-nowrap px-3 py-2.5 text-[12px] text-[var(--sx-champ)]">{p[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[12px] text-[var(--sx-sub)]">대표 등록 특허만 표시했습니다. 전체 46건(국내 16 · 해외 30)을 보유하고 있습니다.</p>
          </div>
        </div>
      </section>

      {/* 실적·연혁 */}
      <section id="projects" className="py-16">
        <div className="mx-auto max-w-md px-5">
          <Label en="REFERENCES" kr="주요 실적과 연혁" />
          <div className="grid gap-3">
            {REFS.map(([y, t, d]) => (
              <Rise key={t} className="flex gap-4 rounded-2xl border border-[var(--sx-line)] bg-[var(--sx-panel)] p-4">
                <p className="brand pt-0.5 text-[12px] font-semibold text-[var(--sx-gold)]">{y}</p>
                <div><p className="text-[15px] font-bold">{t}</p><p className="mt-1 text-[13px] text-[var(--sx-sub)]">{d}</p></div>
              </Rise>
            ))}
          </div>
          <Rise className="mt-8 overflow-hidden rounded-2xl shadow-lg">
            <img src={IMG("hand.jpg")} alt="사람과 로봇의 악수" className="aspect-[16/9] w-full object-cover" />
          </Rise>
          <ol className="mt-8 border-l border-[var(--sx-line)] pl-5">
            {HISTORY.map(([y, t]) => (
              <li key={y + t} className="relative pb-5 last:pb-0">
                <span className="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--sx-gold)]" />
                <p className="brand text-[13px] font-bold text-[var(--sx-champ)]">{y}</p>
                <p className="mt-0.5 text-[14px] text-[var(--sx-silver)]">{t}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 문의 */}
      <section id="contact" className="border-t border-[var(--sx-line)] bg-[var(--sx-navy)] py-16">
        <div className="mx-auto max-w-md px-5">
          <Label en="CONTACT" kr="사업 문의" />
          <dl className="grid gap-2.5 text-[14px]">
            {[["대표전화", "02-544-9145"], ["팩스", "02-544-9146"], ["이메일", "robo1@robo3.com"], ["주소", "서울 강동구 고덕비즈밸리로 26, 강동U1센터 B동 508호"]].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[68px_1fr] gap-3"><dt className="text-[13px] text-[var(--sx-sub)]">{k}</dt><dd className="select-all">{v}</dd></div>
            ))}
          </dl>
          <form className="mt-6 grid gap-3 rounded-2xl border border-[var(--sx-line)] bg-[var(--sx-panel)] p-5" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <div className="flex flex-wrap gap-2" role="group" aria-label="문의 분야">
              {PURPOSES.map((p) => (
                <button key={p} type="button" aria-pressed={purpose === p} onClick={() => setPurpose(p)}
                  className={`rounded-full border px-3 py-1.5 text-[12.5px] ${purpose === p ? "border-[var(--sx-gold)] bg-[var(--sx-gold)] font-bold text-[#1a1406]" : "border-[var(--sx-line)] text-[var(--sx-silver)]"}`}>{p}</button>
              ))}
            </div>
            {[["smx-nm", "이름 / 회사명", "홍길동 / ○○식품"], ["smx-ph", "연락처", "010-0000-0000"]].map(([id, l, ph]) => (
              <label key={id} htmlFor={id} className="grid gap-1.5 text-[12.5px] text-[var(--sx-sub)]">{l}
                <input id={id} placeholder={ph} className="rounded-xl border border-[var(--sx-line)] bg-[var(--sx-deep)] px-3 py-3 text-[16px] text-[var(--sx-fg)] outline-none focus:border-[var(--sx-gold)]" />
              </label>
            ))}
            <label htmlFor="smx-msg" className="grid gap-1.5 text-[12.5px] text-[var(--sx-sub)]">문의 내용
              <textarea id="smx-msg" rows={4} placeholder="예) 매장 2곳에 서빙로봇 렌탈을 검토 중입니다." className="rounded-xl border border-[var(--sx-line)] bg-[var(--sx-deep)] px-3 py-3 text-[16px] text-[var(--sx-fg)] outline-none focus:border-[var(--sx-gold)]" />
            </label>
            <button type="submit" className="rounded-xl bg-[var(--sx-gold)] py-3.5 text-[15px] font-bold text-[#1a1406]">문의 보내기</button>
            <p className="min-h-[1em] text-[12.5px] text-amber-300" aria-live="polite">{sent ? "시안 화면입니다. 정식 오픈 후에는 담당 부서로 바로 전달됩니다." : ""}</p>
          </form>
        </div>
      </section>

      <footer className="border-t border-[var(--sx-line)] py-10 text-[12px] text-[var(--sx-sub)]">
        <div className="mx-auto grid max-w-md gap-1.5 px-5">
          <div className="mb-2 flex items-center gap-2 text-[var(--sx-fg)]"><Mark size={22} id="ft" /><span className="brand font-extrabold tracking-[0.06em]">SOLUMIX</span></div>
          <p>㈜솔루믹스 (구 ㈜로보쓰리에이아이) · 대표이사 황용운</p>
          <p>사업자등록번호 206-81-84723</p>
          <p>서울 강동구 고덕비즈밸리로 26, 강동U1센터 B동 508호</p>
          <p className="brand mt-2 tracking-wider">© SOLUMIX · Intelligence in Motion</p>
        </div>
      </footer>
    </div>
  );
}
