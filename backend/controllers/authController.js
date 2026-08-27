import mongoose from 'mongoose'

import User from '../models/User.js'
import PatientProfile from '../models/PatientProfile.js'
import EmailVerification from '../models/EmailVerification.js'

import { USER_ROLES } from '../constants/roles.js'

import {
  loginSchema,
  registerSchema,
  verifyEmailSchema,
  resendVerificationSchema,
} from '../validators/authValidators.js'

import {
  hashPassword,
  comparePassword,
} from '../services/passwordService.js'

import {
  normalizeTurkishMobilePhone,
} from '../services/phoneService.js'

import {
  generateOtpCode,
  getOtpExpiryDate,
  hashOtpCode,
  verifyOtpCode,
  OTP_RESEND_COOLDOWN_SECONDS,
} from '../services/otpService.js'

import {
  sendVerificationEmail,
} from '../services/emailService.js'
import {
  verifyRefreshToken,
} from '../services/tokenService.js'
import {
  createSession,
  getValidSession,
  revokeSession,
  rotateSessionTokens,
} from '../services/sessionService.js'

import {
  clearAuthCookies,
  getRefreshTokenFromCookies,
  setAuthCookies,
} from '../services/cookieService.js'


// ========================================
// PATIENT REGISTRATION
// ========================================

export const registerPatient = async (
  req,
  res,
  next,
) => {
  let session

  try {
    // 1. Gelen kayıt bilgilerini doğrula
    const validationResult =
      registerSchema.safeParse(req.body)

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message:
          'Kayıt bilgileri geçersiz.',
        errors:
          validationResult.error.flatten()
            .fieldErrors,
      })
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      password,
    } = validationResult.data

    // 2. Telefon numarasını standartlaştır
    let normalizedPhone

    try {
      normalizedPhone =
        normalizeTurkishMobilePhone(phone)
    } catch (phoneError) {
      return res.status(400).json({
        success: false,
        message: phoneError.message,
      })
    }

    // 3. Aynı e-posta adresi var mı?
    const existingUser =
      await User.findOne({
        email,
      }).lean()

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          'Bu e-posta adresiyle kayıtlı bir hesap bulunmaktadır.',
      })
    }

    // 4. Aynı telefon numarası var mı?
    const existingPhone =
      await PatientProfile.findOne({
        phone: normalizedPhone,
      }).lean()

    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message:
          'Bu telefon numarası başka bir hasta hesabında kullanılmaktadır.',
      })
    }

    // 5. Parolayı güvenli şekilde hashle
    const passwordHash =
      await hashPassword(password)

    // 6. OTP oluştur
    const otpCode =
      generateOtpCode()

    const codeHash =
      hashOtpCode(otpCode)

    const expiresAt =
      getOtpExpiryDate()

    // 7. MongoDB transaction başlat
    session =
      await mongoose.startSession()

    let createdUser

    await session.withTransaction(
      async () => {
        // Kullanıcı oluştur
        const users =
          await User.create(
            [
              {
                email,
                passwordHash,

                // Public registration yalnızca PATIENT.
                role: USER_ROLES.PATIENT,

                isEmailVerified: false,
                status: 'PENDING',
              },
            ],
            {
              session,
            },
          )

        createdUser = users[0]

        // Hasta profili oluştur
        await PatientProfile.create(
          [
            {
              user: createdUser._id,
              firstName,
              lastName,
              phone: normalizedPhone,
            },
          ],
          {
            session,
          },
        )

        // OTP doğrulama kaydı oluştur
        await EmailVerification.create(
          [
            {
              user: createdUser._id,
              codeHash,
              expiresAt,
              attempts: 0,
              maxAttempts: 5,
              lastSentAt: new Date(),
            },
          ],
          {
            session,
          },
        )
      },
    )

    // 8. Kayıt tamamlandıktan sonra OTP gönder
    let verificationEmailSent = true

    try {
      await sendVerificationEmail({
        email,
        firstName,
        code: otpCode,
      })
    } catch (emailError) {
      verificationEmailSent = false

      console.error(
        'Verification email could not be sent:',
        emailError.message,
      )
    }

    // OTP veya passwordHash response içinde gönderilmez.
    return res.status(201).json({
      success: true,

      message: verificationEmailSent
        ? 'Kayıt başarılı. Doğrulama kodu e-posta adresinize gönderildi.'
        : 'Hesabınız oluşturuldu ancak doğrulama e-postası gönderilemedi. Lütfen kodu yeniden gönderin.',

      data: {
        email,
        verificationRequired: true,
        verificationEmailSent,
      },
    })
  } catch (error) {
    return next(error)
  } finally {
    if (session) {
      await session.endSession()
    }
  }
}


