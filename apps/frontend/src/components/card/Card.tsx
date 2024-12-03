import type { JSX } from "react";
export const Card = ({ children, onClick }): JSX.Element => {
  return (
    <button
      onClick={onClick}
      className="hover-bg flex items-center justify-center rounded-lg border border-border bg-transparent p-6 text-xs font-semibold text-primary-foreground"
      style={{
        width: "210px",
        height: "150px",
      }}
    >
      {children}
    </button>
  )
}
