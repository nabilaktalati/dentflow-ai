import {
  ArrowUpRight,
  Check,
  CircleDot,
} from 'lucide-react'

import { motion } from 'motion/react'
import { Link } from 'react-router'

const statusItems = [
  {
    id: '01',
    label: 'Hazır',
  },
  {
    id: '02',
    label: 'Kurulum',
  },
  {
    id: '03',
    label: 'Aktif',
  },
]

function FinalCTA() {
  return (
    <section
      className="
        relative overflow-hidden
        bg-[#F8FAFD]
        text-[#111827]
      "
    >
      <div
        className="
          mx-auto min-h-[570px]
          max-w-[1380px]
          px-6 py-20
          lg:px-8 lg:py-24
        "
      >
        <div className="relative min-h-[410px]">

          {/* TOP LEFT */}
          <motion.div
            initial={{
              opacity: 0,
              y: 24,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.5,
            }}
            transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="max-w-[720px]"
          >
            <div className="flex items-center gap-4">
              <span className="h-px w-14 bg-[#9CAEFF]" />

              <span
                className="
                  text-[10px]
                  font-bold uppercase
                  tracking-[0.2em]
                  text-[#5965E8]
                "
              >
                DENTFLOW İLE BAŞLAYIN
              </span>
            </div>

            <h2
              className="
                mt-8
                font-display
                text-[clamp(3rem,5.5vw,5.7rem)]
                font-semibold
                leading-[0.94]
                tracking-[-0.06em]
                text-[#111827]
              "
            >
              Kliniğinizin dijital akışı

              <span className="block text-[#5956F5]">
                burada başlasın.
              </span>
            </h2>

            <p
              className="
                mt-7 max-w-[620px]
                text-[16px]
                leading-7
                text-[#718096]
              "
            >
              DentFlow&apos;u keşfedin ve kliniğiniz için daha
              düzenli, daha akıcı ve daha anlaşılır bir dijital
              çalışma deneyimine geçin.
            </p>
          </motion.div>

          {/* BOTTOM RIGHT */}
          <motion.div
            initial={{
              opacity: 0,
              x: 35,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.35,
            }}
            transition={{
              duration: 0.65,
              delay: 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              mt-16
              lg:absolute
              lg:bottom-0
              lg:right-0
              lg:mt-0
              lg:w-[560px]
            "
          >
            <div
              className="
                border-t border-[#DDE3ED]
                pt-6
              "
            >

              {/* System state */}
              <div className="flex items-center justify-between gap-6">
                <div>
                  <p
                    className="
                      text-[9px]
                      font-bold uppercase
                      tracking-[0.18em]
                      text-[#98A2B3]
                    "
                  >
                    DENTFLOW OS
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="size-2 rounded-full bg-[#32C878]" />

                    <span
                      className="
                        text-[12px]
                        font-medium
                        text-[#475467]
                      "
                    >
                      Sistem hazır
                    </span>
                  </div>
                </div>

                <CircleDot className="size-5 text-[#6974F8]" />
              </div>

              {/* Animated status */}
              <div
                className="
                  mt-8 grid grid-cols-3
                  border-y border-[#E4E7EC]
                "
              >
                {statusItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{
                      opacity: 0.45,
                    }}
                    whileInView={{
                      opacity: [0.45, 1, 0.45],
                    }}
                    viewport={{
                      once: false,
                    }}
                    transition={{
                      duration: 2.4,
                      delay: index * 0.55,
                      repeat: Infinity,
                      repeatDelay: 0.6,
                    }}
                    className={`
                      relative py-5

                      ${
                        index !== statusItems.length - 1
                          ? 'border-r border-[#E4E7EC]'
                          : ''
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 px-5">

                      <span
                        className="
                          flex size-7
                          items-center justify-center
                          rounded-full
                          border border-[#D8DDEA]
                          bg-white
                          text-[#667085]
                        "
                      >
                        {index === 2 ? (
                          <Check className="size-3.5 text-[#5956F5]" />
                        ) : (
                          <span
                            className="
                              size-1.5
                              rounded-full
                              bg-[#8795FF]
                            "
                          />
                        )}
                      </span>

                      <div>
                        <span
                          className="
                            block text-[9px]
                            font-medium
                            text-[#A0A8B8]
                          "
                        >
                          {item.id}
                        </span>

                        <span
                          className="
                            mt-1 block
                            text-[12px]
                            font-medium
                            text-[#475467]
                          "
                        >
                          {item.label}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <div
                className="
                  mt-8
                  flex flex-wrap
                  items-center
                  justify-between
                  gap-5
                "
              >
                <p
                  className="
                    max-w-[260px]
                    text-[13px]
                    leading-6
                    text-[#7B8798]
                  "
                >
                  Kliniğiniz için DentFlow deneyimini başlatın.
                </p>

                <Link
                  to="/register"
                  className="
                    group
                    inline-flex h-13
                    items-center gap-3
                    rounded-[16px]
                    bg-[#5B57F5]
                    px-6
                    text-sm font-semibold
                    text-white
                    shadow-[0_14px_34px_rgba(91,87,245,0.22)]
                    transition-all duration-300

                    hover:-translate-y-0.5
                    hover:bg-[#6965FF]
                    hover:shadow-[0_18px_40px_rgba(91,87,245,0.28)]
                  "
                >
                  DentFlow&apos;u Keşfet

                  <ArrowUpRight
                    className="
                      size-4
                      transition-transform
                      duration-300
                      group-hover:translate-x-0.5
                      group-hover:-translate-y-0.5
                    "
                  />
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default FinalCTA