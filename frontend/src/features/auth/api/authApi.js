const API_BASE_URL = '/api/auth'

const request = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error(
      data.message || 'İşlem sırasında bir hata oluştu.',
    )

    error.status = response.status
    error.data = data

    throw error
  }

  return data
}

export const registerPatient = async (formData) => {
  return request('/register', {
    method: 'POST',
    body: JSON.stringify(formData),
  })
}

export const verifyEmail = async ({ email, code }) => {
  return request('/verify-email', {
    method: 'POST',
    body: JSON.stringify({
      email,
      code,
    }),
  })
}

export const resendVerification = async (email) => {
  return request('/resend-verification', {
    method: 'POST',
    body: JSON.stringify({
      email,
    }),
  })
}