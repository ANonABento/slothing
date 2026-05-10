import { parseToDate } from "@/lib/format/time";
/**
 * Gmail Operations
 *
 * Auto-import jobs from recruiter emails and send follow-ups
 */

import { gmail_v1 } from "googleapis";
import { createGmailClient, createGmailClientForUser } from "./client";

export interface GmailMessage {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  to: string;
  date: Date;
  snippet: string;
  body?: string;
  labels: string[];
}

export interface ParsedJobEmail {
  type:
    | "recruiter_outreach"
    | "interview_invite"
    | "application_received"
    | "rejection"
    | "offer"
    | "unknown";
  company?: string;
  role?: string;
  recruiterName?: string;
  recruiterEmail?: string;
  interviewDate?: Date;
  location?: string;
  confidence: number; // 0-1 confidence score
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Extract body from message payload
 */
function extractBody(payload?: gmail_v1.Schema$MessagePart): string {
  if (!payload) return "";

  if (payload.body?.data) {
    return Buffer.from(payload.body.data, "base64").toString("utf-8");
  }

  if (payload.parts) {
    // First try to get plain text
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        return Buffer.from(part.body.data, "base64").toString("utf-8");
      }
    }
    // Fall back to HTML stripped of tags
    for (const part of payload.parts) {
      if (part.mimeType === "text/html" && part.body?.data) {
        const html = Buffer.from(part.body.data, "base64").toString("utf-8");
        return html
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
      }
    }
    // Recursively check nested parts
    for (const part of payload.parts) {
      if (part.parts) {
        const nested = extractBody(part);
        if (nested) return nested;
      }
    }
  }

  return "";
}

/**
 * Get header value from message headers
 */
function getHeader(
  headers: gmail_v1.Schema$MessagePartHeader[] | undefined,
  name: string,
): string {
  if (!headers) return "";
  return (
    headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value ||
    ""
  );
}

/**
 * Get full message details
 */
export async function getMessage(
  messageId: string,
  options: { userId?: string } = {},
): Promise<GmailMessage | null> {
  try {
    const gmail = options.userId
      ? await createGmailClientForUser(options.userId)
      : await createGmailClient();

    const response = await gmail.users.messages.get({
      userId: "me",
      id: messageId,
      format: "full",
    });

    const headers = response.data.payload?.headers;
    const body = extractBody(response.data.payload);

    return {
      id: response.data.id!,
      threadId: response.data.threadId!,
      subject: getHeader(headers, "Subject"),
      from: getHeader(headers, "From"),
      to: getHeader(headers, "To"),
      date: new Date(getHeader(headers, "Date")),
      snippet: response.data.snippet || "",
      body,
      labels: response.data.labelIds || [],
    };
  } catch (error) {
    console.error("Failed to get message:", error);
    return null;
  }
}

/**
 * List messages matching a query
 */
export async function listMessages(
  query: string,
  maxResults = 20,
  options: { userId?: string } = {},
): Promise<GmailMessage[]> {
  const gmail = options.userId
    ? await createGmailClientForUser(options.userId)
    : await createGmailClient();

  const response = await gmail.users.messages.list({
    userId: "me",
    q: query,
    maxResults,
  });

  if (!response.data.messages) {
    return [];
  }

  const messages: GmailMessage[] = [];
  for (const msg of response.data.messages) {
    const full = await getMessage(msg.id!, options);
    if (full) messages.push(full);
  }

  return messages;
}

/**
 * Search for job-related emails
 */
export async function searchJobEmails(
  options: {
    since?: Date;
    maxResults?: number;
  } = {},
): Promise<GmailMessage[]> {
  const queries = [
    // Recruiter outreach
    "from:linkedin.com subject:(job OR opportunity OR position)",
    "from:indeed.com subject:(job OR apply)",
    "subject:(recruiter OR recruiting)",
    // Interview invitations
    "subject:(interview schedule OR interview invitation)",
    // Application responses
    "subject:(application received OR application submitted)",
    "subject:(thank you for applying)",
  ];

  let combinedQuery = `(${queries.join(" OR ")})`;

  if (options.since) {
    const dateStr = options.since
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "/");
    combinedQuery += ` after:${dateStr}`;
  }

  return listMessages(combinedQuery, options.maxResults || 50);
}

