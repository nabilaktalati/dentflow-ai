import {
  useEffect,
  useState,
} from 'react'

import {
  getMyAppointments,
} from '../api/patientAppointmentsApi.js'

import {
  getMyInvoices,
} from '../api/patientInvoicesApi.js'

import {
  getMyTreatments,
} from '../api/patientTreatmentsApi.js'

import {
  getUnreadMessageCount,
} from '../../shared/api/messagesApi.js'


import {
  CalendarDays,
  FileText,
  MessageCircle,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react'

import {
  Link,
} from 'react-router'

import {
  motion,
} from 'motion/react'

import {
  useAuth,
} from '../../../auth/context/authContext.js'




export default function PatientDashboardPage() {
  const {
    user,
  } = useAuth()
const [stats, setStats] =
  useState({
    appointments: null,
    treatments: null,
    invoices: null,
    messages: null,
  })

useEffect(() => {
  const loadStats = async () => {
    const [
      appointmentsResult,
      treatmentsResult,
      invoicesResult,
      messagesResult,
    ] = await Promise.allSettled([
      getMyAppointments(),
      getMyTreatments(),
      getMyInvoices(),
      getUnreadMessageCount(),
    ])

    const appointments =
      appointmentsResult.status ===
      'fulfilled'
        ? appointmentsResult.value
            ?.data?.appointments || []
        : null

    setStats({
      appointments:
        appointments === null
          ? null
          : appointments.filter(
              (appointment) =>
                appointment.status ===
                  'PENDING' ||
                appointment.status ===
                  'CONFIRMED',
            ).length,

      treatments:
        treatmentsResult.status ===
        'fulfilled'
          ? treatmentsResult.value
              ?.data?.treatments
              ?.length || 0
          : null,

      invoices:
        invoicesResult.status ===
        'fulfilled'
          ? invoicesResult.value
              ?.data?.invoices
              ?.length || 0
          : null,

      messages:
        messagesResult.status ===
        'fulfilled'
          ? messagesResult.value
          : null,
    })
  }

  loadStats()
}, [])

const patientStats = [
  {
    label: 'Yaklaşan Randevu',
    value:
      stats.appointments ?? '—',
    icon: CalendarDays,
    iconClass:
      'bg-[#EAF3FF] text-[#4A85FF]',
  },
  {
    label: 'Tedavi Süreci',
    value:
      stats.treatments ?? '—',
    icon: Stethoscope,
    iconClass:
      'bg-[#EFEAFF] text-[#6C63FF]',
  },
  {
    label: 'Faturalar',
    value:
      stats.invoices ?? '—',
    icon: FileText,
    iconClass:
      'bg-[#FFF4E8] text-[#E98A35]',
  },
  {
    label: 'Mesajlar',
    value:
      stats.messages ?? '—',
    icon: MessageCircle,
    iconClass:
      'bg-[#EAFBF1] text-[#16A34A]',
  },
]
  const email =
    user?.email || '—'

 const displayName =
  user?.name ||
  user?.fullName ||
  'Hasta'

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-7 sm:px-6 lg:px-8 lg:py-8">

      {/* HEADER */}
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
        className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
      >
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#625BF6]">
            DentFlow Hasta
          </p>

          <h1 className="mt-2 text-[38px] font-bold leading-[1.05] tracking-[-0.04em] text-[#101828] sm:text-[42px]">
            Hoş geldiniz
          </h1>

          <p className="mt-3 max-w-[620px] text-[14px] leading-6 text-[#6F7A8E]">
            Randevu, tedavi ve klinik süreçlerinizi tek alandan takip edin.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-3.5 py-2 text-[12px] font-semibold text-emerald-700">
          <ShieldCheck
            size={14}
            strokeWidth={2}
          />
          Hesap güvenli
        </div>
      </motion.div>


      {/* STAT CARDS */}
      <section className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {patientStats.map(
          ({
            label,
            value,
            icon: Icon,
            iconClass,
          },
          index) => (
            <motion.div
              key={label}
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                delay:
                  index * 0.05,
              }}
              className="rounded-[18px] border border-white/80 bg-white/65 p-4 shadow-[0_10px_30px_rgba(62,56,120,0.05)] backdrop-blur-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] font-medium text-[#8A94A6]">
                    {label}
                  </p>

                  <p className="mt-2 text-[28px] font-bold leading-none tracking-[-0.04em] text-[#172033]">
                    {value}
                  </p>
                </div>

                <div
                  className={`grid size-10 place-items-center rounded-[12px] ${iconClass}`}
                >
                  <Icon
                    size={17}
                    strokeWidth={1.9}
                  />
                </div>
              </div>

              <div className="mt-4 h-px bg-[#EEF0F5]" />

              <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.11em] text-[#B0B7C5]">
                Canlı veri
              </p>
            </motion.div>
          ),
        )}
      </section>


      {/* MAIN AREA */}
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_350px]">

        {/* LEFT */}
        <motion.section
          initial={{
            opacity: 0,
            y: 14,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
            delay: 0.1,
          }}
          className="rounded-[24px] border border-white/80 bg-white/68 p-5 shadow-[0_18px_50px_rgba(69,61,128,0.065)] backdrop-blur-xl sm:p-6"
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8D85FF]">
              Hasta Merkezi
            </p>

            <h2 className="mt-2 text-[20px] font-semibold tracking-[-0.025em] text-[#172033]">
              Sağlık süreciniz tek yerde
            </h2>

            <p className="mt-2 max-w-[600px] text-[13px] leading-6 text-[#7A8497]">
              Randevularınızı yönetin, tedavi sürecinizi takip edin ve kliniğinizle güvenli şekilde iletişim kurun.
            </p>
          </div>


          <div className="mt-6 grid gap-3 md:grid-cols-2">

