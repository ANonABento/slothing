import type {
  DetectedField,
  ExtensionSettings,
  ScrapedJob,
  TrackedApplicationPayload,
} from "@/shared/types";
import { buildPageSnapshot } from "./page-snapshot";

interface SubmitWatcherOptions {
  getDetectedFields: (form: HTMLFormElement) => DetectedField[];
  getScrapedJob: () => ScrapedJob | null;
  getSettings: () => Promise<ExtensionSettings>;
  wasAutofilled: (form: HTMLFormElement) => boolean;
  onTracked: (payload: TrackedApplicationPayload) => Promise<void> | void;
}

const APPLICATION_FIELD_TYPES = new Set([
  "firstName",
  "lastName",
  "fullName",
  "email",
  "phone",
  "linkedin",
  "github",
  "website",
  "portfolio",
  "resume",
  "coverLetter",
  "workAuthorization",
  "sponsorship",
  "customQuestion",
]);

const BLOCKED_FORM_KEYWORDS = [
  "login",
  "log in",
  "signin",
  "sign in",
  "signup",
  "sign up",
  "register",
  "search",
  "subscribe",
  "newsletter",
];

export class SubmitWatcher {
  private readonly options: SubmitWatcherOptions;
  private readonly handledForms = new WeakSet<HTMLFormElement>();
  private readonly pendingForms = new WeakSet<HTMLFormElement>();
  private readonly trackedUrls = new Set<string>();
  private attached = false;

  constructor(options: SubmitWatcherOptions) {
    this.options = options;
  }

  attach(): void {
    if (this.attached) return;
    document.addEventListener("submit", this.handleSubmit, true);
    this.attached = true;
  }

  detach(): void {
    if (!this.attached) return;
    document.removeEventListener("submit", this.handleSubmit, true);
    this.attached = false;
  }

  private readonly handleSubmit = (event: SubmitEvent): void => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    void this.trackFormSubmit(form);
  };

  private async trackFormSubmit(form: HTMLFormElement): Promise<void> {
    if (
      this.handledForms.has(form) ||
      this.pendingForms.has(form) ||
      this.trackedUrls.has(window.location.href)
    ) {
      return;
    }

    this.pendingForms.add(form);

    try {
      const settings = await this.options.getSettings();
      if (!settings.autoTrackApplicationsEnabled) return;

      const detectedFields = this.options.getDetectedFields(form);
      if (
        isLikelySearchOrLoginForm(form, window.location.href) ||
        !looksLikeApplicationForm(
          detectedFields,
          form,
          this.options.wasAutofilled(form),
        )
      ) {
        return;
      }

      this.handledForms.add(form);
      this.trackedUrls.add(window.location.href);

      const snapshot = await buildPageSnapshot({
        captureScreenshot: settings.captureScreenshotEnabled,
      });

      await this.options.onTracked({
        ...snapshot,
        scrapedJob: this.options.getScrapedJob(),
      });
    } finally {
      this.pendingForms.delete(form);
    }
  }
}

export function isLikelySearchOrLoginForm(
  form: HTMLFormElement,
  url: string,
): boolean {
  const urlText = url.toLowerCase();
  if (/(\/|\b)(login|signin|signup|register|search)(\/|\?|#|\b)/.test(urlText)) {
    return true;
  }

  const text = [
    form.id,
    form.className,
    form.getAttribute("name"),
    form.getAttribute("aria-label"),
    form.getAttribute("action"),
    form.textContent,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (BLOCKED_FORM_KEYWORDS.some((keyword) => text.includes(keyword))) {
    return true;
  }

  const inputs = Array.from(form.querySelectorAll("input"));
  return inputs.some((input) => {
    const type = input.type.toLowerCase();
    const name = `${input.name} ${input.id} ${input.placeholder}`.toLowerCase();
    return type === "search" || name.includes("search");
  });
}

export function looksLikeApplicationForm(
  detectedFields: DetectedField[],
  form: HTMLFormElement,
  wasAutofilled = false,
): boolean {
  const highConfidenceApplicationFields = detectedFields.filter(
    (field) =>
      field.confidence >= 0.3 && APPLICATION_FIELD_TYPES.has(field.fieldType),
  );

  if (wasAutofilled && highConfidenceApplicationFields.length >= 2) {
    return true;
  }

  if (highConfidenceApplicationFields.length >= 3) {
    return true;
  }

  const formText = [
    form.id,
    form.className,
    form.getAttribute("action"),
    form.textContent,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    wasAutofilled &&
    highConfidenceApplicationFields.length > 0 &&
    /\b(apply|application|resume|cover letter|submit application)\b/.test(
      formText,
    )
  );
}

export function extractCompanyHint(
  scrapedJob: ScrapedJob | null,
  host: string,
): string {
  if (scrapedJob?.company) return scrapedJob.company;
  return host.replace(/^www\./, "");
}
