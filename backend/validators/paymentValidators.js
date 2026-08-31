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


export const createPaytrPaymentSchema =
  z
    .object({
      invoiceId:
        objectIdSchema,

      address:
        z
          .string()
          .trim()
          .min(
            5,
            'Ödeme adresi en az 5 karakter olmalıdır.',
          )
          .max(
            400,
            'Ödeme adresi en fazla 400 karakter olabilir.',
          ),
    })
    .strict()