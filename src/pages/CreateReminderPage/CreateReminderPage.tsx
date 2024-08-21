import { Button, Divider, Input, Multiselect, Text } from "@telegram-apps/telegram-ui";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select, { ActionMeta, MultiValue, StylesConfig } from 'react-select';
import makeAnimated from 'react-select/animated';
import 'react-time-picker/dist/TimePicker.css';
import UserHeader from "../../components/UserHeader/UserHeader";
import './CreateReminderPage.css';
import reminderService from "../../services/ReminderService";
import { MultiselectOption } from "@telegram-apps/telegram-ui/dist/components/Form/Multiselect/types";
import WebApp from "@twa-dev/sdk";


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
    const [reminderText, setReminderText] = useState('')
    const [selectedDays, setSelectedDays] = useState<MultiselectOption[]>([])
    const [selectedTime, setSelectedTime] = useState("")

    const handleChange = (value: unknown) => {
        Array.isArray(value) ? setSelectedDays(value) : setSelectedDays([])
    };

    const isValidInput = (): boolean => {
        return !!(reminderText && reminderText.trim().length > 0 && selectedDays.length > 0 && selectedTime)
    }

    const anyInputPresent = (): boolean => !!(reminderText || reminderText.trim().length > 0 || selectedDays.length > 0 || selectedTime);

    const saveNewReminder = () => {
        reminderService.addRepeatingReminder(reminderText.trim(), selectedTime, selectedDays.map((value) => value.label.toString()));
        navigate('/')
    }

    const onBackButtonPress = () => {
        if (anyInputPresent()) {
            WebApp.showConfirm("You have unsaved changes. Are you sure you want to go back? Any changes will be lost.", (confirmed) => {
                if (confirmed) navigate('/')
            })
        } else {
            navigate('/')
        }
    }


    return (
        <>
            <UserHeader />
            <div className="add-reminder-container">
                <Text weight="1">Remind me to</Text>
                <Input placeholder="Call mother..." value={reminderText} onChange={(event) => setReminderText(event.target.value)} />
                <Text weight="1">Every</Text>
                <Select styles={selectStyleConfig()} closeMenuOnSelect={false} components={animatedComponents} options={options} isMulti onChange={handleChange} />
                <Text weight="1">At</Text>
                <Input type="time" name="time" defaultValue={selectedTime} onChange={(event) => setSelectedTime(event.target.value)} />

                <Divider />

                <Button disabled={!isValidInput()} onClick={saveNewReminder}>Save</Button>
                <Button mode="bezeled" style={{
                    color: 'var(--tg-theme-destructive-text-color)'
                }} onClick={onBackButtonPress}>Back</Button>
            </div>
        </>
    )
}


function selectStyleConfig(): StylesConfig {
    return {
        container: (baseStyles, state) => ({
            ...baseStyles,
            fontFamily: 'var(--tgui--font-family)',
        }),
        option: (baseStyles, state) => ({
            ...baseStyles,
            background: state.isFocused ? 'var(--tg-theme-secondary-bg-color)' : baseStyles.background
            // background: 'var(--tg-theme-secondary-bg-color)'
        }),
        placeholder: (baseStyles, state) => ({
            ...baseStyles,
            color: 'var(--tg-theme-hint-color)'
        }),
        control: (baseStyles, state) => ({
            ...baseStyles,
            width: '100%',
            borderColor: 'var(--tg-theme-bg-color)',
            borderRadius: '12px',
            minHeight: '48px',
            // borderColor: state.isFocused ? 'grey' : 'red',
            background: 'var(--tg-theme-bg-color)',

        }),
        menu: (baseStyles, state) => ({
            ...baseStyles,
            background: 'var(--tg-theme-bg-color)',
        }),
        multiValue: (baseStyles, state) => ({
            ...baseStyles,
            borderRadius: '10px',
            fontWeight: 'var(--tgui--font_weight--accent2)',
            fontSize: 'var(--tgui--subheadline2--font_size)'
        })
        
    }
}

export default CreateReminderPage