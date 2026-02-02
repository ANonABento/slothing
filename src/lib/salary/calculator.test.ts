import { describe, it, expect } from "vitest";
import {
  calculateSalaryRange,
  calculateTotalCompensation,
  compareOffers,
  generateCounterOffer,
  formatCurrency,
  type CompensationOffer,
} from "./calculator";

describe("Salary Calculator", () => {
  describe("calculateSalaryRange", () => {
    it("should calculate salary range for entry-level in San Francisco", () => {
      const range = calculateSalaryRange({
        role: "Software Engineer",
        location: "San Francisco",
        yearsExperience: 1,
      });

      // Entry level (0-2 years) with SF multiplier (1.45)
      expect(range.min).toBeGreaterThan(100000);
      expect(range.median).toBeGreaterThan(range.min);
      expect(range.max).toBeGreaterThan(range.median);
      expect(range.percentile25).toBeGreaterThan(range.min);
      expect(range.percentile75).toBeLessThan(range.max);
    });

    it("should calculate higher salary for senior roles", () => {
      const senior = calculateSalaryRange({
        role: "Senior Software Engineer",
        location: "New York",
        yearsExperience: 7,
      });

      const junior = calculateSalaryRange({
        role: "Software Engineer",
        location: "New York",
        yearsExperience: 1,
      });

      expect(senior.median).toBeGreaterThan(junior.median);
    });

    it("should apply location multipliers correctly", () => {
      const sf = calculateSalaryRange({
        role: "Software Engineer",
        location: "San Francisco",
        yearsExperience: 5,
      });

      const atlanta = calculateSalaryRange({
        role: "Software Engineer",
        location: "Atlanta",
        yearsExperience: 5,
      });

      expect(sf.median).toBeGreaterThan(atlanta.median);
    });

    it("should handle unknown locations with default multiplier", () => {
      const range = calculateSalaryRange({
        role: "Software Engineer",
        location: "Unknown City",
        yearsExperience: 3,
      });

      expect(range.median).toBeGreaterThan(0);
    });

    it("should scale with years of experience", () => {
      const entry = calculateSalaryRange({
        role: "Software Engineer",
        location: "Remote",
        yearsExperience: 1,
      });

      const mid = calculateSalaryRange({
        role: "Software Engineer",
        location: "Remote",
        yearsExperience: 4,
      });

      const senior = calculateSalaryRange({
        role: "Software Engineer",
        location: "Remote",
        yearsExperience: 10,
      });

      expect(mid.median).toBeGreaterThan(entry.median);
      expect(senior.median).toBeGreaterThan(mid.median);
    });
  });

  describe("calculateTotalCompensation", () => {
    it("should calculate total compensation with all components", () => {
      const offer: CompensationOffer = {
        id: "offer-1",
        company: "Tech Corp",
        role: "Software Engineer",
        baseSalary: 150000,
        signingBonus: 20000,
        annualBonus: 15000,
        equityValue: 100000,
        vestingYears: 4,
      };

      const result = calculateTotalCompensation(offer);

      expect(result.annualBase).toBe(150000);
      expect(result.annualBonus).toBe(15000);
      expect(result.annualEquity).toBe(25000); // 100000 / 4
      expect(result.signingBonusAnnualized).toBe(5000); // 20000 / 4
      expect(result.totalAnnual).toBe(195000); // 150k + 15k + 25k + 5k
      expect(result.totalFourYear).toBe(780000); // 600k base + 60k bonus + 100k equity + 20k signing
    });

    it("should handle offer with only base salary", () => {
      const offer: CompensationOffer = {
        id: "offer-2",
        company: "Startup",
        role: "Engineer",
        baseSalary: 120000,
      };

      const result = calculateTotalCompensation(offer);

      expect(result.annualBase).toBe(120000);
      expect(result.annualBonus).toBe(0);
      expect(result.annualEquity).toBe(0);
      expect(result.signingBonusAnnualized).toBe(0);
      expect(result.totalAnnual).toBe(120000);
      expect(result.totalFourYear).toBe(480000);
    });

    it("should default to 4-year vesting if not specified", () => {
      const offer: CompensationOffer = {
        id: "offer-3",
        company: "Tech",
        role: "Engineer",
        baseSalary: 100000,
        equityValue: 80000,
      };

      const result = calculateTotalCompensation(offer);

      expect(result.annualEquity).toBe(20000); // 80000 / 4 years
    });
  });

  describe("compareOffers", () => {
    it("should rank offers by total annual compensation", () => {
      const offers: CompensationOffer[] = [
        {
          id: "offer-1",
          company: "Company A",
          role: "Engineer",
          baseSalary: 120000,
          annualBonus: 10000,
        },
        {
          id: "offer-2",
          company: "Company B",
          role: "Engineer",
          baseSalary: 150000,
          annualBonus: 20000,
        },
        {
          id: "offer-3",
          company: "Company C",
          role: "Engineer",
          baseSalary: 100000,
          equityValue: 200000,
        },
      ];

      const result = compareOffers(offers);

      expect(result.ranked).toHaveLength(3);
      expect(result.ranked[0].rank).toBe(1);
      expect(result.ranked[1].rank).toBe(2);
      expect(result.ranked[2].rank).toBe(3);
      expect(result.bestOverall).toBeTruthy();
    });

    it("should identify best for different categories", () => {
      const offers: CompensationOffer[] = [
        {
          id: "offer-1",
          company: "High Base",
          role: "Engineer",
          baseSalary: 180000,
        },
        {
          id: "offer-2",
          company: "High Equity",
          role: "Engineer",
          baseSalary: 120000,
          equityValue: 400000,
        },
      ];

      const result = compareOffers(offers);

      expect(result.bestBase).toBe("High Base");
      expect(result.bestEquity).toBe("High Equity");
    });

    it("should handle empty offers array", () => {
      const result = compareOffers([]);

      expect(result.ranked).toHaveLength(0);
      expect(result.bestOverall).toBe("");
    });
  });

  describe("generateCounterOffer", () => {
    it("should suggest counter at 75th percentile by default", () => {
      const offer: CompensationOffer = {
        id: "offer-1",
        company: "Tech",
        role: "Engineer",
        baseSalary: 120000,
      };

      const marketRange = {
        min: 100000,
        percentile25: 115000,
        median: 130000,
        percentile75: 150000,
        max: 180000,
      };

      const result = generateCounterOffer(offer, marketRange);

      expect(result.suggestedBase).toBe(150000);
      expect(result.percentIncrease).toBe(25); // (150-120)/120 * 100 = 25%
    });

    it("should provide appropriate reasoning for below-median offer", () => {
      const offer: CompensationOffer = {
        id: "offer-1",
        company: "Tech",
        role: "Engineer",
        baseSalary: 100000,
      };

      const marketRange = {
        min: 90000,
        percentile25: 110000,
        median: 130000,
        percentile75: 150000,
        max: 180000,
      };

      const result = generateCounterOffer(offer, marketRange);

      expect(result.reasoning).toContain("below the 25th percentile");
    });

    it("should suggest median when specified", () => {
      const offer: CompensationOffer = {
        id: "offer-1",
        company: "Tech",
        role: "Engineer",
        baseSalary: 100000,
      };

      const marketRange = {
        min: 90000,
        percentile25: 110000,
        median: 130000,
        percentile75: 150000,
        max: 180000,
      };

      const result = generateCounterOffer(offer, marketRange, "median");

      expect(result.suggestedBase).toBe(130000);
    });

    it("should suggest max when specified", () => {
      const offer: CompensationOffer = {
        id: "offer-1",
        company: "Tech",
        role: "Engineer",
        baseSalary: 100000,
      };

      const marketRange = {
        min: 90000,
        percentile25: 110000,
        median: 130000,
        percentile75: 150000,
        max: 180000,
      };

      const result = generateCounterOffer(offer, marketRange, "max");

      expect(result.suggestedBase).toBe(180000);
    });
  });

  describe("formatCurrency", () => {
    it("should format currency without decimals", () => {
      expect(formatCurrency(150000)).toBe("$150,000");
      expect(formatCurrency(1234567)).toBe("$1,234,567");
      expect(formatCurrency(50)).toBe("$50");
    });

    it("should handle zero", () => {
      expect(formatCurrency(0)).toBe("$0");
    });

    it("should handle negative numbers", () => {
      expect(formatCurrency(-5000)).toBe("-$5,000");
    });
  });
});
