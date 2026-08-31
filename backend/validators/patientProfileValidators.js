import {
  z,
} from 'zod'


export const updatePatientProfileSchema =
  z
    .object({
      address:
        z
          .string()
          .trim()
          .min(
            5,
            'Adres en az 5 karakter olmalıdır.',
          )
          .max(
            400,
            'Adres en fazla 400 karakter olabilir.',
          ),
    })
    .strict()