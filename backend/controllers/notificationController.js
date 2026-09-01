import mongoose from 'mongoose'

import {
  getUnreadNotificationCount as getUnreadNotificationCountService,
  getUserNotifications as getUserNotificationsService,
  markAllNotificationsAsRead as markAllNotificationsAsReadService,
  markNotificationAsRead as markNotificationAsReadService,
} from '../services/notificationService.js'

export const getUserNotifications = async (
  req,
  res,
) => {
  try {
    const notifications =
      await getUserNotificationsService({
        userId: req.auth.userId,
      })

    return res.status(200).json({
      success: true,
      data: {
        notifications,
      },
    })
  } catch (error) {
    return res.status(
      error.statusCode || 500,
    ).json({
      success: false,
      message:
        error.message ||
        'Bildirimler alınırken bir hata oluştu.',
      code:
        error.code ||
        'NOTIFICATIONS_FETCH_FAILED',
    })
  }
}

export const getUnreadNotificationCount =
  async (req, res) => {
    try {
      const unreadCount =
        await getUnreadNotificationCountService({
          userId: req.auth.userId,
        })

      return res.status(200).json({
        success: true,
        data: {
          unreadCount,
        },
      })
    } catch (error) {
      return res.status(
        error.statusCode || 500,
      ).json({
        success: false,
        message:
          error.message ||
          'Okunmamış bildirim sayısı alınamadı.',
        code:
          error.code ||
          'NOTIFICATION_UNREAD_COUNT_FAILED',
      })
    }
  }

export const markNotificationAsRead =
  async (req, res) => {
    try {
      const {
        notificationId,
      } = req.params

      if (
        !mongoose.isValidObjectId(
          notificationId,
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Geçersiz bildirim kimliği.',
          code:
            'INVALID_NOTIFICATION_ID',
        })
      }

      const notification =
        await markNotificationAsReadService({
          userId: req.auth.userId,
          notificationId,
        })

      return res.status(200).json({
        success: true,
        data: {
          notification,
        },
      })
    } catch (error) {
      return res.status(
        error.statusCode || 500,
      ).json({
        success: false,
        message:
          error.message ||
          'Bildirim güncellenemedi.',
        code:
          error.code ||
          'NOTIFICATION_UPDATE_FAILED',
      })
    }
  }

export const markAllNotificationsAsRead =
  async (req, res) => {
    try {
      await markAllNotificationsAsReadService({
        userId: req.auth.userId,
      })

      return res.status(200).json({
        success: true,
        message:
          'Tüm bildirimler okundu olarak işaretlendi.',
      })
    } catch (error) {
      return res.status(
        error.statusCode || 500,
      ).json({
        success: false,
        message:
          error.message ||
          'Bildirimler güncellenemedi.',
        code:
          error.code ||
          'NOTIFICATIONS_UPDATE_FAILED',
      })
    }
  }