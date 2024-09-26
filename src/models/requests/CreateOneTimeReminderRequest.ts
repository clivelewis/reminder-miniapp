import { ReminderType } from "../Reminder";
import { CreateRequest } from "./CreateRequest";

export interface CreateOneTimeReminderRequest extends CreateRequest {
    type: ReminderType,
    timezone: string,
    text: string,
    date_string: string,
    epoch_millis: number,
    time: string
}