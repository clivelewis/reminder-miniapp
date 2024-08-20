import '@telegram-apps/telegram-ui/dist/styles.css';
import WebApp from '@twa-dev/sdk'
import { Title, IconButton } from '@telegram-apps/telegram-ui';
import plusIcon from '../../assets/AddCircle24Fill.svg'; 
import UserHeader from '../../components/UserHeader/UserHeader';
import ReminderList from '../../components/ReminderList/ReminderList';
import { useNavigate } from 'react-router-dom';
import '../../assets/AddCircle24Fill.svg'


function MainPage() {
  const navigate = useNavigate()
  WebApp.BackButton.hide()

  return (
    <>
      <UserHeader />

      <Title weight='3'>Reminders
        <IconButton mode="plain" size="m" onClick={() => navigate('/add')} title='Add reminder'>
          <img src={plusIcon} alt="Add reminder" title="Add reminder"/>
        </IconButton>
      </Title>

      <ReminderList />

      <div className='bottom-section'>
      </div>
    </>
  )
}


export default MainPage
