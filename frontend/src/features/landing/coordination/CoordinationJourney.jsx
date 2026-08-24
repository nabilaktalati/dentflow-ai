import { useState } from 'react'
import { motion } from 'motion/react'
import {
  ArrowDownRight,
  Check,
} from 'lucide-react'

import Container from '../../../components/ui/Container.jsx'
import {
  handoffSteps,
  patientCase,
} from './coordinationData.js'

function CoordinationJourney() {
  const [activeStep, setActiveStep] = useState(1)

  const currentStep = handoffSteps[activeStep]

  return (
    <section className="relative border-y border-df-border bg-[#091725] text-df-text">
      <Container className="py-24 lg:py-32">

        {/* Intro */}
        <div className="grid gap-10 lg:grid-cols-[1fr_440px] lg:items-end">
          <div>
            <div className="flex items-center gap-3 text-xs text-df-text-secondary">
              <span className="font-semibold text-df-cyan">
                03
              </span>

              <span className="h-px w-10 bg-df-border" />

              Klinik koordinasyonu
            </div>

            <h2 className="mt-6 max-w-4xl font-display text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Bir hasta.

              <span className="block text-df-text-muted">
                Beş ekip dokunuşu.
              </span>

              <span className="block">
                Tek kayıt.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-base leading-7 text-df-text-secondary lg:justify-self-end">
            Hasta bilgisi ekipler arasında yeniden oluşturulmaz.
            Aynı klinik kayıt, doğru kişiye doğru anda aktarılır.
          </p>
        </div>

        {/* Handoff */}
        <div className="mt-20 grid border-y border-df-border lg:grid-cols-[320px_1fr]">

          {/* Patient rail */}
          <aside className="border-b border-df-border py-8 lg:border-b-0 lg:border-r lg:py-10 lg:pr-10">
            <div className="sticky top-32">

              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-df-cyan">
                Aktif hasta
              </p>

              <h3 className="mt-5 font-display text-3xl font-semibold tracking-[-0.04em] text-df-text">
                {patientCase.name}
              </h3>

              <p className="mt-1 text-sm text-df-text-secondary">
                {patientCase.age}
              </p>

              <dl className="mt-10 space-y-6">

                <div>
                  <dt className="text-[9px] uppercase tracking-[0.18em] text-df-text-muted">
                    Randevu
                  </dt>

                  <dd className="mt-2 text-sm font-medium text-df-text">
                    {patientCase.appointment}
                  </dd>
                </div>

                <div>
                  <dt className="text-[9px] uppercase tracking-[0.18em] text-df-text-muted">
                    Hizmet
                  </dt>

                  <dd className="mt-2 text-sm font-medium text-df-text">
                    {patientCase.service}
                  </dd>
                </div>

                <div>
                  <dt className="text-[9px] uppercase tracking-[0.18em] text-df-text-muted">
                    Doktor
                  </dt>

                  <dd className="mt-2 text-sm font-medium text-df-text">
                    {patientCase.doctor}
                  </dd>
                </div>

              </dl>

              <div className="mt-12 flex items-center gap-2 text-xs text-df-text-secondary">
                <span className="flex size-5 items-center justify-center border border-df-border">
                  <Check className="size-3 text-success" />
                </span>

                Tek hasta kaydı
              </div>
            </div>
          </aside>

          {/* Handoff stream */}
          <div className="relative">

            <div className="absolute bottom-0 left-[27px] top-0 w-px bg-df-border sm:left-[35px]" />

            {handoffSteps.map((step, index) => {
              const isActive = activeStep === index
              const isCompleted = index < activeStep

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStep(index)}
                  onMouseEnter={() => setActiveStep(index)}
                  onFocus={() => setActiveStep(index)}
                  className={`
                    group relative grid w-full
                    grid-cols-[56px_1fr]
                    border-b border-df-border
                    text-left last:border-b-0
                    transition-colors
                    sm:grid-cols-[72px_1fr]
                    ${
                      isActive
                        ? 'bg-df-surface'
                        : 'hover:bg-df-surface/50'
                    }
                  `}
                >

                  {/* Number */}
                  <div className="relative flex justify-center py-8">

                    <span
                      className={`
                        relative z-10 flex size-6
                        items-center justify-center
                        border bg-[#091725]
                        text-[9px] font-semibold
                        ${
                          isActive
                            ? 'border-df-cyan text-df-cyan'
                            : isCompleted
                              ? 'border-success text-success'
                              : 'border-df-border text-df-text-muted'
                        }
                      `}
                    >
                      {step.id}
                    </span>

                    {isActive && (
                      <motion.span
                        layoutId="handoff-active"
                        className="absolute inset-y-0 right-0 w-px bg-df-cyan"
                      />
                    )}

                  </div>

                  {/* Content */}
                  <div className="grid gap-6 py-8 pr-5 sm:grid-cols-[170px_1fr_80px] sm:items-start sm:pr-8">

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-df-text-muted">
                        {step.role}
                      </p>

                      <p
                        className={`
                          mt-2 font-display text-xl
                          font-medium tracking-[-0.03em]
                          ${
                            isActive
                              ? 'text-df-text'
                              : 'text-df-text-secondary'
                          }
                        `}
                      >
                        {step.title}
                      </p>
                    </div>

                    <div>
                      <p
                        className={`
                          text-sm font-medium
                          ${
                            isActive
                              ? 'text-df-cyan'
                              : 'text-df-text-secondary'
                          }
                        `}
                      >
                        {step.status}
                      </p>

                      <p className="mt-3 max-w-xl text-sm leading-6 text-df-text-secondary">
                        {step.detail}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-df-text-muted sm:justify-end">
                      {step.time}

                      <ArrowDownRight className="size-3.5" />
                    </div>

                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-5 border-b border-df-border py-6 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-success" />

            <span className="text-sm font-medium text-df-text">
              {currentStep.status}
            </span>
          </div>

          <p className="max-w-xl text-sm text-df-text-secondary">
            DentFlow, hasta durumunu ekipler arasında aynı kayıt üzerinden
            senkronize eder.
          </p>

        </div>

      </Container>
    </section>
  )
}

export default CoordinationJourney