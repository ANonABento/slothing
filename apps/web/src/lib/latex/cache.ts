/**
 * Content-addressed PDF cache — docs/specs/latex-single-source-rebuild.md §4.
 *
 * Compiled artifacts are derived data: losing the cache costs a recompile and nothing
 * else. Deliberately UNLIKE the retired /api/opportunities/[id]/generate, which wrote
 * guessable filenames into `public/` and called the result a PDF:
 *
 *   - not in a public directory — bytes are served only through an authed, user-scoped
 *     route, so a cache path is never itself an access grant;
 *   - content-addressed, so a stale entry is impossible by construction;
 *   - evictable and fully regenerable.
 */
import { createHash } from "crypto";
import { mkdir, readFile, rename, stat, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

import type { CompileMode } from "./compile";
import { STY_VERSION } from "./slothing-sty";

/** Overridable so deployments can point at a writable volume. */
function cacheDir(): string {
  return (
    process.env.SLOTHING_PDF_CACHE_DIR ??
    join(process.cwd(), ".cache", "latex-pdf")
  );
}

/**
 * The cache key. Includes the style version because a macro change alters the render
 * without altering the source — omitting it would serve visually stale PDFs after a
 * slothing.sty edit.
 */
export function cacheKey(source: string, mode: CompileMode): string {
  return createHash("sha256")
    .update(`${STY_VERSION} ${mode} ${source}`)
    .digest("hex");
}

function entryPath(key: string, extension: string): string {
  return join(cacheDir(), `${key}.${extension}`);
}

export async function readCachedPdf(key: string): Promise<Uint8Array | null> {
  const path = entryPath(key, "pdf");
  if (!existsSync(path)) return null;
  try {
    const info = await stat(path);
    if (!info.isFile() || info.size === 0) return null;
    return new Uint8Array(await readFile(path));
  } catch {
    // A half-written or unreadable entry is a cache miss, never an error.
    return null;
  }
}

export async function writeCachedPdf(
  key: string,
  pdf: Uint8Array,
): Promise<void> {
  try {
    await mkdir(cacheDir(), { recursive: true });
    // Write to a temp name then rename, so a concurrent reader never sees a partial file.
    const temp = entryPath(`${key}.tmp-${process.pid}`, "pdf");
    await writeFile(temp, pdf);
    await rename(temp, entryPath(key, "pdf"));
  } catch {
    // The cache is an optimisation. A failure to persist must never fail the request.
  }
}

export async function readCachedJson<T>(key: string): Promise<T | null> {
  const path = entryPath(key, "json");
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(await readFile(path, "utf8")) as T;
  } catch {
    return null;
  }
}

export async function writeCachedJson(
  key: string,
  value: unknown,
): Promise<void> {
  try {
    await mkdir(cacheDir(), { recursive: true });
    await writeFile(entryPath(key, "json"), JSON.stringify(value), "utf8");
  } catch {
    // Same rule: never fail a request because the cache could not be written.
  }
}
