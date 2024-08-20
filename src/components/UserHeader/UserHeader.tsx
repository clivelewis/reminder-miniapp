import { Avatar, Subheadline } from '@telegram-apps/telegram-ui';
import WebApp from '@twa-dev/sdk';
import './UserHeader.css';


const getUsername = () => {
    return WebApp.initDataUnsafe.user?.username
};

const UserHeader = () => {
    return (
        <div className="top-section">
            <Subheadline>@{getUsername()}</Subheadline>
            <Avatar
                size={96}
                src="https://avatars.githubusercontent.com/u/48330543?v=4"
            />
        </div>
    )
};

export default UserHeader;