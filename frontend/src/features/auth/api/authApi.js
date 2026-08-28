const request = async (
  url,
  options = {},
) => {
  let response

  try {
    response = await fetch(url, {
      ...options,

      credentials: 'include',

      cache: 'no-store',

      headers: {
        'Content-Type':
          'application/json',

        ...options.headers,
      },
    })
  } catch {
    const error = new Error(
      'Sunucuya ulaşılamadı. Lütfen tekrar deneyin.',
    )

    error.status = 0
    error.data = null

    throw error
  }

  const responseText =
    await response.text()

let data = {}
let hasValidJson = false

if (responseText) {
  try {
    data = JSON.parse(
      responseText,
    )

    hasValidJson = true
  } catch {
    data = {}
  }
}

if (!response.ok) {
  const serverUnavailable =
    response.status >= 500 &&
    !hasValidJson

  const error = new Error(
    serverUnavailable
      ? 'Sunucuya ulaşılamadı. Lütfen tekrar deneyin.'
      : data.message ||
          'İşlem sırasında bir hata oluştu. Lütfen tekrar deneyin.',
  )

  error.status =
    response.status

  error.data =
    data

  throw error
}

  if (!response.ok) {
    const error = new Error(
      data.message ||
        'İşlem sırasında bir hata oluştu. Lütfen tekrar deneyin.',
    )

    error.status =
      response.status

    error.data =
      data

    throw error
  }

  return data
}

// ========================================
// REGISTER
// ========================================

export const registerPatient = (
  payload,
) =>
  request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })


// ========================================
// EMAIL VERIFICATION
// ========================================

export const verifyEmail = (
  payload,
) =>
  request(
    '/api/auth/verify-email',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  )


// ========================================
// RESEND VERIFICATION
// ========================================

export const resendVerification = (
  payload,
) =>
  request(
    '/api/auth/resend-verification',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  )


// ========================================
// LOGIN
// ========================================

export const loginUser = (
  payload,
) =>
  request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })


// ========================================
// CURRENT USER
// ========================================

export const getCurrentUser = () =>
  request('/api/auth/me', {
    method: 'GET',
  })


// ========================================
// REFRESH SESSION
// ========================================

export const refreshUserSession = () =>
  request('/api/auth/refresh', {
    method: 'POST',
  })


// ========================================
// LOGOUT
// ========================================

export const logoutUser = () =>
  request('/api/auth/logout', {
    method: 'POST',
  })
  // ========================================
// CHANGE PASSWORD
// ========================================

export const changePasswordUser = (
  payload,
) =>
  request(
    '/api/auth/change-password',
    {
      method: 'POST',
      body: JSON.stringify(
        payload,
      ),
    },
  )