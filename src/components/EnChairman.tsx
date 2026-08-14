import Image from "next/image";
import { SectionLabel } from "./SectionLabel";

export function EnChairman() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy-950 to-[#161e25] py-28 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="grid items-start gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-lg">
            <Image
              src="/images/chairman-photo.jpg"
              alt="UNICO ENERGY GROUP Chairman Young-Chang Choi"
              fill
              sizes="(min-width: 1024px) 40vw, 80vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent" />
          </div>

          <div>
            <SectionLabel index="02. CHAIRMAN'S MESSAGE" title="Chairman's Message" />
            <div className="mt-6 h-px w-16 divider-gold" />

            <p className="mt-8 break-keep text-xl font-medium leading-snug text-silver-300 sm:text-2xl">
              A Challenge for a New Era,
              <br />
              and the <span className="text-gold-400">Creation of Greater Value</span>
            </p>

            <div className="mt-8 space-y-5 break-keep leading-loose text-silver-400">
              <p>
                To our valued clients, esteemed partners, and dedicated
                colleagues, I extend my deepest gratitude to everyone who has
                shown unwavering trust and cooperation to UNICO ENERGY GROUP.
              </p>
              <p>
                Today, the global economy is changing faster and more
                intricately than ever before. Geopolitical tensions, the
                restructuring of supply chains, strengthened energy
                security, the shift toward eco-friendly industries, and the
                spread of new technologies centered on artificial
                intelligence (AI) are reshaping the landscape of industries
                and markets.
              </p>
              <p>
                UNICO ENERGY GROUP is building a stable supply chain centered
                on raw material trading, combining the UAE&apos;s emerging
                network, Singapore&apos;s global financial expertise, and
                Korea&apos;s industrial capabilities to grow into a
                comprehensive platform that enables domestic companies to
                expand into global markets.
              </p>
              <p>
                Grounded in risk management and ethical leadership, and
                through the cultivation of talent, we will continue to grow
                as a trusted company, achieving success together with you. I
                sincerely wish you all health, prosperity, and boundless
                success. Thank you.
              </p>
            </div>

            <div className="mt-10 flex flex-nowrap items-center justify-start gap-1 pr-4">
              <p className="whitespace-nowrap text-xs font-medium tracking-wide text-silver-300 sm:text-sm">
                Chairman, UNICO ENERGY GROUP&nbsp;&nbsp;Brian Choi
                <span className="ml-2 text-silver-500"></span>
              </p>
              <Image
                src="/images/signature-brian-choi-white.png"
                alt="Signature of Chairman Brian Choi"
                width={612}
                height={328}
                className="h-10 sm:h-16 w-auto shrink-0 opacity-90 object-contain max-w-[45%]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}