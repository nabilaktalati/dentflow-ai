import {
  CalendarDays,
  Clock3,
  FileText,
  Phone,
  UserRound,
} from 'lucide-react'

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  getDoctorAppointments,
} from '../api/doctorAppointmentsApi.js'


const statusConfig = {
  PENDING: {
    label: 'Onay Bekliyor',
    className:
      'border-amber-200 bg-amber-50 text-amber-700',
  },

  CONFIRMED: {
    label: 'Onaylandı',
    className:
      'border-emerald-200 bg-emerald-50 text-emerald-700',
  },

  COMPLETED: {
    label: 'Tamamlandı',
    className:
      'border-blue-200 bg-blue-50 text-blue-700',
  },

  CANCELLED: {
    label: 'İptal Edildi',
    className:
      'border-rose-200 bg-rose-50 text-rose-700',
  },

  NO_SHOW: {
    label: 'Gelmedi',
    className:
      'border-slate-200 bg-slate-50 text-slate-600',
  },
}


const dateFormatter =
  new Intl.DateTimeFormat(
    'tr-TR',
    {
      timeZone: 'Europe/Istanbul',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    },
  )


const timeFormatter =
  new Intl.DateTimeFormat(
    'tr-TR',
    {
      timeZone: 'Europe/Istanbul',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    },
  )


const DoctorAppointmentsList =
  () => {
    const [
      appointments,
      setAppointments,
    ] = useState([])

    const [
      loading,
      setLoading,
    ] = useState(true)

    const [
      error,
      setError,
    ] = useState('')


    useEffect(() => {
      getDoctorAppointments()
        .then((response) => {
          setAppointments(
            response.data?.appointments ||
              [],
          )
        })
        .catch((requestError) => {
          setError(
            requestError.message ||
              'Randevular yüklenemedi.',
          )
        })
        .finally(() => {
          setLoading(false)
        })
    }, [])


    const upcomingCount =
      useMemo(
        () =>
          appointments.filter(
            (appointment) =>
              new Date(
                appointment.endAt,
              ) >= new Date() &&
              appointment.status !==
                'CANCELLED',
          ).length,
        [appointments],
      )


    if (loading) {
      return (
        <div className="rounded-[26px] border border-[#E6E7F0] bg-white p-7 text-sm text-[#7B8399] shadow-sm">
          Randevular yükleniyor...
        </div>
      )
    }


    if (error) {
      return (
        <div className="rounded-[22px] border border-rose-200 bg-rose-50 p-5 text-sm font-medium text-rose-700">
          {error}
        </div>
      )
    }


    return (
      <div className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6A67F4]">
              RANDEVU AKIŞI
            </span>

            <h2 className="mt-1 text-[20px] font-bold tracking-[-0.025em] text-[#1B1D31]">
              Randevularım
            </h2>

            <p className="mt-1 text-[13px] leading-6 text-[#7B8399]">
              Hastalarınız tarafından
              oluşturulan randevuları
              görüntüleyin.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="min-w-[100px] rounded-[17px] border border-[#E6E7F0] bg-white px-4 py-3">
              <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#9DA4B7]">
                TOPLAM
              </div>

              <div className="mt-1 text-xl font-bold text-[#1B1D31]">
                {appointments.length}
              </div>
            </div>

            <div className="min-w-[100px] rounded-[17px] border border-[#DFDEFF] bg-[#F5F4FF] px-4 py-3">
              <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#7773DE]">
                YAKLAŞAN
              </div>

              <div className="mt-1 text-xl font-bold text-[#605DF5]">
                {upcomingCount}
              </div>
            </div>
          </div>
        </div>


        {appointments.length === 0 ? (
          <div className="rounded-[26px] border border-[#E6E7F0] bg-white px-6 py-14 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-[18px] bg-[#F2F1FF] text-[#615FFF]">
              <CalendarDays size={23} />
            </div>

            <h3 className="mt-4 text-[17px] font-bold text-[#1B1D31]">
              Henüz randevu bulunmuyor
            </h3>

            <p className="mt-2 text-sm text-[#858CA2]">
              Hasta rezervasyonları burada
              görüntülenecektir.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map(
              (appointment) => {
                const status =
                  statusConfig[
                    appointment.status
                  ] || statusConfig.PENDING

                return (
                  <article
                    key={appointment.id}
                    className="overflow-hidden rounded-[26px] border border-[#E5E6EF] bg-white shadow-[0_16px_45px_rgba(36,38,80,0.05)]"
                  >
                    <div className="h-[3px] bg-gradient-to-r from-[#615FFF] via-[#7770FF] to-[#54B8FF]" />

                    <div className="p-5 sm:p-6">
                      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                        <div className="flex min-w-0 items-start gap-4">
                          <div className="flex size-[52px] shrink-0 items-center justify-center rounded-[18px] border border-[#E4E4F4] bg-[#F3F2FF] text-[#615FFF]">
                            <UserRound size={21} />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2.5">
                              <h3 className="text-[18px] font-bold tracking-[-0.02em] text-[#1B1D31]">
                                {appointment.patient
                                  ?.name ||
                                  'Hasta'}
                              </h3>

                              <span
                                className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${status.className}`}
                              >
                                {status.label}
                              </span>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
                              <div className="flex items-center gap-2 text-[13px] font-medium text-[#5F687E]">
                                <CalendarDays
                                  size={16}
                                  className="text-[#615FFF]"
                                />

                                {dateFormatter.format(
                                  new Date(
                                    appointment.startAt,
                                  ),
                                )}
                              </div>

                              <div className="flex items-center gap-2 text-[13px] font-medium text-[#5F687E]">
                                <Clock3
                                  size={16}
                                  className="text-[#615FFF]"
                                />

                                {timeFormatter.format(
                                  new Date(
                                    appointment.startAt,
                                  ),
                                )}

                                <span className="text-[#B0B5C4]">
                                  –
                                </span>

                                {timeFormatter.format(
                                  new Date(
                                    appointment.endAt,
                                  ),
                                )}
                              </div>

                              {appointment.patient
                                ?.phone && (
                                <div className="flex items-center gap-2 text-[13px] font-medium text-[#5F687E]">
                                  <Phone
                                    size={16}
                                    className="text-[#615FFF]"
                                  />

                                  {
                                    appointment
                                      .patient.phone
                                  }
                                </div>
                              )}
                            </div>
                          </div>
                        </div>


                        <div className="rounded-[18px] border border-[#E8E8F2] bg-[#FAFAFD] px-5 py-4 lg:min-w-[190px]">
                          <div className="text-[9px] font-bold uppercase tracking-[0.19em] text-[#9BA1B4]">
                            RANDEVU KODU
                          </div>

                          <div className="mt-2 font-mono text-[14px] font-bold tracking-[0.08em] text-[#5653E8]">
                            {
                              appointment.appointmentCode
                            }
                          </div>
                        </div>
                      </div>


                      {appointment.patientNote && (
                        <>
                          <div className="my-5 h-px bg-[#EEEFF5]" />

                          <div className="flex items-start gap-3">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#F3F2FF] text-[#6A67F4]">
                              <FileText size={15} />
                            </div>

                            <div>
                              <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#9BA1B3]">
                                HASTA NOTU
                              </div>

                              <p className="mt-1.5 text-[13px] leading-6 text-[#626A7F]">
                                {
                                  appointment.patientNote
                                }
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </article>
                )
              },
            )}
          </div>
        )}
      </div>
    )
  }


export default DoctorAppointmentsList