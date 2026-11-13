import type { Metadata } from "next";
import OrbitSite from "./OrbitSite";
import "./orbit.css";

export const metadata: Metadata = {
  title: "SEMESTER HOUSE · 신촌 스마트호스텔(가칭) — Form in motion",
  description: "원도면의 선에서 시작하는 신촌 스마트호스텔 — 54실 · 85베드, 하루부터 한 학기까지 (콘셉트 시안)",
  robots: { index: false, follow: false },
  openGraph: {
    title: "SEMESTER HOUSE · 신촌 스마트호스텔(가칭)",
    description: "선이 펼쳐지고, 색이 깨어나고 — 새로운 신촌의 모습.",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/sinchon/og.jpg", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <OrbitSite />;
}
