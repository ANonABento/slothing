import db from "./schema";
import { generateId } from "@/lib/utils";
import type { ContactFollowUpFilter } from "@/lib/constants";
import type { Contact } from "@/types";

interface ContactRow {
  id: string;
  user_id: string;
  name: string;
  role?: string | null;
  company?: string | null;
  email?: string | null;
  linkedin?: string | null;
  last_contacted?: string | null;
  next_followup?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ContactListOptions {
  page?: number;
  pageSize?: number;
  query?: string;
  followUpFilter?: ContactFollowUpFilter;
}

export interface ContactListResult {
  contacts: Contact[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type ContactInput = Omit<Contact, "id" | "userId" | "createdAt" | "updatedAt">;

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

function nullable(value: string | null | undefined): string | null {
  return value?.trim() ? value.trim() : null;
}

function mapRowToContact(row: ContactRow): Contact {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    role: row.role || undefined,
    company: row.company || undefined,
    email: row.email || undefined,
    linkedin: row.linkedin || undefined,
    lastContacted: row.last_contacted || undefined,
    nextFollowup: row.next_followup || undefined,
    notes: row.notes || undefined,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || row.created_at || new Date().toISOString(),
  };
}

export function normalizeContactListOptions(options: ContactListOptions = {}) {
  const page = Number.isFinite(options.page) && options.page! > 0
    ? Math.floor(options.page!)
    : 1;
  const pageSize = Number.isFinite(options.pageSize) && options.pageSize! > 0
    ? Math.min(Math.floor(options.pageSize!), MAX_PAGE_SIZE)
    : DEFAULT_PAGE_SIZE;

  return {
    page,
    pageSize,
    query: options.query?.trim() || "",
    followUpFilter: options.followUpFilter || "all",
  };
}

function buildContactFilters(options: ReturnType<typeof normalizeContactListOptions>, userId: string) {
  const conditions = ["user_id = ?"];
  const params: Array<string | number> = [userId];

  if (options.query) {
    const term = `%${options.query.toLowerCase()}%`;
    conditions.push(`(
      LOWER(name) LIKE ? OR
      LOWER(COALESCE(role, '')) LIKE ? OR
      LOWER(COALESCE(company, '')) LIKE ? OR
      LOWER(COALESCE(email, '')) LIKE ? OR
      LOWER(COALESCE(linkedin, '')) LIKE ? OR
      LOWER(COALESCE(notes, '')) LIKE ?
    )`);
    params.push(term, term, term, term, term, term);
  }

  if (options.followUpFilter === "due") {
    conditions.push("next_followup IS NOT NULL AND date(next_followup) <= date('now')");
  } else if (options.followUpFilter === "upcoming") {
    conditions.push("next_followup IS NOT NULL AND date(next_followup) > date('now')");
  } else if (options.followUpFilter === "none") {
    conditions.push("(next_followup IS NULL OR next_followup = '')");
  }

  return {
    whereSql: conditions.join(" AND "),
    params,
  };
}

export function getContacts(options: ContactListOptions = {}, userId: string = "default"): ContactListResult {
  const normalized = normalizeContactListOptions(options);
  const { whereSql, params } = buildContactFilters(normalized, userId);
  const offset = (normalized.page - 1) * normalized.pageSize;

  const countRow = db.prepare(`SELECT COUNT(*) as count FROM contacts WHERE ${whereSql}`).get(...params) as
    | { count: number }
    | undefined;
  const total = countRow?.count ?? 0;

  const rows = db.prepare(`
    SELECT * FROM contacts
    WHERE ${whereSql}
    ORDER BY COALESCE(next_followup, '9999-12-31') ASC, LOWER(name) ASC
    LIMIT ? OFFSET ?
  `).all(...params, normalized.pageSize, offset) as ContactRow[];

  return {
    contacts: rows.map(mapRowToContact),
    total,
    page: normalized.page,
    pageSize: normalized.pageSize,
    totalPages: Math.max(1, Math.ceil(total / normalized.pageSize)),
  };
}

export function getContact(id: string, userId: string = "default"): Contact | null {
  const row = db.prepare("SELECT * FROM contacts WHERE id = ? AND user_id = ?").get(id, userId) as
    | ContactRow
    | undefined;
  return row ? mapRowToContact(row) : null;
}

export function createContact(contact: ContactInput, userId: string = "default"): Contact {
  const id = generateId();

  db.prepare(`
    INSERT INTO contacts (
      id, user_id, name, role, company, email, linkedin,
      last_contacted, next_followup, notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    userId,
    contact.name.trim(),
    nullable(contact.role),
    nullable(contact.company),
    nullable(contact.email),
    nullable(contact.linkedin),
    nullable(contact.lastContacted),
    nullable(contact.nextFollowup),
    nullable(contact.notes)
  );

  return getContact(id, userId)!;
}

export function updateContact(
  id: string,
  updates: Partial<ContactInput>,
  userId: string = "default"
): Contact | null {
  const existing = getContact(id, userId);
  if (!existing) return null;

  const merged = { ...existing, ...updates };
  db.prepare(`
    UPDATE contacts SET
      name = ?,
      role = ?,
      company = ?,
      email = ?,
      linkedin = ?,
      last_contacted = ?,
      next_followup = ?,
      notes = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND user_id = ?
  `).run(
    merged.name.trim(),
    nullable(merged.role),
    nullable(merged.company),
    nullable(merged.email),
    nullable(merged.linkedin),
    nullable(merged.lastContacted),
    nullable(merged.nextFollowup),
    nullable(merged.notes),
    id,
    userId
  );

  return getContact(id, userId);
}

export function deleteContact(id: string, userId: string = "default"): boolean {
  const result = db.prepare("DELETE FROM contacts WHERE id = ? AND user_id = ?").run(id, userId);
  return result.changes > 0;
}
