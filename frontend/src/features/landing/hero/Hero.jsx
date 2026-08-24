import { ArrowUpRight, BellRing, Clock3, ReceiptText, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router'

import Container from '../../../components/ui/Container.jsx'
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

function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[#F8FAFD]"
    >
    
      
      <Container className="  relative z-10 pb-20 pt-32 sm:pt-36 lg:pb-24 lg:pt-40">

        <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">

          {/* Left */}
          <div>

            {/* Eyebrow */}
            <div className="flex items-center gap-4">
              <span className="h-px w-14 bg-[#9BB4FF]" />

              <span className="
                text-[10px] font-semibold uppercase
                tracking-[0.22em] text-[#4169E1]
              ">
                100% GÜVENLİ · HIZLI KURULUM · TEK PLATFORM
              </span>

              <span className="hidden h-px w-14 bg-[#9BB4FF] sm:block" />
            </div>

            {/* Headline */}
            <h1 className="
              mt-10
              max-w-[720px]
              font-display
              text-[clamp(3rem,5.3vw,5rem)]
              font-bold
              leading-[1.02]
              tracking-[-0.055em]
              text-[#111827]
            ">
              Klinik Yönetimi.

              <span className="mt-4 block text-[#5956F5]">
                Hızlı, Akıllı & Basit.
              </span>

              <span className="mt-4 block">
                Diş Klinikleri için.
              </span>
            </h1>

            <p className="
              mt-8
              max-w-[590px]
              font-display
              text-xl font-medium italic
              text-[#4F5F75]
            ">
              Modern diş klinikleri için tasarlandı.
            </p>

            <p className="
              mt-8 max-w-[610px]
              text-[17px] leading-8
              text-[#718096]
            ">
              DentFlow AI ile randevudan tedaviye, faturadan hasta
              takibine kadar tüm klinik operasyonlarını tek bir sistem
              üzerinden yönetin.
            </p>

            {/* CTA */}
            <div className="mt-10">

              <Link
                to="/register"
                className="
                  inline-flex h-14 items-center gap-3
                  rounded-[18px]
                  bg-[#5956F5]
                  px-8
                  text-[15px] font-semibold text-white
                  shadow-[0_14px_30px_rgba(89,86,245,0.24)]
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:bg-[#4B48E8]
                "
              >
                Randevu Al
                <ArrowUpRight className="size-4" />
              </Link>

            </div>

            {/* Highlights */}
            <div className="
              mt-10 flex flex-wrap
              gap-x-6 gap-y-4
            ">
              {highlights.map((item) => {
                const Icon = item.icon

                return (
                  <div
                    key={item.label}
                    className="
                      flex items-center gap-2
                      text-xs font-medium
                      text-[#56657A]
                    "
                  >
                    <Icon className="size-4 text-[#4F6FFF]" />
                    {item.label}
                  </div>
                )
              })}
            </div>

          </div>

          {/* Right */}
          <HeroVisual />

        </div>

      </Container>
    </section>
    
  )
}

export default Hero