import { Router } from 'express'

import {
  createTreatmentRecord,
  getMyTreatmentRecords,
} from '../controllers/treatmentController.js'

import {
  authenticate,
  authorizeRoles,
} from '../middleware/authMiddleware.js'

import {
  USER_ROLES,
} from '../constants/roles.js'


const router = Router()


router.get(
  '/my',
  authenticate,
  authorizeRoles(
    USER_ROLES.PATIENT,
  ),
  getMyTreatmentRecords,
)


router.post(
  '/',
  authenticate,
  authorizeRoles(
    USER_ROLES.DOCTOR,
  ),
  createTreatmentRecord,
)


export default router