"use client";

import { nowIso } from "@/lib/format/time";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Upload,
  FileText,
  ArrowRight,
  CheckCircle2,
  Plus,
  Building2,
  Briefcase,
  Calendar,
  Mail,
  UserCheck,
  Circle,
  Clock,
  Target,
  BarChart3,
  RefreshCw,
  Puzzle,
  type LucideIcon,
} from "lucide-react";
import {
  calculateProfileCompleteness,
  type ProfileCompletenessResult,
} from "@/lib/profile-completeness";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useErrorToast } from "@/hooks/use-error-toast";
import { JobStatusBadge } from "@/components/jobs/job-status-badge";
import {
  InsetPageHeader,
  PagePanel,
  PagePanelHeader,
  PageShell,
  pageGridClasses,
} from "@/components/ui/page-layout";
import { Button } from "@/components/ui/button";
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";
import { SkeletonCard, SkeletonStatCard } from "@/components/ui/skeleton";
import {
  BASIC_ONBOARDING_STEPS,
  countCompletedSteps,
  getActiveStepIndex,
} from "@/lib/onboarding/steps";
import { computeOnboardingActive } from "@/lib/onboarding/state";
import type { OnboardingStep } from "@/lib/onboarding/types";
import { hasExtensionConnectionToken } from "@/lib/extension/detect";
import {
  getPipelineCount,
  getPipelineTotal,
} from "@/lib/opportunities/pipeline";
import { Link } from "@/i18n/navigation";
import { StreakHeroCard } from "@/components/streak/streak-hero-card";
import type { StreakState } from "@/lib/streak/types";
import { useA11yTranslations } from "@/lib/i18n/use-a11y-translations";

interface DashboardStats {
  documentsCount: number;
  resumesGenerated: number;
  profileCompleteness: ProfileCompletenessResult;
  jobsByStatus: Record<string, number>;
  extensionInstalled: boolean;
}

interface RecentJob {
  id: string;
  title: string;
  company: string;
  status: string;
  createdAt: string;
}

interface OnboardingApiState {
  dismissedAt: string | null;
  firstName: string | null;
}

type DashboardResource =
  | "profile"
  | "documents"
  | "analytics"
  | "onboarding"
  | "streak";

type ResourceErrors = Partial<Record<DashboardResource, string>>;

interface ProfileApiData {
  profile?: Parameters<typeof calculateProfileCompleteness>[0];
}

interface DocumentsApiData {
  documents?: Array<Record<string, unknown>>;
}

interface AnalyticsApiData {
  overview?: { totalResumesGenerated?: number };
  jobs?: { byStatus?: Record<string, number> };
  recent?: { jobs?: RecentJob[] };
}

interface StreakApiData {
  streak?: StreakState | null;
}

const DEFAULT_STATS: DashboardStats = {
  documentsCount: 0,
  resumesGenerated: 0,
  profileCompleteness: { percentage: 0, sections: [], nextAction: null },
  jobsByStatus: {},
  extensionInstalled: false,
};

class AuthRequiredError extends Error {
  constructor() {
    super("AUTH_REQUIRED");
  }
}

class RequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function isTransientError(error: unknown) {
  return (
    (error instanceof RequestError && error.status >= 500) ||
    error instanceof TypeError
  );
}

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function retry<T>(
  operation: () => Promise<T>,
  { times = 2, backoffMs = 300 }: { times?: number; backoffMs?: number } = {},
) {
  let attempt = 0;

  while (true) {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof AuthRequiredError) throw error;
      if (attempt >= times || !isTransientError(error)) throw error;

      attempt += 1;
      await delay(backoffMs * attempt);
    }
  }
}

async function fetchJson<T>(url: string) {
  return retry(async () => {
    const response = await fetch(url);
    const body = await response.json().catch(() => null);

    if (response.status === 401) {
      throw new AuthRequiredError();
    }

    if (!response.ok) {
      throw new RequestError(
        body?.error || `Request failed for ${url}`,
        response.status,
      );
    }

    return body as T;
  });
}

function getResourceError(error: unknown) {
  return error instanceof Error ? error.message : "Request failed";
}

function hasAnyError(errors: ResourceErrors, resources: DashboardResource[]) {
  return resources.some((resource) => Boolean(errors[resource]));
}

