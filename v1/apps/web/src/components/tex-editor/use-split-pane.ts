"use client";

/**
 * A pointer-events splitter. The repo has no resizable-pane library and this needs ~50
 * lines, so no dependency is added.
 *
 * The ratio persists to localStorage under the canonical `taida:` prefix. It is read in an
 * effect rather than during render, so the server and first client render agree.
 */
import { useCallback, useEffect, useRef, useState } from "react";

export const SPLIT_STORAGE_KEY = "taida:tex:split";
export const MIN_RATIO = 0.35;
export const MAX_RATIO = 0.8;

export function clampRatio(ratio: number): number {
  if (!Number.isFinite(ratio)) return 0.62;
  return Math.min(MAX_RATIO, Math.max(MIN_RATIO, ratio));
}

export function readStoredRatio(
  storage: Pick<Storage, "getItem"> | null,
  fallback: number,
): number {
  if (!storage) return fallback;
  try {
    const raw = storage.getItem(SPLIT_STORAGE_KEY);
    return raw === null ? fallback : clampRatio(Number(raw));
  } catch {
    return fallback;
  }
}

export function useSplitPane(
  ratio: number,
  onRatioChange: (next: number) => void,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);

  // Hydrate from storage after mount so SSR and the first client render match.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = readStoredRatio(safeStorage(), ratio);
    if (stored !== ratio) onRatioChange(stored);
    // Intentionally once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = useCallback((next: number) => {
    try {
      safeStorage()?.setItem(SPLIT_STORAGE_KEY, String(next));
    } catch {
      // Storage unavailable — the pane still resizes, it just will not be remembered.
    }
  }, []);

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
    },
    [],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging) return;
      const container = containerRef.current;
      if (!container) return;
      const bounds = container.getBoundingClientRect();
      if (bounds.width === 0) return;
      onRatioChange(clampRatio((event.clientX - bounds.left) / bounds.width));
    },
    [dragging, onRatioChange],
  );

  const onPointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.currentTarget.releasePointerCapture(event.pointerId);
      setDragging(false);
      persist(ratio);
    },
    [persist, ratio],
  );

  return {
    containerRef,
    dragging,
    handleProps: { onPointerDown, onPointerMove, onPointerUp },
  };
}

function safeStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
