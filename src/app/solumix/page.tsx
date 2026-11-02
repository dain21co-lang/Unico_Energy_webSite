import type { Metadata } from "next";
import SolumixSite from "./SolumixSite";
import "./solumix.css";

export const metadata: Metadata = {
  title: "SOLUMIX | AI · ROBOTICS · SMART SOLUTIONS",
  description: "솔루믹스(구 로보쓰리에이아이) — 셀프밸런싱 원천기술 기반의 서빙·안내·보안 로봇, 홈 IoT, EV 부품 전문기업",
  robots: { index: false, follow: false },
  icons: { icon: "/solumix/icon.svg" },
  openGraph: {
    title: "SOLUMIX · Intelligence in Motion",
    description: "AI · ROBOTICS · SMART SOLUTIONS — 솔루믹스 홈페이지 시안",
    locale: "ko_KR",
    type: "website",
  },
};

export default function Page() {
  return <SolumixSite />;
}
