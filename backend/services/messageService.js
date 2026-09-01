import Appointment from '../models/Appointment.js'
import DoctorProfile from '../models/DoctorProfile.js'
import Message from '../models/Message.js'
import PatientProfile from '../models/PatientProfile.js'
import User from '../models/User.js'
import { USER_ROLES } from '../constants/roles.js'
import {
  createNotification,
} from './notificationService.js'
const createMessageError = (
  message,
  statusCode = 400,
  code = 'MESSAGE_ERROR',
) => {
  const error = new Error(message)
  error.statusCode = statusCode
  error.code = code

  return error
}

export const sendMessage = async ({
  senderId,
  senderRole,
  recipientId,
  content,
}) => {
  if (senderId === recipientId) {
    throw createMessageError(
      'Kendinize mesaj gönderemezsiniz.',
      400,
      'MESSAGE_SELF_NOT_ALLOWED',
    )
  }

  const recipient =
    await User.findById(recipientId)
      .select('_id role status')

  if (!recipient) {
    throw createMessageError(
      'Mesaj gönderilecek kullanıcı bulunamadı.',
      404,
      'MESSAGE_RECIPIENT_NOT_FOUND',
    )
  }

  if (recipient.status !== 'ACTIVE') {
    throw createMessageError(
      'Bu kullanıcıya şu anda mesaj gönderilemez.',
      400,
      'MESSAGE_RECIPIENT_NOT_ACTIVE',
    )
  }

  let hasRelationship = false

  if (
    senderRole === USER_ROLES.PATIENT &&
    recipient.role === USER_ROLES.DOCTOR
  ) {
    const patient =
      await PatientProfile.findOne({
        user: senderId,
      }).select('_id')

    const doctor =
      await DoctorProfile.findOne({
        user: recipientId,
        isActive: true,
      }).select('_id')

    if (patient && doctor) {
      hasRelationship =
        Boolean(
          await Appointment.exists({
            patient: patient._id,
            doctor: doctor._id,
          }),
        )
    }
  }

  if (
    senderRole === USER_ROLES.DOCTOR &&
    recipient.role === USER_ROLES.PATIENT
  ) {
    const doctor =
      await DoctorProfile.findOne({
        user: senderId,
        isActive: true,
      }).select('_id')

    const patient =
      await PatientProfile.findOne({
        user: recipientId,
      }).select('_id')

    if (doctor && patient) {
      hasRelationship =
        Boolean(
          await Appointment.exists({
            doctor: doctor._id,
            patient: patient._id,
          }),
        )
    }
  }

  if (!hasRelationship) {
    throw createMessageError(
      'Bu kullanıcıya mesaj gönderme yetkiniz bulunmuyor.',
      403,
      'MESSAGE_RELATIONSHIP_REQUIRED',
    )
  }

  const message =
    await Message.create({
      sender: senderId,
      recipient: recipient._id,
      content,
    })
try {
  await createNotification({
    recipientId: recipient._id,
    type: 'MESSAGE',
    title: 'Yeni mesaj',
    message:
      'Yeni bir mesaj aldınız.',
    actionPath:
      recipient.role ===
      USER_ROLES.DOCTOR
        ? '/doctor/messages'
        : '/patient/messages',
    relatedEntityId:
      message._id,
  })
} catch (error) {
  console.error(
    'Mesaj bildirimi oluşturulamadı:',
    error.message,
  )
}
  return {
    id: message._id,
    senderId: message.sender,
    recipientId: message.recipient,
    content: message.content,
    isRead: message.isRead,
    readAt: message.readAt,
    createdAt: message.createdAt,
  }
}       

