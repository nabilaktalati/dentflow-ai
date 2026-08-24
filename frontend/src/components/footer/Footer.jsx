import { ArrowUpRight, Mail } from 'lucide-react'
import { Link } from 'react-router'
import BrandLogo from '../ui/BrandLogo.jsx'
const productLinks = [
  { label: 'Doktorlar', to: '/doctors' },
  { label: 'Akıllı Özellikler', to: '/ai-features' },
  { label: 'DentFlow Hakkında', to: '/about' },
  { label: 'İletişim', to: '/contact' },
]

const operationLinks = [
  { label: 'Randevu Sorgula', to: '/randevu-sorgula' },
  { label: 'Fatura Sorgula', to: '/fatura-sorgula' },
]

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#20285F] text-white">
      <div className="mx-auto max-w-[1280px] px-6 pb-8 pt-16 lg:px-10 lg:pt-20">
        {/* MAIN */}
        <div className="grid gap-14 border-b border-white/10 pb-14 lg:grid-cols-[1.25fr_0.75fr_0.75fr]">
          {/* BRAND */}
          <div className="max-w-[460px]">
            <Link
              to="/"
              className="inline-flex items-center gap-3"
              aria-label="DentFlow AI Ana Sayfa"
            >
              <BrandLogo iconOnly inverse />

              <div>
                <p className="font-heading text-[20px] font-semibold tracking-[-0.035em]">
                  DentFlow{' '}
                  <span className="text-[#8F93FF]">
                    AI
                  </span>
                </p>

                <p className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.24em] text-white/35">
                  Akıllı Klinik Yönetimi
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-[420px] text-sm leading-7 text-white/50">
              Hasta, doktor ve klinik yönetimini tek bir dijital akışta
              buluşturan modern klinik yönetim platformu.
            </p>

            <a
              href="mailto:dentflowai.clinic@gmail.com"
              className="group mt-7 inline-flex items-center gap-3 text-sm font-medium text-white/75 transition hover:text-white"
            >
              <Mail
                size={16}
                strokeWidth={1.8}
                className="text-[#9DA1FF]"
              />

              dentflowai.clinic@gmail.com

              <ArrowUpRight
                size={14}
                className="opacity-50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
              />
            </a>
          </div>

          {/* PRODUCT */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9DA1FF]">
              DentFlow
            </p>

            <div className="mt-5 space-y-3.5">
              {productLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="block w-fit text-sm text-white/55 transition hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* OPERATIONS */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9DA1FF]">
              İşlemler
            </p>

            <div className="mt-5 space-y-3.5">
              {operationLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="block w-fit text-sm text-white/55 transition hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <Link
              to="/contact"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white"
            >
              Bize Ulaşın

              <ArrowUpRight
                size={15}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col gap-5 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-white/35">
            © {currentYear} DentFlow AI. Tüm hakları saklıdır.
          </p>

          <div className="flex items-center gap-5">
            <Link
              to="/privacy"
              className="text-[11px] text-white/35 transition hover:text-white/75"
            >
              Gizlilik Politikası
            </Link>

            <span className="size-1 rounded-full bg-white/15" />

            <Link
              to="/terms"
              className="text-[11px] text-white/50 transition hover:text-white"
            >
              Kullanım Koşulları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer