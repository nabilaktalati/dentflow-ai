import {
  z,
} from 'zod'


const objectIdSchema =
  z
    .string()
    .regex(
      /^[0-9a-fA-F]{24}$/,
      'Geçerli bir kayıt kimliği gereklidir.',
    )


export const createInvoiceSchema =
  z
    .object({
      treatmentRecordId:
        objectIdSchema,

      description:
        z
          .string()
          .trim()
          .min(
            3,
            'Fatura açıklaması en az 3 karakter olmalıdır.',
          )
          .max(
            1500,
            'Fatura açıklaması en fazla 1500 karakter olabilir.',
          ),

      amount:
        z
          .number()
          .positive(
            'Fatura tutarı 0’dan büyük olmalıdır.',
          )
          .max(
            1000000,
            'Fatura tutarı geçerli sınırı aşmaktadır.',
          ),

      dueDate:
        z
          .string()
          .datetime()
          .nullable()
          .optional(),
    })
    .strict()