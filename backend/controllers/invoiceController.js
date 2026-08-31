import mongoose from 'mongoose'

import {
  createInvoiceSchema,
} from '../validators/invoiceValidators.js'

import {
  createDoctorInvoice,
  getPatientInvoices,
} from '../services/invoiceService.js'


const sendValidationError = (
  res,
  result,
) =>
  res
    .status(400)
    .json({
      success: false,

      message:
        'Fatura bilgileri geçerli değil.',

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


const handleInvoiceError = (
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


export const createInvoice =
  async (
    req,
    res,
    next,
  ) => {
    try {
      const result =
        createInvoiceSchema.safeParse(
          req.body,
        )

      if (!result.success) {
        return sendValidationError(
          res,
          result,
        )
      }


      const {
        treatmentRecordId,
        description,
        amount,
        dueDate,
      } = result.data


      if (
        !mongoose.isValidObjectId(
          treatmentRecordId,
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            code:
              'INVALID_TREATMENT_RECORD_ID',

            message:
              'Geçerli bir tedavi kaydı kimliği gereklidir.',
          })
      }


      const invoice =
        await createDoctorInvoice({
          doctorUserId:
            req.auth.userId,

          treatmentRecordId,

          description,

          amount,

          dueDate:
            dueDate ?? null,
        })


      return res
        .status(201)
        .json({
          success: true,

          message:
            'Fatura başarıyla oluşturuldu.',

          data: {
            invoice: {
              id:
                invoice._id,

              invoiceNumber:
                invoice.invoiceNumber,

              patient:
                invoice.patient,

              doctor:
                invoice.doctor,

              appointment:
                invoice.appointment,

              treatmentRecord:
                invoice.treatmentRecord,

              description:
                invoice.description,

              amount:
                invoice.amount,

              currency:
                invoice.currency,

              status:
                invoice.status,

              issuedAt:
                invoice.issuedAt,

              dueDate:
                invoice.dueDate,

              paidAt:
                invoice.paidAt,

              automationStatus:
                invoice.automationStatus,

              createdAt:
                invoice.createdAt,
            },
          },
        })
    } catch (error) {
      return handleInvoiceError(
        error,
        res,
        next,
      )
    }
  }

  export const getMyInvoices =
  async (
    req,
    res,
    next,
  ) => {
    try {
      const invoices =
        await getPatientInvoices({
          patientUserId:
            req.auth.userId,
        })

      return res
        .status(200)
        .json({
          success: true,

          data: {
            invoices,
          },
        })
    } catch (error) {
      return handleInvoiceError(
        error,
        res,
        next,
      )
    }
  }