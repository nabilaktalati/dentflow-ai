import {
  useEffect,
  useState,
} from 'react'

import {
  ArrowRight,
  CalendarDays,
  
  ShieldCheck,
  Stethoscope,
  Banknote,
  UsersRound,
} from 'lucide-react'

import {
  Link,
} from 'react-router'

import {
  motion,
} from 'motion/react'
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import {
  useAuth,
} from '../../../auth/context/authContext.js'
import {
  getAdminAnalytics,
} from '../api/adminAnalyticsApi.js'

const modules = [
  {
    title: 'Doktor Yönetimi',
    description:
      'Doktor hesapları ve erişim süreçlerini yönetin.',
    to: '/admin/doctors',
    icon: Stethoscope,
    iconBox:
      'bg-[#EFEAFF] text-[#6C63FF]',
    surface:
      'border-[#E7E3FF] bg-gradient-to-br from-[#FAF9FF] to-white',
    hoverShadow:
      'hover:shadow-[0_16px_32px_rgba(108,99,255,0.10)]',
  },
  {
    title: 'Randevular',
    description:
      'Klinik randevu akışını merkezi olarak yönetin.',
    to: '/admin/appointments',
    icon: CalendarDays,
    iconBox:
      'bg-[#EAF3FF] text-[#4A85FF]',
    surface:
      'border-[#DCEBFF] bg-gradient-to-br from-[#F7FAFF] to-white',
    hoverShadow:
      'hover:shadow-[0_16px_32px_rgba(74,133,255,0.10)]',
  },
  {
    title: 'Hastalar',
    description:
      'Hasta kayıtlarını ve ilişkili süreçleri izleyin.',
    to: '/admin/patients',
    icon: UsersRound,
    iconBox:
      'bg-[#E7FAF5] text-[#0F9F7F]',
    surface:
      'border-[#DDF5F1] bg-gradient-to-br from-[#F7FFFC] to-white',
    hoverShadow:
      'hover:shadow-[0_16px_32px_rgba(15,159,127,0.09)]',
  },
  {
    title: 'Mesajlar',
    description:
      'Klinik içi güvenli iletişim alanına erişin.',
    to: '/admin/messages',
    icon: Banknote,
    iconBox:
      'bg-[#EAFBF1] text-[#16A34A]',
    surface:
      'border-[#E2F4E8] bg-gradient-to-br from-[#F8FFF9] to-white',
    hoverShadow:
      'hover:shadow-[0_16px_32px_rgba(22,163,74,0.09)]',
  },
]


const statDefinitions = [
  {
    key: 'totalDoctors',
    label: 'Toplam Doktor',
    icon: Stethoscope,
    iconClass:
      'bg-[#F0EDFF] text-[#625BF6]',
    accentClass:
      'bg-[#625BF6]',
  },
  {
    key: 'todayAppointments',
    label: 'Bugünkü Randevu',
    icon: CalendarDays,
    iconClass:
      'bg-[#EAF3FF] text-[#4A85FF]',
    accentClass:
      'bg-[#4A85FF]',
  },
  {
    key: 'registeredPatients',
    label: 'Kayıtlı Hasta',
    icon: UsersRound,
    iconClass:
      'bg-[#E7FAF5] text-[#0F9F7F]',
    accentClass:
      'bg-[#10B981]',
  },
  {
    key: 'totalRevenue',
    label: 'Toplam Gelir',
    icon: Banknote,
    iconClass:
      'bg-[#F0EDFF] text-[#625BF6]',
    accentClass:
      'bg-[#625BF6]',
  },
]
const appointmentStatusMeta = {
  PENDING: {
    label: 'Bekliyor',
    color: '#F59E0B',
  },
  CONFIRMED: {
    label: 'Onaylandı',
    color: '#625BF6',
  },
  COMPLETED: {
    label: 'Tamamlandı',
    color: '#10B981',
  },
  CANCELLED: {
    label: 'İptal Edildi',
    color: '#EF4444',
  },
  NO_SHOW: {
    label: 'Gelmedi',
    color: '#94A3B8',
  },
}

