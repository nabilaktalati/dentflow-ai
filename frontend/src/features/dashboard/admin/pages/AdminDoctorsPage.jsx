import {
  BriefcaseBusiness,
  Check,
  Copy,
  Eye,
  EyeOff,
  FileText,
  GraduationCap,
  ImagePlus,
  KeyRound,
  Mail,
  MapPin,
  Pencil,
  Plus,
  ShieldCheck,
  Stethoscope,
  Trash2,
  Upload,
  X,
} from 'lucide-react'

import {
  AnimatePresence,
  motion,
} from 'motion/react'

import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  createDoctor as createDoctorRequest,
  deleteDoctor as deleteDoctorRequest,
  getDoctors as getDoctorsRequest,
  updateDoctor as updateDoctorRequest,
  uploadDoctorProfileImage as uploadDoctorProfileImageRequest,
  uploadDoctorCv as uploadDoctorCvRequest,
} from '../api/adminDoctorsApi.js'


const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  title: 'Diş Hekimi',
  experienceYears: '0',
  clinicName: 'DentFlow Dental Clinic',
  location: '',
}


export default function AdminDoctorsPage() {
  const [
    createModalOpen,
    setCreateModalOpen,
  ] = useState(false)

  const [
    submitting,
    setSubmitting,
  ] = useState(false)

  const [
    form,
    setForm,
  ] = useState(initialForm)

  const [
    formError,
    setFormError,
  ] = useState('')

  const [
    fieldErrors,
    setFieldErrors,
  ] = useState({})

  const [
    createdDoctor,
    setCreatedDoctor,
  ] = useState(null)

  const [
    doctors,
    setDoctors,
  ] = useState([])

  const [
    doctorsLoading,
    setDoctorsLoading,
  ] = useState(true)

  const [
    doctorsError,
    setDoctorsError,
  ] = useState('')

  const [
    editingDoctor,
    setEditingDoctor,
  ] = useState(null)

  const [
    deletingDoctor,
    setDeletingDoctor,
  ] = useState(null)


  const loadDoctors =
    useCallback(async () => {
      setDoctorsLoading(true)
      setDoctorsError('')

      try {
        const response =
          await getDoctorsRequest()

        setDoctors(
          response.data?.doctors || [],
        )
      } catch (error) {
        setDoctorsError(
          error.message ||
            'Doktor kayıtları yüklenemedi.',
        )
      } finally {
        setDoctorsLoading(false)
      }
    }, [])


 useEffect(() => {
  let cancelled = false

  getDoctorsRequest()
    .then((response) => {
      if (cancelled) {
        return
      }

      setDoctors(
        response.data?.doctors || [],
      )

      setDoctorsError('')
    })
    .catch((error) => {
      if (cancelled) {
        return
      }

      setDoctorsError(
        error.message ||
          'Doktor kayıtları yüklenemedi.',
      )
    })
    .finally(() => {
      if (cancelled) {
        return
      }

      setDoctorsLoading(false)
    })

  return () => {
    cancelled = true
  }
}, [])

  const openCreateModal = () => {
    setForm(initialForm)
    setFormError('')
    setFieldErrors({})
    setCreateModalOpen(true)
  }


  const closeCreateModal = () => {
    if (submitting) {
      return
    }

    setCreateModalOpen(false)
  }


  const handleChange = (
    event,
  ) => {
    const {
      name,
      value,
    } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    if (fieldErrors[name]) {
      setFieldErrors(
        (current) => ({
          ...current,
          [name]: undefined,
        }),
      )
    }
  }


  const handleSubmit = async (
    event,
  ) => {
    event.preventDefault()

    setSubmitting(true)
    setFormError('')
    setFieldErrors({})

    try {
      const result =
        await createDoctorRequest({
          firstName:
            form.firstName,

          lastName:
            form.lastName,

          email:
            form.email,

          title:
            form.title,

          experienceYears:
            Number(
              form.experienceYears,
            ),

          clinicName:
            form.clinicName,

          location:
            form.location,
        })

      setCreateModalOpen(false)

      setCreatedDoctor({
        doctor:
          result.doctor,

        temporaryPassword:
          result.temporaryPassword,
      })

      void loadDoctors()

      setForm(initialForm)
    } catch (error) {
      setFormError(
        error.message ||
          'Doktor hesabı oluşturulamadı.',
      )

      setFieldErrors(
        error.errors || {},
      )
    } finally {
      setSubmitting(false)
    }
  }


  const handleDoctorUpdated =
    useCallback(
      (updatedDoctor) => {
        if (!updatedDoctor?.id) {
          return
        }

        setDoctors(
          (current) =>
            current
              .map((doctor) =>
                doctor.id ===
                updatedDoctor.id
                  ? {
                      ...doctor,
                      ...updatedDoctor,
                    }
                  : doctor,
              )
              .sort(
                (
                  firstDoctor,
                  secondDoctor,
                ) =>
                  (firstDoctor.displayOrder ??
                    0) -
                  (secondDoctor.displayOrder ??
                    0),
              ),
        )
      },
      [],
    )


  const handleDoctorDeleted =
    useCallback(
      (doctorId) => {
        setDoctors(
          (current) =>
            current.filter(
              (doctor) =>
                doctor.id !==
                doctorId,
            ),
        )

        setDeletingDoctor(
          null,
        )

        setEditingDoctor(
          (current) =>
            current?.id ===
            doctorId
              ? null
              : current,
        )
      },
      [],
    )


  return (
    <>
      <div className="mx-auto w-full max-w-[1400px] px-4 py-7 sm:px-6 lg:px-8 lg:py-8">

        {/* HEADER */}
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
          }}
          className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#625BF6]">
              Yönetici Paneli
            </p>

            <h1 className="mt-2 text-[38px] font-bold leading-[1.05] tracking-[-0.04em] text-[#101828] sm:text-[42px]">
              Doktor Yönetimi
            </h1>

            <p className="mt-3 max-w-[650px] text-[14px] leading-6 text-[#6F7A8E]">
              Doktor hesaplarını güvenli şekilde oluşturun ve klinik erişim süreçlerini yönetin.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[14px] bg-[#625BF6] px-4 text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(98,91,246,0.22)] transition hover:-translate-y-0.5 hover:bg-[#564FE7]"
          >
            <Plus
              size={17}
              strokeWidth={2}
            />

            Yeni Doktor Ekle
          </button>
        </motion.div>


        {/* INFORMATION PANEL */}
        <motion.section
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
            delay: 0.06,
          }}
          className="mt-7 overflow-hidden rounded-[24px] border border-white/80 bg-white/65 shadow-[0_18px_50px_rgba(69,61,128,0.06)] backdrop-blur-xl"
        >
          <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="grid size-12 shrink-0 place-items-center rounded-[15px] bg-[#EFEAFF] text-[#625BF6]">
                <Stethoscope
                  size={20}
                  strokeWidth={1.9}
                />
              </div>

              <div>
                <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-[#172033]">
                  Klinik doktor hesapları
                </h2>

                <p className="mt-1.5 max-w-[620px] text-[13px] leading-5 text-[#7A8497]">
                  Yeni doktor hesapları yalnızca yönetici tarafından oluşturulur. Her yeni doktor için güvenli bir geçici parola üretilir.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-3.5 py-2 text-[11px] font-semibold text-emerald-700">
              <ShieldCheck
                size={14}
                strokeWidth={2}
              />

              ADMIN yetkisi gerekli
            </div>
          </div>


          <div className="border-t border-[#EEF0F5] bg-[#FAFAFE]/65 px-4 py-4 sm:px-6 sm:py-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#8A94A6]">
                  Kayıtlı doktorlar
                </p>

                <p className="mt-1 text-[12px] text-[#98A2B3]">
                  Hesap ve klinik profil durumlarını tek alandan takip edin.
                </p>
              </div>

              {!doctorsLoading && !doctorsError && (
                <span className="w-fit rounded-full border border-[#E3E0F7] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#625BF6]">
                  {doctors.length} doktor
                </span>
              )}
            </div>


            {doctorsLoading && (
              <div className="space-y-3">
                {[0, 1, 2].map((item) => (
                  <div
                    key={item}
                    className="h-[92px] animate-pulse rounded-[18px] border border-[#ECEBF3] bg-white/70"
                  />
                ))}
              </div>
            )}


            {!doctorsLoading && doctorsError && (
              <div className="flex min-h-[170px] flex-col items-center justify-center rounded-[18px] border border-red-100 bg-red-50/70 px-5 text-center">
                <p className="text-[13px] font-semibold text-red-700">
                  Doktor kayıtları yüklenemedi
                </p>

                <p className="mt-1.5 max-w-[420px] text-[12px] leading-5 text-red-600/75">
                  {doctorsError}
                </p>

                <button
                  type="button"
                  onClick={loadDoctors}
                  className="mt-4 h-9 rounded-[11px] bg-white px-4 text-[11px] font-semibold text-red-700 shadow-sm transition hover:bg-red-50"
                >
                  Tekrar Dene
                </button>
              </div>
            )}


            {!doctorsLoading &&
              !doctorsError &&
              doctors.length === 0 && (
                <div className="flex min-h-[190px] flex-col items-center justify-center text-center">
                  <div className="grid size-12 place-items-center rounded-[16px] border border-[#E7E4F7] bg-white text-[#8A84E8] shadow-sm">
                    <Stethoscope
                      size={19}
                      strokeWidth={1.8}
                    />
                  </div>

                  <h3 className="mt-4 text-[15px] font-semibold text-[#344054]">
                    Henüz doktor eklenmedi
                  </h3>

                  <p className="mt-1.5 max-w-[420px] text-[12.5px] leading-5 text-[#8A94A6]">
                    İlk doktor hesabını oluşturduğunuzda burada gerçek verilerle görüntülenecek.
                  </p>
                </div>
              )}


            {!doctorsLoading &&
              !doctorsError &&
              doctors.length > 0 && (
                <div className="space-y-3">
                  {doctors.map(
                    (doctor, index) => (
                      <motion.article
                        key={doctor.id}
                        initial={{
                          opacity: 0,
                          y: 8,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          duration: 0.32,
                          delay:
                            Math.min(
                              index * 0.04,
                              0.2,
                            ),
                        }}
                        className="group rounded-[18px] border border-[#ECEBF3] bg-white/82 p-4 shadow-[0_8px_22px_rgba(56,49,107,0.035)] transition duration-300 hover:-translate-y-0.5 hover:border-[#DED9FA] hover:shadow-[0_14px_30px_rgba(78,68,150,0.07)]"
                      >
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                          <div className="flex min-w-0 flex-1 items-start gap-3.5">
                            <div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-[14px] bg-[linear-gradient(145deg,#EEEAFE,#E5EFFF)] text-[14px] font-bold text-[#625BF6]">
                              {doctor.profileImageUrl ? (
                                <img
                                  src={doctor.profileImageUrl}
                                  alt=""
                                  className="size-full object-cover"
                                />
                              ) : (
                                `${doctor.firstName?.charAt(0) || ''}${doctor.lastName?.charAt(0) || ''}`.toUpperCase()
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="truncate text-[14px] font-semibold text-[#273142]">
                                  {doctor.firstName} {doctor.lastName}
                                </h3>

                                <span className="rounded-full bg-[#F1EFFF] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-[#625BF6]">
                                  {doctor.title}
                                </span>
                              </div>

                              <div className="mt-2 flex min-w-0 items-center gap-1.5 text-[11.5px] text-[#7A8497]">
                                <Mail
                                  size={13}
                                  strokeWidth={1.8}
                                  className="shrink-0"
                                />
                                <span className="truncate">
                                  {doctor.email}
                                </span>
                              </div>
                            </div>
                          </div>


                          <div className="grid gap-2 sm:grid-cols-3 xl:w-[470px]">
                            <DoctorMeta
                              icon={BriefcaseBusiness}
                              label="Deneyim"
                              value={`${doctor.experienceYears ?? 0} yıl`}
                            />

                            <DoctorMeta
                              icon={MapPin}
                              label="Konum"
                              value={
                                doctor.location ||
                                'Belirtilmedi'
                              }
                            />

                            <DoctorMeta
                              icon={KeyRound}
                              label="İlk giriş"
                              value={
                                doctor.mustChangePassword
                                  ? 'Şifre bekleniyor'
                                  : 'Tamamlandı'
                              }
                              accent={
                                doctor.mustChangePassword
                              }
                            />
                          </div>


                          <div className="flex shrink-0 items-center gap-2 xl:w-[112px] xl:justify-end">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${
                                doctor.accountStatus === 'ACTIVE' &&
                                doctor.isActive
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              <span
                                className={`size-1.5 rounded-full ${
                                  doctor.accountStatus === 'ACTIVE' &&
                                  doctor.isActive
                                    ? 'bg-emerald-500'
                                    : 'bg-amber-500'
                                }`}
                              />

                              {doctor.accountStatus === 'ACTIVE' &&
                              doctor.isActive
                                ? 'Aktif'
                                : 'Pasif'}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-col gap-3 border-t border-[#F0EFF5] pt-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[10.5px] text-[#98A2B3]">
                            <span>
                              Klinik: {doctor.clinicName || 'DentFlow Dental Clinic'}
                            </span>

                            <span>
                              E-posta: {doctor.isEmailVerified ? 'Doğrulandı' : 'Bekliyor'}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setEditingDoctor(
                                  doctor,
                                )
                              }
                              className="inline-flex h-8 w-fit items-center justify-center gap-1.5 rounded-[10px] border border-[#E2DFFA] bg-[#F8F7FF] px-3 text-[10.5px] font-semibold text-[#625BF6] transition hover:-translate-y-0.5 hover:border-[#CFC9FA] hover:bg-[#F1EFFF]"
                            >
                              <Pencil
                                size={12}
                                strokeWidth={2}
                              />
                              Profili Düzenle
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setDeletingDoctor(
                                  doctor,
                                )
                              }
                              className="inline-flex h-8 w-fit items-center justify-center gap-1.5 rounded-[10px] border border-red-200 bg-red-50 px-3 text-[10.5px] font-semibold text-red-600 transition hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-100"
                            >
                              <Trash2
                                size={12}
                                strokeWidth={2}
                              />
                              Sil
                            </button>
                          </div>
                        </div>
                      </motion.article>
                    ),
                  )}
                </div>
              )}
          </div>
        </motion.section>
      </div>


      {/* CREATE DOCTOR MODAL */}
      <AnimatePresence>
        {createModalOpen && (
          <div className="fixed inset-0 z-[80] grid place-items-center p-4 sm:p-6">
            <motion.button
              type="button"
              aria-label="Pencereyi kapat"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={closeCreateModal}
              className="absolute inset-0 bg-[#111124]/50 backdrop-blur-[5px]"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="create-doctor-title"
              initial={{
                opacity: 0,
                y: 18,
                scale: 0.975,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 12,
                scale: 0.98,
              }}
              transition={{
                duration: 0.3,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="relative z-10 w-full max-w-[680px] overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(145deg,#17172E_0%,#211F4A_58%,#292461_100%)] text-white shadow-[0_32px_90px_rgba(18,18,37,0.42)]"
            >
              <div className="flex items-start justify-between border-b border-white/10 px-6 py-5 sm:px-7">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#9D96FF]">
                    Doktor Yönetimi
                  </p>

                  <h2
                    id="create-doctor-title"
                    className="mt-1.5 text-[22px] font-semibold tracking-[-0.025em] text-white"
                  >
                    Yeni Doktor Ekle
                  </h2>

                  <p className="mt-1.5 text-[12px] leading-5 text-white/45">
                    Doktor hesabı ve klinik profilini güvenli şekilde oluşturun.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeCreateModal}
                  disabled={submitting}
                  aria-label="Pencereyi kapat"
                  className="grid size-10 shrink-0 place-items-center rounded-[12px] border border-white/10 bg-white/[0.05] text-white/55 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="max-h-[min(70vh,650px)] overflow-y-auto px-6 py-6 sm:px-7">
                  {formError && (
                    <div className="mb-5 rounded-[14px] border border-red-300/20 bg-red-400/10 px-4 py-3 text-[12px] font-medium text-red-100">
                      {formError}
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Ad"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      error={fieldErrors.firstName?.[0]}
                      required
                    />

                    <Field
                      label="Soyad"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      error={fieldErrors.lastName?.[0]}
                      required
                    />
                  </div>

                  <div className="mt-4">
                    <Field
                      label="E-posta"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      error={fieldErrors.email?.[0]}
                      required
                    />
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Ünvan"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      error={fieldErrors.title?.[0]}
                    />

                    <Field
                      label="Deneyim Yılı"
                      name="experienceYears"
                      type="number"
                      min="0"
                      max="70"
                      value={form.experienceYears}
                      onChange={handleChange}
                      error={fieldErrors.experienceYears?.[0]}
                    />
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Klinik"
                      name="clinicName"
                      value={form.clinicName}
                      onChange={handleChange}
                      error={fieldErrors.clinicName?.[0]}
                    />

                    <Field
                      label="Konum"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      error={fieldErrors.location?.[0]}
                      placeholder="Örn. İstanbul"
                    />
                  </div>

                  <div className="mt-5 rounded-[16px] border border-[#8D85FF]/20 bg-[#8D85FF]/[0.08] p-4">
                    <div className="flex gap-3">
                      <div className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-[#7168FF]/20 text-[#AAA5FF]">
                        <ShieldCheck
                          size={17}
                          strokeWidth={1.9}
                        />
                      </div>

                      <div>
                        <p className="text-[12px] font-semibold text-[#D5D2FF]">
                          Geçici parola otomatik oluşturulur
                        </p>

                        <p className="mt-1 text-[11.5px] leading-5 text-white/42">
                          Parola sunucu tarafından güvenli şekilde üretilecek ve hesap oluşturulduktan sonra yalnızca bir kez gösterilecektir.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-white/10 bg-black/[0.08] px-6 py-4 sm:px-7">
                  <button
                    type="button"
                    onClick={closeCreateModal}
                    disabled={submitting}
                    className="h-10 rounded-[12px] border border-white/10 bg-white/[0.05] px-4 text-[12px] font-semibold text-white/65 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
                  >
                    Vazgeç
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex h-10 min-w-[156px] items-center justify-center gap-2 rounded-[12px] bg-[#7168FF] px-4 text-[12px] font-semibold text-white shadow-[0_10px_24px_rgba(113,104,255,0.28)] transition hover:-translate-y-0.5 hover:bg-[#655CF0] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
                  >
                    {submitting
                      ? 'Oluşturuluyor...'
                      : 'Doktoru Oluştur'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* EDIT DOCTOR MODAL */}
      <AnimatePresence>
        {editingDoctor && (
          <EditDoctorModal
            doctor={
              editingDoctor
            }
            onClose={() =>
              setEditingDoctor(
                null,
              )
            }
            onSaved={
              handleDoctorUpdated
            }
          />
        )}
      </AnimatePresence>


      {/* DELETE DOCTOR MODAL */}
      <AnimatePresence>
        {deletingDoctor && (
          <DeleteDoctorModal
            doctor={
              deletingDoctor
            }
            onClose={() =>
              setDeletingDoctor(
                null,
              )
            }
            onDeleted={
              handleDoctorDeleted
            }
          />
        )}
      </AnimatePresence>


      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {createdDoctor && (
          <DoctorCreatedModal
            data={
              createdDoctor
            }
            onClose={() =>
              setCreatedDoctor(
                null,
              )
            }
          />
        )}
      </AnimatePresence>
    </>
  )
}


function DoctorMeta({
  icon: Icon,
  label,
  value,
  accent = false,
}) {
  return (
    <div className="rounded-[13px] bg-[#F8F7FC] px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[9.5px] font-medium uppercase tracking-[0.08em] text-[#A0A7B5]">
        <Icon
          size={12}
          strokeWidth={1.8}
        />
        {label}
      </div>

      <p
        className={`mt-1 truncate text-[11.5px] font-semibold ${
          accent
            ? 'text-amber-600'
            : 'text-[#475467]'
        }`}
      >
        {value}
      </p>
    </div>
  )
}


function Field({
  label,
  error,
  ...props
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold text-white/55">
        {label}
      </span>

      <input
        {...props}
        className={`h-11 w-full rounded-[12px] border bg-white/[0.065] px-3.5 text-[13px] text-white outline-none transition placeholder:text-white/25 ${
          error
            ? 'border-red-300/45 focus:border-red-300 focus:ring-4 focus:ring-red-300/10'
            : 'border-white/10 hover:border-white/20 focus:border-[#918AFF] focus:bg-white/[0.08] focus:ring-4 focus:ring-[#7168FF]/10'
        }`}
      />

      {error && (
        <span className="mt-1.5 block text-[11px] font-medium text-red-200">
          {error}
        </span>
      )}
    </label>
  )
}



function TextAreaField({
  label,
  error,
  ...props
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold text-white/55">
        {label}
      </span>

      <textarea
        {...props}
        className={`min-h-[112px] w-full resize-y rounded-[12px] border bg-white/[0.065] px-3.5 py-3 text-[13px] leading-6 text-white outline-none transition placeholder:text-white/25 ${
          error
            ? 'border-red-300/45 focus:border-red-300 focus:ring-4 focus:ring-red-300/10'
            : 'border-white/10 hover:border-white/20 focus:border-[#918AFF] focus:bg-white/[0.08] focus:ring-4 focus:ring-[#7168FF]/10'
        }`}
      />

      {error && (
        <span className="mt-1.5 block text-[11px] font-medium text-red-200">
          {error}
        </span>
      )}
    </label>
  )
}


function EditDoctorModal({
  doctor,
  onClose,
  onSaved,
}) {
  const [
    form,
    setForm,
  ] = useState(() => ({
    firstName:
      doctor.firstName || '',
    lastName:
      doctor.lastName || '',
    title:
      doctor.title || 'Diş Hekimi',
    bio:
      doctor.bio || '',
    experienceYears:
      String(
        doctor.experienceYears ?? 0,
      ),
    clinicName:
      doctor.clinicName ||
      'DentFlow Dental Clinic',
    location:
      doctor.location || '',
    displayOrder:
      String(
        doctor.displayOrder ?? 0,
      ),
    education:
      Array.isArray(
        doctor.education,
      )
        ? doctor.education.map(
            (item) => ({
              institution:
                item?.institution || '',
              degree:
                item?.degree || '',
              graduationYear:
                item?.graduationYear
                  ? String(
                      item.graduationYear,
                    )
                  : '',
            }),
          )
        : [],
  }))

  const [
    submitting,
    setSubmitting,
  ] = useState(false)

  const [
    formError,
    setFormError,
  ] = useState('')

  const [
    fieldErrors,
    setFieldErrors,
  ] = useState({})

  const [
    currentImageUrl,
    setCurrentImageUrl,
  ] = useState(
    doctor.profileImageUrl || '',
  )

  const [
    imageFile,
    setImageFile,
  ] = useState(null)

  const [
    imagePreview,
    setImagePreview,
  ] = useState('')

  const [
    imageUploading,
    setImageUploading,
  ] = useState(false)

  const [
    imageError,
    setImageError,
  ] = useState('')

  const [
    imageSuccess,
    setImageSuccess,
  ] = useState('')

  const [
    currentCv,
    setCurrentCv,
  ] = useState(
    doctor.cv || {
      fileName: '',
      uploadedAt: null,
    },
  )

  const [
    cvFile,
    setCvFile,
  ] = useState(null)

  const [
    cvUploading,
    setCvUploading,
  ] = useState(false)

  const [
    cvError,
    setCvError,
  ] = useState('')

  const [
    cvSuccess,
    setCvSuccess,
  ] = useState('')


  const doctorInitials =
    `${doctor.firstName?.charAt(0) || ''}${doctor.lastName?.charAt(0) || ''}`
      .toUpperCase() || 'DR'


  useEffect(() => {
    return () => {
      if (
        imagePreview.startsWith(
          'blob:',
        )
      ) {
        URL.revokeObjectURL(
          imagePreview,
        )
      }
    }
  }, [
    imagePreview,
  ])


  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow =
      'hidden'

    const handleKeyDown = (
      event,
    ) => {
      if (
        event.key === 'Escape' &&
        !submitting
      ) {
        onClose()
      }
    }

    window.addEventListener(
      'keydown',
      handleKeyDown,
    )

    return () => {
      document.body.style.overflow =
        previousOverflow

      window.removeEventListener(
        'keydown',
        handleKeyDown,
      )
    }
  }, [
    onClose,
    submitting,
  ])


  const handleChange = (
    event,
  ) => {
    const {
      name,
      value,
    } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    if (fieldErrors[name]) {
      setFieldErrors(
        (current) => ({
          ...current,
          [name]: undefined,
        }),
      )
    }
  }


  const addEducation = () => {
    setForm((current) => ({
      ...current,

      education: [
        ...current.education,
        {
          institution: '',
          degree: '',
          graduationYear: '',
        },
      ],
    }))
  }


  const removeEducation = (
    index,
  ) => {
    setForm((current) => ({
      ...current,

      education:
        current.education.filter(
          (
            _,
            itemIndex,
          ) =>
            itemIndex !==
            index,
        ),
    }))
  }


  const updateEducation = (
    index,
    field,
    value,
  ) => {
    setForm((current) => ({
      ...current,

      education:
        current.education.map(
          (
            item,
            itemIndex,
          ) =>
            itemIndex ===
            index
              ? {
                  ...item,
                  [field]:
                    value,
                }
              : item,
        ),
    }))

    if (fieldErrors.education) {
      setFieldErrors(
        (current) => ({
          ...current,
          education:
            undefined,
        }),
      )
    }
  }


  const handleImageChange = (
    event,
  ) => {
    const file =
      event.target.files?.[0]

    if (!file) {
      return
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ]

    if (
      !allowedTypes.includes(
        file.type,
      )
    ) {
      setImageError(
        'Yalnızca JPG, PNG veya WEBP formatında görsel seçebilirsiniz.',
      )
      setImageFile(null)
      setImagePreview('')
      return
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setImageError(
        'Profil fotoğrafı en fazla 5 MB olabilir.',
      )
      setImageFile(null)
      setImagePreview('')
      return
    }

    setImageError('')
    setImageSuccess('')
    setImageFile(file)

    setImagePreview(
      URL.createObjectURL(
        file,
      ),
    )
  }


  const handleImageUpload =
    async () => {
      if (!imageFile) {
        setImageError(
          'Önce bir profil fotoğrafı seçin.',
        )
        return
      }

      setImageUploading(true)
      setImageError('')
      setImageSuccess('')

      try {
        const result =
          await uploadDoctorProfileImageRequest(
            doctor.id,
            imageFile,
          )

        const profileImageUrl =
          result.data?.doctor
            ?.profileImageUrl

        if (!profileImageUrl) {
          throw new Error(
            'Profil fotoğrafı URL bilgisi alınamadı.',
          )
        }

        setCurrentImageUrl(
          profileImageUrl,
        )

        setImageFile(null)
        setImagePreview('')

        setImageSuccess(
          'Profil fotoğrafı başarıyla güncellendi.',
        )

        onSaved({
          id:
            doctor.id,
          profileImageUrl,
        })
      } catch (error) {
        setImageError(
          error.message ||
            'Profil fotoğrafı yüklenemedi.',
        )
      } finally {
        setImageUploading(false)
      }
    }


  const handleCvChange = (
    event,
  ) => {
    const file =
      event.target.files?.[0]

    if (!file) {
      return
    }

    if (
      file.type !==
      'application/pdf'
    ) {
      setCvError(
        'CV yalnızca PDF formatında seçilebilir.',
      )
      setCvFile(null)
      return
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      setCvError(
        'CV dosyası en fazla 10 MB olabilir.',
      )
      setCvFile(null)
      return
    }

    setCvError('')
    setCvSuccess('')
    setCvFile(file)
  }


  const handleCvUpload =
    async () => {
      if (!cvFile) {
        setCvError(
          'Önce bir PDF CV dosyası seçin.',
        )
        return
      }

      setCvUploading(true)
      setCvError('')
      setCvSuccess('')

      try {
        const result =
          await uploadDoctorCvRequest(
            doctor.id,
            cvFile,
          )

        const uploadedCv =
          result.data?.cv

        if (!uploadedCv?.fileName) {
          throw new Error(
            'CV bilgileri sunucudan alınamadı.',
          )
        }

        setCurrentCv(
          uploadedCv,
        )

        setCvFile(null)

        setCvSuccess(
          'CV başarıyla yüklendi.',
        )

        onSaved({
          id:
            doctor.id,
          cv:
            uploadedCv,
        })
      } catch (error) {
        setCvError(
          error.message ||
            'CV yüklenemedi.',
        )
      } finally {
        setCvUploading(false)
      }
    }


  const handleSubmit = async (
    event,
  ) => {
    event.preventDefault()

    setSubmitting(true)
    setFormError('')
    setFieldErrors({})

    const educationRows =
      form.education.filter(
        (item) =>
          item.institution.trim() ||
          item.degree.trim() ||
          item.graduationYear,
      )

    const invalidEducation =
      educationRows.some(
        (item) =>
          !item.institution.trim(),
      )

    if (invalidEducation) {
      setFormError(
        'Eğitim kaydında kurum / üniversite alanı zorunludur.',
      )
      setSubmitting(false)
      return
    }

    const education =
      educationRows.map(
        (item) => {
          const normalized = {
            institution:
              item.institution.trim(),
          }

          if (
            item.degree.trim()
          ) {
            normalized.degree =
              item.degree.trim()
          }

          if (
            item.graduationYear
          ) {
            normalized.graduationYear =
              Number(
                item.graduationYear,
              )
          }

          return normalized
        },
      )

    try {
      const result =
        await updateDoctorRequest(
          doctor.id,
          {
          firstName:
            form.firstName.trim(),

          lastName:
            form.lastName.trim(),

          title:
            form.title.trim(),

          bio:
            form.bio.trim(),

          experienceYears:
            Number(
              form.experienceYears,
            ),

          clinicName:
            form.clinicName.trim(),

          location:
            form.location.trim(),

          education,

            displayOrder:
              Number(
                form.displayOrder,
              ),
          },
        )

      onSaved(
        result.data?.doctor,
      )

      onClose()
    } catch (error) {
      setFormError(
        error.message ||
          'Doktor profili güncellenemedi.',
      )

      setFieldErrors(
        error.errors || {},
      )
    } finally {
      setSubmitting(false)
    }
  }


  return (
    <div className="fixed inset-0 z-[90] grid place-items-center p-4 sm:p-6">
      <motion.button
        type="button"
        aria-label="Pencereyi kapat"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        onClick={
          submitting
            ? undefined
            : onClose
        }
        className="absolute inset-0 bg-[#111124]/55 backdrop-blur-[6px]"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-doctor-title"
        initial={{
          opacity: 0,
          y: 18,
          scale: 0.975,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: 12,
          scale: 0.98,
        }}
        transition={{
          duration: 0.3,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
        className="relative z-10 w-full max-w-[760px] overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(145deg,#17172E_0%,#211F4A_58%,#292461_100%)] text-white shadow-[0_32px_90px_rgba(18,18,37,0.44)]"
      >
        <div className="flex items-start justify-between border-b border-white/10 px-6 py-5 sm:px-7">
          <div className="min-w-0 pr-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#9D96FF]">
              Doktor Profili
            </p>

            <h2
              id="edit-doctor-title"
              className="mt-1.5 truncate text-[22px] font-semibold tracking-[-0.025em] text-white"
            >
              Profili Düzenle
            </h2>

            <p className="mt-1.5 truncate text-[12px] leading-5 text-white/45">
              {doctor.firstName} {doctor.lastName} · {doctor.email}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Pencereyi kapat"
            className="grid size-10 shrink-0 place-items-center rounded-[12px] border border-white/10 bg-white/[0.05] text-white/55 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X
              size={18}
            />
          </button>
        </div>


        <form
          onSubmit={
            handleSubmit
          }
        >
          <div className="max-h-[min(72vh,720px)] overflow-y-auto px-6 py-6 sm:px-7">
            {formError && (
              <div className="mb-5 rounded-[14px] border border-red-300/20 bg-red-400/10 px-4 py-3 text-[12px] font-medium text-red-100">
                {formError}
              </div>
            )}


            {/* PROFILE IMAGE */}
            <div className="mb-6 rounded-[18px] border border-white/10 bg-white/[0.035] p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-[20px] border border-white/10 bg-[linear-gradient(145deg,#312E68,#47418F)] text-[18px] font-bold text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
                    {imagePreview ||
                    currentImageUrl ? (
                      <img
                        src={
                          imagePreview ||
                          currentImageUrl
                        }
                        alt={`${doctor.firstName} ${doctor.lastName}`}
                        className="size-full object-cover"
                      />
                    ) : (
                      doctorInitials
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[#AAA5FF]">
                      <ImagePlus
                        size={17}
                        strokeWidth={1.9}
                      />

                      <p className="text-[11px] font-semibold">
                        Profil Fotoğrafı
                      </p>
                    </div>

                    <p className="mt-1.5 max-w-[360px] text-[11px] leading-5 text-white/35">
                      JPG, PNG veya WEBP · En fazla 5 MB. Fotoğraf genel doktor profilinde gösterilir.
                    </p>

                    {imageFile && (
                      <p className="mt-2 truncate text-[10.5px] font-medium text-white/55">
                        Seçilen: {imageFile.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <label
                    htmlFor={`doctor-image-${doctor.id}`}
                    className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-[11px] border border-white/10 bg-white/[0.06] px-3 text-[11px] font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
                  >
                    <ImagePlus
                      size={14}
                    />
                    Fotoğraf Seç
                  </label>

                  <input
                    id={`doctor-image-${doctor.id}`}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={
                      handleImageChange
                    }
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={
                      handleImageUpload
                    }
                    disabled={
                      !imageFile ||
                      imageUploading
                    }
                    className="inline-flex h-9 min-w-[92px] items-center justify-center gap-1.5 rounded-[11px] bg-[#7168FF] px-3 text-[11px] font-semibold text-white transition hover:bg-[#655CF0] disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    <Upload
                      size={14}
                    />
                    {imageUploading
                      ? 'Yükleniyor...'
                      : 'Yükle'}
                  </button>
                </div>
              </div>

              {imageError && (
                <div className="mt-3 rounded-[11px] border border-red-300/15 bg-red-300/[0.07] px-3 py-2 text-[10.5px] font-medium text-red-100">
                  {imageError}
                </div>
              )}

              {imageSuccess && (
                <div className="mt-3 rounded-[11px] border border-emerald-300/15 bg-emerald-300/[0.07] px-3 py-2 text-[10.5px] font-medium text-emerald-100">
                  {imageSuccess}
                </div>
              )}
            </div>


            {/* CV DOCUMENT */}
            <div className="mb-6 rounded-[18px] border border-white/10 bg-white/[0.035] p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="grid size-14 shrink-0 place-items-center rounded-[16px] border border-white/10 bg-[#7168FF]/15 text-[#AAA5FF]">
                    <FileText
                      size={22}
                      strokeWidth={1.8}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[11px] font-semibold text-[#D5D2FF]">
                        CV Dosyası
                      </p>

                      <span className="rounded-full border border-amber-300/15 bg-amber-300/[0.07] px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-[0.08em] text-amber-100/70">
                        Admin Only
                      </span>
                    </div>

                    <p className="mt-1.5 max-w-[390px] text-[11px] leading-5 text-white/35">
                      Yalnızca PDF · En fazla 10 MB. CV genel doktor profilinde gösterilmez.
                    </p>

                    {currentCv?.fileName && (
                      <div className="mt-2">
                        <p className="truncate text-[10.5px] font-semibold text-white/65">
                          Yüklü: {currentCv.fileName}
                        </p>

                        {currentCv.uploadedAt && (
                          <p className="mt-0.5 text-[9.5px] text-white/30">
                            Yüklenme: {new Date(
                              currentCv.uploadedAt,
                            ).toLocaleString(
                              'tr-TR',
                            )}
                          </p>
                        )}
                      </div>
                    )}

                    {cvFile && (
                      <p className="mt-2 truncate text-[10.5px] font-medium text-[#B9B4FF]">
                        Seçilen: {cvFile.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <label
                    htmlFor={`doctor-cv-${doctor.id}`}
                    className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-[11px] border border-white/10 bg-white/[0.06] px-3 text-[11px] font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
                  >
                    <FileText
                      size={14}
                    />

                    PDF Seç
                  </label>

                  <input
                    id={`doctor-cv-${doctor.id}`}
                    type="file"
                    accept="application/pdf"
                    onChange={
                      handleCvChange
                    }
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={
                      handleCvUpload
                    }
                    disabled={
                      !cvFile ||
                      cvUploading
                    }
                    className="inline-flex h-9 min-w-[92px] items-center justify-center gap-1.5 rounded-[11px] bg-[#7168FF] px-3 text-[11px] font-semibold text-white transition hover:bg-[#655CF0] disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    <Upload
                      size={14}
                    />

                    {cvUploading
                      ? 'Yükleniyor...'
                      : 'CV Yükle'}
                  </button>
                </div>
              </div>

              {cvError && (
                <div className="mt-3 rounded-[11px] border border-red-300/15 bg-red-300/[0.07] px-3 py-2 text-[10.5px] font-medium text-red-100">
                  {cvError}
                </div>
              )}

              {cvSuccess && (
                <div className="mt-3 rounded-[11px] border border-emerald-300/15 bg-emerald-300/[0.07] px-3 py-2 text-[10.5px] font-medium text-emerald-100">
                  {cvSuccess}
                </div>
              )}

              <div className="mt-3 flex items-start gap-2 rounded-[11px] border border-white/[0.07] bg-black/[0.08] px-3 py-2.5">
                <ShieldCheck
                  size={13}
                  className="mt-0.5 shrink-0 text-emerald-300/75"
                />

                <p className="text-[9.5px] leading-4 text-white/30">
                  CV dahili yönetim belgesidir. Genel Doktorlar sayfasına veya hasta paneline gönderilmez.
                </p>
              </div>
            </div>


            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Ad"
                name="firstName"
                value={
                  form.firstName
                }
                onChange={
                  handleChange
                }
                error={
                  fieldErrors.firstName?.[0]
                }
                required
              />

              <Field
                label="Soyad"
                name="lastName"
                value={
                  form.lastName
                }
                onChange={
                  handleChange
                }
                error={
                  fieldErrors.lastName?.[0]
                }
                required
              />
            </div>


            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <Field
                label="Ünvan"
                name="title"
                value={
                  form.title
                }
                onChange={
                  handleChange
                }
                error={
                  fieldErrors.title?.[0]
                }
              />

              <Field
                label="Deneyim Yılı"
                name="experienceYears"
                type="number"
                min="0"
                max="70"
                value={
                  form.experienceYears
                }
                onChange={
                  handleChange
                }
                error={
                  fieldErrors.experienceYears?.[0]
                }
              />

              <Field
                label="Liste Sırası"
                name="displayOrder"
                type="number"
                min="0"
                value={
                  form.displayOrder
                }
                onChange={
                  handleChange
                }
                error={
                  fieldErrors.displayOrder?.[0]
                }
              />
            </div>


            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field
                label="Klinik"
                name="clinicName"
                value={
                  form.clinicName
                }
                onChange={
                  handleChange
                }
                error={
                  fieldErrors.clinicName?.[0]
                }
              />

              <Field
                label="Konum"
                name="location"
                value={
                  form.location
                }
                onChange={
                  handleChange
                }
                error={
                  fieldErrors.location?.[0]
                }
                placeholder="Örn. İstanbul"
              />
            </div>


            <div className="mt-4">
              <TextAreaField
                label="Biyografi"
                name="bio"
                value={
                  form.bio
                }
                onChange={
                  handleChange
                }
                error={
                  fieldErrors.bio?.[0]
                }
                maxLength={600}
                rows={4}
                placeholder="Doktorun eğitim, yaklaşım ve klinik deneyimini kısaca tanıtın..."
              />

              <div className="mt-1.5 flex justify-end">
                <span className="text-[10px] text-white/30">
                  {form.bio.length}/600
                </span>
              </div>
            </div>


            <div className="mt-6 rounded-[18px] border border-white/10 bg-white/[0.035] p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[#AAA5FF]">
                    <GraduationCap
                      size={17}
                      strokeWidth={1.9}
                    />

                    <p className="text-[11px] font-semibold">
                      Eğitim Bilgileri
                    </p>
                  </div>

                  <p className="mt-1.5 text-[11px] leading-5 text-white/35">
                    Üniversite, derece ve mezuniyet yılı bilgilerini ekleyin.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    addEducation
                  }
                  className="inline-flex h-9 w-fit items-center justify-center gap-1.5 rounded-[11px] border border-[#8D85FF]/25 bg-[#7168FF]/10 px-3 text-[11px] font-semibold text-[#C3BFFF] transition hover:bg-[#7168FF]/20"
                >
                  <Plus
                    size={14}
                  />
                  Eğitim Ekle
                </button>
              </div>


              {fieldErrors.education?.[0] && (
                <p className="mt-3 text-[11px] font-medium text-red-200">
                  {fieldErrors.education[0]}
                </p>
              )}


              {form.education.length === 0 ? (
                <div className="mt-4 rounded-[14px] border border-dashed border-white/10 px-4 py-5 text-center">
                  <p className="text-[11.5px] text-white/35">
                    Henüz eğitim bilgisi eklenmedi.
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {form.education.map(
                    (
                      item,
                      index,
                    ) => (
                      <div
                        key={index}
                        className="rounded-[15px] border border-white/10 bg-black/[0.08] p-4"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">
                            Eğitim {index + 1}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              removeEducation(
                                index,
                              )
                            }
                            className="grid size-8 place-items-center rounded-[9px] border border-red-300/10 bg-red-300/[0.05] text-red-200/60 transition hover:bg-red-300/10 hover:text-red-100"
                            aria-label="Eğitim kaydını kaldır"
                          >
                            <Trash2
                              size={13}
                            />
                          </button>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <Field
                            label="Kurum / Üniversite"
                            value={
                              item.institution
                            }
                            onChange={(
                              event,
                            ) =>
                              updateEducation(
                                index,
                                'institution',
                                event.target.value,
                              )
                            }
                            placeholder="Örn. İstanbul Üniversitesi"
                          />

                          <Field
                            label="Derece / Program"
                            value={
                              item.degree
                            }
                            onChange={(
                              event,
                            ) =>
                              updateEducation(
                                index,
                                'degree',
                                event.target.value,
                              )
                            }
                            placeholder="Örn. Diş Hekimliği"
                          />
                        </div>

                        <div className="mt-3 max-w-[220px]">
                          <Field
                            label="Mezuniyet Yılı"
                            type="number"
                            min="1950"
                            max="2100"
                            value={
                              item.graduationYear
                            }
                            onChange={(
                              event,
                            ) =>
                              updateEducation(
                                index,
                                'graduationYear',
                                event.target.value,
                              )
                            }
                            placeholder="2022"
                          />
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>


            <div className="mt-5 rounded-[16px] border border-[#8D85FF]/20 bg-[#8D85FF]/[0.08] p-4">
              <div className="flex gap-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-[#7168FF]/20 text-[#AAA5FF]">
                  <ShieldCheck
                    size={17}
                    strokeWidth={1.9}
                  />
                </div>

                <div>
                  <p className="text-[12px] font-semibold text-[#D5D2FF]">
                    Hesap bilgileri korunur
                  </p>

                  <p className="mt-1 text-[11.5px] leading-5 text-white/42">
                    Bu ekrandan yalnızca klinik profil bilgileri güncellenir. E-posta ve parola değiştirilmez.
                  </p>
                </div>
              </div>
            </div>
          </div>


          <div className="flex items-center justify-end gap-3 border-t border-white/10 bg-black/[0.08] px-6 py-4 sm:px-7">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="h-10 rounded-[12px] border border-white/10 bg-white/[0.05] px-4 text-[12px] font-semibold text-white/65 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
            >
              Vazgeç
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-10 min-w-[150px] items-center justify-center gap-2 rounded-[12px] bg-[#7168FF] px-4 text-[12px] font-semibold text-white shadow-[0_10px_24px_rgba(113,104,255,0.28)] transition hover:-translate-y-0.5 hover:bg-[#655CF0] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
            >
              {submitting
                ? 'Kaydediliyor...'
                : 'Değişiklikleri Kaydet'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}


function DeleteDoctorModal({
  doctor,
  onClose,
  onDeleted,
}) {
  const [
    deleting,
    setDeleting,
  ] = useState(false)

  const [
    deleteError,
    setDeleteError,
  ] = useState('')


  const doctorName =
    `${doctor.firstName || ''} ${doctor.lastName || ''}`.trim() ||
    'Doktor'


  const handleDelete =
    async () => {
      setDeleting(true)
      setDeleteError('')

      try {
        await deleteDoctorRequest(
          doctor.id,
        )

        onDeleted(
          doctor.id,
        )
      } catch (error) {
        setDeleteError(
          error.message ||
            'Doktor hesabı silinemedi.',
        )

        setDeleting(false)
      }
    }


  return (
    <div className="fixed inset-0 z-[120] grid place-items-center p-4">
      <motion.button
        type="button"
        aria-label="Pencereyi kapat"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        onClick={
          deleting
            ? undefined
            : onClose
        }
        className="absolute inset-0 bg-[#121225]/55 backdrop-blur-[5px]"
      />

      <motion.div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-doctor-title"
        initial={{
          opacity: 0,
          y: 16,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: 10,
          scale: 0.98,
        }}
        transition={{
          duration: 0.28,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
        className="relative z-10 w-full max-w-[470px] overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(145deg,#17172E_0%,#211F4A_58%,#292461_100%)] p-6 text-white shadow-[0_28px_80px_rgba(18,18,37,0.42)]"
      >
        <div className="grid size-12 place-items-center rounded-[15px] border border-red-300/15 bg-red-400/10 text-red-200">
          <Trash2
            size={21}
            strokeWidth={2}
          />
        </div>

        <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-red-200/65">
          Kalıcı silme
        </p>

        <h2
          id="delete-doctor-title"
          className="mt-1.5 text-[21px] font-semibold tracking-[-0.02em]"
        >
          Doktor hesabını sil?
        </h2>

        <p className="mt-2 text-[12.5px] leading-5 text-white/50">
          <span className="font-semibold text-white/80">
            {doctorName}
          </span>{' '}
          hesabı ve doktor profili kalıcı olarak silinecek.
        </p>

        <div className="mt-5 rounded-[15px] border border-red-300/15 bg-red-300/[0.06] px-4 py-3">
          <p className="text-[11px] font-semibold text-red-100/85">
            Bu işlem geri alınamaz.
          </p>

          <p className="mt-1 text-[10.5px] leading-5 text-red-100/55">
            Doktor hesabı, profil bilgileri, profil fotoğrafı ve yüklenmiş CV kaydı silinecektir.
          </p>
        </div>

        {deleteError && (
          <div className="mt-4 rounded-[13px] border border-red-300/20 bg-red-400/10 px-4 py-3 text-[11px] font-medium text-red-100">
            {deleteError}
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              deleting
            }
            className="h-10 rounded-[12px] border border-white/10 bg-white/[0.05] px-4 text-[12px] font-semibold text-white/65 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Vazgeç
          </button>

          <button
            type="button"
            onClick={
              handleDelete
            }
            disabled={
              deleting
            }
            className="inline-flex h-10 min-w-[138px] items-center justify-center gap-2 rounded-[12px] bg-red-500 px-4 text-[12px] font-semibold text-white shadow-[0_10px_24px_rgba(239,68,68,0.20)] transition hover:-translate-y-0.5 hover:bg-red-600 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
          >
            <Trash2
              size={14}
            />

            {deleting
              ? 'Siliniyor...'
              : 'Kalıcı Olarak Sil'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}


function DoctorCreatedModal({
  data,
  onClose,
}) {
  const [
    copied,
    setCopied,
  ] = useState(false)

  const [
    visible,
    setVisible,
  ] = useState(false)

  const {
    doctor,
    temporaryPassword,
  } = data


  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(
        temporaryPassword,
      )

      setCopied(true)

      window.setTimeout(
        () => {
          setCopied(false)
        },
        1800,
      )
    } catch {
      setCopied(false)
    }
  }


  return (
    <div className="fixed inset-0 z-[100] grid place-items-center p-4">
      <motion.button
        type="button"
        aria-label="Pencereyi kapat"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        onClick={onClose}
        className="absolute inset-0 bg-[#121225]/45 backdrop-blur-[4px]"
      />

      <motion.div
        initial={{
          opacity: 0,
          y: 16,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: 10,
          scale: 0.98,
        }}
        transition={{
          duration: 0.3,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
        className="relative w-full max-w-[480px] overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(145deg,#17172E_0%,#211F4A_58%,#292461_100%)] p-6 text-white shadow-[0_28px_80px_rgba(18,18,37,0.38)]"
      >
        <div className="grid size-12 place-items-center rounded-[15px] bg-emerald-400/15 text-emerald-300">
          <Check
            size={22}
            strokeWidth={2.1}
          />
        </div>

        <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
          Hesap oluşturuldu
        </p>

        <h2 className="mt-1.5 text-[21px] font-semibold">
          Doktor hesabı hazır
        </h2>

        <p className="mt-2 text-[12.5px] leading-5 text-white/50">
          Geçici parola yalnızca bu ekranda gösterilir. Doktora güvenli bir kanal üzerinden iletin.
        </p>


        <div className="mt-5 rounded-[17px] border border-white/10 bg-white/[0.05] p-4">
          <p className="text-[10px] font-medium text-white/35">
            E-posta
          </p>

          <p className="mt-1 break-all text-[13px] font-semibold text-white/85">
            {doctor?.email}
          </p>


          <div className="mt-4 border-t border-white/10 pt-4">
            <p className="text-[10px] font-medium text-white/35">
              Geçici parola
            </p>

            <div className="mt-2 flex items-center gap-2">
              <div className="min-w-0 flex-1 rounded-[12px] border border-white/10 bg-black/15 px-3 py-2.5 font-mono text-[13px] font-semibold tracking-[0.08em] text-white">
                {visible
                  ? temporaryPassword
                  : '••••••••••••••••'}
              </div>

              <button
                type="button"
                onClick={() =>
                  setVisible(
                    (current) =>
                      !current,
                  )
                }
                className="grid size-10 shrink-0 place-items-center rounded-[12px] border border-white/10 bg-white/[0.06] text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                {visible
                  ? (
                    <EyeOff
                      size={17}
                    />
                  )
                  : (
                    <Eye
                      size={17}
                    />
                  )}
              </button>

              <button
                type="button"
                onClick={
                  copyPassword
                }
                className="grid size-10 shrink-0 place-items-center rounded-[12px] border border-white/10 bg-white/[0.06] text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                {copied
                  ? (
                    <Check
                      size={17}
                      className="text-emerald-300"
                    />
                  )
                  : (
                    <Copy
                      size={17}
                    />
                  )}
              </button>
            </div>
          </div>
        </div>


        <div className="mt-5 rounded-[14px] border border-amber-300/15 bg-amber-300/[0.07] px-4 py-3">
          <p className="text-[11px] leading-5 text-amber-100/70">
            Bu pencere kapatıldığında geçici parola tekrar görüntülenemez.
          </p>
        </div>


        <button
          type="button"
          onClick={onClose}
          className="mt-5 h-11 w-full rounded-[13px] bg-white text-[12px] font-semibold text-[#1B1938] transition hover:bg-[#F3F2FF]"
        >
          Tamam
        </button>
      </motion.div>
    </div>
  )
}