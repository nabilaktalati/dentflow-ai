import {
  CalendarDays,
  Clock3,
  FileText,
  MapPin,
  Stethoscope,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import {
  cancelMyAppointment,
  getMyAppointments,
} from "../api/patientAppointmentsApi.js";

const statusConfig = {
  PENDING: {
    label: "Onay Bekliyor",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },

  CONFIRMED: {
    label: "Onaylandı",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },

  COMPLETED: {
    label: "Tamamlandı",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },

  CANCELLED: {
    label: "İptal Edildi",
    className: "border-rose-200 bg-rose-50 text-rose-700",
  },

  NO_SHOW: {
    label: "Gelmedi",
    className: "border-slate-200 bg-slate-50 text-slate-600",
  },
};

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  timeZone: "Europe/Istanbul",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("tr-TR", {
  timeZone: "Europe/Istanbul",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const PatientAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [cancelTarget, setCancelTarget] = useState(null);

  const [cancellationReason, setCancellationReason] = useState("");

  const [cancelLoading, setCancelLoading] = useState(false);

  const [cancelError, setCancelError] = useState("");

  useEffect(() => {
    getMyAppointments()
      .then((response) => {
        setAppointments(response.data?.appointments || []);
      })
      .catch((requestError) => {
        setError(requestError.message || "Randevular yüklenemedi.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const upcomingAppointments = useMemo(
    () =>
      appointments.filter(
        (appointment) =>
          new Date(appointment.endAt) >= new Date() &&
          appointment.status !== "CANCELLED",
      ),
    [appointments],
  );

  const openCancelDialog = (appointment) => {
    setCancelTarget(appointment);

    setCancellationReason("");
    setCancelError("");
  };

  const closeCancelDialog = () => {
    if (cancelLoading) {
      return;
    }

    setCancelTarget(null);
    setCancellationReason("");
    setCancelError("");
  };

  const handleCancelAppointment = async () => {
    if (!cancelTarget) {
      return;
    }

    const reason = cancellationReason.trim();

    if (reason.length < 3) {
      setCancelError("İptal nedeni en az 3 karakter olmalıdır.");

      return;
    }

    try {
      setCancelLoading(true);
      setCancelError("");

      const response = await cancelMyAppointment({
        appointmentId: cancelTarget.id,

        cancellationReason: reason,
      });

      const updated = response.data?.appointment;

      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === cancelTarget.id
            ? {
                ...appointment,

                status: updated?.status || "CANCELLED",

                statusUpdatedAt: updated?.statusUpdatedAt || null,

                cancelledAt: updated?.cancelledAt || null,

                cancellationReason: updated?.cancellationReason || reason,
              }
            : appointment,
        ),
      );

      setCancelTarget(null);
      setCancellationReason("");
    } catch (requestError) {
      setCancelError(requestError.message || "Randevu iptal edilemedi.");
    } finally {
      setCancelLoading(false);
    }
  };
  return (
    <div className="mx-auto w-full max-w-[1380px] px-5 py-7 sm:px-7 lg:px-10 lg:py-9">
      {/* PAGE HEADER */}
      <section className="mb-8">
        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#615FFF]">
          HASTA PANELİ
        </span>

        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-[34px] font-bold tracking-[-0.04em] text-[#17182B] sm:text-[40px]">
              Randevularım
            </h1>

            <p className="mt-2 max-w-[620px] text-[14px] leading-6 text-[#7B8399]">
              Yaklaşan ve geçmiş randevularınızı, doktor bilgilerini ve randevu
              durumlarını tek alandan takip edin.
            </p>
          </div>

          {!loading && !error && (
            <div className="flex items-center gap-3">
              <div className="min-w-[105px] rounded-[18px] border border-[#E6E7F0] bg-white px-4 py-3 shadow-[0_8px_24px_rgba(30,35,90,0.05)]">
                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#9DA4B7]">
                  TOPLAM
                </span>

                <div className="mt-1 text-[22px] font-bold text-[#191B31]">
                  {appointments.length}
                </div>
              </div>

              <div className="min-w-[105px] rounded-[18px] border border-[#DFDEFF] bg-[#F5F4FF] px-4 py-3">
                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#7773DE]">
                  YAKLAŞAN
                </span>

                <div className="mt-1 text-[22px] font-bold text-[#605DF5]">
                  {upcomingAppointments.length}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {loading && (
        <div className="rounded-[24px] border border-[#E7E8F1] bg-white p-7 text-sm text-[#7B8399] shadow-sm">
          Randevular yükleniyor...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-[22px] border border-rose-200 bg-rose-50 p-5 text-sm font-medium text-rose-700">
          {error}
        </div>
      )}

      {!loading && !error && appointments.length === 0 && (
        <div className="rounded-[28px] border border-[#E6E7F0] bg-white px-6 py-16 text-center shadow-[0_18px_55px_rgba(45,47,90,0.06)]">
          <div className="mx-auto flex size-14 items-center justify-center rounded-[18px] bg-[#F1F0FF] text-[#615FFF]">
            <CalendarDays size={24} />
          </div>

          <h2 className="mt-5 text-[18px] font-bold text-[#1B1D31]">
            Henüz randevunuz bulunmuyor
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#858CA2]">
            Oluşturduğunuz randevular burada görüntülenecektir.
          </p>
        </div>
      )}

      {!loading && !error && appointments.length > 0 && (
        <div className="space-y-4">
          {appointments.map((appointment) => {
            const status =
              statusConfig[appointment.status] || statusConfig.PENDING;

            return (
              <article
                key={appointment.id}
                className="overflow-hidden rounded-[28px] border border-[#E5E6EF] bg-white shadow-[0_20px_55px_rgba(36,38,80,0.06)]"
              >
                <div className="h-[3px] bg-gradient-to-r from-[#615FFF] via-[#7C72FF] to-[#55B9FF]" />

                <div className="p-5 sm:p-6 lg:p-7">
                  <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                    {/* DOCTOR + APPOINTMENT */}
                    <div className="min-w-0">
                      <div className="flex items-start gap-4">
                        <div className="flex size-[54px] shrink-0 items-center justify-center overflow-hidden rounded-[18px] border border-[#E5E5F4] bg-[#F3F2FF]">
                          {appointment.doctor?.profileImageUrl ? (
                            <img
                              src={appointment.doctor.profileImageUrl}
                              alt={appointment.doctor.name}
                              className="size-full object-cover"
                            />
                          ) : (
                            <Stethoscope size={22} className="text-[#615FFF]" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h2 className="text-[18px] font-bold tracking-[-0.02em] text-[#1B1D31]">
                              {appointment.doctor?.name}
                            </h2>

                            <span
                              className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${status.className}`}
                            >
                              {status.label}
                            </span>
                          </div>

                          <p className="mt-1 text-[13px] font-medium text-[#7B8296]">
                            {appointment.doctor?.title || "Diş Hekimi"}
                          </p>

                          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
                            <div className="flex items-center gap-2 text-[13px] font-medium text-[#5F687E]">
                              <CalendarDays
                                size={16}
                                className="text-[#615FFF]"
                              />

                              {dateFormatter.format(
                                new Date(appointment.startAt),
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-[13px] font-medium text-[#5F687E]">
                              <Clock3 size={16} className="text-[#615FFF]" />

                              {timeFormatter.format(
                                new Date(appointment.startAt),
                              )}

                              <span className="text-[#B0B5C4]">–</span>

                              {timeFormatter.format(
                                new Date(appointment.endAt),
                              )}
                            </div>

                            {appointment.doctor?.location && (
                              <div className="flex items-center gap-2 text-[13px] font-medium text-[#5F687E]">
                                <MapPin size={16} className="text-[#615FFF]" />

                                {appointment.doctor.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CODE */}
                    <div className="rounded-[18px] border border-[#E8E8F2] bg-[#FAFAFD] px-5 py-4 lg:min-w-[190px]">
                      <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#9BA1B4]">
                        RANDEVU KODU
                      </div>

                      <div className="mt-2 font-mono text-[14px] font-bold tracking-[0.08em] text-[#5653E8]">
                        {appointment.appointmentCode}
                      </div>
                    </div>
                  </div>

                  {appointment.patientNote && (
                    <>
                      <div className="my-5 h-px bg-[#EEEFF5]" />

                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#F3F2FF] text-[#6A67F4]">
                          <FileText size={15} />
                        </div>

                        <div>
                          <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#9BA1B3]">
                            RANDEVU NOTU
                          </div>

                          <p className="mt-1.5 text-[13px] leading-6 text-[#626A7F]">
                            {appointment.patientNote}
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {appointment.status === "CANCELLED" &&
                    appointment.cancellationReason && (
                      <>
                        <div className="my-5 h-px bg-[#EEEFF5]" />

                        <div className="rounded-[16px] border border-rose-100 bg-rose-50/70 px-4 py-3">
                          <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-rose-500">
                            İPTAL NEDENİ
                          </div>

                          <p className="mt-1.5 text-[13px] leading-6 text-rose-700">
                            {appointment.cancellationReason}
                          </p>
                        </div>
                      </>
                    )}

                  {["PENDING", "CONFIRMED"].includes(
                    appointment.status,
                  ) &&
                    new Date(appointment.startAt) > new Date() && (
                      <>
                        <div className="my-5 h-px bg-[#EEEFF5]" />

                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => openCancelDialog(appointment)}
                            className="rounded-[14px] border border-rose-200 bg-rose-50 px-4 py-2.5 text-[12px] font-bold text-rose-700 transition hover:bg-rose-100"
                          >
                            Randevuyu İptal Et
                          </button>
                        </div>
                      </>
                    )}
                </div>
              </article>
            );
          })}
        </div>
      )}
      {cancelTarget && (
  <div
    className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/35 px-4 backdrop-blur-[3px]"
    onMouseDown={
      closeCancelDialog
    }
  >
    <div
      className="relative w-full max-w-[470px] rounded-[26px] border border-slate-200 bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.20)] sm:p-7"
      onMouseDown={(event) =>
        event.stopPropagation()
      }
    >
      <button
        type="button"
        disabled={
          cancelLoading
        }
        onClick={
          closeCancelDialog
        }
        aria-label="Pencereyi kapat"
        className="absolute right-5 top-5 grid size-9 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
      >
        ×
      </button>

      <div className="flex size-12 items-center justify-center rounded-[16px] bg-rose-50 text-rose-600">
        !
      </div>

      <div className="mt-5 pr-8">
        <span className="text-[9px] font-bold uppercase tracking-[0.19em] text-rose-500">
          RANDEVU İPTALİ
        </span>

        <h3 className="mt-1.5 text-[21px] font-bold tracking-[-0.025em] text-[#1B1D31]">
          Randevunuzu iptal edin
        </h3>

        <p className="mt-2 text-[13px] leading-6 text-[#7B8399]">
          İptal edilen randevu saati yeniden müsait hale gelecektir.
        </p>
      </div>

      <div className="mt-5">
        <label
          htmlFor="patient-cancellation-reason"
          className="text-[12px] font-bold text-[#3B3E53]"
        >
          İptal nedeni
        </label>

        <textarea
          id="patient-cancellation-reason"
          value={
            cancellationReason
          }
          onChange={(event) =>
            setCancellationReason(
              event.target.value,
            )
          }
          maxLength={300}
          rows={3}
          placeholder="Randevu iptal nedeninizi yazınız..."
          className="mt-2 w-full resize-none rounded-[16px] border border-[#E4E5EE] bg-[#FAFAFD] px-4 py-3 text-sm text-[#34384D] outline-none transition placeholder:text-[#ADB2C0] focus:border-[#F0A8B6] focus:bg-white focus:ring-4 focus:ring-rose-100"
        />

        <div className="mt-1.5 text-right text-[10px] font-medium text-[#A0A6B5]">
          {
            cancellationReason.length
          }
          /300
        </div>
      </div>

      {cancelError && (
        <div className="mt-4 rounded-[14px] border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] font-medium leading-5 text-rose-700">
          {cancelError}
        </div>
      )}

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={
            cancelLoading
          }
          onClick={
            closeCancelDialog
          }
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
        >
          Vazgeç
        </button>

        <button
          type="button"
          disabled={
            cancelLoading
          }
          onClick={
            handleCancelAppointment
          }
          className="rounded-xl bg-rose-600 px-4 py-2.5 text-[12px] font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {
            cancelLoading
              ? 'İptal ediliyor...'
              : 'Randevuyu İptal Et'
          }
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default PatientAppointmentsPage;