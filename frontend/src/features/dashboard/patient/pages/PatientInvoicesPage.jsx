import {
  useEffect,
  useState,
} from 'react'

import {
  CalendarDays,
  CircleDollarSign,
  FileText,
  ReceiptText,
  Stethoscope,
} from 'lucide-react'

import {
  motion,
} from 'motion/react'

import {
  getMyInvoices,
} from '../api/patientInvoicesApi.js'
import PatientInvoicePdf from '../components/PatientInvoicePdf.jsx'
import PatientPaymentModal from '../components/PatientPaymentModal.jsx'
import {
  PDFDownloadLink,
} from '@react-pdf/renderer'
const statusConfig = {
  PENDING: {
    label: 'Ödeme Bekliyor',
    className:
      'border-amber-200 bg-amber-50 text-amber-700',
  },

  PAID: {
    label: 'Ödendi',
    className:
      'border-emerald-200 bg-emerald-50 text-emerald-700',
  },

  CANCELLED: {
    label: 'İptal Edildi',
    className:
      'border-rose-200 bg-rose-50 text-rose-700',
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
      timeZone:
        'Europe/Istanbul',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    },
  ).format(
    new Date(value),
  )
}


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


export default function PatientInvoicesPage() {
  const [
    invoices,
    setInvoices,
  ] = useState([])

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState('')
const [
  selectedInvoice,
  setSelectedInvoice,
] = useState(null)

  useEffect(() => {
    getMyInvoices()
      .then((response) => {
        setInvoices(
          response.data
            ?.invoices ||
            [],
        )
      })
      .catch(
        (requestError) => {
          setError(
            requestError.message ||
              'Faturalar yüklenemedi.',
          )
        },
      )
      .finally(() => {
        setLoading(false)
      })
  }, [])


  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-7 sm:px-6 lg:px-8 lg:py-8">
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
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#625BF6]">
          Hasta Paneli
        </p>

        <h1 className="mt-2 text-[38px] font-bold leading-[1.05] tracking-[-0.04em] text-[#101828] sm:text-[42px]">
          Faturalarım
        </h1>

        <p className="mt-3 max-w-[680px] text-[14px] leading-6 text-[#6F7A8E]">
          Tedavi süreçlerinize bağlı faturalarınızı ve ödeme durumlarını görüntüleyin.
        </p>
      </motion.div>


      {loading && (
        <div className="mt-7 rounded-[24px] border border-[#E6E7F0] bg-white p-7 text-sm text-[#7B8399] shadow-sm">
          Faturalar yükleniyor...
        </div>
      )}


      {error && (
        <div className="mt-7 rounded-[20px] border border-rose-200 bg-rose-50 p-5 text-sm font-medium text-rose-700">
          {error}
        </div>
      )}


      {!loading &&
        !error &&
        invoices.length ===
          0 && (
          <div className="mt-7 rounded-[26px] border border-[#E6E7F0] bg-white px-6 py-14 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-[18px] bg-[#F2F1FF] text-[#615FFF]">
              <ReceiptText
                size={23}
              />
            </div>

            <h2 className="mt-4 text-[17px] font-bold text-[#1B1D31]">
              Henüz faturanız bulunmuyor
            </h2>

            <p className="mt-2 text-sm text-[#858CA2]">
              Tedavi sürecinize ait faturalar oluşturulduğunda burada görüntülenecektir.
            </p>
          </div>
        )}


      {!loading &&
        !error &&
        invoices.length >
          0 && (
          <div className="mt-7 space-y-5">
            {invoices.map(
              (invoice) => {
                const status =
                  statusConfig[
                    invoice.status
                  ] ||
                  statusConfig.PENDING

                return (
                  <article
                    key={
                      invoice.id
                    }
                    className="overflow-hidden rounded-[26px] border border-[#E5E6EF] bg-white shadow-[0_16px_45px_rgba(36,38,80,0.05)]"
                  >
                    <div className="h-[3px] bg-gradient-to-r from-[#615FFF] via-[#7770FF] to-[#54B8FF]" />

                    <div className="p-5 sm:p-6">
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex items-start gap-4">
                          <div className="flex size-[52px] shrink-0 items-center justify-center rounded-[18px] border border-[#E4E4F4] bg-[#F3F2FF] text-[#615FFF]">
                            <FileText
                              size={21}
                            />
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2.5">
                              <h2 className="text-[18px] font-bold tracking-[-0.02em] text-[#1B1D31]">
                                {
                                  invoice.invoiceNumber
                                }
                              </h2>

                              <span
                                className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${status.className}`}
                              >
                                {
                                  status.label
                                }
                              </span>
                            </div>

                            <p className="mt-2 text-[13px] leading-6 text-[#667085]">
                              {
                                invoice.description
                              }
                            </p>
                          </div>
                        </div>


                        <div className="flex flex-col gap-3 lg:items-end">
  <div className="rounded-[18px] border border-[#DFDEFF] bg-[#F5F4FF] px-5 py-4 lg:min-w-[180px]">
    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#7773DE]">
      Toplam Tutar
    </p>

    <p className="mt-2 text-[22px] font-bold tracking-[-0.03em] text-[#5653E8]">
      {formatAmount(
        invoice.amount,
      )}
    </p>
  </div>

  <PDFDownloadLink
    document={
      <PatientInvoicePdf
        invoice={invoice}
      />
    }
    fileName={`DentFlow-Fatura-${invoice.invoiceNumber}.pdf`}
    className="inline-flex h-10 items-center justify-center rounded-[13px] border border-[#DCDDFE] bg-[#F5F4FF] px-4 text-[11px] font-bold text-[#5D59E8] transition hover:border-[#C8C8FA] hover:bg-[#EFEEFF]"
  >
    {({ loading: pdfLoading }) =>
      pdfLoading
        ? 'PDF hazırlanıyor...'
        : 'Faturayı İndir'
    }
  </PDFDownloadLink>
  {invoice.status ===
  'PENDING' && (
  <button
    type="button"
    onClick={() =>
      setSelectedInvoice(
        invoice,
      )
    }
    className="inline-flex h-10 items-center justify-center gap-2 rounded-[13px] bg-[#5F5BEA] px-4 text-[11px] font-bold text-white shadow-[0_8px_20px_rgba(95,91,234,0.18)] transition hover:bg-[#5551DE]"
  >
    <CircleDollarSign
      size={15}
    />

    Ödeme Yap
  </button>
)}
</div>
                      </div>


                      <div className="my-5 h-px bg-[#EEEFF5]" />


                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#9BA1B4]">
                            Fatura Tarihi
                          </p>

                          <div className="mt-2 flex items-center gap-2 text-[13px] font-semibold text-[#475467]">
                            <CalendarDays
                              size={15}
                              className="text-[#615FFF]"
                            />

                            {formatDate(
                              invoice.issuedAt,
                            )}
                          </div>
                        </div>


                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#9BA1B4]">
                            Son Ödeme
                          </p>

                          <p className="mt-2 text-[13px] font-semibold text-[#475467]">
                            {formatDate(
                              invoice.dueDate,
                            )}
                          </p>
                        </div>


                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#9BA1B4]">
                            Doktor
                          </p>

                          <div className="mt-2 flex items-center gap-2 text-[13px] font-semibold text-[#475467]">
                            <Stethoscope
                              size={15}
                              className="text-[#615FFF]"
                            />

                            {invoice
                              .doctor
                              ?.name ||
                              'Belirtilmedi'}
                          </div>
                        </div>


                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#9BA1B4]">
                            Randevu
                          </p>

                          <p className="mt-2 font-mono text-[12px] font-bold tracking-[0.06em] text-[#5653E8]">
                            {invoice
                              .appointment
                              ?.appointmentCode ||
                              '—'}
                          </p>
                        </div>
                      </div>


                      <div className="mt-5 grid gap-4 rounded-[18px] border border-[#ECECF4] bg-[#FAFAFD] p-4 sm:grid-cols-2">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#9BA1B4]">
                            Teşhis
                          </p>

                          <p className="mt-2 text-[13px] leading-6 text-[#5F687E]">
                            {invoice
                              .treatment
                              ?.diagnosis ||
                              'Belirtilmedi'}
                          </p>
                        </div>


                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#9BA1B4]">
                            Tedavi Planı
                          </p>

                          <p className="mt-2 text-[13px] leading-6 text-[#5F687E]">
                            {invoice
                              .treatment
                              ?.treatmentPlan ||
                              'Belirtilmedi'}
                          </p>
                        </div>
                      </div>


                      <div className="mt-5 flex items-center gap-2 text-[11px] font-medium text-[#8A91A4]">
                        <CircleDollarSign
                          size={14}
                          className="text-[#615FFF]"
                        />

                        Ödeme durumu sistem üzerinden takip edilmektedir.
                      </div>
                    </div>
                  </article>
                )
              },
            )}
          </div>
        )}
        
      {selectedInvoice && (
        <PatientPaymentModal
          invoice={selectedInvoice}
          onClose={() =>
            setSelectedInvoice(null)
          }
        />
      )}

    </div>
  )
}