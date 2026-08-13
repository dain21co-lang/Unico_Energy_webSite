"use client";

import { useState } from "react";

export function EnContactForm() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // TODO: server/email integration point — currently shows submission confirmation only
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-black/10 bg-paper-soft p-8 text-center">
        <p className="text-sm font-semibold text-gold-600">
          Your inquiry has been received
        </p>
        <p className="mt-2 text-sm text-ink-300">
          Our team will review it and respond as soon as possible.
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
        Send an Inquiry
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <label className="text-sm text-ink-300" htmlFor="contact-name">
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/10 bg-paper px-3 py-2 text-sm text-ink-100 outline-none focus:border-gold-400"
            placeholder="Please enter your name"
          />
        </div>

        <div>
          <label className="text-sm text-ink-300" htmlFor="contact-company">
            Company
          </label>
          <input
            id="contact-company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/10 bg-paper px-3 py-2 text-sm text-ink-100 outline-none focus:border-gold-400"
            placeholder="Please enter your company name (optional)"
          />
        </div>

        <div>
          <label className="text-sm text-ink-300" htmlFor="contact-message">
            Message
          </label>
          <textarea
            id="contact-message"
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/10 bg-paper px-3 py-2 text-sm text-ink-100 outline-none focus:border-gold-400"
            placeholder="Please enter your inquiry"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-full bg-gold-500 py-3 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-600"
      >
        Send Inquiry
      </button>
    </form>
  );
}