'use client';

interface DownloadItem {
  title: string;
  description: string;
  file: string;
  size: string;
}

const documents: DownloadItem[] = [
  {
    title: '유니코에너지그룹 주식가치 산정보고서',
    description: '삼덕회계법인 평가 · 2026.08',
    file: '/documents/unico_valuation_report_kr.pdf',
    size: 'PDF',
  },
  {
    title: 'UNICO ENERGY GROUP Share Valuation Report',
    description: 'Evaluated by Samduk Accounting Corporation · 2026.08',
    file: '/documents/unico_valuation_report_en.pdf',
    size: 'PDF',
  },
];

export default function Downloads() {
  return (
    <section id="downloads" className="py-20 px-4 bg-[#0A1628]">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2">자료실</h2>
        <p className="text-sm text-[#C9A84C] mb-8">
          유니코에너지그룹의 주요 문서를 다운로드하실 수 있습니다.
        </p>

        <div className="space-y-4">
          {documents.map((doc, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#0B1730] border border-[#C9A84C]/20 shadow-lg p-5 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-white font-semibold text-base leading-snug">
                    {doc.title}
                  </h3>
                  <p className="text-gray-400 text-xs mt-1">{doc.description}</p>
                </div>
                <span className="shrink-0 text-[10px] font-medium text-[#C9A84C] border border-[#C9A84C]/40 rounded px-2 py-0.5">
                  {doc.size}
                </span>
              </div>

              
                <a href={doc.file}
                download
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C9A84C] text-[#0A1628] font-semibold text-sm py-2.5 hover:bg-[#C9A961] transition-colors"
              >
                다운로드
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}