import {
  CalendarDays,
  LoaderCircle,
  ReceiptText,
  X,
} from 'lucide-react'

import {
  useState,
} from 'react'

import {
  motion,
} from 'motion/react'

import {
  createInvoice,
} from '../api/doctorInvoicesApi.js'


const initialForm = {
  description: '',
  amount: '',
  dueDate: '',
}


export default function DoctorInvoiceForm({
  treatment,
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

      if (!treatment?.id) {
        setError(
          'Tedavi kaydı bulunamadı.',
        )

        return
      }


      const description =
        form.description.trim()

      const amount =
        Number(form.amount)


      if (
        description.length < 3
      ) {
        setError(
          'Fatura açıklaması en az 3 karakter olmalıdır.',
        )

        return
      }


      if (
        !Number.isFinite(amount) ||
        amount <= 0
      ) {
        setError(
          'Geçerli bir fatura tutarı girin.',
        )

        return
      }


      try {
        setSubmitting(true)
        setError('')


        const response =
          await createInvoice({
            treatmentRecordId:
              treatment.id,

            description,

            amount,

            dueDate:
              form.dueDate
                ? new Date(
                    form.dueDate,
                  ).toISOString()
                : null,
          })


        onSuccess?.(
          response,
        )
      } catch (
        requestError
      ) {
        setError(
          requestError.message ||
            'Fatura oluşturulamadı.',
        )
      } finally {
        setSubmitting(false)
      }
    }


  return (
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
        onClick={() => {
          if (!submitting) {
            onCancel?.()
          }
        }}
        className="absolute inset-0 bg-[#111124]/50 backdrop-blur-[5px]"
      />


      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-invoice-title"
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
        className="relative z-10 w-full max-w-[900px] overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(145deg,#17172E_0%,#211F4A_58%,#292461_100%)] text-white shadow-[0_32px_90px_rgba(18,18,37,0.42)]"
      >
        <div className="flex items-start justify-between border-b border-white/10 px-6 py-5 sm:px-7">
          <div className="flex items-start gap-4">
            <div className="grid size-11 shrink-0 place-items-center rounded-[13px] bg-[#7168FF]/15 text-[#AAA5FF]">
              <ReceiptText
                size={19}
                strokeWidth={1.9}
              />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#9D96FF]">
                Fatura Yönetimi
              </p>

              <h2
                id="create-invoice-title"
                className="mt-1.5 text-[22px] font-semibold tracking-[-0.025em] text-white"
              >
                Yeni Fatura Oluştur
              </h2>

              <p className="mt-1.5 text-[12px] leading-5 text-white/45">
                Tedavi kaydına bağlı faturayı güvenli şekilde oluşturun.
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
            className="grid size-10 shrink-0 place-items-center rounded-[12px] border border-white/10 bg-white/[0.05] text-white/55 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </div>


        <form
          onSubmit={
            handleSubmit
          }
        >
          <div className="px-6 py-6 sm:px-7">

            <div className="rounded-[16px] border border-[#8D85FF]/20 bg-[#8D85FF]/[0.08] p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-white/35">
                    Hasta
                  </p>

                  <p className="mt-1 text-[14px] font-semibold text-white">
                    {treatment
                      ?.patient
                      ?.name ||
                      'Hasta'}
                  </p>

                  <p className="mt-1 text-[11px] text-white/40">
                    {treatment
                      ?.diagnosis ||
                      'Tedavi bilgisi bulunamadı'}
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
                      {treatment
                        ?.appointment
                        ?.appointmentCode ||
                        '—'}
                    </p>
                  </div>
                </div>
              </div>
            </div>


            {error && (
              <div className="mt-5 rounded-[14px] border border-red-300/20 bg-red-400/10 px-4 py-3 text-[12px] font-medium text-red-100">
                {error}
              </div>
            )}


            <div className="mt-5">
              <label
                htmlFor="description"
                className="text-[11px] font-semibold text-white/55"
              >
                Fatura Açıklaması
              </label>

              <textarea
                id="description"
                name="description"
                value={
                  form.description
                }
                onChange={
                  handleChange
                }
                maxLength={1500}
                rows={3}
                required
                placeholder="Faturaya ait hizmet açıklamasını girin."
                className="mt-2 w-full resize-none rounded-[14px] border border-white/10 bg-white/[0.07] px-4 py-3 text-[13px] leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-[#8D85FF]/60 focus:bg-white/[0.09] focus:ring-4 focus:ring-[#7168FF]/10"
              />
            </div>


            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="amount"
                  className="text-[11px] font-semibold text-white/55"
                >
                  Tutar (₺)
                </label>

                <input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={
                    form.amount
                  }
                  onChange={
                    handleChange
                  }
                  required
                  placeholder="0,00"
                  className="mt-2 h-11 w-full rounded-[14px] border border-white/10 bg-white/[0.07] px-4 text-[13px] text-white outline-none transition placeholder:text-white/25 focus:border-[#8D85FF]/60 focus:bg-white/[0.09] focus:ring-4 focus:ring-[#7168FF]/10"
                />
              </div>


              <div>
                <label
                  htmlFor="dueDate"
                  className="text-[11px] font-semibold text-white/55"
                >
                  Son Ödeme Tarihi
                </label>

                <input
                  id="dueDate"
                  name="dueDate"
                  type="datetime-local"
                  value={
                    form.dueDate
                  }
                  onChange={
                    handleChange
                  }
                  className="mt-2 h-11 w-full rounded-[14px] border border-white/10 bg-white/[0.07] px-4 text-[13px] text-white outline-none transition [color-scheme:dark] focus:border-[#8D85FF]/60 focus:bg-white/[0.09] focus:ring-4 focus:ring-[#7168FF]/10"
                />
              </div>
            </div>


            <div className="mt-5 rounded-[16px] border border-[#8D85FF]/20 bg-[#8D85FF]/[0.08] p-4">
              <div className="flex gap-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-[#7168FF]/20 text-[#AAA5FF]">
                  <ReceiptText
                    size={17}
                    strokeWidth={1.9}
                  />
                </div>

                <div>
                  <p className="text-[12px] font-semibold text-[#D5D2FF]">
                    Fatura tedavi kaydına bağlanır
                  </p>

                  <p className="mt-1 text-[11.5px] leading-5 text-white/42">
                    Hasta, doktor ve randevu bilgileri sistem tarafından otomatik olarak eşleştirilir.
                  </p>
                </div>
              </div>
            </div>
          </div>


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
              className="inline-flex h-10 min-w-[160px] items-center justify-center gap-2 rounded-[12px] bg-[#7168FF] px-4 text-[12px] font-semibold text-white shadow-[0_10px_24px_rgba(113,104,255,0.28)] transition hover:-translate-y-0.5 hover:bg-[#655CF0] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
            >
              {submitting && (
                <LoaderCircle
                  size={15}
                  className="animate-spin"
                />
              )}

              {submitting
                ? 'Oluşturuluyor...'
                : 'Faturayı Oluştur'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}