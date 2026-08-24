import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  ArrowRight,
  ChevronLeft,
  Clock3,
  ReceiptText,
  Search,
  ShieldCheck,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

function InvoiceQueryPage() {
  const navigate = useNavigate()

  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [status, setStatus] = useState('idle')

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!invoiceNumber.trim()) {
      setStatus('error')
      return
    }

    setStatus('loading')

    window.setTimeout(() => {
      setStatus('preview')
    }, 700)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F8FAFD]">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5956F5]/[0.045] blur-[120px]" />

      {/* Back Button */}
      <div className="absolute left-5 top-5 z-20 sm:left-8 sm:top-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="group flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-600 shadow-sm transition-all duration-300 hover:border-slate-300 hover:text-[#111827] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#5956F5]/10"
        >
          <ChevronLeft
            size={17}
            strokeWidth={1.8}
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
          />

          Geri Dön
        </button>
      </div>

      {/* Invoice Card */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-5 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-[540px]"
        >
          <div className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-white p-7 shadow-[0_30px_90px_rgba(15,23,42,0.09)] sm:p-10">

            {/* Decorative glow */}
            <div className="pointer-events-none absolute -right-16 -top-16 size-52 rounded-full bg-[#5956F5]/[0.06] blur-3xl" />

            {/* Invoice watermark */}
            <div className="pointer-events-none absolute right-5 top-6 rotate-[8deg] text-[#5956F5] opacity-[0.025]">
              <ReceiptText size={150} strokeWidth={1} />
            </div>

            {/* Dot pattern */}
            <div className="pointer-events-none absolute bottom-6 left-6 grid grid-cols-4 gap-2 opacity-15">
              {Array.from({ length: 12 }).map((_, index) => (
                <span
                  key={index}
                  className="size-1 rounded-full bg-[#5956F5]"
                />
              ))}
            </div>

            {/* Header */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="relative flex size-14 items-center justify-center rounded-[18px] bg-[#5956F5]/10 text-[#5956F5] shadow-[0_10px_30px_rgba(89,86,245,0.12)]">
                <span className="absolute -inset-3 -z-10 rounded-full bg-[#5956F5]/10 blur-xl" />

                <ReceiptText size={23} strokeWidth={1.8} />
              </div>

              <h1 className="mt-5 font-heading text-[30px] font-semibold tracking-[-0.045em] text-[#111827] sm:text-[34px]">
                Fatura Sorgulama
              </h1>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="relative z-10 mt-9"
            >
              <label
                htmlFor="invoiceNumber"
                className="mb-2.5 block text-[13px] font-semibold text-slate-700"
              >
                Fatura Numarası
              </label>

              <div
                className={`flex h-[62px] items-center rounded-[18px] border px-5 transition-all duration-300 ${
                  status === 'error'
                    ? 'border-red-300 bg-red-50/30 ring-4 ring-red-50'
                    : 'border-slate-200 bg-[#F8FAFD] focus-within:border-[#5956F5]/50 focus-within:bg-white focus-within:ring-4 focus-within:ring-[#5956F5]/[0.06]'
                }`}
              >
                <Search
                  size={19}
                  strokeWidth={1.8}
                  className="shrink-0 text-slate-400"
                />

                <input
                  id="invoiceNumber"
                  value={invoiceNumber}
                  onChange={(event) => {
                    setInvoiceNumber(event.target.value)

                    if (status !== 'idle') {
                      setStatus('idle')
                    }
                  }}
                  placeholder="INV-2026-1048"
                  autoComplete="off"
                  className="h-full w-full bg-transparent px-4 text-[15px] font-medium uppercase tracking-[0.05em] text-[#111827] outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-400"
                />
              </div>

              <AnimatePresence mode="wait">
                {status === 'error' && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-2.5 text-[13px] font-medium text-red-500"
                  >
                    Lütfen fatura numaranızı girin.
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="group mt-4 flex h-[58px] w-full items-center justify-center gap-2 rounded-[18px] bg-[#5956F5] px-6 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(89,86,245,0.20)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#504DEB] hover:shadow-[0_18px_38px_rgba(89,86,245,0.26)] focus:outline-none focus:ring-4 focus:ring-[#5956F5]/20 disabled:translate-y-0 disabled:cursor-wait disabled:opacity-70"
              >
                {status === 'loading'
                  ? 'Sorgulanıyor...'
                  : 'Faturayı Sorgula'}

                {status !== 'loading' && (
                  <ArrowRight
                    size={17}
                    strokeWidth={2}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            {/* Preview */}
            <AnimatePresence>
              {status === 'preview' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 mt-5 rounded-[18px] border border-[#5956F5]/10 bg-[#5956F5]/[0.045] p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#5956F5] shadow-sm">
                      <Clock3 size={17} strokeWidth={1.9} />
                    </div>

                    <div>
                      <p className="text-[13px] font-semibold text-[#111827]">
                        Sorgulama arayüzü hazır
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Fatura bilgileri backend entegrasyonu sonrasında
                        burada görüntülenecektir.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Security */}
            <div className="relative z-10 mt-7 flex items-center justify-center gap-2 border-t border-slate-100 pt-5">
              <ShieldCheck
                size={14}
                strokeWidth={1.8}
                className="text-emerald-500"
              />

              <span className="text-[11px] font-medium text-slate-400">
                Güvenli fatura sorgulama
              </span>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  )
}

export default InvoiceQueryPage