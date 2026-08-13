import { EnNav } from "@/components/EnNav";
import { EnFooter } from "@/components/EnFooter";

export default function EnHome() {
  return (
    <>
      <EnNav />
      <main>
        <p style={{ color: "black", padding: "100px", fontSize: "24px" }}>English version coming soon</p>
      </main>
      <EnFooter />
    </>
  );
}