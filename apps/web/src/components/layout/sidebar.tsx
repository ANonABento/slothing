"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/i18n/navigation";
import {
  Home,
  Database,
  Briefcase,
  MessageSquare,
  Settings,
  Menu,
  X,
  BarChart3,
  Mail,
  Calendar,
  DollarSign,
  FileText,
  Rows3,
  ClipboardList,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  PanelTopOpen,
  UserCircle,
  Wrench,
  ScanLine,
  type LucideIcon,
} from "lucide-react";
import { useLLMStatus } from "@/hooks/useLLMStatus";
import { useProfileSnapshot } from "@/hooks/use-profile-snapshot";
import { CreditBalanceBadge } from "@/components/billing/credit-status";
import { useRegisterShortcuts } from "@/components/keyboard-shortcuts";
import {
  ConditionalTooltip,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useOptionalChrome } from "./chrome-provider";
import { SidebarExtensionCard } from "./sidebar-extension-card";

export interface NavItem {
  name: string;
  messageKey: string;
  href: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  messageKey: string;
  items: NavItem[];
}

interface SidebarNavItemClassNameOptions {
  isActive: boolean;
  collapsed: boolean;
}

type SidebarNavItemState = {
  "data-active": "true" | "false";
};

export const navigationGroups: NavGroup[] = [
  {
    label: "Home",
    messageKey: "groups.home",
    items: [
      {
        name: "Dashboard",
        messageKey: "items.dashboard",
        href: "/dashboard",
        icon: Home,
      },
    ],
  },
  {
    label: "Library",
    messageKey: "groups.library",
    items: [
      {
        name: "Components",
        messageKey: "items.components",
        href: "/components",
        icon: Database,
      },
      {
        name: "Answers",
        messageKey: "items.answers",
        href: "/answers",
        icon: ClipboardList,
      },
      {
        name: "Studio",
        messageKey: "items.studio",
        href: "/studio",
        icon: FileText,
      },
    ],
  },
  {
    label: "Pipeline",
    messageKey: "groups.pipeline",
    items: [
      {
        name: "Opportunities",
        messageKey: "items.opportunities",
        href: "/opportunities",
        icon: Briefcase,
      },
      {
        name: "Review Queue",
        messageKey: "items.reviewQueue",
        href: "/opportunities/review",
        icon: Rows3,
      },
      {
        name: "Calendar",
        messageKey: "items.calendar",
        href: "/calendar",
        icon: Calendar,
      },
    ],
  },
  {
    label: "Prep",
    messageKey: "groups.prep",
    items: [
      {
        name: "Interview Prep",
        messageKey: "items.interview",
        href: "/interview",
        icon: MessageSquare,
      },
      {
        name: "ATS Scanner",
        messageKey: "items.ats",
        href: "/ats",
        icon: ScanLine,
      },
      {
        name: "Toolkit",
        messageKey: "items.toolkit",
        href: "/toolkit",
        icon: Wrench,
      },
    ],
  },
  {
    label: "Reporting",
    messageKey: "groups.reporting",
    items: [
      {
        name: "Analytics",
        messageKey: "items.analytics",
        href: "/analytics",
        icon: BarChart3,
      },
    ],
  },
];

export const bottomNavigation: NavItem[] = [
  {
    name: "Profile",
    messageKey: "items.profile",
    href: "/profile",
    icon: UserCircle,
  },
  {
    name: "Settings",
    messageKey: "items.settings",
    href: "/settings",
    icon: Settings,
  },
];

export function getSidebarNavItemClassName({
  isActive,
  collapsed,
}: SidebarNavItemClassNameOptions): string {
  return cn(
    "app-sidebar-nav-item app-shell-nav-row group relative flex min-h-[36px] items-center gap-2.5 rounded-sm border px-2.5 text-[13.5px] font-medium transition-all duration-200",
    isActive
      ? "border-primary/20 bg-card text-foreground shadow-sm font-semibold"
      : "border-transparent text-muted-foreground hover:border-border/70 hover:bg-card/70 hover:text-foreground",
    collapsed && "justify-center px-2",
  );
}

export function getSidebarNavItemState(isActive: boolean): SidebarNavItemState {
  return { "data-active": isActive ? "true" : "false" };
}

