import { sendMessage, Messages } from "@/shared/messages";
import type { PageSnapshot } from "@/shared/types";

interface SnapshotOptions {
  captureScreenshot: boolean;
}

const MAX_HEADLINE_LENGTH = 200;

export async function buildPageSnapshot({
  captureScreenshot,
}: SnapshotOptions): Promise<PageSnapshot> {
  const title = document.title.trim();
  const headline = normalizeText(
    document.querySelector("h1")?.textContent || title,
  );

  return {
    url: window.location.href,
    host: window.location.hostname,
    title,
    headline: headline ? truncate(headline, MAX_HEADLINE_LENGTH) : undefined,
    submittedAt: new Date().toISOString(),
    thumbnailDataUrl: captureScreenshot
      ? await captureVisibleTabSafely()
      : undefined,
  };
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return value.slice(0, maxLength - 1).trimEnd();
}

async function captureVisibleTabSafely(): Promise<string | undefined> {
  try {
    const response = await sendMessage<{ dataUrl?: string }>(
      Messages.captureVisibleTab(),
    );
    return response.success ? response.data?.dataUrl : undefined;
  } catch {
    return undefined;
  }
}
