import { Reminder, Type } from "../models/Reminder";
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

    public addOneTimeReminder(text: string, date: Date) {
        this.addReminder({
            id: crypto.randomUUID(),
            text: text,
            date: date,
            type: Type.ONE_TIME
        });
    }

    public addRepeatingReminder(text: string, time: string, days: string[]) {
        this.addReminder({
            id: crypto.randomUUID(),
            text: text,
            time: time,
            days: days,
            type: Type.REPEATING
        });
    }


    public subscribe(callback: Subscriber): void {
        this.subscribers.push(callback);
    }

    public unsubscribe(callback: Subscriber): void {
        this.subscribers = this.subscribers.filter(sub => sub !== callback);
    }

    public removeReminder(id: string): void {
        this.storageClient.deleteReminder(id).then(() => this.fetchReminders());
    }

    private fetchReminders(): void {
        this.storageClient.getReminders().then(reminders => {
            this.reminders = reminders;
            this.notifySubscribers();
        });
    }



    private addReminder(reminder: Reminder): void {
        this.storageClient.saveReminder(reminder).then((response) => this.fetchReminders())
    }

    private notifySubscribers(): void {
        this.subscribers.forEach(callback => callback(this.reminders));
    }

}

const reminderService = new ReminderService();
export default reminderService;