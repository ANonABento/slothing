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
    // Create a subtle notification
    const notification = document.createElement("div");
    notification.id = "slothing-save-prompt";
    notification.innerHTML = `
      <div class="slothing-prompt-content">
        <p>Save this answer for future applications?</p>
        <p class="slothing-prompt-preview">"${answer.slice(0, 50)}${answer.length > 50 ? "..." : ""}"</p>
        <div class="slothing-prompt-actions">
          <button class="slothing-btn-save">Save</button>
          <button class="slothing-btn-dismiss">Not now</button>
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement("style");
    style.textContent = `
      #slothing-save-prompt {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        padding: 16px;
        max-width: 320px;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 14px;
        animation: slothing-slide-in 0.3s ease;
      }
      @keyframes slothing-slide-in {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      .slothing-prompt-content p {
        margin: 0 0 8px 0;
        color: #333;
      }
      .slothing-prompt-preview {
        color: #666;
        font-size: 12px;
        font-style: italic;
      }
      .slothing-prompt-actions {
        display: flex;
        gap: 8px;
        margin-top: 12px;
      }
      .slothing-btn-save, .slothing-btn-dismiss {
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
      }
      .slothing-btn-save {
        background: linear-gradient(135deg, #14b8a6, #0ea5e9);
        color: white;
      }
      .slothing-btn-dismiss {
        background: #f0f0f0;
        color: #666;
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(notification);

    // Handle button clicks
    const saveBtn = notification.querySelector(".slothing-btn-save");
    const dismissBtn = notification.querySelector(".slothing-btn-dismiss");

    saveBtn?.addEventListener("click", async () => {
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

    dismissBtn?.addEventListener("click", () => {
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
      background: ${isError ? "#ef4444" : "#14b8a6"};
      color: white;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
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
