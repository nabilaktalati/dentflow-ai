import { Router } from 'express'

import {
  cancelMyAppointment,
  createAppointment,
  getDoctorAppointments,
  getMyAppointments,
  
} from '../controllers/appointmentController.js'

import {
  authenticate,
  authorizeRoles,
} from '../middleware/authMiddleware.js'

import {
  USER_ROLES,
} from '../constants/roles.js'


const router = Router()


router.get(
  '/doctor/my',

  authenticate,

  authorizeRoles(
    USER_ROLES.DOCTOR,
  ),

  getDoctorAppointments,
)





router.get(
  '/my',

  authenticate,

  authorizeRoles(
    USER_ROLES.PATIENT,
  ),

  getMyAppointments,
)


router.patch(
  '/:appointmentId/cancel',

  authenticate,

  authorizeRoles(
    USER_ROLES.PATIENT,
  ),

  cancelMyAppointment,
)


router.post(
  '/',

  authenticate,

  authorizeRoles(
    USER_ROLES.PATIENT,
  ),

  createAppointment,
)


export default router