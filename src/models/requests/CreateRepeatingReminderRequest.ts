import { ReminderType } from "../Reminder";
import { CreateRequest } from "./CreateRequest";

export interface CreateRepeatingReminderRequest extends CreateRequest {
    type: ReminderType,
    timezone: string,
    text: string,
    days: string[],
    time: string
}