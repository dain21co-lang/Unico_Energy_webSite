/*
 * 영문 버전 문구 — 한글 data.ts와 같은 순서·같은 개수로 맞춰 둡니다.
 * 한글을 고치면 여기 영문도 같이 고쳐 주세요.
 */
import { createContext, useContext } from "react";

export type Lang = "ko" | "en";
export const LangCtx = createContext<Lang>("ko");
export const useLang = () => useContext(LangCtx);
/** 한글/영문 중 현재 언어 쪽을 고른다 */
export const pick = <T,>(lang: Lang, ko: T, en: T) => (lang === "en" ? en : ko);

export const CO_EN = {
  name: "Global Infra Hub Co., Ltd.",
  ceo: "Hyun-geun Yoo",
  founded: "May 2015",
  address: "Seoul, Korea (head office relocation pending)",
};

export const BUSINESS_EN = [
  {
    t: "Real Estate Investment",
    d: "We source income-producing and development assets, review title and return structures, and design investment structures fit for holding and operation.",
    items: ["Asset sourcing & screening", "Title & collateral review", "Holding & operating structure", "Exit strategy"],
  },
  {
    t: "Real Estate Development",
    d: "From site review to permits, feasibility and financing structure, we design a development project from start to finish.",
    items: ["Site & location review", "Permit & schedule review", "Feasibility (P&L) analysis", "PF & bridge financing advisory"],
  },
  {
    t: "Investment Advisory",
    d: "Standing between investors and sponsors, we lead due diligence and structuring so decisions can be made on numbers and documents.",
    items: ["Due diligence", "Financial & tax structure review", "Deal terms & contract structuring", "Institutional & lender introductions"],
  },
];

export const PROCESS_EN = [
  { t: "Sourcing", d: "We find assets and opportunities and run a first screen against our investment criteria." },
  { t: "Due Diligence", d: "We check registries, permits and financials against originals to find hidden risks first." },
  { t: "Structuring", d: "We design collateral, financing and holding structures and set the deal terms." },
  { t: "Execution", d: "After signing and funding, we manage the project all the way to exit." },
];

export const PRINCIPLES_EN = [
  { t: "Verify with documents", d: "Registries and financial statements come before words." },
  { t: "Risks first", d: "We tell you what could go wrong before what looks good." },
  { t: "Protect by structure", d: "Collateral and contract structures protect investor capital." },
  { t: "Manage to the end", d: "We stay accountable from investment through exit." },
];

export const RECORD_STATS_EN = [
  { n: 240, unit: "bn", t: "Assets reviewed (KRW)" },
  { n: 18, unit: "", t: "Assets under due diligence" },
  { n: 6, unit: "", t: "Structuring mandates" },
];

export const CASES_EN = [
  { tag: "Office", t: "Repositioning an aging CBD office", d: "Investment structure to lift asset value through title cleanup, remodeling and re-leasing", size: "c. KRW 62bn", role: "Investment structuring" },
  { tag: "Development", t: "Mixed-use residential site, Greater Seoul", d: "Permit timeline and feasibility review, advising the bridge-to-PF transition", size: "c. KRW 98bn", role: "Feasibility · PF advisory" },
  { tag: "Hospitality", t: "Regional tourist hotel renewal", d: "Verified sunk construction costs and designed a reopening structure with an operator", size: "c. KRW 35bn", role: "Due diligence · Structuring" },
  { tag: "Advisory", t: "Property-backed financing for a listed company", d: "Structured financing and deal terms secured on the company's real estate", size: "c. KRW 45bn", role: "Investment advisory" },
];

export const SECTORS_EN = ["Office", "Development sites", "Hotel & tourism", "Logistics & other"];

export const MENU_EN: [string, string[]][] = [
  ["About", ["Overview", "CEO Message"]],
  ["Business", ["Real Estate Investment", "Development", "Investment Advisory"]],
  ["Approach", ["4-Step Process", "Principles"]],
  ["Track Record", []],
  ["Contact", []],
];
