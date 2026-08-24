import LogoMark from './LogoMark.jsx'

function BrandLogo({ iconOnly = false, inverse = false }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`
          flex size-10 items-center justify-center
          rounded-xl border
          ${
            inverse
              ? 'border-white/10 bg-white/[0.07]'
              : 'border-[#E3E7F0] bg-[#F8FAFD]'
          }
        `}
      >
        <LogoMark
          className={
            inverse
              ? 'text-[#A7ABFF]'
              : 'text-[#5956F5]'
          }
        />
      </div>

      {!iconOnly && (
        <div className="leading-none">
          <div
            className="
              font-display text-lg
              font-semibold tracking-[-0.035em]
            "
          >
            <span
              className={
                inverse ? 'text-white' : 'text-[#111827]'
              }
            >
              DentFlow
            </span>

            <span className="ml-1 text-[#5956F5]">
              AI
            </span>
          </div>

          <div
            className={`
              mt-1.5
              text-[9px] font-medium
              uppercase tracking-[0.22em]
              ${inverse ? 'text-white/35' : 'text-[#8491A5]'}
            `}
          >
            Akıllı Klinik Yönetimi
          </div>
        </div>
      )}
    </div>
  )
}

export default BrandLogo