export function isSidebarItemActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getActiveSidebarHref(
  pathname: string,
  items: NavItem[],
): string | null {
  return getActiveSidebarItem(pathname, items)?.href ?? null;
}

export function getActiveSidebarItem(
  pathname: string,
  items: NavItem[],
): NavItem | null {
  const matches = items
    .filter((item) => isSidebarItemActive(pathname, item.href))
    .sort((a, b) => b.href.length - a.href.length);

  return matches[0] ?? null;
}

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktopViewport, setIsDesktopViewport] = useState<boolean | null>(
    null,
  );
  const llmStatus = useLLMStatus();
  const profileSnapshot = useProfileSnapshot();
  // Read collapse state from the shared chrome context. Mobile always
  // uses the full-width drawer — `collapsed` only applies on desktop.
  const chrome = useOptionalChrome();
  const sidebarCollapsed = chrome?.sidebarCollapsed ?? false;
  const collapsed = isDesktopViewport === true && sidebarCollapsed;

  useRegisterShortcuts(
    "sidebar-toggle",
    useMemo(
      () =>
        chrome
          ? [
              {
                key: "b",
                ctrl: true,
                description: "Toggle sidebar",
                category: "general" as const,
                action: chrome.toggleSidebar,
              },
            ]
          : [],
      [chrome],
    ),
  );
  const allNavigationItems = navigationGroups
    .flatMap((group) => group.items)
    .concat(bottomNavigation);
  const activeItem = getActiveSidebarItem(pathname, allNavigationItems);
  const activeHref = activeItem?.href ?? null;
  const mobileHeaderTitle = activeItem
    ? t(activeItem.messageKey)
    : t("mainNavigation");
  const isMobileDrawerClosed = isDesktopViewport === false && !mobileOpen;
  const mobileCloseButtonRef = useRef<HTMLButtonElement | null>(null);
  const mobileOpenButtonRef = useRef<HTMLButtonElement | null>(null);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const previousMobileOpenRef = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const syncViewport = () => setIsDesktopViewport(mediaQuery.matches);

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);
    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      mobileCloseButtonRef.current?.focus();
    } else if (previousMobileOpenRef.current) {
      mobileOpenButtonRef.current?.focus();
    }
    previousMobileOpenRef.current = mobileOpen;
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const drawer = sidebarRef.current;
    if (!drawer) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = drawer.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !drawer.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !drawer.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile-only menu trigger — the AppBar handles the rest of the chrome
          on mobile, but it's hidden on small screens, so we expose a small
          floating menu button here. */}
      <button
        ref={mobileOpenButtonRef}
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-3 top-3 z-30 flex h-10 w-10 items-center justify-center rounded-md border bg-card text-foreground shadow-sm transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 lg:hidden"
        aria-label={`${t("openMenu")} — ${mobileHeaderTitle}`}
        aria-haspopup="dialog"
        aria-expanded={mobileOpen}
        aria-controls="primary-sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay scrim */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-scrim/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        ref={sidebarRef}
        id="primary-sidebar"
        aria-label={t("mainNavigation")}
        aria-hidden={isMobileDrawerClosed ? true : undefined}
        aria-modal={mobileOpen ? "true" : undefined}
        role={mobileOpen ? "dialog" : undefined}
        // React 18's HTMLAttributes types `inert` as boolean but the DOM
        // expects an attribute presence. Spread via a typed object to bypass
        // the prop-name normalization that triggers React's warning.
        {...({
          inert: isMobileDrawerClosed ? "" : undefined,
        } as Record<string, string | undefined>)}
        className={cn(
          // Mobile: fixed overlay drawer
          "fixed inset-y-0 left-0 z-50 flex w-[240px] flex-shrink-0 flex-col transition-[transform,width] duration-300 ease-in-out",
          // Desktop: relative-positioned cell inside the (app) flex layout
          "lg:relative lg:inset-auto lg:z-0 lg:translate-x-0",
          // Desktop rail mode — labels hide, icons center
          collapsed && "lg:w-[64px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
        data-collapsed={collapsed ? "true" : "false"}
        style={{
          backgroundColor: "var(--bg)",
          borderRight: "1px solid var(--rule)",
        }}
      >
        {/* Mobile-only close button row */}
        <div className="flex h-14 items-center justify-between px-3 lg:hidden">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 truncate"
            style={{
              fontFamily: "var(--display)",
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--ink)",
            }}
          >
            <Image
              src="/brand/slothing-mark.png"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 flex-shrink-0"
              priority
            />
            <span className="truncate">{t("brand")}</span>
          </Link>
          <button
            ref={mobileCloseButtonRef}
            type="button"
            onClick={() => setMobileOpen(false)}
            className="grid h-9 w-9 place-items-center text-muted-foreground hover:text-foreground"
            aria-label={t("closeMenu")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Desktop sidebar header — logo + chrome toggles. h-14 to
            match the AppBar row so the horizontal rule below the
            header aligns with the bottom of the AppBar. */}
        <div
          className={cn(
            "hidden lg:flex h-14 items-center",
            collapsed ? "justify-center px-2" : "justify-between px-3",
          )}
          style={{ borderBottom: "1px solid var(--rule)" }}
        >
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-2.5 truncate",
              collapsed ? "justify-center" : "min-w-0 flex-1",
            )}
            style={{
              fontFamily: "var(--display)",
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
            }}
            aria-label={t("brand")}
          >
            <Image
              src="/brand/slothing-mark.png"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 flex-shrink-0"
              priority
            />
            {!collapsed ? <span className="truncate">{t("brand")}</span> : null}
          </Link>

          {/* In expanded mode, toggles live to the right of the logo.
              In rail mode the row below the header carries them. */}
          {!collapsed && chrome ? (
            <div className="flex flex-shrink-0 items-center gap-1">
              {chrome.appbarHidden ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={chrome.toggleAppbar}
                      aria-label="Show top bar"
                      data-testid="sidebar-show-topbar-toggle"
                      className="grid h-8 w-8 place-items-center rounded-sm text-muted-foreground transition-colors hover:bg-card/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <PanelTopOpen className="h-4 w-4" aria-hidden />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    Show top bar (Ctrl/Cmd+Shift+B)
                  </TooltipContent>
                </Tooltip>
              ) : null}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={chrome.toggleSidebar}
                    aria-label="Collapse sidebar"
                    aria-pressed={collapsed}
                    data-testid="sidebar-collapse-toggle"
                    className="grid h-8 w-8 place-items-center rounded-sm text-muted-foreground transition-colors hover:bg-card/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <ChevronsLeft className="h-4 w-4" aria-hidden />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Collapse sidebar (Ctrl/Cmd+B)
                </TooltipContent>
              </Tooltip>
            </div>
          ) : null}
        </div>

        {/* Rail-only toggle stack — sits directly below the h-14
            header so the header itself stays aligned with the
            AppBar row. */}
        {collapsed && chrome ? (
          <div
            className="hidden lg:flex flex-col items-center gap-1 px-2 py-2"
            style={{ borderBottom: "1px solid var(--rule)" }}
          >
            {chrome.appbarHidden ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={chrome.toggleAppbar}
                    aria-label="Show top bar"
                    data-testid="sidebar-show-topbar-toggle"
                    className="grid h-8 w-8 place-items-center rounded-sm text-muted-foreground transition-colors hover:bg-card/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <PanelTopOpen className="h-4 w-4" aria-hidden />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  Show top bar (Ctrl/Cmd+Shift+B)
                </TooltipContent>
              </Tooltip>
            ) : null}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={chrome.toggleSidebar}
                  aria-label="Expand sidebar"
                  aria-pressed={collapsed}
                  data-testid="sidebar-collapse-toggle"
                  className="grid h-8 w-8 place-items-center rounded-sm text-muted-foreground transition-colors hover:bg-card/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ChevronsRight className="h-4 w-4" aria-hidden />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Expand sidebar (Ctrl/Cmd+B)
              </TooltipContent>
            </Tooltip>
          </div>
        ) : null}

        <nav
          className={cn(
            "app-sidebar-nav flex-1 overflow-y-auto py-3",
            collapsed ? "px-2" : "px-3",
          )}
        >
          {navigationGroups.map((group, groupIndex) => (
            <div key={group.label} className={groupIndex > 0 ? "mt-4" : ""}>
              {/* In expanded mode, each group gets a small caption.
                  In rail mode we substitute a thin horizontal rule so
                  the visual rhythm matches expanded mode without
                  truncating labels at 64px. The first group has no
                  divider so the rail doesn't open with an orphan line. */}
              {!collapsed ? (
                <div className="px-2 pb-1.5 pt-3">
                  <span
                    className="font-mono text-[10px] uppercase"
                    style={{
                      letterSpacing: "0.14em",
                      color: "var(--ink-3)",
                    }}
                  >
                    {t(group.messageKey)}
                  </span>
                </div>
              ) : groupIndex > 0 ? (
                <div
                  className="mx-2 my-2"
                  style={{ borderTop: "1px solid var(--rule)" }}
                  aria-hidden
                />
              ) : (
                <div className="pt-1" aria-hidden />
              )}

              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = activeHref === item.href;
                  const label = t(item.messageKey);
                  return (
                    <ConditionalTooltip
                      key={item.name}
                      when={collapsed}
                      label={label}
                    >
                      <Link
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={getSidebarNavItemClassName({
                          isActive,
                          collapsed,
                        })}
                        {...getSidebarNavItemState(isActive)}
                      >
                        <item.icon
                          className={cn(
                            "h-4 w-4 flex-shrink-0",
                            isActive ? "text-primary" : "text-current",
                          )}
                        />
                        {!collapsed ? (
                          <span className="min-w-0 truncate">{label}</span>
                        ) : (
                          <span className="sr-only">{label}</span>
                        )}
                      </Link>
                    </ConditionalTooltip>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div
          className={cn("space-y-2", collapsed ? "p-2" : "p-3")}
          style={{ borderTop: "1px solid var(--rule)" }}
        >
          <CreditBalanceBadge collapsed={collapsed} />
          <SidebarExtensionCard collapsed={collapsed} />

          {bottomNavigation.map((item) => {
            const isActive = activeHref === item.href;
            const label = t(item.messageKey);
            if (item.href === "/profile") {
              return (
                <ConditionalTooltip
                  key={item.name}
                  when={collapsed}
                  label={label}
                >
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={getSidebarNavItemClassName({
                      isActive,
                      collapsed,
                    })}
                    {...getSidebarNavItemState(isActive)}
                  >
                    <span
                      className="relative grid h-7 w-7 flex-shrink-0 place-items-center overflow-hidden text-[12px] font-semibold"
                      style={{
                        borderRadius: "var(--r-sm)",
                        backgroundColor: "var(--brand-soft)",
                        border: "1px solid var(--rule)",
                        color: "var(--brand-dark)",
                      }}
                    >
                      {/* Initials are the base layer; avatar img covers
                          them and self-hides on error (handles stale
                          seed URLs like example.com). */}
                      <span aria-hidden="true">{profileSnapshot.initials}</span>
                      {profileSnapshot.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={profileSnapshot.avatarUrl}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : null}
                    </span>
                    {!collapsed ? (
                      <>
                        <span className="min-w-0 flex-1 truncate">
                          {profileSnapshot.firstName}
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                      </>
                    ) : (
                      <span className="sr-only">{label}</span>
                    )}
                  </Link>
                </ConditionalTooltip>
              );
            }
            return (
              <Fragment key={item.name}>
                <ConditionalTooltip when={collapsed} label={label}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={getSidebarNavItemClassName({
                      isActive,
                      collapsed,
                    })}
                    {...getSidebarNavItemState(isActive)}
                  >
                    <div className="relative shrink-0">
                      <item.icon
                        className={cn(
                          "h-4 w-4",
                          isActive ? "text-primary" : "text-current",
                        )}
                      />
                      {item.href === "/settings" && (
                        <span
                          className={cn(
                            "absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2",
                            llmStatus.configured
                              ? "bg-success"
                              : "bg-muted-foreground/40",
                          )}
                          style={{ borderColor: "var(--bg)" }}
                          title={
                            llmStatus.configured
                              ? t("llmConfigured", {
                                  provider: llmStatus.provider,
                                })
                              : t("llmNotConfigured")
                          }
                        />
                      )}
                    </div>
                    {!collapsed ? (
                      <span className="min-w-0 truncate">{label}</span>
                    ) : (
                      <span className="sr-only">{label}</span>
                    )}
                  </Link>
                </ConditionalTooltip>
              </Fragment>
            );
          })}

          {/* Collapse / expand toggle migrated to the sidebar header —
              see the header block at the top of this <aside>. The
              bottom area now carries only the profile + settings nav. */}
        </div>
      </aside>
    </>
  );
}