// ========================================
// EMAIL VERIFICATION
// ========================================

export const verifyEmail = async (
  req,
  res,
  next,
) => {
  try {
    const validationResult =
      verifyEmailSchema.safeParse(
        req.body,
      )

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message:
          'Doğrulama bilgileri geçersiz.',
        errors:
          validationResult.error.flatten()
            .fieldErrors,
      })
    }

    const {
      email,
      code,
    } = validationResult.data

    const user =
      await User.findOne({
        email,
      })

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          'Doğrulama işlemi başarısız.',
      })
    }

    // Zaten doğrulanmış hesap
    if (user.isEmailVerified) {
      return res.status(200).json({
        success: true,
        message:
          'E-posta adresiniz zaten doğrulanmış.',
        data: {
          email,
          verified: true,
        },
      })
    }

    const verification =
      await EmailVerification.findOne({
        user: user._id,
      })

    if (!verification) {
      return res.status(400).json({
        success: false,
        message:
          'Doğrulama kodu geçersiz veya süresi dolmuş. Yeni bir kod talep edin.',
      })
    }

    // OTP süresi bitmiş mi?
    if (
      verification.expiresAt <=
      new Date()
    ) {
      await EmailVerification.deleteOne({
        _id: verification._id,
      })

      return res.status(410).json({
        success: false,
        message:
          'Doğrulama kodunun süresi dolmuş. Yeni bir kod talep edin.',
      })
    }

    // Maksimum deneme sayısı aşılmış mı?
    if (
      verification.attempts >=
      verification.maxAttempts
    ) {
      return res.status(429).json({
        success: false,
        message:
          'Maksimum doğrulama denemesi aşıldı. Yeni bir kod talep edin.',
      })
    }

    const isCodeValid =
      verifyOtpCode(
        code,
        verification.codeHash,
      )

    // Yanlış OTP
    if (!isCodeValid) {
      verification.attempts += 1

      await verification.save()

      const remainingAttempts =
        Math.max(
          verification.maxAttempts -
            verification.attempts,
          0,
        )

      return res.status(400).json({
        success: false,
        message:
          'Doğrulama kodu hatalı.',
        data: {
          remainingAttempts,
        },
      })
    }

    // OTP doğruysa hesabı ACTIVE yap
    const session =
      await mongoose.startSession()

    try {
      await session.withTransaction(
        async () => {
          await User.updateOne(
            {
              _id: user._id,
            },
            {
              $set: {
                isEmailVerified: true,
                status: 'ACTIVE',
              },
            },
            {
              session,
            },
          )

          // Kullanılmış OTP kaydını sil
          await EmailVerification.deleteOne(
            {
              _id: verification._id,
            },
            {
              session,
            },
          )
        },
      )
    } finally {
      await session.endSession()
    }

    return res.status(200).json({
      success: true,
      message:
        'E-posta adresiniz başarıyla doğrulandı.',
      data: {
        email,
        verified: true,
      },
    })
  } catch (error) {
    return next(error)
  }
}


// ========================================
// RESEND EMAIL VERIFICATION
// ========================================

