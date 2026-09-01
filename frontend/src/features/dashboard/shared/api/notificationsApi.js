const parseResponse = async (
  response,
  fallbackMessage,
) => {
  const data = await response.json()

  if (!response.ok) {
    const error = new Error(
      data.message || fallbackMessage,
    )

    error.code = data.code
    throw error
  }

  return data.data
}

export const getNotifications =
  async () => {
    const response = await fetch(
      '/api/notifications',
      {
        credentials: 'include',
      },
    )

    const data = await parseResponse(
      response,
      'Bildirimler alınamadı.',
    )

    return data?.notifications || []
  }

export const getUnreadNotificationCount =
  async () => {
    const response = await fetch(
      '/api/notifications/unread-count',
      {
        credentials: 'include',
      },
    )

    const data = await parseResponse(
      response,
      'Okunmamış bildirim sayısı alınamadı.',
    )

    return data?.unreadCount || 0
  }

export const markNotificationAsRead =
  async (notificationId) => {
    const response = await fetch(
      `/api/notifications/${notificationId}/read`,
      {
        method: 'PATCH',
        credentials: 'include',
      },
    )

    const data = await parseResponse(
      response,
      'Bildirim güncellenemedi.',
    )

    return data?.notification || null
  }

export const markAllNotificationsAsRead =
  async () => {
    const response = await fetch(
      '/api/notifications/read-all',
      {
        method: 'PATCH',
        credentials: 'include',
      },
    )

    await parseResponse(
      response,
      'Bildirimler güncellenemedi.',
    )

    return true
  }