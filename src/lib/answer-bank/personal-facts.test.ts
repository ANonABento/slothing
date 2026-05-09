import { describe, expect, it } from "vitest";
import { mapPersonalFactToProfileField } from "./personal-facts";

describe("mapPersonalFactToProfileField", () => {
  it.each([
    ["What is your email?", "person@example.com", "email"],
    ["Phone number", "555-0100", "phone"],
    ["Current city", "Montevideo", "location"],
    ["LinkedIn", "https://linkedin.com/in/example", "linkedin"],
    ["GitHub profile", "https://github.com/example", "github"],
    ["Portfolio website", "https://example.com", "website"],
  ])("maps %s to %s", (question, answer, field) => {
    expect(mapPersonalFactToProfileField(question, answer)).toEqual({
      field,
      value: answer,
    });
  });

  it("ignores freeform answers that are not profile fields", () => {
    expect(
      mapPersonalFactToProfileField(
        "Why are you interested in this company?",
        "I like the product.",
      ),
    ).toBeNull();
  });
});
