import type { Metadata } from "next";
import GiibPlus from "../GiibPlus";
import "../giib.css";

export const metadata: Metadata = {
  title: "글로벌인프라허브 | GIIB",
  description: "부동산 투자·개발 · 기업 구조조정·M&A · 사업계획서·IR·가치평가 · 사업 사이트 — 주식회사 글로벌인프라허브 (임시 홈페이지)",
  robots: { index: false, follow: false },
  icons: { icon: "/g0dy098g/logo-mark.svg" },
  openGraph: {
    title: "글로벌인프라허브 GIIB",
    description: "자산에서 기업까지, 딜의 처음과 끝. 선수금 없이 결과로 받습니다.",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/g0dy098g/og.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <GiibPlus />;
}
