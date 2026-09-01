import {
  useEffect,
  useState,
} from 'react'

import {
  Bell,
  CalendarDays,
  CheckCheck,
  CircleDollarSign,
  FileText,
  Info,
  LoaderCircle,
  MessageCircle,
  X,
} from 'lucide-react'

import {
  useNavigate,
} from 'react-router'

import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../api/notificationsApi.js'

const notificationIconMap = {
  MESSAGE: MessageCircle,
  APPOINTMENT: CalendarDays,
  INVOICE: FileText,
  PAYMENT: CircleDollarSign,
  SYSTEM: Info,
}

const notificationStyleMap = {
  MESSAGE:
    'bg-violet-50 text-violet-600',
  APPOINTMENT:
    'bg-sky-50 text-sky-600',
  INVOICE:
    'bg-amber-50 text-amber-600',
  PAYMENT:
    'bg-emerald-50 text-emerald-600',
  SYSTEM:
    'bg-slate-100 text-slate-600',
}

const formatNotificationTime = (
  value,
) => {
  if (!value) return ''

  const date = new Date(value)
  const now = new Date()

  const diffMs =
    now.getTime() - date.getTime()

  const diffMinutes =
    Math.floor(
      diffMs / (1000 * 60),
    )

  if (diffMinutes < 1) {
    return 'Şimdi'
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} dk önce`
  }

  const diffHours =
    Math.floor(diffMinutes / 60)

  if (diffHours < 24) {
    return `${diffHours} sa önce`
  }

  return new Intl.DateTimeFormat(
    'tr-TR',
    {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    },
  ).format(date)
}

export default function NotificationDropdown({
  onClose,
  onUnreadCountChange,
}) {
  const navigate = useNavigate()

  const [
    notifications,
    setNotifications,
  ] = useState([])

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    markingAll,
    setMarkingAll,
  ] = useState(false)

  const [error, setError] =
    useState('')

  useEffect(() => {
    const loadNotifications =
      async () => {
        try {
          setLoading(true)
          setError('')

          const result =
            await getNotifications()

          setNotifications(result)
        } catch (err) {
          setError(
            err.message ||
              'Bildirimler yüklenemedi.',
          )
        } finally {
          setLoading(false)
        }
      }

    loadNotifications()
  }, [])

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.isRead,
    ).length

  const handleNotificationClick =
    async (notification) => {
      try {
        if (!notification.isRead) {
          await markNotificationAsRead(
            notification.id,
          )

          const updated =
            notifications.map(
              (item) =>
                item.id ===
                notification.id
                  ? {
                      ...item,
                      isRead: true,
                      readAt:
                        new Date().toISOString(),
                    }
                  : item,
            )

          setNotifications(updated)

          onUnreadCountChange?.(
            Math.max(
              unreadCount - 1,
              0,
            ),
          )
        }

        onClose?.()

        if (notification.actionPath) {
          navigate(
            notification.actionPath,
          )
        }
      } catch (err) {
        setError(
          err.message ||
            'Bildirim açılamadı.',
        )
      }
    }

  const handleMarkAllRead =
    async () => {
      if (
        markingAll ||
        unreadCount === 0
      ) {
        return
      }

      try {
        setMarkingAll(true)
        setError('')

        await markAllNotificationsAsRead()

        setNotifications(
          (current) =>
            current.map(
              (notification) => ({
                ...notification,
                isRead: true,
                readAt:
                  notification.readAt ||
                  new Date().toISOString(),
              }),
            ),
        )

        onUnreadCountChange?.(0)
      } catch (err) {
        setError(
          err.message ||
            'Bildirimler güncellenemedi.',
        )
      } finally {
        setMarkingAll(false)
      }
    }

  return (
    <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-[380px] overflow-hidden rounded-[22px] border border-[#E7E5EF] bg-white shadow-[0_24px_70px_rgba(30,27,75,0.16)]">
      {/* HEADER */}
      <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid size-8 place-items-center rounded-xl bg-violet-50 text-violet-600">
              <Bell size={15} />
            </div>

            <div>
              <h3 className="text-[13px] font-semibold text-slate-950">
                Bildirimler
              </h3>

              <p className="mt-0.5 text-[10px] text-slate-400">
                {unreadCount > 0
                  ? `${unreadCount} okunmamış bildirim`
                  : 'Yeni bildirim bulunmuyor'}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Bildirimleri kapat"
          className="grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={15} />
        </button>
      </div>

      {/* ACTION */}
      {unreadCount > 0 && (
        <div className="flex justify-end border-b border-slate-100 bg-slate-50/50 px-4 py-2">
          <button
            type="button"
            onClick={
              handleMarkAllRead
            }
            disabled={markingAll}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[10px] font-semibold text-violet-600 transition hover:bg-violet-50 disabled:opacity-50"
          >
            {markingAll ? (
              <LoaderCircle
                size={12}
                className="animate-spin"
              />
            ) : (
              <CheckCheck
                size={13}
              />
            )}

            Tümünü okundu yap
          </button>
        </div>
      )}

      {error && (
        <div className="mx-4 mt-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-[11px] text-red-600">
          {error}
        </div>
      )}

      {/* LIST */}
      <div className="max-h-[430px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {loading ? (
          <div className="flex h-[220px] items-center justify-center">
            <LoaderCircle
              size={22}
              className="animate-spin text-violet-600"
            />
          </div>
        ) : notifications.length ===
          0 ? (
          <div className="flex h-[240px] flex-col items-center justify-center px-8 text-center">
            <div className="grid size-12 place-items-center rounded-2xl bg-slate-50 text-slate-300">
              <Bell size={20} />
            </div>

            <p className="mt-3 text-[12px] font-semibold text-slate-700">
              Bildirim bulunmuyor
            </p>

            <p className="mt-1 text-[10px] leading-5 text-slate-400">
              Yeni hareketler burada
              görüntülenecek.
            </p>
          </div>
        ) : (
          notifications.map(
            (notification) => {
              const Icon =
                notificationIconMap[
                  notification.type
                ] || Info

              const iconStyle =
                notificationStyleMap[
                  notification.type
                ] ||
                notificationStyleMap.SYSTEM

              return (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() =>
                    handleNotificationClick(
                      notification,
                    )
                  }
                  className={`relative flex w-full gap-3 border-b border-slate-100 px-4 py-4 text-left transition last:border-b-0 hover:bg-slate-50 ${
                    !notification.isRead
                      ? 'bg-violet-50/30'
                      : 'bg-white'
                  }`}
                >
                  {!notification.isRead && (
                    <span className="absolute right-4 top-5 size-1.5 rounded-full bg-violet-600" />
                  )}

                  <div
                    className={`grid size-10 shrink-0 place-items-center rounded-[13px] ${iconStyle}`}
                  >
                    <Icon size={16} />
                  </div>

                  <div className="min-w-0 flex-1 pr-4">
                    <p
                      className={`truncate text-[12px] ${
                        notification.isRead
                          ? 'font-medium text-slate-700'
                          : 'font-semibold text-slate-950'
                      }`}
                    >
                      {
                        notification.title
                      }
                    </p>

                    <p className="mt-1 line-clamp-2 text-[10.5px] leading-[17px] text-slate-500">
                      {
                        notification.message
                      }
                    </p>

                    <p className="mt-2 text-[9px] font-medium text-slate-400">
                      {formatNotificationTime(
                        notification.createdAt,
                      )}
                    </p>
                  </div>
                </button>
              )
            },
          )
        )}
      </div>
    </div>
  )
}   