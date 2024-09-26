export enum ReminderType {
    ONE_TIME = "ONE_TIME",
    REPEATING = "REPEATING"
}

export interface Reminder {
    readonly id: string;
    readonly timezone: String;
    readonly text: string;
    readonly type: ReminderType;

    getDescription(): string;
}