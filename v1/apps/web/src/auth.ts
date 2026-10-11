import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getDb } from "@/lib/db";
import { users, accounts, sessions, verificationTokens } from "@/lib/db/schema";
import { authConfig } from "@/auth.config";

export {
  DEV_AUTH_BYPASS_HEADER,
  GOOGLE_OAUTH_SCOPES,
  isDevAuthBypassAllowed,
  isEmailMagicLinkConfigured,
  isNextAuthConfigured,
} from "@/auth.config";

// Use JWT session strategy so middleware (which runs in edge runtime) can
// validate the session cookie without touching the libSQL/Drizzle adapter.
// The DrizzleAdapter still owns user/account row management on sign-in, so
// Google OAuth tokens land in the accounts table for direct API access.
const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(getDb(), {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
});

export { handlers, auth, signIn, signOut };
