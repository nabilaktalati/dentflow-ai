import { Mail, ShieldCheck } from 'lucide-react'
import { motion } from 'motion/react'

const sections = [
  {
    number: '01',
    title: 'Toplanan Bilgiler',
    content:
      'İletişim formu kullanıldığında ad soyad, e-posta adresi, isteğe bağlı telefon numarası, konu ve mesaj bilgileri işlenebilir.',
  },
  {
    number: '02',
    title: 'Bilgilerin Kullanımı',
    content:
      'Gönderilen bilgiler yalnızca iletişim talebini değerlendirmek ve kullanıcıya geri dönüş sağlamak amacıyla kullanılır.',
  },
  {
    number: '03',
    title: 'İletişim Mesajları',
    content:
      'İletişim formu üzerinden gönderilen mesajlar DentFlow AI için oluşturulan proje e-posta hesabına güvenli backend servisi üzerinden iletilir.',
  },
  {
    number: '04',
    title: 'Veri Paylaşımı',
    content:
      'İletişim formu aracılığıyla alınan bilgiler reklam veya pazarlama amacıyla üçüncü taraflara satılmaz.',
  },
  {
    number: '05',
    title: 'Güvenlik',
    content:
      'Uygulama içerisinde hassas bağlantı bilgileri istemci tarafında tutulmaz. E-posta servis bilgileri sunucu ortam değişkenleri üzerinden yönetilir.',
  },
]

function PrivacyPage() {
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
              <ShieldCheck
                size={17}
                strokeWidth={1.8}
                className="text-[#5956F5]"
              />

              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5956F5]">
                DentFlow AI
              </span>
            </div>

            <h1 className="mt-6 font-heading text-[clamp(2.8rem,5vw,5rem)] font-semibold leading-[1] tracking-[-0.055em] text-[#111827]">
              Gizlilik
              <span className="text-[#5956F5]"> Politikası</span>
            </h1>

            <p className="mt-6 max-w-[680px] text-[15px] leading-8 text-slate-500">
              DentFlow AI, kullanıcı bilgilerinin yalnızca gerekli olduğu
              amaçlar doğrultusunda ve kontrollü şekilde kullanılmasını
              hedefler.
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

          <div className="mt-12 flex items-start gap-4 rounded-[22px] border border-[#5956F5]/10 bg-[#5956F5]/[0.04] p-6">
            <Mail
              size={18}
              strokeWidth={1.8}
              className="mt-0.5 shrink-0 text-[#5956F5]"
            />

            <div>
              <p className="text-sm font-semibold text-[#111827]">
                Gizlilik hakkında iletişim
              </p>

              <a
                href="mailto:dentflowai.clinic@gmail.com"
                className="mt-2 inline-block text-sm text-[#5956F5] transition hover:underline"
              >
                dentflowai.clinic@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PrivacyPage