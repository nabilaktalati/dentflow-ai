import DoctorProfile from '../models/DoctorProfile.js'
import DoctorAvailability from '../models/DoctorAvailability.js'

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


    // Tarih zorunlu ve YYYY-MM-DD formatında olmalı.
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
          select: '_id role status',
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
          availability?.timezone ||
          'Europe/Istanbul',

        ...result,
      },
    })
  } catch (error) {
    return next(error)
  }
}