import mongoose from 'mongoose'

const NOTIFICATION_TYPES = [
  'MESSAGE',
  'APPOINTMENT',
  'INVOICE',
  'PAYMENT',
  'SYSTEM',
]

const notificationSchema =
  new mongoose.Schema(
    {
      recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
      },

      type: {
        type: String,
        enum: NOTIFICATION_TYPES,
        required: true,
        index: true,
      },

      title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 120,
      },

      message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
      },

      actionPath: {
        type: String,
        trim: true,
        maxlength: 250,
        default: null,
      },

      isRead: {
        type: Boolean,
        default: false,
        index: true,
      },

      readAt: {
        type: Date,
        default: null,
      },

      relatedEntityId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
    },
    {
      timestamps: true,
      versionKey: false,
    },
  )

notificationSchema.index({
  recipient: 1,
  isRead: 1,
  createdAt: -1,
})

notificationSchema.index({
  recipient: 1,
  createdAt: -1,
})

const Notification =
  mongoose.models.Notification ||
  mongoose.model(
    'Notification',
    notificationSchema,
  )

export default Notification