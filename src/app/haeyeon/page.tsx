import type { Metadata } from "next";
import HaeyeonSite from "./HaeyeonSite";
import "./haeyeon.css";
import "./ir/ir.css";

export const metadata: Metadata = {
  title: "해연에프엔지 | HAEYEON F&G",
  description: "충북 제천 HACCP 가공 공장 기반의 축산물·농산물 가공·유통 전문기업, AI 스마트 육가공을 준비하는 해연에프엔지",
  robots: { index: false, follow: false },
  icons: { icon: "/haeyeon/img/symbol.png" },
  openGraph: { title: "해연에프엔지 · Food Innovation, Powered by Technology", description: "좋은 고기는 손끝에서, 더 좋은 고기는 데이터에서.", locale: "ko_KR", type: "website", images: [{ url: "/haeyeon/img/carcass.jpg" }] },
};

export default function Page() {
  return <HaeyeonSite />;
}
