import type { ContactInfo, Profile } from "@/types";

function isBlank(value: unknown): boolean {
  return (
    value == null ||
    (typeof value === "string" && value.trim().length === 0) ||
    (Array.isArray(value) && value.length === 0)
  );
}

function hasMeaningfulContact(contact: ContactInfo | undefined): boolean {
  if (!contact) return false;
  return Object.values(contact).some((value) => !isBlank(value));
}

function mergeContact(
  existing: ContactInfo | undefined,
  parsed: ContactInfo | undefined,
): ContactInfo | undefined {
  if (!hasMeaningfulContact(parsed)) return undefined;
  if (!parsed) return undefined;

  const merged = { ...(existing ?? { name: "" }) };
  let changed = false;

  for (const [key, value] of Object.entries(parsed)) {
    if (isBlank(value)) continue;
    const contactKey = key as keyof ContactInfo;
    if (isBlank(merged[contactKey])) {
      (merged as Record<string, unknown>)[contactKey] = value;
      changed = true;
    }
  }

  return changed || !hasMeaningfulContact(existing) ? merged : undefined;
}

function shouldPromoteArray<T>(
  existing: T[] | undefined,
  parsed: T[] | undefined,
): parsed is T[] {
  return (!existing || existing.length === 0) && !!parsed && parsed.length > 0;
}

export function mergeParsedProfileForAutoPromote(
  existing: Profile | null,
  parsed: Partial<Profile>,
): Partial<Profile> {
  const promoted: Partial<Profile> = {};
  const contact = mergeContact(existing?.contact, parsed.contact);

  if (contact) {
    promoted.contact = contact;
  }

  if (isBlank(existing?.summary) && !isBlank(parsed.summary)) {
    promoted.summary = parsed.summary;
  }

  if (isBlank(existing?.rawText) && !isBlank(parsed.rawText)) {
    promoted.rawText = parsed.rawText;
  }

  if (shouldPromoteArray(existing?.experiences, parsed.experiences)) {
    promoted.experiences = parsed.experiences;
  }

  if (shouldPromoteArray(existing?.education, parsed.education)) {
    promoted.education = parsed.education;
  }

  if (shouldPromoteArray(existing?.skills, parsed.skills)) {
    promoted.skills = parsed.skills;
  }

  if (shouldPromoteArray(existing?.projects, parsed.projects)) {
    promoted.projects = parsed.projects;
  }

  if (shouldPromoteArray(existing?.certifications, parsed.certifications)) {
    promoted.certifications = parsed.certifications;
  }

  return promoted;
}
