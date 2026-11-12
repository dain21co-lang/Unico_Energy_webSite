import type { Metadata } from "next";
import GanghwaSiteEn from "../GanghwaSiteEn";
import "../ganghwa.css";

export const metadata: Metadata = {
  title: "Ganghwa Mine No.1 | Feldspar · Aggregate · Infrastructure Materials",
  description: "Temporary English site for Ganghwa Mine No.1, Incheon (business plan draft · figures and timing are assumptions)",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Ganghwa Mine No.1",
    description: "Feldspar · aggregate · infrastructure materials (business plan draft)",
    locale: "en_US",
    type: "website",
    images: [{ url: "/ganghwa/og.jpg", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <GanghwaSiteEn />;
}
