import 'dotenv/config'

import {
  connectDB,
  disconnectDB,
} from '../config/db.js'

import User from '../models/User.js'
import PatientProfile from '../models/PatientProfile.js'
import DoctorProfile from '../models/DoctorProfile.js'
import Appointment from '../models/Appointment.js'

import { USER_ROLES } from '../constants/roles.js'

const ids = {
  patientUser: null,
  doctorUser: null,
  patientProfile: null,
  doctorProfile: null,
}

async function cleanup() {
  if (ids.patientProfile) {
    await PatientProfile.findByIdAndDelete(ids.patientProfile)
  }

  if (ids.doctorProfile) {
    await DoctorProfile.findByIdAndDelete(ids.doctorProfile)
  }

  if (ids.patientUser) {
    await User.findByIdAndDelete(ids.patientUser)
  }

  if (ids.doctorUser) {
    await User.findByIdAndDelete(ids.doctorUser)
  }
}

async function runValidationTest() {
  try {
    console.log('MongoDB bağlantısı kuruluyor...')

    await connectDB()

    await Promise.all([
      User.init(),
      PatientProfile.init(),
      DoctorProfile.init(),
      Appointment.init(),
    ])

    const uniqueId = Date.now()

    // --------------------------------------------------
    // 1. TEST USER
    // --------------------------------------------------

    const patientUser = await User.create({
      email: `validation.patient.${uniqueId}@example.com`,
      passwordHash: 'TEST_HASH',
      role: USER_ROLES.PATIENT,
      isEmailVerified: true,
      status: 'ACTIVE',
    })

    ids.patientUser = patientUser._id

    console.log('✅ Test kullanıcısı oluşturuldu.')

    // --------------------------------------------------
    // 2. DUPLICATE EMAIL
    // --------------------------------------------------

    try {
      await User.create({
        email: patientUser.email,
        passwordHash: 'TEST_HASH_2',
        role: USER_ROLES.PATIENT,
      })

      throw new Error(
        'Duplicate email testi başarısız: kayıt oluşturuldu.',
      )
    } catch (error) {
      if (error.code !== 11000) {
        throw error
      }

      console.log(
        '✅ Duplicate email unique index tarafından engellendi.',
      )
    }

    // --------------------------------------------------
    // 3. PATIENT PROFILE
    // --------------------------------------------------

    const patientProfile = await PatientProfile.create({
      user: patientUser._id,
      firstName: 'Test',
      lastName: 'Hasta',
      phone: '+90 555 111 22 33',
    })

    ids.patientProfile = patientProfile._id

    console.log('✅ PatientProfile oluşturuldu.')

    // --------------------------------------------------
    // 4. DUPLICATE PROFILE
    // --------------------------------------------------

    try {
      await PatientProfile.create({
        user: patientUser._id,
        firstName: 'İkinci',
        lastName: 'Profil',
      })

      throw new Error(
        'Duplicate profile testi başarısız: kayıt oluşturuldu.',
      )
    } catch (error) {
      if (error.code !== 11000) {
        throw error
      }

      console.log(
        '✅ Aynı kullanıcı için ikinci PatientProfile engellendi.',
      )
    }

    // --------------------------------------------------
    // 5. DOCTOR
    // --------------------------------------------------

    const doctorUser = await User.create({
      email: `validation.doctor.${uniqueId}@example.com`,
      passwordHash: 'TEST_HASH',
      role: USER_ROLES.DOCTOR,
      isEmailVerified: true,
      status: 'ACTIVE',
    })

    ids.doctorUser = doctorUser._id

    const doctorProfile = await DoctorProfile.create({
      user: doctorUser._id,
      firstName: 'Test',
      lastName: 'Doktor',
      experienceYears: 4,
      clinicName: 'DentFlow Dental Clinic',
      isActive: true,
    })

    ids.doctorProfile = doctorProfile._id

    console.log('✅ DoctorProfile oluşturuldu.')

    // --------------------------------------------------
    // 6. INVALID APPOINTMENT TIME
    // --------------------------------------------------

    const startAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    )

    const endAt = new Date(
      startAt.getTime() - 30 * 60 * 1000,
    )

    try {
      await Appointment.create({
        patient: patientProfile._id,
        doctor: doctorProfile._id,
        startAt,
        endAt,
        patientNote: 'Geçersiz zaman testi.',
      })

      throw new Error(
        'Appointment validation testi başarısız.',
      )
    } catch (error) {
      if (error.name !== 'ValidationError') {
        throw error
      }

      console.log(
        '✅ Geçersiz randevu zamanı validation tarafından engellendi.',
      )
    }

    // --------------------------------------------------
    // 7. INVALID OBJECT ID
    // --------------------------------------------------

    try {
      await User.findById('invalid-object-id')

      throw new Error(
        'ObjectId validation testi başarısız.',
      )
    } catch (error) {
      if (error.name !== 'CastError') {
        throw error
      }

      console.log(
        '✅ Geçersiz ObjectId doğru şekilde tespit edildi.',
      )
    }

    await cleanup()

    console.log('✅ Test verileri temizlendi.')
    console.log('')
    console.log(
      '🎉 DATABASE VALIDATION TEST BAŞARILI',
    )
  } catch (error) {
    console.error('')
    console.error(
      '❌ DATABASE VALIDATION TEST BAŞARISIZ',
    )
    console.error(error)

    try {
      await cleanup()
      console.log('Test verileri temizlendi.')
    } catch (cleanupError) {
      console.error(
        'Cleanup hatası:',
        cleanupError.message,
      )
    }

    process.exitCode = 1
  } finally {
    await disconnectDB()
  }
}

runValidationTest()