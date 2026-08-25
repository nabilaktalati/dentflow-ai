import mongoose from 'mongoose'

import User from '../models/User.js'
import PatientProfile from '../models/PatientProfile.js'
import EmailVerification from '../models/EmailVerification.js'

import { USER_ROLES } from '../constants/roles.js'
import {
  registerSchema,
  verifyEmailSchema,
  resendVerificationSchema,
} from '../validators/authValidators.js'

import { hashPassword } from '../services/passwordService.js'
import {
  generateOtpCode,
  getOtpExpiryDate,
  hashOtpCode,
  verifyOtpCode,
  OTP_RESEND_COOLDOWN_SECONDS,
} from '../services/otpService.js'

import { sendVerificationEmail } from '../services/emailService.js'

export const registerPatient = async (req, res, next) => {
  let session

  try {
    // 1. Validate request
    const validationResult = registerSchema.safeParse(req.body)

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Kayıt bilgileri geçersiz.',
        errors: validationResult.error.flatten().fieldErrors,
      })
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      password,
    } = validationResult.data

    // 2. Check existing account
    const existingUser = await User.findOne({ email }).lean()

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Bu e-posta adresiyle kayıtlı bir hesap bulunmaktadır.',
      })
    }

    // 3. Hash password
    const passwordHash = await hashPassword(password)

    // 4. Generate OTP
    const otpCode = generateOtpCode()
    const codeHash = hashOtpCode(otpCode)
    const expiresAt = getOtpExpiryDate()

    session = await mongoose.startSession()

    let createdUser

    // 5. Create registration records atomically
    await session.withTransaction(async () => {
      const users = await User.create(
        [
          {
            email,
            passwordHash,

            // Role is enforced by backend.
            // Public registration can NEVER create ADMIN or DOCTOR.
            role: USER_ROLES.PATIENT,

            isEmailVerified: false,
            status: 'PENDING',
          },
        ],
        { session },
      )

      createdUser = users[0]

      await PatientProfile.create(
        [
          {
            user: createdUser._id,
            firstName,
            lastName,
            phone,
          },
        ],
        { session },
      )

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
        { session },
      )
    })

    // 6. Send OTP after successful DB transaction
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

    // 7. Safe response - never return passwordHash or OTP
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
export const verifyEmail = async (req, res, next) => {
  try {
    const validationResult = verifyEmailSchema.safeParse(req.body)

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Doğrulama bilgileri geçersiz.',
        errors: validationResult.error.flatten().fieldErrors,
      })
    }

    const { email, code } = validationResult.data

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Doğrulama işlemi başarısız.',
      })
    }

    if (user.isEmailVerified) {
      return res.status(200).json({
        success: true,
        message: 'E-posta adresiniz zaten doğrulanmış.',
        data: {
          email,
          verified: true,
        },
      })
    }

    const verification = await EmailVerification.findOne({
      user: user._id,
    })

    if (!verification) {
      return res.status(400).json({
        success: false,
        message:
          'Doğrulama kodu geçersiz veya süresi dolmuş. Yeni bir kod talep edin.',
      })
    }

    if (verification.expiresAt <= new Date()) {
      await EmailVerification.deleteOne({
        _id: verification._id,
      })

      return res.status(410).json({
        success: false,
        message:
          'Doğrulama kodunun süresi dolmuş. Yeni bir kod talep edin.',
      })
    }

    if (verification.attempts >= verification.maxAttempts) {
      return res.status(429).json({
        success: false,
        message:
          'Maksimum doğrulama denemesi aşıldı. Yeni bir kod talep edin.',
      })
    }

    const isCodeValid = verifyOtpCode(
      code,
      verification.codeHash,
    )

    if (!isCodeValid) {
      verification.attempts += 1
      await verification.save()

      const remainingAttempts = Math.max(
        verification.maxAttempts - verification.attempts,
        0,
      )

      return res.status(400).json({
        success: false,
        message: 'Doğrulama kodu hatalı.',
        data: {
          remainingAttempts,
        },
      })
    }

    const session = await mongoose.startSession()

    try {
      await session.withTransaction(async () => {
        await User.updateOne(
          { _id: user._id },
          {
            $set: {
              isEmailVerified: true,
              status: 'ACTIVE',
            },
          },
          { session },
        )

        await EmailVerification.deleteOne(
          { _id: verification._id },
          { session },
        )
      })
    } finally {
      await session.endSession()
    }

    return res.status(200).json({
      success: true,
      message: 'E-posta adresiniz başarıyla doğrulandı.',
      data: {
        email,
        verified: true,
      },
    })
  } catch (error) {
    return next(error)
  }
}
export const resendVerification = async (req, res, next) => {
  try {
    const validationResult = resendVerificationSchema.safeParse(req.body)

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'E-posta bilgisi geçersiz.',
        errors: validationResult.error.flatten().fieldErrors,
      })
    }

    const { email } = validationResult.data

    const user = await User.findOne({ email })

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
        message: 'E-posta adresiniz zaten doğrulanmış.',
        data: {
          verified: true,
        },
      })
    }

    const existingVerification = await EmailVerification.findOne({
      user: user._id,
    })

    if (existingVerification?.lastSentAt) {
      const elapsedSeconds = Math.floor(
        (Date.now() - existingVerification.lastSentAt.getTime()) / 1000,
      )

      if (elapsedSeconds < OTP_RESEND_COOLDOWN_SECONDS) {
        const retryAfterSeconds =
          OTP_RESEND_COOLDOWN_SECONDS - elapsedSeconds

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

    const otpCode = generateOtpCode()
    const codeHash = hashOtpCode(otpCode)
    const expiresAt = getOtpExpiryDate()
    const now = new Date()

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
      const patientProfile = await PatientProfile.findOne({
        user: user._id,
      }).lean()

      await sendVerificationEmail({
        email: user.email,
        firstName: patientProfile?.firstName || 'Hasta',
        code: otpCode,
      })
    } catch (emailError) {
      // Allow the patient to retry immediately if SMTP failed.
      await EmailVerification.updateOne(
        { user: user._id },
        {
          $set: {
            lastSentAt: new Date(
              Date.now() -
                OTP_RESEND_COOLDOWN_SECONDS * 1000,
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
      message: 'Yeni doğrulama kodu e-posta adresinize gönderildi.',
      data: {
        email: user.email,
        expiresInMinutes: 10,
        resendCooldownSeconds: OTP_RESEND_COOLDOWN_SECONDS,
      },
    })
  } catch (error) {
    return next(error)
  }
}