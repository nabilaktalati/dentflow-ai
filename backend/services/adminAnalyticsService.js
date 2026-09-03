import User from '../models/User.js'
import Appointment from '../models/Appointment.js'
import Invoice, {
  INVOICE_STATUSES,
} from '../models/Invoice.js'

import {
  USER_ROLES,
} from '../constants/roles.js'
import {
  APPOINTMENT_STATUS_VALUES,
} from '../constants/appointment.js'

const getIstanbulTodayRange = () => {
  const now = new Date()

  const istanbulNow = new Date(
    now.getTime() + 3 * 60 * 60 * 1000,
  )

  const year =
    istanbulNow.getUTCFullYear()

  const month =
    istanbulNow.getUTCMonth()

  const day =
    istanbulNow.getUTCDate()

  const start = new Date(
    Date.UTC(
      year,
      month,
      day,
      -3,
      0,
      0,
      0,
    ),
  )

  const end = new Date(
    Date.UTC(
      year,
      month,
      day + 1,
      -3,
      0,
      0,
      0,
    ),
  )

  return {
    start,
    end,
  }
}


export const getAdminAnalyticsSummary =
  async () => {
    const {
      start,
      end,
    } = getIstanbulTodayRange()

    const [
      totalDoctors,
      registeredPatients,
      todayAppointments,
      revenueResult,
      appointmentStatusResult,
      invoiceStatusResult,
    ] = await Promise.all([
      User.countDocuments({
        role: USER_ROLES.DOCTOR,
      }),

      User.countDocuments({
        role: USER_ROLES.PATIENT,
      }),

      Appointment.countDocuments({
        startAt: {
          $gte: start,
          $lt: end,
        },
      }),

      Invoice.aggregate([
        {
          $match: {
            status:
              INVOICE_STATUSES.PAID,
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: '$amount',
            },
          },
        },
      ]),

      Appointment.aggregate([
        {
          $group: {
            _id: '$status',
            count: {
              $sum: 1,
            },
          },
        },
      ]),

      Invoice.aggregate([
        {
          $group: {
            _id: '$status',
            count: {
              $sum: 1,
            },
            totalAmount: {
              $sum: '$amount',
            },
          },
        },
      ]),
    ])

    const appointmentStatuses =
      APPOINTMENT_STATUS_VALUES.map(
        (status) => ({
          status,
          count:
            appointmentStatusResult.find(
              (item) =>
                item._id === status,
            )?.count ?? 0,
        }),
      )

    const invoiceStatuses =
      Object.values(
        INVOICE_STATUSES,
      ).map((status) => {
        const result =
          invoiceStatusResult.find(
            (item) =>
              item._id === status,
          )

        return {
          status,
          count:
            result?.count ?? 0,
          totalAmount:
            result?.totalAmount ?? 0,
        }
      })

    return {
      totalDoctors,
      todayAppointments,
      appointmentStatuses,
      registeredPatients,
      totalRevenue:
        revenueResult[0]
          ?.totalRevenue ?? 0,
      currency: 'TRY',
      invoiceStatuses,
    }
  }