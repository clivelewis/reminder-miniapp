import { Reminder } from "../../models/Reminder";
import { ReminderStorageClient } from "./ReminderStorageClient";

export class ReminderApiClient implements ReminderStorageClient {

    private baseUrl: string = import.meta.env.VITE_STORAGE_API_BASE_URL;

    constructor() {
        if (this.baseUrl && this.baseUrl.endsWith("/")) this.baseUrl = this.baseUrl.substring(0, this.baseUrl.length - 1);
        console.log('Initializing API Reminder Storage Client')
    }

    public async getReminders(): Promise<Reminder[]> {

        try {
            const response = await fetch(`${this.baseUrl}/reminders`);
            const reminders: Reminder[] = await response.json(); // No need to parse again
            console.log(reminders);
            return reminders; // Return the fetched reminders
        } catch (error) {
            console.error('Error fetching reminders:', error);
            return []; // Return an empty array in case of an error
        }
    
    }

    public async getReminder(id: string): Promise<Reminder | null> {

        try {
            const response = await fetch(`${this.baseUrl}/reminders/${id}`)
            const reminder = await response.json()
            return reminder;
        } catch (error) {
            console.error('Error fetching reminder:', error);
            return null;
        }
    }

    public async saveReminder(reminder: Reminder): Promise<void> {

        return await fetch(`${this.baseUrl}/reminders/`, {
            method: 'POST',
            body: JSON.stringify(reminder)
        }).then();
    }

    public async deleteReminder(id: string): Promise<void> {

        return await fetch(`${this.baseUrl}/reminders/${id}`, {
            method: 'DELETE'
        }).then(response => console.log(response))
    }
}