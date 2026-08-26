import { useEffect, useRef, useState } from "react";
import {
  Link,
  useNavigate,
} from 'react-router'
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  registerPatient,
  resendVerification,
  verifyEmail,
} from "../api/authApi.js";

const EASE = [0.76, 0, 0.24, 1];

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

export default function RegisterPage() {
  const navigate = useNavigate()
const [desktopScale, setDesktopScale] =
  useState(1)
  useEffect(() => {
  const updateDesktopScale = () => {
    const BASE_WIDTH = 1380
    const BASE_HEIGHT = 700

    // Navbar + üst/alt boşluklar
    const availableWidth =
      window.innerWidth - 48

    const availableHeight =
      window.innerHeight - 120

    const widthScale =
      availableWidth / BASE_WIDTH

    const heightScale =
      availableHeight / BASE_HEIGHT

    const nextScale = Math.min(
      1,
      widthScale,
      heightScale,
    )

    setDesktopScale(
      Math.max(nextScale, 0.78),
    )
  }

  updateDesktopScale()

  window.addEventListener(
    'resize',
    updateDesktopScale,
  )

  return () => {
    window.removeEventListener(
      'resize',
      updateDesktopScale,
    )
  }
}, [])
  const [step, setStep] = useState('register')
  const [panelSide, setPanelSide] = useState("left");

  const [form, setForm] = useState(initialForm);

  const [registeredEmail, setRegisteredEmail] = useState("");

  const [otpCode, setOtpCode] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [resending, setResending] = useState(false);

  const [transitioning, setTransitioning] = useState(false);

  const [resendSeconds, setResendSeconds] = useState(0);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (resendSeconds <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setResendSeconds((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendSeconds]);

  const changeStep = async (nextStep, nextPanelSide) => {
    setTransitioning(true);

    setPanelSide(nextPanelSide);

    // İçerik panel ekranın ortasındayken değişir.
    await wait(390);

    setStep(nextStep);

    await wait(480);

    setTransitioning(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    if (form.password !== form.confirmPassword) {
      setError("Şifreler birbiriyle eşleşmiyor.");
      return;
    }

    try {
      setLoading(true);

      const response = await registerPatient({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      const normalizedEmail = form.email.trim().toLowerCase();

      setRegisteredEmail(normalizedEmail);

      setSuccessMessage(response.message);

      setResendSeconds(60);

      await changeStep("verify", "right");
    } catch (requestError) {
      setError(
        requestError.data?.message ||
          "Kayıt işlemi tamamlanamadı. Lütfen tekrar deneyin.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (event) => {
    event?.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!/^\d{6}$/.test(otpCode)) {
      setError("Lütfen 6 haneli doğrulama kodunu girin.");

      return false;
    }

    try {
      setLoading(true);

      const response = await verifyEmail({
        email: registeredEmail,
        code: otpCode,
      });

      setSuccessMessage(response.message);

      // Burada hemen success ekranına geçmiyoruz.
      // Önce OTP doğrulama animasyonu tamamlanacak.
      return true;
    } catch (requestError) {
      const remainingAttempts = requestError.data?.data?.remainingAttempts;

      if (typeof remainingAttempts === "number") {
        setError(
          `${requestError.data.message} Kalan deneme: ${remainingAttempts}`,
        );
      } else {
        setError(
          requestError.data?.message || "Doğrulama işlemi tamamlanamadı.",
        );
      }

      return false;
    } finally {
      setLoading(false);
    }
  };
  const handleResend = async () => {
  if (
    resending ||
    resendSeconds > 0
  ) {
    return
  }

  setError('')
  setSuccessMessage('')

  try {
    setResending(true)

    const response =
      await resendVerification(
        registeredEmail,
      )

    setOtpCode('')

    setSuccessMessage(
      response.message,
    )

    setResendSeconds(
      response.data
        ?.resendCooldownSeconds ||
        60,
    )
  } catch (requestError) {
    const retryAfter =
      requestError.data?.data
        ?.retryAfterSeconds

    if (retryAfter) {
      setResendSeconds(retryAfter)

      setError(
        `Yeni kod için ${retryAfter} saniye bekleyin.`,
      )
    } else {
      setError(
        requestError.data?.message ||
          'Yeni doğrulama kodu gönderilemedi.',
      )
    }
  } finally {
    setResending(false)
  }
}

  const handleBack = async () => {
    setOtpCode("");
    setError("");
    setSuccessMessage("");

    await changeStep("register", "left");
  };
const handleVerifiedTransition = () => {
  setStep('success')

  window.setTimeout(() => {
    navigate('/login')
  }, 1600)
}
return (
  <main className="min-h-[100dvh] bg-[#f7f8fc] pt-20">
    <div className="mx-auto flex min-h-[calc(100dvh-5rem)] w-full max-w-[1440px] items-center justify-center px-4 py-4 sm:px-6 lg:px-8">

      {/* =========================
          DESKTOP
         ========================= */}
      <div className="hidden w-full items-center justify-center xl:flex">
        <div
          className="relative shrink-0"
          style={{
            width: `${1380 * desktopScale}px`,
            height: `${700 * desktopScale}px`,
          }}
        >
          <div
            className="absolute left-0 top-0 h-[700px] w-[1380px] overflow-hidden rounded-[34px] border border-slate-200/80 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.10)]"
            style={{
              transform: `scale(${desktopScale})`,
              transformOrigin: 'top left',
            }}
          >
            <div className="relative h-full">

              {/* WHITE CONTENT LAYER */}
              <div className="absolute inset-0 z-10 grid grid-cols-2">

                {/* LEFT SIDE */}
                <div className="flex items-center justify-center px-14 py-10 xl:px-20">
                  <AnimatePresence mode="wait">
                    {step === 'verify' && (
                      <motion.div
                        key="verify-form"
                        initial={{
                          opacity: 0,
                          x: -36,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        exit={{
                          opacity: 0,
                          x: -24,
                        }}
                        transition={{
                          duration: 0.45,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="w-full max-w-[470px]"
                      >
                        <VerificationContent
                          email={registeredEmail}
                          code={otpCode}
                          loading={loading}
                          resending={resending}
                          resendSeconds={resendSeconds}
                          error={error}
                          successMessage={successMessage}
                          onCodeChange={(value) => {
                            setOtpCode(value)
                            setError('')
                          }}
                          onSubmit={handleVerify}
                          onResend={handleResend}
                          onBack={handleBack}
                          onVerified={
                            handleVerifiedTransition
                          }
                        />
                      </motion.div>
                    )}

                    {step === 'success' && (
                      <motion.div
                        key="success"
                        initial={{
                          opacity: 0,
                          y: 25,
                          scale: 0.97,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                        }}
                        exit={{
                          opacity: 0,
                          y: -10,
                        }}
                        transition={{
                          duration: 0.5,
                        }}
                        className="w-full max-w-[470px]"
                      >
                        <SuccessContent
                          message={successMessage}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex items-center justify-center px-14 py-10 xl:px-20">
                  <AnimatePresence mode="wait">
                    {step === 'register' && (
                      <motion.div
                        key="register-form"
                        initial={{
                          opacity: 0,
                          x: 32,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        exit={{
                          opacity: 0,
                          x: 24,
                        }}
                        transition={{
                          duration: 0.48,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="w-full max-w-[500px]"
                      >
                        <RegisterContent
                          form={form}
                          loading={loading}
                          error={error}
                          showPassword={showPassword}
                          onChange={handleChange}
                          onSubmit={handleRegister}
                          onTogglePassword={() =>
                            setShowPassword(
                              (current) => !current,
                            )
                          }
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* MOVING INDIGO PANEL */}
              <motion.div
                initial={false}
                animate={{
                  x:
                    panelSide === 'left'
                      ? '0%'
                      : '92%',

                  clipPath:
                    panelSide === 'left'
                      ? 'polygon(0 0, 100% 0, 86% 100%, 0 100%)'
                      : 'polygon(14% 0, 100% 0, 100% 100%, 0 100%)',
                }}
                transition={{
                  x: {
                    duration: 0.86,
                    ease: EASE,
                  },
                  clipPath: {
                    duration: 0.86,
                    ease: EASE,
                  },
                }}
                className="absolute inset-y-0 left-0 z-20 w-[52%] overflow-hidden bg-[#5B52F2]"
              >
                <PanelBackground />

                <div className="relative z-10 flex h-full items-center px-16 xl:px-20">
                  <AnimatePresence mode="wait">
                    {step === 'register' && (
                      <PanelRegisterStory />
                    )}

                    {step === 'verify' && (
                      <PanelVerifyStory />
                    )}

                    {step === 'success' && (
                      <PanelSuccessStory />
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {transitioning && (
                <div className="pointer-events-auto absolute inset-0 z-40" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          MOBILE / TABLET
         ========================= */}
      <div className="w-full overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.09)] xl:hidden">
        <div className="bg-[#5B52F2] px-6 py-8 text-white sm:px-10">
          <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
            <ShieldCheck size={17} />
            DENTFLOW AI
          </div>

          <h1 className="mt-4 text-[28px] font-semibold leading-tight tracking-[-0.04em]">
            Güvenli hasta hesabınız.
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/70">
            Randevularınızı ve klinik
            sürecinizi tek noktadan yönetin.
          </p>
        </div>

        <div className="p-6 sm:p-10 md:px-14">
          {step === 'register' && (
            <RegisterContent
              form={form}
              loading={loading}
              error={error}
              showPassword={showPassword}
              onChange={handleChange}
              onSubmit={handleRegister}
              onTogglePassword={() =>
                setShowPassword(
                  (current) => !current,
                )
              }
            />
          )}

          {step === 'verify' && (
            <VerificationContent
              email={registeredEmail}
              code={otpCode}
              loading={loading}
              resending={resending}
              resendSeconds={resendSeconds}
              error={error}
              successMessage={successMessage}
              onCodeChange={(value) => {
                setOtpCode(value)
                setError('')
              }}
              onSubmit={handleVerify}
              onResend={handleResend}
              onBack={handleBack}
              onVerified={
                handleVerifiedTransition
              }
            />
          )}

          {step === 'success' && (
            <SuccessContent
              message={successMessage}
            />
          )}
        </div>
      </div>
    </div>
  </main>
)
}

/* =========================================================
   INDIGO PANEL
   ========================================================= */

function PanelBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-indigo-950/10" />

      <div className="absolute -left-40 top-[-120px] size-[520px] rounded-full border border-white/10" />

      <div className="absolute -left-16 top-[40px] size-[300px] rounded-full border border-white/[0.08]" />

      <div className="absolute right-[15%] top-0 h-full w-px bg-white/[0.08]" />

      <div className="absolute right-[21%] top-0 h-full w-px bg-white/[0.05]" />

      <motion.div
        animate={{
          y: [-15, 15, -15],
          rotate: [0, 4, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-130px] right-[-80px] size-[370px] rounded-full border border-white/10"
      />

      <div className="absolute left-0 top-1/2 h-px w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </div>
  );
}

function PanelRegisterStory() {
  return (
    <motion.div
      key="register-story"
      initial={{
        opacity: 0,
        x: -30,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: -25,
      }}
      transition={{
        duration: 0.4,
      }}
      className="max-w-[430px] text-white"
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
        <ShieldCheck size={16} />
        Güvenli hasta hesabı
      </div>

      <h1 className="mt-8 max-w-[420px] text-[clamp(38px,3.5vw,50px)] font-semibold leading-[1.02] tracking-[-0.05em]">
        Kliniğinizle olan
        <span className="block">dijital yolculuğunuz</span>
        <span className="block">burada başlar.</span>
      </h1>

      <p className="mt-7 max-w-md text-[15px] leading-7 text-white/72">
        Randevularınızı takip edin, klinik iletişiminizi yönetin ve hasta
        sürecinize güvenli hesabınızdan erişin.
      </p>

      <div className="mt-10 space-y-4">
        <PanelFeature text="Güvenli e-posta doğrulaması" />
        <PanelFeature text="Randevu sürecine tek noktadan erişim" />
        <PanelFeature text="Güvenli hasta veri altyapısı" />
      </div>
    </motion.div>
  );
}

function PanelVerifyStory() {
  return (
    <motion.div
      key="verify-story"
      initial={{
        opacity: 0,
        x: 30,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
      }}
      transition={{
        duration: 0.4,
      }}
      className="ml-auto max-w-[420px] text-white"
    >
      <div className="flex size-12 items-center justify-center rounded-2xl bg-white/12">
        <Mail size={22} />
      </div>

      <h1 className="mt-8 max-w-[410px] text-[clamp(38px,3.3vw,48px)] font-semibold leading-[1.03] tracking-[-0.05em]">
        Son bir adım.
        <span className="block text-white/75">E-postanızı doğrulayın.</span>
      </h1>

      <p className="mt-7 text-[15px] leading-7 text-white/70">
        Hesabınız oluşturuldu. Size gönderilen 6 haneli kodla e-posta adresinizi
        doğrulayın.
      </p>

      <div className="mt-10 space-y-4">
        <PanelFeature text="6 haneli güvenli doğrulama kodu" />
        <PanelFeature text="10 dakika geçerlilik süresi" />
        <PanelFeature text="Güvenli yeniden gönderim sistemi" />
      </div>
    </motion.div>
  );
}

function PanelSuccessStory() {
  return (
    <motion.div
      key="success-story"
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="ml-auto max-w-[420px] text-white"
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-white text-[#5B52F2]">
        <Check size={27} strokeWidth={3} />
      </div>

      <h1 className="mt-8 max-w-[410px] text-[clamp(38px,3.3vw,48px)] font-semibold leading-[1.03] tracking-[-0.05em]">
        Hesabınız hazır.
      </h1>

      <p className="mt-5 text-[15px] leading-7 text-white/72">
        DentFlow hasta hesabınız başarıyla etkinleştirildi.
      </p>
    </motion.div>
  );
}

function PanelFeature({ text }) {
  return (
    <div className="flex items-center gap-3 text-sm font-medium text-white/85">
      <span className="flex size-7 items-center justify-center rounded-full bg-white/12">
        <Check size={14} strokeWidth={2.5} />
      </span>

      {text}
    </div>
  );
}

/* =========================================================
   REGISTER
   ========================================================= */

function RegisterContent({
  form,
  loading,
  error,
  showPassword,
  onChange,
  onSubmit,
  onTogglePassword,
}) {
  return (
    <div>
      <p className="text-xs font-bold tracking-[0.12em] text-[#5B52F2]">
        DENTFLOW AI
      </p>

      <h2 className="
  mt-2 text-[32px]
  [@media(max-height:850px)]:text-[28px]
  font-semibold tracking-[-0.045em] text-slate-950
">
        Hasta Hesabı Oluştur
      </h2>

      <p className="
  mt-2 text-sm leading-6 text-slate-500
  [@media(max-height:850px)]:mt-1
  [@media(max-height:850px)]:leading-5
">
        Bilgilerinizi girin. Hesabınızı e-posta doğrulamasıyla
        etkinleştireceğiz.
      </p>

      <form
  onSubmit={onSubmit}
  className="
    mt-6 space-y-3.5
    [@media(max-height:850px)]:mt-4
    [@media(max-height:850px)]:space-y-2.5
  "
>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <Field
            label="Ad"
            name="firstName"
            value={form.firstName}
            placeholder="Adınız"
            icon={UserRound}
            onChange={onChange}
            required
          />

          <Field
            label="Soyad"
            name="lastName"
            value={form.lastName}
            placeholder="Soyadınız"
            icon={UserRound}
            onChange={onChange}
            required
          />
        </div>

        <Field
          label="E-posta"
          name="email"
          type="email"
          value={form.email}
          placeholder="ornek@email.com"
          icon={Mail}
          onChange={onChange}
          autoComplete="email"
          required
        />

        <Field
          label="Telefon"
          name="phone"
          type="tel"
          value={form.phone}
          placeholder="05XX XXX XX XX"
          autoComplete="tel"
          inputMode="tel"
          onChange={onChange}
          required
        />

        <div className="grid gap-3.5 sm:grid-cols-2">
          <PasswordField
            label="Şifre"
            name="password"
            value={form.password}
            showPassword={showPassword}
            onChange={onChange}
            onToggle={onTogglePassword}
          />

          <PasswordField
            label="Şifre Tekrar"
            name="confirmPassword"
            value={form.confirmPassword}
            showPassword={showPassword}
            onChange={onChange}
            onToggle={onTogglePassword}
          />
        </div>

        <div className="min-h-[38px]">
          {error ? (
            <motion.div
              initial={{
                opacity: 0,
                y: -5,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.25,
              }}
            >
              <Alert type="error">{error}</Alert>
            </motion.div>
          ) : (
            <p className="pt-0.5 text-xs leading-5 text-slate-400">
              Şifreniz en az 8 karakter, bir büyük harf, bir küçük harf ve bir
              rakam içermelidir.
            </p>
          )}
        </div>

        <div className="pt-1">
          <PrimaryButton loading={loading} loadingText="Hesap oluşturuluyor...">
            Hesap Oluştur
          </PrimaryButton>
        </div>
      </form>

      <p className="mt-4 text-center text-sm text-slate-500">
        Zaten hesabınız var mı?{" "}
        <Link
          to="/login"
          className="font-semibold text-[#5B52F2] transition hover:text-indigo-700"
        >
          Giriş Yap
        </Link>
      </p>
    </div>
  );
}

/* =========================================================
   VERIFY
   ========================================================= */

function VerificationContent({
  email,
  code,
  loading,
  resending,
  resendSeconds,
  error,
  successMessage,
  onCodeChange,
  onSubmit,
  onResend,
  onBack,
  onVerified,
}) {
  const [visualState, setVisualState] =
    useState('idle')

  const handleAnimatedSubmit =
    async (event) => {
      event.preventDefault()

      if (
        loading ||
        visualState === 'checking' ||
        visualState === 'verified'
      ) {
        return
      }

      if (code.length !== 6) {
        await onSubmit(event)
        return
      }

      // 1. OTP kutuları hafifçe pulse yapar.
      setVisualState('checking')

      const verified =
        await onSubmit(event)

      if (!verified) {
        // Hatalı kod -> kısa shake animasyonu.
        setVisualState('error')

        await wait(520)

        setVisualState('idle')
        return
      }

      // 2. Backend doğrulaması başarılı.
      // Kutular merkeze kapanır ve check görünür.
      setVisualState('verified')

      await wait(1350)

      // 3. Son başarı ekranına geç.
      onVerified?.()
    }

  const isChecking =
    visualState === 'checking'

  const isVerified =
    visualState === 'verified'

  const hasVisualError =
    visualState === 'error'

  return (
    <div>
      <motion.div
        animate={
          isVerified
            ? {
                scale: 0.92,
                opacity: 0.75,
              }
            : {
                scale: 1,
                opacity: 1,
              }
        }
        transition={{
          duration: 0.3,
        }}
        className="flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-[#5B52F2]"
      >
        <KeyRound size={22} />
      </motion.div>

      <p className="mt-7 text-xs font-bold tracking-[0.12em] text-[#5B52F2]">
        E-POSTA DOĞRULAMA
      </p>

      <h2 className="mt-3 text-[34px] font-semibold tracking-[-0.045em] text-slate-950">
        Kodunuzu girin.
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        <span className="font-semibold text-slate-700">
          {email}
        </span>{' '}
        adresine gönderdiğimiz 6 haneli
        doğrulama kodunu girin.
      </p>

      <form
        onSubmit={handleAnimatedSubmit}
        className="mt-8"
      >
        {/* =========================================
            OTP -> VERIFIED MORPH
           ========================================= */}
        <div className="relative min-h-[82px]">
          {/* OTP BOXES */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={
              isVerified
                ? {
                    scaleX: 0.12,
                    scaleY: 0.86,
                    opacity: 0,
                    filter: 'blur(5px)',
                  }
                : hasVisualError
                  ? {
                      x: [
                        0,
                        -8,
                        8,
                        -6,
                        6,
                        -3,
                        3,
                        0,
                      ],
                    }
                  : isChecking
                    ? {
                        scale: [
                          1,
                          0.985,
                          1,
                        ],
                      }
                    : {
                        scaleX: 1,
                        scaleY: 1,
                        opacity: 1,
                        filter: 'blur(0px)',
                        x: 0,
                      }
            }
            transition={
              isVerified
                ? {
                    duration: 0.42,
                    ease: [
                      0.22,
                      1,
                      0.36,
                      1,
                    ],
                  }
                : hasVisualError
                  ? {
                      duration: 0.42,
                    }
                  : isChecking
                    ? {
                        duration: 0.85,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }
                    : {
                        duration: 0.25,
                      }
            }
            style={{
              transformOrigin: 'center',
            }}
          >
            <OtpInput
              value={code}
              onChange={onCodeChange}
              disabled={
                loading ||
                isVerified
              }
            />
          </motion.div>

          {/* SUCCESS CHECK */}
          <AnimatePresence>
            {isVerified && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{
                  opacity: 0,
                  scale: 0.5,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 280,
                  damping: 18,
                  delay: 0.2,
                }}
              >
                <div className="relative">
                  {/* Green ripple */}
                  <motion.span
                    className="absolute inset-0 rounded-2xl border border-emerald-400"
                    initial={{
                      scale: 1,
                      opacity: 0.5,
                    }}
                    animate={{
                      scale: 1.8,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.8,
                      ease: 'easeOut',
                      delay: 0.3,
                    }}
                  />

                  <motion.span
                    className="absolute inset-0 rounded-2xl bg-emerald-400/20"
                    initial={{
                      scale: 0.8,
                      opacity: 0,
                    }}
                    animate={{
                      scale: 1.45,
                      opacity: [
                        0,
                        0.45,
                        0,
                      ],
                    }}
                    transition={{
                      duration: 0.85,
                      delay: 0.18,
                    }}
                  />

                  <motion.div
                    initial={{
                      backgroundColor:
                        '#5B52F2',
                      borderColor:
                        '#5B52F2',
                    }}
                    animate={{
                      backgroundColor:
                        '#ECFDF5',
                      borderColor:
                        '#6EE7B7',
                    }}
                    transition={{
                      duration: 0.35,
                    }}
                    className="relative flex size-16 items-center justify-center rounded-2xl border-2 text-emerald-600 shadow-[0_12px_35px_rgba(16,185,129,0.18)]"
                  >
                    <motion.svg
                      width="30"
                      height="30"
                      viewBox="0 0 30 30"
                      fill="none"
                    >
                      <motion.path
                        d="M7 15.5L12.5 21L23 10"
                        stroke="currentColor"
                        strokeWidth="2.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{
                          pathLength: 0,
                        }}
                        animate={{
                          pathLength: 1,
                        }}
                        transition={{
                          duration: 0.42,
                          delay: 0.35,
                          ease: 'easeOut',
                        }}
                      />
                    </motion.svg>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* VERIFIED MESSAGE */}
        <AnimatePresence mode="wait">
          {isVerified ? (
            <motion.div
              key="verified-message"
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.48,
                duration: 0.32,
              }}
              className="mt-3 text-center"
            >
              <p className="text-sm font-semibold text-emerald-600">
                Kod başarıyla doğrulandı
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Hesabınız
                etkinleştiriliyor...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="otp-meta"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              className="mt-5 flex items-center justify-between"
            >
              <span className="text-xs text-slate-400">
                Kod 10 dakika boyunca
                geçerlidir.
              </span>

              {resendSeconds > 0 && (
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-[#5B52F2]">
                  {resendSeconds} sn
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* SUCCESS / ERROR MESSAGES */}
        {!isVerified &&
          successMessage && (
            <div className="mt-5">
              <Alert type="success">
                {successMessage}
              </Alert>
            </div>
          )}

        {!isVerified && error && (
          <motion.div
            initial={{
              opacity: 0,
              y: -4,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-5"
          >
            <Alert type="error">
              {error}
            </Alert>
          </motion.div>
        )}

        {/* VERIFY BUTTON */}
        {!isVerified && (
          <motion.div
            layout
            className="mt-6"
          >
            <PrimaryButton
              loading={loading}
              loadingText="Kod kontrol ediliyor..."
              disabled={
                code.length !== 6 ||
                isChecking
              }
            >
              E-postayı Doğrula
            </PrimaryButton>
          </motion.div>
        )}
      </form>

      {/* FOOTER ACTIONS */}
      <AnimatePresence>
        {!isVerified && (
          <motion.div
            initial={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
              y: 5,
            }}
            className="mt-7 flex items-center justify-between border-t border-slate-100 pt-6"
          >
            <button
              type="button"
              onClick={onBack}
              disabled={
                loading ||
                isChecking
              }
              className="flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeft size={15} />
              Geri Dön
            </button>

            <button
              type="button"
              onClick={onResend}
              disabled={
                resending ||
                resendSeconds > 0 ||
                loading ||
                isChecking
              }
              className="text-sm font-semibold text-[#5B52F2] transition hover:text-indigo-700 disabled:cursor-not-allowed disabled:text-slate-400"
            >
              {resending
                ? 'Gönderiliyor...'
                : resendSeconds > 0
                  ? `Tekrar gönder (${resendSeconds})`
                  : 'Kodu Tekrar Gönder'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* =========================================================
   SUCCESS
   ========================================================= */

function SuccessContent({ message }) {
  return (
    <div className="text-center">
      <motion.div
        initial={{
          scale: 0.65,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        transition={{
          type: "spring",
          stiffness: 230,
          damping: 17,
        }}
        className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
      >
        <motion.svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <motion.path
            d="M10 20.5L17 27L30 13"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{
              pathLength: 0,
            }}
            animate={{
              pathLength: 1,
            }}
            transition={{
              delay: 0.15,
              duration: 0.55,
            }}
          />
        </motion.svg>
      </motion.div>

      <p className="mt-7 text-xs font-bold tracking-[0.15em] text-emerald-600">
        HESAP DOĞRULANDI
      </p>

      <h2 className="mt-3 text-[36px] font-semibold tracking-[-0.045em] text-slate-950">
        DentFlow’a hoş geldiniz.
      </h2>

      <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-slate-500">
        {message ||
          "E-posta adresiniz doğrulandı ve hesabınız etkinleştirildi."}
      </p>

      <Link
        to="/login"
        className="font-medium text-[#5B52F2] hover:text-[#4940e8]"
      >
        Giriş Yap
      </Link>
    </div>
  );
}

/* =========================================================
   OTP
   ========================================================= */

function OtpInput({ value, onChange, disabled }) {
  const refs = useRef([]);

  const digits = Array.from({ length: 6 }, (_, index) => value[index] || "");

  const updateDigit = (index, rawValue) => {
    const digit = rawValue.replace(/\D/g, "").slice(-1);

    const next = [...digits];

    next[index] = digit;

    onChange(next.join(""));

    if (digit && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      refs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    onChange(pasted);

    window.requestAnimationFrame(() => {
      const index = Math.min(pasted.length, 6) - 1;

      refs.current[index]?.focus();
    });
  };

  return (
    <div onPaste={handlePaste} className="grid grid-cols-6 gap-2.5">
      {digits.map((digit, index) => (
        <motion.input
          key={index}
          ref={(element) => {
            refs.current[index] = element;
          }}
          value={digit}
          disabled={disabled}
          inputMode="numeric"
          maxLength={1}
          aria-label={`Doğrulama kodu ${index + 1}. hane`}
          onChange={(event) => updateDigit(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          animate={
            digit
              ? {
                  scale: [0.9, 1.08, 1],
                }
              : {
                  scale: 1,
                }
          }
          transition={{
            duration: 0.22,
          }}
          className="aspect-square w-full rounded-2xl border border-slate-200 bg-slate-50 text-center text-2xl font-bold text-[#5B52F2] outline-none transition focus:-translate-y-1 focus:border-[#5B52F2]/50 focus:bg-white focus:shadow-[0_12px_30px_rgba(91,82,242,0.12)] focus:ring-4 focus:ring-indigo-100 disabled:opacity-50"
        />
      ))}
    </div>
  );
}

/* =========================================================
   FORM UI
   ========================================================= */

function Field({ label, icon: Icon, ...props }) {
  return (
    <label className="group block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>

      <div className="relative mt-2">
        {Icon && (
          <Icon
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-[#5B52F2]"
          />
        )}

        <input
          {...props}
          className={`h-12 w-full rounded-xl border border-slate-200 bg-white ${
            Icon ? "pl-11" : "pl-4"
          } pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#5B52F2]/50 focus:ring-4 focus:ring-indigo-100`}
        />
      </div>
    </label>
  );
}

function PasswordField({
  label,
  name,
  value,
  showPassword,
  onChange,
  onToggle,
}) {
  return (
    <label className="group block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>

      <div className="relative mt-2">
        <LockKeyhole
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-[#5B52F2]"
        />

        <input
          name={name}
          value={value}
          type={showPassword ? "text" : "password"}
          onChange={onChange}
          autoComplete="new-password"
          required
          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-900 outline-none transition focus:border-[#5B52F2]/50 focus:ring-4 focus:ring-indigo-100"
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </label>
  );
}

function PrimaryButton({ children, loading, loadingText, disabled = false }) {
  return (
    <motion.button
      type="submit"
      disabled={loading || disabled}
      whileHover={
        loading || disabled
          ? undefined
          : {
              y: -2,
            }
      }
      whileTap={
        loading || disabled
          ? undefined
          : {
              scale: 0.99,
            }
      }
      className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#5B52F2] px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(91,82,242,0.22)] transition hover:bg-[#5047e8] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? loadingText : children}

      {!loading && (
        <ArrowRight
          size={17}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      )}
    </motion.button>
  );
}

function Alert({ type, children }) {
  const success = type === "success";

  return (
    <div
      role="alert"
      className={`rounded-xl border px-4 py-2.5 text-sm leading-5 ${
        success
          ? "border-emerald-100 bg-emerald-50 text-emerald-700"
          : "border-red-100 bg-red-50 text-red-700"
      }`}
    >
      {children}
    </div>
  );
}
