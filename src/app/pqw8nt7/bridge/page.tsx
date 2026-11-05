import type { Metadata } from "next";
import BridgeView from "./BridgeView";
import "../ir/ir.css";

export const metadata: Metadata = {
  title: "브릿지·PF 자금조달 제안 | 해연에프엔지",
  description: "해연에프엔지 브릿지·PF 자금조달 제안 (협의용 초안)",
  robots: { index: false, follow: false },
  icons: { icon: "/haeyeon/img/symbol.png" },
};

export default function Page() {
  return <BridgeView />;
}
