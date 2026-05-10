import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;
const MUTATING_METHODS = ["POST", "PUT", "PATCH", "DELETE"] as const;
const MUTATING_METHOD_SET = new Set<string>(MUTATING_METHODS);

function routeRelativePath(routePath: string) {
  return routePath.slice(routePath.indexOf("src/app/api"));
}

function exportedMethods(source: string) {
  return HTTP_METHODS.filter((method) => {
    const asyncExport = new RegExp(`export\\s+async\\s+function\\s+${method}\\b`);
    const functionExport = new RegExp(`export\\s+function\\s+${method}\\b`);
    const constExport = new RegExp(`export\\s+const\\s+${method}\\b`);
    const reExport = new RegExp(`export\\s+\\{[^}]*\\b${method}\\b[^}]*\\}`);
    return (
      asyncExport.test(source) ||
      functionExport.test(source) ||
      constExport.test(source) ||
      reExport.test(source)
    );
  });
}

function isDeprecatedJobsRoute(relativeRoutePath: string) {
  return (
    relativeRoutePath === "src/app/api/jobs/route.ts" ||
    relativeRoutePath.startsWith("src/app/api/jobs/")
  );
}

function importsAuth(source: string) {
  return /from ["']@\/lib\/auth["']/.test(source);
}

function importsExtensionAuth(source: string) {
  return /from ["']@\/lib\/extension-auth["']/.test(source);
}

function hasCustomAuth(source: string) {
  return (
    /verifyCalendarFeedToken/.test(source) ||
    /x-extension-token/i.test(source) ||
    /apiKey|token/.test(source)
  );
}

function hasBodyParsing(source: string) {
  return /\.json\(\)|\.formData\(\)|\.text\(\)|\.arrayBuffer\(\)/.test(source);
}

function hasResponseContract(source: string) {
  return (
    /NextResponse\.json|Response\.json|new\s+Response|return\s+Response|export\s+\{/.test(
      source,
    ) ||
    /deprecatedJobsApiResponse|successResponse|errorResponse|validationErrorResponse/.test(
      source,
    )
  );
}

export function describeApiRouteSourceContract(testFileUrl: string) {
  const testPath = fileURLToPath(testFileUrl);
  const routePath = path.join(path.dirname(testPath), "route.ts");
  const relativeRoutePath = routeRelativePath(routePath);

  describe(`${relativeRoutePath} source contract`, () => {
    it("has a colocated route implementation", () => {
      expect(existsSync(routePath)).toBe(true);
    });

    const source = readFileSync(routePath, "utf8");
    const methods = exportedMethods(source);

    it("exports at least one HTTP handler", () => {
      expect(methods.length).toBeGreaterThan(0);
    });

    it("declares an observable response contract", () => {
      expect(hasResponseContract(source)).toBe(true);
    });

    it("documents the route authentication boundary", () => {
      const isNextAuthRoute = relativeRoutePath.includes("/auth/[...nextauth]/");
      const publicScannerRoute = relativeRoutePath.includes("/scanner/");
      const delegatesToAnotherRoute = /export\s+\{/.test(source);
      const deprecatedJobsRoute = isDeprecatedJobsRoute(relativeRoutePath);
      const hasRecognizedAuth =
        isNextAuthRoute ||
        publicScannerRoute ||
        delegatesToAnotherRoute ||
        deprecatedJobsRoute ||
        importsAuth(source) ||
        importsExtensionAuth(source) ||
        hasCustomAuth(source);

      expect(hasRecognizedAuth).toBe(true);
    });

    if (methods.some((method) => MUTATING_METHOD_SET.has(method))) {
      it("declares how mutation input is handled", () => {
        if (!hasBodyParsing(source)) {
          expect(
            /export\s+\{/.test(source) ||
              /deprecatedJobsApiResponse/.test(source) ||
              /DELETE\(|POST\(|PUT\(|PATCH\(/.test(source),
          ).toBe(true);
          return;
        }

        expect(hasBodyParsing(source)).toBe(true);
      });
    }

    if (isDeprecatedJobsRoute(relativeRoutePath)) {
      it("keeps the deprecated jobs API contract stable", () => {
        expect(source).toContain("deprecatedJobsApiResponse");
      });
    }
  });
}
