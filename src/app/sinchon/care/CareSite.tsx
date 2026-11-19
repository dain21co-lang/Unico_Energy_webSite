"use client";

import { useState } from "react";

const A = "/sinchon/care";

function Vid({ src, poster, className = "" }: { src: string; poster: string; className?: string }) {
  return <video className={className} src={`${A}/${src}`} poster={`${A}/${poster}`} autoPlay muted loop playsInline preload="metadata" />;
}

function Head({ no, en, title, sub }: { no: string; en: string; title: string; sub?: string }) {
  return (
    <div className="cr-head">
      <div className="cr-kicker"><span>{no}</span>{en}</div>
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
    </div>
  );
}

const FLOORS = [
  { fl: "옥상", name: "힐링가든", d: "환자와 가족이 바람을 쐬고 해 질 녘 신촌을 내려다보는 정원" },
  { fl: "9–10F", name: "가족 체류실 · 완화돌봄", d: "치료 기간 동안 보호자가 머무는 방, 그리고 마지막 시간까지 존엄을 지키는 1·2인실" },
  { fl: "4–8F", name: "회복 병동 · 케어 레지던스", d: "항암·수술 후 회복 환자를 위한 공간. 인허가 검토에 따라 요양 병동 또는 체류형 레지던스로 조정" },
  { fl: "3F", name: "재활 · 통합치료", d: "재활운동, 영양 상담, 심리 상담, 통증 관리" },
  { fl: "2F", name: "평생주치의 의원", d: "조합원 주치의 진료, 전문의 원격협진, 방문진료 출발 거점" },
  { fl: "1F", name: "접수 · 상담 · 카페", d: "입원 상담, 조합원 가입 안내, 가족 대기 카페" },
  { fl: "B1–B2", name: "주차 · 지원시설", d: "환자 이송 차량, 식당, 세탁, 의료 지원 공간" },
];

const STEPS = [
  ["조합 설립", "발기인·조합원 모집, 창립총회, 설립 인가"],
  ["입점 협약", "건물 측과 장기 임대·입점 협약 체결"],
  ["인허가", "의료시설 용도변경, 요양병원·의원 개설 절차"],
  ["리모델링", "병동·간호스테이션·병상용 엘리베이터·피난설비"],
  ["개원", "평생주치의 의원 먼저 열고, 병동은 단계적으로 개시"],
];

const MONEY = [
  ["조합원 출자·가입비", "뜻을 함께하는 조합원의 출자"],
  ["건강보험 급여", "공단 부담금 + 본인 부담금"],
  ["장기요양급여", "방문요양·방문간호 등"],
  ["기부금", "공익 재원"],
  ["교육·컨설팅", "사업모델 자문, 돌봄 인력 교육"],
  ["부대사업", "식당·카페·웰빙·토탈장례서비스"],
];


