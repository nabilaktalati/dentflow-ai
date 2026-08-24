import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowUpRight,
  Clock3,
  Stethoscope,
} from 'lucide-react'

import {
  doctorsAvailability,
  timeline,
} from './availabilityData.js'

function AvailabilityExperience() {
  const [activeDoctor, setActiveDoctor] = useState('elif')

  const selectedDoctor = doctorsAvailability.find(
    (doctor) => doctor.id === activeDoctor,
  )

  return (
    <section
      id="live-availability"
      className="relative overflow-hidden border-y border-df-border bg-[#081522]"
    >
      <div className="mx-auto max-w-[1600px] px-4 py-24 sm:px-6 lg:px-8 lg:py-32">

        {/* Compact editorial intro */}
        <div className="mb-10 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">

          <div className="flex items-start gap-5">
            <span className="pt-1 text-[11px] font-semibold tracking-[0.2em] text-df-cyan">
              02
            </span>

            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-df-text-muted">
                Canlı Klinik Akışı
              </p>

              <h2 className="mt-3 max-w-2xl font-display text-3xl font-medium tracking-[-0.045em] text-df-text sm:text-4xl lg:text-5xl">
                Kliniğin ritmini
                <span className="text-df-text-secondary">
                  {' '}tek bakışta görün.
                </span>
              </h2>
            </div>
          </div>

          <div className="max-w-md lg:text-right">
            <p className="text-sm leading-6 text-df-text-secondary">
              Doktor, tedavi, mola ve müsaitlik durumları aynı operasyon
              görünümünde anlık olarak okunabilir.
            </p>
          </div>
        </div>

        {/* Full operational canvas */}
        <div className="overflow-hidden border border-df-border bg-df-bg">

          {/* Command strip */}
          <div className="flex flex-col gap-5 border-b border-df-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-7">

            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center border border-df-border bg-df-surface">
                <Stethoscope className="size-4 text-df-cyan" />
              </span>

              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-df-cyan">
                  Operasyon Görünümü
                </div>

                <div className="mt-1 text-xs text-df-text-muted">
                  24 Ağustos · Pazartesi
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden items-center gap-2 text-xs text-df-text-muted sm:flex">
                <span className="size-1.5 rounded-full bg-success" />
                Takvim senkronize
              </div>

              <div className="text-right">
                <div className="text-[9px] uppercase tracking-[0.2em] text-df-text-muted">
                  Sonraki uygun
                </div>

                <div className="mt-1 flex items-center justify-end gap-2 font-display text-xl text-df-text">
                  {selectedDoctor.next}
                  <Clock3 className="size-4 text-df-cyan" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[270px_1fr]">

            {/* Doctor rail */}
            <aside className="border-b border-df-border lg:border-b-0 lg:border-r">

              <div className="border-b border-df-border px-5 py-4">
                <span className="text-[9px] uppercase tracking-[0.2em] text-df-text-muted">
                  Klinik Ekibi
                </span>
              </div>

              <div className="flex overflow-x-auto lg:block lg:overflow-visible">
                {doctorsAvailability.map((doctor, index) => {
                  const isActive = doctor.id === activeDoctor

                  return (
                    <button
                      key={doctor.id}
                      type="button"
                      onClick={() => setActiveDoctor(doctor.id)}
                      className={`
                        relative min-w-[220px] border-r border-df-border
                        px-5 py-5 text-left transition-colors
                        lg:min-w-0 lg:border-r-0
                        ${
                          index !== doctorsAvailability.length - 1
                            ? 'lg:border-b lg:border-df-border'
                            : ''
                        }
                        ${
                          isActive
                            ? 'bg-df-surface'
                            : 'hover:bg-df-surface/40'
                        }
                      `}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="active-doctor-rail"
                          className="absolute inset-x-0 bottom-0 h-px bg-df-cyan lg:inset-y-0 lg:left-0 lg:right-auto lg:h-auto lg:w-px"
                        />
                      )}

                      <div className="flex items-center justify-between">
                        <span
                          className={`
                            text-[9px] font-medium uppercase tracking-[0.18em]
                            ${
                              doctor.status === 'available'
                                ? 'text-success'
                                : 'text-warning'
                            }
                          `}
                        >
                          {doctor.status === 'available'
                            ? 'Aktif'
                            : 'Tedavide'}
                        </span>

                        <span className="text-[10px] text-df-text-muted">
                          0{index + 1}
                        </span>
                      </div>

                      <div className="mt-5 font-medium text-df-text">
                        {doctor.name}
                      </div>

                      <div className="mt-1 text-xs text-df-text-muted">
                        {doctor.specialty}
                      </div>
                    </button>
                  )
                })}
              </div>

             
            </aside>

            {/* Timeline stage */}
            <div className="min-w-0">

              <div className="overflow-x-auto">
                <div className="min-w-[900px]">

                  {/* Hours */}
                  <div className="grid grid-cols-8 border-b border-df-border">
                    {timeline.map((time) => (
                      <div
                        key={time}
                        className="border-r border-df-border px-3 py-4 text-center text-[10px] text-df-text-muted last:border-r-0"
                      >
                        {time}
                      </div>
                    ))}
                  </div>

                  {/* Focused doctor timeline */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedDoctor.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="relative grid min-h-[300px] grid-cols-8"
                    >
                      {/* Background grid */}
                      {timeline.map((time) => (
                        <div
                          key={time}
                          className="border-r border-df-border last:border-r-0"
                        />
                      ))}

                      {/* Schedule blocks */}
                      {selectedDoctor.schedule.map((block, index) => (
                        <motion.div
                          key={`${selectedDoctor.id}-${index}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.25,
                            delay: index * 0.035,
                          }}
                          style={{
                            gridColumnStart: block.start + 1,
                            gridColumnEnd: block.start + block.span + 1,
                            gridRow: 1,
                          }}
                          className={`
                            relative z-10 m-3 flex min-h-28
                            flex-col justify-between px-4 py-4
                            ${
                              block.type === 'busy'
                                ? 'bg-df-surface'
                                : block.type === 'break'
                                  ? 'border border-dashed border-df-border'
                                  : block.type === 'recommended'
                                    ? 'border border-df-cyan bg-df-cyan/5'
                                    : 'border border-df-border'
                            }
                          `}
                        >
                          <span
                            className={`
                              text-xs
                              ${
                                block.type === 'recommended'
                                  ? 'text-df-cyan'
                                  : 'text-df-text-secondary'
                              }
                            `}
                          >
                            {block.label}
                          </span>

                          {block.type === 'recommended' && (
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] uppercase tracking-[0.18em] text-df-cyan">
                                Önerilen
                              </span>

                              <ArrowUpRight className="size-4 text-df-cyan" />
                            </div>
                          )}
                        </motion.div>
                      ))}

                      {/* Current-time visual marker */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-0 left-[64%] top-0 z-20 w-px bg-df-cyan/50"
                      >
                        <span className="absolute -left-[17px] top-3 bg-df-bg px-1 text-[8px] uppercase tracking-[0.14em] text-df-cyan">
                          Şimdi
                        </span>

                        <span className="absolute -left-[3px] top-10 size-1.5 rounded-full bg-df-cyan" />
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Lower telemetry */}
                  <div className="grid grid-cols-3 border-t border-df-border">

                    <div className="px-5 py-5">
                      <div className="text-[9px] uppercase tracking-[0.18em] text-df-text-muted">
                        Durum
                      </div>
                      <div className="mt-2 text-sm text-df-text">
                        Takvim açık
                      </div>
                    </div>

                    <div className="border-l border-df-border px-5 py-5">
                      <div className="text-[9px] uppercase tracking-[0.18em] text-df-text-muted">
                        Sonraki boşluk
                      </div>
                      <div className="mt-2 text-sm text-df-text">
                        {selectedDoctor.next}
                      </div>
                    </div>

                    <div className="border-l border-df-border px-5 py-5">
                      <div className="text-[9px] uppercase tracking-[0.18em] text-df-text-muted">
                        Sistem
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-sm text-df-text">
                        <span className="size-1.5 rounded-full bg-success" />
                        Güncel
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Minimal legend */}
        <div className="mt-4 flex flex-wrap justify-end gap-6 text-[10px] text-df-text-muted">
          <span>Müsait</span>
          <span>Dolu</span>
          <span>Ara</span>
          <span className="text-df-cyan">Önerilen</span>
        </div>

      </div>
    </section>
  )
}

export default AvailabilityExperience