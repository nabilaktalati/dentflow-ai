import { useState } from 'react'
import {
    AnimatePresence,
    motion,
    useReducedMotion,
} from 'motion/react'
import {
    ArrowDownRight,
    ArrowUpRight,
} from 'lucide-react'

import Container from '../../../components/ui/Container.jsx'
import Button from '../../../components/ui/Button.jsx'
import { patientFlow } from './heroData.js'

function Hero() {
    const [activeStep, setActiveStep] = useState(0)
    const reduceMotion = useReducedMotion()

    const currentStep = patientFlow[activeStep]

    const entrance = reduceMotion
        ? {}
        : {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
        }

    return (
        <section className="relative overflow-hidden bg-df-bg">
            <Container className="relative flex min-h-[100svh] flex-col pb-10 pt-36 lg:pb-8 lg:pt-40">

                {/* Hero meta */}
                <motion.div
                    {...entrance}
                    transition={{ duration: 0.45 }}
                    className="flex items-center justify-between border-b border-df-border pb-5"
                >
                    <div className="flex items-center gap-3 text-xs text-df-text-muted">
                        <span className="size-1.5 rounded-full bg-df-cyan" />

                        Klinik yönetim sistemi
                    </div>

                    <div className="hidden items-center gap-2 text-xs text-df-text-muted sm:flex">
                        Hasta yolculuğu
                        <ArrowDownRight className="size-3.5" />
                    </div>
                </motion.div>

                {/* Main statement */}
                <div className="flex flex-1 flex-col justify-center py-10 lg:py-8">

                    <motion.p
                        {...entrance}
                        transition={{
                            duration: 0.45,
                            delay: reduceMotion ? 0 : 0.08,
                        }}
                        className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-df-cyan"
                    >
                        DentFlow AI
                    </motion.p>

                    <h1 className="max-w-[1200px] font-display text-[clamp(3rem,6.3vw,7.2rem)] font-semibold leading-[0.94] tracking-[-0.06em] text-df-text">
                        <motion.span
                            {...entrance}
                            transition={{
                                duration: 0.6,
                                delay: reduceMotion ? 0 : 0.12,
                            }}
                            className="block"
                        >
                            Kliniğiniz sadece
                        </motion.span>

                        <motion.span
                            {...entrance}
                            transition={{
                                duration: 0.6,
                                delay: reduceMotion ? 0 : 0.18,
                            }}
                            className="block text-df-text-secondary"
                        >
                            çalışmasın.
                        </motion.span>

                        <motion.span
                            {...entrance}
                            transition={{
                                duration: 0.6,
                                delay: reduceMotion ? 0 : 0.24,
                            }}
                            className="block"
                        >
                            Akıllı bir sistem gibi
                            <span className="text-df-cyan">
                                {' '}aksın.
                            </span>
                        </motion.span>

                    </h1>

                    <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[1fr_430px] lg:items-end">

                        <motion.div
                            {...entrance}
                            transition={{
                                duration: 0.5,
                                delay: reduceMotion ? 0 : 0.3,
                            }}
                            className="flex flex-wrap gap-3"
                        >
                            <Button
                                to="/register"
                                size="lg"
                            >
                                Randevu Al
                                <ArrowUpRight className="size-4" />
                            </Button>

                            <Button
                                to="/services"
                                variant="secondary"
                                size="lg"
                            >
                                Sistemi Keşfet
                            </Button>
                        </motion.div>

                        <motion.p
                            {...entrance}
                            transition={{
                                duration: 0.5,
                                delay: reduceMotion ? 0 : 0.34,
                            }}
                            className="max-w-md text-base leading-7 text-df-text-secondary lg:justify-self-end"
                        >
                            Randevudan tedaviye, faturadan otomatik takibe kadar
                            kliniğinizdeki tüm hasta sürecini tek bir akış içinde yönetin.
                        </motion.p>

                    </div>

                    {/* Dynamic workflow readout */}
                    <div className="mt-8 flex justify-start lg:justify-end">

                       <div
  className="w-full border-l border-df-cyan pl-5 sm:max-w-xl lg:max-w-[520px]"
  aria-live="polite"
  aria-atomic="true"
>

                            <div className="mb-3 flex items-center justify-between gap-4">
                                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-df-cyan">
                                    Aktif Akış / {currentStep.id}
                                </span>

                                <span className="text-[11px] text-df-text-muted">
                                    {currentStep.status}
                                </span>
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep.id}
                                    initial={
                                        reduceMotion
                                            ? false
                                            : { opacity: 0, y: 8 }
                                    }
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    exit={
                                        reduceMotion
                                            ? undefined
                                            : { opacity: 0, y: -6 }
                                    }
                                    transition={{ duration: 0.22 }}
                                >
                                    <div className="font-display text-xl font-medium tracking-[-0.03em] text-df-text">
                                        {currentStep.label}
                                    </div>
                                    <div className="mt-3 inline-flex items-center gap-2 text-xs text-df-text-secondary">
                                        <span className="size-1.5 rounded-full bg-success" />
                                        {currentStep.signal}
                                    </div>
                                    <p className="mt-2 max-w-lg text-sm leading-6 text-df-text-secondary">
                                        {currentStep.detail}
                                    </p>
                                </motion.div>
                            </AnimatePresence>

                        </div>

                    </div>
                </div>

                {/* Patient Flow Theatre */}
                <div className="relative border-t border-df-border">

                    <div className="grid lg:grid-cols-5">
                        {patientFlow.map((step, index) => {
                            const isActive = activeStep === index

                            return (
                                <motion.button
                                    key={step.id}
                                    type="button"
                                    aria-pressed={isActive}
                                    onMouseEnter={() => setActiveStep(index)}
                                    onFocus={() => setActiveStep(index)}
                                    onClick={() => setActiveStep(index)}
                                    initial={
                                        reduceMotion
                                            ? false
                                            : { opacity: 0, y: 12 }
                                    }
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    transition={{
                                        duration: 0.35,
                                        delay: reduceMotion ? 0 : 0.05 * index,
                                    }}
                                    className={`
                    group relative min-h-20
                    border-b border-df-border
                    px-0 py-5 text-left
                    transition-colors duration-200
                    lg:min-h-32 lg:border-b-0 lg:px-5
                    ${index !== 0 ? 'lg:border-l' : ''}
                  `}
                                >
                                    {isActive && (
                                        <motion.span
                                            layoutId="patient-flow-active"
                                            className="absolute inset-x-0 top-0 h-px bg-df-cyan"
                                            transition={{
                                                type: 'spring',
                                                stiffness: 420,
                                                damping: 35,
                                            }}
                                        />
                                    )}

                                    <div className="flex items-start justify-between lg:block">

                                        <span
                                            className={`
                        text-[10px] font-medium tracking-[0.18em]
                        transition-colors
                        ${isActive
                                                    ? 'text-df-cyan'
                                                    : 'text-df-text-muted'
                                                }
                      `}
                                        >
                                            {step.id}
                                        </span>

                                        <div className="lg:mt-8">
                                            <div
                                                className={`
                          font-display text-xl font-medium
                          tracking-[-0.03em]
                          transition-colors
                          ${isActive
                                                        ? 'text-df-text'
                                                        : 'text-df-text-secondary'
                                                    }
                        `}
                                            >
                                                {step.label}
                                            </div>

                                            <p className="mt-1 text-sm text-df-text-muted">
                                                {step.description}
                                            </p>
                                            <span
  className={`
    mt-4 inline-flex items-center gap-2
    text-[11px]
    transition-colors
    ${
      isActive
        ? 'text-df-text-secondary'
        : 'text-df-text-muted'
    }
  `}
>
  <span
    className={`
      size-1 rounded-full
      ${
        isActive
          ? 'bg-success'
          : 'bg-df-border'
      }
    `}
  />

  {step.signal}
</span>
                                        </div>

                                    </div>

                                    {index < patientFlow.length - 1 && (
                                        <span
                                            className={`
                        absolute -right-[3px] top-1/2
                        hidden size-1.5 -translate-y-1/2
                        rounded-full lg:block
                        ${isActive
                                                    ? 'bg-df-cyan'
                                                    : 'bg-df-border'
                                                }
                      `}
                                        />
                                    )}
                                </motion.button>
                            )
                        })}
                    </div>

                </div>

            </Container>
        </section>
    )
}

export default Hero