const S = "/sinchon";
const ZONES = [
  { fl: "옥상", en: "SKY GARDEN", name: "하늘정원", img: `${S}/rooftop-hero-poster.webp`, d: "도심 한가운데의 옥상정원. 휠체어로도 오를 수 있는 산책로와 그늘 쉼터에서 환자와 가족이 바람을 쐽니다.", tags: ["무단차 산책로", "그늘 쉼터", "노을 전망"] },
  { fl: "10F", en: "NOEUL", name: "노을 · 완화돌봄 스위트", img: `${A}/hug-poster.webp`, d: "마지막 시간을 가족과 함께 보내는 1인 스위트. 보호자 침대와 작은 거실이 붙어 있습니다.", tags: ["1인 스위트", "보호자 침대", "24시간 간호"] },
  { fl: "9F", en: "MEOMUM", name: "머묾 · 가족 체류실", img: `${S}/room-twin.webp`, d: "지방에서 올라온 보호자가 치료 기간 동안 머무는 방. 병동과 같은 건물이라 밤에도 곁을 지킵니다.", tags: ["2인 체류실", "공용 주방", "세탁실"] },
  { fl: "5–8F", en: "SOOP", name: "숲 · 회복 병동", img: `${A}/nurse-poster.webp`, d: "항암·수술 후 회복 환자를 위한 병동. 층마다 간호스테이션을 가운데 두고 1·2인실을 배치합니다. 인허가 검토에 따라 체류형 케어 레지던스로 조정할 수 있습니다.", tags: ["층별 간호스테이션", "1·2인실", "병상용 엘리베이터"] },
  { fl: "4F", en: "BYEOT", name: "볕 · 재활 센터", img: `${A}/stage-home.webp`, d: "햇빛이 드는 재활 운동실. 체력 회복, 림프부종 관리, 통증 완화 프로그램을 운영합니다.", tags: ["재활 운동실", "물리치료", "림프부종 관리"] },
  { fl: "3F", en: "GYEOL", name: "결 · 통합치료 · 상담", img: `${A}/stage-healthy.webp`, d: "영양 상담, 심리 상담, 통증 관리, 웰다잉 준비를 한 층에서 받습니다.", tags: ["영양 상담", "심리 상담", "통증 관리"] },
  { fl: "2F", en: "CLINIC", name: "평생주치의 의원", img: `${A}/doctor-poster.webp`, d: "조합원 주치의 진료와 전문의 원격협진. 방문진료·방문간호 팀이 이곳에서 출발합니다.", tags: ["주치의 진료", "원격협진", "방문진료 거점"] },
  { fl: "1F", en: "LOBBY", name: "로비 · 카페 · 약국", img: `${S}/arrival-poster.webp`, d: "입원 상담과 조합원 가입 안내, 보호자가 기다리는 카페. 거리에서 바로 들어오는 열린 1층입니다.", tags: ["입원 상담", "보호자 카페", "약국"] },
  { fl: "B1", en: "HANSANG", name: "한상 · 영양 식당", img: `${S}/orbit-dinner.webp`, d: "치료 단계에 맞춘 영양식을 환자와 가족이 함께 먹는 식당.", tags: ["치료식 · 영양식", "가족 식사"] },
  { fl: "B2", en: "SUPPORT", name: "주차 · 이송", img: `${S}/exterior-poster.webp`, d: "환자 이송 차량과 대학병원 통원 셔틀이 서는 곳.", tags: ["통원 셔틀", "이송 차량"] },
];

const ROOMS = [
  { img: `${S}/room-single.webp`, name: "1인 회복실", d: "항암 기간 감염 걱정 없이 쉬는 개인실" },
  { img: `${S}/room-twin.webp`, name: "2인 회복실 · 체류실", d: "환자와 보호자가 함께, 또는 환자 두 분이" },
  { img: `${S}/lounge.webp`, name: "공용 라운지 · 주방", d: "가족이 음식을 만들고 함께 먹는 층별 공간" },
];

const NEAR = [
  ["세브란스병원 · 연세대", "도보 약 10분", "연세로를 따라 정문까지"],
  ["2호선 신촌역", "도보 약 6분", "공항철도·경의중앙선 환승권"],
  ["이화여대", "도보 약 15분", "버스 5분 안팎"],
];

