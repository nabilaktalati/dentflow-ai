import mongoose from 'mongoose'

import {
  USER_ROLES,
  USER_ROLE_VALUES,
} from '../constants/roles.js'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 160,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: USER_ROLE_VALUES,
      default: USER_ROLES.PATIENT,
      required: true,
      index: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    status: {
      type: String,
      enum: ['ACTIVE', 'PENDING', 'SUSPENDED'],
      default: 'PENDING',
      index: true,
    },

   lastLoginAt: {
  type: Date,
  default: null,
},

mustChangePassword: {
  type: Boolean,
  default: false,
},
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

userSchema.index(
  { email: 1 },
  {
    unique: true,
    name: 'unique_user_email',
  },
)

const User = mongoose.model('User', userSchema)

export default User