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
        <a href="#top" className="flex items-baseline gap-2">
          <span className="text-lg font-extrabold tracking-wide text-ink-100 drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]">
            <span className="hidden sm:inline">UNICO </span>ENERGY GROUP
          </span>
        </a>

        <ul className="hidden items-center gap-9 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              
             <a href={link.href}
                className="text-sm text-ink-300 transition-colors hover:text-gold-400"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        
          <a href="#contact"
          className="hidden rounded-full border border-gold-500/60 px-5 py-2 text-sm font-medium text-gold-600 transition-colors md:inline-block"
        >
          Contact Us
        </a>
      </nav>
    </header>
  );
}