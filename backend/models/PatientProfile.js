import mongoose from 'mongoose'

const patientProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 60,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 60,
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 20,
      default: null,
    },
address: {
  type: String,
  trim: true,
  maxlength: 400,
  default: null,
},
    dateOfBirth: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

/*
 * Aynı telefon numarası birden fazla hasta hesabında
 * kullanılamaz.
 *
 * null veya boş telefon kayıtları unique index'e
 * dahil edilmez.
 */
patientProfileSchema.index(
  { phone: 1 },
  {
    unique: true,
    partialFilterExpression: {
      phone: {
        $type: 'string',
        $gt: '',
      },
    },
    name: 'unique_patient_phone',
  },
)

const PatientProfile = mongoose.model(
  'PatientProfile',
  patientProfileSchema,
)

export default PatientProfile