export async function searchStatusChangeEmailsForUser(
  userId: string,
  options: {
    since?: Date;
    maxResults?: number;
  } = {},
): Promise<GmailMessage[]> {
  const queries = [
    '"thank you for applying"',
    '"schedule a call"',
    "interview",
    '"next round"',
    "unfortunately",
    '"decided to move forward"',
    '"extend an offer"',
    '"offer letter"',
  ];

  let combinedQuery = `in:inbox (${queries.join(" OR ")})`;
  if (options.since) {
    const dateStr = options.since
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "/");
    combinedQuery += ` after:${dateStr}`;
  }

  return listMessages(combinedQuery, options.maxResults || 50, { userId });
}

/**
 * Parse email to extract job information
 */
export function parseJobEmail(message: GmailMessage): ParsedJobEmail {
  const subject = message.subject.toLowerCase();
  const body = (message.body || message.snippet).toLowerCase();
  const from = message.from.toLowerCase();

  let type: ParsedJobEmail["type"] = "unknown";
  let confidence = 0.5;

  // Detect email type based on content patterns
  if (
    subject.includes("interview") &&
    (subject.includes("schedule") || subject.includes("invitation"))
  ) {
    type = "interview_invite";
    confidence = 0.9;
  } else if (
    subject.includes("unfortunately") ||
    subject.includes("other candidates") ||
    subject.includes("not moving forward") ||
    subject.includes("will not be moving forward")
  ) {
    type = "rejection";
    confidence = 0.85;
  } else if (
    subject.includes("offer") ||
    (subject.includes("congratulations") && body.includes("offer"))
  ) {
    type = "offer";
    confidence = 0.8;
  } else if (
    subject.includes("application received") ||
    subject.includes("thank you for applying") ||
    subject.includes("application submitted")
  ) {
    type = "application_received";
    confidence = 0.8;
  } else if (
    from.includes("linkedin") ||
    from.includes("indeed") ||
    from.includes("recruiter") ||
    from.includes("talent") ||
    from.includes("hiring")
  ) {
    type = "recruiter_outreach";
    confidence = 0.7;
  }

  // Extract company name (basic heuristic)
  const companyPatterns = [
    /at\s+([A-Z][A-Za-z0-9\s&]+?)(?:\s+is|\s+has|\s+would|\.|,)/,
    /from\s+([A-Z][A-Za-z0-9\s&]+?)(?:\s+and|\s+regarding|\.|,)/,
    /([A-Z][A-Za-z0-9\s&]+?)\s+(?:is looking|is hiring|has an opening)/,
    /position\s+(?:at|with)\s+([A-Z][A-Za-z0-9\s&]+?)(?:\.|,|\s)/,
  ];

  let company: string | undefined;
  const fullText = message.body || message.snippet;
  for (const pattern of companyPatterns) {
    const match = fullText.match(pattern);
    if (match) {
      company = match[1].trim();
      break;
    }
  }

  // Extract role (basic heuristic)
  const rolePatterns = [
    /(?:position|role|job)(?:\s+of|\s+as|:)?\s*([A-Za-z\s]+(?:Engineer|Developer|Manager|Designer|Analyst|Scientist))/i,
    /(Senior|Junior|Lead|Staff|Principal)?\s*(Software|Frontend|Backend|Full Stack|Full-Stack|Data|Product|UX|UI)?\s*(Engineer|Developer|Manager|Designer|Analyst|Scientist)/i,
  ];

  let role: string | undefined;
  for (const pattern of rolePatterns) {
    const match = fullText.match(pattern) || message.subject.match(pattern);
    if (match) {
      role = match[0].trim();
      break;
    }
  }

  // Extract recruiter info from "From" header
  const fromMatch = message.from.match(/^(.+?)\s*<(.+?)>$/);
  const recruiterName = fromMatch?.[1]?.replace(/"/g, "").trim();
  const recruiterEmail = fromMatch?.[2] || message.from;

  // Try to extract interview date
  let interviewDate: Date | undefined;
  const datePatterns = [
    /(\w+day),?\s+(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(?:at\s+)?(\d{1,2}):?(\d{2})?\s*(am|pm)?/i,
    /(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(?:at\s+)?(\d{1,2}):?(\d{2})?\s*(am|pm)?/i,
    /(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})?\s+(?:at\s+)?(\d{1,2}):?(\d{2})?\s*(am|pm)?/i,
  ];

  for (const pattern of datePatterns) {
    const match = fullText.match(pattern);
    if (match) {
      try {
        const parsed = parseToDate(match[0])!;
        if (!isNaN(parsed.getTime())) {
          interviewDate = parsed;
          break;
        }
      } catch {
        // Invalid date, continue to next pattern
      }
    }
  }

  return {
    type,
    company,
    role,
    recruiterName,
    recruiterEmail,
    interviewDate,
    confidence,
  };
}

/**
 * Send an email
 */
export async function sendEmail(
  to: string,
  subject: string,
  body: string,
  options: {
    replyTo?: string;
    threadId?: string;
    cc?: string;
    bcc?: string;
  } = {},
): Promise<SendEmailResult> {
  try {
    const gmail = await createGmailClient();

    const messageParts = [
      `To: ${to}`,
      `Subject: ${subject}`,
      options.cc ? `Cc: ${options.cc}` : "",
      options.bcc ? `Bcc: ${options.bcc}` : "",
      options.replyTo ? `In-Reply-To: ${options.replyTo}` : "",
      options.replyTo ? `References: ${options.replyTo}` : "",
      "Content-Type: text/plain; charset=utf-8",
      "",
      body,
    ]
      .filter(Boolean)
      .join("\r\n");

    const encodedMessage = Buffer.from(messageParts)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
        threadId: options.threadId,
      },
    });

    return {
      success: true,
      messageId: response.data.id || undefined,
    };
  } catch (error) {
    console.error("Failed to send email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Create or get "Job Search" label
 */
export async function getOrCreateJobSearchLabel(): Promise<string | null> {
  try {
    const gmail = await createGmailClient();

    // Check if label exists
    const labels = await gmail.users.labels.list({ userId: "me" });
    const existing = labels.data.labels?.find((l) => l.name === "Job Search");
    if (existing?.id) return existing.id;

    // Create label
    const created = await gmail.users.labels.create({
      userId: "me",
      requestBody: {
        name: "Job Search",
        labelListVisibility: "labelShow",
        messageListVisibility: "show",
      },
    });

    return created.data.id || null;
  } catch (error) {
    console.error("Failed to create label:", error);
    return null;
  }
}

/**
 * Add label to message
 */
export async function addLabelToMessage(
  messageId: string,
  labelId: string,
): Promise<boolean> {
  try {
    const gmail = await createGmailClient();
    await gmail.users.messages.modify({
      userId: "me",
      id: messageId,
      requestBody: {
        addLabelIds: [labelId],
      },
    });
    return true;
  } catch (error) {
    console.error("Failed to add label:", error);
    return false;
  }
}

/**
 * Remove label from message
 */
export async function removeLabelFromMessage(
  messageId: string,
  labelId: string,
): Promise<boolean> {
  try {
    const gmail = await createGmailClient();
    await gmail.users.messages.modify({
      userId: "me",
      id: messageId,
      requestBody: {
        removeLabelIds: [labelId],
      },
    });
    return true;
  } catch (error) {
    console.error("Failed to remove label:", error);
    return false;
  }
}

/**
 * Get thread messages
 */
export async function getThread(threadId: string): Promise<GmailMessage[]> {
  try {
    const gmail = await createGmailClient();

    const response = await gmail.users.threads.get({
      userId: "me",
      id: threadId,
      format: "full",
    });

    if (!response.data.messages) {
      return [];
    }

    return response.data.messages.map((msg) => {
      const headers = msg.payload?.headers;
      return {
        id: msg.id!,
        threadId: msg.threadId!,
        subject: getHeader(headers, "Subject"),
        from: getHeader(headers, "From"),
        to: getHeader(headers, "To"),
        date: new Date(getHeader(headers, "Date")),
        snippet: msg.snippet || "",
        body: extractBody(msg.payload),
        labels: msg.labelIds || [],
      };
    });
  } catch (error) {
    console.error("Failed to get thread:", error);
    return [];
  }
}

/**
 * Mark message as read
 */
export async function markAsRead(messageId: string): Promise<boolean> {
  try {
    const gmail = await createGmailClient();
    await gmail.users.messages.modify({
      userId: "me",
      id: messageId,
      requestBody: {
        removeLabelIds: ["UNREAD"],
      },
    });
    return true;
  } catch (error) {
    console.error("Failed to mark as read:", error);
    return false;
  }
}
