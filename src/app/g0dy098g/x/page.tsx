import type { Metadata } from "next";
import GiibPlus from "../GiibPlus";
import "../giib.css";

export const metadata: Metadata = {
  title: "글로벌인프라허브 | GIIB",
  description: "상장사 M&A · 구조조정 · RWA(부동산 개발·엣지 AI 데이터센터·NPL) · IR — 주식회사 글로벌인프라허브 (임시 홈페이지)",
  robots: { index: false, follow: false },
  icons: { icon: "/g0dy098g/logo-mark.svg" },
  openGraph: {
    title: "글로벌인프라허브 GIIB",
    description: "상장사 M&A부터 실물자산까지, 자산 발굴에서 딜 클로징까지.",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/g0dy098g/og.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <GiibPlus />;
}
