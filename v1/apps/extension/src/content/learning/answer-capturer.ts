// Capture user answers for learning

import type { DetectedQuestion } from "./question-detector";
import { sendMessage, Messages } from "@/shared/messages";

export class AnswerCapturer {
  private capturedAnswers: Map<
    HTMLElement,
    { question: string; answer: string }
  > = new Map();
  private observers: MutationObserver[] = [];

  /**
   * Start monitoring questions for user input
   */
  startCapturing(questions: DetectedQuestion[]): void {
    for (const q of questions) {
      this.monitorElement(q.element, q.question);
    }
  }

  /**
   * Stop monitoring and clean up
   */
  stopCapturing(): void {
    for (const observer of this.observers) {
      observer.disconnect();
    }
    this.observers = [];
    this.capturedAnswers.clear();
  }

  /**
   * Monitor an element for changes
   */
  private monitorElement(
    element: HTMLTextAreaElement | HTMLInputElement,
    question: string,
  ): void {
    // Capture on blur (when user leaves the field)
    const handleBlur = () => {
      const answer = element.value.trim();
      if (answer.length > 10) {
        this.capturedAnswers.set(element, { question, answer });
      }
    };

    element.addEventListener("blur", handleBlur);

    // Also capture on form submission
    const form = element.closest("form");
    if (form) {
      form.addEventListener("submit", () => {
        const answer = element.value.trim();
        if (answer.length > 10) {
          this.promptToSave(question, answer);
        }
      });
    }
  }

  /**
   * Prompt user to save an answer
   */
  private async promptToSave(question: string, answer: string): Promise<void> {
    // Create a subtle notification without innerHTML so the preview stays text-only.
    const notification = document.createElement("div");
    notification.id = "slothing-save-prompt";

    const content = document.createElement("div");
    content.className = "slothing-prompt-content";

    const title = document.createElement("p");
    title.textContent = "Save this answer for future applications?";

    const preview = document.createElement("p");
    preview.className = "slothing-prompt-preview";
    preview.textContent = `"${answer.slice(0, 50)}${answer.length > 50 ? "..." : ""}"`;

    const actions = document.createElement("div");
    actions.className = "slothing-prompt-actions";

    const saveBtn = document.createElement("button");
    saveBtn.className = "slothing-btn-save";
    saveBtn.type = "button";
    saveBtn.textContent = "Save";

    const dismissBtn = document.createElement("button");
    dismissBtn.className = "slothing-btn-dismiss";
    dismissBtn.type = "button";
    dismissBtn.textContent = "Not now";

    actions.appendChild(dismissBtn);
    actions.appendChild(saveBtn);
    content.appendChild(title);
    content.appendChild(preview);
    content.appendChild(actions);
    notification.appendChild(content);

    // Add styles
    const style = document.createElement("style");
    style.textContent = `
      #slothing-save-prompt {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #fffaef;
        color: #1a1530;
        border: 1px solid rgba(26, 20, 16, 0.12);
        border-radius: 10px;
        box-shadow: 0 10px 24px rgba(26, 21, 48, 0.14);
        padding: 16px;
        max-width: 320px;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif;
        font-size: 14px;
        animation: slothing-slide-in 0.3s ease;
      }
      @keyframes slothing-slide-in {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      .slothing-prompt-content p {
        margin: 0 0 8px 0;
        color: #1a1530;
      }
      .slothing-prompt-preview {
        color: #6a5e4a;
        font-size: 12px;
        font-style: italic;
        overflow-wrap: anywhere;
      }
      .slothing-prompt-actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
        margin-top: 12px;
      }
      .slothing-btn-save, .slothing-btn-dismiss {
        padding: 8px 16px;
        border: 1px solid rgba(26, 20, 16, 0.12);
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
      }
      .slothing-btn-save {
        background: #1a1530;
        border-color: #1a1530;
        color: #fffaef;
      }
      .slothing-btn-dismiss {
        background: #fffaef;
        color: #6a5e4a;
      }
      .slothing-btn-save:focus-visible, .slothing-btn-dismiss:focus-visible {
        outline: 2px solid #b8704a;
        outline-offset: 2px;
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(notification);

    saveBtn.addEventListener("click", async () => {
      try {
        await sendMessage(
          Messages.saveAnswer({
            question,
            answer,
            url: window.location.href,
            company: this.extractCompanyFromPage(),
          }),
        );
        notification.remove();
        this.showToast("Answer saved!");
      } catch (err) {
        this.showToast("Failed to save answer", true);
      }
    });

    dismissBtn.addEventListener("click", () => {
      notification.remove();
    });

    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      notification.remove();
    }, 10000);
  }

  /**
   * Extract company name from the page if possible
   */
  private extractCompanyFromPage(): string | undefined {
    // Try common selectors
    const selectors = [
      '[class*="company-name"]',
      '[class*="employer"]',
      ".company",
      "h1 + p",
    ];

    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el?.textContent && el.textContent.length < 100) {
        return el.textContent.trim();
      }
    }

    return undefined;
  }

  /**
   * Show a brief toast notification
   */
  private showToast(message: string, isError = false): void {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 20px;
      background: ${isError ? "#991b1b" : "#1a1530"};
      color: #fffaef;
      border: 1px solid rgba(255, 250, 239, 0.16);
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif;
      font-size: 14px;
      z-index: 999999;
      animation: slothing-fade-in 0.3s ease;
    `;

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  /**
   * Get all captured answers
   */
  getCapturedAnswers(): Array<{ question: string; answer: string }> {
    return Array.from(this.capturedAnswers.values());
  }
}
