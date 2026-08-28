import { Router } from 'express'

import {
  createDoctor,
  getDoctors,
  updateDoctorProfile,
  uploadDoctorProfileImage,
  uploadDoctorCv as uploadDoctorCvController,
  deleteDoctor,
} from '../controllers/adminDoctorController.js'

import {
  authenticate,
  authorizeRoles,
} from '../middleware/authMiddleware.js'

import {
  USER_ROLES,
} from '../constants/roles.js'
import {
  uploadDoctorImage,
  uploadDoctorCv as uploadDoctorCvMiddleware,
} from '../middleware/uploadMiddleware.js'

const router = Router()


router.get(
  '/',
  authenticate,
  authorizeRoles(
    USER_ROLES.ADMIN,
  ),
  getDoctors,
)


router.patch(
  '/:doctorId',
  authenticate,
  authorizeRoles(
    USER_ROLES.ADMIN,
  ),
  updateDoctorProfile,
)
router.delete(
  '/:doctorId',
  authenticate,
  authorizeRoles(
    USER_ROLES.ADMIN,
  ),
  deleteDoctor,
)
router.post(
  '/:doctorId/profile-image',
  authenticate,
  authorizeRoles(
    USER_ROLES.ADMIN,
  ),
  uploadDoctorImage,
  uploadDoctorProfileImage,
)
router.post(
  '/:doctorId/cv',
  authenticate,
  authorizeRoles(
    USER_ROLES.ADMIN,
  ),
  uploadDoctorCvMiddleware,
  uploadDoctorCvController,
)
router.post(
  '/',
  authenticate,
  authorizeRoles(
    USER_ROLES.ADMIN,
  ),
  createDoctor,
)


export default router