import {
  CalendarDays,
  MessageCircle,
  ShieldCheck,
  Stethoscope,
  UsersRound,
} from 'lucide-react'

import {
  motion,
} from 'motion/react'

import {
  useAuth,
} from '../../../auth/context/authContext.js'


const doctorStats = [
  {
    label: 'Bugünkü Randevu',
    value: '—',
    icon: CalendarDays,
    iconClass: 'bg-[#EAF3FF] text-[#4A85FF]',
  },
  {
    label: 'Aktif Hastalar',
    value: '—',
    icon: UsersRound,
    iconClass: 'bg-[#E7FAF5] text-[#0F9F7F]',
  },
  {
    label: 'Tedavi Süreçleri',
    value: '—',
    icon: Stethoscope,
    iconClass: 'bg-[#EFEAFF] text-[#6C63FF]',
  },
  {
    label: 'Mesajlar',
    value: '—',
    icon: MessageCircle,
    iconClass: 'bg-[#EAFBF1] text-[#16A34A]',
  },
]


const doctorAreas = [
  {
    title: 'Randevular',
    description:
      'Günlük ve yaklaşan hasta randevularınızı görüntüleyin.',
    icon: CalendarDays,
    iconClass: 'bg-[#EAF3FF] text-[#4A85FF]',
  },
  {
    title: 'Hastalar',
    description:
      'Size bağlı hasta kayıtlarına ve klinik süreçlere erişin.',
    icon: UsersRound,
    iconClass: 'bg-[#E7FAF5] text-[#0F9F7F]',
  },
  {
    title: 'Tedavi Takibi',
    description:
      'Hasta tedavi süreçlerini ve klinik ilerlemeyi takip edin.',
    icon: Stethoscope,
    iconClass: 'bg-[#EFEAFF] text-[#6C63FF]',
  },
  {
    title: 'Mesajlar',
    description:
      'Hasta ve klinik ekibiyle güvenli iletişimi yönetin.',
    icon: MessageCircle,
    iconClass: 'bg-[#EAFBF1] text-[#16A34A]',
  },
]


export default function DoctorDashboardPage() {
  const {
    user,
  } = useAuth()

  const email =
    user?.email || '—'

  const role =
    user?.role || 'DOCTOR'

  const isActive =
    user?.status
      ? user.status === 'ACTIVE'
      : true

  const isVerified =
    user?.isEmailVerified ?? true

  const initial =
    email !== '—'
      ? email.charAt(0).toUpperCase()
      : 'D'


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
            DentFlow Doktor
          </p>

          <h1 className="mt-2 text-[38px] font-bold leading-[1.05] tracking-[-0.04em] text-[#101828] sm:text-[42px]">
            Klinik çalışma alanı
          </h1>

          <p className="mt-3 max-w-[620px] text-[14px] leading-6 text-[#6F7A8E]">
            Randevularınızı, hastalarınızı ve klinik iletişiminizi tek alandan yönetin.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-3.5 py-2 text-[12px] font-semibold text-emerald-700">
          <ShieldCheck
            size={14}
            strokeWidth={2}
          />
          Oturum güvenli
        </div>
      </motion.div>


      {/* STATS */}
      <section className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {doctorStats.map(
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
                delay: index * 0.05,
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
              Doktor Merkezi
            </p>

            <h2 className="mt-2 text-[20px] font-semibold tracking-[-0.025em] text-[#172033]">
              Günlük klinik akışınız
            </h2>

            <p className="mt-2 max-w-[620px] text-[13px] leading-6 text-[#7A8497]">
              Hasta randevularınıza, tedavi süreçlerine ve güvenli iletişim araçlarına hızlı erişin.
            </p>
          </div>


          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {doctorAreas.map(
              ({
                title,
                description,
                icon: Icon,
                iconClass,
              }) => (
                <div
                  key={title}
                  className="rounded-[18px] border border-[#ECEBF3] bg-white/60 p-4"
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
                </div>
              ),
            )}
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
              Doktor hesabı
            </p>

            <div className="mt-6 grid size-13 place-items-center rounded-[14px] bg-[#7168FF] text-lg font-bold">
              {initial}
            </div>

            <h3 className="mt-5 text-[16px] font-semibold text-white">
              Doktor
            </h3>

            <p className="mt-1 break-all text-[12px] text-white/45">
              {email}
            </p>

            <div className="mt-6 space-y-3 rounded-[17px] border border-white/10 bg-white/[0.045] p-4">
              <DoctorAccountRow
                label="Rol"
                value={role}
              />

              <DoctorAccountRow
                label="Hesap"
                value={
                  isActive
                    ? 'Aktif'
                    : 'Pasif'
                }
                success={isActive}
              />

              <DoctorAccountRow
                label="E-posta"
                value={
                  isVerified
                    ? 'Doğrulandı'
                    : 'Bekliyor'
                }
                success={isVerified}
              />
            </div>
          </motion.section>


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
              delay: 0.18,
            }}
            className="rounded-[22px] border border-[#E4E2F5] bg-white/70 p-5 shadow-[0_14px_36px_rgba(74,67,135,0.06)] backdrop-blur-xl"
          >
            <div className="flex items-start gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-[#F0EEFF] text-[#625BF6]">
                <ShieldCheck
                  size={18}
                  strokeWidth={1.9}
                />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#625BF6]">
                  Klinik erişimi
                </p>

                <h3 className="mt-1.5 text-[16px] font-semibold text-[#172033]">
                  Doktor yetkileri aktif
                </h3>

                <p className="mt-1.5 text-[12px] leading-5 text-[#7A8497]">
                  Erişiminiz doktor rolüne göre korunur.
                </p>
              </div>
            </div>
          </motion.section>

        </div>
      </div>
    </div>
  )
}


function DoctorAccountRow({
  label,
  value,
  success = false,
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[11px] text-white/40">
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