export default function Dashboard() {
  const t = useTranslations("dashboard");
  const [stats, setStats] = useState<DashboardStats>(DEFAULT_STATS);
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([]);
  const [streak, setStreak] = useState<StreakState | null>(null);
  const [onboardingState, setOnboardingState] = useState<OnboardingApiState>({
    dismissedAt: null,
    firstName: null,
  });
  const [dismissSubmitting, setDismissSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadErrors, setLoadErrors] = useState<ResourceErrors>({});
  const [retryingResources, setRetryingResources] = useState<
    DashboardResource[]
  >([]);
  const showErrorToast = useErrorToast();

  const redirectToSignIn = useCallback(() => {
    window.location.assign("/sign-in?callbackUrl=/dashboard");
  }, []);

  const loadResource = useCallback(
    async (resource: DashboardResource) => {
      try {
        setLoadErrors((current) => ({ ...current, [resource]: undefined }));

        if (resource === "profile") {
          const profileData = await fetchJson<ProfileApiData>("/api/profile");
          setStats((current) => ({
            ...current,
            profileCompleteness: calculateProfileCompleteness(
              profileData.profile ?? null,
            ),
            extensionInstalled: hasExtensionConnectionToken(
              window.localStorage,
            ),
          }));
          return;
        }

        if (resource === "documents") {
          const documentsData = await fetchJson<DocumentsApiData>(
            "/api/documents?limit=200",
          );
          setStats((current) => ({
            ...current,
            documentsCount: (documentsData.documents || []).length,
            extensionInstalled: hasExtensionConnectionToken(
              window.localStorage,
            ),
          }));
          return;
        }

        if (resource === "analytics") {
          const analyticsData =
            await fetchJson<AnalyticsApiData>("/api/analytics");
          setStats((current) => ({
            ...current,
            resumesGenerated:
              analyticsData.overview?.totalResumesGenerated || 0,
            jobsByStatus: analyticsData.jobs?.byStatus || {},
            extensionInstalled: hasExtensionConnectionToken(
              window.localStorage,
            ),
          }));
          setRecentJobs(analyticsData.recent?.jobs || []);
          return;
        }

        if (resource === "onboarding") {
          const onboardingData = await fetchJson<OnboardingApiState>(
            "/api/onboarding/state",
          );
          setOnboardingState({
            dismissedAt: onboardingData.dismissedAt ?? null,
            firstName: onboardingData.firstName ?? null,
          });
          return;
        }

        const streakData = await fetchJson<StreakApiData>("/api/streak");
        setStreak(streakData.streak ?? null);
      } catch (error) {
        if (error instanceof AuthRequiredError) {
          redirectToSignIn();
          return;
        }

        setLoadErrors((current) => ({
          ...current,
          [resource]: getResourceError(error),
        }));
      }
    },
    [redirectToSignIn],
  );

  const retryResources = useCallback(
    async (resources: DashboardResource[]) => {
      setRetryingResources((current) =>
        Array.from(new Set([...current, ...resources])),
      );

      try {
        await Promise.all(resources.map((resource) => loadResource(resource)));
      } finally {
        setRetryingResources((current) =>
          current.filter((resource) => !resources.includes(resource)),
        );
      }
    },
    [loadResource],
  );

  useEffect(() => {
    async function fetchStats() {
      const primaryResources: DashboardResource[] = [
        "profile",
        "documents",
        "analytics",
        "onboarding",
      ];

      const streakLoad = loadResource("streak");
      await Promise.allSettled(
        primaryResources.map((resource) => loadResource(resource)),
      );

      setLoading(false);
      await streakLoad;
    }

    fetchStats();
  }, [loadResource, redirectToSignIn]);

  async function handleSkipOnboarding() {
    const previousState = onboardingState;

    try {
      setDismissSubmitting(true);
      const optimisticDismissedAt = nowIso();
      setOnboardingState((current) => ({
        ...current,
        dismissedAt: optimisticDismissedAt,
      }));

      const response = await fetch("/api/onboarding/dismiss", {
        method: "POST",
      });
      const body = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401) {
          redirectToSignIn();
          return;
        }

        throw new Error(body?.error || "Could not skip onboarding.");
      }

      setOnboardingState({
        dismissedAt: body.dismissedAt ?? optimisticDismissedAt,
        firstName: body.firstName ?? previousState.firstName,
      });
    } catch (error) {
      setOnboardingState(previousState);
      showErrorToast(error, {
        title: t("errors.skipTitle"),
        fallbackDescription: t("errors.skipFallback"),
      });
    } finally {
      setDismissSubmitting(false);
    }
  }

  const onboardingActive = computeOnboardingActive({
    dismissedAt: onboardingState.dismissedAt,
    stats,
  });

  const retrying = useMemo(
    () => new Set(retryingResources),
    [retryingResources],
  );

  return (
    <ErrorBoundary>
      <PageShell>
        {loading ? (
          <DashboardSkeleton />
        ) : onboardingActive ? (
          <NewUserDashboard
            stats={stats}
            firstName={onboardingState.firstName}
            onSkip={handleSkipOnboarding}
            skipSubmitting={dismissSubmitting}
          />
        ) : (
          <ActiveDashboard
            stats={stats}
            recentJobs={recentJobs}
            firstName={onboardingState.firstName}
            streak={streak}
            errors={loadErrors}
            retrying={retrying}
            onRetry={retryResources}
          />
        )}
      </PageShell>
    </ErrorBoundary>
  );
}

