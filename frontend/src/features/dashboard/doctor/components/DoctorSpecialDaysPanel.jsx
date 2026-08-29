import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
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


const weekDayLabels = [
  'Pzt',
  'Sal',
  'Çar',
  'Per',
  'Cum',
  'Cmt',
  'Paz',
]

const monthNames = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
]


const padNumber = (
  value,
) =>
  String(value).padStart(
    2,
    '0',
  )


const toDateKey = (
  year,
  month,
  day,
) =>
  `${year}-${padNumber(
    month + 1,
  )}-${padNumber(day)}`


const getCalendarCells = (
  year,
  month,
) => {
  const firstDay =
    new Date(
      year,
      month,
      1,
    )

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0,
    ).getDate()

  // JavaScript: Sunday = 0.
  // Calendar: Monday = 0.
  const leadingEmptyDays =
    (firstDay.getDay() + 6) %
    7

  const cells = []

  for (
    let index = 0;
    index <
    leadingEmptyDays;
    index += 1
  ) {
    cells.push(null)
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day += 1
  ) {
    cells.push(day)
  }

  while (
    cells.length % 7 !==
    0
  ) {
    cells.push(null)
  }

  return cells
}


const createDraftFromException = (
  exception,
) => {
  if (!exception) {
    return {
      mode: 'normal',
      note: '',
      periods: [],
    }
  }

  if (
    exception.available
  ) {
    return {
      mode: 'custom',
      note:
        exception.note || '',
      periods:
        Array.isArray(
          exception.periods,
        )
          ? exception.periods.map(
              (period) => ({
                startTime:
                  period.startTime ||
                  '',
                endTime:
                  period.endTime ||
                  '',
              }),
            )
          : [],
    }
  }

  return {
    mode: 'closed',
    note:
      exception.note || '',
    periods: [],
  }
}


const validatePeriods = (
  periods,
) => {
  if (
    periods.length === 0
  ) {
    return 'Özel çalışma günü için en az bir saat aralığı ekleyin.'
  }

  const sortedPeriods = [
    ...periods,
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
      const previous =
        sortedPeriods[
          index - 1
        ]

      if (
        period.startTime <
        previous.endTime
      ) {
        return 'Özel çalışma saatleri birbiriyle çakışamaz.'
      }
    }
  }

  return ''
}


