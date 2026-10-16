import type { Metadata } from "next";
import DeckViewer from "@/components/DeckViewer";

// 검색 노출 제외(자료실의 '바로보기'로만 진입)
export const metadata: Metadata = {
  title: "유니코에너지그룹 사업소개서",
  robots: { index: false, follow: false },
};

export default function DeckPage() {
  return <DeckViewer base="/deck/proposal-ko" total={65} title="유니코에너지그룹 사업소개서" backHref="/#downloads" backLabel="홈으로" />;
}
