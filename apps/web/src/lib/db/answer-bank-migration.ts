import type { ContactInfo, Profile } from "@/types";
import { mapPersonalFactToProfileField } from "@/lib/answer-bank/personal-facts";
import { deleteAnswerBankEntry, listAnswerBank } from "./answer-bank";
import { getProfile, updateProfile } from "./queries";

export interface PersonalFactsMigrationItem {
  id: string;
  question: string;
  field?: string;
}

export interface PersonalFactsMigrationResult {
  migratedToProfile: PersonalFactsMigrationItem[];
  reclassified: PersonalFactsMigrationItem[];
  skipped: PersonalFactsMigrationItem[];
}

export async function runPersonalFactsMigration(
  userId: string,
): Promise<PersonalFactsMigrationResult> {
  const result: PersonalFactsMigrationResult = {
    migratedToProfile: [],
    reclassified: [],
    skipped: [],
  };
  const answers = await listAnswerBank(userId);
  const profile = getProfile(userId);
  const contact: ContactInfo = {
    ...(profile?.contact ?? { name: "" }),
  };

  let changed = false;

  for (const entry of answers) {
    const mapping = mapPersonalFactToProfileField(entry.question, entry.answer);
    if (!mapping) continue;

    contact[mapping.field] = mapping.value;
    changed = true;
    await deleteAnswerBankEntry(entry.id, userId);
    result.migratedToProfile.push({
      id: entry.id,
      question: entry.question,
      field: mapping.field,
    });
  }

  if (changed) {
    updateProfile({ ...(profile ?? ({} as Profile)), contact }, userId);
  }

  return result;
}
