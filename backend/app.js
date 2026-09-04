import path from 'path'
import {
  fileURLToPath,
} from 'url'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import contactRoutes from './routes/contact.routes.js'
import healthRoutes from './routes/healthRoutes.js'
import authRoutes from './routes/authRoutes.js'
import adminDoctorRoutes from './routes/adminDoctorRoutes.js'
import {
  errorHandler,
  notFound,
} from './middleware/errorMiddleware.js'
import doctorRoutes from './routes/doctorRoutes.js'
import doctorAvailabilityRoutes from './routes/doctorAvailabilityRoutes.js'
import appointmentRoutes from './routes/appointmentRoutes.js'
import treatmentRoutes from './routes/treatmentRoutes.js'
import invoiceRoutes from './routes/invoiceRoutes.js'
import patientRoutes from './routes/patientRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import aiAssistantRoutes from './routes/aiAssistantRoutes.js'
import adminAnalyticsRoutes from './routes/adminAnalyticsRoutes.js'
const __filename =
  fileURLToPath(import.meta.url)

const __dirname =
  path.dirname(__filename)
const app = express()

app.disable('x-powered-by')

app.use(helmet())

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
)

app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

app.use('/api/health', healthRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/auth', authRoutes)
app.use(
  '/api/doctors',
  doctorRoutes,
)
app.use(
  '/api/admin/doctors',
  adminDoctorRoutes,
)
app.use(
  '/api/admin/analytics',
  adminAnalyticsRoutes,
)
app.use(
  '/api/doctor/availability',
  doctorAvailabilityRoutes,
)
app.use('/api/appointments', appointmentRoutes)

app.use('/api/treatments', treatmentRoutes)
app.use('/api/invoices', invoiceRoutes)
app.use('/api/patient', patientRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/messages', messageRoutes)
app.use(
  '/api/notifications',
  notificationRoutes,
)
app.use(
  '/api/ai-assistant',
  aiAssistantRoutes,
)
if (
  process.env.NODE_ENV ===
  'production'
) {
  const frontendDistPath =
    path.resolve(
      __dirname,
      '../frontend/dist',
    )

  app.use(
    express.static(
      frontendDistPath,
    ),
  )

  app.use((req, res, next) => {
    if (
      req.method !== 'GET' ||
      req.path.startsWith('/api/')
    ) {
      return next()
    }

    return res.sendFile(
      path.join(
        frontendDistPath,
        'index.html',
      ),
    )
  })
}
app.use(notFound)
app.use(errorHandler)

export default app