import { Button, Cell, Divider, Input, Radio, Text } from "@telegram-apps/telegram-ui";
import { MultiselectOption } from "@telegram-apps/telegram-ui/dist/components/Form/Multiselect/types";
import WebApp from "@twa-dev/sdk";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select, { StylesConfig } from 'react-select';
import makeAnimated from 'react-select/animated';
import UserHeader from "../../components/UserHeader/UserHeader";
import { ReminderType } from "../../models/Reminder";
import reminderService from "../../services/ReminderService";
import './CreateReminderPage.css';

const options: MultiselectOption[] = [
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' },
    { value: 'Saturday', label: 'Saturday' },
    { value: 'Sunday', label: 'Sunday' },
];

const animatedComponents = makeAnimated();


const CreateReminderPage = () => {
    const navigate = useNavigate();
    const [reminderText, setReminderText] = useState('');
    const [selectedDateString, setSelectedDateString] = useState(new Date().toJSON().slice(0, 10));
    const [selectedDate, setSelectedDate] = useState(Date.now());
    const [selectedDays, setSelectedDays] = useState<MultiselectOption[]>([]);
    const [selectedTime, setSelectedTime] = useState("09:00");
    const [selectedReminderType, setReminderType] = useState(ReminderType.REPEATING);

    const handleChange = (value: unknown) => {
        Array.isArray(value) ? setSelectedDays(value) : setSelectedDays([]);
    }

    const isValidInput = (): boolean => {
        const validTextAndTime: boolean = !!(reminderText && reminderText.trim().length > 0 && selectedTime);

        switch (selectedReminderType) {
            case ReminderType.ONE_TIME: return validTextAndTime && !!(selectedDateString && selectedDateString.trim().length > 0);
            case ReminderType.REPEATING: return validTextAndTime && selectedDays.length > 0;
        }
    }

    const anyInputPresent = (): boolean => !!(reminderText || reminderText.trim().length > 0 || selectedDays.length > 0 || (selectedTime && selectedTime !== "09:00"));

    const saveNewReminder = () => {

        switch (selectedReminderType) {
            case ReminderType.ONE_TIME: reminderService.saveOneTimeReminder(reminderText.trim(), selectedTime, selectedDateString, selectedDate); break;
            case ReminderType.REPEATING: reminderService.saveRepeatingReminder(reminderText.trim(), selectedTime, selectedDays.map((value) => value.label.toString())); break;
        }

        navigate('/');
    }

    const onBackButtonPress = () => {
        if (anyInputPresent()) {
            WebApp.showConfirm("You have unsaved changes. Are you sure you want to go back? Any changes will be lost.", (confirmed) => {
                if (confirmed) navigate('/')
            })
        } else {
            navigate('/');
        }
    }

    return (
        <>
            <UserHeader />
            <div className="add-reminder-container">
                <Text weight="1">Remind me to</Text>
                <Input type="text" name="reminder-text" id="reminder-text" placeholder="Drink more water..." value={reminderText} onChange={(event) => setReminderText(event.target.value)} />

                <div className="select-choice-container">
                    <Cell before={
                        <Radio name="radio"
                            value={ReminderType.ONE_TIME}
                            checked={selectedReminderType === ReminderType.ONE_TIME} onChange={() => { }} />}
                        onClick={() => setReminderType(ReminderType.ONE_TIME)}
                    >
                        Once
                    </Cell>

                    <Cell before={
                        <Radio name="radio"
                            value={ReminderType.REPEATING}
                            checked={selectedReminderType === ReminderType.REPEATING} onChange={() => { }} />}
                        onClick={() => setReminderType(ReminderType.REPEATING)}
                    >
                        Every
                    </Cell>
                </div>
                {selectedReminderType === ReminderType.REPEATING &&
                    <Select value={selectedDays} styles={selectStyleConfig()} name="day-select" id="day-select" closeMenuOnSelect={false} components={animatedComponents} options={options} isMulti onChange={handleChange} />
                }
                {selectedReminderType === ReminderType.ONE_TIME &&
                    <Input type="date" name="date" id="date" value={selectedDateString} min={new Date().toJSON().slice(0, 10)} onChange={(event) => {setSelectedDateString(event.target.value); setSelectedDate(event.target.valueAsNumber)}} />
                }

                <Text weight="1">At</Text>
                <Input type="time" name="time" id="time" required defaultValue={selectedTime} onChange={(event) => setSelectedTime(event.target.value)} />

                <Divider />

                <Button disabled={!isValidInput()} onClick={saveNewReminder}>Save</Button>
                <Button mode="bezeled" style={{
                    color: 'var(--tg-theme-destructive-text-color)',
                    marginBottom: '16px'
                }} onClick={onBackButtonPress}>Back</Button>
            </div>
        </>
    )
}


function selectStyleConfig(): StylesConfig {
    return {
        container: (baseStyles, _) => ({
            ...baseStyles,
            fontFamily: 'var(--tgui--font-family)',
        }),
        option: (baseStyles, state) => ({
            ...baseStyles,
            background: state.isFocused ? 'var(--tg-theme-secondary-bg-color)' : baseStyles.background
        }),
        placeholder: (baseStyles, _) => ({
            ...baseStyles,
            color: 'var(--tg-theme-hint-color)'
        }),
        control: (baseStyles, _) => ({
            ...baseStyles,
            width: '100%',
            borderColor: 'var(--tg-theme-bg-color)',
            borderRadius: '12px',
            minHeight: '48px',
            background: 'var(--tg-theme-bg-color)',

        }),
        menu: (baseStyles, _) => ({
            ...baseStyles,
            background: 'var(--tg-theme-bg-color)',
        }),
        multiValue: (baseStyles, _) => ({
            ...baseStyles,
            borderRadius: '10px',
            fontWeight: 'var(--tgui--font_weight--accent2)',
            fontSize: 'var(--tgui--subheadline2--font_size)'
        })

    }
}

export default CreateReminderPage