import {
  authorizeRoles,
} from '../middleware/authMiddleware.js'

const createResponse = () => {
  const response = {
    statusCode: 200,
    body: null,
  }

  response.status = (code) => {
    response.statusCode = code
    return response
  }

  response.json = (body) => {
    response.body = body
    return response
  }

  return response
}

const runMiddleware = ({
  role,
  allowedRoles,
}) => {
  const req = role
    ? {
        auth: {
          userId: 'test-user',
          role,
          sessionId: 'test-session',
        },
      }
    : {}

  const res = createResponse()

  let nextCalled = false

  const next = () => {
    nextCalled = true
  }

  authorizeRoles(
    ...allowedRoles,
  )(req, res, next)

  return {
    statusCode: res.statusCode,
    body: res.body,
    nextCalled,
  }
}

const assert = (
  condition,
  message,
) => {
  if (!condition) {
    throw new Error(
      `❌ ${message}`,
    )
  }

  console.log(
    `✅ ${message}`,
  )
}

console.log(
  '\n🔐 DAY 7 RBAC TESTLERİ\n',
)

// PATIENT → PATIENT
const patientAllowed =
  runMiddleware({
    role: 'PATIENT',
    allowedRoles: [
      'PATIENT',
    ],
  })

assert(
  patientAllowed.nextCalled,
  'PATIENT kendi yetki alanına erişebiliyor.',
)

// PATIENT → ADMIN
const patientToAdmin =
  runMiddleware({
    role: 'PATIENT',
    allowedRoles: [
      'ADMIN',
    ],
  })

assert(
  patientToAdmin.statusCode ===
    403 &&
    !patientToAdmin.nextCalled,
  'PATIENT, ADMIN alanına erişemiyor.',
)

// PATIENT → DOCTOR
const patientToDoctor =
  runMiddleware({
    role: 'PATIENT',
    allowedRoles: [
      'DOCTOR',
    ],
  })

assert(
  patientToDoctor.statusCode ===
    403 &&
    !patientToDoctor.nextCalled,
  'PATIENT, DOCTOR alanına erişemiyor.',
)

// DOCTOR → DOCTOR
const doctorAllowed =
  runMiddleware({
    role: 'DOCTOR',
    allowedRoles: [
      'DOCTOR',
    ],
  })

assert(
  doctorAllowed.nextCalled,
  'DOCTOR kendi yetki alanına erişebiliyor.',
)

// ADMIN → ADMIN
const adminAllowed =
  runMiddleware({
    role: 'ADMIN',
    allowedRoles: [
      'ADMIN',
    ],
  })

assert(
  adminAllowed.nextCalled,
  'ADMIN kendi yetki alanına erişebiliyor.',
)

// ADMIN + DOCTOR ortak alan
const doctorShared =
  runMiddleware({
    role: 'DOCTOR',
    allowedRoles: [
      'ADMIN',
      'DOCTOR',
    ],
  })

assert(
  doctorShared.nextCalled,
  'DOCTOR, ADMIN ve DOCTOR ortak alanına erişebiliyor.',
)

// Login olmadan erişim
const anonymous =
  runMiddleware({
    role: null,
    allowedRoles: [
      'PATIENT',
    ],
  })

assert(
  anonymous.statusCode ===
    401 &&
    !anonymous.nextCalled,
  'Giriş yapmamış kullanıcı korumalı alana erişemiyor.',
)

console.log(
  '\n🎉 DAY 7 RBAC TESTLERİ BAŞARILI\n',
)