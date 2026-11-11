import type { Metadata } from "next";
import GanghwaSite from "./GanghwaSite";
import "./ganghwa.css";

export const metadata: Metadata = {
  title: "강화 제1광산 | 장석 · 골재 · 인프라 소재 사업 소개",
  description: "인천 강화 제1광산 사업 소개 임시 홈페이지 (사업 준비 단계 · 수치와 일정은 가정)",
  robots: { index: false, follow: false },
  openGraph: {
    title: "강화 제1광산",
    description: "장석 · 골재 · 인프라 소재 사업 소개 (사업 준비 단계)",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/ganghwa/og.jpg", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <GanghwaSite />;
}
