function LogoMark({ className = '' }) {
  return (
    <div
      className={`flex size-9 items-center justify-center rounded-df-md border border-df-border bg-df-surface ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 40 40"
        className="size-6"
        fill="none"
      >
        <path
          d="M12 8C14.5 5.5 17.5 5 20 7C22.5 5 25.5 5.5 28 8C31 11 30.5 16 28.5 20C26.5 24 25.5 31 23 33C21.6 34.2 20.8 29.5 20 26C19.2 29.5 18.4 34.2 17 33C14.5 31 13.5 24 11.5 20C9.5 16 9 11 12 8Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

export default LogoMark