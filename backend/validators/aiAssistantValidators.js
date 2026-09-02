import { z } from 'zod'

import {
  AI_ASSISTANT_ACTION_VALUES,
} from '../constants/aiAssistantActions.js'

const aiAssistantHistoryItemSchema =
  z
    .object({
      role: z.enum([
        'user',
        'assistant',
      ]),

      content: z
        .string()
        .trim()
        .min(1)
        .max(2000),
    })
    .strict()

export const aiAssistantMessageSchema =
  z
    .object({
      message: z
        .string()
        .trim()
        .min(
          1,
          'Mesaj boş bırakılamaz.',
        )
        .max(
          1200,
          'Mesaj en fazla 1200 karakter olabilir.',
        ),

      history: z
        .array(
          aiAssistantHistoryItemSchema,
        )
        .max(
          12,
          'Konuşma geçmişi çok uzun.',
        )
        .default([]),
    })
    .strict()

export const aiAssistantIntentSchema =
  z
    .object({
      action: z.enum(
        AI_ASSISTANT_ACTION_VALUES,
      ),

      reply: z
        .string()
        .trim()
        .min(1)
        .max(2000),

      parameters: z
        .record(
          z.string(),
          z.unknown(),
        )
        .default({}),

      missingFields: z
        .array(z.string())
        .default([]),

      requiresConfirmation:
        z.boolean().default(false),
    })
    .strict()

    export const aiAppointmentConfirmationSchema =
  z
    .object({
      doctorProfileId: z
        .string()
        .trim()
        .regex(
          /^[a-f\d]{24}$/i,
          'Doktor bilgisi geçerli değil.',
        ),

      date: z
        .string()
        .trim()
        .regex(
          /^\d{4}-\d{2}-\d{2}$/,
          'Randevu tarihi geçerli değil.',
        ),

      time: z
        .string()
        .trim()
        .regex(
          /^\d{2}:\d{2}$/,
          'Randevu saati geçerli değil.',
        ),
    })
    .strict()