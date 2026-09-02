import Session from '../models/Session.js'
import User from '../models/User.js'

import {
  getAccessTokenFromCookies,
} from '../services/cookieService.js'

import {
  verifyAccessToken,
} from '../services/tokenService.js'


export const authenticate = async (
  req,
  res,
  next,
) => {
  try {
    // 1. Access Token al
    const accessToken =
      getAccessTokenFromCookies(req)

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message:
          'Bu işlem için giriş yapmanız gerekiyor.',
      })
    }

    // 2. Token gerçekten geçerli mi?
    let payload

    try {
      payload =
        verifyAccessToken(accessToken)
    } catch {
      return res.status(401).json({
        success: false,
        message:
          'Oturumunuz geçersiz veya süresi dolmuş.',
      })
    }

    // 3. Token içindeki Session gerçekten var mı?
    const session =
      await Session.findOne({
        _id: payload.sid,
        user: payload.sub,
        revokedAt: null,
      })

    if (!session) {
      return res.status(401).json({
        success: false,
        message:
          'Oturumunuz artık geçerli değil.',
      })
    }

    // 4. Session süresi bitmiş mi?
    if (
      session.expiresAt.getTime() <=
      Date.now()
    ) {
      return res.status(401).json({
        success: false,
        message:
          'Oturumunuzun süresi dolmuş.',
      })
    }

    // 5. Kullanıcı hâlâ sistemde ve aktif mi?
    const user =
      await User.findById(payload.sub)

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          'Kullanıcı hesabı bulunamadı.',
      })
    }

    if (
      !user.isEmailVerified ||
      user.status !== 'ACTIVE'
    ) {
      return res.status(403).json({
        success: false,
        message:
          'Hesabınız şu anda kullanıma uygun değil.',
      })
    }

    // 6. Sonraki controller için
    // güvenli kullanıcı bilgilerini request'e ekle
    req.auth = {
      userId: user._id.toString(),
      role: user.role,
      sessionId:
        session._id.toString(),
    }

    next()
  } catch (error) {
    next(error)
  }
}

export const authenticateOptional = async (
  req,
  res,
  next,
) => {
  try {
    const accessToken =
      getAccessTokenFromCookies(req)

    // Ziyaretçi kullanıcı
    if (!accessToken) {
      req.auth = null
      return next()
    }

    let payload

    try {
      payload =
        verifyAccessToken(accessToken)
    } catch {
      req.auth = null
      return next()
    }

    const session =
      await Session.findOne({
        _id: payload.sid,
        user: payload.sub,
        revokedAt: null,
      })

    if (
      !session ||
      session.expiresAt.getTime() <=
        Date.now()
    ) {
      req.auth = null
      return next()
    }

    const user =
      await User.findById(payload.sub)

    if (
      !user ||
      !user.isEmailVerified ||
      user.status !== 'ACTIVE'
    ) {
      req.auth = null
      return next()
    }

    // Giriş yapmış kullanıcı
    req.auth = {
      userId: user._id.toString(),
      role: user.role,
      sessionId:
        session._id.toString(),
    }

    return next()
  } catch (error) {
    next(error)
  }
}

export const authorizeRoles =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.auth) {
      return res.status(401).json({
        success: false,
        message:
          'Bu işlem için giriş yapmanız gerekiyor.',
      })
    }

    if (
      !allowedRoles.includes(
        req.auth.role,
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          'Bu işlem için yetkiniz bulunmuyor.',
      })
    }

    next()
  }