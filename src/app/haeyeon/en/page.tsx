import type { Metadata } from "next";
import HaeyeonSite from "../HaeyeonSite";
import "../haeyeon.css";

export const metadata: Metadata = {
  title: "HAEYEON F&G | Food Innovation, Powered by Technology",
  description: "Meat and produce processing from a HACCP plant in Jecheon, Korea, preparing AI smart meat processing.",
  robots: { index: false, follow: false },
  icons: { icon: "/haeyeon/img/symbol.png" },
  openGraph: { title: "HAEYEON F&G", description: "Great meat comes from skilled hands. Better meat comes from data.", locale: "en_US", type: "website", images: [{ url: "/haeyeon/img/carcass.jpg" }] },
};

export default function Page() {
  return <HaeyeonSite en />;
}
