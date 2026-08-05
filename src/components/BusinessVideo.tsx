export function BusinessVideo() {
  return (
    <section aria-label="사업 현장 영상" className="w-full py-16 sm:py-20">
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl shadow-lg relative group">
        <img
          src="/images/unico-ship-blueprint-v2.jpg"
          alt="유니코에너지그룹 글로벌 물류 및 도면 디자인"
          className="w-full h-auto object-contain transform transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      </div>
    </section>
  );
}