const invoiceStatusMeta = {
  PENDING: {
    label: 'Bekleyen',
    color: '#F59E0B',
  },
  PAID: {
    label: 'Ödenen',
    color: '#10B981',
  },
  CANCELLED: {
    label: 'İptal Edildi',
    color: '#EF4444',
  },
}

  export default function AdminDashboardPage() {
  const {
    user,
  } = useAuth()

  const [
    analytics,
    setAnalytics,
  ] = useState(null)

  const [
    analyticsLoading,
    setAnalyticsLoading,
  ] = useState(true)

  const [
    ,
    setAnalyticsError,
  ] = useState('')


  useEffect(() => {
    let isMounted = true

    const loadAnalytics =
      async () => {
        try {
          const response =
            await getAdminAnalytics()

          if (!isMounted) {
            return
          }

          setAnalytics(
            response?.data || null,
          )
        } catch (error) {
          if (!isMounted) {
            return
          }

          setAnalyticsError(
            error.message,
          )
        } finally {
          if (isMounted) {
            setAnalyticsLoading(false)
          }
        }
      }

    loadAnalytics()

    return () => {
      isMounted = false
    }
  }, [])


  const stats =
    statDefinitions.map(
      (stat) => {
        let value = '—'

        if (
          !analyticsLoading &&
          analytics
        ) {
          if (
            stat.key ===
            'totalRevenue'
          ) {
            value =
              new Intl.NumberFormat(
                'tr-TR',
                {
                  style: 'currency',
                  currency:
                    analytics.currency ||
                    'TRY',
                },
              ).format(
                analytics.totalRevenue ||
                  0,
              )
          } else {
            value =
              analytics[
                stat.key
              ] ?? 0
          }
        }

        return {
          ...stat,
          value,
        }
      },
    )
const appointmentChartData =
  (
    analytics?.appointmentStatuses ||
    []
  ).map((item) => ({
    name:
      appointmentStatusMeta[
        item.status
      ]?.label || item.status,

    value: item.count,

    color:
      appointmentStatusMeta[
        item.status
      ]?.color || '#CBD5E1',
  }))
const invoiceChartData =
  (
    analytics?.invoiceStatuses ||
    []
  ).map((item) => ({
    name:
      invoiceStatusMeta[
        item.status
      ]?.label || item.status,

    count: item.count,

    amount: item.totalAmount,

    color:
      invoiceStatusMeta[
        item.status
      ]?.color || '#CBD5E1',
  }))
  const email =
    user?.email || '—'

  const role =
    user?.role || 'ADMIN'

  const isActive =
    user?.status
      ? user.status === 'ACTIVE'
      : true

  const isVerified =
    user?.isEmailVerified ?? true

  const initial =
    email
      .charAt(0)
      .toUpperCase() || 'A'
  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-7 sm:px-6 lg:px-8 lg:py-8">

      {/* PAGE HEADER */}
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
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
        className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
      >
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#625BF6]">
            DentFlow Yönetim
          </p>

          <h1 className="mt-2 text-[38px] font-bold leading-[1.05] tracking-[-0.04em] text-[#101828] sm:text-[42px]">
            Genel Bakış
          </h1>

          <p className="mt-3 max-w-[620px] text-[14px] leading-6 text-[#6F7A8E]">
            Klinik operasyonlarınızı tek çalışma alanından yönetin.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-3.5 py-2 text-[12px] font-semibold text-emerald-700 shadow-[0_6px_20px_rgba(16,185,129,0.05)]">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Oturum güvenli
        </div>
      </motion.div>


           {/* STATISTICS */}
      <motion.section
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.45,
          delay: 0.05,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
        className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map(
          ({
            label,
            value,
            icon: Icon,
            iconClass,
            accentClass,
          }) => (
            <div
              key={label}
              className="relative overflow-hidden rounded-[18px] border border-[#E7E8F0] bg-white/85 px-5 py-5 shadow-[0_8px_26px_rgba(50,48,94,0.045)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(50,48,94,0.08)]"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`grid size-12 shrink-0 place-items-center rounded-[14px] ${iconClass}`}
                >
                  <Icon
                    size={20}
                    strokeWidth={1.9}
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-[#7E899D]">
                    {label}
                  </p>

                  <p className="mt-1 text-[27px] font-bold leading-none tracking-[-0.04em] text-[#141B2D]">
                    {value}
                  </p>
                </div>
              </div>

              <div
                className={`absolute bottom-0 left-0 h-[3px] w-[86px] rounded-r-full ${accentClass}`}
              />
            </div>
          ),
        )}
      </motion.section>
