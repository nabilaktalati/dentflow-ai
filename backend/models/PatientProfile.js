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
      maxlength: 25,
      default: '',
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

const PatientProfile = mongoose.model(
  'PatientProfile',
  patientProfileSchema,
)

export default PatientProfile