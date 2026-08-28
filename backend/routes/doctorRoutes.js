import { Router } from 'express'

import {
  getPublicDoctors,
} from '../controllers/doctorController.js'


const router = Router()


router.get(
  '/',
  getPublicDoctors,
)


export default router