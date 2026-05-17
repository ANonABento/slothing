import path from "path";

/**
 * Application paths - centralized to avoid hardcoded paths throughout the codebase.
 *
 * Note: the SQLite database location is NOT defined here. The active
 * resolution lives in `src/lib/db/index.ts` (`getLibsqlConfig`) and uses
 * `TURSO_DATABASE_URL` with a `file:./.local.db` fallback. The previous
 * `PATHS.DATABASE` constant pointed at the deprecated `data/get-me-job.db`
 * path and had no consumers in app code.
 */
export const PATHS = {
  /** Upload directory for user files */
  UPLOADS: path.join(process.cwd(), "uploads"),
  /** Generated resumes output directory */
  RESUMES_OUTPUT: path.join(process.cwd(), "public", "resumes"),
  /** Public directory root */
  PUBLIC: path.join(process.cwd(), "public"),
} as const;
