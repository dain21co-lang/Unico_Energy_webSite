import type { Metadata } from "next";
import CaseSeobu from "../../CaseSeobu";
import "../../giib.css";

export const metadata: Metadata = {
  title: "사례 · 헤리티지포레(가칭) | GIIB",
  description: "재개발 부지를 레지던스 브랜드로 — 외관 조감도와 원테이크 브랜드 필름, 모바일 사이트 (GIIB 작업 사례)",
  robots: { index: false, follow: false },
  icons: { icon: "/g0dy098g/logo-mark.svg" },
};

export default function Page() {
  return <CaseSeobu />;
}
