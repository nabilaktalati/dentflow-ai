import { useState } from 'react'
import {
  CheckCircle2,
  Mail,
  MessageCircle,
  Send,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
}

function ContactPage() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const handleChange = (event) => {
    const { name, value } = event.target

    let nextValue = value

    // Telefon alanında harf girişini engelle
    if (name === 'phone') {
      nextValue = value.replace(/[^0-9+\s()-]/g, '')
    }

    setForm((current) => ({
      ...current,
      [name]: nextValue,
    }))

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: '',
      }))
    }

    if (status !== 'idle') {
      setStatus('idle')
    }
  }

  const validate = () => {
    const nextErrors = {}

    if (!form.fullName.trim()) {
      nextErrors.fullName = 'Ad soyad alanı zorunludur.'
    }

    if (!form.email.trim()) {
      nextErrors.email = 'E-posta alanı zorunludur.'
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      nextErrors.email = 'Geçerli bir e-posta adresi girin.'
    }

    if (form.phone.trim()) {
      const normalizedPhone = form.phone.replace(/\s/g, '')

      if (!/^[+0-9()-]{7,20}$/.test(normalizedPhone)) {
        nextErrors.phone = 'Geçerli bir telefon numarası girin.'
      }
    }

    if (!form.subject.trim()) {
      nextErrors.subject = 'Konu alanı zorunludur.'
    }

    if (!form.message.trim()) {
      nextErrors.message = 'Mesaj alanı zorunludur.'
    } else if (form.message.trim().length < 10) {
      nextErrors.message = 'Mesaj en az 10 karakter olmalıdır.'
    }

    return nextErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validationErrors = validate()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setStatus('error')
      return
    }

    setErrors({})
    setStatus('loading')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Mesaj gönderilemedi.')
      }

      setStatus('success')
      setForm(initialForm)
    } catch (error) {
      console.error('Contact form error:', error)
      setStatus('submitError')
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFD] text-[#111827]">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute right-[5%] top-[14%] size-[480px] rounded-full bg-[#5956F5]/[0.04] blur-[130px]" />

        <div className="mx-auto grid min-h-[calc(100svh-68px)] max-w-[1280px] items-center gap-14 px-6 py-20 lg:grid-cols-[0.82fr_1.18fr] lg:px-10 lg:py-24">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-[520px]"
          >
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#5956F5]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.23em] text-[#5956F5]">
                İletişim
              </span>
            </div>

            <h1 className="mt-7 font-heading text-[clamp(2.8rem,4.5vw,4.9rem)] font-semibold leading-[0.98] tracking-[-0.055em]">
              Bizimle
              <span className="block text-[#5956F5]">
                iletişime geçin.
              </span>
            </h1>

            <p className="mt-6 max-w-[470px] text-[15px] leading-8 text-slate-500">
              DentFlow AI hakkında sorularınız, platform kullanımı veya
              klinik süreçleriyle ilgili talepleriniz için bize mesaj
              gönderebilirsiniz.
            </p>

            <div className="mt-10 space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-[15px] bg-[#5956F5]/10 text-[#5956F5]">
                  <Mail size={18} strokeWidth={1.8} />
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                    E-posta
                  </p>

                  <a
                    href="mailto:dentflowai.clinic@gmail.com"
                    className="mt-1 inline-block text-sm font-medium text-[#111827] transition hover:text-[#5956F5]"
                  >
                    dentflowai.clinic@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-[15px] bg-[#5956F5]/10 text-[#5956F5]">
                  <MessageCircle size={18} strokeWidth={1.8} />
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                    Destek
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#111827]">
                    İletişim formu üzerinden bize ulaşabilirsiniz.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-[15px] bg-[#5956F5]/10 text-[#5956F5]">
                  <CheckCircle2 size={18} strokeWidth={1.8} />
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                    Yanıt Süreci
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#111827]">
                    Mesajlar en kısa sürede değerlendirilir.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 border-l-2 border-[#5956F5] pl-5">
              <p className="max-w-[420px] text-sm leading-7 text-slate-500">
                Klinik süreçleriyle ilgili tıbbi değerlendirme veya
                teşhis talepleri iletişim formu üzerinden sunulmaz.
              </p>
            </div>
          </motion.div>

          {/* RIGHT FORM */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="relative"
          >
            <div className="absolute -inset-12 -z-10 rounded-full bg-[#5956F5]/[0.04] blur-3xl" />

            <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.08)]">
              <div className="border-b border-slate-100 px-7 py-6 sm:px-9">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5956F5]">
                  Mesaj Gönder
                </p>

                <h2 className="mt-2 font-heading text-[27px] font-semibold tracking-[-0.04em]">
                  Size nasıl yardımcı olabiliriz?
                </h2>
              </div>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="p-7 sm:p-9"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Ad Soyad"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Adınız ve soyadınız"
                    error={errors.fullName}
                    required
                  />

                  <Field
                    label="E-posta"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="ornek@email.com"
                    error={errors.email}
                    required
                  />

                  <Field
                    label="Telefon"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+90 5__ ___ __ __"
                    error={errors.phone}
                  />

                  <Field
                    label="Konu"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Mesaj konusu"
                    error={errors.subject}
                    required
                  />
                </div>

                <div className="mt-5">
                  <label
                    htmlFor="message"
                    className="mb-2.5 block text-[13px] font-semibold text-slate-700"
                  >
                    Mesaj
                    <span className="ml-1 text-[#5956F5]">*</span>
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={6}
                    maxLength={1000}
                    placeholder="Mesajınızı yazın..."
                    className={`w-full resize-none rounded-[18px] border bg-[#F8FAFD] p-4 text-sm leading-6 text-[#111827] outline-none transition ${
                      errors.message
                        ? 'border-red-300 ring-4 ring-red-50'
                        : 'border-slate-200 focus:border-[#5956F5]/50 focus:bg-white focus:ring-4 focus:ring-[#5956F5]/[0.06]'
                    }`}
                  />

                  <div className="mt-2 flex items-start justify-between gap-4">
                    <div>
                      {errors.message && (
                        <p className="text-[12px] font-medium text-red-500">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    <span className="text-[11px] text-slate-400">
                      {form.message.length}/1000
                    </span>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {status === 'success' && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-5 flex items-start gap-3 rounded-[18px] border border-emerald-100 bg-emerald-50/70 p-4"
                    >
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-emerald-600"
                      />

                      <div>
                        <p className="text-[13px] font-semibold text-emerald-900">
                          Mesajınız alındı.
                        </p>

                        <p className="mt-1 text-xs leading-5 text-emerald-700">
                          Mesajınız başarıyla gönderildi. En kısa sürede sizinle
                          iletişime geçeceğiz.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {status === 'error' && Object.keys(errors).length > 0 && (
                    <motion.p
                      key="error"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mt-5 text-[12px] font-medium text-red-500"
                    >
                      Lütfen işaretlenen alanları kontrol edin.
                    </motion.p>
                  )}
                  {status === 'submitError' && (
                    <motion.div
                      key="submitError"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-5 rounded-[18px] border border-red-100 bg-red-50/70 p-4"
                    >
                      <p className="text-[13px] font-semibold text-red-700">
                        Mesaj gönderilemedi.
                      </p>

                      <p className="mt-1 text-xs leading-5 text-red-600">
                        Lütfen daha sonra tekrar deneyin.
                      </p>
                    </motion.div>
                  )}



                </AnimatePresence>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="group mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-[18px] bg-[#5956F5] px-6 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(89,86,245,0.20)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#504DEB] focus:outline-none focus:ring-4 focus:ring-[#5956F5]/20 disabled:translate-y-0 disabled:cursor-wait disabled:opacity-70"
                >
                  {status === 'loading' ? (
                    'Gönderiliyor...'
                  ) : (
                    <>
                      Mesaj Gönder
                      <Send
                        size={16}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </>
                  )}
                </button>

                <div className="mt-5 flex items-center justify-center gap-2 border-t border-slate-100 pt-5">
                  <span className="size-1.5 rounded-full bg-emerald-500" />

                  <p className="text-[11px] text-slate-400">
                    Bilgileriniz yalnızca iletişim talebiniz için kullanılır.
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

function Field({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2.5 block text-[13px] font-semibold text-slate-700"
      >
        {label}

        {required && (
          <span className="ml-1 text-[#5956F5]">*</span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        inputMode={type === 'tel' ? 'tel' : undefined}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`h-[56px] w-full rounded-[18px] border bg-[#F8FAFD] px-4 text-sm text-[#111827] outline-none transition ${
          error
            ? 'border-red-300 ring-4 ring-red-50'
            : 'border-slate-200 focus:border-[#5956F5]/50 focus:bg-white focus:ring-4 focus:ring-[#5956F5]/[0.06]'
        }`}
      />

      {error && (
        <p className="mt-2 text-[12px] font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}

export default ContactPage