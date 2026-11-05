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
  address: "서울특별시 (본점 이전 예정)", // 등기 정리 후 실제 주소로 교체
  phone: "", // 비워 두면 줄이 숨겨집니다
  email: "contact@giibgroup.com", // 가상 — 실제 메일 개설 후 교체
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
  hero: "hero.webp", // 서울 야경 스카이라인(세로 9:16)
  invest: "invest.webp", // 빌딩 앞을 걷는 투자 담당자
  develop: "develop.webp", // 공사 현장 검토
  advisory: "advisory.webp", // 회의실 자문
  approach: "approach.webp", // 현장 실사(손전등으로 균열 확인)
  city: "city.webp", // 한강 야경
  ceo: "ceo.webp", // 유현근 대표 프로필(AI 연출)
  case1: "case1.webp", // 사례 카드 — 오피스 (비어 있으면 그래픽)
  case2: "case2.webp", // 사례 카드 — 주거복합 개발부지
  case3: "case3.webp", // 사례 카드 — 관광호텔 리뉴얼
  case4: "case4.webp", // 사례 카드 — 상장사 담보 자금조달
};

/* 움직이는 사진(GIF→MP4) — 같은 이름의 사진 위에 영상이 겹쳐 재생됩니다. 비우면 사진만 */
export const VIDEOS: Record<string, string> = {
  invest: "video/invest.mp4", // 사업영역 '부동산 투자' — 빌딩 앞을 걷는 모습
  develop: "video/develop.mp4", // 사업영역 '부동산 개발' — 크레인 현장
  advisory: "video/advisory.mp4", // 사업영역 '투자자문' — 회의실
  approach: "video/approach.mp4", // '투자 접근' — 현장 실사
  city: "video/city.mp4", // 사업실적 아래 한강 야경
};

/* 첫 화면 배경 영상 — 비우면 hero 사진만 보입니다 (영상이 뜨기 전에도 사진이 먼저 보임) */
export const HERO_VIDEO = "video/hero.mp4"; // 챗GPT GIF → MP4 변환(부드럽게 보간)

/* 사진에서 보여줄 위치(가로 세로 %). 잘리는 부분이 있으면 숫자만 바꾸면 됩니다 */
export const IMG_POS: Record<string, string> = {
  hero: "35% 62%",
  invest: "30% 40%",
  develop: "40% 50%",
  advisory: "45% 50%",
  approach: "55% 40%",
  city: "50% 50%",
  ceo: "50% 22%",
  case1: "62% 45%",
  case2: "50% 60%",
  case3: "45% 45%",
  case4: "40% 55%",
};

/*
 * ── 맛보기용 가상 콘텐츠 (유이사 전용 시안) ──
 * 아래 숫자·사례는 화면 구성을 보여주기 위한 예시입니다. 실제 실적이 오면 이 부분만 바꾸면 됩니다.
 * SAMPLE = false 로 바꾸면 화면의 '예시' 표시가 사라집니다(실제 자료로 바꾼 뒤에만).
 */
export const SAMPLE = true;

export const RECORD_STATS = [
  { n: 2400, unit: "억 원", t: "검토 자산 규모" },
  { n: 18, unit: "건", t: "실사·검토 자산" },
  { n: 6, unit: "건", t: "구조화 자문" },
];

export const CASES = [
  { tag: "오피스", t: "도심 노후 오피스 리포지셔닝", d: "권리관계 정리 후 리모델링·임대 재구성으로 자산가치를 높이는 투자 구조 설계", size: "약 620억", role: "투자 구조 설계", img: "case1" },
  { tag: "개발", t: "수도권 주거복합 개발부지", d: "인허가 일정과 사업수지를 검토하고 브릿지→본PF 전환 구조를 자문", size: "약 980억", role: "사업성 분석 · PF 자문", img: "case2" },
  { tag: "호텔·관광", t: "지방 관광호텔 리뉴얼", d: "기투입 공사비 증빙을 대조하고 운영사 연계로 재개장 구조를 설계", size: "약 350억", role: "실사 · 구조화", img: "case3" },
  { tag: "투자자문", t: "상장사 부동산 담보 자금조달", d: "보유 부동산을 담보로 한 자금조달 구조와 투자 조건을 정리", size: "약 450억", role: "투자자문", img: "case4" },
];

export const SECTORS = [
  { t: "오피스", v: 35, c: "#10223a" },
  { t: "개발부지", v: 25, c: "#b98a52" },
  { t: "호텔·관광", v: 20, c: "#e9d2ad" },
  { t: "물류·기타", v: 20, c: "#8a95a3" },
];
