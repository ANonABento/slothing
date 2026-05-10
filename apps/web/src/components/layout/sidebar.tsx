"use client";

import { useEffect, useRef, useState } from "react";
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
  Rocket,
  BarChart3,
  Mail,
  Calendar,
  DollarSign,
  FileText,
  Rows3,
  ChevronsLeft,
  ClipboardList,
  ChevronRight,
  UserCircle,
  type LucideIcon,
} from "lucide-react";
import { useLLMStatus } from "@/hooks/useLLMStatus";
import { useProfileSnapshot } from "@/hooks/use-profile-snapshot";

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
    label: "Documents",
    messageKey: "groups.documents",
    items: [
      {
        name: "Documents",
        messageKey: "items.documents",
        href: "/bank",
        icon: Database,
      },
      {
        name: "Answer Bank",
        messageKey: "items.answerBank",
        href: "/answer-bank",
        icon: ClipboardList,
      },
      {
        name: "Document Studio",
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
        name: "Email Templates",
        messageKey: "items.emails",
        href: "/emails",
        icon: Mail,
      },
      {
        name: "Interview Prep",
        messageKey: "items.interview",
        href: "/interview",
        icon: MessageSquare,
      },
      {
        name: "Salary Tools",
        messageKey: "items.salary",
        href: "/salary",
        icon: DollarSign,
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
    "app-sidebar-nav-item group relative flex min-h-[42px] items-center gap-3 rounded-lg border px-2.5 py-2 text-sm font-medium transition-all duration-200",
    isActive
      ? "border-primary/20 bg-card text-foreground shadow-sm"
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
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktopViewport, setIsDesktopViewport] = useState<boolean | null>(
    null,
  );
  const llmStatus = useLLMStatus();
  const profileSnapshot = useProfileSnapshot();
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Manage focus when the mobile drawer opens/closes. On open we move focus
  // into the drawer; on close (transition true→false) we return focus to the
  // trigger so screen-reader / keyboard users land somewhere meaningful.
  useEffect(() => {
    if (mobileOpen) {
      mobileCloseButtonRef.current?.focus();
    } else if (previousMobileOpenRef.current) {
      mobileOpenButtonRef.current?.focus();
    }
    previousMobileOpenRef.current = mobileOpen;
  }, [mobileOpen]);

  // Trap Tab focus inside the drawer while it's open so keyboard users can't
  // accidentally tab into the page underneath the modal-style overlay.
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

  // Lock body scroll while the mobile drawer is open
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
      {/* Mobile app header */}
      <header
        className="fixed inset-x-0 top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/95 px-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/85 lg:hidden"
        aria-label={`${t("brand")} ${mobileHeaderTitle}`}
      >
        <button
          ref={mobileOpenButtonRef}
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border bg-card text-foreground shadow-sm transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label={t("openMenu")}
          aria-haspopup="dialog"
          aria-expanded={mobileOpen}
          aria-controls="primary-sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Rocket className="h-4 w-4" />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-bold leading-tight text-foreground">
              {t("brand")}
            </span>
            <span className="truncate text-xs font-medium text-muted-foreground">
              {mobileHeaderTitle}
            </span>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-scrim/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        id="primary-sidebar"
        aria-label={t("mainNavigation")}
        aria-hidden={isMobileDrawerClosed ? true : undefined}
        aria-modal={mobileOpen ? "true" : undefined}
        role={mobileOpen ? "dialog" : undefined}
        inert={isMobileDrawerClosed ? true : undefined}
        className={cn(
          "app-sidebar fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-background transition-all duration-300 ease-in-out grain",
          collapsed ? "w-[72px]" : "w-[264px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex h-[72px] items-center border-b bg-card/35",
            collapsed ? "justify-center px-3" : "justify-between px-4",
          )}
        >
          {collapsed ? (
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className="hidden h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-opacity hover:opacity-90 lg:flex"
              aria-label={t("expand")}
              title={t("expand")}
            >
              <Rocket className="h-5 w-5" />
            </button>
          ) : (
            <Link
              href="/dashboard"
              className="flex min-h-11 min-w-0 items-center gap-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg shadow-sm">
                <Rocket className="h-5 w-5" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-lg font-bold leading-tight gradient-text">
                  {t("brand")}
                </span>
                <span className="truncate text-2xs text-muted-foreground">
                  {t("tagline")}
                </span>
              </div>
            </Link>
          )}

          {!collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="hidden h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:flex"
              aria-label={t("collapse")}
              title={t("collapse")}
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
          )}

          {/* Mobile close button */}
          <button
            ref={mobileCloseButtonRef}
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex h-11 w-11 items-center justify-center text-muted-foreground hover:text-foreground lg:hidden"
            aria-label={t("closeMenu")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation — overflow-y-auto only when expanded; collapsed has no y-overflow and needs visible for tooltips */}
        <nav
          className={cn(
            "app-sidebar-nav flex-1 px-3 py-3",
            collapsed ? "overflow-visible" : "overflow-y-auto",
          )}
        >
          {navigationGroups.map((group, groupIndex) => (
            <div
              key={group.label}
              className={cn(
                groupIndex === 0 && collapsed && "pt-8",
                groupIndex > 0 &&
                  (collapsed ? "mt-3 pt-3 border-t border-border/50" : "mt-4"),
              )}
            >
              {/* Section label - only show when expanded */}
              {!collapsed && (
                <div className="px-3 mb-2">
                  <span className="text-[10px] font-semibold uppercase tracking-normal text-muted-foreground/70">
                    {t(group.messageKey)}
                  </span>
                </div>
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = activeHref === item.href;
                  const label = t(item.messageKey);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      title={collapsed ? label : undefined}
                      aria-label={collapsed ? label : undefined}
                      className={getSidebarNavItemClassName({
                        isActive,
                        collapsed,
                      })}
                      {...getSidebarNavItemState(isActive)}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 shrink-0",
                          isActive ? "text-primary" : "text-current",
                        )}
                      />
                      {!collapsed && (
                        <span className="min-w-0 truncate">{label}</span>
                      )}

                      {/* Tooltip for collapsed state */}
                      {collapsed && (
                        <div className="absolute left-full ml-2 hidden group-hover:flex items-center z-50">
                          <div className="bg-popover text-popover-foreground text-sm font-medium px-3 py-1.5 rounded-lg shadow-elevated border whitespace-nowrap">
                            {label}
                          </div>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom navigation */}
        <div className="border-t bg-card/40 p-3 space-y-1">
          {bottomNavigation.map((item) => {
            const isActive = activeHref === item.href;
            const label = t(item.messageKey);
            if (item.href === "/profile") {
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  title={collapsed ? label : undefined}
                  aria-label={collapsed ? label : undefined}
                  className={getSidebarNavItemClassName({
                    isActive,
                    collapsed,
                  })}
                  {...getSidebarNavItemState(isActive)}
                >
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {profileSnapshot.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profileSnapshot.avatarUrl}
                        alt={
                          profileSnapshot.name
                            ? `${profileSnapshot.name} profile photo`
                            : t("profilePhoto")
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      profileSnapshot.initials
                    )}
                  </div>
                  {!collapsed && (
                    <>
                      <span className="min-w-0 flex-1 truncate">
                        {profileSnapshot.firstName}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </>
                  )}

                  {collapsed && (
                    <div className="absolute left-full ml-2 hidden group-hover:flex items-center">
                      <div className="bg-popover text-popover-foreground text-sm font-medium px-3 py-1.5 rounded-lg shadow-elevated border whitespace-nowrap">
                        {label}
                      </div>
                    </div>
                  )}
                </Link>
              );
            }
            return (
              <Link
                key={item.name}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                title={collapsed ? label : undefined}
                aria-label={collapsed ? label : undefined}
                className={getSidebarNavItemClassName({
                  isActive,
                  collapsed,
                })}
                {...getSidebarNavItemState(isActive)}
              >
                <div className="relative shrink-0">
                  <item.icon
                    className={cn(
                      "h-5 w-5",
                      isActive ? "text-primary" : "text-current",
                    )}
                  />
                  {item.href === "/settings" && (
                    <span
                      className={cn(
                        "absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background",
                        llmStatus.configured
                          ? "bg-success"
                          : "bg-muted-foreground/40",
                      )}
                      title={
                        llmStatus.configured
                          ? t("llmConfigured", { provider: llmStatus.provider })
                          : t("llmNotConfigured")
                      }
                    />
                  )}
                </div>
                {!collapsed && (
                  <span className="min-w-0 truncate">{label}</span>
                )}

                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-2 hidden group-hover:flex items-center">
                    <div className="bg-popover text-popover-foreground text-sm font-medium px-3 py-1.5 rounded-lg shadow-elevated border whitespace-nowrap">
                      {label}
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Spacer for main content */}
      <div
        className={cn(
          "hidden lg:block shrink-0 transition-all duration-300",
          collapsed ? "w-[72px]" : "w-[264px]",
        )}
      />
    </>
  );
}
