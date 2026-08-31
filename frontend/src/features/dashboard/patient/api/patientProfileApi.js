export const getMyPatientProfile =
  async () => {
    const response =
      await fetch(
        '/api/patient/profile',
        {
          method: 'GET',
          credentials: 'include',
        },
      )

    const data =
      await response.json()

    if (!response.ok) {
      throw new Error(
        data.message ||
          'Profil bilgileri yüklenemedi.',
      )
    }

    return data.data?.profile || null
  }


export const updateMyPatientProfile =
  async ({
    address,
  }) => {
    const response =
      await fetch(
        '/api/patient/profile',
        {
          method: 'PATCH',
          credentials: 'include',

          headers: {
            'Content-Type':
              'application/json',
          },

          body:
            JSON.stringify({
              address,
            }),
        },
      )

    const data =
      await response.json()

    if (!response.ok) {
      throw new Error(
        data.message ||
          'Profil bilgileri güncellenemedi.',
      )
    }

    return data.data?.profile || null
  }