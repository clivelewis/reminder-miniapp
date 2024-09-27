import { Button, Placeholder } from "@telegram-apps/telegram-ui";
import ducky from '../../assets/ducky.gif';

const NoTelegram = () => {

    return (
        <Placeholder
            style={{ maxWidth: '650px' }}
            header="Telegram not detected"
            description="This application is designed to work exclusively within the Telegram environment.
        Please open and use this app through Telegram to ensure full functionality. 
        Feel free to contact the developer for assistance 😊"
            action={<Button onClick={() => window.open('https://t.me/clive00lewis', '_blank')}>@clive00lewis</Button>}>

            <img alt="Ducky gif" src={ducky} />
        </Placeholder>
    );
}

export default NoTelegram;