import { SecondNavbar } from "@/src/components/navbar/second-navbar"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return <section className="flex-1 overflow-auto pt-5">{children}</section>
}
