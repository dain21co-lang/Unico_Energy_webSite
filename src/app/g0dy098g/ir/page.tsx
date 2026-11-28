import type { Metadata } from "next";
import GIRView from "./GIRView";
import "../giib.css";
import "./ir.css";

export const metadata: Metadata = {
  title: "IR 2026 | 글로벌인프라허브 GIIB",
  description: "GIIB 투자제안서 — 상장사 M&A · 구조조정 · RWA · IR (검토용)",
  robots: { index: false, follow: false },
  openGraph: { title: "GIIB · Investor Relations 2026", description: "상장사 M&A부터 실물자산까지, 딜의 처음과 끝", images: [{ url: "/g0dy098g/og.png", width: 1200, height: 630 }] },
};

export default function Page() {
  return <GIRView />;
}
