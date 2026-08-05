export function SectionLabel({
  index,
  title,
  align = "left",
}: {
  index: string;
  title: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <p className="text-xs font-semibold tracking-[0.35em] text-gold-400">
        {index}
      </p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-100 sm:text-4xl">
        {title}
      </h2>
      <div
        className={`mt-6 h-px w-16 divider-gold ${align === "center" ? "mx-auto" : ""}`}
      />
    </div>
  );
}
