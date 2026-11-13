/*
 * 신촌 스마트호스텔 — 원도면(2004) 치수 기준 개략 모델 데이터
 * 좌표: x = 서→동(m), z = 북→남(m), 원점 = 기준층 본체 북서 모서리 (X1·Y1)
 * 본체 12.2 × 10.4m (X1~X3, Y1~Y3) · 2~3층 동측 날개 · 남측 코어(계단·승강기) · 동측 비상계단
 * 객실 칸은 배치(안)이며, 실측·확정 설계가 아니다.
 */
export type RoomType = "s" | "t" | "sh";
export type Rect = [number, number, number, number]; // x0, z0, x1, z1
export type Room = { t: RoomType; r: Rect };
export type FloorKind = "lobby" | "f23" | "typ" | "f9";

export const PLATE: Rect = [0, 0, 12.2, 10.4];
export const WING: Rect = [12.2, 0, 25.5, 7.0]; // 2층 도면 동측 날개
export const CORE: Rect = [3.6, 10.4, 9.5, 14.0]; // 주계단
export const EV: Rect = [2.7, 14.0, 5.6, 17.6]; // 승강기
export const ESTAIR_TYP: Rect = [13.5, 0, 15.4, 4.5]; // 4~9층 동측 비상계단
export const ESTAIR_LOW: Rect = [19.1, -4.4, 26.5, 0]; // 2~3층 날개 북측 계단

export const H1 = 4.2; // 1층 층고(가정)
export const HF = 3.3; // 기준층 층고(가정)
export const floorY = (k: number) => (k <= 1 ? 0 : H1 + (k - 2) * HF);
export const floorH = (k: number) => (k === 1 ? H1 : HF);
export const ROOF_Y = floorY(10);

export const kindOf = (k: number): FloorKind => (k === 1 ? "lobby" : k <= 3 ? "f23" : k === 9 ? "f9" : "typ");

const TYP: Room[] = [
  { t: "s", r: [0.3, 0.3, 5.1, 3.6] },
  { t: "s", r: [0.3, 3.6, 5.1, 6.9] },
  { t: "s", r: [0.3, 6.9, 5.1, 10.1] },
  { t: "t", r: [6.9, 0.3, 11.9, 3.9] },
  { t: "s", r: [6.9, 5.0, 11.9, 7.55] },
  { t: "s", r: [6.9, 7.55, 11.9, 10.1] },
];
const F23: Room[] = [
  { t: "sh", r: [0.3, 0.3, 6.0, 5.0] },
  { t: "sh", r: [0.3, 5.4, 6.0, 10.1] },
  { t: "t", r: [7.0, 0.3, 11.9, 3.6] },
  { t: "s", r: [7.0, 3.6, 11.9, 6.8] },
  { t: "t", r: [7.0, 6.8, 11.9, 10.1] },
  { t: "sh", r: [12.5, 0.3, 15.5, 6.1] },
  { t: "sh", r: [15.5, 0.3, 18.5, 6.1] },
  { t: "sh", r: [18.5, 0.3, 21.5, 6.1] },
  { t: "t", r: [21.5, 0.3, 23.6, 6.1] },
  { t: "s", r: [23.6, 0.3, 25.2, 6.1] },
];
const F9: Room[] = [TYP[0], TYP[1], TYP[2], { t: "s", r: [6.9, 0.3, 11.9, 3.9] }];

export const ROOMS: Record<FloorKind, Room[]> = { lobby: [], f23: F23, typ: TYP, f9: F9 };
// 서비스 칸(린넨·세탁 / 복도) — 평면 그림용
export const SERVICE: Record<FloorKind, { label: string; r: Rect }[]> = {
  lobby: [],
  f23: [{ label: "복도", r: [6.0, 0.3, 7.0, 10.1] }, { label: "복도", r: [12.5, 6.1, 25.2, 6.8] }],
  typ: [{ label: "린넨", r: [5.1, 0.3, 6.9, 2.6] }, { label: "복도", r: [5.1, 2.6, 6.9, 10.1] }, { label: "복도", r: [6.9, 3.9, 11.9, 5.0] }],
  f9: [{ label: "린넨", r: [5.1, 0.3, 6.9, 2.6] }, { label: "복도", r: [5.1, 2.6, 6.9, 10.1] }, { label: "지붕발코니", r: [6.9, 3.9, 11.9, 10.1] }],
};

export const COLORS: Record<RoomType, string> = { s: "#f3efe4", t: "#dcc29b", sh: "#8edbd3" };
export const LABEL: Record<RoomType, string> = { s: "1인실", t: "2인실", sh: "3인 셰어룸" };

export const countRooms = () => {
  const c = { s: 0, t: 0, sh: 0 };
  for (let k = 2; k <= 9; k++) for (const r of ROOMS[kindOf(k)]) c[r.t]++;
  return c; // s 33 · t 11 · sh 10 → 54실
};
