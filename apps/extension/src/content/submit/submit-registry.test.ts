import { describe, expect, it } from "vitest";
import { pickSubmitAdapter } from "./submit-registry";

describe("pickSubmitAdapter", () => {
  it("picks greenhouse for greenhouse hosts", () => {
    expect(pickSubmitAdapter("boards.greenhouse.io")?.key).toBe("greenhouse");
    expect(pickSubmitAdapter("job-boards.greenhouse.io")?.key).toBe(
      "greenhouse",
    );
  });

  it("picks lever for lever hosts", () => {
    expect(pickSubmitAdapter("jobs.lever.co")?.key).toBe("lever");
  });

  it("returns null (needs human) for unsupported hosts", () => {
    expect(pickSubmitAdapter("myworkdayjobs.com")).toBeNull();
    expect(pickSubmitAdapter("careers.example.com")).toBeNull();
  });
});
