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

export const getMessageContacts =
  async () => {
    const response = await fetch(
      '/api/messages/contacts',
      {
        credentials: 'include',
      },
    )

    const data = await parseResponse(
      response,
      'Mesaj kişileri alınamadı.',
    )

    return data?.contacts || []
  }

export const getConversationMessages =
  async (recipientId) => {
    const response = await fetch(
      `/api/messages/conversation/${recipientId}`,
      {
        credentials: 'include',
      },
    )

    const data = await parseResponse(
      response,
      'Mesajlar alınamadı.',
    )

    return data?.messages || []
  }

export const sendMessage = async ({
  recipientId,
  content,
}) => {
  const response = await fetch(
    '/api/messages',
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type':
          'application/json',
      },
      body: JSON.stringify({
        recipientId,
        content,
      }),
    },
  )

  const data = await parseResponse(
    response,
    'Mesaj gönderilemedi.',
  )

  return data?.message || null
}

export const getUnreadMessageCount =
  async () => {
    const response = await fetch(
      '/api/messages/unread-count',
      {
        credentials: 'include',
      },
    )

    const data = await parseResponse(
      response,
      'Okunmamış mesaj sayısı alınamadı.',
    )

    return data?.unreadCount || 0
  }