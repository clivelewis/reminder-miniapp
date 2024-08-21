import { Reminder, Type } from "../models/Reminder";
import { CloudStorageClient } from "./client/CloudStorageClient";
import { ReminderStorageClient } from "./client/ReminderStorageClient";

type Subscriber = (reminders: Reminder[]) => void;

class ReminderService {


    private reminders: Reminder[] = [];
    private subscribers: Subscriber[] = [];

    private apiClient: ReminderStorageClient = new CloudStorageClient();

    constructor() {
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
        this.apiClient.deleteReminder(id).then(() => this.fetchReminders());
    }

    private fetchReminders(): void {
        this.apiClient.getReminders().then(reminders => {
            this.reminders = reminders;
            this.notifySubscribers();
        });
    }



    private addReminder(reminder: Reminder): void {
        this.apiClient.saveReminder(reminder).then((response) => this.fetchReminders())
    }

    private notifySubscribers(): void {
        this.subscribers.forEach(callback => callback(this.reminders));
    }

}

const reminderService = new ReminderService();
export default reminderService;