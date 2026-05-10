import { createEmailSend, hasDailyDigestSentSince } from "@/lib/db/email-sends";
import { listJobsPaginated } from "@/lib/db/jobs";
import { getProfile } from "@/lib/db/queries";
import {
  isTransactionalEmailConfigured,
  sendTransactionalEmail,
  type TransactionalEmailInput,
  type TransactionalEmailResult,
} from "@/lib/email/transactional";
import {
  addDays,
  nowDate,
  nowEpoch,
  startOfDay,
  toIso,
} from "@/lib/format/time";
import { signDigestUnsubscribeToken } from "./unsubscribe-token";
import {
  getEligibleDigestUsers,
  type EligibleDigestUser,
} from "./eligible-users";
import { renderDailyDigest } from "./render";
import { selectTopMatches } from "./match";

export const DAILY_DIGEST_TYPE = "daily_digest";
export const MIN_MATCH_SCORE = 30;
const CANDIDATE_LIMIT = 200;
const ALLOWED_STATUSES = ["pending", "saved"] as const;

export interface DailyDigestUserOutcome {
  userId: string;
  email?: string;
  sent: boolean;
  skipped?: boolean;
  reason?: string;
  error?: string;
  matchCount?: number;
}

export interface DailyDigestResult {
  ok: boolean;
  sent: number;
  skipped: number;
  errors: number;
  duration_ms: number;
  outcomes: DailyDigestUserOutcome[];
}

export interface RunDailyDigestOptions {
  now?: Date;
  users?: EligibleDigestUser[];
  sender?: (
    input: TransactionalEmailInput,
  ) => Promise<TransactionalEmailResult>;
}

export async function runDailyDigest(
  options: RunDailyDigestOptions = {},
): Promise<DailyDigestResult> {
  const startedAt = nowEpoch();
  const now = options.now ?? nowDate();
  const dayStart = utcDayStartIso(now);
  const since = toIso(addDays(now, -1));
  const users = options.users ?? getEligibleDigestUsers();
  const sender = options.sender ?? sendTransactionalEmail;
  const outcomes: DailyDigestUserOutcome[] = [];
  let sent = 0;
  let skipped = 0;
  let errors = 0;

  for (const user of users) {
    try {
      if (!user.email) {
        skipped += 1;
        outcomes.push(skip(user, "no_email"));
        continue;
      }

      if (!user.digestEnabled) {
        skipped += 1;
        outcomes.push(skip(user, "digest_disabled"));
        continue;
      }

      if (hasDailyDigestSentSince(user.userId, dayStart)) {
        skipped += 1;
        outcomes.push(skip(user, "already_sent"));
        continue;
      }

      const profile = getProfile(user.userId);
      if (!profile) {
        skipped += 1;
        outcomes.push(skip(user, "no_profile"));
        continue;
      }

      const candidates = listJobsPaginated({
        userId: user.userId,
        statuses: [...ALLOWED_STATUSES],
        limit: CANDIDATE_LIMIT,
      }).filter((job) => job.createdAt >= since);
      const picks = selectTopMatches(profile, candidates, 5, MIN_MATCH_SCORE);

      if (picks.length === 0) {
        skipped += 1;
        outcomes.push(skip(user, "no_matches"));
        continue;
      }

      if (!isTransactionalEmailConfigured()) {
        skipped += 1;
        outcomes.push(skip(user, "email_not_configured", picks.length));
        continue;
      }

      const unsubscribeUrl = buildUnsubscribeUrl(user.userId);
      const rendered = renderDailyDigest({
        user,
        picks,
        unsubscribeUrl,
      });
      const result = await sender({
        to: user.email,
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
        tags: [{ name: "type", value: DAILY_DIGEST_TYPE }],
      });

      createEmailSend(
        {
          type: DAILY_DIGEST_TYPE,
          recipient: user.email,
          subject: rendered.subject,
          body: rendered.text,
          status: result.ok ? "sent" : "failed",
          errorMessage: result.ok ? undefined : result.error,
        },
        user.userId,
      );

      if (result.ok) {
        sent += 1;
        outcomes.push({
          userId: user.userId,
          email: user.email,
          sent: true,
          matchCount: picks.length,
        });
      } else {
        errors += 1;
        outcomes.push({
          userId: user.userId,
          email: user.email,
          sent: false,
          error: result.error,
          matchCount: picks.length,
        });
      }
    } catch (error) {
      errors += 1;
      outcomes.push({
        userId: user.userId,
        email: user.email,
        sent: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return {
    ok: errors === 0,
    sent,
    skipped,
    errors,
    duration_ms: nowEpoch() - startedAt,
    outcomes,
  };
}

function skip(
  user: EligibleDigestUser,
  reason: string,
  matchCount?: number,
): DailyDigestUserOutcome {
  return {
    userId: user.userId,
    email: user.email,
    sent: false,
    skipped: true,
    reason,
    matchCount,
  };
}

function utcDayStartIso(date: Date): string {
  return toIso(startOfDay(date, "UTC"));
}

function buildUnsubscribeUrl(userId: string): string {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const url = new URL("/api/email/unsubscribe", baseUrl);
  url.searchParams.set("topic", "daily-digest");
  url.searchParams.set("token", signDigestUnsubscribeToken(userId));
  return url.toString();
}
