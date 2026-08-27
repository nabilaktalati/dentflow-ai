import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    refreshTokenHash: {
      type: String,
      required: true,
      unique: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      
    },

    revokedAt: {
      type: Date,
      default: null,
    },

    lastUsedAt: {
      type: Date,
      default: Date.now,
    },

    userAgent: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },

    ipAddress: {
      type: String,
      trim: true,
      maxlength: 100,
      default: '',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

sessionSchema.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSeconds: 0,
  },
)

sessionSchema.index({
  user: 1,
  revokedAt: 1,
})

const Session = mongoose.model(
  'Session',
  sessionSchema,
)

export default Session