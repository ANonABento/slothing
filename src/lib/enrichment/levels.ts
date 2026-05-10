import { JSDOM } from "jsdom";
import { fetchWithTimeout } from "./fetch-with-timeout";
import type { LevelsData, LevelsRoleComp, SourceResult } from "./types";
import { slugifyCompany } from "./utils";

export async function fetchLevels(
  company: string,
): Promise<SourceResult<LevelsData>> {
  const url = `https://www.levels.fyi/companies/${slugifyCompany(company)}/salaries`;
  const result = await fetchWithTimeout(url, {
    allowedHosts: ["www.levels.fyi", "levels.fyi"],
  });
  if (!result.ok) return result;
  if (result.response.status === 404) return { ok: false, error: "not_found" };
  if (result.response.status === 403) return { ok: false, error: "blocked" };
  if (!result.response.ok) return { ok: false, error: "unknown" };
  try {
    const parsed = parseLevelsHtml(await result.response.text(), url);
    if (!parsed.medianTotalComp && parsed.roles.length === 0) {
      return { ok: false, error: "parse_error" };
    }
    return { ok: true, data: parsed };
  } catch {
    return { ok: false, error: "parse_error" };
  }
}

export function parseLevelsHtml(html: string, url: string): LevelsData {
  const document = new JSDOM(html).window.document;
  const text = document.body.textContent ?? "";
  const medianTotalComp =
    document.querySelector("[data-testid*='median' i]")?.textContent?.trim() ??
    text.match(/median[^$]*(\$[\d,.]+[Kk]?)/i)?.[1];
  const roles: LevelsRoleComp[] = Array.from(document.querySelectorAll("tr"))
    .map((row): LevelsRoleComp | null => {
      const cells = Array.from(row.querySelectorAll("th,td"))
        .map((cell) => cell.textContent?.trim())
        .filter((cell): cell is string => Boolean(cell));
      if (cells.length < 2) return null;
      const comp = cells.find((cell) => /\$[\d,.]+[Kk]?/.test(cell));
      if (!comp) return null;
      return { role: cells[0], totalComp: comp };
    })
    .filter((role): role is LevelsRoleComp => role !== null)
    .slice(0, 5);

  return { url, medianTotalComp, roles };
}
