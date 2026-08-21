import { Link } from 'react-router'

const variants = {
  primary:
    'bg-df-cyan text-df-bg hover:bg-df-cyan-soft',

  secondary:
    'border border-df-border bg-df-surface/60 text-df-text hover:bg-df-surface',

  ghost:
    'text-df-text-secondary hover:bg-df-surface hover:text-df-text',
}

const sizes = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
}

function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  className = '',
  ...props
}) {
  const styles = `
    inline-flex items-center justify-center gap-2
    rounded-df-md
    font-semibold
    transition-colors
    duration-200
    focus-visible:outline-none
    disabled:pointer-events-none
    disabled:opacity-50
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `

  if (to) {
    return (
      <Link to={to} className={styles} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button className={styles} {...props}>
      {children}
    </button>
  )
}

export default Button