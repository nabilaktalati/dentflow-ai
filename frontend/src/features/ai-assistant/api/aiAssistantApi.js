export const sendAiAssistantMessage =
  async (
    message,
    history = [],
  ) => {
    const response = await fetch(
      '/api/ai-assistant/message',
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify({
  message,
  history,
}),
      },
    )

    let data

    try {
      data = await response.json()
    } catch {
      throw new Error(
        'Asistan yanıtı okunamadı.',
      )
    }

    if (!response.ok) {
      const error = new Error(
        data?.message ||
          'AI asistan şu anda yanıt veremiyor.',
      )

      error.code = data?.code
      error.status = response.status

      throw error
    }

    return data?.data?.assistant || null
  }

  export const confirmAiAppointment =
  async ({
    doctorProfileId,
    date,
    time,
  }) => {
    const response = await fetch(
      '/api/ai-assistant/appointments/confirm',
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify({
          doctorProfileId,
          date,
          time,
        }),
      },
    )

    let data

    try {
      data = await response.json()
    } catch {
      throw new Error(
        'Randevu yanıtı okunamadı.',
      )
    }

    if (!response.ok) {
      const error = new Error(
        data?.message ||
          'Randevu oluşturulamadı.',
      )

      error.code = data?.code
      error.status = response.status

      throw error
    }

    return data
  }

  export const confirmAiMessage = async ({
  recipientId,
  content,
}) => {
  const response = await fetch(
    '/api/ai-assistant/messages/confirm',
    {
      method: 'POST',

      credentials: 'include',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        recipientId,
        content,
      }),
    },
  )

  const result =
    await response.json()

  if (!response.ok) {
    const error =
      new Error(
        result?.message ||
          'Mesaj gönderilemedi.',
      )

    error.status =
      response.status

    error.code =
      result?.code

    throw error
  }

  return result
}