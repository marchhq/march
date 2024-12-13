import Link from "next/link"

import classNames from "@/src/utils/classNames"

interface NavLinkProps {
  href: string
  label: string
  isActive: boolean
}

export const NavLink = ({ href, label, isActive }: NavLinkProps) => {
  const activeClass = isActive && "text-foreground"
  return (
    <Link
      className={classNames("flex items-center justify-center", activeClass)}
      href={href}
    >
      <p
        className={classNames(
          !isActive && "text-secondary-foreground hover-text"
        )}
      >
        {label}
      </p>
    </Link>
  )
}
