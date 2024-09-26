import WebApp from "@twa-dev/sdk";
import { OneTimeReminder } from "../../models/OneTimeReminder";
import { Reminder, ReminderType } from "../../models/Reminder";
import { RepeatingReminder } from "../../models/RepeatingReminder";
import { ReminderStorageClient } from "./ReminderStorageClient";
import { CreateRequest } from "../../models/requests/CreateRequest";

export class ReminderApiClient implements ReminderStorageClient {

    private baseUrl: string = import.meta.env.VITE_STORAGE_API_BASE_URL;

    constructor() {
        if (this.baseUrl && this.baseUrl.endsWith("/")) this.baseUrl = this.baseUrl.substring(0, this.baseUrl.length - 1);
        console.log('Initializing Reminder API Storage Client')
    }

        public async getReminders(): Promise<Reminder[]> {

        try {
            console.log('[API] Fetching all reminders');
            const response = await fetch(`${this.baseUrl}/reminders`, { headers: this.headers() });
            const data = await response.json(); // No need to parse again

            const reminders: Reminder[] = data.map((item: any) => {
                if (item.type === ReminderType.ONE_TIME) {
                    return OneTimeReminder.fromJSON(item)
                } else if (item.type === ReminderType.REPEATING) {
                    return RepeatingReminder.fromJSON(item)
                }
                return null;
            }).filter((item: any): item is Reminder => item !== null);

            return reminders;
        } catch (error) {
            console.error(`[API] Error fetching reminders: ${error}`);
            return []; // Return an empty array in case of an error
        }

    }

    public async getReminder(id: string): Promise<Reminder | null> {

        try {
            console.log(`[API] Getting reminder ${id}`);
            const response = await fetch(`${this.baseUrl}/reminders/${id}`, { headers: this.headers() });
            const reminder = await response.json()
            return reminder;
        } catch (error) {
            console.error('[API] Error fetching reminder:', error);
            return null;
        }
    }

    public async saveReminder(request: CreateRequest): Promise<void> {

        console.log(`[API] Saving reminder ${request}`);

        return await fetch(`${this.baseUrl}/reminders`, {
            headers: this.headers(),
            method: 'POST',
            body: JSON.stringify(request)
        }).then();
    
    }

    public async deleteReminder(id: string): Promise<void> {

        console.log(`[API] Deleting reminder ${id}`);
        return await fetch(`${this.baseUrl}/reminders/${id}`, {
            headers: this.headers(),
            method: 'DELETE'
        }).then()
    }

    private headers(): HeadersInit {

        return {
            'Content-Type': 'application/json',
            'TelegramInitData': WebApp.initData
        }
    }
}