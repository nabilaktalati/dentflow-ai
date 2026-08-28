const ADMIN_DOCTORS_URL =
  '/api/admin/doctors'


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
// CREATE DOCTOR
// ========================================

export const createDoctor = async (
  doctorData,
) => {
  let response

  try {
    response = await fetch(
      ADMIN_DOCTORS_URL,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',
        },

        credentials: 'include',

        body: JSON.stringify(
          doctorData,
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


// ========================================
// GET DOCTORS
// ========================================

export const getDoctors =
  async () => {
    let response

    try {
      response = await fetch(
        ADMIN_DOCTORS_URL,
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
  // ========================================
// UPDATE DOCTOR PROFILE
// ========================================

export const updateDoctor = async (
  doctorId,
  doctorData,
) => {
  let response

  try {
    response = await fetch(
      `${ADMIN_DOCTORS_URL}/${doctorId}`,
      {
        method: 'PATCH',

        headers: {
          'Content-Type':
            'application/json',
        },

        credentials: 'include',

        body: JSON.stringify(
          doctorData,
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
// ========================================
// UPLOAD DOCTOR PROFILE IMAGE
// ========================================

export const uploadDoctorProfileImage = async (
  doctorId,
  imageFile,
) => {
  const formData =
    new FormData()

  formData.append(
    'profileImage',
    imageFile,
  )

  let response

  try {
    response = await fetch(
      `${ADMIN_DOCTORS_URL}/${doctorId}/profile-image`,
      {
        method: 'POST',

        credentials: 'include',

        body: formData,
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
// ========================================
// UPLOAD DOCTOR CV
// ========================================

export const uploadDoctorCv = async (
  doctorId,
  cvFile,
) => {
  const formData =
    new FormData()

  formData.append(
    'cvFile',
    cvFile,
  )

  let response

  try {
    response = await fetch(
      `${ADMIN_DOCTORS_URL}/${doctorId}/cv`,
      {
        method: 'POST',

        credentials: 'include',

        body: formData,
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
// ========================================
// DELETE DOCTOR
// ========================================

export const deleteDoctor = async (
  doctorId,
) => {
  let response

  try {
    response = await fetch(
      `${ADMIN_DOCTORS_URL}/${doctorId}`,
      {
        method: 'DELETE',

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