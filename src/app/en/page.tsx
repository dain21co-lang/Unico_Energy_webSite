import { EnNav } from "@/components/EnNav";
import { EnHero } from "@/components/EnHero";
import { EnFooter } from "@/components/EnFooter";
import { EnAbout } from "@/components/EnAbout";
export default function EnHome() {
  return (
    <>
      <EnNav />
      <main>
        <EnHero />
     <EnAbout />
      </main>
      <EnFooter />
    </>
  );
}