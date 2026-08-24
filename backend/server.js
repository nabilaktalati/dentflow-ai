import 'dotenv/config'

import app from './app.js'
import {
  connectDB,
  disconnectDB,
} from './config/db.js'

const PORT = process.env.PORT || 5000

let server
let isShuttingDown = false

const startServer = async () => {
  try {
    await connectDB()

    server = app.listen(PORT, () => {
      console.log(
        `DentFlow AI API running on http://localhost:${PORT}`,
      )
    })
  } catch (error) {
    console.error(
      'Failed to start DentFlow AI API:',
      error.message,
    )

    process.exit(1)
  }
}

const shutdown = async (signal) => {
  if (isShuttingDown) return

  isShuttingDown = true

  console.log(
    `${signal} received. Shutting down gracefully...`,
  )

  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error)
            return
          }

          console.log('HTTP server closed.')
          resolve()
        })
      })
    }

    await disconnectDB()

    console.log('Shutdown completed.')
    process.exit(0)
  } catch (error) {
    console.error(
      'Error during shutdown:',
      error.message,
    )

    process.exit(1)
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

startServer()