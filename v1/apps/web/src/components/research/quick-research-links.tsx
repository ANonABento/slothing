"use client";

import { ExternalLink } from "lucide-react";

interface QuickResearchLinksProps {
  companyName: string;
}

export function QuickResearchLinks({ companyName }: QuickResearchLinksProps) {
  const companySlug = companyName.replace(/\s+/g, "-").toLowerCase();
  const links = [
    {
      label: "Google",
      url: `https://www.google.com/search?q=${encodeURIComponent(companyName)}`,
    },
    {
      label: "LinkedIn",
      url: `https://www.linkedin.com/company/${encodeURIComponent(companySlug)}`,
    },
    {
      label: "Glassdoor",
      url: `https://www.glassdoor.com/Search/results.htm?keyword=${encodeURIComponent(companyName)}`,
    },
    {
      label: "News",
      url: `https://news.google.com/search?q=${encodeURIComponent(companyName)}`,
    },
  ];

  return (
    <div className="rounded-lg border bg-card p-3">
      <p className="mb-2 text-xs font-medium text-muted-foreground">
        Quick Research Links
      </p>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs transition-colors hover:bg-muted"
          >
            {link.label}
            <ExternalLink className="h-3 w-3" />
          </a>
        ))}
      </div>
    </div>
  );
}
