function Container({
  children,
  className = '',
  as: Component = 'div',
}) {
  return (
    <Component
      className={`mx-auto w-full max-w-[1440px] px-5 sm:px-6 lg:px-8 xl:px-10 ${className}`}
    >
      {children}
    </Component>
  )
}

export default Container