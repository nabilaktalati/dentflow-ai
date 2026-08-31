import {
  Router,
} from 'express'

import {
  getMyPatientProfile,
  updateMyPatientProfile,
} from '../controllers/patientProfileController.js'

import {
  authenticate,
  authorizeRoles,
} from '../middleware/authMiddleware.js'

import {
  USER_ROLES,
} from '../constants/roles.js'


const router =
  Router()


router.get(
  '/profile',
  authenticate,
  authorizeRoles(
    USER_ROLES.PATIENT,
  ),
  getMyPatientProfile,
)


router.patch(
  '/profile',
  authenticate,
  authorizeRoles(
    USER_ROLES.PATIENT,
  ),
  updateMyPatientProfile,
)


export default router