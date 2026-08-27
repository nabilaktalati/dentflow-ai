const ACCESS_COOKIE_NAME =
  'dentflow_access'

const REFRESH_COOKIE_NAME =
  'dentflow_refresh'

const FIFTEEN_MINUTES =
  15 * 60 * 1000

const SEVEN_DAYS =
  7 * 24 * 60 * 60 * 1000

const isProduction =
  process.env.NODE_ENV === 'production'

const baseCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax',
}

export const setAuthCookies = (
  res,
  {
    accessToken,
    refreshToken,
  },
) => {
  res.cookie(
    ACCESS_COOKIE_NAME,
    accessToken,
    {
      ...baseCookieOptions,
      maxAge: FIFTEEN_MINUTES,
      path: '/',
    },
  )

  res.cookie(
    REFRESH_COOKIE_NAME,
    refreshToken,
    {
      ...baseCookieOptions,
      maxAge: SEVEN_DAYS,
      path: '/api/auth',
    },
  )
}

export const clearAuthCookies = (
  res,
) => {
  res.clearCookie(
    ACCESS_COOKIE_NAME,
    {
      ...baseCookieOptions,
      path: '/',
    },
  )

  res.clearCookie(
    REFRESH_COOKIE_NAME,
    {
      ...baseCookieOptions,
      path: '/api/auth',
    },
  )
}

export const getAccessTokenFromCookies = (
  req,
) =>
  req.cookies?.[
    ACCESS_COOKIE_NAME
  ] || null

export const getRefreshTokenFromCookies = (
  req,
) =>
  req.cookies?.[
    REFRESH_COOKIE_NAME
  ] || null