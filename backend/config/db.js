import mongoose from 'mongoose'

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined')
  }

  const connection = await mongoose.connect(mongoUri)

  console.log(
    `MongoDB connected: ${connection.connection.host}`,
  )

  return connection
}

export const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
    console.log('MongoDB disconnected.')
  }
}