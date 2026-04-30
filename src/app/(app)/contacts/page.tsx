"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { CalendarClock, Mail, Pencil, Plus, Search, Trash2, Users, X } from "lucide-react";
import type { Contact } from "@/types";
import {
  CONTACT_FOLLOW_UP_FILTER_OPTIONS,
  CONTACT_FOLLOW_UP_LABELS,
  type ContactFollowUpFilter,
  type CreateContactInput,
} from "@/lib/constants";
import { readJsonResponse } from "@/lib/http";

interface ContactsResponse {
  contacts: Contact[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface ContactResponse {
  contact: Contact;
}

const PAGE_SIZE = 8;

const EMPTY_FORM: CreateContactInput = {
  name: "",
  role: "",
  company: "",
  email: "",
  linkedin: "",
  lastContacted: "",
  nextFollowup: "",
  notes: "",
};

type ContactFormField = {
  name: keyof CreateContactInput;
  label: string;
  type?: "email" | "url" | "date";
  className?: string;
};

const CONTACT_FORM_FIELDS: ContactFormField[] = [
  { name: "name", label: "Name", className: "md:col-span-2" },
  { name: "role", label: "Role" },
  { name: "company", label: "Company" },
  { name: "email", label: "Email", type: "email" },
  { name: "linkedin", label: "LinkedIn", type: "url" },
  { name: "lastContacted", label: "Last contacted", type: "date" },
  { name: "nextFollowup", label: "Next follow-up", type: "date" },
];

function formatDate(value?: string) {
  if (!value) return "Not set";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getFollowUpTag(contact: Contact) {
  if (!contact.nextFollowup) return CONTACT_FOLLOW_UP_LABELS.none;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const followUpDate = new Date(`${contact.nextFollowup}T00:00:00`);
  return followUpDate <= today ? "Follow up due" : CONTACT_FOLLOW_UP_LABELS.upcoming;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [query, setQuery] = useState("");
  const [followUpFilter, setFollowUpFilter] = useState<ContactFollowUpFilter>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [form, setForm] = useState<CreateContactInput>(EMPTY_FORM);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(PAGE_SIZE),
        followUp: followUpFilter,
      });
      if (query.trim()) params.set("q", query.trim());
      const response = await fetch(`/api/contacts?${params.toString()}`);
      const data = await readJsonResponse<ContactsResponse>(
        response,
        "Failed to load contacts"
      );
      setContacts(data.contacts);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }, [followUpFilter, page, query]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void fetchContacts();
    }, 150);
    return () => window.clearTimeout(timeout);
  }, [fetchContacts]);

  useEffect(() => {
    setPage(1);
  }, [query, followUpFilter]);

  const pageLabel = useMemo(() => {
    if (total === 0) return "No contacts";
    return `${total} contact${total === 1 ? "" : "s"}`;
  }, [total]);

  const openCreateModal = () => {
    setEditingContact(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (contact: Contact) => {
    setEditingContact(contact);
    setForm({
      name: contact.name,
      role: contact.role || "",
      company: contact.company || "",
      email: contact.email || "",
      linkedin: contact.linkedin || "",
      lastContacted: contact.lastContacted || "",
      nextFollowup: contact.nextFollowup || "",
      notes: contact.notes || "",
    });
    setModalOpen(true);
  };

  const updateFormField = (field: keyof CreateContactInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(
        editingContact ? `/api/contacts/${editingContact.id}` : "/api/contacts",
        {
          method: editingContact ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      await readJsonResponse<ContactResponse>(
        response,
        editingContact ? "Failed to update contact" : "Failed to create contact"
      );
      setModalOpen(false);
      await fetchContacts();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to save contact");
    } finally {
      setSaving(false);
    }
  };

  const removeContact = async (contact: Contact) => {
    if (!window.confirm(`Delete ${contact.name}?`)) return;
    setError(null);
    try {
      const response = await fetch(`/api/contacts/${contact.id}`, { method: "DELETE" });
      await readJsonResponse<unknown>(response, "Failed to delete contact");
      await fetchContacts();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete contact");
    }
  };

  return (
    <div className="min-h-screen">
      <section className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Users className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Contacts</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Track recruiters, hiring managers, referrals, and follow-up timing.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-button transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Add contact
          </button>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="relative block md:w-96">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search contacts"
              className="h-11 w-full rounded-lg border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <div className="flex flex-wrap items-center gap-2">
            {CONTACT_FOLLOW_UP_FILTER_OPTIONS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setFollowUpFilter(filter.value)}
                className={`min-h-10 rounded-lg border px-3 text-sm font-medium transition ${
                  followUpFilter === filter.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>{pageLabel}</span>
          <span>
            Page {Math.min(page, totalPages)} of {totalPages}
          </span>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-40 animate-pulse rounded-lg border bg-muted/40" />
            ))}
          </div>
        ) : contacts.length === 0 ? (
          <div className="flex min-h-80 flex-col items-center justify-center rounded-lg border border-dashed text-center">
            <Users className="mb-4 h-10 w-10 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">No contacts found</h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Add your first networking contact or clear the current filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {contacts.map((contact) => (
              <article key={contact.id} className="rounded-lg border bg-card p-5 shadow-card">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold text-card-foreground">
                      {contact.name}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {[contact.role, contact.company].filter(Boolean).join(" at ") || "Contact"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(contact)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                      aria-label={`Edit ${contact.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void removeContact(contact)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                      aria-label={`Delete ${contact.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {getFollowUpTag(contact)}
                  </span>
                  {contact.company && (
                    <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      {contact.company}
                    </span>
                  )}
                </div>

                <div className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4" />
                    Next: {formatDate(contact.nextFollowup)}
                  </div>
                  {contact.email && (
                    <a className="flex items-center gap-2 hover:text-foreground" href={`mailto:${contact.email}`}>
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{contact.email}</span>
                    </a>
                  )}
                </div>

                {contact.notes && (
                  <p className="mt-4 line-clamp-3 text-sm text-muted-foreground">
                    {contact.notes}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="min-h-10 rounded-lg border px-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            className="min-h-10 rounded-lg border px-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </main>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <form
            onSubmit={(event) => void submitContact(event)}
            className="max-h-full w-full max-w-2xl overflow-y-auto rounded-lg border bg-background p-6 shadow-elevated"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {editingContact ? "Edit contact" : "Add contact"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Close contact form"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {CONTACT_FORM_FIELDS.map((field) => (
                <label key={field.name} className={`space-y-1.5 ${field.className || ""}`}>
                  <span className="text-sm font-medium">{field.label}</span>
                  <input
                    required={field.name === "name"}
                    type={field.type}
                    value={form[field.name] || ""}
                    onChange={(event) => updateFormField(field.name, event.target.value)}
                    className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>
              ))}
              <label className="space-y-1.5 md:col-span-2">
                <span className="text-sm font-medium">Notes</span>
                <textarea
                  value={form.notes || ""}
                  onChange={(event) => updateFormField("notes", event.target.value)}
                  rows={4}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="min-h-11 rounded-lg border px-4 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="min-h-11 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save contact"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
