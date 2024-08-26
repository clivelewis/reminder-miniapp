import { Reminder, ReminderType } from "./Reminder";

export class RepeatingReminder implements Reminder {

    public readonly type: ReminderType = ReminderType.REPEATING;

    constructor(
        public readonly id: string,
        public readonly text: string,
        public readonly days: string[],
        public readonly time: string) {
    }

    public getDescription(): string {
        var formattedDays = this.days.length > 2 ? this.days.map(value => value.substring(0, 3)).join(", ") : this.days.join(", ");
        return `Every ${formattedDays} at ${this.time}`;
    }
}