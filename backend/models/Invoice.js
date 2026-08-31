import mongoose from 'mongoose'


export const INVOICE_STATUSES = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED',
}


const invoiceSchema =
  new mongoose.Schema(
    {
      invoiceNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true,
        index: true,
      },

      patient: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: 'PatientProfile',
        required: true,
        index: true,
      },

      doctor: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: 'DoctorProfile',
        required: true,
        index: true,
      },

      appointment: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: 'Appointment',
        required: true,
        index: true,
      },

      treatmentRecord: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: 'TreatmentRecord',
        required: true,
        index: true,
      },

      description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1500,
      },

      amount: {
        type: Number,
        required: true,
        min: 0,
      },

      currency: {
        type: String,
        default: 'TRY',
        enum: [
          'TRY',
        ],
      },

      status: {
        type: String,
        enum:
          Object.values(
            INVOICE_STATUSES,
          ),
        default:
          INVOICE_STATUSES.PENDING,
        index: true,
      },

      issuedAt: {
        type: Date,
        default: Date.now,
      },

      dueDate: {
        type: Date,
        default: null,
      },

      paidAt: {
        type: Date,
        default: null,
      },

      cancelledAt: {
        type: Date,
        default: null,
      },

      paymentReference: {
        type: String,
        trim: true,
        default: '',
        maxlength: 250,
      },

      automationStatus: {
        type: String,
        enum: [
          'NOT_SENT',
          'QUEUED',
          'PROCESSED',
          'FAILED',
        ],
        default: 'NOT_SENT',
      },
    },
    {
      timestamps: true,
    },
  )


invoiceSchema.index({
  patient: 1,
  issuedAt: -1,
})

invoiceSchema.index({
  doctor: 1,
  issuedAt: -1,
})

invoiceSchema.index({
  treatmentRecord: 1,
})


const Invoice =
  mongoose.model(
    'Invoice',
    invoiceSchema,
  )


export default Invoice