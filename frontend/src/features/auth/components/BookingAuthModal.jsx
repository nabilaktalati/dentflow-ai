import {
  AnimatePresence,
  motion,
} from 'motion/react'

import {
  ArrowRight,
  LockKeyhole,
  UserPlus,
  X,
} from 'lucide-react'

import {
  useNavigate,
} from 'react-router'


export default function BookingAuthModal({
  open,
  onClose,
}) {
  const navigate = useNavigate()

  const goToLogin = () => {
    onClose()

    navigate('/login', {
      state: {
        from: '/patient/book',
        bookingIntent: true,
      },
    })
  }

  const goToRegister = () => {
    onClose()

    navigate('/register', {
      state: {
        from: '/patient/book',
        bookingIntent: true,
      },
    })
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.2,
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/30 px-4 backdrop-blur-[3px]"
          onMouseDown={onClose}
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.94,
              y: 18,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.96,
              y: 10,
            }}
            transition={{
              duration: 0.32,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            onMouseDown={(event) =>
              event.stopPropagation()
            }
            className="relative w-full max-w-[460px] overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.18)]"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Pencereyi kapat"
              className="absolute right-5 top-5 z-20 grid size-9 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={18} />
            </button>

            <div className="relative overflow-hidden bg-[#5B52F2] px-7 pb-8 pt-9 text-white sm:px-9">
              <div
                aria-hidden="true"
                className="absolute -right-20 -top-24 size-60 rounded-full border border-white/10"
              />

              <div
                aria-hidden="true"
                className="absolute -left-16 bottom-[-100px] size-52 rounded-full border border-white/10"
              />

              <motion.div
                initial={{
                  scale: 0.8,
                  opacity: 0,
                  rotate: -8,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  rotate: 0,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 220,
                  damping: 18,
                  delay: 0.08,
                }}
                className="relative z-10 flex size-12 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/15"
              >
                <LockKeyhole
                  size={22}
                />
              </motion.div>

              <div className="relative z-10 mt-6">
                <p className="text-xs font-bold tracking-[0.14em] text-white/65">
                  GÜVENLİ RANDEVU
                </p>

                <h2 className="mt-2 text-[30px] font-semibold leading-[1.08] tracking-[-0.045em]">
                  Randevu almak için
                  giriş yapın.
                </h2>

                <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">
                  Randevu oluşturmak için
                  güvenli DentFlow hesabınıza
                  giriş yapmanız gerekir.
                </p>
              </div>
            </div>

            <div className="p-7 sm:p-9">
              <motion.button
                whileHover={{
                  y: -1,
                }}
                whileTap={{
                  scale: 0.985,
                }}
                type="button"
                onClick={goToLogin}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#5B52F2] px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(91,82,242,0.22)] transition hover:bg-[#4d45db]"
              >
                Giriş Yap
                <ArrowRight
                  size={17}
                />
              </motion.button>

              <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-slate-100" />

                <span className="text-xs font-medium text-slate-400">
                  veya
                </span>

                <span className="h-px flex-1 bg-slate-100" />
              </div>

              <button
                type="button"
                onClick={goToRegister}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50/40 hover:text-[#5B52F2]"
              >
                <UserPlus
                  size={17}
                />

                Hasta Hesabı Oluştur
              </button>

              <p className="mt-6 text-center text-xs leading-5 text-slate-400">
                Hesabınız varsa yeniden kayıt
                oluşturmanıza gerek yoktur.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
