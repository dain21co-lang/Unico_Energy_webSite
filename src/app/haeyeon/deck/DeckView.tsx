"use client";

import { useState } from "react";

const N = 54;
const SRC = (i: number) => `/haeyeon/deck/${String(i).padStart(2, "0")}.webp`;

export default function DeckView() {
  const [cur, setCur] = useState(1);
  const [one, setOne] = useState(false);

  return (
    <div className="hy min-h-screen bg-[#e9ece5]">
      <header className="sticky top-0 z-30 border-b border-black/5 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-2.5">
          <a href="/haeyeon" className="flex items-center gap-1.5 text-[13px] font-bold text-[var(--hy-forest)]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
            사이트로
          </a>
          <p className="text-[13.5px] font-black">회사소개서 <span className="font-semibold text-[var(--hy-sub)]">{N}p</span></p>
          <a href="/haeyeon/files/haeyeon-company-profile.pdf" target="_blank" rel="noopener" className="rounded-full bg-[var(--hy-orange)] px-3 py-1.5 text-[12px] font-bold text-white">PDF</a>
        </div>
        <div className="mx-auto flex max-w-3xl justify-center gap-1 pb-2 text-[12px] font-semibold">
          <button type="button" onClick={() => setOne(false)} className={`rounded-full px-3 py-1 ${!one ? "bg-[var(--hy-forest)] text-white" : "text-[var(--hy-sub)]"}`}>스크롤 보기</button>
          <button type="button" onClick={() => setOne(true)} className={`rounded-full px-3 py-1 ${one ? "bg-[var(--hy-forest)] text-white" : "text-[var(--hy-sub)]"}`}>한 장씩 보기</button>
        </div>
      </header>

      {!one ? (
        <main className="mx-auto grid max-w-3xl gap-3 px-3 py-4">
          {Array.from({ length: N }, (_, k) => k + 1).map((i) => (
            <figure key={i} className="overflow-hidden rounded-md bg-white shadow-sm">
              <img src={SRC(i)} alt={`회사소개서 ${i}페이지`} loading={i <= 2 ? "eager" : "lazy"} width={1287} height={910} className="h-auto w-full" />
            </figure>
          ))}
          <a href="/haeyeon/files/haeyeon-company-profile.pdf" target="_blank" rel="noopener" className="mx-auto my-4 rounded-full bg-[var(--hy-orange)] px-6 py-3 text-[14px] font-bold text-white">PDF로 내려받기</a>
        </main>
      ) : (
        <main className="mx-auto flex max-w-3xl flex-col items-center px-3 py-5">
          <div className="w-full overflow-hidden rounded-md bg-white shadow-md">
            <img src={SRC(cur)} alt={`회사소개서 ${cur}페이지`} width={1287} height={910} className="h-auto w-full" />
          </div>
          <div className="mt-4 flex items-center gap-4">
            <button type="button" aria-label="이전 페이지" disabled={cur === 1} onClick={() => setCur(cur - 1)} className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow disabled:opacity-40">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
            </button>
            <p className="hy-brand min-w-[64px] text-center text-[15px] font-bold">{cur} / {N}</p>
            <button type="button" aria-label="다음 페이지" disabled={cur === N} onClick={() => setCur(cur + 1)} className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--hy-forest)] text-white shadow disabled:opacity-40">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
            </button>
          </div>
          <p className="mt-3 text-[11.5px] text-[var(--hy-sub)]">가로로 돌려 보시면 더 크게 보입니다.</p>
        </main>
      )}
    </div>
  );
}
