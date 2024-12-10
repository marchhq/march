"use client"

import { ReactNode } from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { fetchSpaces } from "../components/navbar/action"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    },
  },
})

export const prefetchSpaces = async (session: string) => {
  if (!session) return

  return queryClient.prefetchQuery({
    queryKey: ["spaces", session],
    queryFn: () => fetchSpaces(session),
  })
}

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
