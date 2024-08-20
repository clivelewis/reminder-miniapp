import { Cell, IconButton, Placeholder, Section } from "@telegram-apps/telegram-ui";
import { Icon16Cancel } from '@telegram-apps/telegram-ui/dist/icons/16/cancel';
import WebApp from '@twa-dev/sdk';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import reminderService from '../../services/ReminderService';
import './ReminderList.css';
import { Reminder } from "../../models/Reminder";
import ducky from '../../assets/ducky.gif'



const ReminderList = () => {

    const navigate = useNavigate()
    const [reminders, setReminders] = useState<Reminder[]>(reminderService.getReminders());
    useEffect(() => {
        const updateReminders = (newReminders: Reminder[]) => {
            setReminders([...newReminders]);
        };

        reminderService.subscribe(updateReminders);
        return () => {
            reminderService.unsubscribe(updateReminders);
        };
    }, []);

    const deleteReminder = (id: string) => {
        WebApp.showConfirm("Are you sure you want to delete this reminder?", (confirmed) => {
            if (confirmed) {
                reminderService.removeReminder(id)
            }
        })
    }


    return (

        <div className="main-section">

            {reminders.map(reminder => (
                <Section key={reminder.id + "abc"}>
                    <Cell
                        onClick={() => navigate('/' + reminder.id)}
                        key={reminder.id}
                        id={reminder.id}
                        after={<IconButton mode='plain' size='s' onClick={(event) => {
                            event.stopPropagation()
                            deleteReminder(reminder.id)
                        }} style={{
                            color: 'red'
                        }}><Icon16Cancel /></IconButton>}
                        description={`Every ${reminder.days?.join(", ")} at ${reminder.time}`}
                        multiline={false}
                        title={reminder.text}
                    >
                        {reminder.text}
                    </Cell>
                </Section>
            ))}

            {(!reminders || reminders.length == 0) && <Placeholder description="You don't have any reminders. Press the button above to add a new one.">
                <img alt="Ducky gif" src={ducky} />
            </Placeholder>}
        </div>
    )
}

export default ReminderList;