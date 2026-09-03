import { Router } from 'express'

import {
  getAdminDashboardAnalytics,
} from '../controllers/adminAnalyticsController.js'

import {
  authenticate,
  authorizeRoles,
} from '../middleware/authMiddleware.js'

import {
  USER_ROLES,
} from '../constants/roles.js'

const router = Router()

router.get(
  '/',
  authenticate,
  authorizeRoles(
    USER_ROLES.ADMIN,
  ),
  getAdminDashboardAnalytics,
)

export default router