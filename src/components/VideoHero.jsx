import React from "react";
import "./Hero.css";

/**
 * VideoHero — hero section using the optimized background video
 * Place hero-bg.mp4 in your public/ folder (e.g. public/videos/hero-bg.mp4)
 */
export default function VideoHero() {
  return (
    <section className="ue-hero ue-hero--video">
      <video
        className="ue-hero__bg-video"
        autoPlay
        loop
        muted
        playsInline
        poster="/videos/hero-bg-poster.jpg"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      <div className="ue-hero__video-overlay" />

      <div className="ue-hero__left">
        <p className="ue-hero__eyebrow">GLOBAL TRADE · ENERGY PLATFORM</p>
        <h1 className="ue-hero__title">
          회사 소개서
          <span className="ue-hero__title-sub">株式會社 유니코에너지그룹</span>
        </h1>
        <p className="ue-hero__tagline">
          글로벌 에너지 트레이딩 · 석유제품 수출입 · 비철금속 종합무역
        </p>
        <div className="ue-hero__cta-row">
          <a className="ue-hero__cta" href="#contact">
            투자 문의하기
          </a>
          <a className="ue-hero__arrow-btn" href="#about" aria-label="회사 소개 더 보기">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
