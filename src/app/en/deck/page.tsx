import type { Metadata } from "next";
import DeckViewer from "@/components/DeckViewer";

export const metadata: Metadata = {
  title: "UNICO ENERGY GROUP Business Proposal",
  robots: { index: false, follow: false },
};

export default function EnDeckPage() {
  return (
    <DeckViewer
      base="/deck/proposal-en"
      total={64}
      title="UNICO ENERGY GROUP Business Proposal"
      backHref="/en"
      backLabel="Home"
      labels={{ fullscreen: "Full screen", pageList: "Page list", pageTpl: "Page {n}", prev: "Previous page", next: "Next page" }}
    />
  );
}
