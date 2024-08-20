import { AppRoot } from '@telegram-apps/telegram-ui'
import WebApp from '@twa-dev/sdk'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
import CreateReminderPage from './pages/CreateReminderPage/CreateReminderPage.tsx'
import MainPage from './pages/MainPage/MainPage.tsx'
import ViewReminderPage from './pages/ViewReminderPage/ViewReminderPage.tsx'


WebApp.expand()
WebApp.SettingsButton.hide()
WebApp.ready()

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />
  },
  {
    path: "/add",
    element: <CreateReminderPage />
  },
  {
    path: "/:id",
    element: <ViewReminderPage />
  }
]);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRoot>
      <div className='container'>
        <RouterProvider router={router} />
      </div>
    </AppRoot>
  </React.StrictMode>
)
