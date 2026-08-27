import crypto from 'crypto'
import jwt from 'jsonwebtoken'

const ACCESS_TOKEN_EXPIRES_IN =
  process.env.JWT_ACCESS_EXPIRES_IN || '15m'

const REFRESH_TOKEN_EXPIRES_IN =
  process.env.JWT_REFRESH_EXPIRES_IN || '7d'

const getAccessSecret = () => {
  const secret =
    process.env.JWT_ACCESS_SECRET

  if (!secret) {
    throw new Error(
      'JWT_ACCESS_SECRET tanımlı değil.',
    )
  }

  return secret
}

const getRefreshSecret = () => {
  const secret =
    process.env.JWT_REFRESH_SECRET

  if (!secret) {
    throw new Error(
      'JWT_REFRESH_SECRET tanımlı değil.',
    )
  }

  return secret
}

export const signAccessToken = ({
  userId,
  role,
  sessionId,
}) =>
  jwt.sign(
    {
      role,
      sid: sessionId,
      type: 'access',
    },
    getAccessSecret(),
    {
      subject: userId,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    },
  )

export const signRefreshToken = ({
  userId,
  sessionId,
}) =>
  jwt.sign(
    {
      sid: sessionId,
      type: 'refresh',
    },
    getRefreshSecret(),
    {
      subject: userId,
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      jwtid: crypto.randomUUID(),
    },
  )

export const verifyAccessToken = (
  token,
) => {
  const payload = jwt.verify(
    token,
    getAccessSecret(),
  )

  if (payload.type !== 'access') {
    throw new Error(
      'Geçersiz access token türü.',
    )
  }

  return payload
}

export const verifyRefreshToken = (
  token,
) => {
  const payload = jwt.verify(
    token,
    getRefreshSecret(),
  )

  if (payload.type !== 'refresh') {
    throw new Error(
      'Geçersiz refresh token türü.',
    )
  }

  return payload
}

export const hashRefreshToken = (
  token,
) =>
  crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')