<div className="mb-6 grid items-stretch gap-5 xl:grid-cols-2">
      {/* APPOINTMENT ANALYTICS */}
      <motion.section
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.45,
          delay: 0.08,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
       className="h-full rounded-[20px] border border-[#E7E8F0] bg-white/85 p-5 shadow-[0_10px_30px_rgba(50,48,94,0.045)] sm:p-6"
      >
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#625BF6]">
            Canlı Analitik
          </p>

          <h2 className="text-[19px] font-semibold tracking-[-0.025em] text-[#172033]">
            Randevu Durumları
          </h2>

          <p className="text-[12.5px] text-[#8A94A6]">
            Klinik randevularının güncel durum dağılımı.
          </p>
        </div>

       <div className="mt-5 grid items-center gap-6 md:grid-cols-[280px_minmax(0,1fr)]">
  <div className="relative h-[240px]">
    <ResponsiveContainer
      width="100%"
      height="100%"
    >
      <PieChart>
        <Pie
          data={appointmentChartData}
          dataKey="value"
          nameKey="name"
          innerRadius={64}
          outerRadius={92}
          paddingAngle={3}
          stroke="none"
        >
          {appointmentChartData.map(
            (item) => (
              <Cell
                key={item.name}
                fill={item.color}
              />
            ),
          )}
        </Pie>

        <Tooltip
          formatter={(value) => [
            `${value} randevu`,
            'Toplam',
          ]}
        />
      </PieChart>
    </ResponsiveContainer>

    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
      <span className="text-[11px] font-medium text-[#98A2B3]">
        Toplam
      </span>

      <span className="mt-1 text-[28px] font-bold leading-none text-[#172033]">
        {appointmentChartData.reduce(
          (total, item) =>
            total + item.value,
          0,
        )}
      </span>

      <span className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#A8B0BF]">
        Randevu
      </span>
    </div>
  </div>

  <div className="overflow-hidden rounded-[16px] border border-[#E7E8F0] bg-[#FCFCFE]">
    {appointmentChartData.map(
      (item, index) => (
        <div
          key={item.name}
          className={`flex items-center justify-between gap-4 px-4 py-3.5 ${
            index !==
            appointmentChartData.length - 1
              ? 'border-b border-[#ECEEF3]'
              : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className="size-2.5 rounded-full"
              style={{
                backgroundColor:
                  item.color,
              }}
            />

            <span className="text-[12px] font-semibold text-[#667085]">
              {item.name}
            </span>
          </div>

          <span className="text-[14px] font-bold text-[#172033]">
            {item.value}
          </span>
        </div>
      ),
    )}
  </div>
</div>
      </motion.section>

            {/* FINANCIAL ANALYTICS */}
      <motion.section
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.45,
          delay: 0.1,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
       className="h-full rounded-[20px] border border-[#E7E8F0] bg-white/85 p-5 shadow-[0_10px_30px_rgba(50,48,94,0.045)] sm:p-6"
      >
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#625BF6]">
            Finansal Analitik
          </p>

          <h2 className="text-[19px] font-semibold tracking-[-0.025em] text-[#172033]">
            Fatura Durumları
          </h2>

          <p className="text-[12.5px] text-[#8A94A6]">
            Klinik faturalarının güncel durum ve tutar özeti.
          </p>
        </div>

        <div className="mt-5 overflow-hidden rounded-[16px] border border-[#E7E8F0] bg-[#FCFCFE]">
  {invoiceChartData.map(
    (item, index) => (
      <div
        key={item.name}
        className={`relative grid gap-4 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_90px_150px] sm:items-center ${
          index !==
          invoiceChartData.length - 1
            ? 'border-b border-[#ECEEF3]'
            : ''
        }`}
      >
        <span
          className="absolute bottom-0 left-0 top-0 w-[3px]"
          style={{
            backgroundColor:
              item.color,
          }}
        />

        <div className="flex items-center gap-3">
          <div
            className="grid size-9 shrink-0 place-items-center rounded-full"
            style={{
              backgroundColor:
                `${item.color}12`,
            }}
          >
            <span
              className="size-2.5 rounded-full"
              style={{
                backgroundColor:
                  item.color,
              }}
            />
          </div>

          <div>
            <p className="text-[13px] font-semibold text-[#596579]">
              {item.name}
            </p>

            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-[#A5ADBB]">
              Fatura durumu
            </p>
          </div>
        </div>

        <div className="sm:border-l sm:border-[#ECEEF3] sm:pl-5">
          <p className="text-[17px] font-bold text-[#172033]">
            {item.count}
          </p>

          <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.11em] text-[#A5ADBB]">
            Fatura
          </p>
        </div>

        <div className="sm:border-l sm:border-[#ECEEF3] sm:pl-5 sm:text-right">
          <p className="text-[17px] font-bold tracking-[-0.02em] text-[#172033]">
            {new Intl.NumberFormat(
              'tr-TR',
              {
                style: 'currency',
                currency:
                  analytics?.currency ||
                  'TRY',
              },
            ).format(
              item.amount || 0,
            )}
          </p>

          <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.11em] text-[#A5ADBB]">
            Toplam tutar
          </p>
        </div>
      </div>
    ),
  )}
</div>
      </motion.section>
     
      </div>
      {/* MAIN BENTO */}
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
            duration: 0.48,
            delay: 0.1,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="rounded-[24px] border border-white/80 bg-white/68 p-5 shadow-[0_18px_50px_rgba(69,61,128,0.065)] backdrop-blur-xl sm:p-6"
        >
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[19px] font-semibold tracking-[-0.025em] text-[#172033]">
                Klinik Kontrol Merkezi
              </h2>

              <p className="mt-1 text-[13px] leading-5 text-[#8A94A6]">
                En sık kullanılan yönetim alanlarına hızlı erişin.
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-[#F0EEFF] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#625BF6]">
              DentFlow OS
            </span>
          </div>


          <div className="grid overflow-hidden rounded-[16px] border border-[#E7E8F0] bg-[#FCFCFE] md:grid-cols-2">
  {modules.map(
    ({
      title,
      description,
      to,
      icon: Icon,
      iconBox,
    }, index) => (
      <motion.div
        key={to}
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.35,
          delay:
            0.14 +
            index * 0.045,
        }}
        className={`
          ${
            index < 2
              ? 'border-b border-[#ECEEF3]'
              : ''
          }
          ${
            index % 2 === 0
              ? 'md:border-r md:border-[#ECEEF3]'
              : ''
          }
        `}
      >
        <Link
          to={to}
          className="group flex min-h-[88px] items-center gap-3 px-4 py-4 transition-colors duration-300 hover:bg-white"
        >
          <div
            className={`grid size-10 shrink-0 place-items-center rounded-[12px] ${iconBox}`}
          >
            <Icon
              size={18}
              strokeWidth={1.9}
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-[13px] font-semibold text-[#172033]">
              {title}
            </h3>

            <p className="mt-1 line-clamp-1 text-[11px] leading-5 text-[#8A94A6]">
              {description}
            </p>
          </div>

          <ArrowRight
            size={16}
            strokeWidth={1.8}
            className="shrink-0 text-[#A5ADBB] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#625BF6]"
          />
        </Link>
      </motion.div>
    ),
  )}
</div>
        </motion.section>


        {/* RIGHT */}
        <div className="space-y-4">

          {/* ADMIN ACCOUNT */}
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
              duration: 0.48,
              delay: 0.12,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(145deg,#17172E_0%,#211F4A_58%,#292461_100%)] p-5.5 text-white shadow-[0_20px_45px_rgba(23,23,46,0.22)] sm:p-6"
          >
            <div
              aria-hidden="true"
              className="absolute -right-14 -top-14 size-40 rounded-full border border-white/[0.06]"
            />

            <div
              aria-hidden="true"
              className="absolute -right-4 top-6 size-28 rounded-full border border-white/[0.04]"
            />

            <div className="relative">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
                  Yönetici hesabı
                </p>

                <div className="grid size-8 place-items-center rounded-[10px] bg-white/[0.07] text-white/70">
                  <ShieldCheck
                    size={15}
                    strokeWidth={1.8}
                  />
                </div>
              </div>


              <div className="mt-6 grid size-13 place-items-center rounded-[14px] bg-[#7168FF] text-[18px] font-bold text-white shadow-[0_10px_24px_rgba(113,104,255,0.24)]">
                {initial}
              </div>


              <h3 className="mt-5 break-all text-[15px] font-semibold leading-6 text-white">
                {email}
              </h3>

              <p className="mt-0.5 text-[12px] text-white/45">
                Klinik yöneticisi
              </p>


              <div className="mt-6 space-y-3 rounded-[17px] border border-white/10 bg-white/[0.045] p-4">
                <AccountRow
                  label="Rol"
                  value={role}
                />

                <AccountRow
                  label="Hesap"
                  value={
                    isActive
                      ? 'Aktif'
                      : 'Pasif'
                  }
                  success={isActive}
                />

                <AccountRow
                  label="E-posta"
                  value={
                    isVerified
                      ? 'Doğrulandı'
                      : 'Bekliyor'
                  }
                  success={isVerified}
                />
                <AccountRow
  label="Kimlik"
  value={
    isVerified
      ? 'Doğrulandı'
      : 'Bekliyor'
  }
  success={isVerified}
/>
              </div>
            </div>
          </motion.section>


         

        </div>
      </div>
    </div>
  )
}


function AccountRow({
  label,
  value,
  success = false,
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[11px] font-medium text-white/40">
        {label}
      </span>

      <span
        className={`flex items-center gap-1.5 text-[11px] font-semibold ${
          success
            ? 'text-emerald-300'
            : 'text-white/85'
        }`}
      >
        {success && (
          <span className="size-1.5 rounded-full bg-emerald-400" />
        )}

        {value}
      </span>
    </div>
  )
}

