"use client";
/* GIIB 금박 모션 로고 (2026-11-28)
   - 두 개의 I = 자산 쪽 · 자문 쪽 두 기둥(타워)이 솟아오름
   - G·B는 금선으로 그려진 뒤 아래에서 위로 금박이 차오름
   - 궤도 링(글로벌)이 글자 뒤→앞으로 감싸고, 작은 빛이 링을 따라 돎
   - 투명도 애니메이션 없이 길이·크기·마스크·위치만 사용 */
import { useId } from "react";
import type React from "react";
import { motion } from "framer-motion";
import { GL_G, GL_B, GL_XB, GL_T1, GL_T2, GL_TW, GL_W, GL_TAG, GL_TAGW } from "./giibLogoPaths";

const E = [0.16, 1, 0.3, 1] as const;
const BASE = 1000; // 글자 기준선(y)
const CX = GL_W / 2, CY = 640, RX = 1240, RY = 210;
const T1H = 800, T2H = 900;
const tower = (x: number, h: number) => `${x},${BASE} ${x + GL_TW},${BASE} ${x + GL_TW},${BASE - h} ${x},${BASE - h + 70}`;
const TAG_S = (GL_W * 0.86) / GL_TAGW;
const TAG_X = (GL_W - GL_TAGW * TAG_S) / 2;
const TAG_Y = 1268;

