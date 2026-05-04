import { db, profile, experiences, education, skills, projects, certifications, eq, and } from '../index';
import { generateId } from '@/lib/utils';
import type { Profile, Skill } from '@/types';

// Valid skill categories
const validSkillCategories = ['technical', 'soft', 'language', 'tool', 'other'] as const;
type ValidSkillCategory = typeof validSkillCategories[number];

// Valid skill proficiencies
const validProficiencies = ['beginner', 'intermediate', 'advanced', 'expert'] as const;
type ValidProficiency = typeof validProficiencies[number];

// Get profile for a user
export async function getProfile(userId: string): Promise<Profile | null> {
  const profileRows = await db.select().from(profile)
    .where(eq(profile.userId, userId));

  if (profileRows.length === 0) return null;
  const profileRow = profileRows[0];

  const experienceRows = await db.select().from(experiences)
    .where(eq(experiences.userId, userId));

  const educationRows = await db.select().from(education)
    .where(eq(education.userId, userId));

  const skillRows = await db.select().from(skills)
    .where(eq(skills.userId, userId));

  const projectRows = await db.select().from(projects)
    .where(eq(projects.userId, userId));

  const certificationRows = await db.select().from(certifications)
    .where(eq(certifications.userId, userId));

  const now = new Date().toISOString();

  return {
    id: profileRow.id,
    contact: profileRow.contactJson ? JSON.parse(profileRow.contactJson) : { name: '' },
    summary: profileRow.summary ?? undefined,
    rawText: profileRow.rawText ?? undefined,
    experiences: experienceRows.map((e) => ({
      id: e.id,
      company: e.company,
      title: e.title,
      location: e.location ?? undefined,
      startDate: e.startDate ?? '',
      endDate: e.endDate ?? undefined,
      current: e.current ?? false,
      description: e.description ?? '',
      highlights: e.highlightsJson ? JSON.parse(e.highlightsJson) : [],
      skills: e.skillsJson ? JSON.parse(e.skillsJson) : [],
    })),
    education: educationRows.map((e) => ({
      id: e.id,
      institution: e.institution,
      degree: e.degree,
      field: e.field ?? '',
      startDate: e.startDate ?? undefined,
      endDate: e.endDate ?? undefined,
      gpa: e.gpa ?? undefined,
      highlights: e.highlightsJson ? JSON.parse(e.highlightsJson) : [],
    })),
    skills: skillRows.map((s): Skill => {
      const category = s.category as ValidSkillCategory;
      const proficiency = s.proficiency as ValidProficiency | null;
      return {
        id: s.id,
        name: s.name,
        category: validSkillCategories.includes(category) ? category : 'other',
        proficiency: proficiency && validProficiencies.includes(proficiency) ? proficiency : undefined,
      };
    }),
    projects: projectRows.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description ?? '',
      url: p.url ?? undefined,
      technologies: p.technologiesJson ? JSON.parse(p.technologiesJson) : [],
      highlights: p.highlightsJson ? JSON.parse(p.highlightsJson) : [],
    })),
    certifications: certificationRows.map((c) => ({
      id: c.id,
      name: c.name,
      issuer: c.issuer,
      date: c.issueDate ?? undefined,
      url: c.url ?? undefined,
    })),
    createdAt: profileRow.createdAt ?? now,
    updatedAt: profileRow.updatedAt ?? now,
  };
}

// Create or get profile for a user
export async function getOrCreateProfile(userId: string): Promise<Profile> {
  let existing = await getProfile(userId);

  if (!existing) {
    const profileId = generateId();
    await db.insert(profile).values({
      id: profileId,
      userId,
    });
    existing = await getProfile(userId);
  }

  return existing!;
}

// Update profile for a user
export async function updateProfile(userId: string, profileData: Partial<Profile>): Promise<void> {
  // Ensure profile exists
  await getOrCreateProfile(userId);

  // Get profile ID
  const profileRows = await db.select().from(profile)
    .where(eq(profile.userId, userId));
  const profileId = profileRows[0].id;

  // Update main profile
  if (profileData.contact || profileData.summary || profileData.rawText) {
    await db.update(profile)
      .set({
        contactJson: profileData.contact ? JSON.stringify(profileData.contact) : undefined,
        summary: profileData.summary,
        rawText: profileData.rawText,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(profile.userId, userId));
  }

  // Update experiences
  if (profileData.experiences) {
    await db.delete(experiences).where(eq(experiences.userId, userId));

    for (const exp of profileData.experiences) {
      await db.insert(experiences).values({
        id: exp.id || generateId(),
        userId,
        profileId,
        company: exp.company,
        title: exp.title,
        location: exp.location ?? null,
        startDate: exp.startDate ?? null,
        endDate: exp.endDate ?? null,
        current: exp.current ?? false,
        description: exp.description ?? null,
        highlightsJson: JSON.stringify(exp.highlights ?? []),
        skillsJson: JSON.stringify(exp.skills ?? []),
      });
    }
  }

  // Update education
  if (profileData.education) {
    await db.delete(education).where(eq(education.userId, userId));

    for (const edu of profileData.education) {
      await db.insert(education).values({
        id: edu.id || generateId(),
        userId,
        profileId,
        institution: edu.institution,
        degree: edu.degree,
        field: edu.field ?? null,
        startDate: edu.startDate ?? null,
        endDate: edu.endDate ?? null,
        gpa: edu.gpa ?? null,
        highlightsJson: JSON.stringify(edu.highlights ?? []),
      });
    }
  }

  // Update skills
  if (profileData.skills) {
    await db.delete(skills).where(eq(skills.userId, userId));

    for (const skill of profileData.skills) {
      await db.insert(skills).values({
        id: skill.id || generateId(),
        userId,
        profileId,
        name: skill.name,
        category: skill.category ?? 'other',
        proficiency: skill.proficiency ?? null,
      });
    }
  }

  // Update projects
  if (profileData.projects) {
    await db.delete(projects).where(eq(projects.userId, userId));

    for (const proj of profileData.projects) {
      await db.insert(projects).values({
        id: proj.id || generateId(),
        userId,
        profileId,
        name: proj.name,
        description: proj.description ?? null,
        url: proj.url ?? null,
        technologiesJson: JSON.stringify(proj.technologies ?? []),
        highlightsJson: JSON.stringify(proj.highlights ?? []),
      });
    }
  }

  // Update certifications
  if (profileData.certifications) {
    await db.delete(certifications).where(eq(certifications.userId, userId));

    for (const cert of profileData.certifications) {
      await db.insert(certifications).values({
        id: cert.id || generateId(),
        userId,
        profileId,
        name: cert.name,
        issuer: cert.issuer,
        issueDate: cert.date ?? null,
        url: cert.url ?? null,
      });
    }
  }
}

// Clear all profile data for a user
export async function clearProfile(userId: string): Promise<void> {
  await db.delete(experiences).where(eq(experiences.userId, userId));
  await db.delete(education).where(eq(education.userId, userId));
  await db.delete(skills).where(eq(skills.userId, userId));
  await db.delete(projects).where(eq(projects.userId, userId));
  await db.delete(certifications).where(eq(certifications.userId, userId));

  await db.update(profile)
    .set({
      contactJson: null,
      summary: null,
      rawText: null,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(profile.userId, userId));
}
