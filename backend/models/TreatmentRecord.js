import mongoose from 'mongoose'


const TREATMENT_STATUSES = [
  'PLANNED',
  'IN_PROGRESS',
  'COMPLETED',
]


const treatmentRecordSchema =
  new mongoose.Schema(
    {
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

      appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true,
        unique: true,
        index: true,
      },

      visitDate: {
        type: Date,
        required: true,
        index: true,
      },

      diagnosis: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000,
      },

      treatmentPlan: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1500,
      },

      doctorNotes: {
        type: String,
        trim: true,
        maxlength: 2000,
        default: '',
      },

      status: {
        type: String,
        enum: TREATMENT_STATUSES,
        default: 'IN_PROGRESS',
        required: true,
        index: true,
      },

      nextVisitDate: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: true,
      versionKey: false,
    },
  )


treatmentRecordSchema.index({
  patient: 1,
  visitDate: -1,
})

treatmentRecordSchema.index({
  doctor: 1,
  visitDate: -1,
})


const TreatmentRecord =
  mongoose.model(
    'TreatmentRecord',
    treatmentRecordSchema,
  )


export default TreatmentRecord