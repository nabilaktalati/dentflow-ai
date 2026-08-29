import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  MapPin,
  Stethoscope,
} from 'lucide-react'

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router'

import {
  createAppointment,
  getBookingDoctors,
  getDoctorAvailability,
} from '../api/patientAppointmentsApi.js'


const MONTH_NAMES = [
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

const WEEK_DAYS = [
  'Pzt',
  'Sal',
  'Çar',
  'Per',
  'Cum',
  'Cmt',
  'Paz',
]


const toDateKey = (
  year,
  month,
  day,
) =>
  `${year}-${String(
    month + 1,
  ).padStart(
    2,
    '0',
  )}-${String(day).padStart(
    2,
    '0',
  )}`


const getTodayStart =
  () => {
    const now =
      new Date()

    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    )
  }


const PatientBookingPage =
  () => {
    const navigate =
      useNavigate()

    const [
      doctors,
      setDoctors,
    ] = useState([])

    const [
      doctorsLoading,
      setDoctorsLoading,
    ] = useState(true)

    const [
      selectedDoctorId,
      setSelectedDoctorId,
    ] = useState('')

    const [
      selectedDate,
      setSelectedDate,
    ] = useState('')

    const [
      selectedTime,
      setSelectedTime,
    ] = useState('')

    const [
      slots,
      setSlots,
    ] = useState([])

    const [
      slotsLoading,
      setSlotsLoading,
    ] = useState(false)

    const [
      availabilityMessage,
      setAvailabilityMessage,
    ] = useState('')

    const [
      patientNote,
      setPatientNote,
    ] = useState('')

    const [
      booking,
      setBooking,
    ] = useState(false)

    const [
      error,
      setError,
    ] = useState('')

    const [
      success,
      setSuccess,
    ] = useState(null)



    const [
  visibleMonth,
  setVisibleMonth,
] = useState(() => {
  const today =
    new Date()

  return new Date(
    today.getFullYear(),
    today.getMonth(),
    1,
  )
})


    useEffect(() => {
      getBookingDoctors()
        .then((response) => {
          const result =
            response.data
              ?.doctors ||
            []

          setDoctors(result)

          if (
            result.length === 1
          ) {
            setSelectedDoctorId(
              result[0].id,
            )
          }
        })
        .catch(
          (requestError) => {
            setError(
              requestError.message ||
                'Doktorlar yüklenemedi.',
            )
          },
        )
        .finally(() => {
          setDoctorsLoading(
            false,
          )
        })
    }, [])


   useEffect(() => {
  if (
    !selectedDoctorId ||
    !selectedDate
  ) {
    return undefined
  }

  let cancelled = false



  getDoctorAvailability({
    doctorId:
      selectedDoctorId,

    date:
      selectedDate,
  })
    .then((response) => {
      if (cancelled) {
        return
      }

      const data =
        response.data

      const availableSlots =
        data?.slots ||
        []

      setSlots(
        availableSlots,
      )

      if (
        !data?.available ||
        availableSlots.length === 0
      ) {
        setAvailabilityMessage(
          'Bu tarihte uygun randevu saati bulunmuyor.',
        )
      }
    })
    .catch(
      (requestError) => {
        if (cancelled) {
          return
        }

        setSlots([])

        setAvailabilityMessage(
          requestError.message ||
            'Müsait saatler alınamadı.',
        )
      },
    )
    .finally(() => {
      if (!cancelled) {
        setSlotsLoading(
          false,
        )
      }
    })

  return () => {
    cancelled = true
  }
}, [
  selectedDoctorId,
  selectedDate,
])


    const selectedDoctor =
      useMemo(
        () =>
          doctors.find(
            (doctor) =>
              doctor.id ===
              selectedDoctorId,
          ),
        [
          doctors,
          selectedDoctorId,
        ],
      )


    const calendarDays =
      useMemo(() => {
        const year =
          visibleMonth.getFullYear()

        const month =
          visibleMonth.getMonth()

        const firstDay =
          new Date(
            year,
            month,
            1,
          )

        const numberOfDays =
          new Date(
            year,
            month + 1,
            0,
          ).getDate()

        /*
         * JS: Pazar = 0
         * Takvim: Pazartesi = 0
         */
        const leadingEmptyDays =
          (
            firstDay.getDay() +
            6
          ) % 7

        const cells = []

        for (
  let index = 0;
  index < leadingEmptyDays;
  index += 1
) {
  cells.push(null)
}

    for (
  let day = 1;
  day <= numberOfDays;
  day += 1
) {
  cells.push(day)
}

        return cells
      }, [visibleMonth])


   const currentMonthStart =
  getTodayStart()

currentMonthStart.setDate(1)

const canGoPrevious =
  visibleMonth >
  currentMonthStart


    const handleDateSelect =
      (day) => {
        if (!day) {
          return
        }

        const year =
          visibleMonth.getFullYear()

        const month =
          visibleMonth.getMonth()

        const dateObject =
          new Date(
            year,
            month,
            day,
          )

        if (
          dateObject <
          getTodayStart()
        ) {
          return
        }

        const nextDate =
  toDateKey(
    year,
    month,
    day,
  )

if (
  nextDate ===
  selectedDate
) {
  return
}

setSelectedDate(
  nextDate,
)

setSelectedTime('')
setSlots([])
setSlotsLoading(true)
setAvailabilityMessage('')
setError('')
setSuccess(null)
      }


    const handleBooking =
      async () => {
        if (
          !selectedDoctorId ||
          !selectedDate ||
          !selectedTime
        ) {
          setError(
            'Doktor, tarih ve saat seçiniz.',
          )

          return
        }

        try {
          setBooking(true)
          setError('')

          const response =
            await createAppointment({
              doctorId:
                selectedDoctorId,

              date:
                selectedDate,

              startTime:
                selectedTime,

              patientNote:
                patientNote.trim(),
            })

          setSuccess(
            response.data
              ?.appointment,
          )

          /*
           * Yeni rezervasyon sonrasında
           * aynı slot arayüzde de kaldırılır.
           */
          setSlots(
            (current) =>
              current.filter(
                (slot) =>
                  slot !==
                  selectedTime,
              ),
          )
        } catch (
          requestError
        ) {
          setError(
            requestError.message ||
              'Randevu oluşturulamadı.',
          )
        } finally {
          setBooking(false)
        }
      }


    if (success) {
      return (
        <div className="mx-auto w-full max-w-[1380px] px-5 py-8 sm:px-7 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-[720px] rounded-[30px] border border-emerald-200 bg-white p-7 text-center shadow-[0_24px_70px_rgba(40,50,100,0.08)] sm:p-10">
            <div className="mx-auto flex size-16 items-center justify-center rounded-[22px] bg-emerald-50 text-emerald-600">
              <CheckCircle2
                size={30}
              />
            </div>

            <span className="mt-6 block text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-600">
              RANDEVU OLUŞTURULDU
            </span>

            <h1 className="mt-2 text-[30px] font-bold tracking-[-0.04em] text-[#17182B]">
              Randevunuz onaylandı.
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#747D94]">
              Randevunuz başarıyla
              oluşturuldu ve doktorun
              randevu listesine
              eklendi.
            </p>

            <div className="mx-auto mt-7 max-w-md rounded-[22px] border border-[#E7E7F2] bg-[#FAFAFD] p-5 text-left">
              <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#9BA1B4]">
                RANDEVU KODU
              </div>

              <div className="mt-2 font-mono text-lg font-bold tracking-[0.08em] text-[#5D5AF2]">
                {
                  success.appointmentCode
                }
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  '/patient/appointments',
                )
              }
              className="mt-7 inline-flex items-center gap-2 rounded-[16px] bg-[#615FFF] px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(97,95,255,0.24)] transition hover:bg-[#5552ED]"
            >
              Randevularımı Gör

              <ArrowRight
                size={17}
              />
            </button>
          </div>
        </div>
      )
    }


    return (
      <div className="mx-auto w-full max-w-[1380px] px-5 py-7 sm:px-7 lg:px-10 lg:py-9">
        {/* HEADER */}
        <section className="mb-8">
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#615FFF]">
            HASTA PANELİ
          </span>

          <h1 className="mt-3 text-[34px] font-bold tracking-[-0.04em] text-[#17182B] sm:text-[40px]">
            Randevu Al
          </h1>

          <p className="mt-2 max-w-[650px] text-[14px] leading-6 text-[#7B8399]">
            Doktorunuzu seçin,
            uygun tarihi belirleyin
            ve gerçek zamanlı müsait
            saatlerden randevunuzu
            oluşturun.
          </p>
        </section>


        {/* STEPS */}
        <div className="mb-6 grid grid-cols-2 gap-2 rounded-[22px] border border-[#E5E6F0] bg-white p-2 shadow-sm md:grid-cols-4">
          {[
            [
              '01',
              'Doktor',
              Boolean(
                selectedDoctorId,
              ),
            ],
            [
              '02',
              'Tarih',
              Boolean(
                selectedDate,
              ),
            ],
            [
              '03',
              'Saat',
              Boolean(
                selectedTime,
              ),
            ],
            [
              '04',
              'Onay',
              false,
            ],
          ].map(
            ([
              number,
              label,
              completed,
            ]) => (
              <div
                key={number}
                className={`rounded-[16px] px-4 py-3 ${
                  completed
                    ? 'bg-[#F2F1FF]'
                    : 'bg-[#FAFAFD]'
                }`}
              >
                <div
                  className={`text-[9px] font-bold tracking-[0.18em] ${
                    completed
                      ? 'text-[#615FFF]'
                      : 'text-[#A0A6B8]'
                  }`}
                >
                  {number}
                </div>

                <div className="mt-1 text-[13px] font-bold text-[#303449]">
                  {label}
                </div>
              </div>
            ),
          )}
        </div>


        {error && (
          <div className="mb-5 rounded-[18px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}


        <div className="space-y-5">
          {/* DOCTOR */}
          <section className="rounded-[28px] border border-[#E5E6EF] bg-white p-5 shadow-[0_18px_55px_rgba(36,38,80,0.05)] sm:p-6">
            <div className="mb-5">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#7C78EA]">
                01 · DOKTOR
              </span>

              <h2 className="mt-1 text-[19px] font-bold text-[#1B1D31]">
                Doktorunuzu Seçin
              </h2>
            </div>

            {doctorsLoading ? (
              <p className="text-sm text-[#7B8399]">
                Doktorlar yükleniyor...
              </p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {doctors.map((doctor) => {
                  const selected =
                    selectedDoctorId === doctor.id

                  return (
                    <button
                      type="button"
                      key={doctor.id}
                      onClick={() => {
                        setSelectedDoctorId(
                          doctor.id,
                        )
                        setSelectedDate('')
                        setSelectedTime('')
                        setSlots([])
                        setSlotsLoading(false)
setAvailabilityMessage('')
setError('')
                      }}
                      className={`flex w-full items-center gap-4 rounded-[20px] border p-4 text-left transition ${
                        selected
                          ? 'border-[#AAA7FF] bg-[#F4F3FF] shadow-[0_10px_28px_rgba(97,95,255,0.08)]'
                          : 'border-[#EAEBF2] bg-white hover:border-[#D7D5FF] hover:bg-[#FBFAFF]'
                      }`}
                    >
                      <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-[16px] border border-[#E5E5F3] bg-[#F1F0FF]">
                        {doctor.profileImageUrl ? (
                          <img
                            src={doctor.profileImageUrl}
                            alt={doctor.name}
                            className="size-full object-cover"
                          />
                        ) : (
                          <Stethoscope
                            size={20}
                            className="text-[#615FFF]"
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-[#202237]">
                          {doctor.name}
                        </div>

                        <div className="mt-1 text-[12px] text-[#80879B]">
                          {doctor.title || 'Diş Hekimi'}
                        </div>

                        {doctor.location && (
                          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#9299AA]">
                            <MapPin size={13} />
                            {doctor.location}
                          </div>
                        )}
                      </div>

                      <div
                        className={`size-4 rounded-full border-[4px] ${
                          selected
                            ? 'border-[#615FFF] bg-white'
                            : 'border-[#D8DAE5] bg-white'
                        }`}
                      />
                    </button>
                  )
                })}
              </div>
            )}
          </section>

          {/* CALENDAR + SLOTS */}
          <div className="grid items-stretch gap-5 xl:grid-cols-2">
            {/* CALENDAR */}
            <section className="flex flex-col rounded-[28px] border border-[#E5E6EF] bg-white p-5 shadow-[0_18px_55px_rgba(36,38,80,0.05)] sm:p-6 xl:h-full xl:min-h-[520px]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#7C78EA]">
                    02 · TARİH
                  </span>

                  <h2 className="mt-1 text-[19px] font-bold text-[#1B1D31]">
                    Tarih Seçin
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!canGoPrevious}
                    onClick={() =>
                      setVisibleMonth(
                        new Date(
                          visibleMonth.getFullYear(),
                          visibleMonth.getMonth() - 1,
                          1,
                        ),
                      )
                    }
                    className="flex size-9 items-center justify-center rounded-xl border border-[#E5E6EF] text-[#697187] transition hover:bg-[#F6F5FF] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronLeft size={17} />
                  </button>

                  <div className="min-w-[130px] text-center text-[14px] font-bold text-[#34374B]">
                    {MONTH_NAMES[visibleMonth.getMonth()]}{' '}
                    {visibleMonth.getFullYear()}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setVisibleMonth(
                        new Date(
                          visibleMonth.getFullYear(),
                          visibleMonth.getMonth() + 1,
                          1,
                        ),
                      )
                    }
                    className="flex size-9 items-center justify-center rounded-xl border border-[#E5E6EF] text-[#697187] transition hover:bg-[#F6F5FF]"
                  >
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>

              <div className="mt-6 grid flex-1 grid-cols-7 content-start gap-2">
                {WEEK_DAYS.map((day) => (
                  <div
                    key={day}
                    className="pb-1 text-center text-[9px] font-bold uppercase tracking-[0.13em] text-[#9DA3B5]"
                  >
                    {day}
                  </div>
                ))}

                {calendarDays.map((day, index) => {
                  if (!day) {
                    return (
                      <div
                        key={`empty-${index}`}
                        className="aspect-square"
                      />
                    )
                  }

                  const year =
                    visibleMonth.getFullYear()
                  const month =
                    visibleMonth.getMonth()
                  const dateObject =
                    new Date(year, month, day)
                  const key =
                    toDateKey(year, month, day)
                  const isPast =
                    dateObject < getTodayStart()
                  const selected =
                    selectedDate === key

                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={
                        isPast || !selectedDoctorId
                      }
                      onClick={() =>
                        handleDateSelect(day)
                      }
                      className={`aspect-square rounded-[15px] border text-[13px] font-semibold transition ${
                        selected
                          ? 'border-[#615FFF] bg-[#615FFF] text-white shadow-[0_8px_22px_rgba(97,95,255,0.25)]'
                          : isPast || !selectedDoctorId
                            ? 'border-transparent bg-[#F7F7FA] text-[#C4C7D1]'
                            : 'border-[#ECECF3] bg-white text-[#5C6478] hover:border-[#BDBAFF] hover:bg-[#F7F6FF] hover:text-[#5653E8]'
                      }`}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>

              {!selectedDoctorId && (
                <p className="mt-4 text-center text-[12px] text-[#9399AA]">
                  Tarih seçmek için önce doktor seçiniz.
                </p>
              )}
            </section>

            {/* SLOTS */}
            <section className="flex flex-col rounded-[28px] border border-[#E5E6EF] bg-white p-5 shadow-[0_18px_55px_rgba(36,38,80,0.05)] sm:p-6 xl:h-full xl:min-h-[520px]">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#7C78EA]">
                  03 · SAAT
                </span>

                <h2 className="mt-1 text-[19px] font-bold text-[#1B1D31]">
                  Uygun Saati Seçin
                </h2>

                {selectedDate && (
                  <p className="mt-1 text-[12px] text-[#8A91A4]">
                    {selectedDate}
                  </p>
                )}
              </div>

              <div className="mt-5 flex flex-1 flex-col">
                {!selectedDate ? (
                  <div className="flex flex-1 flex-col items-center justify-center rounded-[20px] border border-dashed border-[#DEDFE8] bg-[#FAFAFC] px-5 py-8 text-center">
                    <CalendarDays
                      size={24}
                      className="text-[#A0A6B7]"
                    />

                    <p className="mt-3 max-w-[250px] text-[12px] leading-5 text-[#9198A9]">
                      Müsait saatleri görmek için tarih seçiniz.
                    </p>
                  </div>
                ) : slotsLoading ? (
                  <div className="flex flex-1 items-center justify-center rounded-[20px] bg-[#FAFAFD] p-6 text-center text-sm text-[#7C8498]">
                    Müsait saatler kontrol ediliyor...
                  </div>
                ) : slots.length > 0 ? (
                  <div className="grid content-start grid-cols-3 gap-2 sm:grid-cols-4">
                    {slots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() =>
                          setSelectedTime(slot)
                        }
                        className={`flex items-center justify-center gap-1.5 rounded-[14px] border px-3 py-3 text-[13px] font-bold transition ${
                          selectedTime === slot
                            ? 'border-[#615FFF] bg-[#615FFF] text-white shadow-[0_8px_22px_rgba(97,95,255,0.2)]'
                            : 'border-[#E5E6EF] bg-white text-[#5D657A] hover:border-[#BDBAFF] hover:bg-[#F5F4FF] hover:text-[#5754E9]'
                        }`}
                      >
                        <Clock3 size={14} />
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-1 items-center justify-center rounded-[20px] border border-amber-200 bg-amber-50 px-5 py-6 text-center text-[12px] font-medium text-amber-700">
                    {availabilityMessage ||
                      'Bu tarihte uygun saat bulunmuyor.'}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* NOTE + CONFIRM */}
          <div className="grid items-stretch gap-5 xl:grid-cols-2">
            {/* NOTE */}
            <section className="flex flex-col rounded-[28px] border border-[#E5E6EF] bg-white p-5 shadow-[0_18px_55px_rgba(36,38,80,0.05)] sm:p-6 xl:h-full xl:min-h-[260px]">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-[13px] bg-[#F2F1FF] text-[#615FFF]">
                  <FileText size={16} />
                </div>

                <div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#9BA1B3]">
                    OPSİYONEL
                  </span>

                  <h2 className="text-[15px] font-bold text-[#25283C]">
                    Randevu Notu
                  </h2>
                </div>
              </div>

              <textarea
                value={patientNote}
                onChange={(event) =>
                  setPatientNote(event.target.value)
                }
                maxLength={500}
                rows={4}
                placeholder="Doktorunuz için kısa bir not ekleyebilirsiniz..."
                className="mt-4 min-h-[120px] flex-1 resize-none rounded-[18px] border border-[#E6E7F0] bg-[#FAFAFD] px-4 py-3 text-sm text-[#34384D] outline-none transition placeholder:text-[#ADB2C0] focus:border-[#9B98FF] focus:bg-white focus:ring-4 focus:ring-[#615FFF]/5"
              />

              <div className="mt-2 text-right text-[10px] font-medium text-[#A0A6B5]">
                {patientNote.length}/500
              </div>
            </section>

            {/* CONFIRM */}
            <section className="flex flex-col rounded-[28px] border border-[#DDDCFF] bg-[#F8F7FF] p-5 sm:p-6 xl:h-full xl:min-h-[260px]">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#7773DE]">
                  04 · ONAY
                </span>

                <h2 className="mt-1 text-[19px] font-bold text-[#1B1D31]">
                  Randevuyu Onaylayın
                </h2>

                <p className="mt-1 text-[12px] leading-5 text-[#8A91A4]">
                  Seçtiğiniz doktor, tarih ve saat bilgilerini kontrol edin.
                </p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[16px] border border-[#E6E5F7] bg-white/70 p-3">
                  <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#A0A5B5]">
                    DOKTOR
                  </div>

                  <div className="mt-1 truncate text-[12px] font-bold text-[#34374B]">
                    {selectedDoctor?.name || 'Seçilmedi'}
                  </div>
                </div>

                <div className="rounded-[16px] border border-[#E6E5F7] bg-white/70 p-3">
                  <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#A0A5B5]">
                    TARİH
                  </div>

                  <div className="mt-1 text-[12px] font-bold text-[#34374B]">
                    {selectedDate || 'Seçilmedi'}
                  </div>
                </div>

                <div className="rounded-[16px] border border-[#E6E5F7] bg-white/70 p-3">
                  <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#A0A5B5]">
                    SAAT
                  </div>

                  <div className="mt-1 text-[12px] font-bold text-[#34374B]">
                    {selectedTime || 'Seçilmedi'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={
                  booking ||
                  !selectedDoctorId ||
                  !selectedDate ||
                  !selectedTime
                }
                onClick={handleBooking}
                className="mt-auto flex w-full items-center justify-center gap-2 rounded-[16px] bg-[#615FFF] px-5 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(97,95,255,0.22)] transition hover:bg-[#5552ED] disabled:cursor-not-allowed disabled:bg-[#C9C8E9] disabled:shadow-none"
              >
                {booking
                  ? 'Randevu Oluşturuluyor...'
                  : 'Randevuyu Onayla'}

                {!booking && (
                  <ArrowRight size={17} />
                )}
              </button>
            </section>
          </div>
        </div>
      </div>
    )
  }


export default PatientBookingPage