import {
  BellRing,
  BrainCircuit,
  CalendarCheck2,
  ChartNoAxesCombined,
  ShieldCheck,
  UserRoundCheck,
} from 'lucide-react'
import { motion } from 'motion/react'

const capabilities = [
  {
    icon: CalendarCheck2,
    title: 'Randevu Planlama',
    position: 'left-[2%] top-[15%] sm:left-[7%] sm:top-[14%]',
  },
  {
    icon: BellRing,
    title: 'Akıllı Hatırlatma',
    position: 'right-[1%] top-[18%] sm:right-[5%] sm:top-[17%]',
  },
  {
    icon: UserRoundCheck,
    title: 'Hasta Takibi',
    position: 'bottom-[14%] left-[2%] sm:bottom-[13%] sm:left-[8%]',
  },
  {
    icon: ChartNoAxesCombined,
    title: 'Klinik İçgörüleri',
    position: 'bottom-[12%] right-[1%] sm:bottom-[12%] sm:right-[4%]',
  },
]

function AiFeaturesPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFD]">
      <section className="relative overflow-hidden">
        {/* Background atmosphere */}
        <div className="pointer-events-none absolute right-[4%] top-[20%] size-[460px] rounded-full bg-[#5956F5]/[0.045] blur-[120px]" />

        <div className="mx-auto grid min-h-[calc(100svh-68px)] max-w-[1380px] items-center gap-16 px-6 py-20 lg:grid-cols-[0.92fr_1.08fr] lg:px-12 xl:px-16">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="relative z-10 max-w-[650px]"
          >
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#5956F5]" />

              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#5956F5]">
                DentFlow AI
              </span>
            </div>

            <h1 className="mt-7 font-heading text-[clamp(2.8rem,4.6vw,5rem)] font-semibold leading-[0.98] tracking-[-0.06em] text-[#111827]">
              Kliniğinizin günlük akışı,
              <span className="block text-[#5956F5]">
                akıllı destekle ilerlesin.
              </span>
            </h1>

            <p className="mt-7 max-w-[570px] text-[16px] leading-8 text-slate-500">
              DentFlow AI; randevu planlama, hasta takibi, hatırlatma
              süreçleri ve klinik verilerinin daha anlaşılır
              değerlendirilmesi için dijital destek sunar.
            </p>

            <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck
                size={15}
                strokeWidth={1.8}
                className="text-emerald-500"
              />

              <span>Tıbbi tanı veya tedavi önerisi sunmaz.</span>
            </div>
          </motion.div>

          {/* RIGHT VISUAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="relative mx-auto h-[520px] w-full max-w-[640px]"
          >
            {/* Orbits */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[470px] max-w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-[#5956F5]/10" />

            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[220px] w-[330px] max-w-[65%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-[#5956F5]/10" />

            {/* Flow lines */}
            <svg
              aria-hidden="true"
              viewBox="0 0 640 520"
              className="pointer-events-none absolute inset-0 h-full w-full"
              fill="none"
            >
              <path
                d="M138 130 C220 160 235 235 320 260"
                stroke="#5956F5"
                strokeOpacity="0.18"
                strokeWidth="1.5"
              />

              <path
                d="M502 140 C420 165 405 235 320 260"
                stroke="#5956F5"
                strokeOpacity="0.18"
                strokeWidth="1.5"
              />

              <path
                d="M145 390 C220 350 245 290 320 260"
                stroke="#5956F5"
                strokeOpacity="0.18"
                strokeWidth="1.5"
              />

              <path
                d="M500 390 C420 350 400 290 320 260"
                stroke="#5956F5"
                strokeOpacity="0.18"
                strokeWidth="1.5"
              />
            </svg>

            {/* Center */}
            <motion.div
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="absolute -inset-12 rounded-full bg-[#5956F5]/10 blur-3xl" />

              <div className="relative flex size-28 flex-col items-center justify-center rounded-full border border-[#5956F5]/20 bg-white shadow-[0_24px_70px_rgba(89,86,245,0.16)]">
                <BrainCircuit
                  size={26}
                  strokeWidth={1.7}
                  className="text-[#5956F5]"
                />

                <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5956F5]">
                  DentFlow AI
                </span>

                <span className="absolute -right-1 top-3 size-3 rounded-full border-[3px] border-white bg-emerald-500" />
              </div>
            </motion.div>

            {/* Capability nodes */}
            {capabilities.map(
              ({ icon: Icon, title, position }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: 0.15 + index * 0.08,
                  }}
                  className={`absolute ${position}`}
                >
                  <div className="flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/90 py-2.5 pl-2.5 pr-4 shadow-[0_10px_35px_rgba(15,23,42,0.07)] backdrop-blur-sm">
                    <div className="flex size-9 items-center justify-center rounded-full bg-[#5956F5]/10 text-[#5956F5]">
                      <Icon size={16} strokeWidth={1.8} />
                    </div>

                    <span className="whitespace-nowrap text-[12px] font-semibold text-[#344054]">
                      {title}
                    </span>
                  </div>
                </motion.div>
              ),
            )}

            {/* Activity points */}
            <div className="pointer-events-none absolute left-[28%] top-[35%] size-1.5 rounded-full bg-[#5956F5]/40" />
            <div className="pointer-events-none absolute right-[26%] top-[39%] size-1 rounded-full bg-[#5956F5]/30" />
            <div className="pointer-events-none absolute bottom-[31%] left-[33%] size-1 rounded-full bg-emerald-400/50" />
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default AiFeaturesPage