import express from 'express'

import {
  getConversationMessages,
  getMessageContacts,
  getUnreadMessageCount,
  sendMessage,
} from '../controllers/messageController.js'

import {
  authenticate,
  authorizeRoles,
} from '../middleware/authMiddleware.js'

import {
  USER_ROLES,
} from '../constants/roles.js'

const router = express.Router()

router.get(
  '/contacts',
  authenticate,
  authorizeRoles(
    USER_ROLES.PATIENT,
    USER_ROLES.DOCTOR,
  ),
  getMessageContacts,
)

router.get(
  '/unread-count',
  authenticate,
  authorizeRoles(
    USER_ROLES.PATIENT,
    USER_ROLES.DOCTOR,
  ),
  getUnreadMessageCount,
)

router.get(
  '/conversation/:recipientId',
  authenticate,
  authorizeRoles(
    USER_ROLES.PATIENT,
    USER_ROLES.DOCTOR,
  ),
  getConversationMessages,
)

router.post(
  '/',
  authenticate,
  authorizeRoles(
    USER_ROLES.PATIENT,
    USER_ROLES.DOCTOR,
    USER_ROLES.ADMIN,
  ),
  sendMessage,
)

export default router