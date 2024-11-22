import { Avatar, Subheadline } from '@telegram-apps/telegram-ui';
import WebApp from '@twa-dev/sdk';
import './UserHeader.css';
import reminderDucky from '../../assets/reminder.gif'


const getUsername = () => {
    return WebApp.initDataUnsafe.user?.username
};

const getAvatarUrl = () => {
    return WebApp.initDataUnsafe.user?.photo_url
}

const UserHeader = () => {
    const avatarUrl = getAvatarUrl()

    return (
        <div className="top-section">
            <Subheadline>@{getUsername()}</Subheadline>
            {avatarUrl ? (
                <Avatar size={96} src={avatarUrl} />
            ) : (
                <img width="70px" src={reminderDucky} />
            )}
        </div>
    )
};

export default UserHeader;