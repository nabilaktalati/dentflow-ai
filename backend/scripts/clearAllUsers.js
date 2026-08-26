import 'dotenv/config'

import {
  connectDB,
  disconnectDB,
} from '../config/db.js'

import User from '../models/User.js'
import PatientProfile from '../models/PatientProfile.js'
import DoctorProfile from '../models/DoctorProfile.js'
import Appointment from '../models/Appointment.js'
import EmailVerification from '../models/EmailVerification.js'

const run = async () => {
  try {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'Production veritabanında kullanıcı temizleme işlemi çalıştırılamaz.',
      )
    }

    console.log('\nDentFlow AI - Kullanıcı Temizleme')
    console.log('=================================\n')

    await connectDB()

    const emailVerifications =
      await EmailVerification.deleteMany({})

    const appointments =
      await Appointment.deleteMany({})

    const patientProfiles =
      await PatientProfile.deleteMany({})

    const doctorProfiles =
      await DoctorProfile.deleteMany({})

    const users =
      await User.deleteMany({})

    console.log(
      `✅ EmailVerification: ${emailVerifications.deletedCount}`,
    )

    console.log(
      `✅ Appointment: ${appointments.deletedCount}`,
    )

    console.log(
      `✅ PatientProfile: ${patientProfiles.deletedCount}`,
    )

    console.log(
      `✅ DoctorProfile: ${doctorProfiles.deletedCount}`,
    )

    console.log(
      `✅ User: ${users.deletedCount}`,
    )

    console.log(
      '\n🎉 Tüm test kullanıcıları ve ilişkili kayıtlar temizlendi.\n',
    )
  } catch (error) {
    console.error(
      '\n❌ Temizleme işlemi başarısız:',
      error.message,
    )

    process.exitCode = 1
  } finally {
    await disconnectDB()
  }
}

run()