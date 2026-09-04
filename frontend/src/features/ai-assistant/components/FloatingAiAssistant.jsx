import { useEffect, useState } from "react";
import {
  Bot,
  CalendarDays,
  ChevronRight,
  FileText,
  MessageCircle,
  SendHorizontal,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  X,
} from "lucide-react";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  confirmAiAppointment,
  confirmAiMessage,
  sendAiAssistantMessage,
} from "../api/aiAssistantApi.js";

const quickActions = [
  {
    icon: CalendarDays,
    label: "Randevu Al",
    prompt: "Randevu almak istiyorum.",
  },
  {
    icon: FileText,
    label: "Faturalarım",
    prompt: "Faturalarımı görmek istiyorum.",
  },
  {
    icon: Stethoscope,
    label: "Tedavim",
    prompt: "Tedavi kayıtlarımı görmek istiyorum.",
  },
 {
  icon: MessageCircle,
  label: "Mesajlaşma",
  prompt: "Mesajlaşabileceğim doktorları göster.",
},
];

function AssistantAvatar({ small = false }) {
  return (
    <div
      className={`relative grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 text-white shadow-[0_12px_32px_rgba(79,70,229,0.24)] ${
        small ? "h-8 w-8" : "h-[68px] w-[68px]"
      }`}
    >
      <Bot size={small ? 14 : 27} strokeWidth={2} />

      {!small && (
        <>
          <motion.span
            animate={{
              opacity: [0.35, 1, 0.35],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
            }}
            className="absolute left-[19px] top-[31px] h-1.5 w-1.5 rounded-full bg-cyan-200"
          />

          <motion.span
            animate={{
              opacity: [1, 0.35, 1],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
            }}
            className="absolute right-[19px] top-[31px] h-1.5 w-1.5 rounded-full bg-cyan-200"
          />
        </>
      )}
    </div>
  );
}

function FloatingAiAssistant() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /*
   * STAJ DEFTERİ EKRAN GÖRÜNTÜSÜ:
   * true  -> geniş ve kompakt görünüm, konuşma daha fazla görünür.
   * false -> normal floating assistant görünümü.
   */
  const screenshotMode = true;

  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const shouldResume = searchParams.get("resumeAi") === "1";

    if (!shouldResume) {
      return;
    }

    const storedAction = sessionStorage.getItem(
      "dentflow_pending_ai_action",
    );

    if (!storedAction) {
      return;
    }

    try {
      const pendingAction = JSON.parse(storedAction);

      if (
        pendingAction.action !== "CREATE_APPOINTMENT" ||
        !pendingAction.doctorProfileId ||
        !pendingAction.date ||
        !pendingAction.time
      ) {
        return;
      }

     queueMicrotask(() => {
  setOpen(true);

  setMessages([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content: `${pendingAction.doctor || "Seçtiğiniz doktor"} için ${pendingAction.date} tarihinde ${pendingAction.time} randevu talebinize devam edebiliriz. Randevuyu oluşturmak için onaylayabilirsiniz.`,
      action: "CHECK_APPOINTMENT_AVAILABILITY",
      parameters: {
        doctorProfileId: pendingAction.doctorProfileId,
        doctor: pendingAction.doctor,
        date: pendingAction.date,
        time: pendingAction.time,
        requiresLogin: false,
      },
      missingFields: [],
      requiresConfirmation: false,
    },
  ]);
});
    } catch {
      sessionStorage.removeItem("dentflow_pending_ai_action");
    }
  }, []);

  const handleAppointmentConfirm = async (assistantMessage) => {
    const parameters = assistantMessage?.parameters || {};
    const { doctorProfileId, date, time } = parameters;

    if (!doctorProfileId || !date || !time) {
      setError(
        "Randevu bilgileri eksik. Lütfen randevu bilgilerini tekrar kontrol edin.",
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await confirmAiAppointment({
        doctorProfileId,
        date,
        time,
      });

      sessionStorage.removeItem("dentflow_pending_ai_action");

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: result?.message || "Randevunuz başarıyla oluşturuldu.",
          action: "APPOINTMENT_CREATED",
          parameters: {
            appointmentId: result?.data?.appointment?.appointmentId,
          },
          missingFields: [],
          requiresConfirmation: false,
        },
      ]);
    } catch (err) {
      if (err.status === 401) {
        setError("Randevu oluşturmak için giriş yapmanız gerekiyor.");
        return;
      }

      setError(err.message || "Randevu oluşturulamadı.");
    } finally {
      setLoading(false);
    }
  };
