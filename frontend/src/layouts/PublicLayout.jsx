import { Outlet } from 'react-router'
import Navbar from '../components/navigation/Navbar.jsx'
import BackToTopButton from '../components/ui/BackToTopButton.jsx'
import Footer from '../components/footer/Footer.jsx'

function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAFD] text-[#111827]">
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />

      <BackToTopButton />
    </div>
  )
}

export default PublicLayout