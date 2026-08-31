import {
  demoPaymentSchema,
} from '../validators/demoPaymentValidators.js'

import {
  processDemoPayment,
} from '../services/demoPaymentService.js'


const sendValidationError = (
  res,
  result,
) =>
  res
    .status(400)
    .json({
      success: false,

      message:
        'Ödeme bilgileri geçerli değil.',

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


const handleDemoPaymentError = (
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


export const createDemoPayment =
  async (
    req,
    res,
    next,
  ) => {
    try {
      if (
        process.env.PAYMENT_MODE !==
        'DEMO'
      ) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              'Demo ödeme modu aktif değil.',
          })
      }


      const result =
        demoPaymentSchema.safeParse(
          req.body,
        )


      if (!result.success) {
        return sendValidationError(
          res,
          result,
        )
      }


      const payment =
        await processDemoPayment({
          patientUserId:
            req.auth.userId,

          invoiceId:
            result.data.invoiceId,

          cardNumber:
            result.data.cardNumber,

          expiry:
            result.data.expiry,

          cvv:
            result.data.cvv,

          address:
            result.data.address,
        })


      return res
        .status(200)
        .json({
          success: true,

          message:
            'ödeme başarıyla tamamlandı.',

          data: {
            payment,
          },
        })
    } catch (error) {
      return handleDemoPaymentError(
        error,
        res,
        next,
      )
    }
  }