import { z } from 'zod'


const mongoIdRegex =
  /^[a-fA-F0-9]{24}$/


export const createTreatmentRecordSchema =
  z
    .object({
      appointmentId: z
        .string()
        .trim()
        .regex(
          mongoIdRegex,
          'Geçerli bir randevu kimliği gereklidir.',
        ),

      diagnosis: z
        .string()
        .trim()
        .min(
          3,
          'Teşhis en az 3 karakter olmalıdır.',
        )
        .max(
          1000,
          'Teşhis en fazla 1000 karakter olabilir.',
        ),

      treatmentPlan: z
        .string()
        .trim()
        .min(
          3,
          'Tedavi planı en az 3 karakter olmalıdır.',
        )
        .max(
          1500,
          'Tedavi planı en fazla 1500 karakter olabilir.',
        ),

      doctorNotes: z
        .string()
        .trim()
        .max(
          2000,
          'Doktor notu en fazla 2000 karakter olabilir.',
        )
        .optional()
        .default(''),

      status: z
        .enum([
          'PLANNED',
          'IN_PROGRESS',
          'COMPLETED',
        ])
        .optional()
        .default(
          'IN_PROGRESS',
        ),

      nextVisitDate: z
        .string()
        .datetime({
          offset: true,
        })
        .nullable()
        .optional()
        .default(null),
    })
    .strict()