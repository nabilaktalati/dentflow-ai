import 'dotenv/config'
import app from './app.js'

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(`DentFlow AI API running on http://localhost:${PORT}`)
})

const shutdown = (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`)

  server.close(() => {
    console.log('HTTP server closed.')
    process.exit(0)
  })
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))