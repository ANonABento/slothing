"use client";

import { nowIso } from "@/lib/format/time";

import { Suspense, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Upload,
  FileText,
  ArrowRight,
  CheckCircle2,
  Plus,
  Building2,
  LogIn,
  Briefcase,
  Calendar,
  Mail,
  UserCheck,
  Circle,
  Clock,
  Target,
  BarChart3,
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
  CenteredPagePanel,
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
import {
  getPipelineCount,
  getPipelineTotal,
} from "@/lib/opportunities/pipeline";
import { Link } from "@/i18n/navigation";

interface DashboardStats {
  documentsCount: number;
  resumesGenerated: number;
  profileCompleteness: ProfileCompletenessResult;
  jobsByStatus: Record<string, number>;
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

export default function Dashboard() {
  const t = useTranslations("dashboard");
  const commonT = useTranslations("common");
  const [stats, setStats] = useState<DashboardStats>({
    documentsCount: 0,
    resumesGenerated: 0,
    profileCompleteness: { percentage: 0, sections: [], nextAction: null },
    jobsByStatus: {},
  });
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([]);
  const [onboardingState, setOnboardingState] = useState<OnboardingApiState>({
    dismissedAt: null,
    firstName: null,
  });
  const [dismissSubmitting, setDismissSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const showErrorToast = useErrorToast();

  useEffect(() => {
    async function fetchJson(url: string) {
      const response = await fetch(url);
      const body = await response.json().catch(() => null);

      if (response.status === 401) {
        throw new Error("AUTH_REQUIRED");
      }

      if (!response.ok) {
        throw new Error(body?.error || `Request failed for ${url}`);
      }

      return body;
    }

    async function fetchStats() {
      try {
        setErrorMessage(null);

        const [profileData, documentsData, analyticsData, onboardingData] =
          await Promise.all([
            fetchJson("/api/profile"),
            fetchJson("/api/documents"),
            fetchJson("/api/analytics"),
            fetchJson("/api/onboarding/dismiss"),
          ]);

        const profile = profileData.profile;
        const documents = documentsData.documents || [];
        const completeness = calculateProfileCompleteness(profile);
        const resumesGenerated =
          analyticsData.overview?.totalResumesGenerated || 0;

        setStats({
          documentsCount: documents.length,
          resumesGenerated,
          profileCompleteness: completeness,
          jobsByStatus: analyticsData.jobs?.byStatus || {},
        });

        const recentJobsList = analyticsData.recent?.jobs || [];
        setRecentJobs(recentJobsList);
        setOnboardingState({
          dismissedAt: onboardingData.dismissedAt ?? null,
          firstName: onboardingData.firstName ?? null,
        });
      } catch (error) {
        const isAuthError =
          error instanceof Error && error.message === "AUTH_REQUIRED";
        showErrorToast(
          isAuthError ? new Error(t("errors.authRequired")) : error,
          {
            title: t("errors.loadTitle"),
            fallbackDescription: t("errors.loadFallback"),
          },
        );
        setErrorMessage(
          isAuthError ? t("errors.authRequired") : t("errors.loadData"),
        );
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [showErrorToast, t]);

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

  if (errorMessage) {
    const needsSignIn = errorMessage === t("errors.authRequired");

    return (
      <CenteredPagePanel>
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <LogIn className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {needsSignIn ? t("errors.signInRequired") : t("errors.unavailable")}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">{errorMessage}</p>
          <div className="mt-6 flex justify-center gap-3">
            {needsSignIn ? (
              <Button asChild>
                <Link href="/sign-in?callbackUrl=/dashboard">
                  <LogIn className="h-4 w-4" />
                  {t("actions.signIn")}
                </Link>
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => window.location.reload()}
              >
                {commonT("tryAgain")}
              </Button>
            )}
          </div>
        </div>
      </CenteredPagePanel>
    );
  }

  const onboardingActive = computeOnboardingActive({
    dismissedAt: onboardingState.dismissedAt,
    stats,
  });

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
            {getUnlockPreviewIntro(activeStep)}
          </p>
          <div className="mt-6 border-t pt-5">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t("onboarding.afterStep")}
            </h3>
          </div>
          <div className="mt-3 space-y-3">
            {getUnlockPreviewItems(activeStep).map((item) => (
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
              aria-label="Skip onboarding"
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
        <h3 className="font-semibold">{step.title}</h3>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {step.description}
        </p>
      </div>
      <span
        className={`inline-flex min-h-9 shrink-0 items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium ${
          active
            ? "bg-primary/10 text-primary"
            : "border bg-card text-foreground"
        }`}
      >
        {active ? t("onboarding.recommended") : step.actionLabel}
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
}: {
  stats: DashboardStats;
  recentJobs: RecentJob[];
  firstName: string | null;
}) {
  const t = useTranslations("dashboard");
  const actions = buildTodayActions(stats, recentJobs, t);
  const totalPipeline = getPipelineTotal(stats.jobsByStatus);

  return (
    <div className="space-y-5">
      <DashboardHeader
        description={getDashboardGreeting(firstName, "active", t)}
      />
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
        <DashboardStatStrip stats={stats} totalPipeline={totalPipeline} />
      </Suspense>

      <div className={pageGridClasses.primaryAside}>
        <Suspense fallback={<SkeletonCard />}>
          <TodayPanel actions={actions} />
        </Suspense>
        <Suspense fallback={<SkeletonCard />}>
          <ReadinessPanel stats={stats} />
        </Suspense>
      </div>

      <Suspense fallback={<SkeletonCard />}>
        <PipelineSummary stats={stats} total={totalPipeline} />
      </Suspense>

      <Suspense fallback={<SkeletonCard />}>
        <RecentOpportunitiesPanel recentJobs={recentJobs} />
      </Suspense>
    </div>
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
    },
    {
      label: opportunitiesT("status.applied"),
      count: getPipelineCount(stats.jobsByStatus, "applied"),
    },
    {
      label: opportunitiesT("status.interviewing"),
      count: getPipelineCount(stats.jobsByStatus, "interviewing"),
    },
    {
      label: opportunitiesT("status.offer"),
      count: getPipelineCount(stats.jobsByStatus, "offered"),
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
            <div
              key={stage.label}
              className="rounded-lg border bg-background/40 p-3"
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
            </div>
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
        <Link
          href="/opportunities"
          className="flex min-h-24 items-center justify-center gap-2 rounded-lg border border-dashed bg-background/40 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
          {t("recent.emptyTitle")}
        </Link>
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

function getUnlockPreviewIntro(step: OnboardingStep | undefined): string {
  switch (step?.id) {
    case "add-opportunity":
      return "Once your first role is tracked, Slothing can connect documents and next steps to a real target.";
    case "create-tailored-doc":
      return "Once a tailored document exists, your workspace starts turning source material into reusable application momentum.";
    case "upload-resume":
    default:
      return "Once your resume is in the bank, Slothing has source material for the rest of the workflow.";
  }
}

function getUnlockPreviewItems(step: OnboardingStep | undefined): Array<{
  icon: LucideIcon;
  title: string;
  description: string;
}> {
  switch (step?.id) {
    case "add-opportunity":
      return [
        {
          icon: Target,
          title: "Focused application plans",
          description: "See the documents and prep work each role needs.",
        },
        {
          icon: Calendar,
          title: "Follow-up timing",
          description: "Keep interviews, deadlines, and reminders visible.",
        },
        {
          icon: BarChart3,
          title: "Pipeline clarity",
          description: "Watch saved, applied, and interviewing roles move.",
        },
      ];
    case "create-tailored-doc":
      return [
        {
          icon: CheckCircle2,
          title: "Application-ready drafts",
          description: "Turn your resume and target role into stronger docs.",
        },
        {
          icon: Mail,
          title: "Reusable follow-ups",
          description: "Keep recruiter notes aligned with the role context.",
        },
        {
          icon: UserCheck,
          title: "Readiness signals",
          description: "Know what is polished and what still needs work.",
        },
      ];
    case "upload-resume":
    default:
      return [
        {
          icon: FileText,
          title: "Reusable document bank",
          description: "Keep your source material organized for every role.",
        },
        {
          icon: Briefcase,
          title: "Better opportunity matching",
          description: "Compare jobs against real experience and skills.",
        },
        {
          icon: Target,
          title: "Tailored Studio drafts",
          description: "Start from existing material instead of a blank page.",
        },
      ];
  }
}