export const resendVerification = async (
  req,
  res,
  next,
) => {
  try {
    const validationResult =
      resendVerificationSchema.safeParse(
        req.body,
      )

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message:
          'E-posta bilgisi geçersiz.',
        errors:
          validationResult.error.flatten()
            .fieldErrors,
      })
    }

    const {
      email,
    } = validationResult.data

    const user =
      await User.findOne({
        email,
      })

    // Kullanıcı enumeration engeli
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          'Hesap uygunsa yeni doğrulama kodu e-posta adresine gönderilecektir.',
      })
    }

    if (user.isEmailVerified) {
      return res.status(200).json({
        success: true,
        message:
          'E-posta adresiniz zaten doğrulanmış.',
        data: {
          verified: true,
        },
      })
    }

    const existingVerification =
      await EmailVerification.findOne({
        user: user._id,
      })

    // 60 saniyelik resend cooldown
    if (
      existingVerification?.lastSentAt
    ) {
      const elapsedSeconds =
        Math.floor(
          (
            Date.now() -
            existingVerification
              .lastSentAt
              .getTime()
          ) / 1000,
        )

      if (
        elapsedSeconds <
        OTP_RESEND_COOLDOWN_SECONDS
      ) {
        const retryAfterSeconds =
          OTP_RESEND_COOLDOWN_SECONDS -
          elapsedSeconds

        return res.status(429).json({
          success: false,
          message:
            'Yeni bir doğrulama kodu göndermeden önce lütfen bekleyin.',
          data: {
            retryAfterSeconds,
          },
        })
      }
    }

    const otpCode =
      generateOtpCode()

    const codeHash =
      hashOtpCode(otpCode)

    const expiresAt =
      getOtpExpiryDate()

    const now =
      new Date()

    await EmailVerification.findOneAndUpdate(
      {
        user: user._id,
      },
      {
        $set: {
          codeHash,
          expiresAt,
          attempts: 0,
          maxAttempts: 5,
          lastSentAt: now,
          verifiedAt: null,
        },
      },
      {
        upsert: true,
        returnDocument: 'after',
        setDefaultsOnInsert: true,
      },
    )

    try {
      const patientProfile =
        await PatientProfile.findOne({
          user: user._id,
        }).lean()

      await sendVerificationEmail({
        email: user.email,
        firstName:
          patientProfile?.firstName ||
          'Hasta',
        code: otpCode,
      })
    } catch (emailError) {
      // SMTP hata verirse kullanıcı
      // hemen yeniden deneyebilsin.
      await EmailVerification.updateOne(
        {
          user: user._id,
        },
        {
          $set: {
            lastSentAt: new Date(
              Date.now() -
                OTP_RESEND_COOLDOWN_SECONDS *
                  1000,
            ),
          },
        },
      )

      console.error(
        'Verification resend email could not be sent:',
        emailError.message,
      )

      return res.status(503).json({
        success: false,
        message:
          'Doğrulama e-postası şu anda gönderilemedi. Lütfen tekrar deneyin.',
      })
    }

    return res.status(200).json({
      success: true,
      message:
        'Yeni doğrulama kodu e-posta adresinize gönderildi.',
      data: {
        email: user.email,
        expiresInMinutes: 10,
        resendCooldownSeconds:
          OTP_RESEND_COOLDOWN_SECONDS,
      },
    })
  } catch (error) {
    return next(error)
  }
}


// ========================================
// LOGIN
// ========================================

export const login = async (
  req,
  res,
  next,
) => {
  try {
    // 1. Login bilgilerini doğrula
    const validationResult =
      loginSchema.safeParse(
        req.body,
      )

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message:
          'Giriş bilgileri geçersiz.',
        errors:
          validationResult.error.flatten()
            .fieldErrors,
      })
    }

    const {
      email,
      password,
    } = validationResult.data

    // 2. Kullanıcıyı bul
    // passwordHash normalde gizli olduğu için
    // burada özellikle seçiyoruz.
    const user =
      await User.findOne({
        email,
      }).select('+passwordHash')

    // E-posta yoksa genel hata dön
    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          'E-posta veya şifre hatalı.',
      })
    }

    // 3. Parolayı bcrypt ile kontrol et
    const passwordMatches =
      await comparePassword(
        password,
        user.passwordHash,
      )

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message:
          'E-posta veya şifre hatalı.',
      })
    }

    // 4. E-posta doğrulanmış mı?
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message:
          'Giriş yapmadan önce e-posta adresinizi doğrulayın.',
        data: {
          requiresEmailVerification:
            true,
        },
      })
    }

    // 5. Hesap aktif mi?
    if (user.status !== 'ACTIVE') {
      return res.status(403).json({
        success: false,
        message:
          'Hesabınız şu anda aktif değil.',
      })
    }

    // 6. MongoDB üzerinde yeni Session oluştur
    const session =
      await createSession({
        userId: user._id,
        role: user.role,

        // Kullanıcının tarayıcı / cihaz bilgisi
        userAgent:
          req.get('user-agent') || '',

        // Kullanıcının IP adresi
        ipAddress:
          req.ip || '',
      })

    // 7. Access ve Refresh Tokenları
    // HttpOnly Cookies içine koy
    setAuthCookies(
      res,
      {
        accessToken:
          session.accessToken,

        refreshToken:
          session.refreshToken,
      },
    )

    // Tokenları JSON içinde göndermiyoruz.
    return res.status(200).json({
      success: true,
      message:
        'Giriş başarılı.',
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          status: user.status,
          isEmailVerified:
            user.isEmailVerified,
        },
      },
    })
   } catch (error) {
    return next(error)
  }
}
// ========================================
// CURRENT USER
// ========================================

