import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import {
    Check,
    Clock3,
    Sparkles,
} from 'lucide-react'

import Container from '../../../components/ui/Container.jsx'
import { bookingChecks, bookingFlow, timeSlots } from './appointmentData.js'

function AppointmentIntelligence() {
    const [selectedSlot, setSelectedSlot] = useState('14:30')
    const reduceMotion = useReducedMotion()
    const selectedSlotData = timeSlots.find(
        (slot) => slot.time === selectedSlot,
    )

    return (
        <section
            id="appointment-intelligence"
            className="relative border-t border-df-border bg-df-bg"
        >
            <Container className="py-24 lg:py-32">

                {/* Section introduction */}
                <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-end">
                    <div>
                        <div className="flex items-center gap-3 text-xs text-df-text-muted">
                            <span className="text-df-cyan">
                                01
                            </span>

                            <span className="h-px w-10 bg-df-border" />

                            Randevu zekâsı
                        </div>

                        <h2 className="mt-6 max-w-4xl font-display text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-df-text sm:text-5xl lg:text-7xl">
                            Uygun saati aramayın.
                            <span className="block text-df-text-secondary">
                                Sistem sizin için bulsun.
                            </span>
                        </h2>
                    </div>

                    <p className="max-w-md text-base leading-7 text-df-text-secondary lg:justify-self-end">
                        DentFlow, doktor müsaitliğini, hizmet süresini ve mevcut
                        randevuları birlikte kontrol ederek yalnızca gerçekten
                        uygun saatleri gösterir.
                    </p>
                </div>

                {/* Booking flow */}
                <div className="mt-16 border-y border-df-border">
                    <div className="grid sm:grid-cols-5">
                        {bookingFlow.map((step, index) => (
                            <div
                                key={step.id}
                                className={`
                  relative px-0 py-5
                  sm:px-4
                  ${index !== 0
                                        ? 'border-t border-df-border sm:border-l sm:border-t-0'
                                        : ''
                                    }
                `}
                            >
                                <span className="text-[10px] tracking-[0.18em] text-df-text-muted">
                                    {step.id}
                                </span>

                                <div className="mt-3 text-xs text-df-text-muted">
                                    {step.label}
                                </div>

                                <div className="mt-1 font-medium text-df-text">
                                    {step.label === 'Saat'
                                        ? selectedSlot
                                        : step.label === 'Onay'
                                            ? selectedSlotData?.status === 'recommended'
                                                ? 'Önerilen'
                                                : 'Hazır'
                                            : step.value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scheduling board */}
                <div className="mt-10 border border-df-border">

                    {/* Board header */}
                    <div className="flex flex-col gap-4 border-b border-df-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-7">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-df-cyan">
                                Canlı Müsaitlik
                            </p>

                            <p className="mt-1 text-sm text-df-text-secondary">
                                24 Ağustos · Pazartesi
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-df-text-muted">
                            <span className="size-1.5 rounded-full bg-success" />
                            Takvim güncel
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-[1fr_340px]">

                        {/* Available slots */}
                        <div className="p-5 lg:p-7">
                            <div className="mb-7 flex items-end justify-between">
                                <div>
                                    <p className="text-sm text-df-text-muted">
                                        Uzm. Dr. Elif Kaya
                                    </p>

                                    <h3 className="mt-1 font-display text-2xl font-medium tracking-[-0.04em] text-df-text">
                                        Uygun Saatler
                                    </h3>
                                </div>

                                <Clock3 className="size-5 text-df-text-muted" />
                            </div>

                            <div className="grid grid-cols-2 gap-px bg-df-border sm:grid-cols-3">
                                {timeSlots.map((slot) => {
                                    const isBusy = slot.status === 'busy'
                                    const isSelected = selectedSlot === slot.time

                                    return (
                                        <motion.button
                                            key={slot.time}
                                            type="button"
                                            disabled={isBusy}
                                            aria-pressed={isSelected}
                                            onClick={() => setSelectedSlot(slot.time)}
                                            whileTap={
                                                reduceMotion || isBusy
                                                    ? undefined
                                                    : { scale: 0.98 }
                                            }
                                            className={`
                        relative min-h-24 bg-df-bg
                        px-4 py-5 text-left
                        transition-colors
                        focus-visible:z-10
                        ${isBusy
                                                    ? 'cursor-not-allowed text-df-text-muted opacity-40'
                                                    : 'hover:bg-df-surface'
                                                }
                        ${isSelected
                                                    ? 'bg-df-surface text-df-text ring-1 ring-inset ring-df-cyan/30'
                                                    : ''
                                                }
                      `}
                                        >
                                            {isSelected && (
                                                <motion.span
                                                    layoutId="selected-time"
                                                    className="absolute inset-x-0 top-0 h-px bg-df-cyan"
                                                />
                                            )}

                                            <span
                                                className={`
                          font-display text-xl
                          ${isSelected
                                                        ? 'text-df-text'
                                                        : 'text-df-text-secondary'
                                                    }
                        `}
                                            >
                                                {slot.time}
                                            </span>

                                            <span className="mt-3 block text-[11px]">
                                                {isBusy
                                                    ? 'Dolu'
                                                    : slot.status === 'recommended'
                                                        ? 'Önerilen'
                                                        : 'Müsait'}
                                            </span>

                                            {slot.status === 'recommended' && (
                                                <Sparkles className="absolute bottom-4 right-4 size-3.5 text-df-cyan" />
                                            )}
                                        </motion.button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Decision engine */}
                        <div className="border-t border-df-border p-5 lg:border-l lg:border-t-0 lg:p-7">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-df-cyan">
                                Karar Motoru
                            </p>

                            <div className="mt-7">
                                <div className="text-sm text-df-text-muted">
                                    Seçilen saat
                                </div>

                                <div className="mt-1 font-display text-4xl font-medium tracking-[-0.05em] text-df-text">
                                    {selectedSlot}
                                </div>
                                <div className="mt-4 flex items-center gap-3">
                                    <span
                                        className={`
      size-1.5 rounded-full
      ${selectedSlotData?.status === 'recommended'
                                                ? 'bg-df-cyan'
                                                : 'bg-success'
                                            }
    `}
                                    />

                                    <span className="text-xs text-df-text-secondary">
                                        {selectedSlotData?.result}
                                        <span className="mx-2 text-df-border">/</span>
                                        {selectedSlotData?.note}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-8 space-y-5">
                                {bookingChecks.map((check) => (
                                    <div
                                        key={check}
                                        className="flex items-start gap-3"
                                    >
                                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center border border-df-border">
                                            <Check className="size-3 text-success" />
                                        </span>

                                        <span className="text-sm leading-6 text-df-text-secondary">
                                            {check}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10 border-l border-df-cyan pl-4">
                                <div className="text-[10px] uppercase tracking-[0.2em] text-df-cyan">
                                    Sonuç
                                </div>

                                <p className="mt-2 text-sm leading-6 text-df-text">
  {selectedSlotData?.status === 'recommended'
    ? 'Takvim verilerine göre bu saat en uygun seçenek olarak öneriliyor.'
    : 'Bu saat mevcut kurallara göre güvenli şekilde rezerve edilebilir.'}
</p>
                            </div>
                        </div>

                    </div>
                </div>

            </Container>
        </section>
    )
}

export default AppointmentIntelligence