const handleMessageConfirm = async (assistantMessage) => {
  const parameters =
    assistantMessage?.parameters || {};

  const {
    recipientId,
    content,
  } = parameters;

  if (!recipientId || !content) {
    setError(
      "Mesaj bilgileri eksik. Lütfen işlemi tekrar deneyin.",
    );
    return;
  }

  setLoading(true);
  setError("");

  try {
    const result =
      await confirmAiMessage({
        recipientId,
        content,
      });

    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          result?.message ||
          "Mesajınız başarıyla gönderildi.",
        action: "MESSAGE_SENT",
        parameters: {},
        data:
          result?.data || null,
        missingFields: [],
        requiresConfirmation: false,
      },
    ]);
  } catch (err) {
    if (err.status === 401) {
      setError(
        "Mesaj göndermek için giriş yapmanız gerekiyor.",
      );
      return;
    }

    setError(
      err.message ||
        "Mesaj gönderilemedi.",
    );
  } finally {
    setLoading(false);
  }
};
  const handleLoginAndContinue = (assistantMessage) => {
    const parameters = assistantMessage?.parameters || {};

    const pendingAppointment = {
      action: "CREATE_APPOINTMENT",
      doctorProfileId: parameters.doctorProfileId,
      doctor: parameters.doctor,
      date: parameters.date,
      time: parameters.time,
    };

    sessionStorage.setItem(
      "dentflow_pending_ai_action",
      JSON.stringify(pendingAppointment),
    );

    setOpen(false);
    navigate("/login");
  };

  const sendTextToAssistant = async (content) => {
    const cleanContent = String(content || "").trim();

    if (!cleanContent || loading) {
      return;
    }

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: cleanContent,
    };

    setMessages((current) => [...current, userMessage]);
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const history = messages.slice(-12).map((item) => ({
        role: item.role,
        content: item.content,
      }));

      const assistant = await sendAiAssistantMessage(
        cleanContent,
        history,
      );

      if (!assistant) {
        throw new Error("Asistan yanıt oluşturamadı.");
      }

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: assistant.reply,
          action: assistant.action,
          parameters: assistant.parameters || {},
          data: assistant.data || null,
          missingFields: assistant.missingFields || [],
          requiresConfirmation: Boolean(
            assistant.requiresConfirmation,
          ),
        },
      ]);
    } catch (err) {
      setError(err.message || "AI asistan ile iletişim kurulamadı.");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    await sendTextToAssistant(message);
  };

  const handleQuickAction = async (action) => {
    if (loading) {
      return;
    }

    if (action.label === "Randevu Al") {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "user",
          content: action.prompt,
        },
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Tabii. Hangi tarih ve saat için randevu almak istiyorsunuz?",
        },
      ]);

      setMessage("");
      setError("");
      return;
    }

    await sendTextToAssistant(action.prompt);
  };

  const handleComposerKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent?.isComposing
    ) {
      event.preventDefault();
      handleSend();
    }
  };

  const showIntro = !screenshotMode || messages.length === 0;

  return (
   <div className="pointer-events-none fixed bottom-4 right-4 z-[120] sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: 28,
              scale: 0.94,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.96,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 27,
            }}
            className={`pointer-events-auto absolute right-0 flex flex-col overflow-hidden border border-white/80 bg-white shadow-[0_32px_100px_rgba(52,43,110,0.20)] ${
              screenshotMode
                ? "bottom-0 h-[92vh] max-h-[940px] w-[560px] max-w-[calc(100vw-20px)] rounded-[28px]"
                : "bottom-[78px] h-[650px] max-h-[calc(100vh-115px)] w-[420px] max-w-[calc(100vw-24px)] rounded-[30px]"
            }`}
          >
            {/* HEADER */}
            <div
              className={`relative shrink-0 overflow-hidden border-b border-slate-100 bg-white ${
                screenshotMode ? "px-4 py-3" : "px-5 py-4"
              }`}
            >
              <div className="pointer-events-none absolute -right-12 -top-20 h-40 w-40 rounded-full bg-violet-200/30 blur-3xl" />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <motion.div
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(124,58,237,0)",
                          "0 0 0 7px rgba(124,58,237,0.06)",
                          "0 0 0 0 rgba(124,58,237,0)",
                        ],
                      }}
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                      }}
                      className={`grid place-items-center rounded-[15px] bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 text-white ${
                        screenshotMode ? "h-10 w-10" : "h-11 w-11"
                      }`}
                    >
                      <Bot size={screenshotMode ? 18 : 19} />
                    </motion.div>

                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[14px] font-semibold tracking-[-0.02em] text-slate-950">
                        DentFlow Assistant
                      </h3>

                      <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-violet-600">
                        AI
                      </span>
                    </div>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      Klinik işlemleri için akıllı asistan
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Asistanı kapat"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* CHAT CONTENT */}
            <div className="min-h-0 flex-1 overflow-y-auto bg-[linear-gradient(180deg,#FBFAFF_0%,#F8FAFF_100%)]">
              <div
                className={
                  screenshotMode
                    ? "px-4 pb-4 pt-4"
                    : "px-5 pb-6 pt-6"
                }
              >
                {showIntro && (
                  <>
                    {/* WELCOME */}
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 12,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.4,
                      }}
                      className="flex flex-col items-center text-center"
                    >
                      <div className="relative">
                        <motion.div
                          animate={{
                            rotate: 360,
                          }}
                          transition={{
                            duration: 22,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute -inset-3 rounded-full border border-dashed border-violet-200"
                        />

                        <div className="absolute -inset-[7px] rounded-full border border-cyan-300/70" />

                        <motion.div
                          animate={{
                            y: [0, -4, 0],
                          }}
                          transition={{
                            duration: 3.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <AssistantAvatar />
                        </motion.div>

                        <Sparkles
                          size={12}
                          className="absolute -right-8 top-1 text-violet-300"
                        />

                        <Sparkles
                          size={9}
                          className="absolute -left-7 bottom-2 text-cyan-300"
                        />
                      </div>

                      <h2
                        className={`font-semibold tracking-[-0.03em] text-slate-950 ${
                          screenshotMode
                            ? "mt-4 text-[17px]"
                            : "mt-6 text-[18px]"
                        }`}
                      >
                        Size nasıl yardımcı olabilirim?
                      </h2>

                      <p
                        className={`max-w-[330px] text-slate-500 ${
                          screenshotMode
                            ? "mt-1.5 text-[10px] leading-[1.6]"
                            : "mt-2 text-[11px] leading-[1.75]"
                        }`}
                      >
                        Randevu, fatura, tedavi ve mesajlaşma işlemlerinizi
                        DentFlow üzerinden yönetebilirsiniz.
                      </p>
                    </motion.div>

                    {/* QUICK ACTIONS */}
                    <div
                      className={
                        screenshotMode
                          ? "mt-3 grid grid-cols-2 gap-2"
                          : "mt-6 grid grid-cols-2 gap-2.5"
                      }
                    >
                      {quickActions.map((action, index) => {
                        const Icon = action.icon;

                        return (
                          <motion.button
                            key={action.label}
                            type="button"
                            disabled={loading}
                            initial={{
                              opacity: 0,
                              y: 10,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            transition={{
                              delay: 0.12 + index * 0.05,
                            }}
                            whileHover={{
                              y: -2,
                            }}
                            whileTap={{
                              scale: 0.98,
                            }}
                            onClick={() => handleQuickAction(action)}
                            className={`group flex items-center text-left shadow-[0_5px_18px_rgba(15,23,42,0.035)] transition hover:border-violet-200 hover:shadow-[0_10px_24px_rgba(99,102,241,0.08)] disabled:cursor-not-allowed disabled:opacity-60 ${
                              screenshotMode
                                ? "min-h-[52px] gap-2 rounded-[15px] border border-slate-200/80 bg-white px-3 py-2"
                                : "min-h-[66px] gap-3 rounded-[17px] border border-slate-200/80 bg-white px-3.5 py-3"
                            }`}
                          >
                            <div
                              className={`grid shrink-0 place-items-center rounded-[11px] bg-violet-50 text-violet-600 transition group-hover:bg-violet-100 ${
                                screenshotMode
                                  ? "h-8 w-8"
                                  : "h-9 w-9"
                              }`}
                            >
                              <Icon size={screenshotMode ? 14 : 15} />
                            </div>

                            <span className="min-w-0 flex-1 text-[11px] font-semibold text-slate-800">
                              {action.label}
                            </span>

                            <ChevronRight
                              size={14}
                              className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-violet-500"
                            />
                          </motion.button>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* CONVERSATION */}
                {messages.length > 0 && (
                  <div
                    className={
                      screenshotMode
                        ? "mt-1 space-y-2.5"
                        : "mt-7 space-y-4"
                    }
                  >
                    <AnimatePresence initial={false}>
                      {messages.map((item) => {
                        const isUser = item.role === "user";

                        return (
                          <motion.div
                            key={item.id}
                            initial={{
                              opacity: 0,
                              y: 10,
                              scale: 0.98,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              scale: 1,
                            }}
                            transition={{
                              duration: 0.22,
                            }}
                            className={
                              isUser
                                ? "flex justify-end"
                                : "flex items-end gap-2.5"
                            }
                          >
                            {!isUser && <AssistantAvatar small />}

                            <div
                              className={
                                isUser
                                  ? screenshotMode
                                    ? "max-w-[390px]"
                                    : "max-w-[300px]"
                                  : screenshotMode
                                    ? "max-w-[400px]"
                                    : "max-w-[285px]"
                              }
                            >
                              <div
                                className={
                                  isUser
                                    ? `border border-violet-200/70 bg-gradient-to-br from-violet-50 to-indigo-50 shadow-[0_6px_20px_rgba(99,102,241,0.06)] ${
                                        screenshotMode
                                          ? "rounded-[15px] rounded-br-[6px] px-3 py-2.5"
                                          : "rounded-[18px] rounded-br-[6px] px-4 py-3"
                                      }`
                                    : `border border-slate-200/80 bg-white shadow-[0_5px_18px_rgba(15,23,42,0.035)] ${
                                        screenshotMode
                                          ? "rounded-[15px] rounded-bl-[6px] px-3 py-2.5"
                                          : "rounded-[18px] rounded-bl-[6px] px-4 py-3"
                                      }`
                                }
                              >
                                <p
                                  className={
                                    isUser
                                      ? screenshotMode
                                        ? "text-[10px] leading-[1.6] text-indigo-950"
                                        : "text-[11px] leading-[1.7] text-indigo-950"
                                      : screenshotMode
                                        ? "text-[10px] leading-[1.6] text-slate-600"
                                        : "text-[11px] leading-[1.7] text-slate-600"
                                  }
                                >
                                  {item.content}
                                </p>

                               {!isUser &&
  item.action === "CHECK_APPOINTMENT_AVAILABILITY" &&
  item.data?.status === "AVAILABLE" &&
  item.parameters?.doctorProfileId &&
  item.parameters?.date &&
  item.parameters?.time && (
                                    <div
                                      className={
                                        screenshotMode ? "mt-2" : "mt-3"
                                      }
                                    >
                                      <div
                                        className={`border border-violet-100 bg-gradient-to-br from-violet-50/80 to-indigo-50/60 ${
                                          screenshotMode
                                            ? "rounded-[12px] p-2.5"
                                            : "rounded-[14px] p-3"
                                        }`}
                                      >
                                        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-violet-600">
                                          Randevu Özeti
                                        </p>

                                        <div
                                          className={
                                            screenshotMode
                                              ? "mt-2 space-y-1"
                                              : "mt-2.5 space-y-1.5"
                                          }
                                        >
                                          <div className="flex items-center justify-between gap-3">
                                            <span className="text-[9px] text-slate-400">
                                              Doktor
                                            </span>

                                            <span className="text-[10px] font-semibold text-slate-800">
                                              {item.parameters.doctor}
                                            </span>
                                          </div>

                                          <div className="flex items-center justify-between gap-3">
                                            <span className="text-[9px] text-slate-400">
                                              Tarih
                                            </span>

                                            <span className="text-[10px] font-semibold text-slate-800">
                                              {new Date(
                                                `${item.parameters.date}T12:00:00`,
                                              ).toLocaleDateString("tr-TR", {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                              })}
                                            </span>
                                          </div>

                                          <div className="flex items-center justify-between gap-3">
                                            <span className="text-[9px] text-slate-400">
                                              Saat
                                            </span>

                                            <span className="text-[10px] font-semibold text-slate-800">
                                              {item.parameters.time}
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      {item.parameters?.requiresLogin ? (
                                        <motion.button
                                          type="button"
                                          whileHover={{
                                            y: -1,
                                          }}
                                          whileTap={{
                                            scale: 0.98,
                                          }}
                                          onClick={() =>
                                            handleLoginAndContinue(item)
                                          }
                                          className={`flex w-full items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 font-semibold text-white shadow-[0_8px_20px_rgba(99,102,241,0.20)] ${
                                            screenshotMode
                                              ? "mt-2 rounded-[11px] px-3 py-2 text-[9px]"
                                              : "mt-2.5 rounded-[13px] px-3 py-2.5 text-[10px]"
                                          }`}
                                        >
                                          Giriş Yap ve Devam Et
                                          <ChevronRight size={13} />
                                        </motion.button>
                                      ) : (
                                        <motion.button
                                          type="button"
                                          disabled={loading}
                                          whileHover={
                                            loading
                                              ? {}
                                              : {
                                                  y: -1,
                                                }
                                          }
                                          whileTap={
                                            loading
                                              ? {}
                                              : {
                                                  scale: 0.98,
                                                }
                                          }
                                          onClick={() =>
                                            handleAppointmentConfirm(item)
                                          }
                                          className={`flex w-full items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 font-semibold text-white shadow-[0_8px_20px_rgba(99,102,241,0.20)] disabled:cursor-not-allowed disabled:opacity-50 ${
                                            screenshotMode
                                              ? "mt-2 rounded-[11px] px-3 py-2 text-[9px]"
                                              : "mt-2.5 rounded-[13px] px-3 py-2.5 text-[10px]"
                                          }`}
                                        >
                                          <CalendarDays size={13} />
                                          Randevuyu Onayla
                                        </motion.button>
                                      )}
                                    </div>
                                  )}

                                {!isUser &&
                                  item.action === "GET_INVOICES" &&
                                  item.data?.invoices?.length > 0 && (
                                    <div className="mt-2.5 space-y-2">
                                      {item.data.invoices
                                        .slice(0, 3)
                                        .map((invoice) => {
                                          const statusLabels = {
                                            PENDING: "Bekliyor",
                                            PAID: "Ödendi",
                                            CANCELLED: "İptal",
                                          };

                                          return (
                                            <div
                                              key={invoice.id}
                                              className="rounded-[13px] border border-violet-100 bg-gradient-to-br from-violet-50/80 to-indigo-50/50 p-3"
                                            >
                                              <div className="flex items-start justify-between gap-3">
                                                <div>
                                                  <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-violet-500">
                                                    Fatura
                                                  </p>

                                                  <p className="mt-0.5 text-[10px] font-semibold text-slate-800">
                                                    {invoice.invoiceNumber}
                                                  </p>
                                                </div>

                                                <span className="rounded-full bg-white px-2 py-1 text-[8px] font-semibold text-violet-600 shadow-sm">
                                                  {statusLabels[invoice.status] ||
                                                    invoice.status}
                                                </span>
                                              </div>

                                              <div className="mt-3 flex items-end justify-between gap-3">
                                                <div>
                                                  <p className="text-[8px] text-slate-400">
                                                    Tutar
                                                  </p>

                                                  <p className="mt-0.5 text-[15px] font-bold tracking-[-0.03em] text-slate-900">
                                                    {Number(
                                                      invoice.amount || 0,
                                                    ).toLocaleString("tr-TR", {
                                                      minimumFractionDigits: 2,
                                                      maximumFractionDigits: 2,
                                                    })}{" "}
                                                    {invoice.currency}
                                                  </p>
                                                </div>

                                                {invoice.doctor?.name && (
                                                  <div className="text-right">
                                                    <p className="text-[8px] text-slate-400">
                                                      Doktor
                                                    </p>

                                                    <p className="mt-0.5 max-w-[130px] truncate text-[9px] font-semibold text-slate-700">
                                                      {invoice.doctor.name}
                                                    </p>
                                                  </div>
                                                )}
                                              </div>

                                              {invoice.description && (
                                                <div className="mt-2.5 border-t border-violet-100 pt-2">
                                                  <p className="text-[8px] text-slate-400">
                                                    Açıklama
                                                  </p>

                                                  <p className="mt-0.5 text-[9px] leading-4 text-slate-600">
                                                    {invoice.description}
                                                  </p>
                                                </div>
                                              )}

                                              <div className="mt-2 flex items-center justify-between border-t border-violet-100 pt-2">
                                                <span className="text-[8px] text-slate-400">
                                                  Düzenlenme
                                                </span>

                                                <span className="text-[8px] font-medium text-slate-600">
                                                  {invoice.issuedAt
                                                    ? new Date(
                                                        invoice.issuedAt,
                                                      ).toLocaleDateString(
                                                        "tr-TR",
                                                      )
                                                    : "-"}
                                                </span>
                                              </div>
                                            </div>
                                          );
                                        })}

                                      <button
                                        type="button"
                                        onClick={() =>
                                          navigate("/patient/invoices")
                                        }
                                        className="flex w-full items-center justify-center gap-1.5 rounded-[11px] bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-2 text-[9px] font-semibold text-white shadow-[0_8px_18px_rgba(99,102,241,0.18)]"
                                      >
                                        <FileText size={12} />
                                        Faturalarımı Görüntüle
                                        <ChevronRight size={12} />
                                      </button>
                                    </div>
                                  )}

                                {!isUser &&
                                  item.action === "GET_TREATMENTS" &&
                                  item.data?.treatments?.length > 0 && (
                                    <div className="mt-2.5 space-y-2">
                                      {item.data.treatments
                                        .slice(0, 3)
                                        .map((treatment) => {
                                          const statusLabels = {
                                            COMPLETED: "Tamamlandı",
                                            IN_PROGRESS: "Devam Ediyor",
                                            PLANNED: "Planlandı",
                                          };

                                          return (
                                            <div
                                              key={treatment.id}
                                              className="rounded-[13px] border border-violet-100 bg-gradient-to-br from-violet-50/80 to-indigo-50/50 p-3"
                                            >
                                              <div className="flex items-start justify-between gap-3">
                                                <div>
                                                  <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-violet-500">
                                                    Tedavi Kaydı
                                                  </p>

                                                  <p className="mt-0.5 text-[11px] font-semibold text-slate-800">
                                                    {treatment.diagnosis ||
                                                      "Tedavi kaydı"}
                                                  </p>
                                                </div>

                                                <span className="rounded-full bg-white px-2 py-1 text-[8px] font-semibold text-violet-600 shadow-sm">
                                                  {statusLabels[
                                                    treatment.status
                                                  ] || treatment.status}
                                                </span>
                                              </div>

                                              {treatment.doctor?.name && (
                                                <div className="mt-3 flex items-center justify-between gap-3">
                                                  <span className="text-[8px] text-slate-400">
                                                    Doktor
                                                  </span>

                                                  <span className="text-right text-[9px] font-semibold text-slate-700">
                                                    {treatment.doctor.name}
                                                  </span>
                                                </div>
                                              )}

                                              {treatment.visitDate && (
                                                <div className="mt-1.5 flex items-center justify-between gap-3">
                                                  <span className="text-[8px] text-slate-400">
                                                    Ziyaret Tarihi
                                                  </span>

                                                  <span className="text-[9px] font-medium text-slate-600">
                                                    {new Date(
                                                      treatment.visitDate,
                                                    ).toLocaleDateString(
                                                      "tr-TR",
                                                    )}
                                                  </span>
                                                </div>
                                              )}

                                              {treatment.treatmentPlan && (
                                                <div className="mt-2.5 border-t border-violet-100 pt-2">
                                                  <p className="text-[8px] text-slate-400">
                                                    Tedavi Planı
                                                  </p>

                                                  <p className="mt-0.5 text-[9px] leading-4 text-slate-600">
                                                    {treatment.treatmentPlan}
                                                  </p>
                                                </div>
                                              )}

                                              {treatment.nextVisitDate && (
                                                <div className="mt-2 flex items-center justify-between gap-3 border-t border-violet-100 pt-2">
                                                  <span className="text-[8px] text-slate-400">
                                                    Sonraki Kontrol
                                                  </span>

                                                  <span className="text-[9px] font-semibold text-violet-600">
                                                    {new Date(
                                                      treatment.nextVisitDate,
                                                    ).toLocaleDateString(
                                                      "tr-TR",
                                                    )}
                                                  </span>
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}

                                      <button
                                        type="button"
                                        onClick={() =>
                                          navigate("/patient/treatments")
                                        }
                                        className="flex w-full items-center justify-center gap-1.5 rounded-[11px] bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-2 text-[9px] font-semibold text-white shadow-[0_8px_18px_rgba(99,102,241,0.18)]"
                                      >
                                        <Stethoscope size={12} />
                                        Tedavi Kayıtlarımı Görüntüle
                                        <ChevronRight size={12} />
                                      </button>
                                    </div>
                                  )}
                                  {!isUser &&
  item.action === "GET_MESSAGE_CONTACTS" &&
  item.data?.contacts?.length > 0 && (
    <div className="mt-2.5 space-y-2">
      {item.data.contacts.slice(0, 3).map((contact) => (
        <div
          key={contact.recipientId}
          className="rounded-[13px] border border-violet-100 bg-gradient-to-br from-violet-50/80 to-indigo-50/50 p-3"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
              <Stethoscope size={15} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-violet-500">
                Doktor
              </p>

              <p className="mt-0.5 truncate text-[11px] font-semibold text-slate-800">
                {contact.title ? `${contact.title} ` : ""}
                {contact.firstName} {contact.lastName}
              </p>
            </div>

            <MessageCircle
              size={15}
              className="shrink-0 text-violet-500"
            />
          </div>

          {contact.lastAppointmentAt && (
            <div className="mt-2.5 flex items-center justify-between border-t border-violet-100 pt-2">
              <span className="text-[8px] text-slate-400">
                Son Randevu
              </span>

              <span className="text-[9px] font-medium text-slate-600">
                {new Date(
                  contact.lastAppointmentAt,
                ).toLocaleDateString("tr-TR")}
              </span>
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => navigate("/patient/messages")}
        className="flex w-full items-center justify-center gap-1.5 rounded-[11px] bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-2 text-[9px] font-semibold text-white shadow-[0_8px_18px_rgba(99,102,241,0.18)]"
      >
        <MessageCircle size={12} />
        Mesajlaşmayı Aç
        <ChevronRight size={12} />
      </button>
    </div>
  )}
  {!isUser &&
  item.action === "SEND_MESSAGE" &&
  item.parameters?.recipientId &&
  item.parameters?.content && (
    <div className="mt-2.5">
      <div className="rounded-[13px] border border-violet-100 bg-gradient-to-br from-violet-50/80 to-indigo-50/50 p-3">
        <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-violet-500">
          Mesaj Özeti
        </p>

        <div className="mt-2.5 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[8px] text-slate-400">
              Doktor
            </span>

            <span className="text-right text-[9px] font-semibold text-slate-700">
              {item.parameters.doctor}
            </span>
          </div>

          <div className="border-t border-violet-100 pt-2">
            <p className="text-[8px] text-slate-400">
              Mesaj
            </p>

            <p className="mt-1 text-[9px] leading-4 text-slate-600">
              {item.parameters.content}
            </p>
          </div>
        </div>
      </div>

      <motion.button
        type="button"
        disabled={loading}
        whileHover={
          loading
            ? {}
            : {
                y: -1,
              }
        }
        whileTap={
          loading
            ? {}
            : {
                scale: 0.98,
              }
        }
        onClick={() =>
          handleMessageConfirm(item)
        }
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-[11px] bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-2 text-[9px] font-semibold text-white shadow-[0_8px_18px_rgba(99,102,241,0.18)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <MessageCircle size={12} />
        Mesajı Gönder
      </motion.button>
    </div>
  )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>

                    {loading && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 8,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        className="flex items-end gap-2.5"
                      >
                        <AssistantAvatar small />

                        <div
                          className={`flex items-center gap-1.5 rounded-[18px] rounded-bl-[6px] border border-slate-200/80 bg-white shadow-sm ${
                            screenshotMode
                              ? "px-3 py-2.5"
                              : "px-4 py-3"
                          }`}
                        >
                          {[0, 1, 2].map((index) => (
                            <motion.span
                              key={index}
                              animate={{
                                y: [0, -4, 0],
                                opacity: [0.35, 1, 0.35],
                              }}
                              transition={{
                                duration: 0.9,
                                repeat: Infinity,
                                delay: index * 0.14,
                              }}
                              className="h-1.5 w-1.5 rounded-full bg-violet-500"
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {error && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 6,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        className="rounded-[14px] border border-red-100 bg-red-50 px-3.5 py-2.5 text-[10px] leading-5 text-red-600"
                      >
                        {error}
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* COMPOSER */}
            <div
              className={`shrink-0 border-t border-slate-100 bg-white ${
                screenshotMode
                  ? "px-3 pb-2.5 pt-2.5"
                  : "px-4 pb-3 pt-3"
              }`}
            >
              <div
                className={`border border-violet-100 bg-[#FBFAFF] shadow-[0_7px_25px_rgba(79,70,229,0.06)] transition focus-within:border-violet-300 focus-within:bg-white ${
                  screenshotMode
                    ? "rounded-[17px] p-1"
                    : "rounded-[21px] p-1.5"
                }`}
              >
                <div className="flex items-end gap-2">
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyDown={handleComposerKeyDown}
                    rows={1}
                    maxLength={1200}
                    placeholder="DentFlow ile ilgili bir işlem yazın..."
                    className={`flex-1 resize-none bg-transparent text-slate-900 outline-none placeholder:text-slate-400 ${
                      screenshotMode
                        ? "max-h-20 min-h-[38px] px-3 py-2.5 text-[10px] leading-5"
                        : "max-h-24 min-h-[44px] px-3 py-3 text-[11px] leading-5"
                    }`}
                  />

                  <motion.button
                    type="button"
                    onClick={handleSend}
                    disabled={loading || !message.trim()}
                    whileHover={
                      loading
                        ? {}
                        : {
                            scale: 1.04,
                          }
                    }
                    whileTap={
                      loading
                        ? {}
                        : {
                            scale: 0.94,
                          }
                    }
                    className={`grid shrink-0 place-items-center rounded-[13px] bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 text-white shadow-[0_8px_20px_rgba(99,102,241,0.24)] disabled:cursor-not-allowed disabled:opacity-40 ${
                      screenshotMode ? "h-10 w-10" : "h-11 w-11"
                    }`}
                    aria-label="Gönder"
                  >
                    <SendHorizontal size={16} />
                  </motion.button>
                </div>
              </div>

              {!screenshotMode && (
                <div className="mt-2.5 flex items-center justify-center gap-1.5">
                  <ShieldCheck size={11} className="text-violet-500" />

                  <p className="text-[9px] text-slate-400">
                    Yalnızca DentFlow işlemleri için kullanılabilir.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING LAUNCHER */}
      {!screenshotMode && (
        <motion.button
          type="button"
          onClick={() => setOpen((current) => !current)}
          whileHover={{
            scale: 1.06,
          }}
          whileTap={{
            scale: 0.94,
          }}
          aria-label="DentFlow AI Assistant"
          className="pointer-events-auto relative grid h-[56px] w-[56px] place-items-center rounded-full bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 text-white shadow-[0_16px_42px_rgba(79,70,229,0.38)] sm:h-[64px] sm:w-[64px]"
        >
          <motion.span
            animate={{
              scale: [1, 1.24, 1],
              opacity: [0.35, 0, 0.35],
            }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
            }}
            className="absolute inset-[-5px] rounded-full border-2 border-cyan-300/70"
          />

          <motion.div
            animate={
              open
                ? {
                    rotate: 90,
                    scale: 0.92,
                  }
                : {
                    y: [0, -2, 0],
                    rotate: [0, 3, 0, -3, 0],
                  }
            }
            transition={{
              duration: open ? 0.2 : 3.5,
              repeat: open ? 0 : Infinity,
              ease: "easeInOut",
            }}
          >
            {open ? <X size={22} /> : <Bot size={24} />}
          </motion.div>

          {!open && (
            <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-[3px] border-white bg-emerald-500" />
          )}
        </motion.button>
      )}

      {screenshotMode && !open && (
        <motion.button
          type="button"
          onClick={() => setOpen(true)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="pointer-events-auto grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 text-white shadow-[0_14px_34px_rgba(79,70,229,0.30)]"
          aria-label="DentFlow AI Assistant"
        >
          <Bot size={20} />
        </motion.button>
      )}
    </div>
  );
}

export default FloatingAiAssistant;
