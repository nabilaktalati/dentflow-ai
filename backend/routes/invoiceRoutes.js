import { Router } from 'express'

import {
  createInvoice,
  getMyInvoices,
} from '../controllers/invoiceController.js'

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
  getMyInvoices,
)
router.post(
  '/',
  authenticate,
  authorizeRoles(
    USER_ROLES.DOCTOR,
  ),
  createInvoice,
)


export default router