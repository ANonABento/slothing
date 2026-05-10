import { assertSafeOutboundUrl, SsrfBlockedError } from "@/lib/security/ssrf";
import type { SourceError } from "./types";

const USER_AGENT =
  "Mozilla/5.0 (compatible; SlothingBot/1.0; +https://slothing.work)";

export interface FetchWithTimeoutOptions extends RequestInit {
  timeoutMs?: number;
  allowedHosts?: string[];
}

export async function fetchWithTimeout(
  url: string,
  options: FetchWithTimeoutOptions = {},
): Promise<SourceResultResponse> {
  const { timeoutMs = 5000, allowedHosts, headers, ...init } = options;
  try {
    await assertSafeOutboundUrl(url, { allowedHosts });
    const response = await fetch(url, {
      ...init,
      signal: init.signal ?? AbortSignal.timeout(timeoutMs),
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "*/*",
        ...headers,
      },
    });
    return { ok: true, response };
  } catch (error) {
    return { ok: false, error: mapFetchError(error) };
  }
}

export type SourceResultResponse =
  | { ok: true; response: Response }
  | { ok: false; error: SourceError };

export function mapFetchError(error: unknown): SourceError {
  if (error instanceof SsrfBlockedError) return "blocked";
  if (error instanceof DOMException && error.name === "TimeoutError") {
    return "timeout";
  }
  if (error instanceof DOMException && error.name === "AbortError") {
    return "timeout";
  }
  if (error instanceof Error && /abort|timeout/i.test(error.name)) {
    return "timeout";
  }
  return "unknown";
}
