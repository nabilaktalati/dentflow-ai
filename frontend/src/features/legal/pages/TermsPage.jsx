import { CircleCheckBig } from 'lucide-react'
import { motion } from 'motion/react'

const sections = [
  {
    number: '01',
    title: 'Platformun Amacı',
    content:
      'DentFlow AI, diş kliniklerinin dijital yönetim süreçlerini desteklemek amacıyla geliştirilen bir klinik yönetim platformudur.',
  },
  {
    number: '02',
    title: 'Tıbbi Kullanım',
    content:
      'DentFlow AI tıbbi tanı koymaz, tedavi kararı vermez ve profesyonel sağlık hizmetinin yerine geçmez.',
  },
  {
    number: '03',
    title: 'Kullanıcı Sorumluluğu',
    content:
      'Kullanıcılar sisteme girdikleri bilgilerin doğruluğundan ve hesap bilgilerinin güvenli şekilde kullanılmasından sorumludur.',
  },
  {
    number: '04',
    title: 'İletişim Hizmeti',
    content:
      'İletişim formu yalnızca platformla ilgili iletişim talepleri için kullanılmalıdır. Tıbbi acil durumlar veya tanı talepleri için kullanılmamalıdır.',
  },
  {
    number: '05',
    title: 'Platform Geliştirmeleri',
    content:
      'DentFlow AI geliştirme sürecinde olduğundan özellikler, arayüzler ve kullanım akışları ürün geliştirme kapsamında güncellenebilir.',
  },
]

function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFD]">
      <section className="border-b border-slate-200/70 bg-white">
        <div className="mx-auto max-w-[1100px] px-6 pb-16 pt-20 lg:px-10 lg:pb-20 lg:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="flex items-center gap-3">
              <CircleCheckBig
                size={17}
                strokeWidth={1.8}
                className="text-[#5956F5]"
              />

              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5956F5]">
                DentFlow AI
              </span>
            </div>

            <h1 className="mt-6 font-heading text-[clamp(2.8rem,5vw,5rem)] font-semibold leading-[1] tracking-[-0.055em] text-[#111827]">
              Kullanım
              <span className="text-[#5956F5]"> Koşulları</span>
            </h1>

            <p className="mt-6 max-w-[680px] text-[15px] leading-8 text-slate-500">
              DentFlow AI platformunun kullanımı sırasında geçerli temel
              kullanım prensipleri aşağıda açıklanmaktadır.
            </p>
          </motion.div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1100px] px-6 py-16 lg:px-10 lg:py-20">
          <div className="border-t border-slate-200">
            {sections.map((section, index) => (
              <motion.article
                key={section.number}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.03,
                }}
                className="grid gap-5 border-b border-slate-200 py-8 sm:grid-cols-[70px_260px_1fr]"
              >
                <span className="text-[10px] font-semibold tracking-[0.18em] text-slate-300">
                  {section.number}
                </span>

                <h2 className="font-heading text-[20px] font-semibold tracking-[-0.03em] text-[#111827]">
                  {section.title}
                </h2>

                <p className="max-w-[600px] text-sm leading-7 text-slate-500">
                  {section.content}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default TermsPage