import { useNavigate, useParams } from "react-router-dom";
import UserHeader from "../../components/UserHeader/UserHeader";
import WebApp from "@twa-dev/sdk";
import { Button, FixedLayout, Textarea, Title } from "@telegram-apps/telegram-ui";
import reminderService from "../../services/ReminderService";
import { useEffect, useState } from "react";
import { Reminder } from "../../models/Reminder";
import "./ViewReminderPage.css"


const ViewReminderPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [reminder, setReminder] = useState<Reminder | null>(null);
    // Set up the back button
    useEffect(() => {
        WebApp.BackButton.onClick(() => navigate('/'));
        WebApp.BackButton.show();
    }, [navigate]);

    useEffect(() => {
        if (!id) {
            navigate('/');
            return;
        }

        const fetchedReminder = reminderService.getReminder(id);
        if (!fetchedReminder) {
            navigate('/');
            return;
        }

        setReminder(fetchedReminder);
    }, [id, navigate]);

    if (!reminder) {
        return null;
    }

    const deleteReminder = (id: string) => {
        WebApp.showConfirm("Are you sure you want to delete this reminder?", (confirmed) => {
            if (confirmed) {
                reminderService.removeReminder(id)
                navigate('/')
            }
        })
    }

    return (
        <div className="content-container">
            <UserHeader />
            <Title weight="3">View Reminder</Title>
            <Textarea readOnly value={reminder.text} style={{ minHeight: '200px' }} />

            <Button mode="bezeled" style={{
                marginTop: '5%',
                width: '100%',
                color: 'var(--tg-theme-destructive-text-color)'
            }} onClick={() => deleteReminder(reminder.id)}>Delete</Button>

            <Button mode="bezeled" style={{ width: '100%' }} onClick={() => navigate('/')}>Back</Button>
        </div>
    );
};


export default ViewReminderPage