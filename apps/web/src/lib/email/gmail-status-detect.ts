import { addDays, nowDate, parseToDate, toIso } from "@/lib/format/time";
import { createNotification } from "@/lib/db/notifications";
import { createSuggestedStatusUpdate } from "@/lib/db/suggested-status-updates";
import { searchStatusChangeEmailsForUser } from "@/lib/google/gmail";
import { isGoogleConnectedForUser } from "@/lib/google/client";
import {
  changeOpportunityStatus,
  listAllOpportunities,
} from "@/lib/opportunities";
import {
  getGmailAutoStatusEnabled,
  getGmailLastScannedAt,
  listGmailAutoStatusEnabledUserIds,
  setGmailLastScannedAt,
} from "@/lib/settings/gmail-auto-status";
import {
  buildStatusAutomationNotificationMessage,
  combinedConfidence,
  shouldAutoApplyStatusUpdate,
  shouldSuggestStatusUpdate,
} from "@/lib/status-automation/confidence";
import { matchOpportunityByCompany } from "./match-opportunity";
import { detectStatusFromEmail, shouldAdvanceStatus } from "./status-patterns";

const DEFAULT_LOOKBACK_DAYS = 14;
const DEFAULT_MAX_RESULTS = 50;

export interface GmailStatusDetectionResult {
  processed: number;
  scanned: number;
  matched: number;
  updated: number;
  suggested: number;
  skipped: number;
  errors: number;
}

export interface GmailStatusDetectionOptions {
  now?: Date;
  maxResults?: number;
}

function emptyResult(): GmailStatusDetectionResult {
  return {
    processed: 0,
    scanned: 0,
    matched: 0,
    updated: 0,
    suggested: 0,
    skipped: 0,
    errors: 0,
  };
}

function defaultSince(now: Date): Date {
  return addDays(now, -DEFAULT_LOOKBACK_DAYS);
}

function parseLastScanned(value: string | null, now: Date): Date {
  if (!value) return defaultSince(now);
  return parseToDate(value) ?? defaultSince(now);
}

export async function runGmailStatusDetectionForUser(
  userId: string,
  options: GmailStatusDetectionOptions = {},
): Promise<GmailStatusDetectionResult> {
  const result = emptyResult();
  result.processed = 1;

  if (!getGmailAutoStatusEnabled(userId)) {
    result.skipped += 1;
    return result;
  }

  if (!(await isGoogleConnectedForUser(userId))) {
    result.skipped += 1;
    return result;
  }

  const now = options.now ?? nowDate();
  const since = parseLastScanned(getGmailLastScannedAt(userId), now);

  try {
    const messages = await searchStatusChangeEmailsForUser(userId, {
      since,
      maxResults: options.maxResults ?? DEFAULT_MAX_RESULTS,
    });
    result.scanned += messages.length;

    const opportunities = listAllOpportunities(userId, [
      "saved",
      "applied",
      "interviewing",
    ]);

    for (const message of messages) {
      const detection = detectStatusFromEmail(message);
      if (!detection) {
        result.skipped += 1;
        continue;
      }

      const match = matchOpportunityByCompany(opportunities, {
        subject: message.subject,
        snippet: message.snippet,
        body: message.body,
        from: message.from,
      });

      if (!match) {
        result.skipped += 1;
        continue;
      }
      result.matched += 1;

      const previousStatus = match.opportunity.status;
      if (!shouldAdvanceStatus(previousStatus, detection.status)) {
        result.skipped += 1;
        continue;
      }

      const confidence = combinedConfidence(
        detection.confidence,
        match.confidence,
      );
      const reason = `${detection.reason}; ${match.reason.replace(/_/g, " ")}`;
      const evidence = [...detection.evidence, ...match.evidence].slice(0, 2);

      if (!shouldAutoApplyStatusUpdate(confidence)) {
        if (!shouldSuggestStatusUpdate(confidence)) {
          result.skipped += 1;
          continue;
        }
        const notification = createNotification(
          {
            type: "application_update",
            title: "Review Gmail status suggestion",
            message: buildStatusAutomationNotificationMessage({
              company: match.opportunity.company,
              title: match.opportunity.title,
              nextStatus: detection.status,
              reason,
              confidence,
              evidence,
              action: "suggested",
            }),
            link: `/opportunities?id=${match.opportunity.id}`,
          },
          userId,
        );
        createSuggestedStatusUpdate({
          userId,
          notificationId: notification.id,
          opportunityId: match.opportunity.id,
          suggestedStatus: detection.status,
          sourceProvider: "gmail",
          sourceEventId: message.id,
          confidence,
          reason,
          evidence,
        });
        result.suggested += 1;
        continue;
      }

      const updated = changeOpportunityStatus(
        match.opportunity.id,
        detection.status,
        userId,
      );
      if (!updated) {
        result.skipped += 1;
        continue;
      }

      result.updated += 1;
      createNotification(
        {
          type: "application_update",
          title: "Application status updated from Gmail",
          message: buildStatusAutomationNotificationMessage({
            company: updated.company,
            title: updated.title,
            previousStatus,
            nextStatus: detection.status,
            reason,
            confidence,
            evidence,
            action: "updated",
          }),
          link: `/opportunities?id=${updated.id}&undoStatus=${previousStatus}&currentStatus=${detection.status}`,
        },
        userId,
      );
    }

    setGmailLastScannedAt(toIso(options.now ?? now), userId);
  } catch (error) {
    console.error("Gmail status detection error:", error);
    result.errors += 1;
  }

  return result;
}

export async function runGmailStatusDetectionForEnabledUsers(
  options: GmailStatusDetectionOptions = {},
): Promise<GmailStatusDetectionResult> {
  const totals = emptyResult();
  const userIds = await listGmailAutoStatusEnabledUserIds();

  for (const userId of userIds) {
    const result = await runGmailStatusDetectionForUser(userId, options);
    totals.processed += result.processed;
    totals.scanned += result.scanned;
    totals.matched += result.matched;
    totals.updated += result.updated;
    totals.suggested += result.suggested;
    totals.skipped += result.skipped;
    totals.errors += result.errors;
  }

  return totals;
}
