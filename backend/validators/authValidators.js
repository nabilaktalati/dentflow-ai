import { z } from 'zod'

const emailSchema = z
  .string()
  .trim()
  .min(1, 'E-posta adresi zorunludur.')
  .max(160, 'E-posta adresi çok uzun.')
  .email('Geçerli bir e-posta adresi giriniz.')
  .transform((value) => value.toLowerCase())

const passwordSchema = z
  .string()
  .min(8, 'Şifre en az 8 karakter olmalıdır.')
  .max(72, 'Şifre en fazla 72 karakter olabilir.')
  .regex(/[a-z]/, 'Şifre en az bir küçük harf içermelidir.')
  .regex(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir.')
  .regex(/[0-9]/, 'Şifre en az bir rakam içermelidir.')

export const registerSchema = z.object({
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

  email: emailSchema,

phone: z
  .string()
  .trim()
  .min(1, 'Telefon numarası zorunludur.')
  .max(30, 'Telefon numarası çok uzun.'),

  password: passwordSchema,
})

export const verifyEmailSchema = z.object({
  email: emailSchema,

  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Doğrulama kodu 6 haneli olmalıdır.'),
})

export const resendVerificationSchema = z.object({
  email: emailSchema,
})