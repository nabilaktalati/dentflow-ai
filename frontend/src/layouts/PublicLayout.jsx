import { Outlet } from 'react-router'
import Navbar from '../components/navigation/Navbar.jsx'
import BackToTopButton from '../components/ui/BackToTopButton.jsx'
import Footer from '../components/footer/Footer.jsx'
import FloatingAiAssistant from '../features/ai-assistant/components/FloatingAiAssistant.jsx'
function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAFD] text-[#111827]">
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
<FloatingAiAssistant />
      <BackToTopButton />
    </div>
  )
}

export default PublicLayout