import Link from "next/link"

interface NavLinkProps {
  href: string
  label: string
  isActive?: boolean
}

export const NavLink = ({ href, label, isActive }: NavLinkProps) => {
  return (
    <Link
      href={href}
      className={`text-sm ${
        isActive ? "text-gray-900 font-medium" : "text-gray-600 hover:text-gray-900"
      }`}
    >
      {label}
    </Link>
  )
}
