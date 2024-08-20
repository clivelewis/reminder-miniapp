import WebApp from "@twa-dev/sdk";
import { Reminder, Type } from "../models/Reminder";

type Subscriber = (reminders: Reminder[]) => void;

class ReminderService {

    private static readonly KEY_PREFIX = "rem_"
    private reminders: Reminder[] = [];
    private subscribers: Subscriber[] = [];

    constructor() {
        this.fetchReminders();
    }

    public getReminders(): Reminder[] {
        return this.reminders
    }

    public getReminder(id: string): Reminder | undefined {
        return this.reminders.find((reminder) => reminder.id === id)
    }

    public addOneTimeReminder(text: string, date: Date) {
        this.addReminder({
            id: this.generateId(),
            text: text,
            date: date,
            type: Type.ONE_TIME
        });
    }

    public addRepeatingReminder(text: string, time: string, days: string[]) {
        this.addReminder({
            id: this.generateId(),
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
        WebApp.CloudStorage.removeItem(id)
        this.reminders = this.reminders.filter(r => r.id != id)
        this.notifySubscribers()
    }

    private fetchReminders(): void {
        WebApp.CloudStorage.getKeys((error, keys) => {
            if (error || !keys) {
                console.error(`Error while fetching CloudStorage keys - ${error || 'keys are undefined'}`);
            } else {
                this.loadReminders(keys);
            }
        });
    }

    private loadReminders(keys: string[]): void {
        WebApp.CloudStorage.getItems(keys, (_, result) => {
            for (const key in result) {
                if (key.startsWith(ReminderService.KEY_PREFIX)) {
                    this.reminders.push(JSON.parse(result[key]));
                }
            }
            this.notifySubscribers();
        });
    }

    private addReminder(reminder: Reminder): void {
        WebApp.CloudStorage.setItem(reminder.id, JSON.stringify(reminder))
        this.reminders.push(reminder)
        this.notifySubscribers()
    }



    private generateId(): string {
        return ReminderService.KEY_PREFIX + crypto.randomUUID()
    }

    private notifySubscribers(): void {
        this.subscribers.forEach(callback => callback(this.reminders));
    }

}

const reminderService = new ReminderService();
export default reminderService;