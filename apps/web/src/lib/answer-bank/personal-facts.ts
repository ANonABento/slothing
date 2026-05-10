export type ProfileFactField =
  | "email"
  | "phone"
  | "location"
  | "linkedin"
  | "github"
  | "website";

export interface ProfileFactMapping {
  field: ProfileFactField;
  value: string;
}

export function mapPersonalFactToProfileField(
  question: string,
  answer: string,
): ProfileFactMapping | null {
  const haystack = `${question} ${answer}`.toLowerCase();
  const value = answer.trim();
  if (!value) return null;

  if (haystack.includes("email") || value.includes("@")) {
    return { field: "email", value };
  }
  if (
    haystack.includes("phone number") ||
    haystack.includes("phone") ||
    haystack.includes("cell")
  ) {
    return { field: "phone", value };
  }
  if (
    haystack.includes("location") ||
    haystack.includes("city") ||
    haystack.includes("address")
  ) {
    return { field: "location", value };
  }
  if (haystack.includes("linkedin")) {
    return { field: "linkedin", value };
  }
  if (haystack.includes("github")) {
    return { field: "github", value };
  }
  if (haystack.includes("website") || haystack.includes("portfolio")) {
    return { field: "website", value };
  }

  return null;
}
