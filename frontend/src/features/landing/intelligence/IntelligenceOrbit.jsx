import { useState } from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'motion/react'
import {
  Bot,
  Check,
} from 'lucide-react'

import Container from '../../../components/ui/Container.jsx'
import { intelligenceActions } from './intelligenceData.js'

const positions = [
  'left-1/2 top-0 -translate-x-1/2',
  'right-0 top-[28%]',
  'right-[8%] bottom-[8%]',
  'left-[8%] bottom-[8%]',
  'left-0 top-[28%]',
]

function IntelligenceOrbit() {
  const [activeId, setActiveId] = useState('appointment')
  const reduceMotion = useReducedMotion()

  const activeAction = intelligenceActions.find(
    (action) => action.id === activeId,
  )

  return (
    <section className="relative overflow-hidden border-y border-df-border bg-df-bg">
      <Container className="py-24 lg:py-32">

        {/* Intro */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3 text-xs text-df-text-muted">
              <span className="font-semibold text-df-cyan">
                04
              </span>

              <span className="h-px w-10 bg-df-border" />

              DentFlow Intelligence
            </div>

            <h2 className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-df-text sm:text-5xl lg:text-6xl">
              Tek bir yapay zekâ değil.
              <span className="block text-df-text-secondary">
                Kliniğin arkasındaki akıllı katman.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-base leading-7 text-df-text-secondary">
            Randevu, hatırlatma, faturalandırma ve klinik analizi aynı
            otomasyon katmanı üzerinden birbirine bağlanır.
          </p>
        </div>

        {/* Orbit */}
        <div className="mt-20 grid gap-14 lg:grid-cols-[1fr_360px] lg:items-center">

          <div className="relative mx-auto aspect-square w-full max-w-[720px]">

            {/* Outer rings */}
            <div className="absolute inset-[8%] rounded-full border border-df-border" />

            <div className="absolute inset-[22%] rounded-full border border-df-border/70" />

            {/* Fine orbit */}
            <svg
              viewBox="0 0 600 600"
              className="pointer-events-none absolute inset-0 size-full"
              aria-hidden="true"
            >
              <circle
                cx="300"
                cy="300"
                r="245"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="3 12"
                className="text-df-border"
              />

              <line
                x1="300"
                y1="300"
                x2="300"
                y2="55"
                stroke="currentColor"
                className="text-df-border"
              />

              <line
                x1="300"
                y1="300"
                x2="540"
                y2="220"
                stroke="currentColor"
                className="text-df-border"
              />

              <line
                x1="300"
                y1="300"
                x2="460"
                y2="510"
                stroke="currentColor"
                className="text-df-border"
              />

              <line
                x1="300"
                y1="300"
                x2="140"
                y2="510"
                stroke="currentColor"
                className="text-df-border"
              />

              <line
                x1="300"
                y1="300"
                x2="60"
                y2="220"
                stroke="currentColor"
                className="text-df-border"
              />
            </svg>

            {/* Central intelligence core */}
            <div className="absolute left-1/2 top-1/2 flex size-[46%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-df-border bg-[#081522]">

              <div className="px-8 text-center">

                <div className="mx-auto flex size-11 items-center justify-center rounded-full border border-df-border bg-df-surface">
                  <Bot className="size-5 text-df-cyan" />
                </div>

                <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.24em] text-df-cyan">
                  {activeAction.eyebrow}
                </p>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeAction.id}
                    initial={
                      reduceMotion
                        ? false
                        : { opacity: 0, y: 8 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={
                      reduceMotion
                        ? undefined
                        : { opacity: 0, y: -6 }
                    }
                    transition={{ duration: 0.22 }}
                  >
                    <h3 className="mt-3 font-display text-2xl font-medium tracking-[-0.04em] text-df-text lg:text-3xl">
                      {activeAction.label}
                    </h3>

                    <p className="mt-4 text-xs leading-5 text-df-text-secondary sm:text-sm">
                      {activeAction.result}
                    </p>
                  </motion.div>
                </AnimatePresence>

              </div>
            </div>

            {/* Orbit actions */}
            {intelligenceActions.map((action, index) => {
              const isActive = action.id === activeId

              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => setActiveId(action.id)}
                  onFocus={() => setActiveId(action.id)}
                  className={`
                    absolute z-20
                    ${positions[index]}
                    min-w-24
                    text-center
                  `}
                >
                  <span
                    className={`
                      mx-auto flex size-11 items-center justify-center
                      rounded-full border
                      transition-colors duration-200
                      ${
                        isActive
                          ? 'border-df-cyan bg-df-cyan text-df-bg'
                          : 'border-df-border bg-df-bg text-df-text-secondary hover:border-df-cyan/50 hover:text-df-text'
                      }
                    `}
                  >
                    <span className="size-1.5 rounded-full bg-current" />
                  </span>

                  <span
                    className={`
                      mt-3 block text-[11px] font-medium
                      ${
                        isActive
                          ? 'text-df-text'
                          : 'text-df-text-muted'
                      }
                    `}
                  >
                    {action.shortLabel}
                  </span>
                </button>
              )
            })}

          </div>

          {/* Event stream */}
          <aside className="lg:border-l lg:border-df-border lg:pl-8">

            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-df-cyan">
              Aktif işlem
            </p>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeAction.id}
                initial={
                  reduceMotion
                    ? false
                    : { opacity: 0, x: 8 }
                }
                animate={{ opacity: 1, x: 0 }}
                exit={
                  reduceMotion
                    ? undefined
                    : { opacity: 0, x: -8 }
                }
                transition={{ duration: 0.22 }}
              >

                <h3 className="mt-4 font-display text-3xl font-medium tracking-[-0.04em] text-df-text">
                  {activeAction.result}
                </h3>

                <p className="mt-4 text-sm leading-6 text-df-text-secondary">
                  {activeAction.detail}
                </p>

                <div className="mt-8 space-y-5">
                  {activeAction.telemetry.map((item, index) => (
                    <div
                      key={item}
                      className="grid grid-cols-[24px_1fr] gap-3"
                    >
                      <div className="relative flex justify-center">

                        {index !== activeAction.telemetry.length - 1 && (
                          <span className="absolute bottom-[-20px] top-5 w-px bg-df-border" />
                        )}

                        <span className="relative z-10 flex size-5 items-center justify-center border border-df-border bg-df-bg">
                          <Check className="size-3 text-success" />
                        </span>
                      </div>

                      <div>
                        <p className="text-sm text-df-text-secondary">
                          {item}
                        </p>

                        <p className="mt-1 text-[10px] text-df-text-muted">
                          İşlem 0{index + 1}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

              </motion.div>
            </AnimatePresence>

          </aside>
        </div>

      </Container>
    </section>
  )
}

export default IntelligenceOrbit