import DoctorProfile from '../models/DoctorProfile.js'


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