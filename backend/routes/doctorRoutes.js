import { Router } from 'express'

import {
  getPublicDoctors,
  getDoctorAvailabilityByDate,
} from '../controllers/doctorController.js'


const router = Router()


router.get(
  '/',
  getPublicDoctors,
)


router.get(
  '/:doctorId/availability',
  getDoctorAvailabilityByDate,
)


export default router