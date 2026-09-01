import {
  sendMessage as sendMessageService,
  getMessageContacts as getMessageContactsService,
  getConversationMessages as getConversationMessagesService,
  getUnreadMessageCount as getUnreadMessageCountService,
} from '../services/messageService.js'
import {
  sendMessageSchema,
} from '../validators/messageValidators.js'

export const sendMessage = async (
  req,
  res,
) => {
  try {
    const validationResult =
      sendMessageSchema.safeParse(req.body)

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message:
          validationResult.error.issues[0]
            ?.message ||
          'Mesaj bilgileri geçersiz.',
      })
    }

    const message =
  await sendMessageService({
    senderId: req.auth.userId,
    senderRole: req.auth.role,
    ...validationResult.data,
  })

    return res.status(201).json({
      success: true,
      message:
        'Mesaj başarıyla gönderildi.',
      data: {
        message,
      },
    })
  } catch (error) {
    const statusCode =
      error.statusCode || 500

    return res
      .status(statusCode)
      .json({
        success: false,
        message:
          error.message ||
          'Mesaj gönderilirken bir hata oluştu.',
        code:
          error.code ||
          'MESSAGE_SEND_FAILED',
      })
  }
}

export const getMessageContacts = async (
  req,
  res,
) => {
  try {
    const contacts =
      await getMessageContactsService({
        userId: req.auth.userId,
        role: req.auth.role,
      })

    return res.status(200).json({
      success: true,
      data: {
        contacts,
      },
    })
  } catch (error) {
    const statusCode =
      error.statusCode || 500

    return res
      .status(statusCode)
      .json({
        success: false,
        message:
          error.message ||
          'Mesaj kişileri alınırken bir hata oluştu.',
        code:
          error.code ||
          'MESSAGE_CONTACTS_FAILED',
      })
  }
}
export const getConversationMessages = async (
  req,
  res,
) => {
  try {
    const messages =
      await getConversationMessagesService({
        userId: req.auth.userId,
        recipientId:
          req.params.recipientId,
        role: req.auth.role,
      })

    return res.status(200).json({
      success: true,
      data: {
        messages,
      },
    })
  } catch (error) {
    const statusCode =
      error.statusCode || 500

    return res
      .status(statusCode)
      .json({
        success: false,
        message:
          error.message ||
          'Mesajlar alınırken bir hata oluştu.',
        code:
          error.code ||
          'MESSAGE_CONVERSATION_FAILED',
      })
  }
}
export const getUnreadMessageCount = async (
  req,
  res,
) => {
  try {
    const unreadCount =
      await getUnreadMessageCountService({
        userId: req.auth.userId,
      })

    return res.status(200).json({
      success: true,
      data: {
        unreadCount,
      },
    })
  } catch (error) {
    const statusCode =
      error.statusCode || 500

    return res
      .status(statusCode)
      .json({
        success: false,
        message:
          error.message ||
          'Okunmamış mesaj sayısı alınırken bir hata oluştu.',
        code:
          error.code ||
          'MESSAGE_UNREAD_COUNT_FAILED',
      })
  }
}