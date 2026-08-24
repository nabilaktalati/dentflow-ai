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

function DoctorDetailsModal({ doctor, onClose }) {
  const [view, setView] = useState('details')
  const [note, setNote] = useState('')

  useEffect(() => {
    if (!doctor) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [doctor, onClose])



  return (
    <AnimatePresence>
      {doctor && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-5 py-8"
        >
          {/* Background Blur */}
          <motion.button
            type="button"
            aria-label="Pencereyi kapat"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 cursor-default bg-slate-950/30 backdrop-blur-[9px]"
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="doctor-modal-title"
            initial={{ opacity: 0, y: 22, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{
              duration: 0.28,
              ease: 'easeOut',
            }}
            className="relative z-10 max-h-[90vh] w-full max-w-[600px] overflow-x-hidden overflow-y-auto rounded-[32px] border border-white/70 bg-white shadow-[0_32px_100px_rgba(15,23,42,0.24)]"
          >
            {/* Decoration */}
            <div className="pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-[#5956F5]/10 blur-3xl" />

            {/* Top Buttons */}
            <div className="sticky top-0 z-20 flex items-center justify-between bg-white/80 px-7 pt-7 backdrop-blur-md sm:px-9 sm:pt-9">
              {view === 'booking' ? (
                <button
                  type="button"
                  onClick={() => setView('details')}
                  className="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-[#111827]"
                  aria-label="Detaylara dön"
                >
                  <ArrowLeft size={18} />
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
                <X size={18} />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {view === 'details' ? (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="relative px-7 pb-8 sm:px-9 sm:pb-9"
                >
               {/* Doctor */}
<div className="flex flex-col items-center text-center">
  {/* Doctor Image */}
  <div className="relative">
    <div className="size-24 overflow-hidden rounded-[26px] border-4 border-white shadow-[0_16px_40px_rgba(15,23,42,0.14)]">
      <img
        src={doctor.image}
        alt={doctor.name}
        className="h-full w-full object-cover"
      />
    </div>

    <span className="absolute -bottom-1 -right-1 size-5 rounded-full border-[3px] border-white bg-emerald-500" />
  </div>

  {/* Role */}
  <p className="mt-5 flex items-center gap-2 text-xs font-medium text-slate-400">
    <Stethoscope size={14} />
    {doctor.role}
  </p>

  {/* Name */}
  <h2
    id="doctor-modal-title"
    className="mt-2 font-heading text-[30px] font-semibold tracking-[-0.045em] text-[#111827]"
  >
    {doctor.name}
  </h2>

  {/* Description */}
  <p className="mt-4 max-w-[460px] text-sm leading-7 text-slate-500">
    {doctor.description}
  </p>
</div>

                  {/* Doctor Details */}
                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    {/* Education */}
                    <div className="rounded-[18px] border border-slate-100 bg-[#F8FAFD] p-4">
                      <div className="flex items-center gap-2 text-[#5956F5]">
                        <GraduationCap size={16} strokeWidth={1.8} />

                        <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">
                          Eğitim
                        </span>
                      </div>

                      <p className="mt-2 text-[13px] font-medium leading-5 text-[#111827]">
                        {doctor.education}
                      </p>
                    </div>

                    {/* Experience */}
                    <div className="rounded-[18px] border border-slate-100 bg-[#F8FAFD] p-4">
                      <div className="flex items-center gap-2 text-[#5956F5]">
                        <BriefcaseBusiness size={16} strokeWidth={1.8} />

                        <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">
                          Deneyim
                        </span>
                      </div>

                      <p className="mt-2 text-[13px] font-medium text-[#111827]">
                        {doctor.experience}
                      </p>
                    </div>

                    {/* Clinic */}
                    <div className="rounded-[18px] border border-slate-100 bg-[#F8FAFD] p-4">
                      <div className="flex items-center gap-2 text-[#5956F5]">
                        <Building2 size={16} strokeWidth={1.8} />

                        <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">
                          Klinik
                        </span>
                      </div>

                      <p className="mt-2 text-[13px] font-medium leading-5 text-[#111827]">
                        {doctor.clinic}
                      </p>
                    </div>

                    {/* Location */}
                    <div className="rounded-[18px] border border-slate-100 bg-[#F8FAFD] p-4">
                      <div className="flex items-center gap-2 text-[#5956F5]">
                        <MapPin size={16} strokeWidth={1.8} />

                        <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">
                          Konum
                        </span>
                      </div>

                      <p className="mt-2 text-[13px] font-medium leading-5 text-[#111827]">
                        {doctor.location}
                      </p>
                    </div>
                  </div>

                  {/* Appointment Button */}
                  <div className="mt-7 border-t border-slate-100 pt-6">
                    <button
                      type="button"
                      onClick={() => setView('booking')}
                      className="group flex h-14 w-full items-center justify-center gap-2 rounded-[18px] bg-[#5956F5] px-6 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(89,86,245,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#504DEB]"
                    >
                      <CalendarDays size={17} />
                      Randevu Al
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* Booking */
                <motion.div
                  key="booking"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.2 }}
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
                      {doctor.name}
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
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
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
                    <Send size={16} />
                    Randevu Sürecine Devam Et
                  </button>

                  <p className="mt-4 text-center text-[11px] leading-5 text-slate-400">
                    Tarih ve saat seçimi randevu sistemi tamamlandığında
                    aktif olacaktır.
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

export default DoctorDetailsModal