import {
  useLayoutEffect,
  useState,
} from 'react'

import {
  ArrowUpRight,
  BellRing,
  Clock3,
  ReceiptText,
  ShieldCheck,
} from 'lucide-react'

import { Link } from 'react-router'

import HeroVisual from './HeroVisual.jsx'

const highlights = [
  {
    icon: ShieldCheck,
    label: 'Güvenli Altyapı',
  },
  {
    icon: Clock3,
    label: 'Hızlı Klinik Akışı',
  },
  {
    icon: ReceiptText,
    label: 'Akıllı Faturalama',
  },
  {
    icon: BellRing,
    label: 'Otomatik Takip',
  },
]

const BASE_WIDTH = 1380
const BASE_HEIGHT = 700
const getHeroScale = () => {
  if (typeof window === 'undefined') {
    return 1
  }

  const availableWidth =
    window.innerWidth - 64

  const availableHeight =
    window.innerHeight - 120

  return Math.max(
    0.01,
    Math.min(
      1,
      availableWidth / BASE_WIDTH,
      availableHeight / BASE_HEIGHT,
    ),
  )
}
function Hero() {
  const [heroScale, setHeroScale] =
    useState(getHeroScale)

  useLayoutEffect(() => {
    const updateScale = () => {
      setHeroScale(getHeroScale())
    }

    window.addEventListener(
      'resize',
      updateScale,
    )

    return () => {
      window.removeEventListener(
        'resize',
        updateScale,
      )
    }
  }, [])

  return (
<section
  id="home"
  className="relative h-[100dvh] overflow-hidden bg-[#F8FAFD]"
>
      {/* DESKTOP */}
      <div className="hidden h-full items-center justify-center px-4 lg:flex">
        <div
          className="relative shrink-0"
          style={{
            width: `${BASE_WIDTH * heroScale}px`,
            height: `${BASE_HEIGHT * heroScale}px`,
          }}
        >
          <div
            className="absolute left-0 top-0 h-[700px] w-[1380px]"
            style={{
              transform: `scale(${heroScale})`,
              transformOrigin: 'top left',
            }}
          >
            <div className="grid h-full grid-cols-[0.95fr_1.05fr] items-center gap-14">
              {/* LEFT */}
              <div>
                {/* EYEBROW */}
                <div className="flex items-center gap-4">
                  <span className="h-px w-14 bg-[#9BB4FF]" />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#4169E1]">
                    100% GÜVENLİ · HIZLI KURULUM · TEK PLATFORM
                  </span>

                  <span className="h-px w-14 bg-[#9BB4FF]" />
                </div>

                {/* HEADLINE */}
                <h1 className="mt-10 max-w-[720px] font-display text-[5rem] font-bold leading-[1.02] tracking-[-0.055em] text-[#111827]">
                  Klinik Yönetimi.

                  <span className="mt-4 block text-[#5956F5]">
                    Hızlı, Akıllı & Basit.
                  </span>

                  <span className="mt-4 block">
                    Diş Klinikleri için.
                  </span>
                </h1>

                <p className="mt-8 max-w-[590px] font-display text-xl font-medium italic text-[#4F5F75]">
                  Modern diş klinikleri için tasarlandı.
                </p>

                <p className="mt-8 max-w-[610px] text-[17px] leading-8 text-[#718096]">
                  DentFlow AI ile randevudan tedaviye,
                  faturadan hasta takibine kadar tüm
                  klinik operasyonlarını tek bir sistem
                  üzerinden yönetin.
                </p>

                {/* CTA */}
                <div className="mt-10">
                  <Link
                    to="/register"
                    className="inline-flex h-14 items-center gap-3 rounded-[18px] bg-[#5956F5] px-8 text-[15px] font-semibold text-white shadow-[0_14px_30px_rgba(89,86,245,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4B48E8]"
                  >
                    Randevu Al
                    <ArrowUpRight className="size-4" />
                  </Link>
                </div>

                {/* HIGHLIGHTS */}
                <div className="mt-10 flex flex-wrap gap-x-6 gap-y-4">
                  {highlights.map((item) => {
                    const Icon = item.icon

                    return (
                      <div
                        key={item.label}
                        className="flex items-center gap-2 text-xs font-medium text-[#56657A]"
                      >
                        <Icon className="size-4 text-[#4F6FFF]" />
                        {item.label}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center justify-center">
                <HeroVisual />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE / TABLET */}
      <div className="px-5 pb-16 pt-12 sm:px-8 lg:hidden">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[#9BB4FF]" />

            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#4169E1]">
              GÜVENLİ · HIZLI · TEK PLATFORM
            </span>
          </div>

          <h1 className="mt-7 font-display text-[clamp(2.25rem,8.5vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.055em] text-[#111827] sm:text-[clamp(3rem,7vw,4rem)]">
            Klinik Yönetimi.

            <span className="mt-3 block text-[#5956F5]">
              Hızlı, Akıllı & Basit.
            </span>

            <span className="mt-3 block">
              Diş Klinikleri için.
            </span>
          </h1>

          <p className="mt-6 text-lg font-medium italic text-[#4F5F75]">
            Modern diş klinikleri için tasarlandı.
          </p>

          <p className="mt-5 max-w-xl text-[15px] leading-7 text-[#718096]">
            DentFlow AI ile randevudan tedaviye,
            faturadan hasta takibine kadar tüm klinik
            operasyonlarını tek bir sistem üzerinden
            yönetin.
          </p>

          <Link
            to="/register"
            className="mt-7 inline-flex h-13 items-center gap-3 rounded-[17px] bg-[#5956F5] px-7 text-sm font-semibold text-white"
          >
            Randevu Al
            <ArrowUpRight className="size-4" />
          </Link>

          <div className="mt-8">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero