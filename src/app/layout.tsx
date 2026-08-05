import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "유니코에너지그룹 | UNICO ENERGY GROUP",
  description:
    "국경을 넘어 미래를 잇는 글로벌 트레이딩에너지 플랫폼, 유니코에너지그룹. 에너지 트레이딩, 알루미늄·비철금속, 첨단 신소재, 물류 인프라를 아우르는 실물 자산 기반 비즈니스.",
  keywords: [
    "유니코에너지그룹",
    "UNICO ENERGY GROUP",
    "에너지 트레이딩",
    "알루미늄 잉곳",
    "전기동",
    "구리 분말",
    "글로벌 물류",
    "투자유치",
  ],
  openGraph: {
    title: "유니코에너지그룹 | UNICO ENERGY GROUP",
    description: "국경을 넘어 미래를 잇는 글로벌 트레이딩에너지 플랫폼",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-paper text-ink-100">
        {children}
      </body>
    </html>
  );
}
