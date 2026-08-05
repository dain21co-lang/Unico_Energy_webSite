import React, { useEffect, useRef } from "react";
import "./Hero.css";

/**
 * UNICO ENERGY GROUP — Hero section
 * Design reference: "회사 소개서 / 株式會社 유니코에너지그룹" title slide
 * Palette: deep teal → bright cyan, faceted glass panel, serif display type
 */
export default function Hero() {
  const panelRef = useRef(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const handleMove = (e) => {
      const rect = panel.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      panel.style.transform = `rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    };
    const handleLeave = () => {
      panel.style.transform = "rotateY(-8deg) rotateX(4deg)";
    };

    window.addEventListener("mousemove", handleMove);
    handleLeave();
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const facets = [
    { clip: "polygon(0 0, 60% 0, 40% 45%, 0 55%)", tone: "teal-dark" },
    { clip: "polygon(60% 0, 100% 0, 100% 30%, 40% 45%)", tone: "cyan" },
    { clip: "polygon(0 55%, 40% 45%, 55% 100%, 0 100%)", tone: "teal-mid" },
    { clip: "polygon(40% 45%, 100% 30%, 100% 70%, 55% 100%)", tone: "amber" },
    { clip: "polygon(55% 100%, 100% 70%, 100% 100%)", tone: "cyan-light" },
  ];

  return (
    <section className="ue-hero">
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

      <div className="ue-hero__right">
        <div className="ue-hero__panel" ref={panelRef}>
          {facets.map((f, i) => (
            <div
              key={i}
              className={`ue-hero__facet ue-hero__facet--${f.tone}`}
              style={{ clipPath: f.clip }}
            />
          ))}
          <span className="ue-hero__panel-wordmark">UNICO ENERGY GROUP</span>
        </div>
      </div>

      <div className="ue-hero__bottombar">
        <div className="ue-hero__brand">
          <span className="ue-hero__mark" aria-hidden="true">
            U
          </span>
          <span className="ue-hero__brand-text">
            글로벌 자원 트레이딩 및 전략적 인프라 마스터 플랜
          </span>
        </div>
        <a className="ue-hero__bottombar-arrow" href="#about" aria-label="다음 섹션으로 이동">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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
    </section>
  );
}
