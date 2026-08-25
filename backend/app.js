import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import contactRoutes from './routes/contact.routes.js'
import healthRoutes from './routes/healthRoutes.js'
import authRoutes from './routes/authRoutes.js'

import {
  errorHandler,
  notFound,
} from './middleware/errorMiddleware.js'

const app = express()

app.disable('x-powered-by')

app.use(helmet())

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  }),
)

app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

app.use('/api/health', healthRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/auth', authRoutes)

app.use(notFound)
app.use(errorHandler)

export default app