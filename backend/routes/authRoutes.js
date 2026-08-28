import { Router } from 'express'

import {
  login,
  logout,
  getMe,
  refreshSession,
  registerPatient,
  verifyEmail,
  resendVerification,
  changePassword,
} from '../controllers/authController.js'

import {
  authenticate,
} from '../middleware/authMiddleware.js'

const router = Router()

router.post(
  '/register',
  registerPatient,
)

router.post(
  '/verify-email',
  verifyEmail,
)

router.post(
  '/resend-verification',
  resendVerification,
)

router.post(
  '/login',
  login,
)
router.post(
  '/logout',
  logout,
)
router.post(
  '/refresh',
  refreshSession,
)

router.get(
  '/me',
  authenticate,
  getMe,
)
router.post(
  '/change-password',
  authenticate,
  changePassword,
)
export default router