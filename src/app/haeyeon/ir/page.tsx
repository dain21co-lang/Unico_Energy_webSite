import type { Metadata } from "next";
import IRView from "./IRView";
import "./ir.css";

export const metadata: Metadata = {
  title: "IR 2026 | 해연에프엔지",
  description: "해연에프엔지 투자설명 자료 (2025 회계연도 감사보고서 기준)",
  robots: { index: false, follow: false },
  icons: { icon: "/haeyeon/img/symbol.png" },
};

export default function Page() {
  return <IRView />;
}
