import mongoose from 'mongoose'

import {
  createTreatmentRecordSchema,
} from '../validators/treatmentValidators.js'

import {
  createDoctorTreatmentRecord,
  getDoctorTreatmentRecords,
  getPatientTreatmentRecords,
} from '../services/treatmentService.js'


const sendValidationError = (
  res,
  result,
) =>
  res
    .status(400)
    .json({
      success: false,

      message:
        'Tedavi kaydı bilgileri geçerli değil.',

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


const handleTreatmentError = (
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


export const createTreatmentRecord =
  async (
    req,
    res,
    next,
  ) => {
    try {
      const result =
        createTreatmentRecordSchema.safeParse(
          req.body,
        )

      if (!result.success) {
        return sendValidationError(
          res,
          result,
        )
      }

      const {
        appointmentId,
        diagnosis,
        treatmentPlan,
        doctorNotes,
        status,
        nextVisitDate,
      } = result.data


      if (
        !mongoose.isValidObjectId(
          appointmentId,
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            code:
              'INVALID_APPOINTMENT_ID',

            message:
              'Geçerli bir randevu kimliği gereklidir.',
          })
      }


      const treatmentRecord =
        await createDoctorTreatmentRecord({
          doctorUserId:
            req.auth.userId,

          appointmentId,

          diagnosis,

          treatmentPlan,

          doctorNotes,

          status,

          nextVisitDate,
        })


      return res
        .status(201)
        .json({
          success: true,

          message:
            'Tedavi kaydı başarıyla oluşturuldu.',

          data: {
            treatmentRecord: {
              id:
                treatmentRecord._id,

              patient:
                treatmentRecord.patient,

              doctor:
                treatmentRecord.doctor,

              appointment:
                treatmentRecord.appointment,

              visitDate:
                treatmentRecord.visitDate,

              diagnosis:
                treatmentRecord.diagnosis,

              treatmentPlan:
                treatmentRecord.treatmentPlan,

              doctorNotes:
                treatmentRecord.doctorNotes,

              status:
                treatmentRecord.status,

              nextVisitDate:
                treatmentRecord.nextVisitDate,

              createdAt:
                treatmentRecord.createdAt,
            },
          },
        })
    } catch (error) {
      return handleTreatmentError(
        error,
        res,
        next,
      )
    }
  }

  export const getMyTreatmentRecords =
  async (
    req,
    res,
    next,
  ) => {
    try {
      const records =
        await getPatientTreatmentRecords({
          patientUserId:
            req.auth.userId,
        })

      return res
        .status(200)
        .json({
          success: true,

          data: {
            treatments:
              records,
          },
        })
    } catch (error) {
      return handleTreatmentError(
        error,
        res,
        next,
      )
    }
  }
  export const getDoctorTreatments =
  async (
    req,
    res,
    next,
  ) => {
    try {
      const records =
        await getDoctorTreatmentRecords({
          doctorUserId:
            req.auth.userId,
        })

      return res
        .status(200)
        .json({
          success: true,

          data: {
            treatments:
              records,
          },
        })
    } catch (error) {
      return handleTreatmentError(
        error,
        res,
        next,
      )
    }
  }