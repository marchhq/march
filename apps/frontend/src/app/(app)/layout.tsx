import * as React from "react"

import Sidebar from "@/src/components/Sidebar"

import { AuthProvider } from "@/src/contexts/AuthContext"
import ModalProvider from "@/src/contexts/ModalProvider"
import QueryProvider from "@/src/contexts/QueryProvider"
import { Toaster } from "@/src/components/atoms/Toaster"
interface Props {
  children: React.ReactNode
}

const AppLayout: React.FC<Props> = ({ children }) => {
  return (
    <AuthProvider>
      <QueryProvider>
        <ModalProvider>
          <main className="flex h-screen bg-background">
            <Sidebar />
            <section className="flex-1">{children}</section>
            <Toaster />
          </main>
        </ModalProvider>
      </QueryProvider>
    </AuthProvider>
  )
}

export default AppLayout
