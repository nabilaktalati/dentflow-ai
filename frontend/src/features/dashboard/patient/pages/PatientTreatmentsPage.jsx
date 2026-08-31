import {
  useEffect,
  useState,
} from 'react'

import {
  CalendarDays,
  Check,
  ChevronRight,
  CircleDot,
  ClipboardCheck,
  ClipboardList,
  FileText,
  HeartPulse,
  MapPin,
  Stethoscope,
  UserRound,
} from 'lucide-react'
import {
  PDFDownloadLink,
} from '@react-pdf/renderer'
import {
  getMyTreatments,
} from '../api/patientTreatmentsApi.js'
import TreatmentPdfReport from '../components/TreatmentPdfReport.jsx'

const statusMeta = {
  PLANNED: {
    label: 'Planlandı',
    className:
      'border-amber-200 bg-amber-50 text-amber-700',
  },

  IN_PROGRESS: {
    label: 'Devam Ediyor',
    className:
      'border-indigo-200 bg-indigo-50 text-indigo-700',
  },

  COMPLETED: {
    label: 'Tamamlandı',
    className:
      'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
}


const formatDate = (
  value,
) => {
  if (!value) {
    return 'Belirtilmedi'
  }

  return new Intl.DateTimeFormat(
    'tr-TR',
    {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    },
  ).format(
    new Date(value),
  )
}


const getStatusMeta = (
  status,
) =>
  statusMeta[status] || {
    label: status,
    className:
      'border-slate-200 bg-slate-50 text-slate-600',
  }


function TreatmentTimeline({
  status,
}) {
  const completed =
    status === 'COMPLETED'

  return (
    <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/70 px-5 py-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        Tedavi Akışı
      </p>

      <div className="mt-5 flex items-center">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-indigo-600 text-white">
            <Check className="size-3.5" />
          </span>

          <span className="hidden text-xs font-medium text-slate-700 sm:block">
            Ziyaret
          </span>
        </div>

        <div className="mx-3 h-px flex-1 bg-indigo-200" />

        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-indigo-600 text-white">
            <Check className="size-3.5" />
          </span>

          <span className="hidden text-xs font-medium text-slate-700 sm:block">
            Teşhis
          </span>
        </div>

        <div className="mx-3 h-px flex-1 bg-indigo-200" />

        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-indigo-600 text-white">
            {completed ? (
              <Check className="size-3.5" />
            ) : (
              <CircleDot className="size-3.5" />
            )}
          </span>

          <span className="hidden text-xs font-medium text-slate-700 sm:block">
            Tedavi
          </span>
        </div>

        <div
          className={`mx-3 h-px flex-1 ${
            completed
              ? 'bg-emerald-200'
              : 'bg-slate-200'
          }`}
        />

        <div className="flex items-center gap-2">
          <span
            className={`flex size-7 items-center justify-center rounded-full ${
              completed
                ? 'bg-emerald-500 text-white'
                : 'border border-slate-200 bg-white text-slate-400'
            }`}
          >
            {completed ? (
              <Check className="size-3.5" />
            ) : (
              <ChevronRight className="size-3.5" />
            )}
          </span>

          <span className="hidden text-xs font-medium text-slate-500 sm:block">
            Kontrol
          </span>
        </div>
      </div>
    </div>
  )
}


function PatientTreatmentsPage() {
  const [
    treatments,
    setTreatments,
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
    const loadTreatments =
      async () => {
        try {
          setLoading(true)
          setError('')

          const response =
            await getMyTreatments()

          setTreatments(
            response.data
              ?.treatments ||
              [],
          )
        } catch (requestError) {
          setError(
            requestError.message ||
              'Tedavi kayıtları yüklenemedi.',
          )
        } finally {
          setLoading(false)
        }
      }

    loadTreatments()
  }, [])


  return (
    <section className="space-y-7 pb-10">
      <div className="relative overflow-hidden rounded-[28px] border border-indigo-100 bg-white">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400" />

        <div className="relative px-6 py-7 md:px-8 md:py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <HeartPulse className="size-4" />
                </span>

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                  DentFlow AI
                </span>

                <span className="h-3 w-px bg-slate-200" />

                <span className="text-xs font-medium text-slate-400">
                  Hasta Tedavi Dosyası
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 md:text-[34px]">
                Tedavi Sürecim
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                Klinik ziyaretlerinize ait
                teşhis, tedavi planı ve
                doktor değerlendirmelerini
                tek bir dijital sağlık
                dosyasında takip edin.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[310px]">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-slate-400">
                  Kayıt Sayısı
                </p>

                <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  {treatments.length}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Tedavi kaydı
                </p>
              </div>

              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 px-4 py-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-indigo-400">
                  Sistem
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500" />

                  <p className="text-sm font-semibold text-slate-900">
                    Güncel
                  </p>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Klinik kaydı
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>


      {loading && (
        <div className="rounded-[26px] border border-slate-200 bg-white p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-5 w-44 rounded bg-slate-100" />
            <div className="h-4 w-72 max-w-full rounded bg-slate-100" />
            <div className="h-32 rounded-2xl bg-slate-50" />
          </div>
        </div>
      )}


      {!loading &&
        error && (
          <div className="rounded-[24px] border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {error}
          </div>
        )}


      {!loading &&
        !error &&
        treatments.length ===
          0 && (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
              <ClipboardList className="size-6" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              Henüz tedavi kaydınız yok
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Doktorunuz bir tedavi kaydı
              oluşturduğunda teşhis ve
              tedavi bilgileriniz burada
              görüntülenecektir.
            </p>
          </div>
        )}


      {!loading &&
        !error &&
        treatments.length >
          0 && (
          <div className="space-y-6">
            {treatments.map(
              (treatment) => {
                const meta =
                  getStatusMeta(
                    treatment.status,
                  )

                return (
                  <article
                    key={
                      treatment.id
                    }
                    className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.045)]"
                  >
                    <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400" />

                    <div className="border-b border-slate-100 px-6 py-5 md:px-7">
                      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 text-indigo-600">
                            <Stethoscope className="size-5" />
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="text-base font-semibold text-slate-950">
                                {
                                  treatment
                                    .doctor
                                    ?.name
                                }
                              </h2>

                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                {
                                  treatment
                                    .doctor
                                    ?.title
                                }
                              </span>
                            </div>

                            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                              <span className="flex items-center gap-1.5">
                                <MapPin className="size-3.5" />

                                {
                                  treatment
                                    .doctor
                                    ?.clinicName
                                }
                              </span>

                              <span className="flex items-center gap-1.5">
                                <CalendarDays className="size-3.5" />

                                {formatDate(
                                  treatment.visitDate,
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="hidden text-right sm:block">
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                              Randevu Kodu
                            </p>

                            <p className="mt-1 font-mono text-xs font-semibold text-indigo-600">
                              {
                                treatment
                                  .appointment
                                  ?.appointmentCode ||
                                '—'
                              }
                            </p>
                          </div>

                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${meta.className}`}
                          >
                            {meta.label}
                          </span>
                          <PDFDownloadLink
  document={
    <TreatmentPdfReport
      treatment={treatment}
    />
  }
  fileName={`DentFlow-Tedavi-Raporu-${
    treatment.appointment
      ?.appointmentCode ||
    treatment.id
  }.pdf`}
  className="inline-flex items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-xs font-semibold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100"
>
  {({ loading: pdfLoading }) =>
    pdfLoading
      ? 'PDF hazırlanıyor...'
      : 'Tedavi Raporunu İndir'
  }
</PDFDownloadLink>
                        </div>
                      </div>
                    </div>


                    <div className="grid lg:grid-cols-[1fr_330px]">
                      <div className="space-y-6 px-6 py-7 md:px-7">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="rounded-2xl border border-slate-100 bg-white p-5">
                            <div className="flex items-center gap-2">
                              <span className="flex size-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                <FileText className="size-4" />
                              </span>

                              <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-slate-400">
                                Teşhis
                              </p>
                            </div>

                            <p className="mt-4 text-sm font-medium leading-6 text-slate-800">
                              {
                                treatment.diagnosis
                              }
                            </p>
                          </div>


                          <div className="rounded-2xl border border-slate-100 bg-white p-5">
                            <div className="flex items-center gap-2">
                              <span className="flex size-8 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                <ClipboardCheck className="size-4" />
                              </span>

                              <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-slate-400">
                                Tedavi Planı
                              </p>
                            </div>

                            <p className="mt-4 text-sm font-medium leading-6 text-slate-800">
                              {
                                treatment.treatmentPlan
                              }
                            </p>
                          </div>
                        </div>


                        {treatment.doctorNotes && (
                          <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
                            <div className="absolute bottom-0 left-0 top-0 w-1 bg-indigo-500" />

                            <div className="flex items-center gap-2">
                              <UserRound className="size-4 text-indigo-600" />

                              <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-indigo-500">
                                Doktor Notu
                              </p>
                            </div>

                            <p className="mt-3 text-sm leading-6 text-slate-700">
                              {
                                treatment.doctorNotes
                              }
                            </p>
                          </div>
                        )}


                        <TreatmentTimeline
                          status={
                            treatment.status
                          }
                        />
                      </div>


                      <aside className="border-t border-slate-100 bg-slate-50/60 px-6 py-7 lg:border-l lg:border-t-0">
                        <div className="flex items-center gap-2">
                          <ClipboardList className="size-4 text-slate-400" />

                          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                            Klinik Özeti
                          </p>
                        </div>


                        <div className="mt-6 space-y-6">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                              Ziyaret Tarihi
                            </p>

                            <p className="mt-2 text-sm font-semibold text-slate-900">
                              {formatDate(
                                treatment.visitDate,
                              )}
                            </p>
                          </div>


                          <div className="h-px bg-slate-200/70" />


                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                              Randevu Kodu
                            </p>

                            <p className="mt-2 font-mono text-sm font-semibold text-indigo-600">
                              {
                                treatment
                                  .appointment
                                  ?.appointmentCode ||
                                'Belirtilmedi'
                              }
                            </p>
                          </div>


                          <div className="h-px bg-slate-200/70" />


                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                              Sonraki Kontrol
                            </p>

                            <p className="mt-2 text-sm font-semibold text-slate-900">
                              {formatDate(
                                treatment.nextVisitDate,
                              )}
                            </p>
                          </div>


                          <div className="h-px bg-slate-200/70" />


                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                              Tedavi Durumu
                            </p>

                            <div className="mt-2 flex items-center gap-2">
                              <span className="size-2 rounded-full bg-indigo-500" />

                              <p className="text-sm font-semibold text-slate-900">
                                {
                                  meta.label
                                }
                              </p>
                            </div>
                          </div>
                        </div>


                        <div className="mt-7 rounded-2xl border border-white bg-white p-4 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                              <HeartPulse className="size-4" />
                            </div>

                            <div>
                              <p className="text-xs font-semibold text-slate-900">
                                DentFlow AI
                              </p>

                              <p className="mt-0.5 text-[10px] text-slate-400">
                                Akıllı Klinik Yönetimi
                              </p>
                            </div>
                          </div>
                        </div>
                      </aside>
                    </div>
                  </article>
                )
              },
            )}
          </div>
        )}
    </section>
  )
}


export default PatientTreatmentsPage