function DashboardHeader({
  description,
  showActions = true,
}: {
  description: string;
  showActions?: boolean;
}) {
  const t = useTranslations("dashboard");

  return (
    <InsetPageHeader
      title={t("title")}
      description={description}
      className="mb-2"
      actions={
        showActions ? (
          <>
            <Button asChild>
              <Link href="/opportunities">
                <Plus className="mr-2 h-4 w-4" />
                {t("actions.addOpportunity")}
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/bank">
                <Upload className="mr-2 h-4 w-4" />
                {t("actions.uploadDocument")}
              </Link>
            </Button>
          </>
        ) : null
      }
    />
  );
}

function NewUserDashboard({
  stats,
  firstName,
  onSkip,
  skipSubmitting,
}: {
  stats: DashboardStats;
  firstName: string | null;
  onSkip: () => void;
  skipSubmitting: boolean;
}) {
  const a11yT = useA11yTranslations();

  const t = useTranslations("dashboard");
  const steps = BASIC_ONBOARDING_STEPS;
  const completedCount = countCompletedSteps(steps, stats);
  const activeStepIndex = getActiveStepIndex(steps, stats);
  const activeStep = steps[activeStepIndex] ?? steps[0];

  return (
    <div className="space-y-5">
      <DashboardHeader
        description={getDashboardGreeting(firstName, "onboarding", t)}
        showActions={false}
      />
      <div className={pageGridClasses.primaryAside}>
        <PagePanel>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase text-primary">
                {t("onboarding.startHere")}
              </p>
              <h2 className="mt-1 text-xl font-semibold">
                {t("onboarding.title")}
              </h2>
              <p className="mt-2 max-w-prose text-sm leading-6 text-muted-foreground">
                {t("onboarding.description")}
              </p>
            </div>
            <div className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg border bg-background/50 px-3 py-2 text-xs font-medium text-muted-foreground">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                {completedCount}
              </span>
              {t("onboarding.complete", { total: steps.length })}
            </div>
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <SetupStep
                key={step.id}
                number={index + 1}
                step={step}
                active={index === activeStepIndex}
                complete={step.isComplete(stats)}
              />
            ))}
          </div>
        </PagePanel>

        <PagePanel as="aside" className="flex flex-col">
          <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Target className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold">{t("onboarding.unlocks")}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {getUnlockPreviewIntro(activeStep, t)}
          </p>
          <div className="mt-6 border-t pt-5">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t("onboarding.afterStep")}
            </h3>
          </div>
          <div className="mt-3 space-y-3">
            {getUnlockPreviewItems(activeStep, t).map((item) => (
              <UnlockItem
                key={item.title}
                icon={item.icon}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
          <div className="mt-auto border-t pt-5">
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={onSkip}
              disabled={skipSubmitting}
              aria-label={a11yT("skipOnboarding")}
            >
              {t("onboarding.skip")}
            </Button>
          </div>
        </PagePanel>
      </div>
    </div>
  );
}

function SetupStep({
  number,
  step,
  active = false,
  complete = false,
}: {
  number: number;
  step: OnboardingStep;
  active?: boolean;
  complete?: boolean;
}) {
  const t = useTranslations("dashboard");
  const Icon = step.icon;

  return (
    <Link
      href={step.href}
      className={`group flex flex-col gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center ${
        active ? "border-primary/30 bg-primary/5" : "bg-background/40"
      }`}
    >
      <div className="flex items-center gap-3 sm:w-12 sm:flex-col sm:gap-2">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            active
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          {complete ? <CheckCircle2 className="h-4 w-4" /> : `0${number}`}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold">
          {t(`onboarding.steps.${step.id}.title`)}
        </h3>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {t(`onboarding.steps.${step.id}.description`)}
        </p>
      </div>
      <span
        className={`inline-flex min-h-9 shrink-0 items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium ${
          active
            ? "bg-primary/10 text-primary"
            : "border bg-card text-foreground"
        }`}
      >
        {active
          ? t("onboarding.recommended")
          : t(`onboarding.steps.${step.id}.actionLabel`)}
        {!active ? <ArrowRight className="h-3.5 w-3.5" /> : null}
      </span>
    </Link>
  );
}

function UnlockItem({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

function ActiveDashboard({
  stats,
  recentJobs,
  firstName,
  streak,
  errors,
  retrying,
  onRetry,
}: {
  stats: DashboardStats;
  recentJobs: RecentJob[];
  firstName: string | null;
  streak: StreakState | null;
  errors: ResourceErrors;
  retrying: Set<DashboardResource>;
  onRetry: (resources: DashboardResource[]) => void;
}) {
  const t = useTranslations("dashboard");
  const commonT = useTranslations("common");
  const actions = buildTodayActions(stats, recentJobs, t);
  const totalPipeline = getPipelineTotal(stats.jobsByStatus);
  const statsResources: DashboardResource[] = [
    "profile",
    "documents",
    "analytics",
  ];
  const statsError = hasAnyError(errors, statsResources);
  const statsRetrying = statsResources.some((resource) =>
    retrying.has(resource),
  );
  const retryStats = () => onRetry(statsResources);
  const retryAnalytics = () => onRetry(["analytics"]);
  const retryStreak = () => onRetry(["streak"]);

  return (
    <div className="space-y-5">
      <DashboardHeader
        description={getDashboardGreeting(firstName, "active", t)}
      />
      <Suspense fallback={<SkeletonCard />}>
        {errors.streak ? (
          <DashboardSectionError
            onRetry={retryStreak}
            retryLabel={commonT("tryAgain")}
            retrying={retrying.has("streak")}
          />
        ) : (
          <StreakHeroCard streak={streak} />
        )}
      </Suspense>
      <Suspense
        fallback={
          <div className={pageGridClasses.fourStats}>
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
          </div>
        }
      >
        {statsError ? (
          <DashboardSectionError
            onRetry={retryStats}
            retryLabel={commonT("tryAgain")}
            retrying={statsRetrying}
          />
        ) : (
          <DashboardStatStrip stats={stats} totalPipeline={totalPipeline} />
        )}
      </Suspense>

      <div className={pageGridClasses.primaryAside}>
        <Suspense fallback={<SkeletonCard />}>
          {statsError ? (
            <DashboardSectionError
              onRetry={retryStats}
              retryLabel={commonT("tryAgain")}
              retrying={statsRetrying}
            />
          ) : (
            <TodayPanel actions={actions} />
          )}
        </Suspense>
        <Suspense fallback={<SkeletonCard />}>
          {statsError ? (
            <DashboardSectionError
              onRetry={retryStats}
              retryLabel={commonT("tryAgain")}
              retrying={statsRetrying}
            />
          ) : (
            <ReadinessPanel stats={stats} />
          )}
        </Suspense>
      </div>

      <Suspense fallback={<SkeletonCard />}>
        {errors.analytics ? (
          <DashboardSectionError
            onRetry={retryAnalytics}
            retryLabel={commonT("tryAgain")}
            retrying={retrying.has("analytics")}
          />
        ) : (
          <PipelineSummary stats={stats} total={totalPipeline} />
        )}
      </Suspense>

      <Suspense fallback={<SkeletonCard />}>
        {errors.analytics ? (
          <DashboardSectionError
            onRetry={retryAnalytics}
            retryLabel={commonT("tryAgain")}
            retrying={retrying.has("analytics")}
          />
        ) : (
          <RecentOpportunitiesPanel recentJobs={recentJobs} />
        )}
      </Suspense>
    </div>
  );
}

function DashboardSectionError({
  onRetry,
  retryLabel,
  retrying = false,
}: {
  onRetry: () => void;
  retryLabel: string;
  retrying?: boolean;
}) {
  const t = useTranslations("dashboard");

  return (
    <PagePanel>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-muted-foreground">
          {t("errors.loadSection")}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRetry}
          disabled={retrying}
        >
          <RefreshCw className="h-4 w-4" />
          {retryLabel}
        </Button>
      </div>
    </PagePanel>
  );
}

function DashboardStatStrip({
  stats,
  totalPipeline,
}: {
  stats: DashboardStats;
  totalPipeline: number;
}) {
  const t = useTranslations("dashboard");
  const items = [
    {
      label: t("stats.readiness"),
      value: `${stats.profileCompleteness.percentage}%`,
      icon: Target,
    },
    {
      label: t("stats.documents"),
      value: stats.documentsCount,
      icon: FileText,
    },
    {
      label: t("stats.tailoredDocs"),
      value: stats.resumesGenerated,
      icon: FileText,
    },
    { label: t("stats.pipeline"), value: totalPipeline, icon: Briefcase },
  ];

  return (
    <div className={pageGridClasses.fourStats}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <PagePanel key={item.label} className="p-4 sm:p-4" as="div">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-1 text-2xl font-semibold">{item.value}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </PagePanel>
        );
      })}
    </div>
  );
}

