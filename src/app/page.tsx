import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Chairman } from "@/components/Chairman";
import { BusinessUnits } from "@/components/BusinessUnits";
import GlobalDigitalFinance from "@/components/GlobalDigitalFinance";
import { BusinessVideo } from "@/components/BusinessVideo";
import { Competitiveness } from "@/components/Competitiveness";
import { GrowthStrategy } from "@/components/GrowthStrategy";
import { ESG } from "@/components/ESG";
import { Contact } from "@/components/Contact";
import CTASection from "@/components/CTASection";
import Downloads from "@/components/Downloads";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />

        <About />
        <Chairman />
        <BusinessUnits />
<GlobalDigitalFinance />
<BusinessVideo />
        <Competitiveness />
        <GrowthStrategy />
        <CTASection />
<Downloads />
        <ESG />
        <Contact />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}