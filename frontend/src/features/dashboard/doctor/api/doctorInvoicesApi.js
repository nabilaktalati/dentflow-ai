const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000'


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


export const createInvoice =
  async (payload) => {
    const response =
      await fetch(
        `${API_BASE_URL}/api/invoices`,
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