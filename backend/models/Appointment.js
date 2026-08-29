import crypto from 'crypto'
import mongoose from 'mongoose'

import {
  APPOINTMENT_STATUSES,
  APPOINTMENT_STATUS_VALUES,
} from '../constants/appointment.js'

const generateAppointmentCode = () => {
  const randomPart = crypto
    .randomBytes(4)
    .toString('hex')
    .toUpperCase()

  return `DF-${randomPart}`
}

const appointmentSchema = new mongoose.Schema(
  {
    appointmentCode: {
      type: String,
      required: true,
      unique: true,
      default: generateAppointmentCode,
      uppercase: true,
      trim: true,
      index: true,
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PatientProfile',
      required: true,
      index: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DoctorProfile',
      required: true,
      index: true,
    },

    startAt: {
      type: Date,
      required: true,
      index: true,
    },

    endAt: {
      type: Date,
      required: true,
    },
slotKey: {
  type: String,
  default: null,
},
    patientNote: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },

    status: {
      type: String,
      enum: APPOINTMENT_STATUS_VALUES,
      default: APPOINTMENT_STATUSES.PENDING,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

appointmentSchema.pre('validate', function () {
  if (
    this.startAt &&
    this.endAt &&
    this.endAt <= this.startAt
  ) {
    this.invalidate(
      'endAt',
      'Randevu bitiş zamanı başlangıç zamanından sonra olmalıdır.',
    )
  }
})

appointmentSchema.index({
  doctor: 1,
  startAt: 1,
  status: 1,
})

appointmentSchema.index({
  patient: 1,
  startAt: -1,
})

appointmentSchema.index({
  doctor: 1,
  startAt: -1,
})
appointmentSchema.index(
  {
    slotKey: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      slotKey: {
        $type: 'string',
      },
    },
  },
)
const Appointment = mongoose.model(
  'Appointment',
  appointmentSchema,
)

export default Appointment