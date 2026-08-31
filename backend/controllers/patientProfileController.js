import {
  updatePatientProfileSchema,
} from '../validators/patientProfileValidators.js'

import {
  getPatientProfile,
  updatePatientProfile,
} from '../services/patientProfileService.js'


const sendValidationError = (
  res,
  result,
) =>
  res
    .status(400)
    .json({
      success: false,

      message:
        'Profil bilgileri geçerli değil.',

      errors:
        result.error.issues.map(
          (issue) => ({
            field:
              issue.path.join('.'),

            message:
              issue.message,
          }),
        ),
    })


const handleProfileError = (
  error,
  res,
  next,
) => {
  if (
    error.statusCode &&
    error.code
  ) {
    return res
      .status(
        error.statusCode,
      )
      .json({
        success: false,

        code:
          error.code,

        message:
          error.message,
      })
  }

  return next(error)
}


export const getMyPatientProfile =
  async (
    req,
    res,
    next,
  ) => {
    try {
      const profile =
        await getPatientProfile({
          patientUserId:
            req.auth.userId,
        })


      return res
        .status(200)
        .json({
          success: true,

          data: {
            profile,
          },
        })
    } catch (error) {
      return handleProfileError(
        error,
        res,
        next,
      )
    }
  }


export const updateMyPatientProfile =
  async (
    req,
    res,
    next,
  ) => {
    try {
      const result =
        updatePatientProfileSchema.safeParse(
          req.body,
        )


      if (!result.success) {
        return sendValidationError(
          res,
          result,
        )
      }


      const profile =
        await updatePatientProfile({
          patientUserId:
            req.auth.userId,

          address:
            result.data.address,
        })


      return res
        .status(200)
        .json({
          success: true,

          message:
            'Profil bilgileri başarıyla güncellendi.',

          data: {
            profile,
          },
        })
    } catch (error) {
      return handleProfileError(
        error,
        res,
        next,
      )
    }
  }