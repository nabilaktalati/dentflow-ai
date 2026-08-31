import crypto from 'crypto'

import DoctorProfile from '../models/DoctorProfile.js'
import Invoice from '../models/Invoice.js'
import PatientProfile from '../models/PatientProfile.js'
import TreatmentRecord from '../models/TreatmentRecord.js'


const createInvoiceError = (
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


const generateInvoiceNumber =
  async () => {
    for (
      let attempt = 0;
      attempt < 5;
      attempt += 1
    ) {
      const randomPart =
        crypto
          .randomBytes(4)
          .toString('hex')
          .toUpperCase()

      const invoiceNumber =
        `DF-INV-${randomPart}`

      const exists =
        await Invoice.exists({
          invoiceNumber,
        })

      if (!exists) {
        return invoiceNumber
      }
    }

    throw createInvoiceError(
      'Fatura numarası oluşturulamadı.',
      500,
      'INVOICE_NUMBER_GENERATION_FAILED',
    )
  }


export const createDoctorInvoice =
  async ({
    doctorUserId,
    treatmentRecordId,
    description,
    amount,
    dueDate,
  }) => {
    const doctorProfile =
      await DoctorProfile.findOne({
        user: doctorUserId,
        isActive: true,
      })
        .select('_id')
        .lean()

    if (!doctorProfile) {
      throw createInvoiceError(
        'Doktor profili bulunamadı.',
        404,
        'DOCTOR_PROFILE_NOT_FOUND',
      )
    }


    const treatmentRecord =
      await TreatmentRecord.findById(
        treatmentRecordId,
      )
        .select(
          'patient doctor appointment status',
        )
        .lean()

    if (!treatmentRecord) {
      throw createInvoiceError(
        'Tedavi kaydı bulunamadı.',
        404,
        'TREATMENT_RECORD_NOT_FOUND',
      )
    }


    if (
      treatmentRecord.doctor.toString() !==
      doctorProfile._id.toString()
    ) {
      throw createInvoiceError(
        'Bu tedavi kaydı için fatura oluşturma yetkiniz yok.',
        403,
        'TREATMENT_RECORD_FORBIDDEN',
      )
    }


    const existingInvoice =
      await Invoice.findOne({
        treatmentRecord:
          treatmentRecord._id,

        status: {
          $ne: 'CANCELLED',
        },
      })
        .select(
          '_id invoiceNumber status',
        )
        .lean()

    if (existingInvoice) {
      throw createInvoiceError(
        'Bu tedavi kaydı için zaten aktif bir fatura oluşturulmuş.',
        409,
        'INVOICE_ALREADY_EXISTS',
      )
    }


    let normalizedDueDate =
  null

if (dueDate) {
  normalizedDueDate =
    new Date(dueDate)

  if (
    Number.isNaN(
      normalizedDueDate.getTime(),
    )
  ) {
    throw createInvoiceError(
      'Geçerli bir son ödeme tarihi gereklidir.',
      400,
      'INVALID_DUE_DATE',
    )
  }

  if (
    normalizedDueDate.getTime() <
    Date.now()
  ) {
    throw createInvoiceError(
      'Son ödeme tarihi geçmiş bir tarih olamaz.',
      400,
      'INVOICE_DUE_DATE_IN_PAST',
    )
  }
}


    const invoiceNumber =
      await generateInvoiceNumber()


    const invoice =
      await Invoice.create({
        invoiceNumber,

        patient:
          treatmentRecord.patient,

        doctor:
          treatmentRecord.doctor,

        appointment:
          treatmentRecord.appointment,

        treatmentRecord:
          treatmentRecord._id,

        description,

        amount,

        currency: 'TRY',

        status: 'PENDING',

        dueDate:
          normalizedDueDate,

        automationStatus:
          'NOT_SENT',
      })


    return invoice
  }


export const getPatientInvoices =
  async ({
    patientUserId,
  }) => {
    const patientProfile =
      await PatientProfile.findOne({
        user: patientUserId,
      })
        .select(
          '_id firstName lastName phone dateOfBirth',
        )
        .lean()

    if (!patientProfile) {
      throw createInvoiceError(
        'Hasta profili bulunamadı.',
        404,
        'PATIENT_PROFILE_NOT_FOUND',
      )
    }


    const invoices =
      await Invoice.find({
        patient:
          patientProfile._id,
      })
        .populate({
          path: 'doctor',

          select:
            'firstName lastName title clinicName',
        })
        .populate({
          path: 'appointment',

          select:
            'appointmentCode startAt endAt status',
        })
        .populate({
          path: 'treatmentRecord',

          select:
            'visitDate diagnosis treatmentPlan status nextVisitDate',
        })
        .sort({
          issuedAt: -1,
        })
        .lean()


    return invoices.map(
      (invoice) => ({
        id:
          invoice._id,

        invoiceNumber:
          invoice.invoiceNumber,

        description:
          invoice.description,

        amount:
          invoice.amount,

        currency:
          invoice.currency,

        status:
          invoice.status,

        issuedAt:
          invoice.issuedAt,

        dueDate:
          invoice.dueDate,

        paidAt:
          invoice.paidAt,

        cancelledAt:
          invoice.cancelledAt,

        paymentReference:
          invoice.paymentReference,

        patient: {
          id:
            patientProfile._id,

          firstName:
            patientProfile.firstName,

          lastName:
            patientProfile.lastName,

          name:
            `${patientProfile.firstName} ${patientProfile.lastName}`,

          phone:
            patientProfile.phone,

          dateOfBirth:
            patientProfile.dateOfBirth,
        },

        doctor:
          invoice.doctor
            ? {
                id:
                  invoice.doctor._id,

                firstName:
                  invoice.doctor.firstName,

                lastName:
                  invoice.doctor.lastName,

                name:
                  `${invoice.doctor.firstName} ${invoice.doctor.lastName}`,

                title:
                  invoice.doctor.title,

                clinicName:
                  invoice.doctor.clinicName,
              }
            : null,

        appointment:
          invoice.appointment
            ? {
                id:
                  invoice.appointment._id,

                appointmentCode:
                  invoice.appointment.appointmentCode,

                startAt:
                  invoice.appointment.startAt,

                endAt:
                  invoice.appointment.endAt,

                status:
                  invoice.appointment.status,
              }
            : null,

        treatment:
          invoice.treatmentRecord
            ? {
                id:
                  invoice.treatmentRecord._id,

                visitDate:
                  invoice.treatmentRecord.visitDate,

                diagnosis:
                  invoice.treatmentRecord.diagnosis,

                treatmentPlan:
                  invoice.treatmentRecord.treatmentPlan,

                status:
                  invoice.treatmentRecord.status,

                nextVisitDate:
                  invoice.treatmentRecord.nextVisitDate,
              }
            : null,

        createdAt:
          invoice.createdAt,

        updatedAt:
          invoice.updatedAt,
      }),
    )
  }