export const getMe = async (
  req,
  res,
  next,
) => {
  try {
    const user =
      await User.findById(
        req.auth.userId,
      ).lean()

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          'Kullanıcı bulunamadı.',
      })
    }

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          status: user.status,
          isEmailVerified:
            user.isEmailVerified,
        },
      },
    })
  } catch (error) {
    return next(error)
  }
}
// ========================================
// REFRESH SESSION
// ========================================

export const refreshSession = async (
  req,
  res,
  next,
) => {
  try {
    // Refresh Token'ı güvenli Cookie'den al
    const refreshToken =
      getRefreshTokenFromCookies(req)

    if (!refreshToken) {
      clearAuthCookies(res)

      return res.status(401).json({
        success: false,
        message:
          'Oturum yenileme bilgisi bulunamadı.',
      })
    }

    // Refresh Token geçerli mi?
    let payload

    try {
      payload =
        verifyRefreshToken(
          refreshToken,
        )
    } catch {
      clearAuthCookies(res)

      return res.status(401).json({
        success: false,
        message:
          'Oturumunuz geçersiz veya süresi dolmuş.',
      })
    }

    // MongoDB üzerindeki Session kontrol edilir
    const session =
      await getValidSession({
        sessionId: payload.sid,
        userId: payload.sub,
        refreshToken,
      })

    if (!session) {
      clearAuthCookies(res)

      return res.status(401).json({
        success: false,
        message:
          'Oturumunuz artık geçerli değil.',
      })
    }

    // Kullanıcı hâlâ aktif mi?
    const user =
      await User.findById(
        payload.sub,
      )

    if (
      !user ||
      !user.isEmailVerified ||
      user.status !== 'ACTIVE'
    ) {
      clearAuthCookies(res)

      return res.status(403).json({
        success: false,
        message:
          'Hesabınız şu anda kullanıma uygun değil.',
      })
    }

    // Yeni Access + Refresh Token üret
    const newTokens =
      await rotateSessionTokens({
        session,
        userId: user._id,
        role: user.role,
      })

    // Yeni Tokenları HttpOnly Cookies'e koy
    setAuthCookies(res, {
      accessToken:
        newTokens.accessToken,

      refreshToken:
        newTokens.refreshToken,
    })

    return res.status(200).json({
      success: true,
      message:
        'Oturum başarıyla yenilendi.',
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      },
    })
  } catch (error) {
    return next(error)
  }
}
// ========================================
// LOGOUT
// ========================================

export const logout = async (
  req,
  res,
  next,
) => {
  try {
    const refreshToken =
      getRefreshTokenFromCookies(req)

    if (refreshToken) {
      try {
        const payload =
          verifyRefreshToken(
            refreshToken,
          )

        if (payload.sid) {
          await revokeSession(
            payload.sid,
          )
        }
      } catch {
        // Token bozuk veya süresi dolmuş olsa bile
        // tarayıcıdaki auth cookie'leri temizlenir.
      }
    }

    clearAuthCookies(res)

    return res.status(200).json({
      success: true,
      message:
        'Çıkış işlemi başarıyla tamamlandı.',
    })
  } catch (error) {
    return next(error)
  }
}