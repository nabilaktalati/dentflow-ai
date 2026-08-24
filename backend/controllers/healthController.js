import mongoose from 'mongoose'

const databaseStates = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
}

export const getHealth = (req, res) => {
  const databaseState =
    databaseStates[mongoose.connection.readyState] || 'unknown'

  const isDatabaseConnected =
    mongoose.connection.readyState === 1

  const statusCode = isDatabaseConnected ? 200 : 503

  res.status(statusCode).json({
    success: isDatabaseConnected,
    message: isDatabaseConnected
      ? 'DentFlow AI API is running'
      : 'DentFlow AI API is degraded',
    data: {
      service: 'dentflow-api',
      status: isDatabaseConnected ? 'healthy' : 'degraded',
      database: databaseState,
      environment:
        process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
    },
  })
}