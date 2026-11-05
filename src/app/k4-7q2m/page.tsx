import type { Metadata } from "next";
import FourKeysSite from "./FourKeysSite";
import "./fourkeys.css";

export const metadata: Metadata = {
  title: "네 개의 열쇠 | 서부중앙시장 부지 담보 제공 안내",
  description: "지분 소유자 네 분께 드리는 설명자료 (비공개 · 협의용 초안)",
  robots: { index: false, follow: false, nocache: true },
  openGraph: {
    title: "네 개의 열쇠",
    description: "지주님께 드리는 설명자료 · 비공개",
    locale: "ko_KR",
    type: "website",
  },
};

export default function Page() {
  return <FourKeysSite />;
}
