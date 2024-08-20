export enum Type {
    ONE_TIME,
    MULTI,
    REPEATING
}

export type Reminder = {
    id: string;
    text: string;
    type: Type;
    date?: Date;
    time?: string;
    days?: string[]
};