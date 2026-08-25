import crypto from 'crypto'

const OTP_LENGTH_MIN = 100000
const OTP_LENGTH_MAX = 1000000

export const OTP_EXPIRY_MINUTES = 10
export const OTP_RESEND_COOLDOWN_SECONDS = 60

const getOtpSecret = () => {
  const secret = process.env.OTP_SECRET

  if (!secret) {
    throw new Error('OTP_SECRET is not defined')
  }

  return secret
}

export const generateOtpCode = () => {
  return crypto.randomInt(OTP_LENGTH_MIN, OTP_LENGTH_MAX).toString()
}

export const hashOtpCode = (code) => {
  return crypto
    .createHmac('sha256', getOtpSecret())
    .update(String(code))
    .digest('hex')
}

export const verifyOtpCode = (code, storedHash) => {
  if (!code || !storedHash) {
    return false
  }

  const receivedHash = hashOtpCode(code)

  const receivedBuffer = Buffer.from(receivedHash, 'hex')
  const storedBuffer = Buffer.from(storedHash, 'hex')

  if (receivedBuffer.length !== storedBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(receivedBuffer, storedBuffer)
}

export const getOtpExpiryDate = () => {
  return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)
}