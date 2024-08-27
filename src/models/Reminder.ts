export enum ReminderType {
    ONE_TIME,
    REPEATING
}

export interface Reminder {
    readonly id: string;
    readonly timezone: String;
    readonly text: string;
    readonly type: ReminderType;

    getDescription(): string;
}