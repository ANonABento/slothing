import type { Metadata } from "next";
import {
  getShareByToken,
  incrementViewCount,
  type SharedResume,
} from "@/lib/db/shared-resumes";
import { formatDateAbsolute } from "@/lib/format/time";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { token: string };
}

export function generateMetadata({ params }: PageProps): Metadata {
  // Never leak titles to crawlers (the snapshot belongs to whoever has the
  // link, not the open web).
  return {
    title: "Shared resume — Slothing",
    description: "A view-only resume shared via Slothing.",
    robots: { index: false, follow: false },
    other: { token: params.token },
  };
}

function ExpiredState() {
  return (
    <div className="min-h-screen bg-page text-ink flex flex-col">
      <header className="border-b border-rule">
        <div className="mx-auto max-w-4xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
              Slothing
            </span>
            <span aria-hidden="true" className="text-ink-3">
              ·
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
              Shared resume
            </span>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-6 py-24">
          <section className="bg-paper border border-rule shadow-paper-card rounded-md px-8 py-12 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
              Link unavailable
            </p>
            <h1 className="mt-4 font-display tracking-tight text-2xl text-ink">
              This share link has expired
            </h1>
            <p className="mt-3 text-ink-2 text-sm">
              View-only share links expire after 7 days. Ask the sender for a
              fresh link, or sign in to Slothing to create your own.
            </p>
            <div className="mt-8">
              <a
                href="/"
                className="inline-flex items-center gap-2 rounded-md border border-rule-strong bg-paper px-4 py-2 text-sm font-medium text-ink hover:bg-page-2 transition-colors"
              >
                Visit Slothing
              </a>
            </div>
          </section>
        </div>
      </main>
      <SharedFooter />
    </div>
  );
}

function SharedFooter() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto max-w-4xl px-6 py-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-ink-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em]">
          Shared from Slothing
        </p>
        <a href="/" className="text-ink-2 hover:text-ink transition-colors">
          slothing.work
        </a>
      </div>
    </footer>
  );
}

function SharedContent({ share }: { share: SharedResume }) {
  const createdLabel = formatDateAbsolute(share.createdAt);
  const expiresLabel = formatDateAbsolute(share.expiresAt);

  return (
    <div className="min-h-screen bg-page text-ink flex flex-col">
      <header className="border-b border-rule">
        <div className="mx-auto max-w-4xl px-6 py-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
              Slothing
            </span>
            <span aria-hidden="true" className="text-ink-3">
              ·
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
              Shared resume
            </span>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
            Expires {expiresLabel}
          </p>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <div className="mb-6">
            <h1 className="font-display tracking-tight text-2xl text-ink">
              {share.documentTitle}
            </h1>
            <p className="mt-1 text-xs text-ink-3">
              View-only snapshot · Shared {createdLabel}
            </p>
          </div>
          <article
            className="shared-resume-snapshot bg-paper border border-rule shadow-paper-card rounded-md p-8"
            data-testid="shared-resume-snapshot"
            dangerouslySetInnerHTML={{ __html: share.documentHtml }}
          />
        </div>
      </main>
      <SharedFooter />
    </div>
  );
}

export default function SharedResumePage({ params }: PageProps) {
  const share = getShareByToken(params.token);

  if (!share) {
    return <ExpiredState />;
  }

  // Best-effort view counter — render even if the increment fails.
  try {
    incrementViewCount(params.token);
  } catch (error) {
    console.warn("[share] view count update failed", error);
  }

  return <SharedContent share={share} />;
}
