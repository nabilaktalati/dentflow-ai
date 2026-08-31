import {
  CalendarDays,
  LoaderCircle,
  Stethoscope,
  X,
} from 'lucide-react'

import {
  useState,
} from 'react'

import {
  motion,
} from 'motion/react'

import {
  createTreatmentRecord,
} from '../api/doctorTreatmentsApi.js'


const initialForm = {
  diagnosis: '',
  treatmentPlan: '',
  doctorNotes: '',
  status: 'IN_PROGRESS',
  nextVisitDate: '',
}


export default function DoctorTreatmentForm({
  appointment,
  onCancel,
  onSuccess,
}) {
  const [
    form,
    setForm,
  ] = useState(initialForm)

  const [
    submitting,
    setSubmitting,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState('')


  const handleChange = (
    event,
  ) => {
    const {
      name,
      value,
    } = event.target

    setForm(
      (current) => ({
        ...current,
        [name]: value,
      }),
    )

    if (error) {
      setError('')
    }
  }


  const handleSubmit =
    async (event) => {
      event.preventDefault()

      if (!appointment?.id) {
        setError(
          'Randevu bilgisi bulunamadı.',
        )

        return
      }


      const diagnosis =
        form.diagnosis.trim()

      const treatmentPlan =
        form.treatmentPlan.trim()

      const doctorNotes =
        form.doctorNotes.trim()


      if (
        diagnosis.length < 3
      ) {
        setError(
          'Teşhis en az 3 karakter olmalıdır.',
        )

        return
      }


      if (
        treatmentPlan.length <
        3
      ) {
        setError(
          'Tedavi planı en az 3 karakter olmalıdır.',
        )

        return
      }


      try {
        setSubmitting(true)
        setError('')


        const payload = {
          appointmentId:
            appointment.id,

          diagnosis,

          treatmentPlan,

          doctorNotes,

          status:
            form.status,

          nextVisitDate:
            form.nextVisitDate
              ? new Date(
                  form.nextVisitDate,
                ).toISOString()
              : null,
        }


        const response =
          await createTreatmentRecord(
            payload,
          )


        onSuccess?.(
          response,
        )
      } catch (
        requestError
      ) {
        setError(
          requestError.message ||
            'Tedavi kaydı oluşturulamadı.',
        )
      } finally {
        setSubmitting(false)
      }
    }


  return (
    <div className="fixed inset-0 z-[80] grid place-items-center p-4 sm:p-6">

      {/* BACKDROP */}
      <motion.button
        type="button"
        aria-label="Pencereyi kapat"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        onClick={() => {
          if (!submitting) {
            onCancel?.()
          }
        }}
        className="absolute inset-0 bg-[#111124]/50 backdrop-blur-[5px]"
      />


      {/* MODAL */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-treatment-title"
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
        transition={{
          duration: 0.3,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
        className="relative z-10 w-full max-w-[980px] overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(145deg,#17172E_0%,#211F4A_58%,#292461_100%)] text-white shadow-[0_32px_90px_rgba(18,18,37,0.42)]"
      >

        {/* HEADER */}
        <div className="flex items-start justify-between border-b border-white/10 px-6 py-5 sm:px-7">
          <div className="flex items-start gap-4">
            <div className="grid size-11 shrink-0 place-items-center rounded-[13px] bg-[#7168FF]/15 text-[#AAA5FF]">
              <Stethoscope
                size={19}
                strokeWidth={1.9}
              />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#9D96FF]">
                Tedavi Yönetimi
              </p>

              <h2
                id="create-treatment-title"
                className="mt-1.5 text-[22px] font-semibold tracking-[-0.025em] text-white"
              >
                Yeni Tedavi Kaydı Oluştur
              </h2>

              <p className="mt-1.5 text-[12px] leading-5 text-white/45">
                Hasta tedavi sürecini güvenli şekilde kaydedin.
              </p>
            </div>
          </div>


          <button
            type="button"
            onClick={
              onCancel
            }
            disabled={
              submitting
            }
            aria-label="Pencereyi kapat"
            className="grid size-10 shrink-0 place-items-center rounded-[12px] border border-white/10 bg-white/[0.05] text-white/55 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </div>


        <form
          onSubmit={
            handleSubmit
          }
        >
          <div className="max-h-[min(70vh,700px)] overflow-y-auto px-6 py-6 sm:px-7">

            {/* PATIENT / APPOINTMENT */}
            <div className="mb-5 rounded-[16px] border border-[#8D85FF]/20 bg-[#8D85FF]/[0.08] p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-white/35">
                    Hasta
                  </p>

                  <p className="mt-1 text-[14px] font-semibold text-white">
                    {appointment
                      ?.patient
                      ?.name ||
                      'Hasta'}
                  </p>
                </div>


                <div className="flex items-center gap-3 rounded-[13px] border border-white/10 bg-white/[0.04] px-4 py-3">
                  <CalendarDays
                    size={16}
                    className="text-[#AAA5FF]"
                  />

                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/30">
                      Randevu Kodu
                    </p>

                    <p className="mt-1 font-mono text-[12px] font-semibold tracking-[0.08em] text-[#D5D2FF]">
                      {appointment
                        ?.appointmentCode ||
                        '—'}
                    </p>
                  </div>
                </div>
              </div>
            </div>


            {/* ERROR */}
            {error && (
              <div className="mb-5 rounded-[14px] border border-red-300/20 bg-red-400/10 px-4 py-3 text-[12px] font-medium text-red-100">
                {error}
              </div>
            )}


       <div className="grid gap-4 lg:grid-cols-3">

  {/* DIAGNOSIS */}
  <div>
    <label
      htmlFor="diagnosis"
      className="text-[11px] font-semibold text-white/55"
    >
      Teşhis
    </label>

    <textarea
      id="diagnosis"
      name="diagnosis"
      value={form.diagnosis}
      onChange={handleChange}
      maxLength={1000}
      rows={5}
      required
      placeholder="Hastanın teşhis bilgisini girin."
      className="mt-2 w-full resize-none rounded-[14px] border border-white/10 bg-white/[0.07] px-4 py-3 text-[13px] leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-[#8D85FF]/60 focus:bg-white/[0.09] focus:ring-4 focus:ring-[#7168FF]/10"
    />
  </div>


  {/* TREATMENT PLAN */}
  <div>
    <label
      htmlFor="treatmentPlan"
      className="text-[11px] font-semibold text-white/55"
    >
      Tedavi Planı
    </label>

    <textarea
      id="treatmentPlan"
      name="treatmentPlan"
      value={form.treatmentPlan}
      onChange={handleChange}
      maxLength={1500}
      rows={5}
      required
      placeholder="Uygulanacak tedavi planını girin."
      className="mt-2 w-full resize-none rounded-[14px] border border-white/10 bg-white/[0.07] px-4 py-3 text-[13px] leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-[#8D85FF]/60 focus:bg-white/[0.09] focus:ring-4 focus:ring-[#7168FF]/10"
    />
  </div>


  {/* DOCTOR NOTE */}
  <div>
    <label
      htmlFor="doctorNotes"
      className="text-[11px] font-semibold text-white/55"
    >
      Doktor Notu
    </label>

    <textarea
      id="doctorNotes"
      name="doctorNotes"
      value={form.doctorNotes}
      onChange={handleChange}
      maxLength={2000}
      rows={5}
      placeholder="İsteğe bağlı doktor notu."
      className="mt-2 w-full resize-none rounded-[14px] border border-white/10 bg-white/[0.07] px-4 py-3 text-[13px] leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-[#8D85FF]/60 focus:bg-white/[0.09] focus:ring-4 focus:ring-[#7168FF]/10"
    />
  </div>

</div>

            {/* STATUS + NEXT VISIT */}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="status"
                  className="text-[11px] font-semibold text-white/55"
                >
                  Tedavi Durumu
                </label>

                <select
                  id="status"
                  name="status"
                  value={
                    form.status
                  }
                  onChange={
                    handleChange
                  }
                  className="mt-2 h-11 w-full rounded-[14px] border border-white/10 bg-[#302E5A] px-4 text-[13px] font-medium text-white outline-none transition focus:border-[#8D85FF]/60 focus:ring-4 focus:ring-[#7168FF]/10"
                >
                  <option
                    value="PLANNED"
                    className="bg-[#211F4A]"
                  >
                    Planlandı
                  </option>

                  <option
                    value="IN_PROGRESS"
                    className="bg-[#211F4A]"
                  >
                    Devam Ediyor
                  </option>

                  <option
                    value="COMPLETED"
                    className="bg-[#211F4A]"
                  >
                    Tamamlandı
                  </option>
                </select>
              </div>


              <div>
                <label
                  htmlFor="nextVisitDate"
                  className="text-[11px] font-semibold text-white/55"
                >
                  Sonraki Kontrol
                </label>

                <input
                  id="nextVisitDate"
                  name="nextVisitDate"
                  type="datetime-local"
                  value={
                    form.nextVisitDate
                  }
                  onChange={
                    handleChange
                  }
                  className="mt-2 h-11 w-full rounded-[14px] border border-white/10 bg-white/[0.07] px-4 text-[13px] text-white outline-none transition [color-scheme:dark] focus:border-[#8D85FF]/60 focus:bg-white/[0.09] focus:ring-4 focus:ring-[#7168FF]/10"
                />
              </div>
            </div>


            {/* INFO */}
            <div className="mt-5 rounded-[16px] border border-[#8D85FF]/20 bg-[#8D85FF]/[0.08] p-4">
              <div className="flex gap-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-[#7168FF]/20 text-[#AAA5FF]">
                  <Stethoscope
                    size={17}
                    strokeWidth={1.9}
                  />
                </div>

                <div>
                  <p className="text-[12px] font-semibold text-[#D5D2FF]">
                    Tedavi kaydı hasta dosyasına eklenir
                  </p>

                  <p className="mt-1 text-[11.5px] leading-5 text-white/42">
                    Hasta ve doktor bilgileri randevu üzerinden otomatik olarak eşleştirilir.
                  </p>
                </div>
              </div>
            </div>
          </div>


          {/* FOOTER */}
          <div className="flex items-center justify-end gap-3 border-t border-white/10 bg-black/[0.08] px-6 py-4 sm:px-7">
            <button
              type="button"
              onClick={
                onCancel
              }
              disabled={
                submitting
              }
              className="h-10 rounded-[12px] border border-white/10 bg-white/[0.05] px-4 text-[12px] font-semibold text-white/65 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
            >
              Vazgeç
            </button>


            <button
              type="submit"
              disabled={
                submitting
              }
              className="inline-flex h-10 min-w-[190px] items-center justify-center gap-2 rounded-[12px] bg-[#7168FF] px-4 text-[12px] font-semibold text-white shadow-[0_10px_24px_rgba(113,104,255,0.28)] transition hover:-translate-y-0.5 hover:bg-[#655CF0] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
            >
              {submitting && (
                <LoaderCircle
                  size={15}
                  className="animate-spin"
                />
              )}

              {submitting
                ? 'Kaydediliyor...'
                : 'Tedavi Kaydını Oluştur'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}