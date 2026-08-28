import { z } from 'zod'


const educationSchema = z.object({
  institution: z
    .string()
    .trim()
    .min(2, 'Kurum adı en az 2 karakter olmalıdır.')
    .max(120, 'Kurum adı en fazla 120 karakter olabilir.'),

  degree: z
    .string()
    .trim()
    .max(120, 'Derece bilgisi en fazla 120 karakter olabilir.')
    .optional()
    .default(''),

  graduationYear: z
    .number()
    .int()
    .min(1950)
    .max(2100)
    .nullable()
    .optional()
    .default(null),
})


export const createDoctorSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'Ad en az 2 karakter olmalıdır.')
    .max(60, 'Ad en fazla 60 karakter olabilir.'),

  lastName: z
    .string()
    .trim()
    .min(2, 'Soyad en az 2 karakter olmalıdır.')
    .max(60, 'Soyad en fazla 60 karakter olabilir.'),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Geçerli bir e-posta adresi giriniz.')
    .max(160),

  title: z
    .string()
    .trim()
    .max(80)
    .optional()
    .default('Diş Hekimi'),

  bio: z
    .string()
    .trim()
    .max(600)
    .optional()
    .default(''),

  education: z
    .array(educationSchema)
    .max(10)
    .optional()
    .default([]),

  experienceYears: z
    .number()
    .int()
    .min(0)
    .max(70)
    .optional()
    .default(0),

  clinicName: z
    .string()
    .trim()
    .max(120)
    .optional()
    .default('DentFlow Dental Clinic'),

  location: z
    .string()
    .trim()
    .max(120)
    .optional()
    .default(''),

  profileImageUrl: z
    .string()
    .trim()
    .optional()
    .default(''),

  displayOrder: z
    .number()
    .int()
    .min(0)
    .optional()
    .default(0),
})
export const updateDoctorProfileSchema =
  z.object({
    firstName: z
      .string()
      .trim()
      .min(
        2,
        'Ad en az 2 karakter olmalıdır.',
      )
      .max(60)
      .optional(),

    lastName: z
      .string()
      .trim()
      .min(
        2,
        'Soyad en az 2 karakter olmalıdır.',
      )
      .max(60)
      .optional(),

    title: z
      .string()
      .trim()
      .max(80)
      .optional(),

    bio: z
      .string()
      .trim()
      .max(600)
      .optional(),

    experienceYears: z
      .number()
      .int()
      .min(0)
      .max(70)
      .optional(),

    clinicName: z
      .string()
      .trim()
      .max(120)
      .optional(),

    location: z
      .string()
      .trim()
      .max(120)
      .optional(),

    education: z
      .array(
        educationSchema,
      )
      .max(10)
      .optional(),

    displayOrder: z
      .number()
      .int()
      .min(0)
      .optional(),
  })