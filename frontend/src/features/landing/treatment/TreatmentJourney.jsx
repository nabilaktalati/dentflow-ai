import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Route,
} from 'lucide-react'
import { motion } from 'motion/react'

const treatmentItems = [
  {
    icon: ClipboardList,
    eyebrow: 'TEDAVİ PLANI',
    title: 'Planlanan Tedaviler',
    description:
      'Doktorunuzun oluşturduğu tedavi planını ve uygulanacak işlemleri anlaşılır şekilde görüntüleyin.',
  },
  {
    icon: CheckCircle2,
    eyebrow: 'TAMAMLANAN',
    title: 'Tamamlanan İşlemler',
    description:
      'Hangi işlemlerin tamamlandığını ve tedavi sürecinizin hangi aşamada olduğunu kolayca görün.',
  },
  {
    icon: Route,
    eyebrow: 'SONRAKİ ADIM',
    title: 'Sırada Ne Var?',
    description:
      'Tedavi sürecinizde sizi bekleyen sonraki adımı net şekilde takip edin.',
  },
]

function TreatmentJourney() {
  return (
    <section
      className="
        overflow-hidden
        bg-gradient-to-r
        from-[#202C66]
        via-[#293A7A]
        to-[#28488A]
        py-24
        lg:py-28
      "
    >
      <div className="mx-auto max-w-[1380px] px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto max-w-[820px] text-center"
        >
          <div
            className="
              mx-auto inline-flex items-center gap-2
              rounded-full
              border border-white/15
              bg-white/[0.06]
              px-4 py-2
            "
          >
            <span className="size-1.5 rounded-full bg-[#89A2FF]" />

            <span
              className="
                text-[10px] font-bold uppercase
                tracking-[0.18em]
                text-white/70
              "
            >
              TEDAVİ SÜRECİNİZ
            </span>
          </div>

          <h2
            className="
              mt-7 font-display
              text-[clamp(2.5rem,4.5vw,4.7rem)]
              font-semibold
              leading-[0.98]
              tracking-[-0.055em]
              text-white
            "
          >
            Ne yapıldığını bilin.
            <span className="block text-[#969BFF]">
              Sırada ne olduğunu görün.
            </span>
          </h2>

          <p
            className="
              mx-auto mt-6 max-w-[620px]
              text-[16px] leading-7
              text-white/55
            "
          >
            Tedavi planınızı ve ilerlemenizi anlaşılır şekilde
            takip edin.
          </p>
        </motion.div>

        {/* 3 patient benefits */}
        <div
          className="
            mt-16 grid
            lg:grid-cols-3
            lg:divide-x lg:divide-white/10
          "
        >
          {treatmentItems.map((item, index) => {
            const Icon = item.icon

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  group relative
                  flex min-h-[310px]
                  flex-col items-center
                  px-7 py-8
                  text-center
                "
              >
                {/* Icon */}
                <div
                  className="
                    flex size-14
                    items-center justify-center
                    rounded-[18px]
                    bg-gradient-to-br
                    from-[#6577FF]
                    to-[#4D61EC]
                    text-white
                    shadow-[0_12px_30px_rgba(30,39,120,0.28)]

                    transition-all duration-300
                    group-hover:-translate-y-1
                    group-hover:shadow-[0_18px_38px_rgba(30,39,120,0.38)]
                  "
                >
                  <Icon className="size-6" />
                </div>

                {/* Eyebrow */}
                <div
                  className="
                    mt-6 inline-flex
                    rounded-full
                    border border-white/10
                    bg-white/[0.05]
                    px-3 py-1.5
                  "
                >
                  <span
                    className="
                      text-[9px] font-bold
                      uppercase tracking-[0.16em]
                      text-[#B9C4FF]
                    "
                  >
                    {item.eyebrow}
                  </span>
                </div>

                {/* Content */}
                <h3
                  className="
                    mt-5 max-w-[320px]
                    font-display
                    text-[26px] font-semibold
                    leading-[1.05]
                    tracking-[-0.04em]
                    text-white
                  "
                >
                  {item.title}
                </h3>

                <p
                  className="
                    mt-4 max-w-[330px]
                    text-[13px]
                    leading-6
                    text-white/52
                  "
                >
                  {item.description}
                </p>

                {/* tiny detail */}
                <div
                  className="
                    mt-auto flex items-center gap-2
                    pt-7
                    text-[11px]
                    font-medium
                    text-white/45

                    transition-colors
                    group-hover:text-white/70
                  "
                >
                  Süreci görüntüle
                  <ArrowRight
                    className="
                      size-3.5
                      transition-transform
                      group-hover:translate-x-1
                    "
                  />
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default TreatmentJourney