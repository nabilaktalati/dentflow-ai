const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  ''


const parseResponse = async (
  response,
) => {
  const data =
    await response.json()

  if (!response.ok) {
    throw new Error(
      data.message ||
        'İşlem sırasında bir hata oluştu.',
    )
  }

  return data
}


export const createTreatmentRecord =
  async (payload) => {
    const response =
      await fetch(
        `${API_BASE_URL}/api/treatments`,
        {
          method: 'POST',

          credentials:
            'include',

          headers: {
            'Content-Type':
              'application/json',

            Accept:
              'application/json',
          },

          body: JSON.stringify(
            payload,
          ),
        },
      )

    return parseResponse(
      response,
    )
  }

  export const getDoctorTreatments =
  async () => {
    const response =
      await fetch(
        `${API_BASE_URL}/api/treatments/doctor/my`,
        {
          method: 'GET',

          credentials:
            'include',

          headers: {
            Accept:
              'application/json',
          },
        },
      )

    return parseResponse(
      response,
    )
  }
