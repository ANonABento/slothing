import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () =>
  globalThis.__contractRouteMocks!.createAuthModuleMock(),
);

/**
 * An in-memory stand-in for the document store. Route tests in this repo mock the DB by
 * convention; keeping a working fake (rather than per-call stubs) means these tests still
 * exercise the route's real behaviour — generation, validation, and scoping.
 */
const store = vi.hoisted(() => {
  const docs = new Map<string, Record<string, unknown>>();
  const versions: Record<string, unknown>[] = [];
  let counter = 0;
  return { docs, versions, next: () => `doc-${++counter}` };
});

vi.mock("@/lib/db/tex-documents", () => ({
  isTexDocumentKind: (v: unknown) =>
    v === "resume" || v === "cv" || v === "cover_letter",
  createTexDocument: vi.fn(async (input: Record<string, unknown>) => {
    const doc = {
      id: store.next(),
      contractVersion: 1,
      createdAt: "2026-08-21T00:00:00.000Z",
      updatedAt: "2026-08-21T00:00:00.000Z",
      templateId: null,
      opportunityId: null,
      ...input,
    };
    store.docs.set(doc.id as string, doc);
    return doc;
  }),
  getTexDocument: vi.fn(async (id: string, userId: string) => {
    const doc = store.docs.get(id);
    return doc && doc.userId === userId ? doc : null;
  }),
  listTexDocuments: vi.fn(async (userId: string) =>
    [...store.docs.values()].filter((d) => d.userId === userId),
  ),
  updateTexDocumentSource: vi.fn(
    async (id: string, userId: string, source: string, label?: string) => {
      const doc = store.docs.get(id);
      if (!doc || doc.userId !== userId) return null;
      store.versions.push({ documentId: id, source: doc.source, label });
      doc.source = source;
      return doc;
    },
  ),
  renameTexDocument: vi.fn(
    async (id: string, userId: string, title: string) => {
      const doc = store.docs.get(id);
      if (!doc || doc.userId !== userId) return null;
      doc.title = title;
      return doc;
    },
  ),
  deleteTexDocument: vi.fn(async (id: string, userId: string) => {
    const doc = store.docs.get(id);
    if (!doc || doc.userId !== userId) return false;
    store.docs.delete(id);
    return true;
  }),
  listTexDocumentVersions: vi.fn(async (documentId: string) =>
    store.versions.filter((v) => v.documentId === documentId),
  ),
  setTexDocumentKind: vi.fn(
    async (id: string, userId: string, kind: string) => {
      const doc = store.docs.get(id);
      if (!doc || doc.userId !== userId) return null;
      doc.kind = kind;
      return doc;
    },
  ),
  duplicateTexDocument: vi.fn(
    async (id: string, userId: string, title: string) => {
      const doc = store.docs.get(id);
      if (!doc || doc.userId !== userId) return null;
      const copy = { ...doc, id: store.next(), title, opportunityId: null };
      store.docs.set(copy.id as string, copy);
      return copy;
    },
  ),
}));

import { GET, POST } from "./route";
import { POST as DUPLICATE, copyTitle } from "./[id]/duplicate/route";
import {
  DELETE as DELETE_ONE,
  GET as GET_ONE,
  PATCH as PATCH_ONE,
} from "./[id]/route";
import { scanSpans } from "@/lib/latex/scanner";
import {
  getRequest,
  invokeRouteHandler,
  jsonRequest,
  routeContext,
} from "@/test/contract";

const CONTENT = {
  name: "Kevin Jiang",
  contact: "kevin@example.com",
  sections: [
    {
      title: "Experience",
      entries: [
        {
          organisation: "Bracket Bot",
          role: "Robotics Engineer",
          dates: "2025-2026",
          bullets: ["Cut calibration time 40%."],
        },
      ],
    },
  ],
};

async function createDocument(title = "My Resume") {
  const response = await invokeRouteHandler(
    POST,
    jsonRequest(
      "http://localhost/api/tex-documents",
      { kind: "resume", title, content: CONTENT },
      "POST",
    ),
    routeContext(),
  );
  return { response, body: await response.json() };
}

describe("/api/tex-documents", () => {
  it("generates an addressable .tex document from structured content", async () => {
    const { response, body } = await createDocument();

    expect(response.status).toBe(201);
    expect(body.document.kind).toBe("resume");
    expect(body.document.source).toContain("usepackage{slothing}");

    const spans = scanSpans(body.document.source);
    expect(spans.length).toBeGreaterThan(0);
    expect(spans.every((span: { id: string | null }) => span.id !== null)).toBe(
      true,
    );
  });

  it("accepts raw .tex source verbatim for an imported document", async () => {
    const source = "\\documentclass{article}\\begin{document}hi\\end{document}";
    const response = await invokeRouteHandler(
      POST,
      jsonRequest(
        "http://localhost/api/tex-documents",
        { kind: "resume", title: "Imported", source },
        "POST",
      ),
      routeContext(),
    );
    const body = await response.json();
    expect(body.document.source).toBe(source);
  });

  it("rejects a payload with neither source nor content", async () => {
    const response = await invokeRouteHandler(
      POST,
      jsonRequest(
        "http://localhost/api/tex-documents",
        { kind: "resume", title: "Empty" },
        "POST",
      ),
      routeContext(),
    );
    expect(response.status).toBe(400);
  });

  it("generates a cover letter through the same endpoint", async () => {
    const response = await invokeRouteHandler(
      POST,
      jsonRequest(
        "http://localhost/api/tex-documents",
        {
          kind: "cover_letter",
          title: "Cover",
          content: {
            name: "Kevin",
            contact: "k@example.com",
            paragraphs: ["One.", "Two."],
          },
        },
        "POST",
      ),
      routeContext(),
    );
    const body = await response.json();
    const paras = scanSpans(body.document.source).filter(
      (s: { kind: string }) => s.kind === "para",
    );
    expect(paras).toHaveLength(2);
  });

  it("omits the source from list responses", async () => {
    await createDocument("Listed");
    const response = await invokeRouteHandler(
      GET,
      getRequest("http://localhost/api/tex-documents"),
      routeContext(),
    );
    const body = await response.json();
    expect(body.documents.length).toBeGreaterThan(0);
    expect(body.documents[0]).not.toHaveProperty("source");
  });
});

