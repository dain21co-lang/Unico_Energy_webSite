import type { Metadata } from "next";
import SIRView from "./SIRView";
import "./ir.css";

export const metadata: Metadata = {
  title: "IR 2026 | 신촌 스마트호스텔 세메스터하우스(가칭)",
  description: "ORBIT HOUSE 신촌 스마트호스텔 사업계획서 · 투자제안서 (검토용 초안)",
  robots: { index: false, follow: false },
  openGraph: {
    title: "ORBIT HOUSE · 신촌 스마트호스텔 Business Plan & IR",
    description: "하루부터 한 학기까지 — 신촌 AI 스마트호스텔",
    images: [{ url: "/sinchon/og.jpg", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <SIRView />;
}