<PatientAction
  title="Randevularım"
  description="Planlanan ve geçmiş randevularınızı görüntüleyin."
  icon={CalendarDays}
  iconClass="bg-[#EAF3FF] text-[#4A85FF]"
  to="/patient/appointments"
/>

<PatientAction
  title="Tedavi Sürecim"
  description="Tedavi planınızı ve ilerleme durumunu takip edin."
  icon={Stethoscope}
  iconClass="bg-[#EFEAFF] text-[#6C63FF]"
  to="/patient/treatments"
/>

<PatientAction
  title="Faturalarım"
  description="Klinik faturalarınıza güvenli şekilde erişin."
  icon={FileText}
  iconClass="bg-[#FFF4E8] text-[#E98A35]"
  to="/patient/invoices"
/>

<PatientAction
  title="Mesajlar"
  description="Klinik ekibiyle güvenli iletişim alanınıza erişin."
  icon={MessageCircle}
  iconClass="bg-[#EAFBF1] text-[#16A34A]"
  to="/patient/messages"
/>

          </div>
        </motion.section>


        {/* RIGHT */}
        <div className="space-y-4">

          <motion.section
            initial={{
              opacity: 0,
              x: 12,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.45,
              delay: 0.12,
            }}
            className="overflow-hidden rounded-[24px] bg-[linear-gradient(145deg,#17172E_0%,#211F4A_58%,#292461_100%)] p-6 text-white shadow-[0_20px_45px_rgba(23,23,46,0.22)]"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
              Hasta hesabı
            </p>

            <div className="mt-6 grid size-13 place-items-center rounded-[14px] bg-[#7168FF] text-lg font-bold">
              {displayName
                .charAt(0)
                .toUpperCase()}
            </div>

            <h3 className="mt-5 capitalize text-[16px] font-semibold text-white">
              {displayName}
            </h3>

            <p className="mt-1 break-all text-[12px] text-white/45">
              {email}
            </p>

            <div className="mt-6 rounded-[17px] border border-white/10 bg-white/[0.045] p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-white/40">
                  Rol
                </span>

                <span className="text-[11px] font-semibold text-white/85">
                  HASTA
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-[11px] text-white/40">
                  Hesap
                </span>

                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  Aktif
                </span>
              </div>
            </div>
          </motion.section>


          <Link
            to="/doctors"
            className="group flex items-center justify-between rounded-[22px] border border-[#E4E2F5] bg-white/70 p-5 shadow-[0_14px_36px_rgba(74,67,135,0.06)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white"
          >
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#625BF6]">
                Yeni Randevu
              </p>

              <h3 className="mt-2 text-[16px] font-semibold text-[#172033]">
                Doktorunuzu seçin
              </h3>

              <p className="mt-1 text-[12px] text-[#7A8497]">
                Uygun doktorları görüntüleyin.
              </p>
            </div>

            <div className="grid size-11 place-items-center rounded-[14px] bg-[#F0EEFF] text-[#625BF6] transition group-hover:bg-[#625BF6] group-hover:text-white">
              <CalendarDays
                size={18}
                strokeWidth={1.9}
              />
            </div>
          </Link>

        </div>
      </div>
    </div>
  )
}


function PatientAction({
  title,
  description,
  icon: Icon,
  iconClass,
  to,
}) {
  return (
    <Link
      to={to}
      className="group rounded-[18px] border border-[#ECEBF3] bg-white/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#DDD9F8] hover:bg-white hover:shadow-[0_14px_30px_rgba(91,82,242,0.08)]"
    >
      <div
        className={`grid size-11 place-items-center rounded-[13px] ${iconClass}`}
      >
        <Icon
          size={18}
          strokeWidth={1.9}
        />
      </div>

      <h3 className="mt-5 text-[15px] font-semibold text-[#172033]">
        {title}
      </h3>

      <p className="mt-1.5 text-[12.5px] leading-5 text-[#758096]">
        {description}
      </p>
    </Link>
  )
}