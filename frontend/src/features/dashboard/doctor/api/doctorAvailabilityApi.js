const AVAILABILITY_URL =
  '/api/doctor/availability'


const parseResponse = async (
  response,
) => {
  let data

  try {
    data =
      await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const error =
      new Error(
        data?.message ||
          'İşlem tamamlanamadı.',
      )

    error.status =
      response.status

    error.errors =
      data?.errors || null

    throw error
  }

  return data
}


export const getMyAvailability =
  async () => {
    let response

    try {
      response = await fetch(
        AVAILABILITY_URL,
        {
          method: 'GET',
          credentials: 'include',
        },
      )
    } catch {
      throw new Error(
        'Sunucuya ulaşılamadı. Lütfen tekrar deneyin.',
      )
    }

    return parseResponse(
      response,
    )
  }


export const updateMyAvailability =
  async (
    availabilityData,
  ) => {
    let response

    try {
      response = await fetch(
        AVAILABILITY_URL,
        {
          method: 'PUT',

          headers: {
            'Content-Type':
              'application/json',
          },

          credentials: 'include',

          body: JSON.stringify(
            availabilityData,
          ),
        },
      )
    } catch {
      throw new Error(
        'Sunucuya ulaşılamadı. Lütfen tekrar deneyin.',
      )
    }

    return parseResponse(
      response,
    )
  }