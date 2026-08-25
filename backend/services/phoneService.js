export const normalizeTurkishMobilePhone = (phone) => {
  if (!phone) {
    return null
  }

  let digits = String(phone).replace(/\D/g, '')

  if (digits.startsWith('0090')) {
    digits = digits.slice(4)
  } else if (digits.startsWith('90')) {
    digits = digits.slice(2)
  } else if (digits.startsWith('0')) {
    digits = digits.slice(1)
  }

  if (!/^5\d{9}$/.test(digits)) {
    throw new Error(
      'Geçerli bir Türkiye cep telefonu numarası giriniz.',
    )
  }

  return `+90${digits}`
}