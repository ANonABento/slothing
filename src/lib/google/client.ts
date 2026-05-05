/**
 * Google API Client Factory
 *
 * Pulls Google OAuth tokens from the NextAuth `accounts` table (populated by
 * the Drizzle adapter on Google sign-in). Refreshes the access token against
 * Google's token endpoint when expired and persists the new token back to the
 * accounts row.
 */

import { google } from "googleapis";
import { and, eq } from "drizzle-orm";
import { getCurrentUserId } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { accounts, users } from "@/lib/db/schema";
import { GoogleAPIError, type GoogleConnectionStatus } from "./types";

const GOOGLE_PROVIDER = "google";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const ACCESS_TOKEN_REFRESH_LEEWAY_SECONDS = 60;

export interface GoogleTokenResult {
  token: string;
  scopes?: string[];
  expiresAt?: number;
}

interface GoogleAccountRow {
  userId: string;
  access_token: string | null;
  refresh_token: string | null;
  expires_at: number | null;
  scope: string | null;
}

async function loadGoogleAccount(
  userId: string,
): Promise<GoogleAccountRow | null> {
  const row = await getDb()
    .select({
      userId: accounts.userId,
      access_token: accounts.access_token,
      refresh_token: accounts.refresh_token,
      expires_at: accounts.expires_at,
      scope: accounts.scope,
    })
    .from(accounts)
    .where(
      and(eq(accounts.userId, userId), eq(accounts.provider, GOOGLE_PROVIDER)),
    )
    .get();

  return row ?? null;
}

function nowInSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

function isAccessTokenExpired(expiresAt: number | null | undefined): boolean {
  if (!expiresAt) return false;
  return expiresAt - ACCESS_TOKEN_REFRESH_LEEWAY_SECONDS <= nowInSeconds();
}

async function refreshGoogleAccessToken(
  account: GoogleAccountRow,
): Promise<GoogleAccountRow | null> {
  if (!account.refresh_token) return null;

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
    refresh_token: account.refresh_token,
  });

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) return null;

  const payload = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
    scope?: string;
    refresh_token?: string;
  };

  if (!payload.access_token) return null;

  const updated: Partial<GoogleAccountRow> = {
    access_token: payload.access_token,
    expires_at: payload.expires_in
      ? nowInSeconds() + payload.expires_in
      : account.expires_at,
    scope: payload.scope ?? account.scope,
    refresh_token: payload.refresh_token ?? account.refresh_token,
  };

  await getDb()
    .update(accounts)
    .set(updated)
    .where(
      and(
        eq(accounts.userId, account.userId),
        eq(accounts.provider, GOOGLE_PROVIDER),
      ),
    )
    .run();

  return { ...account, ...updated } as GoogleAccountRow;
}

/**
 * Get the current user's Google OAuth access token.
 * Returns null if the user has no linked Google account or the token cannot
 * be refreshed.
 */
export async function getGoogleAccessToken(): Promise<GoogleTokenResult | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  let account = await loadGoogleAccount(userId);
  if (!account?.access_token) return null;

  if (isAccessTokenExpired(account.expires_at)) {
    const refreshed = await refreshGoogleAccessToken(account);
    if (!refreshed?.access_token) return null;
    account = refreshed;
  }

  return {
    token: account.access_token!,
    scopes: account.scope?.split(" ").filter(Boolean) ?? undefined,
    expiresAt: account.expires_at ?? undefined,
  };
}

/**
 * Check if the current user has a connected Google account with a usable token.
 */
export async function isGoogleConnected(): Promise<boolean> {
  const token = await getGoogleAccessToken();
  return token !== null;
}

/**
 * Get Google connection status with user info.
 */
export async function getGoogleConnectionStatus(): Promise<GoogleConnectionStatus> {
  const userId = await getCurrentUserId();
  if (!userId) return { connected: false };

  const tokenResult = await getGoogleAccessToken();
  if (!tokenResult) return { connected: false };

  const userRow = await getDb()
    .select({
      email: users.email,
      name: users.name,
      image: users.image,
    })
    .from(users)
    .where(eq(users.id, userId))
    .get();

  return {
    connected: true,
    email: userRow?.email ?? undefined,
    name: userRow?.name ?? undefined,
    picture: userRow?.image ?? undefined,
  };
}

/**
 * Create an authenticated Google OAuth2 client.
 *
 * @throws GoogleAPIError if not connected
 */
export async function createGoogleClient() {
  const tokenResult = await getGoogleAccessToken();
  if (!tokenResult) {
    throw new GoogleAPIError("Google account not connected", 401);
  }

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: tokenResult.token });

  return oauth2Client;
}

export async function createCalendarClient() {
  const authClient = await createGoogleClient();
  return google.calendar({ version: "v3", auth: authClient });
}

export async function createDriveClient() {
  const authClient = await createGoogleClient();
  return google.drive({ version: "v3", auth: authClient });
}

export async function createGmailClient() {
  const authClient = await createGoogleClient();
  return google.gmail({ version: "v1", auth: authClient });
}

export async function createDocsClient() {
  const authClient = await createGoogleClient();
  return google.docs({ version: "v1", auth: authClient });
}

export async function createSheetsClient() {
  const authClient = await createGoogleClient();
  return google.sheets({ version: "v4", auth: authClient });
}

export async function createTasksClient() {
  const authClient = await createGoogleClient();
  return google.tasks({ version: "v1", auth: authClient });
}

export async function createPeopleClient() {
  const authClient = await createGoogleClient();
  return google.people({ version: "v1", auth: authClient });
}

// Exported for tests.
export const __test = {
  isAccessTokenExpired,
  refreshGoogleAccessToken,
  ACCESS_TOKEN_REFRESH_LEEWAY_SECONDS,
};
