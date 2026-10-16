"use client";

import { useEffect, useRef } from "react";

/**
 * 화면에 가까워졌을 때만 영상을 불러오고 재생하며, 화면을 벗어나면 일시정지합니다.
 * 모바일 데이터 사용량과 첫 로딩 속도를 줄이기 위한 용도입니다.
 */
export function LazyVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!v.getAttribute("src")) {
            v.setAttribute("src", src);
            v.load();
          }
          void v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      loop
      muted
      playsInline
      preload="none"
    />
  );
}
