"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#about", label: "Company" },
  { href: "#business", label: "Business" },
  { href: "#competitiveness", label: "Competitiveness" },
  { href: "#growth", label: "Growth Strategy" },
  { href: "#esg", label: "ESG" },
];

export function EnNav() {
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
      style={{
        isolation: "isolate",
        transform: "translateZ(0)",
        top: "var(--kakao-banner-height, 0px)",
      }}
      className={`fixed inset-x-0 z-[100] transition-[background-color,top] duration-300 ${
        scrolled
          ? "bg-paper/90 backdrop-blur-md border-b border-black/5"
          : "bg-gradient-to-b from-paper/70 to-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">

        {/* Logo */}
        <a
          href="#top"
          className="flex items-baseline gap-2"
          onClick={() => setOpen(false)}
        >
          <span className="text-lg font-extrabold tracking-wide text-ink-100 drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]">
            <span className="hidden sm:inline">UNICO </span>
            ENERGY GROUP
          </span>
        </a>

        {/* Desktop Navigation */}
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

        {/* Desktop Contact */}
        <a
          href="#contact"
          className="hidden rounded-full border border-gold-500/60 px-5 py-2 text-sm font-medium text-gold-600 transition-colors hover:bg-gold-500 hover:text-navy-950 md:inline-block"
        >
          Contact Us
        </a>

{/* Desktop Language Switch */}

  <a href="/"
  className="hidden text-sm font-medium text-ink-300 transition-colors hover:text-gold-400 md:inline-block"
>
  KR
</a>

{/* Mobile Language Switch (always visible) */}

  <a href="/"
 className="mr-3 flex items-center rounded-full bg-black px-4 py-2 text-base font-extrabold tracking-wide text-yellow-300 md:hidden"
>
  KR
</a>
         

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`block h-0.5 w-6 bg-ink-100 transition-transform ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />

          <span
            className={`block h-0.5 w-6 bg-ink-100 transition-opacity ${
              open ? "opacity-0" : ""
            }`}
          />

          <span
            className={`block h-0.5 w-6 bg-ink-100 transition-transform ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-black/5 bg-paper px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-4">

            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block text-sm text-ink-300 transition-colors hover:text-gold-400"
                >
                  {link.label}
                </a>
              </li>
            ))}

            {/* Mobile Contact */}
            <li>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="block rounded-full border border-gold-500/60 px-5 py-2 text-center text-sm font-medium text-gold-600 transition-colors hover:bg-gold-500 hover:text-navy-950"
              >
                Contact Us
              </a>
            </li>

            {/* Mobile Language Switch */}
            <li className="border-t border-black/10 pt-4">
              <a
                href="/"
                onClick={() => setOpen(false)}
                className="block text-sm font-semibold text-gold-600 transition-colors hover:text-gold-400"
              >
                한국어 →
              </a>
            </li>

          </ul>
        </div>
      )}
    </header>
  );
}