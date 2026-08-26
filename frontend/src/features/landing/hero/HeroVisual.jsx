import { useEffect, useState } from 'react'
import {
  BellRing,
  CreditCard,
  HeartPulse,
  LayoutDashboard,
  ReceiptText,
  Stethoscope,
  UserRoundCheck,
} from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

const flowNodes = [
  {
    id: 'reception',
    label: 'RESEPSİYON',
    icon: UserRoundCheck,
    position: 'left-[8%] top-[17%]',
  },
  {
    id: 'exam',
    label: 'MUAYENE',
    icon: Stethoscope,
    position: 'left-[39%] top-[17%]',
  },
  {
    id: 'treatment',
    label: 'TEDAVİ',
    icon: HeartPulse,
    position: 'right-[6%] top-[38%]',
  },
  {
    id: 'invoice',
    label: 'FATURA',
    icon: ReceiptText,
    position: 'left-[39%] bottom-[14%]',
  },
  {
    id: 'followup',
    label: 'TAKİP',
    icon: BellRing,
    position: 'left-[8%] bottom-[14%]',
  },
]

const segments = [
  'M110 98 L245 98',

  'M245 98 C350 98 430 120 472 178',

  'M472 178 C430 232 350 270 245 270',

  'M245 270 L110 270',
]

function HeroVisual() {
  const [activeIndex, setActiveIndex] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (activeIndex !== flowNodes.length - 1) {
      return undefined
    }

    const timeout = setTimeout(() => {
      setActiveIndex(0)
    }, 1400)

    return () => clearTimeout(timeout)
  }, [activeIndex])

  const activeNode = flowNodes[activeIndex]

return (
  <div className="relative mx-auto w-full max-w-[570px]">
    <div className="pointer-events-none absolute inset-0 translate-y-8 rounded-[42px] bg-[#655CF6]/10 blur-[70px]" />

    <div
      className="
        relative overflow-hidden
        rounded-[34px]
        border border-[#E7E8F5]
        bg-white
        p-5
        shadow-[0_30px_80px_rgba(58,67,110,0.12)]
        sm:p-6
      "
    >

        {/* Header */}
        <div className="flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-[#F0EEFF]">
              <LayoutDashboard className="size-5 text-[#5B56F5]" />
            </div>

            <div>
              <p className="text-[14px] font-bold text-[#151B2D]">
                DentFlow OS
              </p>

              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9AA4B8]">
                Canlı Hasta Yolculuğu
              </p>
            </div>
          </div>

          <div
            className="
              inline-flex items-center gap-2
              rounded-full border border-[#CDEAD8]
              bg-[#EEFBF3]
              px-4 py-2
              text-[10px] font-semibold
              uppercase tracking-[0.12em]
              text-[#248A53]
            "
          >
            <span className="size-2 rounded-full bg-[#35C878]" />
            Canlı
          </div>

        </div>

        {/* Workflow */}
        <div
          className="
            relative mt-6 h-[360px]
            overflow-hidden
            rounded-[26px]
            border border-[#E6E9F2]
            bg-[#FBFCFF]
          "
        >

          {/* dotted background */}
          <div
            className="
              absolute inset-0 opacity-70
              [background-image:radial-gradient(#D9DFEC_1px,transparent_1px)]
              [background-size:18px_18px]
            "
          />

          {/* Lines */}
          <svg
            viewBox="0 0 560 360"
            className="pointer-events-none absolute inset-0 size-full"
            aria-hidden="true"
          >

            {segments.map((segment, index) => {
              const completed = index < activeIndex
              const animating = index === activeIndex

              return (
                <g key={segment}>

                  {/* gray base */}
                  <path
                    d={segment}
                    fill="none"
                    stroke="#D8DCF4"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />

                  {/* already completed */}
                  {completed && (
                    <path
                      d={segment}
                      fill="none"
                      stroke="#5B56F5"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  )}

                  {/* currently moving */}
                  {animating &&
                    index < segments.length && (
                      <motion.path
                        key={`segment-${activeIndex}`}
                        d={segment}
                        fill="none"
                        stroke="#5B56F5"
                        strokeWidth="5"
                        strokeLinecap="round"
                        initial={{
                          pathLength: reduceMotion ? 1 : 0,
                        }}
                        animate={{
                          pathLength: 1,
                        }}
                        transition={{
                          duration: reduceMotion ? 0 : 1.1,
                          ease: 'easeInOut',
                        }}
                        onAnimationComplete={() => {
                          if (
                            activeIndex <
                            flowNodes.length - 1
                          ) {
                            setActiveIndex(
                              (current) => current + 1,
                            )
                          }
                        }}
                      />
                    )}

                </g>
              )
            })}

          </svg>

          {/* Nodes */}
          {flowNodes.map((node, index) => {
            const Icon = node.icon
            const active = index === activeIndex
            const completed = index < activeIndex

            return (
              <div
                key={node.id}
                className={`
                  absolute z-10
                  ${node.position}
                `}
              >

                <motion.div
                  animate={{
                    scale: active ? 1.08 : 1,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  className={`
                    relative mx-auto flex
                    size-14 items-center justify-center
                    rounded-full border
                    transition-colors duration-300

                    ${
                      active
                        ? `
                          border-[#5B56F5]
                          bg-[#5B56F5]
                          text-white
                          shadow-[0_0_0_6px_rgba(91,86,245,0.10),0_10px_28px_rgba(91,86,245,0.24)]
                        `
                        : completed
                          ? `
                            border-[#A9A6FF]
                            bg-[#EEEDFF]
                            text-[#5B56F5]
                          `
                          : `
                            border-[#DEE3EC]
                            bg-white
                            text-[#68758A]
                          `
                    }
                  `}
                >
                  <Icon className="size-5" />
                </motion.div>

                <span
                  className={`
                    mt-2 block rounded-md
                    bg-white px-3 py-1
                    text-center text-[9px]
                    font-bold tracking-[0.11em]
                    shadow-sm

                    ${
                      active
                        ? 'text-[#5B56F5]'
                        : 'text-[#657087]'
                    }
                  `}
                >
                  {node.label}
                </span>

              </div>
            )
          })}

          {/* Active state */}
          <div
            className="
              absolute bottom-5 right-5
              rounded-xl
              border border-[#E7E9F2]
              bg-white/95 px-4 py-3
              shadow-sm
            "
          >
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#A0A8B8]">
              Aktif işlem
            </p>

            <motion.p
              key={activeNode.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-xs font-semibold text-[#1B2234]"
            >
              {activeNode.label}
            </motion.p>

            <p className="mt-1 text-[10px] text-[#7D879A]">
              Merve Yılmaz · Elif Kaya
            </p>
          </div>

        </div>

        {/* KPI */}
        <div
          className="
            mt-5 flex items-center
            justify-between gap-5
            rounded-[22px]
            border border-[#ECEAFB]
            bg-[#FCFBFF]
            px-5 py-5
          "
        >

          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#9BA4B7]">
              Bugünkü Hasta Akışı
            </p>

            <p className="mt-2 text-[24px] font-bold tracking-[-0.04em] text-[#171D30]">
              18
              <span className="ml-2 text-[#5B56F5]">
                randevu
              </span>
            </p>
          </div>

          <div
            className="
              flex size-12 items-center
              justify-center rounded-full
              border border-[#E6E2FF]
              bg-white text-[#5B56F5]
            "
          >
            <CreditCard className="size-5" />
          </div>
        </div>

      </div>
    </div>
  )
}

export default HeroVisual