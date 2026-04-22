import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const appDir = path.resolve(process.cwd(), "src/app/(app)");

function findPageDirectories(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const directories = entries
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => findPageDirectories(path.join(dir, entry.name)));

  if (entries.some((entry) => entry.isFile() && entry.name === "page.tsx")) {
    directories.unshift(dir);
  }

  return directories;
}

describe("app route error boundaries", () => {
  it("adds an error.tsx file next to every app route page", () => {
    const pageDirectories = findPageDirectories(appDir);
    const missingErrors = pageDirectories
      .filter((directory) => !existsSync(path.join(directory, "error.tsx")))
      .map((directory) => path.relative(appDir, directory));

    expect(missingErrors).toEqual([]);
  });
});

