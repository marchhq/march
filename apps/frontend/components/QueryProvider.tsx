"use client"
import * as React from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

interface Props {
  children: React.ReactNode
}

const queryClient = new QueryClient()

const QueryProvider: React.FC<Props> = () => {
  return <QueryClientProvider client={queryClient}></QueryClientProvider>
}

export default QueryProvider
