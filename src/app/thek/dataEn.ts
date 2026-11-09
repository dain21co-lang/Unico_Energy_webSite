/*
 * 더케이 스마트호스텔(가칭) 임시 홈페이지 — 사업 데이터
 * 이 파일만 고치면 화면 전체에 반영됩니다.
 * 출처: appr = 감정평가서(중앙감정평가법인, 2021.10.28 기준) · lease = 임대현황표(2026.02.28) · bro = 분양 브로슈어(칸하우스)
 * '(안)' 표시 수치는 설계·시장조사 전 사업 가정치입니다.
 */

export const PROJECT = {
  nameKo: "THE K Smart Hostel",
  nameEn: "THE K SMART HOSTEL",
  tag: "provisional",
  building: "The K Building",
  address: "958-12 Geumchon-dong, Paju, Gyeonggi-do",
  roadAddress: "20 Hanmaeum 2-gil",
  /* 확인되면 입력: 비워 두면 화면에 "Not entered"로 표시됩니다 */
  operator: "",
  phone: "",
  email: "",
};

/* 건물 기본 현황 — 감정평가서·브로슈어 기재 */
export const BUILDING: [string, string][] = [
  ["Structure", "Reinforced concrete · B1 + 5 floors"],
  ["Floor area", "4,414.16㎡"],
  ["Site area", "1,358.1㎡"],
  ["Completed", "April 20, 2020"],
  ["Units", "26 units · retail and offices"],
  ["Parking", "39 self-park spaces (9 ground · 30 underground)"],
  ["Systems", "Elevator · sprinklers · fire detection"],
  ["Zoning", "Type 2 general residential"],
  ["Road frontage", "approx. 15m east · approx. 8m southwest/south"],
];

export type UnitState = "use" | "vacant" | "check";
/* 층별 호실 — 임대현황표(2026.02.28) 기준 '사용/공실'만 표시. 임대 조건은 싣지 않음. 현황은 수시로 바뀜 */
export const FLOORS: { f: string; use: string; units: { n: string; m2: number; s: UnitState }[] }[] = [
  { f: "5F", use: "Offices", units: [{ n: "501", m2: 145.9, s: "use" }, { n: "502", m2: 151.05, s: "use" }, { n: "503", m2: 101.95, s: "check" }] },
  { f: "4F", use: "Offices", units: [{ n: "401", m2: 135.25, s: "use" }, { n: "402", m2: 128.21, s: "vacant" }, { n: "403", m2: 113.78, s: "vacant" }, { n: "404", m2: 135.91, s: "vacant" }] },
  { f: "3F", use: "Retail · offices", units: [{ n: "301", m2: 99.03, s: "use" }, { n: "302", m2: 84.18, s: "use" }, { n: "303", m2: 92.47, s: "vacant" }, { n: "304", m2: 141.27, s: "use" }, { n: "305", m2: 160.93, s: "use" }] },
  { f: "2F", use: "Retail", units: [{ n: "201", m2: 83.34, s: "vacant" }, { n: "202", m2: 80.42, s: "use" }, { n: "203", m2: 85.24, s: "vacant" }, { n: "204", m2: 97.85, s: "vacant" }, { n: "205", m2: 99.55, s: "vacant" }, { n: "206", m2: 106.1, s: "use" }, { n: "207", m2: 101.2, s: "check" }] },
  { f: "1F", use: "Retail", units: [{ n: "101", m2: 59.57, s: "vacant" }, { n: "102", m2: 60.26, s: "use" }, { n: "103", m2: 66.67, s: "vacant" }, { n: "104", m2: 63.74, s: "use" }, { n: "105", m2: 69.78, s: "use" }, { n: "106", m2: 97.44, s: "use" }, { n: "107", m2: 102.67, s: "use" }] },
];

/* 호스텔 공간 계획 (안) — 소유주 측 확인: 2층(파인리버힐)·3층(노래방 제외)·4층(교회) 명도 가능, 5층은 놀이층으로 */
export const CANDIDATES = [
  {
    k: "Phase 1", f: "3F–4F", units: "Units 301·302·303·305 · 401–404", m2: 949.76, img: "plan-4f",
    pros: ["Two floors dedicated to the hostel, separate from ground-floor shops", "Terraces (301·304·305·401·403) for lounge and rest areas", "Everything in one building with the 5F play floor and 1F store"],
    cons: ["Vacating 401 and 3F tenants · 304 karaoke to move to 5F"],
  },
  {
    k: "Phase 2", f: "2F", units: "Units 201–205", m2: 446.4, img: "plan-2f",
    pros: ["4 vacant units + vacating unit 202", "Direct access to 2F by elevator and outdoor stairs"],
    cons: ["Coordinate access and noise with operating units such as 206"],
  },
];