export default function GiibLogo({ animate = true, className, style, tagline = true, dark = true }: { animate?: boolean; className?: string; style?: React.CSSProperties; tagline?: boolean; dark?: boolean }) {
  const id = useId().replace(/:/g, "");
  const gold = `url(#${id}g)`, gold2 = `url(#${id}g2)`;
  const a = animate;
  const T = (delay: number, duration = 1) => ({ duration: a ? duration : 0, delay: a ? delay : 0, ease: E });
  const letters = (
    <>
      <path d={GL_G} transform={`translate(0 ${BASE}) scale(1 -1)`} />
      <path d={GL_B} transform={`translate(${GL_XB} ${BASE}) scale(1 -1)`} />
    </>
  );
  const vbH = tagline ? 1330 : 1090;
  return (
    <svg viewBox={`-300 40 ${GL_W + 600} ${vbH}`} className={className} style={style} role="img" aria-label="GIIB Global Infra Hub">
      <defs>
        <linearGradient id={`${id}g`} gradientUnits="userSpaceOnUse" x1="0" y1="260" x2="0" y2="1010">
          <stop offset="0" stopColor={dark ? "#fff3c8" : "#e9c97f"} />
          <stop offset=".38" stopColor="#e2bd6c" />
          <stop offset=".56" stopColor="#9c6d24" />
          <stop offset=".76" stopColor="#e9c97f" />
          <stop offset="1" stopColor="#b8862f" />
        </linearGradient>
        <linearGradient id={`${id}g2`} gradientUnits="userSpaceOnUse" x1="0" y1="90" x2="0" y2="1010">
          <stop offset="0" stopColor="#fff8dc" />
          <stop offset=".3" stopColor="#f0d48e" />
          <stop offset=".62" stopColor="#c99a45" />
          <stop offset="1" stopColor="#8f6420" />
        </linearGradient>
        <linearGradient id={`${id}sh`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".75" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}sp`}>
          <stop offset="0" stopColor="#fff" />
          <stop offset=".35" stopColor="#fff2c4" />
          <stop offset="1" stopColor="#e2bd6c" stopOpacity="0" />
        </radialGradient>
        {/* 금박이 아래에서 위로 차오르는 창 */}
        <clipPath id={`${id}fill`} clipPathUnits="userSpaceOnUse">
          <motion.rect x="-100" width={GL_W + 200} height="900" initial={{ y: a ? BASE + 20 : 260 }} animate={{ y: 260 }} transition={T(1.25, 1.1)} />
        </clipPath>
        {/* 반짝임이 지나갈 글자 모양 */}
        <clipPath id={`${id}shape`} clipPathUnits="userSpaceOnUse">
          {letters}
          <polygon points={tower(GL_T1, T1H)} />
          <polygon points={tower(GL_T2, T2H)} />
        </clipPath>
        {tagline && (
          <clipPath id={`${id}tag`} clipPathUnits="userSpaceOnUse">
            <motion.rect y={TAG_Y - 160} height="220" initial={{ x: a ? CX : -100, width: a ? 0 : GL_W + 200 }} animate={{ x: -100, width: GL_W + 200 }} transition={T(2.3, 1.1)} />
          </clipPath>
        )}
        <path id={`${id}orbit`} d={`M ${CX - RX} ${CY} A ${RX} ${RY} 0 1 1 ${CX + RX} ${CY} A ${RX} ${RY} 0 1 1 ${CX - RX} ${CY}`} />
      </defs>

      {/* 궤도 링 — 뒤쪽 반원 */}
      <g transform={`rotate(-9 ${CX} ${CY})`}>
        <motion.path d={`M ${CX - RX} ${CY} A ${RX} ${RY} 0 0 1 ${CX + RX} ${CY}`} fill="none" stroke={gold} strokeWidth="16" strokeLinecap="round"
          initial={{ pathLength: a ? 0 : 1 }} animate={{ pathLength: 1 }} transition={T(1.6, 0.9)} />
      </g>

      {/* 두 기둥(타워) — 아래에서 솟아오름 */}
      {[[GL_T1, T1H, 0.2], [GL_T2, T2H, 0.38]].map(([x, h, d]) => (
        <motion.g key={x} style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }} initial={{ scaleY: a ? 0 : 1 }} animate={{ scaleY: 1 }} transition={T(d, 1.1)}>
          <polygon points={tower(x, h)} fill={gold2} />
          <line x1={x + GL_TW / 2} x2={x + GL_TW / 2} y1={BASE - h + 150} y2={BASE - 40} stroke="#7a5418" strokeWidth="6" />
        </motion.g>
      ))}

      {/* G · B — 금선으로 그린 뒤 금박이 차오름 */}
      <g fill="none" stroke={gold} strokeWidth="7">
        <motion.path d={GL_G} transform={`translate(0 ${BASE}) scale(1 -1)`} initial={{ pathLength: a ? 0 : 1 }} animate={{ pathLength: 1 }} transition={T(0.45, 1.3)} />
        <motion.path d={GL_B} transform={`translate(${GL_XB} ${BASE}) scale(1 -1)`} initial={{ pathLength: a ? 0 : 1 }} animate={{ pathLength: 1 }} transition={T(0.6, 1.3)} />
      </g>
      <g clipPath={`url(#${id}fill)`}><g fill={gold}>{letters}</g></g>

      {/* 반짝임 띠 — 주기적으로 글자 위를 지나감 */}
      <g clipPath={`url(#${id}shape)`}>
        <rect className="gi-logo-sheen" x="-700" y="60" width="420" height="1000" fill={`url(#${id}sh)`} transform="skewX(-18)" />
      </g>

      {/* 궤도 링 — 앞쪽 반원 (글자 위로 지나감) */}
      <g transform={`rotate(-9 ${CX} ${CY})`}>
        <motion.path d={`M ${CX + RX} ${CY} A ${RX} ${RY} 0 0 1 ${CX - RX} ${CY}`} fill="none" stroke={gold} strokeWidth="26" strokeLinecap="round"
          initial={{ pathLength: a ? 0 : 1 }} animate={{ pathLength: 1 }} transition={T(2.0, 0.9)} />
        {/* 링을 따라 도는 빛 */}
        <circle r="34" fill={`url(#${id}sp)`}>
          <animateMotion dur="7s" begin={a ? "3s" : "0s"} repeatCount="indefinite" rotate="auto">
            <mpath href={`#${id}orbit`} />
          </animateMotion>
        </circle>
      </g>

      {tagline && (
        <g clipPath={`url(#${id}tag)`}>
          <line x1="-60" x2={TAG_X - 60} y1={TAG_Y - 50} y2={TAG_Y - 50} stroke={gold} strokeWidth="5" />
          <line x1={GL_W - TAG_X + 60} x2={GL_W + 60} y1={TAG_Y - 50} y2={TAG_Y - 50} stroke={gold} strokeWidth="5" />
          <g fill={gold} transform={`translate(${TAG_X} ${TAG_Y}) scale(${TAG_S} ${-TAG_S})`}>
            {GL_TAG.map(([x, d], i) => <path key={i} d={d} transform={`translate(${x} 0)`} />)}
          </g>
        </g>
      )}
    </svg>
  );
}

/* 머리글용 작은 마크 — 두 기둥과 궤도 링 */
export function GiibMini({ size = 32 }: { size?: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}m`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff3c8" /><stop offset=".45" stopColor="#e2bd6c" /><stop offset=".7" stopColor="#9c6d24" /><stop offset="1" stopColor="#e9c97f" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="#1c2414" />
      <path d="M8 38 A24 7 0 0 1 56 38" transform="rotate(-9 32 38)" fill="none" stroke={`url(#${id}m)`} strokeWidth="1.6" />
      <polygon points="22,50 30,50 30,17 22,21" fill={`url(#${id}m)`} />
      <polygon points="34,50 42,50 42,11 34,15" fill={`url(#${id}m)`} />
      <path d="M56 38 A24 7 0 0 1 8 38" transform="rotate(-9 32 38)" fill="none" stroke={`url(#${id}m)`} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}
