import type { Metadata } from "next";
import SinchonSite from "./SinchonSite";
import "./sinchon.css";

export const metadata: Metadata = {
  title: "신촌 세메스터하우스(가칭) | SEMESTER HOUSE SINCHON",
  description: "한 학기, 서울에서 내 집처럼 — 신촌 생활권 유학생을 위한 가구 완비 스마트 호스텔 (콘셉트 시안 · 오픈 준비 중)",
  robots: { index: false, follow: false },
  openGraph: {
    title: "신촌 세메스터하우스 (가칭)",
    description: "One semester. Your home in Seoul.",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/sinchon/og.jpg", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <SinchonSite />;
}
