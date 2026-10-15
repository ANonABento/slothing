import { describe, expect, it } from "vitest";

import { MAX_VERSIONS, createJob, getVersion, listVersions, saveDoc } from "../db";
import { profileAsTailored } from "../resolve";
import { profile } from "./fixture";

const newJob = () => createJob({ company: "Initech", title: "Eng", url: "", location: "", description: "" });

describe("document versions", () => {
  it("keeps every save, newest first, with its meta", () => {
    const jobId = newJob();
    const doc = profileAsTailored(profile);
    saveDoc(jobId, "resume", doc, [], { source: "ai", model: "m" });
    saveDoc(jobId, "resume", { ...doc, summary: "Edited summary." }, [], { source: "ai", model: "m", edited: true });
    const versions = listVersions(jobId, "resume");
    expect(versions.map((v) => v.data.summary)).toEqual(["Edited summary.", doc.summary]);
    expect(versions[1].meta).toEqual({ source: "ai", model: "m" });
    expect(getVersion(jobId, "resume", versions[1].id)?.data).toEqual(doc);
    // Each document has its own history.
    expect(listVersions(jobId, "cover_letter")).toEqual([]);
    expect(getVersion(newJob(), "resume", versions[1].id)).toBeNull();
  });

  it("drops the oldest beyond the limit", () => {
    const jobId = newJob();
    const doc = profileAsTailored(profile);
    for (let i = 0; i < MAX_VERSIONS + 3; i++) saveDoc(jobId, "resume", { ...doc, summary: `v${i}` });
    const versions = listVersions(jobId, "resume");
    expect(versions).toHaveLength(MAX_VERSIONS);
    expect(versions[0].data.summary).toBe(`v${MAX_VERSIONS + 2}`);
    expect(versions.at(-1)!.data.summary).toBe("v3");
  });
});
