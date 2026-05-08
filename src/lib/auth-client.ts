/**
 * Client-safe NextAuth helpers. These can be imported into "use client"
 * components without pulling in server-only dependencies (`@/auth`,
 * Drizzle, etc.).
 */

export function isNextAuthConfiguredOnClient(): boolean {
  return process.env.NEXT_PUBLIC_NEXTAUTH_ENABLED === "true";
}
