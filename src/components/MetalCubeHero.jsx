import { useRef } from "react";
import "./MetalCubeHero.css";

/**
 * MetalCubeHero — CSS-only 3D tilt effect over a looping background video
 * Replaces the WebGL AlchemistSphere: no Canvas, no Context Lost risk,
 * works identically on every device including low-end mobile
 *
 * onTimeUpdate / onLoadedMetadata are forwarded from the underlying <video>
 * so parent components (e.g. Hero) can drive UI like a phase indicator
 * off actual playback progress
 */
/**
 * @param {{
 *   onTimeUpdate?: (e: React.SyntheticEvent<HTMLVideoElement>) => void,
 *   onLoadedMetadata?: (e: React.SyntheticEvent<HTMLVideoElement>) => void,
 * }} props
 */
export default function MetalCubeHero({ onTimeUpdate, onLoadedMetadata } = {}) {
  const wrapRef = useRef(null);
  const cardRef = useRef(null);

  const handleMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 18}deg) scale(1.02)`;
  };

  const handleLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "rotateY(0deg) rotateX(0deg) scale(1)";
  };

  return (
    <div
      className="metal-cube-hero"
      ref={wrapRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="metal-cube-hero__glow" aria-hidden="true" />
      <div className="metal-cube-hero__card" ref={cardRef}>
        <video
          className="metal-cube-hero__image"
          autoPlay
          loop
          muted
          playsInline
          poster="/videos/hero-poster.jpg"
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
        >
          <source src="/videos/hero-web-v2.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
