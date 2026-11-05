import type { Metadata } from "next";
import StaySite from "./StaySite";
import "./stay.css";

export const metadata: Metadata = {
  title: "JEONGSEON HOTEL | 정선 관광호텔 (홈페이지 시안)",
  description: "조양강 150m, 31개의 방. 모바일키로 바로 들어가는 정선의 스마트 부티크 호텔 — 고객용 홈페이지 시안",
  robots: { index: false, follow: false },
  openGraph: {
    title: "JEONGSEON HOTEL · 정선 관광호텔",
    description: "강이 깨우는 아침, 산이 덮어 주는 밤.",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/jeongseon/img/after1-og.jpg", width: 1200, height: 631 }],
  },
};

export default function Page() {
  return <StaySite />;
}
