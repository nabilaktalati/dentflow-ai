import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plus,
  Save,
  Trash2,
} from 'lucide-react'

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  getMyAvailability,
  updateMyAvailability,
} from '../api/doctorAvailabilityApi.js'


const dayNames = {
  0: 'Pazar',
  1: 'Pazartesi',
  2: 'Salı',
  3: 'Çarşamba',
  4: 'Perşembe',
  5: 'Cuma',
  6: 'Cumartesi',
}

const displayDayOrder = [
  1,
  2,
  3,
  4,
  5,
  6,
  0,
]

const slotOptions = [
  15,
  20,
  30,
  45,
  60,
]


const createEmptyWeek = () =>
  Array.from(
    {
      length: 7,
    },
    (
      _,
      dayOfWeek,
    ) => ({
      dayOfWeek,
      enabled: false,
      periods: [],
    }),
  )


const normalizeWeek = (
  weeklySchedule = [],
) => {
  const byDay =
    new Map(
      weeklySchedule.map(
        (day) => [
          day.dayOfWeek,
          {
            dayOfWeek:
              day.dayOfWeek,
            enabled:
              Boolean(
                day.enabled,
              ),
            periods:
              Array.isArray(
                day.periods,
              )
                ? day.periods.map(
                    (
                      period,
                    ) => ({
                      startTime:
                        period.startTime ||
                        '',
                      endTime:
                        period.endTime ||
                        '',
                    }),
                  )
                : [],
          },
        ],
      ),
    )

  return createEmptyWeek().map(
    (day) =>
      byDay.get(
        day.dayOfWeek,
      ) || day,
  )
}


const timeToMinutes = (
  value,
) => {
  if (
    !value ||
    !value.includes(':')
  ) {
    return 0
  }

  const [
    hours,
    minutes,
  ] = value
    .split(':')
    .map(Number)

  return (
    hours * 60 +
    minutes
  )
}


const getDayValidationError = (
  day,
) => {
  if (!day.enabled) {
    return ''
  }

  if (
    day.periods.length ===
    0
  ) {
    return 'Açık gün için en az bir çalışma aralığı ekleyin.'
  }

  const sortedPeriods = [
    ...day.periods,
  ].sort(
    (
      firstPeriod,
      secondPeriod,
    ) =>
      firstPeriod.startTime.localeCompare(
        secondPeriod.startTime,
      ),
  )

  for (
    let index = 0;
    index <
    sortedPeriods.length;
    index += 1
  ) {
    const period =
      sortedPeriods[index]

    if (
      !period.startTime ||
      !period.endTime
    ) {
      return 'Başlangıç ve bitiş saatlerini doldurun.'
    }

    if (
      period.startTime >=
      period.endTime
    ) {
      return 'Bitiş saati başlangıç saatinden sonra olmalıdır.'
    }

    if (index > 0) {
      const previousPeriod =
        sortedPeriods[
          index - 1
        ]

      if (
        period.startTime <
        previousPeriod.endTime
      ) {
        return 'Çalışma saatleri birbiriyle çakışamaz.'
      }
    }
  }

  return ''
}


