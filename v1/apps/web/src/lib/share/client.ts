/**
 * Client-side helpers for view-only resume share links.
 *
 * The DB + API side lives in:
 *   - src/lib/db/shared-resumes.ts
 *   - src/app/api/share/route.ts
 *   - src/app/api/share/[token]/route.ts
 *   - src/app/share/[token]/page.tsx
 *
 * Orchestrators decide whether to show a toast — these helpers just speak
 * HTTP and never reach into the toast context so they stay test-friendly.
 */

export interface ShareLinkResult {
  token: string;
  url: string;
  createdAt: number;
  expiresAt: number;
}

export class ShareLinkError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ShareLinkError";
  }
}

interface ShareLinkOptions {
  signal?: AbortSignal;
  /** Override the fetch implementation (tests). */
  fetchImpl?: typeof fetch;
}

/**
 * POST {html, title} -> {token, url, expiresAt, createdAt}.
 *
 * Throws `ShareLinkError` on non-2xx. Network errors propagate as the native
 * `TypeError` from `fetch` so callers can show their own offline messaging.
 */
export async function createShareLink(
  html: string,
  title: string,
  options: ShareLinkOptions = {},
): Promise<ShareLinkResult> {
  const fetcher = options.fetchImpl ?? fetch;
  const response = await fetcher("/api/share", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html, title }),
    signal: options.signal,
  });

  if (!response.ok) {
    let message = "Could not create share link";
    try {
      const body = (await response.json()) as { error?: string };
      if (body?.error) message = body.error;
    } catch {
      // body wasn't JSON — keep the default message
    }
    throw new ShareLinkError(message, response.status);
  }

  const body = (await response.json()) as Partial<ShareLinkResult>;
  if (
    typeof body.token !== "string" ||
    typeof body.url !== "string" ||
    typeof body.expiresAt !== "number" ||
    typeof body.createdAt !== "number"
  ) {
    throw new ShareLinkError("Malformed share response", 500);
  }

  return {
    token: body.token,
    url: body.url,
    createdAt: body.createdAt,
    expiresAt: body.expiresAt,
  };
}

export async function deleteShareLink(
  token: string,
  options: ShareLinkOptions = {},
): Promise<void> {
  const fetcher = options.fetchImpl ?? fetch;
  const response = await fetcher(`/api/share/${encodeURIComponent(token)}`, {
    method: "DELETE",
    signal: options.signal,
  });

  if (!response.ok) {
    let message = "Could not delete share link";
    try {
      const body = (await response.json()) as { error?: string };
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new ShareLinkError(message, response.status);
  }
}

/**
 * Copy a share URL to the clipboard. Returns `true` on success. Falls back
 * silently when the clipboard API isn't available (Safari private mode,
 * non-secure contexts) so callers can keep showing the URL inline.
 */
export async function copyShareUrl(url: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    return false;
  }
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}
