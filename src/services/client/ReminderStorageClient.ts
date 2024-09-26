import { Reminder } from "../../models/Reminder";
import { CreateRequest } from "../../models/requests/CreateRequest";

/**
 * ReminderClient defines the contract for managing reminders.
 * It includes methods for performing CRUD operations on reminders.
 */
export interface ReminderStorageClient {

    /**
     * Retrieves all reminders.
     * @returns A promise that resolves with an array of Reminder objects.
     */
    getReminders(): Promise<Reminder[]>;

    /**
     * Retrieves a specific reminder by its ID.
     * @param id - The ID of the reminder to retrieve.
     * @returns A promise that resolves with the Reminder object or null if not found.
     */
    getReminder(id: string): Promise<Reminder | null>;

    /**
     * Saves a reminder.
     * @param reminder - The Reminder object to save.
     * @returns A promise that resolves when the reminder has been saved.
     */
    saveReminder(reminder: CreateRequest): Promise<void>;

    /**
     * Deletes a specific reminder by its ID.
     * @param id - The ID of the reminder to delete.
     * @returns A promise that resolves when the reminder has been deleted.
     */
    deleteReminder(id: string): Promise<void>;
}