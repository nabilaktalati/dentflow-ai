import { Link } from 'react-router'
import {
  ArrowRight,
  CalendarDays,
  ChartNoAxesCombined,
  Check,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react'
import { motion } from 'motion/react'

const principles = [
  {
    icon: CalendarDays,
    title: 'Tek Akış Mantığı',
    description:
      'Randevu, ziyaret, tedavi, fatura ve takip süreçlerini birbirine bağlı tek bir dijital yapı altında bir araya getirir.',
  },
  {
    icon: MessageCircle,
    title: 'Sade Kullanıcı Deneyimi',
    description:
      'Hasta, doktor ve klinik yönetimi için anlaşılır, sade ve kolay takip edilebilir bir kullanım deneyimi hedefler.',
  },
  {
    icon: ChartNoAxesCombined,
    title: 'Görünür Klinik Yönetimi',
    description:
      'Günlük klinik operasyonlarının daha net izlenebilmesi için süreçleri görünür ve bağlantılı hale getirir.',
  },
  {
    icon: ShieldCheck,
    title: 'Güvenli Dijital Yapı',
    description:
      'Klinik bilgilerinin düzenli, kontrollü ve güvenli şekilde yönetilmesini destekleyen bir altyapı sunar.',
  },
]

function AboutPage() {
  return (
    <div className="bg-[#F8FAFD] text-[#111827]">
      {/* =========================================================
          01 — ABOUT / MISSION
      ========================================================== */}
      <section className="relative overflow-hidden border-b border-slate-200/70">
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5956F5]/[0.035] blur-[140px]" />

        <div className="relative mx-auto flex min-h-[560px] max-w-[1200px] flex-col items-center justify-center px-6 py-24 text-center lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-4">
              <span className="h-px w-14 bg-[#5956F5]/45" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#5956F5]">
                Biz Kimiz · Ne Geliştiriyoruz
              </span>

              <span className="h-px w-14 bg-[#5956F5]/45" />
            </div>

            <h1 className="mx-auto mt-8 max-w-[970px] font-heading text-[clamp(3rem,5.2vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.06em]">
              DentFlow AI,
              <span className="block text-[#5956F5]">
                diş klinikleri için geliştirilen dijital yönetim platformudur.
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-[760px] text-[17px] leading-8 text-slate-500">
              Hasta, doktor ve klinik yönetimini aynı sistem içerisinde
              buluşturarak günlük klinik operasyonlarının daha düzenli,
              anlaşılır ve takip edilebilir şekilde yönetilmesini
              destekliyoruz.
            </p>
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          02 — WHAT WE BUILD
      ========================================================== */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-[1280px] items-center gap-16 px-6 py-24 lg:grid-cols-[0.82fr_1.18fr] lg:px-10 lg:py-28">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <span className="h-px w-12 bg-[#5956F5]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5956F5]">
                Ne Geliştiriyoruz?
              </span>
            </div>

            <h2 className="mt-7 max-w-[540px] font-heading text-[clamp(2.7rem,4.1vw,4.5rem)] font-semibold leading-[1] tracking-[-0.055em]">
              Tek bir klinik
              <span className="block text-[#5956F5]">
                deneyimi geliştiriyoruz.
              </span>
            </h2>

            <p className="mt-7 max-w-[520px] text-[15px] leading-8 text-slate-500">
              DentFlow AI; randevu, hasta takibi, tedavi süreci,
              faturalama ve klinik yönetimi gibi temel işlemleri
              birbirine bağlı bir dijital yapı altında bir araya getirir.
            </p>

            <p className="mt-5 max-w-[520px] text-[15px] leading-8 text-slate-500">
              Amaç, farklı kullanıcıların ihtiyaç duyduğu bilgileri
              ayrı sistemlerde aramak yerine aynı klinik akışı üzerinden
              takip edebilmesini sağlamaktır.
            </p>

            <div className="mt-8 border-l-2 border-[#5956F5] pl-5">
              <p className="max-w-[460px] font-heading text-[18px] font-semibold leading-7 tracking-[-0.02em] text-[#344054]">
                “Bir hasta. Tek kayıt. Birbirine bağlı klinik süreçleri.”
              </p>
            </div>
          </motion.div>

          {/* Flow Visual */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
            className="relative"
          >
            <div className="absolute -inset-12 -z-10 rounded-full bg-[#5956F5]/[0.04] blur-3xl" />

            <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-[#FBFCFE] shadow-[0_25px_70px_rgba(15,23,42,0.07)]">
              <div className="flex items-center justify-between border-b border-slate-200/80 px-7 py-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5956F5]">
                    DentFlow Klinik Akışı
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Bağlantılı hasta süreci
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-500" />

                  <span className="text-[10px] font-semibold text-emerald-700">
                    Tek Sistem
                  </span>
                </div>
              </div>

              <div className="px-7 py-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Klinik Süreçleri
                </p>

                <div className="mt-5 grid gap-2 sm:grid-cols-3">
                  {['Randevu', 'Hasta Kaydı', 'Fatura'].map((item) => (
                    <div
                      key={item}
                      className="rounded-[16px] border border-slate-200 bg-white px-4 py-4"
                    >
                      <span className="block size-2 rounded-full bg-[#5956F5]/30" />

                      <p className="mt-3 text-[12px] font-medium text-slate-600">
                        {item}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        Klinik işlemi
                      </p>
                    </div>
                  ))}
                </div>

                <div className="relative my-7 flex items-center">
                  <div className="h-px flex-1 bg-slate-200" />

                  <div className="mx-4 flex size-11 items-center justify-center rounded-full bg-[#5956F5] text-white shadow-[0_10px_25px_rgba(89,86,245,0.22)]">
                    <ArrowRight size={17} />
                  </div>

                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <div className="rounded-[22px] bg-[#2D347A] p-6 text-white">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A7ABFF]">
                        DentFlow AI
                      </p>

                      <h3 className="mt-2 font-heading text-[22px] font-semibold tracking-[-0.035em]">
                        Tek hasta akışı.
                      </h3>
                    </div>

                    <ShieldCheck
                      size={20}
                      strokeWidth={1.7}
                      className="text-[#A7ABFF]"
                    />
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {[
                      'Randevu',
                      'Ziyaret',
                      'Tedavi',
                      'Fatura',
                      'Takip',
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2"
                      >
                        <Check size={12} className="text-[#A7ABFF]" />

                        <span className="text-[11px] font-medium text-white/80">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          03 — CORE PRINCIPLES
      ========================================================== */}
      <section className="border-t border-slate-200/70 bg-[#F8FAFD]">
        <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-10 lg:py-28">
          {/* Heading */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-4">
              <span className="h-px w-14 bg-[#5956F5]/40" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5956F5]">
                Temel Yaklaşımımız
              </span>

              <span className="h-px w-14 bg-[#5956F5]/40" />
            </div>

            <h2 className="mx-auto mt-6 max-w-[780px] font-heading text-[clamp(2.7rem,4.3vw,4.7rem)] font-semibold leading-[1] tracking-[-0.055em]">
              DentFlow AI,
              <span className="text-[#5956F5]">
                {' '}
                klinik yönetimini sadeleştirmek için tasarlandı.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-[700px] text-[15px] leading-7 text-slate-500">
              Platformun temel yaklaşımı, teknolojiyi kullanıcı deneyimini
              karmaşıklaştırmadan klinik süreçlerine entegre etmektir.
            </p>
          </div>

          <div className="mt-16 grid items-stretch gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Main visual */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.07)]"
            >
              <div className="flex items-center justify-between border-b border-slate-200/80 px-7 py-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5956F5]">
                    DentFlow Workflow
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Bağlantılı klinik yönetimi
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-semibold text-emerald-700">
                    Sistem Hazır
                  </span>
                </div>
              </div>

              <div className="p-7">
                <div className="relative h-[360px] overflow-hidden rounded-[24px] border border-slate-200 bg-[#FBFCFE]">
                  {/* glow */}
                  <div className="pointer-events-none absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5956F5]/10 blur-[70px]" />

                  {/* horizontal */}
                  <div className="absolute left-[16%] right-[16%] top-1/2 h-px bg-[#5956F5]/15" />

                  {/* vertical */}
                  <div className="absolute bottom-[15%] left-1/2 top-[15%] w-px bg-[#5956F5]/15" />

                  {/* TOP */}
                  <div className="absolute left-1/2 top-5 -translate-x-1/2">
                    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
                      <CalendarDays
                        size={15}
                        className="text-[#5956F5]"
                      />
                      <span className="text-[11px] font-semibold text-slate-600">
                        Randevu
                      </span>
                    </div>
                  </div>

                  {/* LEFT */}
                  <div className="absolute left-5 top-1/2 -translate-y-1/2">
                    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
                      <MessageCircle
                        size={15}
                        className="text-[#5956F5]"
                      />
                      <span className="text-[11px] font-semibold text-slate-600">
                        İletişim
                      </span>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="absolute right-5 top-1/2 -translate-y-1/2">
                    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
                      <ChartNoAxesCombined
                        size={15}
                        className="text-[#5956F5]"
                      />
                      <span className="text-[11px] font-semibold text-slate-600">
                        İçgörüler
                      </span>
                    </div>
                  </div>

                  {/* BOTTOM */}
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
                      <ShieldCheck
                        size={15}
                        className="text-[#5956F5]"
                      />
                      <span className="text-[11px] font-semibold text-slate-600">
                        Güvenli Takip
                      </span>
                    </div>
                  </div>

                  {/* CENTER */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative flex size-28 flex-col items-center justify-center rounded-full border border-[#5956F5]/20 bg-white shadow-[0_20px_55px_rgba(89,86,245,0.14)]">
                      <div className="absolute -inset-8 rounded-full bg-[#5956F5]/10 blur-2xl" />

                      <div className="relative flex size-11 items-center justify-center rounded-full bg-[#5956F5]/10 text-[#5956F5]">
                        <Check size={20} />
                      </div>

                      <span className="relative mt-3 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#5956F5]">
                        DentFlow AI
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    'Tek klinik akışı',
                    'Bağlantılı süreçler',
                    'Sade kullanım',
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-[15px] border border-slate-200 bg-[#FBFCFE] px-4 py-3 text-center text-[11px] font-medium text-slate-500"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Principles */}
            <div className="grid gap-4 sm:grid-cols-2">
              {principles.map(({ icon: Icon, title, description }, index) => (
                <motion.article
                  key={title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                  }}
                  className="rounded-[26px] border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#5956F5]/20 hover:shadow-[0_20px_50px_rgba(15,23,42,0.06)]"
                >
                  <div className="flex size-11 items-center justify-center rounded-[15px] bg-[#5956F5]/10 text-[#5956F5]">
                    <Icon size={18} strokeWidth={1.8} />
                  </div>

                  <h3 className="mt-5 font-heading text-[21px] font-semibold leading-7 tracking-[-0.03em]">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {description}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 overflow-hidden rounded-[32px] bg-[#2F367D] px-8 py-10 text-white lg:px-12 lg:py-12">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A7ABFF]">
                  DentFlow AI
                </p>

                <h3 className="mt-4 max-w-[760px] font-heading text-[clamp(2rem,3vw,3.2rem)] font-semibold leading-[1.05] tracking-[-0.045em]">
                  Hasta, doktor ve klinik yönetimini
                  <span className="block text-[#B7BAFF]">
                    tek bir dijital akışta buluşturuyoruz.
                  </span>
                </h3>
              </div>

              <Link
                to="/contact"
                className="group inline-flex h-14 shrink-0 items-center gap-2 rounded-[18px] bg-[#5956F5] px-7 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#6A67FF]"
              >
                Bize Ulaşın

                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage