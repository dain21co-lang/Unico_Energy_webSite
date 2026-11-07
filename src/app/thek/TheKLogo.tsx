"use client";
/* THE K 로고 — "the"(Great Vibes 필기체) + "K"(Bodoni Moda 디도체) + 불 켜지는 점.
   모션: K 윤곽이 네온처럼 그려지고 → 금빛이 아래에서 차오르고 → "the"가 손글씨처럼 쓰이고 → 점에 불이 켜짐 → 주기적으로 빛이 스침 */
import { useId, useRef } from "react";
import { motion, useInView } from "framer-motion";

const K_D = "M36 -52.1 141.4 -175.3H115.9V-180H173.5V-175.3H148.1L42.7 -52.1ZM5.4 0V-4.7H27.1V-175.3H5.4V-180H88.3V-175.3H64.4V-4.7H85.9V0ZM97.9 0V-4.7H119.8L70.8 -90.8L95.5 -118.4L162.8 -4.7H184.3V0Z";
const THE_D = "M25.5 -50.7Q24.3 -48.9 22.8 -46.1Q21.2 -43.3 19.9 -40.7Q18.6 -38.1 18 -36.8H26.8Q26.8 -36.4 26.4 -35.5Q26.1 -34.7 25.2 -34.3H16.8Q15.6 -31.7 14.2 -28Q12.7 -24.4 11.3 -20.4Q9.9 -16.5 9 -13.1Q8.1 -9.7 8.1 -7.6Q8.1 -4.7 8.8 -3.3Q9.6 -1.9 11.6 -1.9Q14.2 -1.9 16.6 -4.5Q19 -7 21.2 -10.8Q23.3 -14.7 25 -18.5Q26.1 -18.5 26.1 -17.7Q25.1 -15.1 23.5 -12Q22 -8.9 20 -6.1Q18 -3.3 15.6 -1.5Q13.2 0.3 10.2 0.3Q6.1 0.3 4.7 -2Q3.3 -4.2 3.3 -7.8Q3.3 -10.4 4.2 -14.1Q5.2 -17.8 6.6 -21.7Q8 -25.6 9.3 -29Q10.7 -32.4 11.4 -34.3H5.3Q5.3 -35 6 -35.9Q6.6 -36.8 7.4 -36.8H12.5Q13.2 -38.3 14.3 -40.6Q15.3 -42.9 17 -45.7Q18.4 -48 20.7 -49.3Q22.9 -50.7 25.5 -50.7ZM15.6 0.8Q19.7 -7.5 24 -16.6Q28.4 -25.6 33 -34.8Q37.6 -44.1 42.1 -52.4Q43.8 -55.3 45.2 -56.9Q46.6 -58.6 48.9 -58.6Q49.7 -58.6 50.9 -58.3Q52 -58 53.1 -58.2Q51.8 -56.8 49.7 -53.5Q47.5 -50.1 44.9 -45.4Q42.2 -40.7 39.3 -35.3Q36.4 -29.9 33.6 -24.3Q30.7 -18.8 28.3 -14Q30.2 -16.5 32.3 -18.7Q34.3 -20.9 36.2 -22.6Q38.3 -24.5 41.5 -26.6Q44.7 -28.7 48 -30.2Q51.2 -31.8 53.1 -31.8Q53.8 -31.8 54 -31.7Q54 -31.7 53 -29.8Q51.9 -27.8 50.4 -24.9Q48.8 -21.9 47.1 -18.4Q45.4 -15 44.2 -11.9Q42.9 -8.7 42.5 -6.7Q42.2 -5.2 42.2 -4.1Q42.2 -2.6 42.8 -2.1Q43.4 -1.5 44.1 -1.5Q45.7 -1.5 47.6 -3.2Q49.4 -4.9 51.3 -7.5Q53.1 -10.1 54.7 -13Q56.3 -15.9 57.2 -18.5Q58.4 -18.5 58.4 -17.7Q57.3 -15.1 55.7 -12Q54.1 -8.8 52.1 -6Q50.1 -3.3 47.7 -1.4Q45.3 0.4 42.6 0.4Q40.7 0.4 38.7 -1Q36.7 -2.3 36.7 -5.9Q36.7 -6.9 36.9 -8.1Q37.1 -9.3 37.5 -10.8Q38.1 -12.8 39.5 -15.1Q40.8 -17.5 42.9 -21Q43.9 -22.7 43.9 -23.6Q43.9 -24.8 42.7 -24.8Q41.8 -24.8 40.1 -23.8Q38.5 -22.8 36 -20.4Q33.6 -18.1 30 -13.7Q26.5 -9.3 22.5 -1.3Q21.8 -0.1 21 -0Q20.2 0 18.8 0.1Q18 0.2 17.1 0.2Q16.2 0.3 15.6 0.8ZM64.1 0.4Q60.6 0.4 57.7 -1.9Q54.9 -4.2 54.9 -8.9Q54.9 -12.9 56.7 -17.3Q58.5 -21.7 61.4 -25.6Q64.3 -29.5 67.9 -31.9Q71.5 -34.4 75.2 -34.4Q77 -34.4 78.7 -33.3Q80.4 -32.3 80.4 -29.7Q80.4 -27.3 78.6 -24.4Q76.8 -21.5 73.4 -19Q72 -18 69.8 -17Q67.6 -16 65.4 -15.4Q63.2 -14.8 61.7 -14.8Q61.2 -13.6 60.8 -11.7Q60.4 -9.8 60.4 -7.8Q60.4 -5.4 61.3 -3.5Q62.3 -1.5 64.9 -1.5Q68.1 -1.5 70.8 -3.4Q73.5 -5.2 75.7 -8Q77.9 -10.8 79.4 -13.6Q80.9 -16.5 81.8 -18.5Q82.9 -18.5 82.9 -17.7Q81.7 -15 80.1 -11.8Q78.5 -8.6 76.4 -5.9Q74.2 -3.2 71.2 -1.4Q68.2 0.4 64.1 0.4ZM62.4 -16.5Q63.7 -16.5 66.9 -17.5Q70.1 -18.5 72.7 -20.7Q75.2 -22.9 76.5 -25.6Q77.9 -28.2 77.9 -30Q77.9 -32.2 76.3 -32.2Q75.2 -32.2 73.2 -30.6Q71.1 -29.1 68.2 -25.4Q66.3 -23.1 64.7 -20.4Q63.1 -17.8 62.4 -16.5Z";
const EASE = [0.22, 1, 0.36, 1] as const;

