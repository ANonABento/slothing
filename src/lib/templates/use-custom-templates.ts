"use client";

import { useCallback, useEffect, useState } from "react";
import type { ResumeTemplate } from "@/lib/resume/template-types";

interface TemplateApiItem {
  id: string;
  name: string;
  description?: string;
  type: "built-in" | "custom";
  analyzedStyles?: {
    styles: ResumeTemplate["styles"];
  };
}

interface TemplatesApiResponse {
  templates?: TemplateApiItem[];
}

let cachedCustomTemplates: ResumeTemplate[] | null = null;
let inflightRequest: Promise<ResumeTemplate[]> | null = null;

async function fetchCustomTemplates(): Promise<ResumeTemplate[]> {
  const response = await fetch("/api/templates");
  if (!response.ok) throw new Error("Failed to load custom templates");
  const data = (await response.json()) as TemplatesApiResponse;
  return (data.templates ?? [])
    .filter((template) => template.type === "custom" && template.analyzedStyles)
    .map((template) => ({
      id: template.id,
      name: template.name,
      description: template.description ?? "Imported template",
      styles: template.analyzedStyles!.styles,
    }));
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
