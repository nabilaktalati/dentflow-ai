import { Outlet } from 'react-router'

import Navbar from '../components/navigation/Navbar.jsx'

function PublicLayout() {
  return (
    <div className="min-h-screen bg-df-bg text-df-text">
      <Navbar />

      <Outlet />
    </div>
  )
}

export default PublicLayout