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
      "bg-white rounded-xl dark:bg-neutral-900",
      className,
      withShadow ? "shadow-sm" : "",
      withBorder ? "border border-neutral-200 dark:border-neutral-800" : ""
    )

    return (
      <div className={surfaceClass} {...props} ref={ref}>
        {children}
      </div>
    )
  }
)

Surface.displayName = "Surface"
