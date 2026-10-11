import { OPPORTUNITY_CONTACTS_BOOTSTRAP_SQL } from "./bootstrap-sql";
import { getClient } from "./client";
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

let schemaEnsured = false;

async function ensureSchema(): Promise<void> {
  if (schemaEnsured) return;
  await getClient().batch(
    OPPORTUNITY_CONTACTS_BOOTSTRAP_SQL.split(";")
      .map((statement) => statement.trim())
      .filter(Boolean),
  );
  schemaEnsured = true;
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

async function selectContactByGoogleResource(
  userId: string,
  opportunityId: string,
  googleResourceName: string,
): Promise<OpportunityContact | null> {
  const result = await getClient().execute({
    sql: `
      SELECT id, user_id, opportunity_id, name, email, phone, company, title,
             source, google_resource_name, created_at
      FROM opportunity_contacts
      WHERE user_id = ? AND opportunity_id = ? AND google_resource_name = ?
      LIMIT 1
    `,
    args: [userId, opportunityId, googleResourceName],
  });
  const row = result.rows[0] as unknown as OpportunityContactRow | undefined;

  return row ? mapContact(row) : null;
}

export async function getContactsForOpportunity(
  opportunityId: string,
  userId: string,
): Promise<OpportunityContact[]> {
  await ensureSchema();
  const result = await getClient().execute({
    sql: `
      SELECT id, user_id, opportunity_id, name, email, phone, company, title,
             source, google_resource_name, created_at
      FROM opportunity_contacts
      WHERE user_id = ? AND opportunity_id = ?
      ORDER BY created_at DESC, name ASC
    `,
    args: [userId, opportunityId],
  });

  return (result.rows as unknown as OpportunityContactRow[]).map(mapContact);
}

export async function addContactToOpportunity(
  input: AddOpportunityContactInput,
  userId: string,
): Promise<OpportunityContact> {
  await ensureSchema();
  const id = generateId();
  const source = input.source ?? "google";

  try {
    await getClient().execute({
      sql: `
        INSERT INTO opportunity_contacts (
          id, user_id, opportunity_id, name, email, phone, company, title,
          source, google_resource_name
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
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
      ],
    });
  } catch (error) {
    if (input.googleResourceName) {
      const existing = await selectContactByGoogleResource(
        userId,
        input.opportunityId,
        input.googleResourceName,
      );
      if (existing) return existing;
    }
    throw error;
  }

  const result = await getClient().execute({
    sql: `
      SELECT id, user_id, opportunity_id, name, email, phone, company, title,
             source, google_resource_name, created_at
      FROM opportunity_contacts
      WHERE id = ? AND user_id = ?
    `,
    args: [id, userId],
  });
  const row = result.rows[0] as unknown as OpportunityContactRow | undefined;

  if (!row) {
    throw new Error("Failed to read inserted opportunity contact");
  }

  return mapContact(row);
}

export async function deleteOpportunityContact(
  id: string,
  userId: string,
): Promise<boolean> {
  await ensureSchema();
  const result = await getClient().execute({
    sql: `
      DELETE FROM opportunity_contacts
      WHERE id = ? AND user_id = ?
    `,
    args: [id, userId],
  });

  return result.rowsAffected > 0;
}
