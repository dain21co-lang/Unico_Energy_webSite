"use client";

import { useState } from "react";
import { CONTACT_INFO } from "@/config/contact";

export function PrivacyPolicy() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm text-ink-300 transition-colors hover:text-gold-400"
      >
        개인정보처리방침
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-paper-soft p-6 sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink-100">개인정보처리방침</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-ink-400 hover:text-ink-100"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-ink-400">
              <p>
                (주)유니코에너지그룹(이하 &apos;회사&apos;)은 정보주체의 개인정보를 중요시하며,
                「개인정보 보호법」 등 관련 법령을 준수하기 위하여 다음과 같이
                개인정보처리방침을 수립·공개합니다.
              </p>

              <div>
                <p className="font-semibold text-ink-100">1. 수집하는 개인정보 항목</p>
                <p>회사는 비즈니스 제휴 및 투자 문의 접수를 위해 다음 정보를 수집할 수 있습니다.</p>
                <p>- 필수: 성명, 회사명, 이메일, 연락처, 문의 내용</p>
              </div>

              <div>
                <p className="font-semibold text-ink-100">2. 개인정보의 수집 및 이용 목적</p>
                <p>- 제휴·투자 문의에 대한 확인 및 회신</p>
                <p>- 사업 제안 및 상담 진행</p>
              </div>

              <div>
                <p className="font-semibold text-ink-100">3. 개인정보의 보유 및 이용 기간</p>
                <p>
                  수집일로부터 문의 처리 완료 후 1년까지 보유하며, 이후 지체 없이
                  파기합니다. 단, 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안
                  보관합니다.
                </p>
              </div>

              <div>
                <p className="font-semibold text-ink-100">4. 개인정보의 제3자 제공</p>
                <p>
                  회사는 정보주체의 동의, 법령의 특별한 규정 등 「개인정보 보호법」
                  제17조에 해당하는 경우를 제외하고는 개인정보를 제3자에게 제공하지
                  않습니다.
                </p>
              </div>

              <div>
                <p className="font-semibold text-ink-100">5. 정보주체의 권리와 행사 방법</p>
                <p>
                  정보주체는 언제든지 자신의 개인정보에 대한 열람, 정정, 삭제, 처리정지를
                  요구할 수 있으며, 아래 담당자에게 연락하여 처리할 수 있습니다.
                </p>
              </div>

              <div>
                <p className="font-semibold text-ink-100">6. 개인정보 보호책임자 및 문의처</p>
                <p>회사: (주)유니코에너지그룹</p>
                <p>이메일: {CONTACT_INFO.email}</p>
                <p>전화: {CONTACT_INFO.phone}</p>
              </div>

              <p className="pt-2 text-xs text-ink-600">
                본 방침은 2026년 8월 11일부터 적용됩니다.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}