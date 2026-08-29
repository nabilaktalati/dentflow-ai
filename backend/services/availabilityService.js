const timeToMinutes = (
  time,
) => {
  const [
    hours,
    minutes,
  ] = time
    .split(':')
    .map(Number)

  return (
    hours * 60 +
    minutes
  )
}


const minutesToTime = (
  totalMinutes,
) => {
  const hours =
    Math.floor(
      totalMinutes / 60,
    )

  const minutes =
    totalMinutes % 60

  return `${String(
    hours,
  ).padStart(
    2,
    '0',
  )}:${String(
    minutes,
  ).padStart(
    2,
    '0',
  )}`
}


const getDayOfWeek = (
  date,
) => {
  const [
    year,
    month,
    day,
  ] = date
    .split('-')
    .map(Number)

  return new Date(
    Date.UTC(
      year,
      month - 1,
      day,
    ),
  ).getUTCDay()
}


const generateSlotsFromPeriods = (
  periods,
  slotDurationMinutes,
) => {
  const slots = []

  periods.forEach(
    (period) => {
      const start =
        timeToMinutes(
          period.startTime,
        )

      const end =
        timeToMinutes(
          period.endTime,
        )

      for (
        let current = start;
        current +
          slotDurationMinutes <=
        end;
        current +=
          slotDurationMinutes
      ) {
        slots.push(
          minutesToTime(
            current,
          ),
        )
      }
    },
  )

  return slots
}


export const generateAvailabilitySlots =
  (
    availability,
    date,
  ) => {
    if (!availability) {
      return {
        date,
        available: false,
        source: 'NONE',
        periods: [],
        slots: [],
      }
    }


    // Önce özel gün kontrol edilir.
    const exception =
      availability.exceptions
        ?.find(
          (item) =>
            item.date === date,
        )


    if (exception) {
      if (
        !exception.available
      ) {
        return {
          date,
          available: false,
          source:
            'EXCEPTION_CLOSED',

          note:
            exception.note ||
            '',

          periods: [],
          slots: [],
        }
      }


      return {
        date,
        available: true,
        source:
          'EXCEPTION_CUSTOM',

        note:
          exception.note ||
          '',

        periods:
          exception.periods,

        slots:
          generateSlotsFromPeriods(
            exception.periods,
            availability
              .slotDurationMinutes,
          ),
      }
    }


    // Özel gün yoksa haftalık program kullanılır.
    const dayOfWeek =
      getDayOfWeek(date)


    const daySchedule =
      availability
        .weeklySchedule
        ?.find(
          (day) =>
            day.dayOfWeek ===
            dayOfWeek,
        )


    if (
      !daySchedule ||
      !daySchedule.enabled
    ) {
      return {
        date,
        available: false,
        source:
          'WEEKLY_CLOSED',

        periods: [],
        slots: [],
      }
    }


    return {
      date,
      available: true,
      source:
        'WEEKLY_SCHEDULE',

      periods:
        daySchedule.periods,

      slots:
        generateSlotsFromPeriods(
          daySchedule.periods,
          availability
            .slotDurationMinutes,
        ),
    }
  }