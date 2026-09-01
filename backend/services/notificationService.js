import Notification from '../models/Notification.js'

const createNotificationError = (
  message,
  statusCode = 400,
  code = 'NOTIFICATION_ERROR',
) => {
  const error = new Error(message)
  error.statusCode = statusCode
  error.code = code

  return error
}

export const createNotification = async ({
  recipientId,
  type,
  title,
  message,
  actionPath = null,
  relatedEntityId = null,
}) => {
  const notification =
    await Notification.create({
      recipient: recipientId,
      type,
      title,
      message,
      actionPath,
      relatedEntityId,
    })

  return {
    id: notification._id,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    actionPath: notification.actionPath,
    relatedEntityId:
      notification.relatedEntityId,
    isRead: notification.isRead,
    readAt: notification.readAt,
    createdAt: notification.createdAt,
  }
}

export const getUserNotifications =
  async ({
    userId,
    limit = 30,
  }) => {
    const notifications =
      await Notification.find({
        recipient: userId,
      })
        .sort({ createdAt: -1 })
        .limit(limit)

    return notifications.map(
      (notification) => ({
        id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        actionPath:
          notification.actionPath,
        relatedEntityId:
          notification.relatedEntityId,
        isRead: notification.isRead,
        readAt: notification.readAt,
        createdAt:
          notification.createdAt,
      }),
    )
  }

export const getUnreadNotificationCount =
  async ({ userId }) => {
    return Notification.countDocuments({
      recipient: userId,
      isRead: false,
    })
  }

export const markNotificationAsRead =
  async ({
    userId,
    notificationId,
  }) => {
    const notification =
      await Notification.findOne({
        _id: notificationId,
        recipient: userId,
      })

    if (!notification) {
      throw createNotificationError(
        'Bildirim bulunamadı.',
        404,
        'NOTIFICATION_NOT_FOUND',
      )
    }

    if (!notification.isRead) {
      notification.isRead = true
      notification.readAt =
        new Date()

      await notification.save()
    }

    return {
      id: notification._id,
      isRead: notification.isRead,
      readAt: notification.readAt,
    }
  }

export const markAllNotificationsAsRead =
  async ({ userId }) => {
    await Notification.updateMany(
      {
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

    return {
      success: true,
    }
  }