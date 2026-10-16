'use client';

import { SectionLabel } from './SectionLabel';

interface DownloadItem {
  title: string;
  description: string;
  file: string;
  size: string;
  /** 웹에서 바로 볼 수 있는 뷰어 주소(있으면 '바로보기' 버튼 표시) */
  view?: string;
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
  },  {
    title: '유니코에너지그룹 사업소개서',
    description: '2026.08',
    file: '/documents/unico_business_proposal_kr.pdf',
    size: 'PDF',
    view: '/deck',
  },
  {
    title: 'UNICO ENERGY GROUP Business Proposal',
    description: '2026.08',
    file: '/documents/unico_business_proposal_en.pdf',
    size: 'PDF',
    view: '/en/deck',
  },  {
    title: '하동 LPG 탱크 터미널사업 타당성검토서',
    description: '2026.08',
    file: '/documents/unico_hadong_lpg_feasibility_kr.pdf',
    size: 'PDF',
  },
  {
    title: 'Hadong LPG Tank Terminal Project Feasibility Study',
    description: '2026.08',
    file: '/documents/unico_hadong_lpg_feasibility_en.pdf',
    size: 'PDF',
  },
];

export default function Downloads() {
  return (
    <section id="downloads" className="scroll-mt-20 py-28 px-6 bg-navy-950">
      <div className="max-w-md mx-auto">
        <SectionLabel index="RESOURCES" title="자료실" tone="dark" />
        <p className="mt-5 mb-8 text-sm text-silver-400">
          유니코에너지그룹의 주요 문서를 확인하고 다운로드하실 수 있습니다
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

              {doc.view && (
                <a
                  href={doc.view}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#C9A84C] text-[#C9A84C] font-semibold text-sm py-2.5 hover:bg-[#C9A84C]/10 transition-colors"
                >
                  {doc.view.startsWith('/en') ? 'View online' : '바로보기'}
                </a>
              )}
              
                <a href={doc.file}
                download
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C9A84C] text-[#0A1628] font-semibold text-sm py-2.5 hover:bg-[#C9A961] transition-colors"
              >
                {doc.file.endsWith('_en.pdf') ? 'Download' : '다운로드'}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}