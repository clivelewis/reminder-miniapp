import WebApp from "@twa-dev/sdk";
import { OneTimeReminder } from "../../models/OneTimeReminder";
import { Reminder, ReminderType } from "../../models/Reminder";
import { RepeatingReminder } from "../../models/RepeatingReminder";
import { ReminderStorageClient } from "./ReminderStorageClient";

export class ReminderApiClient implements ReminderStorageClient {

    private baseUrl: string = import.meta.env.VITE_STORAGE_API_BASE_URL;

    constructor() {
        if (this.baseUrl && this.baseUrl.endsWith("/")) this.baseUrl = this.baseUrl.substring(0, this.baseUrl.length - 1);
        console.log('Initializing Reminder API Storage Client')
    }

    public async getReminders(): Promise<Reminder[]> {

        try {
            console.log('Getting all reminders');
            const response = await fetch(`${this.baseUrl}/reminders`, { headers: this.headers() });
            const data = await response.json(); // No need to parse again

            const reminders: Reminder[] = data.map((item: any) => {
                if (item.type === ReminderType.ONE_TIME) {
                    return new OneTimeReminder(item.id, item.timezone, item.text, item.dateString, item.date, item.time);
                } else if (item.type === ReminderType.REPEATING) {
                    return new RepeatingReminder(item.id, item.timezone, item.text, item.days, item.time);
                }
                return null;
            }).filter((item: any): item is Reminder => item !== null);

            return reminders;
        } catch (error) {
            console.error(`Error fetching reminders: ${error}`);
            return []; // Return an empty array in case of an error
        }

    }

    public async getReminder(id: string): Promise<Reminder | null> {

        try {
            console.log(`Getting reminder ${id}`);
            const response = await fetch(`${this.baseUrl}/reminders/${id}`, { headers: this.headers() });
            const reminder = await response.json()
            return reminder;
        } catch (error) {
            console.error('Error fetching reminder:', error);
            return null;
        }
    }

    public async saveReminder(reminder: Reminder): Promise<void> {

        console.log(`Saving reminder ${reminder.id}`);
        return await fetch(`${this.baseUrl}/reminders/`, {
            headers: this.headers(),
            method: 'POST',
            body: JSON.stringify(reminder)
        }).then();
    }

    public async deleteReminder(id: string): Promise<void> {

        console.log(`Deleting reminder ${id}`);
        return await fetch(`${this.baseUrl}/reminders/${id}`, {
            headers: this.headers(),
            method: 'DELETE'
        }).then(response => console.log(response))
    }

    private headers(): HeadersInit {

        return {
            'Content-Type': 'application/json',
            'TelegramInitData': WebApp.initData
        }
    }
}