/* 객실 구성 (안) — 1단계 3·4층 40실 기준 가정. 설계 후 바뀜 */
export const ROOMS = [
  { k: "single", t: "Smart Single", en: "SINGLE", m2: 9, n: 26, bed: "1 single bed", month: 50, night: 4.5, d: "For solo students, workers and business travelers. Private bath, desk, mobile key." },
  { k: "double", t: "Smart Double", en: "DOUBLE", m2: 12, n: 10, bed: "1 double bed", month: 62, night: 6, d: "For couples and pairs. Private bath, sofa with storage." },
  { k: "family", t: "Family Twin", en: "FAMILY", m2: 16, n: 4, bed: "2 singles + bunk bed", month: 75, night: 8, d: "For families and small groups, up to 3–4 people." },
];
/* 2단계(2층) 추가 객실 (안) */
export const ROOMS2 = [{ n: 13, night: 4.5, month: 50 }, { n: 5, night: 6, month: 62 }, { n: 2, night: 8, month: 75 }];

/* 장기 체류 플랜 (Zoku형) — 월 단위 */
export const LONGSTAY = {
  t: "STAY 30", sub: "Monthly living plan", from: 50,
  d: "A monthly plan for students, foreign workers and posted staff staying weeks to months. Unpack, work and rest — all in one place.",
  items: ["Monthly contract · minimal deposit", "Weekly cleaning · fresh linens", "Unlimited work lounge and shared kitchen", "Parcel pickup · luggage storage"],
};

/* 객실 기본 제공 */
export const AMENITIES = [
  { t: "Mobile key", icon: "key" }, { t: "Private bath", icon: "drop" }, { t: "Own heating & AC", icon: "bolt" },
  { t: "Private Wi-Fi", icon: "wifi" }, { t: "Work desk", icon: "desk" }, { t: "Fresh linens", icon: "bed" },
];

/* 공용시설 — img는 AI 이미지 파일명 (AI_READY에 있을 때만 사진 표시) */
export const FACILITIES = [
  { k: "lounge", t: "Smart lounge", en: "SMART LOUNGE", d: "A shared lounge for waiting, laptop work and conversations between travelers.", icon: "sofa" },
  { k: "kitchen", t: "Shared kitchen", en: "KITCHEN", d: "Simple cooking and self-serve breakfast (plan). Home base for long-stay guests.", icon: "cup" },
  { k: "work", t: "Work zone", en: "WORK ZONE", d: "Seats with outlets and video-call booths (plan). Keep working on the road.", icon: "desk" },
  { k: "laundry", t: "Laundry & lockers", en: "LAUNDRY & LOCKER", d: "Coin washers and dryers, plus smart lockers for bags after check-out.", icon: "wash" },
  { k: "store", t: "K-Convenience store (planned)", en: "24H K-STORE", d: "About 66㎡ on 1F — 24-hour quick meals and Han River–style ramen. The Korean convenience store guests know from K-dramas.", icon: "cup" },
  { k: "play", t: "5F play floor (planned)", en: "PLAY FLOOR", d: "Coin karaoke, comic café, billiards and live opera — evenings without leaving the building.", icon: "users" },
  { k: "parking", t: "39 parking spaces", en: "PARKING", d: "9 ground, 30 underground — more parking than nearby stays.", icon: "home" },
];

/* 첫 화면·섹션 사진 슬롯 — 받은 AI 이미지 파일명(확장자 없이)을 여기에 추가하면 자동으로 사진이 들어갑니다 */
export const AI_READY: string[] = ["hero", "checkin", "room-single", "room-double", "room-family", "longstay", "lounge", "kitchen", "work", "laundry", "security", "store", "play"];

/* 투숙 흐름 — AI·IoT 운영 (도입 범위는 협의 중) */
export const JOURNEY = [
  { t: "Book", en: "BOOK", d: "Book on an app or booking site and verify your identity on your phone.", tags: ["Mobile ID check", "Multilingual"] },
  { t: "Self check-in", en: "CHECK-IN", d: "No front desk — enter with the kiosk or a QR code on your phone. Your room opens with a mobile key.", tags: ["24h check-in", "Mobile key"] },
  { t: "During your stay", en: "STAY", d: "An AI concierge answers questions 24/7, and room lights and climate adjust automatically when you're in or out.", tags: ["AI chatbot", "IoT energy control"] },
  { t: "Safety", en: "SAFETY", d: "Common-area CCTV, entry logs and fire or anomaly alerts go straight to the manager's phone. A corridor patrol robot is under review.", tags: ["Remote monitoring", "Patrol robot (review)"] },
  { t: "Check-out", en: "CHECK-OUT", d: "Payment settles automatically, the room is assigned for cleaning, and the inspection is logged in the app.", tags: ["Auto payment", "Cleaning dispatch"] },
];

