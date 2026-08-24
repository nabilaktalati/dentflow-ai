import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

const faqItems = [
  {
    question: 'Randevumu nasıl görüntüleyebilirim?',
    answer:
      'İşlemler menüsündeki Randevu İşlemleri alanından randevu kodunuzla tarih, saat, doktor ve randevu durum bilgilerinize ulaşabilirsiniz.',
  },
  {
    question: 'Fatura bilgilerime nasıl ulaşabilirim?',
    answer:
      'Fatura İşlemleri üzerinden fatura numaranızı kullanarak fatura detaylarını, toplam tutarı ve ödeme durumunu görüntüleyebilirsiniz.',
  },
  {
    question: 'Doktoruma mesaj gönderebilir miyim?',
    answer:
      'Evet. DentFlow içerisindeki güvenli iletişim alanı üzerinden gerekli durumlarda doktorunuza mesaj iletebilir ve yanıtları aynı konuşma içinde takip edebilirsiniz.',
  },
  {
    question: 'DentFlow AI tıbbi tanı verir mi?',
    answer:
      'Hayır. DentFlow AI; klinik süreçleri, bilgilendirme, planlama ve idari işlemleri desteklemek için tasarlanmıştır. Tıbbi tanı veya tedavi önerisi sunmaz.',
  },
  {
    question: 'Hasta bilgilerimi kimler görüntüleyebilir?',
    answer:
      'Hasta bilgilerine erişim kullanıcı yetkilerine göre sınırlandırılır. Klinik içerisindeki kullanıcılar yalnızca görevleri için gerekli olan bilgilere erişebilir.',
  },
  {
    question: 'Randevu hatırlatmaları nasıl çalışır?',
    answer:
      'Yaklaşan randevular için gerekli bilgilendirmeler sistem tarafından planlanabilir. Böylece hasta, ziyaret zamanı yaklaşırken gerekli hatırlatmaları alabilir.',
  },
]

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
   <section
  id="faq"
  className="bg-[#F8FAFD] py-20 lg:py-24"
>
      <div className="mx-auto max-w-[1180px] px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto max-w-[760px] text-center"
        >
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-14 bg-[#9CAEFF]" />

            <span className="
              text-[10px]
              font-bold uppercase
              tracking-[0.2em]
              text-[#5965E8]
            ">
              MERAK ETTİKLERİNİZ
            </span>

            <span className="h-px w-14 bg-[#9CAEFF]" />
          </div>

          <h2
  className="
    mt-6
    font-display
    text-[clamp(2.4rem,3.8vw,4rem)]
    font-semibold
    leading-[0.98]
    tracking-[-0.05em]
    text-[#111827]
  "
>
            Sık sorulan
            <span className="text-[#5956F5]">
              {' '}sorular.
            </span>
          </h2>

          <p className="
            mx-auto mt-4
            max-w-[560px]
            text-[15px]
            leading-7
            text-[#718096]
          ">
            DentFlow&apos;un hasta ve klinik deneyimi hakkında
            en çok merak edilen soruların yanıtlarını inceleyin.
          </p>
        </motion.div>

        {/* FAQ */}
        <div className="mt-12 border-t border-[#E4E7EC]">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index
            const number = String(index + 1).padStart(2, '0')

            return (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.04,
                }}
                className="border-b border-[#E4E7EC]"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenIndex(isOpen ? null : index)
                  }
                  aria-expanded={isOpen}
                  className="
                    group
                    flex w-full
                    items-start gap-5
                    py-7
                    text-left
                  "
                >
                  <span
                    className={`
                      mt-1
                      text-[10px]
                      font-bold
                      tracking-[0.16em]
                      transition-colors
                      ${
                        isOpen
                          ? 'text-[#5956F5]'
                          : 'text-[#A0A8B8]'
                      }
                    `}
                  >
                    {number}
                  </span>

                  <span
                    className="
                      min-w-0 flex-1
                      font-display
                      text-[20px]
                      font-semibold
                      tracking-[-0.025em]
                      text-[#1D2939]
                      sm:text-[22px]
                    "
                  >
                    {item.question}
                  </span>

                  <motion.span
                    animate={{
                      rotate: isOpen ? 180 : 0,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
                    className={`
                      flex size-10
                      shrink-0
                      items-center justify-center
                      rounded-full
                      border
                      transition-colors
                      ${
                        isOpen
                          ? 'border-[#CFCCFF] bg-[#F2F1FF] text-[#5956F5]'
                          : 'border-[#E2E6EE] bg-white text-[#7C8799] group-hover:border-[#CFCDF8]'
                      }
                    `}
                  >
                    <ChevronDown className="size-4" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: 'auto',
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      transition={{
                        duration: 0.3,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="overflow-hidden"
                    >
                      <div
                        className="
                          max-w-[820px]
                          pb-8
                          pl-[45px]
                          pr-14
                          text-[14px]
                          leading-7
                          text-[#667085]
                          sm:pl-[50px]
                        "
                      >
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* Small support note */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 text-center text-[13px] text-[#7B8798]">
          Aradığınız yanıtı bulamadınız mı?

          <a
            href="/contact"
            className="
              font-semibold
              text-[#5956F5]
              transition-colors
              hover:text-[#4743DC]
            "
          >
            Bizimle iletişime geçin →
          </a>
        </div>

      </div>
    </section>
  )
}

export default FAQSection