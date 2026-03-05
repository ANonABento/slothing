/**
 * Google Tasks Operations
 *
 * Sync reminders to Google Tasks, create follow-up tasks
 */

import { createTasksClient } from "./client";
import type { Reminder } from "@/lib/db/reminders";

export interface GoogleTask {
  id: string;
  title: string;
  notes?: string;
  due?: string;
  status: "needsAction" | "completed";
  updated?: string;
}

export interface CreateTaskInput {
  title: string;
  notes?: string;
  due?: Date;
}

const JOB_SEARCH_TASK_LIST = "Job Search";

/**
 * Get or create "Job Search" task list
 */
export async function getOrCreateJobSearchTaskList(): Promise<string | null> {
  try {
    const tasks = await createTasksClient();

    // Check for existing list
    const lists = await tasks.tasklists.list();
    const existing = lists.data.items?.find(
      (l) => l.title === JOB_SEARCH_TASK_LIST
    );
    if (existing?.id) return existing.id;

    // Create new list
    const created = await tasks.tasklists.insert({
      requestBody: { title: JOB_SEARCH_TASK_LIST },
    });

    return created.data.id || null;
  } catch (error) {
    console.error("Failed to get/create task list:", error);
    return null;
  }
}

/**
 * List all task lists
 */
export async function listTaskLists(): Promise<
  { id: string; title: string }[]
> {
  try {
    const tasks = await createTasksClient();

    const response = await tasks.tasklists.list();

    return (response.data.items || []).map((list) => ({
      id: list.id!,
      title: list.title || "Untitled",
    }));
  } catch (error) {
    console.error("Failed to list task lists:", error);
    return [];
  }
}

/**
 * List tasks from Job Search list
 */
export async function listJobSearchTasks(
  showCompleted = true
): Promise<GoogleTask[]> {
  try {
    const tasks = await createTasksClient();
    const listId = await getOrCreateJobSearchTaskList();
    if (!listId) return [];

    const response = await tasks.tasks.list({
      tasklist: listId,
      showCompleted,
      maxResults: 100,
    });

    return (response.data.items || []).map((task) => ({
      id: task.id!,
      title: task.title || "",
      notes: task.notes || undefined,
      due: task.due || undefined,
      status: task.status as "needsAction" | "completed",
      updated: task.updated || undefined,
    }));
  } catch (error) {
    console.error("Failed to list tasks:", error);
    return [];
  }
}

/**
 * Get a single task
 */
export async function getTask(taskId: string): Promise<GoogleTask | null> {
  try {
    const tasks = await createTasksClient();
    const listId = await getOrCreateJobSearchTaskList();
    if (!listId) return null;

    const response = await tasks.tasks.get({
      tasklist: listId,
      task: taskId,
    });

    return {
      id: response.data.id!,
      title: response.data.title || "",
      notes: response.data.notes || undefined,
      due: response.data.due || undefined,
      status: response.data.status as "needsAction" | "completed",
      updated: response.data.updated || undefined,
    };
  } catch (error) {
    console.error("Failed to get task:", error);
    return null;
  }
}

/**
 * Create a task
 */
export async function createTask(task: CreateTaskInput): Promise<string | null> {
  try {
    const tasks = await createTasksClient();
    const listId = await getOrCreateJobSearchTaskList();
    if (!listId) return null;

    const response = await tasks.tasks.insert({
      tasklist: listId,
      requestBody: {
        title: task.title,
        notes: task.notes,
        due: task.due?.toISOString(),
      },
    });

    return response.data.id || null;
  } catch (error) {
    console.error("Failed to create task:", error);
    return null;
  }
}

/**
 * Update a task
 */
export async function updateTask(
  taskId: string,
  updates: Partial<CreateTaskInput>
): Promise<boolean> {
  try {
    const tasks = await createTasksClient();
    const listId = await getOrCreateJobSearchTaskList();
    if (!listId) return false;

    await tasks.tasks.patch({
      tasklist: listId,
      task: taskId,
      requestBody: {
        title: updates.title,
        notes: updates.notes,
        due: updates.due?.toISOString(),
      },
    });

    return true;
  } catch (error) {
    console.error("Failed to update task:", error);
    return false;
  }
}

/**
 * Complete a task
 */
export async function completeTask(taskId: string): Promise<boolean> {
  try {
    const tasks = await createTasksClient();
    const listId = await getOrCreateJobSearchTaskList();
    if (!listId) return false;

    await tasks.tasks.patch({
      tasklist: listId,
      task: taskId,
      requestBody: { status: "completed" },
    });

    return true;
  } catch (error) {
    console.error("Failed to complete task:", error);
    return false;
  }
}

/**
 * Uncomplete a task (mark as needs action)
 */
export async function uncompleteTask(taskId: string): Promise<boolean> {
  try {
    const tasks = await createTasksClient();
    const listId = await getOrCreateJobSearchTaskList();
    if (!listId) return false;

    await tasks.tasks.patch({
      tasklist: listId,
      task: taskId,
      requestBody: { status: "needsAction" },
    });

    return true;
  } catch (error) {
    console.error("Failed to uncomplete task:", error);
    return false;
  }
}

/**
 * Delete a task
 */
export async function deleteTask(taskId: string): Promise<boolean> {
  try {
    const tasks = await createTasksClient();
    const listId = await getOrCreateJobSearchTaskList();
    if (!listId) return false;

    await tasks.tasks.delete({
      tasklist: listId,
      task: taskId,
    });

    return true;
  } catch (error) {
    console.error("Failed to delete task:", error);
    return false;
  }
}

/**
 * Sync app reminder to Google Tasks
 */
export async function syncReminderToTasks(
  reminder: Reminder,
  jobInfo?: { title?: string; company?: string }
): Promise<string | null> {
  let notes = reminder.description || "";

  if (jobInfo?.title || jobInfo?.company) {
    const jobLabel =
      jobInfo.title && jobInfo.company
        ? `${jobInfo.title} at ${jobInfo.company}`
        : jobInfo.title || jobInfo.company;
    notes = notes ? `${notes}\n\nRelated to: ${jobLabel}` : `Related to: ${jobLabel}`;
  }

  return createTask({
    title: reminder.title,
    notes: notes || undefined,
    due: new Date(reminder.dueDate),
  });
}

/**
 * Create follow-up task after interview
 */
export async function createFollowUpTask(
  company: string,
  role: string,
  interviewDate: Date
): Promise<string | null> {
  // Task due 24 hours after interview
  const dueDate = new Date(interviewDate);
  dueDate.setDate(dueDate.getDate() + 1);

  return createTask({
    title: `Send thank you email to ${company}`,
    notes: `Follow up after your ${role} interview at ${company}.\n\nInterview date: ${interviewDate.toLocaleDateString()}`,
    due: dueDate,
  });
}

/**
 * Create application deadline task
 */
export async function createDeadlineTask(
  company: string,
  role: string,
  deadline: Date
): Promise<string | null> {
  // Reminder 2 days before deadline
  const reminderDate = new Date(deadline);
  reminderDate.setDate(reminderDate.getDate() - 2);

  return createTask({
    title: `Apply to ${role} at ${company}`,
    notes: `Application deadline: ${deadline.toLocaleDateString()}\n\nDon't forget to submit your application!`,
    due: reminderDate,
  });
}

/**
 * Create networking follow-up task
 */
export async function createNetworkingFollowUpTask(
  contactName: string,
  company: string,
  context?: string
): Promise<string | null> {
  // Follow up in 1 week
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);

  return createTask({
    title: `Follow up with ${contactName} at ${company}`,
    notes: context
      ? `Context: ${context}\n\nReach out to maintain the connection.`
      : "Reach out to maintain the connection.",
    due: dueDate,
  });
}
