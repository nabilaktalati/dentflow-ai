import { Router } from 'express'

import {
  registerPatient,
  verifyEmail,
  resendVerification,
} from '../controllers/authController.js'

const router = Router()

router.post('/register', registerPatient)
router.post('/verify-email', verifyEmail)
router.post('/resend-verification', resendVerification)

export default router