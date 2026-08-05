import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Chairman } from "@/components/Chairman";
import { BusinessUnits } from "@/components/BusinessUnits";
import { BusinessVideo } from "@/components/BusinessVideo";
import { Competitiveness } from "@/components/Competitiveness";
import { GrowthStrategy } from "@/components/GrowthStrategy";
import { ESG } from "@/components/ESG";
import { Contact } from "@/components/Contact";
import CTASection from "@/components/CTASection";
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
        <BusinessVideo />
        <Competitiveness />
        <GrowthStrategy />
        <ESG />
        <Contact />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
