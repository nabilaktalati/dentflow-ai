import { createBrowserRouter } from "react-router";
import AiFeaturesPage from "../features/ai-features/pages/AiFeaturesPage.jsx";
import PublicLayout from "../layouts/PublicLayout.jsx";
import HomePage from "../pages/HomePage.jsx";
import AppointmentQueryPage from "../features/appointment-query/pages/AppointmentQueryPage.jsx";
import InvoiceQueryPage from "../features/invoice-query/pages/InvoiceQueryPage.jsx";
import DoctorsPage from "../features/doctors/pages/DoctorsPage.jsx";
import AboutPage from "../features/about/pages/AboutPage.jsx";
import ContactPage from "../features/contact/pages/ContactPage.jsx";
import PrivacyPage from '../features/legal/pages/PrivacyPage.jsx'
import TermsPage from '../features/legal/pages/TermsPage.jsx'
const router = createBrowserRouter([
  // PUBLIC WEBSITE
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "services",
        element: <div className="px-8 pt-32">Hizmetler</div>,
      },
      {
        path: "doctors",
        element: <DoctorsPage />,
      },
      {
        path: "ai-features",
        element: <AiFeaturesPage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "login",
        element: <div className="px-8 pt-32">Giriş</div>,
      },
      {
        path: "register",
        element: <div className="px-8 pt-32">Kayıt</div>,
      },
      {
  path: 'privacy',
  element: <PrivacyPage />,
},
{
  path: 'terms',
  element: <TermsPage />,
},
    ],
  },

  // STANDALONE OPERATION PAGES
  {
    path: "/randevu-sorgula",
    element: <AppointmentQueryPage />,
  },
  {
    path: "/fatura-sorgula",
    element: <InvoiceQueryPage />,
  },
]);

export default router;
