import type { Metadata } from "next";
import CareSite from "./CareSite";
import "./care.css";

export const metadata: Metadata = {
  title: "신촌 평생주치의 케어하우스(가칭) — 의료복지사회적협동조합 입점 시나리오",
  description: "치료는 대학병원에서, 회복은 신촌에서. 암환자 요양·평생주치의 센터 입점 가상 시나리오",
  robots: { index: false, follow: false },
  openGraph: {
    title: "신촌 평생주치의 케어하우스(가칭)",
    description: "치료는 대학병원에서, 회복은 신촌에서 — 가상 시나리오",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/sinchon/care/og.jpg", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <CareSite />;
}
