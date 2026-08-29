import { Router } from 'express'

import {
  getMyAvailability,
  updateMyAvailability,
} from '../controllers/doctorAvailabilityController.js'

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
    USER_ROLES.DOCTOR,
  ),
  getMyAvailability,
)


router.put(
  '/',
  authenticate,
  authorizeRoles(
    USER_ROLES.DOCTOR,
  ),
  updateMyAvailability,
)


export default router