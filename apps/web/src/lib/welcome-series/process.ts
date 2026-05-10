import db from "@/lib/db/legacy";
import { sendTransactionalEmail } from "@/lib/email/transactional";
import { nowDate, parseToDate, toIso } from "@/lib/format/time";
import { getUserTier } from "@/lib/plan/tier";
import {
  welcomeDay1,
  welcomeDay3,
  welcomeDay7,
  welcomeDay14,
  type WelcomeEmail,
} from "@/lib/welcome-series/templates";
import { createUnsubscribeToken } from "@/lib/welcome-series/unsubscribe-token";
import {
  getUsageStats,
  hasUserApplied,
  hasUserBookedInterview,
} from "@/lib/welcome-series/predicates";
import {
  ensureWelcomeSeriesSchema,
  parseWelcomeSeriesState,
  setWelcomeSeriesState,
  type WelcomeSeriesState,
} from "@/lib/welcome-series/state";
import { WELCOME_SKIP_REASONS, type WelcomeSkipReason } from "./constants";

type WelcomeStepName = "day1" | "day3" | "day7" | "day14" | "all";
export type WelcomeStepAction =
  | "sent"
  | "skipped"
  | "not-eligible"
  | "already-complete"
  | "error";

export interface WelcomeStepResult {
  step: WelcomeStepName;
  action: WelcomeStepAction;
  reason?: string;
  status?: number;
  error?: string;
}

interface ProcessOptions {
  now?: Date;
}

interface UserRow {
  id: string;
  email: string | null;
  name: string | null;
  created_at: string | null;
  welcome_series_state: string | null;
}

interface StepConfig {
  step: Exclude<WelcomeStepName, "all">;
  day: 1 | 3 | 7 | 14;
  sentKey: keyof WelcomeSeriesState;
  skippedKey?: keyof WelcomeSeriesState;
  skipReasonKey?: keyof WelcomeSeriesState;
  getSkipReason?: (userId: string) => WelcomeSkipReason | null;
  render: (user: UserRow, urls: WelcomeUrls) => WelcomeEmail;
}

interface WelcomeUrls {
  profileUrl: string;
  opportunitiesUrl: string;
  interviewUrl: string;
  upgradeUrl: string;
  unsubscribeUrl: string;
}

export async function processWelcomeSeriesForUser(
  userId: string,
  { now = nowDate() }: ProcessOptions = {},
): Promise<{ results: WelcomeStepResult[] }> {
  ensureWelcomeSeriesSchema();

  const user = db
    .prepare(
      "SELECT id, email, name, created_at, welcome_series_state FROM `user` WHERE id = ? LIMIT 1",
    )
    .get(userId) as UserRow | undefined;

  if (!user) {
    return { results: [{ step: "all", action: "skipped", reason: "missing" }] };
  }

  if (!user.created_at) {
    user.created_at = toIso(now);
    db.prepare("UPDATE `user` SET created_at = ? WHERE id = ?").run(
      user.created_at,
      userId,
    );
  }

  const state = parseWelcomeSeriesState(user.welcome_series_state);
  if (state.unsubscribedAt) {
    return {
      results: [
        { step: "all", action: "skipped", reason: "unsubscribed" },
      ],
    };
  }

  if (!user.email) {
    return {
      results: [{ step: "all", action: "skipped", reason: "no-email" }],
    };
  }

  const accountAgeDays = Math.floor(
    (now.getTime() -
      (parseToDate(user.created_at)?.getTime() ?? now.getTime())) /
      86_400_000,
  );
  const urls = buildWelcomeUrls(user.id);
  const results: WelcomeStepResult[] = [];

  for (const step of buildStepConfigs()) {
    results.push(await processStep(user, step, state, urls, accountAgeDays, now));
  }

  return { results };
}

