import DoctorAvailability from '../models/DoctorAvailability.js'
import {
  updateAvailabilitySchema,
} from '../validators/availabilityValidators.js'

const createEmptyWeeklySchedule = () =>
  Array.from(
    {
      length: 7,
    },
    (
      _,
      dayOfWeek,
    ) => ({
      dayOfWeek,
      enabled: false,
      periods: [],
    }),
  )


export const getMyAvailability = async (
  req,
  res,
  next,
) => {
  try {
    const doctorUserId =
  req.auth.userId

    let availability =
      await DoctorAvailability.findOne({
        doctor: doctorUserId,
      }).lean()

    if (!availability) {
      const createdAvailability =
        await DoctorAvailability.create({
          doctor:
            doctorUserId,

          timezone:
            'Europe/Istanbul',

          slotDurationMinutes:
            30,

          weeklySchedule:
            createEmptyWeeklySchedule(),

          exceptions: [],
        })

      availability =
        createdAvailability.toObject()
    }

    return res.status(200).json({
      success: true,

      data: {
        availability,
      },
    })
  } catch (error) {
    return next(error)
  }
}
export const updateMyAvailability = async (
  req,
  res,
  next,
) => {
  try {
    const validationResult =
      updateAvailabilitySchema.safeParse(
        req.body,
      )

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message:
          'Müsaitlik bilgileri geçersiz.',
        errors:
          validationResult.error
            .flatten()
            .fieldErrors,
      })
    }

    const doctorUserId =
      req.auth.userId

    const {
      timezone,
      slotDurationMinutes,
      weeklySchedule,
      exceptions,
    } = validationResult.data

    const availability =
      await DoctorAvailability.findOneAndUpdate(
        {
          doctor:
            doctorUserId,
        },
        {
          $set: {
            timezone,
            slotDurationMinutes,

            weeklySchedule: [
              ...weeklySchedule,
            ].sort(
              (
                firstDay,
                secondDay,
              ) =>
                firstDay.dayOfWeek -
                secondDay.dayOfWeek,
            ),

            exceptions: [
              ...exceptions,
            ].sort(
              (
                firstException,
                secondException,
              ) =>
                firstException.date.localeCompare(
                  secondException.date,
                ),
            ),
          },
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        },
      ).lean()

    return res.status(200).json({
      success: true,
      message:
        'Çalışma programı başarıyla güncellendi.',
      data: {
        availability,
      },
    })
  } catch (error) {
    return next(error)
  }
}