function Building() {
  const [z, setZ] = useState(3);
  const cur = ZONES[z];
  return (
    <>
      <section className="cr-sec">
        <Head no="01" en="EXPLORE THE BUILDING" title="건물을 둘러보세요" sub="지하 2층부터 옥상까지, 층을 누르면 그 층의 시설이 열립니다." />
        <div className="cr-explore">
          <div className="cr-tower">
            {ZONES.map((x, i) => (
              <button key={x.fl} className={`cr-lvl ${i === z ? "on" : ""} ${x.fl === "옥상" ? "roof" : ""} ${x.fl.startsWith("B") ? "base" : ""}`} onClick={() => setZ(i)}>
                <span>{x.fl}</span>
              </button>
            ))}
          </div>
          <div className="cr-panel">
            <div className="cr-panel-img">
              <img key={cur.img} src={cur.img} alt={cur.name} />
              <em>AI 이미지 · 예시</em>
            </div>
            <div className="cr-panel-en">{cur.fl} · {cur.en}</div>
            <h3>{cur.name}</h3>
            <p>{cur.d}</p>
            <div className="cr-tags">{cur.tags.map((t) => <span key={t}>{t}</span>)}</div>
          </div>
        </div>
      </section>

      <section className="cr-media">
        <Vid src="approach.mp4" poster="approach-poster.webp" className="cr-tall" />
      </section>

      <section className="cr-sec cr-cream">
        <Head no="02" en="ROOMS" title="머무는 방" sub="회복실과 가족 체류실은 같은 건물에 있어, 보호자가 밤에도 곁을 지킵니다." />
        <div className="cr-rooms">
          {ROOMS.map((r) => (
            <div key={r.name}><div className="cr-room-img"><img src={r.img} alt={r.name} /><em>AI 이미지 · 예시</em></div><b>{r.name}</b><span>{r.d}</span></div>
          ))}
        </div>
      </section>

      <section className="cr-sec">
        <Head no="03" en="LOCATION" title="대학병원 바로 곁" sub="치료는 대학병원에서 받고, 걸어서 돌아와 쉽니다." />
        <div className="cr-near">
          {NEAR.map(([n, t, d]) => (<div key={n}><b>{n}</b><strong>{t}</strong><span>{d}</span></div>))}
        </div>
      </section>

      <section className="cr-sec cr-dark">
        <Head no="04" en="SAFETY" title="안전과 편의 설비 (계획)" />
        <div className="cr-grid cr-grid-dark">
          {[["병상용 엘리베이터", "침대째 이동하는 승강기"], ["스프링클러 · 피난설비", "의료시설 기준으로 보강"], ["무단차 동선", "로비부터 옥상까지 휠체어로"], ["간호 호출", "모든 방에 호출 장치"], ["통원 셔틀", "대학병원 정기 운행"], ["보호자 출입 관리", "24시간 출입 확인"]].map(([t, d]) => (<div key={t}><b>{t}</b><span>{d}</span></div>))}
        </div>
      </section>

      <section className="cr-sec">
        <Head no="05" en="BEFORE · AFTER" title="지금의 건물, 바뀐 모습" />
        <div className="cr-ba">
          <div><img src={`${S}/before-exterior.webp`} alt="현재" /><span>현재</span></div>
          <div><img src={`${A}/after-new.webp`} alt="리모델링 후 예시" /><span>리모델링 후 예시</span></div>
        </div>
      </section>
    </>
  );
}

