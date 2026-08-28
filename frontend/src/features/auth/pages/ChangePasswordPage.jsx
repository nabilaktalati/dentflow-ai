import {
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from 'lucide-react'

import {
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router'

import {
  motion,
} from 'motion/react'

import {
  useAuth,
} from '../context/authContext.js'


export default function ChangePasswordPage() {
  const navigate =
    useNavigate()

  const {
    user,
    changePassword,
  } = useAuth()


  const [
    form,
    setForm,
  ] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })


  const [
    submitting,
    setSubmitting,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState('')

  const [
    fieldErrors,
    setFieldErrors,
  ] = useState({})

  const [
    showCurrent,
    setShowCurrent,
  ] = useState(false)

  const [
    showNew,
    setShowNew,
  ] = useState(false)

  const [
    showConfirm,
    setShowConfirm,
  ] = useState(false)


  const handleChange = (
    event,
  ) => {
    const {
      name,
      value,
    } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    if (fieldErrors[name]) {
      setFieldErrors(
        (current) => ({
          ...current,
          [name]: undefined,
        }),
      )
    }
  }


  const handleSubmit = async (
    event,
  ) => {
    event.preventDefault()

    setSubmitting(true)
    setError('')
    setFieldErrors({})

    try {
      const updatedUser =
        await changePassword(
          form,
        )

      if (
        updatedUser?.role ===
        'DOCTOR'
      ) {
        navigate(
          '/doctor',
          {
            replace: true,
          },
        )

        return
      }

      if (
        updatedUser?.role ===
        'ADMIN'
      ) {
        navigate(
          '/admin',
          {
            replace: true,
          },
        )

        return
      }

      navigate(
        '/patient',
        {
          replace: true,
        },
      )
    } catch (requestError) {
      setError(
        requestError.message ||
          'Şifre değiştirilemedi.',
      )

      setFieldErrors(
        requestError.data
          ?.errors || {},
      )
    } finally {
      setSubmitting(false)
    }
  }


  return (
    <main className="relative grid min-h-[100dvh] place-items-center overflow-hidden bg-[#F3F1FA] px-4 py-8">

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[8%] top-[5%] size-[420px] rounded-full bg-[#7168FF]/10 blur-[100px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[5%] left-[10%] size-[320px] rounded-full bg-[#39BDF8]/[0.07] blur-[100px]"
      />


      <motion.section
        initial={{
          opacity: 0,
          y: 18,
          scale: 0.985,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.45,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
        className="relative w-full max-w-[500px] overflow-hidden rounded-[28px] border border-white/80 bg-white/75 shadow-[0_30px_80px_rgba(44,38,100,0.12)] backdrop-blur-xl"
      >

        <div className="border-b border-[#ECEAF4] px-6 py-6 sm:px-7">
          <div className="flex items-start gap-4">
            <div className="grid size-12 shrink-0 place-items-center rounded-[15px] bg-[#EFEAFF] text-[#625BF6]">
              <LockKeyhole
                size={20}
                strokeWidth={1.9}
              />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#625BF6]">
                Güvenlik
              </p>

              <h1 className="mt-1.5 text-[23px] font-semibold tracking-[-0.03em] text-[#172033]">
                Şifrenizi değiştirin
              </h1>

              <p className="mt-1.5 text-[12.5px] leading-5 text-[#7A8497]">
                İlk girişinizi tamamlamak için geçici şifrenizi kişisel bir şifreyle değiştirmeniz gerekiyor.
              </p>
            </div>
          </div>
        </div>


        <form
          onSubmit={
            handleSubmit
          }
          className="px-6 py-6 sm:px-7"
        >

          {error && (
            <div className="mb-5 rounded-[14px] border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-medium text-red-700">
              {error}
            </div>
          )}


          <PasswordField
            label="Mevcut şifre"
            name="currentPassword"
            value={
              form.currentPassword
            }
            onChange={
              handleChange
            }
            visible={
              showCurrent
            }
            onToggle={() =>
              setShowCurrent(
                (current) =>
                  !current,
              )
            }
            error={
              fieldErrors
                .currentPassword?.[0]
            }
          />


          <div className="mt-4">
            <PasswordField
              label="Yeni şifre"
              name="newPassword"
              value={
                form.newPassword
              }
              onChange={
                handleChange
              }
              visible={
                showNew
              }
              onToggle={() =>
                setShowNew(
                  (current) =>
                    !current,
                )
              }
              error={
                fieldErrors
                  .newPassword?.[0]
              }
            />
          </div>


          <div className="mt-4">
            <PasswordField
              label="Yeni şifre tekrar"
              name="confirmPassword"
              value={
                form.confirmPassword
              }
              onChange={
                handleChange
              }
              visible={
                showConfirm
              }
              onToggle={() =>
                setShowConfirm(
                  (current) =>
                    !current,
                )
              }
              error={
                fieldErrors
                  .confirmPassword?.[0]
              }
            />
          </div>


          <div className="mt-5 rounded-[15px] border border-[#E5E2F8] bg-[#F5F3FF] p-4">
            <div className="flex gap-3">
              <ShieldCheck
                size={17}
                className="mt-0.5 shrink-0 text-[#625BF6]"
              />

              <div>
                <p className="text-[11.5px] font-semibold text-[#403A9E]">
                  Güvenli şifre gereksinimleri
                </p>

                <p className="mt-1 text-[11px] leading-5 text-[#7771A6]">
                  En az 8 karakter, bir büyük harf, bir küçük harf ve bir rakam kullanın.
                </p>
              </div>
            </div>
          </div>


          <button
            type="submit"
            disabled={
              submitting
            }
            className="mt-6 h-11 w-full rounded-[13px] bg-[#625BF6] text-[13px] font-semibold text-white shadow-[0_10px_25px_rgba(98,91,246,0.22)] transition hover:bg-[#564FE7] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? 'Şifre değiştiriliyor...'
              : 'Şifreyi Değiştir'}
          </button>


          <p className="mt-4 text-center text-[10.5px] text-[#98A2B3]">
            {user?.email}
          </p>
        </form>
      </motion.section>
    </main>
  )
}


function PasswordField({
  label,
  visible,
  onToggle,
  error,
  ...props
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold text-[#596277]">
        {label}
      </span>

      <div className="relative">
        <input
          {...props}
          type={
            visible
              ? 'text'
              : 'password'
          }
          autoComplete="off"
          required
          className={`h-11 w-full rounded-[12px] border bg-white px-3.5 pr-11 text-[13px] text-[#273142] outline-none transition ${
            error
              ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100'
              : 'border-[#E2E4EA] focus:border-[#8A84FF] focus:ring-4 focus:ring-[#625BF6]/10'
          }`}
        />

        <button
          type="button"
          onClick={
            onToggle
          }
          className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-[9px] text-[#98A2B3] transition hover:bg-[#F3F2F8] hover:text-[#625BF6]"
        >
          {visible
            ? (
              <EyeOff
                size={16}
              />
            )
            : (
              <Eye
                size={16}
              />
            )}
        </button>
      </div>

      {error && (
        <span className="mt-1.5 block text-[11px] font-medium text-red-600">
          {error}
        </span>
      )}
    </label>
  )
}