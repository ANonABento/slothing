"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { pluralize } from "@/lib/text/pluralize";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  Languages,
  ListChecks,
  ShieldAlert,
  Sparkles,
  Type,
} from "lucide-react";
import type { ContentChecks } from "@/lib/ats/scoring";

interface ContentInsightsCardProps {
  checks: ContentChecks;
}

type Severity = "ok" | "warn" | "bad";

function severityClass(severity: Severity): string {
  switch (severity) {
    case "ok":
      return "border-success/30 bg-success/5";
    case "warn":
      return "border-warning/40 bg-warning/5";
    case "bad":
      return "border-destructive/40 bg-destructive/5";
  }
}

function severityIcon(severity: Severity) {
  switch (severity) {
    case "ok":
      return <CheckCircle2 className="h-4 w-4 text-success shrink-0" />;
    case "warn":
      return <AlertTriangle className="h-4 w-4 text-warning shrink-0" />;
    case "bad":
      return <ShieldAlert className="h-4 w-4 text-destructive shrink-0" />;
  }
}

interface Row {
  icon: React.ReactNode;
  label: string;
  severity: Severity;
  summary: string;
  details: React.ReactNode;
}

function buildRows(checks: ContentChecks): Row[] {
  const rows: Row[] = [];

  // 1. Hidden text — highest priority.
  if (checks.hiddenText.hits.length > 0) {
    const promptCount = checks.hiddenText.hits.filter(
      (hit) => hit.kind === "prompt-injection",
    ).length;
    const invisibleCount = checks.hiddenText.hits.filter(
      (hit) => hit.kind !== "prompt-injection",
    ).length;
    rows.push({
      icon: <EyeOff className="h-4 w-4 text-destructive" />,
      label: "Hidden / injected text",
      severity: "bad",
      summary: [
        promptCount > 0
          ? `${promptCount} ${pluralize(promptCount, "prompt-injection pattern")}`
          : null,
        invisibleCount > 0
          ? `${invisibleCount} hidden/tiny text instance${invisibleCount === 1 ? "" : "s"}`
          : null,
      ]
        .filter(Boolean)
        .join(" • "),
      details: (
        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
          {checks.hiddenText.hits.slice(0, 4).map((hit, i) => (
            <li key={i}>
              <span className="font-mono text-foreground">{hit.label}</span> —
              &ldquo;{hit.excerpt.slice(0, 100)}
              {hit.excerpt.length > 100 ? "…" : ""}&rdquo;
            </li>
          ))}
          <li className="pt-1 italic">
            These hacks don&apos;t beat modern ATS and can trigger fraud markers
            on your candidate record. Remove them.
          </li>
        </ul>
      ),
    });
  } else {
    rows.push({
      icon: <Eye className="h-4 w-4 text-success" />,
      label: "Hidden / injected text",
      severity: "ok",
      summary: "None detected.",
      details: null,
    });
  }

  // PDF layout risks — only available for uploaded PDFs when positional
  // extraction succeeds.
  if (checks.pdfLayout && checks.pdfLayout.findings.length > 0) {
    const severity: Severity = checks.pdfLayout.findings.some(
      (finding) => finding.severity === "error",
    )
      ? "bad"
      : "warn";
    rows.push({
      icon: <Type className="h-4 w-4 text-warning" />,
      label: "PDF layout",
      severity,
      summary: `${checks.pdfLayout.findings.length} layout risk(s) across ${checks.pdfLayout.pageCount} page(s).`,
      details: (
        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
          {checks.pdfLayout.findings.slice(0, 5).map((finding, index) => (
            <li key={`${finding.type}-${finding.pageNumber}-${index}`}>
              <span className="font-mono text-foreground">
                Page {finding.pageNumber}
              </span>{" "}
              — {finding.title}: {finding.recommendation}
            </li>
          ))}
        </ul>
      ),
    });
  }

  // 2. Weak / passive language
  {
    const { weakBulletCount, bulletCount, weakRatio } = checks.weakLanguage;
    if (weakBulletCount > 0) {
      const sev: Severity = weakRatio >= 0.3 ? "warn" : "ok";
      rows.push({
        icon: <Languages className="h-4 w-4 text-warning" />,
        label: "Weak / passive language",
        severity: sev,
        summary: `${weakBulletCount} of ${bulletCount} bullet(s) (${Math.round(weakRatio * 100)}%) use weak phrasing.`,
        details:
          checks.weakLanguage.hits.length > 0 ? (
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              {Array.from(
                new Map(
                  checks.weakLanguage.hits.map((hit) => [hit.bullet, hit]),
                ).values(),
              )
                .slice(0, 3)
                .map((hit, i) => (
                  <li key={i}>
                    <span className="font-mono text-foreground">
                      {hit.phrase}
                    </span>{" "}
                    — &ldquo;{hit.bullet.slice(0, 90)}
                    {hit.bullet.length > 90 ? "…" : ""}&rdquo;
                  </li>
                ))}
            </ul>
          ) : null,
      });
    } else {
      rows.push({
        icon: <Languages className="h-4 w-4 text-success" />,
        label: "Weak / passive language",
        severity: "ok",
        summary: "Clean.",
        details: null,
      });
    }
  }

  // 3. Buzzwords
  if (checks.buzzwords.uniquePhrases.length > 0) {
    const sev: Severity =
      checks.buzzwords.uniquePhrases.length >= 2 ? "warn" : "ok";
    rows.push({
      icon: <Sparkles className="h-4 w-4 text-warning" />,
      label: "Buzzwords / clichés",
      severity: sev,
      summary: `Found ${checks.buzzwords.uniquePhrases.length} unique buzzword phrase(s).`,
      details: (
        <p className="mt-2 text-xs text-muted-foreground">
          {checks.buzzwords.uniquePhrases.slice(0, 8).join(" · ")}
        </p>
      ),
    });
  } else {
    rows.push({
      icon: <Sparkles className="h-4 w-4 text-success" />,
      label: "Buzzwords / clichés",
      severity: "ok",
      summary: "None detected.",
      details: null,
    });
  }

  // 4. Action-verb strength
  {
    const { strongCount, weakCount, standardCount, distinctStrongVerbs } =
      checks.actionVerbStrength;
    const total = strongCount + weakCount + standardCount;
    if (total === 0) {
      rows.push({
        icon: <ListChecks className="h-4 w-4 text-muted-foreground" />,
        label: "Action verb strength",
        severity: "warn",
        summary: "No action-verb openers detected on bullets.",
        details: (
          <p className="mt-2 text-xs text-muted-foreground">
            Start each bullet with a verb (Led, Shipped, Drove, Cut,
            Architected).
          </p>
        ),
      });
    } else {
      const weakRatio = weakCount / total;
      const sev: Severity = weakRatio > 0.3 ? "warn" : "ok";
      rows.push({
        icon: <ListChecks className="h-4 w-4" />,
        label: "Action verb strength",
        severity: sev,
        summary: `${strongCount} strong / ${standardCount} standard / ${weakCount} weak openers.`,
        details: distinctStrongVerbs.length ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Strong verbs used:{" "}
            <span className="font-mono">
              {distinctStrongVerbs.slice(0, 10).join(", ")}
            </span>
          </p>
        ) : null,
      });
    }
  }

  // 5. Acronym pairs
  if (checks.acronymPairs.gaps.length > 0) {
    rows.push({
      icon: <Type className="h-4 w-4 text-warning" />,
      label: "Acronym / expansion pairs",
      severity: "warn",
      summary: `${checks.acronymPairs.gaps.length} acronym/expansion gap(s).`,
      details: (
        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
          {checks.acronymPairs.gaps.slice(0, 5).map((gap) => (
            <li key={`${gap.acronym}-${gap.kind}`}>
              {gap.kind === "expansion-missing" ? (
                <>
                  <span className="font-mono text-foreground">
                    {gap.acronym}
                  </span>{" "}
                  appears without &ldquo;{gap.expansion}&rdquo;
                </>
              ) : (
                <>
                  <span className="font-mono text-foreground">
                    {gap.expansion}
                  </span>{" "}
                  appears without &ldquo;{gap.acronym}&rdquo;
                </>
              )}
            </li>
          ))}
          <li className="pt-1 italic">
            Different parsers index acronyms differently — include both forms on
            first use.
          </li>
        </ul>
      ),
    });
  }

  // 6. First-person pronouns
  if (checks.firstPerson.hitCount > 0) {
    rows.push({
      icon: <Type className="h-4 w-4 text-warning" />,
      label: "First-person pronouns",
      severity: "warn",
      summary: `${checks.firstPerson.hitCount} bullet(s) contain I / my / me.`,
      details: (
        <p className="mt-2 text-xs text-muted-foreground">
          Resume bullets conventionally drop pronouns. Rewrite implicit
          first-person: &ldquo;Led team of 5&rdquo; not &ldquo;I led a team of
          5&rdquo;.
        </p>
      ),
    });
  }

  // 7. Date format consistency
  if (checks.dateFormat.inconsistent) {
    rows.push({
      icon: <Type className="h-4 w-4 text-warning" />,
      label: "Date format consistency",
      severity: "warn",
      summary: `Mixed: ${checks.dateFormat.distinctFormats.join(", ")}.`,
      details: (
        <p className="mt-2 text-xs text-muted-foreground">
          Older ATS parsers (Taleo notably) can misread chronologies. Pick one
          format and apply it consistently.
        </p>
      ),
    });
  }

  return rows;
}