function Proposal() {
  return (
    <>
      <section className="cr-sec">
        <Head no="01" en="IN ONE LINE" title="비어 있는 위층을, 암환자의 회복 공간으로" sub="신촌역 가까운 지하 2층~지상 10층 건물의 위층에 의료복지사회적협동조합이 운영하는 요양병원과 평생주치의 의원이 들어오는 구상입니다." />
        <div className="cr-stats">
          <div><b>B2–10F</b><span>기존 건물 활용</span></div>
          <div><b>세브란스</b><span>연세의료원 생활권</span></div>
          <div><b>생애 전주기</b><span>예방부터 웰다잉까지</span></div>
        </div>
      </section>

      <section className="cr-sec cr-cream">
        <Head no="02" en="WHY SINCHON" title="왜 신촌인가" />
        <ul className="cr-list">
          <li><b>연세의료원(세브란스) 생활권</b><span>암 치료로 오가는 환자와 가족, 대기하는 보호자가 근처에 머물 곳이 마땅치 않습니다. 이 일대에서 가장 큰 건물이 그 자리가 됩니다.</span></li>
          <li><b>지방 환자의 서울 거점</b><span>항암·방사선 치료를 위해 올라온 환자와 가족이 머물 곳이 부족합니다.</span></li>
          <li><b>교통</b><span>지하철 2호선, 공항철도·경의중앙선 환승권. 가족 방문이 쉽습니다.</span></li>
          <li><b>건물 여건</b><span>위층이 비어 있어 병동으로 바꾸기 좋은 시점입니다(구상).</span></li>
        </ul>
      </section>


      <section className="cr-sec cr-dark">
        <Head no="03" en="STRUCTURE" title="운영 구조" sub="병원은 협동조합이 열고, 건물은 임대로 제공합니다." />
        <div className="cr-flow">
          <div className="cr-box">건물<small>장기 임대 제공</small></div>
          <div className="cr-arrow">↓ 입점 협약</div>
          <div className="cr-box cr-accent">평생주치의 의료·돌봄<br />의료복지사회적협동조합<small>요양병원·의원 개설·운영</small></div>
          <div className="cr-arrow">↓ 연결</div>
          <div className="cr-row">
            <div className="cr-box">대학병원 협진<small>입원·수술·전문진료</small></div>
            <div className="cr-box">GB LABS<small>디지털 원격협진</small></div>
          </div>
          <div className="cr-box">교수 자문단<small>전국 대학 교수·은퇴 교수 네트워크</small></div>
        </div>
        <img className="cr-img" src={`${A}/network-care.webp`} alt="협력 네트워크" />
      </section>

      <section className="cr-sec">
        <Head no="04" en="FUNDING" title="지속 가능한 재원 구조" />
        <div className="cr-grid">
          {MONEY.map(([t, d]) => (<div key={t}><b>{t}</b><span>{d}</span></div>))}
        </div>
      </section>

      <section className="cr-sec cr-cream">
        <Head no="05" en="ROADMAP" title="추진 단계" />
        <ol className="cr-steps">
          {STEPS.map(([t, d], i) => (<li key={t}><span>{i + 1}</span><div><b>{t}</b><p>{d}</p></div></li>))}
        </ol>
        <p className="cr-note">요양병원 개설 요건과 용도변경 가능 여부는 전문가 검토 후 확정합니다.</p>
      </section>
    </>
  );
}

const STAGES = [
  ["stage-healthy.webp", "건강할 때", "예방·건강교육·검진 관리"],
  ["stage-hospital.webp", "치료받을 때", "대학병원 치료와 주치의 협진"],
  ["stage-home.webp", "회복할 때", "병동 회복, 재활, 방문간호"],
  ["stage-end.webp", "생의 마지막까지", "완화돌봄·웰다잉·가족 지원"],
];

const DAY = [
  ["07:30", "아침 회진", "간호사가 밤사이 상태를 살핍니다"],
  ["09:00", "병원 통원", "대학병원 항암·방사선 치료 동행"],
  ["12:00", "영양식", "치료 단계에 맞춘 식단"],
  ["15:00", "재활 · 상담", "운동, 통증 관리, 마음 상담"],
  ["18:00", "가족 시간", "가족실과 라운지에서 함께"],
  ["21:00", "주치의 확인", "하루 기록을 주치의가 확인"],
];

