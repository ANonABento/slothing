import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PageWidth = "full" | "narrow" | "wide";

const pageWidthClasses: Record<PageWidth, string> = {
  full: "",
  narrow: "mx-auto max-w-3xl",
  wide: "max-w-screen-2xl",
};

export function getPageWidthClassName(width: PageWidth) {
  return pageWidthClasses[width];
}

interface AppPageProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "default";
}

export function AppPage({
  children,
  className,
  padding = "default",
}: AppPageProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-background",
        padding === "default" && "pb-24",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  icon: ElementType;
  width?: PageWidth;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  icon: _Icon,
  width = "wide",
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("border-b bg-card/70", className)}>
      <div className={cn("px-5 py-6 sm:px-8", getPageWidthClassName(width))}>
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-3">
            <div>
              <h1 className="text-3xl font-bold tracking-normal text-foreground sm:text-4xl">
                {title}
              </h1>
              {description ? (
                <p className="mt-2 max-w-prose text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              ) : null}
            </div>
          </div>

          {actions ? (
            <div className="flex flex-wrap items-center gap-3">{actions}</div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

interface PageContentProps {
  children: ReactNode;
  width?: PageWidth;
  className?: string;
}

export function PageContent({
  children,
  width = "wide",
  className,
}: PageContentProps) {
  return (
    <div
      className={cn(
        "px-5 py-6 sm:px-8",
        getPageWidthClassName(width),
        className,
      )}
    >
      {children}
    </div>
  );
}

interface PageShellProps {
  children: ReactNode;
  width?: PageWidth;
  className?: string;
}

export function PageShell({
  children,
  width = "wide",
  className,
}: PageShellProps) {
  return (
    <AppPage padding="none">
      <PageContent width={width} className={cn("space-y-4 lg:py-8", className)}>
        {children}
      </PageContent>
    </AppPage>
  );
}

interface PageWorkspaceProps {
  children: ReactNode;
  className?: string;
}

export function PageWorkspace({ children, className }: PageWorkspaceProps) {
  return (
    <AppPage
      padding="none"
      className={cn(
        "flex h-[calc(100vh-4rem)] min-h-0 flex-col lg:h-screen",
        className,
      )}
    >
      {children}
    </AppPage>
  );
}

interface CenteredPagePanelProps {
  children: ReactNode;
  className?: string;
  panelClassName?: string;
}

export function CenteredPagePanel({
  children,
  className,
  panelClassName,
}: CenteredPagePanelProps) {
  return (
    <AppPage padding="none" className={className}>
      <PageContent
        width="narrow"
        className="flex min-h-[calc(100vh-4rem)] items-center justify-center lg:min-h-screen"
      >
        <PagePanel className={cn("w-full max-w-md", panelClassName)}>
          {children}
        </PagePanel>
      </PageContent>
    </AppPage>
  );
}

interface InsetPageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function InsetPageHeader({
  title,
  description,
  actions,
  className,
}: InsetPageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </header>
  );
}

interface PagePanelProps {
  children: ReactNode;
  className?: string;
  as?: "section" | "aside" | "article" | "div";
}

export function PagePanel({
  children,
  className,
  as: Component = "section",
}: PagePanelProps) {
  return (
    <Component
      className={cn(
        "rounded-lg border bg-card p-5 shadow-sm sm:p-6",
        className,
      )}
    >
      {children}
    </Component>
  );
}

interface PagePanelHeaderProps {
  title: string;
  description?: string;
  icon?: ElementType;
  action?: ReactNode;
  className?: string;
  iconClassName?: string;
}

export function PagePanelHeader({
  title,
  description,
  icon: Icon,
  action,
  className,
  iconClassName,
}: PagePanelHeaderProps) {
  return (
    <div
      className={cn("mb-5 flex items-start justify-between gap-4", className)}
    >
      <div>
        <div className="flex items-center gap-2">
          {Icon ? (
            <Icon
              className={cn("h-5 w-5 text-muted-foreground", iconClassName)}
            />
          ) : null}
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        </div>
        {description ? (
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

interface PageIconTileProps {
  icon: ElementType;
  className?: string;
  iconClassName?: string;
  size?: "sm" | "md";
}

export function PageIconTile({
  icon: Icon,
  className,
  iconClassName,
  size = "md",
}: PageIconTileProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary",
        size === "sm" ? "h-9 w-9" : "h-10 w-10",
        className,
      )}
    >
      <Icon className={cn(size === "sm" ? "h-4 w-4" : "h-5 w-5", iconClassName)} />
    </div>
  );
}

interface PageSectionProps {
  title: string;
  description?: string;
  icon: ElementType;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  iconClassName?: string;
}

export function PageSection({
  title,
  description,
  icon,
  action,
  children,
  className,
  contentClassName,
  iconClassName,
}: PageSectionProps) {
  return (
    <PagePanel className={className}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <PageIconTile icon={icon} className={iconClassName} />
          <div>
            <h2 className="font-semibold text-foreground">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className={contentClassName}>{children}</div>
    </PagePanel>
  );
}

export const pageGridClasses = {
  primaryAside: "grid gap-4 lg:grid-cols-[1.45fr_0.85fr]",
  fourStats: "grid gap-3 sm:grid-cols-4",
} as const;

interface PageLoadingStateProps {
  icon: ElementType;
  label: string;
  className?: string;
}

export function PageLoadingState({
  icon: Icon,
  label,
  className,
}: PageLoadingStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center bg-background px-6",
        className,
      )}
    >
      <div className="text-center">
        <Icon className="mx-auto h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

interface StandardEmptyStateProps {
  icon: ElementType;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function StandardEmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: StandardEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[360px] flex-col items-center justify-center rounded-lg border border-dashed bg-card/50 p-8 text-center",
        className,
      )}
    >
      <Icon className="mb-4 h-10 w-10 text-muted-foreground" />
      <h2 className="text-lg font-semibold">{title}</h2>
      {description ? (
        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
