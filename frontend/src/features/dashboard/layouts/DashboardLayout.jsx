import {
  useEffect,
  useState,
} from 'react'

import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router'
import BrandLogo from '../../../components/ui/BrandLogo.jsx'
import {
  CalendarDays,
  CalendarPlus,
  ChevronLeft,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Settings,
  Stethoscope,
  UserRound,
  UsersRound,
  Bell,
  X,
} from 'lucide-react'

import {
  AnimatePresence,
  motion,
} from 'motion/react'

import {
  useAuth,
} from '../../auth/context/authContext.js'

import {
  getUnreadMessageCount,
} from '../shared/api/messagesApi.js'

import {
  getUnreadNotificationCount,
} from '../shared/api/notificationsApi.js'

import NotificationDropdown from '../shared/components/NotificationDropdown.jsx'

const roleNavigation = {
  PATIENT: [
  {
    label: 'Genel Bakış',
    to: '/patient',
    icon: LayoutDashboard,
    end: true,
  },

  {
    label: 'Randevu Al',
    to: '/patient/book',
    icon: CalendarPlus,
  },

  {
    label: 'Randevularım',
    to: '/patient/appointments',
    icon: CalendarDays,
  },

  {
    label: 'Tedavi Sürecim',
    to: '/patient/treatments',
    icon: Stethoscope,
  },

  {
    label: 'Faturalarım',
    to: '/patient/invoices',
    icon: FileText,
  },

  {
    label: 'Mesajlar',
    to: '/patient/messages',
    icon: MessageCircle,
  },

  {
    label: 'Profilim',
    to: '/patient/profile',
    icon: UserRound,
  },
],
  DOCTOR: [
    {
      label: 'Genel Bakış',
      to: '/doctor',
      icon: LayoutDashboard,
      end: true,
    },
    {
      label: 'Randevular',
      to: '/doctor/appointments',
      icon: CalendarDays,
    },
    {
      label: 'Hastalar',
      to: '/doctor/patients',
      icon: UsersRound,
    },
    {
  label: 'Faturalar',
  to: '/doctor/invoices',
  icon: FileText,
},
    {
      label: 'Mesajlar',
      to: '/doctor/messages',
      icon: MessageCircle,
    },
    {
      label: 'Profil',
      to: '/doctor/profile',
      icon: UserRound,
    },
  ],

  ADMIN: [
    {
      label: 'Genel Bakış',
      to: '/admin',
      icon: LayoutDashboard,
      end: true,
    },
    {
      label: 'Doktor Yönetimi',
      to: '/admin/doctors',
      icon: Stethoscope,
    },
    {
      label: 'Randevular',
      to: '/admin/appointments',
      icon: CalendarDays,
    },
    {
      label: 'Hastalar',
      to: '/admin/patients',
      icon: UsersRound,
    },
    {
      label: 'Mesajlar',
      to: '/admin/messages',
      icon: MessageCircle,
    },
    {
      label: 'Ayarlar',
      to: '/admin/settings',
      icon: Settings,
    },
  ],
}


const roleLabel = {
  PATIENT: 'Hasta',
  DOCTOR: 'Doktor',
  ADMIN: 'Yönetici',
}


export default function DashboardLayout() {
  const navigate = useNavigate()
const location = useLocation()
  const {
    user,
    logout,
  } = useAuth()

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false)

const [
  unreadMessageCount,
  setUnreadMessageCount,
] = useState(0)


const [
  unreadNotificationCount,
  setUnreadNotificationCount,
] = useState(0)

const [
  notificationOpen,
  setNotificationOpen,
] = useState(false)


  const navigation =
    roleNavigation[user?.role] || []

