import type { Metadata } from "next";
import GhView from "./GhView";
import "./gh.css";

export const metadata: Metadata = {
  title: "강화 장석광산 기반 조력발전 인프라 소재 플랫폼",
  description: "Investment Memorandum — 검토용 (수치와 금융 구조는 가정)",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <GhView />;
}
