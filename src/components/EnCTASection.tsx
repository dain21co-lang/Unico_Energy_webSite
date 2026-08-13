import { CONTACT_INFO } from "@/config/contact";
import Image from "next/image";

/**
 * EnCTASection
 * English version of CTASection. Standalone CTA section placed right after Hero.
 * The only dark navy accent section against the site's overall light tone,
 * uses navy-950/gold/silver tokens only (ink-* scale is for light backgrounds, not used here)
 */

export default function EnCTASection() {
  return (
    <section
      className="relative w-full overflow-hidden bg-navy-950 px-6 py-16 sm:py-20"
      aria-label="Inquiry and product information"
    >
      <Image
        src="/images/cta-ocean-aerial.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-navy-950/60" />

      <div className="relative z-10 mx-auto flex max-w-md flex-col items-center text-center">
        <p className="mb-3 text-sm font-medium tracking-wide text-gold-400">
          UNICO ENERGY GROUP
        </p>

        <h2 className="mb-4 text-2xl font-bold leading-snug text-silver-300 sm:text-3xl">
          Your Global Partner
          <br />
          Connecting Real Assets to Finance
        </h2>

        <p className="mb-4 break-keep text-base leading-relaxed text-silver-400">
          From energy and non-ferrous metal trading to strategic investment,
          <br />
          UNICO ENERGY GROUP is with you.
        </p>

        <p className="mb-10 break-keep text-sm leading-relaxed text-silver-400/80">
          Beneath the <span className="text-gold-400">tip of the iceberg</span> lies
          an unseen network of real assets.
        </p>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          {/* Primary CTA: contact */}
          <a
            href={CONTACT_INFO.phoneHref}
            className="flex min-h-[44px] w-full items-center justify-center rounded-full bg-gold-500 px-8 py-3.5 text-base font-semibold text-navy-950 transition-opacity hover:opacity-90 focus-visible:outline-none"
          >
            Contact Us
          </a>

          {/* Secondary CTA: view business areas (no separate /products route, anchors within the page) */}
          <a
            href="#business"
            className="flex min-h-[44px] w-full items-center justify-center rounded-full border border-gold-500 px-8 py-3.5 text-base font-semibold text-silver-300 transition-colors hover:bg-white/10 focus-visible:outline-none"
          >
            View Business Areas
          </a>
        </div>
      </div>
    </section>
  );
}