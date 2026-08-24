import {
  BellRing,
  CalendarCheck2,
  CreditCard,
  SearchCheck,
} from 'lucide-react'
import { motion } from 'motion/react'

const items = [
  {
    icon: CalendarCheck2,
    title: 'Kolay Randevu',
    subtitle: 'HIZLI · KOLAY · ONLINE',
  },
  {
    icon: CreditCard,
    title: 'Hızlı & Güvenli Ödeme',
    subtitle: 'FATURA · ÖDEME · GÜVENLİ',
  },
  {
    icon: SearchCheck,
    title: 'Kolay Takip',
    subtitle: 'RANDEVU · FATURA · DURUM',
  },
  {
    icon: BellRing,
    title: 'Akıllı Hatırlatma',
    subtitle: 'ZAMANINDA · OTOMATİK · KOLAY',
  },
]

function ClinicStatsStrip() {
  return (
    <section
      className="
        overflow-hidden
        bg-gradient-to-r
        from-[#222E66]
        via-[#293C7B]
        to-[#28488B]
      "
    >
      <div className="mx-auto max-w-[1440px] px-5 lg:px-8">
        <div className="grid min-h-[205px] grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

          {items.map((item, index) => {
            const Icon = item.icon

            return (
              <motion.div
                key={item.title}
                initial={{
                  opacity: 0,
                  y: 16,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.4,
                }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.06,
                }}
                className="
                  flex items-center
                  justify-center
                  px-3 py-5
                "
              >
                <div
                  className="
                    group
                    flex min-h-[176px]
                    w-full max-w-[320px]
                    cursor-default
                    flex-col
                    items-center
                    justify-center
                    rounded-[999px]
                    px-7
                    text-center

                    transition-all
                    duration-500
                    ease-[cubic-bezier(0.22,1,0.36,1)]

                    hover:bg-white/[0.105]
                    hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.025)]
                  "
                >
                  {/* Icon */}
                  <div
                    className="
                      flex size-14
                      items-center justify-center
                      rounded-[18px]

                      bg-gradient-to-br
                      from-[#6674FF]
                      to-[#4D63EA]

                      text-white

                      shadow-[0_10px_28px_rgba(43,55,145,0.28)]

                      transition-all
                      duration-500
                      ease-[cubic-bezier(0.22,1,0.36,1)]

                      group-hover:-rotate-6
                      group-hover:scale-110
                      group-hover:shadow-[0_14px_34px_rgba(43,55,145,0.36)]
                    "
                  >
                    <Icon className="size-6" />
                  </div>

                  {/* Title */}
                  <h3
                    className="
                      mt-4
                      font-display
                      text-[20px]
                      font-bold
                      tracking-[-0.03em]
                      text-white

                      transition-colors
                      duration-300

                      group-hover:text-[#AEB5FF]
                    "
                  >
                    {item.title}
                  </h3>

                  {/* Subtitle */}
                  <p
                    className="
                      mt-2
                      max-w-[265px]
                      text-[9px]
                      font-semibold
                      uppercase
                      leading-4
                      tracking-[0.14em]
                      text-white/55

                      transition-colors
                      duration-300

                      group-hover:text-white/70
                    "
                  >
                    {item.subtitle}
                  </p>
                </div>
              </motion.div>
            )
          })}

        </div>
      </div>
    </section>
  )
}

export default ClinicStatsStrip