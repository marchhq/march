import { SecondNavbar } from "@/src/components/navbar/second-navbar"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <main className="flex h-screen flex-col">
      <SecondNavbar />
      <section className="flex-1 overflow-auto pt-5">{children}</section>
    </main>
  )
}
