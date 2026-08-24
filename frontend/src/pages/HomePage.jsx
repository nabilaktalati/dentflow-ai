import Hero from '../features/landing/hero/Hero.jsx'
import ClinicStatsStrip from '../features/landing/stats/ClinicStatsStrip.jsx'
import CommunicationStory from '../features/landing/communication/CommunicationStory.jsx'
import TreatmentJourney from '../features/landing/treatment/TreatmentJourney.jsx'
import FinalCTA from '../features/landing/final-cta/FinalCTA.jsx'
import FAQSection from '../features/landing/faq/FAQSection.jsx'

function HomePage() {
  return (
    <>
      <Hero />

      <ClinicStatsStrip />

      <CommunicationStory />

      <TreatmentJourney />

      <FinalCTA />
      <FAQSection />
    </>
  )
}

export default HomePage