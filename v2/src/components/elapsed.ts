"use client";

import { useEffect, useState } from "react";

/** Seconds since `active` turned on, so a long AI call shows it's still going ("Tailoring… 23 s"). */
export function useElapsed(active: boolean): number {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    setSeconds(0);
    if (!active) return;
    const started = Date.now();
    const id = setInterval(() => setSeconds(Math.floor((Date.now() - started) / 1000)), 1000);
    return () => clearInterval(id);
  }, [active]);
  return seconds;
}

/** "Writing…", then "Writing… 4 s" once it's taking a moment. */
export const working = (label: string, seconds: number) => (seconds >= 2 ? `${label}… ${seconds} s` : `${label}…`);