useEffect(() => {
  if (
    user?.role !== 'PATIENT' &&
    user?.role !== 'DOCTOR'
  ) {
    
    return undefined
  }

  let active = true

  const loadUnreadCount = async () => {
    try {
      const count =
        await getUnreadMessageCount()

      if (active) {
        setUnreadMessageCount(
          count,
        )
      }
    } catch {
      if (active) {
        setUnreadMessageCount(0)
      }
    }
  }

  const timeoutId = setTimeout(
    loadUnreadCount,
    location.pathname.includes(
      '/messages',
    )
      ? 500
      : 0,
  )

  const intervalId = setInterval(
    loadUnreadCount,
    10000,
  )

  return () => {
    active = false
    clearTimeout(timeoutId)
    clearInterval(intervalId)
  }
}, [user?.role, location.pathname])
useEffect(() => {
  if (!user) return undefined

  let active = true

  const loadNotificationCount =
    async () => {
      try {
        const count =
          await getUnreadNotificationCount()

        if (active) {
          setUnreadNotificationCount(
            count,
          )
        }
      } catch {
        if (active) {
          setUnreadNotificationCount(0)
        }
      }
    }

  loadNotificationCount()

  const intervalId = setInterval(
    loadNotificationCount,
    10000,
  )

  return () => {
    active = false
    clearInterval(intervalId)
  }
}, [user])
  const handleLogout = async () => {
    await logout()

    navigate('/', {
      replace: true,
    })
  }


  return (
<div className="relative min-h-screen overflow-x-hidden bg-[#F3F1FA] text-[#101828]">
    {/* AMBIENT DASHBOARD BACKGROUND */}

<div
  aria-hidden="true"
  className="pointer-events-none fixed inset-0 overflow-hidden"
>
  <motion.div
    animate={{
      x: [0, 28, 0],
      y: [0, -18, 0],
    }}
    transition={{
      duration: 14,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
    className="absolute right-[4%] top-[5%] size-[420px] rounded-full bg-[#7168FF]/[0.09] blur-[90px]"
  />

  <motion.div
    animate={{
      x: [0, -20, 0],
      y: [0, 22, 0],
    }}
    transition={{
      duration: 17,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
    className="absolute bottom-[3%] left-[24%] size-[360px] rounded-full bg-[#39BDF8]/[0.06] blur-[100px]"
  />

  <div className="absolute right-0 top-0 h-[420px] w-[42%] bg-gradient-to-bl from-[#E9E6FF]/70 via-transparent to-transparent" />
</div>
      {/* =========================
          DESKTOP SIDEBAR
         ========================= */}

     <aside className="fixed inset-y-0 left-0 z-40 hidden w-[272px] border-r border-white/10 bg-[linear-gradient(180deg,#17172E_0%,#1D1C3D_58%,#17172E_100%)] text-white shadow-[18px_0_55px_rgba(23,23,46,0.10)] lg:flex lg:flex-col">
       <DashboardBrand
  role={user?.role}
/>

        <div className="flex-1 overflow-y-auto px-4 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
         <div className="flex items-center justify-between px-3">
  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
    MENÜ
  </p>

  <span className="size-1.5 rounded-full bg-emerald-400" />
</div>

          <nav className="mt-3 space-y-1">
            {navigation.map(
              ({
                label,
                to,
                icon: Icon,
                end,
              }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                 className={({
  isActive,
}) => `
  group relative flex h-[44px] items-center gap-3
  rounded-[12px] px-3 text-[13.5px] font-medium
  transition-all duration-200
  ${
    isActive
  ? 'bg-white/[0.10] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_10px_24px_rgba(0,0,0,0.10)]'
  : 'text-white/58 hover:bg-white/[0.06] hover:text-white'
  }
`}
                >
                  {({
                    isActive,
                  }) => (
                   <>
  {isActive && (
    <motion.span
      layoutId="dashboard-active-rail"
      className="absolute -left-4 h-6 w-[3px] rounded-r-full bg-[#8B83FF] shadow-[0_0_14px_rgba(139,131,255,0.75)]"
    />
  )}

  <span
    className={`
      grid size-8 shrink-0 place-items-center rounded-[10px]
      transition-all duration-200
      ${
        isActive
          ? 'bg-[#7168FF] text-white shadow-[0_7px_18px_rgba(113,104,255,0.28)]'
          : 'text-white/50 group-hover:text-white/90'
      }
    `}
  >
    <Icon
      size={17}
      strokeWidth={
        isActive
          ? 2.1
          : 1.8
      }
    />
  </span>

<span className="min-w-0 flex-1 truncate">
  {label}
</span>

{label === 'Mesajlar' &&
  unreadMessageCount > 0 && (
    <span className="ml-auto flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-[#7168FF] px-1.5 text-[9px] font-bold text-white shadow-[0_0_14px_rgba(113,104,255,0.35)]">
      {unreadMessageCount > 9
        ? '9+'
        : unreadMessageCount}
    </span>
  )}
</>
                  )}
                </NavLink>
              ),
            )}
          </nav>
        </div>

        <div className="border-t border-white/10 p-4">
          <UserCard
            user={user}
          />

  <button
  type="button"
  onClick={handleLogout}
  className="mt-2 flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-white/55 transition hover:bg-red-400/10 hover:text-red-200"
>
  <LogOut
    size={16}
    strokeWidth={1.9}
  />

  Çıkış Yap
</button>
        </div>
      </aside>


      {/* =========================
          MOBILE SIDEBAR
         ========================= */}

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Menüyü kapat"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={() =>
                setMobileOpen(false)
              }
              className="fixed inset-0 z-50 bg-slate-950/25 backdrop-blur-[2px] lg:hidden"
            />

            <motion.aside
              initial={{
                x: '-100%',
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: '-100%',
              }}
              transition={{
                duration: 0.3,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="fixed inset-y-0 left-0 z-[60] flex w-[290px] flex-col bg-[linear-gradient(180deg,#17172E_0%,#1D1C3D_58%,#17172E_100%)] text-white shadow-[20px_0_60px_rgba(15,23,42,0.22)] lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
                <div className="rounded-[14px] bg-white/[0.96] px-3 py-2 shadow-[0_8px_22px_rgba(0,0,0,0.10)]">
                  <DashboardBrand
                    compact
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  aria-label="Menüyü kapat"
                  className="grid size-9 place-items-center rounded-xl text-white/60 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={19} />
                </button>
              </div>

              <nav className="flex-1 space-y-1 overflow-y-auto p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {navigation.map(
                  ({
                    label,
                    to,
                    icon: Icon,
                    end,
                  }) => (
                    <NavLink
                      key={to}
                      to={to}
                      end={end}
                      onClick={() =>
                        setMobileOpen(false)
                      }
                      className={({
                        isActive,
                      }) => `
                        flex h-11 items-center gap-3 rounded-xl px-3
                        text-sm font-medium transition
                        ${
                          isActive
                            ? 'bg-white/[0.10] text-white'
                            : 'text-white/58 hover:bg-white/[0.06] hover:text-white'
                        }
                      `}
                    >
                      <Icon
                        size={18}
                      />

                      {label}
                    </NavLink>
                  ),
                )}
              </nav>

              <div className="border-t border-white/10 p-4">
                <UserCard
                  user={user}
                />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-3 flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-white/55 transition hover:bg-red-400/10 hover:text-red-200"
                >
                  <LogOut size={17} />

                  Çıkış Yap
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>


      {/* =========================
          MAIN AREA
         ========================= */}

      <div className="relative z-10 lg:pl-[272px]">

       <header className="sticky top-0 z-30 flex h-[72px] items-center border-b border-[#DDD9EC]/70 bg-[#F7F5FC]/78 px-4 shadow-[0_8px_30px_rgba(68,62,125,0.035)] backdrop-blur-xl sm:px-6 lg:px-8">

          <button
            type="button"
            onClick={() =>
              setMobileOpen(true)
            }
            aria-label="Menüyü aç"
            className="mr-3 grid size-10 place-items-center rounded-xl text-[#667085] transition hover:bg-[#F2F4F7] lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold text-[#8B93A7]">
  DentFlow AI
</p>

            <p className="mt-0.5 truncate text-[13px] font-semibold text-[#344054]">
  {roleLabel[user?.role] || 'Kullanıcı'} çalışma alanı
</p>
          </div>


          <div className="ml-auto flex items-center gap-3">
<div className="relative">
  <button
    type="button"
    aria-label="Bildirimler"
    onClick={() =>
      setNotificationOpen(
        (current) => !current,
      )
    }
    className="relative grid size-10 place-items-center rounded-xl border border-[#E4E7EC] bg-white text-[#667085] transition hover:bg-[#F9FAFB] hover:text-[#5B52F2]"
  >
    <Bell
      size={18}
      strokeWidth={1.9}
    />

    {unreadNotificationCount > 0 && (
      <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#7168FF] px-1 text-[9px] font-bold text-white">
        {unreadNotificationCount > 9
          ? '9+'
          : unreadNotificationCount}
      </span>
    )}
  </button>

  {notificationOpen && (
    <NotificationDropdown
      onClose={() =>
        setNotificationOpen(false)
      }
      onUnreadCountChange={
        setUnreadNotificationCount
      }
    />
  )}
</div>

            <button
              type="button"
              onClick={() =>
                navigate('/')
              }
              className="hidden items-center gap-2 rounded-xl border border-[#E4E7EC] bg-white px-3 py-2 text-sm font-medium text-[#475467] transition hover:bg-[#F9FAFB] sm:flex"
            >
              <ChevronLeft
                size={16}
              />

              Ana Site
            </button>

            <div className="grid size-10 place-items-center rounded-full bg-[#EEEDFF] text-sm font-bold text-[#5B52F2]">
              {getUserInitial(
                user,
              )}
            </div>
          </div>
        </header>


        <main className="min-h-[calc(100vh-72px)]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}


function DashboardBrand({
  compact = false,
  role,
}) {
  return (
    <div
      className={
        compact
          ? ''
          : 'border-b border-white/10 px-4 py-4'
      }
    >
     <div className="flex items-center justify-between gap-3 rounded-[16px] border border-white/10 bg-white/[0.055] px-3 py-2.5">
        <div className="min-w-0">
          <BrandLogo inverse />
        </div>

        {!compact && (
          <span className="shrink-0 rounded-lg border border-[#E4E1FF] bg-[#F5F3FF] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.11em] text-[#5B52F2]">
            {roleLabel[role] ||
              'Panel'}
          </span>
        )}
      </div>
    </div>
  )
}


function UserCard({
  user,
}) {
  const email =
    user?.email ||
    'dentflow@clinic.com'

  const displayName =
    email.split('@')[0]

  return (
    <div className="rounded-[16px] border border-white/10 bg-white/[0.055] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex min-w-0 items-center gap-3">

        <div className="grid size-10 shrink-0 place-items-center rounded-[13px] bg-[#5B52F2] text-sm font-semibold text-white shadow-[0_6px_16px_rgba(91,82,242,0.18)]">
          {getUserInitial(user)}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white/90">
            {displayName}
          </p>

          <p className="mt-0.5 truncate text-[11px] text-white/38">
            {email}
          </p>
        </div>

      </div>

      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
        <span className="text-[11px] font-medium text-white/38">
          {roleLabel[
            user?.role
          ] || 'Kullanıcı'}
        </span>

        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-300">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Aktif
        </span>
      </div>
    </div>
  )
} 


function getUserInitial(user) {
  const email =
    user?.email || ''

  return email
    .charAt(0)
    .toUpperCase() || 'D'
}