import { z } from 'zod'

export const contactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Ad soyad en az 2 karakter olmalıdır.')
    .max(80, 'Ad soyad çok uzun.'),

  email: z
    .string()
    .trim()
    .email('Geçerli bir e-posta adresi girin.')
    .max(120),

  phone: z
    .string()
    .trim()
    .max(25)
    .optional()
    .default(''),

  subject: z
    .string()
    .trim()
    .min(3, 'Konu en az 3 karakter olmalıdır.')
    .max(120),

  message: z
    .string()
    .trim()
    .min(10, 'Mesaj en az 10 karakter olmalıdır.')
    .max(1000, 'Mesaj en fazla 1000 karakter olabilir.'),
})