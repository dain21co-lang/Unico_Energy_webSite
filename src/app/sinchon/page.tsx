import type { Metadata } from "next";
import SinchonSite from "./SinchonSite";
import "./sinchon.css";

export const metadata: Metadata = {
  title: "신촌 스마트 호스텔(가칭) | SMART HOSTEL SINCHON",
  description: "하룻밤부터 한 학기까지, 신촌에서 편안하게 — 연세·이화·서강·홍익 생활권 가구 완비 스마트 호스텔 (콘셉트 시안 · 오픈 준비 중)",
  robots: { index: false, follow: false },
  openGraph: {
    title: "신촌 스마트 호스텔 (가칭)",
    description: "A smart hostel in Sinchon, Seoul.",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/sinchon/og.jpg", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <SinchonSite />;
}
