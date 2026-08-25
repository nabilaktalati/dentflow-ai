import 'dotenv/config'

import { connectDB, disconnectDB } from '../config/db.js'
import User from '../models/User.js'
import PatientProfile from '../models/PatientProfile.js'
import EmailVerification from '../models/EmailVerification.js'

import { USER_ROLES } from '../constants/roles.js'
import {
  hashOtpCode,
  getOtpExpiryDate,
} from '../services/otpService.js'
import {
  comparePassword,
} from '../services/passwordService.js'

const API_URL = `http://localhost:${process.env.PORT || 5000}/api/auth`

const TEST_PASSWORD = 'DentFlow123'
const KNOWN_OTP = '654321'
const WRONG_OTP = '000000'

let testUserId = null
let testEmail = null

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message)
  }
}

const createTestEmail = () => {
  const smtpEmail = process.env.SMTP_USER

  if (!smtpEmail?.includes('@')) {
    throw new Error(
      'SMTP_USER bulunamadı. Test e-posta adresi oluşturulamadı.',
    )
  }

  const [name, domain] = smtpEmail.split('@')

  if (domain.toLowerCase() !== 'gmail.com') {
    throw new Error(
      'Otomatik test için Gmail SMTP hesabı gereklidir.',
    )
  }

  return `${name}+day6-${Date.now()}@${domain}`
}

const request = async (endpoint, body) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const data = await response.json()

  return {
    status: response.status,
    data,
  }
}

const cleanup = async () => {
  if (!testUserId) return

  await EmailVerification.deleteMany({
    user: testUserId,
  })

  await PatientProfile.deleteMany({
    user: testUserId,
  })

  await User.deleteOne({
    _id: testUserId,
  })
}

