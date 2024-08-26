import { Reminder, ReminderType } from "./Reminder";

export class OneTimeReminder implements Reminder {

    public readonly type: ReminderType = ReminderType.ONE_TIME;

    constructor(
        public readonly id: string,
        public readonly text: string,
        public readonly date: string,
        public readonly time: string) {
    }
    
    getDescription(): string {
        return `On ${this.date} at ${this.time}`;
    }
}