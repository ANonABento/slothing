import { NextRequest, NextResponse } from "next/server";
import { expect, vi } from "vitest";
import { nowEpoch } from "@/lib/format/time";

type JsonRecord = Record<string, unknown>;

declare global {
  // eslint-disable-next-line no-var
  var __contractRouteMocks:
    | {
        createAuthModuleMock: typeof createAuthModuleMock;
        createExtensionAuthModuleMock: typeof createExtensionAuthModuleMock;
        createContractModuleMock: typeof createContractModuleMock;
      }
    | undefined;
}

let authResult: { userId: string } | Response = { userId: "user-1" };
let extensionAuthResult:
  | { success: true; userId: string }
  | { success: false; status: number; error: string } = {
  success: true,
  userId: "user-1",
};

const sampleDate = "2026-05-10T12:00:00.000Z";

const sampleJob = {
  id: "job-1",
  userId: "user-1",
  title: "Frontend Engineer",
  company: "Acme",
  description: "Build polished user interfaces.",
  status: "applied",
  url: "https://example.com/job",
  location: "Remote",
  createdAt: sampleDate,
  updatedAt: sampleDate,
};

const sampleProfile = {
  id: "profile-1",
  userId: "user-1",
  name: "Ada Lovelace",
  email: "ada@example.com",
  summary: "Frontend engineer",
  skills: ["TypeScript", "React"],
  createdAt: sampleDate,
  updatedAt: sampleDate,
};

const sampleAnswer = {
  id: "answer-1",
  userId: "user-1",
  question: "Tell me about yourself",
  answer: "I build useful software.",
  category: "general",
  createdAt: sampleDate,
  updatedAt: sampleDate,
};

const sampleResume = {
  id: "resume-1",
  userId: "user-1",
  title: "Frontend Resume",
  content: "Resume content",
  createdAt: sampleDate,
  updatedAt: sampleDate,
};

const sampleDocument = {
  id: "document-1",
  userId: "user-1",
  name: "Resume.pdf",
  type: "resume",
  content: "Document content",
  createdAt: sampleDate,
  updatedAt: sampleDate,
};

export function resetContractMocks() {
  vi.clearAllMocks();
  setAuthSuccess();
  setExtensionAuthSuccess();
}

export function setAuthSuccess(userId = "user-1") {
  authResult = { userId };
}

export function setAuthFailure(
  status = 401,
  body: JsonRecord = { error: "Unauthorized" },
) {
  authResult = NextResponse.json(body, { status });
}

export function createAuthModuleMock() {
  return {
    requireAuth: vi.fn(async () => authResult),
    requireUserAuth: vi.fn(async () => authResult),
    getCurrentUserId: vi.fn(async () =>
      authResult instanceof Response ? null : authResult.userId,
    ),
    isAuthError: (value: unknown) => value instanceof Response,
  };
}

export function setExtensionAuthSuccess(userId = "user-1") {
  extensionAuthResult = { success: true, userId };
}

export function setExtensionAuthFailure(status = 401, error = "Invalid token") {
  extensionAuthResult = { success: false, status, error };
}

export function createExtensionAuthModuleMock() {
  return {
    requireExtensionAuth: vi.fn(async () => extensionAuthResult),
  };
}

export function getRequest(url: string, headers: HeadersInit = {}) {
  return new NextRequest(url, { method: "GET", headers });
}

export function jsonRequest(
  url: string,
  body: unknown = representativeBody(),
  method = "POST",
  headers: HeadersInit = {},
) {
  return new NextRequest(url, {
    method,
    body: JSON.stringify(body),
    headers: { "content-type": "application/json", ...headers },
  });
}

export function invalidJsonRequest(url: string, method = "POST") {
  return new NextRequest(url, {
    method,
    body: "{",
    headers: { "content-type": "application/json" },
  });
}

export function routeContext(params: JsonRecord = {}) {
  const merged = {
    id: "item-1",
    jobId: "job-1",
    resumeId: "resume-1",
    versionId: "version-1",
    ...params,
  };

  return { params: Object.assign(Promise.resolve(merged), merged) } as never;
}

export async function invokeRouteHandler(
  handler: unknown,
  request: Request,
  context = routeContext(),
) {
  const callable = handler as (
    request: Request,
    context?: unknown,
  ) => Response | Promise<Response>;

  return callable(request, context);
}

export function representativeBody(overrides: JsonRecord = {}) {
  return {
    id: "item-1",
    jobId: "job-1",
    resumeId: "resume-1",
    coverLetterId: "cover-letter-1",
    title: "Frontend Engineer",
    name: "Ada Lovelace",
    company: "Acme",
    companyName: "Acme",
    description: "Build polished user interfaces.",
    summary: "Build polished user interfaces.",
    content: "Useful content",
    question: "Tell me about yourself",
    answer: "I build useful software.",
    type: "job",
    status: "applied",
    email: "ada@example.com",
    subject: "Hello",
    body: "Hello from the contract test.",
    url: "https://example.com/job",
    sourceUrl: "https://example.com/job",
    fileId: "file-1",
    folderId: "folder-1",
    startDate: sampleDate,
    endDate: "2026-05-10T13:00:00.000Z",
    dueDate: sampleDate,
    entries: [sampleAnswer],
    entryIds: ["answer-1"],
    document: { sections: [] },
    skills: ["TypeScript"],
    ...overrides,
  };
}

export async function expectRouteResponseContract(response: Response) {
  expect(response).toBeInstanceOf(Response);
  expect(response.status).toBeGreaterThanOrEqual(100);
  expect(response.status).toBeLessThan(600);

  if (response.status === 204) {
    return;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = await response.json();
    expect(body).toBeDefined();
    return;
  }

  const text = await response.text();
  expect(typeof text).toBe("string");
}

