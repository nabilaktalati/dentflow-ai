import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import router from './app/router.jsx'
import './styles/globals.css'
import '@fontsource-variable/ibm-plex-sans'
import '@fontsource-variable/manrope'
import {
  AuthProvider,
} from './features/auth/context/AuthContext.jsx'



createRoot(document.getElementById('root')).render(
<StrictMode>
  <AuthProvider>
    <RouterProvider
      router={router}
    />
  </AuthProvider>
</StrictMode>
)