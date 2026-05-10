import { db } from "@/lib/db";

export interface OnboardingState {
  dismissedAt: string | null;
  firstName: string | null;
}

interface UserOnboardingRow {
  onboarding_dismissed_at: string | null;
  name: string | null;
}

let onboardingSchemaEnsured = false;

export async function ensureOnboardingSchema(): Promise<void> {
  if (onboardingSchemaEnsured) return;

  await db.exec(
    "ALTER TABLE `user` ADD COLUMN `onboarding_dismissed_at` text",
  ).catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes("duplicate column name")) {
      throw error;
    }
  });
  onboardingSchemaEnsured = true;
}

export async function getOnboardingState(
  userId: string,
): Promise<OnboardingState> {
  await ensureOnboardingSchema();
  const row = (await db
    .prepare(
      "SELECT onboarding_dismissed_at, name FROM `user` WHERE id = ? LIMIT 1",
    )
    .get(userId)) as UserOnboardingRow | undefined;

  return {
    dismissedAt: row?.onboarding_dismissed_at ?? null,
    firstName: getFirstName(row?.name),
  };
}

export async function setOnboardingDismissedAt(
  userId: string,
  dismissedAt: string | null,
): Promise<OnboardingState> {
  await ensureOnboardingSchema();
  await db
    .prepare("INSERT INTO `user` (id) VALUES (?) ON CONFLICT(id) DO NOTHING")
    .run(userId);
  await db
    .prepare("UPDATE `user` SET onboarding_dismissed_at = ? WHERE id = ?")
    .run(dismissedAt, userId);
  return getOnboardingState(userId);
}

function getFirstName(name: string | null | undefined): string | null {
  const firstName = name?.trim().split(/\s+/)[0];
  return firstName || null;
}