interface TodayAction {
  icon: LucideIcon;
  title: string;
  context: string;
  href: string;
  actionLabel: string;
  tone: "primary" | "warning" | "success";
}

function buildTodayActions(
  stats: DashboardStats,
  recentJobs: RecentJob[],
  t: ReturnType<typeof useTranslations<"dashboard">>,
): TodayAction[] {
  const actions: TodayAction[] = [];

  if (stats.documentsCount === 0) {
    actions.push({
      icon: Upload,
      title: t("today.uploadResumeTitle"),
      context: t("today.uploadResumeContext"),
      href: "/bank",
      actionLabel: t("today.uploadResumeAction"),
      tone: "primary",
    });
  }

  if (stats.jobsByStatus.pending) {
    actions.push({
      icon: Briefcase,
      title: t("today.reviewNewTitle", { count: stats.jobsByStatus.pending }),
      context: t("today.reviewNewContext"),
      href: "/opportunities/review",
      actionLabel: t("today.reviewNewAction"),
      tone: "primary",
    });
  }

  if (stats.profileCompleteness.percentage < 80) {
    actions.push({
      icon: UserCheck,
      title: t("today.completeProfileTitle"),
      context: t("today.completeProfileContext", {
        percentage: stats.profileCompleteness.percentage,
      }),
      href: stats.profileCompleteness.nextAction?.href ?? "/profile",
      actionLabel: t("today.completeProfileAction"),
      tone: "warning",
    });
  }

  if (recentJobs.some((job) => job.status === "interviewing")) {
    actions.push({
      icon: Calendar,
      title: t("today.prepareInterviewsTitle"),
      context: t("today.prepareInterviewsContext"),
      href: "/interview",
      actionLabel: t("today.prepareInterviewsAction"),
      tone: "success",
    });
  }

  actions.push({
    icon: Mail,
    title: t("today.draftFollowUpTitle"),
    context: t("today.draftFollowUpContext"),
    href: "/emails",
    actionLabel: t("today.draftFollowUpAction"),
    tone: "primary",
  });

  if (stats.documentsCount > 0) {
    actions.push({
      icon: FileText,
      title: t("today.tailoredDocumentTitle"),
      context: t("today.tailoredDocumentContext", {
        count: stats.documentsCount,
      }),
      href: "/studio",
      actionLabel: t("today.tailoredDocumentAction"),
      tone: "primary",
    });
  }

  return actions.slice(0, 3);
}

