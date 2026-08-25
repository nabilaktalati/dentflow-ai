import mongoose from 'mongoose'

const emailVerificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    codeHash: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    attempts: {
      type: Number,
      default: 0,
      min: 0,
    },

    maxAttempts: {
      type: Number,
      default: 5,
      min: 1,
    },

    lastSentAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

emailVerificationSchema.index(
  { user: 1 },
  {
    unique: true,
    name: 'unique_email_verification_per_user',
  },
)

emailVerificationSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
    name: 'email_verification_expiry',
  },
)

const EmailVerification = mongoose.model(
  'EmailVerification',
  emailVerificationSchema,
)

export default EmailVerification