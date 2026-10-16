export function SectionLabel({
  index,
  title,
  align = "left",
  tone = "light",
}: {
  index: string;
  title: string;
  align?: "left" | "center";
  /** "dark": 어두운 배경 위에서 제목을 밝게 표시 */
  tone?: "light" | "dark";
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <p className="text-xs font-semibold tracking-[0.35em] text-gold-400">
        {index}
      </p>
      <h2
        className={`mt-3 text-3xl font-bold tracking-tight sm:text-4xl ${
          tone === "dark" ? "text-white" : "text-ink-100"
        }`}
      >
        {title}
      </h2>
      <div
        className={`mt-6 h-px w-16 divider-gold ${align === "center" ? "mx-auto" : ""}`}
      />
    </div>
  );
}
