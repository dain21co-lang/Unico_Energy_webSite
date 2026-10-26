import type { Metadata } from "next";
import OksuSite from "./OksuSite";
import "./oksu.css";

export const metadata: Metadata = {
  title: "옥수 개발사업 | 의료폐기물 처리시설 · 스마트팜 복합개발",
  description: "전북 완주 봉동 · 의료폐기물을 안전하게 처리하고, 그 열로 스마트팜을 키우는 복합개발 사업",
  robots: { index: false, follow: false },
  openGraph: {
    title: "옥수 개발사업",
    description: "의료폐기물 처리시설과 스마트팜을 잇는 복합개발 · 임시 안내 페이지",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/oksu/img/aerial_full.jpg", alt: "옥수 개발사업 조감도" }],
  },
};

export default function Page() {
  return <OksuSite />;
}
