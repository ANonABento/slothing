/**
 * Google API Client Factory
 *
 * Uses Clerk's OAuth token management to authenticate with Google APIs.
 * Clerk handles token storage, refresh, and security.
 */

import { auth, clerkClient } from "@clerk/nextjs/server";
import { google } from "googleapis";
import { GoogleAPIError, type GoogleConnectionStatus } from "./types";

export interface GoogleTokenResult {
  token: string;
  scopes?: string[];
  expiresAt?: number;
}

/**
 * Get the current user's Google OAuth access token via Clerk
 *
 * @returns Token result or null if not connected
 */
export async function getGoogleAccessToken(): Promise<GoogleTokenResult | null> {
  const { userId } = await auth();
  if (!userId) return null;

  try {
    const client = await clerkClient();
    const tokens = await client.users.getUserOauthAccessToken(
      userId,
      "oauth_google"
    );

    if (!tokens.data || tokens.data.length === 0) {
      return null;
    }

    const tokenData = tokens.data[0];
    return {
      token: tokenData.token,
      scopes: tokenData.scopes,
      expiresAt: tokenData.expiresAt,
    };
  } catch (error) {
    console.error("Failed to get Google token:", error);
    return null;
  }
}

/**
 * Check if user has connected their Google account
 */
export async function isGoogleConnected(): Promise<boolean> {
  const token = await getGoogleAccessToken();
  return token !== null;
}

/**
 * Get Google connection status with user info
 */
export async function getGoogleConnectionStatus(): Promise<GoogleConnectionStatus> {
  const { userId } = await auth();
  if (!userId) {
    return { connected: false };
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    // Find Google external account
    const googleAccount = user.externalAccounts?.find(
      (account) => account.provider === "oauth_google"
    );

    if (!googleAccount) {
      return { connected: false };
    }

    // Verify we can get a token
    const tokenResult = await getGoogleAccessToken();
    if (!tokenResult) {
      return { connected: false };
    }

    return {
      connected: true,
      email: googleAccount.emailAddress || undefined,
      name:
        `${googleAccount.firstName || ""} ${googleAccount.lastName || ""}`.trim() ||
        undefined,
      picture: googleAccount.imageUrl || undefined,
    };
  } catch (error) {
    console.error("Failed to get Google connection status:", error);
    return { connected: false };
  }
}

/**
 * Create an authenticated Google OAuth2 client
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

/**
 * Create Google Calendar client
 *
 * @throws GoogleAPIError if not connected
 */
export async function createCalendarClient() {
  const authClient = await createGoogleClient();
  return google.calendar({ version: "v3", auth: authClient });
}

/**
 * Create Google Drive client
 *
 * @throws GoogleAPIError if not connected
 */
export async function createDriveClient() {
  const authClient = await createGoogleClient();
  return google.drive({ version: "v3", auth: authClient });
}

/**
 * Create Gmail client
 *
 * @throws GoogleAPIError if not connected
 */
export async function createGmailClient() {
  const authClient = await createGoogleClient();
  return google.gmail({ version: "v1", auth: authClient });
}

/**
 * Create Google Docs client
 *
 * @throws GoogleAPIError if not connected
 */
export async function createDocsClient() {
  const authClient = await createGoogleClient();
  return google.docs({ version: "v1", auth: authClient });
}

/**
 * Create Google Sheets client
 *
 * @throws GoogleAPIError if not connected
 */
export async function createSheetsClient() {
  const authClient = await createGoogleClient();
  return google.sheets({ version: "v4", auth: authClient });
}

/**
 * Create Google Tasks client
 *
 * @throws GoogleAPIError if not connected
 */
export async function createTasksClient() {
  const authClient = await createGoogleClient();
  return google.tasks({ version: "v1", auth: authClient });
}

/**
 * Create Google People (Contacts) client
 *
 * @throws GoogleAPIError if not connected
 */
export async function createPeopleClient() {
  const authClient = await createGoogleClient();
  return google.people({ version: "v1", auth: authClient });
}
