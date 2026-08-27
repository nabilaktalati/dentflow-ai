import mongoose from 'mongoose'

import Session from '../models/Session.js'

import {
  hashRefreshToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from './tokenService.js'

export const createSession = async ({
  userId,
  role,
  userAgent = '',
  ipAddress = '',
}) => {
  const sessionId =
    new mongoose.Types.ObjectId()

  const sessionIdString =
    sessionId.toString()

  const accessToken =
    signAccessToken({
      userId: userId.toString(),
      role,
      sessionId: sessionIdString,
    })

  const refreshToken =
    signRefreshToken({
      userId: userId.toString(),
      sessionId: sessionIdString,
    })

  const refreshPayload =
    verifyRefreshToken(refreshToken)

  const expiresAt = new Date(
    refreshPayload.exp * 1000,
  )

  await Session.create({
    _id: sessionId,
    user: userId,
    refreshTokenHash:
      hashRefreshToken(refreshToken),
    expiresAt,
    userAgent,
    ipAddress,
    lastUsedAt: new Date(),
  })

  return {
    sessionId: sessionIdString,
    accessToken,
    refreshToken,
    expiresAt,
  }
}

export const getValidSession = async ({
  sessionId,
  userId,
  refreshToken,
}) => {
  const session =
    await Session.findOne({
      _id: sessionId,
      user: userId,
    })

  if (!session) {
    return null
  }

  if (session.revokedAt) {
    return null
  }

  if (
    session.expiresAt.getTime() <=
    Date.now()
  ) {
    return null
  }

  const incomingHash =
    hashRefreshToken(refreshToken)

  if (
    incomingHash !==
    session.refreshTokenHash
  ) {
    return null
  }

  return session
}
export const touchSession = async (
  sessionId,
) => {
  await Session.updateOne(
    {
      _id: sessionId,
      revokedAt: null,
    },
    {
      $set: {
        lastUsedAt: new Date(),
      },
    },
  )
}

export const revokeSession = async (
  sessionId,
) => {
  await Session.updateOne(
    {
      _id: sessionId,
      revokedAt: null,
    },
    {
      $set: {
        revokedAt: new Date(),
      },
    },
  )
}

export const revokeAllUserSessions =
  async (userId) => {
    await Session.updateMany(
      {
        user: userId,
        revokedAt: null,
      },
      {
        $set: {
          revokedAt: new Date(),
        },
      },
    )
  }
  export const rotateSessionTokens = async ({
  session,
  userId,
  role,
}) => {
  const sessionId =
    session._id.toString()

  const accessToken =
    signAccessToken({
      userId: userId.toString(),
      role,
      sessionId,
    })

  const refreshToken =
    signRefreshToken({
      userId: userId.toString(),
      sessionId,
    })

  const refreshPayload =
    verifyRefreshToken(refreshToken)

  session.refreshTokenHash =
    hashRefreshToken(refreshToken)

  session.expiresAt =
    new Date(
      refreshPayload.exp * 1000,
    )

  session.lastUsedAt =
    new Date()

  await session.save()

  return {
    accessToken,
    refreshToken,
    expiresAt: session.expiresAt,
  }
}