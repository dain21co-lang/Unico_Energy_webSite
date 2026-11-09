import type { Metadata } from "next";
import TheKSiteEn from "../TheKSiteEn";
import "../thek.css";

export const metadata: Metadata = {
  title: "THE K SMART HOSTEL | Geumchon, Paju",
  description: "Stay smart, live local — an AI & IoT-run smart hostel in Geumchon, Paju, Korea (opening soon)",
  robots: { index: false, follow: false },
  openGraph: {
    title: "THE K SMART HOSTEL (provisional)",
    description: "Geumchon, Paju — a smarter way to stay",
    locale: "en_US",
    type: "website",
    images: [{ url: "/thek/img/og.jpg", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <TheKSiteEn />;
}
