export const Card = ({ children, onClick }): JSX.Element => {
  return (
    <button
      onClick={onClick}
      className="hover-bg flex max-w-[250px] flex-col items-center justify-center rounded-lg border border-border bg-transparent p-6 text-xs font-semibold text-primary-foreground"
    >
      {children}
    </button>
  )
}
