import WebApp from "@twa-dev/sdk";
import { OneTimeReminder } from "../../models/OneTimeReminder";
import { Reminder, ReminderType } from "../../models/Reminder";
import { RepeatingReminder } from "../../models/RepeatingReminder";
import { ReminderStorageClient } from "./ReminderStorageClient";

/**
 * CloudStorageClient is responsible for managing reminders in the Telegram's WebApp cloud storage.
 * It implements the ReminderClient interface to provide methods for CRUD operations.
 * (!) WebApp cloud storage supports up to 1024 keys per user, but each key can be only up to 4096 bytes long.
 * Because of this, each reminder is a separate key with 'rem_' prefix.
 */
export class CloudStorageClient implements ReminderStorageClient {
    private static readonly KEY_PREFIX = "rem_";

    constructor() {
        console.log('Initializing WebApp Reminder Storage Client')
    }

    /**
     * Retrieves all reminders from cloud storage.
     * @returns Promise that resolves with an array of Reminder objects.
     */
    public async getReminders(): Promise<Reminder[]> {
        console.log(`Getting all reminders from the cloud storage`);
        const keys = await this.getKeys();
        return this.loadReminders(keys.filter(key => key.startsWith(CloudStorageClient.KEY_PREFIX)));
    }

    /**
     * Retrieves a specific reminder by its ID.
     * @param id - The ID of the reminder to retrieve.
     * @returns Promise that resolves with the Reminder object or null if not found.
     */
    public getReminder(id: string): Promise<Reminder | null> {
        console.log(`Getting reminder ${id} from the cloud storage`);
        return this.getItem(CloudStorageClient.KEY_PREFIX + id);
    }

    /**
     * Saves a reminder in cloud storage.
     * @param reminder - The Reminder object to save.
     * @returns Promise that resolves when the reminder is saved.
     */
    saveReminder(reminder: Reminder): Promise<void> {
        console.log(`Saving reminder ${reminder.id} to cloud storage`);
        return this.setItem(CloudStorageClient.KEY_PREFIX + reminder.id, reminder);
    }

    /**
     * Deletes a specific reminder by its ID.
     * @param id - The ID of the reminder to delete.
     * @returns Promise that resolves when the reminder is deleted.
     */
    deleteReminder(id: string): Promise<void> {
        console.log(`Removing reminder ${id} from the cloud storage`);
        return this.removeItem(CloudStorageClient.KEY_PREFIX + id);
    }

    /**
     * Retrieves **all** keys from cloud storage.
     * @returns Promise that resolves with an array of keys.
     */
    private getKeys(): Promise<string[]> {
        console.log('Loading keys from cloud storage');
        return new Promise((resolve) => {
            WebApp.CloudStorage.getKeys((error, keys) => {
                if (error || !keys) {
                    console.error(`Error fetching keys - ${error || 'undefined keys'}`);
                    resolve([]);
                } else {
                    resolve(keys);
                }
            });
        });
    }

    /**
     * Retrieves an item from cloud storage by its key.
     * @param key - The key of the item to retrieve.
     * @returns Promise that resolves with the Reminder object or null if not found.
     */
    private getItem(key: string): Promise<Reminder | null> {
        return new Promise((resolve) => {
            WebApp.CloudStorage.getItem(key, (error, result) => {
                if (error) return resolve(null);
                resolve(result ? JSON.parse(result) : null);
            });
        });
    }

    /**
     * Saves an object in cloud storage with a specified key.
     * @param key - The key under which to save the object.
     * @param obj - The object to save.
     * @returns Promise that resolves when the object is saved.
     */
    private setItem<T>(key: string, obj: T): Promise<void> {
        return new Promise((resolve) => {
            WebApp.CloudStorage.setItem(key, JSON.stringify(obj), () => resolve());
        });
    }

    /**
     * Removes an item from cloud storage by its key.
     * @param key - The key of the item to remove.
     * @returns Promise that resolves when the item is removed.
     */
    private removeItem(key: string): Promise<void> {
        return new Promise((resolve) => {
            WebApp.CloudStorage.removeItem(key, () => resolve());
        });
    }

    /**
     * Loads reminders from cloud storage using an array of keys.
     * @param keys - The array of keys to load reminders from.
     * @returns Promise that resolves with an array of Reminder objects.
     */
    private loadReminders(keys: string[]): Promise<Reminder[]> {
        return new Promise((resolve, reject) => {
            WebApp.CloudStorage.getItems(keys, (error, result) => {
                if (error || !result) return reject(error);
                const reminders: Reminder[] = Object.keys(result)
                    .filter(key => key.startsWith(CloudStorageClient.KEY_PREFIX))
                    .map(key => {
                        const item = JSON.parse(result[key])
                        if (item.type === ReminderType.ONE_TIME) {
                            return new OneTimeReminder(item.id, item.text, item.date, item.time);
                        } else {
                            return new RepeatingReminder(item.id, item.text, item.days, item.time);
                        }
                    });

                resolve(reminders);
            });
        });
    }
}