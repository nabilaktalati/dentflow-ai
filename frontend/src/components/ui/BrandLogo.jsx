import LogoMark from './LogoMark.jsx'

function BrandLogo() {
  return (
    <div className="flex items-center gap-3">
      <LogoMark className="text-df-cyan" />

      <div className="leading-none">
        <div className="font-display text-lg font-semibold tracking-[-0.03em] text-df-text">
          DentFlow AI
        </div>

        <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-df-text-muted">
          Akıllı Klinik Yönetimi
        </div>
      </div>
    </div>
  )
}

export default BrandLogo