import { describe, expect, it } from "vitest";

import {
  collectBulkSources,
  derivePopupMode,
  type BulkListEntry,
  type PopupModeInput,
} from "./popup-mode";
import type { ScrapedJob } from "@/shared/types";

const JOB: ScrapedJob = {
  title: "Software Developer",
  company: "Acme",
} as ScrapedJob;

function input(over: Partial<PopupModeInput> = {}): PopupModeInput {
  return {
    pageProbeState: "ready",
    workspaceVisible: false,
    detectedJob: null,
    hasForm: false,
    detectedFields: 0,
    detectedUploadCount: 0,
    bulkSources: [],
    supportedSite: null,
    ...over,
  };
}

const WW: BulkListEntry = {
  key: "waterlooworks",
  label: "WaterlooWorks",
  rowCount: 50,
  hasNextPage: true,
};
const GH: BulkListEntry = {
  key: "greenhouse",
  label: "Greenhouse",
  rowCount: 12,
  hasNextPage: false,
};

describe("derivePopupMode", () => {
  it("needs-refresh wins over everything", () => {
    const m = derivePopupMode(
      input({
        pageProbeState: "needs-refresh",
        detectedJob: JOB,
        bulkSources: [WW],
        workspaceVisible: true,
      }),
    );
    expect(m.kind).toBe("needs-refresh");
  });

  it("workspace-active outranks job/form/list", () => {
    const m = derivePopupMode(
      input({ workspaceVisible: true, detectedJob: JOB, bulkSources: [WW] }),
    );
    expect(m.kind).toBe("workspace-active");
  });

  it("single-job carries form + upload affordances", () => {
    const m = derivePopupMode(
      input({
        detectedJob: JOB,
        hasForm: true,
        detectedFields: 7,
        detectedUploadCount: 1,
      }),
    );
    expect(m).toEqual({
      kind: "single-job",
      job: JOB,
      hasForm: true,
      detectedFields: 7,
      uploadCount: 1,
    });
  });

  it("application-form when a form but no posting", () => {
    const m = derivePopupMode(input({ hasForm: true, detectedFields: 4 }));
    expect(m).toEqual({
      kind: "application-form",
      detectedFields: 4,
      uploadCount: 0,
    });
  });

  it("bulk-list for a WaterlooWorks list page", () => {
    const m = derivePopupMode(input({ bulkSources: [WW] }));
    expect(m.kind).toBe("bulk-list");
    if (m.kind === "bulk-list") {
      expect(m.sources).toEqual([
        {
          key: "waterlooworks",
          label: "WaterlooWorks",
          rowCount: 50,
          hasNextPage: true,
        },
      ]);
    }
  });

  it("bulk-list for a generic ATS board", () => {
    const m = derivePopupMode(input({ bulkSources: [GH] }));
    expect(m.kind).toBe("bulk-list");
    if (m.kind === "bulk-list") expect(m.sources).toEqual([GH]);
  });

  it("WaterlooWorks comes first when multiple sources somehow co-occur", () => {
    const m = derivePopupMode(input({ bulkSources: [WW, GH] }));
    expect(m.kind).toBe("bulk-list");
    if (m.kind === "bulk-list") {
      expect(m.sources.map((s) => s.key)).toEqual([
        "waterlooworks",
        "greenhouse",
      ]);
    }
  });

  it("REGRESSION: a WaterlooWorks list never yields no-posting / single-job", () => {
    // The original bug: on a 50-row list the popup showed "No job detected".
    const m = derivePopupMode(
      input({
        pageProbeState: "ready",
        detectedJob: null,
        hasForm: false,
        bulkSources: [WW],
      }),
    );
    expect(m.kind).toBe("bulk-list");
    expect(m.kind).not.toBe("no-posting");
  });

  it("WaterlooWorks detail page (no rows detected) is NOT a bulk list", () => {
    // On a detail page the content script reports the WW source as undetected,
    // so it never reaches bulkSources; the popup falls back to no-posting.
    const m = derivePopupMode(input({ bulkSources: [] }));
    expect(m.kind).toBe("no-posting");
  });

  it("no-posting when probe ready but nothing actionable", () => {
    const m = derivePopupMode(
      input({ pageProbeState: "ready", detectedUploadCount: 2 }),
    );
    expect(m).toEqual({ kind: "no-posting", uploadCount: 2 });
  });

  it("scanning when supported host but probe not ready", () => {
    const m = derivePopupMode(
      input({ pageProbeState: "unknown", supportedSite: "LinkedIn" }),
    );
    expect(m).toEqual({ kind: "scanning", site: "LinkedIn" });
  });

  it("unsupported when nothing matches", () => {
    const m = derivePopupMode(
      input({ pageProbeState: "unknown", supportedSite: null }),
    );
    expect(m.kind).toBe("unsupported");
  });

  it("single-job outranks a co-occurring bulk source", () => {
    const m = derivePopupMode(input({ detectedJob: JOB, bulkSources: [GH] }));
    expect(m.kind).toBe("single-job");
  });
});

describe("collectBulkSources", () => {
  it("drops zero-row sources", () => {
    const sources = collectBulkSources(
      input({
        bulkSources: [
          { ...WW, rowCount: 0 },
          { ...GH, rowCount: 0 },
        ],
      }),
    );
    expect(sources).toEqual([]);
  });

  it("keeps WaterlooWorks ahead of generic sources", () => {
    const sources = collectBulkSources(input({ bulkSources: [WW, GH] }));
    expect(sources.map((s) => s.key)).toEqual(["waterlooworks", "greenhouse"]);
  });
});
