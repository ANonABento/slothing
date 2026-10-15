import { notFound } from "next/navigation";

import { PageBody, PageHeader } from "@/components/page-header";
import { Card, CardTitle, Eyebrow } from "@/components/ui";
import { plannedPage } from "@/lib/roadmap";

/** Placeholder for a page on the roadmap: what it would do and when it gets built. */
export default async function PlannedPage({ params }: { params: Promise<{ slug: string }> }) {
  const page = plannedPage((await params).slug);
  if (!page) notFound();
  return (
    <>
      <PageHeader icon={page.icon} title={page.label} description={page.summary} />
      <PageBody>
        <Card className="max-w-2xl space-y-5 p-6">
          <div>
            <Eyebrow className="mb-1">Planned · {page.when}</Eyebrow>
            <CardTitle>Not built yet</CardTitle>
            <p className="mt-1 text-sm text-ink-2">This page is a placeholder so you can see where Slothing is headed.</p>
          </div>
          <div>
            <Eyebrow className="mb-1">Builds when</Eyebrow>
            <p className="text-sm">{page.gate}</p>
          </div>
          <div>
            <Eyebrow className="mb-1">In v1</Eyebrow>
            <p className="text-sm text-ink-2">{page.v1}</p>
          </div>
          <p className="border-t border-rule pt-4 text-xs text-ink-3">The full plan is in v2/ROADMAP.md.</p>
        </Card>
      </PageBody>
    </>
  );
}
