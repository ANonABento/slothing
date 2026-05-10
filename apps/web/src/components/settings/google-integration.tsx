"use client";

import dynamic from "next/dynamic";
import {
  Calendar,
  Cloud,
  FileText,
  FolderOpen,
  Mail,
  Table,
  Users,
  type LucideIcon,
} from "lucide-react";
import { PageSection } from "@/components/ui/page-layout";
import { SkeletonButton } from "@/components/ui/skeleton";
import { GOOGLE_FEATURES } from "@/lib/google/types";

const GoogleConnectButton = dynamic(
  () =>
    import("@/components/google").then((module) => module.GoogleConnectButton),
  { loading: () => <SkeletonButton className="w-48" />, ssr: false },
);

const iconMap: Record<string, LucideIcon> = {
  Calendar,
  FolderOpen,
  Mail,
  FileText,
  Table,
  Users,
};

export function GoogleIntegration() {
  return (
    <PageSection
      title="Google Integration"
      description="Connect your Google account to sync calendars, store documents, and more."
      icon={Cloud}
      iconClassName="gradient-bg text-primary-foreground"
    >
      <div className="space-y-4">
        <GoogleConnectButton />

        <div className="pt-2 border-t">
          <h3 className="text-sm font-medium mb-3">Connected features:</h3>
          <div className="grid gap-2 sm:grid-cols-3">
            {GOOGLE_FEATURES.map((feature) => {
              const Icon = iconMap[feature.iconName];
              return (
                <div
                  key={feature.id}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Icon className={`h-4 w-4 ${feature.iconClassName}`} />
                  <span>{feature.label}</span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Connect your Google account to enable these features. Your data
            stays private and secure.
          </p>
        </div>
      </div>
    </PageSection>
  );
}
