import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { OpportunityContacts } from "./opportunity-contacts";

const mockShowErrorToast = vi.hoisted(() => vi.fn());

vi.mock("@/hooks/use-error-toast", () => ({
  useErrorToast: () => mockShowErrorToast,
}));

vi.mock("@/components/google/ContactPicker", () => ({
  ContactPicker: ({
    onSelect,
  }: {
    onSelect: (contact: {
      resourceName: string;
      name: string;
      email: string;
      company: string;
    }) => void;
  }) => (
    <button
      type="button"
      onClick={() =>
        onSelect({
          resourceName: "people/c2",
          name: "Robin Recruiter",
          email: "robin@example.com",
          company: "Globex",
        })
      }
    >
      Add from Google
    </button>
  ),
}));

describe("OpportunityContacts", () => {
  beforeEach(() => {
    mockShowErrorToast.mockClear();
  });

  it("loads, renders, adds, and confirms removal of contacts", async () => {
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url === "/api/opportunities/opp-1/contacts" && !init) {
        return new Response(
          JSON.stringify({
            contacts: [
              {
                id: "contact-1",
                name: "Avery Recruiter",
                email: "avery@example.com",
                company: "Acme",
                source: "google",
                createdAt: "2026-05-10T00:00:00.000Z",
              },
            ],
          }),
          { status: 200 },
        );
      }

      if (url === "/api/opportunities/opp-1/contacts" && init?.method === "POST") {
        return new Response(
          JSON.stringify({
            contact: {
              id: "contact-2",
              name: "Robin Recruiter",
              email: "robin@example.com",
              company: "Globex",
              source: "google",
              createdAt: "2026-05-10T00:01:00.000Z",
            },
          }),
          { status: 201 },
        );
      }

      if (
        url === "/api/opportunities/opp-1/contacts/contact-1" &&
        init?.method === "DELETE"
      ) {
        return new Response(null, { status: 204 });
      }

      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<OpportunityContacts opportunityId="opp-1" />);

    expect(await screen.findByText("Avery Recruiter")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Add from Google" }));
    expect(await screen.findByText("Robin Recruiter")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Remove Avery Recruiter" }),
    );
    expect(await screen.findByText("Remove this contact?")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Remove" }));

    await waitFor(() =>
      expect(screen.queryByText("Avery Recruiter")).not.toBeInTheDocument(),
    );
  });
});
