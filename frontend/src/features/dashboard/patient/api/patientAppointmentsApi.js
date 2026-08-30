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


export const getMyAppointments =
  async () => {
    const response =
      await fetch(
        `${API_BASE_URL}/api/appointments/my`,
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


export const getBookingDoctors =
  async () => {
    const response =
      await fetch(
        `${API_BASE_URL}/api/doctors`,
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


export const getDoctorAvailability =
  async ({
    doctorId,
    date,
  }) => {
    const params =
      new URLSearchParams({
        date,
      })

    const response =
      await fetch(
        `${API_BASE_URL}/api/doctors/${doctorId}/availability?${params.toString()}`,
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


export const createAppointment =
  async ({
    doctorId,
    date,
    startTime,
    patientNote = '',
  }) => {
    const response =
      await fetch(
        `${API_BASE_URL}/api/appointments`,
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

          body:
            JSON.stringify({
              doctorId,
              date,
              startTime,
              patientNote,
            }),
        },
      )

    return parseResponse(
      response,
    )
  }
  export const cancelMyAppointment =
  async ({
    appointmentId,
    cancellationReason,
  }) => {
    const response =
      await fetch(
        `${API_BASE_URL}/api/appointments/${appointmentId}/cancel`,
        {
          method: 'PATCH',

          credentials:
            'include',

          headers: {
            Accept:
              'application/json',

            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            cancellationReason,
          }),
        },
      )

    return parseResponse(
      response,
    )
  }