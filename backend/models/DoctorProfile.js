import mongoose from 'mongoose'

const educationSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    degree: {
      type: String,
      trim: true,
      maxlength: 120,
      default: '',
    },

    graduationYear: {
      type: Number,
      min: 1950,
      max: 2100,
      default: null,
    },
  },
  {
    _id: false,
  },
)

const doctorProfileSchema = new mongoose.Schema(
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

    title: {
      type: String,
      default: 'Diş Hekimi',
      trim: true,
      maxlength: 80,
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 600,
      default: '',
    },

    education: {
      type: [educationSchema],
      default: [],
    },

    experienceYears: {
      type: Number,
      min: 0,
      max: 70,
      default: 0,
    },

    clinicName: {
      type: String,
      trim: true,
      maxlength: 120,
      default: 'DentFlow Dental Clinic',
    },

    location: {
      type: String,
      trim: true,
      maxlength: 120,
      default: '',
    },

    profileImageUrl: {
      type: String,
      trim: true,
      default: '',
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    displayOrder: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

doctorProfileSchema.index({
  isActive: 1,
  displayOrder: 1,
})

const DoctorProfile = mongoose.model(
  'DoctorProfile',
  doctorProfileSchema,
)

export default DoctorProfile