import type { Metadata } from "next";
import SolumixSiteEn from "../SolumixSiteEn";
import "../solumix.css";

export const metadata: Metadata = {
  title: "SOLUMIX | AI · ROBOTICS · SMART SOLUTIONS",
  description: "SOLUMIX (formerly ROBO3 AI) — serving, transport and security robots built on 20 years of self-balancing technology.",
  robots: { index: false, follow: false },
  icons: { icon: "/solumix/icon.svg" },
  openGraph: { title: "SOLUMIX · Intelligence in Motion", description: "AI · ROBOTICS · SMART SOLUTIONS", locale: "en_US", type: "website" },
};

export default function Page() {
  return <SolumixSiteEn />;
}
