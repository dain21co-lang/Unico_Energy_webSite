"use client";

import { useState } from "react";

function Mark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <linearGradient id="smx-s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f4f7fb" /><stop offset="1" stopColor="#8e9ab0" /></linearGradient>
        <linearGradient id="smx-b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3fa9ff" /><stop offset="1" stopColor="#1f4fd1" /></linearGradient>
      </defs>
      <path d="M169 62 L100 22 L31 62 L31 100 L76 100" fill="none" stroke="url(#smx-s)" strokeWidth="15" />
      <path d="M124 100 L169 100 L169 138 L100 178 L31 138" fill="none" stroke="url(#smx-b)" strokeWidth="15" />
      <circle cx="100" cy="100" r="19" fill="none" stroke="#5fe1ff" strokeWidth="5" />
      <circle cx="100" cy="100" r="8" fill="#5fe1ff" />
      <circle cx="169" cy="62" r="7" fill="#0a1020" stroke="#f4f7fb" strokeWidth="4" />
      <circle cx="31" cy="138" r="7" fill="#0a1020" stroke="#3fa9ff" strokeWidth="4" />
    </svg>
  );
}

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
      <header>
        <div className="wrap">
          <div className="logo"><Mark size={28} />SOLUMIX</div>
          <nav aria-label="주 메뉴">
            <a href="#business">사업</a><a href="#products">제품</a><a href="#projects">실적</a><a href="#contact">문의</a>
          </nav>
        </div>
      </header>

      <main>
        <div className="wrap hero">
          <div className="lockup">
            <Mark size={84} />
            <div><b>SOLUMIX</b><span>AI · ROBOTICS · SMART SOLUTIONS</span></div>
          </div>
          <span className="eyebrow">Intelligence in Motion · Since 2003</span>
          <h1>넘어지지 않는 기술로,<br /><em>사람 곁에서 움직이는</em> 로봇을 만듭니다</h1>
          <p>국내 최초 투휠 밸런싱 서비스로봇부터 서빙·안내·보안 로봇, 홈 IoT, EV 부품까지. 솔루믹스는 20여 년의 셀프밸런싱 원천기술을 생활과 산업 현장으로 옮겨 왔습니다.</p>
          <div className="cta"><a className="btn pri" href="#contact">사업 문의하기</a><a className="btn" href="#business">사업 분야 보기</a></div>
          <div className="stats">
            <div className="stat"><b>46</b><span>보유 특허 (국내 16 · 해외 30)</span></div>
            <div className="stat"><b>5</b><span>특허 출원·등록 국가</span></div>
            <div className="stat"><b>2016</b><span>코넥스 상장</span></div>
            <div className="stat"><b>ISO 9001</b><span>품질경영 인증 (2019)</span></div>
          </div>
        </div>

        <section id="business">
          <div className="wrap">
            <span className="eyebrow">Business</span>
            <h2>사업 분야</h2>
            <p className="lead">현재 운영 중인 사업과 준비 중인 사업을 구분해 보여드립니다.</p>
            <div className="biz">
              <div className="card">
                <h3>ROBOTICS · Threebot <span className="tag">운영중</span></h3>
                <p>자체 개발·생산과 해외 OEM/ODM을 병행하는 토털 로봇 브랜드. 초기 비용 부담을 낮추는 렌탈·금융 프로그램을 함께 제공합니다.</p>
                <ul><li>서빙로봇 판매·렌탈</li><li>안내·홍보 로봇 판매·렌탈</li><li>주문 제작형 로봇</li></ul>
              </div>
              <div className="card">
                <h3>보안 로봇 <span className="tag prep">개발중</span></h3>
                <p>IDC·건물 내외부 순찰용. 맵핑 후 자율순찰, 관제 영상 스트리밍, 열화상 기반 연기·화재 식별, 3kg급 소화기 탑재를 목표로 설계·내부 시험 중입니다.</p>
              </div>
              <div className="card">
                <h3>HOME IoT <span className="tag">운영중</span></h3>
                <p>Tuya 플랫폼 기반 스마트홈 제품 판매. 논현동 가구거리에서 파일럿 매장을 운영하고 있습니다.</p>
              </div>
              <div className="card">
                <h3>EV · ESS 부품 <span className="tag">운영중</span></h3>
                <p>BEV·PHEV 주요 부품과 ESS 배터리 관련 부품 생산. 사출, 다이캐스팅, 프레스, 금형 공정을 갖추고 있습니다.</p>
              </div>
              <div className="card">
                <h3>ROBO ESTATE <span className="tag prep">확정 전</span></h3>
                <p>로봇·공간 기반 부동산 사업. 실제 운영 여부와 실적이 확인되면 정식 사업으로 공개합니다.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="products">
          <div className="wrap">
            <span className="eyebrow">Products &amp; Technology</span>
            <h2>셀프밸런싱에서 서비스로봇까지</h2>
            <p className="lead">한 가지 원천기술, 균형 제어를 다양한 제품으로 키워 왔습니다.</p>
            <div className="prod">
              <div><small>2006</small><b>투휠 밸런싱 서비스로봇</b><span>국내 최초</span></div>
              <div><small>2007</small><b>T-bot</b><span>국내 최초 텔레프레즌스 로봇</span></div>
              <div><small>2010</small><b>RMP-900</b><span>투휠 셀프밸런싱 오픈 플랫폼</span></div>
              <div><small>2014</small><b>BB-Chair</b><span>다이얼 조향 좌식 밸런싱</span></div>
              <div><small>2015</small><b>BB-Backpack</b><span>초경량 백팩형 전동 스쿠터</span></div>
              <div><small>2018</small><b>Oak-Bot · 모빌리티 체어</b><span>동계패럴림픽 공급</span></div>
              <div><small>2019</small><b>GURO Bot</b><span>사이니지 안내 로봇</span></div>
              <div><small>2020~</small><b>휠체어 전동 전환 장치</b><span>계단 승월 구동 특허</span></div>
            </div>
          </div>
        </section>

        <section id="projects">
          <div className="wrap">
            <span className="eyebrow">Projects &amp; References</span>
            <h2>주요 실적</h2>
            <div className="ref">
              <div><time>2020</time><p style={{ margin: 0 }}><b>서울대 AI연구원 컨소시엄</b><span>안내로봇 인터랙션 AI 데이터 정부과제 참여 · 스마트팩토리 공급 3건</span></p></div>
              <div><time>2019</time><p style={{ margin: 0 }}><b>서울 홍보관 GURO Bot 납품</b><span>스마트팜·팩토리 사업 참여, ISO 9001 인증</span></p></div>
              <div><time>2018</time><p style={{ margin: 0 }}><b>동계패럴림픽 공급</b><span>모빌리티 체어, 사이니지 로봇, Oak-Bot</span></p></div>
              <div><time>2016</time><p style={{ margin: 0 }}><b>대한민국 로봇대상 국무총리 표창</b><span>AST 특허 미국·일본 등록, 코넥스 상장</span></p></div>
              <div><time>2006</time><p style={{ margin: 0 }}><b>Microsoft Robotics Studio 파트너</b><span>기업부설연구소 인정, BBC 한국 기술 특집 출연</span></p></div>
            </div>
            <ol className="tl" aria-label="연혁 요약">
              <li><time>2003</time><span>㈜로보쓰리 설립</span></li>
              <li><time>2004</time><span>벤처기업 인증 · 국내 최초 KBS 오케스트라 지휘 로봇</span></li>
              <li><time>2007</time><span>INNO-BIZ 선정 · 국책은행 초기 기술투자 유치</span></li>
              <li><time>2013</time><span>2000W 투휠 밸런싱 스쿠터 · 자이로휠 플랫폼</span></li>
              <li><time>2017</time><span>AI 기반 배달 서비스로봇 개발 착수</span></li>
              <li><time>2026</time><span>상호 변경 — ㈜로보쓰리에이아이 → ㈜솔루믹스</span></li>
            </ol>
          </div>
        </section>

        <section id="patents">
          <div className="wrap">
            <span className="eyebrow">Patents</span>
            <h2>특허 포트폴리오</h2>
            <div className="chips" role="group" aria-label="특허 필터">
              {FILTERS.map(([k, label]) => (
                <button key={k} type="button" className={`chip${f === k ? " on" : ""}`} aria-pressed={f === k} onClick={() => setF(k)}>{label}</button>
              ))}
            </div>
            <div className="pt">
              <table>
                <thead><tr><th>연도</th><th>발명의 명칭</th><th>번호</th></tr></thead>
                <tbody>{rows.map((p, i) => <tr key={i}><td className="n">{p[0]}</td><td>{p[1]}</td><td className="n">{p[2]}</td></tr>)}</tbody>
              </table>
            </div>
            <p className="lead" style={{ fontSize: 12.5 }}>대표 등록 특허만 표시했습니다. 전체 46건(국내 16 · 해외 30)을 보유하고 있습니다.</p>
          </div>
        </section>

        <section id="contact">
          <div className="wrap">
            <span className="eyebrow">Contact</span>
            <h2>사업 문의</h2>
            <dl className="info">
              <div><dt>대표전화</dt><dd>02-544-9145</dd></div>
              <div><dt>팩스</dt><dd>02-544-9146</dd></div>
              <div><dt>이메일</dt><dd>robo1@robo3.com</dd></div>
              <div><dt>주소</dt><dd style={{ fontFamily: "inherit" }}>서울 강동구 고덕비즈밸리로 26, 강동U1센터 B동 508호</dd></div>
            </dl>
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <div className="chips" role="group" aria-label="문의 분야">
                {PURPOSES.map((p) => (
                  <button key={p} type="button" className={`chip${purpose === p ? " on" : ""}`} aria-pressed={purpose === p} onClick={() => setPurpose(p)}>{p}</button>
                ))}
              </div>
              <label htmlFor="smx-nm">이름 / 회사명<input id="smx-nm" placeholder="홍길동 / ○○식품" /></label>
              <label htmlFor="smx-ph">연락처<input id="smx-ph" inputMode="tel" placeholder="010-0000-0000" /></label>
              <label htmlFor="smx-msg">문의 내용<textarea id="smx-msg" rows={4} placeholder="예) 매장 2곳에 서빙로봇 렌탈을 검토 중입니다." /></label>
              <button className="btn pri" type="submit">문의 보내기</button>
              <p className="note" aria-live="polite">{sent ? "시안 화면입니다. 정식 오픈 후에는 담당 부서로 바로 전달됩니다." : ""}</p>
            </form>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div className="logo" style={{ color: "var(--fg)" }}><Mark size={22} />SOLUMIX</div>
          <span>㈜솔루믹스 (구 ㈜로보쓰리에이아이) · 대표이사 황용운 · 사업자등록번호 206-81-84723</span>
          <span>서울 강동구 고덕비즈밸리로 26, 강동U1센터 B동 508호</span>
          <span>© SOLUMIX · Intelligence in Motion</span>
        </div>
      </footer>
    </div>
  );
}