function Family() {
  return (
    <>
      <section className="cr-sec">
        <Head no="01" en="FOR YOU" title="이런 분께 필요합니다" />
        <ul className="cr-list">
          <li><b>통원이 힘든 항암 환자</b><span>치료 날마다 먼 길을 오가기 어려운 분</span></li>
          <li><b>수술 후 회복기 환자</b><span>퇴원은 했지만 집에서 돌보기 어려운 분</span></li>
          <li><b>지방에서 올라온 가족</b><span>서울에서 치료받는 동안 머물 곳이 필요한 분</span></li>
          <li><b>완화돌봄이 필요한 분</b><span>마지막 시간을 존엄하게 보내고 싶은 분</span></li>
        </ul>
      </section>

      <section className="cr-media">
        <Vid src="coop-care-ko.mp4" poster="care-poster-ko.webp" className="cr-wide" />
      </section>

      <section className="cr-sec cr-cream">
        <Head no="02" en="A DAY" title="케어하우스의 하루 (예시)" />
        <div className="cr-day">
          {DAY.map(([t, n, d]) => (<div key={t}><span>{t}</span><div><b>{n}</b><p>{d}</p></div></div>))}
        </div>
      </section>

      <section className="cr-sec">
        <Head no="03" en="TEAM" title="주치의 혼자가 아니라, 팀이 함께" />
        <div className="cr-vids">
          <Vid src="coop-doctor-ko.mp4" poster="doctor-poster.webp" />
          <Vid src="coop-nurse.mp4" poster="nurse-poster.webp" />
        </div>
        <p className="cr-p">주치의, 간호사, 요양보호사, 영양사, 상담가가 한 팀으로 돌봅니다. 필요할 때는 전문의에게 바로 원격으로 자문합니다.</p>
      </section>

      <section className="cr-sec cr-cream">
        <Head no="04" en="WHOLE LIFE" title="건강할 때부터 생의 마지막까지" />
        <div className="cr-stages">
          {STAGES.map(([img, t, d]) => (
            <div key={t}><img src={`${A}/${img}`} alt={t} /><b>{t}</b><span>{d}</span></div>
          ))}
        </div>
      </section>

      <section className="cr-sec">
        <Head no="05" en="TOGETHER" title="가족도 함께 쉬어 갑니다" />
        <div className="cr-vids">
          <Vid src="coop-lounge.mp4" poster="lounge-poster.webp" />
          <Vid src="coop-hug.mp4" poster="hug-poster.webp" />
        </div>
      </section>

      <section className="cr-sec cr-dark">
        <Head no="06" en="MEMBER" title="조합원이 되면" sub="조합원이 함께 출자하고 참여해, 우리가 원하는 의료·돌봄을 함께 만듭니다." />
        <ul className="cr-list cr-light">
          <li><b>평생주치의</b><span>나를 오래 아는 의사가 전체 건강을 책임집니다</span></li>
          <li><b>우선 상담</b><span>입원·방문진료 상담을 먼저 받습니다</span></li>
          <li><b>가족 지원</b><span>보호자 교육과 상담, 웰다잉 준비</span></li>
        </ul>
        <div className="cr-cta">입원·조합원 상담 창구는 개원 준비 단계에서 열립니다</div>
      </section>
    </>
  );
}

export default function CareSite() {
  const [tab, setTab] = useState<"b" | "p" | "f">("b");
  const go = (t: "b" | "p" | "f") => { setTab(t); window.scrollTo({ top: window.innerHeight * 0.85 }); };
  return (
    <main className="cr">
      <header className="cr-hero">
        <video className="cr-hero-bg" src={`${A}/intro.mp4`} poster={`${A}/intro-poster.webp`} autoPlay muted loop playsInline preload="auto" />
        <div className="cr-hero-in">
          <p className="cr-eyebrow">SINCHON CARE HOUSE</p>
          <h1>치료는 대학병원에서,<br />회복은 <em>신촌</em>에서</h1>
          <p className="cr-lead">신촌 평생주치의 케어하우스(가칭)<br />의료복지사회적협동조합 입점 구상</p>
          <p className="cr-mini">입점 검토용 시안 · 이미지와 영상은 AI 예시</p>
        </div>
      </header>

      <nav className="cr-tabs">
        <button className={tab === "b" ? "on" : ""} onClick={() => go("b")}>건물·시설</button>
        <button className={tab === "p" ? "on" : ""} onClick={() => go("p")}>입점 제안</button>
        <button className={tab === "f" ? "on" : ""} onClick={() => go("f")}>환자·가족</button>
      </nav>

      {tab === "b" ? <Building /> : tab === "p" ? <Proposal /> : <Family />}

      <footer className="cr-foot">
        <b>신촌 평생주치의 케어하우스 (가칭)</b>
        <p>본 페이지는 의료복지사회적협동조합 입점을 검토하기 위한 가상 시나리오입니다. 이미지와 영상은 AI로 만든 예시이며, 층별 구성·운영 구조·일정은 확정되지 않았습니다.</p>
      </footer>
    </main>
  );
}
