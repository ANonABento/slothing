// P3 — Submit orchestrator (autonomy level L3).
//
// Consumes an APPROVED drafted application, fills the page's form via the
// matching ATS adapter, and (unless dry-run) clicks submit. Enforces the
// per-application approval gate locally — it refuses to act on a draft that the
// user has not approved — mirroring the server-side gate on the submit-result
// route. Unsupported ATS hosts return `needsHuman` instead of guessing.

import { pickSubmitAdapter } from "./submit-registry";
import { fillAnswersInScope, type AnswerFill } from "./field-match";
import type { SubmitResult } from "./submit-adapter";

interface DraftQuestion {
  id: string;
  label: string;
}

interface DraftAnswerLike {
  questionId: string;
  value: string;
}

export interface ApprovedDraft {
  id: string;
  status: string;
  questions: DraftQuestion[];
  answers: DraftAnswerLike[];
}

export interface SubmitOptions {
  /** Fill the form but never click submit. */
  dryRun?: boolean;
}

/** Join answers to their question labels for field matching. */
export function buildAnswerFills(draft: ApprovedDraft): AnswerFill[] {
  const labelById = new Map(draft.questions.map((q) => [q.id, q.label]));
  return draft.answers.map((a) => ({
    questionId: a.questionId,
    label: labelById.get(a.questionId) ?? a.questionId,
    value: a.value,
  }));
}

/** Best-effort confirmation reference from a post-submit page. */
function extractAtsRef(doc: Document): string | undefined {
  const confirmation = doc.querySelector(
    "[data-confirmation], .application-confirmation, #application_confirmation",
  );
  const text = confirmation?.textContent?.trim();
  return text && text.length > 0 ? text.slice(0, 200) : undefined;
}

export class SubmitOrchestrator {
  constructor(
    private readonly doc: Document = document,
    private readonly host: string = typeof location !== "undefined"
      ? location.hostname
      : "",
  ) {}

  async submit(
    draft: ApprovedDraft,
    options: SubmitOptions = {},
  ): Promise<SubmitResult> {
    // Approval gate: never submit anything the user hasn't approved.
    if (draft.status !== "approved") {
      return {
        ok: false,
        filled: 0,
        error: `Draft status is "${draft.status}" — only approved drafts may be submitted.`,
      };
    }

    const adapter = pickSubmitAdapter(this.host);
    if (!adapter) {
      return {
        ok: false,
        needsHuman: true,
        filled: 0,
        error: `No submit adapter for ${this.host} — a human must finish this application.`,
      };
    }

    const scope = adapter.getFormScope(this.doc) ?? this.doc;
    const fills = buildAnswerFills(draft);
    const filled = fillAnswersInScope(scope, fills);

    if (options.dryRun) {
      return { ok: false, dryRun: true, filled };
    }

    const submitButton = adapter.getSubmitButton(this.doc);
    if (!submitButton) {
      return {
        ok: false,
        filled,
        error: "Could not locate the submit button on this page.",
      };
    }

    submitButton.click();
    return { ok: true, filled, atsRef: extractAtsRef(this.doc) };
  }
}
