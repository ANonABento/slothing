/**
 * Google Contacts Operations
 *
 * Import contacts for networking, save recruiter contacts
 */

import { google } from "googleapis";
import { createPeopleClient } from "./client";

export interface GoogleContact {
  resourceName: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  notes?: string;
}

export interface CreateContactInput {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  notes?: string;
}

/**
 * List contacts from Google
 */
export async function listContacts(
  pageSize = 100,
  query?: string
): Promise<GoogleContact[]> {
  try {
    const people = await createPeopleClient();

    const response = await people.people.connections.list({
      resourceName: "people/me",
      pageSize,
      personFields:
        "names,emailAddresses,phoneNumbers,organizations,biographies",
    });

    const contacts: GoogleContact[] = [];
    for (const person of response.data.connections || []) {
      const contact: GoogleContact = {
        resourceName: person.resourceName!,
        name: person.names?.[0]?.displayName || "Unknown",
        email: person.emailAddresses?.[0]?.value ?? undefined,
        phone: person.phoneNumbers?.[0]?.value ?? undefined,
        company: person.organizations?.[0]?.name ?? undefined,
        title: person.organizations?.[0]?.title ?? undefined,
        notes: person.biographies?.[0]?.value ?? undefined,
      };

      // Filter by query if provided
      if (query) {
        const searchStr =
          `${contact.name} ${contact.email} ${contact.company}`.toLowerCase();
        if (!searchStr.includes(query.toLowerCase())) {
          continue;
        }
      }

      contacts.push(contact);
    }

    return contacts;
  } catch (error) {
    console.error("Failed to list contacts:", error);
    return [];
  }
}

/**
 * Get a single contact by resource name
 */
export async function getContact(
  resourceName: string
): Promise<GoogleContact | null> {
  try {
    const people = await createPeopleClient();

    const response = await people.people.get({
      resourceName,
      personFields:
        "names,emailAddresses,phoneNumbers,organizations,biographies",
    });

    return {
      resourceName: response.data.resourceName!,
      name: response.data.names?.[0]?.displayName || "Unknown",
      email: response.data.emailAddresses?.[0]?.value ?? undefined,
      phone: response.data.phoneNumbers?.[0]?.value ?? undefined,
      company: response.data.organizations?.[0]?.name ?? undefined,
      title: response.data.organizations?.[0]?.title ?? undefined,
      notes: response.data.biographies?.[0]?.value ?? undefined,
    };
  } catch (error) {
    console.error("Failed to get contact:", error);
    return null;
  }
}

/**
 * Create a new contact
 */
export async function createContact(
  contact: CreateContactInput
): Promise<string | null> {
  try {
    const people = await createPeopleClient();

    // Parse name into given/family if possible
    const nameParts = contact.name.split(" ");
    const givenName = nameParts[0];
    const familyName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : undefined;

    const response = await people.people.createContact({
      requestBody: {
        names: [
          {
            givenName,
            familyName,
          },
        ],
        emailAddresses: contact.email ? [{ value: contact.email }] : undefined,
        phoneNumbers: contact.phone ? [{ value: contact.phone }] : undefined,
        organizations: contact.company
          ? [
              {
                name: contact.company,
                title: contact.title,
              },
            ]
          : undefined,
        biographies: contact.notes
          ? [{ value: contact.notes, contentType: "TEXT_PLAIN" }]
          : undefined,
      },
    });

    return response.data.resourceName || null;
  } catch (error) {
    console.error("Failed to create contact:", error);
    return null;
  }
}

/**
 * Update contact notes
 */
export async function updateContactNotes(
  resourceName: string,
  notes: string
): Promise<boolean> {
  try {
    const people = await createPeopleClient();

    // Get current etag
    const current = await people.people.get({
      resourceName,
      personFields: "biographies",
    });

    await people.people.updateContact({
      resourceName,
      updatePersonFields: "biographies",
      requestBody: {
        etag: current.data.etag,
        biographies: [{ value: notes, contentType: "TEXT_PLAIN" }],
      },
    });

    return true;
  } catch (error) {
    console.error("Failed to update contact:", error);
    return false;
  }
}

/**
 * Delete a contact
 */
export async function deleteContact(resourceName: string): Promise<boolean> {
  try {
    const people = await createPeopleClient();

    await people.people.deleteContact({
      resourceName,
    });

    return true;
  } catch (error) {
    console.error("Failed to delete contact:", error);
    return false;
  }
}

/**
 * Search contacts by company
 */
export async function searchContactsByCompany(
  company: string
): Promise<GoogleContact[]> {
  const allContacts = await listContacts(500);
  return allContacts.filter((c) =>
    c.company?.toLowerCase().includes(company.toLowerCase())
  );
}

/**
 * Search contacts by email domain
 */
export async function searchContactsByEmailDomain(
  domain: string
): Promise<GoogleContact[]> {
  const allContacts = await listContacts(500);
  return allContacts.filter((c) =>
    c.email?.toLowerCase().includes(domain.toLowerCase())
  );
}

/**
 * Create recruiter contact from job email
 */
export async function createRecruiterContact(
  name: string,
  email: string,
  company: string,
  jobTitle?: string
): Promise<string | null> {
  const notes = jobTitle
    ? `Recruiting for: ${jobTitle}\n\nMet during job search - ${new Date().toLocaleDateString()}`
    : `Met during job search - ${new Date().toLocaleDateString()}`;

  return createContact({
    name,
    email,
    company,
    title: "Recruiter",
    notes,
  });
}

/**
 * Create hiring manager contact
 */
export async function createHiringManagerContact(
  name: string,
  email: string,
  company: string,
  department?: string
): Promise<string | null> {
  const notes = department
    ? `Hiring Manager - ${department}\n\nMet during job search - ${new Date().toLocaleDateString()}`
    : `Hiring Manager\n\nMet during job search - ${new Date().toLocaleDateString()}`;

  return createContact({
    name,
    email,
    company,
    title: "Hiring Manager",
    notes,
  });
}
