import type { Metadata } from "next";
import OrbitSite from "../OrbitSite";
import "../orbit.css";

export const metadata: Metadata = {
  title: "ORBIT HOUSE · Sinchon Smart Hostel — Form in motion",
  description: "A smart hostel in Sinchon, Seoul — 66 rooms · 103 beds, from one night to a full semester (concept preview)",
  robots: { index: false, follow: false },
  openGraph: {
    title: "ORBIT HOUSE · Sinchon Smart Hostel",
    description: "Lines unfold, floors rise — a new Sinchon takes shape.",
    locale: "en_US",
    type: "website",
    images: [{ url: "/sinchon/og.jpg", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <OrbitSite lang="en" />;
}
