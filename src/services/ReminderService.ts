import { Reminder, ReminderType } from "../models/Reminder";
import { CreateOneTimeReminderRequest } from "../models/requests/CreateOneTimeReminderRequest";
import { CreateRepeatingReminderRequest } from "../models/requests/CreateRepeatingReminderRequest";
import { CreateRequest } from "../models/requests/CreateRequest";
import { CloudStorageClient } from "./client/CloudStorageClient";
import { ReminderApiClient } from "./client/ReminderApiClient";
import { ReminderStorageClient } from "./client/ReminderStorageClient";

type Subscriber = (reminders: Reminder[]) => void;

class ReminderService {

    private reminders: Reminder[] = [];
    private subscribers: Subscriber[] = [];
    private storageClient: ReminderStorageClient;

    constructor() {

        if (import.meta.env.VITE_STORAGE_TYPE === 'api') {
            this.storageClient = new ReminderApiClient();
        } else {
            this.storageClient = new CloudStorageClient();
        }

        this.fetchReminders();
    }

    public getReminders(): Reminder[] {
        return [...this.reminders];
    }

    public getReminder(id: string): Reminder | undefined {
        return this.reminders.find((reminder) => reminder.id === id);
    }

    public saveOneTimeReminder(text: string, time: string, dateString: string, epochMillis: number) {
        console.log(`Saving one time reminder - ${text}`);

        const request: CreateOneTimeReminderRequest = {
            type: ReminderType.ONE_TIME,
            text: text,
            date_string: dateString,
            time: time,
            epoch_millis: epochMillis,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }

        this.saveReminder(request);
    }

    public saveRepeatingReminder(text: string, time: string, days: string[]) {
        console.log(`Saving repeating reminder - ${text}`);

        const request: CreateRepeatingReminderRequest = {
            type: ReminderType.REPEATING,
            text: text,
            time: time,
            days: days,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }

        this.saveReminder(request);
    }

    public removeReminder(id: string): void {
        console.log(`Removing reminder ${id}`)
        this.storageClient.deleteReminder(id).then(() => this.fetchReminders());
    }

    private fetchReminders(): void {
        console.log('Fetching reminders');
        this.storageClient.getReminders().then(reminders => {
            this.reminders = reminders;
            this.notifySubscribers();
        });
    }

    private saveReminder(request: CreateRequest): void {
        this.storageClient.saveReminder(request).then(() => this.fetchReminders())
    }

    public subscribe(callback: Subscriber): void {
        this.subscribers.push(callback);
    }

    public unsubscribe(callback: Subscriber): void {
        this.subscribers = this.subscribers.filter(sub => sub !== callback);
    }

    private notifySubscribers(): void {
        this.subscribers.forEach(callback => callback(this.reminders));
    }

}

const reminderService = new ReminderService();
export default reminderService;