async function processStep(
  user: UserRow,
  step: StepConfig,
  state: WelcomeSeriesState,
  urls: WelcomeUrls,
  accountAgeDays: number,
  now: Date,
): Promise<WelcomeStepResult> {
  if (state[step.sentKey] || (step.skippedKey && state[step.skippedKey])) {
    return { step: step.step, action: "already-complete" };
  }

  if (accountAgeDays < step.day) {
    return { step: step.step, action: "not-eligible" };
  }

  const skipReason = step.getSkipReason?.(user.id);
  if (skipReason && step.skippedKey && step.skipReasonKey) {
    const patch = {
      [step.skippedKey]: toIso(now),
      [step.skipReasonKey]: skipReason,
    } as WelcomeSeriesState;
    Object.assign(state, setWelcomeSeriesState(user.id, patch));
    return { step: step.step, action: "skipped", reason: skipReason };
  }

  const email = step.render(user, urls);
  const result = await sendTransactionalEmail({
    to: user.email!,
    subject: email.subject,
    html: email.html,
    text: email.text,
    tags: [
      { name: "kind", value: "welcome-series" },
      { name: "step", value: step.step },
    ],
  });

  if (!result.ok) {
    return {
      step: step.step,
      action: "error",
      status: result.status,
      error: result.error,
    };
  }

  if (result.skipped) {
    return { step: step.step, action: "skipped", reason: "email-unconfigured" };
  }

  Object.assign(
    state,
    setWelcomeSeriesState(user.id, {
      [step.sentKey]: toIso(now),
    } as WelcomeSeriesState),
  );

  return { step: step.step, action: "sent", status: result.status };
}

function buildStepConfigs(): StepConfig[] {
  return [
    {
      step: "day1",
      day: 1,
      sentKey: "day1SentAt",
      render: (_user, urls) =>
        welcomeDay1({
          firstName: firstName(_user.name),
          profileUrl: urls.profileUrl,
          unsubscribeUrl: urls.unsubscribeUrl,
        }),
    },
    {
      step: "day3",
      day: 3,
      sentKey: "day3SentAt",
      skippedKey: "day3SkippedAt",
      skipReasonKey: "day3SkipReason",
      getSkipReason: (userId) =>
        hasUserApplied(userId) ? WELCOME_SKIP_REASONS.alreadyApplied : null,
      render: (_user, urls) =>
        welcomeDay3({
          firstName: firstName(_user.name),
          opportunitiesUrl: urls.opportunitiesUrl,
          unsubscribeUrl: urls.unsubscribeUrl,
        }),
    },
    {
      step: "day7",
      day: 7,
      sentKey: "day7SentAt",
      skippedKey: "day7SkippedAt",
      skipReasonKey: "day7SkipReason",
      getSkipReason: (userId) =>
        hasUserBookedInterview(userId)
          ? WELCOME_SKIP_REASONS.alreadyInterviewed
          : null,
      render: (_user, urls) =>
        welcomeDay7({
          firstName: firstName(_user.name),
          interviewUrl: urls.interviewUrl,
          unsubscribeUrl: urls.unsubscribeUrl,
        }),
    },
    {
      step: "day14",
      day: 14,
      sentKey: "day14SentAt",
      skippedKey: "day14SkippedAt",
      skipReasonKey: "day14SkipReason",
      getSkipReason: (userId) =>
        getUserTier(userId) === "pro"
          ? WELCOME_SKIP_REASONS.alreadyPro
          : null,
      render: (_user, urls) => {
        const stats = getUsageStats(_user.id);
        return welcomeDay14({
          firstName: firstName(_user.name),
          applicationCount: stats.applicationCount,
          tailoredResumeCount: stats.tailoredResumeCount,
          upgradeUrl: urls.upgradeUrl,
          unsubscribeUrl: urls.unsubscribeUrl,
        });
      },
    },
  ];
}

function buildWelcomeUrls(userId: string): WelcomeUrls {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const unsubscribeUrl = new URL("/api/email/unsubscribe", baseUrl);
  unsubscribeUrl.searchParams.set("token", createUnsubscribeToken(userId));

  return {
    profileUrl: new URL("/profile", baseUrl).toString(),
    opportunitiesUrl: new URL("/opportunities", baseUrl).toString(),
    interviewUrl: new URL("/interview", baseUrl).toString(),
    upgradeUrl: new URL("/settings#plan", baseUrl).toString(),
    unsubscribeUrl: unsubscribeUrl.toString(),
  };
}

function firstName(name: string | null): string | null {
  return name?.trim().split(/\s+/)[0] || null;
}
