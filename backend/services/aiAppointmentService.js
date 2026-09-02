import {
  getAvailableDoctorSlots,
  resolveDoctorProfileByName,
} from './doctorSlotService.js'
import {
  createPatientAppointment,
} from './bookingService.js'
const createAiAppointmentError = (
  message,
  statusCode = 400,
  code = 'AI_APPOINTMENT_ERROR',
) => {
  const error = new Error(message)

  error.statusCode = statusCode
  error.code = code

  return error
}

const normalizeTime = (value) => {
  const time =
    String(value || '').trim()

  if (/^\d{1,2}$/.test(time)) {
    return `${time.padStart(2, '0')}:00`
  }

  if (/^\d{1,2}:\d{2}$/.test(time)) {
    const [hour, minute] =
      time.split(':')

    return `${hour.padStart(2, '0')}:${minute}`
  }

  return time
}

export const checkAiAppointmentRequest =
  async ({
    doctorName,
    date,
    time,
  }) => {
    const cleanDoctorName =
      String(
        doctorName || '',
      ).trim()

    const cleanDate =
      String(date || '').trim()

    const cleanTime =
      normalizeTime(time)

    /*
     * Eksik bilgiler varsa AI'nin
     * veri uydurmasına izin verme.
     */
    const missingFields = []

    if (!cleanDoctorName) {
      missingFields.push('doctor')
    }

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(
        cleanDate,
      )
    ) {
      missingFields.push('date')
    }

    if (
      !/^\d{2}:\d{2}$/.test(
        cleanTime,
      )
    ) {
      missingFields.push('time')
    }

    if (missingFields.length > 0) {
      return {
        status: 'NEEDS_INFO',
        missingFields,
      }
    }

    /*
     * Doktor adı gerçek DoctorProfile
     * kaydına dönüştürülür.
     */
    const doctorResult =
      await resolveDoctorProfileByName(
        cleanDoctorName,
      )

    if (
      doctorResult.status ===
      'NOT_FOUND'
    ) {
      return {
        status: 'DOCTOR_NOT_FOUND',
        doctorName:
          cleanDoctorName,
      }
    }

    if (
      doctorResult.status ===
      'AMBIGUOUS'
    ) {
      return {
        status:
          'DOCTOR_AMBIGUOUS',

        doctors:
          doctorResult.doctors.map(
            (doctor) => ({
              id: doctor.id,
              name: doctor.name,
              title: doctor.title,
            }),
          ),
      }
    }

    const doctor =
      doctorResult.doctor

    /*
     * Geçmiş tarih/saat için
     * uygunluk sözü verme.
     */
    const requestedStart =
      new Date(
        `${cleanDate}T${cleanTime}:00+03:00`,
      )

    if (
      Number.isNaN(
        requestedStart.getTime(),
      )
    ) {
      throw createAiAppointmentError(
        'Randevu tarihi veya saati geçerli değil.',
        400,
        'INVALID_APPOINTMENT_DATETIME',
      )
    }

    if (
      requestedStart <= new Date()
    ) {
      return {
        status: 'NOT_AVAILABLE',
        reason: 'PAST_DATETIME',
        doctor,
        date: cleanDate,
        time: cleanTime,
      }
    }

    /*
     * Burada artık gerçek çalışma programı
     * + mevcut PENDING/CONFIRMED
     * randevular kontrol edilir.
     */
    const availability =
      await getAvailableDoctorSlots({
        doctorProfileId:
          doctor.id,

        date: cleanDate,
      })

    const isAvailable =
      availability.available &&
      availability.slots.includes(
        cleanTime,
      )

    if (!isAvailable) {
      return {
        status: 'NOT_AVAILABLE',

        doctor,
        date: cleanDate,
        time: cleanTime,

        availableSlots:
          availability.slots,
      }
    }

    return {
      status: 'AVAILABLE',

      doctor,
      date: cleanDate,
      time: cleanTime,

      doctorProfileId:
        doctor.id,

      slotDurationMinutes:
        availability
          .slotDurationMinutes,

      timezone:
        availability.timezone,
    }
  }

  export const createConfirmedAiAppointment =
  async ({
    patientUserId,
    doctorProfileId,
    date,
    time,
  }) => {
    if (!patientUserId) {
      throw createAiAppointmentError(
        'Randevu oluşturmak için giriş yapmanız gerekiyor.',
        401,
        'AI_APPOINTMENT_LOGIN_REQUIRED',
      )
    }

    if (!doctorProfileId) {
      throw createAiAppointmentError(
        'Doktor bilgisi eksik.',
        400,
        'AI_APPOINTMENT_DOCTOR_REQUIRED',
      )
    }

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(
        String(date || ''),
      )
    ) {
      throw createAiAppointmentError(
        'Randevu tarihi geçerli değil.',
        400,
        'AI_APPOINTMENT_DATE_REQUIRED',
      )
    }

    const normalizedTime =
      normalizeTime(time)

    if (
      !/^\d{2}:\d{2}$/.test(
        normalizedTime,
      )
    ) {
      throw createAiAppointmentError(
        'Randevu saati geçerli değil.',
        400,
        'AI_APPOINTMENT_TIME_REQUIRED',
      )
    }

    /*
     * Gerçek rezervasyon her zaman mevcut
     * bookingService üzerinden yapılır.
     *
     * Böylece doktor, çalışma programı,
     * slot uygunluğu, geçmiş tarih ve
     * double booking kontrolleri tekrar
     * backend tarafından doğrulanır.
     */
    const appointment =
      await createPatientAppointment({
        patientUserId,
        doctorProfileId,
        date,
        startTime:
          normalizedTime,
      })

    return {
      appointmentId:
        appointment._id.toString(),

      doctorProfileId,

      date,

      time:
        normalizedTime,

      status:
        appointment.status,
    }
  }