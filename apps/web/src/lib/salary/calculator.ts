// Salary calculation utilities
import { DEFAULT_LOCALE } from "@/lib/format/time";

export interface SalaryRange {
  min: number;
  median: number;
  max: number;
  percentile25: number;
  percentile75: number;
}

export interface SalaryInput {
  role: string;
  location: string;
  yearsExperience: number;
  skills?: string[];
}

export interface CompensationOffer {
  id: string;
  company: string;
  role: string;
  baseSalary: number;
  signingBonus?: number;
  annualBonus?: number;
  equityValue?: number;
  vestingYears?: number;
  benefits?: string[];
  pto?: number;
  remote?: "full" | "hybrid" | "office";
}

export interface TotalCompensation {
  annualBase: number;
  annualBonus: number;
  annualEquity: number;
  signingBonusAnnualized: number;
  totalAnnual: number;
  totalFourYear: number;
}

// Location cost-of-living multipliers (relative to US average = 1.0)
const LOCATION_MULTIPLIERS: Record<string, number> = {
  "san francisco": 1.45,
  "new york": 1.35,
  seattle: 1.25,
  "los angeles": 1.2,
  boston: 1.2,
  austin: 1.05,
  denver: 1.05,
  chicago: 1.0,
  atlanta: 0.95,
  dallas: 0.95,
  phoenix: 0.9,
  remote: 1.0,
  default: 1.0,
};

// Base salary ranges by experience level (for software engineering)
const BASE_SALARY_BY_EXPERIENCE: Record<
  string,
  { min: number; median: number; max: number }
> = {
  "0-2": { min: 70000, median: 85000, max: 110000 },
  "2-5": { min: 90000, median: 120000, max: 160000 },
  "5-8": { min: 130000, median: 165000, max: 220000 },
  "8-12": { min: 170000, median: 210000, max: 280000 },
  "12+": { min: 200000, median: 260000, max: 350000 },
};

// Role multipliers (relative to software engineer)
const ROLE_MULTIPLIERS: Record<string, number> = {
  "software engineer": 1.0,
  "senior software engineer": 1.25,
  "staff engineer": 1.5,
  "principal engineer": 1.75,
  "engineering manager": 1.35,
  "product manager": 1.1,
  "data scientist": 1.15,
  "machine learning engineer": 1.2,
  "devops engineer": 1.05,
  "frontend engineer": 0.95,
  "backend engineer": 1.0,
  "full stack engineer": 1.0,
  "mobile engineer": 1.0,
  "qa engineer": 0.85,
  designer: 0.9,
  "ux designer": 0.95,
  default: 1.0,
};

function getExperienceBracket(years: number): string {
  if (years < 2) return "0-2";
  if (years < 5) return "2-5";
  if (years < 8) return "5-8";
  if (years < 12) return "8-12";
  return "12+";
}

function getLocationMultiplier(location: string): number {
  const normalized = location.toLowerCase().trim();
  return LOCATION_MULTIPLIERS[normalized] ?? LOCATION_MULTIPLIERS.default;
}

function getRoleMultiplier(role: string): number {
  const normalized = role.toLowerCase().trim();
  for (const [key, value] of Object.entries(ROLE_MULTIPLIERS)) {
    if (normalized.includes(key)) return value;
  }
  return ROLE_MULTIPLIERS.default;
}

export function calculateSalaryRange(input: SalaryInput): SalaryRange {
  const bracket = getExperienceBracket(input.yearsExperience);
  const baseSalary = BASE_SALARY_BY_EXPERIENCE[bracket];
  const locationMult = getLocationMultiplier(input.location);
  const roleMult = getRoleMultiplier(input.role);

  const multiplier = locationMult * roleMult;

  const min = Math.round(baseSalary.min * multiplier);
  const median = Math.round(baseSalary.median * multiplier);
  const max = Math.round(baseSalary.max * multiplier);

  // Approximate percentiles
  const percentile25 = Math.round(min + (median - min) * 0.5);
  const percentile75 = Math.round(median + (max - median) * 0.5);

  return { min, median, max, percentile25, percentile75 };
}

export function calculateTotalCompensation(
  offer: CompensationOffer,
): TotalCompensation {
  const annualBase = offer.baseSalary;
  const annualBonus = offer.annualBonus ?? 0;
  const vestingYears = offer.vestingYears ?? 4;
  const annualEquity = offer.equityValue ? offer.equityValue / vestingYears : 0;
  const signingBonusAnnualized = offer.signingBonus
    ? offer.signingBonus / 4
    : 0; // Spread over 4 years

  const totalAnnual =
    annualBase + annualBonus + annualEquity + signingBonusAnnualized;
  const totalFourYear =
    annualBase * 4 +
    annualBonus * 4 +
    (offer.equityValue ?? 0) +
    (offer.signingBonus ?? 0);

  return {
    annualBase,
    annualBonus,
    annualEquity,
    signingBonusAnnualized,
    totalAnnual: Math.round(totalAnnual),
    totalFourYear: Math.round(totalFourYear),
  };
}

export function compareOffers(offers: CompensationOffer[]): {
  ranked: Array<{
    offer: CompensationOffer;
    totalComp: TotalCompensation;
    rank: number;
  }>;
  bestOverall: string;
  bestBase: string;
  bestEquity: string;
} {
  const withTotals = offers.map((offer) => ({
    offer,
    totalComp: calculateTotalCompensation(offer),
  }));

  // Sort by total annual compensation
  const ranked = withTotals
    .sort((a, b) => b.totalComp.totalAnnual - a.totalComp.totalAnnual)
    .map((item, index) => ({ ...item, rank: index + 1 }));

  const bestOverall = ranked[0]?.offer.company ?? "";
  const bestBase =
    [...withTotals].sort(
      (a, b) => b.totalComp.annualBase - a.totalComp.annualBase,
    )[0]?.offer.company ?? "";
  const bestEquity =
    [...withTotals].sort(
      (a, b) => b.totalComp.annualEquity - a.totalComp.annualEquity,
    )[0]?.offer.company ?? "";

  return { ranked, bestOverall, bestBase, bestEquity };
}

export function generateCounterOffer(
  currentOffer: CompensationOffer,
  marketRange: SalaryRange,
  targetPercentile: "median" | "75th" | "max" = "75th",
): {
  suggestedBase: number;
  percentIncrease: number;
  reasoning: string;
} {
  const targetSalary =
    targetPercentile === "median"
      ? marketRange.median
      : targetPercentile === "75th"
        ? marketRange.percentile75
        : marketRange.max;

  const suggestedBase = Math.round(targetSalary);
  const percentIncrease =
    ((suggestedBase - currentOffer.baseSalary) / currentOffer.baseSalary) * 100;

  let reasoning = "";
  if (currentOffer.baseSalary < marketRange.percentile25) {
    reasoning =
      "The current offer is below the 25th percentile for your market. You have strong leverage to negotiate significantly higher.";
  } else if (currentOffer.baseSalary < marketRange.median) {
    reasoning =
      "The current offer is below median for your market. A reasonable counter would target the median or higher.";
  } else if (currentOffer.baseSalary < marketRange.percentile75) {
    reasoning =
      "The offer is competitive but below the 75th percentile. If you have strong competing offers or unique skills, aim higher.";
  } else {
    reasoning =
      "The offer is already above the 75th percentile. Focus on negotiating other benefits like equity, signing bonus, or PTO.";
  }

  return {
    suggestedBase,
    percentIncrease: Math.round(percentIncrease),
    reasoning,
  };
}

export function formatCurrency(
  amount: number,
  locale = DEFAULT_LOCALE,
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
