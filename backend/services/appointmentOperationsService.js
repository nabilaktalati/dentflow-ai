import Appointment from '../models/Appointment.js'

import PatientProfile from '../models/PatientProfile.js'

import {
  APPOINTMENT_STATUSES,
} from '../constants/appointment.js'


const createOperationError = (
  message,
  statusCode,
  code,
) => {
  const error =
    new Error(message)

  error.statusCode =
    statusCode

  error.code =
    code

  return error
}


const ensureCancellableStatus = (
  appointment,
) => {
  const cancellableStatuses = [
    APPOINTMENT_STATUSES.PENDING,
    APPOINTMENT_STATUSES.CONFIRMED,
  ]

  if (
    !cancellableStatuses.includes(
      appointment.status,
    )
  ) {
    throw createOperationError(
      'Bu randevu artık iptal edilemez.',
      409,
      'APPOINTMENT_NOT_CANCELLABLE',
    )
  }
}


export const cancelPatientAppointment =
  async ({
    appointmentId,
    patientUserId,
    cancellationReason = '',
  }) => {
    const patientProfile =
      await PatientProfile.findOne({
        user: patientUserId,
      })
        .select('_id')
        .lean()

    if (!patientProfile) {
      throw createOperationError(
        'Hasta profili bulunamadı.',
        404,
        'PATIENT_PROFILE_NOT_FOUND',
      )
    }

    const appointment =
      await Appointment.findOne({
        _id: appointmentId,
        patient:
          patientProfile._id,
      })

    if (!appointment) {
      throw createOperationError(
        'Randevu bulunamadı.',
        404,
        'APPOINTMENT_NOT_FOUND',
      )
    }

    ensureCancellableStatus(
      appointment,
    )

    if (
      appointment.startAt <=
      new Date()
    ) {
      throw createOperationError(
        'Başlamış veya geçmiş bir randevu hasta tarafından iptal edilemez.',
        409,
        'PAST_APPOINTMENT_CANNOT_BE_CANCELLED',
      )
    }

    const now =
      new Date()

    appointment.status =
      APPOINTMENT_STATUSES.CANCELLED

    appointment.statusUpdatedAt =
      now

    appointment.cancelledAt =
      now

    appointment.cancelledBy =
      patientUserId

    appointment.cancellationReason =
      cancellationReason

    /*
     * Slot artık rezervasyonu engellememeli.
     * Böylece iptal edilen saat tekrar
     * başka bir hasta tarafından alınabilir.
     */
    appointment.slotKey =
      null

    await appointment.save()

    return appointment
  }


