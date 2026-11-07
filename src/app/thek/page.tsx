import type { Metadata } from "next";
import TheKSite from "./TheKSite";
import "./thek.css";

export const metadata: Metadata = {
  title: "더케이 스마트호스텔(가칭) | THE K SMART HOSTEL",
  description: "파주 금촌동 The K 빌딩 공실을 AI·IoT 무인 운영 스마트호스텔로 — 사업 소개 임시 홈페이지",
  robots: { index: false, follow: false },
  openGraph: {
    title: "더케이 스마트호스텔 (가칭)",
    description: "파주 금촌, 머무는 방식이 스마트해집니다",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/thek/img/og.jpg", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <TheKSite />;
}
