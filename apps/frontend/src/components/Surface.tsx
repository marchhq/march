import { HTMLProps, forwardRef } from "react"

import { cn } from "../../lib/utils"

export type SurfaceProps = HTMLProps<HTMLDivElement> & {
  withShadow?: boolean
  withBorder?: boolean
}

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(
  (
    { children, className, withShadow = true, withBorder = true, ...props },
    ref
  ) => {
    const surfaceClass = cn(
      "rounded-xl",
      className,
      withShadow ? "shadow-sm" : "",
      withBorder ? "border border-border" : ""
    )

    return (
      <div className={surfaceClass} {...props} ref={ref}>
        {children}
      </div>
    )
  }
)

Surface.displayName = "Surface"
