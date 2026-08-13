import { EnNav } from "@/components/EnNav";
import { EnHero } from "@/components/EnHero";
import { EnFooter } from "@/components/EnFooter";

export default function EnHome() {
  return (
    <>
      <EnNav />
      <main>
        <EnHero />
      </main>
      <EnFooter />
    </>
  );
}