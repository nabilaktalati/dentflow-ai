import { useState } from 'react'
import {
  Check,
  Clock3,
  FileText,
  MessageCircleMore,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { motion } from 'motion/react'

const stories = [
  {
    id: '01',
    eyebrow: 'DOKTOR İLETİŞİMİ',
    title: 'Doktorla güvenli iletişim.',
    description:
      'Hasta, gerekli durumlarda doktoruna mesaj iletebilir ve yanıtını aynı konuşma üzerinden takip edebilir.',
    accent: '#5956F5',
    type: 'chat',
  },
  {
    id: '02',
    eyebrow: 'HIZLI YANITLAR',
    title: 'Klinik sorularınıza hızlı yanıt alın.',
    description:
      'Çalışma saatleri, klinik süreci ve ziyaret hazırlığı gibi idari sorulara hızlıca ulaşın.',
    accent: '#3B82F6',
    type: 'assistant',
  },
  {
    id: '03',
    eyebrow: 'ZİYARET BİLGİSİ',
    title: 'Ziyaret öncesi hazırlıklı olun.',
    description:
      'Hasta, ziyaret öncesi gerekli bilgileri ve klinik yönlendirmelerini tek ekranda görüntüler.',
    accent: '#22A06B',
    type: 'previsit',
  },
  {
    id: '04',
    eyebrow: 'İLETİŞİM GEÇMİŞİ',
    title: 'Tüm görüşmeler tek yerde.',
    description:
      'Hasta ile klinik arasındaki iletişim farklı kanallara dağılmadan düzenli bir geçmiş altında tutulur.',
    accent: '#7C3AED',
    type: 'history',
  },
]

function ChatPreview() {
  return (
    <div className="mt-8 rounded-[24px] border border-[#E7E9F2] bg-[#F8F9FD] p-5">
      <div className="flex items-center gap-3 border-b border-[#E7E9F2] pb-4">
        <div className="flex size-10 items-center justify-center rounded-full bg-[#EFEEFF] text-[#5956F5]">
          <UserRound className="size-5" />
        </div>

        <div>
          <p className="text-sm font-semibold text-[#182033]">
            Uzm. Dr. Elif Kaya
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[#7C8799]">
            <span className="size-1.5 rounded-full bg-[#32C878]" />
            Klinikte
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div className="max-w-[78%] rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm">
          <p className="text-[12px] leading-5 text-[#566176]">
            Kontrol ziyaretim hakkında bir sorum var.
          </p>
          <span className="mt-2 block text-[9px] text-[#9AA3B3]">
            14:32
          </span>
        </div>

        <div className="ml-auto max-w-[82%] rounded-2xl rounded-br-md bg-[#5956F5] px-4 py-3 text-white">
          <p className="text-[12px] leading-5">
            Mesajınızı gördüm. Mevcut kontrol planınız uygundur.
          </p>
          <span className="mt-2 flex items-center justify-end gap-1 text-[9px] text-white/65">
            14:36
            <Check className="size-3" />
          </span>
        </div>
      </div>
    </div>
  )
}

function AssistantPreview() {
  return (
    <div className="mt-8 rounded-[24px] border border-[#E7E9F2] bg-[#FAFBFF] p-5">
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-[#EEF4FF] text-[#3B82F6]">
          <Sparkles className="size-5" />
        </div>

        <div>
          <p className="text-sm font-semibold text-[#182033]">
            Klinik Bilgi Asistanı
          </p>
          <p className="text-[10px] uppercase tracking-[0.14em] text-[#8994A7]">
            İDARİ BİLGİLENDİRME
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-[11px] font-medium text-[#8792A5]">
          Hasta sorusu
        </p>

        <p className="mt-2 text-sm font-medium text-[#253047]">
          “Randevuma kaç dakika önce gelmeliyim?”
        </p>
      </div>

      <div className="mt-3 rounded-2xl border border-[#DDE8FF] bg-[#F3F7FF] p-4">
        <p className="text-[11px] font-semibold text-[#3B82F6]">
          Hızlı yanıt
        </p>

        <p className="mt-2 text-[12px] leading-5 text-[#526078]">
          İşlemlerinizin zamanında başlaması için randevunuzdan
          yaklaşık 10 dakika önce klinikte olmanız önerilir.
        </p>
      </div>

      <p className="mt-4 text-[10px] leading-4 text-[#98A2B3]">
        Tıbbi tanı veya tedavi önerisi sunmaz.
      </p>
    </div>
  )
}

function PreVisitPreview() {
  const items = [
    'Randevu bilgisi hazır',
    'Doktor bilgisi görüntülendi',
    'Ziyaret notları paylaşıldı',
  ]

  return (
    <div className="mt-8 rounded-[24px] border border-[#E3EEE9] bg-[#FAFDFC] p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#22A06B]">
            ZİYARET ÖNCESİ
          </p>
          <h4 className="mt-2 font-display text-xl font-semibold text-[#182033]">
            Hazırsınız.
          </h4>
        </div>

        <div className="flex size-11 items-center justify-center rounded-full bg-[#EAF8F1] text-[#22A06B]">
          <Clock3 className="size-5" />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm"
          >
            <span className="flex size-6 items-center justify-center rounded-full bg-[#EAF8F1] text-[#22A06B]">
              <Check className="size-3.5" />
            </span>

            <span className="text-[12px] font-medium text-[#596579]">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function HistoryPreview() {
  const messages = [
    {
      title: 'Resepsiyon',
      detail: 'Randevu bilgisi paylaşıldı',
      time: '09:14',
    },
    {
      title: 'Uzm. Dr. Elif Kaya',
      detail: 'Hasta mesajını yanıtladı',
      time: '14:36',
    },
    {
      title: 'Klinik',
      detail: 'Ziyaret sonrası bilgilendirme gönderildi',
      time: '16:20',
    },
  ]

  return (
    <div className="mt-8 rounded-[24px] border border-[#E9E4F5] bg-[#FCFAFF] p-5">
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-[#F2EBFF] text-[#7C3AED]">
          <MessagesSquare className="size-5" />
        </div>

        <div>
          <p className="text-sm font-semibold text-[#182033]">
            İletişim Geçmişi
          </p>
          <p className="text-[11px] text-[#8994A7]">
            Merve Yılmaz
          </p>
        </div>
      </div>

      <div className="mt-6">
        {messages.map((message, index) => (
          <div
            key={message.title}
            className={`flex gap-3 py-4 ${
              index !== messages.length - 1
                ? 'border-b border-[#ECE8F3]'
                : ''
            }`}
          >
            <span className="mt-1 size-2 rounded-full bg-[#7C3AED]" />

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[12px] font-semibold text-[#344054]">
                  {message.title}
                </p>

                <span className="text-[10px] text-[#98A2B3]">
                  {message.time}
                </span>
              </div>

              <p className="mt-1 text-[11px] leading-5 text-[#727E91]">
                {message.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StoryVisual({ type }) {
  if (type === 'chat') return <ChatPreview />
  if (type === 'assistant') return <AssistantPreview />
  if (type === 'previsit') return <PreVisitPreview />

  return <HistoryPreview />
}

function CommunicationStory() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="relative bg-[#F7F9FC] py-24 lg:py-32">
      <div className="mx-auto max-w-[1380px] px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">

          {/* LEFT — stays fixed */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="flex items-center gap-4">
              <span className="h-px w-14 bg-[#9CB1FF]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4169E1]">
                HASTA İLETİŞİMİ
              </span>
            </div>

            <h2 className="mt-8 max-w-[520px] font-display text-[clamp(2.8rem,4.8vw,5rem)] font-semibold leading-[0.94] tracking-[-0.055em] text-[#131A2B]">
              İletişim,
              <span className="block">
                tedavi sürecinin
              </span>

              <span className="block text-[#5956F5]">
                dışında kalmasın.
              </span>
            </h2>

            <p className="mt-8 max-w-[450px] text-[17px] leading-8 text-[#6D7A90]">
              Sorular, mesajlar ve ziyaret bilgileri farklı kanallarda
              kaybolmadan doğru kişiye, doğru zamanda ulaşsın.
            </p>

            <div className="mt-10 flex items-center gap-3 text-sm font-medium text-[#4E5D73]">
              <ShieldCheck className="size-5 text-[#5956F5]" />
              Güvenli ve düzenli klinik iletişimi
            </div>
          </div>

          {/* RIGHT — scrolls */}
          <div className="relative">

            {/* Desktop progress rail */}
            <div className="absolute -right-14 top-0 hidden h-full lg:block">
              <div className="sticky top-[40%] flex flex-col items-center">
                {stories.map((story, index) => (
                  <div
                    key={story.id}
                    className="flex flex-col items-center"
                  >
                    <motion.span
  animate={{
    scale: activeIndex === index ? 1.25 : 1,
    backgroundColor:
      activeIndex === index
        ? story.accent
        : '#CBD3DF',
    boxShadow:
      activeIndex === index
        ? `0 0 0 6px ${story.accent}20`
        : '0 0 0 0px transparent',
  }}
  transition={{
    duration: 0.3,
    ease: [0.22, 1, 0.36, 1],
  }}
  className="size-2.5 rounded-full"
/>

                    {index !== stories.length - 1 && (
                      <span className="h-10 w-px bg-[#DCE2EB]" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-14 lg:space-y-20">
              {stories.map((story, index) => (
                <motion.article
                  key={story.id}
                  onViewportEnter={() => setActiveIndex(index)}
                  viewport={{
  amount: 0.25,
  margin: '-15% 0px -25% 0px',
}}
                  initial={{
                    opacity: 0,
                    y: 35,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="
                    min-h-[520px]
                    rounded-[30px]
                    border border-[#E2E6F0]
                    bg-white
                    p-6
                    shadow-[0_20px_55px_rgba(31,41,55,0.07)]
                    sm:p-8
                    lg:p-10
                  "
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex gap-4">
                      <div
                        className="flex size-14 shrink-0 items-center justify-center rounded-[18px] text-white"
                        style={{
                          backgroundColor: story.accent,
                        }}
                      >
                        {story.type === 'chat' && (
                          <MessageCircleMore className="size-6" />
                        )}

                        {story.type === 'assistant' && (
                          <Sparkles className="size-6" />
                        )}

                        {story.type === 'previsit' && (
                          <FileText className="size-6" />
                        )}

                        {story.type === 'history' && (
                          <MessagesSquare className="size-6" />
                        )}
                      </div>

                      <div>
                        <p
                          className="text-[10px] font-bold uppercase tracking-[0.16em]"
                          style={{
                            color: story.accent,
                          }}
                        >
                          {story.eyebrow}
                          <span className="ml-2 text-[#C2C9D4]">
                            · {story.id}
                          </span>
                        </p>

                        <h3 className="mt-3 font-display text-[30px] font-semibold tracking-[-0.04em] text-[#172033]">
                          {story.title}
                        </h3>

                        <p className="mt-3 max-w-[520px] text-[14px] leading-6 text-[#6D788C]">
                          {story.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <StoryVisual type={story.type} />
                </motion.article>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default CommunicationStory