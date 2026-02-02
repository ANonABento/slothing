import { pgTable, text, timestamp, integer, real, boolean } from 'drizzle-orm/pg-core';

// Settings table (global, no userId)
export const settings = pgTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Documents table
export const documents = pgTable('documents', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  filename: text('filename').notNull(),
  type: text('type').notNull(),
  mimeType: text('mime_type').notNull(),
  size: integer('size').notNull(),
  path: text('path').notNull(),
  extractedText: text('extracted_text'),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
});

// Profile table
export const profile = pgTable('profile', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().unique(),
  contactJson: text('contact_json'),
  summary: text('summary'),
  rawText: text('raw_text'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Experiences table
export const experiences = pgTable('experiences', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  profileId: text('profile_id').notNull(),
  company: text('company').notNull(),
  title: text('title').notNull(),
  location: text('location'),
  startDate: text('start_date'),
  endDate: text('end_date'),
  current: boolean('current').default(false),
  description: text('description'),
  highlightsJson: text('highlights_json'),
  skillsJson: text('skills_json'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Education table
export const education = pgTable('education', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  profileId: text('profile_id').notNull(),
  institution: text('institution').notNull(),
  degree: text('degree').notNull(),
  field: text('field'),
  startDate: text('start_date'),
  endDate: text('end_date'),
  gpa: text('gpa'),
  highlightsJson: text('highlights_json'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Skills table
export const skills = pgTable('skills', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  profileId: text('profile_id').notNull(),
  name: text('name').notNull(),
  category: text('category').default('other'),
  proficiency: text('proficiency'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Projects table
export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  profileId: text('profile_id').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  url: text('url'),
  technologiesJson: text('technologies_json'),
  highlightsJson: text('highlights_json'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Certifications table
export const certifications = pgTable('certifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  profileId: text('profile_id').notNull(),
  name: text('name').notNull(),
  issuer: text('issuer').notNull(),
  issueDate: text('issue_date'),
  expiryDate: text('expiry_date'),
  credentialId: text('credential_id'),
  url: text('url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Jobs table
export const jobs = pgTable('jobs', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  company: text('company').notNull(),
  location: text('location'),
  type: text('type'),
  remote: boolean('remote').default(false),
  salary: text('salary'),
  description: text('description').notNull(),
  requirementsJson: text('requirements_json'),
  responsibilitiesJson: text('responsibilities_json'),
  keywordsJson: text('keywords_json'),
  url: text('url'),
  status: text('status').default('saved'),
  appliedAt: text('applied_at'),
  deadline: text('deadline'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Generated resumes table
export const generatedResumes = pgTable('generated_resumes', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  jobId: text('job_id').notNull(),
  profileId: text('profile_id').notNull(),
  contentJson: text('content_json').notNull(),
  pdfPath: text('pdf_path'),
  matchScore: real('match_score'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Interview sessions table
export const interviewSessions = pgTable('interview_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  jobId: text('job_id').notNull(),
  profileId: text('profile_id').notNull(),
  mode: text('mode').default('text'),
  questionsJson: text('questions_json').notNull(),
  status: text('status').default('in_progress'),
  startedAt: timestamp('started_at').defaultNow(),
  completedAt: timestamp('completed_at'),
});

// Interview answers table
export const interviewAnswers = pgTable('interview_answers', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  sessionId: text('session_id').notNull(),
  questionIndex: integer('question_index').notNull(),
  answer: text('answer').notNull(),
  feedback: text('feedback'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Reminders table
export const reminders = pgTable('reminders', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  jobId: text('job_id').notNull(),
  type: text('type').default('follow_up'),
  title: text('title').notNull(),
  description: text('description'),
  dueDate: text('due_date').notNull(),
  completed: boolean('completed').default(false),
  dismissed: boolean('dismissed').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  completedAt: timestamp('completed_at'),
});

// Notifications table
export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  type: text('type').notNull(),
  title: text('title').notNull(),
  message: text('message'),
  link: text('link'),
  read: boolean('read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Company research cache table
export const companyResearch = pgTable('company_research', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  companyName: text('company_name').notNull(),
  summary: text('summary'),
  keyFactsJson: text('key_facts_json'),
  interviewQuestionsJson: text('interview_questions_json'),
  cultureNotes: text('culture_notes'),
  recentNews: text('recent_news'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Cover letters table
export const coverLetters = pgTable('cover_letters', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  jobId: text('job_id').notNull(),
  profileId: text('profile_id').notNull(),
  content: text('content').notNull(),
  highlightsJson: text('highlights_json'),
  version: integer('version').default(1),
  createdAt: timestamp('created_at').defaultNow(),
});

// LLM Settings table (per-user)
export const llmSettings = pgTable('llm_settings', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().unique(),
  provider: text('provider').default('openai'),
  model: text('model'),
  apiKey: text('api_key'),
  baseUrl: text('base_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Type exports for use in application code
export type Settings = typeof settings.$inferSelect;
export type NewSettings = typeof settings.$inferInsert;

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;

export type Profile = typeof profile.$inferSelect;
export type NewProfile = typeof profile.$inferInsert;

export type Experience = typeof experiences.$inferSelect;
export type NewExperience = typeof experiences.$inferInsert;

export type Education = typeof education.$inferSelect;
export type NewEducation = typeof education.$inferInsert;

export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type Certification = typeof certifications.$inferSelect;
export type NewCertification = typeof certifications.$inferInsert;

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;

export type GeneratedResume = typeof generatedResumes.$inferSelect;
export type NewGeneratedResume = typeof generatedResumes.$inferInsert;

export type InterviewSession = typeof interviewSessions.$inferSelect;
export type NewInterviewSession = typeof interviewSessions.$inferInsert;

export type InterviewAnswer = typeof interviewAnswers.$inferSelect;
export type NewInterviewAnswer = typeof interviewAnswers.$inferInsert;

export type Reminder = typeof reminders.$inferSelect;
export type NewReminder = typeof reminders.$inferInsert;

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;

export type CompanyResearch = typeof companyResearch.$inferSelect;
export type NewCompanyResearch = typeof companyResearch.$inferInsert;

export type CoverLetter = typeof coverLetters.$inferSelect;
export type NewCoverLetter = typeof coverLetters.$inferInsert;

export type LlmSettings = typeof llmSettings.$inferSelect;
export type NewLlmSettings = typeof llmSettings.$inferInsert;
