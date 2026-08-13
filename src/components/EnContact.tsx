import { Reveal } from "./Reveal";
import { CONTACT_INFO } from "@/config/contact";
import { EnContactForm } from "@/components/EnContactForm";

export function EnContact() {
  return (
    <section id="contact" className="relative scroll-mt-20 overflow-hidden bg-paper py-28 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-gold-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-4xl px-6 text-center sm:px-10">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.35em] text-gold-400">
            09. CONTACT
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink-100 sm:text-4xl">
            Ready for Your Next Great Challenge?
            <br />
            UNICO ENERGY GROUP is here to help.
          </h2>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-ink-300">
            All inquiries regarding business partnerships and investment<br />
            are reviewed promptly and with care.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mx-auto mt-12 grid max-w-xl gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 sm:grid-cols-2">
            <div className="bg-paper-soft p-7 text-left">
              <p className="text-xs font-semibold tracking-[0.2em] text-gold-600">
                Headquarters
              </p>
              <p className="mt-3 break-keep text-sm leading-relaxed text-ink-200">
                {CONTACT_INFO.address}
              </p>
            </div>
            <div className="bg-paper-soft p-7 text-left">
              <p className="text-xs font-semibold tracking-[0.2em] text-gold-600">
                Business & Investment Inquiries
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-200">
                <a
                  href={CONTACT_INFO.phoneHref}
                  className="transition-colors hover:text-gold-600"
                >
                  {CONTACT_INFO.phone}
                </a>
                <br />

                <a
                  href={CONTACT_INFO.emailHref}
                  className="transition-colors hover:text-gold-600"
                >
                  {CONTACT_INFO.email}
                </a>
              </p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.3}>
        <EnContactForm />
        </Reveal>
      </div>

      <div className="relative -mb-28 mt-20 h-60vh-safe w-full overflow-hidden bg-navy-950 sm:-mb-32">
        <img
          src="/images/unico-ship-blueprint-v2.jpg"
          alt="UNICO ENERGY GROUP Ship Blueprint"
          className="absolute inset-0 h-full w-full object-contain"
        />
      </div>
    </section>
  );
}