describe("/api/tex-documents/[id]", () => {
  it("returns a document with its source", async () => {
    const { body: created } = await createDocument("Fetch me");
    const response = await invokeRouteHandler(
      GET_ONE,
      getRequest(`http://localhost/api/tex-documents/${created.document.id}`),
      routeContext({ id: created.document.id }),
    );
    const body = await response.json();
    expect(body.document.title).toBe("Fetch me");
    expect(body.document.source).toContain("slothing");
  });

  it("404s for a document id that does not exist", async () => {
    const response = await invokeRouteHandler(
      GET_ONE,
      getRequest("http://localhost/api/tex-documents/nope"),
      routeContext({ id: "nope" }),
    );
    expect(response.status).toBe(404);
  });

  it("snapshots the previous source when the source changes", async () => {
    const { body: created } = await createDocument("Versioned");
    const id = created.document.id;
    const nextSource = `${created.document.source}\n% edited`;

    await invokeRouteHandler(
      PATCH_ONE,
      jsonRequest(
        `http://localhost/api/tex-documents/${id}`,
        { source: nextSource, label: "manual edit" },
        "PATCH",
      ),
      routeContext({ id }),
    );

    const response = await invokeRouteHandler(
      GET_ONE,
      getRequest(`http://localhost/api/tex-documents/${id}?versions=true`),
      routeContext({ id }),
    );
    const body = await response.json();
    expect(body.document.source).toBe(nextSource);
    expect(body.versions).toHaveLength(1);
  });

  it("rejects a patch with neither source nor title", async () => {
    const { body: created } = await createDocument("Nothing to do");
    const id = created.document.id;
    const response = await invokeRouteHandler(
      PATCH_ONE,
      jsonRequest(`http://localhost/api/tex-documents/${id}`, {}, "PATCH"),
      routeContext({ id }),
    );
    expect(response.status).toBe(400);
  });

  it("deletes a document", async () => {
    const { body: created } = await createDocument("Delete me");
    const id = created.document.id;

    const deleted = await invokeRouteHandler(
      DELETE_ONE,
      getRequest(`http://localhost/api/tex-documents/${id}`, {
        method: "DELETE",
      }),
      routeContext({ id }),
    );
    expect(deleted.status).toBe(200);

    const after = await invokeRouteHandler(
      GET_ONE,
      getRequest(`http://localhost/api/tex-documents/${id}`),
      routeContext({ id }),
    );
    expect(after.status).toBe(404);
  });
});

describe("PATCH /api/tex-documents/[id] — kind", () => {
  it("relabels a document without touching its source", async () => {
    const { body } = await createDocument("Mislabelled");
    const before = body.document.source;

    const response = await invokeRouteHandler(
      PATCH_ONE,
      jsonRequest(
        `http://localhost/api/tex-documents/${body.document.id}`,
        { kind: "cover_letter" },
        "PATCH",
      ),
      routeContext({ id: body.document.id }),
    );
    const patched = await response.json();

    expect(response.status).toBe(200);
    expect(patched.document.kind).toBe("cover_letter");
    // Kind is a label, not a format — relabelling must never rewrite the document.
    expect(patched.document.source).toBe(before);
  });

  it("rejects a body that changes nothing", async () => {
    const { body } = await createDocument("Untouched");
    const response = await invokeRouteHandler(
      PATCH_ONE,
      jsonRequest(
        `http://localhost/api/tex-documents/${body.document.id}`,
        {},
        "PATCH",
      ),
      routeContext({ id: body.document.id }),
    );
    expect(response.status).toBe(400);
  });
});

describe("copyTitle", () => {
  it("numbers repeated copies instead of stacking suffixes", () => {
    expect(copyTitle("Resume")).toBe("Resume (copy)");
    expect(copyTitle("Resume (copy)")).toBe("Resume (copy 2)");
    expect(copyTitle("Resume (copy 2)")).toBe("Resume (copy 3)");
  });

  it("keeps the result inside the 200-character title column", () => {
    expect(copyTitle("x".repeat(400)).length).toBeLessThanOrEqual(200);
  });
});

describe("POST /api/tex-documents/[id]/duplicate", () => {
  it("copies the source and kind under a new id", async () => {
    const { body } = await createDocument("Original");
    const response = await invokeRouteHandler(
      DUPLICATE,
      jsonRequest(
        `http://localhost/api/tex-documents/${body.document.id}/duplicate`,
        {},
        "POST",
      ),
      routeContext({ id: body.document.id }),
    );
    const copy = await response.json();

    expect(response.status).toBe(201);
    expect(copy.document.id).not.toBe(body.document.id);
    expect(copy.document.title).toBe("Original (copy)");
    expect(copy.document.source).toBe(body.document.source);
    expect(copy.document.kind).toBe(body.document.kind);
  });

  it("404s for a document belonging to someone else", async () => {
    const response = await invokeRouteHandler(
      DUPLICATE,
      jsonRequest(
        "http://localhost/api/tex-documents/nope/duplicate",
        {},
        "POST",
      ),
      routeContext({ id: "nope" }),
    );
    expect(response.status).toBe(404);
  });
});
