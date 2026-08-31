import {
  Router,
} from 'express'

import {
  createPaytrPayment,
} from '../controllers/paymentController.js'

import {
  handlePaytrCallback,
} from '../controllers/paytrCallbackController.js'

import {
  authenticate,
  authorizeRoles,
} from '../middleware/authMiddleware.js'

import {
  USER_ROLES,
} from '../constants/roles.js'

import {
  createDemoPayment,
} from '../controllers/demoPaymentController.js'


const router =
  Router()


router.post(
  '/paytr/callback',
  handlePaytrCallback,
)
router.post(
  '/demo',
  authenticate,
  authorizeRoles(
    USER_ROLES.PATIENT,
  ),
  createDemoPayment,
)

router.post(
  '/paytr/create',
  authenticate,
  authorizeRoles(
    USER_ROLES.PATIENT,
  ),
  createPaytrPayment,
)


export default router