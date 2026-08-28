import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  GraduationCap,
  MapPin,
  Send,
  Stethoscope,
  X,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'


function DoctorDetailsModal({
  doctor,
  onClose,
}) {
  const [
    view,
    setView,
  ] = useState('details')

  const [
    note,
    setNote,
  ] = useState('')


  useEffect(() => {
    if (!doctor) {
      return undefined
    }

    const handleKeyDown = (
      event,
    ) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow =
      'hidden'

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
    doctor,
    onClose,
  ])


  const doctorName =
    doctor?.name ||
    [
      doctor?.firstName,
      doctor?.lastName,
    ]
      .filter(Boolean)
      .join(' ')


  const doctorTitle =
    doctor?.title ||
    doctor?.role ||
    'Diş Hekimi'


  const initials =
    `${doctor?.firstName?.charAt(0) || ''}${doctor?.lastName?.charAt(0) || ''}`
      .toUpperCase() ||
    doctorName
      ?.split(' ')
      .map((part) =>
        part.charAt(0),
      )
      .slice(0, 2)
      .join('')
      .toUpperCase() ||
    'DR'


const educationItems =
  Array.isArray(
    doctor?.education,
  )
    ? doctor.education
        .filter(
          (item) =>
            item?.institution,
        )
        .map((item) => ({
          institution:
            item.institution,

          degree:
            item.degree || '',

          graduationYear:
            item.graduationYear ||
            null,
        }))
    : []

  return (
    <AnimatePresence>
      {doctor && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-5 py-8"
        >
          {/* BACKDROP */}
          <motion.button
            type="button"
            aria-label="Pencereyi kapat"
            onClick={onClose}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="absolute inset-0 cursor-default bg-slate-950/30 backdrop-blur-[9px]"
          />


          {/* MODAL */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="doctor-modal-title"
            initial={{
              opacity: 0,
              y: 22,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 14,
              scale: 0.98,
            }}
            transition={{
              duration: 0.28,
              ease: 'easeOut',
            }}
            className="relative z-10 max-h-[90vh] w-full max-w-[620px] overflow-x-hidden overflow-y-auto rounded-[32px] border border-white/70 bg-white shadow-[0_32px_100px_rgba(15,23,42,0.24)]"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-[#5956F5]/10 blur-3xl" />


            {/* TOP BUTTONS */}
            <div className="sticky top-0 z-20 flex items-center justify-between bg-white/80 px-7 pt-7 backdrop-blur-md sm:px-9 sm:pt-9">
              {view ===
              'booking' ? (
                <button
                  type="button"
                  onClick={() =>
                    setView(
                      'details',
                    )
                  }
                  className="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-[#111827]"
                  aria-label="Detaylara dön"
                >
                  <ArrowLeft
                    size={18}
                  />
                </button>
              ) : (
                <div className="size-10" />
              )}

              <button
                type="button"
                onClick={onClose}
                className="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-[#111827]"
                aria-label="Kapat"
              >
                <X
                  size={18}
                />
              </button>
            </div>


            <AnimatePresence mode="wait">
              {view ===
              'details' ? (
                <motion.div
                  key="details"
                  initial={{
                    opacity: 0,
                    x: -10,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -10,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="relative px-7 pb-8 sm:px-9 sm:pb-9"
                >
                  {/* DOCTOR */}
                  <div className="flex flex-col items-center text-center">
                    <div className="relative">
                      <div className="grid size-24 place-items-center overflow-hidden rounded-[26px] border-4 border-white bg-[linear-gradient(145deg,#F1EFFF,#EAF3FF)] shadow-[0_16px_40px_rgba(15,23,42,0.14)]">
                        {doctor.profileImageUrl ? (
                          <img
                            src={
                              doctor.profileImageUrl
                            }
                            alt={
                              doctorName
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xl font-bold text-[#5956F5]">
                            {initials}
                          </span>
                        )}
                      </div>

                      <span className="absolute -bottom-1 -right-1 size-5 rounded-full border-[3px] border-white bg-emerald-500" />
                    </div>


                    <p className="mt-5 flex items-center gap-2 text-xs font-medium text-slate-400">
                      <Stethoscope
                        size={14}
                      />
                      {doctorTitle}
                    </p>


                    <h2
                      id="doctor-modal-title"
                      className="mt-2 font-heading text-[30px] font-semibold tracking-[-0.045em] text-[#111827]"
                    >
                      {doctorName}
                    </h2>


                    <p className="mt-4 max-w-[470px] text-sm leading-7 text-slate-500">
                      {doctor.bio ||
                        'Doktor profil bilgileri klinik tarafından güncellendikçe bu alanda görüntülenecektir.'}
                    </p>
                  </div>


                  {/* DETAILS */}
                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    <DetailCard
                      icon={
                        BriefcaseBusiness
                      }
                      label="Deneyim"
                    >
                      {doctor.experienceYears >
                      0
                        ? `${doctor.experienceYears} yıl`
                        : 'Belirtilmedi'}
                    </DetailCard>


                    <DetailCard
                      icon={
                        Building2
                      }
                      label="Klinik"
                    >
                      {doctor.clinicName ||
                        'DentFlow Dental Clinic'}
                    </DetailCard>


                    <DetailCard
                      icon={
                        MapPin
                      }
                      label="Konum"
                    >
                      {doctor.location ||
                        'Belirtilmedi'}
                    </DetailCard>


                    <DetailCard
                      icon={
                        GraduationCap
                      }
                      label="Eğitim"
                    >
                      {educationItems.length >
                      0 ? (
                        <div className="space-y-2">
                          {educationItems.map(
                            (
                              item,
                              index,
                            ) => (
                              <div
                                key={`${item.institution}-${index}`}
                              >
                                <p className="font-medium text-[#111827]">
                                  {
                                    item.institution
                                  }
                                </p>

                                {(item.degree ||
                                  item.graduationYear) && (
                                  <p className="mt-0.5 text-[11px] leading-4 text-slate-400">
                                    {[
                                      item.degree,
                                      item.graduationYear,
                                    ]
                                      .filter(
                                        Boolean,
                                      )
                                      .join(
                                        ' · ',
                                      )}
                                  </p>
                                )}
                              </div>
                            ),
                          )}
                        </div>
                      ) : (
                        'Belirtilmedi'
                      )}
                    </DetailCard>
                  </div>


                  {/* APPOINTMENT */}
                  <div className="mt-7 border-t border-slate-100 pt-6">
                    <button
                      type="button"
                      onClick={() =>
                        setView(
                          'booking',
                        )
                      }
                      className="group flex h-14 w-full items-center justify-center gap-2 rounded-[18px] bg-[#5956F5] px-6 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(89,86,245,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#504DEB]"
                    >
                      <CalendarDays
                        size={17}
                      />
                      Randevu Al
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="booking"
                  initial={{
                    opacity: 0,
                    x: 12,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: 12,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="relative px-7 pb-8 sm:px-9 sm:pb-9"
                >
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5956F5]">
                      Randevu
                    </p>

                    <h2
                      id="doctor-modal-title"
                      className="mt-2 font-heading text-[28px] font-semibold tracking-[-0.04em] text-[#111827]"
                    >
                      {doctorName}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      Doktorun bilmesini istediğiniz durumu kısaca yazın.
                    </p>
                  </div>


                  <div className="mt-7">
                    <label
                      htmlFor="patientNote"
                      className="mb-2.5 block text-[13px] font-semibold text-slate-700"
                    >
                      Şikayetiniz / Notunuz
                    </label>

                    <textarea
                      id="patientNote"
                      value={
                        note
                      }
                      onChange={(
                        event,
                      ) =>
                        setNote(
                          event.target
                            .value,
                        )
                      }
                      rows={5}
                      maxLength={500}
                      placeholder="Yaşadığınız problemi kısaca açıklayın..."
                      className="w-full resize-none rounded-[18px] border border-slate-200 bg-[#F8FAFD] p-4 text-sm leading-6 text-[#111827] outline-none transition focus:border-[#5956F5]/50 focus:bg-white focus:ring-4 focus:ring-[#5956F5]/[0.06]"
                    />

                    <div className="mt-2 flex justify-end">
                      <span className="text-[11px] text-slate-400">
                        {note.length}/500
                      </span>
                    </div>
                  </div>


                  <button
                    type="button"
                    className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-[18px] bg-[#5956F5] px-6 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(89,86,245,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#504DEB]"
                  >
                    <Send
                      size={16}
                    />
                    Randevu Sürecine Devam Et
                  </button>

                  <p className="mt-4 text-center text-[11px] leading-5 text-slate-400">
                    Tarih ve saat seçimi randevu sistemi tamamlandığında aktif olacaktır.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


function DetailCard({
  icon: Icon,
  label,
  children,
}) {
  return (
    <div className="rounded-[18px] border border-slate-100 bg-[#F8FAFD] p-4">
      <div className="flex items-center gap-2 text-[#5956F5]">
        <Icon
          size={16}
          strokeWidth={1.8}
        />

        <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">
          {label}
        </span>
      </div>

      <div className="mt-2 text-[13px] font-medium leading-5 text-[#111827]">
        {children}
      </div>
    </div>
  )
}


export default DoctorDetailsModal