export default function TheKLogo({ width = 180, variant = "dark", tag, trigger = "view", speed = 1, className = "", loopShine = true }:
  { width?: number; variant?: "dark" | "light"; tag?: string; trigger?: "view" | "mount" | "static"; speed?: number; className?: string; loopShine?: boolean }) {
  const uid = useId().replace(/:/g, "");
  const ref = useRef<SVGSVGElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  const go = trigger === "static" || trigger === "mount" || seen;
  const st = trigger === "static";
  const s = (v: number) => v / speed;
  const H = tag ? 252 : 214;
  const dark = variant === "dark";
  const theFill = dark ? "#ffffff" : "#e2734a";
  const line = dark ? "#ffcf86" : "#e2734a";
  const tr = (d: number, delay: number) => ({ duration: st ? 0 : s(d), delay: st ? 0 : s(delay), ease: EASE });
  return (
    <svg ref={ref} viewBox={`0 0 290 ${H}`} width={width} height={(width * H) / 290} className={className} role="img" aria-label="the K SMART HOSTEL 로고" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`g${uid}`} x1="0" y1="0" x2="1" y2="1">
          {dark ? (<><stop offset="0" stopColor="#b8925a" /><stop offset=".45" stopColor="#f3e3bd" /><stop offset=".7" stopColor="#c9a96e" /><stop offset="1" stopColor="#8f6f3e" /></>)
            : (<><stop offset="0" stopColor="#123733" /><stop offset=".5" stopColor="#1d4a46" /><stop offset="1" stopColor="#0e2b29" /></>)}
        </linearGradient>
        <linearGradient id={`sh${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".5" stopColor="#fff" stopOpacity={dark ? 0.75 : 0.35} /><stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`mk${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" /><stop offset=".8" stopColor="#fff" /><stop offset="1" stopColor="#000" />
        </linearGradient>
        <filter id={`n${uid}`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3.2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <filter id={`h${uid}`} x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="7" /></filter>
        <clipPath id={`kc${uid}`}><path d={K_D} transform="translate(62 196)" /></clipPath>
        <mask id={`tm${uid}`} maskUnits="userSpaceOnUse" x="0" y="0" width="290" height="214">
          <motion.rect x="-10" y="0" width="160" height="214" fill={`url(#mk${uid})`} initial={{ x: st ? 0 : -165 }} animate={{ x: go ? 0 : -165 }} transition={tr(1.1, 1.95)} />
        </mask>
      </defs>

      {/* K — 금빛 채움 (아래에서 차오름) */}
      <g clipPath={`url(#kc${uid})`}>
        <motion.rect x="0" width="290" height="220" fill={`url(#g${uid})`} initial={{ y: st ? 0 : 214 }} animate={{ y: go ? 0 : 214 }} transition={tr(1.1, 1.35)} />
        {/* 스치는 빛 */}
        {!st && (
          <motion.rect y="0" width="60" height="214" fill={`url(#sh${uid})`} style={{ skewX: -18 }} initial={{ x: -120 }} animate={go ? { x: [-120, 360] } : { x: -120 }}
            transition={{ duration: s(1.3), delay: s(3.2), ease: "easeInOut", repeat: loopShine ? Infinity : 0, repeatDelay: 5.5 }} />
        )}
      </g>
      {/* K — 네온 윤곽 */}
      <motion.path d={K_D} transform="translate(62 196)" fill="none" stroke={line} strokeWidth={1.3} filter={dark ? `url(#n${uid})` : undefined}
        initial={{ pathLength: st ? 1 : 0 }} animate={{ pathLength: go ? 1 : 0 }} transition={{ duration: st ? 0 : s(1.9), ease: "easeInOut" }} />

      {/* the — 손글씨 */}
      <g mask={`url(#tm${uid})`}>
        {dark && <path d={THE_D} transform="translate(20 80)" fill="none" stroke="#0e2b29" strokeWidth="5" strokeLinejoin="round" />}
        <path d={THE_D} transform="translate(20 80)" fill={theFill} />
      </g>

      {/* 불 켜지는 점 */}
      <motion.circle cx="262" cy="186" r="16" fill="#ffb27a" filter={`url(#h${uid})`} initial={{ scale: st ? 1 : 0 }} animate={go ? { scale: st ? 1 : [0, 1.3, 0.4, 1.15, 1] } : { scale: 0 }}
        transition={{ duration: st ? 0 : s(0.9), delay: st ? 0 : s(2.8), times: [0, 0.25, 0.45, 0.7, 1] }} style={{ transformOrigin: "262px 186px" }} />
      <motion.circle cx="262" cy="186" r="9.5" initial={{ fill: st ? "#e2734a" : dark ? "#2c3e3b" : "#d9d4ca" }}
        animate={go ? { fill: st ? "#e2734a" : [dark ? "#2c3e3b" : "#d9d4ca", "#ffcf86", "#5a4632", "#ffcf86", "#e2734a"] } : {}}
        transition={{ duration: st ? 0 : s(0.9), delay: st ? 0 : s(2.8), times: [0, 0.25, 0.45, 0.7, 1] }} />

      {tag && (
        <g>
          <clipPath id={`tc${uid}`}><motion.rect x="0" y="222" width="290" height="34" initial={{ y: st ? 0 : 34 }} animate={{ y: go ? 0 : 34 }} transition={tr(0.8, 3.0)} /></clipPath>
          <text x="153" y="246" textAnchor="middle" clipPath={`url(#tc${uid})`} fill={dark ? "#ecdcb6" : "#5b6b69"} style={{ fontSize: 17, letterSpacing: "0.42em", fontWeight: 600, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{tag}</text>
        </g>
      )}
    </svg>
  );
}