export default function DoctorSchedulePanel() {
  const [
    availability,
    setAvailability,
  ] = useState(null)

  const [
    weeklySchedule,
    setWeeklySchedule,
  ] = useState(
    createEmptyWeek(),
  )

  const [
    slotDurationMinutes,
    setSlotDurationMinutes,
  ] = useState(30)

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    saving,
    setSaving,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState('')

  const [
    successMessage,
    setSuccessMessage,
  ] = useState('')


  useEffect(() => {
    let cancelled = false

    getMyAvailability()
      .then((response) => {
        if (cancelled) {
          return
        }

        const receivedAvailability =
          response.data
            ?.availability ||
          null

        setAvailability(
          receivedAvailability,
        )

        setWeeklySchedule(
          normalizeWeek(
            receivedAvailability
              ?.weeklySchedule,
          ),
        )

        setSlotDurationMinutes(
          receivedAvailability
            ?.slotDurationMinutes ||
            30,
        )

        setError('')
      })
      .catch(
        (requestError) => {
          if (cancelled) {
            return
          }

          setError(
            requestError.message ||
              'Çalışma programı yüklenemedi.',
          )
        },
      )
      .finally(() => {
        if (cancelled) {
          return
        }

        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])


  const orderedSchedule =
    useMemo(
      () =>
        displayDayOrder
          .map(
            (dayOfWeek) =>
              weeklySchedule.find(
                (day) =>
                  day.dayOfWeek ===
                  dayOfWeek,
              ),
          )
          .filter(Boolean),
      [
        weeklySchedule,
      ],
    )


  const activeDayCount =
    useMemo(
      () =>
        weeklySchedule.filter(
          (day) =>
            day.enabled,
        ).length,
      [
        weeklySchedule,
      ],
    )


  const weeklyMinutes =
    useMemo(
      () =>
        weeklySchedule.reduce(
          (
            total,
            day,
          ) => {
            if (!day.enabled) {
              return total
            }

            return (
              total +
              day.periods.reduce(
                (
                  dayTotal,
                  period,
                ) =>
                  dayTotal +
                  Math.max(
                    0,
                    timeToMinutes(
                      period.endTime,
                    ) -
                      timeToMinutes(
                        period.startTime,
                      ),
                  ),
                0,
              )
            )
          },
          0,
        ),
      [
        weeklySchedule,
      ],
    )


  const weeklyHoursLabel =
    weeklyMinutes > 0
      ? `${Math.floor(
          weeklyMinutes / 60,
        )} sa ${
          weeklyMinutes % 60
        } dk`
      : '0 sa'


  const updateDay = (
    dayOfWeek,
    updater,
  ) => {
    setSuccessMessage('')

    setWeeklySchedule(
      (current) =>
        current.map(
          (day) =>
            day.dayOfWeek ===
            dayOfWeek
              ? updater(day)
              : day,
        ),
    )
  }


  const toggleDay = (
    dayOfWeek,
  ) => {
    updateDay(
      dayOfWeek,
      (day) => ({
        ...day,
        enabled:
          !day.enabled,
        periods:
          day.enabled
            ? []
            : day.periods,
      }),
    )
  }


  const addPeriod = (
    dayOfWeek,
  ) => {
    updateDay(
      dayOfWeek,
      (day) => ({
        ...day,
        enabled: true,
        periods: [
          ...day.periods,
          {
            startTime: '',
            endTime: '',
          },
        ],
      }),
    )
  }


  const updatePeriod = (
    dayOfWeek,
    periodIndex,
    field,
    value,
  ) => {
    updateDay(
      dayOfWeek,
      (day) => ({
        ...day,
        periods:
          day.periods.map(
            (
              period,
              index,
            ) =>
              index ===
              periodIndex
                ? {
                    ...period,
                    [field]:
                      value,
                  }
                : period,
          ),
      }),
    )
  }


  const removePeriod = (
    dayOfWeek,
    periodIndex,
  ) => {
    updateDay(
      dayOfWeek,
      (day) => ({
        ...day,
        periods:
          day.periods.filter(
            (
              _,
              index,
            ) =>
              index !==
              periodIndex,
          ),
      }),
    )
  }


  const handleSave =
    async () => {
      setError('')
      setSuccessMessage('')

      const invalidDay =
        weeklySchedule.find(
          (day) =>
            getDayValidationError(
              day,
            ),
        )

      if (invalidDay) {
        setError(
          `${dayNames[invalidDay.dayOfWeek]}: ${getDayValidationError(
            invalidDay,
          )}`,
        )
        return
      }

      setSaving(true)

      try {
        const response =
          await updateMyAvailability({
            timezone:
              availability
                ?.timezone ||
              'Europe/Istanbul',

            slotDurationMinutes,

            weeklySchedule: [
              ...weeklySchedule,
            ].sort(
              (
                firstDay,
                secondDay,
              ) =>
                firstDay.dayOfWeek -
                secondDay.dayOfWeek,
            ),

            exceptions:
              availability
                ?.exceptions ||
              [],
          })

        const savedAvailability =
          response.data
            ?.availability

        if (savedAvailability) {
          setAvailability(
            savedAvailability,
          )

          setWeeklySchedule(
            normalizeWeek(
              savedAvailability
                .weeklySchedule,
            ),
          )

          setSlotDurationMinutes(
            savedAvailability
              .slotDurationMinutes ||
              30,
          )
        }

        setSuccessMessage(
          response.message ||
            'Çalışma programı başarıyla kaydedildi.',
        )
      } catch (requestError) {
        setError(
          requestError.message ||
            'Çalışma programı kaydedilemedi.',
        )
      } finally {
        setSaving(false)
      }
    }


  if (loading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({
          length: 6,
        }).map(
          (
            _,
            index,
          ) => (
            <div
              key={index}
              className="h-[185px] animate-pulse rounded-[20px] border border-[#ECEBF3] bg-white/70"
            />
          ),
        )}
      </div>
    )
  }


  return (
    <section className="rounded-[24px] border border-white/80 bg-white/75 p-5 shadow-[0_18px_50px_rgba(69,61,128,0.06)] backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-5 border-b border-[#EEF0F5] pb-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#625BF6]">
            Haftalık Program
          </p>

          <h2 className="mt-1.5 text-[19px] font-semibold tracking-[-0.025em] text-[#172033]">
            Çalışma Saatlerim
          </h2>

          <p className="mt-1.5 max-w-[600px] text-[12.5px] leading-5 text-[#7A8497]">
            Hasta randevularında kullanılacak haftalık çalışma günlerinizi ve saat aralıklarınızı belirleyin.
          </p>
        </div>


        <div className="flex flex-wrap items-end gap-2.5">
          <label className="block">
            <span className="mb-1.5 block text-[8.5px] font-bold uppercase tracking-[0.08em] text-[#98A2B3]">
              Randevu Süresi
            </span>

            <select
              value={
                slotDurationMinutes
              }
              onChange={(
                event,
              ) => {
                setSlotDurationMinutes(
                  Number(
                    event.target
                      .value,
                  ),
                )

                setSuccessMessage(
                  '',
                )
              }}
              className="h-11 rounded-[13px] border border-[#E7E4F7] bg-[#F8F7FF] px-3.5 text-[12px] font-semibold text-[#344054] outline-none transition focus:border-[#625BF6]/40 focus:ring-4 focus:ring-[#625BF6]/[0.06]"
            >
              {slotOptions.map(
                (minutes) => (
                  <option
                    key={
                      minutes
                    }
                    value={
                      minutes
                    }
                  >
                    {minutes}{' '}
                    dakika
                  </option>
                ),
              )}
            </select>
          </label>


          <InfoCard
            icon={
              CalendarDays
            }
            label="Saat Dilimi"
            value={
              availability
                ?.timezone ||
              'Europe/Istanbul'
            }
          />

          <InfoCard
            icon={Clock3}
            label="Aktif Gün"
            value={`${activeDayCount} gün`}
          />

          <InfoCard
            icon={Clock3}
            label="Haftalık Süre"
            value={
              weeklyHoursLabel
            }
          />
        </div>
      </div>


      {(error ||
        successMessage) && (
        <div
          className={`mt-4 rounded-[14px] border px-4 py-3 text-[11.5px] font-medium ${
            error
              ? 'border-red-100 bg-red-50 text-red-700'
              : 'border-emerald-100 bg-emerald-50 text-emerald-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {!error && (
              <CheckCircle2
                size={15}
              />
            )}

            {error ||
              successMessage}
          </div>
        </div>
      )}


      <div className="mt-5 grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">
        {orderedSchedule.map(
          (day) => {
            const dayError =
              getDayValidationError(
                day,
              )

            return (
              <article
                key={
                  day.dayOfWeek
                }
                className={`rounded-[20px] border bg-white/90 p-4 shadow-[0_8px_22px_rgba(56,49,107,0.035)] transition duration-300 ${
                  day.enabled
                    ? 'border-[#DCD8FA]'
                    : 'border-[#ECEBF3]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[14px] font-semibold text-[#273142]">
                      {
                        dayNames[
                          day.dayOfWeek
                        ]
                      }
                    </p>

                    <p
                      className={`mt-1 text-[10px] font-semibold ${
                        day.enabled
                          ? 'text-emerald-600'
                          : 'text-[#98A2B3]'
                      }`}
                    >
                      {day.enabled
                        ? 'Randevuya açık'
                        : 'Kapalı gün'}
                    </p>
                  </div>


                  <button
                    type="button"
                    onClick={() =>
                      toggleDay(
                        day.dayOfWeek,
                      )
                    }
                    className={`relative h-7 w-[50px] rounded-full transition ${
                      day.enabled
                        ? 'bg-[#625BF6]'
                        : 'bg-[#E4E7EC]'
                    }`}
                    aria-label={`${dayNames[day.dayOfWeek]} gününü ${
                      day.enabled
                        ? 'kapat'
                        : 'aç'
                    }`}
                  >
                    <span
                      className={`absolute top-1 size-5 rounded-full bg-white shadow-sm transition-all ${
                        day.enabled
                          ? 'left-[26px]'
                          : 'left-1'
                      }`}
                    />
                  </button>
                </div>


                <div className="mt-4 min-h-[112px]">
                  {!day.enabled ? (
                    <div className="grid min-h-[92px] place-items-center rounded-[14px] border border-dashed border-[#E6E7EC] bg-[#FAFAFC] px-3 text-center">
                      <p className="text-[10.5px] leading-4 text-[#A0A7B5]">
                        Bu gün randevu kabul edilmiyor.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {day.periods.map(
                        (
                          period,
                          index,
                        ) => (
                          <div
                            key={`${day.dayOfWeek}-${index}`}
                            className="flex items-end gap-2"
                          >
                            <TimeField
                              label="Başlangıç"
                              value={
                                period.startTime
                              }
                              onChange={(
                                value,
                              ) =>
                                updatePeriod(
                                  day.dayOfWeek,
                                  index,
                                  'startTime',
                                  value,
                                )
                              }
                            />

                            <span className="mb-3 text-[#B2B7C2]">
                              –
                            </span>

                            <TimeField
                              label="Bitiş"
                              value={
                                period.endTime
                              }
                              onChange={(
                                value,
                              ) =>
                                updatePeriod(
                                  day.dayOfWeek,
                                  index,
                                  'endTime',
                                  value,
                                )
                              }
                            />

                            <button
                              type="button"
                              onClick={() =>
                                removePeriod(
                                  day.dayOfWeek,
                                  index,
                                )
                              }
                              className="mb-0.5 grid size-10 shrink-0 place-items-center rounded-[11px] border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100"
                              aria-label="Saat aralığını sil"
                            >
                              <Trash2
                                size={14}
                              />
                            </button>
                          </div>
                        ),
                      )}


                      <button
                        type="button"
                        onClick={() =>
                          addPeriod(
                            day.dayOfWeek,
                          )
                        }
                        className="inline-flex h-9 items-center gap-1.5 rounded-[11px] border border-[#DDD8FA] bg-[#F8F7FF] px-3 text-[10.5px] font-semibold text-[#625BF6] transition hover:bg-[#F1EFFF]"
                      >
                        <Plus
                          size={13}
                        />
                        Saat Ekle
                      </button>


                      {dayError && (
                        <p className="text-[10px] font-medium leading-4 text-red-500">
                          {dayError}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </article>
            )
          },
        )}
      </div>


      <div className="mt-5 flex flex-col gap-3 border-t border-[#EEF0F5] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[650px] text-[10.5px] leading-5 text-[#98A2B3]">
          Kaydedilen program, hasta tarafında gösterilecek uygun randevu saatlerinin oluşturulmasında kullanılacaktır.
        </p>

        <button
          type="button"
          onClick={
            handleSave
          }
          disabled={
            saving
          }
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[13px] bg-[#625BF6] px-5 text-[12px] font-semibold text-white shadow-[0_10px_24px_rgba(98,91,246,0.20)] transition hover:-translate-y-0.5 hover:bg-[#5851E8] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
        >
          <Save
            size={15}
          />

          {saving
            ? 'Kaydediliyor...'
            : 'Programı Kaydet'}
        </button>
      </div>
    </section>
  )
}


function TimeField({
  label,
  value,
  onChange,
}) {
  return (
    <label className="min-w-0 flex-1">
      <span className="mb-1.5 block text-[8.5px] font-bold uppercase tracking-[0.07em] text-[#98A2B3]">
        {label}
      </span>

      <input
        type="time"
        value={value}
        onChange={(
          event,
        ) =>
          onChange(
            event.target.value,
          )
        }
        className="h-10 w-full rounded-[11px] border border-[#E5E2F5] bg-[#FBFAFF] px-2.5 text-[11px] font-semibold text-[#344054] outline-none transition focus:border-[#625BF6]/45 focus:ring-4 focus:ring-[#625BF6]/[0.05]"
      />
    </label>
  )
}


function InfoCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex h-11 items-center gap-2.5 rounded-[13px] border border-[#E7E4F7] bg-white px-3.5">
      <Icon
        size={14}
        className="shrink-0 text-[#625BF6]"
      />

      <div>
        <p className="text-[8px] font-bold uppercase tracking-[0.07em] text-[#98A2B3]">
          {label}
        </p>

        <p className="mt-0.5 whitespace-nowrap text-[10.5px] font-semibold text-[#344054]">
          {value}
        </p>
      </div>
    </div>
  )
}
