import { useEffect, useState } from "react";

import { CheckCircle2, FileText, ReceiptText } from "lucide-react";

import { motion } from "motion/react";

import { getDoctorTreatments } from "../api/doctorTreatmentsApi.js";

import DoctorInvoiceForm from "../components/DoctorInvoiceForm.jsx";

export default function DoctorInvoicesPage() {
  const [treatments, setTreatments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [selectedTreatment, setSelectedTreatment] = useState(null);

  useEffect(() => {
    getDoctorTreatments()
      .then((response) => {
        setTreatments(response.data?.treatments || []);
      })
      .catch((requestError) => {
        setError(requestError.message || "Tedavi kayıtları yüklenemedi.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
          Doktor Paneli
        </p>

        <h1 className="mt-2 text-[38px] font-bold leading-[1.05] tracking-[-0.04em] text-[#101828] sm:text-[42px]">
          Faturalar
        </h1>

        <p className="mt-3 max-w-[680px] text-[14px] leading-6 text-[#6F7A8E]">
          Tedavi kayıtlarına bağlı faturaları oluşturun ve klinik faturalandırma
          sürecini yönetin.
        </p>
      </motion.div>

      {loading && (
        <div className="mt-7 rounded-[24px] border border-[#E6E7F0] bg-white p-7 text-sm text-[#7B8399] shadow-sm">
          Tedavi kayıtları yükleniyor...
        </div>
      )}

      {error && (
        <div className="mt-7 rounded-[20px] border border-rose-200 bg-rose-50 p-5 text-sm font-medium text-rose-700">
          {error}
        </div>
      )}

      {!loading && !error && treatments.length === 0 && (
        <div className="mt-7 rounded-[26px] border border-[#E6E7F0] bg-white px-6 py-14 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-[18px] bg-[#F2F1FF] text-[#615FFF]">
            <ReceiptText size={23} />
          </div>

          <h2 className="mt-4 text-[17px] font-bold text-[#1B1D31]">
            Faturalandırılabilir tedavi kaydı bulunmuyor
          </h2>

          <p className="mt-2 text-sm text-[#858CA2]">
            Tedavi kayıtları oluşturulduğunda burada görüntülenecektir.
          </p>
        </div>
      )}

      {!loading && !error && treatments.length > 0 && (
        <div className="mt-7 space-y-4">
          {treatments.map((treatment) => (
            <article
              key={treatment.id}
              className="overflow-hidden rounded-[24px] border border-[#E5E6EF] bg-white shadow-[0_16px_45px_rgba(36,38,80,0.05)]"
            >
              <div className="h-[3px] bg-gradient-to-r from-[#615FFF] via-[#7770FF] to-[#54B8FF]" />

              <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-[15px] bg-[#F2F1FF] text-[#615FFF]">
                    <FileText size={19} />
                  </div>

                  <div>
                    <p className="text-[17px] font-bold text-[#1B1D31]">
                      {treatment.patient?.name || "Hasta"}
                    </p>

                    <p className="mt-1 text-[12px] font-medium text-[#7773DE]">
                      {treatment.appointment?.appointmentCode ||
                        "Randevu kodu bulunamadı"}
                    </p>

                    <p className="mt-3 text-[13px] text-[#667085]">
                      {treatment.diagnosis}
                    </p>
                  </div>
                </div>

                {treatment.hasInvoice ? (
  <div className="flex h-10 items-center justify-center gap-2 rounded-[13px] border border-emerald-200 bg-emerald-50 px-5 text-[11px] font-bold text-emerald-700">
    <CheckCircle2
      size={15}
      strokeWidth={2}
    />

    Fatura Mevcut
  </div>
) : (
  <button
    type="button"
    onClick={() =>
      setSelectedTreatment(
        treatment,
      )
    }
    className="h-10 rounded-[13px] bg-[#625BF6] px-5 text-[12px] font-semibold text-white shadow-[0_8px_20px_rgba(98,91,246,0.20)] transition hover:bg-[#5650E8]"
  >
    Fatura Oluştur
  </button>
)}
              </div>
            </article>
          ))}
        </div>
      )}
      {selectedTreatment && (
        <DoctorInvoiceForm
          treatment={selectedTreatment}
          onCancel={() => setSelectedTreatment(null)}
          onSuccess={() => {
  setTreatments(
    (current) =>
      current.map(
        (item) =>
          item.id ===
          selectedTreatment.id
            ? {
                ...item,
                hasInvoice:
                  true,
              }
            : item,
      ),
  )

  setSelectedTreatment(
    null,
  )
}}
        />
      )}
    </div>
  );
}
