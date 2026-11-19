import type { Metadata } from "next";
import OrbitCareSite from "./OrbitCareSite";
import "./orbit-care.css";

export const metadata: Metadata = {
  title: "신촌 평생주치의 케어하우스(가칭) · GB LABS",
  description: "치료는 대학병원에서, 회복은 신촌에서 — 평생주치의 의료·돌봄 의료복지사회적협동조합 입점 검토용 시안",
  robots: { index: false, follow: false },
  openGraph: {
    title: "신촌 평생주치의 케어하우스(가칭)",
    description: "치료는 대학병원에서, 회복은 신촌에서.",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/sinchon/care/og-intro.jpg", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <OrbitCareSite />;
}
