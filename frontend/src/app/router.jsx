import { createBrowserRouter } from 'react-router'

import PublicLayout from '../layouts/PublicLayout.jsx'
import HomePage from '../pages/HomePage.jsx'

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/services',
        element: <div className="px-8 pt-32">Hizmetler</div>,
      },
      {
        path: '/doctors',
        element: <div className="px-8 pt-32">Doktorlar</div>,
      },
      {
        path: '/ai-features',
        element: <div className="px-8 pt-32">AI Özellikler</div>,
      },
      {
        path: '/about',
        element: <div className="px-8 pt-32">Hakkımızda</div>,
      },
      {
        path: '/contact',
        element: <div className="px-8 pt-32">İletişim</div>,
      },
      {
        path: '/login',
        element: <div className="px-8 pt-32">Giriş</div>,
      },
      {
        path: '/register',
        element: <div className="px-8 pt-32">Randevu</div>,
      },
    ],
  },
])

export default router