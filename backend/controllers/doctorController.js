import DoctorProfile from '../models/DoctorProfile.js'
import DoctorAvailability from '../models/DoctorAvailability.js'
import Appointment from '../models/Appointment.js'

import {
  APPOINTMENT_STATUSES,
} from '../constants/appointment.js'

import {
  generateAvailabilitySlots,
} from '../services/availabilityService.js'


export const getPublicDoctors = async (
  req,
  res,
  next,
) => {
  try {
    const profiles =
      await DoctorProfile.find({
        isActive: true,
      })
        .populate({
          path: 'user',
          match: {
            status: 'ACTIVE',
          },
          select: 'status',
        })
        .sort({
          displayOrder: 1,
          createdAt: -1,
        })
        .lean()

    const doctors =
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

          bio:
            profile.bio,

          education:
            profile.education,

          experienceYears:
            profile.experienceYears,

          clinicName:
            profile.clinicName,

          location:
            profile.location,

          profileImageUrl:
            profile.profileImageUrl,
        }))

    return res.status(200).json({
      success: true,

      data: {
        doctors,
      },
    })
  } catch (error) {
    return next(error)
  }
}


export const getDoctorAvailabilityByDate = async (
  req,
  res,
  next,
) => {
  try {
    const {
      doctorId,
    } = req.params

    const {
      date,
    } = req.query


    if (
      !date ||
      !/^\d{4}-\d{2}-\d{2}$/.test(
        date,
      )
    ) {
      return res.status(400).json({
        success: false,

        message:
          'Geçerli bir tarih YYYY-MM-DD formatında gönderilmelidir.',
      })
    }


    const profile =
      await DoctorProfile.findOne({
        _id: doctorId,
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
      return res.status(404).json({
        success: false,

        message:
          'Doktor bulunamadı.',
      })
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


    /*
     * Seçilen tarihin İstanbul saatine göre
     * başlangıç ve bitiş aralığı.
     */
    const dayStart =
      new Date(
        `${date}T00:00:00+03:00`,
      )

    const dayEnd =
      new Date(
        dayStart.getTime() +
          24 * 60 * 60 * 1000,
      )


    /*
     * PENDING ve CONFIRMED randevular
     * slotu meşgul eder.
     */
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


    /*
     * MongoDB UTC Date değerlerini
     * tekrar Europe/Istanbul HH:mm formatına çevir.
     */
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
          (
            appointment,
          ) =>
            timeFormatter.format(
              appointment.startAt,
            ),
        ),
      )


    /*
     * Availability Engine tarafından üretilen
     * slotlardan dolu olanları çıkar.
     */
    const availableSlots =
      (
        result.slots ||
        []
      ).filter(
        (slot) =>
          !bookedStartTimes.has(
            slot,
          ),
      )


    return res.status(200).json({
      success: true,

      data: {
        doctor: {
          id:
            profile._id.toString(),

          firstName:
            profile.firstName,

          lastName:
            profile.lastName,
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
      },
    })
  } catch (error) {
    return next(error)
  }
}