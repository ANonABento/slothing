import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

import type {
  PdfDocGeometry,
  PdfTextItem,
} from "@slothing/shared/resume-template";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  rateLimitStandard: vi.fn(),
  getTemplateSourceType: vi.fn(),
  pdfBufferToGeometry: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: (value: unknown) => value instanceof Response,
}));
vi.mock("@/lib/rate-limit", () => ({
  getClientIdentifier: vi.fn(() => "user-1"),
  rateLimiters: { standard: mocks.rateLimitStandard },
}));
vi.mock("@/lib/templates/import", () => ({
  getTemplateSourceType: mocks.getTemplateSourceType,
}));
vi.mock("@/lib/resume/pdf-geometry", () => ({
  pdfBufferToGeometry: mocks.pdfBufferToGeometry,
}));

import { POST } from "./route";

function mk(
  text: string,
  x: number,
  y: number,
  o: Partial<PdfTextItem> = {},
): PdfTextItem {
  const fontSize = o.fontSize ?? 11;
  return {
    text,
    x,
    y,
    width: text.length * fontSize * 0.5,
    height: fontSize,
    fontName: o.fontName ?? "Times New Roman",
    fontSize,
    bold: o.bold,
    color: o.color,
  };
}

function singleColGeometry(): PdfDocGeometry {
  const items: PdfTextItem[] = [];
  items.push(mk("Jane Doe", 250, 40, { fontSize: 22, bold: true }));
  items.push(
    mk("jane.doe@example.com  •  Boston, MA", 200, 70, { fontSize: 9 }),
  );
  let y = 120;
  const section = (t: string) => {
    items.push(mk(t, 72, y, { fontSize: 12, bold: true, color: "#1f4e79" }));
    y += 20;
  };
  const body = (t: string, bullet = false) => {
    items.push(mk((bullet ? "• " : "") + t, bullet ? 90 : 72, y));
    y += 15;
  };
  section("EXPERIENCE");
  body("Senior Engineer, Acme Corp 2021 – Present");
  body("Built the platform that scaled to millions of users.", true);
  body("Led a team of five engineers across two products.", true);
  body("Software Engineer, Globex 2018 – 2021");
  body("Shipped the billing system end to end.", true);
  section("EDUCATION");
  body("B.S. Computer Science, MIT 2014 – 2018");
  section("SKILLS");
  body("Languages: TypeScript, Go, Python");
  body("Infrastructure: AWS, Kubernetes, Postgres");
  return { pages: [{ width: 612, height: 792, items }] };
}

function fileReq(
  bytes: Uint8Array,
  name = "resume.pdf",
  type = "application/pdf",
): NextRequest {
  const file = {
    name,
    type,
    size: bytes.byteLength,
    async arrayBuffer() {
      return bytes.buffer.slice(
        bytes.byteOffset,
        bytes.byteOffset + bytes.byteLength,
      );
    },
  };
  return {
    url: "http://localhost/api/templates/import",
    headers: new Headers(),
    async formData() {
      return { get: (k: string) => (k === "file" ? file : null) };
    },
  } as unknown as NextRequest;
}

describe("/api/templates/import", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "user-1" });
    mocks.rateLimitStandard.mockReturnValue({
      allowed: true,
      resetAt: Date.now() + 1000,
    });
    mocks.getTemplateSourceType.mockReturnValue("pdf");
    mocks.pdfBufferToGeometry.mockResolvedValue(singleColGeometry());
  });

  it("fingerprints a foreign PDF and drafts the RDM", async () => {
    const res = await POST(fileReq(new Uint8Array([0x25, 0x50, 0x44, 0x46]))); // %PDF, no XMP
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.route).toBe("fingerprint");
    expect(body.rdm.basics.name).toBe("Jane Doe");
    expect(body.fingerprint.columns.value).toBe("single");
    expect(body.suggestedTemplate).toBeTruthy();
  });

  it("self-imports a PDF carrying the embedded XMP RDM (no geometry call)", async () => {
    const rdm = {
      basics: { name: "Avery Chen" },
      work: [],
      education: [],
      skills: [],
    };
    const b64 = Buffer.from(JSON.stringify({ v: 1, rdm })).toString("base64");
    const bytes = new TextEncoder().encode(
      `%PDF-1.7\n<slothing:rdm>${b64}</slothing:rdm>\n%%EOF`,
    );
    const res = await POST(fileReq(bytes));
    const body = await res.json();
    expect(body.route).toBe("self-import");
    expect(body.rdm.basics.name).toBe("Avery Chen");
    expect(mocks.pdfBufferToGeometry).not.toHaveBeenCalled();
  });

  it("routes non-PDF uploads to manual pick", async () => {
    mocks.getTemplateSourceType.mockReturnValue("docx");
    const res = await POST(fileReq(new Uint8Array([1, 2, 3]), "resume.docx"));
    const body = await res.json();
    expect(body.route).toBe("manual");
    expect(body.suggestedTemplate).toBeTruthy();
  });

  it("rejects a missing file", async () => {
    const req = {
      url: "http://localhost/api/templates/import",
      headers: new Headers(),
      async formData() {
        return { get: () => null };
      },
    } as unknown as NextRequest;
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
