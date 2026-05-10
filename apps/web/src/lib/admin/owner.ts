import type { Session } from "next-auth";
import { notFound } from "next/navigation";
import { auth, isNextAuthConfigured } from "@/auth";

type Env = Record<string, string | undefined>;

export function parseOwnerEmails(env: Env = process.env): string[] {
  return (env.OWNER_EMAIL ?? env.OWNER_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isOwner(
  session: Pick<Session, "user"> | null,
  env: Env = process.env,
): boolean {
  if (!isNextAuthConfigured(env)) return true;

  const ownerEmails = parseOwnerEmails(env);
  if (ownerEmails.length === 0) return false;

  const email = session?.user?.email?.trim().toLowerCase();
  return Boolean(email && ownerEmails.includes(email));
}

export async function requireOwner(): Promise<void> {
  const session = await auth();
  if (!isOwner(session)) notFound();
}
