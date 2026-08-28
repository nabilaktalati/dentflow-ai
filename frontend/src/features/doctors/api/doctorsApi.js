const DOCTORS_URL =
  '/api/doctors'


export const getPublicDoctors =
  async () => {
    let response

    try {
      response = await fetch(
        DOCTORS_URL,
        {
          method: 'GET',
          cache: 'no-store',
        },
      )
    } catch {
      throw new Error(
        'Doktor bilgilerine ulaşılamadı. Lütfen tekrar deneyin.',
      )
    }

    let data

    try {
      data = await response.json()
    } catch {
      data = null
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
          'Doktor bilgileri yüklenemedi.',
      )
    }

    return data
  }