export default function DoctorSpecialDaysPanel() {
  const today =
    useMemo(
      () => new Date(),
      [],
    )

  const [
    visibleYear,
    setVisibleYear,
  ] = useState(
    today.getFullYear(),
  )

  const [
    visibleMonth,
    setVisibleMonth,
  ] = useState(
    today.getMonth(),
  )

  const [
    availability,
    setAvailability,
  ] = useState(null)

  const [
    selectedDate,
    setSelectedDate,
  ] = useState('')

  const [
    draft,
    setDraft,
  ] = useState({
    mode: 'normal',
    note: '',
    periods: [],
  })

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

        setAvailability(
          response.data
            ?.availability ||
            null,
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
              'Özel gün bilgileri yüklenemedi.',
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


  const calendarCells =
    useMemo(
      () =>
        getCalendarCells(
          visibleYear,
          visibleMonth,
        ),
      [
        visibleYear,
        visibleMonth,
      ],
    )


  const exceptionMap =
    useMemo(
      () =>
        new Map(
          (
            availability
              ?.exceptions || []
          ).map(
            (exception) => [
              exception.date,
              exception,
            ],
          ),
        ),
      [
        availability
          ?.exceptions,
      ],
    )


  const selectedException =
    selectedDate
      ? exceptionMap.get(
          selectedDate,
        )
      : null


  const todayKey =
    toDateKey(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    )


  const goPreviousMonth =
    () => {
      setSuccessMessage('')
      setSelectedDate('')

      if (
        visibleMonth === 0
      ) {
        setVisibleMonth(11)
        setVisibleYear(
          (current) =>
            current - 1,
        )
        return
      }

      setVisibleMonth(
        (current) =>
          current - 1,
      )
    }


  const goNextMonth =
    () => {
      setSuccessMessage('')
      setSelectedDate('')

      if (
        visibleMonth === 11
      ) {
        setVisibleMonth(0)
        setVisibleYear(
          (current) =>
            current + 1,
        )
        return
      }

      setVisibleMonth(
        (current) =>
          current + 1,
      )
    }


  const handleDateSelect = (
    day,
  ) => {
    const dateKey =
      toDateKey(
        visibleYear,
        visibleMonth,
        day,
      )

    const exception =
      exceptionMap.get(
        dateKey,
      )

    setSelectedDate(
      dateKey,
    )

    setDraft(
      createDraftFromException(
        exception,
      ),
    )

    setError('')
    setSuccessMessage('')
  }


  const updatePeriod = (
    periodIndex,
    field,
    value,
  ) => {
    setSuccessMessage('')

    setDraft(
      (current) => ({
        ...current,
        periods:
          current.periods.map(
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


  const addPeriod = () => {
    setSuccessMessage('')

    setDraft(
      (current) => ({
        ...current,
        mode: 'custom',
        periods: [
          ...current.periods,
          {
            startTime: '',
            endTime: '',
          },
        ],
      }),
    )
  }


  const removePeriod = (
    periodIndex,
  ) => {
    setSuccessMessage('')

    setDraft(
      (current) => ({
        ...current,
        periods:
          current.periods.filter(
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
      if (!selectedDate) {
        setError(
          'Önce takvimden bir tarih seçin.',
        )
        return
      }

      if (!availability) {
        setError(
          'Çalışma programı bilgisi bulunamadı.',
        )
        return
      }

      if (
        draft.mode ===
        'custom'
      ) {
        const periodError =
          validatePeriods(
            draft.periods,
          )

        if (periodError) {
          setError(
            periodError,
          )
          return
        }
      }

      setSaving(true)
      setError('')
      setSuccessMessage('')

      const remainingExceptions =
        (
          availability.exceptions ||
          []
        ).filter(
          (exception) =>
            exception.date !==
            selectedDate,
        )

      let nextExceptions =
        remainingExceptions

      if (
        draft.mode ===
        'closed'
      ) {
        nextExceptions = [
          ...remainingExceptions,
          {
            date:
              selectedDate,
            available: false,
            periods: [],
            note:
              draft.note.trim(),
          },
        ]
      }

      if (
        draft.mode ===
        'custom'
      ) {
        nextExceptions = [
          ...remainingExceptions,
          {
            date:
              selectedDate,
            available: true,
            periods:
              draft.periods,
            note:
              draft.note.trim(),
          },
        ]
      }

      try {
        const response =
          await updateMyAvailability({
            timezone:
              availability.timezone ||
              'Europe/Istanbul',

            slotDurationMinutes:
              availability
                .slotDurationMinutes ||
              30,

            weeklySchedule:
              availability
                .weeklySchedule ||
              [],

            exceptions:
              nextExceptions,
          })

        const savedAvailability =
          response.data
            ?.availability

        if (savedAvailability) {
          setAvailability(
            savedAvailability,
          )
        }

        setSuccessMessage(
          draft.mode ===
          'normal'
            ? 'Seçili tarih normal haftalık programa döndürüldü.'
            : 'Özel gün başarıyla kaydedildi.',
        )
      } catch (requestError) {
        setError(
          requestError.message ||
            'Özel gün kaydedilemedi.',
        )
      } finally {
        setSaving(false)
      }
    }


  if (loading) {
    return (
      <div className="h-[420px] animate-pulse rounded-[24px] border border-[#ECEBF3] bg-white/70" />
    )
  }


  const selectedDateLabel =
    selectedDate
      ? new Intl.DateTimeFormat(
          'tr-TR',
          {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          },
        ).format(
          new Date(
            `${selectedDate}T12:00:00`,
          ),
        )
      : 'Tarih seçilmedi'


  return (
    <section className="rounded-[26px] border border-white/90 bg-[linear-gradient(135deg,rgba(255,255,255,0.94)_0%,rgba(248,247,255,0.90)_54%,rgba(239,249,255,0.86)_100%)] p-5 shadow-[0_22px_60px_rgba(76,67,145,0.08)] backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-3 border-b border-[#EEF0F5] pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="inline-flex items-center rounded-full border border-[#DCD7FF] bg-[linear-gradient(90deg,#F0EDFF,#EEF8FF)] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-[#625BF6]">
            Takvim Yönetimi
          </p>

          <h2 className="mt-1.5 text-[19px] font-semibold tracking-[-0.025em] text-[#172033]">
            Özel Günler
          </h2>

          <p className="mt-1.5 max-w-[640px] text-[12.5px] leading-5 text-[#7A8497]">
            İzin günlerini veya standart haftalık programdan farklı çalışacağınız tarihleri yönetin.
          </p>
        </div>

        <div className="rounded-[15px] border border-[#DCD7FF] bg-[linear-gradient(135deg,#F0EDFF,#EEF8FF)] px-4 py-2.5 shadow-[0_8px_20px_rgba(98,91,246,0.08)]">
          <p className="text-[8px] font-bold uppercase tracking-[0.08em] text-[#98A2B3]">
            Kayıtlı Özel Gün
          </p>

          <p className="mt-0.5 text-[11px] font-semibold text-[#344054]">
            {
              availability
                ?.exceptions
                ?.length || 0
            }{' '}
            kayıt
          </p>
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
          {error ||
            successMessage}
        </div>
      )}


      <div className="mt-5 grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        {/* CALENDAR */}
        <div className="rounded-[22px] border border-[#DDD9F6] bg-[linear-gradient(145deg,#FFFFFF_0%,#F9F7FF_56%,#F0FAFF_100%)] p-4 shadow-[0_14px_34px_rgba(90,80,160,0.06)] sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={
                goPreviousMonth
              }
              className="grid size-9 place-items-center rounded-[12px] border border-[#DCD7FF] bg-white/90 text-[#625BF6] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#F1EEFF] hover:shadow-[0_8px_18px_rgba(98,91,246,0.12)]"
              aria-label="Önceki ay"
            >
              <ChevronLeft
                size={16}
              />
            </button>

            <div className="rounded-[16px] border border-[#E0DCF8] bg-white/80 px-5 py-2 text-center shadow-[0_8px_20px_rgba(89,86,245,0.06)]">
              <p className="text-[15px] font-bold tracking-[-0.02em] text-[#4F46E5]">
                {
                  monthNames[
                    visibleMonth
                  ]
                }{' '}
                {visibleYear}
              </p>

              <p className="mt-0.5 text-[9px] font-medium text-[#98A2B3]">
                Aylık müsaitlik planı
              </p>
            </div>

            <button
              type="button"
              onClick={
                goNextMonth
              }
              className="grid size-9 place-items-center rounded-[12px] border border-[#DCD7FF] bg-white/90 text-[#625BF6] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#F1EEFF] hover:shadow-[0_8px_18px_rgba(98,91,246,0.12)]"
              aria-label="Sonraki ay"
            >
              <ChevronRight
                size={16}
              />
            </button>
          </div>


          <div className="mt-5 grid grid-cols-7 gap-1.5">
            {weekDayLabels.map(
              (
                label,
                index,
              ) => (
                <div
                  key={label}
                  className={`py-1 text-center text-[8.5px] font-bold uppercase tracking-[0.07em] ${
                    index >= 5
                      ? 'text-[#E66A8A]'
                      : 'text-[#7A73B8]'
                  }`}
                >
                  {label}
                </div>
              ),
            )}

            {calendarCells.map(
              (
                day,
                index,
              ) => {
                if (!day) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="aspect-square"
                    />
                  )
                }

                const dateKey =
                  toDateKey(
                    visibleYear,
                    visibleMonth,
                    day,
                  )

                const exception =
                  exceptionMap.get(
                    dateKey,
                  )

                const isSelected =
                  selectedDate ===
                  dateKey

                const isToday =
                  todayKey ===
                  dateKey

                return (
                  <button
                    key={
                      dateKey
                    }
                    type="button"
                    onClick={() =>
                      handleDateSelect(
                        day,
                      )
                    }
                    className={`relative aspect-square min-h-[42px] rounded-[13px] border text-[11px] font-semibold transition-all duration-200 ${
                      isSelected
                        ? 'border-transparent bg-[linear-gradient(135deg,#5F5AF7_0%,#7768FF_55%,#54B8FF_100%)] text-white shadow-[0_10px_22px_rgba(98,91,246,0.24)]'
                        : exception
                          ? exception.available
                            ? 'border-[#A8E7D0] bg-[linear-gradient(145deg,#ECFFF7,#EAFBFF)] text-[#16805E] shadow-[0_5px_14px_rgba(16,185,129,0.08)]'
                            : 'border-[#FFD1DC] bg-[linear-gradient(145deg,#FFF1F5,#FFF7F0)] text-[#D94D72] shadow-[0_5px_14px_rgba(244,63,94,0.06)]'
                          : `border-white/80 bg-white/85 text-[#475467] shadow-[0_4px_12px_rgba(57,52,112,0.025)] hover:-translate-y-0.5 hover:border-[#CFC8FA] hover:bg-[linear-gradient(145deg,#F5F2FF,#EEF9FF)] hover:text-[#625BF6] ${
                              isToday
                                ? 'ring-2 ring-[#68BDF8]/50 ring-offset-1'
                                : ''
                            }`
                    }`}
                  >
                    {day}

                    {exception && (
                      <span
                        className={`absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full ${
                          isSelected
                            ? 'bg-white'
                            : exception.available
                              ? 'bg-emerald-500'
                              : 'bg-red-500'
                        }`}
                      />
                    )}
                  </button>
                )
              },
            )}
          </div>


          <div className="mt-4 flex flex-wrap gap-2 border-t border-[#E8E6F4] pt-4 text-[9.5px] text-[#667085]">
            <LegendDot
              className="bg-red-500"
              label="İzinli / Kapalı"
            />

            <LegendDot
              className="bg-emerald-500"
              label="Özel çalışma"
            />

            <LegendDot
              className="bg-[#C5CAD3]"
              label="Normal program"
            />
          </div>
        </div>


        {/* DATE EDITOR */}
        <div className="rounded-[22px] border border-[#E2DEF7] bg-[linear-gradient(145deg,#FFFFFF_0%,#FBFAFF_48%,#F4FAFF_100%)] p-4 shadow-[0_14px_34px_rgba(90,80,160,0.055)] sm:p-5">
          <div className="flex items-center gap-3 border-b border-[#EEF0F5] pb-4">
            <div className="grid size-11 place-items-center rounded-[14px] bg-[linear-gradient(135deg,#655DF7,#7A70FF_58%,#57B9F8)] text-white shadow-[0_9px_20px_rgba(98,91,246,0.20)]">
              <CalendarDays
                size={17}
              />
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#98A2B3]">
                Seçili Tarih
              </p>

              <p className="mt-0.5 text-[13px] font-semibold text-[#273142]">
                {
                  selectedDateLabel
                }
              </p>
            </div>
          </div>


          {!selectedDate ? (
            <div className="grid min-h-[300px] place-items-center rounded-[18px] bg-[radial-gradient(circle_at_top,#F2EFFF_0%,rgba(248,250,255,0.4)_42%,transparent_72%)] text-center">
              <div>
                <CalendarDays
                  size={25}
                  className="mx-auto rounded-[16px] bg-white p-2 text-[#6D64F7] shadow-[0_10px_24px_rgba(98,91,246,0.12)]"
                />

                <p className="mt-3 text-[12px] font-semibold text-[#667085]">
                  Takvimden bir gün seçin
                </p>

                <p className="mt-1 text-[10.5px] leading-5 text-[#98A2B3]">
                  Seçtiğiniz tarih için izin veya özel çalışma saati tanımlayabilirsiniz.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-5">
              <div className="grid gap-2 sm:grid-cols-3">
                <ModeButton
                  active={
                    draft.mode ===
                    'normal'
                  }
                  title="Normal"
                  description="Haftalık program"
                  onClick={() =>
                    setDraft({
                      mode: 'normal',
                      note: '',
                      periods: [],
                    })
                  }
                />

                <ModeButton
                  active={
                    draft.mode ===
                    'closed'
                  }
                  title="İzinli"
                  description="Tüm gün kapalı"
                  onClick={() =>
                    setDraft(
                      (current) => ({
                        ...current,
                        mode: 'closed',
                        periods: [],
                      }),
                    )
                  }
                />

                <ModeButton
                  active={
                    draft.mode ===
                    'custom'
                  }
                  title="Özel Çalışma"
                  description="Farklı saatler"
                  onClick={() =>
                    setDraft(
                      (current) => ({
                        ...current,
                        mode: 'custom',
                      }),
                    )
                  }
                />
              </div>


              {draft.mode ===
                'custom' && (
                <div className="mt-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10.5px] font-semibold text-[#344054]">
                        Özel Çalışma Saatleri
                      </p>

                      <p className="mt-1 text-[9.5px] text-[#98A2B3]">
                        Bu tarihte standart haftalık program yerine kullanılacaktır.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={
                        addPeriod
                      }
                      className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[11px] border border-[#DDD8FA] bg-[#F8F7FF] px-3 text-[10.5px] font-semibold text-[#625BF6] transition hover:bg-[#F1EFFF]"
                    >
                      <Plus
                        size={13}
                      />
                      Saat Ekle
                    </button>
                  </div>


                  <div className="mt-3 space-y-2.5">
                    {draft.periods
                      .length ===
                    0 ? (
                      <div className="rounded-[13px] border border-dashed border-[#E6E7EC] bg-[#FAFAFC] px-3 py-4 text-center text-[10px] text-[#98A2B3]">
                        Henüz özel çalışma saati eklenmedi.
                      </div>
                    ) : (
                      draft.periods.map(
                        (
                          period,
                          index,
                        ) => (
                          <div
                            key={
                              index
                            }
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
                                  index,
                                )
                              }
                              className="mb-0.5 grid size-10 shrink-0 place-items-center rounded-[11px] border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100"
                            >
                              <Trash2
                                size={14}
                              />
                            </button>
                          </div>
                        ),
                      )
                    )}
                  </div>
                </div>
              )}


              {draft.mode !==
                'normal' && (
                <label className="mt-5 block">
                  <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.07em] text-[#98A2B3]">
                    Not
                  </span>

                  <textarea
                    rows={3}
                    maxLength={200}
                    value={
                      draft.note
                    }
                    onChange={(
                      event,
                    ) =>
                      setDraft(
                        (current) => ({
                          ...current,
                          note:
                            event.target
                              .value,
                        }),
                      )
                    }
                    placeholder="Örn. Yıllık izin, kongre, özel çalışma..."
                    className="w-full resize-none rounded-[13px] border border-[#E5E2F5] bg-[#FBFAFF] px-3 py-3 text-[11px] leading-5 text-[#344054] outline-none transition focus:border-[#625BF6]/45 focus:ring-4 focus:ring-[#625BF6]/[0.05]"
                  />
                </label>
              )}


              <button
                type="button"
                onClick={
                  handleSave
                }
                disabled={
                  saving
                }
                className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[13px] bg-[#625BF6] px-5 text-[12px] font-semibold text-white shadow-[0_10px_24px_rgba(98,91,246,0.20)] transition hover:-translate-y-0.5 hover:bg-[#5851E8] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
              >
                <Save
                  size={15}
                />

                {saving
  ? 'Kaydediliyor...'
  : draft.mode === 'normal'
    ? selectedException
      ? selectedException.available
        ? 'Özel Çalışmayı Kaldır'
        : 'İzni Kaldır'
      : 'Normal Programı Kullan'
    : 'Özel Günü Kaydet'}
              </button>


              {selectedException && (
                <p className="mt-3 text-center text-[9.5px] text-[#98A2B3]">
                  Bu tarih için daha önce özel bir kayıt oluşturulmuş.
                </p>
              )}
            </div>
          )}
        </div>
      </div>


      <div className="mt-5 flex items-start gap-2 rounded-[14px] border border-[#E7E4F7] bg-[#F8F7FF] px-4 py-3">
        <Clock3
          size={14}
          className="mt-0.5 shrink-0 text-[#625BF6]"
        />

        <p className="text-[10.5px] leading-5 text-[#7A8497]">
          Özel gün kayıtları haftalık programın üzerine yazılır. Örneğin normalde kapalı olan bir günde özel çalışma saati tanımlayabilir veya açık bir günü izinli olarak işaretleyebilirsiniz.
        </p>
      </div>
    </section>
  )
}


function ModeButton({
  active,
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[14px] border px-3 py-3 text-left transition-all duration-200 ${
        active
          ? title === 'İzinli'
            ? 'border-[#FFC7D4] bg-[linear-gradient(145deg,#FFF1F5,#FFF8F1)] shadow-[0_8px_18px_rgba(244,63,94,0.07)]'
            : title === 'Özel Çalışma'
              ? 'border-[#AEE7D2] bg-[linear-gradient(145deg,#ECFFF7,#ECFAFF)] shadow-[0_8px_18px_rgba(16,185,129,0.07)]'
              : 'border-[#CBC5FF] bg-[linear-gradient(145deg,#F1EEFF,#EEF8FF)] shadow-[0_8px_18px_rgba(98,91,246,0.09)]'
          : 'border-[#EAECF0] bg-white/90 hover:-translate-y-0.5 hover:border-[#D9D4F6] hover:bg-[#FAFAFF]'
      }`}
    >
      <p
        className={`text-[10.5px] font-semibold ${
          active
            ? title === 'İzinli'
              ? 'text-[#D94D72]'
              : title === 'Özel Çalışma'
                ? 'text-[#16805E]'
                : 'text-[#625BF6]'
            : 'text-[#475467]'
        }`}
      >
        {title}
      </p>

      <p className="mt-0.5 text-[8.5px] text-[#98A2B3]">
        {description}
      </p>
    </button>
  )
}


function TimeField({
  label,
  value,
  onChange,
}) {
  return (
    <label className="min-w-0 flex-1">
      <span className="mb-1.5 block text-[8px] font-bold uppercase tracking-[0.07em] text-[#98A2B3]">
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


function LegendDot({
  className,
  label,
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-white/80 bg-white/75 px-2.5 py-1.5 shadow-sm">
      <span
        className={`size-1.5 rounded-full ${className}`}
      />

      {label}
    </div>
  )
}
