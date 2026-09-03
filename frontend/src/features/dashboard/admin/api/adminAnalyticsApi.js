



const ADMIN_ANALYTICS_URL =
  '/api/admin/analytics'


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


// ========================================
// GET ADMIN ANALYTICS
// ========================================

export const getAdminAnalytics =
  async () => {
    let response

    try {
      response = await fetch(
        ADMIN_ANALYTICS_URL,
        {
          method: 'GET',

          credentials:
            'include',
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