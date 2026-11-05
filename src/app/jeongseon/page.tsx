import type { Metadata } from "next";
import JeongseonSite from "./JeongseonSite";
import "./jeongseon.css";

export const metadata: Metadata = {
  title: "정선 관광호텔 | AI 스마트호텔 (임시)",
  description: "강원도 정선군 정선읍 용탄리 31실 관광호텔 — 조양강 150m, AI 기반 무인·스마트 운영으로 여는 정선 관광 거점 (투자 검토용 임시 사이트)",
  robots: { index: false, follow: false },
  openGraph: {
    title: "정선 관광호텔 · AI 스마트호텔",
    description: "조양강 150m, 31실. 사람은 환대에, AI는 나머지에.",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/jeongseon/img/donggang.webp" }],
  },
};

export default function Page() {
  return <JeongseonSite />;
}
