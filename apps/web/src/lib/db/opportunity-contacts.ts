import db from "./legacy";
import { ensureOpportunityContactsSchema } from "./opportunity-contacts-schema";
import { generateId } from "@/lib/utils";

export type OpportunityContactSource = "google" | "manual";

export interface OpportunityContact {
  id: string;
  userId: string;
  opportunityId: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  source: OpportunityContactSource;
  googleResourceName?: string;
  createdAt: string;
}

export interface AddOpportunityContactInput {
  opportunityId: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  source?: OpportunityContactSource;
  googleResourceName?: string;
}

interface OpportunityContactRow {
  id: string;
  user_id: string;
  opportunity_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  title: string | null;
  source: string;
  google_resource_name: string | null;
  created_at: string;
}

function ensureSchema(): void {
  ensureOpportunityContactsSchema(db);
}

function mapContact(row: OpportunityContactRow): OpportunityContact {
  return {
    id: row.id,
    userId: row.user_id,
    opportunityId: row.opportunity_id,
    name: row.name,
    email: row.email || undefined,
    phone: row.phone || undefined,
    company: row.company || undefined,
    title: row.title || undefined,
    source: row.source === "manual" ? "manual" : "google",
    googleResourceName: row.google_resource_name || undefined,
    createdAt: row.created_at,
  };
}

function selectContactByGoogleResource(
  userId: string,
  opportunityId: string,
  googleResourceName: string,
): OpportunityContact | null {
  const row = db
    .prepare(
      `
      SELECT id, user_id, opportunity_id, name, email, phone, company, title,
             source, google_resource_name, created_at
      FROM opportunity_contacts
      WHERE user_id = ? AND opportunity_id = ? AND google_resource_name = ?
      LIMIT 1
    `,
    )
    .get(userId, opportunityId, googleResourceName) as
    | OpportunityContactRow
    | undefined;

  return row ? mapContact(row) : null;
}

export function getContactsForOpportunity(
  opportunityId: string,
  userId: string,
): OpportunityContact[] {
  ensureSchema();
  const rows = db
    .prepare(
      `
      SELECT id, user_id, opportunity_id, name, email, phone, company, title,
             source, google_resource_name, created_at
      FROM opportunity_contacts
      WHERE user_id = ? AND opportunity_id = ?
      ORDER BY created_at DESC, name ASC
    `,
    )
    .all(userId, opportunityId) as OpportunityContactRow[];

  return rows.map(mapContact);
}

export function addContactToOpportunity(
  input: AddOpportunityContactInput,
  userId: string,
): OpportunityContact {
  ensureSchema();
  const id = generateId();
  const source = input.source ?? "google";

  try {
    db.prepare(
      `
      INSERT INTO opportunity_contacts (
        id, user_id, opportunity_id, name, email, phone, company, title,
        source, google_resource_name
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    ).run(
      id,
      userId,
      input.opportunityId,
      input.name,
      input.email || null,
      input.phone || null,
      input.company || null,
      input.title || null,
      source,
      input.googleResourceName || null,
    );
  } catch (error) {
    if (input.googleResourceName) {
      const existing = selectContactByGoogleResource(
        userId,
        input.opportunityId,
        input.googleResourceName,
      );
      if (existing) return existing;
    }
    throw error;
  }

  const row = db
    .prepare(
      `
      SELECT id, user_id, opportunity_id, name, email, phone, company, title,
             source, google_resource_name, created_at
      FROM opportunity_contacts
      WHERE id = ? AND user_id = ?
    `,
    )
    .get(id, userId) as OpportunityContactRow | undefined;

  if (!row) {
    throw new Error("Failed to read inserted opportunity contact");
  }

  return mapContact(row);
}

export function deleteOpportunityContact(id: string, userId: string): boolean {
  ensureSchema();
  const result = db
    .prepare(
      `
      DELETE FROM opportunity_contacts
      WHERE id = ? AND user_id = ?
    `,
    )
    .run(id, userId) as { changes?: number };

  return (result.changes ?? 0) > 0;
}
