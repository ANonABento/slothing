"use client";

import { useCallback, useEffect, useState } from "react";
import type { ResumeTemplate } from "@/lib/resume/template-types";
import {
  FONT_STACKS,
  type ResumeTemplate as CollapsedResumeTemplate,
} from "@slothing/shared/resume-template";

interface TemplateApiItem {
  id: string;
  name: string;
  description?: string;
  customDescription?: string | null;
  type: "built-in" | "custom";
  sourceFilename?: string | null;
  sourceType?: string | null;
  template?: CollapsedResumeTemplate;
  updatedAt?: string;
}

interface TemplatesApiResponse {
  templates?: TemplateApiItem[];
}

let cachedCustomTemplates: ResumeTemplate[] | null = null;
let inflightRequest: Promise<ResumeTemplate[]> | null = null;

export function clearCustomTemplateCache() {
  cachedCustomTemplates = null;
  inflightRequest = null;
}

async function fetchCustomTemplates(): Promise<ResumeTemplate[]> {
  const response = await fetch("/api/templates");
  if (!response.ok) throw new Error("Failed to load custom templates");
  const data = (await response.json()) as TemplatesApiResponse;
  return (data.templates ?? [])
    .filter(
      (item): item is TemplateApiItem & { template: CollapsedResumeTemplate } =>
        Boolean(item.type === "custom" && item.template),
    )
    .map(collapsedTemplateToResumeTemplate);
}

/** Adapt the collapsed (grammar+tokens) template to the legacy picker/preview shape. */
function collapsedTemplateToResumeTemplate(
  item: TemplateApiItem & { template: CollapsedResumeTemplate },
): ResumeTemplate {
  const { grammar, tokens } = item.template;
  const base = tokens.baseFontSizePt;
  return {
    id: item.id,
    name: item.name,
    description: item.description ?? "Imported template",
    styles: {
      fontFamily: FONT_STACKS[tokens.fontClass],
      fontSize: `${base}pt`,
      headerSize: `${Math.round(base * 1.9)}pt`,
      sectionHeaderSize: `${Math.round(base * 1.1)}pt`,
      lineHeight: String(tokens.lineHeight),
      accentColor: tokens.accent,
      layout: grammar.columns === "single" ? "single-column" : "two-column",
      headerStyle: grammar.header === "centered" ? "centered" : "left",
      bulletStyle: grammar.bullets,
      sectionDivider: grammar.sectionTitle === "small-caps" ? "space" : "line",
    },
  };
}

export function useCustomTemplates() {
  const [customTemplates, setCustomTemplates] = useState<ResumeTemplate[]>(
    () => cachedCustomTemplates ?? [],
  );
  const [isLoading, setIsLoading] = useState(cachedCustomTemplates === null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      inflightRequest ??= fetchCustomTemplates().finally(() => {
        inflightRequest = null;
      });
      const templates = await inflightRequest;
      cachedCustomTemplates = templates;
      setCustomTemplates(templates);
      return templates;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (cachedCustomTemplates !== null) return;
    void refresh().catch(() => {
      cachedCustomTemplates = [];
      setCustomTemplates([]);
    });
  }, [refresh]);

  return { customTemplates, refresh, isLoading };
}
