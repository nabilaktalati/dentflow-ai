import { createBrowserRouter } from 'react-router'
import HomePage from '../pages/HomePage'
const router = createBrowserRouter([
  {
  path: '/',
  element: <HomePage />,
},
  {
    path: '/services',
    element: <div>Services</div>,
  },
  {
    path: '/doctors',
    element: <div>Doctors</div>,
  },
  {
    path: '/ai-features',
    element: <div>AI Features</div>,
  },
  {
    path: '/about',
    element: <div>About</div>,
  },
  {
    path: '/contact',
    element: <div>Contact</div>,
  },
  {
    path: '/login',
    element: <div>Login</div>,
  },
  {
    path: '/register',
    element: <div>Register</div>,
  },
])

export default router