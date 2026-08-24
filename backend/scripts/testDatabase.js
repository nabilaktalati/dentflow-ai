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
import { APPOINTMENT_STATUSES } from '../constants/appointment.js'

const createdIds = {
  patientUser: null,
  doctorUser: null,
  patientProfile: null,
  doctorProfile: null,
  appointment: null,
}

async function cleanup() {
  if (createdIds.appointment) {
    await Appointment.findByIdAndDelete(createdIds.appointment)
  }

  if (createdIds.patientProfile) {
    await PatientProfile.findByIdAndDelete(
      createdIds.patientProfile,
    )
  }

  if (createdIds.doctorProfile) {
    await DoctorProfile.findByIdAndDelete(
      createdIds.doctorProfile,
    )
  }

  if (createdIds.patientUser) {
    await User.findByIdAndDelete(createdIds.patientUser)
  }

  if (createdIds.doctorUser) {
    await User.findByIdAndDelete(createdIds.doctorUser)
  }
}

async function runDatabaseTest() {
  try {
    console.log('MongoDB bağlantısı kuruluyor...')

    await connectDB()

    console.log('✅ MongoDB bağlantısı başarılı.')

    await Promise.all([
      User.init(),
      PatientProfile.init(),
      DoctorProfile.init(),
      Appointment.init(),
    ])

    console.log('✅ Model indexleri hazır.')

    const uniqueId = Date.now()

    const patientUser = await User.create({
      email: `day5.patient.${uniqueId}@example.com`,
      passwordHash: 'DAY5_TEST_HASH',
      role: USER_ROLES.PATIENT,
      isEmailVerified: true,
      status: 'ACTIVE',
    })

    createdIds.patientUser = patientUser._id

    console.log('✅ Patient User oluşturuldu.')

    const patientProfile = await PatientProfile.create({
      user: patientUser._id,
      firstName: 'Test',
      lastName: 'Hasta',
      phone: '+90 555 111 22 33',
      dateOfBirth: new Date('2000-05-15'),
    })

    createdIds.patientProfile = patientProfile._id

    console.log('✅ PatientProfile oluşturuldu.')

    const doctorUser = await User.create({
      email: `day5.doctor.${uniqueId}@example.com`,
      passwordHash: 'DAY5_TEST_HASH',
      role: USER_ROLES.DOCTOR,
      isEmailVerified: true,
      status: 'ACTIVE',
    })

    createdIds.doctorUser = doctorUser._id

    console.log('✅ Doctor User oluşturuldu.')

    const doctorProfile = await DoctorProfile.create({
      user: doctorUser._id,
      firstName: 'Test',
      lastName: 'Doktor',
      bio: 'DentFlow AI veritabanı testi için oluşturuldu.',
      education: [
        {
          institution: 'Test Üniversitesi',
          degree: 'Diş Hekimliği',
          graduationYear: 2020,
        },
      ],
      experienceYears: 5,
      clinicName: 'DentFlow Dental Clinic',
      location: 'İstanbul, Türkiye',
      isActive: true,
      displayOrder: 1,
    })

    createdIds.doctorProfile = doctorProfile._id

    console.log('✅ DoctorProfile oluşturuldu.')

    const startAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    )

    const endAt = new Date(
      startAt.getTime() + 30 * 60 * 1000,
    )

    const appointment = await Appointment.create({
      patient: patientProfile._id,
      doctor: doctorProfile._id,
      startAt,
      endAt,
      patientNote:
        'Day 5 MongoDB ilişki testi için oluşturulan randevu.',
      status: APPOINTMENT_STATUSES.CONFIRMED,
    })

    createdIds.appointment = appointment._id

    console.log('✅ Appointment oluşturuldu.')
    console.log(
      `✅ Randevu kodu: ${appointment.appointmentCode}`,
    )

    const populatedAppointment =
      await Appointment.findById(appointment._id)
        .populate({
          path: 'patient',
          populate: {
            path: 'user',
            select: 'email role status',
          },
        })
        .populate({
          path: 'doctor',
          populate: {
            path: 'user',
            select: 'email role status',
          },
        })

    if (!populatedAppointment) {
      throw new Error('Appointment okunamadı.')
    }

    console.log('✅ Appointment MongoDB üzerinden okundu.')

    console.log(
      'Hasta:',
      populatedAppointment.patient.firstName,
      populatedAppointment.patient.lastName,
    )

    console.log(
      'Doktor:',
      populatedAppointment.doctor.firstName,
      populatedAppointment.doctor.lastName,
    )

    console.log(
      'Durum:',
      populatedAppointment.status,
    )

    const updatedAppointment =
      await Appointment.findByIdAndUpdate(
        appointment._id,
        {
          status: APPOINTMENT_STATUSES.COMPLETED,
        },
        {
          new: true,
          runValidators: true,
        },
      )

    if (
      updatedAppointment.status !==
      APPOINTMENT_STATUSES.COMPLETED
    ) {
      throw new Error('Appointment update başarısız.')
    }

    console.log('✅ Appointment güncellendi.')

    await cleanup()

    Object.keys(createdIds).forEach((key) => {
      createdIds[key] = null
    })

    console.log('✅ Test verileri temizlendi.')
    console.log('')
    console.log('🎉 DATABASE TEST BAŞARILI')
  } catch (error) {
    console.error('')
    console.error('❌ DATABASE TEST BAŞARISIZ')
    console.error(error)

    try {
      await cleanup()
      console.log('Test verileri temizlendi.')
    } catch (cleanupError) {
      console.error(
        'Cleanup sırasında hata:',
        cleanupError.message,
      )
    }

    process.exitCode = 1
  } finally {
    await disconnectDB()
  }
}

runDatabaseTest()