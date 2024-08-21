export enum Type {
    ONE_TIME,
    MULTI,
    REPEATING
}

export interface Reminder {
    id: string;
    text: string;
    type: Type;
    date?: Date;
    time?: string;
    days?: string[]
};