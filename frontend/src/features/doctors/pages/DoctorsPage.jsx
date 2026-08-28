import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  ArrowRight,
  RefreshCw,
  Search,
  Stethoscope,
  UserRound,
} from 'lucide-react'

import {
  AnimatePresence,
  motion,
} from 'motion/react'

import DoctorDetailsModal from '../components/DoctorDetailsModal.jsx'

import {
  getPublicDoctors,
} from '../api/doctorsApi.js'


function DoctorsPage() {
  const [
    doctors,
    setDoctors,
  ] = useState([])

  const [
    searchTerm,
    setSearchTerm,
  ] = useState('')

  const [
    selectedDoctor,
    setSelectedDoctor,
  ] = useState(null)

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState('')


  const fetchDoctors =
    async () => {
      const response =
        await getPublicDoctors()

      const receivedDoctors =
        response.data?.doctors ||
        []

      /*
       * Eski arayüzün kullandığı
       * name / role / image alanlarını
       * gerçek API verilerinden üretiyoruz.
       */
      return receivedDoctors.map(
        (doctor) => ({
          ...doctor,

          name:
            doctor.name ||
            `${doctor.firstName} ${doctor.lastName}`,

          role:
            doctor.title ||
            'Diş Hekimi',

          image:
            doctor.profileImageUrl ||
            '',
        }),
      )
    }


  const loadDoctors =
    async () => {
      setLoading(true)
      setError('')

      try {
        const normalizedDoctors =
          await fetchDoctors()

        setDoctors(
          normalizedDoctors,
        )
      } catch (requestError) {
        setError(
          requestError.message ||
            'Doktor bilgileri yüklenemedi.',
        )
      } finally {
        setLoading(false)
      }
    }


  useEffect(() => {
    let cancelled = false

    fetchDoctors()
      .then(
        (
          normalizedDoctors,
        ) => {
          if (cancelled) {
            return
          }

          setDoctors(
            normalizedDoctors,
          )

          setError('')
        },
      )
      .catch(
        (requestError) => {
          if (cancelled) {
            return
          }

          setError(
            requestError.message ||
              'Doktor bilgileri yüklenemedi.',
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


  const filteredDoctors =
    useMemo(() => {
      const query =
        searchTerm
          .trim()
          .toLocaleLowerCase(
            'tr-TR',
          )

      if (!query) {
        return doctors
      }

      return doctors.filter(
        (doctor) => {
          const searchableText = [
            doctor.name,
            doctor.role,
            doctor.location,
            doctor.clinicName,
          ]
            .filter(Boolean)
            .join(' ')
            .toLocaleLowerCase(
              'tr-TR',
            )

          return searchableText.includes(
            query,
          )
        },
      )
    }, [
      doctors,
      searchTerm,
    ])


  return (
    <>
      <div className="min-h-screen bg-[#F8FAFD]">

        {/* HEADER */}
        <section className="border-b border-slate-200/70">
          <div className="mx-auto max-w-[1240px] px-6 pb-10 pt-16 lg:px-10 lg:pb-12 lg:pt-20">
            <motion.div
              initial={{
                opacity: 0,
                y: 16,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.45,
              }}
            >
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[#5956F5]" />

                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5956F5]">
                  Doktorlarımız
                </span>
              </div>


              <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h1 className="font-heading text-[clamp(2.5rem,4vw,4rem)] font-semibold tracking-[-0.055em] text-[#111827]">
                    Diş hekimlerimizle tanışın.
                  </h1>

                  <p className="mt-3 max-w-[560px] text-[15px] leading-7 text-slate-500">
                    Doktorlarımızı inceleyin ve detaylarını görüntüleyerek randevu sürecine geçin.
                  </p>
                </div>


                <div className="relative w-full lg:w-[310px]">
                  <Search
                    size={17}
                    strokeWidth={1.8}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="search"
                    value={
                      searchTerm
                    }
                    onChange={(
                      event,
                    ) =>
                      setSearchTerm(
                        event.target
                          .value,
                      )
                    }
                    placeholder="Doktor ara"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-[#111827] outline-none transition focus:border-[#5956F5]/40 focus:ring-4 focus:ring-[#5956F5]/[0.05]"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>


        {/* DOCTOR LIST */}
        <section>
          <div className="mx-auto max-w-[1240px] px-6 py-12 lg:px-10 lg:py-16">

            {/* LOADING */}
            {loading && (
              <div className="space-y-3">
                {[0, 1, 2].map(
                  (item) => (
                    <div
                      key={item}
                      className="h-[104px] animate-pulse rounded-[22px] border border-slate-200 bg-white"
                    />
                  ),
                )}
              </div>
            )}


            {/* ERROR */}
            {!loading &&
              error && (
                <div className="rounded-[28px] border border-red-100 bg-white px-6 py-14 text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                    <RefreshCw
                      size={20}
                    />
                  </div>

                  <h2 className="mt-4 font-heading text-lg font-semibold text-[#111827]">
                    Doktorlar yüklenemedi
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={
                      loadDoctors
                    }
                    className="mt-5 rounded-xl bg-[#5956F5] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4F4CE3]"
                  >
                    Tekrar Dene
                  </button>
                </div>
              )}


            {!loading &&
              !error && (
                <>
                  <div className="mb-5 flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-500">
                      {
                        filteredDoctors.length
                      }{' '}
                      doktor
                    </p>
                  </div>


                  <AnimatePresence mode="popLayout">
                    {filteredDoctors.length >
                    0 ? (
                      <motion.div
                        layout
                        className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white"
                      >
                        {filteredDoctors.map(
                          (
                            doctor,
                            index,
                          ) => (
                            <motion.article
                              layout
                              key={
                                doctor.id
                              }
                              initial={{
                                opacity: 0,
                                y: 8,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                              }}
                              exit={{
                                opacity: 0,
                              }}
                              transition={{
                                duration:
                                  0.25,
                              }}
                              className={`group flex flex-col gap-5 px-6 py-6 transition-colors hover:bg-[#5956F5]/[0.025] sm:flex-row sm:items-center ${
                                index !==
                                filteredDoctors.length -
                                  1
                                  ? 'border-b border-slate-100'
                                  : ''
                              }`}
                            >
                              <div className="flex flex-1 items-center gap-5">

                                {/* PROFILE IMAGE */}
                                <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-[18px] border border-slate-200 bg-[linear-gradient(145deg,#F1EFFF,#EAF3FF)]">
                                  {doctor.image ? (
                                    <img
                                      src={
                                        doctor.image
                                      }
                                      alt={
                                        doctor.name
                                      }
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-sm font-bold text-[#5956F5]">
                                      {`${doctor.firstName?.charAt(0) || ''}${doctor.lastName?.charAt(0) || ''}`.toUpperCase()}
                                    </span>
                                  )}
                                </div>


                                <div className="min-w-0">
                                  <h2 className="truncate font-heading text-[19px] font-semibold tracking-[-0.025em] text-[#111827]">
                                    {
                                      doctor.name
                                    }
                                  </h2>

                                  <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-400">
                                    <Stethoscope
                                      size={
                                        14
                                      }
                                      strokeWidth={
                                        1.8
                                      }
                                    />

                                    {
                                      doctor.role
                                    }
                                  </div>


                                  {(doctor.experienceYears >
                                    0 ||
                                    doctor.location) && (
                                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400">
                                      {doctor.experienceYears >
                                        0 && (
                                        <span>
                                          {
                                            doctor.experienceYears
                                          }{' '}
                                          yıl deneyim
                                        </span>
                                      )}

                                      {doctor.location && (
                                        <span>
                                          {
                                            doctor.location
                                          }
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>


                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedDoctor(
                                    doctor,
                                  )
                                }
                                className="group/button flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[13px] font-semibold text-[#111827] transition-all hover:border-[#5956F5]/25 hover:text-[#5956F5] hover:shadow-sm"
                              >
                                Detayları Gör

                                <ArrowRight
                                  size={
                                    15
                                  }
                                  strokeWidth={
                                    2
                                  }
                                  className="transition-transform duration-300 group-hover/button:translate-x-1"
                                />
                              </button>
                            </motion.article>
                          ),
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{
                          opacity: 0,
                        }}
                        animate={{
                          opacity: 1,
                        }}
                        className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center"
                      >
                        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                          <UserRound
                            size={
                              20
                            }
                          />
                        </div>

                        <h2 className="mt-4 font-heading text-lg font-semibold text-[#111827]">
                          Doktor bulunamadı
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                          Arama kriterinizi değiştirerek tekrar deneyin.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
          </div>
        </section>
      </div>


      <DoctorDetailsModal
        key={
          selectedDoctor?.id
        }
        doctor={
          selectedDoctor
        }
        onClose={() =>
          setSelectedDoctor(
            null,
          )
        }
      />
    </>
  )
}


export default DoctorsPage