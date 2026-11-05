import type { Metadata } from "next";
import GiibSite from "./GiibSite";
import "./giib.css";

export const metadata: Metadata = {
  title: "글로벌인프라허브 | GIIB",
  description: "부동산 투자·개발·투자자문 — 주식회사 글로벌인프라허브 (임시 홈페이지)",
  robots: { index: false, follow: false },
  icons: { icon: "/g0dy098g/logo-mark.svg" },
  openGraph: {
    title: "글로벌인프라허브 GIIB",
    description: "부동산의 가치를, 구조로 완성합니다.",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/g0dy098g/og.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <GiibSite />;
}
