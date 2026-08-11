import { CONTACT_INFO } from "@/config/contact";

const LINKS = [
  { href: "#about", label: "회사소개" },
  { href: "#business", label: "사업분야" },
  { href: "#competitiveness", label: "핵심경쟁력" },
  { href: "#growth", label: "성장전략" },
  { href: "#esg", label: "ESG" },
];

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-paper-soft py-14">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-lg font-bold tracking-tight text-ink-100">
              UNICO<span className="text-gradient-gold">ENERGY</span> GROUP
            </p>
            <p className="mt-3 max-w-xs break-keep text-sm leading-relaxed text-ink-400">
              (주)유니코에너지그룹
              <br />
              {CONTACT_INFO.address}<br />
              대표이사 윤승영 · 사업자등록번호 671-81-03337
            </p>
          </div>

          <ul className="flex flex-wrap gap-x-8 gap-y-3">
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
        </div>

        <div className="mt-10 border-t border-black/10 pt-6">
          <p className="text-xs text-ink-600">
            © {new Date().getFullYear()} UNICO ENERGY GROUP CO., LTD. All
            rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
