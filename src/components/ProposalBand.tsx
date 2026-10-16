export function ProposalBand() {
  return (
    <section
      aria-label="사업소개서 바로보기"
      className="bg-navy-950 px-6 py-8 sm:py-10"
    >
      <div className="mx-auto max-w-md text-center">
        <p className="text-xs font-semibold tracking-[0.3em] text-gold-400">
          BUSINESS PROPOSAL
        </p>
        <p className="mt-2 text-sm text-silver-300">
          유니코에너지그룹 사업소개서를 바로 확인해 보세요
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <a
            href="/deck"
            className="flex min-h-[48px] items-center justify-center rounded-full bg-gold-500 px-4 text-sm font-semibold text-navy-950 transition-opacity hover:opacity-90"
          >
            사업소개서 (한글)
          </a>
          <a
            href="/en/deck"
            className="flex min-h-[48px] items-center justify-center rounded-full border border-gold-500 px-4 text-sm font-semibold text-gold-300 transition-colors hover:bg-white/10"
          >
            Proposal (English)
          </a>
        </div>
      </div>
    </section>
  );
}