export function createContractModuleMock(modulePath: string) {
  const cache = new Map<PropertyKey, unknown>();

  const valueFor = (name: string): unknown => {
    if (name === "__esModule") return true;
    if (name === "then") return undefined;
    if (name === "default") return createDefaultExport(modulePath);
    if (name === "db") return createDrizzleMock();
    if (name === "rateLimiters") return createRateLimitersMock();
    if (name === "TEMPLATES") {
      return [{ id: "template-1", name: "Modern", content: "Template" }];
    }
    if (/schema$/i.test(name)) return createSchemaMock();
    if (/^(table|answers|jobs|resumes|documents|templates)$/i.test(name)) {
      return {};
    }

    return vi.fn((...args: unknown[]) => defaultReturnFor(name, args));
  };

  return new Proxy(
    {},
    {
      has() {
        return true;
      },
      getOwnPropertyDescriptor() {
        return {
          configurable: true,
          enumerable: true,
        };
      },
      get(_target, property) {
        if (!cache.has(property)) {
          cache.set(property, valueFor(String(property)));
        }
        return cache.get(property);
      },
    },
  );
}

function createRateLimitersMock() {
  return new Proxy(
    {},
    {
      get() {
        return vi.fn(() => ({
          allowed: true,
          limit: 10,
          remaining: 9,
          reset: nowEpoch() + 60_000,
        }));
      },
    },
  );
}

function createDrizzleMock() {
  const rows = [sampleAnswer];
  const chain = {
    from: vi.fn(() => chain),
    where: vi.fn(() => chain),
    orderBy: vi.fn(() => rows),
    limit: vi.fn(() => rows),
    values: vi.fn(() => chain),
    set: vi.fn(() => chain),
    returning: vi.fn(() => rows),
  };

  return {
    select: vi.fn(() => chain),
    insert: vi.fn(() => chain),
    update: vi.fn(() => chain),
    delete: vi.fn(() => chain),
  };
}

function createDefaultExport(modulePath: string) {
  if (modulePath.includes("/legacy")) {
    return {
      prepare: vi.fn(() => ({
        get: vi.fn(() => ({
          id: "token-1",
          user_id: "user-1",
          token: "test-token",
          expires_at: nowEpoch() + 60_000,
        })),
        all: vi.fn(() => []),
        run: vi.fn(() => ({ changes: 1 })),
      })),
    };
  }

  return vi.fn((...args: unknown[]) => defaultReturnFor("default", args));
}

function createSchemaMock() {
  return {
    parse: vi.fn((value: unknown) => value),
    safeParse: vi.fn((value: unknown) => ({ success: true, data: value })),
    partial: vi.fn(function partial(this: unknown) {
      return this;
    }),
    extend: vi.fn(function extend(this: unknown) {
      return this;
    }),
  };
}

function defaultReturnFor(name: string, args: unknown[]): unknown {
  const lower = name.toLowerCase();

  if (lower.includes("connected")) return true;
  if (lower.includes("status"))
    return { connected: true, email: "ada@example.com" };
  if (lower.includes("token")) return "test-token";
  if (lower.includes("url")) return "https://example.com/feed.ics";
  if (lower.includes("csv")) return "title,company\nFrontend Engineer,Acme\n";
  if (lower.includes("ics") || lower.includes("calendar")) {
    return "BEGIN:VCALENDAR\nEND:VCALENDAR";
  }
  if (lower.includes("html")) return "<article>Resume</article>";
  if (lower.includes("score")) return 92;
  if (lower.includes("count")) return 1;
  if (lower.includes("delete") || lower.includes("remove")) return true;
  if (
    lower.includes("update") ||
    lower.includes("save") ||
    lower.includes("create")
  ) {
    return sampleObjectFor(name, args);
  }
  if (
    lower.includes("list") ||
    lower.includes("all") ||
    lower.includes("search")
  ) {
    return [sampleObjectFor(name, args)];
  }
  if (
    lower.includes("find") ||
    lower.includes("get") ||
    lower.includes("match")
  ) {
    return sampleObjectFor(name, args);
  }
  if (lower.includes("generate") || lower.includes("analyze")) {
    return {
      text: "Generated content",
      result: "Generated content",
      score: 92,
      suggestions: ["Tighten the summary"],
    };
  }

  return sampleObjectFor(name, args);
}

function sampleObjectFor(name: string, _args: unknown[]) {
  const lower = name.toLowerCase();
  if (lower.includes("profile")) return sampleProfile;
  if (lower.includes("answer") || lower.includes("bank")) return sampleAnswer;
  if (lower.includes("resume")) return sampleResume;
  if (lower.includes("document")) return sampleDocument;
  if (lower.includes("interview")) {
    return { id: "interview-1", userId: "user-1", jobId: "job-1" };
  }
  if (lower.includes("notification")) {
    return { id: "notification-1", userId: "user-1", read: false };
  }
  if (lower.includes("reminder")) {
    return { id: "reminder-1", userId: "user-1", title: "Follow up" };
  }
  if (lower.includes("template")) {
    return { id: "template-1", name: "Modern", content: "Template" };
  }
  if (lower.includes("salary") || lower.includes("offer")) {
    return { id: "offer-1", userId: "user-1", base: 100000 };
  }
  return sampleJob;
}

globalThis.__contractRouteMocks ??= {
  createAuthModuleMock,
  createExtensionAuthModuleMock,
  createContractModuleMock,
};
