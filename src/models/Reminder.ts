export enum ReminderType {
    ONE_TIME,
    REPEATING
}

export interface Reminder {
    readonly id: string;
    readonly text: string;
    readonly type: ReminderType;

    getDescription(): string;
}