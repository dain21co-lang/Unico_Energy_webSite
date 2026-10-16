"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  /** 이미지 폴더 (예: /deck/gb-ko) — 01.webp, 02.webp … */
  base: string;
  total: number;
  title: string;
  backHref: string;
  backLabel: string;
  labels?: { fullscreen: string; pageList: string; pageTpl: string; prev: string; next: string };
};

const KO_LABELS = {
  fullscreen: "전체 화면",
  pageList: "페이지 목록",
  pageTpl: "{n}쪽",
  prev: "이전 쪽",
  next: "다음 쪽",
};

const fmt = (tpl: string, n: number) => tpl.replace("{n}", String(n));
const pad = (n: number) => String(n).padStart(2, "0");

export default function DeckViewer({ base, total, title, backHref, backLabel, labels = KO_LABELS }: Props) {
  const [cur, setCur] = useState(1);
  const [prev, setPrev] = useState<{ n: number; dir: 1 | -1 } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const touch = useRef<number | null>(null);
  const ready = useRef(false);

  const go = useCallback(
    (n: number) => {
      const t = Math.min(total, Math.max(1, n));
      setCur((c) => {
        if (t === c) return c;
        setPrev({ n: c, dir: t > c ? 1 : -1 });
        return t;
      });
    },
    [total],
  );

  useEffect(() => {
    const h = location.hash.match(/^#(\d+)$/);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 주소의 #번호는 하이드레이션 이후에만 읽을 수 있음
    if (h) setCur(Math.min(total, Math.max(1, Number(h[1]))));
  }, [total]);

  useEffect(() => {
    if (!ready.current) {
      ready.current = true;
      return;
    }
    history.replaceState(null, "", `#${cur}`);
    railRef.current?.querySelector<HTMLElement>(`[data-n="${cur}"]`)?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [cur]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "PageDown") go(cur + 1);
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp") go(cur - 1);
      else if (e.key === "Home") go(1);
      else if (e.key === "End") go(total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cur, go, total]);

  const full = () => {
    const el = stageRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen?.();
  };

  const src = (n: number) => `${base}/${pad(n)}.webp`;

  return (
    <div className="flex h-[100dvh] flex-col bg-navy-950 text-silver-300">
      <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-silver-300/10 px-4 md:px-6">
        <a href={backHref} className="text-[13px] tracking-wide text-gold-400 hover:underline">
          ← {backLabel}
        </a>
        <h1 className="truncate text-[13px] text-silver-300/80 md:text-sm">{title}</h1>
        <div className="flex items-center gap-3 text-[13px] tabular-nums text-silver-300/70">
          <span>
            {cur} / {total}
          </span>
          <button
            type="button"
            onClick={full}
            aria-label={labels.fullscreen}
            className="inline-flex h-8 items-center rounded border border-silver-300/25 px-3 text-xs hover:border-gold-500 hover:text-gold-400"
          >
            {labels.fullscreen}
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {/* 페이지 번호 레일: PC=좌측 세로 / 모바일=하단 가로 */}
        <nav
          ref={railRef}
          aria-label={labels.pageList}
          className="order-2 flex shrink-0 gap-1.5 overflow-x-auto border-t border-silver-300/10 p-2 md:order-1 md:w-[88px] md:flex-col md:overflow-y-auto md:overflow-x-hidden md:border-r md:border-t-0 md:p-2.5"
        >
          {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              data-n={n}
              onClick={() => go(n)}
              aria-label={fmt(labels.pageTpl, n)}
              aria-current={n === cur ? "page" : undefined}
              className={`group relative shrink-0 overflow-hidden rounded border transition-colors md:w-full ${
                n === cur ? "border-gold-500" : "border-silver-300/15 hover:border-silver-300/50"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src(n)} alt="" loading="lazy" decoding="async" className="block h-10 w-[71px] object-cover md:h-auto md:w-full" />
              <span
                className={`absolute bottom-0 left-0 px-1.5 text-[10px] font-medium tabular-nums ${
                  n === cur ? "bg-gold-500 text-navy-950" : "bg-navy-950/80 text-silver-300/80"
                }`}
              >
                {pad(n)}
              </span>
            </button>
          ))}
        </nav>

        <div
          ref={stageRef}
          className="relative order-1 flex min-h-0 flex-1 cursor-pointer items-center justify-center bg-black/30 p-2 md:order-2 md:p-6"
          onClick={(e) => {
            // 화살표 버튼 자체를 누른 경우는 버튼이 처리합니다
            if ((e.target as HTMLElement).closest("button")) return;
            // 화면 왼쪽 30%를 누르면 이전 쪽, 나머지를 누르면 다음 쪽
            const r = e.currentTarget.getBoundingClientRect();
            go(cur + (e.clientX - r.left < r.width * 0.3 ? -1 : 1));
          }}
          onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touch.current == null) return;
            const dx = e.changedTouches[0].clientX - touch.current;
            touch.current = null;
            if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1));
          }}
        >
          {/* 벗겨내기(와이프) 전환: 새 장이 이전 장 위를 쓸고 지나가며 드러납니다 */}
          <div className="absolute inset-2 md:inset-6">
            {prev && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src(prev.n)} alt="" className="absolute inset-0 h-full w-full object-contain" />
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={cur}
              src={src(cur)}
              alt={`${title} — ${fmt(labels.pageTpl, cur)}`}
              onAnimationEnd={() => setPrev(null)}
              className="deck-img absolute inset-0 h-full w-full object-contain"
              style={prev ? { animation: `${prev.dir === 1 ? "deckwipe" : "deckwipeback"} .65s cubic-bezier(.65,0,.35,1) both` } : undefined}
            />
          </div>
          {/* 다음·이전 장 미리 불러오기 */}
          {cur < total && <link rel="preload" as="image" href={src(cur + 1)} />}
          <button
            type="button"
            onClick={() => go(cur - 1)}
            disabled={cur === 1}
            aria-label={labels.prev}
            className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-navy-950/70 text-xl backdrop-blur hover:bg-navy-950 disabled:opacity-25 md:left-4"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => go(cur + 1)}
            disabled={cur === total}
            aria-label={labels.next}
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-navy-950/70 text-xl backdrop-blur hover:bg-navy-950 disabled:opacity-25 md:right-4"
          >
            ›
          </button>
        </div>
      </div>
      <style>{`@keyframes deckwipe{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}@keyframes deckwipeback{from{clip-path:inset(0 0 0 100%)}to{clip-path:inset(0 0 0 0)}}@media (prefers-reduced-motion:reduce){.deck-img{animation:none!important}}`}</style>
    </div>
  );
}
