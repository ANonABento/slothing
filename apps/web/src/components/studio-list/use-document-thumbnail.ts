"use client";

/**
 * First-page thumbnails for the grid view.
 *
 * The constraint that shapes this: a thumbnail is not free. `GET /pdf` compiles the
 * document when its bytes are not already cached, so naively rendering a grid of twenty
 * would fire twenty Tectonic runs at once and make the page slower than having no
 * thumbnails at all. Three things keep that from happening:
 *
 *   1. Nothing loads until the card is actually on screen (IntersectionObserver).
 *   2. At most `MAX_CONCURRENT` are in flight across the whole grid, globally — not per
 *      component, which would be no limit at all.
 *   3. Results are cached for the session, keyed by document id AND `updatedAt`, so an
 *      edit invalidates its own thumbnail and nothing else's.
 *
 * A failure here is never an error surface. A document with no thumbnail still opens.
 */
import { useEffect, useRef, useState } from "react";

import { loadPdfjs } from "@/lib/pdf/load-pdfjs";

export type ThumbnailState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; src: string }
  | { status: "unavailable" };

/** Wide enough to stay sharp on a retina card without paying for a full-size render. */
const THUMBNAIL_WIDTH = 320;
const MAX_CONCURRENT = 2;

const cache = new Map<string, string>();
let active = 0;
const queue: Array<() => void> = [];

function acquire(): Promise<void> {
  if (active < MAX_CONCURRENT) {
    active += 1;
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    queue.push(() => {
      active += 1;
      resolve();
    });
  });
}

function release(): void {
  active -= 1;
  queue.shift()?.();
}

/** Test seam — the caches are module-level, so suites need a way back to a clean slate. */
export function resetThumbnailCache(): void {
  cache.clear();
  queue.length = 0;
  active = 0;
}

async function renderThumbnail(
  documentId: string,
  signal: AbortSignal,
): Promise<string> {
  const response = await fetch(
    `/api/tex-documents/${documentId}/pdf?mode=export`,
    { signal },
  );
  if (!response.ok) {
    // 503 (no engine) and 422 (does not compile) are both ordinary here — plenty of
    // documents legitimately have no renderable bytes yet.
    throw new Error(`thumbnail unavailable: ${response.status}`);
  }
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (signal.aborted) throw new Error("aborted");

  const pdfjs = await loadPdfjs();
  const pdf = await pdfjs.getDocument({ data: bytes, verbosity: 0 }).promise;
  try {
    const page = await pdf.getPage(1);
    const base = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({
      scale: THUMBNAIL_WIDTH / Math.max(1, base.width),
    });

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(viewport.width));
    canvas.height = Math.max(1, Math.round(viewport.height));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("no 2d context");

    await page.render({ canvasContext: context, viewport }).promise;
    return canvas.toDataURL("image/png");
  } finally {
    await pdf.destroy?.();
  }
}

/**
 * @param enabled false in list view, so switching views does not start work the user
 *   cannot see.
 */
export function useDocumentThumbnail(
  documentId: string,
  updatedAt: string,
  enabled: boolean,
): { state: ThumbnailState; ref: (node: HTMLElement | null) => void } {
  const key = `${documentId}:${updatedAt}`;
  const [state, setState] = useState<ThumbnailState>(() =>
    cache.has(key)
      ? { status: "ready", src: cache.get(key)! }
      : { status: "idle" },
  );
  const [visible, setVisible] = useState(false);
  const nodeRef = useRef<HTMLElement | null>(null);

  // A callback ref rather than a `useRef` + effect: the node arrives on mount and we want
  // to start observing it in the same commit.
  const ref = (node: HTMLElement | null) => {
    nodeRef.current = node;
  };

  useEffect(() => {
    const node = nodeRef.current;
    if (!enabled || !node || typeof IntersectionObserver === "undefined") {
      // Without an observer (jsdom, older browsers) treat everything as visible rather
      // than showing placeholders forever.
      if (enabled) setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, key]);

  useEffect(() => {
    if (!enabled || !visible) return;

    const cached = cache.get(key);
    if (cached) {
      setState({ status: "ready", src: cached });
      return;
    }

    const controller = new AbortController();
    let cancelled = false;
    setState({ status: "loading" });

    void (async () => {
      await acquire();
      try {
        if (cancelled || controller.signal.aborted) return;
        const src = await renderThumbnail(documentId, controller.signal);
        cache.set(key, src);
        if (!cancelled) setState({ status: "ready", src });
      } catch {
        if (!cancelled) setState({ status: "unavailable" });
      } finally {
        release();
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [documentId, key, enabled, visible]);

  return { state, ref };
}