function TodayPanel({ actions }: { actions: TodayAction[] }) {
  const t = useTranslations("dashboard");

  return (
    <PagePanel>
      <PagePanelHeader
        title={t("today.title")}
        description={t("today.description")}
        icon={Clock}
      />
      <div className="space-y-3">
        {actions.map((action) => (
          <TodayActionRow key={action.title} action={action} />
        ))}
      </div>
    </PagePanel>
  );
}

function TodayActionRow({ action }: { action: TodayAction }) {
  const Icon = action.icon;
  const toneClass =
    action.tone === "warning"
      ? "bg-warning/10 text-warning"
      : action.tone === "success"
        ? "bg-success/10 text-success"
        : "bg-primary/10 text-primary";

  return (
    <Link
      href={action.href}
      className="group flex flex-col gap-3 rounded-lg border bg-background/40 p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center"
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${toneClass}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-medium">{action.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{action.context}</p>
      </div>
      <span className="inline-flex min-h-9 shrink-0 items-center justify-center gap-2 rounded-lg border bg-card px-3 py-1.5 text-sm font-medium transition-colors group-hover:border-primary/30">
        {action.actionLabel}
        <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}

function ReadinessPanel({ stats }: { stats: DashboardStats }) {
  const t = useTranslations("dashboard");
  const profileReady = stats.profileCompleteness.percentage >= 80;
  const docsReady = stats.documentsCount > 0;
  const studioReady = stats.resumesGenerated > 0;

  return (
    <PagePanel as="aside">
      <PagePanelHeader
        title={t("stats.readiness")}
        description={t("readiness.description")}
        action={
          <span className="text-2xl font-bold text-primary">
            {stats.profileCompleteness.percentage}%
          </span>
        }
      />
      <div className="mb-5 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${stats.profileCompleteness.percentage}%` }}
        />
      </div>
      <div className="space-y-3">
        <ReadinessItem
          ready={profileReady}
          title={t("readiness.profile")}
          detail={
            profileReady
              ? t("readiness.strongFoundation")
              : (stats.profileCompleteness.nextAction?.label ??
                t("readiness.needsDetail"))
          }
          href={stats.profileCompleteness.nextAction?.href ?? "/profile"}
        />
        <ReadinessItem
          ready={docsReady}
          title={t("stats.documents")}
          detail={t("readiness.documentsDetail", {
            count: stats.documentsCount,
          })}
          href="/bank"
        />
        <ReadinessItem
          ready={studioReady}
          title={t("stats.tailoredDocs")}
          detail={t("readiness.tailoredDetail", {
            count: stats.resumesGenerated,
          })}
          href="/studio"
        />
      </div>
    </PagePanel>
  );
}

function ReadinessItem({
  ready,
  title,
  detail,
  href,
}: {
  ready: boolean;
  title: string;
  detail: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
    >
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
          ready ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
        }`}
      >
        {ready ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <Circle className="h-4 w-4" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{detail}</p>
      </div>
    </Link>
  );
}

function PipelineSummary({
  stats,
  total,
}: {
  stats: DashboardStats;
  total: number;
}) {
  const t = useTranslations("dashboard");
  const opportunitiesT = useTranslations("opportunities");
  const stages = [
    {
      label: opportunitiesT("status.saved"),
      count: getPipelineCount(stats.jobsByStatus, "saved"),
      href: "/opportunities?status=saved",
    },
    {
      label: opportunitiesT("status.applied"),
      count: getPipelineCount(stats.jobsByStatus, "applied"),
      href: "/opportunities?status=applied",
    },
    {
      label: opportunitiesT("status.interviewing"),
      count: getPipelineCount(stats.jobsByStatus, "interviewing"),
      href: "/opportunities?status=interviewing",
    },
    {
      label: opportunitiesT("status.offer"),
      count: getPipelineCount(stats.jobsByStatus, "offered"),
      href: "/opportunities?status=offered",
    },
  ];

  return (
    <PagePanel>
      <PagePanelHeader
        title={t("pipeline.title")}
        description={
          total > 0 ? t("pipeline.description") : t("pipeline.empty")
        }
        icon={BarChart3}
      />
      <div className={pageGridClasses.fourStats}>
        {stages.map((stage) => {
          const percent =
            total > 0 ? Math.max((stage.count / total) * 100, 4) : 0;
          return (
            <Link
              key={stage.label}
              href={stage.href}
              className="rounded-lg border bg-background/40 p-3 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {stage.label}
                </span>
                <span className="text-lg font-semibold">{stage.count}</span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </PagePanel>
  );
}

function RecentOpportunitiesPanel({ recentJobs }: { recentJobs: RecentJob[] }) {
  const t = useTranslations("dashboard");

  return (
    <PagePanel>
      <PagePanelHeader
        title={t("recent.title")}
        description={t("recent.description")}
        action={
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {t("recent.viewAll")}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      />

      {recentJobs.length > 0 ? (
        <div className="divide-y rounded-lg border">
          {recentJobs.slice(0, 4).map((job) => (
            <Link
              key={job.id}
              href="/opportunities"
              className="flex flex-col gap-3 p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{job.title}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {job.company}
                </p>
              </div>
              <JobStatusBadge status={job.status} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed bg-background/40 px-6 py-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Briefcase className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">{t("recent.emptyTitle")}</p>
            <p className="text-xs text-muted-foreground">
              {t("recent.emptyDescription")}
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/opportunities">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              {t("actions.addOpportunity")}
            </Link>
          </Button>
        </div>
      )}
    </PagePanel>
  );
}

function getDashboardGreeting(
  firstName: string | null,
  mode: "onboarding" | "active",
  t: ReturnType<typeof useTranslations<"dashboard">>,
): string {
  if (mode === "onboarding") {
    return firstName
      ? t("greeting.onboardingNamed", { name: firstName })
      : t("greeting.onboarding");
  }

  return firstName
    ? t("greeting.activeNamed", { name: firstName })
    : t("greeting.active");
}

function getUnlockPreviewIntro(
  step: OnboardingStep | undefined,
  t: ReturnType<typeof useTranslations<"dashboard">>,
): string {
  const knownIds = [
    "upload-resume",
    "install-extension",
    "add-opportunity",
    "create-tailored-doc",
  ];
  const previewId =
    step?.id && knownIds.includes(step.id) ? step.id : "upload-resume";

  return t(`onboarding.unlockPreview.${previewId}.intro`);
}

function getUnlockPreviewItems(
  step: OnboardingStep | undefined,
  t: ReturnType<typeof useTranslations<"dashboard">>,
): Array<{
  icon: LucideIcon;
  title: string;
  description: string;
}> {
  switch (step?.id) {
    case "install-extension":
      return [
        {
          icon: Puzzle,
          title: t(
            "onboarding.unlockPreview.install-extension.items.0.title",
          ),
          description: t(
            "onboarding.unlockPreview.install-extension.items.0.description",
          ),
        },
        {
          icon: FileText,
          title: t(
            "onboarding.unlockPreview.install-extension.items.1.title",
          ),
          description: t(
            "onboarding.unlockPreview.install-extension.items.1.description",
          ),
        },
        {
          icon: Briefcase,
          title: t(
            "onboarding.unlockPreview.install-extension.items.2.title",
          ),
          description: t(
            "onboarding.unlockPreview.install-extension.items.2.description",
          ),
        },
      ];
    case "add-opportunity":
      return [
        {
          icon: Target,
          title: t("onboarding.unlockPreview.add-opportunity.items.0.title"),
          description: t(
            "onboarding.unlockPreview.add-opportunity.items.0.description",
          ),
        },
        {
          icon: Calendar,
          title: t("onboarding.unlockPreview.add-opportunity.items.1.title"),
          description: t(
            "onboarding.unlockPreview.add-opportunity.items.1.description",
          ),
        },
        {
          icon: BarChart3,
          title: t("onboarding.unlockPreview.add-opportunity.items.2.title"),
          description: t(
            "onboarding.unlockPreview.add-opportunity.items.2.description",
          ),
        },
      ];
    case "create-tailored-doc":
      return [
        {
          icon: CheckCircle2,
          title: t(
            "onboarding.unlockPreview.create-tailored-doc.items.0.title",
          ),
          description: t(
            "onboarding.unlockPreview.create-tailored-doc.items.0.description",
          ),
        },
        {
          icon: Mail,
          title: t(
            "onboarding.unlockPreview.create-tailored-doc.items.1.title",
          ),
          description: t(
            "onboarding.unlockPreview.create-tailored-doc.items.1.description",
          ),
        },
        {
          icon: UserCheck,
          title: t(
            "onboarding.unlockPreview.create-tailored-doc.items.2.title",
          ),
          description: t(
            "onboarding.unlockPreview.create-tailored-doc.items.2.description",
          ),
        },
      ];
    case "upload-resume":
    default:
      return [
        {
          icon: FileText,
          title: t("onboarding.unlockPreview.upload-resume.items.0.title"),
          description: t(
            "onboarding.unlockPreview.upload-resume.items.0.description",
          ),
        },
        {
          icon: Briefcase,
          title: t("onboarding.unlockPreview.upload-resume.items.1.title"),
          description: t(
            "onboarding.unlockPreview.upload-resume.items.1.description",
          ),
        },
        {
          icon: Target,
          title: t("onboarding.unlockPreview.upload-resume.items.2.title"),
          description: t(
            "onboarding.unlockPreview.upload-resume.items.2.description",
          ),
        },
      ];
  }
}
