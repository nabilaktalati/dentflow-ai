import { useEffect, useState } from 'react'
import {
  useAuth,
} from '../context/authContext.js'
import {
  Link,
  useNavigate,
} from 'react-router'
import {
  AnimatePresence,
  motion,
} from 'motion/react'
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from 'lucide-react'

import {
  loginUser,
} from '../api/authApi.js'

const EASE = [0.76, 0, 0.24, 1]

const wait = (ms) =>
  new Promise((resolve) =>
    window.setTimeout(resolve, ms),
  )

const initialForm = {
  email: '',
  password: '',
}

export default function LoginPage() {
  const navigate = useNavigate()
const {
  completeLogin,
} = useAuth()
  const [desktopScale, setDesktopScale] =
    useState(1)
  const [step, setStep] =
    useState('login')
  const [panelSide, setPanelSide] =
    useState('left')
  const [form, setForm] =
    useState(initialForm)
  const [showPassword, setShowPassword] =
    useState(false)
  const [loading, setLoading] =
    useState(false)
  const [transitioning, setTransitioning] =
    useState(false)
  const [error, setError] =
    useState('')
const [successMessage, setSuccessMessage] =
  useState('')



useEffect(() => {
    const updateDesktopScale = () => {
      const BASE_WIDTH = 1380
      const BASE_HEIGHT = 700

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

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    setError('')
  }

const handleSuccessTransition = async () => {
  setTransitioning(true)
  setPanelSide('right')

  await wait(390)

  setStep('success')

  // Başarı ekranı ve yükleme göstergesi
  await wait(1750)

  navigate('/', {
    replace: true,
  })
}


  const handleSubmit = async (event) => {
    event.preventDefault()

    if (loading || transitioning) {
      return
    }

    setError('')
    setSuccessMessage('')

    const email =
      form.email.trim().toLowerCase()

    if (!email) {
      setError(
        'E-posta adresinizi giriniz.',
      )
      return
    }

    if (!form.password) {
      setError('Şifrenizi giriniz.')
      return
    }

 try {
  setLoading(true)

  const response = await loginUser({
    email,
    password: form.password,
  })

  const user =
    response.data?.user

  completeLogin(user)

  setSuccessMessage(
    response.message ||
      'Giriş başarılı. Oturumunuz hazır.',
  )

  await handleSuccessTransition(
    user?.role,
  )
} catch (requestError) {
  setError(
    requestError.data?.message ||
    requestError.message ||
      'Giriş işlemi tamamlanamadı. Lütfen tekrar deneyin.',
  )
} finally {
  setLoading(false)
}
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
                      {step === 'success' && (
                        <motion.div
                          key="login-success"
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
                          <LoginSuccessContent
                            message={successMessage}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="flex items-center justify-center px-14 py-10 xl:px-20">
                    <AnimatePresence mode="wait">
                      {step === 'login' && (
                        <motion.div
                          key="login-form"
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
                          <LoginContent
                            form={form}
                            loading={loading}
                            error={error}
                            showPassword={showPassword}
                            onChange={handleChange}
                            onSubmit={handleSubmit}
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
                      {step === 'login' && (
                        <PanelLoginStory />
                      )}

                      {step === 'success' && (
                        <PanelLoginSuccessStory />
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
          <div className="relative overflow-hidden bg-[#5B52F2] px-6 py-8 text-white sm:px-10">
            <PanelBackground />

            <div className="relative z-10">
              <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
                <ShieldCheck size={17} />
                DENTFLOW AI
              </div>

              <h1 className="mt-4 text-[28px] font-semibold leading-tight tracking-[-0.04em]">
                Güvenli hesabınıza dönün.
              </h1>

              <p className="mt-3 max-w-md text-sm leading-6 text-white/70">
                Randevularınızı ve klinik sürecinizi güvenli DentFlow oturumunuzdan yönetin.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-10 md:px-14">
            <AnimatePresence mode="wait">
              {step === 'login' && (
                <motion.div
                  key="mobile-login"
                  initial={{
                    opacity: 0,
                    y: 14,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -8,
                  }}
                >
                  <LoginContent
                    form={form}
                    loading={loading}
                    error={error}
                    showPassword={showPassword}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onTogglePassword={() =>
                      setShowPassword(
                        (current) => !current,
                      )
                    }
                  />
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div
                  key="mobile-success"
                  initial={{
                    opacity: 0,
                    y: 18,
                    scale: 0.98,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                >
                  <LoginSuccessContent
                    message={successMessage}
                  />
                </motion.div>
              )}
            </AnimatePresence>
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
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
    >
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
          ease: 'easeInOut',
        }}
        className="absolute bottom-[-130px] right-[-80px] size-[370px] rounded-full border border-white/10"
      />

      <div className="absolute left-0 top-1/2 h-px w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </div>
  )
}

function PanelLoginStory() {
  return (
    <motion.div
      key="login-story"
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
        Güvenli klinik erişimi
      </div>

      <h1 className="mt-8 max-w-[420px] text-[clamp(38px,3.5vw,50px)] font-semibold leading-[1.02] tracking-[-0.05em]">
        Kliniğinizle olan
        <span className="block">dijital akışınıza</span>
        <span className="block">güvenle dönün.</span>
      </h1>

      <p className="mt-7 max-w-md text-[15px] leading-7 text-white/72">
        Randevularınıza, klinik iletişiminize ve hasta sürecinize tek güvenli oturum üzerinden erişin.
      </p>

      <div className="mt-10 space-y-4">
        <PanelFeature text="Güvenli oturum yönetimi" />
        <PanelFeature text="Rol bazlı erişim kontrolü" />
        <PanelFeature text="Randevu sürecine tek noktadan erişim" />
      </div>
    </motion.div>
  )
}

function PanelLoginSuccessStory() {
  return (
    <motion.div
      key="login-success-story"
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
      }}
      className="ml-auto max-w-[420px] text-white"
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-white text-[#5B52F2]">
        <Check
          size={27}
          strokeWidth={3}
        />
      </div>

      <h1 className="mt-8 max-w-[410px] text-[clamp(38px,3.3vw,48px)] font-semibold leading-[1.03] tracking-[-0.05em]">
        Oturumunuz hazır.
      </h1>

      <p className="mt-5 text-[15px] leading-7 text-white/72">
        Güvenli DentFlow oturumunuz oluşturuldu. Hesabınıza yönlendiriliyorsunuz.
      </p>
    </motion.div>
  )
}

function PanelFeature({ text }) {
  return (
    <div className="flex items-center gap-3 text-sm font-medium text-white/85">
      <span className="flex size-7 items-center justify-center rounded-full bg-white/12">
        <Check
          size={14}
          strokeWidth={2.5}
        />
      </span>

      {text}
    </div>
  )
}

/* =========================================================
   LOGIN FORM
   ========================================================= */

function LoginContent({
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

      <h2 className="mt-2 text-[32px] font-semibold tracking-[-0.045em] text-slate-950 [@media(max-height:850px)]:text-[28px]">
        Hesabınıza Giriş Yapın
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500 [@media(max-height:850px)]:mt-1 [@media(max-height:850px)]:leading-5">
        E-posta adresiniz ve şifrenizle güvenli DentFlow oturumunuzu başlatın.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-7 space-y-4 [@media(max-height:850px)]:mt-5 [@media(max-height:850px)]:space-y-3"
      >
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

        <PasswordField
          label="Şifre"
          name="password"
          value={form.password}
          showPassword={showPassword}
          onChange={onChange}
          onToggle={onTogglePassword}
        />

        <div className="min-h-[42px]">
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
              <Alert>{error}</Alert>
            </motion.div>
          ) : (
            <div className="flex items-center gap-2 pt-1 text-xs leading-5 text-slate-400">
              <LockKeyhole size={14} />
              Oturum bilgileriniz güvenli şekilde işlenir.
            </div>
          )}
        </div>

        <div className="pt-1">
          <PrimaryButton
            loading={loading}
            loadingText="Giriş yapılıyor..."
          >
            Giriş Yap
          </PrimaryButton>
        </div>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500">
        Henüz hesabınız yok mu?{' '}
        <Link
          to="/register"
          className="font-semibold text-[#5B52F2] transition hover:text-indigo-700"
        >
          Hasta hesabı oluşturun
        </Link>
      </p>
    </div>
  )
}

/* =========================================================
   SUCCESS
   ========================================================= */

function LoginSuccessContent({ message }) {
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
          type: 'spring',
          stiffness: 230,
          damping: 17,
        }}
        className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
      >
        <motion.svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
        >
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
        GİRİŞ BAŞARILI
      </p>

      <h2 className="mt-3 text-[36px] font-semibold tracking-[-0.045em] text-slate-950">
        Tekrar hoş geldiniz.
      </h2>

      <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-slate-500">
        {message ||
          'Güvenli DentFlow oturumunuz oluşturuldu. Yönlendiriliyorsunuz.'}
      </p>
      <div className="mx-auto mt-8 w-full max-w-[190px]">
  <div className="h-[4px] overflow-hidden rounded-full bg-slate-100">
    <motion.div
      initial={{
        width: '0%',
      }}
      animate={{
        width: '100%',
      }}
      transition={{
        duration: 1.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full rounded-full bg-[#5B52F2]"
    />
  </div>

  <p className="mt-3 text-xs font-medium text-slate-400">
    DentFlow hazırlanıyor...
  </p>
</div>

    </div>
  )
}

/* =========================================================
   FORM UI
   ========================================================= */

function Field({
  label,
  name,
  type = 'text',
  value,
  placeholder,
  icon: Icon,
  onChange,
  autoComplete,
  required,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>

      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}

        <input
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
          className={`h-12 w-full rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#5B52F2]/50 focus:bg-white focus:ring-4 focus:ring-indigo-100 ${
            Icon
              ? 'pl-11 pr-4'
              : 'px-4'
          }`}
        />
      </div>
    </label>
  )
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
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>

      <div className="relative">
        <LockKeyhole
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          name={name}
          type={
            showPassword
              ? 'text'
              : 'password'
          }
          value={value}
          placeholder="Şifrenizi giriniz"
          onChange={onChange}
          autoComplete="current-password"
          required
          className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#5B52F2]/50 focus:bg-white focus:ring-4 focus:ring-indigo-100"
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={
            showPassword
              ? 'Şifreyi gizle'
              : 'Şifreyi göster'
          }
          className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-slate-700"
        >
          {showPassword ? (
            <EyeOff size={17} />
          ) : (
            <Eye size={17} />
          )}
        </button>
      </div>
    </label>
  )
}

function PrimaryButton({
  children,
  loading,
  loadingText,
}) {
  return (
    <motion.button
      type="submit"
      disabled={loading}
      whileHover={
        loading
          ? undefined
          : {
              y: -2,
            }
      }
      whileTap={
        loading
          ? undefined
          : {
              scale: 0.985,
            }
      }
      className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#5B52F2] px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(91,82,242,0.22)] transition hover:bg-[#5047e8] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading
        ? loadingText
        : children}

      {!loading && (
        <ArrowRight
          size={17}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      )}
    </motion.button>
  )
}

function Alert({ children }) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm leading-5 text-red-700"
    >
      {children}
    </div>
  )
}
