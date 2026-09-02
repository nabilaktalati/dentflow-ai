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
import RegisterPage from "../features/auth/pages/RegisterPage.jsx";
import LoginPage from '../features/auth/pages/LoginPage.jsx'
import ProtectedRoute from '../features/auth/components/ProtectedRoute.jsx'
import RoleRoute from '../features/auth/components/RoleRoute.jsx'
import DashboardLayout from '../features/dashboard/layouts/DashboardLayout.jsx'
import PatientDashboardPage from '../features/dashboard/patient/pages/PatientDashboardPage.jsx'
import DoctorDashboardPage from '../features/dashboard/doctor/pages/DoctorDashboardPage.jsx'
import AdminDashboardPage from '../features/dashboard/admin/pages/AdminDashboardPage.jsx'
import AdminDoctorsPage from '../features/dashboard/admin/pages/AdminDoctorsPage.jsx'
import DashboardSectionPage from '../features/dashboard/components/DashboardSectionPage.jsx'
import ChangePasswordPage from '../features/auth/pages/ChangePasswordPage.jsx'
import DoctorAppointmentsPage from '../features/dashboard/doctor/pages/DoctorAppointmentsPage.jsx'
import PatientAppointmentsPage from '../features/dashboard/patient/pages/PatientAppointmentsPage.jsx'
import PatientBookingPage from '../features/dashboard/patient/pages/PatientBookingPage.jsx'
import PatientTreatmentsPage from '../features/dashboard/patient/pages/PatientTreatmentsPage.jsx'
import DoctorInvoicesPage from '../features/dashboard/doctor/pages/DoctorInvoicesPage.jsx'
import PatientInvoicesPage from '../features/dashboard/patient/pages/PatientInvoicesPage.jsx'
import PatientProfilePage from '../features/dashboard/patient/pages/PatientProfilePage.jsx'
import MessagesPage from '../features/dashboard/shared/pages/MessagesPage.jsx'
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
  path: '/login',
  element: <LoginPage />,
},
{
  path: "register",
  element: <RegisterPage />,
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



  {
  path: '/patient',
  element: (
    <ProtectedRoute>
      <RoleRoute allowedRoles={['PATIENT']}>
        <DashboardLayout />
      </RoleRoute>
    </ProtectedRoute>
  ),
  children: [
    {
      index: true,
      element: <PatientDashboardPage />,
    },
    {
      path: 'appointments',
      element: <PatientAppointmentsPage />,
    },
    {
      path: 'book',
      element: <PatientBookingPage />,
    },
    {
      path: 'treatments',
      element: <PatientTreatmentsPage />,
    },
    {
      path: 'invoices',
      element: <PatientInvoicesPage />,
    },
    {
      path: 'messages',
      element: <MessagesPage />,
    },

    {
      path: 'profile',
      element: <PatientProfilePage />,
    },
  ],
},

  {
  path: '/doctor',
  element: (
    <ProtectedRoute>
      <RoleRoute allowedRoles={['DOCTOR']}>
        <DashboardLayout />
      </RoleRoute>
    </ProtectedRoute>
  ),
  children: [
    {
      index: true,
      element: <DoctorDashboardPage />,
    },
{
  path: 'appointments',
  element: <DoctorAppointmentsPage />,
},

{
  path: 'patients',
  element: (
    <DashboardSectionPage
      eyebrow="DOKTOR PANELİ"
      title="Hastalar"
      description="Size bağlı hasta kayıtları ve klinik süreçler bu alanda görüntülenecek."
    />
  ),
},

{
  path: 'invoices',
  element: <DoctorInvoicesPage />,
},
    {
  path: 'messages',
  element: <MessagesPage />,
},
    {
      path: 'profile',
      element: (
        <DashboardSectionPage
          eyebrow="DOKTOR PANELİ"
          title="Profil"
          description="Doktor hesap ve profil bilgilerinizi bu alandan yönetebileceksiniz."
        />
      ),
    },
  ],
},

{
  path: '/admin',
  element: (
    <ProtectedRoute>
      <RoleRoute
        allowedRoles={['ADMIN']}
      >
        <DashboardLayout />
      </RoleRoute>
    </ProtectedRoute>
  ),

  children: [
    {
      index: true,
      element: (
        <AdminDashboardPage />
      ),
    },

{
  path: 'doctors',
  element: <AdminDoctorsPage />,
},

    {
      path: 'appointments',
      element: (
        <DashboardSectionPage
          eyebrow="YÖNETİCİ PANELİ"
          title="Randevular"
          description="Klinikteki randevu süreçlerinin merkezi olarak yönetileceği çalışma alanı."
        />
      ),
    },

    {
      path: 'patients',
      element: (
        <DashboardSectionPage
          eyebrow="YÖNETİCİ PANELİ"
          title="Hastalar"
          description="Klinik hastalarının ve ilgili kayıtların yönetileceği çalışma alanı."
        />
      ),
    },

    {
      path: 'messages',
      element: (
        <DashboardSectionPage
          eyebrow="YÖNETİCİ PANELİ"
          title="Mesajlar"
          description="Klinik içi iletişim ve mesajlaşma alanı."
        />
      ),
    },

    {
      path: 'settings',
      element: (
        <DashboardSectionPage
          eyebrow="YÖNETİCİ PANELİ"
          title="Ayarlar"
          description="DentFlow sistem ve klinik ayarlarının yönetileceği çalışma alanı."
        />
      ),
    },
  ],
},
{
  path: '/change-password',
  element: (
    <ProtectedRoute>
      <ChangePasswordPage />
    </ProtectedRoute>
  ),
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
