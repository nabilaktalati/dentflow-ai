import {
  aiAssistantMessageSchema,
} from '../validators/aiAssistantValidators.js'
import {
  aiAppointmentConfirmationSchema,
} from '../validators/aiAssistantValidators.js'
import {
  sendMessage,
} from '../services/messageService.js'
import {
  createConfirmedAiAppointment,
} from '../services/aiAppointmentService.js'
import {
  interpretUserMessage,
} from '../services/aiProviderService.js'
import {
  processAssistantIntent,
} from '../services/aiAssistantService.js'
export const handleAiAssistantMessage =
  async (
    req,
    res,
    next,
  ) => {
    try {
      const result =
        aiAssistantMessageSchema.safeParse(
          req.body,
        )

      if (!result.success) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              result.error.issues[0]
                ?.message ||
              'Mesaj geçerli değil.',
          })
      }

const role =
  req.auth?.role || 'GUEST'

const interpretedIntent =
  await interpretUserMessage({
    message:
      result.data.message,

    history:
      result.data.history,

    role,
  })

const intent =
  await processAssistantIntent({
    intent:
      interpretedIntent,

    role,

    userId:
      req.auth?.userId || null,
  })

      return res
        .status(200)
        .json({
          success: true,

          data: {
            assistant: intent,
          },
        })
    } catch (error) {
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
  }

  export const confirmAiAppointment =
  async (
    req,
    res,
    next,
  ) => {
    try {
      const result =
        aiAppointmentConfirmationSchema.safeParse(
          req.body,
        )

      if (!result.success) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              result.error.issues[0]
                ?.message ||
              'Randevu bilgileri geçerli değil.',
          })
      }

      const appointment =
        await createConfirmedAiAppointment({
          patientUserId:
            req.auth.userId,

          doctorProfileId:
            result.data
              .doctorProfileId,

          date:
            result.data.date,

          time:
            result.data.time,
        })

      return res
        .status(201)
        .json({
          success: true,

          message:
            'Randevunuz başarıyla oluşturuldu.',

          data: {
            appointment,
          },
        })
    } catch (error) {
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
  }

  export const confirmAiMessage =
  async (
    req,
    res,
    next,
  ) => {
    try {
      const recipientId =
        String(
          req.body?.recipientId || '',
        ).trim()

      const content =
        String(
          req.body?.content || '',
        ).trim()

      const objectIdRegex =
        /^[0-9a-fA-F]{24}$/

      if (
        !objectIdRegex.test(
          recipientId,
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              'Mesaj alıcısı geçerli değil.',
          })
      }

      if (
        !content ||
        content.length > 1200
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              'Mesaj içeriği geçerli değil.',
          })
      }

      const message =
        await sendMessage({
          senderId:
            req.auth.userId,

          senderRole:
            req.auth.role,

          recipientId,

          content,
        })

      return res
        .status(201)
        .json({
          success: true,

          message:
            'Mesajınız başarıyla gönderildi.',

          data: {
            message,
          },
        })
    } catch (error) {
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
  }