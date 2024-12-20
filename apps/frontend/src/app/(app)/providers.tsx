"use client"

import { useState } from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import { AuthProvider } from "@/src/contexts/AuthContext"
import { WebSocketProvider } from "@/src/contexts/WebsocketProvider"

interface ProvidersProps {
  children: React.ReactNode
  initialData: {
    spaces: any[] | null
    session: string | null
  } | null
}

export function Providers({ children, initialData }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient())

  if (initialData?.spaces) {
    queryClient.setQueryData(
      ["spaces", initialData.session],
      initialData.spaces
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WebSocketProvider>{children}</WebSocketProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
