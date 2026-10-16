import { LazyVideo } from "./LazyVideo";

export function BusinessVideo() {
  return (
    <section aria-label="사업 현장 영상" className="w-full px-6 py-16 sm:py-20">
      <div className="group relative mx-auto w-full max-w-md overflow-hidden rounded-2xl shadow-lg">
        <LazyVideo
          src="/videos/competitiveness-hub.mp4"
          className="h-auto w-full transform object-contain transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>
    </section>
  );
}
