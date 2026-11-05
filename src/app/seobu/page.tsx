import type { Metadata } from "next";
import SeobuSite from "./SeobuSite";
import "./seobu.css";

export const metadata: Metadata = {
  title: "서울서부중앙시장 재개발사업 | SEOUL SEOBU CENTRAL MARKET",
  description: "서울특별시 서대문구 북가좌동 338-19번지 일원 — 공동주택과 판매시설이 결합된 서울서부중앙시장 재개발사업 임시 홈페이지",
  robots: { index: false, follow: false },
  openGraph: {
    title: "서울서부중앙시장 재개발사업",
    description: "새로운 주거와 상업의 중심, 서울서부중앙시장의 새로운 미래",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/seobu/img/og.jpg", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <SeobuSite />;
}
