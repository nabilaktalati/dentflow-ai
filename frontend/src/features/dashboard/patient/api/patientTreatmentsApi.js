const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000'


const parseResponse = async (
  response,
) => {
  const data =
    await response.json()

  if (!response.ok) {
    const error =
      new Error(
        data.message ||
          'İşlem sırasında bir hata oluştu.',
      )

    error.status =
      response.status

    error.code =
      data.code

    throw error
  }

  return data
}


export const getMyTreatments =
  async () => {
    const response =
      await fetch(
        `${API_BASE_URL}/api/treatments/my`,
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