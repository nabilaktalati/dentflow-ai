import express from 'express'

import {
  getUnreadNotificationCount,
  getUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../controllers/notificationController.js'

import {
  authenticate,
} from '../middleware/authMiddleware.js'

const router = express.Router()

router.get(
  '/',
  authenticate,
  getUserNotifications,
)

router.get(
  '/unread-count',
  authenticate,
  getUnreadNotificationCount,
)

router.patch(
  '/read-all',
  authenticate,
  markAllNotificationsAsRead,
)

router.patch(
  '/:notificationId/read',
  authenticate,
  markNotificationAsRead,
)

export default router