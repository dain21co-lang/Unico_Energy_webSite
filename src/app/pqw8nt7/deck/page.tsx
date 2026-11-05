import type { Metadata } from "next";
import DeckView from "./DeckView";
import "../haeyeon.css";

export const metadata: Metadata = {
  title: "회사소개서 | 해연에프엔지",
  robots: { index: false, follow: false },
  icons: { icon: "/haeyeon/img/symbol.png" },
};

export default function Page() {
  return <DeckView />;
}
