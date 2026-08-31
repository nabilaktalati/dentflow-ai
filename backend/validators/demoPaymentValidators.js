import {
  z,
} from 'zod'


const objectIdSchema =
  z
    .string()
    .regex(
      /^[0-9a-fA-F]{24}$/,
      'Geçerli bir fatura kimliği gereklidir.',
    )


export const demoPaymentSchema =
  z
    .object({
      invoiceId:
        objectIdSchema,

      cardNumber:
        z
          .string()
          .trim()
          .min(
            19,
            'Kart numarası eksik.',
          )
          .max(
            19,
            'Kart numarası geçersiz.',
          ),

      expiry:
        z
          .string()
          .trim()
          .regex(
            /^(0[1-9]|1[0-2])\/\d{2}$/,
            'Son kullanma tarihi AA/YY formatında olmalıdır.',
          ),

      cvv:
        z
          .string()
          .trim()
          .regex(
            /^\d{3}$/,
            'CVV 3 haneli olmalıdır.',
          ),

      address:
        z
          .string()
          .trim()
          .min(
            5,
            'Fatura adresi en az 5 karakter olmalıdır.',
          )
          .max(
            400,
            'Fatura adresi en fazla 400 karakter olabilir.',
          ),
    })
    .strict()