/**
 * Google API Types and Constants
 */

/**
 * Google OAuth Scopes
 */
export const GOOGLE_SCOPES = {
  // Core (always requested)
  OPENID: "openid",
  EMAIL: "email",
  PROFILE: "profile",

  // Calendar (Phase 2)
  CALENDAR: "https://www.googleapis.com/auth/calendar",
  CALENDAR_EVENTS: "https://www.googleapis.com/auth/calendar.events",
  CALENDAR_READONLY: "https://www.googleapis.com/auth/calendar.readonly",

  // Drive (Phase 3)
  DRIVE_FILE: "https://www.googleapis.com/auth/drive.file",
  DRIVE_READONLY: "https://www.googleapis.com/auth/drive.readonly",

  // Gmail (Phase 4)
  GMAIL_READONLY: "https://www.googleapis.com/auth/gmail.readonly",
  GMAIL_SEND: "https://www.googleapis.com/auth/gmail.send",
  GMAIL_LABELS: "https://www.googleapis.com/auth/gmail.labels",

  // Contacts (Phase 6)
  CONTACTS_READONLY: "https://www.googleapis.com/auth/contacts.readonly",
} as const;

export type GoogleScope = (typeof GOOGLE_SCOPES)[keyof typeof GOOGLE_SCOPES];

/**
 * Scope sets for different features
 */
export const SCOPE_SETS = {
  CORE: [GOOGLE_SCOPES.OPENID, GOOGLE_SCOPES.EMAIL, GOOGLE_SCOPES.PROFILE],
  CALENDAR: [GOOGLE_SCOPES.CALENDAR, GOOGLE_SCOPES.CALENDAR_EVENTS],
  DRIVE: [GOOGLE_SCOPES.DRIVE_FILE, GOOGLE_SCOPES.DRIVE_READONLY],
  GMAIL: [
    GOOGLE_SCOPES.GMAIL_READONLY,
    GOOGLE_SCOPES.GMAIL_SEND,
    GOOGLE_SCOPES.GMAIL_LABELS,
  ],
  CONTACTS: [GOOGLE_SCOPES.CONTACTS_READONLY],
} as const;

/**
 * All scopes needed for full integration
 */
export const ALL_GOOGLE_SCOPES = [
  ...SCOPE_SETS.CORE,
  ...SCOPE_SETS.CALENDAR,
  ...SCOPE_SETS.DRIVE,
] as const;

export interface GoogleFeatureDescriptor {
  id: "calendar" | "drive" | "gmail" | "docs" | "sheets" | "contacts";
  label: string;
  iconName: "Calendar" | "FolderOpen" | "Mail" | "FileText" | "Table" | "Users";
  iconClassName: string;
}

export const GOOGLE_FEATURES: readonly GoogleFeatureDescriptor[] = [
  {
    id: "calendar",
    label: "Calendar Sync",
    iconName: "Calendar",
    iconClassName: "text-info",
  },
  {
    id: "drive",
    label: "Drive Backup",
    iconName: "FolderOpen",
    iconClassName: "text-warning",
  },
  {
    id: "gmail",
    label: "Gmail Import",
    iconName: "Mail",
    iconClassName: "text-destructive",
  },
  {
    id: "docs",
    label: "Google Docs",
    iconName: "FileText",
    iconClassName: "text-info",
  },
  {
    id: "sheets",
    label: "Sheets Export",
    iconName: "Table",
    iconClassName: "text-success",
  },
  {
    id: "contacts",
    label: "Contacts",
    iconName: "Users",
    iconClassName: "text-primary",
  },
] as const;

/**
 * Google connection status
 */
export interface GoogleConnectionStatus {
  connected: boolean;
  email?: string;
  name?: string;
  picture?: string;
}

/**
 * Google API error
 */
export class GoogleAPIError extends Error {
  constructor(
    message: string,
    public code: number,
    public reason?: string,
  ) {
    super(message);
    this.name = "GoogleAPIError";
  }
}

/**
 * Common Google API error messages
 */
export const GOOGLE_ERROR_MESSAGES: Record<number, string> = {
  401: "Authentication expired. Please reconnect your Google account.",
  403: "Permission denied. Additional access may be required.",
  404: "Resource not found.",
  429: "Rate limit exceeded. Please try again later.",
  500: "Google API error. Please try again later.",
};

/**
 * Get user-friendly error message
 */
export function getGoogleErrorMessage(code: number): string {
  return GOOGLE_ERROR_MESSAGES[code] || "An unexpected error occurred.";
}
