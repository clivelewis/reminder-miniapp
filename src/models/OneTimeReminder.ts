import { Reminder, ReminderType } from "./Reminder";

export class OneTimeReminder implements Reminder {

    public readonly type: ReminderType = ReminderType.ONE_TIME;

    constructor(
        public readonly id: string,
        public readonly timezone: string,
        public readonly text: string,
        public readonly dateString: string,
        public readonly date: number,
        public readonly time: string) {
    }

    getDescription(): string {
        return `On ${this.dateString} at ${this.time}`;
    }
}