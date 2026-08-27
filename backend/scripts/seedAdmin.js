import 'dotenv/config'

import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

import User from '../models/User.js'

import {
  USER_ROLES,
} from '../constants/roles.js'


const BCRYPT_ROUNDS = 12


const seedAdmin = async () => {
  const email =
    process.env.ADMIN_SEED_EMAIL
      ?.trim()
      .toLowerCase()

  const password =
    process.env.ADMIN_SEED_PASSWORD


  if (!process.env.MONGODB_URI) {
    throw new Error(
      'MONGODB_URI tanımlı değil.',
    )
  }

  if (!email) {
    throw new Error(
      'ADMIN_SEED_EMAIL tanımlı değil.',
    )
  }

  if (
    !password ||
    password.length < 12
  ) {
    throw new Error(
      'ADMIN_SEED_PASSWORD en az 12 karakter olmalıdır.',
    )
  }


  await mongoose.connect(
    process.env.MONGODB_URI,
  )

  console.log(
    '✅ MongoDB bağlantısı kuruldu.',
  )


  const existingUser =
    await User.findOne({
      email,
    })


  if (existingUser) {
    if (
      existingUser.role ===
      USER_ROLES.ADMIN
    ) {
      console.log(
        'ℹ️ Bu e-posta ile ADMIN hesabı zaten mevcut.',
      )

      return
    }

    throw new Error(
      'Bu e-posta başka bir kullanıcı hesabında kullanılıyor.',
    )
  }


  const existingAdmin =
    await User.findOne({
      role: USER_ROLES.ADMIN,
    })


  if (existingAdmin) {
    throw new Error(
      'Sistemde zaten bir ADMIN hesabı bulunuyor. Yeni yönetici seed işlemi durduruldu.',
    )
  }


  const passwordHash =
    await bcrypt.hash(
      password,
      BCRYPT_ROUNDS,
    )


  const admin =
    await User.create({
      email,
      passwordHash,

      role:
        USER_ROLES.ADMIN,

      isEmailVerified: true,

      status: 'ACTIVE',
    })


  console.log(
    '🎉 İlk ADMIN hesabı başarıyla oluşturuldu.',
  )

  console.log(
    `📧 Admin: ${admin.email}`,
  )

  console.log(
    '🔐 Şifre veritabanına yalnızca bcrypt hash olarak kaydedildi.',
  )
}


try {
  await seedAdmin()
} catch (error) {
  console.error(
    '❌ ADMIN seed başarısız:',
    error.message,
  )

  process.exitCode = 1
} finally {
  await mongoose.disconnect()

  console.log(
    'MongoDB disconnected.',
  )
}