export const Button = ({ children, onClick }): JSX.Element => {
  return (
    <button
      onClick={onClick}
      className="hover-bg flex w-fit items-center justify-center gap-2 rounded-lg border border-border bg-transparent px-3.5 py-2 text-xs font-semibold text-primary-foreground"
    >
      {children}
    </button>
  )
}
