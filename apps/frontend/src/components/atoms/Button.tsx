import * as React from "react"

import { cva, type VariantProps } from "class-variance-authority"

import classNames from "@/src/utils/classNames"

const buttonVariants = cva(
  "leading-none transition-all focus:outline-none active:scale-95",
  {
    variants: {
      variant: {
        primary: "bg-zinc-300 text-zinc-800 hover:bg-zinc-400",
        secondary: "bg-zinc-900/50 text-zinc-300 hover:bg-zinc-900",
        invisible: "bg-transparent text-zinc-300 hover:bg-zinc-700",
        icon: "bg-transparent text-zinc-300 hover:bg-zinc-700",
      },
      size: {
        icon: "rounded-lg p-2.5 text-xs leading-none",
        sm: "rounded-lg px-4 py-2.5 text-xs leading-none",
        md: "rounded-xl px-5 py-3 text-sm leading-none",
        lg: "rounded-2xl px-8 py-4 text-base leading-none",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isBlock?: boolean
}

const Button: React.FC<Props> = ({
  children,
  className,
  variant,
  size,
  isBlock = false,
  ...props
}) => {
  return (
    <button
      {...props}
      className={classNames(
        buttonVariants({ variant, size }),
        isBlock ? "flex" : "",
        className
      )}
    >
      {children}
    </button>
  )
}

export default Button
