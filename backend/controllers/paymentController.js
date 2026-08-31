import {
  createPaytrPaymentSchema,
} from '../validators/paymentValidators.js'

import {
  createPaytrIframeToken,
} from '../services/paytrService.js'


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


const handlePaymentError = (
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


const getRequestIp = (
  req,
) => {
  const forwardedFor =
    req.headers[
      'x-forwarded-for'
    ]

  if (
    typeof forwardedFor ===
    'string'
  ) {
    return forwardedFor
      .split(',')[0]
      .trim()
  }

  return (
    req.ip ||
    req.socket?.remoteAddress ||
    ''
  )
}


export const createPaytrPayment =
  async (
    req,
    res,
    next,
  ) => {
    try {
      const result =
        createPaytrPaymentSchema.safeParse(
          req.body,
        )

      if (!result.success) {
        return sendValidationError(
          res,
          result,
        )
      }


      const {
        invoiceId,
        address,
      } = result.data


      const payment =
        await createPaytrIframeToken({
          patientUserId:
            req.auth.userId,

          invoiceId,

          address,

          userIp:
            getRequestIp(req),
        })


      return res
        .status(200)
        .json({
          success: true,

          message:
            'Ödeme oturumu başarıyla oluşturuldu.',

          data: {
            payment: {
              token:
                payment.token,

              merchantOid:
                payment.merchantOid,

              iframeUrl:
                payment.iframeUrl,
            },
          },
        })
    } catch (error) {
      return handlePaymentError(
        error,
        res,
        next,
      )
    }
  }