export function ContentInsightsCard({ checks }: ContentInsightsCardProps) {
  const rows = buildRows(checks);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  return (
    <section
      className="rounded-lg border border-border bg-card p-4"
      aria-labelledby="content-insights-heading"
    >
      <h3 id="content-insights-heading" className="mb-3 text-sm font-semibold">
        Content checks
      </h3>
      <p className="mb-3 text-xs text-muted-foreground">
        Beyond the score: things real recruiters and ATS parsers care about that
        don&apos;t always show up in keyword matching.
      </p>
      <ul className="space-y-2">
        {rows.map((row, index) => {
          const isOpen = expanded[index] ?? false;
          const hasDetails = row.details !== null;
          return (
            <li
              key={`${row.label}-${index}`}
              className={cn(
                "rounded-md border px-3 py-2",
                severityClass(row.severity),
              )}
            >
              <button
                type="button"
                onClick={() =>
                  hasDetails &&
                  setExpanded((prev) => ({ ...prev, [index]: !isOpen }))
                }
                disabled={!hasDetails}
                aria-expanded={hasDetails ? isOpen : undefined}
                className={cn(
                  "flex w-full items-center gap-3 text-left",
                  hasDetails && "cursor-pointer",
                )}
              >
                <div className="shrink-0">{severityIcon(row.severity)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{row.label}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {row.summary}
                  </div>
                </div>
                {hasDetails ? (
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                ) : null}
              </button>
              {hasDetails && isOpen ? <div>{row.details}</div> : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