export const getMessageContacts = async ({
  userId,
  role,
}) => {
  if (role === USER_ROLES.PATIENT) {
    const patient =
      await PatientProfile.findOne({
        user: userId,
      }).select('_id')

    if (!patient) {
      throw createMessageError(
        'Hasta profili bulunamadı.',
        404,
        'PATIENT_PROFILE_NOT_FOUND',
      )
    }

    const appointments =
      await Appointment.find({
        patient: patient._id,
      })
        .sort({ startAt: -1 })
        .populate({
          path: 'doctor',
          select:
            'user firstName lastName title profileImageUrl isActive',
        })

    const contacts = new Map()

    for (const appointment of appointments) {
      const doctor = appointment.doctor

      if (
        !doctor?.user ||
        !doctor.isActive
      ) {
        continue
      }

      const recipientId =
        doctor.user.toString()

      if (contacts.has(recipientId)) {
        continue
      }

      contacts.set(recipientId, {
        recipientId,
        role: USER_ROLES.DOCTOR,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        title: doctor.title,
        profileImageUrl:
          doctor.profileImageUrl || '',
        lastAppointmentAt:
          appointment.startAt,
      })
    }

    return [...contacts.values()]
  }

  if (role === USER_ROLES.DOCTOR) {
    const doctor =
      await DoctorProfile.findOne({
        user: userId,
        isActive: true,
      }).select('_id')

    if (!doctor) {
      throw createMessageError(
        'Doktor profili bulunamadı.',
        404,
        'DOCTOR_PROFILE_NOT_FOUND',
      )
    }

    const appointments =
      await Appointment.find({
        doctor: doctor._id,
      })
        .sort({ startAt: -1 })
        .populate({
          path: 'patient',
          select:
            'user firstName lastName',
        })

    const contacts = new Map()

    for (const appointment of appointments) {
      const patient = appointment.patient

      if (!patient?.user) {
        continue
      }

      const recipientId =
        patient.user.toString()

      if (contacts.has(recipientId)) {
        continue
      }

      contacts.set(recipientId, {
        recipientId,
        role: USER_ROLES.PATIENT,
        firstName: patient.firstName,
        lastName: patient.lastName,
        lastAppointmentAt:
          appointment.startAt,
      })
    }

    return [...contacts.values()]
  }

  return []
}
export const getConversationMessages =
  async ({
    userId,
    recipientId,
    role,
  }) => {
    const objectIdRegex =
      /^[0-9a-fA-F]{24}$/

    if (!objectIdRegex.test(recipientId)) {
      throw createMessageError(
        'Geçersiz kullanıcı kimliği.',
        400,
        'MESSAGE_INVALID_RECIPIENT_ID',
      )
    }

    if (userId === recipientId) {
      throw createMessageError(
        'Kendinizle mesajlaşamazsınız.',
        400,
        'MESSAGE_SELF_NOT_ALLOWED',
      )
    }

    const recipient =
      await User.findById(recipientId)
        .select('_id role status')

    if (
      !recipient ||
      recipient.status !== 'ACTIVE'
    ) {
      throw createMessageError(
        'Mesajlaşılacak kullanıcı bulunamadı.',
        404,
        'MESSAGE_RECIPIENT_NOT_FOUND',
      )
    }

    let hasRelationship = false

    if (role === USER_ROLES.PATIENT) {
      const patient =
        await PatientProfile.findOne({
          user: userId,
        }).select('_id')

      const doctor =
        await DoctorProfile.findOne({
          user: recipientId,
          isActive: true,
        }).select('_id')

      if (patient && doctor) {
        hasRelationship =
          Boolean(
            await Appointment.exists({
              patient: patient._id,
              doctor: doctor._id,
            }),
          )
      }
    }

    if (role === USER_ROLES.DOCTOR) {
      const doctor =
        await DoctorProfile.findOne({
          user: userId,
          isActive: true,
        }).select('_id')

      const patient =
        await PatientProfile.findOne({
          user: recipientId,
        }).select('_id')

      if (doctor && patient) {
        hasRelationship =
          Boolean(
            await Appointment.exists({
              doctor: doctor._id,
              patient: patient._id,
            }),
          )
      }
    }

    if (!hasRelationship) {
      throw createMessageError(
        'Bu kullanıcıyla mesajlaşma yetkiniz bulunmuyor.',
        403,
        'MESSAGE_RELATIONSHIP_REQUIRED',
      )
    }
await Message.updateMany(
  {
    sender: recipientId,
    recipient: userId,
    isRead: false,
  },
  {
    $set: {
      isRead: true,
      readAt: new Date(),
    },
  },
)
    const messages =
      await Message.find({
        $or: [
          {
            sender: userId,
            recipient: recipientId,
          },
          {
            sender: recipientId,
            recipient: userId,
          },
        ],
      })
        .sort({ createdAt: 1 })
        .limit(500)

    return messages.map(
      (message) => ({
        id: message._id,
        senderId:
          message.sender.toString(),
        recipientId:
          message.recipient.toString(),
        content: message.content,
        isRead: message.isRead,
        readAt: message.readAt,
        createdAt: message.createdAt,
      }),
    )
  }
  export const getUnreadMessageCount =
  async ({ userId }) => {
    const unreadCount =
      await Message.countDocuments({
        recipient: userId,
        isRead: false,
      })

    return unreadCount
  }