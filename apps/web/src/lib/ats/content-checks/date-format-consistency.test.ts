import { describe, expect, it } from "vitest";
import {
  analyzeDateFormatConsistency,
  classifyDateString,
} from "./date-format-consistency";

describe("classifyDateString", () => {
  it("classifies common formats", () => {
    expect(classifyDateString("Jan 2021")).toBe("monthName");
    expect(classifyDateString("January 2021")).toBe("monthName");
    expect(classifyDateString("01/2021")).toBe("numericSlash");
    expect(classifyDateString("1/2021")).toBe("numericSlash");
    expect(classifyDateString("01-2021")).toBe("numericDash");
    expect(classifyDateString("2021-01")).toBe("numericDash");
    expect(classifyDateString("2021")).toBe("yearOnly");
    expect(classifyDateString("Present")).toBe("unknown");
    expect(classifyDateString("")).toBe("unknown");
  });
});

describe("analyzeDateFormatConsistency", () => {
  it("flags mixed monthName and numericSlash", () => {
    const report = analyzeDateFormatConsistency([
      { raw: "Jan 2021", location: "exp-1 start" },
      { raw: "Present", location: "exp-1 end" },
      { raw: "01/2018", location: "exp-2 start" },
      { raw: "12/2020", location: "exp-2 end" },
    ]);

    expect(report.inconsistent).toBe(true);
    expect(report.distinctFormats).toEqual(
      expect.arrayContaining(["monthName", "numericSlash"]),
    );
  });

  it("does not flag consistent monthName", () => {
    const report = analyzeDateFormatConsistency([
      { raw: "Jan 2021", location: "exp-1 start" },
      { raw: "Mar 2023", location: "exp-1 end" },
      { raw: "Jun 2018", location: "exp-2 start" },
      { raw: "Dec 2020", location: "exp-2 end" },
    ]);

    expect(report.inconsistent).toBe(false);
  });

  it("does not count yearOnly toward inconsistency", () => {
    const report = analyzeDateFormatConsistency([
      { raw: "2018", location: "edu-1 start" },
      { raw: "2022", location: "edu-1 end" },
      { raw: "Jan 2021", location: "exp-1 start" },
    ]);

    expect(report.inconsistent).toBe(false);
  });
});
