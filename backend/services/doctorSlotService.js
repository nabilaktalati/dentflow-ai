import Appointment from '../models/Appointment.js'
import DoctorAvailability from '../models/DoctorAvailability.js'
import DoctorProfile from '../models/DoctorProfile.js'

import {
  APPOINTMENT_STATUSES,
} from '../constants/appointment.js'

import {
  generateAvailabilitySlots,
} from './availabilityService.js'

const createDoctorSlotError = (
  message,
  statusCode = 400,
  code = 'DOCTOR_SLOT_ERROR',
) => {
  const error = new Error(message)

  error.statusCode = statusCode
  error.code = code

  return error
}

export const getAvailableDoctorSlots =
  async ({
    doctorProfileId,
    date,
  }) => {
    if (
      !date ||
      !/^\d{4}-\d{2}-\d{2}$/.test(
        date,
      )
    ) {
      throw createDoctorSlotError(
        'Geçerli bir tarih YYYY-MM-DD formatında gönderilmelidir.',
        400,
        'INVALID_DATE',
      )
    }

    const profile =
      await DoctorProfile.findOne({
        _id: doctorProfileId,
        isActive: true,
      })
        .populate({
          path: 'user',
          match: {
            status: 'ACTIVE',
          },
          select:
            '_id role status',
        })
        .lean()

    if (
      !profile ||
      !profile.user
    ) {
      throw createDoctorSlotError(
        'Doktor bulunamadı.',
        404,
        'DOCTOR_NOT_FOUND',
      )
    }

    const availability =
      await DoctorAvailability.findOne({
        doctor:
          profile.user._id,
      }).lean()

    const result =
      generateAvailabilitySlots(
        availability,
        date,
      )

    const dayStart =
      new Date(
        `${date}T00:00:00+03:00`,
      )

    const dayEnd =
      new Date(
        dayStart.getTime() +
          24 * 60 * 60 * 1000,
      )

    const bookedAppointments =
      await Appointment.find({
        doctor:
          profile._id,

        startAt: {
          $gte: dayStart,
          $lt: dayEnd,
        },

        status: {
          $in: [
            APPOINTMENT_STATUSES.PENDING,
            APPOINTMENT_STATUSES.CONFIRMED,
          ],
        },
      })
        .select('startAt')
        .lean()

    const timeFormatter =
      new Intl.DateTimeFormat(
        'tr-TR',
        {
          timeZone:
            'Europe/Istanbul',

          hour:
            '2-digit',

          minute:
            '2-digit',

          hourCycle:
            'h23',
        },
      )

    const bookedStartTimes =
      new Set(
        bookedAppointments.map(
          (appointment) =>
            timeFormatter.format(
              appointment.startAt,
            ),
        ),
      )

    const availableSlots =
      (
        result.slots || []
      ).filter(
        (slot) =>
          !bookedStartTimes.has(
            slot,
          ),
      )

    return {
      doctor: {
        id:
          profile._id.toString(),

        firstName:
          profile.firstName,

        lastName:
          profile.lastName,

        name:
          `${profile.firstName} ${profile.lastName}`,
      },

      slotDurationMinutes:
        availability
          ?.slotDurationMinutes ||
        30,

      timezone:
        availability
          ?.timezone ||
        'Europe/Istanbul',

      ...result,

      slots:
        availableSlots,
    }
  }

  export const resolveDoctorProfileByName =
  async (doctorName) => {
    const normalizedName =
      String(doctorName || '')
        .trim()
        .toLocaleLowerCase(
          'tr-TR',
        )
        .replace(/^dr\.?\s+/i, '')
        .replace(/\s+/g, ' ')

    if (!normalizedName) {
      throw createDoctorSlotError(
        'Doktor adı belirtilmelidir.',
        400,
        'DOCTOR_NAME_REQUIRED',
      )
    }

    const profiles =
      await DoctorProfile.find({
        isActive: true,
      })
        .populate({
          path: 'user',
          match: {
            status: 'ACTIVE',
          },
          select: '_id status',
        })
        .lean()

    const activeDoctors =
      profiles
        .filter(
          (profile) =>
            profile.user,
        )
        .map((profile) => ({
          id:
            profile._id.toString(),

          firstName:
            profile.firstName,

          lastName:
            profile.lastName,

          name:
            `${profile.firstName} ${profile.lastName}`,

          title:
            profile.title,
        }))

    const normalize = (value) =>
      String(value || '')
        .trim()
        .toLocaleLowerCase(
          'tr-TR',
        )
        .replace(/^dr\.?\s+/i, '')
        .replace(/\s+/g, ' ')

    /*
     * Önce tam eşleşme aranır.
     *
     * Örnek:
     * "Nabil"
     * "Nabil Aktalati"
     */
    const exactMatches =
      activeDoctors.filter(
        (doctor) => {
          const firstName =
            normalize(
              doctor.firstName,
            )

          const lastName =
            normalize(
              doctor.lastName,
            )

          const fullName =
            normalize(
              doctor.name,
            )

          return (
            normalizedName ===
              firstName ||
            normalizedName ===
              lastName ||
            normalizedName ===
              fullName
          )
        },
      )

    if (
      exactMatches.length === 1
    ) {
      return {
        status: 'FOUND',
        doctor:
          exactMatches[0],
      }
    }

    if (
      exactMatches.length > 1
    ) {
      return {
        status: 'AMBIGUOUS',
        doctors:
          exactMatches,
      }
    }

    /*
     * Tam eşleşme yoksa
     * kısmi eşleşme aranır.
     */
    const partialMatches =
      activeDoctors.filter(
        (doctor) =>
          normalize(
            doctor.name,
          ).includes(
            normalizedName,
          ),
      )

    if (
      partialMatches.length === 1
    ) {
      return {
        status: 'FOUND',
        doctor:
          partialMatches[0],
      }
    }

    if (
      partialMatches.length > 1
    ) {
      return {
        status: 'AMBIGUOUS',
        doctors:
          partialMatches,
      }
    }

    return {
      status: 'NOT_FOUND',
      doctors: [],
    }
  }