import { z } from 'zod'

const objectIdRegex =
  /^[0-9a-fA-F]{24}$/

export const sendMessageSchema =
  z
    .object({
      recipientId: z
        .string()
        .regex(
          objectIdRegex,
          'Geçersiz alıcı kimliği.',
        ),

      content: z
        .string()
        .trim()
        .min(
          1,
          'Mesaj boş bırakılamaz.',
        )
        .max(
          2000,
          'Mesaj en fazla 2000 karakter olabilir.',
        ),
    })
    .strict()