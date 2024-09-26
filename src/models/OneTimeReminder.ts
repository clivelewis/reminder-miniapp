import { Reminder, ReminderType } from "./Reminder";

export class OneTimeReminder implements Reminder {

    public readonly type: ReminderType = ReminderType.ONE_TIME;

    constructor(
        public readonly id: string,
        public readonly timezone: string,
        public readonly text: string,
        public readonly date_string: string,
        public readonly epoch_millis: number,
        public readonly time: string) {
            
    }

    getDescription(): string {
        return `On ${this.date_string} at ${this.time}`;
    }

    public static fromJSON(data: any): OneTimeReminder {

        return new OneTimeReminder(
            data.id,
            data.timezone,
            data.text,
            data.date_string,
            data.epoch_millis,
            data.time
        )
    }
}