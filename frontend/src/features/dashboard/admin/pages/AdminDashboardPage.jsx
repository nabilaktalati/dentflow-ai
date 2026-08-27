import {
  ArrowRight,
  CalendarDays,
  MessageCircle,
  ShieldCheck,
  Stethoscope,
  UsersRound,
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
    icon: MessageCircle,
    iconBox:
      'bg-[#EAFBF1] text-[#16A34A]',
    surface:
      'border-[#E2F4E8] bg-gradient-to-br from-[#F8FFF9] to-white',
    hoverShadow:
      'hover:shadow-[0_16px_32px_rgba(22,163,74,0.09)]',
  },
]


const stats = [
  {
    label: 'Toplam Doktor',
    value: '—',
    icon: Stethoscope,
    iconClass:
      'bg-[#EFEAFF] text-[#6C63FF]',
  },
  {
    label: 'Bugünkü Randevu',
    value: '—',
    icon: CalendarDays,
    iconClass:
      'bg-[#EAF3FF] text-[#4A85FF]',
  },
  {
    label: 'Kayıtlı Hasta',
    value: '—',
    icon: UsersRound,
    iconClass:
      'bg-[#E7FAF5] text-[#0F9F7F]',
  },
  {
    label: 'Mesajlar',
    value: '—',
    icon: MessageCircle,
    iconClass:
      'bg-[#EAFBF1] text-[#16A34A]',
  },
]


export default function AdminDashboardPage() {
  const {
    user,
  } = useAuth()

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
        className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map(
          ({
            label,
            value,
            icon: Icon,
            iconClass,
          }) => (
            <div
              key={label}
              className="group rounded-[18px] border border-white/80 bg-white/65 p-4 shadow-[0_10px_30px_rgba(62,56,120,0.05)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:bg-white/85"
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

              <div className="mt-4 h-px w-full bg-[#EEF0F5]" />

              <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.11em] text-[#B0B7C5]">
                Canlı veri
              </p>
            </div>
          ),
        )}
      </motion.section>


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


          <div className="grid gap-3 md:grid-cols-2">
            {modules.map(
              ({
                title,
                description,
                to,
                icon: Icon,
                iconBox,
                surface,
                hoverShadow,
              },
              index) => (
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
                >
                  <Link
                    to={to}
                    className={`group flex min-h-[150px] h-full flex-col rounded-[18px] border p-4.5 transition-all duration-300 hover:-translate-y-1 ${surface} ${hoverShadow}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className={`grid size-11 place-items-center rounded-[13px] ${iconBox}`}
                      >
                        <Icon
                          size={18}
                          strokeWidth={1.9}
                        />
                      </div>

                      <div className="grid size-8 place-items-center rounded-full text-[#A4ACB9] transition duration-300 group-hover:bg-white group-hover:text-[#625BF6]">
                        <ArrowRight
                          size={16}
                          strokeWidth={1.9}
                          className="transition-transform duration-300 group-hover:translate-x-0.5"
                        />
                      </div>
                    </div>

                    <div className="mt-auto pt-5">
                      <h3 className="text-[15px] font-semibold tracking-[-0.015em] text-[#172033]">
                        {title}
                      </h3>

                      <p className="mt-1.5 text-[12.5px] leading-5 text-[#758096]">
                        {description}
                      </p>
                    </div>
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
              </div>
            </div>
          </motion.section>


          {/* SECURITY */}
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
              delay: 0.18,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="rounded-[24px] border border-[#E4E2F5] bg-white/70 p-5 shadow-[0_14px_36px_rgba(74,67,135,0.06)] backdrop-blur-xl"
          >
            <div className="flex items-start gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-[#F0EEFF] text-[#625BF6]">
                <ShieldCheck
                  size={18}
                  strokeWidth={1.9}
                />
              </div>

              <div>
                <h3 className="text-[16px] font-semibold tracking-[-0.02em] text-[#172033]">
                  Güvenli yönetim oturumu
                </h3>

                <p className="mt-1.5 text-[12.5px] leading-5 text-[#758096]">
                  Yetkileriniz ADMIN rolüne göre korunuyor ve aktif oturumunuz doğrulanıyor.
                </p>
              </div>
            </div>


            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              <StatusItem
                title="Kimlik"
                value={
                  isVerified
                    ? 'Doğrulandı'
                    : 'Bekliyor'
                }
              />

              <StatusItem
                title="Yetkilendirme"
                value={role}
              />
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


function StatusItem({
  title,
  value,
}) {
  return (
    <div className="rounded-[15px] border border-white/80 bg-[#F8F7FC]/85 p-3.5">
      <p className="text-[10px] font-medium text-[#9AA3B4]">
        {title}
      </p>

      <p className="mt-1.5 text-[13px] font-semibold text-[#273142]">
        {value}
      </p>
    </div>
  )
}