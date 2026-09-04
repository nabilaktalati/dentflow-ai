# DentFlow AI — Project Context

## Project
DentFlow AI is an AI-powered full-stack dental clinic management platform developed as a 20-working-day internship project.

## Technology Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- motion/react
- lucide-react
- Recharts
- @react-pdf/renderer

### Backend
- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Zod
- JWT Access / Refresh Tokens
- HttpOnly Cookies
- Session Management
- Role-Based Access Control

## User Roles
- PATIENT
- DOCTOR
- ADMIN

## Main Features
- Patient registration with email OTP verification
- Secure login/logout
- Role-based protected routes
- Appointment management
- Treatment records
- Invoice management
- PDF invoice and treatment reports
- Test payment workflow
- Internal messaging
- Notifications
- AI Assistant
- AI-assisted appointment actions
- Admin analytics dashboard
- Patient dashboard with live statistics
- Doctor dashboard

## Security
- Password hashing
- JWT access and refresh tokens
- Refresh token rotation
- HttpOnly cookies
- Session validation
- RBAC authorization
- Backend input validation
- Protected API routes
- Helmet security headers

## Production

Live application:
https://dentflow-ai.onrender.com

Health endpoint:
https://dentflow-ai.onrender.com/api/health

GitHub:
https://github.com/nabilaktalati/dentflow-ai

Deployment:
- Render Web Service
- MongoDB Atlas
- Brevo transactional email API

## Email Verification
Production OTP emails are sent through the Brevo HTTPS API.

SMTP is not used for production email delivery.

Environment variables and API keys must never be committed to Git.

## Frontend API Strategy
Production uses same-origin API routes:

/api/...

The frontend API fallback must remain:

const API_BASE_URL =
  import.meta.env.VITE_API_URL || ''

Do not restore localhost:5000 as the production fallback.

## Important Project Rules
- UI language is Turkish.
- Do not use fake statistics or fake dashboard data.
- Keep real MongoDB-backed data.
- Do not expose secrets or environment variables.
- Do not remove existing working features.
- Test changes with lint and build.
- Stage only relevant Git files.
- Do not use `git add .`.

## Completed Internship Days
- Day 13 — Treatment Records
- Day 14 — Billing, Invoice PDF and Payment
- Day 15 — Messaging and Notifications
- Day 16 — AI Assistant and Action Agent
- Day 17 — Admin Analytics
- Day 18 — Security and Full QA
- Day 19 — Final Polish and Deployment
- Day 20 — Documentation and Final Delivery

## Final Documentation
README screenshots:
- docs/screenshots/home.png
- docs/screenshots/admin-dashboard.png
- docs/screenshots/patient-dashboard.png
- docs/screenshots/ai-assistant.png

## Remaining Final Tasks
- Final Git cleanup/check
- Day 20 internship notebook entry
- Final presentation
- Demo script