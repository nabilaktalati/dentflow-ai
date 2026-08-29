import Appointment from '../models/Appointment.js'
import DoctorAvailability from '../models/DoctorAvailability.js'
import DoctorProfile from '../models/DoctorProfile.js'
import PatientProfile from '../models/PatientProfile.js'

import {
  generateAvailabilitySlots,
} from './availabilityService.js'
import {
  APPOINTMENT_STATUSES,
} from '../constants/appointment.js'

const createBookingError = (
  message,
  statusCode = 400,
  code = 'BOOKING_ERROR',
) => {
  const error = new Error(message)

  error.statusCode = statusCode
  error.code = code

  return error
}


const addMinutesToTime = (
  startTime,
  minutesToAdd,
) => {
  const [
    hours,
    minutes,
  ] = startTime
    .split(':')
    .map(Number)

  const totalMinutes =
    hours * 60 +
    minutes +
    minutesToAdd

  const endHours =
    Math.floor(
      totalMinutes / 60,
    )

  const endMinutes =
    totalMinutes % 60

  return `${String(endHours).padStart(
    2,
    '0',
  )}:${String(endMinutes).padStart(
    2,
    '0',
  )}`
}


const createIstanbulDate = (
  date,
  time,
) =>
  new Date(
    `${date}T${time}:00+03:00`,
  )


export const createPatientAppointment =
  async ({
    patientUserId,
    doctorProfileId,
    date,
    startTime,
    patientNote = '',
  }) => {
    /*
     * 1. Giriş yapan kullanıcıya ait
     * hasta profilini bul.
     */
    const patientProfile =
      await PatientProfile.findOne({
        user: patientUserId,
      })

    if (!patientProfile) {
      throw createBookingError(
        'Hasta profili bulunamadı.',
        404,
        'PATIENT_PROFILE_NOT_FOUND',
      )
    }


    /*
     * 2. Seçilen doktor profilini kontrol et.
     */
    const doctorProfile =
      await DoctorProfile.findOne({
        _id: doctorProfileId,
        isActive: true,
      })

    if (!doctorProfile) {
      throw createBookingError(
        'Doktor bulunamadı veya aktif değil.',
        404,
        'DOCTOR_NOT_FOUND',
      )
    }


    /*
     * 3. Doktorun çalışma programını al.
     *
     * DoctorAvailability, DoctorProfile ID yerine
     * doktorun User ID'sini kullanır.
     */
    const availability =
      await DoctorAvailability.findOne({
        doctor:
          doctorProfile.user,
      }).lean()

    if (!availability) {
      throw createBookingError(
        'Doktor için çalışma programı bulunamadı.',
        409,
        'AVAILABILITY_NOT_CONFIGURED',
      )
    }


    /*
     * 4. Day 10'da geliştirdiğimiz availability
     * motorundan gerçek uygun saatleri üret.
     */
    const availabilityResult =
      generateAvailabilitySlots(
        availability,
        date,
      )


    if (
      !availabilityResult.available
    ) {
      throw createBookingError(
        'Doktor seçilen tarihte randevu kabul etmiyor.',
        409,
        'DATE_NOT_AVAILABLE',
      )
    }


    /*
     * 5. Hasta tarafından gönderilen saat,
     * backend tarafından üretilen gerçek slotlardan
     * biri olmak zorunda.
     */
    if (
      !availabilityResult.slots.includes(
        startTime,
      )
    ) {
      throw createBookingError(
        'Seçilen randevu saati müsait değil.',
        409,
        'SLOT_NOT_AVAILABLE',
      )
    }


    const durationMinutes =
      availability.slotDurationMinutes

    const endTime =
      addMinutesToTime(
        startTime,
        durationMinutes,
      )


    /*
     * Şimdilik sistemin klinik saat dilimi
     * Europe/Istanbul olduğu için +03:00 kullanıyoruz.
     *
     * MongoDB içinde Date değerleri UTC olarak
     * saklanacaktır.
     */
    const startAt =
      createIstanbulDate(
        date,
        startTime,
      )
if (
  Number.isNaN(
    startAt.getTime(),
  ) ||
  startAt <= new Date()
) {
  throw createBookingError(
    'Geçmiş bir tarih veya saat için randevu oluşturulamaz.',
    400,
    'APPOINTMENT_IN_PAST',
  )
}
    const endAt =
      createIstanbulDate(
        date,
        endTime,
      )


    /*
     * Aynı doktor + aynı tarih + aynı başlangıç
     * saati için tek bir slotKey oluşturulur.
     *
     * MongoDB unique index'i yarış koşullarında
     * double booking'i engeller.
     */
    const slotKey =
      `${doctorProfile._id.toString()}|${date}|${startTime}`


    try {
      const appointment =
        await Appointment.create({
          patient:
            patientProfile._id,

          doctor:
            doctorProfile._id,

          startAt,
          endAt,

          patientNote,

          slotKey,
          status:
  APPOINTMENT_STATUSES.CONFIRMED,
        })


      return appointment
    } catch (error) {
      /*
       * Aynı slot iki farklı istek tarafından
       * aynı anda alınmaya çalışılırsa MongoDB
       * unique index hatası üretir.
       */
      if (
        error?.code === 11000 &&
        error?.keyPattern?.slotKey
      ) {
        throw createBookingError(
          'Bu randevu saati az önce başka bir hasta tarafından alındı.',
          409,
          'SLOT_ALREADY_BOOKED',
        )
      }

      throw error
    }
  }