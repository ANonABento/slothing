import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OPPORTUNITY_STATUSES } from "@slothing/shared/schemas";
import { OpportunityStatusBadge } from "./opportunity-status-badge";

describe("OpportunityStatusBadge", () => {
  it("renders the label for a known status", () => {
    render(<OpportunityStatusBadge status="applied" />);
    expect(screen.getByText("Applied")).toBeInTheDocument();
  });

  it("renders the short 'Interview' label for interviewing", () => {
    render(<OpportunityStatusBadge status="interviewing" />);
    expect(screen.getByText("Interview")).toBeInTheDocument();
  });

  it("falls back to 'Saved' for unknown status values", () => {
    render(<OpportunityStatusBadge status="unknown_status" />);
    expect(screen.getByText("Saved")).toBeInTheDocument();
  });

  it("renders the canonical 'Offer' label for status=offer (F2.1 mislabel fix)", () => {
    // The bug being fixed: the legacy badge keyed labels by `offered`, so
    // canonical `offer` rows silently fell through to the "Saved" fallback.
    const { container } = render(<OpportunityStatusBadge status="offer" />);
    expect(screen.getByText("Offer")).toBeInTheDocument();
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("bg-success");
  });

  it("translates legacy `offered` rows to canonical Offer presentation", () => {
    // Belt-and-suspenders for any DB row that escapes the
    // 0013_jobs_status_canonical backfill.
    const { container } = render(<OpportunityStatusBadge status="offered" />);
    expect(screen.getByText("Offer")).toBeInTheDocument();
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("bg-success");
  });

  it("translates legacy `withdrawn` to Dismissed", () => {
    render(<OpportunityStatusBadge status="withdrawn" />);
    expect(screen.getByText("Dismissed")).toBeInTheDocument();
  });

  it("applies the destructive class for rejected", () => {
    const { container } = render(<OpportunityStatusBadge status="rejected" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("bg-destructive");
  });

  it("applies the muted class for saved/pending/dismissed/expired", () => {
    for (const status of ["saved", "pending", "dismissed", "expired"]) {
      const { container } = render(<OpportunityStatusBadge status={status} />);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain("bg-muted");
    }
  });

  it("accepts an additional className prop", () => {
    const { container } = render(
      <OpportunityStatusBadge status="applied" className="extra-class" />,
    );
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("extra-class");
  });

  it("renders every canonical status without throwing", () => {
    for (const status of OPPORTUNITY_STATUSES) {
      expect(() =>
        render(<OpportunityStatusBadge status={status} />),
      ).not.toThrow();
    }
  });
});
