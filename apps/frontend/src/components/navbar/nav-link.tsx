import Link from "next/link"

import classNames from "@/src/utils/classNames"

interface NavLinkProps {
  href: string
  label: string
  isActive: boolean
  className?: string
}

export const NavLink = ({ href, label, isActive, className }: NavLinkProps) => {
  const activeClass = isActive && "text-foreground"
  return (
    <Link
      className={classNames(`flex items-center justify-center`, activeClass)}
      href={href}
    >
      <p
        className={classNames(
          !isActive &&
            `text-secondary-foreground font-medium ${className} hover-text`
        )}
      >
        {label}
      </p>
    </Link>
  )
}
