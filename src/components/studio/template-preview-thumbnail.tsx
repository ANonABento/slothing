"use client";

import type { CSSProperties } from "react";
import type { ResumeTemplate, TemplateStyles } from "@/lib/resume/template-data";
import { cn } from "@/lib/utils";

interface TemplatePreviewThumbnailProps {
  template: ResumeTemplate;
  className?: string;
}

interface TemplateThumbnailTraits {
  accentColor: string;
  fontFamily: string;
  headerAlignmentClass: string;
  sectionRuleClass: string;
  bulletLabel: string;
  isTwoColumn: boolean;
}

export function getTemplateThumbnailTraits(
  styles: TemplateStyles
): TemplateThumbnailTraits {
  return {
    accentColor: styles.accentColor,
    fontFamily: styles.fontFamily,
    headerAlignmentClass:
      styles.headerStyle === "centered" ? "items-center text-center" : "items-start",
    sectionRuleClass:
      styles.sectionDivider === "line"
        ? "border-b"
        : styles.sectionDivider === "space"
        ? "pb-1.5"
        : "",
    bulletLabel:
      styles.bulletStyle === "dash"
        ? "-"
        : styles.bulletStyle === "arrow"
        ? ">"
        : styles.bulletStyle === "none"
        ? ""
        : "•",
    isTwoColumn: styles.layout === "two-column",
  };
}

export function TemplatePreviewThumbnail({
  template,
  className,
}: TemplatePreviewThumbnailProps) {
  const traits = getTemplateThumbnailTraits(template.styles);
  const style = {
    "--template-accent": traits.accentColor,
    fontFamily: traits.fontFamily,
  } as CSSProperties;

  return (
    <div
      aria-hidden="true"
      data-testid={`template-thumbnail-${template.id}`}
      className={cn(
        "h-28 w-full overflow-hidden rounded border bg-white text-slate-950 shadow-sm",
        className
      )}
      style={style}
    >
      <div className="h-1 bg-[var(--template-accent)]" />
      <div className="space-y-1.5 p-2">
        <div className={cn("flex flex-col gap-0.5", traits.headerAlignmentClass)}>
          <div className="h-1.5 w-14 rounded-full bg-slate-900" />
          <div className="h-1 w-20 rounded-full bg-slate-300" />
        </div>

        <div className={cn("pt-1", traits.isTwoColumn && "grid grid-cols-[1fr_1.6fr] gap-1.5")}>
          {traits.isTwoColumn && (
            <div
              className="space-y-1 rounded-sm p-1"
              style={{ backgroundColor: `${traits.accentColor}14` }}
            >
              <PreviewSection traits={traits} short />
              <PreviewLine className="w-8" />
              <PreviewLine className="w-6" />
            </div>
          )}

          <div className="space-y-1.5">
            <PreviewSection traits={traits} />
            <PreviewBullet traits={traits} widthClass="w-16" />
            <PreviewBullet traits={traits} widthClass="w-14" />
            <PreviewSection traits={traits} short />
            <PreviewLine className="w-20" />
            <PreviewLine className="w-12" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewSection({
  traits,
  short = false,
}: {
  traits: TemplateThumbnailTraits;
  short?: boolean;
}) {
  return (
    <div
      className={cn(
        "h-2 border-[var(--template-accent)] text-[0px]",
        traits.sectionRuleClass,
        short ? "w-10" : "w-16"
      )}
    >
      <div className="h-1 w-full rounded-full bg-[var(--template-accent)]" />
    </div>
  );
}

function PreviewBullet({
  traits,
  widthClass,
}: {
  traits: TemplateThumbnailTraits;
  widthClass: string;
}) {
  return (
    <div className="flex items-center gap-1">
      {traits.bulletLabel && (
        <span className="w-1.5 text-[8px] leading-none text-[var(--template-accent)]">
          {traits.bulletLabel}
        </span>
      )}
      <PreviewLine className={widthClass} />
    </div>
  );
}

function PreviewLine({ className }: { className: string }) {
  return <div className={cn("h-1 rounded-full bg-slate-300", className)} />;
}
