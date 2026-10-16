"use client";

import { useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // TODO: 서버/이메일 연동 지점 — 지금은 화면에만 접수 완료 표시
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-black/10 bg-paper-soft p-8 text-center">
        <p className="text-sm font-semibold text-gold-600">
          문의가 접수되었습니다
        </p>
        <p className="mt-2 text-sm text-ink-300">
          빠른 시일 내에 담당자가 확인 후 회신드리겠습니다.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-12 max-w-xl rounded-2xl border border-black/10 bg-paper-soft p-7 text-left"
    >
      <p className="text-xs font-semibold tracking-[0.2em] text-gold-600">
        문의하기
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <label className="text-sm text-ink-300" htmlFor="contact-name">
            이름
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/20 bg-paper px-3 py-2.5 text-sm text-ink-100 outline-none placeholder:text-ink-600 focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
            placeholder="성함을 입력해 주세요"
          />
        </div>

        <div>
          <label className="text-sm text-ink-300" htmlFor="contact-company">
            회사명
          </label>
          <input
            id="contact-company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/20 bg-paper px-3 py-2.5 text-sm text-ink-100 outline-none placeholder:text-ink-600 focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
            placeholder="회사명을 입력해 주세요 (선택)"
          />
        </div>

        <div>
          <label className="text-sm text-ink-300" htmlFor="contact-message">
            문의 내용
          </label>
          <textarea
            id="contact-message"
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/20 bg-paper px-3 py-2.5 text-sm text-ink-100 outline-none placeholder:text-ink-600 focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
            placeholder="문의하실 내용을 입력해 주세요"
          />
        </div>
      </div>

      <label className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-ink-300">
        <input
          type="checkbox"
          required
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#cfa646]"
        />
        <span>
          문의 응대를 위한 개인정보(이름·회사명·문의 내용) 수집·이용에
          동의합니다 (필수). 자세한 내용은 하단 개인정보처리방침을 참고해 주세요
        </span>
      </label>

      <button
        type="submit"
        className="mt-6 w-full rounded-full bg-gold-500 py-3 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400"
      >
        문의 보내기
      </button>
    </form>
  );
}