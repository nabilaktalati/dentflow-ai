import mongoose from 'mongoose'


const timeRegex =
  /^([01]\d|2[0-3]):[0-5]\d$/


const periodSchema =
  new mongoose.Schema(
    {
      startTime: {
        type: String,
        required: true,
        match: timeRegex,
      },

      endTime: {
        type: String,
        required: true,
        match: timeRegex,
      },
    },
    {
      _id: false,
    },
  )


const dayScheduleSchema =
  new mongoose.Schema(
    {
      dayOfWeek: {
        type: Number,
        required: true,
        min: 0,
        max: 6,
      },

      enabled: {
        type: Boolean,
        default: false,
      },

      periods: {
        type: [periodSchema],
        default: [],
      },
    },
    {
      _id: false,
    },
  )


const exceptionSchema =
  new mongoose.Schema(
    {
      date: {
        type: String,
        required: true,
        match:
          /^\d{4}-\d{2}-\d{2}$/,
      },

      available: {
        type: Boolean,
        default: false,
      },

      periods: {
        type: [periodSchema],
        default: [],
      },

      note: {
        type: String,
        trim: true,
        maxlength: 200,
        default: '',
      },
    },
    {
      _id: false,
    },
  )


const doctorAvailabilitySchema =
  new mongoose.Schema(
    {
      doctor: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: 'User',

        required: true,
        unique: true,
        index: true,
      },

      timezone: {
        type: String,
        default:
          'Europe/Istanbul',
      },

      slotDurationMinutes: {
        type: Number,

        enum: [
          15,
          20,
          30,
          45,
          60,
        ],

        default: 30,
      },

      weeklySchedule: {
        type: [
          dayScheduleSchema,
        ],

        default: [],
      },

      exceptions: {
        type: [
          exceptionSchema,
        ],

        default: [],
      },
    },
    {
      timestamps: true,
    },
  )


const DoctorAvailability =
  mongoose.model(
    'DoctorAvailability',
    doctorAvailabilitySchema,
  )


export default DoctorAvailability