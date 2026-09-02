import express from 'express'

import {
  confirmAiAppointment,
  confirmAiMessage,
  handleAiAssistantMessage,
} from '../controllers/aiAssistantController.js'

import {
  authenticate,
  authenticateOptional,
  authorizeRoles,
} from '../middleware/authMiddleware.js'

import {
  USER_ROLES,
} from '../constants/roles.js'

const router = express.Router()

const allowGuestOrPatient = (
  req,
  res,
  next,
) => {
  if (!req.auth) {
    return next()
  }

  if (
    req.auth.role !==
    USER_ROLES.PATIENT
  ) {
    return res.status(403).json({
      success: false,
      message:
        'Bu işlem için yetkiniz bulunmuyor.',
    })
  }

  return next()
}

/*
 * Guest veya giriş yapmış hasta:
 * AI yalnızca isteği yorumlar.
 */
router.post(
  '/message',
  authenticateOptional,
  allowGuestOrPatient,
  handleAiAssistantMessage,
)

/*
 * Gerçek randevu oluşturma:
 * yalnızca giriş yapmış PATIENT.
 */
router.post(
  '/appointments/confirm',
  authenticate,
  authorizeRoles(
    USER_ROLES.PATIENT,
  ),
  confirmAiAppointment,
)
/*
 * Gerçek mesaj gönderme:
 * yalnızca giriş yapmış PATIENT.
 */
router.post(
  '/messages/confirm',
  authenticate,
  authorizeRoles(
    USER_ROLES.PATIENT,
  ),
  confirmAiMessage,
)
export default router