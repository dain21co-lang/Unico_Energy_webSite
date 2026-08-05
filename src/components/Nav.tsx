"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#about", label: "회사소개" },
  { href: "#business", label: "사업분야" },
  { href: "#competitiveness", label: "핵심경쟁력" },
  { href: "#growth", label: "성장전략" },
  { href: "#esg", label: "ESG" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{ isolation: "isolate", transform: "translateZ(0)" }}
      className={`fixed inset-x-0 top-0 z-[100] transition-colors duration-300 ${
        scrolled
          ? "bg-paper/90 backdrop-blur-md border-b border-black/5"
          : "bg-gradient-to-b from-paper/70 to-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <a href="#top" className="flex items-baseline gap-2">
          <span className="text-lg font-extrabold tracking-wide text-ink-100 drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]">
            <span className="hidden sm:inline">株式會社</span>유니코에너지그룹
          </span>
        </a>

        <ul className="hidden items-center gap-9 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-ink-300 transition-colors hover:text-gold-400"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="hidden rounded-full border border-gold-500/60 px-5 py-2 text-sm font-medium text-gold-600 transition-colors hover:bg-gold-500 hover:text-navy-950 md:inline-block"
        >
          투자 문의하기
        </a>

        <button
          type="button"
          aria-label="메뉴 열기"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`h-[3px] w-6 rounded-full bg-ink-100 transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`h-[3px] w-6 rounded-full bg-ink-100 transition-opacity ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`h-[3px] w-6 rounded-full bg-ink-100 transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {open && (
        <div className="relative border-t border-black/5 bg-paper px-6 pb-6 md:hidden">
          <ul className="flex flex-col gap-4 pt-4">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-base text-ink-300 hover:text-gold-400"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-2 inline-block rounded-full border border-gold-500/60 px-5 py-2 text-sm font-medium text-gold-600"
              >
                투자 문의하기
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