/* 예상 수요층 — 사업 가정 (시장조사 전) */
export const NEARBY = [
  { t: "Gyeongui–Jungang Line", d: "Geumchon · Geumneung stations" },
  { t: "Bus", d: "Bus stops near the building" },
  { t: "Car", d: "39 parking spaces in the building" },
];
export const TRIPS = ["Imjingak · DMZ", "Heyri Art Village", "Paju Book City", "Paju Premium Outlets"];

export const DEMAND = [
  { t: "Students · foreign workers", d: "Long stays for students and workers from the Middle East, Taiwan and Southeast Asia", icon: "users" },
  { t: "Business trips", d: "Short-term staff at Paju's industrial parks and sites", icon: "brief" },
  { t: "Tourism", d: "Visitors to Imjingak/DMZ, Heyri and Book City", icon: "map" },
  { t: "Day use", d: "Hourly daytime rest or work", icon: "home" },
];

/* 감정평가서 기재 입지 */
export const LOCATION = [
  "Near the south side of Geumchon Rotary",
  "Bus stops nearby; Geumneung Station (Gyeongui–Jungang Line) further southwest",
  "Surrounded by shops, with apartments behind",
  "Faces a ~15m road to the east and ~8m roads to the southwest/south",
];

/* 사업 전 확인할 사항 */
export const CHECKS = [
  { t: "Hostel registration (Tourism Promotion Act)", s: "Key", d: "Under the Tourism Promotion Act, tourist lodging (including hostels) is allowed in general residential zones with business plan approval. The building meets the hostel requirement of 'frontage on a road 8m or wider' (15m east · 8m southwest). Registration and change-of-use steps will be confirmed with Paju City." },
  { t: "Vacating · floor plan", s: "Confirmed", d: "Owner confirmed: 2F, 3F (except karaoke) and 4F can be vacated; 5F becomes a play floor with live opera, karaoke and billiards. Timing and terms go into the contract." },
  { t: "Trust consent", s: "Confirmed", d: "The building is held in a security trust; change of use and interior works need the trustee's and senior beneficiary's consent." },
  { t: "Fire & safety", s: "Confirmed", d: "The building has sprinklers and fire detection; lodging safety standards for evacuation and fire separation will be met in design." },
  { t: "Existing tenants", s: "In talks", d: "Access, noise and shared costs will be agreed with operating units on 1F–3F." },
];

/* 대표 인사말 — 이력서 기준 약력만 게재 (생년월일·주소·연락처는 싣지 않음). 인사말은 초안 */
export const CEO = {
  name: "Jaecheol Choi", title: "CEO",
  headline: ["Open the door,", "and someone is waiting for you"],
  body: [
    "For fifteen years I lived as a reporter. I went wherever the story was, and spent many nights in unfamiliar cities.",
    "What I hoped for each time was nothing grand: a door still open when I arrived late, a clean room to rest a tired body, and one night when I could sleep without worry.",
    "THE K begins there. Even with no one at the front desk, no one should feel alone — technology works quietly out of sight, and the space welcomes you warmly.",
    "As a journalist I held on to two things: checking the facts, and keeping every promise to the end. Now I will keep those principles inside one building.",
  ],
  closing: "Geumchon, Paju — where your day comes to rest.\nTonight, too, we'll leave the light on for you.",
  career: [
    { y: "2025", t: "Left TV Chosun News" },
    { y: "2020", t: "TV Chosun News, editorial desk" },
    { y: "2019", t: "Journalists Association secretary" },
    { y: "2012–", t: "TV Chosun social & political affairs reporter" },
    { y: "2011", t: "Joined TV Chosun News" },
    { y: "2010", t: "SBS investigative team" },
    { y: "2009", t: "Graduated, Kyungil University" },
  ],
};

export const ROADMAP = [
  { t: "Permits · vacating · trust", d: "Hostel registration, vacating 3F–4F, moving karaoke to 5F, trust consent" },
  { t: "Design & estimates", d: "Room layout, fire standards, construction and equipment quotes" },
  { t: "Construction & systems", d: "Interiors, self check-in and IoT" },
  { t: "Phase 1 opening", d: "40 rooms on 3F–4F — long and short stays" },
  { t: "Phase 2 expansion", d: "20 more rooms on 2F (60 total)" },
];
