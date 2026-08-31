import {
  useState,
} from 'react'

import {
  createPortal,
} from 'react-dom'

import {
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wifi,
  X,
} from 'lucide-react'

import {
  motion,
} from 'motion/react'

import {
  createDemoPayment,
} from '../api/patientPaymentsApi.js'


const DEMO_CARD =
  '4242 4242 4242 4242'


const formatAmount = (
  amount,
) =>
  new Intl.NumberFormat(
    'tr-TR',
    {
      style: 'currency',
      currency: 'TRY',
    },
  ).format(
    Number(amount || 0),
  )


const formatCardNumber = (
  value,
) =>
  value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(
      /(\d{4})(?=\d)/g,
      '$1 ',
    )


const formatExpiry = (
  value,
) => {
  const digits =
    value
      .replace(/\D/g, '')
      .slice(0, 4)

  if (
    digits.length <= 2
  ) {
    return digits
  }

  return `${digits.slice(
    0,
    2,
  )}/${digits.slice(2)}`
}


function DentFlowCard({
  patientName,
  cardNumber,
  expiry,
}) {
  const cardDisplay =
    cardNumber ||
    '•••• •••• •••• ••••'

  return (
    <motion.div
      animate={{
        y: [
          0,
          -5,
          0,
        ],
        rotate: [
          -0.5,
          0.35,
          -0.5,
        ],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="relative mx-auto w-full max-w-[350px]"
    >
      <div className="absolute inset-x-[12%] -bottom-8 h-14 rounded-full bg-[#655CFF]/25 blur-[30px]" />

      <div className="relative aspect-[1.58/1] overflow-hidden rounded-[28px] border border-[#6964FF]/60 bg-[linear-gradient(135deg,#101329_0%,#11152D_44%,#251A4E_100%)] p-6 shadow-[0_28px_75px_rgba(0,0,0,0.42),0_0_45px_rgba(101,92,255,0.14)]">
        <div className="absolute -right-24 -top-32 size-[320px] rounded-full bg-[#725CFF]/20 blur-[70px]" />

        <div className="absolute bottom-[-120px] left-[-40px] size-[280px] rounded-full bg-[#318CFF]/10 blur-[70px]" />

        <div className="absolute inset-0 opacity-40">
          <div className="absolute -right-16 top-12 h-px w-[90%] rotate-[-18deg] bg-gradient-to-r from-transparent via-[#7A70FF] to-transparent" />
          <div className="absolute -right-8 top-24 h-px w-[82%] rotate-[-18deg] bg-gradient-to-r from-transparent via-[#957EFF] to-transparent" />
          <div className="absolute -right-4 top-36 h-px w-[74%] rotate-[-18deg] bg-gradient-to-r from-transparent via-[#665FFF] to-transparent" />
        </div>

        <motion.div
          animate={{
            x: [
              '-170%',
              '200%',
            ],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            repeatDelay: 1.7,
            ease: 'easeInOut',
          }}
          className="pointer-events-none absolute -top-[30%] h-[160%] w-[22%] rotate-[18deg] bg-gradient-to-r from-transparent via-white/10 to-transparent blur-xl"
        />

        <div className="relative z-10 flex h-full flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-[15px] border border-[#655FFF]/40 bg-[#151B39]/80">
                <svg
                  width="23"
                  height="27"
                  viewBox="0 0 32 36"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M8.7 3.4C11.4 2.2 13.9 3.5 16 4.4C18.1 3.5 20.6 2.2 23.3 3.4C27.8 5.4 28.9 10.9 27.4 16C26.1 20.3 23.8 22.1 23.3 28.3C23 32.1 21.7 33.4 20.2 33.4C18.3 33.4 18 30.3 17.5 27.7C17.2 25.9 16.8 24.3 16 24.3C15.2 24.3 14.8 25.9 14.5 27.7C14 30.3 13.7 33.4 11.8 33.4C10.3 33.4 9 32.1 8.7 28.3C8.2 22.1 5.9 20.3 4.6 16C3.1 10.9 4.2 5.4 8.7 3.4Z"
                    stroke="url(#dentflow-payment-logo)"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <defs>
                    <linearGradient
                      id="dentflow-payment-logo"
                      x1="3"
                      y1="3"
                      x2="29"
                      y2="33"
                    >
                      <stop stopColor="#6DC8FF" />
                      <stop
                        offset="1"
                        stopColor="#775BFF"
                      />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div>
                <p className="text-[19px] font-bold tracking-[-0.03em] text-white">
                  DentFlow
                  <span className="ml-1 text-[#756BFF]">
                    AI
                  </span>
                </p>

                <p className="mt-0.5 text-[9px] font-medium text-[#9CA4C4]">
                  Akıllı Klinik Yönetimi
                </p>
              </div>
            </div>

            <Wifi
              size={25}
              className="rotate-90 text-[#D5DAEC]"
            />
          </div>


          <div>
            <div className="mb-5 flex size-[50px] items-center justify-center rounded-[12px] border border-[#D6D0BD]/60 bg-[linear-gradient(145deg,#DAD6C9,#938F87)]">
              <div className="h-[31px] w-[35px] rounded-[7px] border border-[#716E67]/60">
                <div className="mx-auto h-full w-[13px] border-x border-[#716E67]/60" />
                <div className="-mt-[16px] h-px w-full bg-[#716E67]/60" />
              </div>
            </div>

            <motion.p
              key={cardDisplay}
              initial={{
                opacity: 0.6,
                y: 2,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="font-mono text-[17px] font-medium tracking-[0.13em] text-[#F1F3FF]"
            >
              {cardDisplay}
            </motion.p>
          </div>


          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[8px] font-bold uppercase tracking-[0.22em] text-[#8992AF]">
                Kart Sahibi
              </p>

              <p className="mt-1.5 max-w-[215px] truncate text-[11px] font-semibold uppercase tracking-[0.07em] text-[#E9EBF7]">
                {patientName ||
                  'DENTFLOW HASTA'}
              </p>
            </div>

            <div className="flex gap-6">
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#8992AF]">
                  SKT
                </p>

                <motion.p
                  key={expiry}
                  initial={{
                    opacity: 0.6,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  className="mt-1.5 font-mono text-[11px] text-[#E9EBF7]"
                >
                  {expiry ||
                    '--/--'}
                </motion.p>
              </div>

              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#8992AF]">
                  CVV
                </p>

                <p className="mt-1.5 font-mono text-[11px] text-[#E9EBF7]">
                  •••
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}


export default function PatientPaymentModal({
  invoice,
  onClose,
}) {
  const patientName =
    invoice?.patient?.name ||
    'DentFlow Hasta'

  const [
    cardNumber,
    setCardNumber,
  ] = useState('')

  const [
    expiry,
    setExpiry,
  ] = useState('')

  const [
    cvv,
    setCvv,
  ] = useState('')

  const [
    address,
    setAddress,
  ] = useState('')

  const [
    loading,
    setLoading,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState('')

  const [
    payment,
    setPayment,
  ] = useState(null)


  const handleSubmit =
    async (event) => {
      event.preventDefault()

      if (
        cardNumber !==
        DEMO_CARD
      ) {
        setError(
          'Demo için yalnızca 4242 4242 4242 4242 test kartını kullanın.',
        )
        return
      }

      if (
        !/^(0[1-9]|1[0-2])\/\d{2}$/.test(
          expiry,
        )
      ) {
        setError(
          'Son kullanma tarihi AA/YY formatında olmalıdır.',
        )
        return
      }

      if (
        !/^\d{3}$/.test(
          cvv,
        )
      ) {
        setError(
          'CVV 3 haneli olmalıdır.',
        )
        return
      }

      if (
        address.trim().length <
        5
      ) {
        setError(
          'Lütfen geçerli bir fatura adresi girin.',
        )
        return
      }

      try {
        setLoading(true)
        setError('')

        const result =
          await createDemoPayment({
            invoiceId:
              invoice.id,

            cardNumber,

            expiry,

            cvv,

            address:
              address.trim(),
          })

        setPayment(
          result,
        )
      } catch (
        requestError
      ) {
        setError(
          requestError.message ||
            'Demo ödeme işlemi tamamlanamadı.',
        )
      } finally {
        setLoading(false)
      }
    }


  if (!invoice) {
    return null
  }


  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#070914]/75 px-3 py-5 backdrop-blur-[10px] sm:px-5">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.97,
          y: 14,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          duration: 0.26,
        }}
        className="relative my-auto max-h-[92vh] w-full max-w-[920px] overflow-y-auto rounded-[30px] border border-[#303653] bg-[#0D1020] shadow-[0_40px_120px_rgba(0,0,0,0.58)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="pointer-events-none absolute left-[-150px] top-[-180px] size-[400px] rounded-full bg-[#615FFF]/10 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-[-220px] right-[-120px] size-[440px] rounded-full bg-[#315DFF]/10 blur-[120px]" />


        <div className="relative z-10 flex items-start justify-between border-b border-[#252A40] px-6 py-4 sm:px-7">
          <div className="flex items-center gap-3.5">
            <div className="flex size-11 items-center justify-center rounded-[15px] border border-[#363C61] bg-[#15182C] text-[#716CFF]">
              <CreditCard
                size={20}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck
                  size={12}
                  className="text-[#6A8CFF]"
                />

                <p className="text-[8px] font-bold uppercase tracking-[0.22em] text-[#7771FF]">
                   Güvenli Ödeme
                </p>
              </div>

              <h2 className="mt-1 text-[22px] font-bold tracking-[-0.035em] text-white">
                Fatura Ödemesi
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex size-9 items-center justify-center rounded-[12px] border border-[#2A3049] bg-[#121626] text-[#8C94AB] transition hover:border-[#404763] hover:bg-[#181D31] hover:text-white disabled:opacity-50"
            aria-label="Kapat"
          >
            <X
              size={18}
            />
          </button>
        </div>


        <div className="relative z-10 border-b border-[#252A40] bg-[#0F1224]/75 px-6 py-3.5 sm:px-7">
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#737C98]">
                Fatura No
              </p>

              <p className="mt-1.5 font-mono text-[10px] font-bold tracking-[0.07em] text-[#7771FF]">
                {invoice.invoiceNumber}
              </p>
            </div>

            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#737C98]">
                Hasta
              </p>

              <p className="mt-1.5 truncate text-[10px] font-semibold uppercase text-[#D7DAE8]">
                {patientName}
              </p>
            </div>

            <div className="sm:text-right">
              <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#737C98]">
                Toplam Tutar
              </p>

              <p className="mt-1 text-[18px] font-bold tracking-[-0.03em] text-white">
                {formatAmount(
                  invoice.amount,
                )}
              </p>
            </div>
          </div>
        </div>


        <div className="relative z-10 grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative overflow-hidden border-b border-[#252A40] bg-[radial-gradient(circle_at_50%_35%,rgba(88,78,255,0.15),transparent_38%),#0B0E1B] px-5 py-7 lg:border-b-0 lg:border-r lg:px-6">
            <div className="pointer-events-none absolute inset-0 opacity-[0.28]">
              <div className="absolute left-[10%] top-[22%] h-px w-[85%] rotate-[-16deg] bg-gradient-to-r from-transparent via-[#655FFF] to-transparent" />
              <div className="absolute left-[18%] top-[30%] h-px w-[75%] rotate-[-16deg] bg-gradient-to-r from-transparent via-[#655FFF] to-transparent" />
            </div>

            <div className="relative">
              <div className="mb-7 flex items-center gap-2">
                <Sparkles
                  size={13}
                  className="text-[#7771FF]"
                />

                <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#7F87A2]">
                  DentFlow AI
                </p>
              </div>

              <DentFlowCard
                patientName={
                  patientName
                }
                cardNumber={
                  cardNumber
                }
                expiry={
                  expiry
                }
              />

              <div className="mx-auto mt-10 max-w-[370px] rounded-[15px] border border-amber-400/15 bg-amber-400/[0.06] px-4 py-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck
                    size={13}
                    className="shrink-0 text-amber-300"
                  />

                  <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-amber-200">
                  TEST ORTAMI
                  </p>
                </div>

                <p className="mt-2 text-[8px] leading-4 text-[#9299AE]">
                  Test ortamında yalnızca test kartı kullanılmalıdır.
                </p>
              </div>
            </div>
          </div>


          <div className="bg-[#101321] p-5 sm:p-6">
            {!payment ? (
              <form
                onSubmit={
                  handleSubmit
                }
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-[#323853] bg-[#171B2D] px-3 py-1.5">
                  <ShieldCheck
                    size={12}
                    className="text-emerald-400"
                  />

                  <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#9DA5BC]">
                    Demo Kart Ödemesi
                  </span>
                </div>

                <h3 className="mt-4 text-[26px] font-bold tracking-[-0.045em] text-white">
                  Kart Bilgileri
                </h3>

                <p className="mt-1.5 text-[10px] leading-5 text-[#828AA1]">
                  Bu alan yalnızca DentFlow test kartı ile demo ödeme akışını doğrulamak için kullanılır.
                </p>


                <div className="mt-5">
                  <label className="text-[9px] font-bold text-[#BFC4D4]">
                    Kart Üzerindeki İsim
                  </label>

                  <div className="relative mt-2">
                    <UserRound
                      size={15}
                      className="absolute left-4 top-3.5 text-[#6E68FF]"
                    />

                    <input
                      type="text"
                      value={patientName}
                      readOnly
                      className="h-11 w-full rounded-[14px] border border-[#30364E] bg-[#0C0F1D] pl-10 pr-4 text-[11px] uppercase text-[#DDE1ED] outline-none"
                    />
                  </div>
                </div>


                <div className="mt-4">
                  <label
                    htmlFor="demo-card-number"
                    className="text-[9px] font-bold text-[#BFC4D4]"
                  >
                    Kart Numarası
                  </label>

                  <div className="relative mt-2">
                    <CreditCard
                      size={15}
                      className="absolute left-4 top-3.5 text-[#6E68FF]"
                    />

                    <input
                      id="demo-card-number"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      value={cardNumber}
                      onChange={(
                        event,
                      ) => {
                        setCardNumber(
                          formatCardNumber(
                            event.target.value,
                          ),
                        )
                        setError('')
                      }}
                      placeholder="4242 4242 4242 4242"
                      className="h-11 w-full rounded-[14px] border border-[#30364E] bg-[#0C0F1D] pl-10 pr-4 font-mono text-[11px] tracking-[0.08em] text-[#E3E6F1] outline-none transition placeholder:text-[#555D76] focus:border-[#635FFF] focus:ring-4 focus:ring-[#615FFF]/10"
                    />
                  </div>
                </div>


                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="demo-expiry"
                      className="text-[9px] font-bold text-[#BFC4D4]"
                    >
                      Son Kullanma
                    </label>

                    <input
                      id="demo-expiry"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      value={expiry}
                      onChange={(
                        event,
                      ) => {
                        setExpiry(
                          formatExpiry(
                            event.target.value,
                          ),
                        )
                        setError('')
                      }}
                      placeholder="12/29"
                      maxLength={5}
                      className="mt-2 h-11 w-full rounded-[14px] border border-[#30364E] bg-[#0C0F1D] px-4 font-mono text-[11px] text-[#E3E6F1] outline-none transition placeholder:text-[#555D76] focus:border-[#635FFF] focus:ring-4 focus:ring-[#615FFF]/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="demo-cvv"
                      className="text-[9px] font-bold text-[#BFC4D4]"
                    >
                      CVV
                    </label>

                    <div className="relative mt-2">
                      <LockKeyhole
                        size={14}
                        className="absolute left-4 top-3.5 text-[#6E68FF]"
                      />

                      <input
                        id="demo-cvv"
                        type="password"
                        inputMode="numeric"
                        autoComplete="off"
                        value={cvv}
                        onChange={(
                          event,
                        ) => {
                          setCvv(
                            event.target.value
                              .replace(
                                /\D/g,
                                '',
                              )
                              .slice(
                                0,
                                3,
                              ),
                          )
                          setError('')
                        }}
                        placeholder="123"
                        maxLength={3}
                        className="h-11 w-full rounded-[14px] border border-[#30364E] bg-[#0C0F1D] pl-10 pr-4 font-mono text-[11px] text-[#E3E6F1] outline-none transition placeholder:text-[#555D76] focus:border-[#635FFF] focus:ring-4 focus:ring-[#615FFF]/10"
                      />
                    </div>
                  </div>
                </div>


                <div className="mt-4">
                  <label
                    htmlFor="demo-address"
                    className="text-[9px] font-bold text-[#BFC4D4]"
                  >
                    Fatura Adresi
                  </label>

                  <div className="relative mt-2">
                    <MapPin
                      size={15}
                      className="absolute left-4 top-3.5 text-[#6E68FF]"
                    />

                    <input
                      id="demo-address"
                      type="text"
                      value={address}
                      onChange={(
                        event,
                      ) => {
                        setAddress(
                          event.target.value,
                        )
                        setError('')
                      }}
                      maxLength={400}
                      placeholder="Mahalle, cadde, bina no, ilçe ve şehir"
                      className="h-11 w-full rounded-[14px] border border-[#30364E] bg-[#0C0F1D] pl-10 pr-4 text-[11px] text-[#E3E6F1] outline-none transition placeholder:text-[#555D76] focus:border-[#635FFF] focus:ring-4 focus:ring-[#615FFF]/10"
                    />
                  </div>
                </div>


                {error && (
                  <div className="mt-4 rounded-[13px] border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-[10px] font-medium text-rose-300">
                    {error}
                  </div>
                )}


                <div className="mt-5 flex items-center gap-2 rounded-[13px] border border-[#292F47] bg-[#131727] px-3.5 py-3">
                  <LockKeyhole
                    size={13}
                    className="shrink-0 text-[#746FFF]"
                  />

                  <p className="text-[8px] leading-4 text-[#707994]">
                     kart verileri veritabanına kaydedilmez.
                  </p>
                </div>


                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="h-10 rounded-[13px] border border-[#30364F] bg-[#121625] px-5 text-[10px] font-bold text-[#A9AFC0] transition hover:bg-[#181C2E] hover:text-white disabled:opacity-50"
                  >
                    Vazgeç
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-[13px] bg-[linear-gradient(135deg,#6963FF,#5547EE)] px-5 text-[10px] font-bold text-white shadow-[0_12px_34px_rgba(91,79,255,0.30)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <LockKeyhole
                      size={14}
                    />

                    {loading
                      ? 'Ödeme işleniyor...'
                      : 'Ödemeyi Tamamla'}
                  </button>
                </div>
              </form>
            ) : (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="flex min-h-[430px] flex-col items-center justify-center text-center"
              >
                <div className="flex size-16 items-center justify-center rounded-[20px] border border-emerald-400/20 bg-emerald-400/10 text-emerald-400 shadow-[0_0_35px_rgba(52,211,153,0.10)]">
                  <CheckCircle2
                    size={30}
                  />
                </div>

                <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                  Ödeme Başarılı
                </p>

                <h3 className="mt-2 text-[27px] font-bold tracking-[-0.04em] text-white">
                  Fatura Ödendi
                </h3>

                <p className="mt-2 max-w-[330px] text-[10px] leading-5 text-[#828AA1]">
                ödeme başarıyla tamamlandı ve fatura durumu PAID olarak güncellendi.
                </p>

                <div className="mt-6 w-full max-w-[320px] rounded-[16px] border border-[#2C324A] bg-[#0D101E] p-4 text-left">
                  <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#646D87]">
                    Ödeme Referansı
                  </p>

                  <p className="mt-2 break-all font-mono text-[10px] font-bold text-[#7771FF]">
                    {payment
                      .paymentReference}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    window.location.reload()
                  }
                  className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-[13px] bg-[linear-gradient(135deg,#6963FF,#5547EE)] px-6 text-[10px] font-bold text-white shadow-[0_12px_34px_rgba(91,79,255,0.26)] transition hover:brightness-110"
                >
                  <CheckCircle2
                    size={14}
                  />

                  Faturalara Dön
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>,
    document.body,
  )
}
