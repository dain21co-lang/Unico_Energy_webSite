import { EnNav } from "@/components/EnNav";
import { EnHero } from "@/components/EnHero";
import { EnFooter } from "@/components/EnFooter";
import { EnAbout } from "@/components/EnAbout";
import { EnChairman } from "@/components/EnChairman";
import { EnBusinessUnits } from "@/components/EnBusinessUnits";
import { EnBusinessVideo } from "@/components/EnBusinessVideo";
import { EnCompetitiveness } from "@/components/EnCompetitiveness";
import { EnGrowthStrategy } from "@/components/EnGrowthStrategy";
export default function EnHome() {
  return (
    <>
      <EnNav />
      <main>
        <EnHero />
     <EnAbout />
     <EnChairman />
     <EnBusinessVideo />
     <EnCompetitiveness />
     <EnBusinessUnits />
     <EnGrowthStrategy />
      </main>
      <EnFooter />
    </>
  );
}