export default function DashboardSectionPage({
  eyebrow,
  title,
  description,
}) {
  return (
    <section className="px-5 py-8 sm:px-7 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1440px]">
        <p className="text-xs font-bold tracking-[0.14em] text-[#5B52F2]">
          {eyebrow}
        </p>

        <h1 className="mt-3 text-[32px] font-semibold tracking-[-0.045em] text-[#101828] sm:text-[36px]">
          {title}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667085]">
          {description}
        </p>

        <div className="mt-8 rounded-[20px] border border-[#EAECF0] bg-white p-6 sm:p-8">
          <p className="text-sm font-semibold text-[#344054]">
            Modül altyapısı hazır.
          </p>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#98A2B3]">
            Bu alan ilgili DentFlow modülü geliştirildiğinde gerçek veriler ve işlemlerle doldurulacaktır.
          </p>
        </div>
      </div>
    </section>
  )
}