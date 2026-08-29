import { z } from 'zod'


const timeSchema =
  z.string().regex(
    /^([01]\d|2[0-3]):[0-5]\d$/,
    'Saat HH:mm formatında olmalıdır.',
  )


const periodSchema =
  z
    .object({
      startTime:
        timeSchema,

      endTime:
        timeSchema,
    })
    .superRefine(
      (period, ctx) => {
        if (
          period.startTime >=
          period.endTime
        ) {
          ctx.addIssue({
            code:
              z.ZodIssueCode
                .custom,

            path: [
              'endTime',
            ],

            message:
              'Bitiş saati başlangıç saatinden sonra olmalıdır.',
          })
        }
      },
    )


const validatePeriods =
  (
    periods,
    ctx,
    path,
  ) => {
    const sortedPeriods = [
      ...periods,
    ].sort((first, second) =>
      first.startTime.localeCompare(
        second.startTime,
      ),
    )

    for (
      let index = 1;
      index <
      sortedPeriods.length;
      index += 1
    ) {
      const previous =
        sortedPeriods[
          index - 1
        ]

      const current =
        sortedPeriods[index]

      if (
        current.startTime <
        previous.endTime
      ) {
        ctx.addIssue({
          code:
            z.ZodIssueCode.custom,

          path,

          message:
            'Çalışma saatleri birbiriyle çakışamaz.',
        })

        return
      }
    }
  }


const dayScheduleSchema =
  z
    .object({
      dayOfWeek: z
        .number()
        .int()
        .min(0)
        .max(6),

      enabled:
        z.boolean(),

      periods: z
        .array(
          periodSchema,
        )
        .max(5),
    })
    .superRefine(
      (
        schedule,
        ctx,
      ) => {
        if (
          schedule.enabled &&
          schedule.periods
            .length === 0
        ) {
          ctx.addIssue({
            code:
              z.ZodIssueCode
                .custom,

            path: [
              'periods',
            ],

            message:
              'Aktif bir gün için en az bir çalışma aralığı eklenmelidir.',
          })
        }

        if (
          !schedule.enabled &&
          schedule.periods
            .length > 0
        ) {
          ctx.addIssue({
            code:
              z.ZodIssueCode
                .custom,

            path: [
              'periods',
            ],

            message:
              'Kapalı günlerde çalışma aralığı bulunamaz.',
          })
        }

        validatePeriods(
          schedule.periods,
          ctx,
          [
            'periods',
          ],
        )
      },
    )


const exceptionSchema =
  z
    .object({
      date: z
        .string()
        .regex(
          /^\d{4}-\d{2}-\d{2}$/,
          'Tarih YYYY-MM-DD formatında olmalıdır.',
        ),

      available:
        z.boolean(),

      periods: z
        .array(
          periodSchema,
        )
        .max(5)
        .default([]),

      note: z
        .string()
        .trim()
        .max(
          200,
          'Not en fazla 200 karakter olabilir.',
        )
        .default(''),
    })
    .superRefine(
      (
        exception,
        ctx,
      ) => {
        if (
          exception.available &&
          exception.periods
            .length === 0
        ) {
          ctx.addIssue({
            code:
              z.ZodIssueCode
                .custom,

            path: [
              'periods',
            ],

            message:
              'Müsait olarak işaretlenen özel gün için çalışma saati eklenmelidir.',
          })
        }

        if (
          !exception.available &&
          exception.periods
            .length > 0
        ) {
          ctx.addIssue({
            code:
              z.ZodIssueCode
                .custom,

            path: [
              'periods',
            ],

            message:
              'Kapalı özel gün için çalışma saati eklenemez.',
          })
        }

        validatePeriods(
          exception.periods,
          ctx,
          [
            'periods',
          ],
        )
      },
    )


export const updateAvailabilitySchema =
  z
    .object({
      timezone: z
        .string()
        .trim()
        .min(1)
        .default(
          'Europe/Istanbul',
        ),

      slotDurationMinutes:
        z.union([
          z.literal(15),
          z.literal(20),
          z.literal(30),
          z.literal(45),
          z.literal(60),
        ]),

      weeklySchedule: z
        .array(
          dayScheduleSchema,
        )
        .max(7),

      exceptions: z
        .array(
          exceptionSchema,
        )
        .max(100)
        .default([]),
    })
    .superRefine(
      (
        availability,
        ctx,
      ) => {
        const days =
          availability
            .weeklySchedule
            .map(
              (day) =>
                day.dayOfWeek,
            )

        if (
          new Set(days)
            .size !==
          days.length
        ) {
          ctx.addIssue({
            code:
              z.ZodIssueCode
                .custom,

            path: [
              'weeklySchedule',
            ],

            message:
              'Aynı haftanın günü birden fazla kez eklenemez.',
          })
        }


        const dates =
          availability
            .exceptions
            .map(
              (exception) =>
                exception.date,
            )

        if (
          new Set(dates)
            .size !==
          dates.length
        ) {
          ctx.addIssue({
            code:
              z.ZodIssueCode
                .custom,

            path: [
              'exceptions',
            ],

            message:
              'Aynı tarih için birden fazla özel gün tanımlanamaz.',
          })
        }
      },
    )