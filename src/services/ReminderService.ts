import { OneTimeReminder } from "../models/OneTimeReminder";
import { Reminder } from "../models/Reminder";
import { RepeatingReminder } from "../models/RepeatingReminder";
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

    public addOneTimeReminder(text: string, time: string, dateString: string, date: number) {
        console.log(`Adding one time reminder - ${text}`);
        this.addReminder(new OneTimeReminder(crypto.randomUUID(), Intl.DateTimeFormat().resolvedOptions().timeZone, text, dateString, date, time));
    }

    public addRepeatingReminder(text: string, time: string, days: string[]) {
        console.log(`Adding repeating reminder - ${text}`);
        this.addReminder(new RepeatingReminder(crypto.randomUUID(), Intl.DateTimeFormat().resolvedOptions().timeZone, text, days, time));
    }

    public subscribe(callback: Subscriber): void {
        this.subscribers.push(callback);
    }

    public unsubscribe(callback: Subscriber): void {
        this.subscribers = this.subscribers.filter(sub => sub !== callback);
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

    private addReminder(reminder: Reminder): void {
        this.storageClient.saveReminder(reminder).then((response) => this.fetchReminders())
    }

    private notifySubscribers(): void {
        this.subscribers.forEach(callback => callback(this.reminders));
    }

}

const reminderService = new ReminderService();
export default reminderService;