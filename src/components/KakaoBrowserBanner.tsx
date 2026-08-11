"use client";

import { useEffect, useState } from "react";

/**
 * 카카오톡 인앱브라우저에서 접속했을 때 상단에 안내 배너를 띄우고,
 * 버튼 클릭 시 기본 브라우저(Chrome/삼성인터넷 등)로 같은 페이지를 열어줍니다.
 *
 * 원인: 카카오톡 WebView는 자체 접근성 폰트 확대 설정을 CSS의
 * text-size-adjust보다 우선 적용하는 경우가 있어, viewport/CSS 수정만으로는
 * 폰트 크기 차이를 완전히 제어할 수 없습니다. 이 배너는 그 우회 방법입니다.
 */
export function KakaoBrowserBanner() {
  const [isKakao, setIsKakao] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || "";
    setIsKakao(/KAKAOTALK/i.test(ua));
  }, []);

  if (!isKakao) return null;

  const openInExternalBrowser = () => {
    const currentUrl = window.location.href;
    // 카카오톡 자체 제공 스킴: 인앱브라우저를 벗어나 기본 브라우저로 연다.
    window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(
      currentUrl
    )}`;
  };

  return (
    <div className="sticky top-0 z-[100] flex items-center justify-between gap-3 bg-navy-950 px-4 py-2.5 text-xs text-silver-300 sm:text-sm">
      <span className="leading-snug">
        더 나은 화면을 위해 기본 브라우저로 열어보세요
      </span>
      <button
        type="button"
        onClick={openInExternalBrowser}
        className="flex-shrink-0 rounded-full bg-gold-500 px-3 py-1.5 font-semibold text-navy-950 transition-colors hover:bg-gold-400"
      >
        브라우저로 열기
      </button>
    </div>
  );
}