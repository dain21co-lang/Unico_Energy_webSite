/*
 * 사업성 가정 (안) — 사이트·IR이 같은 숫자를 쓰도록 한 곳에서 계산합니다. 단위: 만 원
 * 모델: 장기 투숙 비중 L(입실률 90%, 변동비 5%) + 단기 숙박(가동률 o, 변동비 25%) + 부가매출 5%(데이 유스·편의점 임대·세탁)
 * 임차료·감가상각·이자·세금 전. 공사비는 평당 250만 원 · 실당 가구 500만 원 가정.
 */
import { ROOMS, ROOMS2 } from "./data";

type R = { n: number; night: number; month: number };
const nightFull = (a: R[]) => a.reduce((s, r) => s + r.n * r.night, 0);
const monthFull = (a: R[]) => a.reduce((s, r) => s + r.n * r.month, 0);

export function model(rooms: R[], L: number, occ: number, fixed: number) {
  const longR = L * monthFull(rooms) * 0.9;
  const shortR = (1 - L) * nightFull(rooms) * 30 * occ;
  const extra = (longR + shortR) * 0.05;
  const rev = longR + shortR + extra;
  const eb = rev - fixed - longR * 0.05 - shortR * 0.25;
  return { longR, shortR, extra, rev, eb, yRev: (rev * 12) / 10000, yEb: (eb * 12) / 10000 };
}

export const FIXED1 = 1130; // 인건비 600 · 공과금·통신 350 · 시스템·보험·소모품 180
export const FIXED2 = 1550;
export const ROOMS1N = ROOMS.reduce((s, r) => s + r.n, 0); // 40
export const ROOMS_ALL = ROOMS1N + ROOMS2.reduce((s, r) => s + r.n, 0); // 56

export const SCEN = [
  { k: "보수", L: 0.7, occ: 0.55, d: "장기 70% · 단기 가동률 55%" },
  { k: "기준", L: 0.5, occ: 0.65, d: "장기 50% · 단기 가동률 65%" },
  { k: "상향", L: 0.3, occ: 0.75, d: "장기 30% · 단기 가동률 75%" },
].map((s) => ({ ...s, ...model(ROOMS, s.L, s.occ, FIXED1) }));

export const PHASE2 = model([...ROOMS, ...ROOMS2], 0.5, 0.65, FIXED2);

export const CAPEX1 = [
  { t: "인테리어 · 객실 구획", d: "4·5층 약 276평 × 평당 250만 원", v: 6.9 },
  { t: "가구 · 침구 · 가전", d: "40실 × 실당 500만 원", v: 2.0 },
  { t: "무인 시스템 · IT · 보안", d: "키오스크·도어락·PMS·관제·와이파이", v: 1.0 },
  { t: "오픈 · 예비비", d: "인허가·마케팅·운전자금", v: 1.0 },
];
export const CAPEX1_SUM = CAPEX1.reduce((s, c) => s + c.v, 0); // 10.9억
export const CAPEX2_ADD = 4.0; // 2단계 16실 추가 (안)
export const COST1 = [
  { c: "#c9a96e", t: "인건비", d: "현장 관리 1 · 청소 파트타임", v: 600 },
  { c: "#ecdcb6", t: "공과금 · 통신", d: "전기·수도·가스·인터넷", v: 350 },
  { c: "#5fb7a0", t: "시스템 · 보험 · 소모품", d: "PMS·도어락·관제 구독 등", v: 180 },
];
