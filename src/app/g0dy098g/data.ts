/*
 * ㈜글로벌인프라허브 임시 홈페이지 — 회사 정보
 * 비워 둔 값("")은 화면에 "입력 대기"로 표시됩니다. 확인되면 이 파일만 고치면 됩니다.
 */
export const CO = {
  nameKo: "주식회사 글로벌인프라허브",
  brand: "GIIB",
  nameEn: "GLOBAL INFRA HUB",
  ceo: "유현근",
  bizNo: "622-88-00109",
  founded: "2015년 5월",
  address: "", // 등기 정리 후 본점 소재지 변경 예정
  phone: "",
  email: "",
};

export const BUSINESS = [
  {
    no: "01",
    t: "부동산 투자",
    en: "REAL ESTATE INVESTMENT",
    d: "수익형·개발형 부동산을 발굴하고, 권리관계와 수익 구조를 검토해 보유와 운용에 맞는 투자 구조를 설계합니다.",
    items: ["투자 대상 자산 발굴·선별", "권리관계·담보 구조 검토", "보유·운용 구조 설계", "매각·출구 전략 수립"],
  },
  {
    no: "02",
    t: "부동산 개발",
    en: "DEVELOPMENT",
    d: "부지 검토부터 인허가, 사업성 분석, 자금조달 구조까지 개발사업의 처음과 끝을 함께 설계합니다.",
    items: ["부지·입지 검토", "인허가·사업 일정 검토", "사업성(수지) 분석", "PF·브릿지 자금 구조 자문"],
  },
  {
    no: "03",
    t: "투자자문",
    en: "INVESTMENT ADVISORY",
    d: "투자자와 사업자 사이에서 실사와 구조화를 맡아, 숫자와 서류로 판단할 수 있는 자문을 제공합니다.",
    items: ["투자 실사(Due Diligence)", "재무·세무 구조 검토", "투자 조건·계약 구조 자문", "기관·금융사 연계"],
  },
];

export const PROCESS = [
  { t: "발굴", en: "SOURCING", d: "자산과 사업 기회를 찾고, 투자 기준에 맞는지 1차로 걸러냅니다." },
  { t: "실사", en: "DUE DILIGENCE", d: "등기·인허가·재무 서류를 원본과 대조해 숨은 위험을 먼저 찾습니다." },
  { t: "구조화", en: "STRUCTURING", d: "담보·자금조달·보유 구조를 설계하고 투자 조건을 정리합니다." },
  { t: "실행·관리", en: "EXECUTION", d: "계약과 자금 집행 이후에도 사업 진행과 출구까지 함께 관리합니다." },
];

export const PRINCIPLES = [
  { t: "서류로 확인합니다", d: "말보다 등기부와 재무제표를 먼저 봅니다." },
  { t: "위험을 먼저 말합니다", d: "좋은 점보다 걸리는 점을 먼저 정리해 드립니다." },
  { t: "구조로 지킵니다", d: "담보·계약 구조로 투자자의 원금을 보호합니다." },
  { t: "끝까지 관리합니다", d: "투자 이후 출구까지 책임 있게 관리합니다." },
];

/* 사진 자리 — 파일을 public/g0dy098g/ 에 넣고 이름을 적으면 표시됩니다. 비어 있으면 그래픽으로 대신합니다 */
export const IMAGES: Record<string, string> = {
  hero: "hero.webp", // 서울 야경 스카이라인(세로)
  invest: "invest.webp", // 빌딩 앞을 걷는 투자 담당자
  develop: "develop.webp", // 공사 현장 검토
  advisory: "advisory.webp", // 회의실 자문
  approach: "approach.webp", // 공사 현장(두 번째 컷)
  city: "city.webp", // 한강 야경
};

/* 사진에서 보여줄 위치(가로 세로 %). 잘리는 부분이 있으면 숫자만 바꾸면 됩니다 */
export const IMG_POS: Record<string, string> = {
  hero: "28% 50%",
  invest: "30% 40%",
  develop: "40% 50%",
  advisory: "45% 50%",
  approach: "30% 50%",
  city: "50% 50%",
};
