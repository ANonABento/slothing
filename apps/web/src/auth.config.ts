import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

export const GOOGLE_OAUTH_SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/contacts.readonly",
];

export const DEV_AUTH_BYPASS_HEADER = {
  name: "X-Slothing-Dev-Auth",
  value: "default-user",
} as const;

export function isNextAuthConfigured(
  env: Record<string, string | undefined> = process.env,
): boolean {
  return Boolean(
    env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.NEXTAUTH_SECRET,
  );
}

export function isDevAuthBypassAllowed(
  env: Record<string, string | undefined> = process.env,
): boolean {
  return (
    env.NODE_ENV !== "production" && env.SLOTHING_ALLOW_UNAUTHED_DEV === "1"
  );
}

export function isEmailMagicLinkConfigured(
  env: Record<string, string | undefined> = process.env,
): boolean {
  return Boolean(env.RESEND_API_KEY && env.EMAIL_FROM);
}

const providers: NextAuthConfig["providers"] = [
  Google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    authorization: {
      params: {
        scope: GOOGLE_OAUTH_SCOPES.join(" "),
        access_type: "offline",
        prompt: "consent",
      },
    },
  }),
];

if (isEmailMagicLinkConfigured()) {
  providers.push(
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM,
    }),
  );
}

// Edge-safe NextAuth config (no DB adapter). Imported by middleware.ts so the
// edge runtime bundle does not pull libSQL/Drizzle. The full config in
// auth.ts spreads this and adds the DrizzleAdapter for API/server routes.
export const authConfig = {
  trustHost: true,
  providers,
  session: { strategy: "jwt" },
  pages: { signIn: "/sign-in" },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
