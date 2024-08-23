import { Subheadline } from '@telegram-apps/telegram-ui';
import WebApp from '@twa-dev/sdk';
import './UserHeader.css';
import reminderDucky from '../../assets/reminder.gif'


const getUsername = () => {
    return WebApp.initDataUnsafe.user?.username
};

const UserHeader = () => {
    return (
        <div className="top-section">
            <Subheadline>@{getUsername()}</Subheadline>
            <img width="70px" src={reminderDucky} />
        </div>
    )
};

export default UserHeader;