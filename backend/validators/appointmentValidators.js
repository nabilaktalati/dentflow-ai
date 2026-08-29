import { z } from 'zod'


const mongoIdRegex =
  /^[a-fA-F0-9]{24}$/

const dateRegex =
  /^\d{4}-\d{2}-\d{2}$/

const timeRegex =
  /^([01]\d|2[0-3]):[0-5]\d$/


const isRealDate = (value) => {
  if (!dateRegex.test(value)) {
    return false
  }

  const [
    year,
    month,
    day,
  ] = value
    .split('-')
    .map(Number)

  const date =
    new Date(
      Date.UTC(
        year,
        month - 1,
        day,
      ),
    )

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() ===
      month - 1 &&
    date.getUTCDate() === day
  )
}


export const createAppointmentSchema =
  z
    .object({
      doctorId: z
        .string()
        .trim()
        .regex(
          mongoIdRegex,
          'Geçerli bir doktor kimliği gereklidir.',
        ),

      date: z
        .string()
        .trim()
        .refine(
          isRealDate,
          'Geçerli bir tarih giriniz.',
        ),

      startTime: z
        .string()
        .trim()
        .regex(
          timeRegex,
          'Saat HH:mm formatında olmalıdır.',
        ),

      patientNote: z
        .string()
        .trim()
        .max(
          500,
          'Hasta notu en fazla 500 karakter olabilir.',
        )
        .optional()
        .default(''),
    })
    .strict()