const run = async () => {
  try {
    console.log('\nDentFlow AI - Day 6 Auth Testleri')
    console.log('=================================\n')

    await connectDB()

    testEmail = createTestEmail()

    // 1. REGISTER
    const registerResponse = await request(
      '/register',
      {
        firstName: 'Auth',
        lastName: 'Test',
        email: testEmail,
        phone: '05551234567',
        password: TEST_PASSWORD,
      },
    )

    assert(
      registerResponse.status === 201,
      `Kayıt testi başarısız. HTTP ${registerResponse.status}`,
    )

    console.log(
      '✅ Hasta kayıt endpoint testi başarılı.',
    )

    // 2. USER + PATIENT PROFILE
    const user = await User.findOne({
      email: testEmail,
    }).select('+passwordHash')

    assert(user, 'Test kullanıcısı bulunamadı.')

    testUserId = user._id

    assert(
      user.role === USER_ROLES.PATIENT,
      'Kullanıcı rolü PATIENT değil.',
    )

    assert(
      user.status === 'PENDING',
      'Yeni kullanıcı PENDING durumunda değil.',
    )

    assert(
      user.isEmailVerified === false,
      'Yeni kullanıcı doğrulanmamış olmalı.',
    )

    const patientProfile =
      await PatientProfile.findOne({
        user: user._id,
      })

    assert(
      patientProfile,
      'PatientProfile oluşturulmadı.',
    )

    console.log(
      '✅ User + PatientProfile oluşturma testi başarılı.',
    )

    // 3. PASSWORD HASH
    assert(
      user.passwordHash !== TEST_PASSWORD,
      'Şifre düz metin olarak saklanıyor.',
    )

    const passwordMatches =
      await comparePassword(
        TEST_PASSWORD,
        user.passwordHash,
      )

    assert(
      passwordMatches,
      'bcrypt şifre doğrulaması başarısız.',
    )

    console.log(
      '✅ bcrypt parola hash testi başarılı.',
    )

    // 4. OTP RECORD
    let verification =
      await EmailVerification.findOne({
        user: user._id,
      })

    assert(
      verification,
      'EmailVerification kaydı oluşturulmadı.',
    )

    assert(
      verification.codeHash,
      'OTP hash bulunamadı.',
    )

    console.log(
      '✅ OTP hash ve doğrulama kaydı testi başarılı.',
    )

    // 5. DUPLICATE EMAIL
    const duplicateResponse = await request(
      '/register',
      {
        firstName: 'Duplicate',
        lastName: 'Test',
        email: testEmail,
        phone: '05550000000',
        password: TEST_PASSWORD,
      },
    )

    assert(
      duplicateResponse.status === 409,
      'Duplicate email engellenmedi.',
    )

    console.log(
      '✅ Duplicate e-posta engelleme testi başarılı.',
    )

    // 6. RESEND COOLDOWN
    const cooldownResponse = await request(
      '/resend-verification',
      {
        email: testEmail,
      },
    )

    assert(
      cooldownResponse.status === 429,
      'OTP resend cooldown uygulanmadı.',
    )

    console.log(
      '✅ 60 saniyelik resend cooldown testi başarılı.',
    )

    // 7. WRONG OTP
    verification.codeHash =
      hashOtpCode(KNOWN_OTP)

    verification.expiresAt =
      getOtpExpiryDate()

    verification.attempts = 0

    await verification.save()

    const wrongOtpResponse = await request(
      '/verify-email',
      {
        email: testEmail,
        code: WRONG_OTP,
      },
    )

    assert(
      wrongOtpResponse.status === 400,
      'Yanlış OTP reddedilmedi.',
    )

    assert(
      wrongOtpResponse.data?.data
        ?.remainingAttempts === 4,
      'OTP deneme sayacı doğru çalışmadı.',
    )

    console.log(
      '✅ Yanlış OTP ve kalan deneme testi başarılı.',
    )

    // 8. MAX ATTEMPTS
    await EmailVerification.updateOne(
      {
        user: user._id,
      },
      {
        $set: {
          attempts: 5,
        },
      },
    )

    const maxAttemptsResponse =
      await request('/verify-email', {
        email: testEmail,
        code: WRONG_OTP,
      })

    assert(
      maxAttemptsResponse.status === 429,
      'Maksimum OTP denemesi uygulanmadı.',
    )

    console.log(
      '✅ Maksimum OTP deneme sınırı testi başarılı.',
    )

    // 9. RESEND AFTER COOLDOWN
    await EmailVerification.updateOne(
      {
        user: user._id,
      },
      {
        $set: {
          lastSentAt: new Date(
            Date.now() - 120000,
          ),
        },
      },
    )

    const resendResponse = await request(
      '/resend-verification',
      {
        email: testEmail,
      },
    )

    assert(
      resendResponse.status === 200,
      'Yeni OTP gönderimi başarısız.',
    )

    verification =
      await EmailVerification.findOne({
        user: user._id,
      })

    assert(
      verification.attempts === 0,
      'Resend sonrası attempts sıfırlanmadı.',
    )

    console.log(
      '✅ OTP yeniden gönderme ve sayaç sıfırlama testi başarılı.',
    )

    // 10. EXPIRED OTP
    verification.codeHash =
      hashOtpCode(KNOWN_OTP)

    verification.expiresAt =
      new Date(Date.now() - 60000)

    await verification.save()

    const expiredResponse = await request(
      '/verify-email',
      {
        email: testEmail,
        code: KNOWN_OTP,
      },
    )

    assert(
      expiredResponse.status === 410,
      'Süresi dolmuş OTP reddedilmedi.',
    )

    console.log(
      '✅ Süresi dolmuş OTP testi başarılı.',
    )

    // 11. CREATE FRESH TEST OTP
    await EmailVerification.create({
      user: user._id,
      codeHash: hashOtpCode(KNOWN_OTP),
      expiresAt: getOtpExpiryDate(),
      attempts: 0,
      maxAttempts: 5,
      lastSentAt: new Date(),
    })

    // 12. SUCCESSFUL VERIFICATION
    const verifyResponse = await request(
      '/verify-email',
      {
        email: testEmail,
        code: KNOWN_OTP,
      },
    )

    assert(
      verifyResponse.status === 200,
      'Doğru OTP doğrulaması başarısız.',
    )

    const verifiedUser =
      await User.findById(user._id)

    assert(
      verifiedUser.isEmailVerified === true,
      'isEmailVerified true olmadı.',
    )

    assert(
      verifiedUser.status === 'ACTIVE',
      'Kullanıcı ACTIVE durumuna geçmedi.',
    )

    console.log(
      '✅ E-posta doğrulama ve hesap aktivasyonu testi başarılı.',
    )

    // 13. OTP MUST BE REMOVED
    const remainingVerification =
      await EmailVerification.findOne({
        user: user._id,
      })

    assert(
      !remainingVerification,
      'Başarılı doğrulama sonrası OTP kaydı silinmedi.',
    )

    console.log(
      '✅ Kullanılmış OTP kaydının silinmesi testi başarılı.',
    )

    // 14. ALREADY VERIFIED
    const alreadyVerifiedResponse =
      await request('/verify-email', {
        email: testEmail,
        code: WRONG_OTP,
      })

    assert(
      alreadyVerifiedResponse.status === 200 &&
        alreadyVerifiedResponse.data?.data
          ?.verified === true,
      'Already verified kontrolü başarısız.',
    )

    console.log(
      '✅ Zaten doğrulanmış hesap testi başarılı.',
    )

    console.log(
      '\n🎉 DAY 6 AUTH TESTLERİ BAŞARILI\n',
    )
  } catch (error) {
    console.error(
      '\n❌ DAY 6 AUTH TEST BAŞARISIZ',
    )
    console.error(error.message)
    process.exitCode = 1
  } finally {
    try {
      await cleanup()

      console.log(
        '✅ Test verileri temizlendi.',
      )
    } catch (cleanupError) {
      console.error(
        'Test verileri temizlenemedi:',
        cleanupError.message,
      )
    }

    await disconnectDB()
  }
}

run()