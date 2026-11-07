import type { Metadata } from "next";
import IRView from "./IRView";
import "./ir.css";

export const metadata: Metadata = {
  title: "IR 2026 | 해연에프엔지",
  description: "해연에프엔지 투자설명 자료 (국세청 신고 재무제표 기준)",
  robots: { index: false, follow: false },
  icons: { icon: "/haeyeon/img/symbol.png" },
};

export default function Page() {
  return <IRView />;
}
