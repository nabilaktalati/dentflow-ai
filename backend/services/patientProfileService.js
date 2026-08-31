import PatientProfile from '../models/PatientProfile.js'


const createProfileError = (
  message,
  statusCode,
  code,
) => {
  const error =
    new Error(message)

  error.statusCode =
    statusCode

  error.code =
    code

  return error
}


export const getPatientProfile =
  async ({
    patientUserId,
  }) => {
    const profile =
      await PatientProfile.findOne({
        user: patientUserId,
      })
        .select(
          '_id firstName lastName phone dateOfBirth address user',
        )
        .populate({
          path: 'user',
          select:
            'email isEmailVerified status',
        })
        .lean()


    if (!profile) {
      throw createProfileError(
        'Hasta profili bulunamadı.',
        404,
        'PATIENT_PROFILE_NOT_FOUND',
      )
    }


    return {
      id:
        profile._id.toString(),

      firstName:
        profile.firstName,

      lastName:
        profile.lastName,

      fullName:
        `${profile.firstName} ${profile.lastName}`,

      phone:
        profile.phone,

      dateOfBirth:
        profile.dateOfBirth,

      address:
  profile.address ||
  null,

      email:
        profile.user?.email ||
        null,

      isEmailVerified:
        Boolean(
          profile.user
            ?.isEmailVerified,
        ),

      accountStatus:
        profile.user?.status ||
        null,
    }
  }


export const updatePatientProfile =
  async ({
    patientUserId,
    address,
  }) => {
    const profile =
      await PatientProfile.findOneAndUpdate(
        {
          user:
            patientUserId,
        },
        {
          $set: {
            address:
              address.trim(),
          },
        },
        {
          new: true,
          runValidators: true,
        },
      )
        .select(
          '_id firstName lastName phone dateOfBirth address',
        )
        .lean()


    if (!profile) {
      throw createProfileError(
        'Hasta profili bulunamadı.',
        404,
        'PATIENT_PROFILE_NOT_FOUND',
      )
    }


    return {
      id:
        profile._id.toString(),

      firstName:
        profile.firstName,

      lastName:
        profile.lastName,

      phone:
        profile.phone,

      dateOfBirth:
        profile.dateOfBirth,

      address:
  profile.address ||
  null,
    }
  }