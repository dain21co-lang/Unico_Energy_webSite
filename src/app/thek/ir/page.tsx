import type { Metadata } from "next";
import KIRView from "./KIRView";
import "./ir.css";

export const metadata: Metadata = {
  title: "IR 2026 | 더케이 스마트호스텔(가칭)",
  description: "THE K SMART HOSTEL 사업계획서 · 투자제안서 (검토용 초안)",
  robots: { index: false, follow: false },
  openGraph: {
    title: "THE K SMART HOSTEL · Business Plan & IR",
    description: "파주 금촌, 머무는 방식이 스마트해집니다",
    images: [{ url: "/thek/img/og.jpg", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <KIRView />;
}
